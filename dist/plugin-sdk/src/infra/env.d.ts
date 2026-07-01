type AcceptedEnvOption = {
    key: string;
    description: string;
    value?: string;
    redact?: boolean;
};
/** Logs an accepted env option once, with optional redaction for sensitive values. */
export declare function logAcceptedEnvOption(option: AcceptedEnvOption): void;
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
export declare function normalizeZaiEnv(env?: NodeJS.ProcessEnv): void;
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
export declare function expandEnvNormalizationKeys(keys: Iterable<string>): Set<string>;
/** Resolves one env key to its canonical-first runtime normalization group. */
export declare function resolveEnvNormalizationKeys(key: string): readonly string[];
/** Interprets common human/operator truthy env strings. */
export declare function isTruthyEnvValue(value?: string): boolean;
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
export declare function isVitestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
/** Applies process-wide env normalization before runtime configuration is read. */
export declare function normalizeEnv(): void;
export {};
