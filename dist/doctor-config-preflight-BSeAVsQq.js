import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { n as isTruthyEnvValue } from "./env-CKdem44B.js";
import { p as resolveHomeDir } from "./utils-CRO4LGEB.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DlUfO5Q_.js";
import { _ as recoverConfigFromLastKnownGood, g as recoverConfigFromJsonRootSuffix, u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import "./env-vars-BcrpQK0x.js";
import { n as formatConfigIssueLines } from "./issue-format-fzg0yJxc.js";
import { t as note } from "./note-w8AYQ4sA.js";
import { r as noteIncludeConfinementWarning } from "./doctor-config-analysis-Bi_Hs3OY.js";
import { t as findDoctorLegacyConfigIssues } from "./legacy-config-issues-DgEgfz3p.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-DXn22J24.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
	const pluginDoctorConfig = params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
	if (params.snapshot.valid) return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0 ? {
		cfg: params.baseConfig,
		pluginDoctorConfig
	} : { cfg: params.baseConfig };
	const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
	if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
	const migrated = migrateLegacyConfig(migrationSource);
	if (!migrated.config) return null;
	if (migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
	return {
		cfg: migrated.config,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
const loadDoctorStateMigrations = createLazyRuntimeModule(() => import("./doctor-state-migrations-DnzACdUK.js"));
const loadDoctorCron = createLazyRuntimeModule(() => import("./cron-BJvUYBoU.js"));
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetDir = path.join(home, ".openclaw");
	const targetPath = path.join(targetDir, "openclaw.json");
	try {
		await fs.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json")];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs.mkdir(targetDir, { recursive: true });
	try {
		await fs.copyFile(legacyPath, targetPath, fs.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch {}
	return changes;
}
function collectDoctorLegacyIssues(snapshot) {
	if (!snapshot.exists) return [];
	const resolvedRaw = snapshot.sourceConfig ?? snapshot.config ?? {};
	return findDoctorLegacyConfigIssues(resolvedRaw, snapshot.parsed ?? resolvedRaw);
}
function addDoctorLegacyIssues(snapshot) {
	const legacyIssues = collectDoctorLegacyIssues(snapshot);
	if (legacyIssues.length === 0) return snapshot;
	return {
		...snapshot,
		legacyIssues
	};
}
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
function noteStateMigrationResult(result) {
	if (result.changes.length > 0) note(result.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = result.notices ?? [];
	if (notices.length > 0) note(notices.map((entry) => `- ${entry}`).join("\n"), "Doctor notices");
	if (result.warnings.length > 0) note(result.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
}
async function runStartupUpgradeConvergence(params) {
	const { runPostCorePluginConvergence } = await import("./post-core-plugin-convergence-5iZQgyOm.js");
	const convergence = await runPostCorePluginConvergence({
		cfg: params.cfg,
		env: params.env
	});
	if (convergence.changes.length > 0) note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = convergence.notices ?? [];
	if (notices.length > 0) note(notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"), "Doctor notices");
	const warnings = convergence.warnings.map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	return warnings;
}
function formatStartupMigrationFailure(params) {
	return [
		"OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
		...[...params.warnings.map((warning) => `- ${warning}`), ...params.blockers.map((blocker) => `- ${blocker}`)],
		"Run \"openclaw doctor --fix\" against the mounted state/config, then restart the container."
	].join("\n");
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
/**
* Runs early doctor config checks before the main config repair flow.
*
* It may migrate legacy state/config paths, recover corrupt target config when requested, and
* returns the best-effort config snapshot used by later doctor checks.
*/
async function runDoctorConfigPreflight(options = {}) {
	const stateMigrations = options.migrateState !== false ? await loadDoctorStateMigrations() : void 0;
	const startupCheckpoint = options.requireStartupMigrationCheckpoint === true ? await import("./startup-migration-checkpoint-ZitWtlNH.js") : void 0;
	let startupMigrationEnv = process.env;
	let shouldRecordStartupCheckpoint = false;
	let startupMigrationLease;
	let startupMigrationHeartbeat;
	let startupMigrationHeartbeatError;
	const startupMigrationWarnings = [];
	const noteStartupStateMigrationResult = (result) => {
		startupMigrationWarnings.push(...result.warnings);
		noteStateMigrationResult(result);
	};
	try {
		const stateMigrationsAllowed = stateMigrations === void 0 || options.beforeStateMigrations === void 0 || await options.beforeStateMigrations();
		if (startupCheckpoint && !stateMigrationsAllowed) throwStartupMigrationGuardRejected();
		if (startupCheckpoint) {
			startupMigrationEnv = cloneEnvWithPlatformSemantics(process.env);
			shouldRecordStartupCheckpoint = startupCheckpoint.needsStartupMigrationCheckpoint({ env: startupMigrationEnv });
			startupMigrationLease = shouldRecordStartupCheckpoint ? startupCheckpoint.acquireStartupMigrationLease({ env: startupMigrationEnv }) : void 0;
			if (startupMigrationLease) {
				startupMigrationHeartbeat = setInterval(() => {
					try {
						startupMigrationLease?.heartbeat();
					} catch (error) {
						startupMigrationHeartbeatError = error;
					}
				}, 6e4);
				startupMigrationHeartbeat.unref?.();
			}
		}
		if (stateMigrations && stateMigrationsAllowed) {
			const { autoMigrateLegacyStateDir } = stateMigrations;
			noteStartupStateMigrationResult(await autoMigrateLegacyStateDir({ env: process.env }));
		}
		if (options.migrateLegacyConfig !== false) {
			const legacyConfigChanges = await maybeMigrateLegacyConfig();
			if (legacyConfigChanges.length > 0) note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
		}
		const readOptions = { skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight() };
		let snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
		if (options.repairPrefixedConfig === true && snapshot.exists && !snapshot.valid) {
			if (await recoverConfigFromJsonRootSuffix(snapshot)) {
				note("Removed non-JSON prefix from openclaw.json; original saved as .clobbered.*.", "Config");
				snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
			} else if (await recoverConfigFromLastKnownGood({
				snapshot,
				reason: "doctor-invalid-config"
			})) {
				note("Restored openclaw.json from last-known-good; original saved as .clobbered.*.", "Config");
				snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
			}
		}
		const invalidConfigNote = options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
		if (invalidConfigNote && snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) {
			note(invalidConfigNote, "Config");
			noteIncludeConfinementWarning(snapshot);
		}
		const warnings = snapshot.warnings ?? [];
		if (warnings.length > 0) note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
		const baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		const stateMigrationInput = resolveStateMigrationConfigInput({
			snapshot,
			baseConfig
		});
		const freshConfigGuardAllowed = stateMigrations === void 0 || !stateMigrationsAllowed || options.beforeStateMigrations === void 0 || await options.beforeStateMigrations(snapshot);
		if (startupCheckpoint && !freshConfigGuardAllowed) throwStartupMigrationGuardRejected();
		if (stateMigrations && stateMigrationsAllowed && freshConfigGuardAllowed) {
			const { autoMigrateLegacyState, autoMigrateLegacyPluginDoctorState, autoMigrateLegacyTaskStateSidecars } = stateMigrations;
			if (stateMigrationInput) {
				if (stateMigrationInput.cfg) {
					const { repairLegacyCronStoreWithoutPrompt } = await loadDoctorCron();
					noteStartupStateMigrationResult(await repairLegacyCronStoreWithoutPrompt({ cfg: stateMigrationInput.cfg }));
					noteStartupStateMigrationResult(await autoMigrateLegacyState({
						cfg: stateMigrationInput.cfg,
						...stateMigrationInput.pluginDoctorConfig ? { pluginDoctorConfig: stateMigrationInput.pluginDoctorConfig } : {},
						env: process.env,
						recoverCorruptTargetStore: options.recoverCorruptTargetStore
					}));
				} else if (stateMigrationInput.pluginDoctorConfig) {
					noteStartupStateMigrationResult(await autoMigrateLegacyPluginDoctorState({
						config: stateMigrationInput.pluginDoctorConfig,
						env: process.env
					}));
					noteStartupStateMigrationResult(await autoMigrateLegacyTaskStateSidecars({ env: process.env }));
				}
			} else noteStartupStateMigrationResult(await autoMigrateLegacyTaskStateSidecars({ env: process.env }));
		}
		if (shouldRecordStartupCheckpoint) {
			if (startupMigrationHeartbeatError) throw startupMigrationHeartbeatError instanceof Error ? startupMigrationHeartbeatError : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
			const blockers = startupMigrationWarnings.length > 0 ? [] : snapshot.valid ? await runStartupUpgradeConvergence({
				cfg: baseConfig,
				env: process.env
			}) : ["OpenClaw config is invalid; run \"openclaw doctor --fix\" before startup."];
			if (startupMigrationWarnings.length > 0 || blockers.length > 0) throw new Error(formatStartupMigrationFailure({
				warnings: startupMigrationWarnings,
				blockers
			}));
			startupCheckpoint?.recordSuccessfulStartupMigrations({
				env: startupMigrationEnv,
				lease: startupMigrationLease
			});
		}
		return {
			snapshot,
			baseConfig
		};
	} finally {
		if (startupMigrationHeartbeat) clearInterval(startupMigrationHeartbeat);
		startupMigrationLease?.release();
	}
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as n, runDoctorConfigPreflight as t };
