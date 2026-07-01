import type { MsgContext } from "./templating.js";
/** Formats a prompt-visible media attachment note, omitting audio already represented by transcript. */
export declare function buildInboundMediaNote(ctx: MsgContext): string | undefined;
