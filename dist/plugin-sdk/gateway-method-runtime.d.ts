import { Dn as RequesterSettleWakeReplay, En as AgentTurnStartOwner, IE as SubagentCompletionToolHandoffRegistration, On as GatewayMethodDispatchResponse$1, Sn as GatewayContextResolver, Tn as GatewayRequestOptions, YT as SessionControllerInput, Y_ as PluginSubagentRequesterContext, Zj as SubagentCompletion, fu as GatewayAgentRunTaskOwner, gu as TrustedSessionCreation, hu as TrustedAgentToolCaller, mu as GatewayNodeInvokeStream, uE as RuntimePluginToolGrant, zE as ReplyExpectation } from "../config-contracts-hzlacViZ.js";
import "../types.openclaw-D8uW-XQA.js";
import { t as SchemaContract } from "../schema-contract-c2sTcmgZ.js";
import { o as GatewayOperatorRoleActor } from "../origin-check-lKhzfAIF.js";
import "../config-activation-shared-DnlSzxwJ.js";
type DispatchGatewayMethodInProcessOptions = {
  /** Exact host-owned source reference for an in-process agent continuation. */
  controllerInput?: SessionControllerInput;
  privateCompletion?: true;
  /** Trusted input-owner policy; not accepted from the wire request. */
  replyExpectation?: ReplyExpectation;
  settleWakeReplay?: RequesterSettleWakeReplay;
  subagentCompletions?: readonly SubagentCompletion[];
  allowSyntheticModelOverride?: boolean;
  agentToolCaller?: TrustedAgentToolCaller;
  agentRunTracking?: GatewayAgentRunTaskOwner;
  cancelOnDeadline?: boolean;
  disableSyntheticClient?: boolean;
  expectFinal?: boolean;
  forceSyntheticClient?: boolean;
  /** Host-only, request-scoped bridge for a plugin approval prompt. */
  allowHostPluginApprovalRequest?: boolean;
  nodeInvokeStream?: GatewayNodeInvokeStream;
  nodeInvokeApprovalSessionKey?: string;
  onAccepted?: (payload: unknown) => void;
  onStartOwner?: (owner: AgentTurnStartOwner) => void;
  onExecution?: (execution: Promise<void>) => void;
  onExecutionStarted?: () => void;
  onSignalAbort?: () => Promise<void> | void;
  operatorRoleActor?: GatewayOperatorRoleActor;
  pluginRuntimeOwnerId?: string;
  pluginSubagentRequester?: PluginSubagentRequesterContext;
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  pluginSubagentToolsAllow?: string[];
  delegatedToolPolicyHandoff?: SubagentCompletionToolHandoffRegistration;
  sessionCreation?: TrustedSessionCreation;
  requireScopedClient?: boolean;
  syntheticScopes?: string[];
  /** Built-in adapters distinguish method minima from explicit or retained scope ceilings. */
  syntheticScopeMode?: "minimum" | "exact";
  timeoutMs?: number;
  signal?: AbortSignal;
  hasCurrentClientAuthority?: GatewayRequestOptions["hasCurrentClientAuthority"];
  resolveGatewayContext?: GatewayContextResolver;
  prepareDispatchCurrent?: () => Promise<void>;
  sessionMutationCommitGuard?: () => void;
};
declare function dispatchGatewayMethodInProcessRaw(method: string, params: unknown, options?: DispatchGatewayMethodInProcessOptions): Promise<GatewayMethodDispatchResponse$1>;
/** Error envelope returned by in-process Gateway method dispatch. */
export type GatewayMethodDispatchError = NonNullable<GatewayMethodDispatchResponse["error"]>;
/** Response envelope returned to plugins after dispatching a Gateway method. */
export type GatewayMethodDispatchResponse = SchemaContract<Awaited<ReturnType<typeof dispatchGatewayMethodInProcessRaw>>>;
/** Dispatch controls for plugin-initiated Gateway method calls. */
export type GatewayMethodDispatchOptions = {
  /** Wait for the Gateway's final response instead of returning the first response frame. */
  expectFinal?: boolean;
  /** Maximum time to wait for Gateway dispatch before the runtime reports a timeout. */
  timeoutMs?: number;
};
/**
 * Dispatch a Gateway control-plane method from an authenticated plugin request scope.
 */
export declare function dispatchGatewayMethod(
/** Gateway method name, validated by the Gateway method router. */
method: string,
/** Method-specific params forwarded without SDK-side normalization. */
params?: unknown,
/** Dispatch behavior controls for response timing and timeout handling. */
options?: GatewayMethodDispatchOptions): Promise<GatewayMethodDispatchResponse>;
export {};