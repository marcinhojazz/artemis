// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), react()],

  vite: {
    plugins: [tailwindcss()]
  }
});