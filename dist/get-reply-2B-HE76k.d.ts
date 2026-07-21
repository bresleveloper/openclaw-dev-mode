import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { n as GetReplyOptions, u as ReplyPayload } from "./types-C5Sz_b28.js";
import { i as MsgContext } from "./templating-Bl_fNKHX.js";

//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: MsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };