/** Shared ACP manager normalization, resolution, and error helpers. */
import { AcpRuntimeError } from "@openclaw/acp-core/runtime/errors";
import type { SessionAcpMeta } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AcpSessionResolution } from "./manager.types.js";
/** Resolves the agent id encoded in an ACP session key. */
export declare function resolveAcpAgentFromSessionKey(sessionKey: string, fallback?: string): string;
/** Builds the stale-session error shown when ACP metadata is missing. */
export declare function resolveMissingMetaError(sessionKey: string): AcpRuntimeError;
/** Converts a session resolution union into the runtime error callers should throw. */
export declare function resolveAcpSessionResolutionError(resolution: AcpSessionResolution): AcpRuntimeError | null;
/** Returns ready ACP metadata or throws the matching resolution error. */
export declare function requireReadySessionMeta(resolution: AcpSessionResolution): SessionAcpMeta;
/** Canonicalizes aliases and main-session keys before ACP metadata lookup. */
export declare function canonicalizeAcpSessionKey(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
}): string;
/** Normalizes session keys for process-local actor maps. */
export declare function normalizeActorKey(sessionKey: string): string;
/** Restricts runtime-provided error codes to the ACP error-code enum. */
export declare function normalizeAcpErrorCode(code: string | undefined): AcpRuntimeError["code"];
export declare function createUnsupportedControlError(params: {
    backend: string;
    control: string;
}): AcpRuntimeError;
export declare function resolveRuntimeIdleTtlMs(cfg: OpenClawConfig): number;
export declare function hasLegacyAcpIdentityProjection(meta: SessionAcpMeta): boolean;
