import { T as ReplyToMode } from "./types.base-iHeWRS8q.js";
import { i as ReplyThreadingPolicy } from "./types-Iy-uj5hQ.js";
//#region src/auto-reply/reply/reply-threading.d.ts
/** Build threading policy for batched reply-to mode. */
declare function resolveBatchedReplyThreadingPolicy(mode: ReplyToMode, isBatched: boolean): ReplyThreadingPolicy | undefined;
//#endregion
export { resolveBatchedReplyThreadingPolicy as t };