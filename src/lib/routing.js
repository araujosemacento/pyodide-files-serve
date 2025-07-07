import { base } from '$app/paths';
import { browser } from '$app/environment';

/**
 * Cria URLs robustas que funcionam em desenvolvimento e produção
 * @param {string} path - O caminho relativo (ex: "/files/console.html")
 * @returns {string} - URL completa
 */
export function createUrl(path) {
  // Garantir que o path comece com '/'
  const cleanPath = path.startsWith('/') ? path : '/' + path;

  // Em desenvolvimento, base é vazio, então usar apenas o path
  // Em produção, base é '/pyodide-files-serve', então usar base + path
  return base + cleanPath;
}

/**
 * Cria URLs absolutas para compartilhamento/cópia
 * @param {string} path - O caminho relativo
 * @returns {string} - URL absoluta
 */
export function createAbsoluteUrl(path) {
  const cleanPath = path.startsWith('/') ? path : '/' + path;

  if (browser) {
    // Se estivermos no browser, usar a origem atual + base + path
    return window.location.origin + base + cleanPath;
  }

  // Fallback para URLs conhecidas
  if (base) {
    return 'https://araujosemacento.github.io/pyodide-files-serve' + cleanPath;
  }

  return 'http://localhost:5173' + cleanPath;
}

/**
 * Verifica se estamos em ambiente de produção
 * @returns {boolean}
 */
export function isProduction() {
  return !!base;
}

/**
 * Obtém o base URL configurado
 * @returns {string}
 */
export function getBaseUrl() {
  return base || '';
}
