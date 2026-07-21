import { E as ReplyToMode } from "./types.base-DD09OBJd.js";
import { i as ReplyThreadingPolicy } from "./types-C5Sz_b28.js";
//#region src/auto-reply/reply/reply-threading.d.ts
/** Build threading policy for batched reply-to mode. */
declare function resolveBatchedReplyThreadingPolicy(mode: ReplyToMode, isBatched: boolean): ReplyThreadingPolicy | undefined;
//#endregion
export { resolveBatchedReplyThreadingPolicy as t };