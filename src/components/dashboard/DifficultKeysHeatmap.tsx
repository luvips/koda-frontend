'use client';

/**
 * DifficultKeysHeatmap.tsx
 * Heatmap de teclas difíciles para el dashboard de AWOS.
 *
 * Recibe difficultKeys[] del endpoint /progress/summary.
 * Las teclas con más errores se muestran resaltadas en magenta.
 * Las teclas sin errores se muestran en gris oscuro.
 */

// ─── Teclas a mostrar ─────────────────────────────────────────────────────────

const KEY_ROWS: string[][] = [
  ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*'],
  ['(', ')', '[', ']', '{', '}', '<', '>'],
  [';', ':', "'", '"', '/', '\\', '|', '+', '-', '='],
];

// ─── Helper: calcular estilo según si la tecla tiene errores ─────────────────

interface KeyStyle {
  backgroundColor: string;
  color:           string;
  boxShadow:       string;
  borderColor:     string;
}

function getKeyStyle(hasError: boolean, rank: number, total: number): KeyStyle {
  if (!hasError) {
    return {
      backgroundColor: '#111111',
      color:           '#2a2a2a',
      boxShadow:       'none',
      borderColor:     '#1a1a1a',
    };
  }

  // Intensidad según posición en el ranking (primeras = más errores = más intenso)
  const intensity = total > 1 ? 1 - (rank / total) : 1;

  if (intensity > 0.6) {
    // Teclas con más errores: magenta con glow fuerte
    return {
      backgroundColor: `rgba(255,0,255,${0.15 + intensity * 0.2})`,
      color:           '#ff00ff',
      boxShadow:       `0 0 ${8 + intensity * 10}px rgba(255,0,255,${0.3 + intensity * 0.3})`,
      borderColor:     `rgba(255,0,255,${0.4 + intensity * 0.3})`,
    };
  }

  // Teclas con errores moderados: amarillo
  return {
    backgroundColor: `rgba(255,255,0,${0.05 + intensity * 0.15})`,
    color:           '#ffff00',
    boxShadow:       `0 0 ${4 + intensity * 6}px rgba(255,255,0,${0.2 + intensity * 0.2})`,
    borderColor:     `rgba(255,255,0,${0.2 + intensity * 0.2})`,
  };
}

// ─── Subcomponente: tecla individual ─────────────────────────────────────────

interface KeyChipProps {
  char:     string;
  hasError: boolean;
  rank:     number;
  total:    number;
}

function KeyChip({ char, hasError, rank, total }: KeyChipProps) {
  const style = getKeyStyle(hasError, rank, total);

  return (
    <div
      title={hasError ? `${char}: tecla difícil` : `${char}: sin errores`}
      className="flex h-8 w-8 cursor-default items-center justify-center rounded border font-mono text-xs font-bold transition-all duration-200"
      style={{
        backgroundColor: style.backgroundColor,
        color:           style.color,
        boxShadow:       style.boxShadow,
        borderColor:     style.borderColor,
        borderWidth:     1,
        borderStyle:     'solid',
      }}
      aria-label={`Tecla ${char}${hasError ? ': con errores frecuentes' : ''}`}
    >
      {char}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface DifficultKeysHeatmapProps {
  // Array de teclas con más errores del endpoint /progress/summary
  difficultKeys?: string[];
}

export function DifficultKeysHeatmap({ difficultKeys = [] }: DifficultKeysHeatmapProps) {
  const total = difficultKeys.length;

  return (
    <div className="flex flex-col gap-4">

      {/* Título */}
      <div className="flex flex-col gap-1">
        <p className="font-mono uppercase tracking-widest" style={{ fontSize: '0.75rem', color: '#888888' }}>
          Teclas difíciles
        </p>
        <p className="font-mono text-xs" style={{ color: '#333333' }}>
          {total > 0
            ? `${total} tecla${total !== 1 ? 's' : ''} con errores frecuentes`
            : 'Sin datos suficientes aún'}
        </p>
      </div>

      {/* Grid de teclas por filas */}
      <div className="flex flex-col gap-2">
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-1.5">
            {row.map((char) => {
              const rank = difficultKeys.indexOf(char);
              const hasError = rank !== -1;
              return (
                <KeyChip
                  key={char}
                  char={char}
                  hasError={hasError}
                  rank={hasError ? rank : 0}
                  total={total}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }} aria-hidden="true" />
          <span className="font-mono text-xs" style={{ color: '#333333' }}>Sin errores</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: 'rgba(255,255,0,0.2)', border: '1px solid rgba(255,255,0,0.3)' }} aria-hidden="true" />
          <span className="font-mono text-xs" style={{ color: '#ffff00' }}>Con errores</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: 'rgba(255,0,255,0.3)', border: '1px solid rgba(255,0,255,0.4)' }} aria-hidden="true" />
          <span className="font-mono text-xs" style={{ color: '#ff00ff' }}>Más frecuentes</span>
        </div>
      </div>
    </div>
  );
}
