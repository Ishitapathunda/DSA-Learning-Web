import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 20000,
    // Runs test files sequentially — they share one SQLite file and a
    // beforeEach that clears user data, so parallel files would race
    // each other's cleanup.
    fileParallelism: false,
  },
});
