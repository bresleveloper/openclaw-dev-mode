/** Minimal validation issue shape accepted from schema and mutation validation paths. */
type ConfigValidationIssueLike = {
    path: string;
    message: string;
};
/** Formats validation issues as terminal-safe bullet lines for config load failures. */
export declare function formatInvalidConfigDetails(issues: ConfigValidationIssueLike[]): string;
/** Builds the one-line invalid-config prefix plus preformatted validation details. */
export declare function formatInvalidConfigLogMessage(configPath: string, details: string): string;
/** Logs an invalid config message once per path during a load sequence. */
export declare function logInvalidConfigOnce(params: {
    configPath: string;
    details: string;
    logger: Pick<typeof console, "error">;
    loggedConfigPaths: Set<string>;
}): void;
/** Creates the tagged error shape used by callers that need details after catch. */
export declare function createInvalidConfigError(configPath: string, details: string): Error;
/** Logs and throws the standard invalid-config error for a validation result. */
export declare function throwInvalidConfig(params: {
    configPath: string;
    issues: ConfigValidationIssueLike[];
    logger: Pick<typeof console, "error">;
    loggedConfigPaths: Set<string>;
}): never;
export {};
