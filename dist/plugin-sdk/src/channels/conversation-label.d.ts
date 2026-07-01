import type { MsgContext } from "../auto-reply/templating.js";
/**
 * Resolves the most readable conversation label from normalized inbound message context.
 */
export declare function resolveConversationLabel(ctx: MsgContext): string | undefined;
