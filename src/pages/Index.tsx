
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from './Landing';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and redirect to dashboard
    const storedUser = localStorage.getItem('contrust_user');
    if (storedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <Landing />;
};

export default Index;
