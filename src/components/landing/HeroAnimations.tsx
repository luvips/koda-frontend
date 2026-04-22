'use client';

/**
 * HeroAnimations.tsx
 * Wrappers de animación framer-motion para los elementos del hero.
 *
 * Exporta componentes que envuelven el contenido estático del Server Component
 * con animaciones de entrada escalonadas.
 *
 * Secuencia de entrada:
 *  0.0s → Badge "Open Beta"
 *  0.2s → Título KODA
 *  0.5s → Subtítulo
 *  0.7s → Descripción
 *  0.9s → CTA
 *  1.1s → Preview de código
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// ─── Variantes de animación ───────────────────────────────────────────────────

/** Fade-in + slide-up genérico */
const fadeUp = (delay: number) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

/** Fade-in + scale para el título */
const titleAnim = {
  initial:    { opacity: 0, scale: 0.92 },
  animate:    { opacity: 1, scale: 1    },
  transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' as const },
};

/** Fade-in lateral para el preview de código */
const slideRight = {
  initial:    { opacity: 0, x: -20 },
  animate:    { opacity: 1, x: 0   },
  transition: { duration: 0.7, delay: 1.1, ease: 'easeOut' as const },
};

// ─── Componentes exportados ───────────────────────────────────────────────────

export function AnimBadge({ children }: { children: ReactNode }) {
  return <motion.div {...fadeUp(0.0)}>{children}</motion.div>;
}

export function AnimTitle({ children }: { children: ReactNode }) {
  return <motion.div {...titleAnim}>{children}</motion.div>;
}

export function AnimSubtitle({ children }: { children: ReactNode }) {
  return <motion.div {...fadeUp(0.5)}>{children}</motion.div>;
}

export function AnimDescription({ children }: { children: ReactNode }) {
  return <motion.div {...fadeUp(0.7)}>{children}</motion.div>;
}

export function AnimCta({ children }: { children: ReactNode }) {
  return <motion.div {...fadeUp(0.9)}>{children}</motion.div>;
}

export function AnimCodePreview({ children }: { children: ReactNode }) {
  return <motion.div {...slideRight}>{children}</motion.div>;
}

// ─── Stats animados al entrar en viewport ────────────────────────────────────

export function AnimStat({
  children,
  delay,
}: {
  children: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Sección CTA final con glow pulsante ─────────────────────────────────────

export function AnimCtaSection({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Título de sección con línea decorativa ───────────────────────────────────

export function AnimSectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4"
    >
      {children}
      {/* Línea decorativa galáctica debajo del título */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        style={{
          height: 1,
          width: 80,
          background: 'linear-gradient(to right, transparent, #00ffff, transparent)',
          transformOrigin: 'center',
        }}
      />
    </motion.div>
  );
}
