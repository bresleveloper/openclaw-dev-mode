import { k as McpCodexToolApprovalMode } from "./types.openclaw-LzSbb55e.js";
import { t as PluginManifestRecord } from "./manifest-registry-CMnhqUB6.js";
import { n as AnyAgentTool } from "./common-BCM4z2Iy.js";
//#region src/agents/mcp-codex-tool-approval.d.ts
type McpCodexToolAnnotations = {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
};
//#endregion
//#region src/plugins/tool-metadata.d.ts
/** MCP bridge metadata attached to plugin tools surfaced through agent tool lists. */
type PluginToolMcpMeta = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
  excludedFromOpenClawCatalog?: true;
  deniedBySession?: true;
  /** Trusted requester OAuth sign-in bootstrap; exempt from per-call MCP approval. */
  oauthConnectBootstrap?: true;
  codexApproval?: {
    mode?: McpCodexToolApprovalMode;
    annotations?: McpCodexToolAnnotations;
  };
  node?: {
    id: string;
    displayName?: string;
  };
};
/** Runtime metadata used to trace an agent tool back to its owning plugin registration. */
type PluginToolMeta = {
  pluginId: string;
  kind?: PluginManifestRecord["kind"];
  optional: boolean;
  replaySafe?: boolean;
  sideEffecting?: boolean;
  trustedLocalMedia?: boolean;
  mcp?: PluginToolMcpMeta;
};
/** Reads plugin ownership metadata for a concrete agent tool instance. */
declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
/** Binds a side-effect declaration to the concrete plugin tool that owns it. */
declare function getPluginToolSideEffectOwnerKey(tool: AnyAgentTool): string | undefined;
//#endregion
export { McpCodexToolAnnotations as i, getPluginToolMeta as n, getPluginToolSideEffectOwnerKey as r, PluginToolMcpMeta as t };