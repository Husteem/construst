
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Smart Construction 
            <span className="text-primary block">Payments Made Simple</span>
          </h1>
          <p className="font-roboto text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate your construction payments with blockchain technology. 
            Transparent, secure, and efficient payment processing for Kaduna State's construction industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary px-8 py-3 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose ConTrust?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Blockchain-powered payments ensure transparency and security for all transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Automated Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Smart contracts automate payment releases based on work completion and approvals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Tailored interfaces for workers, suppliers, and managers with appropriate permissions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Construction Payments?
          </h2>
          <p className="font-roboto text-lg text-gray-600 mb-8">
            Join the future of construction finance with ConTrust's smart contract technology.
          </p>
          <Link to="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
              Start Building Trust Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
