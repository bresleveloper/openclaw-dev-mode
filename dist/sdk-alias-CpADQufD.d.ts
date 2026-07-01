//#region src/plugins/sdk-alias.d.ts
type PluginSdkAliasCandidateKind = "dist" | "src";
type PluginSdkResolutionPreference = "auto" | "dist" | "src";
type LoaderModuleResolveParams = {
  modulePath?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
};
type PluginRuntimeModuleResolution = {
  modulePath?: string;
  packageRoot: string | null;
  candidates: string[];
  resolvedPath: string | null;
  error?: string;
};
type WorkspacePackageAliasEntry = {
  packageName: string;
  packageDir: string;
  subpath: string;
  srcFile: string;
  distFile: string;
};
declare function normalizeJitiAliasTargetPath(targetPath: string): string;
declare function resolvePluginLoaderJitiFsCacheDir(params?: LoaderModuleResolveParams): string;
declare function resolvePluginLoaderJitiFsCacheOption(params?: LoaderModuleResolveParams): false | string;
declare function resolveLoaderPackageRoot(params: LoaderModuleResolveParams & {
  modulePath: string;
}): string | null;
declare function resolvePluginSdkAliasCandidateOrder(params: {
  modulePath: string;
  isProduction: boolean;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): PluginSdkAliasCandidateKind[];
declare function listPluginSdkAliasCandidates(params: {
  srcFile: string;
  distFile: string;
  modulePath: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): string[];
declare function resolvePluginSdkAliasFile(params: {
  srcFile: string;
  distFile: string;
  modulePath?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): string | null;
declare function listWorkspacePackageExportAliasEntries(params: {
  packageRoot: string;
  packageName: string;
  packageDir: string;
}): WorkspacePackageAliasEntry[];
declare function listPluginSdkExportedSubpaths(params?: {
  modulePath?: string;
  argv1?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): string[];
declare function resolvePluginSdkScopedAliasMap(params?: {
  modulePath?: string;
  argv1?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): Record<string, string>;
declare function resolveExtensionApiAlias(params?: LoaderModuleResolveParams): string | null;
declare function buildPluginLoaderAliasMap(modulePath: string, argv1?: string | undefined, moduleUrl?: string, pluginSdkResolution?: PluginSdkResolutionPreference, devSourceRoot?: string | null): Record<string, string>;
declare function resolvePluginRuntimeModulePath(params?: LoaderModuleResolveParams): string | null;
declare function resolvePluginRuntimeModulePathWithDiagnostics(params?: LoaderModuleResolveParams): PluginRuntimeModuleResolution;
declare function buildPluginLoaderJitiOptions(aliasMap: Record<string, string>, params?: LoaderModuleResolveParams): {
  alias?: Record<string, string> | undefined;
  interopDefault: boolean;
  fsCache: string | false;
  tryNative: boolean;
  extensions: string[];
};
declare function shouldPreferNativeModuleLoad(modulePath: string): boolean;
declare function resolvePluginLoaderTryNative(modulePath: string, options?: {
  preferBuiltDist?: boolean;
}): boolean;
declare function createPluginLoaderModuleCacheKey(params: {
  tryNative: boolean;
  aliasMap: Record<string, string>;
}): string;
declare function resolvePluginLoaderModuleConfig(params: {
  modulePath: string;
  argv1?: string;
  moduleUrl: string;
  devSourceRoot?: string | null;
  preferBuiltDist?: boolean;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): {
  tryNative: boolean;
  aliasMap: Record<string, string>;
  cacheKey: string;
};
declare function isBundledPluginExtensionPath(params: {
  modulePath: string;
  openClawPackageRoot: string;
  bundledPluginsDir?: string;
}): boolean;
//#endregion
export { shouldPreferNativeModuleLoad as C, resolvePluginSdkScopedAliasMap as S, resolvePluginLoaderTryNative as _, buildPluginLoaderJitiOptions as a, resolvePluginSdkAliasCandidateOrder as b, listPluginSdkAliasCandidates as c, normalizeJitiAliasTargetPath as d, resolveExtensionApiAlias as f, resolvePluginLoaderModuleConfig as g, resolvePluginLoaderJitiFsCacheOption as h, buildPluginLoaderAliasMap as i, listPluginSdkExportedSubpaths as l, resolvePluginLoaderJitiFsCacheDir as m, PluginRuntimeModuleResolution as n, createPluginLoaderModuleCacheKey as o, resolveLoaderPackageRoot as p, PluginSdkResolutionPreference as r, isBundledPluginExtensionPath as s, LoaderModuleResolveParams as t, listWorkspacePackageExportAliasEntries as u, resolvePluginRuntimeModulePath as v, resolvePluginSdkAliasFile as x, resolvePluginRuntimeModulePathWithDiagnostics as y };