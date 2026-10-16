import { nn as SchemaContract } from "../types.openclaw-DWWUw8hA.js";
import "../reply-payload-DazZPys5.js";
import "../io-CwO8iq4h.js";
import { Do as GatewayRequestOptions, Gf as RuntimePluginToolGrant, Ho as SubagentCompletionToolHandoffRegistration, Oo as RequesterSettleWakeReplay, as as TrustedSessionCreation, is as TrustedAgentToolCaller, ko as GatewayMethodDispatchResponse$1, ns as GatewayAgentRunTaskOwner, ps as GatewayOperatorRoleActor, rs as GatewayNodeInvokeStream, wo as GatewayContextResolver } from "../agent-harness-runtime-DZjstJNb.js";
import "../user-profiles.types-ysUz1C8K.js";
import { a as PluginSubagentRequesterContext } from "../hook-runner-global-Jvv9WFUW.js";
import "../config-activation-shared-Dd5FrI8x.js";
//#region src/gateway/server-plugin-in-process-dispatch.types.d.ts
type DispatchGatewayMethodInProcessOptions = {
  privateCompletion?: true;
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