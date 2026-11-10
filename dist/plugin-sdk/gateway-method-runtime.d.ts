import "../types-D7I_F5Ux.js";
import { t as SchemaContract } from "../schema-contract-v05QRSzC.js";
import { A as RequesterSettleWakeReplay, E as GatewayContextResolver, JC as TrustedAgentToolCaller, KC as GatewayAgentRunTaskOwner, YC as TrustedSessionCreation, bE as ReplyExpectation, j as GatewayMethodDispatchResponse$1, k as GatewayRequestOptions, mw as PluginSubagentRequesterContext, qC as GatewayNodeInvokeStream, xE as SubagentCompletionToolHandoffRegistration, yE as RuntimePluginToolGrant } from "../config-contracts-CY87ANNp.js";
import "../plugin-metadata-snapshot-C_ou8VB5.js";
import { o as GatewayOperatorRoleActor } from "../origin-check-DKKuLlgF.js";
import "../config-state-DeFJNtp3.js";
//#region src/gateway/server-plugin-in-process-dispatch.types.d.ts
type DispatchGatewayMethodInProcessOptions = {
  privateCompletion?: true;
  /** Trusted input-owner policy; not accepted from the wire request. */
  replyExpectation?: ReplyExpectation;
  settleWakeReplay?: RequesterSettleWakeReplay;
  allowSyntheticModelOverride?: boolean;
  agentToolCaller?: TrustedAgentToolCaller;
  agentRunTracking?: GatewayAgentRunTaskOwner;
  cancelOnDeadline?: boolean;
  disableSyntheticClient?: boolean;
  expectFinal?: boolean;
  forceSyntheticClient?: boolean;
  nodeInvokeStream?: GatewayNodeInvokeStream;
  nodeInvokeApprovalSessionKey?: string;
  onAccepted?: (payload: unknown) => void;
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
//#endregion
//#region src/gateway/server-plugin-in-process-dispatch.d.ts
declare function dispatchGatewayMethodInProcessRaw(method: string, params: unknown, options?: DispatchGatewayMethodInProcessOptions): Promise<GatewayMethodDispatchResponse$1>;
//#endregion
//#region src/plugin-sdk/gateway-method-runtime.d.ts
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
//#endregion