import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export type ExecSafeBinCoverageHit = {
    /** Config scope that owns the safeBins entry. */
    scopePath: string;
    /** Normalized binary name from safeBins. */
    bin: string;
    /** Missing profile coverage or unsafe semantic shape detected by doctor. */
    kind: "missingProfile" | "riskySemantics";
    /** True when the missing profile belongs to an interpreter/runtime binary. */
    isInterpreter?: boolean;
    /** Risk explanation for risky semantic hits. */
    warning?: string;
};
export type ExecSafeBinTrustedDirHintHit = {
    /** Config scope that owns the safeBins entry. */
    scopePath: string;
    /** Binary name configured in safeBins. */
    bin: string;
    /** Resolved executable path outside trusted safe-bin directories. */
    resolvedPath: string;
};
/** Scan configured safeBins for missing profiles and risky low-friction entries. */
export declare function scanExecSafeBinCoverage(cfg: OpenClawConfig): ExecSafeBinCoverageHit[];
/** Scan configured safeBins that resolve outside trusted binary directories. */
export declare function scanExecSafeBinTrustedDirHints(cfg: OpenClawConfig): ExecSafeBinTrustedDirHintHit[];
/** Format doctor warnings for safeBins profile coverage and risky semantics. */
export declare function collectExecSafeBinCoverageWarnings(params: {
    hits: ExecSafeBinCoverageHit[];
    doctorFixCommand: string;
}): string[];
/** Format doctor warnings for safeBins resolved outside trusted directories. */
export declare function collectExecSafeBinTrustedDirHintWarnings(hits: ExecSafeBinTrustedDirHintHit[]): string[];
/** Scaffold missing custom safeBin profiles and warn on interpreter/risky entries. */
export declare function maybeRepairExecSafeBinProfiles(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
    warnings: string[];
};
