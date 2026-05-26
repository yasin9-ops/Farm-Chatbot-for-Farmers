import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  TrendingUp,
  Cloud,
  Microscope,
  IndianRupee,
  FileText,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import FeatureCard from '@/components/home/FeatureCard';
import QuickActionButton from '@/components/home/QuickActionButton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { t } = useLanguage();
  const [showChat, setShowChat] = React.useState(false);

  const features = [
    {
      icon: Leaf,
      title: t('cropRecommendation'),
      description: t('cropRecommendationDesc'),
      color: 'leaf' as const,
    },
    {
      icon: Microscope,
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDesc'),
      color: 'terracotta' as const,
    },
    {
      icon: IndianRupee,
      title: t('marketInfo'),
      description: t('marketInfoDesc'),
      color: 'wheat' as const,
    },
    {
      icon: Cloud,
      title: t('weatherForecast'),
      description: t('weatherForecastDesc'),
      color: 'sky' as const,
    },
  ];

  const quickActions = [
    { icon: Leaf, label: t('cropRecommendation'), color: 'leaf' as const },
    { icon: IndianRupee, label: t('marketInfo'), color: 'wheat' as const },
    { icon: Cloud, label: t('weatherForecast'), color: 'sky' as const },
    { icon: FileText, label: t('schemes'), color: 'primary' as const },
  ];

  if (showChat) {
    return (
      <Layout showFooter={false}>
        <div className="h-[calc(100vh-64px)] flex flex-col">
          <div className="p-4 border-b border-border bg-card/50">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold">Farm Assistant</h2>
                  <p className="text-xs text-muted-foreground">Online • Ready to help</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowChat(false)}>
                Back
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--wheat)/0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--leaf)/0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('welcome')}</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => setShowChat(true)}
                className="group"
              >
                <MessageCircle className="h-5 w-5" />
                {t('startChat')}
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                icon={action.icon}
                label={action.label}
                color={action.color}
                onClick={() => setShowChat(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Can I Help You?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get expert farming advice powered by AI. From crop selection to disease management, I'm here to guide you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Farmers Helped' },
              { value: '50+', label: 'Crop Types' },
              { value: '95%', label: 'Accuracy Rate' },
              { value: '24/7', label: 'Available' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 via-leaf/5 to-wheat/5 rounded-3xl p-8 md:p-12 border border-border">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Improve Your Farm?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of farmers who are already using AI to increase their productivity and profitability.
            </p>
            <Button variant="hero" size="lg" onClick={() => setShowChat(true)}>
              <MessageCircle className="h-5 w-5" />
              Start Your Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
