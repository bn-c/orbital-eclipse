<script lang="ts">
    import { galleries, ipfsGateway } from "./stores";
    import { type Gallery } from "./types";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    const selectedGallery = writable<Gallery | undefined>(undefined);
    const galleryCID = writable("");
    const currentImageIndex = writable(0);
    const isFullScreen = writable(false);
    const isZoomed = writable(false);
    const imageTransform = writable("scale(1)");

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

    function openFullScreen(index: number) {
        currentImageIndex.set(index);
        isFullScreen.set(true);
    }

    function closeFullScreen() {
        isFullScreen.set(false);
        resetZoom();
    }

    function showNextImage() {
        if (
            $selectedGallery &&
            $currentImageIndex < $selectedGallery.metadata.images.length - 1
        ) {
            currentImageIndex.update((n) => n + 1);
            resetZoom();
        }
    }

    function showPrevImage() {
        if ($currentImageIndex > 0) {
            currentImageIndex.update((n) => n - 1);
            resetZoom();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if ($isFullScreen) {
            switch (event.key) {
                case "ArrowRight":
                    showNextImage();
                    break;
                case "ArrowLeft":
                    showPrevImage();
                    break;
                case "Escape":
                    closeFullScreen();
                    break;
            }
        }
    }

    function toggleZoom() {
        isZoomed.update((zoom) => {
            const newZoom = !zoom;
            imageTransform.set(newZoom ? "scale(2)" : "scale(1)");
            return newZoom;
        });
    }

    function resetZoom() {
        isZoomed.set(false);
        imageTransform.set("scale(1)");
    }

    $: galleryCID.set(getCIDFromURL());
    $: selectedGallery.set(
        $galleries.find((gallery) => gallery.cid === $galleryCID),
    );

    onMount(() => {
        window.addEventListener("hashchange", () => {
            galleryCID.set(getCIDFromURL());
        });
        window.addEventListener("keydown", handleKeydown);

        galleryCID.set(getCIDFromURL());

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });

    function shortenFileName(fileName: string, maxLength = 30): string {
        if (fileName.length > maxLength) {
            const prefix = fileName.substring(0, Math.floor(maxLength / 2));
            const suffix = fileName.substring(
                fileName.length - Math.floor(maxLength / 2),
            );
            return `${prefix}...${suffix}`;
        }
        return fileName;
    }
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

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each $selectedGallery.metadata.images as image, index}
                    <!-- Button wrapper for interactive image -->
                    <button
                        type="button"
                        class="relative group rounded-lg overflow-hidden shadow-lg transition-transform duration-300 dark:bg-gray-800 bg-gray-300 hover:-translate-y-2 cursor-pointer"
                        on:click={() => openFullScreen(index)}
                        aria-label={`View ${image}`}
                        title={image}
                    >
                        <img
                            src={ipfsLinks($selectedGallery.cid, image)}
                            alt={image}
                            class="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-90"
                        />
                        <div
                            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                            {shortenFileName(image)}
                        </div>
                    </button>
                {/each}
            </div>

            {#if $isFullScreen}
                <div
                    class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                >
                    <button
                        class="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                        on:click={closeFullScreen}
                        aria-label="Close Full Screen View"
                    >
                        ✕
                    </button>

                    {#if $currentImageIndex > 0}
                        <button
                            class="absolute left-6 text-blue-300 hover:text-blue-400 dark:text-blue-300 dark:hover:text-blue-500 text-4xl transition duration-200"
                            on:click={showPrevImage}
                            aria-label="Previous Image"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-10 h-10"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    {/if}

                    <!-- Full-screen image inside a button for interactivity -->
                    <button
                        class="cursor-zoom-in"
                        on:click={toggleZoom}
                        aria-label="Zoom Image"
                    >
                        <img
                            src={ipfsLinks(
                                $selectedGallery.cid,
                                $selectedGallery.metadata.images[
                                    $currentImageIndex
                                ],
                            )}
                            alt={$selectedGallery.metadata.images[
                                $currentImageIndex
                            ]}
                            class="max-h-[95vh] max-w-[95vw] object-contain"
                            style={`transform: ${$imageTransform}; cursor: ${
                                $isZoomed ? "zoom-out" : "zoom-in"
                            }`}
                        />
                    </button>

                    {#if $currentImageIndex < $selectedGallery.metadata.images.length - 1}
                        <button
                            class="absolute right-6 text-blue-300 hover:text-blue-400 dark:text-blue-300 dark:hover:text-blue-500 text-4xl transition duration-200"
                            on:click={showNextImage}
                            aria-label="Next Image"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-10 h-10 transform rotate-180"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    {/if}
                </div>
            {/if}
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
