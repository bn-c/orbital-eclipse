import { writable } from 'svelte/store';

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
theme.subscribe((value) => localStorage.setItem("ipfsGateway", value));