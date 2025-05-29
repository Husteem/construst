
import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  budget: number;
  workersAssigned: number;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Lagos Commercial Complex',
      description: 'Construction of a 20-story commercial building in Lagos Island',
      location: 'Lagos Island, Lagos',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'active',
      budget: 50000000,
      workersAssigned: 25
    },
    {
      id: '2',
      name: 'Abuja Residential Estate',
      description: 'Development of 50 residential units in Abuja',
      location: 'Gwarinpa, Abuja',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'active',
      budget: 35000000,
      workersAssigned: 18
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: ''
  });

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.location || !newProject.startDate) {
      toast({
        title: "Please fill required fields",
        description: "Name, location, and start date are required.",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      location: newProject.location,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      status: 'planned',
      budget: parseFloat(newProject.budget) || 0,
      workersAssigned: 0
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Project created successfully!",
      description: "Your new project has been added.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">
            Project Management
          </h2>
          <p className="text-gray-600">Create and manage construction projects</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus size={16} className="mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <Label htmlFor="project-location">Location *</Label>
                <Input
                  id="project-location"
                  value={newProject.location}
                  onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter project location"
                />
              </div>
              
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="budget">Budget (₦)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="Enter project budget"
                />
              </div>
              
              <Button onClick={handleCreateProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-playfair text-lg">
                  {project.name}
                </CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{project.description}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{project.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} - 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users size={14} />
                  <span>{project.workersAssigned} workers assigned</span>
                </div>
                
                {project.budget > 0 && (
                  <div className="text-sm font-medium">
                    Budget: ₦{project.budget.toLocaleString()}
                  </div>
                )}
                
                <div className="flex space-x-2 pt-3">
                  <Button size="sm" variant="outline">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagement;
