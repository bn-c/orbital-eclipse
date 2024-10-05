<script lang="ts">
    import { galleries, ipfsGateway } from "./stores";
    import { writable, derived } from "svelte/store";

    const searchQuery = writable("");
    const filteredGalleries = derived(
        [galleries, searchQuery],
        ([$galleries, $searchQuery]) => {
            if (!$searchQuery.trim()) return $galleries;

            return $galleries.filter((gallery) => {
                const { name, author, description, tags } = gallery.metadata;
                const searchLower = $searchQuery.toLowerCase();

                return (
                    (name && name.toLowerCase().includes(searchLower)) ||
                    (author && author.toLowerCase().includes(searchLower)) ||
                    (description &&
                        description.toLowerCase().includes(searchLower)) ||
                    (tags &&
                        tags.some((tag) =>
                            tag.toLowerCase().includes(searchLower),
                        ))
                );
            });
        },
    );

    function ipfsLinks(cid: string, file: string): string {
        return `${$ipfsGateway}/ipfs/${cid}/${file}`;
    }

    function shortenText(text: string, maxLength: number = 20): string {
        return text.length > maxLength
            ? `${text.slice(0, maxLength)}...`
            : text;
    }
</script>

<section
    class="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg transition duration-300"
>
    <h2
        class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Available Galleries
    </h2>

    <div class="mb-8 max-w-xl mx-auto">
        <input
            type="text"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            placeholder="Search galleries by name, author, description, or tags..."
            bind:value={$searchQuery}
        />
    </div>

    {#if $filteredGalleries.length > 0}
        <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center"
        >
            {#each $filteredGalleries as gallery}
                <a
                    href={`#viewer?view=${gallery.cid}`}
                    class="relative group rounded-lg overflow-hidden shadow-md transition-transform duration-300 dark:bg-gray-800 bg-gray-300 hover:-translate-y-2"
                >
                    <img
                        src={ipfsLinks(
                            gallery.cid,
                            gallery.metadata.coverImage ??
                                gallery.metadata.images[0],
                        )}
                        alt={gallery.metadata.name}
                        class="w-full h-72 object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />

                    <div
                        class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2"
                    >
                        <span
                            class="block text-lg font-semibold"
                            title={gallery.metadata.name}
                        >
                            {shortenText(gallery.metadata.name, 20)}
                        </span>
                        <span class="block text-sm text-gray-300">
                            {gallery.metadata.author
                                ? gallery.metadata.author
                                : "Unknown"}
                        </span>
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <p class="text-gray-600 dark:text-gray-300 text-center">
            No galleries match your search criteria.
        </p>
    {/if}
</section>
