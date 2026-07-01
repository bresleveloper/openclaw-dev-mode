/** True for file extensions Node can load through the native JS module loader. */
export declare function isJavaScriptModulePath(modulePath: string): boolean;
/** Attempts native require before falling back to source transform paths. */
export declare function tryNativeRequireJavaScriptModule(modulePath: string, options?: {
    allowWindows?: boolean;
    aliasMap?: Record<string, string>;
    fallbackOnMissingDependency?: boolean;
    fallbackOnNativeError?: boolean;
}): {
    ok: true;
    moduleExport: unknown;
} | {
    ok: false;
};
/** Clears a native-loaded module and dependency subtree under the plugin dependency root. */
export declare function clearNativeRequireJavaScriptModuleCache(modulePath: string, options?: {
    dependencyRoot?: string;
}): void;
/** Runs a native require block with temporary CJS/ESM alias hooks and restores both afterward. */
export declare function withNativeRequireAliases<T>(aliasMap: Record<string, string> | undefined, run: () => T): T;
