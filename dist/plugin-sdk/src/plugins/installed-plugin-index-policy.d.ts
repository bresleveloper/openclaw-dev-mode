import type { OpenClawConfig } from "../config/types.js";
/** Hashes plugin compat registry state that can affect installed index validity. */
export declare function resolveCompatRegistryVersion(): string;
/** Hashes config policy inputs that can change installed plugin activation. */
export declare function resolveInstalledPluginIndexPolicyHash(config: OpenClawConfig | undefined): string;
