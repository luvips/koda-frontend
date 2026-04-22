/**
 * DecorativePanel.tsx
 * Columna izquierda decorativa de la página de login.
 *
 * Server Component — sin interactividad, solo visual.
 *
 * Contiene:
 *  - Marca de agua "AWOS" rotada, casi invisible
 *  - Grid de puntos (igual al hero)
 *  - Terminal mock con código Python/TS y syntax highlight estático
 *  - Badge inferior con features de AWOS
 */

// ─── Líneas de código mock para la terminal ───────────────────────────────────

/**
 * Fragmentos de código estáticos que simulan una sesión de práctica activa.
 * Cada token tiene un color semántico de la paleta cyberpunk.
 */
function MockTerminal() {
  return (
    <div
      className="w-full rounded-lg border p-5"
      style={{
        backgroundColor: 'rgba(0,255,255,0.02)',
        borderColor: 'rgba(0,255,255,0.08)',
      }}
      aria-hidden="true"
    >
      {/* Barra de título de la terminal mock */}
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#28c840' }} />
        <span className="ml-3 font-mono text-xs" style={{ color: '#333333' }}>
          koda — practice.py
        </span>
      </div>

      {/* Código Python con syntax highlight estático */}
      <pre className="font-mono text-xs leading-7 overflow-hidden">
        <code>
          {/* Línea 1: import */}
          <span style={{ color: '#ffff00' }}>import </span>
          <span style={{ color: '#888888' }}>typing</span>
          {'\n'}

          {/* Línea 2: type alias */}
          <span style={{ color: '#ffff00' }}>from </span>
          <span style={{ color: '#888888' }}>dataclasses </span>
          <span style={{ color: '#ffff00' }}>import </span>
          <span style={{ color: '#888888' }}>dataclass</span>
          {'\n\n'}

          {/* Línea 3: decorador */}
          <span style={{ color: '#00ffff' }}>@dataclass</span>
          {'\n'}

          {/* Línea 4: class */}
          <span style={{ color: '#ffff00' }}>class </span>
          <span style={{ color: '#00ffff' }}>TypingSession</span>
          <span style={{ color: '#666666' }}>:</span>
          {'\n'}

          {/* Línea 5: campo wpm */}
          <span style={{ color: '#666666' }}>{'    '}wpm: </span>
          <span style={{ color: '#ffff00' }}>int</span>
          {'\n'}

          {/* Línea 6: campo precision */}
          <span style={{ color: '#666666' }}>{'    '}precision: </span>
          <span style={{ color: '#ffff00' }}>float</span>
          {'\n'}

          {/* Línea 7: campo language */}
          <span style={{ color: '#666666' }}>{'    '}language: </span>
          <span style={{ color: '#ffff00' }}>str</span>
          {'\n\n'}

          {/* Línea 8: método */}
          <span style={{ color: '#666666' }}>{'    '}</span>
          <span style={{ color: '#ffff00' }}>def </span>
          <span style={{ color: '#00ffff' }}>is_valid</span>
          <span style={{ color: '#666666' }}>(self) -{'>'} </span>
          <span style={{ color: '#ffff00' }}>bool</span>
          <span style={{ color: '#666666' }}>:</span>
          {'\n'}

          {/* Línea 9: return */}
          <span style={{ color: '#666666' }}>{'        '}</span>
          <span style={{ color: '#ffff00' }}>return </span>
          <span style={{ color: '#666666' }}>self.wpm {'>'} </span>
          <span style={{ color: '#00ff00' }}>0</span>

          {/* Cursor parpadeante al final */}
          <span
            className="animate-blink ml-0.5 inline-block h-[1em] w-[0.5em] align-middle"
            style={{ backgroundColor: '#00ffff' }}
          />
        </code>
      </pre>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DecorativePanel() {
  return (
    <div
      className="relative hidden h-full min-h-screen flex-col items-center justify-center overflow-hidden px-10 py-16 lg:flex"
      style={{
        backgroundColor: '#050505',
        // Grid de puntos — igual al hero
        backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* ── Marca de agua "AWOS" rotada ── */}
      {/*
       * Texto enorme casi invisible que actúa como fondo de marca.
       * rotate(-20deg) para efecto diagonal, color casi transparente.
       */}
      <span
        className="font-jetbrains pointer-events-none absolute select-none font-bold"
        style={{
          fontSize: 'clamp(8rem, 20vw, 16rem)',
          color: 'rgba(0,255,255,0.04)',
          transform: 'rotate(-20deg)',
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        KODA
      </span>

      {/* ── Contenido principal de la columna ── */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-8">

        {/* Logo pequeño */}
        <span
          className="font-mono text-sm font-bold tracking-[0.3em]"
          style={{
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0,255,255,0.4)',
          }}
        >
          KODA
        </span>

        {/* Tagline */}
        <div className="flex flex-col gap-2">
          <h2
            className="font-jetbrains text-2xl font-bold text-white"
            style={{ lineHeight: 1.2 }}
          >
            Type Code.
            <br />
            <span style={{ color: '#00ffff' }}>Level Up.</span>
          </h2>
          <p className="font-mono text-xs leading-relaxed" style={{ color: '#333333' }}>
            Practica con snippets reales y mide tu velocidad en tiempo real.
          </p>        </div>

        {/* Terminal mock con código */}
        <MockTerminal />

        {/* Badge inferior con features */}
        <div
          className="inline-flex items-center gap-2 self-start rounded border px-3 py-1.5"
          style={{
            borderColor: 'rgba(0,255,255,0.15)',
            backgroundColor: 'rgba(0,255,255,0.03)',
          }}
        >
          <span
            className="font-mono text-xs tracking-wide"
            style={{ color: '#444444' }}
          >
            4 lenguajes · Snippets reales · Métricas en tiempo real
          </span>
        </div>
      </div>
    </div>
  );
}
