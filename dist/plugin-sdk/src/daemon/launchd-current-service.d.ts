export type CurrentProcessLaunchdServiceLabelOptions = {
    allowConfiguredLabelFallback?: boolean;
};
/** Checks whether the current process appears to be running under the requested launchd label. */
export declare function isCurrentProcessLaunchdServiceLabel(label: string, env?: NodeJS.ProcessEnv, options?: CurrentProcessLaunchdServiceLabelOptions): boolean;
