'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Armchair, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('admin@shaadwood.com');
  const [password, setPassword] = React.useState('Admin@123456');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.login(email.trim(), password);
      toast.success(`Welcome back, ${data?.user?.firstName || 'Admin'}!`);
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@shaadwood.com');
    setPassword('Admin@123456');
    setErrorMessage(null);
    toast.info('Filled demo admin credentials');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-background to-muted/40 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mx-auto shadow-md">
            <Armchair className="w-6 h-6 text-wood-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Shaadwood Furniture</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Management & Admin Portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-xs">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription className="text-xs">
              Enter your administrative credentials to manage products, media, and orders.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <span className="font-semibold">Error:</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Email Address</span>
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shaadwood.com"
                  className="text-xs h-10"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="text-xs h-10 pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Helper Pill */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2 px-3 rounded-lg bg-muted/60 hover:bg-muted border border-border/80 text-[11px] text-muted-foreground hover:text-foreground flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-primary" />
                    <span>Demo: <strong>admin@shaadwood.com</strong></span>
                  </span>
                  <span className="text-[10px] font-mono text-primary font-semibold">Fill</span>
                </button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="w-full h-10 text-xs font-semibold gap-2 shadow-xs">
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by NestJS JWT Bearer Authentication & RBAC</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
