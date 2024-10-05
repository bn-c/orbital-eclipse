<script lang="ts">
    import { ipfsGateway, galleries } from "./stores";
    import { writable } from "svelte/store";

    // Local writable stores for input and status messages
    const galleryCID = writable('');
    const fetchStatus = writable('');
    const isFetching = writable(false);

    // Function to fetch metadata.json from the given CID
    async function registerGallery() {
        isFetching.set(true);
        fetchStatus.set('Fetching metadata...');

        const cid = $galleryCID.trim();
        const gateway = $ipfsGateway.trim();

        if (!cid || !gateway) {
            fetchStatus.set('Please provide both a valid IPFS gateway and CID.');
            isFetching.set(false);
            return;
        }

        try {
            // Construct the URL to fetch the metadata.json file
            const metadataUrl = `${gateway}/ipfs/${cid}/metadata.json`;

            // Fetch metadata.json from the constructed URL
            const response = await fetch(metadataUrl);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Failed to fetch metadata. Status: ${response.status}`);
            }

            // Parse the JSON response
            const metadata = await response.json();

            // Validate the structure of the metadata (basic validation)
            if (!metadata.name || !metadata.description || !metadata.images) {
                throw new Error("Invalid metadata structure.");
            }

            // Add the new gallery with its CID and metadata to the galleries store
            galleries.update((galleriesList) => [
                ...galleriesList,
                { cid, metadata }
            ]);

            fetchStatus.set('Gallery registered successfully!');
        } catch (error) {
            fetchStatus.set(`Error: ${error.message}`);
        } finally {
            isFetching.set(false);
        }
    }
</script>

<!-- Config Section Layout -->
<section class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Settings
    </h2>

    <!-- IPFS Gateway Configuration -->
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            IPFS Gateway Configuration
        </h3>

        <label class="block text-gray-700 dark:text-gray-300 mb-2" for="ipfs-gateway">
            Gateway URL:
        </label>
        <input
            id="ipfs-gateway"
            type="text"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            on:input={(e) => ipfsGateway.set(e.target.value)}
            placeholder="https://ipfs.io"
        />

        <!-- Display the current IPFS Gateway -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
            Current IPFS Gateway: 
            <span class="font-semibold text-gray-900 dark:text-gray-200">{$ipfsGateway || "Not set"}</span>
        </div>
    </div>

    <!-- Register New Gallery Section -->
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Register New Gallery
        </h3>

        <label class="block text-gray-700 dark:text-gray-300 mb-2" for="gallery-cid">
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
            {$isFetching ? 'Registering...' : 'Register Gallery'}
        </button>

        <!-- Fetch Status Message -->
        {#if $fetchStatus}
            <p class="mt-4 text-center text-sm text-gray-800 dark:text-gray-100">
                {$fetchStatus}
            </p>
        {/if}
    </div>

    <!-- Display Registered Galleries -->
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Registered Galleries
        </h3>

        {#if $galleries.length > 0}
            <ul class="list-disc pl-5">
                {#each $galleries as gallery}
                    <li class="text-gray-700 dark:text-gray-300 mb-2">
                        <span class="font-semibold text-gray-900 dark:text-gray-200">
                            {gallery.metadata.name}
                        </span>
                        - {gallery.cid}
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
