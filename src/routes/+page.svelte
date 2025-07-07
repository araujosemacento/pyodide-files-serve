<script>
  // @ts-ignore
  import { onMount } from "svelte";
  import { formatFileSize, getFileIcon, searchFiles } from "$lib/utils.js";
  // @ts-ignore
  import { currentPath, files, config } from "$lib/stores.js";
  import { theme } from "$lib/stores/theme.js";
  import { _, locale } from "$lib/i18n/index.js";
  import SettingsPanel from "$lib/components/SettingsPanel.svelte";

  // @ts-ignore
  export let data;

  let searchTerm = "";
  let selectedCategory = "all";
  /**
   * @type {string | any[]}
   */
  let filteredFiles = [];

  // Carregar preferência de idioma do localStorage
  onMount(() => {
    if (typeof localStorage !== "undefined") {
      const savedLanguage = localStorage.getItem("preferred-language");
      if (savedLanguage) {
        locale.set(savedLanguage);
      }
    }
  });

  // @ts-ignore
  $: $config = data.config;
  // @ts-ignore
  $: $files = data.files;
  $: {
    let filtered = $files;

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((file) => file.category === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      filtered = searchFiles(filtered, searchTerm);
    }

    filteredFiles = filtered;
  }

  /**
   * @param {{ type: string; path: string; }} file
   */
  function handleFileClick(file) {
    if (file.type === "directory") {
      // Navegar para diretório (implementar lógica de navegação)
      console.log("Navegando para:", file.path);
    } else {
      // Abrir arquivo
      window.open($config.baseUrl + file.path, "_blank");
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
</script>

<svelte:head>
  <title>{$config.title}</title>
  <meta name="description" content={$config.description} />
  <meta
    name="keywords"
    content="pyodide, python, webassembly, wasm, packages, wheel"
  />
</svelte:head>

<div class="container">
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
    <a href="/">🏠 {$_("home")}</a> / <span>{$_("backup_pyodide")}</span>
  </nav>

  <!-- Aviso importante sobre backup -->
  <div class="warning-banner">
    <h3>{@html $_("warning_banner.title")}</h3>
    <p>
      {@html $_("warning_banner.description")}
      {$_("warning_banner.access_url")}
      <code
        >https://araujosemacento.github.io/pyodide-files-serve/files/pyodide.js</code
      >
    </p>
    <p>
      <small>{@html $_("warning_banner.recommendation")}</small>
    </p>
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
      {#each filteredFiles as file}
        <div
          class="file-card {file.type === 'directory' ? 'directory' : ''}"
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
                📊 {formatFileSize(file.size)}
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
  [data-theme="dark"] .warning-banner {
    background: linear-gradient(
      135deg,
      rgba(251, 146, 60, 0.15),
      rgba(245, 158, 11, 0.1)
    );
    border-color: rgba(251, 146, 60, 0.4);
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
  }
</style>
