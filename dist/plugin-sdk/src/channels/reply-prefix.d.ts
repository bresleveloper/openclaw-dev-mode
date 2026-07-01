import type { GetReplyOptions } from "../auto-reply/get-reply-options.types.js";
import { type ResponsePrefixContext } from "../auto-reply/reply/response-prefix-template.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type ModelSelectionContext = Parameters<NonNullable<GetReplyOptions["onModelSelected"]>>[0];
/**
 * Mutable response-prefix state shared between reply setup and model selection callbacks.
 */
export type ReplyPrefixContextBundle = {
    prefixContext: ResponsePrefixContext;
    responsePrefix?: string;
    responsePrefixContextProvider: () => ResponsePrefixContext;
    onModelSelected: (ctx: ModelSelectionContext) => void;
};
/**
 * Reply option subset consumed by channel reply dispatchers.
 */
export type ReplyPrefixOptions = Pick<ReplyPrefixContextBundle, "responsePrefix" | "responsePrefixContextProvider" | "onModelSelected">;
/**
 * Creates response-prefix options and a live context provider for the selected model.
 */
export declare function createReplyPrefixContext(params: {
    cfg: OpenClawConfig;
    agentId: string;
    channel?: string;
    accountId?: string;
}): ReplyPrefixContextBundle;
/**
 * Creates the reply-prefix options object expected by `getReply` call sites.
 */
export declare function createReplyPrefixOptions(params: {
    cfg: OpenClawConfig;
    agentId: string;
    channel?: string;
    accountId?: string;
}): ReplyPrefixOptions;
export {};
