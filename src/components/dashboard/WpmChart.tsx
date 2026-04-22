'use client';

/**
 * WpmChart.tsx
 * Gráfica de historial WPM + Precisión de los últimos 30 días.
 *
 * Usa Recharts con:
 *  - LineChart responsive (100% ancho, 280px alto)
 *  - Línea WPM: cian (#00ffff), strokeWidth 2
 *  - Línea Precision: lima (#00ff00), strokeWidth 1.5, dashed
 *  - Grid apenas visible (#111)
 *  - Tooltip completamente personalizado (fondo #0a0a0a, borde cian)
 *  - Leyenda manual debajo de la gráfica
 *
 * Animación de fade-in al montar via framer-motion.
 */

import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from 'recharts';
import { WPM_HISTORY } from '@/lib/dashboard-mock';

// ─── Tipos locales para el tooltip ───────────────────────────────────────────

// ValueType y NameType no se re-exportan desde el índice de recharts en esta
// versión, así que los definimos localmente para evitar el error de importación.
type ValueType = number | string | ReadonlyArray<number | string>;
type NameType  = number | string;

// ─── Tooltip personalizado ────────────────────────────────────────────────────

/**
 * CustomTooltip
 * Reemplaza el tooltip por defecto de Recharts con uno cyberpunk.
 * Fondo #0a0a0a, borde cian, texto blanco, font-mono.
 */
function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  // Solo renderizar cuando el tooltip está activo y tiene datos
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded border p-3 font-mono text-xs"
      style={{
        backgroundColor: '#0a0a0a',
        borderColor: 'rgba(0,255,255,0.3)',
        boxShadow: '0 0 12px rgba(0,255,255,0.1)',
      }}
    >
      {/* Fecha del punto */}
      <p className="mb-2" style={{ color: '#444444' }}>{label}</p>

      {/* Valor WPM */}
      {payload[0] && (
        <p style={{ color: '#00ffff' }}>
          WPM: <span className="font-bold">{payload[0].value}</span>
        </p>
      )}

      {/* Valor Precisión */}
      {payload[1] && (
        <p style={{ color: '#00ff00' }}>
          Precision: <span className="font-bold">{payload[1].value}%</span>
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function WpmChart() {
  return (
    // Animación de fade-in al montar la gráfica
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* ── Título de sección ── */}
      <p
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: '0.75rem', color: '#888888' }}
      >
        WPM History — Last 30 Days
      </p>

      {/* ── Gráfica Recharts ── */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={WPM_HISTORY}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          {/* Grid apenas visible */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#111111"
            vertical={false}
          />

          {/* Eje X: fechas en font-mono pequeño */}
          <XAxis
            dataKey="date"
            tick={{ fill: '#333333', fontFamily: 'monospace', fontSize: 11 }}
            axisLine={{ stroke: '#1a1a1a' }}
            tickLine={false}
            // Mostrar solo cada 5 fechas para no saturar
            interval={4}
          />

          {/* Eje Y: valores WPM */}
          <YAxis
            tick={{ fill: '#333333', fontFamily: 'monospace', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />

          {/* Tooltip personalizado — se pasa como función para que Recharts inyecte los props */}
          <Tooltip content={(props) => <CustomTooltip {...props} />} />

          {/* Línea WPM: cian, strokeWidth 2 */}
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#00ffff"
            strokeWidth={2}
            dot={false}
            // Punto activo al hover: cian con borde negro
            activeDot={{
              r: 4,
              fill: '#00ffff',
              stroke: '#000000',
              strokeWidth: 2,
            }}
          />

          {/* Línea Precision: lima, strokeWidth 1.5, dashed */}
          <Line
            type="monotone"
            dataKey="precision"
            stroke="#00ff00"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{
              r: 3,
              fill: '#00ff00',
              stroke: '#000000',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* ── Leyenda manual ── */}
      <div className="flex items-center gap-6">
        {/* Leyenda WPM */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-0.5 w-4 rounded"
            style={{ backgroundColor: '#00ffff' }}
            aria-hidden="true"
          />
          <span className="font-mono" style={{ fontSize: '11px', color: '#444444' }}>
            WPM
          </span>
        </div>

        {/* Leyenda Precision (línea punteada) */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block"
            style={{
              width: 16,
              height: 1.5,
              backgroundImage: 'repeating-linear-gradient(to right, #00ff00 0, #00ff00 4px, transparent 4px, transparent 6px)',
            }}
            aria-hidden="true"
          />
          <span className="font-mono" style={{ fontSize: '11px', color: '#444444' }}>
            Precision
          </span>
        </div>
      </div>
    </motion.div>
  );
}
