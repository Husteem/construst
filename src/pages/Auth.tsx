
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

interface AuthProps {
  isLogin?: boolean;
}

interface InvitationData {
  id: string;
  invitation_code: string;
  role: UserRole;
  email?: string;
  project_name?: string;
  admin_id: string;
}

const Auth = ({ isLogin = false }: AuthProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: '' as UserRole,
    invitation_code: '',
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const invitationCode = searchParams.get('invitation');
    if (invitationCode && !isLogin) {
      setFormData(prev => ({ ...prev, invitation_code: invitationCode }));
      validateInvitation(invitationCode);
    }
  }, [searchParams, isLogin]);

  const validateInvitation = async (code: string) => {
    try {
      // Mock invitation validation for now
      const mockInvitations = [
        {
          id: '1',
          invitation_code: 'INV-ABC123',
          role: 'worker' as UserRole,
          email: 'worker@example.com',
          project_name: 'Building Construction Phase 1',
          admin_id: 'admin1',
        },
        {
          id: '2',
          invitation_code: 'INV-DEF456',
          role: 'supplier' as UserRole,
          email: 'supplier@example.com',
          project_name: 'Road Infrastructure',
          admin_id: 'admin1',
        }
      ];

      const invitation = mockInvitations.find(inv => inv.invitation_code === code);
      
      if (!invitation) {
        toast({
          title: "Invalid Invitation",
          description: "This invitation code is invalid or has expired.",
          variant: "destructive",
        });
        return;
      }

      setInvitationData(invitation);
      setFormData(prev => ({
        ...prev,
        role: invitation.role,
        email: invitation.email || prev.email,
      }));

      toast({
        title: "Invitation Found",
        description: `You're invited to join as a ${invitation.role}${invitation.project_name ? ` for ${invitation.project_name}` : ''}`,
      });
    } catch (error: any) {
      console.error('Invitation validation error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const mockUser = {
          id: '1',
          email: formData.email,
          name: 'Test User',
          role: 'manager' as UserRole,
          created_at: new Date().toISOString(),
        };

        localStorage.setItem('contrust_user', JSON.stringify(mockUser));

        toast({
          title: "Welcome back!",
          description: "You have been logged in to ConTrust.",
        });

        navigate('/dashboard');
      } else {
        // Handle registration
        if (formData.invitation_code && invitationData) {
          // Registration with invitation
          const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: formData.email,
            name: formData.name,
            role: invitationData.role,
            created_at: new Date().toISOString(),
          };

          // Mock marking invitation as used and creating user assignment
          console.log('Mock: Marking invitation as used and creating user assignment');

          localStorage.setItem('contrust_user', JSON.stringify(mockUser));

          toast({
            title: "Registration Successful!",
            description: `Welcome to ConTrust! You've joined as a ${mockUser.role}.`,
          });
        } else {
          // Regular registration (admin)
          const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: formData.email,
            name: formData.name,
            role: formData.role || 'manager',
            created_at: new Date().toISOString(),
          };

          localStorage.setItem('contrust_user', JSON.stringify(mockUser));

          toast({
            title: "Account created successfully!",
            description: "Your ConTrust account has been created.",
          });
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-playfair text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="font-roboto text-gray-600 mt-2">
            {isLogin 
              ? 'Sign in to your ConTrust account' 
              : invitationData 
                ? `Join as ${invitationData.role}${invitationData.project_name ? ` for ${invitationData.project_name}` : ''}`
                : 'Join ConTrust for secure construction payments'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-roboto font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-roboto font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!!invitationData?.email}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-roboto font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && !invitationData && (
              <div className="space-y-2">
                <Label htmlFor="role" className="font-roboto font-medium">
                  Role
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select onValueChange={(value) => handleInputChange('role', value)} required>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Construction Worker</SelectItem>
                      <SelectItem value="supplier">Material Supplier</SelectItem>
                      <SelectItem value="manager">Project Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {!isLogin && formData.invitation_code && (
              <div className="space-y-2">
                <Label className="font-roboto font-medium">Invitation Code</Label>
                <Input
                  value={formData.invitation_code}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-roboto text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link
                to={isLogin ? '/signup' : '/login'}
                className="text-primary hover:text-primary/80 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
