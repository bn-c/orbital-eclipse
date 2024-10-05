<script lang="ts">
  import Header from "./lib/Header.svelte";
  import Galleries from "./lib/Galleries.svelte";
  import Config from "./lib/Config.svelte";
  import Tools from "./lib/Tools.svelte";
  import { currentPage } from "./lib/stores";
</script>

<main
  class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
>
  <!-- Header Component -->
  <Header />

  <!-- Main Content Area -->
  {#if $currentPage === "Galleries"}
    <Galleries />
  {/if}
  {#if $currentPage === "Viewer"}
    <!-- Viewer component goes here -->
  {/if}
  {#if $currentPage === "Config"}
    <Config />
  {/if}
  {#if $currentPage === "Tools"}
    <Tools />
  {/if}
</main>
