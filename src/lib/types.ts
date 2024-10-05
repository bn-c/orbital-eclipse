// Define the structure of the gallery metadata
export interface GalleryMetadata {
    name: string;                    // Gallery name
    description: string;             // Gallery description
    author: string;                  // Author of the gallery
    creationDate: string;            // ISO 8601 formatted creation date
    coverImage: string;              // Filename of the cover image (e.g., "cover.jpg")
    images: string[];                // List of image file names (e.g., ["image1.jpg", "image2.png"])
    tags?: string[];                 // Optional array of tags (e.g., ["space", "planets"])
    sources?: string[];              // Optional list of external URLs (e.g., ["https://example.com"])
    version: string;                 // Schema version (e.g., "1.0")
}

// Define the structure of the gallery object stored in the store
export interface Gallery {
    cid: string;                     // The IPFS CID of the gallery
    metadata: GalleryMetadata;       // Metadata for the gallery
}
