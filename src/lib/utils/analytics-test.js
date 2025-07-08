/**
 * Utilitários para testar o sistema de analytics
 * Usado apenas em desenvolvimento para validar funcionamento
 */

import { analytics } from '$lib/stores/analytics.js';
import { logger } from '$lib/utils/logger.js';

export class AnalyticsTestUtil {
  /**
   * Simula eventos para testar o sistema
   */
  static async simulateEvents() {
    logger.log('🧪 Iniciando simulação de eventos de analytics...');

    try {
      // Simula algumas pesquisas
      for (let i = 0; i < 3; i++) {
        await analytics.trackEvent('search');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simula alguns filtros
      for (let i = 0; i < 2; i++) {
        await analytics.trackEvent('filter');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simula filtros por categoria
      const categories = ['Computação Científica', 'Análise de Dados', 'Machine Learning', 'Visualização'];
      for (const category of categories) {
        await analytics.trackEvent('category_filter', { category });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simula cópias de código
      await analytics.trackEvent('copy_commonjs');
      await analytics.trackEvent('copy_esm');

      // Simula acessos a arquivos
      const files = ['numpy-1.21.0.whl', 'pandas-1.3.0.whl', 'matplotlib-3.4.2.whl'];
      for (const file of files) {
        await analytics.trackEvent('file_access', { fileName: file });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      logger.log('✅ Simulação concluída! Verifique o dashboard.');
    } catch (error) {
      logger.error('❌ Erro na simulação:', error);
    }
  }

  /**
   * Verifica status atual do sistema
   */
  static async checkStatus() {
    logger.log('🔍 Verificando status do sistema de analytics...');

    try {
      const data = await analytics.getCurrentAnalytics();
      const status = analytics.getStatus();

      logger.log('📊 Dados atuais:', data);
      logger.log('🔧 Status do sistema:', status);

      // Verifica se dados estão sendo atualizados corretamente
      const checks = {
        'Page Views > 0': data.pageViews > 0,
        'Unique IPs >= 0': data.uniqueIPs >= 0,
        'Language Views exists': data.languageViews && typeof data.languageViews === 'object',
        'Top Files is array': Array.isArray(data.topFiles),
        'System is functional': status.isRemote || status.isLocal
      };

      logger.log('✅ Verificações:');
      Object.entries(checks).forEach(([check, passed]) => {
        logger.log(`${passed ? '✅' : '❌'} ${check}`);
      });

      return { data, status, checks };
    } catch (error) {
      logger.error('❌ Erro na verificação:', error);
      return null;
    }
  }

  /**
   * Força sincronização manual
   */
  static async forcSync() {
    logger.log('🔄 Forçando sincronização manual...');

    try {
      await analytics.syncWithRemote();
      logger.log('✅ Sincronização manual concluída');
    } catch (error) {
      logger.error('❌ Erro na sincronização manual:', error);
    }
  }

  /**
   * Limpa dados de teste (use com cuidado!)
   */
  static async clearTestData() {
    logger.warn('🗑️ Limpando dados de teste...');

    try {
      if (analytics.useLocalStorage) {
        localStorage.removeItem(analytics.localStorageKey);
        logger.log('✅ Dados locais limpos');
      } else {
        logger.warn('⚠️ Sistema está usando API remota. Limpeza manual necessária.');
      }
    } catch (error) {
      logger.error('❌ Erro na limpeza:', error);
    }
  }
}

// Expõe no window para uso no console (apenas em dev)
if (typeof window !== 'undefined' && analytics.getStatus().isRemote === false) {
  // @ts-ignore
  window.analyticsTest = AnalyticsTestUtil;
  logger.log('🧪 Utilitários de teste disponíveis em: window.analyticsTest');
}
