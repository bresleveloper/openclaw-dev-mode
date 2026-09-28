import { n as OpenClawConfig } from "./types.openclaw-BGrO5JfP.js";
import { m as RuntimeEnv } from "./config-Bk-rqMdT.js";
//#region src/flows/health-checks.d.ts
type HealthFindingSeverity = "info" | "warning" | "error";
/** Structured finding emitted by doctor health checks. */
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
/** Immutable runtime/config context passed to health check detection. */
interface HealthCheckContext {
  readonly mode: HealthCheckMode;
  readonly runtime: RuntimeEnv;
  readonly cfg: OpenClawConfig;
  readonly env?: NodeJS.ProcessEnv;
  readonly cwd?: string;
  readonly configPath?: string;
  readonly allowExecSecretRefs?: boolean;
}
/** Repair-capable health-check context; fixes may emit diffs or dry-run previews. */
interface HealthRepairContext extends Omit<HealthCheckContext, "mode"> {
  readonly mode: "fix";
  readonly dryRun?: boolean;
  readonly diff?: boolean;
}
/** Optional before/after detail for config or file repair output. */
interface HealthRepairDiff {
  readonly kind: "config" | "file";
  readonly path: string;
  readonly before?: string;
  readonly after?: string;
  readonly unifiedDiff?: string;
}
/** Side effect descriptor for repairs that touch services, processes, packages, or state. */
interface HealthRepairEffect {
  readonly kind: "config" | "file" | "service" | "process" | "package" | "state" | "other";
  readonly action: string;
  readonly target?: string;
  readonly dryRunSafe?: boolean;
}
/** Repair result returned by split health-check repair functions. */
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
/** Split detect/repair health-check contract registered by core or plugins. */
interface HealthCheck {
  readonly id: string;
  readonly kind: "core" | "plugin";
  readonly description: string;
  readonly source?: string;
  detect(ctx: HealthCheckContext, scope?: HealthCheckScope): Promise<readonly HealthFinding[]>;
  repair?(ctx: HealthRepairContext, findings: readonly HealthFinding[]): Promise<HealthRepairResult>;
}
//#endregion
export { HealthCheck as t };