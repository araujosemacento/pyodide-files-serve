// Dashboard não depende de dados do servidor
// Os analytics são carregados diretamente no cliente
export async function load() {
  return {
    analyticsData: {
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
    }
  };
}
