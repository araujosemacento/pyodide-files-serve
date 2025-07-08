# Sistema de Internacionalização (i18n) - Pyodide Files Serve

## 🌐 Visão Geral

O sistema de internacionalização foi implementado para suportar múltiplos idiomas com uma estrutura escalável e organizações hierárquica das traduções.

## 📋 Idiomas Suportados

### Português (pt)

- **Código:** `pt`
- **Locale:** `pt-BR`
- **Arquivo:** `src/lib/i18n/locales/pt.json`
- **Status:** ✅ Completo (120+ chaves)

### English (en)

- **Código:** `en`
- **Locale:** `en-US`
- **Arquivo:** `src/lib/i18n/locales/en.json`
- **Status:** ✅ Completo (120+ chaves)

## 🏗️ Estrutura de Arquivos

```plaintext
src/lib/i18n/
├── index.js           # Configuração principal
├── locales/
│   ├── pt.json       # Traduções em português
│   └── en.json       # Traduções em inglês
```

## 🔧 Configuração Principal

### index.js

```javascript
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

// Registrar locales
register('en', () => import('./locales/en.json'));
register('pt', () => import('./locales/pt.json'));

// Inicializar com locale do navegador
init({
  fallbackLocale: 'pt',
  initialLocale: getLocaleFromNavigator()
});

export { _, locale } from 'svelte-i18n';
```

## 📚 Estrutura Hierárquica das Traduções

### Organização por Seções

```json
{
  "title": "Título principal da aplicação",
  "description": "Descrição geral",
  
  "warning_banner": {
    "title": "Título do banner de aviso",
    "description": "Descrição do banner",
    "access_url": "Texto para URL de acesso",
    "recommendation": "Recomendação final"
  },
  
  "console_demo": {
    "title": "Título da seção de demo",
    "description": "Descrição da demo",
    "button_text": "Texto do botão",
    "features": {
      "instant_execution": "Execução instantânea",
      "scientific_libraries": "Bibliotecas científicas",
      "no_configuration": "Sem configuração"
    }
  },
  
  "main_files": {
    "title": "Título da seção de arquivos",
    "description": "Descrição da seção",
    "commonjs": {
      "title": "Título do CommonJS",
      "badge": "Badge do tipo",
      "description": "Descrição detalhada",
      "compatibility": "Título de compatibilidade",
      "compatibility_items": [
        "Lista de itens compatíveis"
      ],
      "usage_example": "Título do exemplo",
      "usage_code": "Código de exemplo"
    },
    "esmodule": {
      "title": "Título do ES Module",
      "badge": "Badge do tipo",
      "description": "Descrição detalhada",
      "benefits": "Título dos benefícios",
      "benefits_items": [
        "Lista de benefícios"
      ]
    },
    "actions": {
      "access_file": "Acessar Arquivo",
      "copy_url": "Copiar URL",
      "copied": "Copiado!"
    }
  },
  
  "info_cards": {
    "commonjs": {
      "title": "Título do card CommonJS",
      "description": "Descrição",
      "advantages": "Título das vantagens",
      "advantages_items": ["Lista de vantagens"],
      "limitations": "Título das limitações",
      "limitations_items": ["Lista de limitações"]
    },
    "esmodule": {
      "title": "Título do card ES Module",
      "description": "Descrição",
      "advantages": "Título das vantagens",
      "advantages_items": ["Lista de vantagens"],
      "requirements": "Título dos requisitos",
      "requirements_items": ["Lista de requisitos"]
    },
    "decision": {
      "title": "Como Escolher?",
      "commonjs_when": "Quando usar CommonJS",
      "commonjs_scenarios": ["Cenários para CommonJS"],
      "esmodule_when": "Quando usar ES Module",
      "esmodule_scenarios": ["Cenários para ES Module"]
    }
  },
  
  "loading": {
    "title": "Título do loading",
    "subtitle": "Subtítulo do loading",
    "steps": {
      "initializing": "Inicializando...",
      "loading_files": "Carregando arquivos...",
      "configuring": "Configurando ambiente...",
      "almost_ready": "Quase pronto..."
    }
  }
}
```

## 🎯 Uso no Componente

### Importação

```javascript
import { _, locale } from "$lib/i18n/index.js";
```

### Uso Básico

```svelte
<h1>{$_("title")}</h1>
<p>{$_("description")}</p>
```

### Uso com HTML

```svelte
<h3>{@html $_("warning_banner.title")}</h3>
<p>{@html $_("warning_banner.description")}</p>
```

### Uso Condicional com Fallback

```svelte
{#each categories as category}
  <option value={category}>
    {$_(`categories.${category}`, { default: category })}
  </option>
{/each}
```

### Interpolação com Dados

```svelte
<span>📦 {$files.length} {$_("stats.packages_available")}</span>
<span>🔍 {filteredFiles.length} {$_("stats.displayed")}</span>
```

## 🔄 Detecção e Mudança de Idioma

### Detecção Automática

```javascript
onMount(() => {
  if (typeof localStorage !== "undefined") {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      locale.set(savedLanguage);
    }
  }
});
```

### Persistência

```javascript
// Salvar preferência no localStorage
$: if (browser && $locale) {
  localStorage.setItem("preferred-language", $locale);
}
```

### Mudança Reativa

```javascript
// Detectar mudanças para animações
$: if (browser) {
  if (previousLocale !== null && previousLocale !== $locale) {
    isTransitioning = true;
    setTimeout(() => {
      isTransitioning = false;
    }, 400);
  }
  previousLocale = $locale;
}
```

## 📅 Formatação de Datas

### Internacionalização de Datas

```javascript
function formatDate(dateString) {
  if (!dateString) return $_("date_not_available");
  const currentLocale = $locale === "pt" ? "pt-BR" : "en-US";
  return new Date(dateString).toLocaleDateString(currentLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
```

## 🎨 Categorias Traduzidas

### Mapeamento de Categorias

```javascript
"categories": {
  "Core Pyodide": "Core Pyodide",
  "Computação Científica": "Computação Científica",
  "Análise de Dados": "Análise de Dados",
  "Visualização": "Visualização",
  "Machine Learning": "Machine Learning",
  "Visão Computacional": "Visão Computacional",
  "Desenvolvimento Web": "Desenvolvimento Web",
  "Outros": "Outros"
}
```

### Cores das Categorias

```javascript
function getCategoryColor(category) {
  const colors = {
    "Core Pyodide": "#ff6b35",
    "Computação Científica": "#004e89",
    "Análise de Dados": "#1a5490",
    "Visualização": "#f18f01",
    "Machine Learning": "#c73e1d",
    "Visão Computacional": "#0e5aa7",
    "Desenvolvimento Web": "#5a7c65",
    "Outros": "#6c757d",
  };
  return colors[category] || colors["Outros"];
}
```

## 🛡️ Fallbacks e Robustez

### Chave Não Encontrada

```javascript
{$_("chave.inexistente", { default: "Texto padrão" })}
```

### Verificação de Existência

```javascript
$: title = $locale === 'pt' ? 
  $_("title") : 
  $_("title", { default: "Pyodide v0.28.0 - Backup Repository" });
```

## 📊 Estatísticas de Tradução

### Português (pt.json)

- **Total de Chaves:** 125+
- **Seções Cobertas:** 8
- **Arrays de Tradução:** 12
- **HTML Suportado:** ✅
- **Caracteres Especiais:** ✅

### English (en.json)

- **Total de Chaves:** 125+
- **Seções Cobertas:** 8
- **Arrays de Tradução:** 12
- **HTML Suportado:** ✅
- **Consistência Terminológica:** ✅

## 🔄 Expansão Futura

### Adição de Novos Idiomas

1. Criar arquivo `src/lib/i18n/locales/[code].json`
2. Adicionar registro em `index.js`:

   ```javascript
   register('es', () => import('./locales/es.json'));
   ```

3. Atualizar seletor de idioma no componente

### Novas Chaves de Tradução

1. Adicionar chave em todos os arquivos de locale
2. Usar no componente com `$_("nova.chave")`
3. Testar em todos os idiomas suportados

## 🧪 Teste e Validação

### Verificação de Completude

```bash
# Comparar chaves entre arquivos
jq -r 'paths(scalars) as $p | $p | join(".")' src/lib/i18n/locales/pt.json | sort > pt_keys.txt
jq -r 'paths(scalars) as $p | $p | join(".")' src/lib/i18n/locales/en.json | sort > en_keys.txt
diff pt_keys.txt en_keys.txt
```

### Teste Manual

1. Alternar entre idiomas na interface
2. Verificar todas as seções
3. Testar formatação de datas
4. Validar HTML embedded

## 🎯 Melhores Práticas

### Organização de Chaves

- Use hierarquia clara (`section.subsection.key`)
- Agrupe por funcionalidade
- Mantenha arrays quando apropriado
- Use nomes descritivos

### Manutenção

- Sempre adicione chave em TODOS os idiomas
- Use HTML com parcimônia
- Teste mudanças em tempo real
- Mantenha consistência terminológica

### Performance

- Carregamento lazy dos locales
- Cache automático do svelte-i18n
- Fallback inteligente para chaves ausentes
- Persistência local das preferências

Este sistema garante uma experiência multilíngue robusta e escalável para o projeto Pyodide Files Serve.
