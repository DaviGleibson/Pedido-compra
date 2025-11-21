'use client';

import { useRouter } from 'next/navigation';
import LoginComponent from '@/components/ui/login-1';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (email: string, password: string) => {
    // Test user credentials
    const TEST_EMAIL = 'teste@exemplo.com';
    const TEST_PASSWORD = 'Senha123!';

    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para o dashboard...',
      });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      toast({
        title: 'Erro no login',
        description: 'Email ou senha incorretos. Use: teste@exemplo.com / Senha123!',
        variant: 'destructive',
      });
    }
  };

  return <LoginComponent onSubmit={handleSubmit} />;
}