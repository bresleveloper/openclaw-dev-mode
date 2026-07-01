import type { PluginOrigin } from "./plugin-origin.types.js";
/** Returns true when a plugin root resolves inside the immutable Nix store. */
export declare function isNixStorePluginRoot(rootDir: string, realpathCache?: Map<string, string>): boolean;
/** Decides whether plugin file hardlinks should fail boundary validation for one root. */
export declare function shouldRejectHardlinkedPluginFiles(params: {
    origin: PluginOrigin;
    rootDir: string;
    env?: NodeJS.ProcessEnv;
    realpathCache?: Map<string, string>;
}): boolean;
