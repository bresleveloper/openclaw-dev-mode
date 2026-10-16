import "./types.openclaw-DWWUw8hA.js";
import "./defaults-D0SAbcb2.js";
import { Mr as OpenClawPluginDefinition, Nr as OpenClawPluginConfigSchema, wc as ProviderBuiltInModelSuppressionContext$1 } from "./agent-harness-runtime-DZjstJNb.js";
import "./hook-runner-global-Jvv9WFUW.js";
import "./conversation-binding.types-CWsGnzcy.js";
//#region src/plugin-sdk/plugin-entry.d.ts
type ProviderBuiltInModelSuppressionContext = ProviderBuiltInModelSuppressionContext$1;
/** Options for a plugin entry that registers providers, tools, commands, or services. */
type DefinePluginEntryOptions = {
  id: string;
  name: string;
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
};
/** Normalized object shape that OpenClaw loads from a plugin entry module. */
type DefinedPluginEntry = Omit<DefinePluginEntryOptions, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
/**
 * Canonical entry helper for non-channel plugins.
 *
 * Use this for provider, tool, command, service, memory, and context-engine
 * plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
 * `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
 *
 * @experimental Pin and test OpenClaw host versions; existing compatibility windows still apply.
 */
declare function definePluginEntry({ id, name, description, kind, configSchema, reload, nodeHostCommands, securityAuditCollectors, register }: DefinePluginEntryOptions): DefinedPluginEntry;
//#endregion
export { definePluginEntry as n, ProviderBuiltInModelSuppressionContext as t };