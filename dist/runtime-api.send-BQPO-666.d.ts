import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { C as MarkdownTableMode } from "./types.base-DD09OBJd.js";
import { t as OutboundMediaAccess } from "./load-options-CQixiFLj.js";
import { f as ChunkMode } from "./outbound.types-B6ktAocG.js";
import { i as DiscordReplyReference } from "./send.shared-B9tglP0k.js";
import { C as RequestClient, v as DiscordSendResult } from "./send.types-DORb1pEB.js";
import { d as DiscordComponentBuildResult, h as DiscordComponentMessageSpec } from "./components-Dtm7zqm_.js";
//#region extensions/discord/src/send.components.d.ts
type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  token?: string;
  rest?: RequestClient;
  silent?: boolean;
  reply?: DiscordReplyReference;
  sessionKey?: string;
  agentId?: string;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  suppressEmbeds?: boolean; /** Persist the concrete platform send before component bookkeeping can fail. */
  onDeliveryResult?: (result: DiscordSendResult) => Promise<void> | void;
};
declare function registerBuiltDiscordComponentMessage(params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
  ttlMs?: number;
}): void;
declare function sendDiscordComponentMessage(to: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
declare function editDiscordComponentMessage(to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
//#endregion
export { registerBuiltDiscordComponentMessage as n, sendDiscordComponentMessage as r, editDiscordComponentMessage as t };