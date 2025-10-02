import { defineConfig } from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // plugins: [react(), tsconfigPaths()],
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  }
});
