'use client';

import { useRouter } from 'next/navigation';
import LoginComponent from '@/components/ui/login-1';
import { useToast } from '@/components/ui/use-toast';
import { login, isAuthEnabled, LoginPayload } from '@/lib/services/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (
    identifier: string,
    password: string,
    accessType: 'funcionario' | 'fornecedor'
  ) => {
    const apiAvailable = isAuthEnabled();

    if (apiAvailable) {
      try {
        if (!identifier || !password) {
          throw new Error('Preencha todos os campos.');
        }

        const payload: LoginPayload =
          accessType === 'funcionario'
            ? { tipo: 'funcionario', matricula: identifier, senha: password }
            : { tipo: 'fornecedor', numero_documento: identifier, senha: password };

        await login(payload);

        toast({
          title: 'Login bem-sucedido!',
          description: 'Redirecionando para o dashboard...',
        });

        setTimeout(() => router.push('/dashboard'), 800);
        return;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Não foi possível efetuar o login.';
        toast({
          title: 'Erro no login',
          description: message,
          variant: 'destructive',
        });
        return;
      }
    }

    // Fallback de demonstração usando credenciais locais
    const TEST_EMAIL = 'teste@exemplo.com';
    const TEST_PASSWORD = 'Senha123!';

    if (identifier === TEST_EMAIL && password === TEST_PASSWORD) {
      toast({
        title: 'Login de demonstração',
        description: 'Redirecionando para o dashboard...',
      });
      setTimeout(() => router.push('/dashboard'), 800);
    } else {
      toast({
        title: 'Erro no login',
        description: 'Credenciais inválidas. Use: teste@exemplo.com / Senha123!',
        variant: 'destructive',
      });
    }
  };

  return <LoginComponent onSubmit={handleSubmit} />;
}