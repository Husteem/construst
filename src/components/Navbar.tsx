
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('current_user');
    localStorage.removeItem('dev_user_role');
    setCurrentUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    
    navigate('/');
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 font-playfair font-bold text-xl hover:text-accent transition-colors"
          >
            <img 
              src="/contrust-logo.png.png" 
              alt="ConTrust Logo" 
              className="h-16 w-auto p-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-accent transition-colors font-roboto text-white"
            >
              Home
            </Link>
            {currentUser && (
              <>
                <Link 
                  to="/dashboard" 
                  className="hover:text-accent transition-colors font-roboto text-white"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/projects" 
                  className="hover:text-accent transition-colors font-roboto text-white"
                >
                  Projects
                </Link>
                <Link 
                  to="/uploads" 
                  className="hover:text-accent transition-colors font-roboto text-white"
                >
                  Uploads
                </Link>
              </>
            )}
            <Link 
              to="/docs" 
              className="hover:text-accent transition-colors font-roboto text-white"
            >
              Documentation
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span className="font-roboto text-sm">{currentUser.name}</span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">{currentUser.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white hover:bg-red-600 hover:text-white"
                >
                  <LogOut size={16} className="mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-accent hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-accent text-primary hover:bg-accent/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-accent hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="hover:text-accent transition-colors font-roboto text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {currentUser && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="hover:text-accent transition-colors font-roboto text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/projects" 
                    className="hover:text-accent transition-colors font-roboto text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link 
                    to="/uploads" 
                    className="hover:text-accent transition-colors font-roboto text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Uploads
                  </Link>
                </>
              )}
              <Link 
                to="/docs" 
                className="hover:text-accent transition-colors font-roboto text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              
              {currentUser ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 text-white">
                    <User size={16} />
                    <span className="font-roboto text-sm">{currentUser.name}</span>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">{currentUser.role}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white hover:bg-red-600 hover:text-white justify-start"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-accent hover:text-primary w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="bg-accent text-primary hover:bg-accent/90 w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
