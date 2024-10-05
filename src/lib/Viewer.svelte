<script lang="ts">
    import { galleries, ipfsGateway } from "./stores";
    import { type Gallery } from "./types";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    const selectedGallery = writable<Gallery | undefined>(undefined);
    const galleryCID = writable(""); // CID from the input bar

    function ipfsLinks(cid: string, file: string): string {
        return `${$ipfsGateway}/ipfs/${cid}/${file}`;
    }

    function getCIDFromURL() {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split("?")[1]);
        return params.get("view") || "";
    }

    function backToGalleries() {
        window.location.hash = "#galleries";
    }

    function updateViewerWithCID(cid: string) {
        window.location.hash = `#viewer?view=${cid.trim()}`;
    }

    $: galleryCID.set(getCIDFromURL());
    $: selectedGallery.set(
        $galleries.find((gallery) => gallery.cid === $galleryCID),
    );

    onMount(() => {
        window.addEventListener("hashchange", () => {
            galleryCID.set(getCIDFromURL());
        });

        galleryCID.set(getCIDFromURL());
    });
</script>

<section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300"
>
    <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
                on:click={backToGalleries}
            >
                Back to Galleries
            </button>

            <div class="flex items-center">
                <input
                    type="text"
                    class="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    placeholder="Enter CID to view gallery"
                    bind:value={$galleryCID}
                />
                <button
                    class="ml-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    on:click={() => updateViewerWithCID($galleryCID)}
                >
                    View
                </button>
            </div>
        </div>

        {#if $selectedGallery}
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {$selectedGallery.metadata.name}
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                    {$selectedGallery.metadata.author
                        ? $selectedGallery.metadata.author
                        : "Unknown"}
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {#each $selectedGallery.metadata.images as image}
                    <a
                        href={ipfsLinks($selectedGallery.cid, image)}
                        target="_blank"
                        class="relative group rounded-lg overflow-hidden shadow-md transition-transform duration-300 dark:bg-gray-800 bg-gray-300 hover:-translate-y-2"
                    >
                        <img
                            src={ipfsLinks($selectedGallery.cid, image)}
                            alt={image}
                            class="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
                        />
                    </a>
                {/each}
            </div>
        {:else if $galleryCID === ""}
            <p class="text-gray-600 dark:text-gray-300 text-center mt-12">
                No gallery selected. Please enter a CID or select a gallery from
                the list.
            </p>
        {:else if $selectedGallery === undefined && $galleryCID !== ""}
            <p class="text-red-600 dark:text-red-400 text-center mt-12">
                No gallery found for the provided CID. Please check the CID and
                try again.
            </p>
        {/if}
    </div>
</section>
