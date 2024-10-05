<script lang="ts">
  import Header from "./lib/Header.svelte";
  import Galleries from "./lib/Galleries.svelte";
  import Config from "./lib/Config.svelte";
  import Tools from "./lib/Tools.svelte";
  import Viewer from "./lib/Viewer.svelte";
  import { currentPage, type Page } from "./lib/stores";
  import { onMount } from "svelte";

  // Function to parse the URL fragment and update the currentPage store
  function parseURLFragment() {
    const hash = window.location.hash || "#galleries"; // Default to #galleries if no hash is set
    const page = hash.split("?")[0].slice(1); // Extract the page name from hash, e.g., "#viewer?view=CID" -> "viewer"
    currentPage.set(page as Page); // Capitalize the first letter and set it
  }

  // Set up the initial state and listen for hash changes
  onMount(() => {
    parseURLFragment();

    window.addEventListener("hashchange", () => {
      parseURLFragment();
    });
  });
</script>

<main
  class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300"
>
  <!-- Header Component -->
  <Header />

  <!-- Main Content Area -->
  {#if $currentPage === "galleries"}
    <Galleries />
  {/if}
  {#if $currentPage === "viewer"}
    <Viewer />
  {/if}
  {#if $currentPage === "config"}
    <Config />
  {/if}
  {#if $currentPage === "tools"}
    <Tools />
  {/if}
</main>
