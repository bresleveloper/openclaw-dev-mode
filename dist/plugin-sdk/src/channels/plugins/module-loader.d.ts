import { type PluginModuleLoaderFactory } from "../../plugins/plugin-module-loader-cache.js";
/**
 * Installs a test-only module loader factory for source channel plugin modules.
 */
export declare function setChannelPluginModuleLoaderFactoryForTest(factory?: PluginModuleLoaderFactory): void;
/**
 * Resolves a plugin-relative module specifier to an existing candidate path.
 */
export declare function resolveExistingPluginModulePath(rootDir: string, specifier: string): string;
/**
 * Loads a channel plugin module after enforcing plugin-root file boundaries.
 */
export declare function loadChannelPluginModule(params: {
    modulePath: string;
    rootDir: string;
    boundaryRootDir?: string;
    boundaryLabel?: string;
}): unknown;
