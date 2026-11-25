import { Ck as PluginConversationBindingRequestResult, Qc as OpenClawPluginCommandDefinition, Sk as PluginConversationBindingRequestParams, W as PluginInteractiveHandlerRegistration, Zc as AgentPromptSurfaceKind, el as PluginCommandResult, xk as PluginConversationBinding, yk as requestPluginConversationBinding } from "./config-contracts-hzlacViZ.js";
import { r as PluginCommandDispatchContext } from "./plugin-command-runtime-DJ4kU5Wc.js";
import "./command-specs-av4kFT2Y.js";
type RegisteredPluginCommand = OpenClawPluginCommandDefinition & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  trustedOwnerStatusExposure?: true;
};
declare function clearPluginCommands(): void;
declare function listRegisteredPluginAgentPromptGuidance(params?: {
  surface?: AgentPromptSurfaceKind;
  includeLegacyGlobalGuidance?: boolean;
}): string[];
type CommandRegistrationResult = {
  ok: boolean;
  error?: string;
};
declare function registerPluginCommand(pluginId: string, command: OpenClawPluginCommandDefinition, opts?: {
  pluginName?: string;
  pluginRoot?: string;
  allowReservedCommandNames?: boolean;
  allowOwnerStatusExposure?: boolean;
}): CommandRegistrationResult;
type PluginCommandExecutionParams = PluginCommandDispatchContext & {
  command: RegisteredPluginCommand;
  args?: string;
};
/** Match one compatibility command invocation against the current command registry. */
declare function matchPluginCommand(commandBody: string, options?: {
  channel?: string;
}): {
  command: RegisteredPluginCommand;
  args?: string;
} | null;
declare function executePluginCommand(params: { -readonly [Key in keyof PluginCommandExecutionParams as Exclude<Key, "runtimeContext">]: PluginCommandExecutionParams[Key]; }): Promise<PluginCommandResult>;
type RegisteredInteractiveMetadata = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
type PluginBindingConversation = Parameters<typeof requestPluginConversationBinding>[0]["conversation"];
declare function createInteractiveConversationBindingHelpers(params: {
  registration: RegisteredInteractiveMetadata;
  senderId?: string;
  conversation: PluginBindingConversation;
}): {
  requestConversationBinding: (binding?: PluginConversationBindingRequestParams) => Promise<PluginConversationBindingRequestResult>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
/** Registered interactive handler with owning plugin metadata. */
type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
/** Registration result for plugin interactive namespace handlers. */
type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Registers one process-global interactive handler. */
declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
  pluginName?: string;
  pluginRoot?: string;
}): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
declare function clearPluginInteractiveHandlers(): void;
type PluginInteractiveDispatchRegistration = {
  channel: string;
  namespace: string;
};
/** Resolved interactive handler match passed to plugin callback dispatch. */
type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  data: string;
  namespace: string;
  payload: string;
};
type ChannelInteractivePayload = {
  data: string;
  namespace: string;
  payload: string;
};
type ChannelInteractiveDispatchPayload<T> = T extends ChannelInteractivePayload ? Omit<T, keyof ChannelInteractivePayload> : never;
type ChannelInteractiveDispatchBase = {
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  senderId?: string;
  threadId?: string | number;
  auth: {
    isAuthorizedSender: boolean;
  };
};
/** Dispatches one interactive callback payload to a matching plugin handler. */
declare function dispatchPluginInteractiveHandler<TRegistration extends PluginInteractiveDispatchRegistration, TResult extends {
  handled?: boolean;
} | void = {
  handled?: boolean;
} | void>(params: {
  channel: TRegistration["channel"];
  data: string;
  dedupeId?: string;
  onMatched?: () => Promise<void> | void;
  invoke: (match: PluginInteractiveMatch<TRegistration>) => Promise<TResult> | TResult;
  afterInvoke?: (result: TResult) => Promise<void> | void;
}): Promise<{
  matched: false;
  handled: false;
  duplicate: false;
} | {
  matched: true;
  handled: boolean;
  duplicate: boolean;
  result?: TResult;
}>;
/** Creates a channel dispatcher for plugin-owned interactive callbacks. */
declare function createChannelInteractiveDispatcher<TChannel extends string, TInteractiveKey extends PropertyKey, TContext extends ChannelInteractiveDispatchBase & {
  channel: TChannel;
  respond: unknown;
} & Record<TInteractiveKey, ChannelInteractivePayload>, TResult extends {
  handled?: boolean;
} | void = {
  handled?: boolean;
} | void, TDispatchInteractiveKey extends PropertyKey = TInteractiveKey>(config: {
  channel: TChannel;
  interactiveKey: TInteractiveKey;
  dispatchInteractiveKey?: TDispatchInteractiveKey;
}): (params: {
  data: string;
  dedupeId: string;
  ctx: Omit<TContext, TInteractiveKey | "respond" | "channel" | "requestConversationBinding" | "detachConversationBinding" | "getCurrentConversationBinding"> & ChannelInteractiveDispatchBase & Record<TDispatchInteractiveKey, ChannelInteractiveDispatchPayload<TContext[TInteractiveKey]>>;
  respond: TContext["respond"];
  conversation?: Parameters<typeof createInteractiveConversationBindingHelpers>[0]["conversation"];
  onMatched?: () => Promise<void> | void;
  afterInvoke?: (result: TResult) => Promise<void> | void;
}) => Promise<{
  matched: false;
  handled: false;
  duplicate: false;
} | {
  matched: true;
  handled: boolean;
  duplicate: boolean;
  result?: TResult | undefined;
}>;
type LazyServiceModule = Record<string, unknown>;
type LazyPluginServiceHandle = {
  stop: () => Promise<void>;
};
declare function startLazyPluginServiceModule(params: {
  skipEnvVar?: string;
  overrideEnvVar?: string;
  validateOverrideSpecifier?: (specifier: string) => string;
  loadDefaultModule: () => Promise<LazyServiceModule>;
  loadOverrideModule?: (specifier: string) => Promise<LazyServiceModule>;
  startExportNames: string[];
  stopExportNames?: string[];
}): Promise<LazyPluginServiceHandle | null>;
export { clearPluginInteractiveHandlers as a, executePluginCommand as c, clearPluginCommands as d, listRegisteredPluginAgentPromptGuidance as f, dispatchPluginInteractiveHandler as i, matchPluginCommand as l, startLazyPluginServiceModule as n, registerPluginInteractiveHandler as o, createChannelInteractiveDispatcher as r, createInteractiveConversationBindingHelpers as s, LazyPluginServiceHandle as t, registerPluginCommand as u };