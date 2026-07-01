import { type FacadeModuleLocation } from "./facade-loader.js";
import { resolveRegistryPluginModuleLocationFromRecords } from "./facade-resolution-shared.js";
export { createLazyFacadeArrayValue, createLazyFacadeObjectValue, listImportedBundledPluginFacadeIds, } from "./facade-loader.js";
/** Create a lazy value/function proxy for one property of a facade module. */
export declare function createLazyFacadeValue<TFacade extends object, K extends keyof TFacade>(loadFacadeModule: () => TFacade, key: K): TFacade[K];
declare function resolveFacadeModuleLocation(params: {
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
}): {
    modulePath: string;
    boundaryRoot: string;
} | null;
type BundledPluginPublicSurfaceParams = {
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
};
type FacadeActivationCheckRuntimeModule = typeof import("./facade-activation-check.runtime.js");
declare function setFacadeActivationCheckRuntimeForTest(module: FacadeActivationCheckRuntimeModule): void;
declare function loadFacadeModuleAtLocationSync<T extends object>(params: {
    location: FacadeModuleLocation;
    trackedPluginId: string | (() => string);
    runtimeDeps?: {
        pluginId: string;
        env?: NodeJS.ProcessEnv;
    };
    loadModule?: (modulePath: string) => T;
}): T;
/** Load a bundled or registry-backed plugin public surface, tracking activation ownership. */
export declare function loadBundledPluginPublicSurfaceModuleSync<T extends object>(params: BundledPluginPublicSurfaceParams): T;
/** Check whether an activated bundled plugin public surface may be loaded. */
export declare function canLoadActivatedBundledPluginPublicSurface(params: {
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
/** Load an activated plugin public surface or throw when activation policy blocks access. */
export declare function loadActivatedBundledPluginPublicSurfaceModuleSync<T extends object>(params: {
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
}): T;
/** Load an activated plugin public surface, returning null when activation policy blocks access. */
export declare function tryLoadActivatedBundledPluginPublicSurfaceModuleSync<T extends object>(params: {
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
}): T | null;
/** Reset facade runtime caches and activation-check test overrides. */
export declare function resetFacadeRuntimeStateForTest(): void;
/** Test-only hooks for facade activation and resolution checks. */
export declare const testing: {
    setFacadeActivationCheckRuntimeForTest: typeof setFacadeActivationCheckRuntimeForTest;
    loadFacadeModuleAtLocationSync: typeof loadFacadeModuleAtLocationSync;
    resolveRegistryPluginModuleLocationFromRegistry: typeof resolveRegistryPluginModuleLocationFromRecords;
    resolveFacadeModuleLocation: typeof resolveFacadeModuleLocation;
    evaluateBundledPluginPublicSurfaceAccess: FacadeActivationCheckRuntimeModule["evaluateBundledPluginPublicSurfaceAccess"];
    throwForBundledPluginPublicSurfaceAccess: FacadeActivationCheckRuntimeModule["throwForBundledPluginPublicSurfaceAccess"];
    resolveActivatedBundledPluginPublicSurfaceAccessOrThrow: (params: BundledPluginPublicSurfaceParams) => {
        allowed: boolean;
        pluginId?: string;
        reason?: string;
    };
    resolveBundledPluginPublicSurfaceAccess: (params: BundledPluginPublicSurfaceParams) => {
        allowed: boolean;
        pluginId?: string;
        reason?: string;
    };
    resolveTrackedFacadePluginId: (params: BundledPluginPublicSurfaceParams) => string;
};
export { testing as __testing };
