<script lang="ts">
    import { ipfsGateway } from "./stores";
    import { writable } from "svelte/store";

    // Local writable stores for validation and status messages
    const isValidUrl = writable(true); // Start as true to prevent error display initially
    const isSaved = writable(false);
    const isInteracted = writable(false); // New store to track if the user has interacted

    // Function to validate the URL
    function validateUrl(url: string): boolean {
        try {
            // Check if the URL is valid
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Function to handle input changes, validate the URL, and save if valid
    function handleGatewayChange(event: Event) {
        const newGateway = (event.target as HTMLInputElement).value;

        // Mark that the user has interacted with the input
        isInteracted.set(true);

        // Validate the URL
        const valid = validateUrl(newGateway);
        isValidUrl.set(valid);

        // If the URL is valid, set the gateway and indicate saved status
        if (valid) {
            ipfsGateway.set(newGateway);
            localStorage.setItem("ipfsGateway", newGateway);
            isSaved.set(true);

            // Clear the saved status message after 2 seconds
            setTimeout(() => isSaved.set(false), 2000);
        }
    }
</script>

<!-- Config Section Layout -->
<section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300"
>
    <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Settings
    </h2>

    <!-- IPFS Gateway Configuration -->
    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
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

        <!-- Display the current IPFS Gateway and Validation Status -->
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Current IPFS Gateway:
            <span class="font-semibold text-gray-900 dark:text-gray-200"
                >{$ipfsGateway || "Not set"}</span
            >
        </div>

        {#if $isInteracted && $isValidUrl === false}
            <!-- Invalid URL Warning (only show if user has interacted and URL is invalid) -->
            <p class="text-red-600 dark:text-red-400 text-sm">
                Invalid URL. Please enter a valid IPFS gateway URL.
            </p>
        {/if}

        {#if $isSaved}
            <!-- Success Message for Saved URL -->
            <p class="text-green-600 dark:text-green-400 text-sm mt-2">
                Gateway URL saved successfully!
            </p>
        {/if}
    </div>
</section>
