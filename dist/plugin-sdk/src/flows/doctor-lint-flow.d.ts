import { type HealthCheck, type HealthCheckContext, type HealthFinding, type HealthFindingSeverity } from "./health-checks.js";
export interface DoctorLintRunOptions {
    readonly checks?: readonly HealthCheck[];
    readonly skipIds?: ReadonlySet<string> | readonly string[];
    readonly onlyIds?: ReadonlySet<string> | readonly string[];
}
export interface DoctorLintRunResult {
    readonly findings: readonly HealthFinding[];
    readonly checksRun: number;
    readonly checksSkipped: number;
}
/** Runs selected health checks in lint mode and returns sorted findings. */
export declare function runDoctorLintChecks(ctx: HealthCheckContext, opts?: DoctorLintRunOptions): Promise<DoctorLintRunResult>;
/** Converts findings to a process exit code using the requested minimum severity. */
export declare function exitCodeFromFindings(findings: readonly HealthFinding[], severityMin?: HealthFindingSeverity): 0 | 1;
