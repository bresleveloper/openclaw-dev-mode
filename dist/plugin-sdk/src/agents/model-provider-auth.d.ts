import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type AuthProfileStore } from "./auth-profiles.js";
import { type RuntimeProviderAuthLookup } from "./model-auth.js";
import { clearCurrentProviderAuthState, type ProviderAuthWarmSnapshot } from "./model-provider-auth-state.js";
type ProviderAuthWarmRuntimeAuthStore = {
    agentDir?: string;
    store: AuthProfileStore;
};
type ProviderAuthWarmRuntimeAuthLookup = {
    agentId: string;
    lookup: RuntimeProviderAuthLookup;
};
type ProviderAuthWarmWorkerRunner = (params: {
    cfg: OpenClawConfig;
    runtimeAuthStores?: ProviderAuthWarmRuntimeAuthStore[];
    runtimeAuthLookups?: ProviderAuthWarmRuntimeAuthLookup[];
    omitFalseProviderAuth?: boolean;
    timeoutMs: number;
    isCancelled: () => boolean;
    workerUrl?: URL;
}) => Promise<ProviderAuthWarmSnapshot>;
/** Clears process-current warmed provider auth state. */
export { clearCurrentProviderAuthState };
/** Resolves whether auth is available for a model provider in the caller's runtime scope. */
export declare function hasAuthForModelProvider(params: {
    provider: string;
    modelApi?: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    agentId?: string;
    env?: NodeJS.ProcessEnv;
    store?: AuthProfileStore;
    allowPluginSyntheticAuth?: boolean;
    discoverExternalCliAuth?: boolean;
    allowPreparedRuntimeAuth?: boolean;
    runtimeAuthLookup?: RuntimeProviderAuthLookup;
    resolveRuntimeAuthLookup?: () => RuntimeProviderAuthLookup;
}): Promise<boolean>;
/** Creates a cached provider-auth checker bound to one agent/runtime context. */
export declare function createProviderAuthChecker(params: {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    agentId?: string;
    env?: NodeJS.ProcessEnv;
    allowPluginSyntheticAuth?: boolean;
    discoverExternalCliAuth?: boolean;
    allowPreparedRuntimeAuth?: boolean;
}): (provider: string, modelApi?: string) => Promise<boolean>;
/** Builds a provider auth snapshot for every configured agent. */
export declare function buildCurrentProviderAuthStateSnapshot(cfg: OpenClawConfig, options?: {
    isCancelled?: () => boolean;
    readOnlyAuthStore?: boolean;
    runtimeAuthLookups?: ReadonlyMap<string, RuntimeProviderAuthLookup>;
    omitFalseProviderAuth?: boolean;
}): Promise<ProviderAuthWarmSnapshot>;
/** Warms process-current provider auth state in a worker thread. */
export declare function warmCurrentProviderAuthStateOffMainThread(cfg: OpenClawConfig, options?: {
    isCancelled?: () => boolean;
    timeoutMs?: number;
    workerUrl?: URL;
    runWorker?: ProviderAuthWarmWorkerRunner;
}): Promise<void>;
