/**
 * test-snippets.ts
 * Re-exporta los helpers de snippets desde mock-data.ts para la página de test.
 *
 * Este archivo existe para mantener la compatibilidad con las importaciones
 * existentes en src/app/test/page.tsx sin cambiar su interfaz pública.
 *
 * Toda la fuente de datos real está en src/lib/mock-data.ts.
 */

export {
  getSnippetsByLanguage,
  getRandomSnippet,
  type Snippet as TestSnippet,
} from './mock-data';
