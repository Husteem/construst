
import { FileText, Users, Shield, Code, Smartphone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Documentation = () => {
  const features = [
    {
      title: "Smart Contract Integration",
      description: "Automated payments through blockchain technology ensuring transparency and security",
      icon: Shield,
      status: "Implemented"
    },
    {
      title: "Role-Based Access Control",
      description: "Different interfaces and permissions for Managers, Workers, and Suppliers",
      icon: Users,
      status: "Implemented"
    },
    {
      title: "Real-time Verification",
      description: "GPS-enabled work progress and material delivery verification",
      icon: Smartphone,
      status: "Implemented"
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive project metrics and payment tracking",
      icon: TrendingUp,
      status: "Implemented"
    }
  ];

  const userRoles = [
    {
      role: "Project Manager",
      actions: [
        "Create and manage projects",
        "Add workers and suppliers to projects",
        "Review and approve work submissions",
        "Initiate smart contract payments",
        "View project analytics and reports"
      ],
      color: "bg-blue-100 text-blue-800"
    },
    {
      role: "Construction Worker",
      actions: [
        "Register account and set up wallet",
        "View assigned projects",
        "Submit daily work progress with photos",
        "Track payment status",
        "View work history"
      ],
      color: "bg-green-100 text-green-800"
    },
    {
      role: "Material Supplier",
      actions: [
        "Register account and set up wallet",
        "View material requests",
        "Submit delivery confirmations with proof",
        "Track payment status",
        "View delivery history"
      ],
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-4">
            ConTrust Documentation
          </h1>
          <p className="font-roboto text-lg text-gray-600">
            Blockchain-powered construction payment and verification system
          </p>
        </div>

        {/* Project Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl flex items-center space-x-2">
              <FileText size={20} className="text-primary" />
              <span>Project Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-roboto text-gray-700">
              ConTrust is a revolutionary blockchain-based payment and verification system designed specifically 
              for the construction industry. It addresses the challenges of payment delays, fraud, and lack of 
              transparency that plague traditional construction payment methods.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Problem Statement</h3>
              <p className="text-yellow-700 text-sm">
                Traditional construction payment systems suffer from delays, disputes, and lack of transparency. 
                Workers and suppliers often wait weeks or months for payments, leading to cash flow problems 
                and project delays.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Solution</h3>
              <p className="text-green-700 text-sm">
                ConTrust leverages blockchain technology to create an automated, transparent, and secure 
                payment system. Smart contracts ensure payments are released automatically upon work verification, 
                eliminating delays and building trust among all stakeholders.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Icon size={20} className="text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Roles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl">User Roles & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userRoles.map((userRole, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={userRole.color}>
                      {userRole.role}
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {userRole.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl flex items-center space-x-2">
              <Code size={20} className="text-primary" />
              <span>Technical Architecture</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Frontend</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Shadcn/ui Components</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Backend</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Supabase Integration</li>
                  <li>• Authentication System</li>
                  <li>• Database Management</li>
                  <li>• File Storage</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Blockchain</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Smart Contract Logic</li>
                  <li>• Multi-wallet Support</li>
                  <li>• Automated Payments</li>
                  <li>• Transaction Tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Enhancements */}
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Future Enhancements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Short Term</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• QR-based check-in system</li>
                  <li>• Export payment history to CSV</li>
                  <li>• Real-time notifications</li>
                  <li>• Mobile app development</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Long Term</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-powered fraud detection</li>
                  <li>• Multi-currency support</li>
                  <li>• Integration with IoT sensors</li>
                  <li>• Advanced analytics and reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
