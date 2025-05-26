
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, Construction, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-roboto font-medium">
              <Construction size={16} />
              <span>Smart Contract Powered</span>
            </div>
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Construction Payments
            <span className="text-primary block">Made Transparent</span>
          </h1>
          <p className="font-roboto text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automate construction payments with blockchain technology. 
            Secure, transparent, and efficient payment processing for the modern construction industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-roboto font-medium">
                Start Building Trust
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-roboto font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Construction Teams Choose ConTrust
            </h2>
            <p className="font-roboto text-lg text-gray-600 max-w-2xl mx-auto">
              Built for the construction industry, powered by smart contracts
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Blockchain-powered payments ensure complete transparency and security for all construction transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Zap className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Instant Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Smart contracts automate payment releases instantly based on work completion and approvals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200">
              <CardHeader>
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-primary" size={32} />
                </div>
                <CardTitle className="font-playfair text-xl">Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-roboto text-gray-600">
                  Tailored interfaces for workers, suppliers, and managers with appropriate permissions and workflows.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Construction Finance
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <DollarSign className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-roboto font-semibold text-gray-900 mb-2">Faster Payments</h3>
                    <p className="font-roboto text-gray-600">Eliminate payment delays with automated smart contract releases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-roboto font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                    <p className="font-roboto text-gray-600">Monitor all payments and approvals in real-time across your projects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Construction className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-roboto font-semibold text-gray-900 mb-2">Built for Construction</h3>
                    <p className="font-roboto text-gray-600">Designed specifically for construction workflows and payment cycles</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full mb-6">
                  <Construction size={32} />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="font-roboto text-gray-600 mb-6">
                  Join construction teams already using ConTrust for transparent, automated payments.
                </p>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-roboto font-medium">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">
            Ready to Revolutionize Construction Payments?
          </h2>
          <p className="font-roboto text-lg text-primary-foreground/90 mb-8">
            Join the future of construction finance with ConTrust's blockchain-powered platform.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-roboto font-medium">
              Start Building Trust Today
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
