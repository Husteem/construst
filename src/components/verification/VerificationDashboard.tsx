
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Upload {
  id: string;
  created_at: string;
  status: 'pending' | 'verified' | 'rejected';
  photo_url?: string;
  description: string;
  gps_coordinates?: string;
}

interface WorkUpload extends Upload {
  worker_id: string;
  work_date: string;
  hours_worked: number;
}

interface MaterialUpload extends Upload {
  supplier_id: string;
  material_type: string;
  quantity: number;
  delivery_date: string;
}

const VerificationDashboard = () => {
  const [workUploads, setWorkUploads] = useState<WorkUpload[]>([]);
  const [materialUploads, setMaterialUploads] = useState<MaterialUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const [workData, materialData] = await Promise.all([
        (supabase as any).from('work_uploads').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('material_uploads').select('*').order('created_at', { ascending: false })
      ]);

      if (workData.data) setWorkUploads(workData.data);
      if (materialData.data) setMaterialUploads(materialData.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (type: 'work' | 'material', id: string, status: 'verified' | 'rejected') => {
    try {
      const table = type === 'work' ? 'work_uploads' : 'material_uploads';
      const { error } = await (supabase as any)
        .from(table)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Upload ${status}`,
        description: `The upload has been ${status}.`,
      });

      fetchUploads();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={12} className="mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const WorkUploadCard = ({ upload }: { upload: WorkUpload }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">Work Progress - {new Date(upload.work_date).toLocaleDateString()}</h3>
            <p className="text-sm text-gray-600">Hours: {upload.hours_worked}</p>
            <p className="text-sm text-gray-600">Worker ID: {upload.worker_id}</p>
          </div>
          {getStatusBadge(upload.status)}
        </div>
        
        <p className="text-sm mb-3">{upload.description}</p>
        
        {upload.photo_url && (
          <div className="mb-3">
            <img src={upload.photo_url} alt="Work progress" className="w-full h-32 object-cover rounded" />
          </div>
        )}
        
        {upload.gps_coordinates && (
          <p className="text-xs text-gray-500 mb-3">Location: {upload.gps_coordinates}</p>
        )}
        
        {upload.status === 'pending' && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => updateStatus('work', upload.id, 'verified')}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle size={16} className="mr-1" />Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateStatus('work', upload.id, 'rejected')}
            >
              <XCircle size={16} className="mr-1" />Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const MaterialUploadCard = ({ upload }: { upload: MaterialUpload }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{upload.material_type}</h3>
            <p className="text-sm text-gray-600">Quantity: {upload.quantity}</p>
            <p className="text-sm text-gray-600">Delivery: {new Date(upload.delivery_date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Supplier ID: {upload.supplier_id}</p>
          </div>
          {getStatusBadge(upload.status)}
        </div>
        
        {upload.description && <p className="text-sm mb-3">{upload.description}</p>}
        
        {upload.photo_url && (
          <div className="mb-3">
            <img src={upload.photo_url} alt="Material delivery" className="w-full h-32 object-cover rounded" />
          </div>
        )}
        
        {upload.gps_coordinates && (
          <p className="text-xs text-gray-500 mb-3">Location: {upload.gps_coordinates}</p>
        )}
        
        {upload.status === 'pending' && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => updateStatus('material', upload.id, 'verified')}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle size={16} className="mr-1" />Approve
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateStatus('material', upload.id, 'rejected')}
            >
              <XCircle size={16} className="mr-1" />Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Verification Dashboard
        </h2>
        <p className="text-gray-600">Review and approve work progress and material deliveries</p>
      </div>

      <Tabs defaultValue="work" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="work">
            Work Progress ({workUploads.filter(u => u.status === 'pending').length} pending)
          </TabsTrigger>
          <TabsTrigger value="materials">
            Material Deliveries ({materialUploads.filter(u => u.status === 'pending').length} pending)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="work" className="mt-6">
          {workUploads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No work uploads found</p>
              </CardContent>
            </Card>
          ) : (
            workUploads.map(upload => (
              <WorkUploadCard key={upload.id} upload={upload} />
            ))
          )}
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          {materialUploads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No material uploads found</p>
              </CardContent>
            </Card>
          ) : (
            materialUploads.map(upload => (
              <MaterialUploadCard key={upload.id} upload={upload} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationDashboard;
