
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Use database table types directly
type WorkUploadDB = {
  id: string;
  worker_id: string;
  hours_worked: number;
  work_date: string;
  description: string;
  photo_url: string | null;
  gps_coordinates: string | null;
  status: string;
  created_at: string;
  user_name: string | null;
  user_role: string | null;
};

type MaterialUploadDB = {
  id: string;
  supplier_id: string;
  material_type: string;
  quantity: number;
  delivery_date: string;
  description: string | null;
  photo_url: string | null;
  gps_coordinates: string | null;
  status: string;
  created_at: string;
  user_name: string | null;
  user_role: string | null;
};

type UserAssignment = {
  id: string;
  admin_id: string;
  user_id: string;
  project_name: string | null;
  assigned_at: string;
};

const VerificationDashboard = () => {
  const [workUploads, setWorkUploads] = useState<WorkUploadDB[]>([]);
  const [materialUploads, setMaterialUploads] = useState<MaterialUploadDB[]>([]);
  const [teamAssignments, setTeamAssignments] = useState<UserAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUploads();
  }, []);

  const getCurrentManagerId = () => {
    const currentUser = localStorage.getItem('current_user');
    console.log('✅ VERIFICATION - Raw current_user from localStorage:', currentUser);
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('✅ VERIFICATION - Parsed current user:', user);
      console.log('✅ VERIFICATION - Manager ID:', user.id);
      return user.id;
    }
    console.log('✅ VERIFICATION - No current user found, using default manager ID');
    return 'manager-default';
  };

  const fetchTeamAssignments = async (managerId: string) => {
    try {
      console.log('✅ VERIFICATION - Fetching team assignments from database for manager:', managerId);
      
      const { data: assignments, error } = await supabase
        .from('user_assignments')
        .select('*')
        .eq('admin_id', managerId);

      if (error) {
        console.error('❌ VERIFICATION - Error fetching team assignments:', error);
        return [];
      }

      console.log('✅ VERIFICATION - Team assignments found in database:', assignments);
      setTeamAssignments(assignments || []);
      return assignments || [];
    } catch (error) {
      console.error('❌ VERIFICATION - Error fetching team assignments:', error);
      return [];
    }
  };

  const fetchUploads = async () => {
    try {
      console.log('✅ VERIFICATION - Starting to fetch uploads from database');

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('✅ VERIFICATION - Supabase auth user:', user);

      if (!user) {
        console.log('✅ VERIFICATION - No authenticated user found');
        setIsLoading(false);
        return;
      }

      const managerId = getCurrentManagerId();
      
      // Fetch team assignments from database
      const teamAssignments = await fetchTeamAssignments(managerId);
      const teamMemberIds = teamAssignments.map((assignment: UserAssignment) => assignment.user_id);
      console.log('✅ VERIFICATION - Team member IDs to filter by:', teamMemberIds);

      // Fetch work uploads from database
      console.log('✅ VERIFICATION - Fetching work uploads from database...');
      const { data: workData, error: workError } = await supabase
        .from('work_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (workError) {
        console.error('❌ VERIFICATION - Work uploads fetch error:', workError);
      } else {
        console.log('✅ VERIFICATION - All work uploads from database:', workData);
        
        // Filter work uploads for this manager's team
        const filteredWorkData = workData?.filter((upload: WorkUploadDB) => {
          const isMatch = teamMemberIds.includes(upload.worker_id);
          console.log(`✅ VERIFICATION - Work upload ${upload.id}: worker_id=${upload.worker_id}, isMatch=${isMatch}`);
          return isMatch;
        }) || [];
        
        console.log('✅ VERIFICATION - Filtered work uploads for this manager:', filteredWorkData);
        setWorkUploads(filteredWorkData);
      }

      // Fetch material uploads from database
      console.log('✅ VERIFICATION - Fetching material uploads from database...');
      const { data: materialData, error: materialError } = await supabase
        .from('material_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (materialError) {
        console.error('❌ VERIFICATION - Material uploads fetch error:', materialError);
      } else {
        console.log('✅ VERIFICATION - All material uploads from database:', materialData);
        
        // Filter material uploads for this manager's team
        const filteredMaterialData = materialData?.filter((upload: MaterialUploadDB) => {
          const isMatch = teamMemberIds.includes(upload.supplier_id);
          console.log(`✅ VERIFICATION - Material upload ${upload.id}: supplier_id=${upload.supplier_id}, isMatch=${isMatch}`);
          return isMatch;
        }) || [];
        
        console.log('✅ VERIFICATION - Filtered material uploads for this manager:', filteredMaterialData);
        setMaterialUploads(filteredMaterialData);
      }

      console.log('✅ VERIFICATION - Final state - Work uploads:', workUploads.length, 'Material uploads:', materialUploads.length);
    } catch (error) {
      console.error('❌ VERIFICATION - Error fetching uploads from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (type: 'work' | 'material', id: string, status: 'verified' | 'rejected') => {
    try {
      console.log(`✅ VERIFICATION - Updating ${type} upload ${id} status to ${status}`);

      const table = type === 'work' ? 'work_uploads' : 'material_uploads';
      
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error(`❌ VERIFICATION - Error updating ${type} upload status:`, error);
        toast({
          title: "Error updating status",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ VERIFICATION - Successfully updated ${type} upload ${id} status to ${status}`);

      // Refresh the uploads after updating
      await fetchUploads();

      toast({
        title: `Upload ${status}`,
        description: `The upload has been ${status}.`,
      });
    } catch (error: any) {
      console.error(`❌ VERIFICATION - Error updating ${type} upload status:`, error);
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

  const WorkUploadCard = ({ upload }: { upload: WorkUploadDB }) => (
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

  const MaterialUploadCard = ({ upload }: { upload: MaterialUploadDB }) => (
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
          Verification Dashboard
        </h2>
        <p className="text-gray-600">Review and approve work progress and material deliveries from your team</p>
        {teamAssignments.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No team members found in database. Create invitations and have team members accept them to see their uploads here.
            </p>
          </div>
        )}
        {teamAssignments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Team members assigned: {teamAssignments.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Debug: Manager ID: {getCurrentManagerId()}, Team member IDs: {teamAssignments.map((assignment) => assignment.user_id).join(', ')}
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
                  Work uploads from your assigned team members will appear here
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
                  Material deliveries from your assigned team members will appear here
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
