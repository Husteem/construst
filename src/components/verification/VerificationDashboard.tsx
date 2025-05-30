import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Upload {
  id: string;
  created_at: string;
  status: 'pending' | 'verified' | 'rejected';
  photo_url?: string;
  description: string;
  gps_coordinates?: string;
  user_name?: string;
  user_role?: string;
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

const USER_ASSIGNMENTS_KEY = 'contrust_dev_user_assignments';
const WORK_UPLOADS_KEY = 'contrust_dev_work_uploads';
const MATERIAL_UPLOADS_KEY = 'contrust_dev_material_uploads';

const VerificationDashboard = () => {
  const [workUploads, setWorkUploads] = useState<WorkUpload[]>([]);
  const [materialUploads, setMaterialUploads] = useState<MaterialUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploads();
  }, []);

  const getCurrentManagerId = () => {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
    return 'manager-default';
  };

  const getTeamMembers = () => {
    const managerId = getCurrentManagerId();
    const assignments = localStorage.getItem(USER_ASSIGNMENTS_KEY);
    if (!assignments) return [];
    
    const allAssignments = JSON.parse(assignments);
    return allAssignments.filter((assignment: any) => assignment.admin_id === managerId);
  };

  const fetchUploads = async () => {
    try {
      const teamMembers = getTeamMembers();
      const teamMemberIds = teamMembers.map((member: any) => member.user_id);

      // Get work uploads from team members
      const storedWorkUploads = localStorage.getItem(WORK_UPLOADS_KEY);
      let workData: WorkUpload[] = [];
      
      if (storedWorkUploads) {
        const allWorkUploads = JSON.parse(storedWorkUploads);
        workData = allWorkUploads.filter((upload: WorkUpload) => 
          teamMemberIds.includes(upload.worker_id)
        );
      } else {
        // Create sample data if team members exist
        if (teamMembers.length > 0) {
          workData = teamMembers
            .filter((member: any) => member.role === 'worker')
            .map((worker: any, index: number) => ({
              id: `work-${index + 1}`,
              worker_id: worker.user_id,
              work_date: new Date().toISOString().split('T')[0],
              hours_worked: 8,
              description: `Daily construction work completed by ${worker.name}`,
              status: 'pending' as const,
              created_at: new Date().toISOString(),
              gps_coordinates: '6.5244,3.3792',
              user_name: worker.name,
              user_role: worker.role,
            }));
          localStorage.setItem(WORK_UPLOADS_KEY, JSON.stringify(workData));
        }
      }

      // Get material uploads from team members
      const storedMaterialUploads = localStorage.getItem(MATERIAL_UPLOADS_KEY);
      let materialData: MaterialUpload[] = [];
      
      if (storedMaterialUploads) {
        const allMaterialUploads = JSON.parse(storedMaterialUploads);
        materialData = allMaterialUploads.filter((upload: MaterialUpload) => 
          teamMemberIds.includes(upload.supplier_id)
        );
      } else {
        // Create sample data if team members exist
        if (teamMembers.length > 0) {
          materialData = teamMembers
            .filter((member: any) => member.role === 'supplier')
            .map((supplier: any, index: number) => ({
              id: `material-${index + 1}`,
              supplier_id: supplier.user_id,
              material_type: 'Cement bags',
              quantity: 50,
              delivery_date: new Date().toISOString().split('T')[0],
              description: `Material delivery by ${supplier.name}`,
              status: 'pending' as const,
              created_at: new Date().toISOString(),
              gps_coordinates: '6.5244,3.3792',
              user_name: supplier.name,
              user_role: supplier.role,
            }));
          localStorage.setItem(MATERIAL_UPLOADS_KEY, JSON.stringify(materialData));
        }
      }

      setWorkUploads(workData);
      setMaterialUploads(materialData);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (type: 'work' | 'material', id: string, status: 'verified' | 'rejected') => {
    try {
      const storageKey = type === 'work' ? WORK_UPLOADS_KEY : MATERIAL_UPLOADS_KEY;
      const currentData = localStorage.getItem(storageKey);
      
      if (!currentData) return;

      const uploads = JSON.parse(currentData);
      const updatedUploads = uploads.map((upload: any) => 
        upload.id === id ? { ...upload, status } : upload
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedUploads));

      if (type === 'work') {
        setWorkUploads(updatedUploads.filter((upload: WorkUpload) => 
          getTeamMembers().map((member: any) => member.user_id).includes(upload.worker_id)
        ));
      } else {
        setMaterialUploads(updatedUploads.filter((upload: MaterialUpload) => 
          getTeamMembers().map((member: any) => member.user_id).includes(upload.supplier_id)
        ));
      }

      toast({
        title: `Upload ${status}`,
        description: `The upload has been ${status}.`,
      });
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
            <p className="text-sm text-gray-600">Worker: {upload.user_name}</p>
            <p className="text-xs text-gray-500">ID: {upload.worker_id}</p>
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
            <p className="text-sm text-gray-600">Supplier: {upload.user_name}</p>
            <p className="text-xs text-gray-500">ID: {upload.supplier_id}</p>
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

  const teamMembers = getTeamMembers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Verification Dashboard
        </h2>
        <p className="text-gray-600">Review and approve work progress and material deliveries from your team</p>
        {teamMembers.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No team members found. Create invitations to add workers and suppliers to see their uploads here.
            </p>
          </div>
        )}
        {teamMembers.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Team members: {teamMembers.map((member: any) => member.name).join(', ')}
            </p>
          </div>
        )}
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
                <p className="text-gray-500">No work uploads from your team</p>
                <p className="text-sm text-gray-400 mt-2">
                  Work uploads from your invited workers will appear here
                </p>
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
                <p className="text-gray-500">No material uploads from your team</p>
                <p className="text-sm text-gray-400 mt-2">
                  Material deliveries from your invited suppliers will appear here
                </p>
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
