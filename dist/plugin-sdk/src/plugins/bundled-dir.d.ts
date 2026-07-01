/** Diagnostic emitted when source-checkout bundled plugins lack dependency installs. */
export type SourceCheckoutDependencyDiagnostic = {
    source: string;
    message: string;
};
/** Returns true when env disables bundled plugin discovery. */
export declare function areBundledPluginsDisabled(env?: NodeJS.ProcessEnv): boolean;
export declare function resolveSourceCheckoutDependencyDiagnostic(env?: NodeJS.ProcessEnv): SourceCheckoutDependencyDiagnostic | null;
export declare function resolveBundledPluginsDir(env?: NodeJS.ProcessEnv): string | undefined;
export declare function setBundledPluginsDirOverrideForTest(dir: string | undefined): void;
