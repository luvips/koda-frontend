'use client';

/**
 * StatsCard.tsx
 * Card de métrica individual para el dashboard de AWOS.
 *
 * - Icono Lucide arriba + valor grande con count-up + label pequeño
 * - Color del valor y borde inferior según el tipo de métrica:
 *     wpm       → cian    (#00ffff)
 *     precision → lima    (#00ff00)
 *     errors    → magenta (#ff00ff)
 *     sessions  → amarillo (#ffff00)
 * - Animación count-up: useMotionValue + useTransform de framer-motion
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { ReactNode } from 'react';
import { CyberCard } from './CyberCard';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatType = 'wpm' | 'precision' | 'errors' | 'sessions';

interface StatsCardProps {
  /** Icono Lucide a mostrar (pasar el componente ya instanciado) */
  icon: ReactNode;
  /** Valor numérico a mostrar con animación count-up */
  value: number;
  /** Etiqueta descriptiva de la métrica */
  label: string;
  /** Tipo de métrica — determina el color del valor y el borde inferior */
  type: StatType;
}

// ─── Mapa de colores por tipo ─────────────────────────────────────────────────

/**
 * Cada tipo de métrica tiene un color asociado que se aplica al:
 *  - Valor numérico grande
 *  - Borde inferior de la card
 *  - Icono
 */
const TYPE_COLOR: Record<StatType, string> = {
  wpm:       '#00ffff',   // cian
  precision: '#00ff00',   // lima
  errors:    '#ff00ff',   // magenta
  sessions:  '#ffff00',   // amarillo
};

// ─── Hook count-up ────────────────────────────────────────────────────────────

/**
 * useCountUp
 * Anima un número de 0 al valor objetivo usando framer-motion.
 * Retorna una MotionValue<string> lista para usar en <motion.span>.
 */
function useCountUp(target: number, duration = 1.2) {
  // MotionValue que va de 0 al target
  const motionVal = useMotionValue(0);

  // Transforma el número a string redondeado para mostrarlo
  const display = useTransform(motionVal, (v) => Math.round(v).toString());

  // Referencia para cancelar la animación si el componente se desmonta
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    // Cancela cualquier animación previa antes de iniciar una nueva
    controlsRef.current?.stop();

    // Inicia la animación count-up desde 0 hasta target
    controlsRef.current = animate(motionVal, target, {
      duration,
      ease: 'easeOut',
    });

    return () => {
      // Limpieza al desmontar el componente
      controlsRef.current?.stop();
    };
  }, [target, duration, motionVal]);

  return display;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function StatsCard({ icon, value, label, type }: StatsCardProps) {
  // Color asociado al tipo de métrica
  const color = TYPE_COLOR[type];

  // Valor animado (count-up de 0 → value)
  const animatedValue = useCountUp(value);

  return (
    <CyberCard
      // Borde inferior coloreado según el tipo de métrica
      className="flex flex-col items-start gap-3 p-5"
      style={{
        borderBottom: `1px solid ${color}`,
      } as React.CSSProperties}
    >
      {/* ── Icono ── */}
      <span style={{ color }} aria-hidden="true">
        {icon}
      </span>

      {/* ── Valor con count-up ── */}
      <motion.span
        style={{ color, fontFamily: 'monospace' }}
        className="text-4xl font-bold leading-none tracking-tight"
        aria-live="polite"
        aria-label={`${label}: ${value}`}
      >
        {animatedValue}
      </motion.span>

      {/* ── Label descriptivo ── */}
      <span className="font-mono text-xs uppercase tracking-widest text-[#444444]">
        {label}
      </span>
    </CyberCard>
  );
}
