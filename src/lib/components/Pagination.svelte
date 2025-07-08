<script>
// @ts-nocheck

  import { _ } from "$lib/i18n/index.js";
  import { analytics } from "$lib/stores/analytics.js";
  import { browser } from "$app/environment";

  export let totalItems = 0;
  export let itemsPerPage = 20;
  export let currentPage = 1;
  export let onPageChange = () => {};

  $: totalPages = Math.ceil(totalItems / itemsPerPage);
  $: startItem = (currentPage - 1) * itemsPerPage + 1;
  $: endItem = Math.min(currentPage * itemsPerPage, totalItems);

  /**
   * @param {number} page
   */
  function changePage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      currentPage = page;
      onPageChange(page);
      
      // Track pagination usage
      if (browser) {
        analytics.trackEvent('pagination');
      }
    }
  }

  // Generate page numbers for display
  $: visiblePages = (() => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      // Calculate range around current page
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  })();
</script>

{#if totalPages > 1}
  <div class="pagination-container">
    <!-- Results info -->
    <div class="pagination-info">
      <span>
        {$_("pagination.showing")} <strong>{startItem}</strong> {$_("pagination.to")} <strong>{endItem}</strong> {$_("pagination.of")} <strong>{totalItems}</strong> {$_("pagination.results")}
      </span>
    </div>

    <!-- Navigation -->
    <nav class="pagination-nav" aria-label="Navegação de páginas">
      <!-- First page button -->
      <button
        class="pagination-btn first"
        disabled={currentPage === 1}
        on:click={() => changePage(1)}
        title={$_("pagination.first")}
        aria-label={$_("pagination.first")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 17l-5-5 5-5"/>
          <path d="M18 17l-5-5 5-5"/>
        </svg>
      </button>

      <!-- Previous page button -->
      <button
        class="pagination-btn prev"
        disabled={currentPage === 1}
        on:click={() => changePage(currentPage - 1)}
        title={$_("pagination.previous")}
        aria-label={$_("pagination.previous")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <!-- Page numbers -->
      <div class="pagination-pages">
        {#each visiblePages as page}
          {#if page === '...'}
            <span class="pagination-ellipsis">…</span>
          {:else}
            <button
              class="pagination-btn page {page === currentPage ? 'active' : ''}"
              on:click={() => changePage(page)}
              aria-label="{$_('pagination.goto_page')} {page}"
              aria-current={page === currentPage ? 'page' : null}
            >
              {page}
            </button>
          {/if}
        {/each}
      </div>

      <!-- Next page button -->
      <button
        class="pagination-btn next"
        disabled={currentPage === totalPages}
        on:click={() => changePage(currentPage + 1)}
        title={$_("pagination.next")}
        aria-label={$_("pagination.next")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      <!-- Last page button -->
      <button
        class="pagination-btn last"
        disabled={currentPage === totalPages}
        on:click={() => changePage(totalPages)}
        title={$_("pagination.last")}
        aria-label={$_("pagination.last")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 17l5-5-5-5"/>
          <path d="M6 17l5-5-5-5"/>
        </svg>
      </button>
    </nav>
  </div>
{/if}

<style>
  .pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
    padding: 1rem;
    background: var(--color-bg-1);
    border-radius: 12px;
    border: 1px solid var(--color-bg-2);
  }

  .pagination-info {
    color: var(--color-text-light);
    font-size: 0.9rem;
    text-align: center;
  }

  .pagination-info strong {
    color: var(--color-text);
    font-weight: 600;
  }

  .pagination-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-pages {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0.5rem;
    border: 1px solid var(--color-bg-2);
    background: var(--color-bg-0);
    color: var(--color-text);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .pagination-btn:hover:not(:disabled) {
    background: var(--color-theme-1);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .pagination-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--color-bg-1);
  }

  .pagination-btn.active {
    background: var(--color-theme-1);
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .pagination-btn.active:hover {
    background: var(--color-theme-1);
    transform: none;
  }

  .pagination-btn.first,
  .pagination-btn.last {
    background: var(--color-bg-2);
  }

  .pagination-btn.first:hover:not(:disabled),
  .pagination-btn.last:hover:not(:disabled) {
    background: var(--color-theme-2);
  }

  .pagination-ellipsis {
    padding: 0.5rem;
    color: var(--color-text-light);
    font-weight: 600;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .pagination-container {
      margin: 1.5rem 0;
      padding: 0.75rem;
    }

    .pagination-btn {
      min-width: 36px;
      height: 36px;
      font-size: 0.85rem;
    }

    .pagination-nav {
      gap: 0.25rem;
    }

    .pagination-pages {
      gap: 0.125rem;
    }

    .pagination-info {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .pagination-container {
      gap: 0.75rem;
    }

    .pagination-btn.first,
    .pagination-btn.last {
      display: none;
    }

    .pagination-btn {
      min-width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }

    .pagination-pages {
      max-width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .pagination-pages::-webkit-scrollbar {
      display: none;
    }
  }

  /* Dark mode adaptations */
  :global([data-theme="dark"]) .pagination-container {
    background: var(--color-bg-0);
    border-color: var(--color-bg-1);
  }

  :global([data-theme="dark"]) .pagination-btn {
    border-color: var(--color-bg-1);
    background: var(--color-bg-1);
  }

  :global([data-theme="dark"]) .pagination-btn:hover:not(:disabled) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  :global([data-theme="dark"]) .pagination-btn:disabled {
    background: var(--color-bg-0);
  }

  :global([data-theme="dark"]) .pagination-btn.first,
  :global([data-theme="dark"]) .pagination-btn.last {
    background: var(--color-bg-2);
  }

  /* Animation on page change */
  .pagination-btn {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Focus styles for accessibility */
  .pagination-btn:focus {
    outline: 2px solid var(--color-theme-1);
    outline-offset: 2px;
  }

  .pagination-btn:focus:not(:focus-visible) {
    outline: none;
  }
</style>
