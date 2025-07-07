<script>
  // @ts-nocheck
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
  $: currentLanguage =
    languages.find((lang) => lang.code === $locale) || languages[0];

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function changeLanguage(lang) {
    locale.set(lang.code);
    isOpen = false;

    // Salva a preferência no localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("preferred-language", lang.code);
    }
  }

  function handleClickOutside(event) {
    if (!event.target.closest(".settings-panel")) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
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
    <span class="chevron" class:rotated={isOpen}> ⌄ </span>
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
    position: relative;
    z-index: 1000;
  }

  .settings-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-lg);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.9rem;
    min-width: 80px;
    box-shadow: var(--shadow-md);
  }

  .settings-trigger:hover {
    border-color: var(--color-theme-1);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .settings-trigger:focus {
    outline: none;
    border-color: var(--color-theme-1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .current-selection {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .flag {
    font-size: 1.1rem;
  }

  .theme-indicator {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .chevron {
    font-size: 1rem;
    transition: transform var(--transition-normal);
    color: var(--color-theme-1);
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-3);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.95);
    transition: all var(--transition-slow) cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 240px;
    overflow: hidden;
    z-index: 1000;
  }

  .dropdown.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }

  .dropdown-content {
    padding: 1rem;
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
    gap: 0.25rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.9rem;
    text-align: left;
    width: 100%;
  }

  .option:hover {
    background: var(--color-bg-2);
    border-color: var(--color-theme-1);
    transform: translateX(2px);
  }

  .option.active {
    background: linear-gradient(
      135deg,
      var(--color-theme-1),
      var(--color-theme-2)
    );
    color: white;
    font-weight: 500;
  }

  .option.active:hover {
    background: linear-gradient(
      135deg,
      var(--color-theme-2),
      var(--color-theme-1)
    );
  }

  .option .icon,
  .option .flag {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .option .label {
    flex: 1;
  }

  .option .check {
    font-size: 0.9rem;
    color: inherit;
    opacity: 0.8;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    .dropdown {
      right: 0;
      left: 0;
      min-width: auto;
    }

    .dropdown-content {
      padding: 0.75rem;
    }

    .option {
      padding: 0.65rem;
    }
  }

  /* Tema escuro específico */
  [data-theme="dark"] .dropdown {
    border-color: var(--color-bg-3);
    background: rgba(15, 23, 42, 0.95);
  }

  [data-theme="dark"] .settings-trigger {
    background: var(--color-bg-1);
    border-color: var(--color-bg-3);
  }

  [data-theme="dark"] .option:hover {
    background: var(--color-bg-2);
  }
</style>
