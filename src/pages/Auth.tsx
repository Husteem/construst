
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  isLogin: boolean;
}

const INVITATIONS_KEY = 'contrust_dev_invitations';
const USER_ASSIGNMENTS_KEY = 'contrust_dev_user_assignments';

const Auth = ({ isLogin }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For development, create a mock user
        const mockUser = {
          id: 'manager-' + Math.random().toString(36).substr(2, 9),
          name: 'Development Manager',
          email: email,
          role: 'manager',
          created_at: new Date().toISOString(),
        };

        localStorage.setItem('current_user', JSON.stringify(mockUser));
        localStorage.setItem('dev_user_role', 'manager');

        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });

        navigate('/dashboard');
      } else {
        // Handle signup with invitation
        if (!invitationCode) {
          toast({
            title: "Invitation code required",
            description: "Please enter your invitation code to sign up.",
            variant: "destructive",
          });
          return;
        }

        // Get invitations from localStorage
        const storedInvitations = localStorage.getItem(INVITATIONS_KEY);
        if (!storedInvitations) {
          toast({
            title: "Invalid invitation code",
            description: "The invitation code you entered is not valid.",
            variant: "destructive",
          });
          return;
        }

        const invitations = JSON.parse(storedInvitations);
        const invitation = invitations.find((inv: any) => 
          inv.invitation_code === invitationCode && inv.status === 'pending'
        );

        if (!invitation) {
          toast({
            title: "Invalid or used invitation code",
            description: "The invitation code you entered is not valid or has already been used.",
            variant: "destructive",
          });
          return;
        }

        // Check if invitation is expired
        if (new Date() > new Date(invitation.expires_at)) {
          toast({
            title: "Invitation expired",
            description: "This invitation code has expired.",
            variant: "destructive",
          });
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create consistent user ID
        const userId = `user-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create new user
        const newUser = {
          id: userId,
          name: name,
          email: email,
          role: invitation.role,
          created_at: new Date().toISOString(),
        };

        // Update invitation status
        const updatedInvitations = invitations.map((inv: any) =>
          inv.id === invitation.id
            ? { ...inv, status: 'used', used_by: userId, used_at: new Date().toISOString() }
            : inv
        );
        localStorage.setItem(INVITATIONS_KEY, JSON.stringify(updatedInvitations));

        // Create user assignment
        const assignment = {
          id: `assignment-${Math.random().toString(36).substr(2, 9)}`,
          user_id: userId,
          admin_id: invitation.admin_id,
          project_name: invitation.project_name,
          assigned_at: new Date().toISOString(),
          name: name,
          email: email,
          role: invitation.role,
          status: 'active'
        };

        // Store assignment
        const existingAssignments = localStorage.getItem(USER_ASSIGNMENTS_KEY);
        const assignments = existingAssignments ? JSON.parse(existingAssignments) : [];
        assignments.push(assignment);
        localStorage.setItem(USER_ASSIGNMENTS_KEY, JSON.stringify(assignments));

        // Set current user
        localStorage.setItem('current_user', JSON.stringify(newUser));
        localStorage.setItem('dev_user_role', invitation.role);

        console.log('Created user:', newUser);
        console.log('Created assignment:', assignment);

        toast({
          title: "Account created successfully",
          description: `Welcome ${name}! You've been assigned as a ${invitation.role}.`,
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication failed",
        description: "There was an error during authentication.",
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
          <CardTitle className="font-playfair text-2xl text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
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
                <div>
                  <Label htmlFor="invitationCode">Invitation Code</Label>
                  <Input
                    id="invitationCode"
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Enter your invitation code"
                    required
                  />
                </div>
              </>
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
