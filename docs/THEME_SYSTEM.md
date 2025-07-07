# Sistema de Temas

## Visão Geral

O sistema de temas claro/escuro foi implementado de forma simples e eficiente usando CSS Variables e Svelte stores.

## Estrutura

### 1. CSS Variables (app.css)

- **Tema Claro**: Cores base em tons de azul e cinza claro
- **Tema Escuro**: Cores base em tons de azul e cinza escuro
- **Transições**: Suaves entre mudanças de tema
- **Variáveis**: Padronizadas para cores, sombras, bordas e transições

### 2. Store do Tema (theme.js)

- **Detecção automática**: Preferência do sistema operacional
- **Persistência**: Salva preferência no localStorage
- **Reatividade**: Sincronização automática entre abas
- **Funções**: `toggleTheme()` e `setTheme()`

### 3. Componente Settings (SettingsPanel.svelte)

- **Toggle visual**: Botão para alternar entre temas
- **Indicadores**: Ícones ☀️ e 🌙 para identificar tema atual
- **Acessibilidade**: Suporte a navegação por teclado

### 4. Inicialização (app.html)

- **FOUC Prevention**: Script inline para evitar flash
- **Fallback**: Tema claro como padrão em caso de erro
- **color-scheme**: Definição para navegadores

## Como Usar

### Alternar Tema Programaticamente

```javascript
import { toggleTheme, setTheme } from '$lib/stores/theme.js';

// Alternar entre claro/escuro
toggleTheme();

// Definir tema específico
setTheme('dark');
setTheme('light');
```

### Acessar Estado do Tema

```svelte
<script>
  import { theme } from '$lib/stores/theme.js';
</script>

{#if $theme === 'dark'}
  <p>Modo escuro ativo</p>
{:else}
  <p>Modo claro ativo</p>
{/if}
```

### Adicionar Suporte em Novos Componentes

```css
.meu-componente {
  background: var(--color-bg-1);
  color: var(--color-text);
  border: 1px solid var(--color-bg-3);
  transition: all var(--transition-normal);
}

/* Customizações específicas do tema escuro (se necessário) */
[data-theme="dark"] .meu-componente {
  /* estilos específicos */
}
```

## Variáveis CSS Disponíveis

### Cores de Fundo

- `--color-bg-0`: Fundo principal (gradiente)
- `--color-bg-1`: Fundo de cards/containers
- `--color-bg-2`: Fundo de elementos secundários
- `--color-bg-3`: Bordas e separadores

### Cores de Tema

- `--color-theme-1`: Cor primária
- `--color-theme-2`: Cor primária mais escura

### Cores de Texto

- `--color-text`: Texto principal
- `--color-text-muted`: Texto secundário

### Cores de Estado

- `--color-success`: Verde para sucesso
- `--color-warning`: Laranja para avisos
- `--color-error`: Vermelho para erros

### Sombras

- `--shadow-sm`: Sombra pequena
- `--shadow-md`: Sombra média
- `--shadow-lg`: Sombra grande
- `--shadow-xl`: Sombra extra grande

### Transições

- `--transition-fast`: 150ms
- `--transition-normal`: 250ms
- `--transition-slow`: 350ms

### Border Radius

- `--border-radius-sm`: 6px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 12px

## Boas Práticas

1. **Use sempre variáveis CSS** em vez de cores hardcoded
2. **Adicione transições** para mudanças suaves
3. **Teste acessibilidade** em ambos os temas
4. **Mantenha contraste adequado** (WCAG 2.1)
5. **Use color-scheme** para elementos nativos do browser

## Estrutura de Arquivos

```plaintext
src/
├── app.css                     # Variáveis CSS globais
├── app.html                    # Inicialização do tema
├── lib/
│   ├── stores/
│   │   └── theme.js           # Store do tema
│   └── components/
│       └── SettingsPanel.svelte # UI para alternar tema
└── routes/
    └── +page.svelte           # Exemplo de uso
```

## Extensibilidade

O sistema foi projetado para ser facilmente extensível:

1. **Novos temas**: Adicione novos seletores CSS como `[data-theme="blue"]`
2. **Variáveis personalizadas**: Defina novas variáveis conforme necessário
3. **Animações**: Use as variáveis de transição para consistência
4. **Componentes**: Sempre use as variáveis para máxima compatibilidade
