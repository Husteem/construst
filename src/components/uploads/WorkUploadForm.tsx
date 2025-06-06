
import { useState } from 'react';
import { Upload, Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WorkUploadFormProps {
  userId: string;
  onUploadComplete: () => void;
}

const WorkUploadForm = ({ userId, onUploadComplete }: WorkUploadFormProps) => {
  const [formData, setFormData] = useState({
    hours_worked: '',
    work_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<string>('');
  const { toast } = useToast();

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem('current_user');
    console.log('💼 WORK UPLOAD - Raw current_user from localStorage:', currentUser);
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('💼 WORK UPLOAD - Parsed current user:', user);
      return user;
    }
    
    const fallbackUser = {
      id: userId,
      name: 'Development Worker',
      role: 'worker'
    };
    console.log('💼 WORK UPLOAD - Using fallback user:', fallbackUser);
    return fallbackUser;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const currentUser = getCurrentUser();
      console.log('💼 WORK UPLOAD - Starting database upload for user:', currentUser);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('💼 WORK UPLOAD - Supabase auth user:', user);

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload work progress.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Create work upload record for database
      const workUpload = {
        worker_id: user.id, // Use authenticated user's ID
        hours_worked: parseFloat(formData.hours_worked),
        work_date: formData.work_date,
        description: formData.description,
        photo_url: selectedFile ? `uploads/${selectedFile.name}` : undefined,
        gps_coordinates: gpsCoords,
        status: 'pending',
        user_name: currentUser.name,
        user_role: currentUser.role,
      };

      console.log('💼 WORK UPLOAD - Inserting work upload to database:', workUpload);

      // Insert into Supabase database
      const { data, error } = await supabase
        .from('work_uploads')
        .insert([workUpload])
        .select();

      if (error) {
        console.error('❌ WORK UPLOAD - Database error:', error);
        toast({
          title: "Upload failed",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('💼 WORK UPLOAD - Successfully saved to database:', data);

      toast({
        title: "Work progress uploaded!",
        description: "Your daily work has been recorded for verification.",
      });

      setFormData({
        hours_worked: '',
        work_date: new Date().toISOString().split('T')[0],
        description: '',
      });
      setSelectedFile(null);
      setGpsCoords('');
      onUploadComplete();
    } catch (error) {
      console.error('❌ WORK UPLOAD - Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your work record.",
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
          <span>Upload Daily Work Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours_worked">Hours Worked</Label>
              <Input
                id="hours_worked"
                type="number"
                step="0.5"
                value={formData.hours_worked}
                onChange={(e) => setFormData(prev => ({ ...prev, hours_worked: e.target.value }))}
                placeholder="8"
                required
              />
            </div>
            <div>
              <Label htmlFor="work_date">Work Date</Label>
              <Input
                id="work_date"
                type="date"
                value={formData.work_date}
                onChange={(e) => setFormData(prev => ({ ...prev, work_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the work performed today..."
              rows={3}
              required
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
            {isUploading ? 'Uploading...' : 'Submit Work Progress'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkUploadForm;
