import { type LegacySandboxRegistryInspection } from "../agents/sandbox/registry.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { HealthFinding, HealthRepairEffect } from "../flows/health-checks.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
/**
 * Checks configured sandbox images and optionally runs repo build scripts for missing defaults.
 *
 * Non-Docker backends skip Docker image checks; Docker mode also probes Codex bwrap namespace
 * support because nested app-server shells rely on host user/network namespace policy.
 */
export declare function maybeRepairSandboxImages(cfg: OpenClawConfig, runtime: RuntimeEnv, prompter: DoctorPrompter): Promise<OpenClawConfig>;
export declare function detectLegacySandboxRegistryFileIssues(): Promise<readonly LegacySandboxRegistryInspection[]>;
export declare function legacySandboxRegistryInspectionToHealthFinding(file: LegacySandboxRegistryInspection): HealthFinding;
export declare function legacySandboxRegistryInspectionToRepairEffect(file: LegacySandboxRegistryInspection): HealthRepairEffect;
/** Migrates legacy sandbox registry files and directories. */
export declare function maybeRepairSandboxRegistryFiles(prompter: DoctorPrompter): Promise<void>;
/** Warns when agent sandbox overrides are ignored because sandbox scope resolves to shared. */
export declare function noteSandboxScopeWarnings(cfg: OpenClawConfig): void;
