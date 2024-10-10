# Orbital Eclipse

**Orbital Eclipse** is a gallery viewer designed to provide a seamless and interactive experience for viewing shared image collections hosted on the InterPlanetary File System (IPFS).

Orbital Eclipse consists of two main components:

1. **Front-End Viewer**: A light-weight gallery viewer built with Svelte, providing a responsive and minimalistic interface for navigating image collections.
2. **Metadata Schema**: A flexible `metadata.json` schema that offers the necessary structure and information to display detailed attributes about the gallery, such as titles, descriptions, author information, and tags.

## Getting Started

### Prerequisites

Make sure you have the following tools installed:

- [pnpm](https://pnpm.io/installation) - A performant node package manager.

### Installation

To get started, clone the repository and install the dependencies:

```bash
pnpm i
```

### Development

To start the development server:

```bash
pnpm dev
```

### Building for Production

To create an optimized production build:

```bash
pnpm build
```

The build output will be available in the `dist` folder, ready to be served on IPFS.

### Deploying on IPFS

TODO!

## Metadata Schema
TODO!

- **Name**: The title of the gallery.
- **Description**: A brief summary or description of the gallery.
- **Author**: The creator or artist responsible for the content.
- **Tags**: Categories or keywords associated with the gallery.
- **Images**: An ordered list of images in the gallery, with options to define specific attributes for each image.
- **Cover Image**: The main image to be displayed as the gallery's thumbnail.
- **Uploader Information**: Information about the person or system that uploaded the gallery.


## Contributing

Contributions are welcome! Feel free to open issues, submit pull requests, or suggest improvements to the schema or the front-end viewer.


