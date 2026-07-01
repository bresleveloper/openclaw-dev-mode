import { type SessionEntry } from "../config/sessions.js";
import type { AgentEventPayload } from "../infra/agent-events.js";
import type { GatewaySessionRow } from "./session-utils.types.js";
type LifecycleEventLike = Pick<AgentEventPayload, "ts" | "sessionId"> & {
    runId?: string;
    lifecycleGeneration?: string;
    data?: {
        phase?: unknown;
        startedAt?: unknown;
        endedAt?: unknown;
        aborted?: unknown;
        stopReason?: unknown;
        error?: unknown;
        livenessState?: unknown;
        timeoutPhase?: unknown;
        providerStarted?: unknown;
    };
};
type LifecycleSessionShape = Pick<GatewaySessionRow, "updatedAt" | "status" | "startedAt" | "endedAt" | "runtimeMs" | "abortedLastRun">;
type PersistedLifecycleSessionShape = Pick<SessionEntry, "updatedAt" | "status" | "startedAt" | "endedAt" | "runtimeMs" | "abortedLastRun" | "restartRecoveryRuns">;
type GatewaySessionLifecycleSnapshot = Partial<LifecycleSessionShape>;
export declare function deriveGatewaySessionLifecycleSnapshot(params: {
    session?: Partial<LifecycleSessionShape> | null;
    event: LifecycleEventLike;
}): GatewaySessionLifecycleSnapshot;
export declare function derivePersistedSessionLifecyclePatch(params: {
    entry?: Partial<PersistedLifecycleSessionShape> | null;
    event: LifecycleEventLike;
}): Partial<PersistedLifecycleSessionShape>;
export declare function deriveGatewaySessionLifecycleProjectionPatch(params: {
    entry?: Partial<PersistedLifecycleSessionShape> | null;
    event: LifecycleEventLike;
}): GatewaySessionLifecycleSnapshot;
export declare function isRestartRecoveryLifecycleEvent(params: {
    entry?: Pick<SessionEntry, "restartRecoveryRuns"> | null;
    event: Pick<LifecycleEventLike, "runId" | "lifecycleGeneration" | "data">;
}): boolean;
/**
 * A pre-`sessions.reset` run's lifecycle event must not mutate a session row
 * whose sessionId was rotated by the reset. True only when both the owning
 * run's sessionId and the current row's sessionId are known and differ.
 */
export declare function isStaleLifecycleEventForSession(params: {
    owningSessionId?: string;
    currentSessionId?: string;
}): boolean;
export declare function persistGatewaySessionLifecycleEvent(params: {
    sessionKey: string;
    agentId?: string;
    event: LifecycleEventLike;
}): Promise<void>;
export {};
