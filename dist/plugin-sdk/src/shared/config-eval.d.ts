/** Normalizes primitive config values into the truthiness rules used by requirements checks. */
export declare function isTruthy(value: unknown): boolean;
/** Resolves dotted config paths, tolerating extra dots and missing branches. */
export declare function resolveConfigPath(config: unknown, pathStr: string): unknown;
/** Checks a config path with fallback defaults only when the path is unresolved. */
export declare function isConfigPathTruthyWithDefaults(config: unknown, pathStr: string, defaults: Record<string, boolean>): boolean;
type RuntimeRequires = {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
};
type RuntimeRequirementEvalParams = {
    requires?: RuntimeRequires;
    hasBin: (bin: string) => boolean;
    hasAnyRemoteBin?: (bins: string[]) => boolean;
    hasRemoteBin?: (bin: string) => boolean;
    hasEnv: (envName: string) => boolean;
    isConfigPathTruthy: (pathStr: string) => boolean;
};
/** Evaluates binary/env/config requirements against local and optional remote capabilities. */
export declare function evaluateRuntimeRequires(params: RuntimeRequirementEvalParams): boolean;
/** Evaluates OS gating and runtime requirements for skill/plugin entry eligibility. */
export declare function evaluateRuntimeEligibility(params: {
    os?: string[];
    remotePlatforms?: string[];
    always?: boolean;
} & RuntimeRequirementEvalParams): boolean;
/** Returns the current Node runtime platform used by eligibility checks. */
export declare function resolveRuntimePlatform(): string;
/** Checks PATH for an executable binary, including PATHEXT candidates on Windows. */
export declare function hasBinary(bin: string): boolean;
export {};
