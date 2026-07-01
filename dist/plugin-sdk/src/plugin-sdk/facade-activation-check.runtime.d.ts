import type { OpenClawConfig } from "../config/types.js";
import { createPluginActivationSource, normalizePluginsConfig } from "../plugins/config-state.js";
import { type PluginManifestRecord } from "../plugins/manifest-registry.js";
/** Minimal manifest shape needed to decide whether a bundled facade may load. */
export type FacadePluginManifestLike = Pick<PluginManifestRecord, "id" | "origin" | "enabledByDefault" | "enabledByDefaultOnPlatforms" | "rootDir" | "channels">;
type FacadeModuleLocation = {
    modulePath: string;
    boundaryRoot: string;
};
/** Resolves the concrete plugin module location recorded in the manifest registry. */
export declare function resolveRegistryPluginModuleLocation(params: {
    dirName: string;
    artifactBasename: string;
    resolutionKey: string;
    env?: NodeJS.ProcessEnv;
}): FacadeModuleLocation | null;
/** Resolves the stable plugin id used for telemetry and error reporting. */
export declare function resolveTrackedFacadePluginId(params: {
    dirName: string;
    artifactBasename: string;
    location: FacadeModuleLocation | null;
    sourceExtensionsRoot: string;
    resolutionKey: string;
    env?: NodeJS.ProcessEnv;
}): string;
/** Evaluates whether a bundled plugin's api/runtime-api facade is currently enabled. */
export declare function resolveBundledPluginPublicSurfaceAccess(params: {
    dirName: string;
    artifactBasename: string;
    location: FacadeModuleLocation | null;
    sourceExtensionsRoot: string;
    resolutionKey: string;
    env?: NodeJS.ProcessEnv;
}): {
    allowed: boolean;
    pluginId?: string;
    reason?: string;
};
/** Applies normalized config and default enablement rules to one bundled manifest. */
export declare function evaluateBundledPluginPublicSurfaceAccess(params: {
    params: {
        dirName: string;
        artifactBasename: string;
    };
    manifestRecord: FacadePluginManifestLike;
    config: OpenClawConfig;
    normalizedPluginsConfig: ReturnType<typeof normalizePluginsConfig>;
    activationSource: ReturnType<typeof createPluginActivationSource>;
    autoEnabledReasons: Record<string, string[]>;
}): {
    allowed: boolean;
    pluginId?: string;
    reason?: string;
};
/** Throws the public error used when a disabled bundled plugin facade is imported. */
export declare function throwForBundledPluginPublicSurfaceAccess(params: {
    access: {
        allowed: boolean;
        pluginId?: string;
        reason?: string;
    };
    request: {
        dirName: string;
        artifactBasename: string;
    };
}): never;
/** Resolves bundled facade access and throws unless the facade is allowed to load. */
export declare function resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(params: {
    dirName: string;
    artifactBasename: string;
    location: FacadeModuleLocation | null;
    sourceExtensionsRoot: string;
    resolutionKey: string;
    env?: NodeJS.ProcessEnv;
}): {
    allowed: boolean;
    pluginId?: string;
    reason?: string;
};
export {};
