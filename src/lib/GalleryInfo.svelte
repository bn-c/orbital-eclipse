<script lang="ts">
    import type { Gallery } from "./types";

    export let gallery: Gallery;

    const { name, author, description, tags, sources } = gallery.metadata;
</script>

<div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
    <div class="text-center mb-6">
        <h2
            class="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-2"
        >
            {name}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 italic">
            By: {author ? author : "Unknown"}
        </p>
    </div>

    <div
        class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner space-y-4"
    >
        {#if description}
            <div class="flex flex-col">
                <span
                    class="font-semibold text-lg text-gray-800 dark:text-gray-200"
                >
                    Description:
                </span>
                <p class="mt-1 text-gray-600 dark:text-gray-300">
                    {description}
                </p>
            </div>
        {/if}

        {#if tags && tags.length > 0}
            <div class="flex flex-col">
                <span
                    class="font-semibold text-lg text-gray-800 dark:text-gray-200"
                >
                    Tags:
                </span>
                <div class="flex flex-wrap gap-2 mt-1">
                    {#each tags as tag}
                        <span
                            class="bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100 rounded-full px-3 py-1 text-sm shadow"
                        >
                            {tag}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

        {#if sources && sources.length > 0}
            <div class="flex flex-col">
                <span
                    class="font-semibold text-lg text-gray-800 dark:text-gray-200"
                >
                    Sources:
                </span>
                <ul
                    class="list-disc pl-5 text-gray-600 dark:text-gray-300 mt-1"
                >
                    {#each sources as source}
                        <li>
                            <a
                                href={source}
                                class="text-blue-500 dark:text-blue-400 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {source}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>
