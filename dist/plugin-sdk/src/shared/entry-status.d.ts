import { type RequirementConfigCheck, type RequirementRemote, type Requirements, type RequirementsMetadata } from "./requirements.js";
type EntryMetadataRequirementsParams = Parameters<typeof evaluateEntryMetadataRequirements>[0];
/** Resolves entry presentation metadata and requirement eligibility in one shared shape. */
export declare function evaluateEntryMetadataRequirements(params: {
    always: boolean;
    metadata?: (RequirementsMetadata & {
        emoji?: string;
        homepage?: string;
    }) | null;
    frontmatter?: {
        emoji?: string;
        homepage?: string;
        website?: string;
        url?: string;
    } | null;
    hasLocalBin: (bin: string) => boolean;
    localPlatform: string;
    remote?: RequirementRemote;
    isEnvSatisfied: (envName: string) => boolean;
    isConfigSatisfied: (pathStr: string) => boolean;
}): {
    emoji?: string;
    homepage?: string;
    required: Requirements;
    missing: Requirements;
    requirementsSatisfied: boolean;
    configChecks: RequirementConfigCheck[];
};
/** Evaluates entry metadata requirements against the current Node platform. */
export declare function evaluateEntryMetadataRequirementsForCurrentPlatform(params: Omit<EntryMetadataRequirementsParams, "localPlatform">): ReturnType<typeof evaluateEntryMetadataRequirements>;
/** Evaluates an entry object's metadata/frontmatter requirements on the current platform. */
export declare function evaluateEntryRequirementsForCurrentPlatform(params: {
    always: boolean;
    entry: {
        metadata?: (RequirementsMetadata & {
            emoji?: string;
            homepage?: string;
        }) | null;
        frontmatter?: {
            emoji?: string;
            homepage?: string;
            website?: string;
            url?: string;
        } | null;
    };
    hasLocalBin: (bin: string) => boolean;
    remote?: RequirementRemote;
    isEnvSatisfied: (envName: string) => boolean;
    isConfigSatisfied: (pathStr: string) => boolean;
}): ReturnType<typeof evaluateEntryMetadataRequirements>;
export {};
