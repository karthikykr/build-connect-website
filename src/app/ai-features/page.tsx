'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { DocumentVerification } from '@/components/features/ai/DocumentVerification';
import { PropertyValuation } from '@/components/features/ai/PropertyValuation';
import { RecommendationEngine } from '@/components/features/ai/RecommendationEngine';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  Sparkles, 
  Scan, 
  Calculator,
  Brain,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react';

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'valuation' | 'recommendations'>('overview');

  const breadcrumbs = [
    { label: 'AI Features', current: true }
  ];

  const aiFeatures = [
    {
      icon: Scan,
      title: 'Document Verification',
      description: 'AI-powered document analysis and verification for property papers, identity documents, and legal certificates.',
      benefits: ['99.5% accuracy', 'Instant verification', 'Fraud detection', 'OCR text extraction'],
      color: 'bg-blue-500'
    },
    {
      icon: Calculator,
      title: 'Property Valuation',
      description: 'Machine learning algorithms analyze market data, location factors, and property features for accurate valuations.',
      benefits: ['Market-based pricing', 'Comparable analysis', 'Trend predictions', 'Investment insights'],
      color: 'bg-green-500'
    },
    {
      icon: Brain,
      title: 'Smart Recommendations',
      description: 'Personalized property, broker, and contractor recommendations based on user behavior and preferences.',
      benefits: ['Personalized matches', 'Behavior analysis', 'Preference learning', 'Success optimization'],
      color: 'bg-purple-500'
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      description: 'Intelligent virtual assistant for instant support, property queries, and guided assistance.',
      benefits: ['24/7 availability', 'Natural language', 'Context awareness', 'Multi-language support'],
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Documents Verified', value: '50,000+', icon: Shield },
    { label: 'Properties Valued', value: '25,000+', icon: TrendingUp },
    { label: 'Recommendations Made', value: '100,000+', icon: Sparkles },
    { label: 'User Satisfaction', value: '98.5%', icon: CheckCircle },
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            AI-Powered Real Estate Platform
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Experience the future of real estate with our cutting-edge artificial intelligence features 
            designed to make property transactions smarter, faster, and more secure.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-light">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Sparkles },
                { id: 'verification', label: 'Document Verification', icon: Scan },
                { id: 'valuation', label: 'Property Valuation', icon: Calculator },
                { id: 'recommendations', label: 'Smart Recommendations', icon: Brain },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-card-hover transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-secondary mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-success mr-2" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* How It Works */}
            <div>
              <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
                How Our AI Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                  <p className="text-text-secondary">
                    Our AI continuously collects and analyzes market data, user behavior, and property information.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
                  <p className="text-text-secondary">
                    Advanced algorithms process the data to identify patterns, trends, and user preferences.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
                  <p className="text-text-secondary">
                    Deliver personalized recommendations, accurate valuations, and automated verifications.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-primary/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Experience AI-Powered Real Estate?
              </h2>
              <p className="text-text-secondary mb-6">
                Join thousands of users who are already benefiting from our intelligent platform.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                AI Document Verification
              </h2>
              <p className="text-text-secondary">
                Upload your property documents, identity proofs, or legal certificates for instant AI-powered verification.
                Our system can detect fraud, extract key information, and verify authenticity with 99.5% accuracy.
              </p>
            </div>
            <DocumentVerification />
          </div>
        )}

        {activeTab === 'valuation' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                AI Property Valuation
              </h2>
              <p className="text-text-secondary">
                Get instant, accurate property valuations powered by machine learning algorithms that analyze 
                market trends, comparable properties, location factors, and property features.
              </p>
            </div>
            <PropertyValuation />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Smart Recommendations
              </h2>
              <p className="text-text-secondary">
                Our AI recommendation engine learns from your behavior, preferences, and search history to 
                suggest the most relevant properties, brokers, and contractors for your needs.
              </p>
            </div>
            
            <RecommendationEngine type="properties" limit={3} />
            <RecommendationEngine type="brokers" limit={3} />
            <RecommendationEngine type="contractors" limit={3} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
