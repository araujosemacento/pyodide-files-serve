<script>
// @ts-nocheck

  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { analyticsData, analytics, analyticsStatus } from "$lib/stores/analytics.js";
  import { theme } from "$lib/stores/theme.js";
  import { _, locale, json } from "$lib/i18n/index.js";
  import { createUrl } from "$lib/routing.js";
  import { logger } from "$lib/utils/logger.js";

  export const data = {};

  let isLoading = true;
  let chartContainer;
  let progressBars = {};

  onMount(() => {
    // Carregar dados de analytics no cliente
    loadAnalyticsData();
    
    // Configurar atualização periódica dos dados
    const intervalId = setInterval(loadAnalyticsData, 30000); // 30 segundos
    
    setTimeout(() => {
      isLoading = false;
      animateCharts();
    }, 1000);

    // Cleanup do interval quando componente é destruído
    return () => {
      clearInterval(intervalId);
    };
  });

  async function loadAnalyticsData() {
    try {
      logger.log('Dashboard: Carregando dados de analytics...');
      const data = await analytics.getCurrentAnalytics();
      analyticsData.set(data);
      logger.log('Dashboard: Dados carregados com sucesso', data);
    } catch (error) {
      logger.error('Dashboard: Erro ao carregar analytics:', error);
      // Usar dados padrão em caso de erro
      analyticsData.set({
        pageViews: 0,
        uniqueIPs: 0,
        averageSessionDuration: 0,
        searchUsage: 0,
        filterUsage: 0,
        categoryFilterUsage: {},
        commonjsCopyClicks: 0,
        esmCopyClicks: 0,
        languageViews: { 'pt-BR': 0, 'en-US': 0 },
        topFiles: [],
        topCategories: []
      });
    }
  }

  function animateCharts() {
    // Anima as barras de progresso
    Object.keys(progressBars).forEach(key => {
      const element = progressBars[key];
      if (element) {
        element.style.width = '0%';
        setTimeout(() => {
          element.style.transition = 'width 1.5s ease-out';
          element.style.width = element.dataset.width + '%';
        }, 100);
      }
    });
  }

  /**
   * @param {number} milliseconds
   */
  function formatDuration(milliseconds) {
    if (!milliseconds) return '0s';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * @param {number} index
   */
  function getProgressColor(index) {
    const colors = [
      'var(--color-theme-1)',
      'var(--color-theme-2)', 
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#ec4899'
    ];
    return colors[index % colors.length];
  }

  $: stats = $analyticsData;
  $: maxFileAccess = Math.max(...(stats.topFiles?.map(f => f.count) || [1]));
</script>

<svelte:head>
  <title>Dashboard - Analytics</title>
  <meta name="description" content="Dashboard de analytics do servidor Pyodide" />
</svelte:head>

{#if isLoading}
  <div class="loading-overlay" transition:fade={{ duration: 500 }}>
    <div class="loading-content">
      <div class="analytics-icon">📊</div>
      <h3>Carregando Analytics...</h3>
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  </div>
{/if}

{#if !isLoading}
  <div class="dashboard-container" transition:fade={{ duration: 600, delay: 200 }}>
    <header class="dashboard-header">
      <div class="header-content">
        <h1>📊 {$_("dashboard.title", { default: "Analytics Dashboard" })}</h1>
        <p>{$_("dashboard.description", { default: "Insights e métricas de uso da aplicação" })}</p>
        <nav class="dashboard-nav">
          <a href={createUrl("/")} class="back-link">
            ← {$_("dashboard.back_to_home", { default: "Voltar ao Início" })}
          </a>
        </nav>
      </div>
    </header>

    <div class="stats-grid">
      <!-- Card: Visualizações de Página -->
      <div class="stat-card primary" transition:fly={{ y: 20, delay: 100 }}>
        <div class="stat-icon">👁️</div>
        <div class="stat-content">
          <h3>{stats.pageViews}</h3>
          <p>{$_("dashboard.page_views", { default: "Visualizações de Página" })}</p>
        </div>
        <div class="stat-trend positive">↗️</div>
      </div>

      <!-- Card: IPs Únicos -->
      <div class="stat-card secondary" transition:fly={{ y: 20, delay: 200 }}>
        <div class="stat-icon">🌐</div>
        <div class="stat-content">
          <h3>{stats.uniqueIPs}</h3>
          <p>{$_("dashboard.unique_ips", { default: "IPs Únicos" })}</p>
        </div>
        <div class="stat-trend positive">↗️</div>
      </div>

      <!-- Card: Duração Média -->
      <div class="stat-card accent" transition:fly={{ y: 20, delay: 300 }}>
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <h3>{formatDuration(stats.averageSessionDuration)}</h3>
          <p>{$_("dashboard.avg_duration", { default: "Duração Média" })}</p>
        </div>
        <div class="stat-trend neutral">➡️</div>
      </div>

      <!-- Card: Uso de Pesquisa -->
      <div class="stat-card info" transition:fly={{ y: 20, delay: 400 }}>
        <div class="stat-icon">🔍</div>
        <div class="stat-content">
          <h3>{stats.searchUsage}</h3>
          <p>{$_("dashboard.search_usage", { default: "Uso da Pesquisa" })}</p>
        </div>
        <div class="stat-trend positive">↗️</div>
      </div>
    </div>

    <div class="charts-section">
      <!-- Gráfico de Interações -->
      <div class="chart-card" transition:fly={{ y: 30, delay: 500 }}>
        <h3>🎯 {$_("dashboard.interactions", { default: "Interações dos Usuários" })}</h3>
        <div class="interactions-chart">
          <div class="interaction-item">
            <span class="interaction-label">{$_("dashboard.filter_usage", { default: "Uso de Filtros" })}</span>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                bind:this={progressBars.filter}
                data-width={Math.min((stats.filterUsage / Math.max(stats.pageViews, 1)) * 100, 100)}
                style="background-color: {getProgressColor(0)}"
              ></div>
            </div>
            <span class="interaction-count">{stats.filterUsage}</span>
          </div>

          <div class="interaction-item">
            <span class="interaction-label">{$_("dashboard.commonjs_copies", { default: "Cópias CommonJS" })}</span>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                bind:this={progressBars.commonjs}
                data-width={Math.min((stats.commonjsCopyClicks / Math.max(stats.pageViews, 1)) * 100, 100)}
                style="background-color: {getProgressColor(1)}"
              ></div>
            </div>
            <span class="interaction-count">{stats.commonjsCopyClicks}</span>
          </div>

          <div class="interaction-item">
            <span class="interaction-label">{$_("dashboard.esm_copies", { default: "Cópias ES Module" })}</span>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                bind:this={progressBars.esm}
                data-width={Math.min((stats.esmCopyClicks / Math.max(stats.pageViews, 1)) * 100, 100)}
                style="background-color: {getProgressColor(2)}"
              ></div>
            </div>
            <span class="interaction-count">{stats.esmCopyClicks}</span>
          </div>
        </div>
      </div>

      <!-- Gráfico de Idiomas -->
      <div class="chart-card" transition:fly={{ y: 30, delay: 600 }}>
        <h3>🌍 {$_("dashboard.language_distribution", { default: "Distribuição por Idioma" })}</h3>
        <div class="language-chart">
          <div class="language-item">
            <div class="language-flag">🇧🇷</div>
            <div class="language-info">
              <span class="language-name">Português (BR)</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  bind:this={progressBars.ptBR}
                  data-width={Math.min((stats.languageViews['pt-BR'] / Math.max(stats.pageViews, 1)) * 100, 100)}
                  style="background: linear-gradient(90deg, #10b981, #059669)"
                ></div>
              </div>
              <span class="language-count">{stats.languageViews['pt-BR']}</span>
            </div>
          </div>

          <div class="language-item">
            <div class="language-flag">🇺🇸</div>
            <div class="language-info">
              <span class="language-name">English (US)</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  bind:this={progressBars.enUS}
                  data-width={Math.min((stats.languageViews['en-US'] / Math.max(stats.pageViews, 1)) * 100, 100)}
                  style="background: linear-gradient(90deg, #3b82f6, #1d4ed8)"
                ></div>
              </div>
              <span class="language-count">{stats.languageViews['en-US']}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Status do Analytics -->
      <div class="status-card" transition:fly={{ y: 30, delay: 650 }}>
        <h3>🔧 {$_("dashboard.analytics_status", { default: "Status do Analytics" })}</h3>
        <div class="status-content">
          {#if $analyticsStatus.isRemote}
            <div class="status-item online">
              <div class="status-indicator"></div>
              <span>🌐 Remoto (Pantry Cloud)</span>
            </div>
          {:else if $analyticsStatus.isLocal}
            <div class="status-item local">
              <div class="status-indicator"></div>
              <span>📦 Local (localStorage)</span>
            </div>
            <div class="reconnect-info">
              <small>Tentará reconectar em {Math.ceil($analyticsStatus.nextReconnectIn / 60000)}min</small>
            </div>
          {:else}
            <div class="status-item offline">
              <div class="status-indicator"></div>
              <span>⚠️ Desabilitado</span>
            </div>
          {/if}
          <div class="basket-info">
            <small>Basket: {$analyticsStatus.basket}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Files Section -->
    {#if stats.topFiles && stats.topFiles.length > 0}
      <div class="top-files-section" transition:fly={{ y: 30, delay: 700 }}>
        <h3>🔥 {$_("dashboard.top_files", { default: "Top 10 Arquivos Mais Acessados" })}</h3>
        <div class="top-files-grid">
          {#each stats.topFiles as file, index}
            <div 
              class="file-rank-card" 
              transition:fly={{ x: -20, delay: 800 + (index * 50) }}
            >
              <div class="rank-number">#{index + 1}</div>
              <div class="file-info">
                <div class="file-name" title={file.fileName}>{file.fileName}</div>
                <div class="access-count">{file.count} acessos</div>
              </div>
              <div class="file-progress">
                <div 
                  class="file-progress-bar" 
                  bind:this={progressBars[`file-${index}`]}
                  data-width={(file.count / maxFileAccess) * 100}
                  style="background-color: {getProgressColor(index)}"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Top Categories Section -->
    {#if stats.topCategories && stats.topCategories.length > 0}
      <div class="top-categories-section" transition:fly={{ y: 30, delay: 750 }}>
        <h3>📂 {$_("dashboard.top_categories", { default: "Categorias Mais Filtradas" })}</h3>
        <div class="top-categories-grid">
          {#each stats.topCategories as category, index}
            <div 
              class="category-rank-card" 
              transition:fly={{ x: 20, delay: 850 + (index * 50) }}
            >
              <div class="rank-number">#{index + 1}</div>
              <div class="category-info">
                <div class="category-name" title={category.categoryName}>
                  {$_(`categories.${category.categoryName}`, { default: category.categoryName })}
                </div>
                <div class="filter-count">{category.count} filtros aplicados</div>
              </div>
              <div class="category-progress">
                <div 
                  class="category-progress-bar" 
                  bind:this={progressBars[`category-${index}`]}
                  data-width={(category.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}
                  style="background-color: {getProgressColor(index + 10)}"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <footer class="dashboard-footer">
      <p>
        <small>
          📊 {$_("dashboard.footer_text", { default: "Analytics atualizados em tempo real através do Pantry Cloud" })}
        </small>
      </p>
    </footer>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg-1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .loading-content {
    text-align: center;
  }

  .analytics-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .loading-content h3 {
    color: var(--color-text);
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  .loading-bar {
    width: 200px;
    height: 4px;
    background: var(--color-bg-3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
  }

  .loading-progress {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, var(--color-theme-1), var(--color-theme-2));
    border-radius: 2px;
    animation: loading 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes loading {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
  }

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--color-theme-1);
  }

  .dashboard-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dashboard-header p {
    font-size: 1.2rem;
    color: var(--color-text-muted);
    margin-bottom: 2rem;
  }

  .dashboard-nav {
    margin-top: 1rem;
  }

  .back-link {
    color: var(--color-theme-1);
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-md);
    border: 2px solid var(--color-theme-1);
    transition: all var(--transition-normal);
  }

  .back-link:hover {
    background: var(--color-theme-1);
    color: white;
    transform: translateY(-2px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: var(--color-bg-2);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    border: 2px solid var(--color-bg-3);
    position: relative;
    overflow: hidden;
    transition: all var(--transition-normal);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-color);
  }

  .stat-card.primary {
    --gradient-color: linear-gradient(90deg, var(--color-theme-1), var(--color-theme-2));
  }

  .stat-card.secondary {
    --gradient-color: linear-gradient(90deg, #10b981, #059669);
  }

  .stat-card.accent {
    --gradient-color: linear-gradient(90deg, #f59e0b, #d97706);
  }

  .stat-card.info {
    --gradient-color: linear-gradient(90deg, #8b5cf6, #7c3aed);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2.5rem;
    opacity: 0.8;
  }

  .stat-content {
    flex: 1;
  }

  .stat-content h3 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
    line-height: 1;
  }

  .stat-content p {
    color: var(--color-text-muted);
    margin: 0.5rem 0 0 0;
    font-weight: 500;
  }

  .stat-trend {
    font-size: 1.5rem;
    opacity: 0.7;
  }

  .charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .chart-card {
    background: var(--color-bg-2);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    border: 2px solid var(--color-bg-3);
    transition: all var(--transition-normal);
  }

  .chart-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .chart-card h3 {
    margin-bottom: 2rem;
    color: var(--color-text);
    font-size: 1.3rem;
  }

  /* Status Card */
  .status-card {
    background: var(--color-bg-2);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    border: 2px solid var(--color-bg-3);
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }

  .status-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
  }

  .status-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .status-card h3 {
    margin-bottom: 1.5rem;
    color: var(--color-text);
    font-size: 1.3rem;
  }

  .status-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-bg-1);
    border-radius: var(--border-radius);
    font-weight: 500;
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-item.online .status-indicator {
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }

  .status-item.local .status-indicator {
    background: #f59e0b;
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }

  .status-item.offline .status-indicator {
    background: #ef4444;
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }

  .reconnect-info,
  .basket-info {
    padding: 0.5rem 0.75rem;
    background: var(--color-bg-3);
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    color: var(--color-text-2);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--status-color), 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(var(--status-color), 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(var(--status-color), 0);
    }
  }

  .interactions-chart,
  .language-chart {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .interaction-item,
  .language-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .interaction-label,
  .language-name {
    min-width: 140px;
    font-weight: 500;
    color: var(--color-text);
  }

  .language-flag {
    font-size: 1.5rem;
  }

  .language-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--color-bg-3);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    width: 0%;
  }

  .interaction-count,
  .language-count {
    min-width: 40px;
    text-align: right;
    font-weight: 600;
    color: var(--color-text);
  }

  .top-files-section {
    margin-bottom: 3rem;
  }

  .top-files-section h3,
  .top-categories-section h3 {
    margin-bottom: 2rem;
    color: var(--color-text);
    font-size: 1.5rem;
    text-align: center;
  }

  .top-files-grid,
  .top-categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .top-categories-section {
    margin-bottom: 3rem;
  }

  .file-rank-card {
    background: var(--color-bg-2);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    border: 2px solid var(--color-bg-3);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all var(--transition-normal);
  }

  .file-rank-card:hover,
  .category-rank-card:hover {
    transform: translateX(4px);
    border-color: var(--color-theme-1);
  }

  .category-rank-card {
    background: var(--color-bg-2);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    border: 2px solid var(--color-bg-3);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all var(--transition-normal);
  }

  .rank-number {
    background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .file-info {
    flex: 1;
  }

  .category-info {
    flex: 1;
  }

  .file-name,
  .category-name {
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }

  .access-count,
  .filter-count {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .file-progress,
  .category-progress {
    width: 60px;
    height: 4px;
    background: var(--color-bg-3);
    border-radius: 2px;
    overflow: hidden;
  }

  .file-progress-bar,
  .category-progress-bar {
    height: 100%;
    border-radius: 2px;
    width: 0%;
  }

  .dashboard-footer {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--color-bg-3);
    color: var(--color-text-muted);
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .charts-section {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .top-files-grid {
      grid-template-columns: 1fr;
    }

    .top-categories-grid {
      grid-template-columns: 1fr;
    }

    .interaction-item,
    .language-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .language-info {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }
  }
</style>
