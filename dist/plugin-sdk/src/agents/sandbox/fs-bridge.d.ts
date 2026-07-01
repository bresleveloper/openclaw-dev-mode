import type { SandboxFsBridgeContext } from "./backend-handle.types.js";
import type { SandboxFsBridge } from "./fs-bridge.types.js";
export type { SandboxFsBridge, SandboxFsStat, SandboxResolvedPath } from "./fs-bridge.types.js";
/** Create the filesystem bridge for local Docker-style mounted sandboxes. */
export declare function createSandboxFsBridge(params: {
    sandbox: SandboxFsBridgeContext;
}): SandboxFsBridge;
