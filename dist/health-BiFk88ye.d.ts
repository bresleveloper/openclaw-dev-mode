import "./config-contracts-hzlacViZ.js";
import { n as ConfigValidationIssue, r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
import "./manifest-registry-CNNq5Vj2.js";
import "./index-DSy-_0fC.js";
import "./sessions-row-09BvoTD5.js";
import { n as RuntimeEnv } from "./runtime-C7vMCRi6.js";
import "./database-port-recovery-0AsyALgu.js";
import { z } from "zod";
import "@clack/prompts";
type HealthFindingSeverity = "info" | "warning" | "error";
declare function parseHealthFindingSeverity(input: string | undefined): HealthFindingSeverity | null;
declare function healthFindingMeetsSeverity(finding: Pick<HealthFinding, "severity">, severityMin: HealthFindingSeverity): boolean;
interface HealthFinding {
  readonly checkId: string;
  readonly severity: HealthFindingSeverity;
  readonly message: string;
  /** Operator urgency is independent of diagnostic severity. */
  readonly category?: "fix-now" | "recommended" | "historical";
  readonly docsUrl?: string;
  readonly source?: string;
  readonly errorCode?: string;
  readonly path?: string;
  readonly line?: number;
  readonly column?: number;
  readonly ocPath?: string;
  readonly target?: string;
  readonly requirement?: string;
  readonly fixHint?: string;
  /** Structured, secret-free observations for operator JSON reports. */
  readonly details?: Record<string, unknown>;
}
type HealthCheckMode = "doctor" | "lint" | "fix";
interface HealthCheckContext {
  readonly mode: HealthCheckMode;
  readonly runtime: RuntimeEnv;
  readonly cfg: OpenClawConfig;
  readonly env?: NodeJS.ProcessEnv;
  readonly cwd?: string;
  readonly configPath?: string;
  readonly allowExecSecretRefs?: boolean;
}
interface HealthRepairContext extends Omit<HealthCheckContext, "mode"> {
  readonly mode: "fix";
  readonly dryRun?: boolean;
  readonly diff?: boolean;
}
interface HealthRepairDiff {
  readonly kind: "config" | "file";
  readonly path: string;
  readonly before?: string;
  readonly after?: string;
  readonly unifiedDiff?: string;
}
interface HealthRepairEffect {
  readonly kind: "config" | "file" | "service" | "process" | "package" | "state" | "other";
  readonly action: string;
  readonly target?: string;
  readonly dryRunSafe?: boolean;
}
interface HealthRepairResult {
  readonly status?: "repaired" | "skipped" | "failed";
  readonly reason?: string;
  readonly config?: OpenClawConfig;
  readonly changes: readonly string[];
  readonly warnings?: readonly string[];
  readonly diffs?: readonly HealthRepairDiff[];
  readonly effects?: readonly HealthRepairEffect[];
}
/** Narrow validation scope built from previous findings after a repair runs. */
interface HealthCheckScope {
  readonly findings?: readonly HealthFinding[];
  readonly paths?: readonly string[];
  readonly ocPaths?: readonly string[];
}
interface HealthCheck {
  readonly id: string;
  readonly kind: "core" | "plugin";
  readonly description: string;
  readonly source?: string;
  detect(ctx: HealthCheckContext, scope?: HealthCheckScope): Promise<readonly HealthFinding[]>;
  repair?(ctx: HealthRepairContext, findings: readonly HealthFinding[]): Promise<HealthRepairResult>;
}
declare function configValidationIssuesToHealthFindings(issues: readonly ConfigValidationIssue[]): readonly HealthFinding[];
interface DoctorLintRunOptions {
  readonly checks?: readonly HealthCheck[];
  readonly skipIds?: ReadonlySet<string> | readonly string[];
  readonly onlyIds?: ReadonlySet<string> | readonly string[];
  readonly includeAllChecks?: boolean;
}
interface DoctorLintRunResult {
  readonly findings: readonly HealthFinding[];
  readonly checksRun: number;
  readonly checksSkipped: number;
}
/** Runs selected health checks in lint mode and returns sorted findings. */
declare function runDoctorLintChecks(ctx: HealthCheckContext, opts?: DoctorLintRunOptions): Promise<DoctorLintRunResult>;
/** Converts findings to a process exit code using the requested minimum severity. */
declare function exitCodeFromFindings(findings: readonly HealthFinding[], severityMin?: HealthFindingSeverity): 0 | 1;
declare function registerHealthCheck(check: HealthCheck): void;
/** Returns registered checks in insertion order for deterministic doctor output. */
declare function listHealthChecks(): readonly HealthCheck[];
declare function getHealthCheck(id: string): HealthCheck | undefined;
export { healthFindingMeetsSeverity as _, exitCodeFromFindings as a, HealthCheck as c, HealthFinding as d, HealthFindingSeverity as f, HealthRepairResult as g, HealthRepairEffect as h, DoctorLintRunOptions as i, HealthCheckContext as l, HealthRepairDiff as m, listHealthChecks as n, runDoctorLintChecks as o, HealthRepairContext as p, registerHealthCheck as r, configValidationIssuesToHealthFindings as s, getHealthCheck as t, HealthCheckScope as u, parseHealthFindingSeverity as v };