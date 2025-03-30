
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { AlertCircle, BatteryCharging, Lock, Mail, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update active tab when URL params change
  useEffect(() => {
    setActiveTab(tabParam === 'signup' ? 'signup' : 'login');
  }, [tabParam]);

  // Redirect to dashboard if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        setLoginError(error.message);
        return;
      }
      navigate('/dashboard');
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setIsLoading(true);

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupEmail, signupPassword, { name: signupName });
      if (error) {
        setSignupError(error.message);
        return;
      }
      
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials",
      });
      
      // Switch to login tab
      setActiveTab('login');
    } catch (error: any) {
      setSignupError(error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-sm mb-4">
            <BatteryCharging className="h-12 w-12 text-scope-orange" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SCOPE BMS</h1>
          <p className="text-slate-400">
            Advanced Battery Management System
          </p>
        </div>
        
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center text-white">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create an account'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-200">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="password" 
                        type="password"
                        placeholder="••••••••" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-scope-orange hover:bg-scope-orange/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{signupError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-200">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="Your name" 
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-200">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-200">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="signup-password" 
                        type="password"
                        placeholder="••••••••"  
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Must be at least 6 characters
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-scope-orange hover:bg-scope-orange/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col pt-0">
            <p className="mt-2 text-xs text-center text-slate-400">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
