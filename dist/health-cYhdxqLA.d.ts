import { M as OpenClawConfig, j as ConfigValidationIssue } from "./types-D7I_F5Ux.js";
import "./config-contracts-CY87ANNp.js";
import "./index-8f56f6LD.js";
import "./manifest-registry-DcAsDGQ5.js";
import { n as RuntimeEnv } from "./runtime-M_jncu14.js";
import "./plugin-metadata-snapshot-C_ou8VB5.js";
import "./config-S5Zm-Svf.js";
import "./database-port-recovery-Bqi8HAkj.js";
import "./dreaming-D2Tdqt2p.js";
import "./memory-core-host-engine-embeddings-BSewlUJd.js";
import "./plugin-state-runtime-cWC3lBJR.js";
import "@clack/prompts";
//#region src/flows/health-checks.d.ts
type HealthFindingSeverity = "info" | "warning" | "error";
declare function parseHealthFindingSeverity(input: string | undefined): HealthFindingSeverity | null;
declare function healthFindingMeetsSeverity(finding: Pick<HealthFinding, "severity">, severityMin: HealthFindingSeverity): boolean;
interface HealthFinding {
  readonly checkId: string;
  readonly severity: HealthFindingSeverity;
  readonly message: string;
  readonly source?: string;
  readonly errorCode?: string;
  readonly path?: string;
  readonly line?: number;
  readonly column?: number;
  readonly ocPath?: string;
  readonly target?: string;
  readonly requirement?: string;
  readonly fixHint?: string;
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
//#endregion
//#region src/flows/doctor-config-validation-findings.d.ts
declare function configValidationIssuesToHealthFindings(issues: readonly ConfigValidationIssue[]): readonly HealthFinding[];
//#endregion
//#region src/flows/doctor-lint-flow.d.ts
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
//#endregion
//#region src/flows/health-check-registry.d.ts
declare function registerHealthCheck(check: HealthCheck): void;
/** Returns registered checks in insertion order for deterministic doctor output. */
declare function listHealthChecks(): readonly HealthCheck[];
declare function getHealthCheck(id: string): HealthCheck | undefined;
//#endregion
export { healthFindingMeetsSeverity as _, exitCodeFromFindings as a, HealthCheck as c, HealthFinding as d, HealthFindingSeverity as f, HealthRepairResult as g, HealthRepairEffect as h, DoctorLintRunOptions as i, HealthCheckContext as l, HealthRepairDiff as m, listHealthChecks as n, runDoctorLintChecks as o, HealthRepairContext as p, registerHealthCheck as r, configValidationIssuesToHealthFindings as s, getHealthCheck as t, HealthCheckScope as u, parseHealthFindingSeverity as v };