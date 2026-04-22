'use client';

/**
 * LoginForm.tsx
 * Formulario de inicio de sesión con validación Zod + React Hook Form.
 *
 * Comportamiento mock:
 *  - Credenciales "test@awos.dev" / "Test1234!" → toast.success + redirect /dashboard
 *  - Cualquier otro dato → toast.error + marca ambos campos con error
 *
 * El submit simula 1.5s de latencia de red antes de resolver.
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

// ─── Schema Zod ───────────────────────────────────────────────────────────────

/**
 * Validación del formulario de login.
 * Los mensajes de error se muestran debajo de cada campo en magenta.
 */
const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Credenciales mock válidas ────────────────────────────────────────────────

const VALID_EMAIL    = 'test@awos.dev';
const VALID_PASSWORD = 'Test1234!';

// ─── Componente principal ─────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();

  // Estado para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Estado de carga durante el submit mock
  const [isLoading, setIsLoading] = useState(false);

  // Configuración de React Hook Form con resolver Zod
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // ── Handler de submit ──────────────────────────────────────────────────────

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    // Simula latencia de red de 1.5 segundos
    await new Promise((r) => setTimeout(r, 1500));

    if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
      // Credenciales correctas → toast de bienvenida + redirect
      toast.success('Bienvenido de nuevo 👾');
      router.push('/dashboard');
    } else {
      // Credenciales incorrectas → marcar ambos campos con error
      setError('email',    { message: 'Credenciales incorrectas' });
      setError('password', { message: 'Credenciales incorrectas' });
      toast.error('Credenciales incorrectas');
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* ── Campo Email ── */}
      <div className="flex flex-col gap-1">
        <CyberInput
          label="Email"
          type="email"
          autoComplete="email"
          iconLeft={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        {/* Mensaje de error Zod — magenta, font-mono, 11px */}
        {errors.email && (
          <span
            className="pl-1 font-mono"
            style={{ color: '#ff00ff', fontSize: '11px' }}
            role="alert"
          >
            {errors.email.message}
          </span>
        )}
      </div>

      {/* ── Campo Password con toggle show/hide ── */}
      <div className="flex flex-col gap-1">
        <CyberInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={errors.password?.message}
          // Icono derecho: botón de ojo para mostrar/ocultar contraseña
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
        {/* Mensaje de error Zod */}
        {errors.password && (
          <span
            className="pl-1 font-mono"
            style={{ color: '#ff00ff', fontSize: '11px' }}
            role="alert"
          >
            {errors.password.message}
          </span>
        )}
      </div>

      {/* ── Botón submit ── */}
      <CyberButton
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        disabled={isLoading}
        className="mt-2 w-full"
      >
        Ingresar →
      </CyberButton>

      {/* Hint de credenciales mock para facilitar el testing */}
      <p
        className="text-center font-mono text-xs"
        style={{ color: '#222222' }}
      >
        demo: test@awos.dev / Test1234!
      </p>
    </form>
  );
}
