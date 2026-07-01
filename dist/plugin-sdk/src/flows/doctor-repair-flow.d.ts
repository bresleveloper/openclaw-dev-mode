import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { HealthCheckInput } from "./health-check-runner-types.js";
import type { HealthFinding, HealthRepairContext, HealthRepairDiff, HealthRepairEffect } from "./health-checks.js";
export interface DoctorRepairRunOptions {
    readonly checks?: readonly HealthCheckInput[];
    readonly dryRun?: boolean;
    readonly diff?: boolean;
}
export interface DoctorRepairRunResult {
    readonly config: OpenClawConfig;
    readonly findings: readonly HealthFinding[];
    readonly remainingFindings: readonly HealthFinding[];
    readonly changes: readonly string[];
    readonly warnings: readonly string[];
    readonly diffs: readonly HealthRepairDiff[];
    readonly effects: readonly HealthRepairEffect[];
    readonly checksRun: number;
    readonly checksRepaired: number;
    readonly checksValidated: number;
}
/** Runs health checks in fix mode, applies repair outputs, and validates repaired scopes. */
export declare function runDoctorHealthRepairs(ctx: HealthRepairContext, opts?: DoctorRepairRunOptions): Promise<DoctorRepairRunResult>;
