'use client';

/**
 * useProgress.ts
 * Hook para obtener el resumen de progreso del usuario desde el backend.
 * Llama a GET /progress/summary con el token JWT del usuario autenticado.
 */

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ProgressSummary {
  avgWpm7Days:       number;
  bestWpm:           number;
  totalSessions:     number;
  completedSessions: number;
  favoriteLanguage:  string | null;
  difficultKeys:     string[];
  recentHistory:     { date: string; avgWpm: number; sessions: number }[];
}

interface UseProgressResult {
  data:    ProgressSummary | null;
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress(): UseProgressResult {
  const [data, setData]       = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tick, setTick]       = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAPI<{ data: ProgressSummary }>('/progress/summary');
        if (!cancelled) setData(response.data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Error al cargar el progreso';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tick]);

  // Permite refrescar los datos manualmente
  function refetch() { setTick((t) => t + 1); }

  return { data, loading, error, refetch };
}
