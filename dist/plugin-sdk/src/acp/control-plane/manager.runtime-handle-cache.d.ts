import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ActiveTurnState, SessionAcpMeta } from "./manager.types.js";
import { type CachedRuntimeState } from "./runtime-cache.js";
import type { SessionActorQueue } from "./session-actor-queue.js";
/** Process-local cache of live ACP runtime handles keyed by canonical session actor. */
export declare class ManagerRuntimeHandleCache {
    private readonly runtimeCache;
    private evictedRuntimeCount;
    private lastEvictedAt;
    size(): number;
    has(sessionKey: string): boolean;
    get(sessionKey: string): CachedRuntimeState | null;
    set(sessionKey: string, state: CachedRuntimeState): void;
    clear(sessionKey: string): void;
    /** Returns cache counters used by ACP manager observability snapshots. */
    getObservabilitySnapshot(cfg: OpenClawConfig): {
        activeSessions: number;
        idleTtlMs: number;
        evictedTotal: number;
        lastEvictedAt?: number | undefined;
    };
    /** Closes and removes one cached runtime handle when present. */
    close(params: {
        sessionKey: string;
        reason: string;
    }): Promise<void>;
    /** Clears a cached handle only when the caller still owns the same runtime identifiers. */
    clearIfHandleMatches(params: {
        sessionKey: string;
        handle: AcpRuntimeHandle;
    }): void;
    /** Closes handles that exceeded the configured idle TTL without racing active turns. */
    evictIdle(params: {
        cfg: OpenClawConfig;
        actorQueue: SessionActorQueue;
        activeTurnBySession: Map<string, ActiveTurnState>;
    }): Promise<void>;
    /** Checks whether a cached runtime handle is still healthy enough to reuse. */
    isReusable(params: {
        sessionKey: string;
        runtime: AcpRuntime;
        handle: AcpRuntimeHandle;
    }): Promise<boolean>;
    handleMatchesMeta(params: {
        handle: AcpRuntimeHandle;
        meta: SessionAcpMeta;
    }): boolean;
    private runtimeHandlesMatch;
}
