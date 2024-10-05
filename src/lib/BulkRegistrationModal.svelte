<!-- BulkRegistrationModal.svelte -->
<script lang="ts">
    import { writable } from "svelte/store";

    export let isOpen = writable(false);
    export let registrationResults = writable<
        { cid: string; status: string }[]
    >([]);

    function closeModal() {
        isOpen.set(false);
    }
</script>

{#if $isOpen}
    <div
        class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6"
        >
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Bulk Registration Results
            </h2>

            <div class="overflow-y-auto max-h-64 mb-4">
                <ul
                    class="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2"
                >
                    {#each $registrationResults as result}
                        <li>
                            CID: {result.cid} -
                            <span
                                class={result.status.includes("Error")
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-green-500 dark:text-green-400"}
                            >
                                {result.status}
                            </span>
                        </li>
                    {/each}
                </ul>
            </div>

            <button
                class="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition duration-300"
                on:click={closeModal}
            >
                Close
            </button>
        </div>
    </div>
{/if}
