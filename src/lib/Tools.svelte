<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    // Form fields for creating the metadata.json file
    const name = writable("");
    const description = writable("");
    const author = writable("");
    const tags = writable("");
    const sources = writable("");
    const uploaderName = writable("");
    const uploaderComment = writable("");
    const uploaderLinks = writable(""); // Use a single string for comma-separated links
    const license = writable("");

    const images = writable<string[]>([]);
    const coverImage = writable<string | null>(null);
    const metadata = writable<object | null>(null);

    let folderInput: HTMLInputElement;

    function handleFolderSelection(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;

        if (!files) return;

        images.set([]);
        coverImage.set(null);

        const fileList = Array.from(files)
            .filter((file) => file.type.startsWith("image/"))
            .map((file) => file.name)
            .sort((a, b) =>
                a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: "base",
                }),
            );

        images.set(fileList);

        if (fileList.length > 0) {
            coverImage.set(fileList[0]);
        }
    }

    function generateAndDownloadMetadata() {
        const creationDate = new Date().toISOString();

        const generatedMetadata: Record<string, any> = {
            name: $name,
            creationDate,
            coverImage: $coverImage,
            images: $images,
            version: "1.0",
        };

        if ($description.trim()) generatedMetadata.description = $description;
        if ($author.trim()) generatedMetadata.author = $author;
        if ($tags.trim())
            generatedMetadata.tags = $tags.split(",").map((tag) => tag.trim());
        if ($sources.trim())
            generatedMetadata.sources = $sources
                .split(",")
                .map((source) => source.trim());

        // Parse uploader links from the comma-separated string
        const parsedUploaderLinks = $uploaderLinks
            .split(",")
            .map((link) => link.trim())
            .filter((link) => link);

        if (
            $uploaderName.trim() ||
            $uploaderComment.trim() ||
            parsedUploaderLinks.length > 0
        ) {
            generatedMetadata.uploader = {
                name: $uploaderName.trim() || "Unknown",
                comment: $uploaderComment.trim() || undefined,
                links:
                    parsedUploaderLinks.length > 0
                        ? parsedUploaderLinks
                        : undefined,
            };
        }

        if ($license.trim()) generatedMetadata.license = $license;

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

    onMount(() => {
        if (folderInput) {
            folderInput.setAttribute("webkitdirectory", "true");
        }
    });
</script>

<section
    class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition duration-300"
>
    <h2
        class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
    >
        Metadata Creator
    </h2>

    <div
        class="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
    >
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Create Metadata File
        </h3>

        <form on:submit|preventDefault={generateAndDownloadMetadata}>
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="name"
                >Gallery Name <span class="text-red-500">*</span></label
            >
            <input
                id="name"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$name}
                placeholder="Enter gallery name"
                required
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="description">Description</label
            >
            <textarea
                id="description"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$description}
                placeholder="Enter gallery description"
            ></textarea>

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="author">Author</label
            >
            <input
                id="author"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$author}
                placeholder="Enter author name"
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="tags">Tags (comma separated)</label
            >
            <input
                id="tags"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$tags}
                placeholder="e.g., space, planets, stars"
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="sources">Sources (comma separated URLs)</label
            >
            <textarea
                id="sources"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$sources}
                placeholder="e.g., https://example.com, https://nasa.gov"
            />

            <!-- Uploader Information Section -->
            <h4
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 mt-6"
            >
                Uploader Information (Optional)
            </h4>
            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="uploaderName">Uploader Name</label
            >
            <input
                id="uploaderName"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$uploaderName}
                placeholder="Enter uploader name"
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="uploaderComment">Uploader's Comment</label
            >
            <textarea
                id="uploaderComment"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$uploaderComment}
                placeholder="Enter a comment from the uploader"
            ></textarea>

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="uploaderLinks">Uploader Links (comma separated URLs)</label
            >
            <textarea
                id="uploaderLinks"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$uploaderLinks}
                placeholder="e.g., https://twitter.com/uploader, https://uploader-portfolio.com"
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="license">License</label
            >
            <input
                id="license"
                type="text"
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                bind:value={$license}
                placeholder="e.g., CC BY-SA 4.0, GPLv3"
            />

            <label
                class="block text-gray-700 dark:text-gray-300 mb-2"
                for="folder-upload"
                >Select Gallery Folder <span class="text-red-500">*</span
                ></label
            >
            <input
                id="folder-upload"
                type="file"
                class="w-full mb-4"
                multiple
                bind:this={folderInput}
                on:change={handleFolderSelection}
                required
            />

            <!-- Cover Image Selection -->
            {#if $images.length > 0}
                <label
                    class="block text-gray-700 dark:text-gray-300 mb-2"
                    for="coverImageSelect">Select Cover Image (Optional)</label
                >
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
                >Generate Metadata</button
            >
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
