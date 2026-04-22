'use client';

/**
 * CyberInput.tsx
 * Input con estética cyberpunk para AWOS.
 *
 * Características:
 *  - Fondo negro, borde gris oscuro en reposo
 *  - Borde cian + glow al hacer focus
 *  - Label flotante animado (framer-motion) que sube al focus o cuando hay valor
 *  - Variante error: borde magenta con glow magenta
 *  - Soporte para icono izquierdo y derecho (Lucide icons)
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState, useId } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto del label flotante */
  label: string;
  /** Mensaje de error; activa la variante magenta cuando está presente */
  error?: string;
  /** Icono a la izquierda del input (componente Lucide) */
  iconLeft?: ReactNode;
  /** Icono a la derecha del input (componente Lucide) */
  iconRight?: ReactNode;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CyberInput({
  label,
  error,
  iconLeft,
  iconRight,
  className = '',
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  ...rest
}: CyberInputProps) {
  // Estado de foco para controlar la animación del label
  const [isFocused, setIsFocused] = useState(false);

  // Valor interno para detectar si el campo tiene contenido
  const [internalValue, setInternalValue] = useState<string>(
    (value as string) ?? (defaultValue as string) ?? '',
  );

  // ID único para asociar label e input (accesibilidad)
  const inputId = useId();

  // El label sube si el campo está enfocado O si tiene valor
  const isLabelUp = isFocused || internalValue.length > 0;

  // ── Color del borde según estado ──────────────────────────────────────────
  // error → magenta | focus → cian | reposo → gris oscuro
  const borderColor = error
    ? '#ff00ff'
    : isFocused
      ? '#00ffff'
      : '#222222';

  const boxShadow = error
    ? isFocused ? '0 0 8px rgba(255,0,255,0.3)' : 'none'
    : isFocused ? '0 0 8px rgba(0,255,255,0.3)' : 'none';

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(e);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInternalValue(e.target.value);
    onChange?.(e);
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Contenedor del input con borde animado ── */}
      <motion.div
        animate={{ borderColor, boxShadow }}
        transition={{ duration: 0.15 }}
        style={{ borderWidth: 1, borderStyle: 'solid' }}
        className="relative flex items-center rounded bg-black"
      >
        {/* Icono izquierdo */}
        {iconLeft && (
          <span className="pointer-events-none pl-3 text-[#444444]">
            {iconLeft}
          </span>
        )}

        {/* ── Label flotante animado ── */}
        <motion.label
          htmlFor={inputId}
          // Posición: abajo (placeholder) → arriba (label activo)
          animate={
            isLabelUp
              ? { y: -22, scale: 0.75, color: error ? '#ff00ff' : '#00ffff' }
              : { y: 0,   scale: 1,    color: '#444444' }
          }
          transition={{ duration: 0.15 }}
          style={{ originX: 0 }}
          className={[
            'pointer-events-none absolute font-mono text-sm',
            // Desplazamiento horizontal según si hay icono izquierdo
            iconLeft ? 'left-9' : 'left-3',
          ].join(' ')}
        >
          {label}
        </motion.label>

        {/* ── Input nativo ── */}
        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={[
            'w-full bg-transparent py-3 font-mono text-sm text-white',
            'placeholder-transparent outline-none',
            // Padding horizontal según iconos presentes
            iconLeft  ? 'pl-2'  : 'pl-3',
            iconRight ? 'pr-2'  : 'pr-3',
          ].join(' ')}
          {...rest}
        />

        {/* Icono derecho */}
        {iconRight && (
          <span className="pointer-events-none pr-3 text-[#444444]">
            {iconRight}
          </span>
        )}
      </motion.div>

      {/* ── Mensaje de error animado ── */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error-msg"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 pl-1 font-mono text-xs text-[#ff00ff]"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
