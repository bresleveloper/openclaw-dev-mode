// FIX-07 (dev-mode fork): the config-only part of `openclaw doctor --fix`, for
// `openclaw config validate --fix` (output: src/cli/config-validate-fix.ts).
//
// Runs three of doctor's own config stages, called the way loadAndMaybeMigrateDoctorConfig
// (src/commands/doctor-config-flow.ts) calls them, on the include/env-resolved config read
// from disk:
//   1. legacy migrations: addDoctorLegacyIssues -> applyLegacyCompatibilityStep
//   2. value-format repairs: normalizeCompatibilityConfigValues
//   3. unknown-key removal: stripUnknownConfigKeys + protectActiveAuthProfileConfig (the unknown-key
//      half of applyRetiredConfigStep; until 2026.11.3 it was applyUnknownConfigKeyStep)
// then writes the way doctor's write step does (runWriteConfigHealth in
// src/flows/doctor-health-contribution-runners.config.ts): restoreDoctorConfigEnvRefs puts the
// ${VAR} references back, transformConfigFile commits against the hash that was read.
// Nothing else from doctor --fix runs: no preflight or state migrations, no heartbeat retirement
// (applyRetiredConfigStep's other half, which writes the cron store: `agents.*.heartbeat` stays in
// the file, and a build that refuses it reports "still-invalid"), no agent-roster persistence, no
// plugin installs/auto-enable/pruning, no binding, Tailscale, auth, token, session-store or cron
// repairs. Unlike doctor, a candidate that fails validation is never written, and the writer's
// size-drop guard stays on. Must stay under src/commands/doctor/: only doctor may import the
// legacy migration modules (shared/legacy-config-write-ownership.test.ts).
//
// Agent roster: the reader materializes an implicit `agents.entries.main` placeholder when the
// file authors no roster (src/config/implicit-agent-roster.ts; sourceConfig carries it,
// sourceConfigBeforeMigrations does not), and for an invalid file the writer saves the candidate
// as-is. Doctor persists roster migrations with workspace pins first, so a real one (agents.list,
// default markers, a multi-agent roster without an ownership stamp) is skipped here and left to
// doctor; only the reader's placeholder is dropped before writing.
//
// Regression checklist after an upstream upgrade:
// - doctor-config-flow.ts: same stage functions, same arguments, same order (addDoctorLegacyIssues
//   and normalizeCompatibilityConfigValues are async since 2026.11.10)? Same unknown-key half in
//   applyRetiredConfigStep (config-flow-steps.ts)? Same rosterMigrationNeeded check
//   (LEGACY_AGENT_ROSTER_RULES + listAgentEntries on sourceConfigBeforeMigrations, ownership
//   stamp on the loaded config)? At 2026.11.10 doctor also treats an EMPTY roster as a migration
//   (`listAgentEntries(sourceRosterConfig).length === 0`); this file still lets such a file through
//   and drops the reader's placeholder.
// - runWriteConfigHealth: still restoreDoctorConfigEnvRefs + transformConfigFile?
// - io.snapshot.ts: still applies the implicit roster to sourceConfig only?
// - io.write.ts: still writes an invalid file's candidate as-is (roster tests in the test file)?
// - Run this file's test and src/cli/config-validate-fix.test.ts.
import { isDeepStrictEqual } from "node:util";
import { listAgentEntries } from "../../agents/agent-roster.js";
import { formatCliCommand } from "../../cli/command-format.js";
import { readConfigFileSnapshot, transformConfigFile } from "../../config/config.js";
import { INCLUDE_KEY } from "../../config/includes.js";
import { formatConfigIssueLines } from "../../config/issue-format.js";
import { findLegacyConfigRuleIssues } from "../../config/legacy.shared.js";
import type { ConfigValidationIssue, OpenClawConfig } from "../../config/types.js";
import { validateConfigObjectRawWithPlugins } from "../../config/validation.js";
import { formatErrorMessage } from "../../infra/errors.js";
import { isRecord } from "../../utils.js";
import { protectActiveAuthProfileConfig } from "../doctor-auth-profile-config.js";
import { stripUnknownConfigKeys } from "../doctor-config-analysis.js";
import {
  applyLegacyCompatibilityStep,
  prepareDoctorConfigReferenceSource,
  restoreDoctorConfigEnvRefs,
} from "./shared/config-flow-steps.js";
import {
  applyDoctorConfigMutation,
  type DoctorConfigMutationState,
} from "./shared/config-mutation-state.js";
import { containsAuthoredInclude } from "./shared/include-migration-ownership.js";
import { normalizeCompatibilityConfigValues } from "./shared/legacy-config-core-migrate.js";
import { addDoctorLegacyIssues } from "./shared/legacy-config-issues.js";
import { LEGACY_AGENT_ROSTER_RULES } from "./shared/legacy-config-migrations.runtime.entries.js";
import { collectBlockedLegacyOpenAICodexProviderPlan } from "./shared/legacy-config-migrations.runtime.models.js";

export type ConfigContentFixStatus =
  | "skipped"
  | "unchanged"
  | "would-fix"
  | "fixed"
  | "still-invalid"
  | "write-failed";

export type ConfigContentFixReport = {
  status: ConfigContentFixStatus;
  path: string;
  /** Doctor's change lines, in stage order. */
  changes: string[];
  /** Doctor's advisories that changed nothing. */
  warnings: string[];
  /** Validation issues the repairs leave behind ("still-invalid"). */
  issues: ConfigValidationIssue[];
  /** Why nothing was attempted ("skipped"). */
  reason?: string;
  /** The writer's refusal or failure ("write-failed"). */
  error?: string;
};

/** Drop the reader's implicit `agents.entries.main` placeholder unless a repair changed it. */
function withoutImplicitMainRoster(config: OpenClawConfig, authored: unknown): OpenClawConfig {
  const { entries, ...agents } = config.agents ?? {};
  if (!isDeepStrictEqual(entries, { main: {} })) {
    return config;
  }
  const authoredAgents = isRecord(authored) ? authored.agents : undefined;
  if (isRecord(authoredAgents) && Object.hasOwn(authoredAgents, "entries")) {
    // An authored empty roster stays empty.
    return { ...config, agents: { ...agents, entries: {} } };
  }
  if (authoredAgents === undefined && Object.keys(agents).length === 0) {
    const { agents: _agents, ...rest } = config;
    return rest;
  }
  return { ...config, agents };
}

/** Apply doctor's config-content repairs to openclaw.json, or preview them with dryRun. */
export async function fixConfigContent(
  params: { dryRun?: boolean; skipOutputLogs?: boolean } = {},
): Promise<ConfigContentFixReport> {
  const read = await readConfigFileSnapshot({ observe: false });
  const report = { path: read.path, changes: [], warnings: [], issues: [] };
  const doctorFixCommand = formatCliCommand("openclaw doctor --fix");
  if (!read.exists) {
    return { ...report, status: "skipped", reason: "config file not found" };
  }
  if (containsAuthoredInclude(read.parsed)) {
    return {
      ...report,
      status: "skipped",
      reason: `config uses ${INCLUDE_KEY}; run ${doctorFixCommand} instead`,
    };
  }
  // Without the authored/resolved pair doctor cannot restore ${VAR} references on write.
  const referenceSource = prepareDoctorConfigReferenceSource(read);
  if (!referenceSource) {
    const detail = read.issues[0]?.message;
    return {
      ...report,
      status: "skipped",
      reason: `config file could not be read${detail ? ` (${detail})` : ""}`,
    };
  }
  // Doctor's rosterMigrationNeeded check. A legacy roster or a multi-agent roster without an
  // ownership stamp is doctor's one-time migration; a file with no roster at all only carries
  // the reader's implicit-main placeholder, which has no diagnostics.
  const sourceRosterConfig = read.sourceConfigBeforeMigrations ?? read.sourceConfig;
  const rosterDiagnostics = [
    ...new Set(
      findLegacyConfigRuleIssues(sourceRosterConfig, LEGACY_AGENT_ROSTER_RULES).map(
        (issue) => issue.message,
      ),
    ),
  ];
  if (
    read.sourceConfig.agents?.ownership === undefined &&
    listAgentEntries(read.sourceConfig).length > 1
  ) {
    rosterDiagnostics.push("The multi-agent roster needs explicit per-surface ownership.");
  }
  if (rosterDiagnostics.length > 0) {
    return {
      ...report,
      status: "skipped",
      reason: `the agent roster needs doctor's one-time migration (${rosterDiagnostics.join(" ")}); run ${doctorFixCommand}`,
    };
  }
  const implicitMainRoster = listAgentEntries(sourceRosterConfig).length === 0;

  const snapshot = await addDoctorLegacyIssues(read);
  let state: DoctorConfigMutationState = {
    cfg: snapshot.sourceConfig,
    candidate: structuredClone(snapshot.sourceConfig),
    pendingChanges: false,
    fixHints: [],
  };

  const legacyStep = applyLegacyCompatibilityStep({
    snapshot,
    state,
    shouldRepair: true,
    doctorFixCommand,
  });
  if (legacyStep.blocksWrite) {
    return { ...report, status: "skipped", reason: legacyStep.issueLines.join(" ") };
  }
  state = legacyStep.state;
  // issueLines repeats the detected legacy issues ahead of the migration's own warnings.
  const detectedLegacyLines = new Set(formatConfigIssueLines(snapshot.legacyIssues, "-"));

  const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
  const normalized = await normalizeCompatibilityConfigValues(state.candidate, {
    blockedModelIdentities: new Set(blockedCodexProviderPlan.blockedModelIdentities),
    sourceRaw: snapshot.parsed,
  });
  state = applyDoctorConfigMutation({ state, mutation: normalized, shouldRepair: true });

  // The unknown-key half of upstream's applyRetiredConfigStep (shared/config-flow-steps.ts), which
  // replaced applyUnknownConfigKeyStep at 2026.11.10. The other half, retireHeartbeatWithDoctor,
  // moves heartbeat settings into the cron store (a state migration) and is NOT run here, so
  // stripUnknownConfigKeys leaves `agents.*.heartbeat` and `channels.*.heartbeatVisibility` in
  // the file for doctor. Deferred plugin migrations (its preservedPaths argument) only come from
  // `openclaw update`, which FIX-09 blocks.
  const unknown = stripUnknownConfigKeys(state.candidate);
  const protectedAuth =
    unknown.removed.length > 0
      ? protectActiveAuthProfileConfig({ before: state.candidate, after: unknown.config })
      : { config: state.candidate, repairs: [], warnings: [] };
  if (unknown.removed.length > 0) {
    state = applyDoctorConfigMutation({
      state,
      mutation: { config: protectedAuth.config, changes: unknown.removed },
      shouldRepair: true,
    });
  }

  const changes = [
    ...legacyStep.changeLines,
    ...normalized.changes,
    ...unknown.removed.map((removedPath) => `Removed unknown config key: ${removedPath}`),
    ...protectedAuth.repairs,
  ];
  const warnings = [
    ...legacyStep.issueLines.filter((line) => !detectedLegacyLines.has(line)),
    ...(normalized.warnings ?? []),
    ...protectedAuth.warnings,
  ];
  if (!state.pendingChanges) {
    return { ...report, status: "unchanged", warnings };
  }

  const candidate = implicitMainRoster
    ? withoutImplicitMainRoster(state.cfg, read.parsed)
    : state.cfg;
  // The writer runs this same check before committing, so a passing preview is a passing write.
  const validated = validateConfigObjectRawWithPlugins(candidate, { semanticValidation: "strict" });
  if (!validated.ok) {
    return { ...report, status: "still-invalid", changes, warnings, issues: validated.issues };
  }
  if (params.dryRun) {
    return { ...report, status: "would-fix", changes, warnings };
  }

  const nextConfig = restoreDoctorConfigEnvRefs(candidate, referenceSource);
  try {
    await transformConfigFile({
      baseHash: read.hash,
      transform: () => ({ nextConfig }),
      afterWrite: { mode: "auto" },
      // Doctor also passes allowConfigSizeDrop; leaving it off keeps the size-drop guard.
      writeOptions: {
        expectedConfigPath: read.path,
        auditOrigin: "doctor",
        ...(params.skipOutputLogs ? { skipOutputLogs: true } : {}),
      },
    });
  } catch (err) {
    return { ...report, status: "write-failed", changes, warnings, error: formatErrorMessage(err) };
  }
  return { ...report, status: "fixed", changes, warnings };
}
