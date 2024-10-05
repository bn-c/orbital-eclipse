<script lang="ts">
    import { writable } from "svelte/store";

    // Sample gallery data using dynamic placeholders from picsum.photos
    const galleries = writable([
        {
            id: 1,
            name: "Solar System Exploration asdfal;kwejklfjawslkfjklasdjflkajsdlk;fjsaodklfjl;kdsajfasdjlk;fdsajklfjsdalk;fjadslk;jfadls;kdj",
            cover: "https://picsum.photos/200/300?random=1",
        },
        {
            id: 2,
            name: "Deep Space Discoveries",
            cover: "https://picsum.photos/200/300?random=2",
        },
        {
            id: 3,
            name: "Astronomical Phenomena",
            cover: "https://picsum.photos/200/300?random=3",
        },
        {
            id: 4,
            name: "Galactic Wonders",
            cover: "https://picsum.photos/200/300?random=4",
        },
        {
            id: 5,
            name: "Cosmic Marvels",
            cover: "https://picsum.photos/200/300?random=5",
        },
        {
            id: 6,
            name: "Nebula Views",
            cover: "https://picsum.photos/600/300?random=6",
        },
    ]);
</script>

<!-- Gallery Section -->
<section
    class="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg transition duration-300"
>
    <!-- Center-aligned heading -->
    <h2
        class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Available Galleries
    </h2>

    {#if $galleries.length > 0}
        <!-- Gallery Grid -->
        <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center"
        >
            {#each $galleries as gallery}
                <!-- Clickable Card -->
                <a
                    href="#"
                    class="relative group rounded-lg overflow-hidden shadow-md transition transform hover:scale-105 dark:bg-gray-800 bg-gray-300"
                >
                    <!-- Gallery Cover Image -->
                    <img
                        src={gallery.cover}
                        alt={gallery.name}
                        class="w-full h-72 object-cover transition duration-300 group-hover:opacity-90"
                    />

                    <div
                        class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-md font-medium"
                        title={gallery.name}
                    >
                        {gallery.name}
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <p class="text-gray-600 dark:text-gray-300 text-center">
            No galleries are currently registered. Please check back later.
        </p>
    {/if}
</section>
