import { $c as PluginCommandContext, Qc as OpenClawPluginCommandDefinition, el as PluginCommandResult, uv as NativeSubagentCommandFactory } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
/** Projects the safe provider-native metadata shared by catalog and runtime surfaces. */
declare function projectPluginCommandNativeMetadata(command: OpenClawPluginCommandDefinition, provider?: string): {
  readonly name: string;
  readonly description: string;
  readonly descriptionLocalizations?: Readonly<{
    [x: string]: string;
  }> | undefined;
  readonly acceptsArgs: boolean;
  readonly requireAuth: boolean;
  readonly progressMessage?: string | undefined;
};
declare const pluginCommandDispatchBrand: unique symbol;
type PluginCommandDispatchContext = Readonly<{
  senderId?: string;
  channel: string;
  channelId?: PluginCommandContext["channelId"];
  isAuthorizedSender: boolean;
  senderIsOwner?: boolean;
  assertOwnerCurrent?: () => void;
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"];
  /** Host-resolved agent authority for plugin-owned or non-agent-shaped session keys. */
  agentId?: string;
  sessionKey?: PluginCommandContext["sessionKey"];
  sessionId?: PluginCommandContext["sessionId"];
  sessionTarget?: PluginCommandContext["sessionTarget"];
  sessionFile?: PluginCommandContext["sessionFile"];
  authProfileId?: string;
  commandBody: string;
  config: OpenClawConfig;
  from?: PluginCommandContext["from"];
  to?: PluginCommandContext["to"];
  originatingTo?: string;
  accountId?: PluginCommandContext["accountId"];
  messageThreadId?: PluginCommandContext["messageThreadId"];
  threadParentId?: PluginCommandContext["threadParentId"];
  diagnosticsSessions?: PluginCommandContext["diagnosticsSessions"];
  diagnosticsUploadApproved?: PluginCommandContext["diagnosticsUploadApproved"];
  diagnosticsPreviewOnly?: PluginCommandContext["diagnosticsPreviewOnly"];
  diagnosticsPrivateRouted?: PluginCommandContext["diagnosticsPrivateRouted"];
  runtimeContext?: {
    /** Host-only factory, bound to the command invocation before the reader is exposed. */
    createModels?: (params: {
      signal: AbortSignal;
      assertCurrent: () => void;
    }) => NonNullable<PluginCommandContext["runtimeContext"]>["models"];
    /** Core-only factory; requester authority is captured by the dispatch owner. */
    createSubagents?: NativeSubagentCommandFactory;
    compactCurrent?: (signal?: AbortSignal, assertOwnerCurrent?: () => void) => ReturnType<NonNullable<NonNullable<PluginCommandContext["runtimeContext"]>["compactCurrent"]>>;
  };
}>;
/** Opaque capability bound to one selected command in one registry generation. */
type PluginCommandDispatch = Readonly<{
  kind: "plugin";
  execute: (context: PluginCommandDispatchContext) => Promise<PluginCommandResult>;
  [pluginCommandDispatchBrand]: true;
}>;
type PluginCommandCatalogDecision = PluginCommandDispatch | Readonly<{
  kind: "non-plugin";
}>;
type PluginCommandNativeCandidate = ReturnType<typeof projectPluginCommandNativeMetadata> & {
  readonly prepareDispatch: (rawArgs?: string) => PluginCommandCatalogDecision;
};
type PluginCommandRuntime = Readonly<{
  listNativeCandidates: (provider: string) => readonly PluginCommandNativeCandidate[];
  /** @deprecated Accounts reload automatically; retained for v2026.9.1 callers until the next breaking SDK. */
  retainNativeCatalog: (provider: string) => void;
}>;
/** True when a command result hands the turn to the agent (`true` or `{ prompt }`). */
declare function pluginCommandResultContinuesAgent(result: PluginCommandResult): boolean;
/** Creates one command runtime bound permanently to the current scoped registry generation. */
declare function createPluginCommandRuntime(): PluginCommandRuntime;
export { PluginCommandRuntime as a, PluginCommandNativeCandidate as i, PluginCommandDispatch as n, createPluginCommandRuntime as o, PluginCommandDispatchContext as r, pluginCommandResultContinuesAgent as s, PluginCommandCatalogDecision as t };