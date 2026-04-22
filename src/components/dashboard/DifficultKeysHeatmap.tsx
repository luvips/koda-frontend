'use client';

/**
 * DifficultKeysHeatmap.tsx
 * Heatmap de teclas difíciles para el dashboard de AWOS.
 *
 * Muestra las teclas especiales en un grid.
 * El color de cada tecla depende del número de errores acumulados:
 *  0 errores  : #111111 (gris muy oscuro)
 *  1-5        : texto #888888, fondo sutil
 *  6-15       : texto #ffff00 (amarillo), fondo rgba(255,255,0,0.2)
 *  >15        : texto #ff00ff (magenta), fondo rgba(255,0,255,0.3) + glow
 *
 * El glow es proporcional al número de errores.
 */

import { DIFFICULT_KEYS } from '@/lib/dashboard-mock';

// ─── Teclas a mostrar ─────────────────────────────────────────────────────────

/**
 * Lista de teclas especiales organizadas en filas para el layout del teclado.
 * Solo las teclas que importan para programación.
 */
const KEY_ROWS: string[][] = [
  ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*'],
  ['(', ')', '[', ']', '{', '}', '<', '>'],
  [';', ':', "'", '"', '/', '\\', '|', '+', '-', '='],
];

// ─── Helper: calcular estilo según errores ────────────────────────────────────

interface KeyStyle {
  backgroundColor: string;
  color:           string;
  boxShadow:       string;
  borderColor:     string;
}

/**
 * Retorna los estilos visuales de una tecla según su número de errores.
 * El glow es proporcional: más errores = más intensidad.
 */
function getKeyStyle(errors: number): KeyStyle {
  if (errors === 0) {
    // Sin errores: casi invisible
    return {
      backgroundColor: '#111111',
      color:           '#2a2a2a',
      boxShadow:       'none',
      borderColor:     '#1a1a1a',
    };
  }

  if (errors <= 5) {
    // Pocos errores: gris medio
    return {
      backgroundColor: 'rgba(255,255,255,0.03)',
      color:           '#888888',
      boxShadow:       'none',
      borderColor:     '#222222',
    };
  }

  if (errors <= 15) {
    // Errores moderados: amarillo
    const intensity = (errors - 5) / 10;   // 0.0 → 1.0
    return {
      backgroundColor: `rgba(255,255,0,${0.05 + intensity * 0.15})`,
      color:           '#ffff00',
      boxShadow:       `0 0 ${4 + intensity * 6}px rgba(255,255,0,${0.2 + intensity * 0.2})`,
      borderColor:     `rgba(255,255,0,${0.2 + intensity * 0.2})`,
    };
  }

  // Muchos errores: magenta con glow fuerte
  const intensity = Math.min((errors - 15) / 15, 1);   // 0.0 → 1.0
  return {
    backgroundColor: `rgba(255,0,255,${0.1 + intensity * 0.2})`,
    color:           '#ff00ff',
    boxShadow:       `0 0 ${8 + intensity * 10}px rgba(255,0,255,${0.3 + intensity * 0.3})`,
    borderColor:     `rgba(255,0,255,${0.3 + intensity * 0.3})`,
  };
}

// ─── Subcomponente: tecla individual ─────────────────────────────────────────

interface KeyChipProps {
  char:   string;
  errors: number;
}

/**
 * Chip cuadrado de 32x32px que representa una tecla.
 * Muestra el carácter y tiene un tooltip con el número de errores.
 */
function KeyChip({ char, errors }: KeyChipProps) {
  const style = getKeyStyle(errors);

  return (
    <div
      title={`${char}: ${errors} error${errors !== 1 ? 's' : ''}`}
      className="flex h-8 w-8 cursor-default items-center justify-center rounded border font-mono text-xs font-bold transition-all duration-200"
      style={{
        backgroundColor: style.backgroundColor,
        color:           style.color,
        boxShadow:       style.boxShadow,
        borderColor:     style.borderColor,
        borderWidth:     1,
        borderStyle:     'solid',
      }}
      aria-label={`Tecla ${char}: ${errors} errores`}
    >
      {char}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DifficultKeysHeatmap() {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Título ── */}
      <div className="flex flex-col gap-1">
        <p
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: '0.75rem', color: '#888888' }}
        >
          Difficult Keys
        </p>
        <p className="font-mono text-xs" style={{ color: '#333333' }}>
          Keys with most errors across all sessions
        </p>
      </div>

      {/* ── Grid de teclas por filas ── */}
      <div className="flex flex-col gap-2">
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-1.5">
            {row.map((char) => (
              <KeyChip
                key={char}
                char={char}
                errors={DIFFICULT_KEYS[char] ?? 0}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Leyenda del heatmap ── */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {/* Sin errores */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs" style={{ color: '#333333' }}>0</span>
        </div>

        {/* Pocos errores */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid #222' }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs" style={{ color: '#333333' }}>1–5</span>
        </div>

        {/* Errores moderados */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: 'rgba(255,255,0,0.2)', border: '1px solid rgba(255,255,0,0.3)' }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs" style={{ color: '#ffff00' }}>6–15</span>
        </div>

        {/* Muchos errores */}
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: 'rgba(255,0,255,0.3)', border: '1px solid rgba(255,0,255,0.4)' }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs" style={{ color: '#ff00ff' }}>&gt;15</span>
        </div>
      </div>
    </div>
  );
}
