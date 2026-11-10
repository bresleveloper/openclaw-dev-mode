import { a as copyConfigResolutionFactsThroughRewrite } from "./resolution-facts-D_pto3MV.mjs";
import { n as containsConfigIncludeDirective, p as resolveConfigSnapshotHash } from "./io.read-helpers-KYk5dB53.mjs";
import { r as validateConfigObjectRaw } from "./validation-core-ezn1vWYO.mjs";
import { a as stampConfigWriteMetadata } from "./io.meta-B0rmlrR1.mjs";
import { a as preserveDeferredPluginMigrationConfig, c as setDeferredPluginMigrationConfigFacts, i as omitDeferredPluginMigrationConfig, l as applyUnsetPathsForWrite, n as getDeferredPluginMigrationConfigFacts, u as resolveManagedUnsetPathsForWrite } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { n as findLegacyConfigRuleIssues, o as LEGACY_TALK_VOICE_CALL_INHERITANCE, t as findLegacyConfigIssues } from "./legacy-B7HUu-GS.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { i as validateConfigObjectWithPlugins } from "./validation-gzn6Bd6i.mjs";
import { a as transformConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { t as findRetiredConfigUpgradeRequirement } from "./retired-config-formats-IQqBZGMl.mjs";
import { h as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-CPMSf5LC.mjs";
import { i as restoreDoctorConfigEnvRefs, o as applyLegacyDoctorMigrations, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-BrBOplUM.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-BN3WkKzC.mjs";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-Dbhci2Vm.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/automatic-config-repair.ts
function canPlanAutomaticConfigRepair(snapshot) {
	return snapshot.exists && snapshot.raw !== null && !findRetiredConfigUpgradeRequirement(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig) && (snapshot.includedPaths?.length ?? 0) === 0 && !containsConfigIncludeDirective(snapshot.parsed) && (!snapshot.valid || findLegacyConfigRuleIssues(snapshot.sourceConfig, LEGACY_TALK_VOICE_CALL_INHERITANCE.legacyRules ?? [], snapshot.parsed).length > 0);
}
async function prepareAutomaticConfigRepairWrite(snapshot, config) {
	const unsetPaths = resolveManagedUnsetPathsForWrite(void 0);
	const topology = await prepareConfigWriteTopology({
		snapshot,
		nextConfig: config,
		options: { persistCanonicalAgentRoster: true },
		unsetPaths,
		env: process.env
	});
	return stampConfigWriteMetadata(applyUnsetPathsForWrite(topology.nextConfig, unsetPaths), void 0, snapshot.parsed);
}
async function planConfigRepair(snapshot, pluginContracts) {
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
	const validation = await withPluginContracts(async () => {
		const validationConfig = omitDeferredPluginMigrationConfig(config, deferredPluginMigrations);
		const validated = pluginContracts ? validateConfigObjectWithPlugins(await prepareAutomaticConfigRepairWrite(snapshot, writeConfig), { deferredPluginMigrations }) : {
			...validateConfigObjectRaw(validationConfig),
			warnings: snapshot.warnings
		};
		const issues = (pluginContracts ? findDoctorLegacyConfigIssues : findLegacyConfigIssues)(validationConfig, validationConfig);
		return validated.ok && issues.length === 0 ? validated : null;
	});
	if (!validation) return null;
	const runtimeConfig = deferredPluginMigrations?.length ? validation.config : config;
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
			warnings: validation.warnings,
			valid: true,
			issues: [],
			legacyIssues: []
		}
	};
}
/** Admits only complete, deterministic single-file legacy migrations. */
async function planAutomaticConfigRepair(snapshot) {
	return planConfigRepair(snapshot, true);
}
/**
* Backup inventory and restore overlap checks need legacy roots without changing state.
* Full plugin-contract validation belongs to Doctor's repair plan.
*/
async function resolveLegacyConfigSnapshotForBackup(snapshot) {
	return snapshot.valid ? snapshot : (await planConfigRepair(snapshot, false))?.snapshot;
}
/** Commits a planned repair against the exact snapshot admitted by its caller. */
async function commitAutomaticConfigRepair(plan, snapshot) {
	await transformConfigFile({
		baseHash: resolveConfigSnapshotHash(snapshot) ?? void 0,
		transform: async (_current, { snapshot: currentSnapshot }) => {
			const { repairLegacyCronOwnersBeforeConfigWrite } = await import("./legacy-owner-CR2Wcjti.mjs");
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
			deferredPluginMigrations: getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig),
			skipOutputLogs: true,
			skipRuntimeSnapshotRefresh: true,
			persistCanonicalAgentRoster: true
		}
	});
}
//#endregion
export { resolveLegacyConfigSnapshotForBackup as i, commitAutomaticConfigRepair as n, planAutomaticConfigRepair as r, canPlanAutomaticConfigRepair as t };
