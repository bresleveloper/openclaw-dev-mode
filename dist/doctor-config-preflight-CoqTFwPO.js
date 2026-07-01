import { n as isTruthyEnvValue } from "./env-CKmI-C4z.js";
import { p as resolveHomeDir } from "./utils-BApvfmPs.js";
import { _ as recoverConfigFromLastKnownGood, g as recoverConfigFromJsonRootSuffix, u as readConfigFileSnapshot } from "./io-BJfjPmGW.js";
import { n as formatConfigIssueLines } from "./issue-format-RCKTtsD6.js";
import { t as note } from "./note-DXV6Ywsc.js";
import { r as noteIncludeConfinementWarning } from "./doctor-config-analysis-BvYxWrkv.js";
import { t as findDoctorLegacyConfigIssues } from "./legacy-config-issues-CPAE70WU.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
let doctorStateMigrationsPromise = null;
let doctorCronPromise = null;
function loadDoctorStateMigrations() {
	doctorStateMigrationsPromise ??= import("./doctor-state-migrations-BUTRFw4u.js");
	return doctorStateMigrationsPromise;
}
function loadDoctorCron() {
	doctorCronPromise ??= import("./cron-DQ0bILn_.js");
	return doctorCronPromise;
}
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
	if (result.warnings.length > 0) note(result.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
}
/**
* Runs early doctor config checks before the main config repair flow.
*
* It may migrate legacy state/config paths, recover corrupt target config when requested, and
* returns the best-effort config snapshot used by later doctor checks.
*/
async function runDoctorConfigPreflight(options = {}) {
	const stateMigrations = options.migrateState !== false ? await loadDoctorStateMigrations() : void 0;
	const stateMigrationsAllowed = stateMigrations === void 0 || options.beforeStateMigrations === void 0 || await options.beforeStateMigrations();
	if (stateMigrations && stateMigrationsAllowed) {
		const { autoMigrateLegacyStateDir } = stateMigrations;
		noteStateMigrationResult(await autoMigrateLegacyStateDir({ env: process.env }));
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
	const configStateMigrationsAllowed = stateMigrations !== void 0 && stateMigrationsAllowed && (options.beforeStateMigrations === void 0 || await options.beforeStateMigrations(snapshot));
	if (stateMigrations && configStateMigrationsAllowed) {
		const { autoMigrateLegacyState, autoMigrateLegacyTaskStateSidecars } = stateMigrations;
		if (snapshot.valid) {
			const { repairLegacyCronStoreWithoutPrompt } = await loadDoctorCron();
			noteStateMigrationResult(await repairLegacyCronStoreWithoutPrompt({ cfg: baseConfig }));
			noteStateMigrationResult(await autoMigrateLegacyState({
				cfg: baseConfig,
				env: process.env,
				recoverCorruptTargetStore: options.recoverCorruptTargetStore
			}));
		} else noteStateMigrationResult(await autoMigrateLegacyTaskStateSidecars({ env: process.env }));
	}
	return {
		snapshot,
		baseConfig
	};
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as n, runDoctorConfigPreflight as t };
