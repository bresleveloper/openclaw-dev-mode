import { _ as ChannelConfigSchema } from "./zod-schema.implicit-mentions-BfiN-dfC.js";
import { a as ChannelAgentPromptAdapter, b as ChannelMessagingAdapter, h as ChannelMessageActionAdapter, j as ChannelThreadingAdapter, k as ChannelStreamingAdapter, m as ChannelMentionAdapter, o as ChannelAgentTool, s as ChannelAgentToolFactory } from "./types.core-Bra2QBA5.js";
import { n as ChannelMessageAdapterShape } from "./types-DemD-QhX.js";
import { A as ChannelStatusAdapter, C as ChannelHeartbeatAdapter, D as ChannelResolverAdapter, M as ChannelPairingAdapter, O as ChannelSecretsAdapter, S as ChannelGroupAdapter, _ as ChannelElevatedAdapter, a as ChannelCommandAdapter, d as ChannelDirectoryAdapter, f as ChannelDoctorAdapter, i as ChannelAuthAdapter, j as ChannelConversationBindingSupport, k as ChannelSecurityAdapter, r as ChannelApprovalCapability, s as ChannelConfigAdapter, t as ChannelAllowlistAdapter, u as ChannelConfiguredBindingProvider, v as ChannelGatewayAdapter, w as ChannelLifecycleAdapter, y as ChannelGatewayAdapterV2 } from "./types.adapters-Bo2TMZGx.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-B8D3jrzb.js";
import { n as ChannelSetupPlugin } from "./setup-wizard-types-nN6P9WIn.js";
//#region src/gateway/operator-scopes.d.ts
declare const KNOWN_OPERATOR_SCOPE_VALUES: readonly ["operator.admin", "operator.read", "operator.write", "operator.sessions.read", "operator.sessions.write", "operator.approvals", "operator.questions", "operator.pairing", "operator.talk", "operator.talk.secrets"];
/** Operator privileges advertised by gateway auth and checked by method policy. */
type OperatorScope = (typeof KNOWN_OPERATOR_SCOPE_VALUES)[number];
//#endregion
//#region src/channels/plugins/types.plugin.d.ts
type ChannelGatewayMethodDescriptor = {
  name: string;
  scope?: OperatorScope;
  description?: string;
};
/** Full capability contract for a native channel plugin. */
type ChannelPlugin<ResolvedAccount = any, Probe = unknown, Audit = unknown, GatewayVersion extends 1 | 2 = 1> = Omit<ChannelSetupPlugin, "config"> & {
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
  config: ChannelConfigAdapter<ResolvedAccount>;
  configSchema?: ChannelConfigSchema;
  pairing?: ChannelPairingAdapter;
  security?: ChannelSecurityAdapter<ResolvedAccount>;
  groups?: ChannelGroupAdapter;
  mentions?: ChannelMentionAdapter;
  outbound?: ChannelOutboundAdapter;
  status?: ChannelStatusAdapter<ResolvedAccount, Probe, Audit>;
  gatewayMethods?: string[];
  gatewayMethodDescriptors?: ChannelGatewayMethodDescriptor[];
  gateway?: GatewayVersion extends 2 ? ChannelGatewayAdapterV2<ResolvedAccount> : ChannelGatewayAdapter<ResolvedAccount>;
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
/** Heterogeneous registries erase each plugin's account/probe/audit family, retaining its adapter version. */
type AnyChannelPlugin = ChannelPlugin<any, any, any, 1 | 2>;
//#endregion
export { ChannelPlugin as n, OperatorScope as r, AnyChannelPlugin as t };