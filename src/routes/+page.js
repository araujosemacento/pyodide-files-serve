import yaml from 'js-yaml';

export async function load({ fetch }) {
  try {
    // Carrega configuração do arquivo YAML
    const response = await fetch('/config.yml');
    
    if (!response.ok) {
      throw new Error('Config file not found');
    }
    
    const configContent = await response.text();
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
