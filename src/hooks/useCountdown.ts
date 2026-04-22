import { useState, useCallback } from 'react';
import { useInterval } from './useInterval';

/**
 * useCountdown.ts
 * Hook de cuenta regresiva para el temporizador del motor de tipeo.
 *
 * Recibe el total de segundos y si está activo.
 * Retorna el tiempo restante, si expiró y una función de reset.
 *
 * @param totalSeconds  Duración total de la sesión en segundos
 * @param isActive      Si true, el contador corre; si false, está pausado
 */
export function useCountdown(totalSeconds: number, isActive: boolean) {
  // Tiempo restante en segundos — inicia en el total
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  // Decrementa 1 segundo en cada tick del intervalo
  // El intervalo solo corre cuando isActive=true y timeLeft>0
  useInterval(
    useCallback(() => {
      setTimeLeft((prev) => {
        // No decrementar por debajo de 0
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, []),
    // Pausa el intervalo si no está activo o si ya llegó a 0
    isActive && timeLeft > 0 ? 1000 : null,
  );

  // El timer expiró cuando llega exactamente a 0
  const isExpired = timeLeft === 0;

  // Reinicia el contador al valor original
  const reset = useCallback(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds]);

  return { timeLeft, isExpired, reset };
}
