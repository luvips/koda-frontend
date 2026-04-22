'use client';

/**
 * RegisterForm.tsx
 * Formulario de registro con validación Zod + React Hook Form.
 * Conectado al backend de AWOS para registro real de usuarios.
 * Manejo robusto de errores con toasts animados.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Mail, Eye, EyeOff, Lock } from 'lucide-react';
import { CyberInput } from '@/components/ui/CyberInput';
import { CyberButton } from '@/components/ui/CyberButton';
import { PasswordStrength } from './PasswordStrength';
import { register as registerUser, ApiError } from '@/lib/api';
import { useStore } from '@/lib/store';

// ─── Schema Zod ───────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name:     z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
    email:    z.string().email('Email inválido').max(100, 'Máximo 100 caracteres'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
      .regex(/[0-9]/, 'Debe incluir al menos un número'),
    confirm:  z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Helpers de toast ─────────────────────────────────────────────────────────

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

export function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  async function onSubmit(data: RegisterFormValues) {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Actualizar store de Zustand
      useStore.setState({
        user: response.data.user,
        isAuthenticated: true,
      });

      toastSuccess('¡Cuenta creada!', `Bienvenido, ${response.data.user.name}`);
      setTimeout(() => router.push('/test'), 600);
    } catch (error) {
      const apiError = error as ApiError;

      // 1. Errores de validación (400)
      if (apiError.status === 400 && apiError.details) {
        Object.entries(apiError.details).forEach(([field, messages]) => {
          setError(field as keyof RegisterFormValues, { message: messages[0] });
        });
        toastError('Datos inválidos', 'Corrige los errores del formulario');
      }
      // 2. Email ya registrado (409)
      else if (apiError.status === 409 || apiError.error?.includes('already registered')) {
        setError('email', { message: 'Este email ya está registrado' });
        toastError('Email ya registrado', '¿Ya tienes cuenta? Inicia sesión');
      }
      // 3. Rate limit (429)
      else if (apiError.status === 429) {
        const mins = Math.ceil((apiError.retryAfter ?? 900) / 60);
        toastWarning('Demasiados intentos', `Intenta de nuevo en ${mins} minutos`);
      }
      // 4. Error de red
      else if (error instanceof TypeError || apiError.error?.includes('fetch')) {
        toastError('Error de conexión', 'Verifica tu conexión a internet');
      }
      // 5. Error genérico
      else {
        toastError(
          'Error al crear cuenta',
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
        label="Nombre"
        type="text"
        autoComplete="name"
        iconLeft={<User size={16} />}
        error={errors.name?.message}
        {...register('name')}
      />

      <CyberInput
        label="Email"
        type="email"
        autoComplete="email"
        iconLeft={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="flex flex-col gap-2">
        <CyberInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          iconLeft={<Lock size={16} />}
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
        {passwordValue.length > 0 && <PasswordStrength password={passwordValue} />}
      </div>

      <CyberInput
        label="Confirmar Password"
        type={showConfirm ? 'text' : 'password'}
        autoComplete="new-password"
        iconLeft={<Lock size={16} />}
        error={errors.confirm?.message}
        iconRight={
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
            className="text-[#444444] transition-colors hover:text-[#00ffff] focus-visible:outline-none"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register('confirm')}
      />

      <CyberButton
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="mt-2 w-full"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta →'}
      </CyberButton>
    </form>
  );
}
