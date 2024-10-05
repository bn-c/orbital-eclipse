<script lang="ts">
    import { ipfsGateway, galleries } from "./stores";
    import { writable } from "svelte/store";

    const galleryCID = writable("");
    const fetchStatus = writable("");
    const isFetching = writable(false);

    async function registerGallery() {
        isFetching.set(true);
        fetchStatus.set("Fetching metadata...");

        const cid = $galleryCID.trim();
        const gateway = $ipfsGateway.trim();

        if (!cid || !gateway) {
            fetchStatus.set(
                "Please provide both a valid IPFS gateway and CID.",
            );
            isFetching.set(false);
            return;
        }

        try {
            const metadataUrl = `${gateway}/ipfs/${cid}/metadata.json`;
            const response = await fetch(metadataUrl);

            if (!response.ok)
                throw new Error(
                    `Failed to fetch metadata. Status: ${response.status}`,
                );

            const metadata = await response.json();

            if (!metadata.name || !metadata.images)
                throw new Error("Invalid metadata structure.");

            galleries.update((galleriesList) => [
                ...galleriesList,
                { cid, metadata },
            ]);
            fetchStatus.set("Gallery registered successfully!");
        } catch (error) {
            fetchStatus.set(
                `Error: ${error instanceof Error ? error.message : error}`,
            );
        } finally {
            isFetching.set(false);
        }
    }

    function handleGatewayChange(event: Event) {
        const input = event.target as HTMLInputElement;
        ipfsGateway.set(input.value);
    }

    function removeGallery(cid: string) {
        galleries.update((galleriesList) =>
            galleriesList.filter((gallery) => gallery.cid !== cid),
        );
    }

    function formatCID(cid: string): string {
        return `${cid.slice(0, 6)}...${cid.slice(-6)}`;
    }
</script>

<section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300"
>
    <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Settings
    </h2>

    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
    >
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            IPFS Gateway Configuration
        </h3>

        <label
            class="block text-gray-700 dark:text-gray-300 mb-2"
            for="ipfs-gateway"
        >
            Gateway URL:
        </label>
        <input
            id="ipfs-gateway"
            type="text"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            on:input={handleGatewayChange}
            placeholder="https://ipfs.io"
        />

        <div class="text-sm text-gray-600 dark:text-gray-400">
            Current IPFS Gateway:
            <span class="font-semibold text-gray-900 dark:text-gray-200"
                >{$ipfsGateway || "Not set"}</span
            >
        </div>
    </div>

    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Register New Gallery
        </h3>

        <label
            class="block text-gray-700 dark:text-gray-300 mb-2"
            for="gallery-cid"
        >
            Gallery CID:
        </label>
        <input
            id="gallery-cid"
            type="text"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            bind:value={$galleryCID}
            placeholder="Enter the IPFS CID of the gallery"
        />

        <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
            on:click={registerGallery}
            disabled={$isFetching}
        >
            {$isFetching ? "Registering..." : "Register Gallery"}
        </button>

        {#if $fetchStatus}
            <p
                class="mt-4 text-center text-sm text-gray-800 dark:text-gray-100"
            >
                {$fetchStatus}
            </p>
        {/if}
    </div>

    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8"
    >
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Registered Galleries
        </h3>

        {#if $galleries.length > 0}
            <ul class="list-none pl-0">
                {#each $galleries as gallery}
                    <li
                        class="flex items-center justify-between text-gray-700 dark:text-gray-300 mb-4"
                    >
                        <!-- Gallery Info -->
                        <div class="flex-grow">
                            <div
                                class="font-semibold text-gray-900 dark:text-gray-200 truncate max-w-xs"
                            >
                                {gallery.metadata.author
                                    ? gallery.metadata.author
                                    : "Unknown"} - {gallery.metadata.name}
                            </div>
                            <a
                                href={`${$ipfsGateway}/ipfs/${gallery.cid}`}
                                target="_blank"
                                class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 truncate block"
                                title="View on IPFS Gateway"
                            >
                                {formatCID(gallery.cid)}
                            </a>
                        </div>

                        <!-- "x" Button on the right side with square style -->
                        <button
                            class="ml-4 w-8 h-8 flex items-center justify-center rounded bg-red-500 dark:bg-red-400 text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-500 transition duration-200"
                            on:click={() => removeGallery(gallery.cid)}
                            title="Remove Gallery"
                        >
                            x
                        </button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-600 dark:text-gray-400">
                No galleries registered yet.
            </p>
        {/if}
    </div>
</section>
