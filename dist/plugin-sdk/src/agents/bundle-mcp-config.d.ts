import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type BundleMcpConfig, type BundleMcpDiagnostic, type BundleMcpServerConfig } from "../plugins/bundle-mcp.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
type MergedBundleMcpConfig = {
    config: BundleMcpConfig;
    diagnostics: BundleMcpDiagnostic[];
};
type BundleMcpServerMapper = (server: BundleMcpServerConfig, name: string) => BundleMcpServerConfig;
/**
 * User config stores OpenClaw MCP transport names, while CLI backends such as
 * Claude Code and Gemini expect a downstream `type` field. Keep this adapter
 * out of the generic merge path because embedded OpenClaw still consumes the raw
 * OpenClaw `transport` shape directly.
 */
export declare function toCliBundleMcpServerConfig(server: BundleMcpServerConfig): BundleMcpServerConfig;
/** Loads enabled bundled MCP servers and overlays user config by server name. */
export declare function loadMergedBundleMcpConfig(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
    mapConfiguredServer?: BundleMcpServerMapper;
}): MergedBundleMcpConfig;
export {};
