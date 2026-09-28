import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { Jn as string, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as recordLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { f as tryParsePersistedExecApprovals, l as resolveExecApprovalsPath, o as normalizeExecApprovalsInternal, s as parsePersistedExecApprovals } from "./exec-approvals-config-C7iYNiP7.mjs";
import { t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-GOr5zrOa.mjs";
import { c as serializeExecApprovals, s as readExecApprovalsConfigRow, u as writeExecApprovalsConfigRow } from "./exec-approvals-sqlite-B0xu2OwW.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-CC3fInLn.mjs";
import { a as legacyMigrationSourceOrClaimMayExist, o as legacyMigrationSourceSnapshotsMatch, s as readLegacyMigrationSourceSnapshot, t as LegacyMigrationSourceClaim } from "./state-migrations.source-snapshot-Bzxgpz55.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { root } from "@openclaw/fs-safe";
//#region src/infra/state-migrations.exec-approvals.ts
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const MAX_LEGACY_EXEC_APPROVALS_BYTES = 4194304;
const MIGRATION_KIND = "legacy-exec-approvals-json";
const TARGET_TABLE = "exec_approvals_config";
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
const emptyLegacyExecApprovalsSchema = strictObject({
	version: literal(1).optional(),
	defaults: strictObject({}),
	agents: strictObject({}),
	socket: strictObject({
		path: string().optional(),
		token: string().optional()
	}).optional()
});
function normalizeLegacyNullableUsageMetadata(raw) {
	const parsed = safeParseJsonRecord(raw);
	if (!parsed || !isRecord(parsed.agents)) return raw;
	let changed = false;
	for (const agent of Object.values(parsed.agents)) {
		if (!isRecord(agent) || !Array.isArray(agent.allowlist)) continue;
		for (const entry of agent.allowlist) {
			if (!isRecord(entry)) continue;
			for (const key of ["lastUsedAt", "lastUsedCommand"]) if (entry[key] === null) {
				delete entry[key];
				changed = true;
			}
		}
	}
	return changed ? JSON.stringify(parsed) : raw;
}
/** Detect retired approvals only when an explicit Doctor flow opts in. */
function detectLegacyExecApprovals(params) {
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const sourcePath = resolveExecApprovalsPath(env);
	const sourcePresent = legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePresent
	};
}
async function readLegacySourceSnapshot(stateRoot, stateDir, sourcePath) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		stateRoot,
		stateDir,
		sourcePath,
		maxBytes: MAX_LEGACY_EXEC_APPROVALS_BYTES,
		label: "exec approvals"
	});
	let raw = null;
	try {
		raw = utf8Decoder.decode(snapshot.buffer);
	} catch {}
	return {
		...snapshot,
		raw
	};
}
function decideAndRecordMigration(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("exec-approvals-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	const legacy = params.emptyStub ? ok(params.emptyStub.file) : params.snapshot.raw === null ? err("invalid UTF-8 encoding") : parsePersistedExecApprovals(normalizeLegacyNullableUsageMetadata(params.snapshot.raw));
	const legacyFile = legacy.ok ? legacy.value : null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const canonical = readExecApprovalsConfigRow(db);
		const canonicalFile = canonical ? tryParsePersistedExecApprovals(canonical.raw_json) : null;
		const importedRaw = legacyFile ? serializeExecApprovals(legacyFile) : null;
		const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		let receiptImportedSameSource = false;
		if (receipt?.sourceSha256 === params.snapshot.sha256) try {
			const report = JSON.parse(receipt.reportJson);
			receiptImportedSameSource = report.decision === "legacy-imported" || report.decision === "invalid-canonical-repaired" || report.decision === "receipt-authoritative";
		} catch {}
		let decision;
		let removeSource = false;
		if (params.emptyStub && (canonical || !legacyFile?.socket?.path && !legacyFile?.socket?.token)) {
			decision = "empty-legacy-retired";
			removeSource = true;
		} else if (!legacyFile || params.snapshot.raw === null) decision = "malformed-legacy-preserved";
		else if (receiptImportedSameSource && canonicalFile) {
			decision = "receipt-authoritative";
			removeSource = true;
		} else if (!canonical) {
			writeExecApprovalsConfigRow({
				db,
				file: legacyFile,
				raw: importedRaw ?? void 0,
				now
			});
			decision = "legacy-imported";
			removeSource = true;
		} else if (!canonicalFile) {
			writeExecApprovalsConfigRow({
				db,
				file: legacyFile,
				raw: importedRaw ?? void 0,
				now
			});
			decision = "invalid-canonical-repaired";
			removeSource = true;
		} else {
			decision = "canonical-preserved";
			removeSource = canonical.raw_json === params.snapshot.raw;
		}
		if (decision === "legacy-imported" || decision === "invalid-canonical-repaired") {
			if (!legacyFile) throw new Error("exec approvals import decisions require a parsed legacy file");
			const verified = readExecApprovalsConfigRow(db);
			const verifiedFile = verified ? tryParsePersistedExecApprovals(verified.raw_json) : null;
			const rawMatches = verified?.raw_json === importedRaw;
			const fileMatches = verifiedFile && isDeepStrictEqual(JSON.parse(serializeExecApprovals(verifiedFile)), JSON.parse(serializeExecApprovals(legacyFile)));
			if (!rawMatches || !fileMatches) throw new Error(`SQLite verification failed for the exec approvals migration (raw=${rawMatches}, parsed=${Boolean(fileMatches)})`);
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			target: TARGET_TABLE,
			decision,
			sourceSha256: params.snapshot.sha256,
			sourceValid: legacyFile !== null,
			...params.emptyStub ? { archivePath: params.emptyStub.archivePath } : {},
			importedRecordCount: decision === "legacy-imported" || decision === "invalid-canonical-repaired" ? 1 : 0,
			preservedSqliteRecordCount: canonical && decision !== "legacy-imported" && decision !== "invalid-canonical-repaired" && decision !== "malformed-legacy-preserved" ? 1 : 0,
			removesSource: removeSource
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: params.sourcePath,
			targetTable: TARGET_TABLE,
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: legacyFile && decision !== "empty-legacy-retired" ? 1 : 0,
			runId,
			now,
			reportJson,
			upsert: true
		});
		return {
			message: removeSource ? decisionMessages[decision] : legacy.ok ? "Conflicting legacy exec approvals remain" : `Invalid legacy exec approvals (${legacy.error})`,
			removeSource,
			sourceKey
		};
	}, { env: params.env }, { operationLabel: "state-migration.exec-approvals" });
}
const decisionMessages = {
	"empty-legacy-retired": "Archived empty legacy exec approvals without changing SQLite policy.",
	"legacy-imported": "Imported legacy exec approvals into shared SQLite state.",
	"invalid-canonical-repaired": "Replaced an invalid SQLite exec approvals row with validated legacy state.",
	"canonical-preserved": "Preserved byte-identical canonical SQLite exec approvals.",
	"malformed-legacy-preserved": "Preserved malformed legacy exec approvals for operator recovery.",
	"receipt-authoritative": "Completed cleanup for previously imported legacy exec approvals."
};
async function migrateWithExclusiveStateOwnership(params) {
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "exec approvals",
		includeFilePath: false,
		claimSuffix: DOCTOR_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacySourceSnapshot(params.stateRoot, params.stateDir, snapshotPath)
	});
	try {
		await source.recover("legacy exec approvals source and interrupted claim both exist");
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed recovering a legacy exec approvals Doctor claim: ${String(error)}`]
		};
	}
	if (!await source.exists()) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	try {
		snapshot = await source.read();
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy exec approvals: ${String(error)}`]
		};
	}
	try {
		params.beforeVerify?.();
		const current = await source.read();
		if (!legacyMigrationSourceSnapshotsMatch(current, snapshot)) throw new Error("legacy exec approvals changed after migration loaded them");
		await source.claim({
			snapshot,
			mismatchMessage: "legacy exec approvals changed before migration could claim them",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed claiming legacy exec approvals: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	let emptyStub;
	try {
		const parsedStub = emptyLegacyExecApprovalsSchema.safeParse(snapshot.raw === null ? null : safeParseJsonRecord(snapshot.raw));
		if (parsedStub.success) {
			const archiveSuffix = `.migrated.${snapshot.sha256}.${randomUUID()}`;
			const archivePath = `${sourcePath}${archiveSuffix}`;
			await params.stateRoot.create(`${source.sourceRelativePath}${archiveSuffix}`, snapshot.buffer, { mode: 384 });
			if ((await readLegacySourceSnapshot(params.stateRoot, params.stateDir, archivePath)).sha256 !== snapshot.sha256) throw new Error("legacy exec approvals archive differs from the claimed source");
			emptyStub = {
				archivePath,
				file: normalizeExecApprovalsInternal({
					...parsedStub.data,
					version: 1
				})
			};
		}
		result = decideAndRecordMigration({
			env: params.env,
			sourcePath,
			snapshot,
			emptyStub
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed migrating legacy exec approvals: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	if (!result.removeSource) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`${result.message}${restoreError ? ` Claim restore failed: ${restoreError}` : ""}`]
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "legacy exec approvals reappeared during migration cleanup",
			remainingMessage: "legacy exec approvals remain after migration cleanup"
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Legacy exec approvals cleanup failed: ${String(error)}`]
		};
	}
	const warnings = [];
	try {
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env, "state-migration.exec-approvals.receipt");
	} catch (error) {
		warnings.push(`Legacy exec approvals were removed, but their receipt could not be finalized: ${String(error)}`);
	}
	return {
		changes: [result.message],
		warnings,
		notices: [...emptyStub ? [`Archived empty legacy exec approvals at ${emptyStub.archivePath}.`] : [], "Removed retired exec approvals JSON after recording its migration decision."]
	};
}
/** Import or retire the old file under exclusive state ownership. */
async function migrateLegacyExecApprovals(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const result = await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy exec approvals",
		releaseLabel: "Exec approvals",
		errorLabel: "Failed reading legacy exec approvals",
		retryGuidance: `Stop the Gateway and node hosts holding ${params.stateDir}.`,
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_EXEC_APPROVALS_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership({
				...params,
				detected,
				env,
				stateRoot
			});
		}
	});
	if (result.changes.length > 0) return result;
	const retainedPaths = [detected.sourcePath, `${detected.sourcePath}${DOCTOR_CLAIM_SUFFIX}`].filter(pathMayExistSync);
	return {
		...result,
		warnings: result.warnings.map((problem) => new ExecApprovalsMigrationRequiredError(retainedPaths.join(", ") || detected.sourcePath, "doctor", problem).message)
	};
}
//#endregion
export { migrateLegacyExecApprovals as n, detectLegacyExecApprovals as t };
