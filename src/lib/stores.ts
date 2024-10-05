import { writable } from 'svelte/store';
import type { Gallery, GalleryMetadata } from './types';

export const theme = writable(localStorage.getItem("theme") || "light");

theme.subscribe((value) => {
    localStorage.setItem("theme", value);
    document.documentElement.classList.toggle("dark", value === "dark");
});

export type Page = "galleries" | "viewer" | "config" | "tools";
export const currentPage = writable<Page>("galleries");

function setActivePage(page: Page) {
    currentPage.set(page);
}


export const ipfsGateway = writable(localStorage.getItem("ipfsGateway") || "https://ipfs.io");
ipfsGateway.subscribe((value) => localStorage.setItem("ipfsGateway", value));


// Parse galleries from localStorage or use an empty array as the default
const savedGalleries = localStorage.getItem("galleries");
const parsedGalleries: Gallery[] = savedGalleries ? JSON.parse(savedGalleries) : [];

// Strictly typed galleries store
export const galleries = writable<Gallery[]>(parsedGalleries);

// Update localStorage whenever galleries store changes
galleries.subscribe((value) => localStorage.setItem("galleries", JSON.stringify(value)));