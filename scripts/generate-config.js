#!/usr/bin/env node

/**
 * Script para gerar automaticamente o config.yml baseado nos arquivos do backup Pyodide v0.28.0
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const STATIC_FILES_DIR = './static/files';
const CONFIG_FILE = './static/config.yml';

// Mapeamento de extensões para categorias
const CATEGORY_MAP = {
  // Core Pyodide
  '.js': 'Core Pyodide',
  '.wasm': 'Core Pyodide',
  '.json': 'Core Pyodide',
  '.html': 'Core Pyodide',

  // Bibliotecas científicas
  'numpy': 'Computação Científica',
  'scipy': 'Computação Científica',
  'sympy': 'Computação Científica',
  'mpmath': 'Computação Científica',

  // Análise de dados
  'pandas': 'Análise de Dados',
  'statsmodels': 'Análise de Dados',
  'xarray': 'Análise de Dados',

  // Visualização
  'matplotlib': 'Visualização',
  'bokeh': 'Visualização',
  'plotly': 'Visualização',
  'altair': 'Visualização',

  // Machine Learning
  'scikit': 'Machine Learning',
  'sklearn': 'Machine Learning',
  'lightgbm': 'Machine Learning',
  'xgboost': 'Machine Learning',

  // Visão computacional
  'opencv': 'Visão Computacional',
  'pillow': 'Visão Computacional',
  'imageio': 'Visão Computacional',

  // Desenvolvimento web
  'aiohttp': 'Desenvolvimento Web',
  'httpx': 'Desenvolvimento Web',
  'requests': 'Desenvolvimento Web'
};

function categorizeFile(filename) {
  const lowerName = filename.toLowerCase();

  // Procura por palavras-chave no nome
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (keyword.startsWith('.') && lowerName.endsWith(keyword)) {
      return category;
    } else if (!keyword.startsWith('.') && lowerName.includes(keyword)) {
      return category;
    }
  }

  return 'Outros';
}

async function generateConfig() {
  try {
    console.log('🔍 Escaneando arquivos em', STATIC_FILES_DIR);

    const files = await fs.readdir(STATIC_FILES_DIR);
    const filesList = [];

    for (const filename of files) {
      const filepath = path.join(STATIC_FILES_DIR, filename);
      const stats = await fs.stat(filepath);

      if (stats.isFile()) {
        filesList.push({
          name: filename,
          type: 'file',
          size: stats.size,
          path: `/files/${filename}`,
          modified: stats.mtime.toISOString(),
          category: categorizeFile(filename)
        });
      }
    }

    // Ordena por nome
    filesList.sort((a, b) => a.name.localeCompare(b.name));

    const config = {
      title: 'Pyodide v0.28.0 - Repositório Backup',
      description: 'Backup da distribuição Pyodide v0.28.0 disponível como salvaguarda para continuidade de projetos',
      baseUrl: '',
      files: filesList,
      display: {
        show_hidden: false,
        items_per_page: 50,
        default_sort: 'name',
        categories: [
          'Core Pyodide',
          'Computação Científica',
          'Análise de Dados',
          'Visualização',
          'Machine Learning',
          'Visão Computacional',
          'Desenvolvimento Web',
          'Outros'
        ]
      },
      allowed_extensions: [
        '.whl',
        '.tar',
        '.gz',
        '.zip',
        '.js',
        '.wasm',
        '.json',
        '.html',
        '.md'
      ]
    };

    const yamlContent = yaml.dump(config, {
      indent: 2,
      quotingType: '"',
      forceQuotes: false
    });

    await fs.writeFile(CONFIG_FILE, yamlContent, 'utf8');

    console.log('✅ Configuração do backup Pyodide v0.28.0 gerada com sucesso!');
    console.log(`📁 ${filesList.length} arquivos do backup processados`);
    console.log(`📄 Configuração salva em ${CONFIG_FILE}`);
    console.log('🔗 Acesso via: https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js');

    // Estatísticas por categoria
    const categoryCounts = {};
    filesList.forEach(file => {
      categoryCounts[file.category] = (categoryCounts[file.category] || 0) + 1;
    });

    console.log('\n📊 Estatísticas por categoria:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} arquivo(s)`);
      });

  } catch (error) {
    console.error('❌ Erro ao gerar configuração:', error);
    process.exit(1);
  }
}

generateConfig();
