/** Env var containing JSON plugin install override specs. */
export declare const PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_PLUGIN_INSTALL_OVERRIDES";
/** Env var gate that must be enabled before install overrides are honored. */
export declare const ALLOW_PLUGIN_INSTALL_OVERRIDES_ENV = "OPENCLAW_ALLOW_PLUGIN_INSTALL_OVERRIDES";
/** Parsed plugin install override for tests and maintainer repair flows. */
export type PluginInstallOverride = {
    kind: "npm";
    spec: string;
} | {
    kind: "npm-pack";
    archivePath: string;
};
/** Resolves a gated plugin install override from environment configuration. */
export declare function resolvePluginInstallOverride(params: {
    pluginId: string;
    env?: NodeJS.ProcessEnv;
}): PluginInstallOverride | null;
