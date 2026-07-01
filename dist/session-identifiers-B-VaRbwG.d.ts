import { a as SessionAcpIdentity, c as SessionAcpMeta } from "./types-Bst3_XVW2.js";

//#region packages/acp-core/src/runtime/session-identifiers.d.ts
declare const ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
type AcpSessionIdentifierRenderMode = "status" | "thread";
/** Renders status-safe ACP session identifier lines from persisted session metadata. */
declare function resolveAcpSessionIdentifierLines(params: {
  sessionKey: string;
  meta?: SessionAcpMeta;
}): string[];
/** Renders resolved ACP backend/agent ids, hiding pending ids from thread intros. */
declare function resolveAcpSessionIdentifierLinesFromIdentity(params: {
  backend: string;
  identity?: SessionAcpIdentity;
  mode?: AcpSessionIdentifierRenderMode;
}): string[];
/** Resolves the runtime cwd, preferring modern runtimeOptions over legacy metadata. */
declare function resolveAcpSessionCwd(meta?: SessionAcpMeta): string | undefined;
/** Renders thread-detail identifier lines plus a backend-specific resume hint when stable. */
declare function resolveAcpThreadSessionDetailLines(params: {
  sessionKey: string;
  meta?: SessionAcpMeta;
}): string[];
//#endregion
export { resolveAcpSessionIdentifierLinesFromIdentity as a, resolveAcpSessionIdentifierLines as i, AcpSessionIdentifierRenderMode as n, resolveAcpThreadSessionDetailLines as o, resolveAcpSessionCwd as r, ACP_SESSION_IDENTITY_RENDERER_VERSION as t };