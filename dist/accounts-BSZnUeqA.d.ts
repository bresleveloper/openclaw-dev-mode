import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { E as ReplyToMode, g as DmPolicy, v as GroupPolicy } from "./types.base-DD09OBJd.js";
import { t as WhatsAppAccountConfig } from "./account-types-DB5KVGj1.js";

//#region extensions/whatsapp/src/account-ids.d.ts
declare const listConfiguredAccountIds: (cfg: OpenClawConfig) => string[], listAccountIds: (cfg: OpenClawConfig) => string[], resolveDefaultWhatsAppAccountId: (cfg: OpenClawConfig) => string;
//#endregion
//#region extensions/whatsapp/src/accounts.d.ts
type ResolvedWhatsAppAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  sendReadReceipts: boolean;
  messagePrefix?: string;
  defaultTo?: string;
  authDir: string;
  isLegacyAuthDir: boolean;
  selfChatMode?: boolean;
  allowFrom?: string[];
  groupAllowFrom?: string[];
  groupPolicy?: GroupPolicy;
  mentionPatterns?: WhatsAppAccountConfig["mentionPatterns"];
  dmPolicy?: DmPolicy;
  historyLimit?: number;
  textChunkLimit?: number;
  chunkMode?: "length" | "newline";
  mediaMaxMb?: number;
  blockStreaming?: boolean;
  ackReaction?: WhatsAppAccountConfig["ackReaction"];
  reactionLevel?: WhatsAppAccountConfig["reactionLevel"];
  groups?: WhatsAppAccountConfig["groups"];
  direct?: WhatsAppAccountConfig["direct"];
  debounceMs?: number;
  replyToMode?: ReplyToMode;
};
declare const DEFAULT_WHATSAPP_MEDIA_MAX_MB = 50;
declare function listWhatsAppAuthDirs(cfg: OpenClawConfig): string[];
declare function hasAnyWhatsAppAuth(cfg: OpenClawConfig): boolean;
declare function resolveWhatsAppAuthDir(params: {
  cfg: OpenClawConfig;
  accountId: string;
}): {
  authDir: string;
  isLegacy: boolean;
};
declare function resolveWhatsAppAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedWhatsAppAccount;
declare function resolveWhatsAppMediaMaxBytes(account: Pick<ResolvedWhatsAppAccount, "mediaMaxMb">): number;
declare function listEnabledWhatsAppAccounts(cfg: OpenClawConfig): ResolvedWhatsAppAccount[];
//#endregion
export { listWhatsAppAuthDirs as a, resolveWhatsAppMediaMaxBytes as c, listEnabledWhatsAppAccounts as i, listAccountIds as l, ResolvedWhatsAppAccount as n, resolveWhatsAppAccount as o, hasAnyWhatsAppAuth as r, resolveWhatsAppAuthDir as s, DEFAULT_WHATSAPP_MEDIA_MAX_MB as t, resolveDefaultWhatsAppAccountId as u };