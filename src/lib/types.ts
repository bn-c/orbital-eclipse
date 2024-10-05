// Define the structure of the gallery metadata
export interface GalleryMetadata {
    name: string;                    // Gallery name
    description?: string;            // Optional gallery description
    author?: string;                 // Optional author of the gallery
    creationDate: string;            // ISO 8601 formatted creation date
    coverImage?: string;             // Optional filename of the cover image (e.g., "cover.jpg")
    images: string[];                // List of image file names (e.g., ["image1.jpg", "image2.png"])
    tags?: string[];                 // Optional array of tags (e.g., ["space", "planets"])
    sources?: string[];              // Optional list of external URLs (e.g., ["https://example.com"])
    version: string;                 // Schema version (e.g., "1.0")

    uploader?: {                     // Optional uploader information
        name: string;                // Uploader's name
        links?: string[];            // Optional array of links related to the uploader (e.g., ["https://profile.com", "https://portfolio.com"])
        comment?: string;            // Optional comment from the uploader
    };
    license?: string;                // Optional license information (e.g., "CC BY-SA 4.0", "GPLv3")
}

// Define the structure of the gallery object stored in the store
export interface Gallery {
    cid: string;                     // The IPFS CID of the gallery
    metadata: GalleryMetadata;       // Metadata for the gallery
}
