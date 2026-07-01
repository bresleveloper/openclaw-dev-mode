import type { CurrentInboundPromptContext } from "../../agents/embedded-agent-runner/run/params.js";
import type { InboundEventKind } from "../../channels/inbound-event/kind.js";
import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
import type { MsgContext, TemplateContext } from "../templating.js";
/** Builds command/transcript/queued prompt bodies from inbound context. */
export declare function buildReplyPromptBodies(params: {
    ctx: MsgContext;
    sessionCtx: TemplateContext;
    effectiveBaseBody: string;
    prefixedBody?: string;
    transcriptBody?: string;
    threadContextNote?: string;
    systemEventBlocks?: string[];
    inboundEventKind?: InboundEventKind;
}): {
    mediaNote?: string;
    mediaReplyHint?: string;
    prefixedCommandBody: string;
    queuedBody: string;
    transcriptCommandBody: string;
};
/** Startup action associated with a reply prompt envelope. */
export type ReplyPromptEnvelopeStartupAction = "new" | "reset";
/** Full prompt envelope passed into reply run preparation. */
export type ReplyPromptEnvelope = ReturnType<typeof buildReplyPromptBodies> & {
    /** Model-visible body before media, thread context, and inter-session annotation are applied. */
    effectiveBaseBody: string;
    /** User-visible body persisted to transcript before media/inter-session annotation. */
    transcriptBody: string;
    /** Runtime-only user context for backends that can carry it outside transcript text. */
    currentInboundContext?: CurrentInboundPromptContext;
};
/** Base prompt envelope fields before body variants are added. */
export type ReplyPromptEnvelopeBase = {
    /** Model-visible body before media, thread context, and inter-session annotation are applied. */
    effectiveBaseBody: string;
    /** User-visible body persisted to transcript before media/inter-session annotation. */
    transcriptBody: string;
    /** Runtime-only user context for backends that can carry it outside transcript text. */
    currentInboundContext?: CurrentInboundPromptContext;
};
type ReplyPromptEnvelopeBaseParams = {
    ctx: MsgContext;
    sessionCtx: TemplateContext;
    baseBody: string;
    hasUserBody: boolean;
    inboundUserContext: string;
    inboundUserContextPromptJoiner?: CurrentInboundPromptContext["promptJoiner"];
    isBareSessionReset: boolean;
    startupAction: ReplyPromptEnvelopeStartupAction;
    startupContextPrelude?: string | null;
    softResetTail?: string;
    isHeartbeat?: boolean;
    inboundEventKind?: InboundEventKind;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
/** Builds prompt envelope metadata shared by all body variants. */
export declare function buildReplyPromptEnvelopeBase(params: ReplyPromptEnvelopeBaseParams): ReplyPromptEnvelopeBase;
/** Builds the full reply prompt envelope for a prepared run. */
export declare function buildReplyPromptEnvelope(params: ReplyPromptEnvelopeBaseParams & {
    prefixedBody?: string;
    threadContextNote?: string;
    systemEventBlocks?: string[];
}): ReplyPromptEnvelope;
export {};
