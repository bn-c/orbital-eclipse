import { writable } from 'svelte/store';
import type { Gallery, GalleryMetadata } from './types';

export const theme = writable(localStorage.getItem("theme") || "light");

theme.subscribe((value) => {
    localStorage.setItem("theme", value);
    document.documentElement.classList.toggle("dark", value === "dark");
});

type Page = "Galleries" | "Viewer" | "Config" | "Tools";
export const currentPage = writable<Page>("Galleries");

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