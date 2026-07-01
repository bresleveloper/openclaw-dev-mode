export type Requirements = {
    bins: string[];
    anyBins: string[];
    env: string[];
    config: string[];
    os: string[];
};
export type RequirementConfigCheck = {
    path: string;
    satisfied: boolean;
};
export type RequirementsMetadata = {
    requires?: Partial<Pick<Requirements, "bins" | "anyBins" | "env" | "config">>;
    os?: string[];
};
export type RequirementRemote = {
    hasBin?: (bin: string) => boolean;
    hasAnyBin?: (bins: string[]) => boolean;
    platforms?: string[];
};
type RequirementsEvaluationContext = {
    always: boolean;
    hasLocalBin: (bin: string) => boolean;
    localPlatform: string;
    isEnvSatisfied: (envName: string) => boolean;
    isConfigSatisfied: (pathStr: string) => boolean;
};
type RequirementsEvaluationRemoteContext = {
    hasRemoteBin?: (bin: string) => boolean;
    hasRemoteAnyBin?: (bins: string[]) => boolean;
    remotePlatforms?: string[];
};
/** Returns required binaries absent from both the local host and optional remote target. */
export declare function resolveMissingBins(params: {
    required: string[];
    hasLocalBin: (bin: string) => boolean;
    hasRemoteBin?: (bin: string) => boolean;
}): string[];
/** Treats an any-bin requirement as satisfied when any listed binary exists locally or remotely. */
export declare function resolveMissingAnyBins(params: {
    required: string[];
    hasLocalBin: (bin: string) => boolean;
    hasRemoteAnyBin?: (bins: string[]) => boolean;
}): string[];
/** Resolves OS requirements against local and remote platforms, accepting macos as darwin. */
export declare function resolveMissingOs(params: {
    required: string[];
    localPlatform: string;
    remotePlatforms?: string[];
}): string[];
/** Returns environment variable names whose caller-provided satisfaction check fails. */
export declare function resolveMissingEnv(params: {
    required: string[];
    isSatisfied: (envName: string) => boolean;
}): string[];
/** Builds per-config-path status while preserving every declared path for UI diagnostics. */
export declare function buildConfigChecks(params: {
    required: string[];
    isSatisfied: (pathStr: string) => boolean;
}): RequirementConfigCheck[];
/** Evaluates normalized requirements and returns missing categories plus config diagnostics. */
export declare function evaluateRequirements(params: RequirementsEvaluationContext & RequirementsEvaluationRemoteContext & {
    required: Requirements;
}): {
    missing: Requirements;
    eligible: boolean;
    configChecks: RequirementConfigCheck[];
};
/** Converts entry metadata into the canonical requirement shape before evaluation. */
export declare function evaluateRequirementsFromMetadata(params: RequirementsEvaluationContext & RequirementsEvaluationRemoteContext & {
    metadata?: RequirementsMetadata;
}): {
    required: Requirements;
    missing: Requirements;
    eligible: boolean;
    configChecks: RequirementConfigCheck[];
};
/** Convenience wrapper for callers that receive remote capability checks as one object. */
export declare function evaluateRequirementsFromMetadataWithRemote(params: RequirementsEvaluationContext & {
    metadata?: RequirementsMetadata;
    remote?: RequirementRemote;
}): {
    required: Requirements;
    missing: Requirements;
    eligible: boolean;
    configChecks: RequirementConfigCheck[];
};
export {};
