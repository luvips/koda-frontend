'use client';

/**
 * CyberCard.tsx
 * Contenedor card con estética cyberpunk para AWOS.
 *
 * - Fondo #0a0a0a, borde cian muy sutil en reposo
 * - Si clickable=true: hover activa borde más brillante + sombra interior
 * - Animación de entrada: fade-in + slide-up via framer-motion
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CyberCardProps {
  /** Contenido interno de la card */
  children: ReactNode;
  /** Clases Tailwind adicionales */
  className?: string;
  /** Estilos inline adicionales (ej: borde inferior coloreado en StatsCard) */
  style?: React.CSSProperties;
  /** Si true, aplica estilos de hover interactivo y cursor pointer */
  clickable?: boolean;
  /** Handler de click (solo relevante si clickable=true) */
  onClick?: () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CyberCard({
  children,
  className = '',
  style,
  clickable = false,
  onClick,
}: CyberCardProps) {
  return (
    <motion.div
      // ── Animación de entrada ───────────────────────────────────────────────
      // La card aparece desde abajo con un fade-in suave
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}

      // ── Animación de hover (solo si clickable) ─────────────────────────────
      // Se pasa undefined cuando no es clickable para evitar conflicto de tipos
      whileHover={
        clickable
          ? {
              borderColor: 'rgba(0,255,255,0.3)',
              boxShadow: 'inset 0 0 12px rgba(0,255,255,0.05)',
            }
          : undefined
      }

      // ── Estilos base + estilos adicionales del caller ──────────────────────
      style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(0,255,255,0.1)',
        borderRadius: 8,
        ...style,
      }}

      // ── Props de interacción ───────────────────────────────────────────────
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      // Soporte de teclado para accesibilidad cuando es clickable
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.();
            }
          : undefined
      }

      className={[
        clickable ? 'cursor-pointer' : '',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]',
        className,
      ].join(' ')}
    >
      {children}
    </motion.div>
  );
}
