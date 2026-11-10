import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { _k as ReplyPayload, f as GetReplyOptions, s as RuntimeMsgContext } from "./config-contracts-CY87ANNp.js";
import "./config-S5Zm-Svf.js";
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: RuntimeMsgContext, options?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };