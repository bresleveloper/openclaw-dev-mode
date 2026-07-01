import { type PluginModuleLoaderFactory } from "../plugins/plugin-module-loader-cache.js";
/** Create an object proxy that loads the underlying facade only on first property access. */
export declare function createLazyFacadeObjectValue<T extends object>(load: () => T): T;
/** Create an array proxy that loads the underlying facade only on first array access. */
export declare function createLazyFacadeArrayValue<T extends readonly unknown[]>(load: () => T): T;
/** Resolved public-surface module path plus the filesystem root it must stay within. */
export type FacadeModuleLocation = {
    modulePath: string;
    boundaryRoot: string;
};
/** Load and cache a facade module after verifying it is inside its declared boundary root. */
export declare function loadFacadeModuleAtLocationSync<T extends object>(params: {
    location: FacadeModuleLocation;
    trackedPluginId: string | (() => string);
    loadModule?: (modulePath: string) => T;
}): T;
/** Resolve and synchronously load a bundled plugin public surface by plugin dir and artifact name. */
export declare function loadBundledPluginPublicSurfaceModuleSync<T extends object>(params: {
    dirName: string;
    artifactBasename: string;
    trackedPluginId?: string | (() => string);
    env?: NodeJS.ProcessEnv;
}): T;
/** Resolve and asynchronously import a bundled plugin public surface with sync-loader fallback. */
export declare function loadBundledPluginPublicSurfaceModule<T extends object>(params: {
    dirName: string;
    artifactBasename: string;
    trackedPluginId?: string | (() => string);
}): Promise<T>;
/** List plugin ids whose public facades have been loaded in this process. */
export declare function listImportedBundledPluginFacadeIds(): string[];
/** Reset facade module caches and test loader overrides. */
export declare function resetFacadeLoaderStateForTest(): void;
/** Override source transform loader creation for facade-loader tests. */
export declare function setFacadeLoaderSourceTransformFactoryForTest(factory: PluginModuleLoaderFactory | undefined): void;
