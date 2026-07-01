/** All declared SDK entrypoints, including public, deprecated, and local-only subpaths. */
export declare const pluginSdkEntrypoints: string[];
/** SDK subpaths without the root `openclaw/plugin-sdk` barrel entry. */
export declare const pluginSdkSubpaths: string[];
/** Entrypoints reserved for local repo/runtime checks and excluded from package exports. */
export declare const privateLocalOnlyPluginSdkEntrypoints: string[];
/** Entrypoints exported by the published package for third-party plugin imports. */
export declare const publicPluginSdkEntrypoints: string[];
/** Published SDK subpaths, excluding the root barrel. */
export declare const publicPluginSdkSubpaths: string[];
/** Public SDK subpaths that remain importable but are marked deprecated in docs/contracts. */
export declare const deprecatedPublicPluginSdkEntrypoints: string[];
/** Deprecated subpaths still re-exported by the root SDK barrel for compatibility. */
export declare const deprecatedBarrelPluginSdkEntrypoints: string[];
/**
 * Transitional compatibility/helper surfaces owned by their matching bundled plugin.
 *
 * Cross-owner extension imports are blocked by package contract guardrails.
 */
export declare const reservedBundledPluginSdkEntrypoints: readonly ["codex-mcp-projection"];
/**
 * Supported SDK facades backed by bundled plugins until generic contracts replace them.
 */
export declare const supportedBundledFacadeSdkEntrypoints: readonly ["discord", "lmstudio", "lmstudio-runtime", "matrix", "mattermost", "memory-core-engine-runtime", "provider-zai-endpoint", "qa-runner-runtime", "telegram-account", "tts-runtime", "zalouser"];
/** Plugin-owned surfaces intentionally public and documented for third-party plugins. */
export declare const publicPluginOwnedSdkEntrypoints: readonly ["browser-config", "image-generation-core", "memory-core", "memory-core-host-embedding-registry", "memory-core-host-engine-embeddings", "memory-core-host-engine-foundation", "memory-core-host-engine-qmd", "memory-core-host-engine-storage", "memory-core-host-events", "memory-core-host-multimodal", "memory-core-host-query", "memory-core-host-runtime-cli", "memory-core-host-runtime-core", "memory-core-host-runtime-files", "memory-core-host-secret", "memory-core-host-status", "memory-host-core", "memory-host-events", "memory-host-files", "memory-host-markdown", "memory-host-search", "memory-host-status", "speech-core", "telegram-command-config", "video-generation-core"];
/** Map every SDK entrypoint name to its source file path inside the repo. */
export declare function buildPluginSdkEntrySources(entries?: readonly string[]): {
    [k: string]: string;
};
/** Build the package.json exports map for public plugin SDK subpaths. */
export declare function buildPluginSdkPackageExports(): {
    [k: string]: {
        types: string;
        default: string;
    };
};
/** List the dist artifacts expected for every generated plugin SDK entrypoint. */
export declare function listPluginSdkDistArtifacts(): string[];
