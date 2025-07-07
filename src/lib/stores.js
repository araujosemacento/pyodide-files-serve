import { writable } from 'svelte/store';

export const currentPath = writable('/');
export const files = writable([]);
export const config = writable({
  title: 'Servidor de Arquivos Pyodide',
  description: 'Navegue pelos pacotes Pyodide disponíveis',
  baseUrl: ''
});
