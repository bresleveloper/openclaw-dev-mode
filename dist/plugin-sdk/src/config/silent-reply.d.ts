import { type SilentReplyConversationType, type SilentReplyPolicy } from "../shared/silent-reply-policy.js";
import type { OpenClawConfig } from "./types.openclaw.js";
type ResolveSilentReplyParams = {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    surface?: string;
    conversationType?: SilentReplyConversationType;
};
/** Resolves the effective silent-reply settings for a routed conversation. */
export declare function resolveSilentReplySettings(params: ResolveSilentReplyParams): {
    policy: SilentReplyPolicy;
};
/** Returns just the effective silent-reply policy for callers that do not need metadata. */
export declare function resolveSilentReplyPolicy(params: ResolveSilentReplyParams): SilentReplyPolicy;
export {};
