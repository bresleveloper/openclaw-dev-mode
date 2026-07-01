/**
 * Shell command plans for sandbox filesystem bridge operations.
 *
 * Plans carry path-safety checks alongside the command so rechecks and execution stay coupled.
 */
import type { AnchoredSandboxEntry, PathSafetyCheck } from "./fs-bridge-path-safety.js";
import type { SandboxResolvedFsPath } from "./fs-paths.js";
export type SandboxFsCommandPlan = {
    checks: PathSafetyCheck[];
    script: string;
    args?: string[];
    stdin?: Buffer | string;
    recheckBeforeCommand?: boolean;
    allowFailure?: boolean;
};
/** Builds a stat command that anchors the path at its canonical parent before reading metadata. */
export declare function buildStatPlan(target: SandboxResolvedFsPath, anchoredTarget: AnchoredSandboxEntry): SandboxFsCommandPlan;
