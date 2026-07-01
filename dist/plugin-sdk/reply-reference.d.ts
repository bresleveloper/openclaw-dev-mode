import { T as ReplyToMode } from "./types.base-DmKdGokm.js";
import { i as ReplyThreadingPolicy } from "./types-DNy-f8Hr.js";
import { n as isSingleUseReplyToMode, t as createReplyReferencePlanner } from "./reply-reference-Cn3MZh92.js";

//#region src/auto-reply/reply/reply-threading.d.ts
/** Build threading policy for batched reply-to mode. */
declare function resolveBatchedReplyThreadingPolicy(mode: ReplyToMode, isBatched: boolean): ReplyThreadingPolicy | undefined;
//#endregion
export { type ReplyThreadingPolicy, createReplyReferencePlanner, isSingleUseReplyToMode, resolveBatchedReplyThreadingPolicy };