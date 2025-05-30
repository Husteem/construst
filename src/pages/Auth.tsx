
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  isLogin: boolean;
}

const Auth = ({ isLogin }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Pre-fill invitation code from URL if present
    const inviteParam = searchParams.get('invitation');
    if (inviteParam) {
      setInvitationCode(inviteParam);
    }

    // Set mock invitations for development purposes
    const mockInvitations = [
      {
        id: 'inv-1',
        admin_id: 'manager-default',
        email: 'worker1@example.com',
        role: 'worker',
        invitation_code: 'WORKER123',
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        project_name: 'Construction Project Alpha'
      },
      {
        id: 'inv-2',
        admin_id: 'manager-default',
        email: 'supplier1@example.com',
        role: 'supplier',
        invitation_code: 'SUPPLIER456',
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        project_name: 'Construction Project Alpha'
      },
    ];

    // Initialize invitations in local storage if not present
    if (!localStorage.getItem('contrust_dev_invitations')) {
      localStorage.setItem('contrust_dev_invitations', JSON.stringify(mockInvitations));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Mock login logic
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          name: email.split('@')[0],
          role: 'manager',
          created_at: new Date().toISOString()
        };

        localStorage.setItem('current_user', JSON.stringify(mockUser));
        localStorage.setItem('dev_user_role', 'manager');

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        navigate('/dashboard');
      } else {
        // Handle signup with invitation code
        if (invitationCode) {
          const invitationsData = localStorage.getItem('contrust_dev_invitations');
          if (invitationsData) {
            const invitations = JSON.parse(invitationsData);
            const invitationIndex = invitations.findIndex((inv: any) => 
              inv.invitation_code === invitationCode && inv.status === 'pending'
            );

            if (invitationIndex !== -1) {
              const invitation = invitations[invitationIndex];
              
              // Create user with role from invitation
              const newUser = {
                id: 'user-' + Date.now(),
                email,
                name,
                role: invitation.role,
                created_at: new Date().toISOString()
              };

              // Mark invitation as used and update the array
              invitations[invitationIndex] = {
                ...invitation,
                status: 'used',
                used_by: newUser.id,
                used_at: new Date().toISOString()
              };
              localStorage.setItem('contrust_dev_invitations', JSON.stringify(invitations));

              // Create user assignment
              const assignmentsData = localStorage.getItem('contrust_dev_user_assignments') || '[]';
              const assignments = JSON.parse(assignmentsData);
              
              const newAssignment = {
                id: 'assignment-' + Date.now(),
                admin_id: invitation.admin_id,
                user_id: newUser.id,
                assigned_at: new Date().toISOString(),
                project_name: invitation.project_name,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: 'active'
              };

              assignments.push(newAssignment);
              localStorage.setItem('contrust_dev_user_assignments', JSON.stringify(assignments));

              localStorage.setItem('current_user', JSON.stringify(newUser));
              localStorage.setItem('dev_user_role', newUser.role);

              console.log('User created:', newUser);
              console.log('Assignment created:', newAssignment);
              console.log('Invitation updated:', invitations[invitationIndex]);

              toast({
                title: "Account created successfully",
                description: `Welcome ${name}! You've joined as a ${invitation.role}.`,
              });

              navigate('/dashboard');
            } else {
              toast({
                title: "Invalid invitation code",
                description: "Please check your invitation code and try again.",
                variant: "destructive",
              });
            }
          }
        } else {
          // Regular signup without invitation (creates manager)
          const newUser = {
            id: 'manager-' + Date.now(),
            email,
            name,
            role: 'manager',
            created_at: new Date().toISOString()
          };

          localStorage.setItem('current_user', JSON.stringify(newUser));
          localStorage.setItem('dev_user_role', 'manager');

          toast({
            title: "Account created successfully",
            description: `Welcome ${name}!`,
          });

          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-playfair text-2xl">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="invitationCode">Invitation Code (Optional)</Label>
                <Input
                  id="invitationCode"
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  placeholder="Enter invitation code if you have one"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to create a manager account
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
