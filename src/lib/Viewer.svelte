<script lang="ts">
    import { ipfsGateway } from "./stores";
    import { type Gallery } from "./types";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import GalleryInfo from "./GalleryInfo.svelte";
    import GalleryImages from "./GalleryImages.svelte";

    const selectedGallery = writable<Gallery | undefined>(undefined);
    const galleryCID = writable("");
    const fetchStatus = writable("");
    const isFetching = writable(false);

    function getCIDFromURL(): string {
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

    async function fetchGalleryMetadata(cid: string) {
        isFetching.set(true);
        fetchStatus.set("Fetching metadata...");

        try {
            const response = await fetch(
                `${$ipfsGateway}/ipfs/${cid}/metadata.json`,
            );
            if (!response.ok)
                throw new Error(
                    `Failed to fetch metadata. Status: ${response.status}`,
                );

            const metadata = await response.json();
            if (!metadata.name || !metadata.images)
                throw new Error("Invalid metadata structure.");

            selectedGallery.set({ cid, metadata });
            fetchStatus.set("");
        } catch (error) {
            console.error("Error fetching gallery metadata:", error);
            fetchStatus.set(
                `Error: ${error instanceof Error ? error.message : error}`,
            );
            selectedGallery.set(undefined);
        } finally {
            isFetching.set(false);
        }
    }

    $: galleryCID.set(getCIDFromURL());

    $: if (galleryCID && $galleryCID.trim() !== "") {
        fetchGalleryMetadata($galleryCID);
    }

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
    <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
            <button
                class="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-500 transition duration-300"
                on:click={backToGalleries}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back to Galleries
            </button>

            <div class="flex items-center">
                <input
                    type="text"
                    class="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    placeholder="Enter CID to view gallery"
                    bind:value={$galleryCID}
                />
                <button
                    class="ml-2 bg-blue-200 hover:bg-blue-300 dark:bg-blue-900 dark:hover:bg-blue-700 text-blue-900 dark:text-blue-100 py-2 px-4 rounded-lg shadow-md transition duration-300"
                    on:click={() => updateViewerWithCID($galleryCID)}
                    disabled={$isFetching}
                >
                    {$isFetching ? "Fetching..." : "View"}
                </button>
            </div>
        </div>

        {#if $selectedGallery}
            <GalleryInfo gallery={$selectedGallery} />
            <GalleryImages
                images={$selectedGallery.metadata.images}
                cid={$selectedGallery.cid}
            />
        {:else if $fetchStatus}
            <p class="text-red-600 dark:text-red-400 text-center mt-12">
                {$fetchStatus}
            </p>
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
