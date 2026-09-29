import { D as withPluginCache, a as createPluginCache, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { d as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { f as hashRuntimeConfigValue } from "./runtime-snapshot-DbgWcCyV.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { c as readConfigFileSnapshot, d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-O_NRjHAq.mjs";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-Bkih_luc.mjs";
import { t as completeDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-DbWx53-a.mjs";
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
	const pluginDoctorConfig = params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
	if (params.snapshot.valid) return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0 ? {
		cfg: params.baseConfig,
		pluginDoctorConfig
	} : { cfg: params.baseConfig };
	const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
	if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
	const migrated = migrateLegacyConfig(migrationSource, { sourceConfigBeforeMigrations: params.snapshot.sourceConfigBeforeMigrations });
	if (!migrated.config || migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
	return {
		cfg: migrated.config,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight-checkpoint.ts
/** Renew through awaited admission and surface a lost lease before the next write. */
function keepStartupMigrationLeaseAlive(lease, intervalMs) {
	let failure;
	const timer = setInterval(() => {
		try {
			lease.heartbeat();
		} catch (error) {
			failure = error instanceof Error ? error : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
		}
	}, intervalMs);
	timer.unref?.();
	return {
		get error() {
			return failure;
		},
		throwIfFailed() {
			if (failure) throw failure;
		},
		stop() {
			clearInterval(timer);
		}
	};
}
function resolveMigrationCheckpointIdentity(params) {
	if (!params.snapshot.valid || !params.pluginMigrationFingerprint) return null;
	const stateMigrationInput = resolveStateMigrationConfigInput({
		snapshot: params.snapshot,
		baseConfig: params.baseConfig
	});
	const effectiveConfig = stateMigrationInput?.cfg ?? params.baseConfig;
	const pluginDoctorConfig = stateMigrationInput?.pluginDoctorConfig ?? effectiveConfig;
	return {
		effectiveConfigFingerprint: hashRuntimeConfigValue(effectiveConfig),
		pluginDoctorConfigFingerprint: hashRuntimeConfigValue(pluginDoctorConfig),
		pluginMigrationFingerprint: params.pluginMigrationFingerprint
	};
}
function migrationCheckpointIdentitiesMatch(left, right) {
	return left !== null && right !== null && left.effectiveConfigFingerprint === right.effectiveConfigFingerprint && left.pluginDoctorConfigFingerprint === right.pluginDoctorConfigFingerprint && left.pluginMigrationFingerprint === right.pluginMigrationFingerprint;
}
function checkpointIdentityForSnapshot(snapshotRead, baseConfig = snapshotRead.snapshot.sourceConfig ?? snapshotRead.snapshot.config ?? {}) {
	const { snapshot, pluginMigrationFingerprint } = snapshotRead;
	return resolveMigrationCheckpointIdentity({
		snapshot,
		baseConfig,
		pluginMigrationFingerprint
	});
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-index.ts
const loadInstalledPluginIndexStoreWrite = createLazyRuntimeModule(() => import("./installed-plugin-index-store-write-B3uWqWPr.mjs"));
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
/** One preflight owns completion; each read still checks the current update phase. */
function createDoctorRehearsalSnapshotPreparation(report) {
	let completed = false;
	const prepareSnapshot = async (snapshot) => {
		if (completed) return;
		const { completeUpdateCandidatePluginRehearsal } = await import("./update-candidate-plugin-repair-8AMY-Rxh.mjs");
		const result = await completeUpdateCandidatePluginRehearsal({
			config: snapshot.sourceConfig ?? snapshot.config ?? {},
			env: process.env,
			installRecords: loadInstalledPluginIndexInstallRecordsSync({ env: process.env })
		});
		completed = true;
		report({
			changes: result.copiedFiles > 0 ? [`Update rehearsal: copied ${result.copiedFiles} missing plugin dependency files.`] : [],
			warnings: result.warnings
		});
	};
	return (enabled) => enabled && resolveUpdateRehearsalRoot(process.env) && process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? prepareSnapshot : void 0;
}
function throwPluginRegistryPersistenceFailed(reason, repair = "Run \"openclaw doctor --fix\" and retry.") {
	throw new Error(`OpenClaw refreshed the plugin registry but could not verify the persisted replacement (${reason}); refusing to write the migration checkpoint. ${repair}`);
}
function formatPluginRegistryDifferences(snapshot) {
	const differences = new Map(snapshot?.registryDiagnostics.flatMap((diagnostic) => diagnostic.differences ?? []).map((difference) => [JSON.stringify(difference), difference]));
	if (differences.size === 0) return;
	return [...differences.values()].toSorted((left, right) => [
		left.pluginId,
		left.persistedSource,
		left.derivedSource
	].join("\0").localeCompare([
		right.pluginId,
		right.persistedSource,
		right.derivedSource
	].join("\0"))).map((difference) => `${sanitizeTerminalText(difference.pluginId)} (${difference.changed.join("+")} changed; persisted source: ${JSON.stringify(difference.persistedSource)}; derived source: ${JSON.stringify(difference.derivedSource)})`).join(", ");
}
async function readDoctorConfigPreflightSnapshot(params) {
	const cache = params.allowCurrentPluginMetadata ? getPluginCache() : createPluginCache();
	return withPluginCache(cache, async () => {
		const sharedOptions = {
			...params.observe === false ? { observe: false } : {},
			...params.measure ? { measure: params.measure } : {},
			...params.allowCurrentPluginMetadata ? {} : { allowCurrentPluginMetadata: false }
		};
		let deferred = params.deferredPluginMigrations;
		if (params.preparePluginMigrations) {
			const core = await readConfigFileSnapshot({
				...sharedOptions,
				pluginValidation: "core-only",
				deferredPluginMigrations: deferred
			});
			await params.prepareSnapshot?.(core);
			deferred = await params.preparePluginMigrations(core);
		}
		const readOptions = {
			...sharedOptions,
			deferredPluginMigrations: deferred
		};
		return withDeferredPluginDoctorMigrations(deferred?.map((entry) => entry.pluginId) ?? [], async () => {
			if (params.includePluginMetadata && !params.skipPluginValidation) {
				const result = await readConfigFileSnapshotWithPluginMetadata(readOptions);
				const pluginMetadataSnapshot = params.preparePluginMetadataSnapshot ? completeDoctorPluginMetadataSnapshot({
					snapshot: result.pluginMetadataSnapshot,
					config: result.snapshot.sourceConfig ?? result.snapshot.config ?? {}
				}) : result.pluginMetadataSnapshot;
				return {
					snapshot: addDoctorLegacyIssues(result.snapshot, pluginMetadataSnapshot),
					pluginMigrationFingerprint: pluginMetadataSnapshot?.configFingerprint?.trim() || null,
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
				};
			}
			const snapshot = await readConfigFileSnapshot({
				...readOptions,
				skipPluginValidation: params.skipPluginValidation
			});
			if (!params.preparePluginMigrations) await params.prepareSnapshot?.(snapshot);
			return {
				snapshot: addDoctorLegacyIssues(snapshot),
				pluginMigrationFingerprint: null
			};
		});
	});
}
function needsRefreshedPluginIndexPersistence(snapshotRead) {
	return snapshotRead.pluginMetadataSnapshot?.registrySource === "derived";
}
async function persistRefreshedPluginIndex(params) {
	const derivedPluginMetadataSnapshot = params.snapshotRead.pluginMetadataSnapshot;
	if (!derivedPluginMetadataSnapshot || !params.snapshotRead.pluginMigrationFingerprint) throwPluginRegistryPersistenceFailed("derived metadata was incomplete");
	const lease = params.lease;
	if (!lease) throwPluginRegistryPersistenceFailed("startup migration lease was not acquired");
	const { writePersistedInstalledPluginIndexWithLeaseSync } = await params.measure("plugin-index-store-import", loadInstalledPluginIndexStoreWrite);
	await params.measure("plugin-index-persistence", () => writePersistedInstalledPluginIndexWithLeaseSync(derivedPluginMetadataSnapshot.registryIndex, {
		env: params.env,
		lease
	}));
	const persistedSnapshotRead = await params.readPersistedSnapshot();
	const persistedPluginMetadataSnapshot = persistedSnapshotRead.pluginMetadataSnapshot;
	if (persistedPluginMetadataSnapshot?.registrySource !== "persisted") {
		const diagnosticCodes = persistedPluginMetadataSnapshot?.registryDiagnostics.map((diagnostic) => diagnostic.code);
		const differences = formatPluginRegistryDifferences(persistedPluginMetadataSnapshot);
		throwPluginRegistryPersistenceFailed(`reread source was ${persistedPluginMetadataSnapshot?.registrySource ?? "missing"}${differences ? `; differences: ${differences}` : ""}${diagnosticCodes?.length ? `; diagnostics: ${diagnosticCodes.join(", ")}` : ""}`, "Stop plugin package changes, run \"openclaw plugins registry --refresh\", then retry.");
	}
	const persistedBaseConfig = persistedSnapshotRead.snapshot.sourceConfig ?? persistedSnapshotRead.snapshot.config ?? {};
	const persistedIdentity = resolveMigrationCheckpointIdentity({
		snapshot: persistedSnapshotRead.snapshot,
		baseConfig: persistedBaseConfig,
		pluginMigrationFingerprint: persistedSnapshotRead.pluginMigrationFingerprint
	});
	if (!params.expectedIdentity || !persistedIdentity || params.expectedIdentity.effectiveConfigFingerprint !== persistedIdentity.effectiveConfigFingerprint || params.expectedIdentity.pluginDoctorConfigFingerprint !== persistedIdentity.pluginDoctorConfigFingerprint) throw new Error("OpenClaw config identity changed while persisting the refreshed plugin registry; refusing to write the migration checkpoint. Run \"openclaw doctor --fix\" and retry.");
	return {
		snapshotRead: persistedSnapshotRead,
		checkpointIdentity: persistedIdentity
	};
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as a, migrationCheckpointIdentitiesMatch as c, readDoctorConfigPreflightSnapshot as i, resolveMigrationCheckpointIdentity as l, needsRefreshedPluginIndexPersistence as n, checkpointIdentityForSnapshot as o, persistRefreshedPluginIndex as r, keepStartupMigrationLeaseAlive as s, createDoctorRehearsalSnapshotPreparation as t, resolveStateMigrationConfigInput as u };
