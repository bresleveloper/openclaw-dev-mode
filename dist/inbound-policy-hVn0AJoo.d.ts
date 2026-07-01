import { i as OpenClawConfig } from "./types.openclaw-DlpCUWMr.js";
import { _ as GroupPolicy, h as DmPolicy } from "./types.base-iHeWRS8q.js";
import { t as ChannelGroupPolicy } from "./group-policy-z36RwvYN.js";
import { n as ResolvedWhatsAppAccount } from "./accounts-vlg0Cr7v.js";
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