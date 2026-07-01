import type { PluginHookReplyPayloadSendingContext, PluginHookReplyUsageState } from "../../plugins/hook-types.js";
import type { ReplyPayload } from "../reply-payload.js";
import type { ReplyDispatchKind } from "./reply-dispatcher.types.js";
/** Runs plugin hooks that may rewrite or cancel an outbound reply payload. */
export declare function runReplyPayloadSendingHook(params: {
    payload: ReplyPayload;
    kind: ReplyDispatchKind;
    channel?: string;
    sessionKey?: string;
    runId?: string;
    usageState?: PluginHookReplyUsageState;
    context: PluginHookReplyPayloadSendingContext;
}): Promise<ReplyPayload | null>;
