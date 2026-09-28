import { l as ChannelConfigSchema } from "./zod-schema.implicit-mentions-Du1YLL_X.js";
import { d as ChannelSetupAdapter, l as ChannelOwnedSetupContract } from "./manifest-registry-CMnhqUB6.js";
import { a as ChannelAgentPromptAdapter, b as ChannelMessagingAdapter, c as ChannelCapabilities, h as ChannelMessageActionAdapter, j as ChannelThreadingAdapter, k as ChannelStreamingAdapter, m as ChannelMentionAdapter, o as ChannelAgentTool, s as ChannelAgentToolFactory, x as ChannelMeta } from "./types.core-D1MQo5ra.js";
import { n as ChannelMessageAdapterShape } from "./types-DOAIO5Ze.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { A as ChannelPairingAdapter, D as ChannelSecurityAdapter, E as ChannelSecretsAdapter, O as ChannelStatusAdapter, S as ChannelLifecycleAdapter, T as ChannelResolverAdapter, _ as ChannelElevatedAdapter, a as ChannelCommandAdapter, b as ChannelGroupAdapter, d as ChannelDirectoryAdapter, f as ChannelDoctorAdapter, i as ChannelAuthAdapter, k as ChannelConversationBindingSupport, r as ChannelApprovalCapability, s as ChannelConfigAdapter, t as ChannelAllowlistAdapter, u as ChannelConfiguredBindingProvider, v as ChannelGatewayAdapter, x as ChannelHeartbeatAdapter } from "./types.adapters-dxHXA2rq.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-HYq1MKG1.js";
import { n as ChannelSetupWizard, r as ChannelSetupWizardAdapter } from "./setup-wizard-types-B39o8fS3.js";
//#region src/gateway/operator-scopes.d.ts
declare const ADMIN_SCOPE: "operator.admin";
declare const READ_SCOPE: "operator.read";
declare const WRITE_SCOPE: "operator.write";
declare const SESSION_READ_SCOPE: "operator.sessions.read";
declare const SESSION_WRITE_SCOPE: "operator.sessions.write";
declare const APPROVALS_SCOPE: "operator.approvals";
declare const QUESTIONS_SCOPE: "operator.questions";
declare const PAIRING_SCOPE: "operator.pairing";
declare const TALK_SCOPE: "operator.talk";
declare const TALK_SECRETS_SCOPE: "operator.talk.secrets";
/** Operator privileges advertised by gateway auth and checked by method policy. */
type OperatorScope = typeof ADMIN_SCOPE | typeof READ_SCOPE | typeof WRITE_SCOPE | typeof SESSION_READ_SCOPE | typeof SESSION_WRITE_SCOPE | typeof APPROVALS_SCOPE | typeof QUESTIONS_SCOPE | typeof PAIRING_SCOPE | typeof TALK_SCOPE | typeof TALK_SECRETS_SCOPE;
//#endregion
//#region src/channels/plugins/types.plugin.d.ts
/** Full capability contract for a native channel plugin. */
type ChannelPluginSetupWizard = ChannelSetupWizard | ChannelSetupWizardAdapter;
type ChannelGatewayMethodDescriptor = {
  name: string;
  scope?: OperatorScope;
  description?: string;
};
type ChannelPlugin<ResolvedAccount = any, Probe = unknown, Audit = unknown> = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  defaults?: {
    queue?: {
      debounceMs?: number;
    };
  };
  reload?: {
    configPrefixes: string[];
    /** Published dynamic reads; `*` matches one nonempty dotted config key. */
    noopPrefixes?: string[];
    /**
     * Opt into restarting only the changed non-default named account.
     * Set only when sibling account resolution and lifecycle state are isolated and
     * account stop fully settles owned work. Shared, default, removed, or unresolved
     * account changes still restart the whole channel.
     */
    accountScopedRestart?: boolean;
  };
  setupWizard?: ChannelPluginSetupWizard;
  config: ChannelConfigAdapter<ResolvedAccount>;
  configSchema?: ChannelConfigSchema;
  /** Channel-owned typed setup contract. Preferred over the legacy shared input adapter. */
  setupContract?: ChannelOwnedSetupContract;
  /** @deprecated Use setupContract for new plugins. */
  setup?: ChannelSetupAdapter;
  pairing?: ChannelPairingAdapter;
  security?: ChannelSecurityAdapter<ResolvedAccount>;
  groups?: ChannelGroupAdapter;
  mentions?: ChannelMentionAdapter;
  outbound?: ChannelOutboundAdapter;
  status?: ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
  gatewayMethods?: string[];
  gatewayMethodDescriptors?: ChannelGatewayMethodDescriptor[];
  gateway?: ChannelGatewayAdapter<ResolvedAccount>;
  auth?: ChannelAuthAdapter;
  approvalCapability?: ChannelApprovalCapability;
  elevated?: ChannelElevatedAdapter;
  commands?: ChannelCommandAdapter;
  lifecycle?: ChannelLifecycleAdapter;
  secrets?: ChannelSecretsAdapter;
  allowlist?: ChannelAllowlistAdapter;
  doctor?: ChannelDoctorAdapter;
  bindings?: ChannelConfiguredBindingProvider;
  conversationBindings?: ChannelConversationBindingSupport;
  streaming?: ChannelStreamingAdapter;
  threading?: ChannelThreadingAdapter;
  message?: ChannelMessageAdapterShape;
  messaging?: ChannelMessagingAdapter;
  agentPrompt?: ChannelAgentPromptAdapter;
  directory?: ChannelDirectoryAdapter;
  resolver?: ChannelResolverAdapter;
  actions?: ChannelMessageActionAdapter;
  heartbeat?: ChannelHeartbeatAdapter;
  agentTools?: ChannelAgentToolFactory | ChannelAgentTool[];
};
//#endregion
export { OperatorScope as n, ChannelPlugin as t };