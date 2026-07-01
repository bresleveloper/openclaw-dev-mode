type EnvVarSanitizationResult = {
    allowed: Record<string, string>;
    blocked: string[];
    warnings: string[];
};
export type EnvSanitizationOptions = {
    strictMode?: boolean;
    customBlockedPatterns?: ReadonlyArray<RegExp>;
    customAllowedPatterns?: ReadonlyArray<RegExp>;
};
/** Returns a warning or block reason for environment values that look unsafe to forward. */
export declare function validateEnvVarValue(value: string): string | undefined;
/** Sanitizes inherited environment variables for automatic sandbox propagation. */
export declare function sanitizeEnvVars(envVars: Record<string, string | undefined>, options?: EnvSanitizationOptions): EnvVarSanitizationResult;
/** Sanitizes env vars explicitly requested by config, preserving names but still validating values. */
export declare function sanitizeExplicitSandboxEnvVars(envVars: Record<string, string | undefined>): EnvVarSanitizationResult;
export {};
