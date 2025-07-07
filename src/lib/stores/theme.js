import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Função para detectar preferência do sistema
function getSystemTheme() {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Função para carregar tema salvo ou usar o do sistema
function getInitialTheme() {
  if (!browser) return 'light';
  const saved = localStorage.getItem('preferred-theme');
  return saved || getSystemTheme();
}

// Store para o tema atual
export const theme = writable(getInitialTheme());

// Função para alternar o tema
export function toggleTheme() {
  theme.update(current => {
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
  });
}

// Função para definir um tema específico
/**
 * @param {'light' | 'dark'} newTheme
 */
export function setTheme(newTheme) {
  if (!browser) return;

  localStorage.setItem('preferred-theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  theme.set(newTheme);
}

// Inicializar tema no browser
if (browser) {
  // Aplicar tema inicial
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Escutar mudanças na preferência do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  /**
   * @param {MediaQueryListEvent} e
   */
  const handleSystemThemeChange = (e) => {
    // Só aplicar tema do sistema se não houver preferência salva
    if (!localStorage.getItem('preferred-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };

  // Usar addEventListener se disponível (mais moderno)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    // Fallback para navegadores mais antigos
    mediaQuery.addListener(handleSystemThemeChange);
  }
}
