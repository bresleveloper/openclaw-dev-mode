import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as gitCommitPrefixesMatch } from "./git-commit-BowlM7El.mjs";
import { c as resolveRuntimeServiceCommit, l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as readRestartSentinelRowForKeySync, c as readUpdateInstallReceiptRowSync, d as writeUpdateInstallReceiptRowSync, l as writeRestartSentinelRowIfRevisionSync, n as deleteRestartSentinelRowSync, o as readRestartSentinelRowSync, r as nextRevision, s as readRestartSentinelSnapshotSync, t as buildRestartSentinelRow, u as writeRestartSentinelRowSync } from "./restart-sentinel-store-CrOabuW6.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/infra/update-failure-report-receipt-store.ts
const RECEIPT_KEY_PREFIX = "update-failure-report:";
const PREPARING_RECEIPT_STALE_AFTER_MS = 12e4;
const ARTIFACT_SWEEP_STALE_AFTER_MS = 12e4;
function isCanonicalGithubUrl(value, pathname, options) {
	if (typeof value !== "string") return false;
	try {
		const parsed = new URL(value);
		return parsed.origin === "https://github.com" && !parsed.username && !parsed.password && !parsed.hash && (options.allowSearch || !parsed.search) && pathname.test(parsed.pathname);
	} catch {
		return false;
	}
}
function isPreviewDigest(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function retainedArtifactSweep(receipt) {
	return receipt.artifactSweep ? { artifactSweep: receipt.artifactSweep } : {};
}
function isValidTerminalReceipt(receipt) {
	if (!isPreviewDigest(receipt.previewDigest) || receipt.preparingSinceMs !== void 0) return false;
	if (receipt.status === "created") return receipt.cleanup === "pending" && receipt.fallbackUrl === void 0 && isCanonicalGithubUrl(receipt.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, { allowSearch: false });
	if (receipt.status === "fallback") return receipt.cleanup === void 0 && receipt.url === void 0 && isCanonicalGithubUrl(receipt.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, { allowSearch: true });
	return receipt.status === "retryable" && receipt.cleanup === void 0 && receipt.url === void 0 && receipt.fallbackUrl === void 0;
}
function receiptKey(attemptId) {
	return `${RECEIPT_KEY_PREFIX}${createHash("sha256").update(attemptId).digest("hex")}`;
}
function parseReceipt(sentinel) {
	if (sentinel?.payload.kind !== "update" || sentinel.payload.status !== "skipped" || sentinel.payload.stats?.reason !== "update-failure-report-receipt" || typeof sentinel.payload.message !== "string") return null;
	const value = safeParseJson(sentinel.payload.message);
	if (!isRecord(value) || value.status !== "preparing" && value.status !== "prepared" && value.status !== "pending" && value.status !== "retryable" && value.status !== "created" && value.status !== "fallback" || typeof value.reservationId !== "string" || (value.status === "preparing" || value.status === "prepared") && (typeof value.preparingSinceMs !== "number" || !Number.isFinite(value.preparingSinceMs)) || value.artifactSweep !== void 0 && value.artifactSweep !== "pending" || value.cleanup !== void 0 && value.cleanup !== "pending" || value.previewDigest !== void 0 && !isPreviewDigest(value.previewDigest) || value.replacementReady !== void 0 && value.replacementReady !== true || value.replacementReady === true && (value.status !== "retryable" || value.cleanup !== void 0 || value.artifactSweep !== "pending") || value.sweepOwnerId === void 0 !== (value.sweepSinceMs === void 0) || value.sweepOwnerId === void 0 !== (value.sweepGeneration === void 0) || value.sweepGeneration !== void 0 && typeof value.sweepGeneration !== "string" || value.sweepOwnerId !== void 0 && typeof value.sweepOwnerId !== "string" || value.sweepSinceMs !== void 0 && (typeof value.sweepSinceMs !== "number" || !Number.isFinite(value.sweepSinceMs)) || value.sweepOwnerId !== void 0 && value.artifactSweep !== "pending" || value.status === "created" && !isCanonicalGithubUrl(value.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, { allowSearch: false }) || value.status === "fallback" && !isCanonicalGithubUrl(value.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, { allowSearch: true }) || value.cleanup !== void 0 && value.status !== "created" && value.status !== "retryable" || value.status !== "created" && value.url !== void 0 || value.status !== "fallback" && value.fallbackUrl !== void 0) return null;
	return {
		...value.artifactSweep === "pending" ? { artifactSweep: value.artifactSweep } : {},
		reservationId: value.reservationId,
		status: value.status,
		...value.cleanup === "pending" ? { cleanup: value.cleanup } : {},
		...typeof value.preparingSinceMs === "number" ? { preparingSinceMs: value.preparingSinceMs } : {},
		...typeof value.previewDigest === "string" ? { previewDigest: value.previewDigest } : {},
		...value.replacementReady === true ? { replacementReady: value.replacementReady } : {},
		...typeof value.sweepGeneration === "string" ? { sweepGeneration: value.sweepGeneration } : {},
		...typeof value.sweepOwnerId === "string" ? { sweepOwnerId: value.sweepOwnerId } : {},
		...typeof value.sweepSinceMs === "number" ? { sweepSinceMs: value.sweepSinceMs } : {},
		...typeof value.url === "string" ? { url: value.url } : {},
		...typeof value.fallbackUrl === "string" ? { fallbackUrl: value.fallbackUrl } : {}
	};
}
function readReceipt(db, attemptId) {
	const current = readRestartSentinelRowForKeySync(db, receiptKey(attemptId));
	return parseReceipt(current.kind === "valid" ? current.sentinel : null);
}
/** Reads one existing report receipt without creating state. */
function readUpdateFailureReportReceiptRowSync(db, attemptId) {
	return readReceipt(db, attemptId);
}
function buildReceiptPayload(receipt) {
	return {
		kind: "update",
		status: "skipped",
		ts: Date.now(),
		message: JSON.stringify(receipt),
		stats: { reason: "update-failure-report-receipt" }
	};
}
function replaceReceiptAtRevision(db, sentinelKey, revision, receipt) {
	const row = buildRestartSentinelRow(buildReceiptPayload(receipt), nextRevision(revision), sentinelKey);
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, stateDb.updateTable("gateway_restart_sentinel").set(row).where("sentinel_key", "=", sentinelKey).where("updated_at_ms", "=", revision)).numAffectedRows === 1n;
}
/** Atomically owns one report attempt in the canonical state database. */
function reserveUpdateFailureReportReceiptRowSync(db, attemptId, reservationId, previewDigest) {
	const sentinelKey = receiptKey(attemptId);
	const stateDb = getNodeSqliteKysely(db);
	const nowMs = Date.now();
	const receipt = {
		preparingSinceMs: nowMs,
		previewDigest,
		reservationId,
		status: "preparing"
	};
	const row = buildRestartSentinelRow(buildReceiptPayload(receipt), nowMs, sentinelKey);
	if (executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_sentinel").values(row).onConflict((conflict) => conflict.column("sentinel_key").doNothing())).numAffectedRows === 1n) return {
		receipt,
		reserved: true
	};
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind === "valid" && currentReceipt?.status === "retryable" && currentReceipt.cleanup === void 0 && currentReceipt.replacementReady === true && currentReceipt.sweepOwnerId === void 0) {
		const replacement = {
			preparingSinceMs: nowMs,
			previewDigest,
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "preparing"
		};
		return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, replacement) ? {
			receipt: replacement,
			reserved: true
		} : {
			receipt: readReceipt(db, attemptId),
			reserved: false
		};
	}
	return {
		receipt: currentReceipt,
		reserved: false
	};
}
/** CAS-refreshes one owned, definitely-unstarted phase before fallback publication. */
function refreshUpdateFailureReportReceiptPreparationRowSync(db, attemptId, reservationId) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId) return false;
	const refreshed = {
		...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: currentReceipt.status,
		...currentReceipt.status === "prepared" ? { preparingSinceMs: Date.now() } : {}
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, refreshed);
}
/** Fences final artifact publication behind one process-owned preparation. */
function markUpdateFailureReportReceiptPreparedRowSync(db, attemptId, reservationId, previewDigest) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.status !== "preparing" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId || currentReceipt.previewDigest !== previewDigest) return false;
	const prepared = {
		preparingSinceMs: Date.now(),
		previewDigest,
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: "prepared"
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, prepared);
}
/** Makes one published preparation ambiguity-safe immediately before issue creation starts. */
function markUpdateFailureReportReceiptPendingRowSync(db, attemptId, reservationId, previewDigest) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.status !== "prepared" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId || currentReceipt.previewDigest !== previewDigest) return false;
	const pending = {
		...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: "pending"
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, pending);
}
/** Finalizes only a process-owned reservation in the required prior phase. */
function finalizeUpdateFailureReportReceiptRowSync(db, attemptId, receipt) {
	if (!isValidTerminalReceipt(receipt)) return false;
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.sweepOwnerId !== void 0 || (receipt.status === "fallback" || receipt.status === "retryable" ? currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" : currentReceipt.status !== "pending") || currentReceipt.reservationId !== receipt.reservationId || currentReceipt.previewDigest === void 0 || currentReceipt.previewDigest !== receipt.previewDigest) return false;
	const terminalReceipt = {
		...receipt,
		...retainedArtifactSweep(currentReceipt)
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, terminalReceipt);
}
/** Records post-commit cleanup intent without performing filesystem work in SQLite. */
function beginUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" && currentReceipt.status !== "retryable" || currentReceipt.cleanup !== void 0 || currentReceipt.reservationId !== reservationId) return false;
	const cleanupReceipt = {
		cleanup: "pending",
		...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: "retryable"
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, cleanupReceipt);
}
/** Atomically transfers an expired preparation into durable cleanup custody. */
function beginStaleUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	const nowMs = Date.now();
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" || currentReceipt.preparingSinceMs === void 0 || currentReceipt.preparingSinceMs > nowMs - PREPARING_RECEIPT_STALE_AFTER_MS || currentReceipt.reservationId !== reservationId) return false;
	if (!currentReceipt.previewDigest) return false;
	const cleanupReceipt = {
		artifactSweep: "pending",
		cleanup: "pending",
		previewDigest: currentReceipt.previewDigest,
		reservationId,
		status: "retryable"
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, cleanupReceipt);
}
/** Serializes one attempt-wide retired-artifact sweep against successor publication. */
function claimUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	const nowMs = Date.now();
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.artifactSweep !== "pending" || currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== void 0 && currentReceipt.sweepSinceMs !== void 0 && currentReceipt.sweepSinceMs > nowMs - ARTIFACT_SWEEP_STALE_AFTER_MS) return false;
	const claimed = {
		...currentReceipt,
		sweepGeneration,
		sweepOwnerId,
		sweepSinceMs: nowMs
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, claimed);
}
/** Checks the exact sweep generation without renewing or otherwise mutating it. */
function hasUpdateFailureReportArtifactSweepLeaseRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	const currentReceipt = readReceipt(db, attemptId);
	return currentReceipt?.artifactSweep === "pending" && currentReceipt.reservationId === expectedReservationId && currentReceipt.sweepOwnerId === sweepOwnerId && currentReceipt.sweepGeneration === sweepGeneration;
}
/** Releases only the exact attempt-wide artifact sweep lease held by this worker. */
function releaseUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== sweepOwnerId || currentReceipt.sweepGeneration !== sweepGeneration) return false;
	const { sweepGeneration: _generation, sweepOwnerId: _owner, sweepSinceMs: _since, ...released } = currentReceipt;
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, released);
}
/** Completes one idempotent artifact cleanup after the cleanup intent has committed. */
function completeUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.cleanup !== "pending" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId) return false;
	const stateDb = getNodeSqliteKysely(db);
	if (currentReceipt.status === "retryable") {
		if (currentReceipt.artifactSweep) {
			const completed = {
				artifactSweep: currentReceipt.artifactSweep,
				...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
				replacementReady: true,
				reservationId,
				status: "retryable"
			};
			return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, completed);
		}
		return executeSqliteQuerySync(db, stateDb.deleteFrom("gateway_restart_sentinel").where("sentinel_key", "=", sentinelKey).where("updated_at_ms", "=", current.sentinel.revision)).numAffectedRows === 1n;
	}
	if (currentReceipt.status !== "created" || !currentReceipt.url) return false;
	const completed = {
		...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: "created",
		...currentReceipt.url ? { url: currentReceipt.url } : {}
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, completed);
}
//#endregion
//#region src/infra/update-install-root.ts
/** Resolve the canonical identity of an update checkout/install root. */
function resolveUpdateInstallRoot(root) {
	try {
		return fs.realpathSync.native(root);
	} catch {
		return path.resolve(root);
	}
}
function updateInstallRootsMatch(left, right) {
	return resolveUpdateInstallRoot(left) === resolveUpdateInstallRoot(right);
}
//#endregion
//#region src/infra/restart-sentinel.ts
const sentinelLog = createSubsystemLogger("restart-sentinel");
function formatDoctorNonInteractiveHint(env = process.env) {
	return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function writeRestartSentinel(payload, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => writeRestartSentinelRowSync(db, payload), { env }, { operationLabel: "restart-sentinel.write" });
}
function reserveUpdateFailureReportReceipt(attemptId, reservationId, previewDigest, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => reserveUpdateFailureReportReceiptRowSync(db, attemptId, reservationId, previewDigest), { env }, { operationLabel: "update-failure-report.reserve" });
}
function beginUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => beginUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId), { env }, { operationLabel: "update-failure-report.begin-cleanup" });
}
function beginStaleUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => beginStaleUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId), { env }, { operationLabel: "update-failure-report.begin-stale-cleanup" });
}
function completeUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => completeUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId), { env }, { operationLabel: "update-failure-report.complete-cleanup" });
}
function claimUpdateFailureReportArtifactSweep(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => claimUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration), { env }, { operationLabel: "update-failure-report.claim-artifact-sweep" });
}
function hasUpdateFailureReportArtifactSweepLease(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => hasUpdateFailureReportArtifactSweepLeaseRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration), { env }) ?? false;
}
function releaseUpdateFailureReportArtifactSweep(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => releaseUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration), { env }, { operationLabel: "update-failure-report.release-artifact-sweep" });
}
function readUpdateFailureReportReceipt(attemptId, env = process.env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readUpdateFailureReportReceiptRowSync(db, attemptId), { env }) ?? null;
}
function refreshUpdateFailureReportReceiptPreparation(attemptId, reservationId, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => refreshUpdateFailureReportReceiptPreparationRowSync(db, attemptId, reservationId), { env }, { operationLabel: "update-failure-report.refresh-preparation" });
}
function finalizeUpdateFailureReportReceipt(attemptId, receipt, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => finalizeUpdateFailureReportReceiptRowSync(db, attemptId, receipt), { env }, { operationLabel: "update-failure-report.finalize" });
}
function markUpdateFailureReportReceiptPending(attemptId, reservationId, previewDigest, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => markUpdateFailureReportReceiptPendingRowSync(db, attemptId, reservationId, previewDigest), { env }, { operationLabel: "update-failure-report.mark-pending" });
}
function markUpdateFailureReportReceiptPrepared(attemptId, reservationId, previewDigest, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => markUpdateFailureReportReceiptPreparedRowSync(db, attemptId, reservationId, previewDigest), { env }, { operationLabel: "update-failure-report.mark-prepared" });
}
/** Publish an outcome only while its producer and the captured notification are unchanged. */
async function writeRestartSentinelIfUnchanged(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelSnapshotSync(db);
		if (current.state.kind === "invalid" || !params.isCurrent()) return null;
		return current.revision === params.expectedRevision ? writeRestartSentinelRowSync(db, params.payload) : null;
	}, {}, { operationLabel: "restart-sentinel.write-if-unchanged" });
}
async function readRestartSentinelSnapshot() {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const snapshot = readRestartSentinelSnapshotSync(db);
		return {
			sentinel: snapshot.state.kind === "valid" ? snapshot.state.sentinel : null,
			revision: snapshot.revision
		};
	}, {}, { operationLabel: "restart-sentinel.read-snapshot" });
}
function cloneRestartSentinelPayload(payload) {
	return structuredClone(payload);
}
async function rewriteRestartSentinel(rewrite, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid") return null;
		const nextPayload = rewrite(cloneRestartSentinelPayload(current.sentinel.payload));
		return nextPayload ? writeRestartSentinelRowIfRevisionSync(db, nextPayload, current.sentinel.revision) : null;
	}, { env }, { operationLabel: "restart-sentinel.rewrite-current" });
}
async function finalizeUpdateRestartSentinelRunningVersion(version = resolveRuntimeServiceVersion(process.env), env = process.env, commit = resolveRuntimeServiceCommit(), runningRoot) {
	const snapshot = await readRestartSentinel(env);
	if (!snapshot || snapshot.payload.kind !== "update") return null;
	const snapshotRoot = snapshot.payload.stats?.root;
	const expectedRoot = typeof snapshotRoot === "string" ? resolveUpdateInstallRoot(snapshotRoot) : null;
	const discoveredRoot = expectedRoot ? runningRoot ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : null;
	const actualRoot = discoveredRoot ? resolveUpdateInstallRoot(discoveredRoot) : null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid" || current.sentinel.revision !== snapshot.revision || current.sentinel.payload.kind !== "update") return null;
		const payload = cloneRestartSentinelPayload(current.sentinel.payload);
		const stats = payload.stats ? { ...payload.stats } : {};
		const after = isRecord(stats.after) ? { ...stats.after } : {};
		let changed = false;
		if (after.version !== version) {
			after.version = version;
			changed = true;
		}
		if (expectedRoot && stats.root !== expectedRoot) {
			stats.root = expectedRoot;
			changed = true;
		}
		const before = isRecord(stats.before) ? stats.before : {};
		const beforeSha = typeof before.sha === "string" ? before.sha.trim() : "";
		const expectedSha = typeof after.sha === "string" ? after.sha.trim() : "";
		const actualSha = commit?.trim() ?? "";
		const verifiesGitRevision = stats.mode !== "git" || expectedSha.length > 0 && gitCommitPrefixesMatch(expectedSha, actualSha);
		const verifiesInstallRoot = expectedRoot !== null && actualRoot !== null && expectedRoot === actualRoot;
		const changedInstall = stats.mode !== "git" || beforeSha.length > 0 && expectedSha.length > 0 && !gitCommitPrefixesMatch(beforeSha, expectedSha);
		if (payload.status === "ok" && expectedRoot && !verifiesInstallRoot) {
			payload.status = "error";
			stats.reason = actualRoot ? "restart-root-mismatch" : "restart-root-unavailable";
			delete payload.continuation;
			changed = true;
		} else if (payload.status === "ok" && stats.mode === "git" && expectedSha && !verifiesGitRevision) {
			payload.status = "error";
			stats.reason = actualSha ? "restart-revision-mismatch" : "restart-revision-unavailable";
			delete payload.continuation;
			changed = true;
		}
		stats.after = after;
		payload.stats = stats;
		const finalized = changed ? writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision) : current.sentinel;
		if (!finalized) return null;
		if (stats.mode === "git" && verifiesInstallRoot && verifiesGitRevision && changedInstall) writeUpdateInstallReceiptRowSync(db, payload);
		return changed ? finalized : null;
	}, { env }, { operationLabel: "restart-sentinel.finalize-running-install" });
}
async function markUpdateRestartSentinelFailure(reason, env = process.env, expectedOwner) {
	return await rewriteRestartSentinel((payload) => {
		if (payload.kind !== "update" || expectedOwner?.runId !== void 0 && payload.stats?.runId !== expectedOwner.runId || expectedOwner?.handoffId !== void 0 && payload.stats?.handoffId !== expectedOwner.handoffId) return null;
		const payloadWithoutContinuation = { ...payload };
		delete payloadWithoutContinuation.continuation;
		const stats = payload.stats ? { ...payload.stats } : {};
		stats.reason = reason;
		return {
			...payloadWithoutContinuation,
			status: "error",
			stats
		};
	}, env);
}
async function clearRestartSentinelIfRevision(expectedRevision, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteRestartSentinelRowSync(db, expectedRevision), { env }, { operationLabel: "restart-sentinel.clear-if-revision" });
}
async function readRestartSentinel(env = process.env) {
	try {
		const database = openOpenClawStateDatabase({ env });
		const current = readRestartSentinelRowSync(database.db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return null;
		}
		return current.kind === "valid" ? current.sentinel : null;
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
/** Read the restart sentinel without creating or mutating shared state. */
async function readRestartSentinelReadOnly(env = process.env) {
	try {
		const current = withExistingOpenClawStateDatabaseReadOnly(({ db }) => readRestartSentinelRowSync(db), { env });
		if (!current || current.kind === "missing") return null;
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return null;
		}
		return current.sentinel;
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function readUpdateInstallReceiptPayload(env = process.env) {
	try {
		const database = openOpenClawStateDatabase({ env });
		return readUpdateInstallReceiptRowSync(database.db)?.payload ?? null;
	} catch (err) {
		sentinelLog.warn(`Failed to read update install receipt: ${formatErrorMessage(err)}`);
		return null;
	}
}
function normalizeVerifiedGitUpdateReceipt(payload) {
	if (payload?.kind !== "update" || payload.stats?.mode !== "git" || !isRecord(payload.stats.after)) return null;
	const root = typeof payload.stats.root === "string" ? payload.stats.root.trim() : "";
	const sha = typeof payload.stats.after.sha === "string" ? payload.stats.after.sha.trim() : "";
	if (!root || !sha) return null;
	const upstreamRef = typeof payload.stats.after.upstreamRef === "string" ? payload.stats.after.upstreamRef.trim() : "";
	return {
		root,
		sha,
		...upstreamRef ? { upstreamRef } : {},
		installedAtMs: payload.ts
	};
}
async function readVerifiedGitUpdateReceipt(env = process.env) {
	return normalizeVerifiedGitUpdateReceipt(await readUpdateInstallReceiptPayload(env));
}
async function hasRestartSentinel(env = process.env) {
	try {
		const database = openOpenClawStateDatabase({ env });
		const current = readRestartSentinelRowSync(database.db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return false;
		}
		return current.kind === "valid";
	} catch (err) {
		sentinelLog.warn(`Failed to check restart sentinel: ${formatErrorMessage(err)}`);
		return false;
	}
}
function formatRestartSentinelMessage(payload) {
	const message = payload.message?.trim();
	if (message && (!payload.stats || payload.kind === "config-auto-recovery")) return message;
	const lines = [summarizeRestartSentinel(payload)];
	if (message) lines.push(message);
	const reason = payload.stats?.reason?.trim();
	if (reason && reason !== message) lines.push(`Reason: ${reason}`);
	if (payload.doctorHint?.trim()) lines.push(payload.doctorHint.trim());
	return lines.join("\n");
}
function isRestartRequiredConfigWriteSentinel(payload) {
	return (payload.kind === "config-apply" || payload.kind === "config-patch") && payload.status === "ok" && payload.stats?.requiresRestart === true;
}
function summarizeRestartSentinel(payload) {
	if (payload.kind === "config-auto-recovery") return "Gateway auto-recovery";
	if (isRestartRequiredConfigWriteSentinel(payload)) return `Gateway restart required${payload.stats?.mode ? ` (${payload.stats.mode})` : ""}`.trim();
	const kind = payload.kind;
	const status = payload.status;
	const mode = payload.stats?.mode ? ` (${payload.stats.mode})` : "";
	return `Gateway restart${kind === "restart" ? "" : ` ${kind}`} ${status}${mode}`.trim();
}
function trimLogTail(input, maxChars = 8e3) {
	if (!input) return null;
	const text = input.trimEnd();
	if (text.length <= maxChars) return text;
	return `…${sliceUtf16Safe(text, text.length - maxChars)}`;
}
//#endregion
export { summarizeRestartSentinel as C, resolveUpdateInstallRoot as D, writeRestartSentinelIfUnchanged as E, updateInstallRootsMatch as O, reserveUpdateFailureReportReceipt as S, writeRestartSentinel as T, readRestartSentinelSnapshot as _, completeUpdateFailureReportReceiptCleanup as a, refreshUpdateFailureReportReceiptPreparation as b, formatDoctorNonInteractiveHint as c, hasUpdateFailureReportArtifactSweepLease as d, markUpdateFailureReportReceiptPending as f, readRestartSentinelReadOnly as g, readRestartSentinel as h, clearRestartSentinelIfRevision as i, formatRestartSentinelMessage as l, markUpdateRestartSentinelFailure as m, beginUpdateFailureReportReceiptCleanup as n, finalizeUpdateFailureReportReceipt as o, markUpdateFailureReportReceiptPrepared as p, claimUpdateFailureReportArtifactSweep as r, finalizeUpdateRestartSentinelRunningVersion as s, beginStaleUpdateFailureReportReceiptCleanup as t, hasRestartSentinel as u, readUpdateFailureReportReceipt as v, trimLogTail as w, releaseUpdateFailureReportArtifactSweep as x, readVerifiedGitUpdateReceipt as y };
