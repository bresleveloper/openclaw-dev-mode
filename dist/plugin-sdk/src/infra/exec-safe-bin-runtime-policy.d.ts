import { type SafeBinProfile, type SafeBinProfileFixture, type SafeBinProfileFixtures } from "./exec-safe-bin-policy.js";
import { type WritableTrustedSafeBinDir } from "./exec-safe-bin-trust.js";
type ExecSafeBinConfigScope = {
    safeBins?: string[] | null;
    safeBinProfiles?: SafeBinProfileFixtures | null;
    safeBinTrustedDirs?: string[] | null;
};
/** Returns true for safeBins that can interpret scripts or execute broad embedded programs. */
export declare function isInterpreterLikeSafeBin(raw: string): boolean;
/** Lists normalized interpreter-like safeBins from a configured entry set. */
export declare function listInterpreterLikeSafeBins(entries: Iterable<string>): string[];
/** Merges global and local safe-bin profile fixtures, with local definitions winning. */
export declare function resolveMergedSafeBinProfileFixtures(params: {
    global?: ExecSafeBinConfigScope | null;
    local?: ExecSafeBinConfigScope | null;
}): Record<string, SafeBinProfileFixture> | undefined;
/** Resolves safe-bin names, profiles, trusted dirs, and warning metadata for exec evaluation. */
export declare function resolveExecSafeBinRuntimePolicy(params: {
    global?: ExecSafeBinConfigScope | null;
    local?: ExecSafeBinConfigScope | null;
    onWarning?: (message: string) => void;
}): {
    safeBins: Set<string>;
    safeBinProfiles: Readonly<Record<string, SafeBinProfile>>;
    trustedSafeBinDirs: ReadonlySet<string>;
    unprofiledSafeBins: string[];
    unprofiledInterpreterSafeBins: string[];
    writableTrustedSafeBinDirs: ReadonlyArray<WritableTrustedSafeBinDir>;
};
export {};
