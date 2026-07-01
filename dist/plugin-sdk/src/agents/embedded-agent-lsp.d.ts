/**
 * Loads bundle-provided LSP server config for embedded-agent sessions.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { BundleLspServerConfig } from "../plugins/bundle-lsp.js";
type EmbeddedAgentLspConfig = {
    lspServers: Record<string, BundleLspServerConfig>;
    diagnostics: Array<{
        pluginId: string;
        message: string;
    }>;
};
/** Resolve enabled embedded-agent LSP servers and diagnostics. */
export declare function loadEmbeddedAgentLspConfig(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
}): EmbeddedAgentLspConfig;
export {};
