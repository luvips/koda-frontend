/**
 * dashboard-mock.ts
 * Adaptadores y re-exportaciones para el dashboard de AWOS.
 *
 * Este archivo transforma los datos centrales de mock-data.ts
 * al formato que necesitan los componentes del dashboard
 * (gráfica Recharts, tabla de sesiones, heatmap de teclas).
 *
 * REGLA: No define datos propios — todo viene de mock-data.ts.
 */

import {
  MOCK_SESSIONS,
  MOCK_PROGRESS,
  MOCK_DIFFICULT_KEYS,
  MOCK_USER,
  type TypingSession,
  type LanguageSlug,
  type Difficulty,
  type SessionStatus,
} from './mock-data';

// ─── Re-exportaciones de tipos para los componentes del dashboard ─────────────

// Los componentes del dashboard importan estos tipos desde aquí
// para no depender directamente de mock-data (separación de capas).
export type { SessionStatus, LanguageSlug, Difficulty };

// ─── Tipo: fila de la tabla de sesiones ───────────────────────────────────────

/**
 * Forma que necesita SessionsTable para renderizar cada fila.
 * Es un subconjunto de TypingSession con los campos visibles en la tabla.
 */
export interface SessionRow {
  id:         string;
  date:       string;
  language:   LanguageSlug;
  difficulty: Difficulty;
  wpm:        number;
  precision:  number;
  status:     SessionStatus;
}

// ─── Tipo: punto de datos para la gráfica Recharts ───────────────────────────

/**
 * Formato que necesita WpmChart para cada punto del LineChart.
 * La fecha se formatea a "MM/DD" para el eje X.
 */
export interface WpmDataPoint {
  date:      string;   // "MM/DD" para el eje X de Recharts
  wpm:       number;
  precision: number;
}

// ─── Helper: formatear fecha ISO a "MM/DD" ───────────────────────────────────

/**
 * Convierte una fecha ISO (YYYY-MM-DD) al formato "MM/DD" para los ejes.
 */
function toChartDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${m}/${d}`;
}

// ─── RECENT_SESSIONS: las 8 sesiones más recientes para la tabla ──────────────

/**
 * Las 8 sesiones más recientes, ordenadas de más nueva a más antigua.
 * Mapeadas al formato SessionRow que necesita la tabla del dashboard.
 */
export const RECENT_SESSIONS: SessionRow[] = MOCK_SESSIONS
  .slice()
  // Ordena por fecha descendente (más reciente primero)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 8)
  .map((s: TypingSession): SessionRow => ({
    id:         s.id,
    date:       s.date,
    language:   s.language,
    difficulty: s.difficulty,
    wpm:        s.wpm,
    precision:  s.precision,
    status:     s.status,
  }));

// ─── WPM_HISTORY: 30 puntos para la gráfica Recharts ─────────────────────────

/**
 * Historial de WPM y precisión de los últimos 30 días.
 * Transformado desde MOCK_PROGRESS al formato que necesita Recharts.
 */
export const WPM_HISTORY: WpmDataPoint[] = MOCK_PROGRESS.map((day) => ({
  date:      toChartDate(day.date),
  wpm:       day.wpm,
  precision: day.precision,
}));

// ─── DIFFICULT_KEYS: re-exportación directa desde mock-data ──────────────────

/**
 * Mapa de tecla → errores para el heatmap del dashboard.
 * Re-exportado directamente desde mock-data.ts sin transformación.
 */
export { MOCK_DIFFICULT_KEYS as DIFFICULT_KEYS };

// ─── MOCK_DASHBOARD_USER: datos del usuario para el sidebar ──────────────────

/**
 * Datos del usuario para el sidebar del dashboard.
 * Derivados de MOCK_USER y MOCK_SESSIONS para consistencia.
 */
export const MOCK_DASHBOARD_USER = {
  // Nombre de usuario derivado del email (antes del @)
  username:      MOCK_USER.name,
  email:         MOCK_USER.email,
  // Total de sesiones del historial mock
  totalSessions: MOCK_SESSIONS.length,
  // Mejor WPM de todas las sesiones completadas
  bestWpm:       Math.max(
    ...MOCK_SESSIONS
      .filter((s) => s.status === 'COMPLETED')
      .map((s) => s.wpm),
  ),
  // Lenguaje favorito: el que aparece más veces en las sesiones
  favLanguage: (() => {
    const counts: Record<string, number> = {};
    MOCK_SESSIONS.forEach((s) => {
      counts[s.language] = (counts[s.language] ?? 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'TypeScript';
  })(),
};
