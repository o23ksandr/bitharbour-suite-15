import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
const schema = z.object({
  username: z.string().min(2, 'Enter username'),
  password: z.string().min(6, 'Minimum 6 characters')
});
type FormData = z.infer<typeof schema>;
export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid
    }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });
  const {
    toast
  } = useToast();
  const {
    signIn,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const onSubmit = async (data: FormData) => {
    const ok = await signIn(data.username, data.password);
    if (ok) {
      toast({
        title: 'Welcome back',
        description: 'Signed in successfully'
      });
      navigate('/overview');
    } else {
      toast({
        title: 'Sign in failed',
        description: 'Check your credentials',
        variant: 'destructive' as any
      });
    }
  };
  return <>
      <SEO title="Sign in | BITHARBOUR" description="Sign in to BITHARBOUR – secure multi-currency wallet and exchange." />
      <div className="min-h-screen bg-background w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
        <div className="grid lg:grid-cols-2 min-h-screen w-full">
          <aside className="relative hidden lg:block h-full" aria-hidden="true">
            <div className="h-full w-full overflow-hidden rounded-2xl shadow">
              <img src="/lovable-uploads/ac46510d-16bc-4d37-b78d-6d57af376ef7.png" alt="Trading platform interface displayed on desktop and mobile devices" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </aside>
          <main className="flex items-center justify-center h-full p-6 lg:p-0">
            <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">Sign in to BITHARBOUR</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="username" placeholder="demo" className="pl-8" {...register('username')} />
                    </div>
                    {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={show ? 'text' : 'password'} placeholder="demo123" className="pl-8 pr-8" {...register('password')} />
                      <button type="button" aria-label="Toggle password visibility" onClick={() => setShow(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <a href="#" className="underline offset-2">Forgot password?</a>
                    
                  </div>
                  <Button type="submit" className="w-full" disabled={!isValid || loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">By continuing you agree to our <a className="underline" href="#">Terms</a> & <a className="underline" href="#">Privacy</a>.</p>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>;
}