import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sprout, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: language === 'te' ? 'లాగిన్ విఫలమైంది' : 'Login Failed',
              description: language === 'te' ? 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్' : 'Invalid email or password',
              variant: 'destructive',
            });
          } else {
            toast({
              title: language === 'te' ? 'లోపం' : 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        toast({
          title: language === 'te' ? 'స్వాగతం!' : 'Welcome back!',
          description: language === 'te' ? 'విజయవంతంగా లాగిన్ అయ్యారు' : 'Successfully logged in',
        });
        navigate('/');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: language === 'te' ? 'ఖాతా ఉంది' : 'Account Exists',
              description: language === 'te' ? 'ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది. దయచేసి లాగిన్ చేయండి.' : 'An account with this email already exists. Please login instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: language === 'te' ? 'లోపం' : 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        toast({
          title: language === 'te' ? 'స్వాగతం!' : 'Welcome!',
          description: language === 'te' ? 'ఖాతా విజయవంతంగా సృష్టించబడింది' : 'Account created successfully',
        });
        navigate('/');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: language === 'te' ? 'లోపం' : 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl hero-gradient mb-4">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              {isLogin 
                ? (language === 'te' ? 'తిరిగి స్వాగతం' : 'Welcome Back')
                : (language === 'te' ? 'ఖాతాను సృష్టించండి' : 'Create Account')}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? (language === 'te' ? 'మీ వ్యవసాయ ప్రయాణాన్ని కొనసాగించండి' : 'Continue your farming journey')
                : (language === 'te' ? 'AI సలహాదారుతో మీ వ్యవసాయాన్ని మెరుగుపరచండి' : 'Improve your farming with AI advisor')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="feature-card space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'te' ? 'మీ పేరు' : 'Your name'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === 'te' ? 'ఇమెయిల్' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder={language === 'te' ? 'farmer@example.com' : 'farmer@example.com'}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-background border ${errors.password ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isLogin 
                  ? (language === 'te' ? 'లాగిన్' : 'Login')
                  : (language === 'te' ? 'సైన్ అప్' : 'Sign Up')
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? (language === 'te' ? 'ఖాతా లేదా? సైన్ అప్ చేయండి' : "Don't have an account? Sign up")
                  : (language === 'te' ? 'ఖాతా ఉందా? లాగిన్ చేయండి' : 'Already have an account? Login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
