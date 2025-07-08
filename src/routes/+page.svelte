<script>
  // @ts-nocheck

  // @ts-ignore
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { formatFileSize, getFileIcon, searchFiles } from "$lib/utils.js";
  // @ts-ignore
  import { currentPath, files, config } from "$lib/stores.js";
  import { theme } from "$lib/stores/theme.js";
  import { _, locale, json } from "$lib/i18n/index.js";
  import SettingsPanel from "$lib/components/SettingsPanel.svelte";
  import DevToolsPanel from "$lib/components/DevToolsPanel.svelte";
  import { base } from "$app/paths";
  import { browser } from "$app/environment";
  import { createUrl, createAbsoluteUrl } from "$lib/routing.js";
  import { analytics, sessionStore } from "$lib/stores/analytics.js";
  import { logger } from "$lib/utils/logger.js";

  // @ts-ignore
  export let data;

  let searchTerm = "";
  let selectedCategory = "all";
  /**
   * @type {string | any[]}
   */
  let filteredFiles = [];

  // Estados de loading e transições
  let isLoading = true;
  let isTransitioning = false;
  let previousTheme = null;
  let previousLocale = null;

  // Carregar preferência de idioma do localStorage
  onMount(() => {
    if (typeof localStorage !== "undefined") {
      const savedLanguage = localStorage.getItem("preferred-language");
      if (savedLanguage) {
        locale.set(savedLanguage);
        // Atualizar o atributo lang do HTML para corresponder
        document.documentElement.lang = savedLanguage === "pt" ? "pt-BR" : "en";
      } else {
        // Se não há idioma salvo, usar detecção automática (já feita no app.html)
        // mas garantir que o store esteja sincronizado
        const currentLang = document.documentElement.lang;
        const detectedLang = currentLang.startsWith("pt") ? "pt" : "en";
        locale.set(detectedLang);
      }
    }

    // Inicializar sistema de analytics
    if (browser) {
      analytics.initializeSession();
    }

    // Simular carregamento inicial realista
    const loadingSteps = [
      { delay: 300, message: "Inicializando..." },
      { delay: 600, message: "Carregando arquivos..." },
      { delay: 1000, message: "Configurando ambiente..." },
      { delay: 1400, message: "Quase pronto..." },
    ];

    let currentStep = 0;
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        logger.log(loadingSteps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(loadingInterval);
        isLoading = false;
      }
    }, 350);
  });

  // Detectar mudanças de tema e idioma para animações
  $: if (browser) {
    if (previousTheme !== null && previousTheme !== $theme) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
      }, 600);
    }
    previousTheme = $theme;
  }

  $: if (browser) {
    if (previousLocale !== null && previousLocale !== $locale) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
      }, 400);
    }
    previousLocale = $locale;
  }

  // @ts-ignore
  $: $config = data.config;
  // @ts-ignore
  $: $files = data.files;
  $: {
    let filtered = $files;

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((file) => file.category === selectedCategory);
      // Track filter usage
      if (browser) {
        analytics.trackEvent('filter');
      }
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      // Track search usage
      if (browser) {
        analytics.trackEvent('search');
      }
      filtered = searchFiles(filtered, searchTerm);
    }

    filteredFiles = filtered;
  }

  /**
   * @param {{ type: string; path: string; name: string; }} file
   */
  function handleFileClick(file) {
    if (file.type === "directory") {
      // Navegar para diretório (implementar lógica de navegação)
      logger.log("Navegando para:", file.path);
    } else {
      // Track file access
      if (browser) {
        analytics.trackEvent('file_access', { fileName: file.name });
      }
      // Abrir arquivo usando a URL robusta
      window.open(createUrl(file.path), "_blank");
    }
  }

  /**
   * @param {string | number | Date} dateString
   */
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

  /**
   * @param {{ category: any; }} file
   */
  function getFileCategory(file) {
    return file.category || "Outros";
  }

  /**
   * @param {string | number} category
   */
  function getCategoryColor(category) {
    const colors = {
      "Core Pyodide": "#ff6b35",
      "Computação Científica": "#004e89",
      "Análise de Dados": "#1a5490",
      Visualização: "#f18f01",
      "Machine Learning": "#c73e1d",
      "Visão Computacional": "#0e5aa7",
      "Desenvolvimento Web": "#5a7c65",
      Outros: "#6c757d",
    };
    // @ts-ignore
    return colors[category] || colors["Outros"];
  }

  $: categories = [...new Set($files.map((f) => getFileCategory(f)))];

  // Função para copiar URL
  /**
   * @param {string} url
   */
  function copyToClipboard(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        // Feedback visual - você pode personalizar
        logger.log("URL copiada:", url);
      });
    } else {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  }

  // Event listener para botões de copiar
  /**
   * @param {{ target: { closest: (arg0: string) => any; }; }} event
   */
  function handleCopyClick(event) {
    const button = event.target.closest(".copy-url");
    if (button) {
      const url = button.getAttribute("data-url");
      copyToClipboard(url);

      // Track copy events based on URL
      if (browser) {
        if (url.includes('pyodide.js')) {
          analytics.trackEvent('copy_commonjs');
        } else if (url.includes('pyodide.mjs')) {
          analytics.trackEvent('copy_esm');
        }
      }

      // Feedback visual
      const originalText = button.innerHTML;
      button.innerHTML = `
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		  <polyline points="20,6 9,17 4,12"/>
		</svg>
		Copiado!
	  `;
      button.style.backgroundColor = "var(--color-success)";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = "";
      }, 2000);
    }
  }
</script>

<svelte:head>
  <title>{$config.title}</title>
  <meta name="description" content={$config.description} />
  <meta
    name="keywords"
    content="pyodide, python, webassembly, wasm, packages, wheel"
  />
</svelte:head>

<!-- Loading Spinner -->
{#if isLoading}
  <div class="loading-overlay" transition:fade={{ duration: 500 }}>
    <div class="loading-spinner">
      <div class="snake-container">
        <svg
          class="snake-svg"
          viewBox="0 0 480.47 493.35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m276.68,28.93c6.22.7,12.55.9,18.62,2.25,5.29,1.18,10.66,1.86,15.94,3.28,9.57,2.58,19.15,5.24,28.13,9.24,8.54,3.8,16.95,8.2,25.38,12.17,10.24,4.83,19.74,10.42,28.41,17.36,8.26,6.6,16.44,13.4,23.21,21.73,4.68,5.76,10.95,10.04,15.42,16.11,6.58,8.9,13.16,17.75,18.03,27.78,2.09,4.3,4.42,8.46,6.42,12.82,5.99,13.09,10.98,26.53,15.8,40.09,3.49,9.79,5.58,19.78,6.57,29.96,1.17,11.96,2.42,23.91,1.61,36.06-.81,12.25-1.05,24.55-2.71,36.72-1.03,7.53-3.08,14.88-5.28,22.2-1.81,6.02-3.6,12.08-5.94,17.87-2.65,6.56-4.75,13.39-8.54,19.5-2.69,4.34-4.75,9.09-7.07,13.62-7.34,14.28-17.01,26.9-27.22,38.98-7.29,8.62-15.64,16.42-24.25,23.98-13.64,11.97-27.81,23.13-43.25,32.48-10.02,6.06-20.63,11.26-31.78,15.34-6.39,2.34-12.96,4.01-19.38,6.22-6.22,2.14-12.82,3.27-19.31,4.53-12.23,2.37-24.65,3.54-37.05,3.91-7.18.21-14.51.67-21.78-.82-4.78-.98-9.81-.98-14.69-1.4-16.35-1.41-32.1-5.41-47.48-10.56-11.39-3.81-22.56-8.44-33.26-14.25-5.79-3.15-11.78-6.15-17.29-9.68-6.23-3.98-12.95-7.36-18.32-12.73-3.48-3.47-7.8-6.04-11.62-9.19-9-7.4-16.98-15.79-24.8-24.24-4.64-5.02-9.02-10.54-13.05-16.26-3.81-5.41-7.45-10.94-11.09-16.45-3.73-5.66-7.07-11.62-10.11-17.68-3.48-6.93-6.5-14.09-9.62-21.19-2.2-5-3.81-10.32-5.27-15.49-3.27-11.59-5.97-23.36-8.11-35.3-2.41-13.44-1.23-26.82-1.86-40.18-.32-6.82.58-14.06,1.28-21.09.63-6.38,1.66-12.74,2.41-19.09.82-6.86,2.5-13.66,4.3-20.35,2.06-7.66,4.27-15.33,7.18-22.7,2.67-6.76,5.44-13.5,8.65-20.07,2.91-5.97,6.67-11.48,9.26-17.56,2.25-5.29,5.99-9.64,9.2-14.14,4.19-5.88,8.39-11.88,13.06-17.51,7.33-8.83,15.59-16.69,23.59-24.8,4.63-4.69,9.94-8.78,15.23-12.75,6.22-4.67,12.55-9.27,19.23-13.23,6.24-3.7,12.27-7.83,19.15-10.47,4.93-1.89,9.54-4.56,14.36-6.76,13.13-5.99,27.07-8.69,40.88-12.12,8.22-2.04,16.2-5.06,22.29-11.34,4.8-4.94,10.9-3.71,16.35-3.09,6.16.7,12.13,3.21,17.74,6.07,5.66,2.88,11.71,4.68,17.69,6.66,5.48,1.82,8.88,6.21,8.96,11.78.12,7.82-2.62,12.43-8.7,14.54-7.71,2.67-14.98,6.32-22.14,10.17-6.74,3.62-14.04,4.72-21.48,5.27-1.66.12-3.33-.37-4.67-1.48-6.56-5.47-13.63-4.48-21.14-2.22-13.84,4.16-27.04,9.94-39.88,16.34-8.68,4.33-16.85,9.75-24.9,15.36-8.35,5.82-16.04,12.4-23.24,19.35-6.82,6.59-13.11,13.87-18.98,21.49-6.17,8.03-11.55,16.52-16.51,25.23-4.63,8.13-9,16.53-11.72,25.58-1.43,4.76-3.34,9.33-4.8,14.1-4.62,15.13-7.07,30.51-7.84,46.28-.84,17.21,2.07,33.84,5.57,50.6,2.7,12.91,6.81,25.28,11.88,37.24,3.56,8.41,7.82,16.67,12.95,24.47,5,7.58,9.77,15.35,15.71,22.17,6.15,7.05,11.85,14.65,19.57,20.19,3.36,2.41,6.12,5.49,9.25,8.13,10.19,8.61,21.5,15.48,33.1,21.66,8.06,4.3,16.61,7.99,25.56,10.66,8.05,2.41,16.01,5,24.27,6.73,13.2,2.77,26.52,4.11,39.98,4.11,13.91,0,27.73-1.42,41.33-4.18,8.72-1.76,17.39-3.97,25.74-7.28,7.09-2.81,14.48-4.85,21.53-7.74,8.68-3.56,16.92-8.02,24.93-12.99,8.23-5.1,15.46-11.43,22.62-17.73,6.9-6.07,12.93-13.17,18.87-20.3,5.95-7.13,11.2-14.71,16.19-22.46,4.29-6.64,7.94-13.75,11.29-20.92,3.21-6.87,6.01-13.98,8.36-21.19,2.4-7.38,4-15.01,6.01-22.52,2.27-8.45,4.23-16.98,5.05-25.67.4-4.22.14-8.58.11-12.84-.14-17.18-2.81-34.12-5.27-51.12-2.66-18.41-9.87-34.99-18.55-50.88-6.88-12.59-13.92-25.25-23.22-36.41-9.24-11.09-19.97-20.61-30.56-30.33-8.58-7.87-17.69-14.99-27.55-21.05-6.87-4.22-14.07-8.04-21.48-11.18-13.51-5.72-27.18-11.11-41.66-14.07.07-.45.14-.89.22-1.34Z"
          />
        </svg>
      </div>
      <div class="loading-text">
        <h3>🐍 Carregando Pyodide...</h3>
        <p>Preparando o ambiente Python</p>
      </div>
    </div>
  </div>
{/if}

<!-- Overlay de transição para mudanças de tema/idioma -->
{#if isTransitioning}
  <div class="transition-overlay" transition:fade={{ duration: 200 }}>
    <div class="transition-spinner">
      <div class="pulse-ring"></div>
      <div class="transition-icon">⚡</div>
    </div>
  </div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if !isLoading}
  <div
    class="container"
    class:transitioning={isTransitioning}
    on:click={handleCopyClick}
    transition:fade={{ duration: 500, delay: 100 }}
  >
    <header class="header">
      <div class="header-top">
        <div class="header-content">
          <h1>🐍 {$_("title")}</h1>
          <p>{$_("description")}</p>
          <div class="stats">
            <span class="stat"
              >📦 {$files.length} {$_("stats.packages_available")}</span
            >
            <span class="stat"
              >🔍 {filteredFiles.length} {$_("stats.displayed")}</span
            >
          </div>
        </div>
        <div class="header-controls">
          <SettingsPanel />
        </div>
      </div>
    </header>

    <nav class="breadcrumb">
      <a href={createUrl("/")}>🏠 {$_("home")}</a> /
      <span>{$_("backup_pyodide")}</span>
      <a href={createUrl("/dashboard")} class="dashboard-link">📊</a>
    </nav>

    <!-- Aviso importante sobre backup -->
    <div class="warning-banner">
      <h3>{@html $_("warning_banner.title")}</h3>
      <p>
        {@html $_("warning_banner.description")}
        {$_("warning_banner.access_url")}
        <code>{createAbsoluteUrl("/files/pyodide.js")}</code>
      </p>
      <p>
        <small>{@html $_("warning_banner.recommendation")}</small>
      </p>
    </div>

    <!-- Seção Experimente o Console -->
    <div class="console-demo-section">
      <div class="demo-card">
        <div class="demo-icon">🐍</div>
        <h3>{$_("console_demo.title")}</h3>
        <p>
          {$_("console_demo.description")}
        </p>
        <a href={createUrl("/files/console.html")} class="demo-button">
          <span>{$_("console_demo.button_text")}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </a>
        <div class="demo-features">
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <span>{$_("console_demo.features.instant_execution")}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>{$_("console_demo.features.scientific_libraries")}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔧</span>
            <span>{$_("console_demo.features.no_configuration")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção Arquivos Principais -->
    <div class="main-files-section">
      <h3>{$_("main_files.title")}</h3>
      <p class="section-description">
        {$_("main_files.description")}
      </p>

      <div class="files-grid">
        <div class="file-card-main">
          <div class="file-header-main">
            <div class="file-icon-main">📄</div>
            <div class="file-type-badge commonjs">
              {$_("main_files.commonjs.badge")}
            </div>
          </div>
          <h4>{$_("main_files.commonjs.title")}</h4>
          <p>
            {$_("main_files.commonjs.description")}
          </p>
          <div class="compatibility-info">
            <h6>{$_("main_files.commonjs.compatibility")}</h6>
            <ul>
              {#each $json("main_files.commonjs.compatibility_items") as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div class="usage-example">
            <h6>{$_("main_files.commonjs.usage_example")}</h6>
            <code class="code-block"
              >{$_("main_files.commonjs.usage_code")}</code
            >
          </div>
          <div class="file-actions">
            <a href={createUrl("/files/pyodide.js")} class="file-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {$_("main_files.actions.access_file")}
            </a>
            <button
              class="copy-url"
              data-url={createAbsoluteUrl("/files/pyodide.js")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="m4 16-2-2v-10c0-1.1.9-2 2-2h10l2 2" />
              </svg>
              {$_("main_files.actions.copy_url")}
            </button>
          </div>
        </div>

        <div class="file-card-main">
          <div class="file-header-main">
            <div class="file-icon-main">🔷</div>
            <div class="file-type-badge esmodule">
              {$_("main_files.esmodule.badge")}
            </div>
          </div>
          <h4>{$_("main_files.esmodule.title")}</h4>
          <p>
            {$_("main_files.esmodule.description")}
          </p>
          <div class="compatibility-info">
            <h6>{$_("main_files.esmodule.compatibility")}</h6>
            <ul>
              {#each $json("main_files.esmodule.compatibility_items") as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div class="usage-example">
            <h6>{$_("main_files.esmodule.usage_example")}</h6>
            <code class="code-block"
              >{$_("main_files.esmodule.usage_code")}</code
            >
          </div>
          <div class="benefits-info">
            <h6>{$_("main_files.esmodule.benefits")}</h6>
            <ul>
              {#each $json("main_files.esmodule.benefits_items") as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div class="file-actions">
            <a href={createUrl("/files/pyodide.mjs")} class="file-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {$_("main_files.actions.access_file")}
            </a>
            <button
              class="copy-url"
              data-url={createAbsoluteUrl("/files/pyodide.mjs")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="m4 16-2-2v-10c0-1.1.9-2 2-2h10l2 2" />
              </svg>
              {$_("main_files.actions.copy_url")}
            </button>
          </div>
        </div>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <div class="card-icon">🔧</div>
          <h5>{$_("info_cards.commonjs.title")}</h5>
          <p>
            {$_("info_cards.commonjs.description")}
          </p>
          <div class="card-pros-cons">
            <div class="pros">
              <strong>{$_("info_cards.commonjs.advantages")}</strong>
              <ul>
                {#each $json("info_cards.commonjs.advantages_items") as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
            <div class="cons">
              <strong>{$_("info_cards.commonjs.limitations")}</strong>
              <ul>
                {#each $json("info_cards.commonjs.limitations_items") as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-icon">⚡</div>
          <h5>{$_("info_cards.esmodule.title")}</h5>
          <p>
            {$_("info_cards.esmodule.description")}
          </p>
          <div class="card-pros-cons">
            <div class="pros">
              <strong>{$_("info_cards.esmodule.advantages")}</strong>
              <ul>
                {#each $json("info_cards.esmodule.advantages_items") as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
            <div class="cons">
              <strong>{$_("info_cards.esmodule.requirements")}</strong>
              <ul>
                {#each $json("info_cards.esmodule.requirements_items") as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <div class="info-card decision-card">
          <div class="card-icon">🤔</div>
          <h5>{$_("info_cards.decision.title")}</h5>
          <div class="decision-matrix">
            <div class="decision-option">
              <strong>{$_("info_cards.decision.commonjs_when")}</strong>
              <ul>
                {#each $json("info_cards.decision.commonjs_scenarios") as scenario}
                  <li>{scenario}</li>
                {/each}
              </ul>
            </div>
            <div class="decision-option">
              <strong>{$_("info_cards.decision.esmodule_when")}</strong>
              <ul>
                {#each $json("info_cards.decision.esmodule_scenarios") as scenario}
                  <li>{scenario}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="controls">
      <div class="search-box">
        <input
          type="text"
          class="search-input"
          placeholder={$_("search_placeholder")}
          bind:value={searchTerm}
        />
      </div>

      <div class="category-filter">
        <label for="category">{$_("category")}</label>
        <select id="category" bind:value={selectedCategory}>
          <option value="all">{$_("all_categories")}</option>
          {#each categories as category}
            <option value={category}
              >{$_(`categories.${category}`, { default: category })}</option
            >
          {/each}
        </select>
      </div>
    </div>

    {#if filteredFiles.length === 0}
      <div class="no-results">
        <h3>{@html $_("no_results.title")}</h3>
        <p>{$_("no_results.message")}</p>
      </div>
    {:else}
      <div class="file-grid">
        {#each filteredFiles as file, index}
          <div
            class="file-card {file.type === 'directory' ? 'directory' : ''}"
            style="--delay: {index * 0.05}s"
            on:click={() => handleFileClick(file)}
            on:keydown={(e) => e.key === "Enter" && handleFileClick(file)}
            tabindex="0"
            role="button"
            aria-label="Abrir {file.name}"
          >
            <div class="file-header">
              <span class="file-icon">{getFileIcon(file)}</span>
              {#if file.category}
                <span
                  class="category-badge"
                  style="background-color: {getCategoryColor(file.category)}"
                >
                  {file.category}
                </span>
              {/if}
            </div>

            <div class="file-name" title={file.name}>{file.name}</div>

            <div class="file-info">
              <div class="file-date">
                📅 {formatDate(file.modified)}
              </div>
              {#if file.size}
                <div class="file-size">
                  📊 {formatFileSize(file.size, $_)}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <footer class="footer">
      <p>
        {@html $_("footer.backup_text")} •
        <a href="https://pyodide.org" target="_blank" rel="noopener">
          {$_("footer.official_project")}
        </a>
      </p>
      <p>
        <small>{$_("footer.disclaimer")}</small>
      </p>
    </footer>
  </div>
{/if}

<style>
  .stats {
    margin-top: 1rem;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
    display: flex;
  }

  .stat {
    background: var(--color-bg-2);
    color: var(--color-text);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all var(--transition-normal);
    border: 1px solid var(--color-bg-3);
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: end;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
  }

  .category-filter {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .category-filter label {
    font-weight: 600;
    color: var(--color-theme-1);
    font-size: 0.9rem;
  }

  .category-filter select {
    padding: 0.75rem;
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-md);
    background: var(--color-bg-1);
    color: var(--color-text);
    font-size: 1rem;
    min-width: 200px;
    transition: all var(--transition-normal);
    cursor: pointer;
  }

  .category-filter select:focus {
    outline: none;
    border-color: var(--color-theme-1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .file-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .category-badge {
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-muted);
  }

  .no-results h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  .warning-banner {
    background: linear-gradient(
      135deg,
      rgba(251, 146, 60, 0.1),
      rgba(245, 158, 11, 0.05)
    );
    border: 2px solid rgba(251, 146, 60, 0.3);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
    transition: all var(--transition-normal);
  }

  .warning-banner h3 {
    color: var(--color-warning);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .warning-banner p {
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .warning-banner code {
    background: var(--color-bg-2);
    color: var(--color-text);
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius-sm);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    word-break: break-all;
    border: 1px solid var(--color-bg-3);
  }

  /* Tema escuro específico para warning banner */
  :global([data-theme="dark"]) .warning-banner {
    background: linear-gradient(
      135deg,
      rgba(251, 146, 60, 0.15),
      rgba(245, 158, 11, 0.1)
    );
    border-color: rgba(251, 146, 60, 0.4);
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .header-content {
    flex: 1;
    text-align: center;
  }

  .header-controls {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 1001;
  }

  .header {
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--color-theme-1);
    margin-bottom: 2rem;
  }

  /* Dashboard link - discreto e simples */
  .dashboard-link {
    color: var(--color-text-muted);
    text-decoration: none;
    margin-left: 1rem;
    opacity: 0.6;
    transition: all var(--transition-normal);
    font-size: 0.9rem;
  }

  .dashboard-link:hover {
    opacity: 1;
    color: var(--color-theme-1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    .dashboard-link {
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
    }

    .search-box {
      min-width: auto;
    }

    .category-filter select {
      min-width: auto;
    }

    .stats {
      gap: 1rem;
    }

    .header-top {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .header-content {
      order: 1;
    }
  }

  @media (max-width: 480px) {
    .header-controls {
      bottom: 1rem;
      right: 1rem;
      position: fixed;
    }
  }

  /* Estilos para seção de demonstração do console */
  .console-demo-section {
    margin: 3rem 0;
  }

  .demo-card {
    background: linear-gradient(
      135deg,
      rgb(30, 64, 175),
      /* Azul mais escuro para melhor contraste */ rgb(29, 78, 216),
      /* Azul médio mais saturado */ rgb(37, 99, 235)
        /* Azul final mais vibrante */
    );
    color: rgb(255, 255, 255); /* Branco puro para máximo contraste */
    border-radius: var(--border-radius-lg);
    padding: 3rem;
    text-align: center;
    box-shadow:
      var(--shadow-xl),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1); /* Borda sutil para definição */
  }

  .demo-card::before {
    content: "";
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    height: 100%;
    top: -50%;
    left: -50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      /* Efeito mais sutil */ transparent 50%
    );
    aspect-ratio: 1/1;
    animation: shimmer 30s ease-in-out infinite; /* Animação mais lenta */
    pointer-events: none; /* Não interfere na interação */
  }

  @keyframes shimmer {
  0% {
    transform: translate(79%, 57%) rotate(0deg);
    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  25% {
    transform: translate(100%, 23%) rotate(120deg);
    animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
  }
  50% {
    transform: translate(32%, 15%) rotate(240deg);
    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  75% {
    transform: translate(5%, 68%) rotate(300deg);
    animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
  }
  100% {
    transform: translate(83%, 51%) rotate(360deg);
    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

  .demo-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  .demo-card h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
    color: rgb(255, 255, 255); /* Branco puro para títulos */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Sombra sutil para legibilidade */
  }

  .demo-card p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.95; /* Ligeiramente mais opaco para melhor legibilidade */
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    color: rgb(249, 250, 251); /* Branco quase puro para parágrafos */
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); /* Sombra leve */
  }

  .demo-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(
      255,
      255,
      255,
      0.25
    ); /* Fundo mais opaco para melhor contraste */
    color: rgb(255, 255, 255); /* Branco puro */
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    font-size: 1.1rem;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.4); /* Borda mais visível */
    position: relative;
    z-index: 10;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Sombra no texto para legibilidade */
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .demo-button:hover {
    background: rgba(255, 255, 255, 0.35); /* Hover mais contrastante */
    transform: translateY(-2px);
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: rgba(
      255,
      255,
      255,
      0.5
    ); /* Borda ainda mais visível no hover */
  }

  .demo-features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1.25rem;
    border-radius: var(--border-radius-md);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .feature-icon {
    font-size: 1.2rem;
  }

  /* Estilos para seção de arquivos principais */
  .main-files-section {
    margin: 4rem 0;
  }

  .main-files-section h3 {
    text-align: center;
    font-size: 2rem;
    color: var(--color-theme-1);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .section-description {
    text-align: center;
    color: var(--color-text-muted);
    font-size: 1.1rem;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .file-card-main {
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-lg);
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }

  .file-card-main::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--color-theme-1),
      var(--color-theme-2)
    );
    opacity: 0;
    transition: opacity var(--transition-normal);
    z-index: -1;
  }

  .file-card-main:hover {
    border-color: var(--color-theme-1);
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }

  .file-card-main:hover::before {
    opacity: 0.03;
  }

  .file-header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .file-icon-main {
    font-size: 2.5rem;
  }

  .file-type-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: white;
  }

  .file-type-badge.commonjs {
    background: linear-gradient(135deg, #f39c12, #e67e22);
  }

  .file-type-badge.esmodule {
    background: linear-gradient(135deg, #3498db, #2980b9);
  }

  .file-card-main h4 {
    font-size: 1.5rem;
    color: var(--color-theme-1);
    margin-bottom: 1rem;
    font-weight: 700;
    font-family: var(--font-mono);
  }

  .file-card-main p {
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .compatibility-info,
  .usage-example,
  .benefits-info {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--color-bg-2);
    border-radius: var(--border-radius-md);
    border-left: 4px solid var(--color-theme-1);
  }

  .compatibility-info h6,
  .usage-example h6,
  .benefits-info h6 {
    margin: 0 0 0.75rem 0;
    color: var(--color-theme-1);
    font-size: 0.9rem;
    font-weight: 700;
  }

  .compatibility-info ul,
  .benefits-info ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
  }

  .compatibility-info li,
  .benefits-info li {
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .code-block {
    display: block;
    background: var(--color-bg-3);
    color: var(--color-text);
    padding: 0.75rem;
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    overflow-x: auto;
    border: 1px solid var(--color-bg-3);
  }

  .file-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .file-link,
  .copy-url {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    text-decoration: none;
    transition: all var(--transition-normal);
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .file-link {
    background: var(--color-theme-1);
    color: white;
  }

  .file-link:hover {
    background: var(--color-theme-2);
    transform: translateY(-1px);
  }

  .copy-url {
    background: var(--color-bg-2);
    color: var(--color-text);
    border: 2px solid var(--color-bg-3);
  }

  .copy-url:hover {
    background: var(--color-bg-3);
    border-color: var(--color-theme-1);
  }

  /* Cards informativos */
  .info-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .info-card {
    background: var(--color-bg-2);
    border: 1px solid var(--color-bg-3);
    border-radius: var(--border-radius-md);
    padding: 2rem;
    transition: all var(--transition-normal);
    position: relative;
    flex: 1 1 300px;
    max-width: 380px;
  }

  .info-card:not(.decision-card) {
    flex: 1 1 300px;
    max-width: 380px;
  }

  .info-card:hover {
    border-color: var(--color-theme-1);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .card-icon {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .info-card h5 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--color-theme-1);
    font-weight: 700;
    text-align: center;
  }

  .info-card p {
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .card-pros-cons {
    display: grid;
    gap: 1rem;
  }

  .pros,
  .cons {
    padding: 1rem;
    border-radius: var(--border-radius-sm);
  }

  .pros {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
  }

  .cons {
    background: rgba(234, 179, 8, 0.1);
    border: 1px solid rgba(234, 179, 8, 0.3);
  }

  .pros strong,
  .cons strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .pros ul,
  .cons ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
  }

  .pros li,
  .cons li {
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .decision-card {
    width: 100%;
    flex: 1 1 100%;
    max-width: none;
    order: 3;
    background: linear-gradient(
      135deg,
      var(--color-theme-1),
      var(--color-theme-2)
    );
    color: white;
    border: none;
  }

  .decision-card h5 {
    color: white;
  }

  .decision-matrix {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .decision-option {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
    backdrop-filter: blur(10px);
  }

  .decision-option strong {
    display: block;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .decision-option ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
  }

  .decision-option li {
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }

  :global(.info-card) code {
    background: var(--color-bg-3);
    color: var(--color-text);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }

  /* Responsive para as novas seções */
  @media (max-width: 768px) {
    .demo-card {
      padding: 2rem 1.5rem;
    }

    .demo-card h3 {
      font-size: 1.5rem;
    }

    .demo-button {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }

    .demo-features {
      gap: 1rem;
      flex-direction: column;
      align-items: center;
    }

    .files-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .file-card-main {
      padding: 1.5rem;
    }

    .file-actions {
      flex-direction: column;
    }

    .file-link,
    .copy-url {
      justify-content: center;
    }

    .info-cards {
      flex-direction: column;
      align-items: center;
    }

    .info-card {
      max-width: 100%;
      min-width: auto;
      width: 100%;
    }

    .decision-matrix {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .compatibility-info,
    .usage-example,
    .benefits-info {
      padding: 0.75rem;
    }

    .card-pros-cons {
      gap: 0.75rem;
    }

    .section-description {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  }

  /* Melhorias de contraste específicas para tema escuro */
  :global([data-theme="dark"]) .demo-card {
    background: linear-gradient(
      135deg,
      rgb(15, 23, 42),
      /* Azul escuro mais profundo */ rgb(30, 41, 59),
      /* Azul médio escuro */ rgb(51, 65, 85) /* Azul claro escuro */
    );
    border: 1px solid rgba(148, 163, 184, 0.2); /* Borda mais sutil no tema escuro */
    box-shadow:
      var(--shadow-xl),
      inset 0 1px 0 rgba(148, 163, 184, 0.1);
  }

  :global([data-theme="dark"]) .demo-card h3 {
    color: rgb(248, 250, 252); /* Branco off-white para tema escuro */
  }

  :global([data-theme="dark"]) .demo-card p {
    color: rgb(226, 232, 240); /* Cinza claro para melhor legibilidade */
  }

  :global([data-theme="dark"]) .demo-button {
    background: rgba(148, 163, 184, 0.2); /* Fundo adaptado ao tema escuro */
    border: 2px solid rgba(148, 163, 184, 0.3);
    color: rgb(248, 250, 252);
  }

  :global([data-theme="dark"]) .demo-button:hover {
    background: rgba(148, 163, 184, 0.3);
    border-color: rgba(148, 163, 184, 0.4);
  }

  :global([data-theme="dark"]) .feature-item {
    background: rgba(148, 163, 184, 0.1);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  /* =============================================================================
    LOADING SPINNER & TRANSITIONS
  ============================================================================= */

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, var(--color-bg-0), var(--color-bg-1));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(10px);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .snake-container {
    width: 120px;
    height: 120px;
    position: relative;
  }

  .snake-svg {
    width: 100%;
    height: 100%;
    animation:
      snakeRotate 3s  ease-in-out infinite,
      snakeColorCycle 2s ease-in-out infinite;
    transform-origin: center;
    filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
  }

  .snake-svg path {
    fill: currentColor;
  }

  /* Animação de rotação alternando transições - SENTIDO HORÁRIO */
  @keyframes snakeRotate {
    0% {
      transform: rotate(-360deg);
    }
    50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Animação de cores com transição gradual suave */
  @keyframes snakeColorCycle {
    0% {
      color: hsl(220, 90%, 60%); /* Volta ao azul */
      filter: drop-shadow(0 4px 12px hsla(220, 90%, 60%, 0.4));
    }
    50% {
      color: hsl(60, 95%, 57%); /* Amarelo-limão */
      filter: drop-shadow(0 4px 12px hsla(60, 95%, 57%, 0.4));
    }
    100% {
      color: hsl(220, 90%, 60%); /* Volta ao azul */
      filter: drop-shadow(0 4px 12px hsla(220, 90%, 60%, 0.4));
    }
  }

  /* Variação alternada da animação para efeito mais dinâmico */
  .snake-svg:nth-child(odd) {
    animation:
      snakeRotate 1s ease-out infinite,
      snakeColorCycleReverse 1s linear infinite;
  }

  @keyframes snakeColorCycleReverse {
    0% {
      color: hsl(240, 88%, 58%); /* Azul-roxo */
      filter: drop-shadow(0 4px 12px hsla(240, 88%, 58%, 0.4));
    }
    100% {
      color: hsl(45, 100%, 55%); /* Volta ao amarelo */
      filter: drop-shadow(0 4px 12px hsla(45, 100%, 55%, 0.4));
    }
  }

  .loading-text {
    text-align: center;
    color: var(--color-text);
  }

  .loading-text h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    animation: loadingPulse 2s ease-in-out infinite;
  }

  .loading-text p {
    font-size: 1rem;
    color: var(--color-text-muted);
    animation: loadingPulse 2s ease-in-out infinite 0.5s;
  }

  @keyframes loadingPulse {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  /* Overlay de transição para mudanças de tema/idioma */
  .transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 8888;
    backdrop-filter: blur(2px);
  }

  .transition-spinner {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid var(--color-theme-1);
    border-radius: 50%;
    animation: pulseRing 1s ease-out infinite;
  }

  .transition-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    animation: iconSpin 0.8s ease-in-out infinite;
  }

  @keyframes pulseRing {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  @keyframes iconSpin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) scale(1);
    }
  }

  /* Transições suaves para o container principal */
  .container {
    transition: all var(--transition-slow);
  }

  .container.transitioning {
    opacity: 0.7;
    transform: scale(0.98);
  }

  /* Animações de entrada para elementos da página */
  .header {
    animation: slideInFromTop 0.8s ease-out;
  }

  .demo-card {
    animation: slideInFromBottom 1s ease-out 0.3s both;
  }

  .main-files-section {
    animation: slideInFromBottom 1s ease-out 0.5s both;
  }

  .controls {
    animation: slideInFromBottom 1s ease-out 0.7s both;
  }

  .file-grid {
    animation: slideInFromBottom 1s ease-out 0.9s both;
  }

  /* Animação staggered para file-cards */
  .file-card {
    animation: slideInFileCard 0.6s ease-out calc(1.1s + var(--delay, 0s)) both;
    transition: all var(--transition-normal);
  }

  .file-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  @keyframes slideInFileCard {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Adaptações para tema escuro */
  :global([data-theme="dark"]) .loading-overlay {
    background: linear-gradient(135deg, var(--color-bg-0), var(--color-bg-1));
  }

  :global([data-theme="dark"]) .transition-overlay {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Animações responsivas */
  @media (max-width: 768px) {
    .snake-container {
      width: 80px;
      height: 80px;
    }

    .loading-text h3 {
      font-size: 1.2rem;
    }

    .loading-text p {
      font-size: 0.9rem;
    }

    .transition-spinner {
      width: 40px;
      height: 40px;
    }

    .transition-icon {
      font-size: 1.2rem;
    }
  }

  /* Redução de movimento para usuários com preferência de acessibilidade */
  @media (prefers-reduced-motion: reduce) {
    .snake-svg {
      animation: snakeRotateSimple 10s ease infinite;
    }

    @keyframes snakeRotateSimple {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(
          360deg
        ); /* versão simplificada */
      }
    }

    .loading-text h3,
    .loading-text p {
      animation: none;
      opacity: 1;
    }

    .demo-card,
    .main-files-section,
    .controls,
    .file-grid,
    .header,
    .file-card {
      animation: none;
    }

    .container.transitioning {
      transition: none;
    }
  }

  /* Melhorias adicionais de hover para elementos interativos */
  .search-input {
    transition: all var(--transition-normal);
  }

  .search-input:focus {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .category-filter select {
    transition: all var(--transition-normal);
  }

  .category-filter select:focus {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .stat {
    transition: all var(--transition-normal);
  }

  .stat:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: var(--color-theme-1);
    color: white;
  }

  /* Efeito de pulse para elementos importantes */
  .warning-banner {
    animation: gentlePulse 3s ease-in-out infinite;
  }

  @keyframes gentlePulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.005);
    }
  }

  /* Estilos para o link discreto do dashboard */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .breadcrumb a {
    color: var(--color-theme-1);
    text-decoration: none;
    transition: all var(--transition-normal);
  }

  .breadcrumb a:hover {
    color: var(--color-theme-2);
  }

  .dashboard-link {
    margin-left: auto;
    opacity: 0.3;
    font-size: 1.2rem;
    transition: all var(--transition-normal);
    border-radius: 4px;
    padding: 0.25rem;
  }

  .dashboard-link:hover {
    opacity: 1;
    background: var(--color-bg-2);
    transform: scale(1.1);
  }
</style>
