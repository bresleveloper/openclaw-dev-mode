import type { PluginDiagnostic } from "./manifest-types.js";
import { type PackageManifest } from "./manifest.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
/** Validates package extension/setup entries before installing a plugin package. */
export declare function validatePackageExtensionEntriesForInstall(params: {
    packageDir: string;
    extensions: string[];
    manifest: PackageManifest;
    allowSourceTypeScriptEntries?: boolean;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
/** Resolves the runtime setup source for a plugin package manifest. */
export declare function resolvePackageSetupSource(params: {
    packageDir: string;
    packageRootRealPath?: string;
    manifest: PackageManifest | null;
    origin: PluginOrigin;
    requireBuiltRuntimeEntry?: boolean;
    sourceLabel: string;
    diagnostics: PluginDiagnostic[];
    rejectHardlinks?: boolean;
}): string | null;
/** Resolves runtime extension sources for a plugin package manifest. */
export declare function resolvePackageRuntimeExtensionSources(params: {
    packageDir: string;
    packageRootRealPath?: string;
    manifest: PackageManifest | null;
    extensions: readonly string[];
    origin: PluginOrigin;
    pluginIdHint?: string;
    requireBuiltRuntimeEntry?: boolean;
    sourceLabel: string;
    diagnostics: PluginDiagnostic[];
    rejectHardlinks?: boolean;
}): string[];
