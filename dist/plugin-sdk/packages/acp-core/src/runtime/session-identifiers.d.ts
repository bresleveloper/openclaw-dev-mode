import type { SessionAcpIdentity, SessionAcpMeta } from "../types.js";
export declare const ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
export type AcpSessionIdentifierRenderMode = "status" | "thread";
/** Renders status-safe ACP session identifier lines from persisted session metadata. */
export declare function resolveAcpSessionIdentifierLines(params: {
    sessionKey: string;
    meta?: SessionAcpMeta;
}): string[];
/** Renders resolved ACP backend/agent ids, hiding pending ids from thread intros. */
export declare function resolveAcpSessionIdentifierLinesFromIdentity(params: {
    backend: string;
    identity?: SessionAcpIdentity;
    mode?: AcpSessionIdentifierRenderMode;
}): string[];
/** Resolves the runtime cwd, preferring modern runtimeOptions over legacy metadata. */
export declare function resolveAcpSessionCwd(meta?: SessionAcpMeta): string | undefined;
/** Renders thread-detail identifier lines plus a backend-specific resume hint when stable. */
export declare function resolveAcpThreadSessionDetailLines(params: {
    sessionKey: string;
    meta?: SessionAcpMeta;
}): string[];
