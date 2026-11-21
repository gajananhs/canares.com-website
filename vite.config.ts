import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps every asset path relative, so the same build runs at the
// domain root, in a sub-folder or on a staging address without changes.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 2048 },
  ssr: { noExternal: ['gsap', 'lenis'] },
});
