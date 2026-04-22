/**
 * store.ts
 * Store global de AWOS usando Zustand v5 con TypeScript strict.
 *
 * Organización:
 *  - AuthSlice    → estado de autenticación del usuario
 *  - SessionSlice → estado de la sesión de escritura activa
 *  - UISlice      → estado de la interfaz (modales, etc.)
 *
 * NOTA: No se usa persist middleware; el estado vive solo en memoria.
 * Los datos iniciales provienen de src/lib/mock-data.ts.
 */

'use client';

import { create } from 'zustand';
import {
  MOCK_USER,
  MOCK_SNIPPETS,
  getSnippetsByLanguage,
  type User,
  type Snippet,
  type LanguageSlug,
  type Difficulty,
  type SessionResult,
} from './mock-data';

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 1: Auth
// Gestiona la identidad del usuario dentro de la sesión de navegador.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthSlice {
  /** Usuario actualmente autenticado; null si no hay sesión */
  user: User | null;

  /** Indica si hay una sesión activa */
  isAuthenticated: boolean;

  /**
   * loginMock
   * Simula una llamada a una API de autenticación con un delay de red.
   *
   * Credenciales válidas: "test@awos.dev" / "Test1234!"
   * - Si son correctas → establece el usuario y retorna true.
   * - Si son incorrectas → no modifica el estado y retorna false.
   */
  loginMock: (email: string, password: string) => Promise<boolean>;

  /**
   * logout
   * Limpia la sesión del usuario en memoria.
   * No realiza ninguna llamada a API.
   */
  logout: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 2: Session
// Controla el snippet activo, el lenguaje/dificultad seleccionados
// y el último resultado registrado en memoria.
// ─────────────────────────────────────────────────────────────────────────────

interface SessionSlice {
  /** Snippet que el usuario está escribiendo actualmente; null si no hay sesión activa */
  currentSnippet: Snippet | null;

  /** Lenguaje de programación seleccionado por el usuario */
  activeLanguage: LanguageSlug;

  /** Nivel de dificultad seleccionado por el usuario */
  activeDifficulty: Difficulty;

  /** Último resultado de sesión guardado en memoria; null si no hay historial */
  lastResult: SessionResult | null;

  /**
   * setLanguage
   * Cambia el lenguaje activo. No recarga el snippet automáticamente;
   * el usuario debe llamar a loadNewSnippet() después si lo desea.
   */
  setLanguage: (lang: LanguageSlug) => void;

  /**
   * setDifficulty
   * Cambia la dificultad activa. Igual que setLanguage, no recarga el snippet.
   */
  setDifficulty: (diff: Difficulty) => void;

  /**
   * loadNewSnippet
   * Selecciona aleatoriamente un snippet de MOCK_SNIPPETS que coincida
   * con el activeLanguage y activeDifficulty actuales.
   *
   * Si no hay snippets disponibles para esa combinación, currentSnippet
   * queda en null (sin lanzar error).
   */
  loadNewSnippet: () => void;

  /**
   * saveResult
   * Persiste el resultado de una sesión completada en memoria.
   * Sobreescribe el resultado anterior (solo se guarda el último).
   * No realiza ninguna llamada a API.
   */
  saveResult: (result: SessionResult) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLICE 3: UI
// Estado de elementos de interfaz que necesitan coordinación global,
// como modales que se abren desde distintos componentes.
// ─────────────────────────────────────────────────────────────────────────────

interface UISlice {
  /** Controla la visibilidad del modal de resultados post-sesión */
  isResultModalOpen: boolean;

  /** Abre el modal de resultados */
  openResultModal: () => void;

  /** Cierra el modal de resultados */
  closeResultModal: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tipo completo del store (unión de los tres slices)
// ─────────────────────────────────────────────────────────────────────────────

type StoreState = AuthSlice & SessionSlice & UISlice;

// ─────────────────────────────────────────────────────────────────────────────
// Creación del store con Zustand v5
// ─────────────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>()((set, get) => ({
  // ── Auth: estado inicial ──────────────────────────────────────────────────

  /** Sin usuario al arrancar la aplicación */
  user: null,
  isAuthenticated: false,

  // ── Auth: acciones ────────────────────────────────────────────────────────

  loginMock: async (email: string, password: string): Promise<boolean> => {
    // Simula latencia de red (800 ms) antes de "consultar" el servidor
    await new Promise<void>((r) => setTimeout(r, 800));

    // Credenciales hardcodeadas para el entorno de desarrollo/mock
    const VALID_EMAIL = 'test@awos.dev';
    const VALID_PASSWORD = 'Test1234!';

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Credenciales correctas → autenticar con el usuario mock
      set({
        user: MOCK_USER,
        isAuthenticated: true,
      });
      return true;
    }

    // Credenciales incorrectas → no modificar el estado
    return false;
  },

  logout: () => {
    // Limpia la sesión del usuario; el resto del estado se mantiene intacto
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  // ── Session: estado inicial ───────────────────────────────────────────────

  /** Sin snippet cargado al iniciar */
  currentSnippet: null,

  /** Lenguaje por defecto al arrancar */
  activeLanguage: 'typescript',

  /** Dificultad por defecto al arrancar */
  activeDifficulty: 'EASY',

  /** Sin resultado previo al iniciar */
  lastResult: null,

  // ── Session: acciones ─────────────────────────────────────────────────────

  setLanguage: (lang: LanguageSlug) => {
    // Actualiza el lenguaje activo en el store
    set({ activeLanguage: lang });
  },

  setDifficulty: (diff: Difficulty) => {
    // Actualiza la dificultad activa en el store
    set({ activeDifficulty: diff });
  },

  loadNewSnippet: () => {
    const { activeLanguage, activeDifficulty } = get();

    // Filtra los snippets disponibles para la combinación actual
    // MOCK_SNIPPETS es ahora Record<LanguageSlug, Snippet[]>
    const candidates = (getSnippetsByLanguage(activeLanguage)).filter(
      (s) => s.difficulty === activeDifficulty,
    );

    if (candidates.length === 0) {
      // No hay snippets para esta combinación; se deja currentSnippet en null
      set({ currentSnippet: null });
      return;
    }

    // Selección aleatoria entre los candidatos disponibles
    const randomIndex = Math.floor(Math.random() * candidates.length);
    set({ currentSnippet: candidates[randomIndex] });
  },

  saveResult: (result: SessionResult) => {
    // Guarda el resultado en memoria; sobreescribe el anterior
    set({ lastResult: result });
  },

  // ── UI: estado inicial ────────────────────────────────────────────────────

  /** El modal de resultados comienza cerrado */
  isResultModalOpen: false,

  // ── UI: acciones ──────────────────────────────────────────────────────────

  openResultModal: () => {
    set({ isResultModalOpen: true });
  },

  closeResultModal: () => {
    set({ isResultModalOpen: false });
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Hooks de conveniencia
// Evitan repetir selectores en cada componente que consuma el store.
// Usar estos hooks en lugar de useStore directamente cuando sea posible.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useUser
 * Retorna el usuario autenticado o null.
 * Útil para componentes que solo necesitan saber quién está logueado.
 */
export const useUser = () => useStore((s) => s.user);

/**
 * useSession
 * Retorna el snippet activo, el lenguaje y la dificultad seleccionados.
 * Útil para el componente de escritura y la barra de configuración.
 */
export const useSession = () =>
  useStore((s) => ({
    snippet: s.currentSnippet,
    lang: s.activeLanguage,
    diff: s.activeDifficulty,
  }));

/**
 * useLastResult
 * Retorna el último SessionResult guardado en memoria, o null.
 * Útil para el modal de resultados y el historial de sesiones.
 */
export const useLastResult = () => useStore((s) => s.lastResult);
