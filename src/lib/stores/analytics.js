import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { ANALYTICS_CONFIG } from '$lib/config/analytics.js';
import { logger } from '$lib/utils/logger.js';

// Store para os dados de analytics
export const analyticsData = writable({
  pageViews: 0,
  uniqueIPs: 0,
  averageSessionDuration: 0,
  searchUsage: 0,
  filterUsage: 0,
  commonjsCopyClicks: 0,
  esmCopyClicks: 0,
  languageViews: {
    'pt-BR': 0,
    'en-US': 0
  },
  topFiles: []
});

// Store para controle de sessão
export const sessionStore = writable({
  sessionId: null,
  sessionStart: null,
  isNewSession: false
});

// Store para status do analytics
export const analyticsStatus = writable({
  isRemote: false,
  isLocal: false,
  isDisabled: false,
  basket: '',
  lastReconnectAttempt: 0,
  nextReconnectIn: 0
});

class AnalyticsService {
  constructor() {
    this.baseUrl = ANALYTICS_CONFIG.PANTRY_BASE_URL;
    this.pantryId = ANALYTICS_CONFIG.PANTRY_ID;
    this.basket = this.getCurrentBasket();
    this.lastRequestTime = 0;
    /** @type {Array<{method: string, data: any, resolve: Function, reject: Function}>} */
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.isDisabled = false;
    this.useLocalStorage = false;
    this.localStorageKey = `analytics_${this.basket}`;
    this.lastReconnectAttempt = 0;
    this.reconnectInterval = 5 * 60 * 1000; // 5 minutos

    // Cache local para evitar múltiplas requisições
    this.cachedData = null;
    this.cacheTimestamp = 0;
    this.cacheTimeout = 30000; // 30 segundos
    this.isInitialized = false;

    // Debounce para atualizações
    this.updateTimeout = null;
    this.pendingUpdates = {};
  }

  getCurrentBasket() {
    if (!browser) return ANALYTICS_CONFIG.DEV_BASKET;

    const hostname = window.location.hostname;
    const isDev = ANALYTICS_CONFIG.DEV_HOSTNAMES.includes(hostname);
    return isDev ? ANALYTICS_CONFIG.DEV_BASKET : ANALYTICS_CONFIG.PROD_BASKET;
  }

  /**
   * Sistema de fallback usando localStorage
   */
  getLocalAnalytics() {
    if (!browser) return null;

    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Erro ao carregar analytics do localStorage:', error);
      return null;
    }
  }

  /**
   * Salva analytics no localStorage
   * @param {any} data 
   */
  saveLocalAnalytics(data) {
    if (!browser) return false;

    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error('Erro ao salvar analytics no localStorage:', error);
      return false;
    }
  }

  /**
   * Verifica se deve tentar reconectar
   */
  shouldTryReconnect() {
    const now = Date.now();
    return (now - this.lastReconnectAttempt) > this.reconnectInterval;
  }

  /**
   * Tenta reconectar com a API remota
   */
  async tryReconnect() {
    if (!this.shouldTryReconnect() || !browser) return false;

    this.lastReconnectAttempt = Date.now();
    logger.log('Tentando reconectar com API remota...');

    try {
      // Testa conexão simples
      const testUrl = `${this.baseUrl}/${this.pantryId}/basket/${this.basket}`;
      const response = await fetch(testUrl, { method: 'GET' });

      if (response.ok || response.status === 400) {
        // 400 é OK - significa que o endpoint está funcionando
        logger.log('Reconexão bem-sucedida! Voltando para API remota.');
        this.useLocalStorage = false;
        this.isDisabled = false;

        // Sincroniza dados locais com remotos após reconexão
        await this.syncAfterReconnect();

        return true;
      }
    } catch (error) {
      logger.warn('Reconexão falhou, continuando com localStorage');
    }

    return false;
  }

  /**
   * Sincroniza dados após reconexão bem-sucedida
   */
  async syncAfterReconnect() {
    if (!this.cachedData) return;

    try {
      logger.log('Sincronizando dados locais após reconexão...');

      // Carrega dados remotos atuais
      const remoteData = await this.getAnalytics();

      if (remoteData) {
        // Faz merge dos dados locais com remotos
        const mergedData = this.mergeAnalyticsData(remoteData, this.cachedData);

        // Atualiza tanto cache quanto API
        this.cachedData = mergedData;
        await this.updateAnalytics(mergedData);

        // Atualiza store
        const processedData = this.processAnalytics(mergedData);
        // @ts-ignore
        analyticsData.set(processedData);

        logger.log('Sincronização pós-reconexão bem-sucedida');
      } else {
        // Se não há dados remotos, envia os locais
        await this.updateAnalytics(this.cachedData);
        logger.log('Dados locais enviados para API remota');
      }
    } catch (error) {
      logger.error('Erro na sincronização pós-reconexão:', error);
    }
  }

  /**
   * Faz merge de dados locais e remotos
   * @param {any} remoteData
   * @param {any} localData
   */
  mergeAnalyticsData(remoteData, localData) {
    const merged = { ...remoteData };

    // Soma valores numéricos
    const numericFields = ['pageViews', 'searchUsage', 'filterUsage', 'commonjsCopyClicks', 'esmCopyClicks'];
    numericFields.forEach(field => {
      merged[field] = (remoteData[field] || 0) + (localData[field] || 0);
    });

    // Merge de arrays únicos (IPs)
    merged.uniqueIPs = [...new Set([...(remoteData.uniqueIPs || []), ...(localData.uniqueIPs || [])])];

    // Merge de sessões
    merged.sessions = [...(remoteData.sessions || []), ...(localData.sessions || [])];
    if (merged.sessions.length > ANALYTICS_CONFIG.MAX_SESSIONS_STORED) {
      merged.sessions = merged.sessions.slice(-ANALYTICS_CONFIG.MAX_SESSIONS_STORED);
    }

    // Merge de language views
    merged.languageViews = {
      'pt-BR': (remoteData.languageViews?.['pt-BR'] || 0) + (localData.languageViews?.['pt-BR'] || 0),
      'en-US': (remoteData.languageViews?.['en-US'] || 0) + (localData.languageViews?.['en-US'] || 0)
    };

    // Merge de file access
    merged.fileAccess = { ...(remoteData.fileAccess || {}) };
    const localFileAccess = localData.fileAccess || {};
    Object.keys(localFileAccess).forEach(file => {
      merged.fileAccess[file] = (merged.fileAccess[file] || 0) + localFileAccess[file];
    });

    return merged;
  }

  /**
   * Rate limiting para evitar CORS e 429 errors
   */
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = ANALYTICS_CONFIG.MIN_REQUEST_INTERVAL;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      logger.log(`Rate limiting: aguardando ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Adiciona requisição à fila para processamento sequencial
   * @param {string} method
   * @param {any} data
   */
  async queueRequest(method, data = null) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ method, data, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Processa fila de requisições uma por vez
   */
  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const item = this.requestQueue.shift();
      if (!item) continue;

      const { method, data, resolve, reject } = item;

      try {
        await this.waitForRateLimit();
        const result = await this.makeRequest(method, data);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * @param {string} method
   * @param {any} data
   */
  async makeRequest(method, data = null) {
    if (!browser) return null;

    // Se está usando localStorage, simula as operações
    if (this.useLocalStorage) {
      return this.handleLocalStorageRequest(method, data);
    }

    // Tenta reconectar se necessário
    if (this.isDisabled && this.shouldTryReconnect()) {
      await this.tryReconnect();
    }

    // Se ainda está desabilitado, usa localStorage
    if (this.isDisabled) {
      return this.handleLocalStorageRequest(method, data);
    }

    try {
      const url = `${this.baseUrl}/${this.pantryId}/basket/${this.basket}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data && method !== 'GET') {
        // @ts-ignore
        options.body = JSON.stringify(data);
      }

      logger.log(`Fazendo requisição: ${method} ${url}`);
      if (data) logger.log('Dados enviados:', data);

      const response = await fetch(url, options);
      logger.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();

        // Tratamento específico para diferentes tipos de erro
        if (response.status === 400) {
          if (method === 'GET') {
            logger.log('Basket não existe ainda (normal em primeira execução)');
            return null;
          } else {
            // Erro 400 em POST/PUT pode indicar problema no Pantry ID ou dados inválidos
            logger.warn(`Erro 400 em ${method}: Possível problema no Pantry ID ou dados inválidos. Mudando para localStorage.`);
            this.switchToLocalStorage();
            return this.handleLocalStorageRequest(method, data);
          }
        }

        if (response.status === 429) {
          logger.warn('Rate limit atingido, mudando para localStorage temporariamente');
          this.switchToLocalStorage();
          return this.handleLocalStorageRequest(method, data);
        }

        if (response.status === 0 || errorText.includes('CORS')) {
          logger.warn('Erro de CORS detectado, mudando para localStorage');
          this.switchToLocalStorage();
          return this.handleLocalStorageRequest(method, data);
        }

        // Para outros erros HTTP (401, 403, 500, etc.), usar localStorage
        logger.warn(`Erro HTTP ${response.status}: ${errorText}. Mudando para localStorage.`);
        this.switchToLocalStorage();
        return this.handleLocalStorageRequest(method, data);
      }

      // POST retorna texto simples, outros métodos retornam JSON
      if (method === 'DELETE') {
        const result = await response.text();
        logger.log('DELETE sucesso:', result);
        return result;
      } else if (method === 'POST') {
        const result = await response.text();
        logger.log('POST sucesso:', result);
        return { success: true, message: result };
      } else {
        const result = await response.json();
        logger.log('Sucesso na requisição:', result);
        return result;
      }
    } catch (error) {
      logger.error('Analytics API Error:', error);

      // Para erros de rede/CORS, mudar para localStorage
      if (error instanceof Error &&
        (error.message.includes('CORS') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('Network'))) {
        logger.warn('Erro de rede detectado, mudando para localStorage');
        this.switchToLocalStorage();
        return this.handleLocalStorageRequest(method, data);
      }

      return null;
    }
  }

  /**
   * Muda para modo localStorage
   */
  switchToLocalStorage() {
    this.useLocalStorage = true;
    this.isDisabled = true;
    logger.log('📦 Analytics mudou para modo LOCAL (localStorage)');
  }

  /**
   * Gerencia requisições usando localStorage
   * @param {string} method 
   * @param {any} data 
   */
  handleLocalStorageRequest(method, data) {
    if (method === 'GET') {
      const localData = this.getLocalAnalytics();
      if (localData) {
        logger.log('📦 Carregando dados do localStorage');
        return localData;
      }
      return null;
    }

    if (method === 'POST' || method === 'PUT') {
      if (data) {
        const success = this.saveLocalAnalytics(data);
        if (success) {
          logger.log('📦 Dados salvos no localStorage');
          return method === 'POST' ? { success: true, message: 'Salvo localmente' } : data;
        }
      }
      return null;
    }

    return null;
  }

  async getAnalytics() {
    logger.log(`Tentando carregar analytics do basket: ${this.basket}`);
    return await this.queueRequest('GET');
  }

  /**
   * @param {any} data
   */
  async createBasket(data) {
    logger.log('Criando novo basket:', data);
    return await this.queueRequest('POST', data);
  }

  /**
   * @param {any} data
   */
  async updateAnalytics(data) {
    logger.log('Atualizando analytics:', data);
    return await this.queueRequest('PUT', data);
  }

  /**
   * Verifica se cache é válido
   */
  isCacheValid() {
    const now = Date.now();
    return this.cachedData && (now - this.cacheTimestamp) < this.cacheTimeout;
  }

  /**
   * Carrega dados com cache para evitar múltiplas requisições
   */
  async getCurrentAnalytics() {
    logger.log('Carregando analytics atual...');

    // Se ainda não foi inicializado ou cache é inválido, carrega dados frescos
    if (!this.isInitialized || !this.isCacheValid()) {
      await this.loadFreshData();
    }

    const processedData = this.processAnalytics(this.cachedData || this.getDefaultAnalytics());

    // @ts-ignore
    analyticsData.set(processedData);

    // Atualiza status
    analyticsStatus.set(this.getStatus());

    return processedData;
  }

  /**
   * Carrega dados frescos da API ou localStorage
   */
  async loadFreshData() {
    try {
      // Primeiro tenta carregar dados existentes
      let data = await this.getAnalytics();

      if (!data) {
        logger.log('Basket não existe, criando novo com POST...');
        const defaultData = this.getDefaultAnalytics();

        // Cria o basket com POST
        const createResult = await this.createBasket(defaultData);

        if (createResult && createResult.success) {
          logger.log('Basket criado com sucesso, carregando dados...');
          // Após criar, carrega os dados com GET
          data = await this.getAnalytics();
          if (!data) {
            logger.log('Erro ao carregar dados após criação, usando padrão');
            data = defaultData;
          }
        } else {
          logger.log('Falha ao criar basket, usando dados padrão');
          data = defaultData;
        }
      }

      // Atualiza cache
      this.cachedData = data;
      this.cacheTimestamp = Date.now();
      this.isInitialized = true;

    } catch (error) {
      logger.error('Erro ao carregar dados frescos:', error);
      this.cachedData = this.getDefaultAnalytics();
      this.cacheTimestamp = Date.now();
      this.isInitialized = true;
    }
  }

  getDefaultAnalytics() {
    return {
      pageViews: 0,
      uniqueIPs: [],
      sessions: [],
      searchUsage: 0,
      filterUsage: 0,
      commonjsCopyClicks: 0,
      esmCopyClicks: 0,
      languageViews: {
        'pt-BR': 0,
        'en-US': 0
      },
      fileAccess: {}
    };
  }

  async initializeSession() {
    if (!browser) return;

    const sessionKey = 'analytics_session';
    const lastSessionKey = 'analytics_last_session';
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const lastSession = localStorage.getItem(lastSessionKey);
    const isNewSession = !lastSession || (now - parseInt(lastSession)) > oneHour;

    if (isNewSession) {
      const sessionId = this.generateSessionId();
      const sessionData = {
        sessionId,
        sessionStart: now,
        isNewSession: true
      };

      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      localStorage.setItem(lastSessionKey, now.toString());

      // @ts-ignore
      sessionStore.set(sessionData);

      // Registra nova visualização
      await this.trackPageView();
      await this.trackUniqueIP();
    } else {
      const existingSession = JSON.parse(localStorage.getItem(sessionKey) || '{}');
      sessionStore.set({ ...existingSession, isNewSession: false });
    }

    this.setupSessionEndListener();
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  setupSessionEndListener() {
    if (!browser) return;

    const handleSessionEnd = async () => {
      const sessionData = JSON.parse(localStorage.getItem('analytics_session') || '{}');
      if (sessionData.sessionStart) {
        const duration = Date.now() - sessionData.sessionStart;
        await this.trackSessionDuration(duration);
      }
    };

    window.addEventListener('beforeunload', handleSessionEnd);
    setInterval(handleSessionEnd, ANALYTICS_CONFIG.SAVE_INTERVAL);
  }

  /**
   * Atualiza cache local e agenda sincronização
   * @param {string} key
   * @param {any} value
   */
  updateLocalCache(key, value) {
    if (!this.cachedData) {
      this.cachedData = this.getDefaultAnalytics();
    }

    // Atualiza cache local imediatamente
    if (key === 'pageViews' || key === 'searchUsage' || key === 'filterUsage' ||
      key === 'commonjsCopyClicks' || key === 'esmCopyClicks') {
      this.cachedData[key] = (this.cachedData[key] || 0) + (value || 1);
    } else if (key === 'languageViews') {
      this.cachedData.languageViews = this.cachedData.languageViews || {};
      this.cachedData.languageViews[value] = (this.cachedData.languageViews[value] || 0) + 1;
    } else if (key === 'uniqueIPs') {
      this.cachedData.uniqueIPs = this.cachedData.uniqueIPs || [];
      if (!this.cachedData.uniqueIPs.includes(value)) {
        this.cachedData.uniqueIPs.push(value);
      }
    } else if (key === 'sessions') {
      this.cachedData.sessions = this.cachedData.sessions || [];
      this.cachedData.sessions.push(value);
      if (this.cachedData.sessions.length > ANALYTICS_CONFIG.MAX_SESSIONS_STORED) {
        this.cachedData.sessions = this.cachedData.sessions.slice(-ANALYTICS_CONFIG.MAX_SESSIONS_STORED);
      }
    } else if (key === 'fileAccess') {
      this.cachedData.fileAccess = this.cachedData.fileAccess || {};
      this.cachedData.fileAccess[value] = (this.cachedData.fileAccess[value] || 0) + 1;
    }

    // Atualiza store imediatamente para UI responsiva
    const processedData = this.processAnalytics(this.cachedData);
    // @ts-ignore
    analyticsData.set(processedData);

    // Agenda sincronização com debounce
    this.scheduleSync();
  }

  /**
   * Agenda sincronização com debounce
   */
  scheduleSync() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(async () => {
      await this.syncWithRemote();
    }, 2000); // 2 segundos de debounce
  }

  /**
   * Sincroniza cache local com API remota
   */
  async syncWithRemote() {
    if (!this.cachedData) return;

    try {
      logger.log('Sincronizando com API remota...');
      await this.updateAnalytics(this.cachedData);
      logger.log('Sincronização bem-sucedida');
    } catch (error) {
      logger.error('Erro na sincronização:', error);
    }
  }

  async trackPageView() {
    try {
      // Atualiza cache local imediatamente
      this.updateLocalCache('pageViews', 1);

      // Incrementa por idioma
      const language = this.getLanguage();
      this.updateLocalCache('languageViews', language);

      logger.log('Page view registrado');
    } catch (error) {
      logger.error('Erro ao trackear page view:', error);
    }
  }

  async trackUniqueIP() {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Atualiza cache local imediatamente
      this.updateLocalCache('uniqueIPs', ip);

      logger.log('IP único registrado:', ip);
    } catch (error) {
      logger.error('Erro ao trackear IP:', error);
    }
  }

  /**
   * @param {number} duration
   */
  async trackSessionDuration(duration) {
    try {
      const sessionData = {
        start: Date.now() - duration,
        duration: duration,
        timestamp: Date.now()
      };

      // Atualiza cache local imediatamente
      this.updateLocalCache('sessions', sessionData);

      logger.log('Duração de sessão registrada:', duration);
    } catch (error) {
      logger.error('Erro ao trackear duração:', error);
    }
  }

  /**
   * @param {any} eventType
   */
  async trackEvent(eventType, eventData = {}) {
    try {
      switch (eventType) {
        case 'search':
          this.updateLocalCache('searchUsage', 1);
          break;
        case 'filter':
          this.updateLocalCache('filterUsage', 1);
          break;
        case 'copy_commonjs':
          this.updateLocalCache('commonjsCopyClicks', 1);
          break;
        case 'copy_esm':
          this.updateLocalCache('esmCopyClicks', 1);
          break;
        case 'file_access':
          // @ts-ignore
          const fileName = eventData.fileName;
          if (fileName) {
            this.updateLocalCache('fileAccess', fileName);
          }
          break;
      }

      logger.log('Evento registrado:', eventType, eventData);
    } catch (error) {
      logger.error('Erro ao trackear evento:', error);
    }
  }

  /**
   * @param {{ pageViews: any; uniqueIPs: any; averageSessionDuration?: number; searchUsage: any; filterUsage: any; commonjsCopyClicks: any; esmCopyClicks: any; languageViews: any; topFiles?: { fileName: string; count: any; }[]; sessions?: any; fileAccess?: any; }} rawData
   */
  processAnalytics(rawData) {
    // Calcula duração média das sessões
    const sessions = rawData.sessions || [];
    const averageSessionDuration = sessions.length > 0
      ? sessions.reduce((/** @type {any} */ sum, /** @type {{ duration: any; }} */ session) => sum + session.duration, 0) / sessions.length
      : 0;

    // Processa top 10 arquivos
    const fileAccess = rawData.fileAccess || {};
    const topFiles = Object.entries(fileAccess)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([fileName, count]) => ({ fileName, count }));

    return {
      pageViews: rawData.pageViews || 0,
      uniqueIPs: Array.isArray(rawData.uniqueIPs) ? rawData.uniqueIPs.length : 0,
      averageSessionDuration,
      searchUsage: rawData.searchUsage || 0,
      filterUsage: rawData.filterUsage || 0,
      commonjsCopyClicks: rawData.commonjsCopyClicks || 0,
      esmCopyClicks: rawData.esmCopyClicks || 0,
      languageViews: rawData.languageViews || { 'pt-BR': 0, 'en-US': 0 },
      topFiles
    };
  }

  getLanguage() {
    if (!browser) return 'pt-BR';
    const lang = localStorage.getItem('preferred-language') || navigator.language;
    return lang.startsWith('pt') ? 'pt-BR' : 'en-US';
  }

  /**
   * Obtém status atual do sistema de analytics
   */
  getStatus() {
    return {
      isRemote: !this.useLocalStorage && !this.isDisabled,
      isLocal: this.useLocalStorage,
      isDisabled: this.isDisabled && !this.useLocalStorage,
      basket: this.basket,
      lastReconnectAttempt: this.lastReconnectAttempt,
      nextReconnectIn: this.useLocalStorage ?
        Math.max(0, this.reconnectInterval - (Date.now() - this.lastReconnectAttempt)) : 0
    };
  }

  /**
   * Limpa recursos e timeouts
   */
  cleanup() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }
}

export const analytics = new AnalyticsService();
