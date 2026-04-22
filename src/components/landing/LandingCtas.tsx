'use client';

/**
 * LandingCtas.tsx
 * Botones CTA de la landing page como Client Component.
 *
 * Se separan del Server Component (page.tsx) porque CyberButton
 * usa framer-motion y requiere 'use client'.
 *
 * Exporta dos variantes:
 *  - HeroCta      → "Start Typing →" en el hero
 *  - FinalCta     → "Create Free Account →" en la sección final
 */

import Link from 'next/link';
import { CyberButton } from '@/components/ui/CyberButton';

// ─── CTA del Hero ─────────────────────────────────────────────────────────────

export function HeroCta() {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      {/* Botón principal — lleva a la página de test */}
      <Link href="/test" tabIndex={-1}>
        <CyberButton variant="primary" size="lg">
          Comenzar a escribir →
        </CyberButton>
      </Link>

      {/* Texto de apoyo — sin fricción para el usuario */}
      <span
        className="font-mono text-xs tracking-widest"
        style={{ color: '#333333' }}
      >
        No requiere cuenta para probar
      </span>
    </div>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

export function FinalCta() {
  return (
    /* Botón de registro — lleva a la página de signup (mock por ahora) */
    <Link href="/signup" tabIndex={-1}>
      <CyberButton variant="primary" size="lg">
        Crear cuenta gratis →
      </CyberButton>
    </Link>
  );
}
