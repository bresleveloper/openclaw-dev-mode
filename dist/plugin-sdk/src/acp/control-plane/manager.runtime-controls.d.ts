/** Applies runtime mode/config controls to live ACP backend sessions. */
import type { AcpRuntime, AcpRuntimeCapabilities, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { SessionAcpMeta } from "./manager.types.js";
import type { CachedRuntimeState } from "./runtime-cache.js";
/** Resolves backend-advertised controls plus locally inferred runtime control support. */
export declare function resolveManagerRuntimeCapabilities(params: {
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    includeStatusConfigOptionKeys?: boolean;
}): Promise<AcpRuntimeCapabilities>;
/** Applies persisted runtime options to a live handle once per unique option signature. */
export declare function applyManagerRuntimeControls(params: {
    sessionKey: string;
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
    getCachedRuntimeState: (sessionKey: string) => CachedRuntimeState | null;
}): Promise<void>;
