/** Source directory that contains bundled plugin packages. */
export declare const BUNDLED_PLUGIN_ROOT_DIR = "extensions";
/** Repo-relative prefix for files inside bundled plugin packages. */
export declare const BUNDLED_PLUGIN_PATH_PREFIX = "extensions/";
/** Glob that matches bundled plugin test files in source checkouts. */
export declare const BUNDLED_PLUGIN_TEST_GLOB = "extensions/**/*.test.ts";
/** Return the repo-relative source root for a bundled plugin id. */
export declare function bundledPluginRoot(pluginId: string): string;
/** Return a repo-relative source file path inside a bundled plugin. */
export declare function bundledPluginFile(pluginId: string, relativePath: string): string;
/** Return a repo-relative source directory prefix inside a bundled plugin. */
export declare function bundledPluginDirPrefix(pluginId: string, relativeDir: string): string;
/** Return an absolute or caller-rooted bundled plugin source root. */
export declare function bundledPluginRootAt(baseDir: string, pluginId: string): string;
/** Return an absolute or caller-rooted bundled plugin source file path. */
export declare function bundledPluginFileAt(baseDir: string, pluginId: string, relativePath: string): string;
/** Return the repo-relative dist root for a bundled plugin id. */
export declare function bundledDistPluginRoot(pluginId: string): string;
/** Return a repo-relative dist file path inside a bundled plugin. */
export declare function bundledDistPluginFile(pluginId: string, relativePath: string): string;
/** Return an absolute or caller-rooted bundled plugin dist root. */
export declare function bundledDistPluginRootAt(baseDir: string, pluginId: string): string;
/** Return an absolute or caller-rooted bundled plugin dist file path. */
export declare function bundledDistPluginFileAt(baseDir: string, pluginId: string, relativePath: string): string;
/** Compatibility alias for installed bundled plugin roots under a package root. */
export declare function installedPluginRoot(baseDir: string, pluginId: string): string;
/** Return the local install spec used by tests for repo-owned bundled plugins. */
export declare function repoInstallSpec(pluginId: string): string;
