import { a as copyConfigResolutionFactsThroughRewrite } from "./resolution-facts-HH1cnmIY.mjs";
import { n as containsConfigIncludeDirective, p as resolveConfigSnapshotHash } from "./io.read-helpers-Bvdjf9tk.mjs";
import { r as validateConfigObjectRaw } from "./validation-core-CwnLvw44.mjs";
import { T as stampConfigWriteMetadata } from "./io.warnings-Dz_nq5SM.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts, r as omitDeferredPluginMigrationConfig, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { n as findLegacyConfigRuleIssues, o as LEGACY_TALK_VOICE_CALL_INHERITANCE, t as findLegacyConfigIssues } from "./legacy-Ccc1pb1u.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { r as validateConfigObjectWithPlugins } from "./validation-BeAnc62d.mjs";
import { a as transformConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { t as findRetiredConfigUpgradeRequirement } from "./retired-config-formats-yKg5AICE.mjs";
import { i as restoreDoctorConfigEnvRefs, o as applyLegacyDoctorMigrations, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-DJkdcxLn.mjs";
import { m as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-BSHZeoyM.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-BgzBjX_V.mjs";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-BWZ_nhfc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/automatic-config-repair.ts
function canPlanAutomaticConfigRepair(snapshot) {
	return snapshot.exists && snapshot.raw !== null && !findRetiredConfigUpgradeRequirement(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig) && (snapshot.includedPaths?.length ?? 0) === 0 && !containsConfigIncludeDirective(snapshot.parsed) && (!snapshot.valid || findLegacyConfigRuleIssues(snapshot.sourceConfig, LEGACY_TALK_VOICE_CALL_INHERITANCE.legacyRules ?? [], snapshot.parsed).length > 0);
}
function prepareAutomaticConfigRepairWrite(snapshot, config) {
	const unsetPaths = resolveManagedUnsetPathsForWrite(void 0);
	return stampConfigWriteMetadata(applyUnsetPathsForWrite(prepareConfigWriteTopology({
		snapshot,
		nextConfig: config,
		options: { persistCanonicalAgentRoster: true },
		unsetPaths,
		env: process.env
	}).nextConfig, unsetPaths), void 0, snapshot.parsed);
}
function planConfigRepair(snapshot, pluginContracts) {
	if (!canPlanAutomaticConfigRepair(snapshot)) return null;
	const deferredPluginMigrations = getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig);
	const withPluginContracts = (run) => deferredPluginMigrations ? withDeferredPluginDoctorMigrations(deferredPluginMigrations.map((pending) => pending.pluginId), run) : run();
	const migration = withPluginContracts(() => applyLegacyDoctorMigrations(snapshot.sourceConfig, {
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		context: {
			authoredRaw: snapshot.parsed,
			resolvedRaw: snapshot.sourceConfig
		},
		pluginContracts
	}));
	const config = inheritLegacyDefaultAgentId(migration.next ?? snapshot.sourceConfig, preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: migration.next ?? snapshot.sourceConfig,
		pending: deferredPluginMigrations ?? []
	}));
	if (isDeepStrictEqual(config, snapshot.sourceConfig)) return null;
	copyConfigResolutionFactsThroughRewrite(snapshot.sourceConfig, config);
	const writeConfig = pluginContracts ? restoreDoctorConfigEnvRefs(config, prepareDoctorConfigReferenceSource(snapshot)) : config;
	let warnings = snapshot.warnings;
	const runtimeConfig = withPluginContracts(() => {
		const validationConfig = omitDeferredPluginMigrationConfig(config, deferredPluginMigrations);
		const validated = pluginContracts ? validateConfigObjectWithPlugins(prepareAutomaticConfigRepairWrite(snapshot, writeConfig), { deferredPluginMigrations }) : {
			...validateConfigObjectRaw(validationConfig),
			warnings
		};
		warnings = validated.warnings;
		const issues = (pluginContracts ? findDoctorLegacyConfigIssues : findLegacyConfigIssues)(validationConfig, validationConfig);
		return validated.ok && issues.length === 0 ? deferredPluginMigrations?.length ? validated.config : config : null;
	});
	if (!runtimeConfig) return null;
	copyConfigResolutionFactsThroughRewrite(snapshot.sourceConfig, runtimeConfig);
	setDeferredPluginMigrationConfigFacts(config, deferredPluginMigrations);
	return {
		config,
		writeConfig,
		changes: [...migration.changes, ...migration.warnings ?? []],
		snapshot: {
			...snapshot,
			sourceConfig: config,
			resolved: config,
			runtimeConfig,
			config: runtimeConfig,
			warnings,
			valid: true,
			issues: [],
			legacyIssues: []
		}
	};
}
/** Admits only complete, deterministic single-file legacy migrations. */
function planAutomaticConfigRepair(snapshot) {
	return planConfigRepair(snapshot, true);
}
/**
* Backup inventory and restore overlap checks need legacy roots without changing state.
* Full plugin-contract validation belongs to Doctor's repair plan.
*/
function resolveLegacyConfigSnapshotForBackup(snapshot) {
	if (snapshot.valid) return snapshot;
	return planConfigRepair(snapshot, false)?.snapshot;
}
/** Commits a planned repair against the exact snapshot admitted by its caller. */
async function commitAutomaticConfigRepair(plan, snapshot) {
	await transformConfigFile({
		baseHash: resolveConfigSnapshotHash(snapshot) ?? void 0,
		transform: async (_current, { snapshot: currentSnapshot }) => {
			const { repairLegacyCronOwnersBeforeConfigWrite } = await import("./legacy-owner-BMFb4i5Y.mjs");
			const changes = await repairLegacyCronOwnersBeforeConfigWrite({
				snapshot: currentSnapshot,
				nextConfig: plan.writeConfig
			});
			if (changes.length > 0) {
				const { note } = await import("./terminal-core/note.js");
				note(changes.join("\n"), "Doctor changes");
			}
			return { nextConfig: plan.writeConfig };
		},
		afterWrite: {
			mode: "none",
			reason: "automatic migration"
		},
		writeOptions: {
			expectedConfigPath: snapshot.path,
			auditOrigin: "doctor",
			skipOutputLogs: true,
			skipRuntimeSnapshotRefresh: true,
			persistCanonicalAgentRoster: true
		}
	});
}
//#endregion
export { resolveLegacyConfigSnapshotForBackup as i, commitAutomaticConfigRepair as n, planAutomaticConfigRepair as r, canPlanAutomaticConfigRepair as t };
