<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    // Form fields for creating the metadata.json file
    const name = writable("");
    const description = writable("");
    const author = writable("");
    const tags = writable("");
    const sources = writable("");

    // List of images found in the selected folder
    const images = writable<string[]>([]);
    const coverImage = writable<string | null>(null); // Allow cover image to be null
    const metadata = writable<object | null>(null); // Metadata object to be generated

    // Reference to the folder input element
    let folderInput: HTMLInputElement;

    // Function to handle folder selection and list files
    function handleFolderSelection(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (!files) return;

        // Clear existing images and cover image
        images.set([]);
        coverImage.set(null);

        // Extract file names from the selected files and update the images store
        const fileList = Array.from(files)
            .filter((file) => file.type.startsWith("image/")) // Filter only image files
            .map((file) => file.name)
            .sort((a, b) => a.localeCompare(b)); // Sort filenames alphabetically

        images.set(fileList);

        // Automatically set the cover image to the first image in the list, if available
        if (fileList.length > 0) {
            coverImage.set(fileList[0]); // Automatically select the first image, but can be set to null by user
        }
    }

    // Function to generate the metadata.json file based on form inputs and download it
    function generateAndDownloadMetadata() {
        // Set the creation date to the current date and time when the metadata is generated
        const creationDate = new Date().toISOString();

        // Create the metadata object based on form inputs and selected images
        const generatedMetadata: Record<string, any> = {
            name: $name,
            creationDate: creationDate,
            coverImage: $coverImage, // Cover image can be null
            images: $images,
            version: "1.0",
        };

        // Only include optional fields if they have values
        if ($description.trim()) generatedMetadata.description = $description;
        if ($author.trim()) generatedMetadata.author = $author;
        if ($tags.trim()) generatedMetadata.tags = $tags.split(",").map(tag => tag.trim());
        if ($sources.trim()) generatedMetadata.sources = $sources.split(",").map(source => source.trim());

        // Automatically download the metadata file after generation
        const blob = new Blob([JSON.stringify(generatedMetadata, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "metadata.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    // Set the `webkitdirectory` attribute manually using a reference
    onMount(() => {
        if (folderInput) {
            folderInput.setAttribute("webkitdirectory", "true");
        }
    });
</script>

<!-- Form Section for Creating Metadata -->
<section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300"
>
    <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Metadata Creator
    </h2>

    <!-- Metadata Form -->
    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
    >
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Create Metadata File
        </h3>

        <form on:submit|preventDefault={generateAndDownloadMetadata}>
            <!-- Name (Required) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="name"
            >
                Gallery Name <span class="text-red-500">*</span>
            </label>
            <input
                id="name"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$name}
                placeholder="Enter gallery name"
                required
            />

            <!-- Description (Optional) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="description"
            >
                Description
            </label>
            <textarea
                id="description"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$description}
                placeholder="Enter gallery description"
            ></textarea>

            <!-- Author (Optional) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="author"
            >
                Author
            </label>
            <input
                id="author"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$author}
                placeholder="Enter author name"
            />

            <!-- Tags (Optional) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="tags"
            >
                Tags (comma separated)
            </label>
            <input
                id="tags"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$tags}
                placeholder="e.g., space, planets, stars"
            />

            <!-- Sources (Optional) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="sources"
            >
                Sources (comma separated URLs)
            </label>
            <input
                id="sources"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$sources}
                placeholder="e.g., https://example.com, https://nasa.gov"
            />

            <!-- Folder Upload for Gallery (Required) -->
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="folder-upload"
            >
                Select Gallery Folder <span class="text-red-500">*</span>
            </label>
            <input
                id="folder-upload"
                type="file"
                class="w-full mb-4"
                multiple
                bind:this={folderInput}
                on:change={handleFolderSelection}
                required
            />

            <!-- Cover Image Selection (Optional) -->
            {#if $images.length > 0}
                <label
                    class="block text-gray-700 dark:text-gray-300 mb-2"
                    for="coverImageSelect"
                >
                    Select Cover Image (Optional)
                </label>
                <select
                    id="coverImageSelect"
                    class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    bind:value={$coverImage}
                >
                    <option value={null}>None</option>
                    {#each $images as image}
                        <option value={image}>{image}</option>
                    {/each}
                </select>
            {/if}

            <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
            >
                Generate Metadata
            </button>
        </form>
    </div>

    <!-- Display Selected Images -->
    {#if $images.length > 0}
        <div
            class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
        >
            <h3
                class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
                Selected Images
            </h3>
            <ul class="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {#each $images as image}
                    <li>{image}</li>
                {/each}
            </ul>
        </div>
    {/if}
</section>
