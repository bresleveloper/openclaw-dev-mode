import { H as stampConfigWriteMetadata, K as applyLegacyDoctorMigrations } from "./io.snapshot-BXLTgjrd.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { a as copyConfigResolutionFactsThroughRewrite } from "./resolution-facts-CSuKIPux.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { d as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DPc05JSs.mjs";
import { t as findLegacyConfigIssues } from "./legacy-2ovrASa7.mjs";
import { r as validateConfigObjectRaw } from "./validation-core-DwJVlxTe.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts, r as omitDeferredPluginMigrationConfig, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { n as containsConfigIncludeDirective, p as resolveConfigSnapshotHash } from "./io.read-helpers-N26RjV2V.mjs";
import { o as validateConfigObjectWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { a as transformConfigFile } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { a as withoutPluginInstallRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { i as restoreDoctorConfigEnvRefs, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-Dryu__9L.mjs";
import { c as inspectShippedPluginInstallConfigRecords, n as assertShippedPluginInstallConfigImportCurrent, r as importShippedPluginInstallConfigForDoctor, s as readShippedPluginInstallConfigImportRecords } from "./plugin-registry-migration-_3JB5Vnw.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-Cmb9jFq4.mjs";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-Bkih_luc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/automatic-startup-config-repair.ts
function admitAutomaticConfigRepairSnapshot(snapshot) {
	return !snapshot.valid && snapshot.exists && snapshot.raw !== null && (snapshot.includedPaths?.length ?? 0) === 0 && !containsConfigIncludeDirective(snapshot.parsed);
}
function prepareAutomaticConfigRepairWrite(snapshot, config) {
	const unsetPaths = resolveManagedUnsetPathsForWrite(void 0);
	return stampConfigWriteMetadata(applyUnsetPathsForWrite(prepareConfigWriteTopology({
		snapshot,
		nextConfig: config,
		options: { persistCanonicalAgentRoster: true },
		unsetPaths,
		env: process.env
	}).nextConfig, unsetPaths), void 0, void 0, snapshot.parsed);
}
function planConfigRepair(snapshot, pluginContracts, installRecordOverride) {
	if (!admitAutomaticConfigRepairSnapshot(snapshot)) return null;
	const deferredPluginMigrations = getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig);
	const sourceRecords = inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig);
	if (sourceRecords.status === "invalid") return null;
	const projected = inheritLegacyDefaultAgentId(snapshot.sourceConfig, withoutPluginInstallRecords(snapshot.sourceConfig));
	const installRecords = pluginContracts ? installRecordOverride ?? (sourceRecords.status === "valid" ? readShippedPluginInstallConfigImportRecords(snapshot) : void 0) : void 0;
	const withMetadata = (config, run) => {
		const invoke = (metadata) => deferredPluginMigrations ? withDeferredPluginDoctorMigrations(deferredPluginMigrations.map((pending) => pending.pluginId), () => run(metadata)) : run(metadata);
		if (installRecords === void 0) return invoke();
		const metadata = resolveConfigWidePluginMetadataSnapshot({
			config,
			installRecords,
			allowCurrent: false
		});
		return withPluginMetadataSnapshotScope(metadata, () => invoke(metadata), { config });
	};
	const migration = withMetadata(projected, () => applyLegacyDoctorMigrations(projected, {
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		context: {
			authoredRaw: snapshot.parsed,
			resolvedRaw: snapshot.sourceConfig
		},
		pluginContracts
	}));
	const config = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: migration.next ?? projected,
		pending: deferredPluginMigrations ?? []
	});
	if (isDeepStrictEqual(config, snapshot.sourceConfig)) return null;
	copyConfigResolutionFactsThroughRewrite(snapshot.sourceConfig, config);
	const writeConfig = pluginContracts ? restoreDoctorConfigEnvRefs(config, prepareDoctorConfigReferenceSource(snapshot)) : config;
	let warnings = snapshot.warnings;
	const runtimeConfig = withMetadata(config, (metadata) => {
		const validationConfig = omitDeferredPluginMigrationConfig(config, deferredPluginMigrations);
		const validated = pluginContracts ? validateConfigObjectWithPlugins(prepareAutomaticConfigRepairWrite(snapshot, writeConfig), {
			...metadata ? { pluginMetadataSnapshot: metadata } : {},
			deferredPluginMigrations
		}) : {
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
		changes: [
			...migration.changes,
			...migration.warnings ?? [],
			...sourceRecords.status === "valid" ? ["Removed retired plugins.installs after preserving plugin install records."] : []
		],
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
function planAutomaticConfigRepair(snapshot, options) {
	return planConfigRepair(snapshot, true, options?.installRecords);
}
/** Validate the prospective plugin contracts before their records become durable. */
async function importAutomaticConfigRepairInstallRecords(snapshot) {
	return await importShippedPluginInstallConfigForDoctor(snapshot, { validateRecords: (installRecords) => {
		if (!planAutomaticConfigRepair(snapshot, { installRecords })) throw new Error("Config cannot be repaired safely with the current plugin inventory.");
	} });
}
/**
* Pre-bootstrap selection must not open state while deciding whether startup is safe.
* Full plugin-contract validation belongs to the admitted preflight's repair plan.
*/
function resolveStartupConfigSnapshot(snapshot) {
	if (snapshot.valid) return snapshot;
	return planConfigRepair(snapshot, false)?.snapshot;
}
/** Matches only the canonical writer result for a previously admitted startup repair. */
function isStartupConfigRepairResult(before, after) {
	const plan = planAutomaticConfigRepair(before);
	const expected = plan ? prepareAutomaticConfigRepairWrite(before, plan.writeConfig) : null;
	return Boolean(expected && after.valid && before.path === after.path && isDeepStrictEqual(expected, after.sourceConfig));
}
/** Commits a planned repair against the exact snapshot admitted by its caller. */
async function writeAutomaticConfigRepair(plan, snapshot, options = {}) {
	await transformConfigFile({
		baseHash: resolveConfigSnapshotHash(snapshot) ?? void 0,
		transform: (_current, { snapshot: currentSnapshot }) => {
			assertShippedPluginInstallConfigImportCurrent(currentSnapshot, options.pluginInstallConfigImport);
			return { nextConfig: plan.writeConfig };
		},
		afterWrite: {
			mode: "none",
			reason: "automatic migration"
		},
		writeOptions: {
			expectedConfigPath: snapshot.path,
			assertCurrent: options.assertCurrent,
			auditOrigin: "doctor",
			skipOutputLogs: true,
			skipRuntimeSnapshotRefresh: true,
			allowConfigSizeDrop: options.pluginInstallConfigImport !== void 0,
			persistCanonicalAgentRoster: true
		}
	});
}
/** Revalidate imported inventory under its owner lease before the guarded config write. */
async function commitAutomaticConfigRepair(plan, snapshot, pluginInstallConfigImport) {
	if (!pluginInstallConfigImport) return await writeAutomaticConfigRepair(plan, snapshot);
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-DTJKSqdR.mjs");
	await withPluginLifecycleLease({}, async (lease) => {
		const currentPlan = planAutomaticConfigRepair(snapshot, { installRecords: loadInstalledPluginIndexInstallRecordsSync() });
		if (!currentPlan) throw new Error("Config cannot be repaired safely with the current plugin inventory.");
		await writeAutomaticConfigRepair(currentPlan, snapshot, {
			pluginInstallConfigImport,
			assertCurrent: () => lease.assertOwned()
		});
	});
}
//#endregion
export { resolveStartupConfigSnapshot as a, planAutomaticConfigRepair as i, importAutomaticConfigRepairInstallRecords as n, isStartupConfigRepairResult as r, commitAutomaticConfigRepair as t };
