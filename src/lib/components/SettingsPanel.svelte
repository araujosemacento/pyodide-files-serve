<script>
  import { locale, _ } from "../i18n/index.js";
  import { theme, toggleTheme } from "../stores/theme.js";
  import { onMount } from "svelte";

  const languages = [
    { code: "en", name: "language_selector.english", flag: "🇺🇸" },
    { code: "pt", name: "language_selector.portuguese", flag: "🇧🇷" },
  ];

  let isOpen = false;
  let currentLanguage =
    languages.find((lang) => lang.code === $locale) || languages[0];

  // Atualizar idioma atual quando o locale muda
  // @ts-ignore
  $: currentLanguage =
    languages.find((lang) => lang.code === $locale) || languages[0];

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  /**
   * @param {{ code: any; name?: string; flag?: string; }} lang
   */
  function changeLanguage(lang) {
    locale.set(lang.code);
    isOpen = false;

    // Salva a preferência no localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("preferred-language", lang.code);
    }
  }

  /**
   * @param {{ target: { closest: (arg0: string) => any; }; }} event
   */
  function handleClickOutside(event) {
    if (!event.target.closest(".settings-panel")) {
      isOpen = false;
    }
  }

  onMount(() => {
    // @ts-ignore
    document.addEventListener("click", handleClickOutside);
    return () => {
      // @ts-ignore
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<div class="settings-panel">
  <button
    class="settings-trigger"
    on:click={toggleDropdown}
    aria-label="Settings"
    aria-expanded={isOpen}
  >
    <span class="current-selection">
      <span class="flag">{currentLanguage.flag}</span>
      <span class="theme-indicator">
        {#if $theme === "dark"}
          🌙
        {:else}
          ☀️
        {/if}
      </span>
    </span>
    <span class="chevron" class:rotated={isOpen}>⮟</span>
  </button>

  <div class="dropdown" class:open={isOpen}>
    <div class="dropdown-content">
      <!-- Seção de idiomas -->
      <div class="section">
        <h4 class="section-title">
          🌐 {$_("language_selector.title", { default: "Language" })}
        </h4>
        <div class="options">
          {#each languages as lang}
            <button
              class="option language-option"
              class:active={$locale === lang.code}
              on:click={() => changeLanguage(lang)}
            >
              <span class="flag">{lang.flag}</span>
              <span class="label">{$_(lang.name)}</span>
              {#if $locale === lang.code}
                <span class="check">✓</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Seção de tema -->
      <div class="section">
        <h4 class="section-title">
          🎨 {$_("theme_selector.title", { default: "Theme" })}
        </h4>
        <div class="options">
          <button
            class="option theme-option"
            class:active={$theme === "light"}
            on:click={() => $theme === "dark" && toggleTheme()}
          >
            <span class="icon">☀️</span>
            <span class="label"
              >{$_("theme_selector.light", { default: "Light" })}</span
            >
            {#if $theme === "light"}
              <span class="check">✓</span>
            {/if}
          </button>
          <button
            class="option theme-option"
            class:active={$theme === "dark"}
            on:click={() => $theme === "light" && toggleTheme()}
          >
            <span class="icon">🌙</span>
            <span class="label"
              >{$_("theme_selector.dark", { default: "Dark" })}</span
            >
            {#if $theme === "dark"}
              <span class="check">✓</span>
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-panel {
    width: fit-content;
    position: sticky;
    pointer-events: all;
    top: calc(100% - 5rem);
    margin: 0 0 0 85%;
  }

  .settings-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.9rem;
    box-shadow: var(--shadow-lg);
    color: var(--color-text);
    position: relative;
  }

  .settings-trigger:hover {
    border-color: var(--color-theme-1);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: var(--color-bg-2);
  }

  .settings-trigger:focus {
    outline: none;
    border-color: var(--color-theme-1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .settings-trigger:active {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }

  .current-selection {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text);
  }

  .flag {
    font-size: 1.1rem;
    filter: none;
  }

  .theme-indicator {
    font-size: 1rem;
    opacity: 0.9;
    filter: none;
  }

  .chevron {
    font-size: 1.2rem;
    transition: transform var(--transition-normal);
    color: var(--color-text-muted);
    font-weight: bold;
    line-height: 1;
    margin-left: auto;
    user-select: none;
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  /* Melhor indicador visual */
  .settings-trigger[aria-expanded="true"] .chevron {
    color: var(--color-theme-1);
  }

  .dropdown {
    position: absolute;
    bottom: calc(100% + 0.75rem);
    right: 0;
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px) scale(0.95);
    transition: all var(--transition-slow) cubic-bezier(0.4, 0, 0.2, 1);
    width: auto;
    height: auto;
    overflow: hidden;
    z-index: 1000;
    color: var(--color-text);
  }

  .dropdown.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }

  .dropdown-content {
    padding: 1.25rem;
  }

  .section {
    margin-bottom: 1rem;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-theme-1);
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-bg-3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.9rem;
    text-align: left;
    width: 100%;
    color: var(--color-text);
    font-family: inherit;
  }

  .option:hover {
    background: var(--color-bg-2);
    border-color: var(--color-theme-1);
    transform: translateX(4px);
    color: var(--color-text);
  }

  .option.active {
    background: linear-gradient(
      135deg,
      var(--color-theme-1),
      var(--color-theme-2)
    );
    color: white;
    font-weight: 500;
    border-color: transparent;
  }

  .option.active:hover {
    background: linear-gradient(
      135deg,
      var(--color-theme-2),
      var(--color-theme-1)
    );
    color: white;
    transform: translateX(4px);
  }

  .option .icon,
  .option .flag {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .option .label {
    flex: 1;
    color: inherit;
  }

  .option .check {
    font-size: 1rem;
    color: inherit;
    opacity: 0.9;
    font-weight: bold;
  }
  /* Responsividade aprimorada */
  @media (max-width: 768px) {
    .dropdown {
      right: 0;
      left: auto;
      max-width: calc(100vw - 3rem);
      width: auto;
    }

    .dropdown-content {
      padding: 1rem;
    }

    .option {
      padding: 0.75rem;
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .dropdown {
      right: 0;
      left: auto;
      max-width: calc(100vw - 2rem);
    }

    .settings-panel {
      margin: 0 0 0 70%;
    }
  }
</style>
