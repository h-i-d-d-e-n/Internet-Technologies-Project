import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs-extra';

export default defineConfig({
  plugins: [
    {
      name: 'copy-assets',
      closeBundle() {
        fs.copySync(
          resolve(__dirname, 'assets'),
          resolve(__dirname, 'dist/assets')
        );
      }
    }
  ]
});
