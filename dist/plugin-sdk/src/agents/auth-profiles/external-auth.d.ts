/**
 * Runtime external auth profile overlays.
 * Combines provider plugin auth profiles with scoped external CLI credentials
 * and decides which runtime profiles may be persisted back to the store.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { resolveExternalAuthProfilesWithPlugins } from "../../plugins/provider-runtime.js";
import { type RuntimeExternalOAuthProfile } from "./oauth-shared.js";
import type { AuthProfileStore } from "./types.js";
type ResolveExternalAuthProfiles = typeof resolveExternalAuthProfilesWithPlugins;
type ExternalCliOverlayOptions = {
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
};
/** Test-only resolver injection for provider external auth profiles. */
export declare const testing: {
    resetResolveExternalAuthProfilesForTest(): void;
    setResolveExternalAuthProfilesForTest(resolver: ResolveExternalAuthProfiles): void;
};
/** List runtime-only and persisted external auth profiles for this store. */
export declare function listRuntimeExternalAuthProfiles(params: {
    store: AuthProfileStore;
    agentDir?: string;
    env?: NodeJS.ProcessEnv;
    externalCli?: ExternalCliOverlayOptions;
}): RuntimeExternalOAuthProfile[];
/** Overlay external auth profiles onto a cloned auth store for runtime use. */
export declare function overlayExternalAuthProfiles(store: AuthProfileStore, params?: {
    agentDir?: string;
    env?: NodeJS.ProcessEnv;
} & ExternalCliOverlayOptions): AuthProfileStore;
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
export declare function syncPersistedExternalCliAuthProfiles(store: AuthProfileStore, params?: {
    agentDir?: string;
    env?: NodeJS.ProcessEnv;
} & ExternalCliOverlayOptions): AuthProfileStore;
export { testing as __testing };
