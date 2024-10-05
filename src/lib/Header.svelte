<script lang="ts">
    import { theme, currentPage } from "./stores";
</script>

<header class="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto p-6 flex justify-between items-center">
        <a
            href="/"
            class="text-2xl font-bold text-gray-800 dark:text-gray-100 transition duration-300"
        >
            Orbital Eclipse
        </a>
        <nav class="flex space-x-4">
            <a
                href="#galleries"
                on:click={() => ($currentPage = "galleries")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "galleries"}
                class:bg-gray-200={$currentPage !== "galleries"}
                class:dark:bg-gray-600={$currentPage === "galleries"}
                class:dark:bg-gray-700={$currentPage !== "galleries"}
                class:text-gray-800={$currentPage !== "galleries"}
                class:text-gray-100={$currentPage === "galleries"}
            >
                galleries
            </a>
            <a
                href="#viewer"
                on:click={() => ($currentPage = "viewer")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "viewer"}
                class:bg-gray-200={$currentPage !== "viewer"}
                class:dark:bg-gray-600={$currentPage === "viewer"}
                class:dark:bg-gray-700={$currentPage !== "viewer"}
                class:text-gray-800={$currentPage !== "viewer"}
                class:text-gray-100={$currentPage === "viewer"}
            >
                viewer
            </a>
            <a
                href="#config"
                on:click={() => ($currentPage = "config")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "config"}
                class:bg-gray-200={$currentPage !== "config"}
                class:dark:bg-gray-600={$currentPage === "config"}
                class:dark:bg-gray-700={$currentPage !== "config"}
                class:text-gray-800={$currentPage !== "config"}
                class:text-gray-100={$currentPage === "config"}
            >
                config
            </a>
            <a
                href="#tools"
                on:click={() => ($currentPage = "tools")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "tools"}
                class:bg-gray-200={$currentPage !== "tools"}
                class:dark:bg-gray-600={$currentPage === "tools"}
                class:dark:bg-gray-700={$currentPage !== "tools"}
                class:text-gray-800={$currentPage !== "tools"}
                class:text-gray-100={$currentPage === "tools"}
            >
                tools
            </a>
        </nav>
        <div class="flex items-center space-x-4">
            <span class="text-lg text-gray-800 dark:text-gray-100">Light</span>

            <label
                for="theme-toggle"
                class="relative inline-flex items-center cursor-pointer"
            >
                <input
                    type="checkbox"
                    id="theme-toggle"
                    class="sr-only"
                    on:click={() =>
                        ($theme = $theme === "light" ? "dark" : "light")}
                    checked={$theme === "dark"}
                />

                <div
                    class="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-500 transition duration-300 ease-in-out"
                ></div>

                <div
                    class="absolute left-1 top-1 w-6 h-6 border border-gray-300 dark:border-gray-400 rounded-full shadow-md transition-transform duration-300 ease-in-out dark:translate-x-full dark:bg-gray-500 bg-gray-400"
                ></div>
            </label>

            <span class="text-lg text-gray-800 dark:text-gray-100">Dark</span>
        </div>
    </div>
</header>
