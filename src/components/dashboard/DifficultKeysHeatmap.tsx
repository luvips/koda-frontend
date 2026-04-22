'use client';

/**
 * DifficultKeysHeatmap.tsx
 * Muestra las teclas con más errores acumulados del usuario.
 * Recibe difficultKeys[] del endpoint /progress/summary.
 * Puede mostrar cualquier tecla: letras, números o símbolos.
 */

// ─── Subcomponente: chip de tecla ─────────────────────────────────────────────

interface KeyChipProps {
  char:  string;
  rank:  number;   // 0 = más errores
  total: number;
}

function KeyChip({ char, rank, total }: KeyChipProps) {
  // Intensidad: la primera tecla (rank 0) es la más intensa
  const intensity = total > 1 ? 1 - rank / (total - 1) : 1

  // Gradiente de color: amarillo (pocos errores) → magenta (muchos errores)
  const isMagenta = intensity > 0.5
  const color     = isMagenta ? '#ff00ff' : '#ffff00'
  const bg        = isMagenta
    ? `rgba(255,0,255,${0.08 + intensity * 0.22})`
    : `rgba(255,255,0,${0.05 + intensity * 0.15})`
  const shadow    = isMagenta
    ? `0 0 ${6 + intensity * 10}px rgba(255,0,255,${0.25 + intensity * 0.35})`
    : `0 0 ${4 + intensity * 6}px rgba(255,255,0,${0.2 + intensity * 0.2})`
  const border    = isMagenta
    ? `rgba(255,0,255,${0.3 + intensity * 0.4})`
    : `rgba(255,255,0,${0.2 + intensity * 0.3})`

  // Etiqueta legible para teclas especiales
  const label: Record<string, string> = {
    ' ': 'SPC', '\t': 'TAB', 'Enter': '↵', 'Backspace': '⌫',
    'Shift': '⇧', 'Control': 'Ctrl', 'Alt': 'Alt',
  }
  const display = label[char] ?? char

  return (
    <div
      title={`"${char}" — posición ${rank + 1} en errores`}
      className="flex min-h-[32px] min-w-[32px] cursor-default items-center justify-center rounded border px-2 font-mono text-xs font-bold transition-all duration-200"
      style={{
        backgroundColor: bg,
        color,
        boxShadow:       shadow,
        borderColor:     border,
        borderWidth:     1,
        borderStyle:     'solid',
      }}
      aria-label={`Tecla ${char}: posición ${rank + 1} en errores frecuentes`}
    >
      {display}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface DifficultKeysHeatmapProps {
  difficultKeys?: string[];
}

export function DifficultKeysHeatmap({ difficultKeys = [] }: DifficultKeysHeatmapProps) {
  const total = difficultKeys.length

  return (
    <div className="flex flex-col gap-4">

      {/* Título */}
      <div className="flex flex-col gap-1">
        <p className="font-mono uppercase tracking-widest" style={{ fontSize: '0.75rem', color: '#888888' }}>
          Teclas difíciles
        </p>
        <p className="font-mono text-xs" style={{ color: '#333333' }}>
          {total > 0
            ? `Top ${total} tecla${total !== 1 ? 's' : ''} con más errores`
            : 'Completa sesiones para ver tus teclas difíciles'}
        </p>
      </div>

      {/* Chips de teclas — cualquier carácter */}
      {total === 0 ? (
        <div
          className="flex h-24 items-center justify-center rounded border"
          style={{ borderColor: '#1a1a1a', borderStyle: 'dashed' }}
        >
          <span className="font-mono text-xs" style={{ color: '#333333' }}>
            Sin datos aún
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {difficultKeys.map((char, i) => (
            <KeyChip key={`${char}-${i}`} char={char} rank={i} total={total} />
          ))}
        </div>
      )}

      {/* Leyenda */}
      {total > 0 && (
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: 'rgba(255,255,0,0.2)', border: '1px solid rgba(255,255,0,0.3)' }} aria-hidden="true" />
            <span className="font-mono text-xs" style={{ color: '#ffff00' }}>Menos frecuente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: 'rgba(255,0,255,0.3)', border: '1px solid rgba(255,0,255,0.4)' }} aria-hidden="true" />
            <span className="font-mono text-xs" style={{ color: '#ff00ff' }}>Más frecuente</span>
          </div>
        </div>
      )}
    </div>
  )
}
