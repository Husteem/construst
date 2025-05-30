
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';

const INVITATIONS_STORAGE_KEY = 'contrust_dev_invitations';
const USER_ASSIGNMENTS_KEY = 'contrust_dev_user_assignments';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitationCode, setInvitationCode] = useState(searchParams.get('invitation') || '');
  const [validInvitation, setValidInvitation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '' as UserRole,
  });

  useEffect(() => {
    if (invitationCode) {
      validateInvitationCode(invitationCode);
    }
  }, [invitationCode]);

  const validateInvitationCode = (code: string) => {
    try {
      const storedInvitations = localStorage.getItem(INVITATIONS_STORAGE_KEY);
      if (!storedInvitations) {
        setValidInvitation(null);
        return;
      }

      const invitations = JSON.parse(storedInvitations);
      const invitation = invitations.find((inv: any) => 
        inv.invitation_code === code && 
        inv.status === 'pending' && 
        new Date(inv.expires_at) > new Date()
      );

      if (invitation) {
        setValidInvitation(invitation);
        setFormData(prev => ({ 
          ...prev, 
          role: invitation.role,
          email: invitation.email || prev.email 
        }));
      } else {
        setValidInvitation(null);
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      setValidInvitation(null);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate invitation if provided
      if (invitationCode && !validInvitation) {
        toast({
          title: "Invalid invitation",
          description: "The invitation code is invalid or has expired.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create user record
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        created_at: new Date().toISOString(),
        manager_id: validInvitation?.admin_id || null,
      };

      // Store user role for role switching
      localStorage.setItem('dev_user_role', formData.role);
      localStorage.setItem('current_user', JSON.stringify(newUser));

      // If user signed up with invitation, mark it as used and create assignment
      if (validInvitation) {
        // Mark invitation as used
        const storedInvitations = localStorage.getItem(INVITATIONS_STORAGE_KEY);
        if (storedInvitations) {
          const invitations = JSON.parse(storedInvitations);
          const updatedInvitations = invitations.map((inv: any) => 
            inv.invitation_code === invitationCode 
              ? { ...inv, status: 'used', used_at: new Date().toISOString(), used_by: userId }
              : inv
          );
          localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updatedInvitations));
        }

        // Create user assignment linking to manager
        const existingAssignments = localStorage.getItem(USER_ASSIGNMENTS_KEY);
        const assignments = existingAssignments ? JSON.parse(existingAssignments) : [];
        
        const newAssignment = {
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          admin_id: validInvitation.admin_id,
          project_name: validInvitation.project_name,
          assigned_at: new Date().toISOString(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: 'active',
        };

        assignments.push(newAssignment);
        localStorage.setItem(USER_ASSIGNMENTS_KEY, JSON.stringify(assignments));
      }

      toast({
        title: "Account created successfully!",
        description: validInvitation 
          ? `Welcome to the team! You've been linked to ${validInvitation.manager_name || 'your manager'}.`
          : "Welcome to ConTrust! You can now access the platform.",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login for development
      const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
      const mockUser = {
        id: userId,
        name: 'Development User',
        email: formData.email,
        role: formData.role || 'manager',
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('dev_user_role', mockUser.role);
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      toast({
        title: "Logged in successfully!",
        description: "Welcome back to ConTrust.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-bold text-gray-900">ConTrust</h1>
          <p className="font-roboto text-gray-600 mt-2">
            {invitationCode ? 'Complete your invitation signup' : 'Sign in to your account'}
          </p>
        </div>

        {invitationCode && validInvitation && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>You've been invited as a <strong>{validInvitation.role}</strong></span>
                <Badge variant="default" className="bg-green-500">Valid</Badge>
              </div>
              {validInvitation.project_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Project: {validInvitation.project_name}
                </p>
              )}
              {validInvitation.manager_name && (
                <p className="text-sm text-gray-600">
                  Invited by: {validInvitation.manager_name}
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {invitationCode && !validInvitation && (
          <Alert variant="destructive">
            <AlertDescription>
              Invalid or expired invitation code. Please check with your project manager.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{invitationCode ? 'Complete Signup' : 'Sign In'}</CardTitle>
          </CardHeader>
          <CardContent>
            {invitationCode ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="invitation">Invitation Code</Label>
                  <Input
                    id="invitation"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Enter invitation code"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a secure password"
                    required
                  />
                </div>

                {validInvitation && (
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1">
                      <Badge variant="default" className="bg-blue-500 capitalize">
                        {validInvitation.role}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Role assigned by invitation
                      </p>
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={isLoading || !validInvitation} className="w-full">
                  {isLoading ? 'Creating Account...' : 'Complete Signup'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Your password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role (Development)</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Project Manager</SelectItem>
                      <SelectItem value="worker">Construction Worker</SelectItem>
                      <SelectItem value="supplier">Material Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {invitationCode ? (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/auth')}
                      className="text-primary hover:underline"
                    >
                      Sign in here
                    </button>
                  </>
                ) : (
                  'Development mode - Use any email/password combination'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
