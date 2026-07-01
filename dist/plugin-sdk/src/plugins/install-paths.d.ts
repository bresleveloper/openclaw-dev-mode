/** Encodes arbitrary input as a safe plugin install filename. */
export declare function safePluginInstallFileName(input: string): string;
/** Encodes a plugin id for use as an install directory name. */
export declare function encodePluginInstallDirName(pluginId: string): string;
/** Validates a plugin id for install path safety. */
export declare function validatePluginId(pluginId: string): string | null;
/** Checks whether an installed plugin id matches the expected id, including old npm keying. */
export declare function matchesExpectedPluginId(params: {
    expectedPluginId?: string;
    pluginId: string;
    manifestPluginId?: string;
    npmPluginId: string;
}): boolean;
/** Resolves the default directory for path-installed plugin extensions. */
export declare function resolveDefaultPluginExtensionsDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the default directory for managed npm plugin installs. */
export declare function resolveDefaultPluginNpmDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Encodes an npm package name into a managed npm project directory name. */
export declare function encodePluginNpmProjectDirName(packageName: string): string;
/** Resolves the directory containing managed npm plugin projects. */
export declare function resolvePluginNpmProjectsDir(npmDir?: string): string;
/** Resolves the managed npm project directory for a package name. */
export declare function resolvePluginNpmProjectDir(params: {
    packageName: string;
    npmDir?: string;
}): string;
/** Resolves the managed npm artifact-generation project directory prefix for a package. */
export declare function resolvePluginNpmGenerationProjectDirPrefix(packageName: string): string;
/** Resolves an artifact-generation-specific managed npm project directory. */
export declare function resolvePluginNpmGenerationProjectDir(params: {
    packageName: string;
    generationKey: string;
    npmDir?: string;
}): string;
/** Resolves the installed node_modules package directory for a managed npm plugin. */
export declare function resolvePluginNpmPackageDir(params: {
    packageName: string;
    npmDir?: string;
}): string;
/** Resolves the default directory for git-installed plugins. */
export declare function resolveDefaultPluginGitDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the safe install directory for one plugin id. */
export declare function resolvePluginInstallDir(pluginId: string, extensionsDir?: string): string;
