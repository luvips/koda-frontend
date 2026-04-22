/**
 * mock-data.ts
 * Fuente única de verdad para todos los datos mock de AWOS.
 *
 * REGLA: Ningún componente hardcodea datos inline.
 *        Todo el frontend ilustrativo importa exclusivamente de este archivo.
 *
 * Estructura:
 *  1. Tipos TypeScript (deben coincidir con el backend cuando se integre)
 *  2. Datos mock: Languages, Snippets, User, Sessions, Progress, DifficultKeys
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 1 — TIPOS
// Estos tipos deben coincidir EXACTAMENTE con los del backend cuando se integre.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Enums / union types ──────────────────────────────────────────────────────

/**
 * Niveles de dificultad de los snippets.
 * Uppercase para coincidir con la convención del backend.
 */
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

/**
 * Estado final de una sesión de tipeo.
 * INCOMPLETE: el usuario abandonó antes de terminar.
 */
export type SessionStatus = 'COMPLETED' | 'INVALID' | 'INCOMPLETE';

/**
 * Slugs de los lenguajes de programación disponibles en AWOS.
 * Deben coincidir con los IDs del backend.
 */
export type LanguageSlug = 'python' | 'typescript' | 'javascript' | 'java';

// ─── Interfaces de entidades ──────────────────────────────────────────────────

/**
 * Lenguaje de programación disponible en la plataforma.
 * El campo `icon` es un emoji o carácter representativo para la UI.
 */
export interface Language {
  id:   string;
  name: string;
  slug: LanguageSlug;
  icon: string;
}

/**
 * Fragmento de código para practicar tipeo.
 * `specialCharacters` indica si el snippet tiene muchos símbolos especiales
 * (útil para filtrar por dificultad de teclado, no de lógica).
 */
export interface Snippet {
  id:                string;
  languageId:        string;
  language:          Language;
  code:              string;
  difficulty:        Difficulty;
  specialCharacters: boolean;
  tags:              string[];
}

/**
 * Sesión de tipeo completada o abandonada.
 * Registra todas las métricas de rendimiento del usuario.
 */
export interface TypingSession {
  id:            string;
  snippetId:     string;
  language:      LanguageSlug;
  difficulty:    Difficulty;
  wpm:           number;
  cpm:           number;
  precision:     number;
  totalErrors:   number;
  difficultKeys: string[];
  status:        SessionStatus;
  date:          string;   // ISO 8601 string
}

/**
 * Usuario autenticado en la plataforma.
 * `name` es el nombre para mostrar (no el username interno).
 */
export interface User {
  id:    string;
  name:  string;
  email: string;
}

/**
 * Punto de datos diario para la gráfica de progreso.
 * Agrega todas las sesiones de un día en un solo registro.
 */
export interface ProgressDay {
  date:      string;   // ISO 8601 string (solo la parte de fecha)
  wpm:       number;   // WPM promedio del día
  precision: number;   // Precisión promedio del día (0–100)
  sessions:  number;   // Número de sesiones completadas ese día
}

/**
 * Resultado de una sesión de escritura (usado por el motor de tipeo local).
 * Se diferencia de TypingSession en que no tiene ID ni se persiste.
 */
export interface SessionResult {
  wpm:           number;
  cpm:           number;
  precision:     number;
  totalErrors:   number;
  difficultKeys: string[];
  status:        'COMPLETED' | 'INVALID';
  durationMs:    number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 2 — HELPERS INTERNOS
// Funciones de utilidad para generar fechas relativas en los datos mock.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Retorna una fecha ISO (YYYY-MM-DD) restando `n` días al día de hoy.
 * Usado para generar fechas realistas en sesiones y progreso.
 */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 3 — MOCK_LANGUAGES
// Los 4 lenguajes disponibles en AWOS v1.0.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lista de lenguajes disponibles en la plataforma.
 * El `id` debe coincidir con el `languageId` de los snippets.
 */
export const MOCK_LANGUAGES: Language[] = [
  {
    id:   'lang_python',
    name: 'Python',
    slug: 'python',
    icon: '🐍',
  },
  {
    id:   'lang_typescript',
    name: 'TypeScript',
    slug: 'typescript',
    icon: '🔷',
  },
  {
    id:   'lang_javascript',
    name: 'JavaScript',
    slug: 'javascript',
    icon: '🟨',
  },
  {
    id:   'lang_java',
    name: 'Java',
    slug: 'java',
    icon: '☕',
  },
];

// ─── Helper: buscar Language por slug ────────────────────────────────────────

/**
 * Retorna el objeto Language correspondiente a un slug.
 * Lanza un error si el slug no existe (para detectar inconsistencias en dev).
 */
function getLang(slug: LanguageSlug): Language {
  const lang = MOCK_LANGUAGES.find((l) => l.slug === slug);
  if (!lang) throw new Error(`[mock-data] Language not found: ${slug}`);
  return lang;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 4 — MOCK_SNIPPETS
// 2 snippets por lenguaje con código REAL (no lorem ipsum).
// Organizados como Record<LanguageSlug, Snippet[]> para acceso O(1).
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Colección de snippets indexada por lenguaje.
 * Cada lenguaje tiene al menos 2 snippets de dificultad variada.
 */
export const MOCK_SNIPPETS: Record<LanguageSlug, Snippet[]> = {

  // ── Python ──────────────────────────────────────────────────────────────────
  // Snippets de Python: función recursiva + list comprehension con filtro

  python: [
    {
      id:                'snip_py_01',
      languageId:        'lang_python',
      language:          getLang('python'),
      difficulty:        'MEDIUM',
      specialCharacters: false,
      tags:              ['recursion', 'fibonacci', 'algorithms'],
      // Función recursiva clásica: genera la secuencia de Fibonacci
      code:
`def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence`,
    },
    {
      id:                'snip_py_02',
      languageId:        'lang_python',
      language:          getLang('python'),
      difficulty:        'EASY',
      specialCharacters: false,
      tags:              ['comprehension', 'functional', 'filtering'],
      // List comprehension con filtro: patrón idiomático de Python
      code:
`def filter_evens(numbers: list[int]) -> list[int]:
    return [n for n in numbers if n % 2 == 0]

result = filter_evens(range(1, 21))
print(result)`,
    },
  ],

  // ── TypeScript ───────────────────────────────────────────────────────────────
  // Snippets de TypeScript: async/await con fetch + interfaz genérica

  typescript: [
    {
      id:                'snip_ts_01',
      languageId:        'lang_typescript',
      language:          getLang('typescript'),
      difficulty:        'MEDIUM',
      specialCharacters: true,
      tags:              ['async', 'fetch', 'api', 'generics'],
      // Función async con manejo de errores HTTP y tipo de retorno genérico
      code:
`async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(\`HTTP error: \${response.status}\`);
    }
    return response.json() as Promise<T>;
}`,
    },
    {
      id:                'snip_ts_02',
      languageId:        'lang_typescript',
      language:          getLang('typescript'),
      difficulty:        'HARD',
      specialCharacters: true,
      tags:              ['generics', 'utility-types', 'mapped-types'],
      // Tipo utilitario DeepPartial: tipo recursivo con mapped types
      code:
`type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

function mergeConfig<T>(
    defaults: T,
    overrides: DeepPartial<T>
): T {
    return { ...defaults, ...overrides } as T;
}`,
    },
  ],

  // ── JavaScript ───────────────────────────────────────────────────────────────
  // Snippets de JavaScript: Promise.all + arrow functions en pipeline

  javascript: [
    {
      id:                'snip_js_01',
      languageId:        'lang_javascript',
      language:          getLang('javascript'),
      difficulty:        'MEDIUM',
      specialCharacters: false,
      tags:              ['promises', 'async', 'parallel'],
      // Promise.all para ejecutar múltiples peticiones en paralelo
      code:
`async function fetchMultiple(urls) {
    const promises = urls.map((url) => fetch(url));
    const responses = await Promise.all(promises);
    return Promise.all(
        responses.map((res) => res.json())
    );
}`,
    },
    {
      id:                'snip_js_02',
      languageId:        'lang_javascript',
      language:          getLang('javascript'),
      difficulty:        'EASY',
      specialCharacters: false,
      tags:              ['functional', 'arrow-functions', 'pipeline'],
      // Pipeline de transformación con arrow functions y reduce
      code:
`const pipe = (...fns) => (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const process = pipe(
    (x) => x * 2,
    (x) => x + 10,
    (x) => x.toString()
);`,
    },
  ],

  // ── Java ─────────────────────────────────────────────────────────────────────
  // Snippets de Java: clase con ArrayList + método genérico con bounded type

  java: [
    {
      id:                'snip_java_01',
      languageId:        'lang_java',
      language:          getLang('java'),
      difficulty:        'MEDIUM',
      specialCharacters: true,
      tags:              ['collections', 'arraylist', 'oop'],
      // Clase con ArrayList: patrón de repositorio simple en Java
      code:
`import java.util.ArrayList;
import java.util.List;

public class UserRepository {
    private List<String> users = new ArrayList<>();

    public void add(String user) {
        users.add(user);
    }

    public List<String> getAll() {
        return new ArrayList<>(users);
    }
}`,
    },
    {
      id:                'snip_java_02',
      languageId:        'lang_java',
      language:          getLang('java'),
      difficulty:        'HARD',
      specialCharacters: true,
      tags:              ['generics', 'bounded-types', 'comparable'],
      // Método genérico con bounded type parameter (T extends Comparable)
      code:
`public class MathUtils {
    public static <T extends Comparable<T>> T max(
            T first, T second) {
        return first.compareTo(second) >= 0
            ? first
            : second;
    }
}`,
    },
  ],
};

// ─── Helper: obtener snippets como array plano ────────────────────────────────

/**
 * Retorna todos los snippets de un lenguaje como array.
 * Si el lenguaje no tiene snippets, retorna un array vacío.
 */
export function getSnippetsByLanguage(lang: LanguageSlug): Snippet[] {
  return MOCK_SNIPPETS[lang] ?? [];
}

/**
 * Selecciona un snippet aleatorio para un lenguaje dado.
 * Evita repetir el snippet actual si se pasa su id.
 */
export function getRandomSnippet(
  lang: LanguageSlug,
  currentId?: string,
): Snippet {
  const pool = getSnippetsByLanguage(lang).filter((s) => s.id !== currentId);
  const source = pool.length > 0 ? pool : getSnippetsByLanguage(lang);
  return source[Math.floor(Math.random() * source.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 5 — MOCK_USER
// Usuario de prueba para el flujo de autenticación mock.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Usuario mock para loginMock y el sidebar del dashboard.
 * Las credenciales de login son: test@awos.dev / Test1234!
 */
export const MOCK_USER: User = {
  id:    'mock-user-1',
  name:  'AWOS Tester',
  email: 'test@awos.dev',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 6 — MOCK_SESSIONS
// 23 sesiones de los últimos 30 días con datos variados y realistas.
// Distribuidas entre los 4 lenguajes y 3 dificultades.
// WPM entre 45–94, precisión entre 78–98%, mezcla de COMPLETED e INVALID.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Historial de sesiones mock.
 * Simula el progreso real de un usuario durante un mes de práctica.
 */
export const MOCK_SESSIONS: TypingSession[] = [
  // ── Semana 1 (días 0-6) — sesiones recientes ──────────────────────────────
  {
    id: 'sess_01', snippetId: 'snip_ts_01',   language: 'typescript', difficulty: 'MEDIUM',
    wpm: 94, cpm: 470, precision: 96, totalErrors: 4,
    difficultKeys: ['{', '}', '<'], status: 'COMPLETED', date: daysAgo(0),
  },
  {
    id: 'sess_02', snippetId: 'snip_py_01',   language: 'python',     difficulty: 'MEDIUM',
    wpm: 78, cpm: 390, precision: 91, totalErrors: 7,
    difficultKeys: [':', '[', ']'], status: 'COMPLETED', date: daysAgo(0),
  },
  {
    id: 'sess_03', snippetId: 'snip_js_01',   language: 'javascript', difficulty: 'EASY',
    wpm: 88, cpm: 440, precision: 82, totalErrors: 16,
    difficultKeys: ['(', ')', ';'], status: 'INVALID',   date: daysAgo(1),
  },
  {
    id: 'sess_04', snippetId: 'snip_java_01', language: 'java',       difficulty: 'MEDIUM',
    wpm: 65, cpm: 325, precision: 89, totalErrors: 8,
    difficultKeys: ['{', '}', ';'], status: 'COMPLETED', date: daysAgo(1),
  },
  {
    id: 'sess_05', snippetId: 'snip_ts_02',   language: 'typescript', difficulty: 'HARD',
    wpm: 52, cpm: 260, precision: 94, totalErrors: 3,
    difficultKeys: ['<', '>', '?'], status: 'COMPLETED', date: daysAgo(2),
  },
  {
    id: 'sess_06', snippetId: 'snip_py_02',   language: 'python',     difficulty: 'EASY',
    wpm: 83, cpm: 415, precision: 97, totalErrors: 2,
    difficultKeys: ['[', ']'],      status: 'COMPLETED', date: daysAgo(3),
  },
  {
    id: 'sess_07', snippetId: 'snip_ts_01',   language: 'typescript', difficulty: 'MEDIUM',
    wpm: 71, cpm: 355, precision: 79, totalErrors: 19,
    difficultKeys: ['{', ';', ':'], status: 'INVALID',   date: daysAgo(4),
  },
  {
    id: 'sess_08', snippetId: 'snip_js_02',   language: 'javascript', difficulty: 'HARD',
    wpm: 45, cpm: 225, precision: 88, totalErrors: 6,
    difficultKeys: ['(', ')', '='], status: 'COMPLETED', date: daysAgo(5),
  },

  // ── Semana 2 (días 7-13) ──────────────────────────────────────────────────
  {
    id: 'sess_09', snippetId: 'snip_java_02', language: 'java',       difficulty: 'HARD',
    wpm: 58, cpm: 290, precision: 85, totalErrors: 11,
    difficultKeys: ['<', '>', ';'], status: 'COMPLETED', date: daysAgo(7),
  },
  {
    id: 'sess_10', snippetId: 'snip_py_01',   language: 'python',     difficulty: 'MEDIUM',
    wpm: 72, cpm: 360, precision: 93, totalErrors: 5,
    difficultKeys: [':', '['],      status: 'COMPLETED', date: daysAgo(8),
  },
  {
    id: 'sess_11', snippetId: 'snip_ts_02',   language: 'typescript', difficulty: 'HARD',
    wpm: 61, cpm: 305, precision: 78, totalErrors: 22,
    difficultKeys: ['{', '?', '|'], status: 'INVALID',   date: daysAgo(9),
  },
  {
    id: 'sess_12', snippetId: 'snip_js_01',   language: 'javascript', difficulty: 'EASY',
    wpm: 80, cpm: 400, precision: 95, totalErrors: 4,
    difficultKeys: ['(', ')'],      status: 'COMPLETED', date: daysAgo(10),
  },
  {
    id: 'sess_13', snippetId: 'snip_java_01', language: 'java',       difficulty: 'MEDIUM',
    wpm: 67, cpm: 335, precision: 90, totalErrors: 7,
    difficultKeys: ['{', '}', '.'], status: 'COMPLETED', date: daysAgo(11),
  },

  // ── Semana 3 (días 14-20) ─────────────────────────────────────────────────
  {
    id: 'sess_14', snippetId: 'snip_py_02',   language: 'python',     difficulty: 'EASY',
    wpm: 75, cpm: 375, precision: 96, totalErrors: 3,
    difficultKeys: ['[', ']'],      status: 'COMPLETED', date: daysAgo(14),
  },
  {
    id: 'sess_15', snippetId: 'snip_ts_01',   language: 'typescript', difficulty: 'MEDIUM',
    wpm: 69, cpm: 345, precision: 88, totalErrors: 9,
    difficultKeys: ['{', ':', ';'], status: 'COMPLETED', date: daysAgo(15),
  },
  {
    id: 'sess_16', snippetId: 'snip_java_02', language: 'java',       difficulty: 'HARD',
    wpm: 53, cpm: 265, precision: 81, totalErrors: 18,
    difficultKeys: ['<', '>', '('], status: 'INVALID',   date: daysAgo(16),
  },
  {
    id: 'sess_17', snippetId: 'snip_js_02',   language: 'javascript', difficulty: 'EASY',
    wpm: 82, cpm: 410, precision: 94, totalErrors: 5,
    difficultKeys: ['(', ')'],      status: 'COMPLETED', date: daysAgo(17),
  },
  {
    id: 'sess_18', snippetId: 'snip_py_01',   language: 'python',     difficulty: 'MEDIUM',
    wpm: 64, cpm: 320, precision: 87, totalErrors: 10,
    difficultKeys: [':', '[', ']'], status: 'COMPLETED', date: daysAgo(18),
  },

  // ── Semana 4 (días 21-30) — sesiones más antiguas, WPM más bajo ───────────
  {
    id: 'sess_19', snippetId: 'snip_ts_01',   language: 'typescript', difficulty: 'EASY',
    wpm: 60, cpm: 300, precision: 86, totalErrors: 12,
    difficultKeys: ['{', '}'],      status: 'COMPLETED', date: daysAgo(21),
  },
  {
    id: 'sess_20', snippetId: 'snip_java_01', language: 'java',       difficulty: 'EASY',
    wpm: 55, cpm: 275, precision: 83, totalErrors: 14,
    difficultKeys: ['{', ';', '.'], status: 'COMPLETED', date: daysAgo(23),
  },
  {
    id: 'sess_21', snippetId: 'snip_py_02',   language: 'python',     difficulty: 'EASY',
    wpm: 48, cpm: 240, precision: 80, totalErrors: 20,
    difficultKeys: ['[', ':', '('], status: 'INVALID',   date: daysAgo(25),
  },
  {
    id: 'sess_22', snippetId: 'snip_js_01',   language: 'javascript', difficulty: 'EASY',
    wpm: 51, cpm: 255, precision: 84, totalErrors: 13,
    difficultKeys: ['(', ')', ';'], status: 'COMPLETED', date: daysAgo(27),
  },
  {
    id: 'sess_23', snippetId: 'snip_ts_02',   language: 'typescript', difficulty: 'MEDIUM',
    wpm: 46, cpm: 230, precision: 82, totalErrors: 15,
    difficultKeys: ['{', '<', '>'], status: 'COMPLETED', date: daysAgo(29),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 7 — MOCK_PROGRESS
// 30 días de historial con curva de aprendizaje realista.
// Empieza en ~55 WPM, sube gradualmente hasta ~80 con variación diaria.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Historial de progreso diario para la gráfica del dashboard.
 * La curva simula un usuario que mejora consistentemente con práctica diaria.
 *
 * Algoritmo:
 *  - Base WPM: 55 + tendencia lineal de 0.8 WPM/día
 *  - Ruido determinista: sin() + cos() para variación natural
 *  - Precisión: base 84% + mejora gradual + ruido
 */
export const MOCK_PROGRESS: ProgressDay[] = Array.from({ length: 30 }, (_, i) => {
  const dayIndex = 29 - i;   // 0 = hace 29 días, 29 = hoy

  // Tendencia ascendente: el usuario mejora ~0.8 WPM por día de práctica
  const trend = dayIndex * 0.8;

  // Ruido determinista (sin/cos) para simular variación natural sin Math.random()
  const wpmNoise  = Math.sin(dayIndex * 2.1) * 8 + Math.cos(dayIndex * 1.4) * 5;
  const precNoise = Math.sin(dayIndex * 1.3) * 4 + Math.cos(dayIndex * 2.7) * 2;

  // WPM: empieza en ~55, llega a ~80 con variación ±13
  const wpm = Math.round(Math.max(40, Math.min(94, 55 + trend + wpmNoise)));

  // Precisión: empieza en ~84%, llega a ~93% con variación ±6
  const precision = Math.round(Math.max(75, Math.min(99, 84 + trend * 0.3 + precNoise)));

  // Sesiones por día: entre 1 y 3 (más sesiones en días con mejor WPM)
  const sessions = wpm > 70 ? 3 : wpm > 60 ? 2 : 1;

  return {
    date:      daysAgo(29 - dayIndex),
    wpm,
    precision,
    sessions,
  };
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 8 — MOCK_DIFFICULT_KEYS
// Mapa de tecla especial → número de errores acumulados en todas las sesiones.
// Usado por el heatmap del dashboard para colorear las teclas por frecuencia.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Errores acumulados por tecla especial.
 * Los valores más altos generan más glow en el heatmap del dashboard.
 *
 * Patrón observado: las llaves y punto y coma son las más difíciles
 * para programadores que aprenden a mecanografiar código.
 */
export const MOCK_DIFFICULT_KEYS: Record<string, number> = {
  '{':  23,
  '}':  21,
  ';':  18,
  '(':  15,
  ')':  14,
  '[':  11,
  ']':  10,
  ':':  9,
  '"':  7,
  "'":  6,
  '<':  5,
  '>':  5,
  '=':  4,
  '!':  3,
  '@':  2,
  '#':  2,
  '$':  1,
  '%':  1,
};
