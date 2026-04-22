'use client';

/**
 * FeatureCards.tsx
 * Grid de 3 cards de características para la sección "¿Por qué KODA?".
 *
 * Se separa del Server Component porque usa framer-motion
 * para las animaciones de entrada escalonadas.
 *
 * Delays: 0.1s → 0.2s → 0.3s para efecto cascada.
 */

import { motion } from 'framer-motion';
import { Code2, Zap, TrendingUp } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';

// ─── Datos de las features ────────────────────────────────────────────────────

/**
 * Cada feature tiene un icono Lucide, un color, un título y una descripción.
 * Los colores siguen la paleta cyberpunk de KODA.
 */
const FEATURES = [
  {
    id: 'snippets',
    // Icono de código — representa los snippets reales
    icon: <Code2 size={28} />,
    iconColor: '#00ffff',   // cian
    title: 'Snippets de código real',
    description:
      'Nada de lorem ipsum. Código real de Python, TypeScript y Java para construir memoria muscular verdadera.',
    delay: 0.1,
  },
  {
    id: 'metrics',
    // Icono de rayo — representa la velocidad y métricas en tiempo real
    icon: <Zap size={28} />,
    iconColor: '#ffff00',   // amarillo
    title: 'Métricas en vivo',
    description:
      'PPM, CPM y precisión calculados en tiempo real mientras escribes.',
    delay: 0.2,
  },
  {
    id: 'progress',
    // Icono de tendencia — representa el progreso a lo largo del tiempo
    icon: <TrendingUp size={28} />,
    iconColor: '#00ff00',   // lima
    title: 'Seguimiento de progreso',
    description:
      'Tu historial, tus teclas débiles, tu mejora con el tiempo — todo en un dashboard.',
    delay: 0.3,
  },
] as const;

// ─── Componente principal ─────────────────────────────────────────────────────

export function FeatureCards() {
  return (
    /* Grid responsivo: 1 columna en móvil, 3 en desktop */
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {FEATURES.map((feature) => (
        <motion.div
          key={feature.id}
          // Animación de entrada: fade-in + slide-up con delay escalonado
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: feature.delay, ease: 'easeOut' }}
        >
          <CyberCard className="flex h-full flex-col gap-4 p-6">
            {/* Icono con color semántico */}
            <span style={{ color: feature.iconColor }} aria-hidden="true">
              {feature.icon}
            </span>

            {/* Título de la feature */}
            <h3 className="font-mono text-sm font-semibold tracking-wide text-white">
              {feature.title}
            </h3>

            {/* Descripción */}
            <p
              className="font-mono text-xs leading-relaxed"
              style={{ color: '#555555' }}
            >
              {feature.description}
            </p>
          </CyberCard>
        </motion.div>
      ))}
    </div>
  );
}
