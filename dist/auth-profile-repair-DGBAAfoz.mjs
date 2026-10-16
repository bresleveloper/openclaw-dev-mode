import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, l as isStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { a as coerceSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as recordLegacyMigrationSource, i as readLegacyMigrationReceiptFromDatabase, o as recordLegacyMigrationReceipt, r as readLegacyMigrationReceipt, s as recordLegacyMigrationRun } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { l as acquireFileLockSyncWithRetry } from "./update-managed-service-handoff-database-BzJlW6Xp.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { M as collectConfiguredModelRefs } from "./runtime-snapshot-DYptB0Cf.mjs";
import { n as OPENAI_PROVIDER_ID } from "./openai-routing-8cBNhOzI.mjs";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-B6LYojZK.mjs";
import { c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir, o as resolveSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { a as readAuthProfileJsonCellText, i as inspectAuthProfileJsonCell } from "./sqlite-json-P6pbG3re.mjs";
import { O as listLegacyAuthProfileArchives, a as inspectPersistedAuthProfileStoreRaw, b as writePersistedAuthProfileStateRaw, d as readPersistedAuthProfileStoreRaw, f as readPersistedSharedAuthProfileStateRaw, g as resolveAuthProfileDatabasePath, i as inspectPersistedAuthProfileStateRaw, j as resolveLegacyOAuthPath, l as readAuthProfileStateJsonTextReadOnly, o as inspectPersistedSharedAuthProfileStateRaw, p as readPersistedSharedAuthProfileStoreRaw, s as inspectPersistedSharedAuthProfileStoreRaw, u as readPersistedAuthProfileStateRaw, v as runAuthProfileWriteTransaction, x as writePersistedAuthProfileStoreRaw } from "./sqlite-CW8wNN4G.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { a as loadPersistedSharedAuthProfileStore, f as coerceAuthProfileState, r as loadPersistedAuthProfileStore } from "./persisted-BVyWmvfF.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-5C1aYJVp.mjs";
import { n as hasMatchingOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CFtD6sCU.mjs";
import { d as renameUserProfileAuthLinks } from "./user-model-accounts-sYn17idc.mjs";
import { i as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-CSLjByUx.mjs";
import { _ as normalizeLegacyAuthProfileFields, f as applyLegacyAuthStore, g as hasUsableAuthProfileCredential, h as coerceLegacyFlatCredential, m as coerceLegacyAuthStore, o as clearAuthProfileMigrationDiagnostics, p as coerceLegacyAuthProfileStore, u as readLegacyAuthProfileProviders, v as normalizeLegacyCredentialFields, y as parseLegacyCredentialEntry } from "./legacy-source-diagnostic-Bj7ByR_x.mjs";
import { x as isInheritedMainOAuthCredentialFromStores } from "./runtime-snapshot-owner-Dm2mqUH2.mjs";
import { f as saveAuthProfileStoreWithPreparedOwner } from "./store-runtime-CzCCJ_Oe.mjs";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { r as stripImportedConfigAuthProfileCredentials, t as ensureConfigAuthProfiles } from "./doctor-auth-profile-config-GX4pYfLQ.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-c6hBDowh.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { a as resolveLegacyAuthStatePath, n as listAuthProfileRepairCandidates, o as resolveLegacyFlatAuthPath, r as listReferencedLegacyOAuthSidecarPaths } from "./doctor-auth-legacy-paths-CYXKyNhX.mjs";
import { n as resolveLegacyRuntimeModelProviderAlias } from "./legacy-runtime-model-providers-DkyokuxH.mjs";
import { n as repairModelRefAuthProfile, r as repairRetiredConfigModelRefs } from "./retired-model-ref-repair-Dkf-HCPp.mjs";
import { t as inspectAuthDatabaseFiles } from "./stale-auth-order-store-ByZIxc8C.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
	const releaseAll = () => {
		for (const release of releases.toReversed()) release();
	};
	try {
		for (const sourcePath of [...new Set(sourcePaths.map((entry) => path.resolve(entry)))].toSorted()) releases.push(acquireFileLockSyncWithRetry(sourcePath));
	} catch (error) {
		releaseAll();
		throw error;
	}
	return releaseAll;
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
		if (receipt.expectedStateSha256 && digestAuthProfileMigrationValue(readTarget("state")) !== receipt.expectedStateSha256) throw new Error("auth profile migration target verification failed");
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
			afterSha256: string(),
			beforeCanonicalFieldsSha256: string().optional(),
			afterCanonicalFieldsSha256: string().optional()
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
	const previousMappings = previousReceipt ? receiptSchema.parse(JSON.parse(previousReceipt.reportJson)).mappings : [];
	if (params.importedProfileIds) {
		for (const { from } of previousMappings) if (params.importedProfileIds.has(from) && !params.profileIdMap.has(from)) throw new Error(`Recorded auth account ${from} could not be verified; its import source was preserved.`);
	}
	const mappings = [];
	for (const [from, to] of params.profileIdMap) {
		if (from === to) continue;
		const credentials = params.stores.flatMap(({ databasePath, store, migratedStore }) => {
			const sourceProfiles = profiles(store);
			const before = sourceProfiles[from];
			const after = profiles(migratedStore)[to];
			const current = before ?? sourceProfiles[to];
			const historical = previousMappings.filter((entry) => entry.from === from && entry.to === to).flatMap((entry) => entry.credentials).find((expected) => expected.databasePath === databasePath && current !== void 0 && (before === void 0 ? [expected.afterSha256, expected.afterCanonicalFieldsSha256] : [expected.beforeSha256, expected.beforeCanonicalFieldsSha256]).includes(digestAuthProfileMigrationValue(current)));
			if (after === void 0 || before === void 0 && !historical && !(params.importedProfileIds?.has(from) && params.sources?.length)) return [];
			if (params.importedProfileIds?.has(from) && before !== void 0 && (!isRecord(before) || !isRecord(after) || digestAuthProfileMigrationValue({
				...before,
				provider: after.provider
			}) !== digestAuthProfileMigrationValue(after))) throw new Error(`Legacy auth input conflicts with the existing account ${from}; its source was preserved.`);
			if (historical) {
				if (before === void 0 && (!isRecord(current) || digestAuthProfileMigrationValue(normalizeLegacyCredentialFields(current)) !== digestAuthProfileMigrationValue(after))) throw new Error(`Recorded auth account ${from} changed during migration; its source was preserved.`);
				return [{
					...historical,
					...before !== void 0 ? { beforeCanonicalFieldsSha256: digestAuthProfileMigrationValue(before) } : {},
					afterCanonicalFieldsSha256: digestAuthProfileMigrationValue(after)
				}];
			}
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
	if (mappings.length === 0 && (!previousReceipt || !params.normalizeCredentialFields)) return previousReceipt?.sourceSha256 ?? void 0;
	return runOpenClawStateWriteTransaction(({ db, path }) => {
		const prior = readLegacyMigrationReceiptFromDatabase(db, SOURCE_KEY);
		const previous = prior ? receiptSchema.parse(JSON.parse(prior.reportJson)).mappings : [];
		const records = new Map(params.normalizeCredentialFields ? [] : previous.map((entry) => [digestAuthProfileMigrationValue(entry), entry]));
		for (const entry of params.normalizeCredentialFields ? previous : []) {
			const normalized = structuredClone(entry);
			for (const expected of normalized.credentials) {
				const store = params.stores.find((candidate) => candidate.databasePath === expected.databasePath);
				if (!store) continue;
				const before = profiles(store.store);
				const after = profiles(store.migratedStore);
				const normalizedFingerprint = (id, fingerprints) => {
					const value = before[id];
					return isRecord(value) && after[id] !== void 0 && fingerprints.includes(digestAuthProfileMigrationValue(value)) && digestAuthProfileMigrationValue(normalizeLegacyCredentialFields(value)) === digestAuthProfileMigrationValue(after[id]) ? digestAuthProfileMigrationValue(after[id]) : void 0;
				};
				const beforeCanonicalFieldsSha256 = normalizedFingerprint(entry.from, [expected.beforeSha256, expected.beforeCanonicalFieldsSha256]);
				const afterCanonicalFieldsSha256 = normalizedFingerprint(entry.to, [expected.afterSha256, expected.afterCanonicalFieldsSha256]);
				if (beforeCanonicalFieldsSha256) expected.beforeCanonicalFieldsSha256 = beforeCanonicalFieldsSha256;
				if (afterCanonicalFieldsSha256) expected.afterCanonicalFieldsSha256 = afterCanonicalFieldsSha256;
			}
			records.set(digestAuthProfileMigrationValue(normalized), normalized);
		}
		for (const entry of mappings) records.set(digestAuthProfileMigrationValue(entry), entry);
		const report = {
			format: SOURCE_KEY,
			mappings: [...records.values()]
		};
		const reportJson = JSON.stringify(report);
		const sourceSha256 = digestAuthProfileMigrationValue(report);
		if (prior?.sourceSha256 === sourceSha256 && prior.reportJson === reportJson) return sourceSha256;
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
			return before !== void 0 && after === void 0 && [expected.beforeSha256, expected.beforeCanonicalFieldsSha256].includes(digestAuthProfileMigrationValue(before)) || before === void 0 && after !== void 0 && [expected.afterSha256, expected.afterCanonicalFieldsSha256].includes(digestAuthProfileMigrationValue(after)) || before === void 0 && after === void 0 && expected.beforeSha256 === null && mapping.sources !== void 0 && mapping.sources.length > 0 && mapping.sources.every((source) => {
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
//#region src/commands/doctor/auth-alias-transforms.ts
const LEGACY_OPENAI_CODEX_PROVIDER_ID = "openai-codex";
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
//#endregion
//#region src/commands/doctor-auth-flat-profiles.ts
function resolveMigrationTargetDatabasePath(agentDir, env = process.env) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
}
function listAuthProfileMigrationTargets(candidates, env) {
	const targets = /* @__PURE__ */ new Map([[resolveSharedAuthStorePath(env), void 0]]);
	for (const agentDir of [resolveSharedMainAuthAgentDir(env), ...candidates.flatMap((candidate) => candidate.agentDir ? [candidate.agentDir] : [])]) {
		const databasePath = resolveAuthProfileDatabasePath(agentDir);
		if (!targets.has(databasePath)) targets.set(databasePath, agentDir);
	}
	return targets;
}
var AuthProfileMigrationVerificationError = class extends Error {
	constructor(detail) {
		super("auth profile SQLite verification failed");
		this.detail = detail;
		this.name = "AuthProfileMigrationVerificationError";
	}
};
function isSafeLegacyProviderKey(key) {
	return key.trim().length > 0 && !isBlockedObjectKey(key);
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
		if (!mode) continue;
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
	const canonicalStore = coerceLegacyAuthProfileStore(store);
	return canonicalStore && Object.keys(canonicalStore.profiles).length > 0 ? canonicalStore : null;
}
function isDefaultAgentCandidate(candidate, cfg, env) {
	return candidate.agentDir === void 0 || path.resolve(candidate.agentDir) === path.resolve(resolveLegacyInheritedAuthAgentDir(cfg, env));
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
/**
* Imports legacy auth profile JSON and state files into the per-agent SQLite store.
*
* JSON files are verified and atomically renamed to timestamped archives only after import.
* OAuth profiles that still depend on missing sidecar secrets migrate as unavailable ref-only rows.
*/
async function maybeMigrateAuthProfileJsonStoresToSqlite(params) {
	const now = params.now ?? Date.now;
	const env = params.env ?? process.env;
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(env, params.cfg));
	const loadMigratedStore = params.deps?.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore;
	const candidates = listAuthProfileSqliteMigrationCandidates(params.cfg, env);
	const oauthPath = resolveLegacyOAuthPath(env);
	const recoverableSources = /* @__PURE__ */ new Set();
	let recoveryApproved = false;
	const recoverCompleted = (receipt) => {
		const candidate = candidates.find((entry) => [entry.authPath, entry.legacyPath].includes(receipt.sourcePath));
		if (!candidate) return false;
		const raw = parseAuthProfileMigrationSource(receipt);
		normalizeLegacyAuthProfileFields(raw);
		const imported = coerceLegacyAuthProfileStore(raw) ?? coerceLegacyFlatAuthProfileStore(raw);
		if (!imported || !Object.values(imported.profiles).some(hasUsableAuthProfileCredential)) return false;
		const inspection = candidate.agentDir ? inspectPersistedAuthProfileStoreRaw(candidate.agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
		const rawTarget = inspection.status === "missing" ? { profiles: {} } : inspection.status === "readable" ? inspection.raw : null;
		if (!isRecord(rawTarget) || !isRecord(rawTarget.profiles)) return false;
		const existing = rawTarget.profiles;
		if (Object.entries(imported.profiles).some(([id, credential]) => Object.hasOwn(existing, id) || (isLegacyOpenAICodexProfileId(id) || isLegacyOpenAICodexProvider(credential.provider)) && Object.entries(existing).some(([key, entry]) => key.startsWith("openai:") || isRecord(entry) && entry.provider === "openai"))) return false;
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
	const candidateSources = (candidate) => [
		candidate.authPath,
		candidate.statePath,
		candidate.legacyPath
	].filter((pathname) => fs.existsSync(pathname) || recoverableSources.has(pathname) || configStore && isDefaultAgentCandidate(candidate, params.cfg, env) && pathname === candidate.authPath);
	const detected = candidates.filter((candidate) => candidateSources(candidate).length > 0);
	const result = {
		detected: detected.flatMap(candidateSources),
		changes: resumedChanges,
		migratedProfileIds,
		blockedProfileIds,
		warnings
	};
	if (warnings.length > 0) return result;
	if (fs.existsSync(oauthPath)) {
		result.detected.push(oauthPath);
		warnings.push(`Pre-June OAuth credentials at ${shortenHomePath(oauthPath)} were left unchanged. Install OpenClaw 2026.9.5 and run ${formatCliCommand("openclaw doctor --fix")} before upgrading to latest; see https://docs.openclaw.ai/install/updating#upgrading-very-old-versions.`);
	}
	if (detected.length === 0) return result;
	note([...detected.map((candidate) => {
		const hasCredentials = fs.existsSync(candidate.authPath) || fs.existsSync(candidate.legacyPath);
		const providers = readLegacyAuthProfileProviders([{
			kind: "auth-profiles",
			path: candidate.authPath
		}, ...fs.existsSync(candidate.legacyPath) ? [{
			kind: "legacy-auth",
			path: candidate.legacyPath
		}] : []]);
		return `- ${shortenHomePath(candidate.authPath)} / ${shortenHomePath(candidate.statePath)}${hasCredentials ? ` (affected providers: ${providers?.join(", ") ?? "unknown; provider scope unavailable"})` : ""}`;
	}), `- ${formatCliCommand("openclaw doctor --fix")} imports legacy auth profile JSON into SQLite, verifies it, records a receipt, and archives the original bytes.`].join("\n"), "Auth profile SQLite migration");
	if (!await params.prompter.confirmAutoFix({
		message: "Migrate auth profile JSON files into SQLite now?",
		initialValue: true
	})) return result;
	if (recoverableSources.size > 0) {
		recoveryApproved = true;
		const warningCount = warnings.length;
		result.changes.push(...resume());
		if (warnings.length > warningCount) return result;
	}
	const requestedProfileIdMap = params.openAICodexAuthProfileIdMap ?? collectOpenAICodexAuthProfileStoreIdMap({
		cfg: params.cfg,
		env
	});
	const repairedFields = await maybeRepairLegacyAuthProfileStores({
		cfg: params.cfg,
		env,
		profileIdMap: requestedProfileIdMap,
		renameProfileIds: false
	});
	result.changes.push(...repairedFields.changes);
	warnings.push(...repairedFields.warnings);
	const openAIProfileIdMap = repairedFields.profileIdMap;
	for (const [from, to] of requestedProfileIdMap) if (openAIProfileIdMap.get(from) !== to) {
		blockedProfileIds.add(from);
		blockedProfileIds.add(to);
	}
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
			const awsSdkMarkers = isRecord(rawStore) && isRecord(rawStore.profiles) ? readAwsSdkAuthProfileMarkers(candidate) : null;
			if (awsSdkMarkers && isRecord(rawStore)) removeAwsSdkProfileMarkers(rawStore, awsSdkMarkers.map((profile) => profile.profileId));
			const canonicalizedSecretRefs = normalizeLegacyAuthProfileFields(rawStore);
			const maybeCanonicalStore = coerceLegacyAuthProfileStore(rawStore) ?? coerceLegacyFlatAuthProfileStore(rawStore) ?? null;
			const canonicalStore = hasImportableAuthProfileStore(maybeCanonicalStore) ? maybeCanonicalStore : null;
			const configCanonicalStore = configStore && configOwnerCandidate ? structuredClone(configStore) : null;
			if (configCanonicalStore) {
				Object.keys(configCanonicalStore.profiles).forEach((id) => importedAliasProfileIds.add(id));
				canonicalizeLegacyAuthStore(configCanonicalStore, null, openAIProfileIdMap);
			}
			const legacyStore = coerceLegacyAuthStore(parseAuthProfileMigrationSource(receiptByPath.get(path.resolve(candidate.legacyPath))));
			const state = coerceAuthProfileState(rawState);
			if (!canonicalStore && !configCanonicalStore && !legacyStore && !hasAuthProfileState(state) && !awsSdkMarkers) {
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
			if (awsSdkMarkers) {
				const configProfiles = ensureConfigAuthProfiles(params.cfg);
				for (const marker of awsSdkMarkers) configProfiles[marker.profileId] = {
					provider: marker.provider,
					mode: "aws-sdk",
					...marker.email ? { email: marker.email } : {},
					...marker.displayName ? { displayName: marker.displayName } : {}
				};
				result.configChanged = true;
			}
			const archiveText = archives.length > 0 ? `archive${archives.length === 1 ? "" : "s"}: ${archives.map(shortenHomePath).join(", ")}` : "no legacy JSON backup needed";
			result.changes.push(`Migrated auth profile JSON for ${shortenHomePath(candidate.authPath)} into SQLite (${archiveText}).`);
			if (canonicalizedSecretRefs > 0) result.changes.push(`Canonicalized ${canonicalizedSecretRefs} auth SecretRef(s) to source/provider/id; unsupported fields are preserved in the verified source archives (${archiveText}).`);
			completed = true;
			if (unresolvedSidecarWarning) result.warnings.push(unresolvedSidecarWarning);
			if (openAIProviderRepair !== null) result.changes.push(`Migrated retired auth profile identifiers in ${shortenHomePath(candidate.authPath)}.`);
			if (awsSdkMarkers) result.changes.push(`Moved aws-sdk profile metadata from ${shortenHomePath(candidate.authPath)} to auth.profiles before removing the legacy auth profile JSON.`);
		} catch (err) {
			if (candidateProfileIds.size === 0) openAIProfileIdMap.forEach((_target, id) => blockedProfileIds.add(id));
			result.warnings.push(`Failed to migrate auth profile JSON for ${shortenHomePath(candidate.authPath)}: ${String(err)}`);
		} finally {
			if (!completed) candidateProfileIds.forEach((id) => blockedProfileIds.add(id));
			releaseSources?.();
		}
	}
	clearRuntimeAuthProfileStoreSnapshots();
	clearAuthProfileMigrationDiagnostics();
	return result;
}
function readAwsSdkAuthProfileMarkers(candidate) {
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
	return markers.length > 0 ? markers : null;
}
function removeAwsSdkProfileMarkers(raw, profileIds) {
	if (!isRecord(raw.profiles)) return;
	for (const profileId of profileIds) delete raw.profiles[profileId];
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
/** Normalize already-SQLite stores under their current owners after legacy import. */
async function maybeRepairLegacyAuthProfileStores(params) {
	const env = params.env ?? process.env;
	const warnings = [];
	let incompleteCensus = false;
	const candidates = listAuthProfileRepairCandidates(params.cfg, env, (pathname) => {
		incompleteCensus = true;
		warnings.push(`Skipped auth-profile alias migration because ${shortenHomePath(pathname)} is unavailable.`);
	});
	const stores = [];
	const planned = [];
	for (const [databasePath, agentDir] of listAuthProfileMigrationTargets(candidates, env)) {
		let identity;
		try {
			identity = readDatabasePathIdentitySync(databasePath);
		} catch {
			incompleteCensus = true;
			warnings.push(`Skipped auth-profile alias migration because ${shortenHomePath(databasePath)} is unavailable.`);
			continue;
		}
		const store = agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir) : inspectPersistedSharedAuthProfileStoreRaw(env);
		const state = agentDir ? inspectPersistedAuthProfileStateRaw(agentDir) : inspectPersistedSharedAuthProfileStateRaw(env);
		if (store.status === "unreadable" || agentDir !== void 0 && inspectAuthDatabaseFiles(agentDir) === "unreadable" || store.status === "readable" && (!isRecord(store.raw) || !isRecord(store.raw.profiles))) {
			incompleteCensus = true;
			warnings.push(`Skipped auth-profile alias migration because ${shortenHomePath(databasePath)} is unreadable or invalid.`);
			continue;
		}
		stores.push({
			databasePath,
			store: store.status === "readable" ? store.raw : null
		});
		if (store.status === "readable" || state.status === "readable" || state.status === "unreadable") {
			assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
			const canReadRotationState = state.status === "missing" || state.status === "readable" && isReadableAuthAliasState(state.raw);
			const canRenameAliases = (store.status !== "readable" || isReadableAuthAliasStore(store.raw)) && canReadRotationState;
			if (!canRenameAliases) warnings.push(`Skipped auth-profile alias renames because ${shortenHomePath(databasePath)} is unreadable or invalid; supported credential fields can still be repaired.`);
			const unreadableStateJson = state.status === "unreadable" ? readAuthProfileStateJsonTextReadOnly({
				path: databasePath,
				kind: agentDir === void 0 && resolveSharedAuthStoreOwnership(env).location === "state-db" ? "shared-state" : "agent",
				env
			}) : void 0;
			assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
			if (state.status === "unreadable" && unreadableStateJson === void 0) {
				incompleteCensus = true;
				warnings.push(`Skipped auth-profile field repair because ${shortenHomePath(databasePath)} has no stable rotation-state source.`);
				continue;
			}
			planned.push({
				databasePath,
				identity,
				canRenameAliases,
				canReadRotationState,
				agentDir,
				store: store.status === "readable" ? store.raw : null,
				state: state.status === "readable" ? state.raw : null,
				...unreadableStateJson !== void 0 ? { unreadableStateJson } : {}
			});
		}
	}
	const profileIdMap = new Map(incompleteCensus ? [] : params.profileIdMap);
	if (incompleteCensus && params.profileIdMap.size > 0) warnings.push("Deferred auth profile aliases because an owner could not be inspected; repair that owner and rerun Doctor.");
	for (const target of planned) {
		if (target.canRenameAliases) continue;
		const profiles = isRecord(target.store) && isRecord(target.store.profiles) ? target.store.profiles : {};
		const references = /* @__PURE__ */ new Set([
			...Object.keys(profiles),
			...collectRawAuthRotationProfileIds(target.store),
			...collectRawAuthRotationProfileIds(target.state)
		]);
		for (const [from, to] of profileIdMap) if (!target.canReadRotationState || references.has(from) || references.has(to)) {
			profileIdMap.delete(from);
			warnings.push(`Deferred auth profile alias ${from} because ${shortenHomePath(target.databasePath)} cannot safely rename its credential owner.`);
		}
	}
	const recovery = recoverAuthAliasMigration({
		stores,
		env,
		archivedMappings: recoverArchivedAuthProfileMappings({
			candidates,
			env
		})
	});
	const migrationMap = params.renameProfileIds === false ? /* @__PURE__ */ new Map() : profileIdMap;
	const unresolvedProfileIds = new Set(Object.entries(params.cfg.auth?.profiles ?? {}).filter(([id, profile]) => !profileIdMap.has(id) && (isLegacyAuthProfileId(id) || typeof profile.provider === "string" && canonicalLegacyAuthProvider(profile.provider) !== profile.provider)).map(([id]) => id));
	for (const target of planned) {
		for (const id of [...collectRawAuthRotationProfileIds(target.store), ...collectRawAuthRotationProfileIds(target.state)]) if (isLegacyAuthProfileId(id) && !profileIdMap.has(id)) unresolvedProfileIds.add(id);
		if (!isRecord(target.store) || !isRecord(target.store.profiles)) continue;
		for (const [profileId, profile] of Object.entries(target.store.profiles)) {
			const provider = isRecord(profile) && typeof profile.provider === "string" ? profile.provider.trim().toLowerCase() : void 0;
			if (!profileIdMap.has(profileId) && (isLegacyAuthProfileId(profileId) || provider !== void 0 && canonicalLegacyAuthProvider(provider) !== provider)) unresolvedProfileIds.add(profileId);
		}
	}
	for (const profileId of unresolvedProfileIds) warnings.push(`Kept auth profile ${profileId} unchanged because its provider realm or identity is unresolved.`);
	for (const target of planned) {
		const profiles = isRecord(target.store) && isRecord(target.store.profiles) ? target.store.profiles : {};
		const occupied = /* @__PURE__ */ new Set([
			...Object.keys(profiles),
			...collectRawAuthRotationProfileIds(target.store),
			...collectRawAuthRotationProfileIds(target.state)
		]);
		for (const [from, to] of profileIdMap) if (from !== to && occupied.has(to) && (occupied.has(from) || recovery.recovered.get(from) !== to)) {
			profileIdMap.delete(from);
			warnings.push(`Deferred stale auth profile alias ${from}; the target is occupied.`);
		}
	}
	for (const from of profileIdMap.keys()) if (recovery.blocked.has(from)) {
		profileIdMap.delete(from);
		warnings.push(`Kept auth profile ${from} unchanged because its recorded account changed; reconcile the migration before retrying.`);
	}
	const migrated = planned.map((target) => {
		const migratedStore = structuredClone(target.store);
		const migratedState = structuredClone(target.state);
		if (target.canRenameAliases) canonicalizeLegacyAuthStore(migratedStore, migratedState, migrationMap);
		const canonicalizedSecretRefs = normalizeLegacyAuthProfileFields(migratedStore);
		return Object.assign(target, {
			migratedStore,
			migratedState,
			canonicalizedSecretRefs
		});
	});
	const changed = migrated.filter((target) => !isDeepStrictEqual(target.store, target.migratedStore) || !isDeepStrictEqual(target.state, target.migratedState));
	if (changed.length === 0 && migrationMap.size === 0) return {
		changes: [],
		warnings,
		profileIdMap
	};
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const assertTargetCurrent = (target, database) => {
		maintenance?.assertOwnerCurrent();
		assertExistingDatabaseIdentity(target.databasePath, target.identity.key, target.identity.birthtime);
		if (database) {
			const native = "agentId" in database ? readOpenClawAgentDatabaseIdentity(database) : void 0;
			const identity = native ? {
				key: `file:${String(native.identity)}`,
				birthtime: native.birthtime
			} : requireOpenClawStateDatabaseIdentity(database);
			if (identity.key !== target.identity.key) throw new Error("Auth profile database generation changed after backup; retry Doctor.");
			assertExistingDatabaseIdentity(database.path, identity.key, identity.birthtime);
		}
	};
	const changes = [];
	const backupId = randomUUID();
	for (const target of changed) {
		assertTargetCurrent(target);
		const kind = target.agentDir === void 0 && resolveSharedAuthStoreOwnership(env).location === "state-db" ? "shared-state" : "agent";
		const backup = await createVerifiedSqliteSnapshot({
			sourcePath: target.databasePath,
			targetPath: `${target.databasePath}.auth-profile-migration-${backupId}.bak`,
			preserveRowIds: true,
			beforePublish: () => assertTargetCurrent(target),
			validate: (database) => {
				for (const field of ["store", "state"]) {
					if (field === "state" && target.unreadableStateJson !== void 0) {
						if (readAuthProfileJsonCellText(database, "state", kind) !== target.unreadableStateJson) throw new Error("Auth profile backup differs from the planned rotation-state source; retry Doctor.");
						continue;
					}
					const row = inspectAuthProfileJsonCell(database, field, kind);
					if (row.status === "unreadable" || !isDeepStrictEqual(row.status === "readable" ? row.raw : null, target[field])) throw new Error("Auth profile backup differs from the planned source; retry Doctor.");
				}
			}
		});
		assertTargetCurrent(target);
		changes.push(`Saved auth profile migration backup: ${shortenHomePath(backup.path)}.`);
	}
	const assertSourceCurrent = (target, database) => {
		assertTargetCurrent(target, database);
		if (target.unreadableStateJson !== void 0 && readAuthProfileJsonCellText(database.db, "state", "agentId" in database ? "agent" : "shared-state") !== target.unreadableStateJson) throw new Error("Auth profile rotation-state source changed during migration; retry Doctor.");
		if (!isDeepStrictEqual(readPersistedAuthProfileStoreRaw(target.agentDir, database), target.store) || !isDeepStrictEqual(readPersistedAuthProfileStateRaw(target.agentDir, database), target.state)) throw new Error("auth profile store or rotation state changed during alias migration");
	};
	for (const target of migrated) runAuthProfileWriteTransaction(target.agentDir, (database) => assertSourceCurrent(target, database), { env });
	maintenance?.assertOwnerCurrent();
	const receiptSha256 = recordAuthAliasMigration({
		profileIdMap: migrationMap,
		stores: migrated,
		env,
		normalizeCredentialFields: true
	});
	const locked = [];
	const migrate = (index, sharedDatabase) => {
		const nextTarget = migrated[index];
		if (nextTarget) {
			runAuthProfileWriteTransaction(nextTarget.agentDir, (database) => {
				assertSourceCurrent(nextTarget, database);
				locked.push({
					database,
					target: nextTarget
				});
				migrate(index + 1, sharedDatabase);
			}, { env });
			return;
		}
		maintenance?.assertOwnerCurrent();
		const renamedLinks = renameUserProfileAuthLinks(migrationMap, {
			env,
			database: sharedDatabase
		});
		if (renamedLinks > 0) changes.push(`Updated renamed auth profiles in ${renamedLinks} personal account selection record(s).`);
		for (const { database, target } of locked) {
			const store = target.migratedStore;
			const state = target.migratedState;
			const storeChanged = !isDeepStrictEqual(store, target.store);
			const stateChanged = !isDeepStrictEqual(state, target.state);
			if (storeChanged) {
				writePersistedAuthProfileStoreRaw(store, target.agentDir, database);
				if (target.canonicalizedSecretRefs > 0) changes.push(`Canonicalized ${target.canonicalizedSecretRefs} auth SecretRef(s) in ${shortenHomePath(target.databasePath)} to source/provider/id; unsupported fields are preserved in the verified migration backup.`);
			}
			if (stateChanged) writePersistedAuthProfileStateRaw(state, target.agentDir, database);
			if (storeChanged || stateChanged) changes.push(`Migrated stored auth profile aliases in ${shortenHomePath(target.databasePath)}.`);
		}
	};
	runWithAuthAliasMigrationReceipt(receiptSha256, env, (database) => migrate(0, database));
	if (changes.length > 0) clearRuntimeAuthProfileStoreSnapshots();
	return {
		changes,
		warnings,
		profileIdMap
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
		const canonicalProfiles = coerceLegacyAuthProfileStore(candidate.agentDir ? readPersistedAuthProfileStoreRaw(candidate.agentDir) : readPersistedSharedAuthProfileStoreRaw(params.env))?.profiles;
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
				const sourceStore = coerceLegacyAuthProfileStore(archivedStore) ?? coerceLegacyFlatAuthProfileStore(archivedStore);
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
	for (const [databasePath, agentDir] of listAuthProfileMigrationTargets(candidates, env)) {
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
	const aliases = params.prompter.shouldRepair || authorized.size > 0 ? await maybeRepairLegacyAuthProfileStores({
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
export { collectOpenAICodexAuthProfileStoreIdMap as n, maybeRepairLegacyAuthProfileStores as r, repairAuthProfileMigration as t };
