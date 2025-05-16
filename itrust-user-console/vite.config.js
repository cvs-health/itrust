/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: '/itrust-user-console', 
  build: {
    outDir: 'build',  
    target: 'esnext',
    rollupOptions: {
      external: [],
    }, 
  },
  define: {
    'process.env': {},
    'global': 'window',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', 
    exclude: [...configDefaults.exclude],
  },
  server: {
    port: 3001,
    open: true, // Automatically open the browser
    historyApiFallback: true, // Redirect 404s to index.html  
  },
});
