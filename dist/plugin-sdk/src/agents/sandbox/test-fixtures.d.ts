/**
 * Sandbox test fixture helpers.
 *
 * Builds complete sandbox contexts with Docker defaults so tests can override only the fields under scrutiny.
 */
import type { SandboxContext } from "./types.js";
export declare function createSandboxTestContext(params?: {
    overrides?: Partial<SandboxContext>;
    dockerOverrides?: Partial<SandboxContext["docker"]>;
}): SandboxContext;
