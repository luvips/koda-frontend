'use client';

/**
 * ProtectedRoute.tsx
 * Protege páginas que requieren autenticación.
 *
 * Lee el token directamente de localStorage y verifica su expiración
 * de forma síncrona antes del primer render, evitando race conditions
 * con el store de Zustand.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

// ─── Helper: verificar token en localStorage ──────────────────────────────────

function checkLocalToken(): boolean {
  if (typeof window === 'undefined') return false

  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = payload.exp && Date.now() / 1000 > payload.exp
    if (isExpired) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
    return true
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

// ─── Pantalla de acceso denegado ──────────────────────────────────────────────

function AccessDeniedScreen() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6"
      style={{ backgroundColor: '#000000' }}
    >
      <script
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js"
        type="module"
        async
      />

      {/* @ts-expect-error — web component externo sin tipos */}
      <dotlottie-wc
        src="https://lottie.host/37bf13b7-c3f2-4aa3-8fa6-0d706cd2a16e/v4egms5io1.lottie"
        style={{ width: '280px', height: '280px' }}
        autoplay
        loop
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <h2
          className="font-mono text-xl font-bold tracking-widest uppercase"
          style={{ color: '#00ffff', textShadow: '0 0 12px rgba(0,255,255,0.4)' }}
        >
          Acceso restringido
        </h2>
        <p className="font-mono text-sm" style={{ color: '#444444' }}>
          Necesitas iniciar sesión para ver el dashboard.
        </p>
        <p className="font-mono text-xs" style={{ color: '#333333' }}>
          El alien también quiere que te registres.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={() => router.push('/login')}
          className="rounded border px-6 py-2.5 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]"
          style={{
            borderColor: '#00ffff',
            color: '#00ffff',
            backgroundColor: 'rgba(0,255,255,0.06)',
            boxShadow: '0 0 12px rgba(0,255,255,0.15)',
          }}
        >
          Iniciar sesión →
        </button>
        <button
          onClick={() => router.push('/login')}
          className="font-mono text-xs transition-colors hover:text-[#00ffff] focus-visible:outline-none"
          style={{ color: '#333333' }}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const initAuth = useStore((s) => s.initAuth);

  // Verificamos el token directamente en el estado inicial del componente
  // useState con función lazy: se ejecuta una sola vez en el cliente
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar token de forma síncrona
    const hasValidToken = checkLocalToken();

    if (hasValidToken) {
      // Token válido — inicializar el store también
      initAuth();
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [initAuth]);

  // Mientras verifica (null) → pantalla negra
  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#000000' }}>
        <span className="font-mono text-xs" style={{ color: '#1a1a1a' }}>•••</span>
      </div>
    );
  }

  // Sin token válido → pantalla alien
  if (!isAuthorized) {
    return <AccessDeniedScreen />;
  }

  // Token válido → contenido protegido
  return <>{children}</>;
}
