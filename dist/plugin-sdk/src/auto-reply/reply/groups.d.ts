import type { GroupKeyResolution, SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SilentReplyPolicy } from "../../shared/silent-reply-policy.js";
import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
import type { TemplateContext } from "../templating.js";
/** Resolves whether a group/channel turn requires an explicit mention. */
export declare function resolveGroupRequireMention(params: {
    cfg: OpenClawConfig;
    ctx: TemplateContext;
    groupResolution?: GroupKeyResolution;
}): Promise<boolean>;
/** Converts requireMention into the default prompt activation label. */
export declare function defaultGroupActivation(requireMention: boolean): "always" | "mention";
/**
 * Builds trusted group/channel delivery guidance.
 *
 * Room names, members, and history are rendered separately as untrusted inbound
 * context. Legacy automatic delivery posts text final replies directly, but
 * files/images/attachments still need message(action=send).
 */
export declare function buildGroupChatContext(params: {
    sessionCtx: TemplateContext;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    silentReplyPolicy?: SilentReplyPolicy;
    silentToken?: string;
}): string;
/** Builds system prompt context for direct conversations. */
export declare function buildDirectChatContext(params: {
    sessionCtx: TemplateContext;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
}): string;
/** Resolves silent-reply behavior text for group prompt instructions. */
export declare function resolveGroupSilentReplyBehavior(params: {
    sessionEntry?: SessionEntry;
    defaultActivation: "always" | "mention";
    silentReplyPolicy?: SilentReplyPolicy;
}): {
    activation: "always" | "mention";
    canUseSilentReply: boolean;
    allowEmptyAssistantReplyAsSilent: boolean;
};
/** Builds the channel-specific group intro injected into the system prompt. */
export declare function buildGroupIntro(params: {
    cfg: OpenClawConfig;
    sessionCtx: TemplateContext;
    sessionEntry?: SessionEntry;
    defaultActivation: "always" | "mention";
    silentToken: string;
    silentReplyPolicy?: SilentReplyPolicy;
}): string;
