import type { HealthFinding, HealthRepairEffect } from "../flows/health-checks.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
export type UiProtocolFreshnessIssue = {
    readonly kind: "missing-assets";
    readonly root: string;
    readonly uiIndexPath: string;
    readonly canBuild: boolean;
} | {
    readonly kind: "stale-assets";
    readonly root: string;
    readonly uiIndexPath: string;
    readonly changesSinceBuild: readonly string[];
    readonly canBuild: boolean;
};
/** Detects missing or stale Control UI build artifacts relative to protocol schema changes. */
export declare function detectUiProtocolFreshnessIssues(opts?: {
    readonly root?: string;
    readonly argv1?: string;
    readonly cwd?: string;
    readonly collectChangesSinceBuild?: (root: string, uiMtime: Date) => Promise<readonly string[] | null>;
}): Promise<readonly UiProtocolFreshnessIssue[]>;
/** Converts a UI protocol freshness issue into a doctor lint health finding. */
export declare function uiProtocolFreshnessIssueToHealthFinding(issue: UiProtocolFreshnessIssue): HealthFinding;
/** Converts a UI freshness issue into the process repair effect used by lint dry runs. */
export declare function uiProtocolFreshnessIssueToRepairEffects(issue: UiProtocolFreshnessIssue): readonly HealthRepairEffect[];
/** Prompts to build or rebuild Control UI assets when doctor detects missing or stale output. */
export declare function maybeRepairUiProtocolFreshness(_runtime: RuntimeEnv, prompter: DoctorPrompter): Promise<void>;
