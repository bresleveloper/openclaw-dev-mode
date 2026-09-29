import { c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { _ as resolveLegacyRuntimeModelProviderAlias } from "./legacy-2ovrASa7.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-BohvVKP0.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as recordLegacyMigrationRun, i as recordLegacyMigrationReceipt, n as readLegacyMigrationReceipt, o as recordLegacyMigrationSource, r as readLegacyMigrationReceiptFromDatabase } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { l as acquireFileLockSyncWithRetry } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { A as resolveLegacyOAuthPath, D as listLegacyAuthProfileArchives, _ as runAuthProfileWriteTransaction, a as inspectPersistedAuthProfileStoreRaw, b as writePersistedAuthProfileStoreRaw, d as readPersistedSharedAuthProfileStateRaw, h as resolveAuthProfileDatabasePath, i as inspectPersistedAuthProfileStateRaw, l as readPersistedAuthProfileStateRaw, o as inspectPersistedSharedAuthProfileStateRaw, s as inspectPersistedSharedAuthProfileStoreRaw, u as readPersistedAuthProfileStoreRaw, y as writePersistedAuthProfileStateRaw } from "./sqlite-BIg_k8qE.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { a as loadPersistedAuthProfileStore, i as coercePersistedAuthProfileStore, m as coerceAuthProfileState, r as coerceLegacyAuthStore, s as loadPersistedSharedAuthProfileStore, t as applyLegacyAuthStore, u as parseLegacyCredentialEntry } from "./persisted-B486xwB_.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-BY7NXKEu.mjs";
import { n as hasMatchingOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CVbJLd-k.mjs";
import { i as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-CBozwlR0.mjs";
import { u as renameUserProfileAuthLinks } from "./user-model-accounts-C87WCnZM.mjs";
import { f as coerceLegacyFlatCredential, o as clearAuthProfileMigrationDiagnostics, p as hasUsableAuthProfileCredential, u as readLegacyAuthProfileProviders } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { x as isInheritedMainOAuthCredentialFromStores } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { f as saveAuthProfileStoreWithPreparedOwner } from "./store-runtime-BcoYkagW.mjs";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { i as resolveLegacyFlatAuthPath, n as resolveLegacyAuthProfilesPath, r as resolveLegacyAuthStatePath, t as listAuthProfileRepairCandidates } from "./doctor-auth-legacy-paths-C7z3rdwq.mjs";
import { n as repairModelRefAuthProfile, r as repairRetiredConfigModelRefs } from "./retired-model-ref-repair-C-osjblL.mjs";
import { t as inspectAuthDatabaseFiles } from "./stale-auth-order-store-B7V_xrMd.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/plugins/auth-profile-config-refs.ts
/** Installed plugins can predate Doctor's rename map; these fields reference host credentials. */
function rewritePluginAuthProfileRefs(config, profileIdMap) {
	let changed = false;
	const rewrite = (value) => {
		if (Array.isArray(value)) {
			value.forEach(rewrite);
			return;
		}
		if (!isRecord(value)) return;
		for (const [key, entry] of Object.entries(value)) if ((key === "authProfileId" || key === "defaultAuthProfileId") && typeof entry === "string") {
			const replacement = profileIdMap.get(entry.trim());
			if (replacement && replacement !== entry) {
				value[key] = replacement;
				changed = true;
			}
		} else rewrite(entry);
	};
	for (const entry of Object.values(config.plugins?.entries ?? {})) rewrite(entry.config);
	for (const [channel, settings] of Object.entries(config.channels ?? {})) if (!isChannelConfigMetadataKey(channel)) rewrite(settings);
	return changed;
}
//#endregion
//#region src/commands/doctor-auth-migration-receipts.ts
const MIGRATION_KIND = "auth-profile-json-to-sqlite-v2";
function digestBytes(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}
function createAuthProfileMigrationSourceReceipt(params) {
	const sourcePath = path.resolve(params.sourcePath);
	const sourceSha256 = digestBytes(params.sourceBytes);
	const sourceKey = `auth-profile-v2:${digestBytes(Buffer.from(`${sourcePath}\0${sourceSha256}`))}`;
	const stamp = (params.now ?? /* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-");
	return {
		sourceKey,
		runId: `${sourceKey}:${randomUUID()}`,
		sourcePath,
		sourceSha256,
		sourceSizeBytes: params.sourceBytes.byteLength,
		sourceRecordCount: params.sourceRecordCount,
		sourceBytes: Buffer.from(params.sourceBytes),
		targetDatabasePath: path.resolve(params.targetDatabasePath),
		targetTable: params.targetTable,
		...params.targetStoreKey ? { targetStoreKey: params.targetStoreKey } : {},
		archivePath: `${sourcePath}.migrated-${stamp}-${randomUUID()}`,
		...params.env ? { env: params.env } : {}
	};
}
function reportJson(receipt) {
	return JSON.stringify({
		format: MIGRATION_KIND,
		archivePath: receipt.archivePath,
		targetDatabasePath: receipt.targetDatabasePath,
		targetTable: receipt.targetTable,
		targetStoreKey: receipt.targetStoreKey ?? "primary",
		expectedProfileSha256: receipt.expectedProfileSha256,
		expectedStateSha256: receipt.expectedStateSha256,
		completionStatus: receipt.completionStatus ?? "completed"
	});
}
function digestAuthProfileMigrationValue(value) {
	return digestBytes(Buffer.from(JSON.stringify(value) ?? "<undefined>"));
}
function recordAuthProfileMigrationImported(receipt, now = Date.now()) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("migration_sources").select(["last_run_id", "status"]).where("source_key", "=", receipt.sourceKey));
		if (existing && existing.last_run_id !== receipt.runId && existing.status !== "retryable" && existing.status !== "superseded") throw new Error(`auth profile migration source already owned by ${existing.status} receipt`);
		const report = reportJson(receipt);
		recordLegacyMigrationRun(db, {
			runId: receipt.runId,
			startedAt: now,
			finishedAt: null,
			status: "imported",
			reportJson: report,
			upsert: true
		});
		recordLegacyMigrationSource(db, {
			sourceKey: receipt.sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: receipt.sourcePath,
			targetTable: receipt.targetTable,
			sourceSha256: receipt.sourceSha256,
			sourceSizeBytes: receipt.sourceSizeBytes,
			sourceRecordCount: receipt.sourceRecordCount,
			runId: receipt.runId,
			status: "imported",
			importedAt: now,
			reportJson: report,
			upsert: true
		});
	}, { env: receipt.env });
}
function retirePendingAuthProfileMigrationReceipt(receipt, status, previousStatus = "imported", now = Date.now()) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("migration_runs").set({
			status,
			finished_at: now
		}).where("id", "=", receipt.runId).where("status", "=", previousStatus));
		executeSqliteQuerySync(db, kysely.updateTable("migration_sources").set({ status }).where("source_key", "=", receipt.sourceKey).where("last_run_id", "=", receipt.runId).where("status", "=", previousStatus));
	}, { env: receipt.env });
}
function restoreAuthProfileMigrationArchiveNoClobber(receipt) {
	try {
		fs.linkSync(receipt.archivePath, receipt.sourcePath);
	} catch (error) {
		if (error.code === "EEXIST") return "source-exists";
		throw error;
	}
	fs.unlinkSync(receipt.archivePath);
	return "restored";
}
function recordAuthProfileMigrationCompleted(receipt, now = Date.now(), status = "completed") {
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("migration_runs").set({
			status,
			finished_at: now
		}).where("id", "=", receipt.runId));
		executeSqliteQuerySync(db, kysely.updateTable("migration_sources").set({
			status,
			removed_source: 1
		}).where("source_key", "=", receipt.sourceKey).where("last_run_id", "=", receipt.runId));
	}, { env: receipt.env });
}
function archiveAuthProfileMigrationSource(receipt) {
	if (fs.existsSync(receipt.sourcePath)) {
		if (digestBytes(fs.readFileSync(receipt.sourcePath)) !== receipt.sourceSha256) throw new Error("legacy auth source changed after verification");
		fs.renameSync(receipt.sourcePath, receipt.archivePath);
	}
	if (digestBytes(fs.readFileSync(receipt.archivePath)) !== receipt.sourceSha256) throw new Error("legacy auth archive verification failed");
}
function acquireAuthProfileMigrationSourceLocks(sourcePaths) {
	const releases = [];
	try {
		for (const sourcePath of [...new Set(sourcePaths.map((entry) => path.resolve(entry)))].toSorted()) releases.push(acquireFileLockSyncWithRetry(sourcePath));
	} catch (error) {
		for (const release of releases.toReversed()) release();
		throw error;
	}
	return () => {
		for (const release of releases.toReversed()) release();
	};
}
function verifyAuthProfileMigrationTarget(receipt) {
	const expectedProfiles = Object.entries(receipt.expectedProfileSha256 ?? {});
	if (expectedProfiles.length === 0 && !receipt.expectedStateSha256) return;
	const db = openNodeSqliteDatabase(receipt.targetDatabasePath, { readOnly: true });
	try {
		const kysely = getNodeSqliteKysely(db);
		const readTarget = (kind) => {
			const query = receipt.targetStoreKey === "shared" ? kysely.selectFrom("config_machine_state").select("value_json as json").where("state_key", "=", `authProfiles.${kind}`) : kind === "store" ? kysely.selectFrom("auth_profile_store").select("store_json as json").where("store_key", "=", "primary") : kysely.selectFrom("auth_profile_state").select("state_json as json").where("state_key", "=", "primary");
			const row = executeSqliteQueryTakeFirstSync(db, query);
			return typeof row?.json === "string" ? JSON.parse(row.json) : null;
		};
		const store = expectedProfiles.length > 0 ? readTarget("store") : null;
		for (const [profileId, expectedSha256] of expectedProfiles) if (digestAuthProfileMigrationValue(store?.profiles?.[profileId]) !== expectedSha256) throw new Error("auth profile migration target verification failed");
		if (receipt.expectedStateSha256) {
			if (digestAuthProfileMigrationValue(readTarget("state")) !== receipt.expectedStateSha256) throw new Error("auth profile migration target verification failed");
		}
	} finally {
		db.close();
	}
}
function finalizeAuthProfileMigrationSource(receipt, status = "completed", options = {}) {
	receipt.completionStatus = status;
	const release = options.sourceLocked ? void 0 : acquireFileLockSyncWithRetry(receipt.sourcePath);
	try {
		recordAuthProfileMigrationImported(receipt);
		verifyAuthProfileMigrationTarget(receipt);
		archiveAuthProfileMigrationSource(receipt);
		recordAuthProfileMigrationCompleted(receipt, Date.now(), status);
	} finally {
		release?.();
	}
}
function resumePendingAuthProfileMigrationArchives(env, recoverCompleted) {
	const changes = [];
	const rows = withExistingOpenClawStateDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("migration_sources as source").innerJoin("migration_runs as run", "run.id", "source.last_run_id").select([
		"source.source_key",
		"source.source_path",
		"source.source_sha256",
		"source.source_size_bytes",
		"source.source_record_count",
		"source.target_table",
		"source.last_run_id",
		"source.report_json",
		"source.status"
	]).where("source.migration_kind", "=", MIGRATION_KIND).where((eb) => eb.or([eb.and([eb("source.status", "=", "imported"), eb("source.removed_source", "=", 0)]), eb.and([eb("source.status", "=", "completed"), eb("source.removed_source", "=", 1)])]))).rows, { env }) ?? [];
	for (const row of rows) {
		const report = JSON.parse(row.report_json);
		const completed = row.status === "completed";
		if (completed && (!recoverCompleted || Object.hasOwn(report, "expectedProfileSha256") || row.target_table === "auth_profile_state" || typeof report.archivePath !== "string" || !fs.existsSync(report.archivePath))) continue;
		if (typeof row.source_sha256 !== "string" || typeof row.source_size_bytes !== "number" || typeof row.source_record_count !== "number" || typeof report.archivePath !== "string" || typeof report.targetDatabasePath !== "string" || row.target_table !== "auth_profile_store" && row.target_table !== "auth_profile_stores" && row.target_table !== "auth_profile_state") throw new Error("invalid pending auth profile migration receipt");
		const receipt = {
			sourceKey: row.source_key,
			runId: row.last_run_id,
			sourcePath: row.source_path,
			sourceSha256: row.source_sha256,
			sourceSizeBytes: row.source_size_bytes,
			sourceRecordCount: row.source_record_count,
			targetDatabasePath: report.targetDatabasePath,
			targetTable: row.target_table,
			targetStoreKey: report.targetStoreKey === "shared" ? "shared" : "primary",
			archivePath: report.archivePath,
			...isStringRecord(report.expectedProfileSha256) ? { expectedProfileSha256: report.expectedProfileSha256 } : {},
			...typeof report.expectedStateSha256 === "string" ? { expectedStateSha256: report.expectedStateSha256 } : {},
			completionStatus: report.completionStatus === "archived-unparsed" ? "archived-unparsed" : "completed",
			...env ? { env } : {}
		};
		if (!fs.existsSync(receipt.sourcePath) && !fs.existsSync(receipt.archivePath)) throw new Error("pending auth profile migration has neither source nor archive");
		const lockTarget = fs.existsSync(receipt.sourcePath) ? receipt.sourcePath : receipt.archivePath;
		const release = acquireFileLockSyncWithRetry(lockTarget);
		try {
			const sourceExists = fs.existsSync(receipt.sourcePath);
			if (completed) {
				receipt.sourceBytes = fs.readFileSync(receipt.archivePath);
				if (digestBytes(receipt.sourceBytes) !== receipt.sourceSha256 || sourceExists && digestBytes(fs.readFileSync(receipt.sourcePath)) !== receipt.sourceSha256 || !recoverCompleted?.(receipt)) continue;
				if (!sourceExists) fs.linkSync(receipt.archivePath, receipt.sourcePath);
				retirePendingAuthProfileMigrationReceipt(receipt, "retryable", "completed");
				changes.push("Reset an inconsistent completed auth migration receipt for retry.");
				continue;
			}
			if (digestBytes(fs.readFileSync(sourceExists ? receipt.sourcePath : receipt.archivePath)) !== receipt.sourceSha256) {
				if (!sourceExists) throw new Error("legacy auth archive verification failed");
				retirePendingAuthProfileMigrationReceipt(receipt, "superseded");
				changes.push("Retired an interrupted auth migration receipt for a changed source.");
				continue;
			}
			try {
				verifyAuthProfileMigrationTarget(receipt);
			} catch {
				if (!sourceExists) {
					if (restoreAuthProfileMigrationArchiveNoClobber(receipt) === "source-exists") {
						const status = digestBytes(fs.readFileSync(receipt.sourcePath)) === receipt.sourceSha256 ? "retryable" : "superseded";
						retirePendingAuthProfileMigrationReceipt(receipt, status);
						changes.push(status === "retryable" ? "Reset an interrupted auth migration receipt for retry." : "Retired an interrupted auth migration receipt for a changed source.");
						continue;
					}
				}
				retirePendingAuthProfileMigrationReceipt(receipt, "retryable");
				changes.push("Reset an interrupted auth migration receipt for retry.");
				continue;
			}
			archiveAuthProfileMigrationSource(receipt);
			recordAuthProfileMigrationCompleted(receipt, Date.now(), receipt.completionStatus);
		} finally {
			release();
		}
		changes.push(`Finalized interrupted auth profile archive -> ${receipt.archivePath}`);
	}
	return changes;
}
function hasTerminalAuthProfileMigrationReceipt(sourceKey, env) {
	const row = withExistingOpenClawStateDatabaseReadOnly(({ db }) => executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("status").where("source_key", "=", sourceKey)), { env });
	return row?.status === "completed" || row?.status === "archived-unparsed";
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileMigrationReceiptsTestApi")] = {
	recordAuthProfileMigrationImported,
	recordAuthProfileMigrationCompleted,
	restoreAuthProfileMigrationArchiveNoClobber
};
//#endregion
//#region src/commands/doctor/auth-alias-receipt.ts
const SOURCE_KEY = "auth-profile-sqlite-alias-map:v1";
const receiptSchema = object({
	format: literal(SOURCE_KEY),
	mappings: array(object({
		from: string(),
		to: string(),
		credentials: array(object({
			databasePath: string(),
			beforeSha256: string().nullable(),
			afterSha256: string()
		})).min(1),
		sources: array(object({
			path: string(),
			sha256: string()
		})).optional()
	}))
});
function profiles(raw) {
	return isRecord(raw) && isRecord(raw.profiles) ? raw.profiles : {};
}
/** Persist the collision decision before independently committed owners can lose its source. */
function recordAuthAliasMigration(params) {
	const previousReceipt = readLegacyMigrationReceipt(SOURCE_KEY, params.env);
	if (previousReceipt && params.importedProfileIds) {
		const previous = receiptSchema.parse(JSON.parse(previousReceipt.reportJson));
		for (const { from } of previous.mappings) if (params.importedProfileIds.has(from) && !params.profileIdMap.has(from)) throw new Error(`Recorded auth account ${from} could not be verified; its import source was preserved.`);
	}
	const mappings = [];
	for (const [from, to] of params.profileIdMap) {
		if (from === to) continue;
		const credentials = params.stores.flatMap(({ databasePath, store, migratedStore }) => {
			const before = profiles(store)[from];
			const after = profiles(migratedStore)[to];
			if (after === void 0 || before === void 0 && !(params.importedProfileIds?.has(from) && params.sources?.length)) return [];
			if (params.importedProfileIds?.has(from) && before !== void 0 && (!isRecord(before) || !isRecord(after) || digestAuthProfileMigrationValue({
				...before,
				provider: after.provider
			}) !== digestAuthProfileMigrationValue(after))) throw new Error(`Legacy auth input conflicts with the existing account ${from}; its source was preserved.`);
			return [{
				databasePath,
				beforeSha256: before === void 0 ? null : digestAuthProfileMigrationValue(before),
				afterSha256: digestAuthProfileMigrationValue(after)
			}];
		});
		if (credentials.length > 0) mappings.push({
			from,
			to,
			credentials,
			...params.sources?.length ? { sources: [...params.sources] } : {}
		});
	}
	if (mappings.length === 0) return readLegacyMigrationReceipt(SOURCE_KEY, params.env)?.sourceSha256 ?? void 0;
	return runOpenClawStateWriteTransaction(({ db, path }) => {
		const prior = readLegacyMigrationReceiptFromDatabase(db, SOURCE_KEY);
		const previous = prior ? receiptSchema.parse(JSON.parse(prior.reportJson)).mappings : [];
		const records = new Map(previous.map((entry) => [digestAuthProfileMigrationValue(entry), entry]));
		for (const entry of mappings) records.set(digestAuthProfileMigrationValue(entry), entry);
		const report = {
			format: SOURCE_KEY,
			mappings: [...records.values()]
		};
		const reportJson = JSON.stringify(report);
		const sourceSha256 = digestAuthProfileMigrationValue(report);
		recordLegacyMigrationReceipt(db, {
			sourceKey: SOURCE_KEY,
			migrationKind: "auth-profile-sqlite-alias-map",
			sourcePath: path,
			targetTable: "migration_sources",
			sourceSha256,
			sourceSizeBytes: null,
			sourceRecordCount: report.mappings.length,
			runId: `${SOURCE_KEY}:${sourceSha256}`,
			now: Date.now(),
			reportJson,
			upsert: true
		});
		return sourceSha256;
	}, { env: params.env });
}
function runWithAuthAliasMigrationReceipt(expectedSha256, env, operation) {
	if (expectedSha256 === void 0) return operation();
	return runOpenClawStateWriteTransaction((database) => {
		if (readLegacyMigrationReceiptFromDatabase(database.db, SOURCE_KEY)?.sourceSha256 !== expectedSha256) throw new Error("Auth alias migration receipt changed before repair; rerun Doctor.");
		return operation(database);
	}, { env });
}
/** Recover only a recorded account, never a same-suffix credential or a newly reused source ID. */
function recoverAuthAliasMigration(params) {
	const recovered = /* @__PURE__ */ new Map();
	const blocked = /* @__PURE__ */ new Set();
	const receipt = readLegacyMigrationReceipt(SOURCE_KEY, params.env);
	if (!receipt) return {
		recovered,
		blocked
	};
	const report = receiptSchema.parse(JSON.parse(receipt.reportJson));
	const stores = new Map(params.stores.map((entry) => [entry.databasePath, profiles(entry.store)]));
	const matches = /* @__PURE__ */ new Map();
	for (const mapping of report.mappings) {
		const sourcePaths = mapping.sources?.map((source) => source.path) ?? [];
		if (sourcePaths.length > 0 && sourcePaths.every((source) => !fs.existsSync(source))) {
			const archive = params.archivedMappings?.get(mapping.from);
			const recordedSources = report.mappings.filter((entry) => entry.from === mapping.from && entry.to === mapping.to).flatMap((entry) => entry.sources ?? []);
			const verifiedStores = new Set(archive?.origins.filter((origin) => recordedSources.some((source) => source.path === origin.sourcePath && source.sha256 === origin.sourceSha256)).map((origin) => origin.databasePath));
			if (archive?.profileId === mapping.to && verifiedStores.size > 0 && [...stores].every(([databasePath, entries]) => entries[mapping.from] === void 0 && (entries[mapping.to] === void 0 || verifiedStores.has(databasePath)))) {
				const targets = matches.get(mapping.from) ?? /* @__PURE__ */ new Set();
				targets.add(mapping.to);
				matches.set(mapping.from, targets);
			}
			continue;
		}
		if (mapping.credentials.every((expected) => {
			const entries = stores.get(expected.databasePath);
			if (!entries) return false;
			const before = entries[mapping.from];
			const after = entries[mapping.to];
			return before !== void 0 && after === void 0 && digestAuthProfileMigrationValue(before) === expected.beforeSha256 || before === void 0 && after !== void 0 && digestAuthProfileMigrationValue(after) === expected.afterSha256 || before === void 0 && after === void 0 && expected.beforeSha256 === null && mapping.sources !== void 0 && mapping.sources.length > 0 && mapping.sources.every((source) => {
				try {
					return createHash("sha256").update(fs.readFileSync(source.path)).digest("hex") === source.sha256;
				} catch (error) {
					if (isRecord(error) && error.code === "ENOENT") return false;
					throw error;
				}
			});
		}) && [...stores].every(([databasePath, entries]) => mapping.credentials.some((entry) => entry.databasePath === databasePath) || entries[mapping.from] === void 0 && entries[mapping.to] === void 0)) {
			const targets = matches.get(mapping.from) ?? /* @__PURE__ */ new Set();
			targets.add(mapping.to);
			matches.set(mapping.from, targets);
		}
	}
	for (const from of new Set(report.mappings.map((entry) => entry.from))) {
		const targets = matches.get(from);
		if (targets?.size === 1) for (const to of targets) recovered.set(from, to);
		else blocked.add(from);
	}
	return {
		recovered,
		blocked
	};
}
//#endregion
//#region src/commands/doctor-auth-flat-profiles.ts
/** Doctor repairs for legacy auth profile storage and retired provider identifiers. */
function resolveMigrationTargetDatabasePath(agentDir, env = process.env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
var AuthProfileMigrationVerificationError = class extends Error {
	constructor(detail) {
		super("auth profile SQLite verification failed");
		this.detail = detail;
		this.name = "AuthProfileMigrationVerificationError";
	}
};
const UNSAFE_LEGACY_AUTH_PROFILE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeLegacyProviderKey(key) {
	return key.trim().length > 0 && !UNSAFE_LEGACY_AUTH_PROFILE_KEYS.has(key);
}
function extractProviderFromProfileId(profileId) {
	const colon = profileId.indexOf(":");
	if (colon <= 0) return;
	return readNonBlankString(profileId.slice(0, colon));
}
function extractProviderFromModelRef(modelRef) {
	const { model } = splitTrailingAuthProfile(modelRef);
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	return readNonBlankString(model.slice(0, slash));
}
function collectLegacyConfigAuthProfileProviderHints(cfg) {
	const hints = /* @__PURE__ */ new Map();
	const conflicted = /* @__PURE__ */ new Set();
	const addHint = (profileId, provider) => {
		const existing = hints.get(profileId);
		if (existing && existing !== provider) {
			hints.delete(profileId);
			conflicted.add(profileId);
			return;
		}
		if (!conflicted.has(profileId)) hints.set(profileId, provider);
	};
	const addModelHints = (models) => {
		if (!isRecord(models)) return;
		for (const [modelRef, rawModel] of Object.entries(models)) {
			const provider = extractProviderFromModelRef(modelRef);
			if (!provider || !isSafeLegacyProviderKey(provider) || !isRecord(rawModel)) continue;
			const agentRuntime = isRecord(rawModel.agentRuntime) ? rawModel.agentRuntime : null;
			const authProfileId = agentRuntime ? readNonBlankString(agentRuntime.authProfileId) : void 0;
			if (authProfileId) addHint(authProfileId, provider);
		}
	};
	for (const { value } of collectConfiguredModelRefs(cfg)) {
		const { profile } = splitTrailingAuthProfile(value);
		const provider = extractProviderFromModelRef(value);
		if (profile && provider && isSafeLegacyProviderKey(provider)) addHint(profile, provider);
	}
	const root = cfg;
	const auth = isRecord(root.auth) ? root.auth : null;
	const order = auth && isRecord(auth.order) ? auth.order : null;
	if (order) for (const [provider, profileIds] of Object.entries(order)) {
		if (!isSafeLegacyProviderKey(provider) || !Array.isArray(profileIds)) continue;
		for (const profileId of profileIds) {
			const normalizedProfileId = readNonBlankString(profileId);
			if (normalizedProfileId) addHint(normalizedProfileId, provider);
		}
	}
	const agents = isRecord(root.agents) ? root.agents : null;
	addModelHints((agents && isRecord(agents.defaults) ? agents.defaults : null)?.models);
	for (const agent of listAgentEntries(cfg)) addModelHints(agent.models);
	return hints;
}
function coerceLegacyFlatAuthProfileStore(raw) {
	if (!isRecord(raw) || "profiles" in raw) return null;
	const store = {
		version: 1,
		profiles: {}
	};
	for (const [key, value] of Object.entries(raw)) {
		const providerId = key.trim();
		if (!isSafeLegacyProviderKey(providerId)) continue;
		const credential = coerceLegacyFlatCredential(providerId, value);
		if (!credential) continue;
		store.profiles[`${providerId}:default`] = credential;
	}
	return Object.keys(store.profiles).length > 0 ? store : null;
}
function listAuthProfileSqliteMigrationCandidates(cfg, env) {
	return listAuthProfileRepairCandidates(cfg, env).map((candidate) => ({
		agentDir: candidate.agentDir,
		authPath: candidate.authPath,
		statePath: resolveLegacyAuthStatePath(path.dirname(candidate.authPath)),
		legacyPath: resolveLegacyFlatAuthPath(path.dirname(candidate.authPath))
	}));
}
function hasAuthProfileState(state) {
	return Boolean(state.order || state.lastGood || state.usageStats);
}
function normalizeLegacyApiKeyAliasesForImport(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return;
	for (const profile of Object.values(raw.profiles)) {
		if (!isRecord(profile)) continue;
		if ((readNonBlankString(profile.type) ?? readNonBlankString(profile.mode)) !== "api_key") continue;
		if (readNonBlankString(profile.key) !== void 0 || coerceSecretRef(profile.key) !== null || coerceSecretRef(profile.keyRef) !== null || profile["api_key"] === void 0) continue;
		profile.key = profile["api_key"];
	}
}
function collectAuthProfileStateProfileIds(state) {
	return [.../* @__PURE__ */ new Set([
		...Object.values(state.order ?? {}).flat(),
		...Object.values(state.lastGood ?? {}),
		...Object.keys(state.usageStats ?? {})
	])];
}
function inferLegacyConfigAuthProfileMode(raw) {
	const explicit = readNonBlankString(raw.mode) ?? readNonBlankString(raw.type);
	if (explicit === "api_key" || explicit === "token" || explicit === "oauth") return explicit;
	if (readNonBlankString(raw.key) || readNonBlankString(raw.apiKey) || readNonBlankString(raw["api_key"]) || coerceSecretRef(raw.keyRef) || coerceSecretRef(raw.key) || coerceSecretRef(raw.apiKey) || coerceSecretRef(raw["api_key"])) return "api_key";
	if (readNonBlankString(raw.token) || coerceSecretRef(raw.tokenRef) || coerceSecretRef(raw.token)) return "token";
	if (readNonBlankString(raw.access) && readNonBlankString(raw.refresh) && typeof raw.expires === "number") return "oauth";
}
function coerceLegacyConfigAuthProfileStore(cfg) {
	const cfgRecord = cfg;
	const auth = isRecord(cfgRecord.auth) ? cfgRecord.auth : null;
	const profiles = auth && isRecord(auth.profiles) ? auth.profiles : null;
	if (!profiles) return null;
	const providerHints = collectLegacyConfigAuthProfileProviderHints(cfg);
	const store = {
		version: 1,
		profiles: {}
	};
	for (const [profileId, raw] of Object.entries(profiles)) {
		if (!isRecord(raw)) continue;
		const mode = inferLegacyConfigAuthProfileMode(raw);
		if (mode !== "api_key" && mode !== "token" && mode !== "oauth") continue;
		const provider = readNonBlankString(raw.provider) ?? extractProviderFromProfileId(profileId) ?? providerHints.get(profileId);
		if (!provider || !isSafeLegacyProviderKey(provider)) continue;
		const next = {
			...raw,
			provider,
			mode
		};
		if (mode === "api_key") {
			const keyRef = coerceSecretRef(raw.keyRef) ?? coerceSecretRef(raw.key) ?? coerceSecretRef(raw.apiKey) ?? coerceSecretRef(raw["api_key"]);
			const key = readNonBlankString(raw.key) ?? readNonBlankString(raw.apiKey) ?? readNonBlankString(raw["api_key"]);
			if (keyRef) {
				next.keyRef = keyRef;
				delete next.key;
				delete next.apiKey;
				delete next["api_key"];
			} else if (key) {
				next.key = key;
				delete next.keyRef;
			} else continue;
		} else if (mode === "token") {
			const tokenRef = coerceSecretRef(raw.tokenRef) ?? coerceSecretRef(raw.token);
			const token = readNonBlankString(raw.token);
			if (tokenRef) {
				next.tokenRef = tokenRef;
				delete next.token;
			} else if (token) {
				next.token = token;
				delete next.tokenRef;
			} else continue;
		} else if (!readNonBlankString(raw.access) || !readNonBlankString(raw.refresh) || typeof raw.expires !== "number") continue;
		store.profiles[profileId] = next;
	}
	const canonicalStore = coercePersistedAuthProfileStore(store);
	return canonicalStore && Object.keys(canonicalStore.profiles).length > 0 ? canonicalStore : null;
}
function isDefaultAgentCandidate(candidate, cfg, env) {
	return candidate.agentDir === void 0 || path.resolve(candidate.agentDir) === path.resolve(resolveLegacyInheritedAuthAgentDir(cfg, env));
}
function stripImportedConfigAuthProfileCredentials(cfg, store) {
	const profiles = ensureConfigAuthProfiles(cfg);
	let changed = false;
	for (const [profileId, credential] of Object.entries(store.profiles)) {
		const current = profiles[profileId];
		if (!current) continue;
		profiles[profileId] = {
			provider: current.provider || credential.provider,
			mode: credential.type,
			...current.email ? { email: current.email } : {},
			...current.displayName ? { displayName: current.displayName } : {}
		};
		changed = true;
	}
	return changed;
}
function mergeImportedAuthProfiles(params) {
	const profiles = { ...params.store.profiles };
	for (const [profileId, credential] of Object.entries(params.profiles)) {
		const existing = profiles[profileId];
		if (!params.existingProfileIds.has(profileId) || params.replaceExistingWithoutCredential && existing && !hasUsableAuthProfileCredential(existing) && hasUsableAuthProfileCredential(credential)) profiles[profileId] = credential;
	}
	return {
		...params.store,
		profiles
	};
}
function mergeImportedAuthProfileState(params) {
	const next = { ...params.store };
	for (const field of [
		"order",
		"lastGood",
		"usageStats"
	]) {
		const incoming = params.state[field];
		if (!incoming) continue;
		const existing = params.existingState[field] ?? {};
		Object.assign(next, { [field]: {
			...params.store[field],
			...Object.fromEntries(Object.entries(incoming).filter(([key]) => !Object.hasOwn(existing, key)))
		} });
	}
	return next;
}
function formatMissingAuthProfileSqliteVerification(params) {
	const missingProfileIds = [...params.importedProfileIds].filter((profileId) => !params.loaded?.profiles[profileId]);
	const missingStateFields = [];
	for (const field of ["order", "lastGood"]) for (const [provider, expected] of Object.entries(params.expected[field] ?? {})) if (!isDeepStrictEqual(params.loaded?.[field]?.[provider], expected)) missingStateFields.push(`${field}.${provider}`);
	for (const profileId of Object.keys(params.expected.usageStats ?? {})) if (!params.loaded?.usageStats?.[profileId]) missingStateFields.push(`usageStats.${profileId}`);
	const parts = [];
	if (missingProfileIds.length > 0) parts.push(`imported profile(s): ${missingProfileIds.toSorted().join(", ")}`);
	if (missingStateFields.length > 0) parts.push(`auth state field(s): ${missingStateFields.toSorted().join(", ")}`);
	return parts.length > 0 ? parts.join("; ") : null;
}
function collectUnresolvedLegacyOAuthSidecarProfileIds(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) return [];
	const profileIds = [];
	for (const [profileId, profile] of Object.entries(raw.profiles)) {
		if (!isRecord(profile) || profile.type !== "oauth" || !isRecord(profile.oauthRef)) continue;
		if (readNonBlankString(profile.oauthRef.id) && readNonBlankString(profile.oauthRef.provider) && (!readNonBlankString(profile.access) || !readNonBlankString(profile.refresh))) profileIds.push(profileId);
	}
	return profileIds;
}
function hasImportableAuthProfileStore(store) {
	return Boolean(store && (Object.keys(store.profiles).length > 0 || hasAuthProfileState(store)));
}
function prepareAuthProfileSourceReceipt(params) {
	const sourceBytes = fs.readFileSync(params.pathname);
	let sourceRecordCount = 0;
	try {
		const parsed = JSON.parse(sourceBytes.toString("utf8"));
		sourceRecordCount = isRecord(parsed) ? Object.keys(parsed).length : 0;
	} catch {}
	return createAuthProfileMigrationSourceReceipt({
		sourcePath: params.pathname,
		sourceBytes,
		sourceRecordCount,
		targetDatabasePath: params.targetDatabasePath,
		targetTable: params.targetTable,
		...params.targetStoreKey ? { targetStoreKey: params.targetStoreKey } : {},
		now: new Date(params.now()),
		...params.env ? { env: params.env } : {}
	});
}
function assertAuthProfileMigrationSourcesUnchanged(candidate, receipts) {
	const receiptByPath = new Map(receipts.map((receipt) => [receipt.sourcePath, receipt]));
	for (const pathname of [
		candidate.authPath,
		candidate.statePath,
		candidate.legacyPath
	]) {
		const receipt = receiptByPath.get(path.resolve(pathname));
		if (fs.existsSync(pathname) !== Boolean(receipt)) throw new Error("legacy auth source set changed during migration; retry Doctor");
		if (!receipt) continue;
		if (createHash("sha256").update(fs.readFileSync(pathname)).digest("hex") !== receipt.sourceSha256) throw new Error("legacy auth source changed during migration; retry Doctor");
	}
}
function parseAuthProfileMigrationSource(receipt) {
	if (!receipt?.sourceBytes) return null;
	try {
		return JSON.parse(receipt.sourceBytes.toString("utf8"));
	} catch {
		return null;
	}
}
function archivePreviouslyMigratedAuthProfileSource(receipt, result) {
	if (!hasTerminalAuthProfileMigrationReceipt(receipt.sourceKey, receipt.env)) return false;
	archiveAuthProfileMigrationSource(receipt);
	result.changes.push(`Archived a previously migrated legacy auth source without replaying credentials (${shortenHomePath(receipt.archivePath)}).`);
	return true;
}
function coerceLegacyOAuthFile(raw) {
	if (!isRecord(raw)) return {
		store: null,
		rejectedEntries: 1
	};
	const profiles = {};
	let rejectedEntries = 0;
	for (const [provider, value] of Object.entries(raw)) {
		if (!isRecord(value)) {
			rejectedEntries += 1;
			continue;
		}
		const credential = parseLegacyCredentialEntry({
			...value,
			type: "oauth",
			provider
		}, provider);
		if (credential?.type === "oauth") profiles[`${provider}:default`] = credential;
		else rejectedEntries += 1;
	}
	return {
		store: Object.keys(profiles).length > 0 ? {
			version: 1,
			profiles
		} : null,
		rejectedEntries
	};
}
function loadAuthProfileMigrationTargetStore(agentDir, loadStore = loadPersistedAuthProfileStore, database, env = process.env) {
	const explicitSharedRead = agentDir === void 0 && database === void 0;
	const inspection = explicitSharedRead ? inspectPersistedSharedAuthProfileStoreRaw(env) : inspectPersistedAuthProfileStoreRaw(agentDir, database);
	const store = explicitSharedRead && loadStore === loadPersistedAuthProfileStore ? loadPersistedSharedAuthProfileStore(env) : loadStore(agentDir, database ? { database } : void 0);
	if (store) return store;
	if (inspection.status !== "missing") throw new Error("canonical auth profile store is unreadable; legacy source left in place");
	if ((explicitSharedRead ? inspectPersistedSharedAuthProfileStateRaw(env) : inspectPersistedAuthProfileStateRaw(agentDir, database)).status === "unreadable") throw new Error("canonical auth profile state is unreadable; legacy source left in place");
	return {
		version: 1,
		profiles: {},
		...coerceAuthProfileState(explicitSharedRead ? readPersistedSharedAuthProfileStateRaw(env) : readPersistedAuthProfileStateRaw(agentDir, database))
	};
}
function migrateLegacyOAuthFile(params) {
	if (!fs.existsSync(params.oauthPath)) return;
	const releaseSource = acquireAuthProfileMigrationSourceLocks([params.oauthPath]);
	try {
		migrateLockedLegacyOAuthFile(params);
	} finally {
		releaseSource();
	}
}
function migrateLockedLegacyOAuthFile(params) {
	const targetDatabasePath = resolveSharedAuthStorePath(params.env);
	const sharedStateTarget = resolveSharedAuthStoreOwnership(params.env).location === "state-db";
	const receipt = prepareAuthProfileSourceReceipt({
		pathname: params.oauthPath,
		targetDatabasePath,
		targetTable: sharedStateTarget ? "auth_profile_stores" : "auth_profile_store",
		targetStoreKey: sharedStateTarget ? "shared" : "primary",
		now: params.now,
		env: params.env
	});
	if (archivePreviouslyMigratedAuthProfileSource(receipt, params.result)) return;
	const parsed = coerceLegacyOAuthFile(loadJsonFileThroughSymlink(params.oauthPath));
	const imported = parsed.store;
	if (!imported) {
		finalizeAuthProfileMigrationSource(receipt, "archived-unparsed", { sourceLocked: true });
		params.result.warnings.push(`Archived an unreadable legacy OAuth source without import; re-authenticate or recover it from ${shortenHomePath(receipt.archivePath)}.`);
		return;
	}
	const existing = loadAuthProfileMigrationTargetStore(void 0, loadPersistedAuthProfileStore, void 0, params.env);
	const importedProfileIds = new Set(Object.keys(imported.profiles));
	const next = mergeImportedAuthProfiles({
		store: existing,
		profiles: imported.profiles,
		existingProfileIds: new Set(Object.keys(existing.profiles))
	});
	const loaded = runAuthProfileWriteTransaction(void 0, (database, owner) => {
		const authoritative = loadAuthProfileMigrationTargetStore(void 0, loadPersistedAuthProfileStore, database);
		if (!isDeepStrictEqual(authoritative, existing)) throw new Error("canonical auth profile store changed during legacy OAuth migration");
		saveAuthProfileStoreWithPreparedOwner(next, void 0, {
			filterExternalAuthProfiles: false,
			preserveStateProfileIds: collectAuthProfileStateProfileIds(coerceAuthProfileState(existing)),
			syncExternalCli: false
		}, database, owner);
		const verified = loadPersistedAuthProfileStore(void 0, { database });
		const verificationFailure = formatMissingAuthProfileSqliteVerification({
			expected: next,
			importedProfileIds,
			loaded: verified
		});
		const mismatched = [...importedProfileIds].filter((profileId) => {
			if (existing.profiles[profileId]) return false;
			return !isDeepStrictEqual(verified?.profiles[profileId], imported.profiles[profileId]);
		});
		if (verificationFailure || mismatched.length > 0 || !verified) throw new Error("legacy OAuth import verification failed");
		return verified;
	}, { env: params.env });
	receipt.expectedProfileSha256 = Object.fromEntries([...importedProfileIds].map((profileId) => [profileId, digestAuthProfileMigrationValue(loaded.profiles[profileId])]));
	finalizeAuthProfileMigrationSource(receipt, parsed.rejectedEntries > 0 ? "archived-unparsed" : "completed", { sourceLocked: true });
	importedProfileIds.forEach((id) => params.result.migratedProfileIds.add(id));
	if (parsed.rejectedEntries > 0) params.result.warnings.push(`Imported valid shared OAuth entries and archived ${parsed.rejectedEntries} rejected entr${parsed.rejectedEntries === 1 ? "y" : "ies"} for manual recovery.`);
	params.result.changes.push(`Migrated shared legacy OAuth credentials into the shared-main SQLite owner (archive: ${shortenHomePath(receipt.archivePath)}).`);
}
/**
* Imports legacy auth profile JSON and state files into the per-agent SQLite store.
*
* JSON files are verified and atomically renamed to timestamped archives only after import.
* OAuth profiles that still depend on missing sidecar secrets migrate as unavailable ref-only rows.
*/
async function maybeMigrateAuthProfileJsonStoresToSqlite(params) {
	const now = params.now ?? Date.now;
	const env = params.env ?? process.env;
	const loadMigratedStore = params.deps?.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore;
	const candidates = listAuthProfileSqliteMigrationCandidates(params.cfg, env);
	const oauthPath = resolveLegacyOAuthPath(env);
	const recoverableSources = /* @__PURE__ */ new Set();
	let recoveryApproved = false;
	const recoverCompleted = (receipt) => {
		const candidate = candidates.find((entry) => [
			entry.authPath,
			entry.legacyPath,
			...entry.agentDir === void 0 ? [oauthPath] : []
		].includes(receipt.sourcePath));
		if (!candidate) return false;
		const raw = parseAuthProfileMigrationSource(receipt);
		normalizeLegacyApiKeyAliasesForImport(raw);
		const imported = receipt.sourcePath === oauthPath ? coerceLegacyOAuthFile(raw).store : coercePersistedAuthProfileStore(raw) ?? coerceLegacyFlatAuthProfileStore(raw);
		if (!imported || !Object.values(imported.profiles).some(hasUsableAuthProfileCredential)) return false;
		const inspection = candidate.agentDir ? inspectPersistedAuthProfileStoreRaw(candidate.agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
		const rawTarget = inspection.status === "missing" ? { profiles: {} } : inspection.status === "readable" ? inspection.raw : null;
		if (!isRecord(rawTarget) || !isRecord(rawTarget.profiles)) return false;
		const existing = rawTarget.profiles;
		if (Object.entries(imported.profiles).some(([id, credential]) => Object.hasOwn(existing, id) || (isLegacyOpenAICodexProfileId(id) || isLegacyOpenAICodexProvider(credential.provider)) && Object.entries(existing).some(([key, entry]) => key.startsWith("openai:") || isRecord(entry) && entry.provider === OPENAI_PROVIDER_ID))) return false;
		recoverableSources.add(receipt.sourcePath);
		return recoveryApproved;
	};
	const warnings = [];
	const migratedProfileIds = /* @__PURE__ */ new Set();
	const blockedProfileIds = /* @__PURE__ */ new Set();
	const resume = () => {
		try {
			return resumePendingAuthProfileMigrationArchives(env, recoverCompleted);
		} catch (err) {
			params.openAICodexAuthProfileIdMap?.forEach((_target, id) => blockedProfileIds.add(id));
			warnings.push(`Could not finalize an interrupted auth profile archive; legacy sources were left for recovery: ${String(err)}`);
			return [];
		}
	};
	const resumedChanges = resume();
	const configStore = coerceLegacyConfigAuthProfileStore(params.cfg);
	const hasLegacyOAuth = fs.existsSync(oauthPath) || recoverableSources.has(oauthPath);
	const candidateSources = (candidate) => [
		candidate.authPath,
		candidate.statePath,
		candidate.legacyPath
	].filter((pathname) => fs.existsSync(pathname) || recoverableSources.has(pathname) || configStore && isDefaultAgentCandidate(candidate, params.cfg, env) && pathname === candidate.authPath);
	const detected = candidates.filter((candidate) => candidateSources(candidate).length > 0);
	const result = {
		detected: [...detected.flatMap(candidateSources), ...hasLegacyOAuth ? [oauthPath] : []],
		changes: resumedChanges,
		migratedProfileIds,
		blockedProfileIds,
		warnings
	};
	if (warnings.length > 0 || detected.length === 0 && !hasLegacyOAuth) return result;
	note([
		...detected.map((candidate) => {
			const hasCredentials = fs.existsSync(candidate.authPath) || fs.existsSync(candidate.legacyPath);
			const providers = readLegacyAuthProfileProviders([{
				kind: "auth-profiles",
				path: candidate.authPath
			}, ...fs.existsSync(candidate.legacyPath) ? [{
				kind: "legacy-auth",
				path: candidate.legacyPath
			}] : []]);
			return `- ${shortenHomePath(candidate.authPath)} / ${shortenHomePath(candidate.statePath)}${hasCredentials ? ` (affected providers: ${providers?.join(", ") ?? "unknown; provider scope unavailable"})` : ""}`;
		}),
		...hasLegacyOAuth ? [`- ${shortenHomePath(oauthPath)} (shared-main owner)`] : [],
		`- ${formatCliCommand("openclaw doctor --fix")} imports legacy auth profile JSON into SQLite, verifies it, records a receipt, and archives the original bytes.`
	].join("\n"), "Auth profile SQLite migration");
	if (!await params.prompter.confirmAutoFix({
		message: "Migrate auth profile JSON files into SQLite now?",
		initialValue: true
	})) return result;
	if (recoverableSources.size > 0) {
		recoveryApproved = true;
		result.changes.push(...resume());
		if (warnings.length > 0) return result;
	}
	const openAIProfileIdMap = params.openAICodexAuthProfileIdMap ?? collectOpenAICodexAuthProfileStoreIdMap({
		cfg: params.cfg,
		env
	});
	for (const candidate of detected) {
		const configOwnerCandidate = isDefaultAgentCandidate(candidate, params.cfg, env);
		const candidateProfileIds = /* @__PURE__ */ new Set();
		let completed = false;
		let releaseSources;
		try {
			const candidateSourcePaths = [
				candidate.authPath,
				candidate.statePath,
				candidate.legacyPath
			];
			for (const pathname of candidateSourcePaths) fs.mkdirSync(path.dirname(pathname), { recursive: true });
			releaseSources = acquireAuthProfileMigrationSourceLocks(candidateSourcePaths);
			const targetDatabasePath = resolveMigrationTargetDatabasePath(candidate.agentDir, env);
			const sharedStateTarget = candidate.agentDir === void 0 && resolveSharedAuthStoreOwnership(env).location === "state-db";
			const transactionAgentDir = sharedStateTarget || candidate.agentDir !== void 0 ? candidate.agentDir : resolveSharedMainAuthAgentDir(env);
			let sourceReceipts = candidateSourcePaths.filter(fs.existsSync).map((pathname) => prepareAuthProfileSourceReceipt({
				pathname,
				targetDatabasePath,
				targetTable: pathname === candidate.statePath ? "auth_profile_state" : sharedStateTarget ? "auth_profile_stores" : "auth_profile_store",
				targetStoreKey: sharedStateTarget ? "shared" : "primary",
				now,
				env
			}));
			sourceReceipts = sourceReceipts.filter((receipt) => !archivePreviouslyMigratedAuthProfileSource(receipt, result));
			assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
			if (sourceReceipts.length === 0 && !configStore) continue;
			const receiptByPath = new Map(sourceReceipts.map((receipt) => [receipt.sourcePath, receipt]));
			const rawStore = parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.authPath)));
			const importedAliasProfileIds = new Set(isRecord(rawStore) && isRecord(rawStore.profiles) ? Object.keys(rawStore.profiles) : []);
			const rawState = parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.statePath)));
			for (const id of [
				...importedAliasProfileIds,
				...collectRawAuthRotationProfileIds(rawStore),
				...collectRawAuthRotationProfileIds(rawState),
				...configOwnerCandidate && configStore ? Object.keys(configStore.profiles) : []
			]) candidateProfileIds.add(id);
			const openAIProviderRepair = canonicalizeLegacyAuthStore(rawStore, rawState, openAIProfileIdMap);
			const unresolvedSidecarProfileIds = new Set(collectUnresolvedLegacyOAuthSidecarProfileIds(rawStore));
			const unresolvedSidecarWarning = unresolvedSidecarProfileIds.size > 0 ? `Migrated ${unresolvedSidecarProfileIds.size} legacy OAuth sidecar profile${unresolvedSidecarProfileIds.size === 1 ? "" : "s"} from ${shortenHomePath(candidate.authPath)} into SQLite as configured-unavailable without credentials; re-authenticate ${unresolvedSidecarProfileIds.size === 1 ? "this profile" : "these profiles"} to restore access.` : void 0;
			const awsSdkMarkerStore = isRecord(rawStore) && isRecord(rawStore.profiles) ? resolveAwsSdkAuthProfileMarkerStore(candidate) : null;
			if (awsSdkMarkerStore && isRecord(rawStore)) removeAwsSdkProfileMarkers(rawStore, awsSdkMarkerStore.profiles.map((profile) => profile.profileId));
			normalizeLegacyApiKeyAliasesForImport(rawStore);
			const maybeCanonicalStore = coercePersistedAuthProfileStore(rawStore) ?? coerceLegacyFlatAuthProfileStore(rawStore) ?? null;
			const canonicalStore = hasImportableAuthProfileStore(maybeCanonicalStore) ? maybeCanonicalStore : null;
			const configCanonicalStore = configStore && configOwnerCandidate ? structuredClone(configStore) : null;
			if (configCanonicalStore) {
				Object.keys(configCanonicalStore.profiles).forEach((id) => importedAliasProfileIds.add(id));
				canonicalizeLegacyAuthStore(configCanonicalStore, null, openAIProfileIdMap);
			}
			const legacyStore = coerceLegacyAuthStore(parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.legacyPath))));
			const state = coerceAuthProfileState(rawState);
			if (!canonicalStore && !configCanonicalStore && !legacyStore && !hasAuthProfileState(state) && !awsSdkMarkerStore) {
				if (sourceReceipts.length > 0) {
					const archived = sourceReceipts.map((receipt) => {
						finalizeAuthProfileMigrationSource(receipt, "archived-unparsed", { sourceLocked: true });
						return receipt.archivePath;
					});
					result.warnings.push(unresolvedSidecarWarning ?? `Archived unparseable auth profile input without import for ${shortenHomePath(candidate.authPath)} (${archived.map(shortenHomePath).join(", ")}).`);
					continue;
				}
				result.warnings.push(`Left auth profile JSON in place for ${shortenHomePath(candidate.authPath)} because no importable auth profiles or state were found.`);
				continue;
			}
			const existing = loadAuthProfileMigrationTargetStore(candidate.agentDir, loadMigratedStore, void 0, env);
			const existingProfileIds = new Set(Object.keys(existing.profiles));
			const existingState = coerceAuthProfileState(existing);
			let next = { ...existing };
			let verifiedStore = existing;
			const importedProfileIds = /* @__PURE__ */ new Set();
			const legacyAsStore = {
				version: 1,
				profiles: {}
			};
			if (legacyStore) {
				applyLegacyAuthStore(legacyAsStore, legacyStore);
				Object.keys(legacyAsStore.profiles).forEach((id) => importedAliasProfileIds.add(id));
				Object.keys(legacyAsStore.profiles).forEach((id) => candidateProfileIds.add(id));
				canonicalizeLegacyAuthStore(legacyAsStore, null, openAIProfileIdMap);
			}
			for (const imported of [
				legacyAsStore,
				canonicalStore,
				configCanonicalStore
			]) {
				if (!imported) continue;
				Object.keys(imported.profiles).forEach((id) => importedProfileIds.add(id));
				const fromConfig = imported === configCanonicalStore;
				next = mergeImportedAuthProfiles({
					store: next,
					profiles: imported.profiles,
					existingProfileIds: fromConfig ? new Set(Object.keys(next.profiles)) : existingProfileIds,
					replaceExistingWithoutCredential: fromConfig
				});
				if (imported === canonicalStore) {
					next.version = Math.max(next.version, imported.version);
					next = mergeImportedAuthProfileState({
						store: next,
						state: coerceAuthProfileState(imported),
						existingState
					});
				}
			}
			if (hasAuthProfileState(state)) next = mergeImportedAuthProfileState({
				store: next,
				state,
				existingState
			});
			if (canonicalStore || configCanonicalStore || legacyStore || hasAuthProfileState(state)) {
				const stateProfileIds = [
					state,
					canonicalStore,
					configCanonicalStore
				].flatMap((store) => store ? collectAuthProfileStateProfileIds(coerceAuthProfileState(store)) : []);
				try {
					assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
					verifiedStore = runWithAuthAliasMigrationReceipt(recordAuthAliasMigration({
						profileIdMap: openAIProfileIdMap,
						stores: [{
							databasePath: targetDatabasePath,
							store: existing,
							migratedStore: next
						}],
						importedProfileIds: importedAliasProfileIds,
						sources: sourceReceipts.filter((receipt) => receipt.sourcePath !== path.resolve(candidate.statePath)).map((receipt) => ({
							path: receipt.sourcePath,
							sha256: receipt.sourceSha256
						})),
						env
					}), env, () => runAuthProfileWriteTransaction(transactionAgentDir, (database, owner) => {
						const authoritative = loadAuthProfileMigrationTargetStore(candidate.agentDir, loadMigratedStore, database);
						if (!isDeepStrictEqual(authoritative, existing)) throw new Error("canonical auth profile store changed during legacy migration");
						saveAuthProfileStoreWithPreparedOwner(next, candidate.agentDir, {
							filterExternalAuthProfiles: false,
							preserveStateProfileIds: stateProfileIds,
							syncExternalCli: false
						}, database, owner);
						const loaded = loadMigratedStore(candidate.agentDir, { database });
						const persistedStores = {
							isMainStore: resolveMigrationTargetDatabasePath(candidate.agentDir, env) === resolveSharedAuthStorePath(env),
							localStore: loaded,
							mainStore: resolveMigrationTargetDatabasePath(candidate.agentDir, env) === resolveSharedAuthStorePath(env) ? loaded : loadPersistedSharedAuthProfileStore(env)
						};
						const dedupedToMainProfileIds = new Set([...importedProfileIds].filter((profileId) => {
							const credential = next.profiles[profileId];
							return credential !== void 0 && !loaded?.profiles[profileId] && isInheritedMainOAuthCredentialFromStores({
								profileId,
								credential,
								persistedStores
							});
						}));
						const verifiableProfileIds = new Set([...importedProfileIds].filter((profileId) => !dedupedToMainProfileIds.has(profileId)));
						const verificationFailure = formatMissingAuthProfileSqliteVerification({
							expected: next,
							importedProfileIds: verifiableProfileIds,
							loaded
						});
						const mismatchedCredential = [...verifiableProfileIds].some((profileId) => {
							if (existingProfileIds.has(profileId)) return false;
							return !isDeepStrictEqual(loaded?.profiles[profileId], next.profiles[profileId]);
						});
						if (verificationFailure || mismatchedCredential || !loaded) throw new AuthProfileMigrationVerificationError(verificationFailure);
						return loaded;
					}, { env }));
				} catch (error) {
					if (!(error instanceof AuthProfileMigrationVerificationError)) throw error;
					result.warnings.push(`Left auth profile JSON in place for ${shortenHomePath(candidate.authPath)} because SQLite verification failed${error.detail ? ` (${error.detail})` : ""}.`);
					continue;
				}
			}
			const expectedProfileSha256 = Object.fromEntries([...importedProfileIds].flatMap((profileId) => {
				const profileValue = verifiedStore.profiles[profileId];
				return profileValue ? [[profileId, digestAuthProfileMigrationValue(profileValue)]] : [];
			}));
			const expectedStateSha256 = digestAuthProfileMigrationValue(candidate.agentDir ? readPersistedAuthProfileStateRaw(candidate.agentDir) : readPersistedSharedAuthProfileStateRaw(env));
			const canonicalSourceCarriesState = canonicalStore ? hasAuthProfileState(coerceAuthProfileState(canonicalStore)) : false;
			for (const receipt of sourceReceipts) {
				if (receipt.targetTable !== "auth_profile_state") receipt.expectedProfileSha256 = expectedProfileSha256;
				if (receipt.targetTable === "auth_profile_state" || receipt.sourcePath === candidate.authPath && canonicalSourceCarriesState) receipt.expectedStateSha256 = expectedStateSha256;
			}
			assertAuthProfileMigrationSourcesUnchanged(candidate, sourceReceipts);
			const archives = sourceReceipts.map((receipt) => {
				finalizeAuthProfileMigrationSource(receipt, "completed", { sourceLocked: true });
				return receipt.archivePath;
			});
			for (const id of [
				...importedAliasProfileIds,
				...importedProfileIds,
				...collectAuthProfileStateProfileIds(state),
				...collectAuthProfileStateProfileIds(coerceAuthProfileState(canonicalStore)),
				...collectAuthProfileStateProfileIds(coerceAuthProfileState(configCanonicalStore))
			]) migratedProfileIds.add(id);
			if (configStore && configOwnerCandidate && stripImportedConfigAuthProfileCredentials(params.cfg, configStore)) result.configChanged = true;
			if (awsSdkMarkerStore) {
				const configProfiles = ensureConfigAuthProfiles(params.cfg);
				for (const marker of awsSdkMarkerStore.profiles) configProfiles[marker.profileId] = {
					provider: marker.provider,
					mode: "aws-sdk",
					...marker.email ? { email: marker.email } : {},
					...marker.displayName ? { displayName: marker.displayName } : {}
				};
				result.configChanged = true;
			}
			const archiveText = archives.length > 0 ? `archive${archives.length === 1 ? "" : "s"}: ${archives.map(shortenHomePath).join(", ")}` : "no legacy JSON backup needed";
			result.changes.push(`Migrated auth profile JSON for ${shortenHomePath(candidate.authPath)} into SQLite (${archiveText}).`);
			completed = true;
			if (unresolvedSidecarWarning) result.warnings.push(unresolvedSidecarWarning);
			if (openAIProviderRepair !== null) result.changes.push(`Migrated retired auth profile identifiers in ${shortenHomePath(candidate.authPath)}.`);
			if (awsSdkMarkerStore) result.changes.push(`Moved aws-sdk profile metadata from ${shortenHomePath(candidate.authPath)} to auth.profiles before removing the legacy auth profile JSON.`);
		} catch (err) {
			if (candidateProfileIds.size === 0) openAIProfileIdMap.forEach((_target, id) => blockedProfileIds.add(id));
			result.warnings.push(`Failed to migrate auth profile JSON for ${shortenHomePath(candidate.authPath)}: ${String(err)}`);
		} finally {
			if (!completed) candidateProfileIds.forEach((id) => blockedProfileIds.add(id));
			releaseSources?.();
		}
	}
	const sharedMainAgentDir = resolveSharedMainAuthAgentDir(env);
	const sharedMainCredentialSourceRemains = [resolveLegacyAuthProfilesPath(sharedMainAgentDir), resolveLegacyFlatAuthPath(sharedMainAgentDir)].some((pathname) => fs.existsSync(pathname));
	if (hasLegacyOAuth && sharedMainCredentialSourceRemains) result.warnings.push(`Deferred shared legacy OAuth migration until higher-priority shared-main credential sources are resolved by ${formatCliCommand("openclaw doctor --fix")}.`);
	else if (hasLegacyOAuth) try {
		migrateLegacyOAuthFile({
			oauthPath,
			env,
			now,
			result
		});
	} catch (err) {
		openAIProfileIdMap.forEach((_target, id) => blockedProfileIds.add(id));
		result.warnings.push(`Failed to migrate shared legacy OAuth credentials; the source was left in place: ${String(err)}`);
	}
	clearRuntimeAuthProfileStoreSnapshots();
	clearAuthProfileMigrationDiagnostics();
	return result;
}
function resolveAwsSdkAuthProfileMarkerStore(candidate) {
	if (!fs.existsSync(candidate.authPath)) return null;
	const raw = loadJsonFileThroughSymlink(candidate.authPath);
	if (!isRecord(raw) || !isRecord(raw.profiles)) return null;
	const markers = [];
	for (const [profileId, value] of Object.entries(raw.profiles)) {
		if (!isRecord(value)) continue;
		if ((readNonBlankString(value.type) ?? readNonBlankString(value.mode)) !== "aws-sdk") continue;
		const provider = readNonBlankString(value.provider) ?? extractProviderFromProfileId(profileId);
		if (!provider || !isSafeLegacyProviderKey(provider)) continue;
		markers.push({
			profileId,
			provider,
			...readNonBlankString(value.email) ? { email: readNonBlankString(value.email) } : {},
			...readNonBlankString(value.displayName) ? { displayName: readNonBlankString(value.displayName) } : {}
		});
	}
	return markers.length > 0 ? {
		...candidate,
		raw,
		profiles: markers
	} : null;
}
function ensureConfigAuthProfiles(config) {
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : {};
	if (root.auth !== auth) root.auth = auth;
	if (!isRecord(auth.profiles)) auth.profiles = {};
	return auth.profiles;
}
function removeAwsSdkProfileMarkers(raw, profileIds) {
	if (!isRecord(raw.profiles)) return;
	for (const profileId of profileIds) delete raw.profiles[profileId];
}
const LEGACY_OPENAI_CODEX_PROVIDER_ID = "openai-codex";
const OPENAI_PROVIDER_ID = "openai";
function isLegacyOpenAICodexProvider(value) {
	return typeof value === "string" && value.trim().toLowerCase() === LEGACY_OPENAI_CODEX_PROVIDER_ID;
}
function isLegacyOpenAICodexProfileId(profileId) {
	return profileId.trim().toLowerCase().startsWith(`${LEGACY_OPENAI_CODEX_PROVIDER_ID}:`);
}
function canonicalLegacyAuthProvider(provider) {
	const normalized = provider.trim().toLowerCase();
	if (isLegacyOpenAICodexProvider(normalized)) return OPENAI_PROVIDER_ID;
	const legacy = resolveLegacyRuntimeModelProviderAlias(normalized);
	return legacy?.legacyProvider === normalized ? legacy.provider : normalized;
}
function legacyAuthProfileTarget(profileId) {
	if (profileId === "openai:codex-cli") return {
		provider: OPENAI_PROVIDER_ID,
		suffix: "default"
	};
	const separator = profileId.indexOf(":");
	if (separator <= 0) return null;
	const provider = profileId.slice(0, separator).trim().toLowerCase();
	const canonical = canonicalLegacyAuthProvider(provider);
	return canonical === provider ? null : {
		provider: canonical,
		suffix: profileId.slice(separator + 1).trim() || "default"
	};
}
function isLegacyAuthProfileId(profileId) {
	return legacyAuthProfileTarget(profileId) !== null;
}
function collectRawAuthRotationProfileIds(raw) {
	if (!isRecord(raw)) return [];
	const ids = [];
	for (const field of [
		"order",
		"lastGood",
		"usageStats"
	]) {
		const entries = raw[field];
		if (!isRecord(entries)) continue;
		if (field === "usageStats") {
			ids.push(...Object.keys(entries));
			continue;
		}
		for (const value of Object.values(entries)) for (const id of Array.isArray(value) ? value : [value]) if (typeof id === "string") ids.push(id);
	}
	return ids;
}
function isReadableAuthAliasState(raw) {
	if (!isRecord(raw)) return false;
	return (raw.order === void 0 || isRecord(raw.order) && Object.values(raw.order).every((ids) => Array.isArray(ids) && ids.every((id) => typeof id === "string"))) && (raw.lastGood === void 0 || isRecord(raw.lastGood) && Object.values(raw.lastGood).every((id) => typeof id === "string")) && (raw.usageStats === void 0 || isRecord(raw.usageStats) && Object.values(raw.usageStats).every(isRecord));
}
function isReadableAuthAliasStore(raw) {
	if (!isRecord(raw) || !isRecord(raw.profiles) || !isReadableAuthAliasState(raw)) return false;
	return Object.values(raw.profiles).every((value) => parseLegacyCredentialEntry(value) !== null);
}
function allocateLegacyAuthProfileId(legacyProfileId, occupied) {
	const target = legacyAuthProfileTarget(legacyProfileId);
	if (!target) throw new Error(`Not a retired auth profile id: ${legacyProfileId}`);
	const { provider, suffix } = target;
	const direct = `${provider}:${suffix}`;
	if (!occupied.has(direct)) {
		occupied.add(direct);
		return direct;
	}
	const chatgpt = `${provider}:${isLegacyOpenAICodexProfileId(legacyProfileId) ? "chatgpt" : "cli"}-${suffix}`;
	if (!occupied.has(chatgpt)) {
		occupied.add(chatgpt);
		return chatgpt;
	}
	for (let index = 2;; index += 1) {
		const candidate = `${chatgpt}-${index}`;
		if (!occupied.has(candidate)) {
			occupied.add(candidate);
			return candidate;
		}
	}
}
function canonicalizeLegacyAuthProfileEntries(profiles, options) {
	const occupied = new Set(Object.keys(profiles).filter((id) => !isLegacyAuthProfileId(id)));
	const reservedMappedIds = new Set(options?.profileIdMap?.values() ?? []);
	const profileIdMap = /* @__PURE__ */ new Map();
	let changed = false;
	for (const [profileId, rawProfile] of Object.entries({ ...profiles })) {
		if (!isRecord(rawProfile)) continue;
		const target = legacyAuthProfileTarget(profileId);
		const legacyId = target !== null;
		const provider = typeof rawProfile.provider === "string" ? canonicalLegacyAuthProvider(rawProfile.provider) : target?.provider;
		const legacyProvider = typeof rawProfile.provider === "string" && provider !== rawProfile.provider.trim().toLowerCase();
		if (!legacyId && !legacyProvider) continue;
		if (target && provider !== target.provider) continue;
		if (options?.preserveUnmappedLegacyIds && !options.profileIdMap?.has(profileId)) continue;
		const mappedProfileId = options?.profileIdMap?.get(profileId);
		const nextProfileId = mappedProfileId && !occupied.has(mappedProfileId) ? mappedProfileId : legacyId ? allocateLegacyAuthProfileId(profileId, /* @__PURE__ */ new Set([...occupied, ...reservedMappedIds])) : profileId;
		occupied.add(nextProfileId);
		const nextProfile = {
			...rawProfile,
			provider
		};
		if (nextProfileId !== profileId) {
			delete profiles[profileId];
			profileIdMap.set(profileId, nextProfileId);
		}
		profiles[nextProfileId] = nextProfile;
		changed = true;
	}
	return {
		profileIdMap,
		changed
	};
}
function rewriteMappedAuthProfileRefs(config, profileIdMap) {
	let changed = false;
	const rewrite = (owner, key) => {
		if (!isRecord(owner) || typeof owner[key] !== "string") return;
		let profileId = owner[key];
		if (key === "apiKey") profileId = normalizeSecretInput(profileId);
		else if (key === "authProfileId") profileId = profileId.trim();
		const replacement = profileIdMap.get(profileId);
		if (replacement && replacement !== owner[key]) {
			owner[key] = replacement;
			changed = true;
		}
	};
	for (const provider of Object.values(config.models?.providers ?? {})) rewrite(provider, "apiKey");
	for (const model of config.tools?.media?.models ?? []) {
		rewrite(model, "profile");
		rewrite(model, "preferredProfile");
	}
	for (const server of Object.values(config.mcp?.servers ?? {})) rewrite(server.oauth, "authProfileId");
	const agents = [config.agents?.defaults, ...listMutableCodexRouteAgentEntries(config).map(({ agent }) => agent)];
	for (const agent of agents) {
		if (!isRecord(agent) || !isRecord(agent.models)) continue;
		for (const model of Object.values(agent.models)) rewrite(isRecord(model) ? model.agentRuntime : void 0, "authProfileId");
	}
	return changed;
}
function canonicalizeLegacyAuthOrder(auth, profileIdMap, options) {
	if (!isRecord(auth.order)) return false;
	const order = auth.order;
	const before = structuredClone(order);
	const occupied = /* @__PURE__ */ new Set([...Object.values(order).flatMap((entries) => Array.isArray(entries) ? entries.filter((entry) => typeof entry === "string" && !isLegacyAuthProfileId(entry)) : []), ...profileIdMap.values()]);
	const unresolved = (entry) => typeof entry !== "string" || Boolean(options?.preserveUnmappedLegacyIds && !profileIdMap.has(entry));
	const rewrite = (entry) => {
		if (typeof entry !== "string") return entry;
		const mapped = profileIdMap.get(entry);
		if (mapped) return mapped;
		if (!isLegacyAuthProfileId(entry) || options?.preserveUnmappedLegacyIds) return entry;
		const allocated = allocateLegacyAuthProfileId(entry, occupied);
		profileIdMap.set(entry, allocated);
		return allocated;
	};
	const aliases = /* @__PURE__ */ new Map();
	for (const provider of Object.keys(order)) {
		const canonical = canonicalLegacyAuthProvider(provider);
		if (canonical !== provider && Array.isArray(order[provider])) {
			const group = aliases.get(canonical) ?? [];
			group.push(provider);
			aliases.set(canonical, group);
		}
	}
	for (const [provider, entries] of Object.entries(order)) if (Array.isArray(entries) && ![...aliases.values()].some((group) => group.includes(provider))) order[provider] = entries.map(rewrite);
	for (const [canonical, providers] of aliases) {
		const canonicalEntries = order[canonical];
		if (canonicalEntries !== void 0 && !Array.isArray(canonicalEntries)) continue;
		const moved = [];
		let hasResolvedAlias = false;
		for (const provider of providers) {
			const entries = order[provider];
			if (!Array.isArray(entries)) continue;
			const retained = entries.filter(unresolved);
			const resolved = entries.filter((entry) => !unresolved(entry));
			if (resolved.length > 0 || entries.length === 0) {
				hasResolvedAlias = true;
				moved.push(...resolved.map(rewrite));
			}
			if (retained.length > 0) order[provider] = retained;
			else delete order[provider];
		}
		if (hasResolvedAlias) {
			const combined = Array.isArray(canonicalEntries) && canonicalEntries.length === 0 ? [] : [...moved, ...canonicalEntries ?? []];
			order[canonical] = [...new Set(combined)];
		}
	}
	return !isDeepStrictEqual(before, order);
}
function renameMappedProfileIdKeys(record, profileIdMap) {
	let changed = false;
	for (const [key, value] of Object.entries({ ...record })) {
		const nextKey = profileIdMap.get(key);
		if (!nextKey || nextKey === key) continue;
		delete record[key];
		record[nextKey] = value;
		changed = true;
	}
	return changed;
}
function canonicalizeLegacyAuthLastGood(record, profileIdMap, options) {
	const before = structuredClone(record);
	for (const [provider, value] of Object.entries(before)) {
		const canonical = canonicalLegacyAuthProvider(provider);
		const mapped = typeof value === "string" ? profileIdMap.get(value) : void 0;
		if (canonical !== provider && options?.preserveUnmappedLegacyIds && mapped === void 0) continue;
		if (canonical !== provider) {
			delete record[provider];
			if (Object.hasOwn(before, canonical)) continue;
		}
		record[canonical] = mapped ?? value;
	}
	return !isDeepStrictEqual(before, record);
}
/**
* Canonicalizes config references for retired provider and profile identifiers.
*
* The optional map lets config and store repairs share deterministic profile ids when both surfaces
* contain the same legacy profile.
*/
function maybeRepairOpenAICodexAuthConfig(cfg, options) {
	let config = structuredClone(cfg);
	const root = config;
	const auth = isRecord(root.auth) ? root.auth : void 0;
	const profileIdMap = new Map(options?.profileIdMap);
	let changed = false;
	if (isRecord(auth?.profiles)) {
		const rewrite = canonicalizeLegacyAuthProfileEntries(auth.profiles, {
			profileIdMap,
			preserveUnmappedLegacyIds: options?.profileIdMap !== void 0
		});
		for (const [from, to] of rewrite.profileIdMap) profileIdMap.set(from, to);
		changed ||= rewrite.changed;
	}
	if (auth) {
		const orderChanged = canonicalizeLegacyAuthOrder(auth, profileIdMap, { preserveUnmappedLegacyIds: options?.profileIdMap !== void 0 });
		changed ||= orderChanged;
	}
	if (profileIdMap.size > 0 && rewriteMappedAuthProfileRefs(config, profileIdMap)) changed = true;
	if (profileIdMap.size > 0) {
		const models = repairRetiredConfigModelRefs(config, ({ modelRef }) => repairModelRefAuthProfile(modelRef, profileIdMap));
		config = models.config;
		changed ||= models.changes.length > 0;
		const pluginsChanged = rewritePluginAuthProfileRefs(config, profileIdMap);
		changed ||= pluginsChanged;
	}
	if (!changed) return {
		config,
		changes: [],
		warnings: []
	};
	return {
		config,
		changes: ["Migrated legacy auth profile config to canonical providers."],
		warnings: []
	};
}
function canonicalizeLegacyAuthStore(raw, stateRaw, profileIdMap) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) {
		if (isRecord(stateRaw)) canonicalizeLegacyAuthRotationState(stateRaw, new Map(profileIdMap));
		return null;
	}
	const rewrite = canonicalizeLegacyAuthProfileEntries(raw.profiles, {
		profileIdMap,
		preserveUnmappedLegacyIds: true
	});
	const effectiveProfileIdMap = new Map([...profileIdMap, ...rewrite.profileIdMap]);
	const rotation = canonicalizeLegacyAuthRotationState(raw, effectiveProfileIdMap);
	if (isRecord(stateRaw)) canonicalizeLegacyAuthRotationState(stateRaw, effectiveProfileIdMap);
	return rewrite.changed || rotation ? rewrite.profileIdMap.size : null;
}
function canonicalizeLegacyAuthRotationState(auth, profileIdMap) {
	const options = { preserveUnmappedLegacyIds: true };
	const orderChanged = canonicalizeLegacyAuthOrder(auth, profileIdMap, options);
	const usageChanged = isRecord(auth.usageStats) ? renameMappedProfileIdKeys(auth.usageStats, profileIdMap) : false;
	const lastGoodChanged = isRecord(auth.lastGood) ? canonicalizeLegacyAuthLastGood(auth.lastGood, profileIdMap, options) : false;
	return orderChanged || usageChanged || lastGoodChanged;
}
/** Normalize already-SQLite stores under their current owners after legacy import. */
function maybeRepairLegacyAuthProfileStores(params) {
	const env = params.env ?? process.env;
	const warnings = [];
	const targets = /* @__PURE__ */ new Map([[resolveSharedAuthStorePath(env), void 0]]);
	const mainAgentDir = resolveSharedMainAuthAgentDir(env);
	const mainDatabasePath = resolveAuthProfileDatabasePath(mainAgentDir);
	if (!targets.has(mainDatabasePath)) targets.set(mainDatabasePath, mainAgentDir);
	const candidates = listAuthProfileRepairCandidates(params.cfg, env, (pathname) => {
		warnings.push(`Skipped auth-profile alias migration because ${shortenHomePath(pathname)} is unavailable.`);
	});
	for (const candidate of candidates) {
		if (!candidate.agentDir) continue;
		const databasePath = resolveAuthProfileDatabasePath(candidate.agentDir);
		if (!targets.has(databasePath)) targets.set(databasePath, candidate.agentDir);
	}
	const planned = [];
	for (const [databasePath, agentDir] of targets) {
		const store = agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
		const state = agentDir ? inspectPersistedAuthProfileStateRaw(agentDir) : inspectPersistedSharedAuthProfileStateRaw(env);
		if (store.status === "unreadable" || state.status === "unreadable" || agentDir !== void 0 && inspectAuthDatabaseFiles(agentDir) === "unreadable" || store.status === "readable" && !isReadableAuthAliasStore(store.raw) || state.status === "readable" && !isReadableAuthAliasState(state.raw)) {
			warnings.push(`Skipped auth-profile alias migration because ${shortenHomePath(databasePath)} is unreadable or invalid.`);
			continue;
		}
		if (store.status === "readable" || state.status === "readable") planned.push({
			databasePath,
			agentDir,
			store: store.status === "readable" ? store.raw : null,
			state: state.status === "readable" ? state.raw : null
		});
	}
	const unresolvedProfileIds = new Set(Object.entries(params.cfg.auth?.profiles ?? {}).filter(([id, profile]) => !params.profileIdMap.has(id) && (isLegacyAuthProfileId(id) || canonicalLegacyAuthProvider(profile.provider) !== profile.provider)).map(([id]) => id));
	for (const target of planned) {
		for (const id of [...collectRawAuthRotationProfileIds(target.store), ...collectRawAuthRotationProfileIds(target.state)]) if (isLegacyAuthProfileId(id) && !params.profileIdMap.has(id)) unresolvedProfileIds.add(id);
		if (!isRecord(target.store) || !isRecord(target.store.profiles)) continue;
		for (const [profileId, profile] of Object.entries(target.store.profiles)) {
			const provider = isRecord(profile) && typeof profile.provider === "string" ? profile.provider.trim().toLowerCase() : void 0;
			if (!params.profileIdMap.has(profileId) && (isLegacyAuthProfileId(profileId) || provider !== void 0 && canonicalLegacyAuthProvider(provider) !== provider)) unresolvedProfileIds.add(profileId);
		}
	}
	for (const profileId of unresolvedProfileIds) warnings.push(`Kept auth profile ${profileId} unchanged because its provider realm or identity is unresolved.`);
	if (params.profileIdMap.size === 0) return {
		changes: [],
		warnings,
		profileIdMap: params.profileIdMap
	};
	for (const target of planned) {
		const profiles = isRecord(target.store) && isRecord(target.store.profiles) ? target.store.profiles : {};
		const occupied = /* @__PURE__ */ new Set([
			...Object.keys(profiles),
			...collectRawAuthRotationProfileIds(target.store),
			...collectRawAuthRotationProfileIds(target.state)
		]);
		for (const [from, to] of params.profileIdMap) if (from !== to && occupied.has(from) && occupied.has(to)) return {
			changes: [],
			warnings: [...warnings, `Skipped stale auth-profile alias mapping for ${from}; the target is occupied.`],
			profileIdMap: /* @__PURE__ */ new Map()
		};
	}
	const recovery = recoverAuthAliasMigration({
		stores: planned,
		env,
		archivedMappings: recoverArchivedAuthProfileMappings({
			candidates,
			env
		})
	});
	for (const from of params.profileIdMap.keys()) if (recovery.blocked.has(from)) return {
		changes: [],
		warnings: [...warnings, `Kept auth profile ${from} unchanged because its recorded account changed; reconcile the migration before retrying.`],
		profileIdMap: /* @__PURE__ */ new Map()
	};
	const migrated = planned.map((target) => {
		const migratedStore = structuredClone(target.store);
		const migratedState = structuredClone(target.state);
		canonicalizeLegacyAuthStore(migratedStore, migratedState, params.profileIdMap);
		return Object.assign(target, {
			migratedStore,
			migratedState
		});
	});
	const receiptSha256 = recordAuthAliasMigration({
		profileIdMap: params.profileIdMap,
		stores: migrated,
		env
	});
	const locked = [];
	const changes = [];
	const migrate = (index, sharedDatabase) => {
		const nextTarget = migrated[index];
		if (nextTarget) {
			runAuthProfileWriteTransaction(nextTarget.agentDir, (database) => {
				const store = readPersistedAuthProfileStoreRaw(nextTarget.agentDir, database);
				const state = readPersistedAuthProfileStateRaw(nextTarget.agentDir, database);
				if (!isDeepStrictEqual(store, nextTarget.store) || !isDeepStrictEqual(state, nextTarget.state)) throw new Error("auth profile store or rotation state changed during alias migration");
				locked.push({
					database,
					target: nextTarget
				});
				migrate(index + 1, sharedDatabase);
			}, { env });
			return;
		}
		const renamedLinks = renameUserProfileAuthLinks(params.profileIdMap, {
			env,
			database: sharedDatabase
		});
		if (renamedLinks > 0) changes.push(`Updated renamed auth profiles in ${renamedLinks} personal account selection record(s).`);
		for (const { database, target } of locked) {
			const store = target.migratedStore;
			const state = target.migratedState;
			const storeChanged = !isDeepStrictEqual(store, target.store);
			const stateChanged = !isDeepStrictEqual(state, target.state);
			if (storeChanged) writePersistedAuthProfileStoreRaw(store, target.agentDir, database);
			if (stateChanged) writePersistedAuthProfileStateRaw(state, target.agentDir, database);
			if (storeChanged || stateChanged) changes.push(`Migrated stored auth profile aliases in ${shortenHomePath(target.databasePath)}.`);
		}
	};
	runWithAuthAliasMigrationReceipt(receiptSha256, env, (database) => migrate(0, database));
	if (changes.length > 0) clearRuntimeAuthProfileStoreSnapshots();
	return {
		changes,
		warnings,
		profileIdMap: params.profileIdMap
	};
}
function recoverArchivedAuthProfileMappings(params) {
	const recovered = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	const agentDirs = [resolveSharedMainAuthAgentDir(params.env), ...params.candidates.flatMap((candidate) => candidate.agentDir ? [candidate.agentDir] : [])];
	const archives = listLegacyAuthProfileArchives({
		agentDirs,
		env: params.env
	}).filter((archive) => archive.kind === "auth-profiles" || archive.kind === "legacy-auth");
	for (const candidate of params.candidates) {
		const canonicalProfiles = (candidate.agentDir ? loadPersistedAuthProfileStore(candidate.agentDir) : loadPersistedSharedAuthProfileStore(params.env))?.profiles;
		if (!canonicalProfiles) continue;
		const sourcePaths = [candidate.authPath, resolveLegacyFlatAuthPath(path.dirname(candidate.authPath))];
		for (const archive of archives) {
			const sourcePath = sourcePaths.find((source) => archive.path.startsWith(`${source}.migrated-`));
			if (!sourcePath) continue;
			try {
				const sourceBytes = fs.readFileSync(archive.path);
				const sourceSha256 = createHash("sha256").update(sourceBytes).digest("hex");
				const sourceKey = `auth-profile-v2:${createHash("sha256").update(`${path.resolve(sourcePath)}\0${sourceSha256}`).digest("hex")}`;
				const receipt = readLegacyMigrationReceipt(sourceKey, params.env);
				if (!receipt?.removedSource || receipt.sourceSha256 !== sourceSha256) continue;
				const report = JSON.parse(receipt.reportJson);
				const sharedStateTarget = candidate.agentDir === void 0 && resolveSharedAuthStoreOwnership(params.env).location === "state-db";
				if (!isRecord(report) || report.format !== "auth-profile-json-to-sqlite-v2" || report.completionStatus !== "completed" || report.targetTable !== (sharedStateTarget ? "auth_profile_stores" : "auth_profile_store") || typeof report.archivePath !== "string" || path.resolve(report.archivePath) !== path.resolve(archive.path) || typeof report.targetDatabasePath !== "string" || path.resolve(report.targetDatabasePath) !== path.resolve(resolveMigrationTargetDatabasePath(candidate.agentDir, params.env)) || !isRecord(report.expectedProfileSha256)) continue;
				const archivedStore = JSON.parse(sourceBytes.toString("utf8"));
				const sourceStore = coercePersistedAuthProfileStore(archivedStore) ?? coerceLegacyFlatAuthProfileStore(archivedStore);
				if (!sourceStore) continue;
				for (const [legacyProfileId, rawCredential] of Object.entries(sourceStore.profiles)) {
					const target = legacyAuthProfileTarget(legacyProfileId);
					if (!target) continue;
					const archivedCredential = parseLegacyCredentialEntry({
						...rawCredential,
						provider: target.provider
					}, target.provider);
					if (!archivedCredential) continue;
					const matches = Object.entries(report.expectedProfileSha256).flatMap(([canonicalProfileId, expectedSha256]) => {
						const credential = canonicalProfiles[canonicalProfileId];
						return typeof expectedSha256 === "string" && credential?.provider === target.provider && (archivedCredential.type === "oauth" && credential.type === "oauth" ? hasMatchingOAuthIdentity(archivedCredential, credential) || areOAuthCredentialsEquivalent(archivedCredential, credential) : isDeepStrictEqual(archivedCredential, credential)) ? [canonicalProfileId] : [];
					});
					if (matches.length !== 1) continue;
					const canonicalProfileId = matches[0];
					const previous = recovered.get(legacyProfileId);
					if (previous && previous.profileId !== canonicalProfileId) {
						recovered.delete(legacyProfileId);
						ambiguous.add(legacyProfileId);
					} else if (!ambiguous.has(legacyProfileId)) recovered.set(legacyProfileId, {
						profileId: canonicalProfileId,
						origins: [...previous?.origins ?? [], {
							sourcePath: path.resolve(sourcePath),
							sourceSha256,
							databasePath: resolveMigrationTargetDatabasePath(candidate.agentDir, params.env)
						}]
					});
				}
			} catch {}
		}
	}
	return recovered;
}
/** Collects collision-safe retired profile ids across config, SQLite, and legacy agent stores. */
function collectOpenAICodexAuthProfileStoreIdMap(params) {
	const env = params.env ?? process.env;
	const occupied = /* @__PURE__ */ new Set(["openai:codex-cli"]);
	const eligible = /* @__PURE__ */ new Set();
	const blocked = /* @__PURE__ */ new Set();
	const profileIdMap = /* @__PURE__ */ new Map();
	const sqliteStores = [];
	let incompleteCensus = false;
	const candidates = listAuthProfileRepairCandidates(params.cfg, env, () => {
		incompleteCensus = true;
	});
	if (incompleteCensus) return profileIdMap;
	const configuredProviders = new Set(Object.keys(params.cfg.models?.providers ?? {}).map((provider) => provider.trim().toLowerCase()));
	const collectReferences = (raw) => {
		for (const id of collectRawAuthRotationProfileIds(raw)) occupied.add(id);
	};
	const collectProfiles = (raw) => {
		if (!isRecord(raw) || !isRecord(raw.profiles)) return false;
		for (const [profileId, value] of Object.entries(raw.profiles)) {
			occupied.add(profileId);
			const target = legacyAuthProfileTarget(profileId);
			const provider = isRecord(value) && typeof value.provider === "string" ? value.provider.trim().toLowerCase() : void 0;
			const canonical = provider === void 0 ? void 0 : canonicalLegacyAuthProvider(provider);
			if (!target && canonical === provider) continue;
			const legacyPrefix = profileId.slice(0, profileId.indexOf(":")).trim().toLowerCase();
			const changesRealm = provider !== canonical;
			const explicitRealm = isRecord(value) && changesRealm && [
				"enterpriseUrl",
				"tokenEndpoint",
				"deviceAuthorizationEndpoint",
				"issuer"
			].some((field) => value[field] !== void 0);
			if (provider === void 0 || canonical === void 0 || target !== null && target.provider !== canonical || target !== null && configuredProviders.has(legacyPrefix) || changesRealm && configuredProviders.has(provider) || explicitRealm) blocked.add(profileId);
			else eligible.add(profileId);
		}
		collectReferences(raw);
		return true;
	};
	collectProfiles({
		profiles: params.cfg.auth?.profiles ?? {},
		order: params.cfg.auth?.order
	});
	const sqliteTargets = /* @__PURE__ */ new Map([[resolveSharedAuthStorePath(env), void 0]]);
	for (const agentDir of [resolveSharedMainAuthAgentDir(env), ...candidates.flatMap((candidate) => candidate.agentDir ? [candidate.agentDir] : [])]) {
		const databasePath = resolveAuthProfileDatabasePath(agentDir);
		if (!sqliteTargets.has(databasePath)) sqliteTargets.set(databasePath, agentDir);
	}
	for (const [databasePath, agentDir] of sqliteTargets) {
		if (agentDir && inspectAuthDatabaseFiles(agentDir) === "unreadable") return profileIdMap;
		const inspection = agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
		const state = agentDir ? inspectPersistedAuthProfileStateRaw(agentDir) : inspectPersistedSharedAuthProfileStateRaw(env);
		if (inspection.status === "unreadable" || state.status === "unreadable") return profileIdMap;
		if (inspection.status === "missing") sqliteStores.push({
			databasePath,
			store: null
		});
		if (inspection.status === "readable") {
			sqliteStores.push({
				databasePath,
				store: inspection.raw
			});
			if (!collectProfiles(inspection.raw)) return profileIdMap;
			if (!isReadableAuthAliasStore(inspection.raw) && isRecord(inspection.raw) && isRecord(inspection.raw.profiles)) Object.keys(inspection.raw.profiles).forEach((id) => blocked.add(id));
		}
		if (state.status === "readable") {
			if (!isRecord(state.raw)) return profileIdMap;
			collectReferences(state.raw);
			if (!isReadableAuthAliasState(state.raw) && inspection.status === "readable" && isRecord(inspection.raw) && isRecord(inspection.raw.profiles)) Object.keys(inspection.raw.profiles).forEach((id) => blocked.add(id));
		}
	}
	for (const candidate of candidates) {
		if (fs.existsSync(candidate.authPath) && !collectProfiles(loadJsonFileThroughSymlink(candidate.authPath))) return profileIdMap;
		const legacyPath = resolveLegacyFlatAuthPath(path.dirname(candidate.authPath));
		if (fs.existsSync(legacyPath)) {
			const legacy = coerceLegacyAuthStore(loadJsonFileThroughSymlink(legacyPath));
			if (!legacy) return profileIdMap;
			const store = {
				version: 1,
				profiles: {}
			};
			applyLegacyAuthStore(store, legacy);
			collectProfiles(store);
		}
		const statePath = resolveLegacyAuthStatePath(path.dirname(candidate.authPath));
		if (fs.existsSync(statePath)) {
			const raw = loadJsonFileThroughSymlink(statePath);
			if (!isRecord(raw)) return profileIdMap;
			collectReferences(raw);
		}
	}
	const archivedMappings = recoverArchivedAuthProfileMappings({
		candidates,
		env
	});
	const recovery = recoverAuthAliasMigration({
		stores: sqliteStores,
		env,
		archivedMappings
	});
	for (const profileId of recovery.blocked) blocked.add(profileId);
	for (const [from, to] of recovery.recovered) if (!blocked.has(from)) {
		profileIdMap.set(from, to);
		if (archivedMappings.get(from)?.profileId === to) params.recoveredProfileIds?.add(from);
	}
	for (const profileId of [...eligible].toSorted((left, right) => left.localeCompare(right))) if (!blocked.has(profileId) && !profileIdMap.has(profileId)) profileIdMap.set(profileId, isLegacyAuthProfileId(profileId) ? allocateLegacyAuthProfileId(profileId, occupied) : profileId);
	for (const [legacyProfileId, archive] of archivedMappings) if (sqliteStores.every(({ databasePath, store }) => !isRecord(store) || !isRecord(store.profiles) || store.profiles[archive.profileId] === void 0 || archive.origins.some((origin) => origin.databasePath === databasePath)) && !profileIdMap.has(legacyProfileId) && !blocked.has(legacyProfileId)) {
		profileIdMap.set(legacyProfileId, archive.profileId);
		params.recoveredProfileIds?.add(legacyProfileId);
	}
	return profileIdMap;
}
//#endregion
//#region src/commands/doctor/auth-profile-repair.ts
/** Complete only verified imports or explicitly requested auth repairs through the same owners. */
async function repairAuthProfileMigration(params) {
	const env = params.env ?? process.env;
	const planned = params.profileIdMap ?? collectOpenAICodexAuthProfileStoreIdMap({
		cfg: params.cfg,
		env
	});
	const config = structuredClone(params.cfg);
	const imported = await maybeMigrateAuthProfileJsonStoresToSqlite({
		cfg: config,
		env,
		prompter: { confirmAutoFix: params.prompter.confirmAutoFix },
		openAICodexAuthProfileIdMap: planned
	});
	const recoveredProfileIds = /* @__PURE__ */ new Set();
	const recovered = imported.detected.length === 0 ? collectOpenAICodexAuthProfileStoreIdMap({
		cfg: config,
		env,
		recoveredProfileIds
	}) : /* @__PURE__ */ new Map();
	const authorized = new Map([...planned, ...[...recovered].filter(([from]) => recoveredProfileIds.has(from))].filter(([from, to]) => !imported.blockedProfileIds.has(from) && !imported.blockedProfileIds.has(to) && (params.prompter.shouldRepair || recoveredProfileIds.has(from) && imported.detected.length === 0 || imported.migratedProfileIds.has(from) || imported.migratedProfileIds.has(to))));
	const aliases = params.prompter.shouldRepair || authorized.size > 0 ? maybeRepairLegacyAuthProfileStores({
		cfg: config,
		env,
		profileIdMap: authorized
	}) : {
		profileIdMap: authorized,
		changes: [],
		warnings: []
	};
	const repaired = maybeRepairOpenAICodexAuthConfig(config, { profileIdMap: aliases.profileIdMap });
	return {
		config: repaired.config,
		changes: [...repaired.changes, ...imported.configChanged ? ["Auth profile SQLite migration updated auth.profiles."] : []],
		storeChanges: [...imported.changes, ...aliases.changes],
		warnings: [
			...imported.warnings,
			...aliases.warnings,
			...repaired.warnings
		],
		profileIdMap: aliases.profileIdMap
	};
}
//#endregion
export { collectOpenAICodexAuthProfileStoreIdMap as n, repairAuthProfileMigration as t };
