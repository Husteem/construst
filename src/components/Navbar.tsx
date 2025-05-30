
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user for development
  const mockUser = {
    name: 'Development User',
    role: 'manager'
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
            <Link 
              to="/docs" 
              className="hover:text-accent transition-colors font-roboto text-white"
            >
              Documentation
            </Link>
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span className="font-roboto text-sm">{mockUser.name}</span>
            </div>
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
              <Link 
                to="/docs" 
                className="hover:text-accent transition-colors font-roboto text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <div className="flex items-center space-x-2 text-white">
                <User size={16} />
                <span className="font-roboto text-sm">{mockUser.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
