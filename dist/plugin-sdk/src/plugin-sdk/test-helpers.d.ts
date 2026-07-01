/**
 * Shared test harness for plugin SDK contract tests that need temp fixtures.
 */
import { type RmOptions } from "node:fs";
/** Creates per-suite temp fixture helpers with automatic Vitest cleanup. */
export declare function createPluginSdkTestHarness(options?: {
    cleanup?: RmOptions;
}): {
    createTempDir: (prefix: string) => Promise<string>;
    createTempDirSync: (prefix: string) => string;
};
