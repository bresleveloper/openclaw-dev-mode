import { type GroupKeyResolution, type SessionEntry, type SessionScope } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext, TemplateContext } from "../templating.js";
import { type ReplySessionEntryHandle } from "./session-entry-handle.js";
export type SessionInitResult = {
    sessionCtx: TemplateContext;
    sessionEntry: SessionEntry;
    previousSessionEntry?: SessionEntry;
    sessionEntryHandle: ReplySessionEntryHandle;
    sessionStore: Record<string, SessionEntry>;
    sessionKey: string;
    sessionId: string;
    isNewSession: boolean;
    resetTriggered: boolean;
    systemSent: boolean;
    abortedLastRun: boolean;
    storePath: string;
    sessionScope: SessionScope;
    groupResolution?: GroupKeyResolution;
    isGroup: boolean;
    bodyStripped?: string;
    triggerBodyNormalized: string;
};
export type InitSessionStateParams = {
    cfg: OpenClawConfig;
    commandAuthorized: boolean;
    ctx: MsgContext;
    requestedSessionId?: string;
    resumeRequestedSession?: boolean;
};
/** Initializes or reuses the reply session state for one inbound turn. */
export declare function initSessionState(params: InitSessionStateParams): Promise<SessionInitResult>;
