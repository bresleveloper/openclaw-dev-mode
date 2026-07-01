/**
 * Coordinates provider auth, profile rotation, and runtime auth refresh.
 */
import type { ThinkLevel } from "../../../auto-reply/thinking.js";
import type { Model } from "../../../llm/types.js";
import { type AuthProfileStore } from "../../auth-profiles.js";
import { type ResolvedProviderAuth } from "../../model-auth.js";
import { type RuntimeAuthState } from "./helpers.js";
import type { RunEmbeddedAgentParams } from "./params.js";
type ApiKeyInfo = ResolvedProviderAuth;
type RuntimeApiKeySink = {
    setRuntimeApiKey(provider: string, apiKey: string): void;
};
type LogLike = {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
};
/**
 * Coordinates auth profile selection, runtime auth preparation/refresh, and
 * profile failover for one embedded run. State is injected through accessors so
 * the runner can keep provider/model/auth snapshots in sync across retries.
 */
export declare function createEmbeddedRunAuthController(params: {
    config: RunEmbeddedAgentParams["config"];
    agentDir: string;
    workspaceDir: string;
    authStore: AuthProfileStore;
    authStorage: RuntimeApiKeySink;
    profileCandidates: Array<string | undefined>;
    lockedProfileId?: string;
    initialThinkLevel: ThinkLevel;
    attemptedThinking: Set<ThinkLevel>;
    fallbackConfigured: boolean;
    allowTransientCooldownProbe: boolean;
    getProvider(): string;
    getModelId(): string;
    getRuntimeModel(): Model;
    setRuntimeModel(next: Model): void;
    getEffectiveModel(): Model;
    setEffectiveModel(next: Model): void;
    getApiKeyInfo(): ApiKeyInfo | null;
    setApiKeyInfo(next: ApiKeyInfo | null): void;
    getLastProfileId(): string | undefined;
    setLastProfileId(next: string | undefined): void;
    getRuntimeAuthState(): RuntimeAuthState | null;
    setRuntimeAuthState(next: RuntimeAuthState | null): void;
    getRuntimeAuthRefreshCancelled(): boolean;
    setRuntimeAuthRefreshCancelled(next: boolean): void;
    getProfileIndex(): number;
    setProfileIndex(next: number): void;
    setThinkLevel(next: ThinkLevel): void;
    log: LogLike;
}): {
    advanceAuthProfile: () => Promise<boolean>;
    initializeAuthProfile: () => Promise<void>;
    maybeRefreshRuntimeAuthForAuthError: (errorText: string, retried: boolean) => Promise<boolean>;
    stopRuntimeAuthRefreshTimer: () => void;
};
export {};
