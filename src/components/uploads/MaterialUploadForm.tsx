
import { useState } from 'react';
import { Upload, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MaterialUploadFormProps {
  userId: string;
  onUploadComplete: () => void;
}

const MaterialUploadForm = ({ userId, onUploadComplete }: MaterialUploadFormProps) => {
  const [formData, setFormData] = useState({
    material_type: '',
    quantity: '',
    delivery_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<string>('');
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setGpsCoords(coords);
          toast({
            title: "Location captured",
            description: "GPS coordinates recorded for verification.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get current location.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let photoUrl = null;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile);
      }

      const { error } = await supabase
        .from('material_uploads')
        .insert({
          supplier_id: userId,
          material_type: formData.material_type,
          quantity: parseFloat(formData.quantity),
          delivery_date: formData.delivery_date,
          description: formData.description,
          photo_url: photoUrl,
          gps_coordinates: gpsCoords,
        });

      if (error) throw error;

      toast({
        title: "Material uploaded successfully!",
        description: "Your material delivery has been recorded for verification.",
      });

      setFormData({
        material_type: '',
        quantity: '',
        delivery_date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setSelectedFile(null);
      setGpsCoords('');
      onUploadComplete();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your material record.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl flex items-center space-x-2">
          <Upload size={20} className="text-primary" />
          <span>Upload Material Delivery</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material_type">Material Type</Label>
              <Input
                id="material_type"
                value={formData.material_type}
                onChange={(e) => setFormData(prev => ({ ...prev, material_type: e.target.value }))}
                placeholder="e.g., Cement, Steel bars"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="delivery_date">Delivery Date</Label>
            <Input
              id="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about the delivery..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo Evidence</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              className="flex items-center space-x-1"
            >
              <MapPin size={16} />
              <span>Capture Location</span>
            </Button>
            {gpsCoords && (
              <span className="text-sm text-green-600">✓ Location captured</span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isUploading ? 'Uploading...' : 'Submit Material Delivery'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaterialUploadForm;
