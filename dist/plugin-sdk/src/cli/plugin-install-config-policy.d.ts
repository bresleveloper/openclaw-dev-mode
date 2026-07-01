import type { Command } from "commander";
type PluginInstallInvalidConfigPolicy = "deny" | "allow-plugin-recovery";
/** Parsed install request plus recovery metadata needed by CLI pre-action config policy. */
export type PluginInstallRequestContext = {
    rawSpec: string;
    normalizedSpec: string;
    installKind?: "plugin";
    resolvedPath?: string;
    marketplace?: string;
    bundledPluginId?: string;
    allowInvalidConfigRecovery?: boolean;
};
type PluginInstallRequestResolution = {
    ok: true;
    request: PluginInstallRequestContext;
} | {
    ok: false;
    error: string;
};
/** Resolve install metadata from the raw spec before Commander action handlers mutate config. */
export declare function resolvePluginInstallRequestContext(params: {
    rawSpec: string;
    marketplace?: string;
    installKind?: "plugin";
}): PluginInstallRequestResolution;
/** Recover the plugin install request from Commander state plus raw argv fallback parsing. */
export declare function resolvePluginInstallPreactionRequest(params: {
    actionCommand: Command;
    commandPath: string[];
    argv: string[];
}): PluginInstallRequestContext | null;
/** Decide whether invalid config should block a command before plugin recovery can run. */
export declare function resolvePluginInstallInvalidConfigPolicy(request: PluginInstallRequestContext | null): PluginInstallInvalidConfigPolicy;
export {};
