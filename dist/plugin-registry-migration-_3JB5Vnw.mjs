import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { i as resolveInstalledPluginIndexStorePath, m as setPluginInstallRecordMapEntry, s as copyPluginInstallRecordMap, u as inspectPluginInstallRecordMap } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { a as readPersistedInstalledPluginIndexInstallRecords, c as inspectPersistedInstalledPluginIndexInstallRecordsSync, i as loadInstalledPluginIndexInstallRecordsSync, r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { a as resolveTrustedOfficialClawHubPackageName, i as isTrustedOfficialPluginInstallRecord, o as resolveTrustedSourceLinkedOfficialClawHubInstall } from "./official-external-install-records-CwKXyAFm.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { i as writePersistedInstalledPluginIndex } from "./installed-plugin-index-store-write-9YyZuTlI.mjs";
import { a as withoutPluginInstallRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/plugin-install-config-migration.ts
function inspectShippedPluginInstallConfigRecords(config) {
	if (!isRecord(config) || !isRecord(config.plugins)) return { status: "missing" };
	return inspectPluginInstallRecordMap(config.plugins.installs);
}
//#endregion
//#region src/commands/doctor/shared/plugin-registry-migration.ts
/** Backfill shipped ClawHub authority only from a catalog-bound legacy install record. */
function migrateOfficialPluginInstallProvenance(records) {
	const migrated = copyPluginInstallRecordMap(records);
	for (const [pluginId, record] of Object.entries(records)) {
		if (record.source !== "clawhub" || record.clawhubUrl !== void 0 || record.clawhubChannel !== void 0 || record.sourcePath !== void 0 || !resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		})) continue;
		const normalized = {
			...record,
			clawhubUrl: "https://clawhub.ai",
			clawhubChannel: "official"
		};
		const packageName = resolveTrustedOfficialClawHubPackageName(normalized);
		if (isTrustedOfficialPluginInstallRecord({
			pluginId,
			packageName,
			record: normalized
		})) setPluginInstallRecordMapEntry(migrated, pluginId, normalized);
	}
	return migrated;
}
var InvalidPluginInstallRecordStateError = class extends Error {};
function invalidPersistedInstallRecordMessage(filePath) {
	return [`Persisted plugin install records are invalid at ${filePath}.`, "Stop the Gateway, back up this database, delete only the config_machine_state row with state_key='plugins.installedIndex' using SQLite tooling, then rerun `openclaw doctor --fix` to rebuild it."].join(" ");
}
const INVALID_CONFIG_INSTALL_RECORD_MESSAGE = "plugins.installs contains invalid records. Back up openclaw.json, correct or remove the invalid retired plugins.installs record, then rerun `openclaw doctor --fix`.";
function mergeShippedPluginInstallRecords(previous, persisted, source) {
	const next = copyPluginInstallRecordMap(previous);
	for (const [pluginId, record] of Object.entries(source)) if (!persisted || !Object.hasOwn(persisted, pluginId)) setPluginInstallRecordMapEntry(next, pluginId, record);
	return migrateOfficialPluginInstallProvenance(next);
}
/** Preview the same install-record merge that the importer repeats under its lease. */
function readShippedPluginInstallConfigImportRecords(snapshot, options = {}) {
	const source = inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig);
	if (source.status === "missing") return;
	if (source.status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	return mergeShippedPluginInstallRecords(loadInstalledPluginIndexInstallRecordsSync(options), readPersistedInstalledPluginIndexInstallRecords(options), source.records);
}
/** Check the accepted source again inside the config writer's lock. */
function assertShippedPluginInstallConfigImportCurrent(snapshot, imported) {
	const source = inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig);
	if (source.status === "missing") return;
	if (source.status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	if (!imported || imported.databasePath !== resolveInstalledPluginIndexStorePath() || !isDeepStrictEqual(imported.source, {
		path: snapshot.path,
		hash: snapshot.hash,
		sourceConfig: snapshot.sourceConfig
	})) throw new ConfigMutationConflictError("config changed after plugin install migration");
}
/** Preserve retired source records before Doctor can restore or rewrite their config. */
async function importShippedPluginInstallConfigForDoctor(snapshot, options = {}) {
	const source = inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig);
	if (source.status === "missing") return;
	if (source.status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	const { readConfigFileSnapshotForWrite, withConfigMutationExclusive } = await import("./config/config.js");
	const sourceIdentity = {
		path: snapshot.path,
		hash: snapshot.hash,
		sourceConfig: snapshot.sourceConfig
	};
	const receipt = (databasePath, pluginInventoryChanged) => ({
		source: structuredClone(sourceIdentity),
		databasePath,
		pluginInventoryChanged
	});
	if (Object.keys(source.records).length === 0) return receipt(resolveInstalledPluginIndexStorePath(), false);
	const { commitPluginInstallRecordsOnly } = await import("./install-record-commit-g6uyeWzK.mjs");
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-DTJKSqdR.mjs");
	return await withPluginLifecycleLease({}, async (lease) => withConfigMutationExclusive(async () => {
		const prepared = await readConfigFileSnapshotForWrite();
		if (prepared.snapshot.path !== snapshot.path || prepared.snapshot.hash !== snapshot.hash || !isDeepStrictEqual(prepared.snapshot.sourceConfig, snapshot.sourceConfig)) throw new ConfigMutationConflictError("config changed before plugin install migration");
		const storeOptions = { filePath: lease.databasePath };
		const previousInstallRecords = await loadInstalledPluginIndexInstallRecords(storeOptions);
		const persisted = readPersistedInstalledPluginIndexInstallRecords(storeOptions);
		const nextInstallRecords = mergeShippedPluginInstallRecords(previousInstallRecords, persisted, source.records);
		options.validateRecords?.(nextInstallRecords);
		if (isDeepStrictEqual(nextInstallRecords, persisted)) return receipt(lease.databasePath, false);
		await commitPluginInstallRecordsOnly({
			previousInstallRecords,
			nextInstallRecords,
			nextConfig: withoutPluginInstallRecords(snapshot.sourceConfig),
			verifyConfigFresh: async () => {
				prepared.writeOptions.assertConfigPathForWrite?.();
				const current = await readConfigFileSnapshotForWrite();
				if (current.snapshot.path !== prepared.snapshot.path || current.snapshot.hash !== prepared.snapshot.hash || !isDeepStrictEqual(current.writeOptions.includeFileHashesForWrite, prepared.writeOptions.includeFileHashesForWrite) || !isDeepStrictEqual(current.writeOptions.includeFileTargetsForWrite, prepared.writeOptions.includeFileTargetsForWrite)) throw new ConfigMutationConflictError("config changed during plugin install migration");
			}
		});
		return receipt(lease.databasePath, true);
	}));
}
/** Decide whether Doctor should migrate the plugin registry in this environment. */
function preflightPluginRegistryDoctorMigration(params = {}) {
	const filePath = resolveInstalledPluginIndexStorePath(params);
	const persistedState = inspectPersistedInstalledPluginIndexInstallRecordsSync(params);
	if (persistedState.status === "invalid") throw new InvalidPluginInstallRecordStateError(invalidPersistedInstallRecordMessage(filePath));
	const configInstallState = params.config ? inspectShippedPluginInstallConfigRecords(params.config) : void 0;
	if (configInstallState?.status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	if ((params.existsSync ?? fs.existsSync)(filePath)) {
		const currentRegistry = readPersistedInstalledPluginIndexSync(params);
		if (currentRegistry) return {
			action: "skip-existing",
			filePath,
			current: currentRegistry
		};
		if (persistedState.status !== "missing") return {
			action: "migrate",
			filePath
		};
	}
	const hasConfigInstallRecords = configInstallState?.status === "valid" && Object.keys(configInstallState.records).length > 0;
	return {
		action: params.config && !hasConfigInstallRecords ? "initialize" : "migrate",
		filePath
	};
}
async function readMigrationConfig(params) {
	if (params.config) return params.config;
	if (params.readConfig) return await params.readConfig();
	return await (await import("./config/config.js")).readBestEffortConfig();
}
/** Rebuild Doctor's plugin registry from canonical install records when needed. */
async function migratePluginRegistryForDoctor(params = {}) {
	const preflight = preflightPluginRegistryDoctorMigration(params);
	if (preflight.action === "skip-existing") return {
		status: "skip-existing",
		migrated: false,
		preflight
	};
	if (params.dryRun) return {
		status: "dry-run",
		migrated: false,
		preflight
	};
	const rawConfig = await readMigrationConfig(params);
	if (inspectShippedPluginInstallConfigRecords(rawConfig).status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	const config = withoutPluginInstallRecords(rawConfig);
	const installRecords = migrateOfficialPluginInstallProvenance(params.installRecords ?? await loadInstalledPluginIndexInstallRecords(params));
	const migrationParams = {
		...params,
		config,
		installRecords
	};
	const current = {
		...loadInstalledPluginIndex({ ...migrationParams }),
		refreshReason: "migration"
	};
	await writePersistedInstalledPluginIndex(current, params);
	return {
		status: "migrated",
		migrated: true,
		preflight,
		current
	};
}
//#endregion
export { migratePluginRegistryForDoctor as a, inspectShippedPluginInstallConfigRecords as c, migrateOfficialPluginInstallProvenance as i, assertShippedPluginInstallConfigImportCurrent as n, preflightPluginRegistryDoctorMigration as o, importShippedPluginInstallConfigForDoctor as r, readShippedPluginInstallConfigImportRecords as s, InvalidPluginInstallRecordStateError as t };
