<script lang="ts">
    import { writable, get } from "svelte/store";
    import { onMount, onDestroy } from "svelte";

    export let images: string[] = [];
    export let cid: string = "";
    export let initialIndex: number = 0;

    const currentImageIndex = writable(initialIndex);
    const isFullScreen = writable(false);
    const isZoomed = writable(false);
    const imageTransform = writable("scale(1)");

    function ipfsLinks(cid: string, file: string): string {
        return `${cid ? `https://ipfs.io/ipfs/${cid}/` : ""}${file}`;
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
        if (images && get(currentImageIndex) < images.length - 1) {
            currentImageIndex.update((n) => n + 1);
            resetZoom();
        }
    }

    function showPrevImage() {
        if (get(currentImageIndex) > 0) {
            currentImageIndex.update((n) => n - 1);
            resetZoom();
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

    function handleKeydown(event: KeyboardEvent) {
        if (get(isFullScreen)) {
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
                case "Enter":
                    toggleZoom();
                    break;
            }
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each images as image, index}
        <button
            type="button"
            class="relative group rounded-lg overflow-hidden shadow-lg transition-transform duration-300 dark:bg-gray-800 bg-gray-300 hover:-translate-y-2 cursor-pointer"
            on:click={() => openFullScreen(index)}
            aria-label={`View ${image}`}
            title={image}
        >
            <img
                src={ipfsLinks(cid, image)}
                alt={image}
                class="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
            <div
                class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
                {image}
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

        <button
            class="cursor-zoom-in"
            on:click={toggleZoom}
            aria-label="Zoom Image"
        >
            <img
                src={ipfsLinks(cid, images[$currentImageIndex])}
                alt={images[$currentImageIndex]}
                class="max-h-[95vh] max-w-[95vw] object-contain"
                style={`transform: ${$imageTransform}; cursor: ${$isZoomed ? "zoom-out" : "zoom-in"}`}
            />
        </button>

        {#if $currentImageIndex < images.length - 1}
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
