'use client';

/**
 * PasswordStrength.tsx
 * Indicador visual de fuerza de contraseña para el formulario de registro.
 *
 * Evalúa 4 requisitos:
 *  1. Longitud >= 8 caracteres
 *  2. Contiene al menos un número
 *  3. Contiene al menos una mayúscula
 *  4. Contiene al menos un símbolo especial
 *
 * Colores por nivel:
 *  1 segmento → rojo    (#ff0040)
 *  2 segmentos → amarillo (#ffff00)
 *  3 segmentos → cian   (#00ffff)
 *  4 segmentos → lima   (#00ff00)
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PasswordStrengthProps {
  /** Valor actual del campo de contraseña */
  password: string;
}

// ─── Evaluación de requisitos ─────────────────────────────────────────────────

/**
 * Evalúa cuántos requisitos cumple la contraseña.
 * Retorna un número entre 0 y 4.
 */
function evaluateStrength(password: string): number {
  if (!password) return 0;

  let score = 0;

  // Requisito 1: longitud mínima de 8 caracteres
  if (password.length >= 8) score++;

  // Requisito 2: contiene al menos un número
  if (/\d/.test(password)) score++;

  // Requisito 3: contiene al menos una letra mayúscula
  if (/[A-Z]/.test(password)) score++;

  // Requisito 4: contiene al menos un símbolo especial
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

/**
 * Mapa de color por nivel de fuerza.
 * El índice corresponde al número de requisitos cumplidos (1-4).
 */
const STRENGTH_COLORS: Record<number, string> = {
  1: '#ff0040',   // rojo — muy débil
  2: '#ffff00',   // amarillo — débil
  3: '#00ffff',   // cian — buena
  4: '#00ff00',   // lima — fuerte
};

/**
 * Etiquetas descriptivas por nivel de fuerza.
 */
const STRENGTH_LABELS: Record<number, string> = {
  0: '',
  1: 'Muy débil',
  2: 'Débil',
  3: 'Buena',
  4: 'Fuerte',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function PasswordStrength({ password }: PasswordStrengthProps) {
  // Calcula el score cada vez que cambia la contraseña
  const score = useMemo(() => evaluateStrength(password), [password]);

  // Color activo según el score (0 → sin color)
  const activeColor = score > 0 ? STRENGTH_COLORS[score] : 'transparent';

  // Etiqueta descriptiva del nivel actual
  const label = STRENGTH_LABELS[score];

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite" aria-label={`Fuerza de contraseña: ${label}`}>

      {/* ── Barra de 4 segmentos ── */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <motion.div
            key={segment}
            className="h-1 flex-1 rounded-full"
            // Anima el color del segmento: activo si score >= segment
            animate={{
              backgroundColor: score >= segment ? activeColor : '#1a1a1a',
            }}
            transition={{ duration: 0.2, delay: segment * 0.04 }}
          />
        ))}
      </div>

      {/* ── Etiqueta de nivel ── */}
      {score > 0 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-xs"
          style={{ color: activeColor }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
