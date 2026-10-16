import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as parseRestartSentinelEnvelope, l as writeRestartSentinelRowSync, o as readRestartSentinelRowSync, s as readRestartSentinelSnapshotSync } from "./restart-sentinel-store-CVYfycIC.mjs";
import { a as readLegacyMigrationRunFromDatabase, i as readLegacyMigrationReceiptFromDatabase, l as resolveLegacyMigrationSourceKey, o as recordLegacyMigrationReceipt, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { o as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { a as legacyMigrationSourceOrClaimMayExist, o as legacyMigrationSourceSnapshotsMatch, s as readLegacyMigrationSourceSnapshot, t as LegacyMigrationSourceClaim } from "./state-migrations.source-snapshot-HiPKFts2.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-BN39kQDu.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { root } from "@openclaw/fs-safe";
//#region src/infra/state-migrations.restart-sentinel-receipts.ts
const MIGRATION_KIND = "legacy-restart-sentinel-json";
const MIGRATION_DECISIONS = [
	"canonical-preserved",
	"canonical-advanced",
	"legacy-update-finalized",
	"invalid-canonical-repaired",
	"legacy-imported",
	"malformed-legacy-discarded",
	"receipt-authoritative"
];
function readReceiptReport(reportJson, expectedSha256) {
	const report = safeParseJson(reportJson);
	if (!isRecord(report) || report.source !== "legacy-restart-sentinel-json" || report.target !== "gateway_restart_sentinel" || typeof report.sourceSha256 !== "string" || !/^[a-f0-9]{64}$/.test(report.sourceSha256) || expectedSha256 !== void 0 && report.sourceSha256 !== expectedSha256 || typeof report.sourceValid !== "boolean" || report.importedRecordCount !== 0 && report.importedRecordCount !== 1 || report.preservedSqliteRecordCount !== 0 && report.preservedSqliteRecordCount !== 1 || typeof report.decision !== "string" || !MIGRATION_DECISIONS.some((decision) => decision === report.decision)) throw new Error("Restart sentinel migration receipt is invalid; preserve it for recovery.");
	return report;
}
/** Preserve the path-wide tombstone recorded by the published v2026.9.5 importer. */
function hasLegacyPathWideReceipt(receipt) {
	const report = readReceiptReport(receipt.reportJson, receipt.sourceSha256);
	if (Object.hasOwn(report, "importedRevision") || Object.hasOwn(report, "pendingHandoffId") || Object.hasOwn(report, "canonicalImport")) return false;
	switch (report.decision) {
		case "canonical-preserved": return report.sourceValid === true && report.importedRecordCount === 0 && report.preservedSqliteRecordCount === 1;
		case "malformed-legacy-discarded": return report.sourceValid === false && report.importedRecordCount === 0 && report.preservedSqliteRecordCount === 0;
		case "receipt-authoritative": return report.importedRecordCount === 0 && report.preservedSqliteRecordCount === 0;
		case "legacy-imported":
		case "invalid-canonical-repaired": return report.sourceValid === true && report.importedRecordCount === 1 && report.preservedSqliteRecordCount === 0;
		default: return false;
	}
}
function hasImportedPendingHandoff(db, sourceKey, handoffId) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_runs").select("id").where("id", ">=", `${sourceKey}:`).where("id", "<", `${sourceKey};`).where("status", "=", "completed").where((eb) => eb.fn("json_extract", [eb.ref("report_json"), eb.val("$.pendingHandoffId")]), "=", handoffId).where((eb) => eb.fn("json_extract", [eb.ref("report_json"), eb.val("$.importedRecordCount")]), "=", 1).where((eb) => eb.fn("json_extract", [eb.ref("report_json"), eb.val("$.source")]), "=", MIGRATION_KIND).where((eb) => eb.fn("json_extract", [eb.ref("report_json"), eb.val("$.target")]), "=", "gateway_restart_sentinel").limit(1)) !== void 0;
}
function sourceRunId(sourceKey, sha256) {
	return `${sourceKey}:${sha256.slice(0, 16)}`;
}
function readSourceDecision(db, sourceKey, sha256) {
	const latest = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
	if (latest?.sourceSha256 === sha256) {
		readReceiptReport(latest.reportJson, sha256);
		return true;
	}
	const run = readLegacyMigrationRunFromDatabase(db, sourceRunId(sourceKey, sha256));
	return (run?.status === "completed" ? readReceiptReport(run.reportJson) : void 0)?.sourceSha256 === sha256;
}
function readCanonicalImport(db, sourceKey, reportJson, revision) {
	const report = reportJson ? safeParseJson(reportJson) : void 0;
	if (!isRecord(report)) return;
	const pointer = report.importedRevision === revision ? {
		sourceSha256: report.sourceSha256,
		revision
	} : report.canonicalImport;
	if (!isRecord(pointer) || pointer.revision !== revision || typeof pointer.sourceSha256 !== "string") return;
	const run = readLegacyMigrationRunFromDatabase(db, sourceRunId(sourceKey, pointer.sourceSha256));
	const original = run?.status === "completed" ? safeParseJson(run.reportJson) : void 0;
	if (!isRecord(original) || original.source !== "legacy-restart-sentinel-json" || original.target !== "gateway_restart_sentinel" || original.sourceSha256 !== pointer.sourceSha256 || original.importedRevision !== revision || original.importedRecordCount !== 1 || typeof original.decision !== "string" || ![
		"legacy-imported",
		"invalid-canonical-repaired",
		"legacy-update-finalized"
	].includes(original.decision)) return;
	return {
		sourceSha256: pointer.sourceSha256,
		revision
	};
}
function canFinalizeImportedUpdate(before, next, canonicalImport) {
	const pending = before.payload;
	return canonicalImport?.revision === before.revision && isPendingControlPlaneUpdateRestartSentinel(pending) && !pending.stats?.runId && Boolean(pending.stats?.handoffId) && next.kind === "update" && !next.stats?.runId && !isPendingControlPlaneUpdateRestartSentinel(next) && next.stats?.handoffId === pending.stats?.handoffId && next.stats?.root === pending.stats?.root && next.sessionKey === pending.sessionKey && next.threadId === pending.threadId && isDeepStrictEqual(next.deliveryContext, pending.deliveryContext);
}
//#endregion
//#region src/infra/state-migrations.restart-sentinel.ts
const LEGACY_RESTART_SENTINEL_FILENAME = "restart-sentinel.json";
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const MAX_LEGACY_RESTART_SENTINEL_BYTES = 4194304;
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
/** Detect the exact retired file for startup preflight and explicit Doctor alike. */
function detectLegacyRestartSentinel(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_RESTART_SENTINEL_FILENAME);
	return {
		sourcePath,
		hasLegacy: legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX)
	};
}
function parseLegacyEnvelope(snapshot) {
	try {
		return parseRestartSentinelEnvelope(JSON.parse(utf8Decoder.decode(snapshot.buffer)));
	} catch {
		return null;
	}
}
function decideAndRecordMigration(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("restart-sentinel-json", params.sourcePath);
	const runId = sourceRunId(sourceKey, params.snapshot.sha256);
	const now = Date.now();
	params.assertCurrent?.();
	return runOpenClawStateWriteTransaction(({ db }) => {
		params.assertCurrent?.();
		const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		if (readSourceDecision(db, sourceKey, params.snapshot.sha256) || receipt && hasLegacyPathWideReceipt(receipt)) return {
			decision: "receipt-authoritative",
			sourceKey
		};
		if (receipt && !receipt.sourceSha256) throw new Error("restart sentinel receipt does not identify its source generation");
		const { state: before, revision } = readRestartSentinelSnapshotSync(db);
		const canonicalImport = revision !== null ? readCanonicalImport(db, sourceKey, receipt?.reportJson, revision) : void 0;
		let decision;
		let importedRevision;
		const finalizesPending = before.kind === "valid" && params.envelope && canFinalizeImportedUpdate(before.sentinel, params.envelope.payload, canonicalImport);
		const handoffId = params.envelope?.payload.stats?.handoffId;
		const consumedPending = before.kind === "missing" && handoffId && hasImportedPendingHandoff(db, sourceKey, handoffId);
		if (params.expectedRevision !== void 0 && revision !== params.expectedRevision) throw new Error("Canonical restart state changed while the legacy notice was prepared.");
		if (consumedPending) decision = "canonical-advanced";
		else if (!params.envelope) decision = "malformed-legacy-discarded";
		else if (before.kind === "valid" && !finalizesPending) decision = "canonical-preserved";
		else {
			const written = writeRestartSentinelRowSync(db, params.envelope.payload);
			importedRevision = written.revision;
			const verified = readRestartSentinelRowSync(db);
			if (verified.kind !== "valid" || verified.sentinel.revision !== written.revision || !isDeepStrictEqual(verified.sentinel.payload, params.envelope.payload)) throw new Error("SQLite verification failed for the restart sentinel migration");
			decision = finalizesPending ? "legacy-update-finalized" : before.kind === "invalid" ? "invalid-canonical-repaired" : "legacy-imported";
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			target: "gateway_restart_sentinel",
			decision,
			sourceSha256: params.snapshot.sha256,
			sourceValid: params.envelope !== null,
			...importedRevision === void 0 ? {} : { importedRevision },
			...importedRevision !== void 0 && params.envelope && isPendingControlPlaneUpdateRestartSentinel(params.envelope.payload) && handoffId ? { pendingHandoffId: handoffId } : {},
			...importedRevision === void 0 ? { canonicalImport: canonicalImport ?? null } : {},
			importedRecordCount: importedRevision === void 0 ? 0 : 1,
			preservedSqliteRecordCount: decision === "canonical-preserved" ? 1 : 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: params.sourcePath,
			targetTable: "gateway_restart_sentinel",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: params.envelope ? 1 : 0,
			runId,
			now,
			reportJson,
			upsert: true
		});
		params.assertCurrent?.();
		return {
			decision,
			sourceKey,
			importedRevision
		};
	}, { env: params.env });
}
async function recoverInterruptedClaim(params) {
	await params.source.recoverLinkedMove();
	if (!await params.source.exists(true)) return;
	if (!await params.source.exists()) {
		const restoreError = await params.source.restore();
		if (restoreError) throw new Error(restoreError);
		return;
	}
	const claimed = await params.source.read(true);
	params.assertCurrent?.();
	if (!runOpenClawStateWriteTransaction(({ db }) => {
		params.assertCurrent?.();
		return readSourceDecision(db, resolveLegacyMigrationSourceKey("restart-sentinel-json", params.source.sourcePath), claimed.sha256);
	}, { env: params.env })) throw new Error("legacy restart sentinel source and interrupted claim both exist");
	params.assertCurrent?.();
	await params.source.remove({ skipSourceCheck: true });
}
const DECISION_CHANGES = {
	"legacy-imported": "Imported the legacy restart sentinel into shared SQLite state.",
	"legacy-update-finalized": "Imported the final outcome of the pending legacy update.",
	"canonical-advanced": "Preserved newer canonical restart state instead of replaying legacy JSON.",
	"invalid-canonical-repaired": "Replaced an invalid SQLite restart sentinel with validated legacy state.",
	"canonical-preserved": "Preserved the canonical SQLite restart sentinel and discarded conflicting legacy JSON.",
	"malformed-legacy-discarded": "Discarded malformed retired restart sentinel JSON without importing it.",
	"receipt-authoritative": "Discarded recreated retired restart sentinel JSON using its migration receipt."
};
async function migrateLegacyRestartSentinelWithCustody(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "restart sentinel",
		includeFilePath: false,
		claimSuffix: DOCTOR_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacyMigrationSourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: snapshotPath,
			maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
			label: "restart sentinel"
		})
	});
	try {
		await recoverInterruptedClaim({
			source,
			env: params.env,
			assertCurrent: params.assertCurrent
		});
	} catch (error) {
		return {
			changes,
			warnings: [`Failed recovering a legacy restart sentinel Doctor claim: ${String(error)}`]
		};
	}
	if (!await source.exists()) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		snapshot = await source.read();
	} catch (error) {
		return {
			changes,
			warnings: [`Failed reading the legacy restart sentinel: ${String(error)}`]
		};
	}
	const envelope = parseLegacyEnvelope(snapshot);
	if (params.updatesOnly && envelope?.payload.kind !== "update") return {
		changes,
		warnings: envelope ? [] : ["Legacy update notice is incomplete or invalid; its source was preserved."]
	};
	try {
		params.assertCurrent?.();
		params.beforeVerify?.();
		const current = await source.read();
		if (!legacyMigrationSourceSnapshotsMatch(current, snapshot)) throw new Error("legacy restart sentinel changed after migration loaded it");
		await source.claim({
			snapshot,
			mismatchMessage: "legacy restart sentinel changed before migration could claim it",
			beforeClaim: () => {
				params.assertCurrent?.();
				params.beforeClaim?.();
			}
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes,
			warnings: [`Failed claiming the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = decideAndRecordMigration({
			env: params.env,
			sourcePath,
			snapshot,
			envelope,
			assertCurrent: params.assertCurrent,
			expectedRevision: params.expectedRevision
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes,
			warnings: [`Failed migrating the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		params.assertCurrent?.();
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "legacy restart sentinel reappeared during migration cleanup",
			remainingMessage: "legacy restart sentinel remains after migration cleanup"
		});
	} catch (error) {
		warnings.push(`Legacy restart sentinel cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings,
			importedRevision: result.importedRevision
		};
	}
	try {
		params.assertCurrent?.();
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env, void 0, params.assertCurrent);
	} catch (error) {
		warnings.push(`Legacy restart sentinel was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	changes.push(DECISION_CHANGES[result.decision]);
	notices.push("Removed retired restart-sentinel.json after recording its migration decision.");
	return {
		changes,
		warnings,
		notices,
		importedRevision: result.importedRevision
	};
}
/** Import or retire the old file under exclusive state ownership. */
async function migrateLegacyRestartSentinel(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "the legacy restart sentinel",
		releaseLabel: "Restart sentinel",
		errorLabel: "Failed reading the legacy restart sentinel",
		retryGuidance: "Stop the Gateway, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
				symlinks: "reject"
			});
			return await migrateLegacyRestartSentinelWithCustody({
				...params,
				detected,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
export { migrateLegacyRestartSentinel as n, migrateLegacyRestartSentinelWithCustody as r, detectLegacyRestartSentinel as t };
