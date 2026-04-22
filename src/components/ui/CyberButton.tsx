'use client';

/**
 * CyberButton.tsx
 * Botón reutilizable con estética Cyberpunk Neon para AWOS.
 *
 * Variantes:
 *  - primary : borde/texto cian (#00ffff), hover fondo cian
 *  - danger  : borde/texto magenta (#ff00ff), hover fondo magenta
 *  - ghost   : sin borde, texto gris, hover texto cian
 *
 * Animaciones via framer-motion: whileHover (escala + glow) y whileTap (press).
 */

import { motion, type TargetAndTransition } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Variant = 'primary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: Variant;
  /** Tamaño del botón */
  size?: Size;
  /** Muestra un spinner cian y deshabilita el botón mientras es true */
  loading?: boolean;
  /** Contenido del botón */
  children: ReactNode;
}

// ─── Mapas de estilos estáticos ───────────────────────────────────────────────

/**
 * Clases base de cada variante (estado normal).
 * Se complementan con los estilos de hover definidos en el objeto `hoverStyles`.
 */
const VARIANT_BASE: Record<Variant, string> = {
  primary: 'border border-[#00ffff] text-[#00ffff] bg-transparent',
  danger:  'border border-[#ff00ff] text-[#ff00ff] bg-transparent',
  ghost:   'border-0 text-[#444444] bg-transparent',
};

/**
 * Clases de tamaño: padding + font-size.
 */
const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
};

/**
 * Estilos de hover inline por variante, tipados como TargetAndTransition
 * para que framer-motion los acepte sin conflicto con React.CSSProperties.
 */
const HOVER_STYLES: Record<Variant, TargetAndTransition> = {
  primary: {
    backgroundColor: '#00ffff',
    color: '#000000',
    boxShadow: '0 0 12px rgba(0,255,255,0.4)',
  },
  danger: {
    backgroundColor: '#ff00ff',
    color: '#000000',
    boxShadow: '0 0 12px rgba(255,0,255,0.4)',
  },
  ghost: {
    color: '#00ffff',
  },
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

/**
 * Spinner cian animado que se muestra cuando loading=true.
 * Usa una animación CSS pura para no depender de framer-motion aquí.
 */
function CyberSpinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent"
    />
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CyberButton({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  children,
  className = '',
  onClick,
  ...rest
}: CyberButtonProps) {
  // El botón se deshabilita tanto si disabled=true como si loading=true
  const isDisabled = disabled || loading;

  return (
    <motion.button
      // ── Animaciones framer-motion ──────────────────────────────────────────
      // whileHover y whileTap solo se pasan cuando el botón está habilitado;
      // framer-motion no acepta {} vacío como valor válido en strict mode.
      whileHover={
        isDisabled
          ? undefined
          : { ...HOVER_STYLES[variant], scale: 1.02 } as TargetAndTransition
      }
      whileTap={
        isDisabled
          ? undefined                   // Sin press si está deshabilitado
          : { scale: 0.97 }
      }
      transition={{ duration: 0.2 }}   // Transición de 200 ms en todos los estados

      // ── Props nativos del botón ────────────────────────────────────────────
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}

      // ── Clases Tailwind ────────────────────────────────────────────────────
      className={[
        // Base compartida por todas las variantes
        'relative inline-flex cursor-pointer items-center justify-center gap-2',
        'rounded font-mono font-medium tracking-wider',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]',
        // Variante y tamaño
        VARIANT_BASE[variant],
        SIZE_CLASSES[size],
        // Estado deshabilitado
        isDisabled ? 'cursor-not-allowed opacity-40' : '',
        className,
      ].join(' ')}

      {...(rest as object)}
    >
      {/* Spinner de carga — reemplaza el contenido mientras loading=true */}
      {loading ? <CyberSpinner /> : children}
    </motion.button>
  );
}
