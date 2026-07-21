import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { g as DmPolicy, v as GroupPolicy } from "./types.base-DD09OBJd.js";
import { t as ChannelGroupPolicy } from "./group-policy-CxQYP8YQ.js";
import { n as ResolvedWhatsAppAccount } from "./accounts-BSZnUeqA.js";
//#region extensions/whatsapp/src/inbound-policy.d.ts
type ResolvedWhatsAppInboundPolicy = {
  account: ResolvedWhatsAppAccount;
  dmPolicy: DmPolicy;
  groupPolicy: GroupPolicy;
  configuredAllowFrom: string[];
  dmAllowFrom: string[];
  groupAllowFrom: string[];
  isSelfChat: boolean;
  providerMissingFallbackApplied: boolean;
  isSamePhone: (value?: string | null) => boolean;
  resolveConversationGroupPolicy: (conversationId: string) => ChannelGroupPolicy;
  resolveConversationRequireMention: (conversationId: string) => boolean;
};
declare function resolveWhatsAppInboundPolicy(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  selfE164?: string | null;
}): ResolvedWhatsAppInboundPolicy;
//#endregion
export { resolveWhatsAppInboundPolicy as t };