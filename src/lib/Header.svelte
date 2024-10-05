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
                on:click={() => ($currentPage = "Galleries")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "Galleries"}
                class:bg-gray-200={$currentPage !== "Galleries"}
                class:dark:bg-gray-600={$currentPage === "Galleries"}
                class:dark:bg-gray-700={$currentPage !== "Galleries"}
                class:text-gray-800={$currentPage !== "Galleries"}
                class:text-gray-100={$currentPage === "Galleries"}
            >
                Galleries
            </a>
            <a
                href="#viewer"
                on:click={() => ($currentPage = "Viewer")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "Viewer"}
                class:bg-gray-200={$currentPage !== "Viewer"}
                class:dark:bg-gray-600={$currentPage === "Viewer"}
                class:dark:bg-gray-700={$currentPage !== "Viewer"}
                class:text-gray-800={$currentPage !== "Viewer"}
                class:text-gray-100={$currentPage === "Viewer"}
            >
                Viewer
            </a>
            <a
                href="#config"
                on:click={() => ($currentPage = "Config")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "Config"}
                class:bg-gray-200={$currentPage !== "Config"}
                class:dark:bg-gray-600={$currentPage === "Config"}
                class:dark:bg-gray-700={$currentPage !== "Config"}
                class:text-gray-800={$currentPage !== "Config"}
                class:text-gray-100={$currentPage === "Config"}
            >
                Config
            </a>
            <a
                href="#tools"
                on:click={() => ($currentPage = "Tools")}
                class="px-4 py-2 rounded-md transition duration-300"
                class:bg-gray-300={$currentPage === "Tools"}
                class:bg-gray-200={$currentPage !== "Tools"}
                class:dark:bg-gray-600={$currentPage === "Tools"}
                class:dark:bg-gray-700={$currentPage !== "Tools"}
                class:text-gray-800={$currentPage !== "Tools"}
                class:text-gray-100={$currentPage === "Tools"}
            >
                Tools
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
