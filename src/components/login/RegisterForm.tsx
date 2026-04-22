'use client';

/**
 * RegisterForm.tsx
 * Formulario de registro con validación Zod + React Hook Form.
 *
 * Comportamiento mock:
 *  - Cualquier dato válido → toast.success("Cuenta creada") + redirect /test
 *
 * Incluye el indicador de fuerza de contraseña (PasswordStrength).
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

// ─── Schema Zod ───────────────────────────────────────────────────────────────

/**
 * Validación del formulario de registro.
 * El refine verifica que password y confirm coincidan.
 */
const registerSchema = z
  .object({
    name:     z.string().min(2, 'Mínimo 2 caracteres'),
    email:    z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm:  z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Componente principal ─────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter();

  // Estado para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword]  = useState(false);
  const [showConfirm,  setShowConfirm]   = useState(false);

  // Estado de carga durante el submit mock
  const [isLoading, setIsLoading] = useState(false);

  // Configuración de React Hook Form con resolver Zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Observa el campo password para el indicador de fuerza
  const passwordValue = watch('password', '');

  // ── Handler de submit ──────────────────────────────────────────────────────

  async function onSubmit(_data: RegisterFormValues) {
    setIsLoading(true);

    // Simula latencia de red de 1.5 segundos
    await new Promise((r) => setTimeout(r, 1500));

    // Mock: cualquier dato válido crea la cuenta exitosamente
    toast.success('¡Cuenta creada! Bienvenido a AWOS 🚀');
    router.push('/test');
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* ── Campo Nombre ── */}
      <div className="flex flex-col gap-1">
        <CyberInput
          label="Nombre"
          type="text"
          autoComplete="name"
          iconLeft={<User size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />
        {/* Mensaje de error Zod — magenta, font-mono, 11px */}
        {errors.name && (
          <span
            className="pl-1 font-mono"
            style={{ color: '#ff00ff', fontSize: '11px' }}
            role="alert"
          >
            {errors.name.message}
          </span>
        )}
      </div>

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
        {/* Mensaje de error Zod */}
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

      {/* ── Campo Password con indicador de fuerza ── */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <CyberInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            iconLeft={<Lock size={16} />}
            error={errors.password?.message}
            // Botón de ojo para mostrar/ocultar contraseña
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

        {/* Indicador de fuerza — solo visible cuando hay valor en el campo */}
        {passwordValue.length > 0 && (
          <PasswordStrength password={passwordValue} />
        )}
      </div>

      {/* ── Campo Confirmar Password ── */}
      <div className="flex flex-col gap-1">
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
        {/* Mensaje de error Zod — incluye el error de refine */}
        {errors.confirm && (
          <span
            className="pl-1 font-mono"
            style={{ color: '#ff00ff', fontSize: '11px' }}
            role="alert"
          >
            {errors.confirm.message}
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
        Crear cuenta →
      </CyberButton>
    </form>
  );
}
