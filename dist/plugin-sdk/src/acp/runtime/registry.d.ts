/** Process-wide registry for ACP runtime backends contributed by plugins. */
import type { AcpRuntime } from "@openclaw/acp-core/runtime/types";
/** Registered ACP backend with optional health probe used for auto-selection. */
export type AcpRuntimeBackend = {
    id: string;
    runtime: AcpRuntime;
    healthy?: () => boolean;
};
type AcpRuntimeRegistryGlobalState = {
    backendsById: Map<string, AcpRuntimeBackend>;
};
/** Registers or replaces an ACP runtime backend by normalized id. */
export declare function registerAcpRuntimeBackend(backend: AcpRuntimeBackend): void;
/** Removes a registered ACP runtime backend by id. */
export declare function unregisterAcpRuntimeBackend(id: string): void;
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
export declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
/** Resolves a healthy backend or throws a typed ACP runtime error. */
export declare function requireAcpRuntimeBackend(id?: string): AcpRuntimeBackend;
export declare const testing: {
    resetAcpRuntimeBackendsForTests(): void;
    getAcpRuntimeRegistryGlobalStateForTests(): AcpRuntimeRegistryGlobalState;
};
export { testing as __testing };
