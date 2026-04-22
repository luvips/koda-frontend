'use client';

/**
 * LoginForm.tsx
 * Formulario de inicio de sesión con validación Zod + React Hook Form.
 * Conectado al backend de AWOS para autenticación real.
 * Manejo robusto de errores con toasts animados.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { CyberInput } from '@/components/ui/CyberInput';
import { CyberButton } from '@/components/ui/CyberButton';
import { login, ApiError } from '@/lib/api';
import { useStore } from '@/lib/store';

// ─── Schema Zod ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Helpers de toast ─────────────────────────────────────────────────────────

// Estilos base para cada tipo de toast
const toastBase = {
  fontFamily: 'var(--font-geist-mono), monospace',
  fontSize: '13px',
  background: '#0a0a0a',
  color: '#ffffff',
  padding: '12px 16px',
  borderRadius: '4px',
}

function toastSuccess(title: string, subtitle: string) {
  toast.success(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      <span style={{ color: '#888888', fontSize: '11px' }}>{subtitle}</span>
    </div>,
    {
      duration: 3000,
      style: { ...toastBase, border: '1px solid rgba(0,255,255,0.35)', boxShadow: '0 0 16px rgba(0,255,255,0.1)' },
      iconTheme: { primary: '#00ffff', secondary: '#000000' },
    }
  )
}

function toastError(title: string, subtitle?: string) {
  toast.error(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      {subtitle && <span style={{ color: '#888888', fontSize: '11px' }}>{subtitle}</span>}
    </div>,
    {
      duration: 4500,
      style: { ...toastBase, border: '1px solid rgba(255,0,255,0.35)', boxShadow: '0 0 16px rgba(255,0,255,0.08)' },
      iconTheme: { primary: '#ff00ff', secondary: '#000000' },
    }
  )
}

function toastWarning(title: string, subtitle?: string) {
  toast(
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      {subtitle && <span style={{ color: '#888888', fontSize: '11px' }}>{subtitle}</span>}
    </div>,
    {
      duration: 6000,
      icon: '⚠',
      style: { ...toastBase, border: '1px solid rgba(255,255,0,0.35)', boxShadow: '0 0 16px rgba(255,255,0,0.08)' },
    }
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await login(data);

      // Actualizar store de Zustand con el usuario autenticado
      useStore.setState({
        user: response.data.user,
        isAuthenticated: true,
      });

      toastSuccess('¡Bienvenido de nuevo!', response.data.user.name);
      setTimeout(() => router.push('/dashboard'), 600);
    } catch (error) {
      const apiError = error as ApiError;

      // 1. Errores de validación (400)
      if (apiError.status === 400 && apiError.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          setError(field as keyof LoginFormValues, { message: messages[0] });
        });
        toastError('Datos inválidos', 'Corrige los errores del formulario');
      }
      // 2. Credenciales incorrectas (401)
      else if (apiError.status === 401 || apiError.error?.toLowerCase().includes('credentials')) {
        setError('email', { message: 'Credenciales incorrectas' });
        setError('password', { message: 'Credenciales incorrectas' });
        toastError('Credenciales incorrectas', 'Verifica tu email y contraseña');
      }
      // 3. Rate limit (429)
      else if (apiError.status === 429) {
        const mins = Math.ceil((apiError.retryAfter ?? 900) / 60);
        toastWarning('Demasiados intentos', `Intenta de nuevo en ${mins} minutos`);
      }
      // 4. Error de red / timeout
      else if (error instanceof TypeError || apiError.error?.includes('fetch') || apiError.error?.includes('connect')) {
        toastError('Error de conexión', 'Verifica tu conexión a internet');
      }
      // 5. Error genérico (500, otros)
      else {
        toastError(
          'Error al iniciar sesión',
          apiError.error || 'Intenta de nuevo en unos momentos'
        );
      }

      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* CyberInput ya muestra el error internamente — no duplicar con <span> */}
      <CyberInput
        label="Email"
        type="email"
        autoComplete="email"
        iconLeft={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email')}
      />

      <CyberInput
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        error={errors.password?.message}
        iconRight={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="text-[#444444] transition-colors hover:text-[#00ffff] focus-visible:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register('password')}
      />

      <CyberButton
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="mt-2 w-full"
      >
        {isLoading ? 'Verificando...' : 'Ingresar →'}
      </CyberButton>

      <p className="text-center font-mono text-xs" style={{ color: '#222222' }}>
        demo: test@awos.dev / Test1234!
      </p>
    </form>
  );
}
