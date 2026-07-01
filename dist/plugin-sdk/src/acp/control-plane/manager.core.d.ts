/** Main ACP session manager implementation and public control-plane facade. */
import type { AcpRuntime, AcpRuntimeHandle } from "@openclaw/acp-core/runtime/types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type AcpCloseSessionInput, type AcpCloseSessionResult, type AcpInitializeSessionInput, type AcpManagerObservabilitySnapshot, type AcpRunTurnInput, type AcpSessionManagerDeps, type AcpSessionResolution, type AcpSessionRuntimeOptions, type AcpSessionStatus, type AcpStartupIdentityReconcileResult, type SessionAcpMeta } from "./manager.types.js";
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
export declare class AcpSessionManager {
    private readonly actorQueue;
    private readonly runtimeHandles;
    private readonly activeTurnBySession;
    private readonly turnLatencyStats;
    private readonly errorCountsByCode;
    private readonly deps;
    constructor(deps?: AcpSessionManagerDeps);
    resolveSession(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
    }): AcpSessionResolution;
    getObservabilitySnapshot(cfg: OpenClawConfig): AcpManagerObservabilitySnapshot;
    reconcilePendingSessionIdentities(params: {
        cfg: OpenClawConfig;
    }): Promise<AcpStartupIdentityReconcileResult>;
    initializeSession(input: AcpInitializeSessionInput): Promise<{
        runtime: AcpRuntime;
        handle: AcpRuntimeHandle;
        meta: SessionAcpMeta;
    }>;
    getSessionStatus(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        signal?: AbortSignal;
    }): Promise<AcpSessionStatus>;
    setSessionRuntimeMode(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        runtimeMode: string;
    }): Promise<AcpSessionRuntimeOptions>;
    setSessionConfigOption(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        key: string;
        value: string;
    }): Promise<AcpSessionRuntimeOptions>;
    updateSessionRuntimeOptions(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        patch: Partial<AcpSessionRuntimeOptions>;
    }): Promise<AcpSessionRuntimeOptions>;
    resetSessionRuntimeOptions(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
    }): Promise<AcpSessionRuntimeOptions>;
    runTurn(input: AcpRunTurnInput): Promise<void>;
    cancelSession(params: {
        cfg: OpenClawConfig;
        sessionKey: string;
        reason?: string;
    }): Promise<void>;
    closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult>;
    private ensureRuntimeHandle;
    private runtimeOptionCommandServices;
    private enforceConcurrentSessionLimit;
    private recordTurnCompletion;
    private recordErrorCode;
    private resolveRuntimeCapabilities;
    private evictIdleRuntimeHandles;
    private applyRuntimeControls;
    private setSessionState;
    private reconcileRuntimeSessionIdentifiers;
    private writeSessionMeta;
    private withSessionActor;
    private throwIfAborted;
}
