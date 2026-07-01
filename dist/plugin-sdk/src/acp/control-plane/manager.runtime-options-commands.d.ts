/** Command handlers for changing ACP runtime mode and config options on live sessions. */
import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ManagerRuntimeHandleCache } from "./manager.runtime-handle-cache.js";
import type { AcpSessionRuntimeOptions, EnsureManagerRuntimeHandle, ResolveManagerSession, WriteManagerSessionMeta } from "./manager.types.js";
/** Manager services required by runtime-option command handlers. */
export type RuntimeOptionCommandServices = {
    runtimeHandles: ManagerRuntimeHandleCache;
    resolveSession: ResolveManagerSession;
    ensureRuntimeHandle: EnsureManagerRuntimeHandle;
    resolveRuntimeCapabilities: (params: {
        runtime: AcpRuntime;
        handle: AcpRuntimeHandle;
        includeStatusConfigOptionKeys?: boolean;
    }) => Promise<{
        controls: string[];
        configOptionKeys?: string[];
    }>;
    writeSessionMeta: WriteManagerSessionMeta;
};
type RuntimeOptionCommandContext = RuntimeOptionCommandServices & {
    cfg: OpenClawConfig;
    sessionKey: string;
};
/** Applies a backend runtime mode control and persists the selected mode. */
export declare function runSetManagerSessionRuntimeMode(params: RuntimeOptionCommandContext & {
    runtimeMode: string;
}): Promise<AcpSessionRuntimeOptions>;
/** Applies a backend config-option control and persists the inferred runtime option patch. */
export declare function runSetManagerSessionConfigOption(params: RuntimeOptionCommandContext & {
    key: string;
    value: string;
}): Promise<AcpSessionRuntimeOptions>;
/** Persists runtime option changes that do not need an immediate backend control call. */
export declare function runUpdateManagerSessionRuntimeOptions(params: RuntimeOptionCommandContext & {
    patch: Partial<AcpSessionRuntimeOptions>;
}): Promise<AcpSessionRuntimeOptions>;
/** Closes the current runtime handle and clears persisted runtime options. */
export declare function runResetManagerSessionRuntimeOptions(params: RuntimeOptionCommandContext): Promise<AcpSessionRuntimeOptions>;
export {};
