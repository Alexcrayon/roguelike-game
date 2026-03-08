# Procedural Dungeon Generator

A browser-based procedural dungeon generator built with React, TypeScript, and HTML5 Canvas. Generates randomized dungeon layouts using Binary Space Partitioning (BSP) with seeded pseudo-random number generation for reproducible results.

![Dungeon Generator Screenshot](./screenshot.png)
<!-- Replace with an actual screenshot or GIF of your generator -->

## Techniques

- **BSP Tree Splitting** — Recursively partitions space into regions, then places rooms within each leaf node with configurable padding and aspect ratio constraints
- **Seeded PRNG (Mulberry32)** — Deterministic random number generation ensures the same seed always produces the same dungeon layout
- **Sorted Corridor Connection** — Rooms are connected sequentially by position to guarantee full connectivity
- **Diffusion-Limited Aggregation (DLA)** — Expands room boundaries organically for more natural-looking cave structures

## Getting Started

```bash
git clone 
cd dungeon-generator
npm install
npm run dev
```

The app will be available at `http://localhost:xxxx`.

## Usage

- **Generate New** — Creates a new dungeon with a random seed
- **Seed Input** — Enter a specific seed number to reproduce a dungeon layout
- **Toggle Debug** — Visualizes corridors in a distinct color and displays BSP partition boundaries

