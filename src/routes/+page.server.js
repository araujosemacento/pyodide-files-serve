import { readFile } from 'fs/promises';
import { join } from 'path';
import yaml from 'js-yaml';

export async function load() {
  try {
    // Carrega configuração do arquivo YAML
    const configPath = join(process.cwd(), 'static', 'config.yml');
    const configContent = await readFile(configPath, 'utf8');
    const config = yaml.load(configContent);

    return {
      config,
      // @ts-ignore
      files: config.files || []
    };
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);

    // Fallback com dados estáticos para o backup Pyodide
    return {
      config: {
        title: 'Pyodide v0.28.0 - Repositório Backup',
        description: 'Backup da distribuição Pyodide v0.28.0 disponível como salvaguarda',
        baseUrl: ''
      },
      files: []
    };
  }
}
