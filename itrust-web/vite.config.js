// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: '/itrust-web/', 
  build: {
    outDir: 'build',  
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', 
    exclude: [...configDefaults.exclude], 
  },
  server: {
    port: 3000,
    open: true, // Automatically open the browser
    historyApiFallback: true, // Redirect 404s to index.html  
  },
});
