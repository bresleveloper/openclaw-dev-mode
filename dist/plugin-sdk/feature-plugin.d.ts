import { Ec as PluginCommandResult, Ed as PluginSessionActionContext, Fs as OpenClawPluginToolContext, Na as OpenClawPluginDefinition, Ns as OpenClawPluginApi, Pa as OpenClawPluginConfigSchema, Tc as PluginCommandContext } from "../agent-harness-runtime-CWL0fcg5.js";
import { d as AgentToolUpdateCallback } from "../types-BRvdDyOm.js";
import { FeatureContract, FeatureEvent, FeatureEventName, FeatureInput, FeatureOperationName, FeatureOutput } from "./feature-contract.js";
//#region src/plugin-sdk/feature-plugin.d.ts
export type FeatureInvocationContext = {
  api: OpenClawPluginApi;
} & ({
  source: "session-action";
  action: PluginSessionActionContext;
} | {
  source: "tool";
  tool: OpenClawPluginToolContext;
  toolCallId: string;
  signal?: AbortSignal;
  onUpdate?: AgentToolUpdateCallback;
} | {
  source: "command";
  command: PluginCommandContext;
});
export type FeatureHandlers<C extends FeatureContract> = { [K in FeatureOperationName<C>]: (input: FeatureInput<C, K>, context: FeatureInvocationContext) => FeatureOutput<C, K> | Promise<FeatureOutput<C, K>>; };
export type FeatureEventEmitter<C extends FeatureContract> = {
  emit: <K extends FeatureEventName<C>>(event: K, payload: FeatureEvent<C, K>) => void;
};
export type FeatureCommandAdapter<C extends FeatureContract, K extends FeatureOperationName<C>> = {
  name: string;
  description?: string;
  parse: (context: PluginCommandContext) => FeatureInput<C, K>;
  format?: (output: FeatureOutput<C, K>, context: PluginCommandContext) => PluginCommandResult;
};
export type DefineFeaturePluginOptions<C extends FeatureContract> = {
  contract: C;
  name: string;
  description: string;
  /** Registration is synchronous; long-lived work belongs to api.registerService. */
  setup: (api: OpenClawPluginApi, events: FeatureEventEmitter<C>) => FeatureHandlers<C>;
  commands?: Partial<{ [K in FeatureOperationName<C>]: FeatureCommandAdapter<C, K>; }>;
};
/** One implementation serves each declared surface without relaying through privileged RPC. */
export declare function defineFeaturePlugin<C extends FeatureContract>(definition: DefineFeaturePluginOptions<C>): Omit<{
  id: string;
  name: string;
  description: string;
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
//#endregion