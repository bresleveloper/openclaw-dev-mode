/** Resolves the effective reply route from current context and persisted session route. */
import { type ChatType } from "../../channels/chat-type.js";
import type { SessionEntry } from "../../config/sessions/types.js";
import type { FinalizedMsgContext } from "../templating.js";
/** Current finalized context fields used for reply route resolution. */
export type EffectiveReplyRouteContext = Pick<FinalizedMsgContext, "Provider" | "Surface" | "OriginatingChannel" | "OriginatingTo" | "AccountId" | "InputProvenance" | "ChatType">;
/** Persisted session fields used as route fallback/inheritance. */
export type EffectiveReplyRouteEntry = Pick<SessionEntry, "deliveryContext" | "lastChannel" | "lastTo" | "lastAccountId" | "route" | "chatType" | "origin">;
/** Effective channel target selected for source reply delivery. */
export type EffectiveReplyRoute = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
    chatType?: ChatType;
    inheritedExternalRoute?: boolean;
};
/** Returns true for synthetic providers that should not define a user channel route. */
export declare function isSystemEventProvider(provider?: string): boolean;
/** Resolves current, inherited, or persisted reply route for a session turn. */
export declare function resolveEffectiveReplyRoute(params: {
    ctx: EffectiveReplyRouteContext;
    entry?: EffectiveReplyRouteEntry;
}): EffectiveReplyRoute;
