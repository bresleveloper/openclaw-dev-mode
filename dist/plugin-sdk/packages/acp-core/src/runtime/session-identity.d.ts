import type { SessionAcpIdentity, SessionAcpMeta } from "../types.js";
import type { AcpRuntimeHandle, AcpRuntimeStatus } from "./types.js";
/** Resolve normalized ACP identity from persisted session metadata. */
export declare function resolveSessionIdentityFromMeta(meta: SessionAcpMeta | undefined): SessionAcpIdentity | undefined;
/** Return true when an identity has a backend or agent session id. */
export declare function identityHasStableSessionId(identity: SessionAcpIdentity | undefined): boolean;
/** Resolve the runtime resume id, preferring agent session id over ACP backend id. */
export declare function resolveRuntimeResumeSessionId(identity: SessionAcpIdentity | undefined): string | undefined;
/** Return true when identity is absent or still pending. */
export declare function isSessionIdentityPending(identity: SessionAcpIdentity | undefined): boolean;
/** Compare identities ignoring lastUpdatedAt timestamp churn. */
export declare function identityEquals(left: SessionAcpIdentity | undefined, right: SessionAcpIdentity | undefined): boolean;
/** Merge current and incoming identity observations without downgrading resolved ids. */
export declare function mergeSessionIdentity(params: {
    current: SessionAcpIdentity | undefined;
    incoming: SessionAcpIdentity | undefined;
    now: number;
}): SessionAcpIdentity | undefined;
/** Create a pending identity from an ensure-session handle. */
export declare function createIdentityFromEnsure(params: {
    handle: AcpRuntimeHandle;
    now: number;
}): SessionAcpIdentity | undefined;
/** Create an identity from a runtime event handle. */
export declare function createIdentityFromHandleEvent(params: {
    handle: AcpRuntimeHandle;
    now: number;
}): SessionAcpIdentity | undefined;
/** Create an identity from runtime status output. */
export declare function createIdentityFromStatus(params: {
    status: AcpRuntimeStatus | undefined;
    now: number;
}): SessionAcpIdentity | undefined;
/** Convert ACP identity ids into runtime handle resume identifiers. */
export declare function resolveRuntimeHandleIdentifiersFromIdentity(identity: SessionAcpIdentity | undefined): {
    backendSessionId?: string;
    agentSessionId?: string;
};
