<script>
  // @ts-nocheck

  import { locale, _ } from "../i18n/index.js";

  const languages = [
    { code: "en", name: "language_selector.english", flag: "🇺🇸" },
    { code: "pt", name: "language_selector.portuguese", flag: "🇧🇷" },
  ];

  /**
   * @param {string | null | undefined} lang
   */
  function changeLanguage(lang) {
    locale.set(lang);
    // Salva a preferência no localStorage
    if (typeof localStorage !== "undefined") {
      // @ts-ignore
      localStorage.setItem("preferred-language", lang);
    }
  }
</script>

<div class="language-selector">
  <select
    bind:value={$locale}
    on:change={(e) => changeLanguage(e.target.value)}
    aria-label={$_("accessibility.select_language", {
      default: "Select language",
    })}
  >
    {#each languages as lang}
      <option value={lang.code}>
        {lang.flag}
        {$_(lang.name)}
      </option>
    {/each}
  </select>
</div>

<style>
  .language-selector {
    position: relative;
  }

  select {
    background: var(--color-bg-1);
    border: 2px solid var(--color-bg-2);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  select:hover {
    border-color: var(--color-theme-1);
  }

  select:focus {
    outline: none;
    border-color: var(--color-theme-1);
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.2);
  }
</style>
