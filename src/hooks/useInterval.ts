import { useEffect, useRef } from 'react';

/**
 * useInterval.ts
 * Hook personalizado para intervalos que se limpian correctamente.
 *
 * Basado en el artículo de Dan Abramov:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * El truco clave: guardamos el callback en un ref para que el intervalo
 * siempre llame a la versión más reciente sin necesidad de recrearlo.
 * Esto evita el problema clásico de closures stale en setInterval.
 *
 * @param callback  Función a ejecutar en cada tick
 * @param delay     Milisegundos entre ticks; null pausa el intervalo
 */
export function useInterval(callback: () => void, delay: number | null) {
  // Ref que siempre apunta al callback más reciente
  const savedCallback = useRef<() => void>(callback);

  // Actualiza el ref cada vez que cambia el callback
  // (sin recrear el intervalo)
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Crea y limpia el intervalo cuando cambia el delay
  useEffect(() => {
    // delay null → intervalo pausado (útil para pausar el timer)
    if (delay === null) return;

    // Crea el intervalo que llama siempre al callback más reciente
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    // Limpieza: cancela el intervalo al desmontar o cambiar delay
    return () => clearInterval(id);
  }, [delay]);
}
