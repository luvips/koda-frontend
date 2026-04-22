'use client';

/**
 * GalacticBackground.tsx
 * Fondo galáctico animado para el hero de la landing de KODA.
 *
 * Capas (de atrás hacia adelante):
 *  1. Estrellas parpadeantes — 3 tamaños/velocidades para profundidad
 *  2. Nebulosas — manchas de color que derivan lentamente
 *  3. Partículas flotantes — polvo estelar que sube
 *
 * Todo CSS puro — sin canvas, sin WebGL, sin librerías extra.
 * pointer-events: none en todo para no interferir con el contenido.
 */

// ─── Datos deterministas de estrellas ────────────────────────────────────────
// Posiciones fijas para evitar hidratación mismatch (no usar Math.random()).

const STARS = [
  // [left%, top%, size-px, delay-s, clase]
  [5,  8,  1, 0.0, 'star-slow'],  [12, 22, 2, 1.2, 'star-mid'],
  [18, 5,  1, 2.1, 'star-fast'],  [25, 35, 1, 0.7, 'star-slow'],
  [32, 15, 2, 1.8, 'star-mid'],   [38, 48, 1, 3.0, 'star-fast'],
  [44, 7,  1, 0.4, 'star-slow'],  [50, 28, 2, 2.5, 'star-mid'],
  [56, 62, 1, 1.1, 'star-fast'],  [63, 18, 1, 0.9, 'star-slow'],
  [70, 42, 2, 2.2, 'star-mid'],   [76, 10, 1, 1.6, 'star-fast'],
  [82, 55, 1, 0.3, 'star-slow'],  [88, 30, 2, 2.8, 'star-mid'],
  [94, 72, 1, 1.4, 'star-fast'],  [8,  80, 1, 0.6, 'star-slow'],
  [20, 68, 2, 1.9, 'star-mid'],   [35, 85, 1, 2.4, 'star-fast'],
  [48, 75, 1, 0.2, 'star-slow'],  [60, 90, 2, 1.7, 'star-mid'],
  [72, 78, 1, 3.1, 'star-fast'],  [85, 88, 1, 0.8, 'star-slow'],
  [92, 60, 2, 2.0, 'star-mid'],   [15, 50, 1, 1.3, 'star-fast'],
  [28, 92, 1, 0.5, 'star-slow'],  [42, 58, 2, 2.6, 'star-mid'],
  [55, 40, 1, 1.0, 'star-fast'],  [68, 25, 1, 2.3, 'star-slow'],
  [78, 65, 2, 0.1, 'star-mid'],   [90, 45, 1, 1.5, 'star-fast'],
  [3,  38, 1, 2.7, 'star-slow'],  [97, 20, 2, 0.9, 'star-mid'],
  [22, 12, 1, 1.8, 'star-fast'],  [65, 82, 1, 2.1, 'star-slow'],
  [47, 95, 2, 0.4, 'star-mid'],   [80, 3,  1, 1.6, 'star-fast'],
] as const;

// ─── Partículas flotantes ─────────────────────────────────────────────────────

const PARTICLES = [
  [10, 70, '#00ffff', 6,  0.0, 'particle-a'],
  [25, 85, '#ff00ff', 4,  1.5, 'particle-b'],
  [40, 60, '#00ff00', 5,  3.0, 'particle-a'],
  [55, 90, '#ffff00', 3,  0.8, 'particle-b'],
  [70, 75, '#00ffff', 4,  2.2, 'particle-a'],
  [85, 65, '#ff00ff', 3,  4.0, 'particle-b'],
  [15, 95, '#00ff00', 5,  1.0, 'particle-a'],
  [60, 80, '#00ffff', 3,  2.8, 'particle-b'],
  [90, 88, '#ffff00', 4,  0.5, 'particle-a'],
  [35, 72, '#ff00ff', 3,  3.5, 'particle-b'],
] as const;

// ─── Componente principal ─────────────────────────────────────────────────────

export function GalacticBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Capa 1: Nebulosas ── */}
      {/*
       * 3 manchas de color que derivan lentamente.
       * Colores de la paleta KODA con opacidad muy baja.
       */}

      {/* Nebulosa cian — esquina superior izquierda */}
      <div
        className="nebula nebula-1"
        style={{
          width: 600,
          height: 600,
          left: '-10%',
          top: '-10%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Nebulosa magenta — esquina inferior derecha */}
      <div
        className="nebula nebula-2"
        style={{
          width: 500,
          height: 500,
          right: '-8%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(255,0,255,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Nebulosa lima — centro superior */}
      <div
        className="nebula nebula-3"
        style={{
          width: 400,
          height: 400,
          left: '35%',
          top: '5%',
          background: 'radial-gradient(circle, rgba(0,255,0,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Nebulosa amarilla — centro inferior */}
      <div
        className="nebula nebula-1"
        style={{
          width: 350,
          height: 350,
          left: '20%',
          bottom: '5%',
          background: 'radial-gradient(circle, rgba(255,255,0,0.05) 0%, transparent 70%)',
          animationDelay: '8s',
        }}
      />

      {/* ── Capa 2: Estrellas parpadeantes ── */}
      {STARS.map(([left, top, size, delay, cls], i) => (
        <div
          key={i}
          className={`star ${cls}`}
          style={{
            left:  `${left}%`,
            top:   `${top}%`,
            width:  size,
            height: size,
            '--dur': `${2 + (i % 4)}s`,
            animationDelay: `${delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Capa 3: Partículas flotantes ── */}
      {PARTICLES.map(([left, top, color, size, delay, cls], i) => (
        <div
          key={i}
          className={`particle ${cls}`}
          style={{
            left:   `${left}%`,
            top:    `${top}%`,
            width:   size,
            height:  size,
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            '--dur': `${5 + (i % 5)}s`,
            animationDelay: `${delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Línea de horizonte galáctica ── */}
      {/*
       * Línea horizontal sutil en el centro del hero
       * que pulsa como un horizonte de evento.
       */}
      <div
        className="horizon-line absolute"
        style={{
          left: '5%',
          right: '5%',
          top: '50%',
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(0,255,255,0.15) 20%, rgba(0,255,255,0.3) 50%, rgba(0,255,255,0.15) 80%, transparent)',
        }}
      />
    </div>
  );
}
