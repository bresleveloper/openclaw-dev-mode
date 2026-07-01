import type { MsgContext } from "../../auto-reply/templating.js";
/** Normalizes caller-supplied session keys through the matching channel plugin when available. */
export declare function normalizeExplicitSessionKey(sessionKey: string, ctx: MsgContext): string;
