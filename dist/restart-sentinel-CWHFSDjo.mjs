import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveRuntimeServiceCommit, l as resolveRuntimeServiceVersion } from "./version-BJGPJZu6.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { a as readRestartSentinelRowForKeySync, r as nextRevision, t as buildRestartSentinelRow } from "./restart-sentinel-store-CVYfycIC.mjs";
//#region src/infra/update-failure-report-receipt-store.ts
const RECEIPT_KEY_PREFIX = "update-failure-report:";
const PREPARING_RECEIPT_STALE_AFTER_MS = 12e4;
const ARTIFACT_SWEEP_STALE_AFTER_MS = 12e4;
function isCanonicalGithubUrl(value, pathname, allowSearch) {
	if (typeof value !== "string") return false;
	try {
		const parsed = new URL(value);
		return parsed.origin === "https://github.com" && !parsed.username && !parsed.password && !parsed.hash && (allowSearch || !parsed.search) && pathname.test(parsed.pathname);
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
	if (receipt.status === "created") return receipt.cleanup === "pending" && receipt.fallbackUrl === void 0 && isCanonicalGithubUrl(receipt.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, false);
	if (receipt.status === "fallback") return receipt.cleanup === void 0 && receipt.url === void 0 && isCanonicalGithubUrl(receipt.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, true);
	return receipt.status === "retryable" && receipt.cleanup === void 0 && receipt.url === void 0 && receipt.fallbackUrl === void 0;
}
function receiptKey(attemptId) {
	return `${RECEIPT_KEY_PREFIX}${sha256Hex(attemptId)}`;
}
function parseReceipt(sentinel) {
	if (sentinel?.payload.kind !== "update" || sentinel.payload.status !== "skipped" || sentinel.payload.stats?.reason !== "update-failure-report-receipt" || typeof sentinel.payload.message !== "string") return null;
	const value = safeParseJson(sentinel.payload.message);
	if (!isRecord(value) || value.status !== "preparing" && value.status !== "prepared" && value.status !== "pending" && value.status !== "retryable" && value.status !== "created" && value.status !== "fallback" || typeof value.reservationId !== "string" || (value.status === "preparing" || value.status === "prepared") && (typeof value.preparingSinceMs !== "number" || !Number.isFinite(value.preparingSinceMs)) || value.artifactSweep !== void 0 && value.artifactSweep !== "pending" || value.cleanup !== void 0 && value.cleanup !== "pending" || value.previewDigest !== void 0 && !isPreviewDigest(value.previewDigest) || value.replacementReady !== void 0 && value.replacementReady !== true || value.replacementReady === true && (value.status !== "retryable" || value.cleanup !== void 0 || value.artifactSweep !== "pending") || value.sweepOwnerId === void 0 !== (value.sweepSinceMs === void 0) || value.sweepOwnerId === void 0 !== (value.sweepGeneration === void 0) || value.sweepGeneration !== void 0 && typeof value.sweepGeneration !== "string" || value.sweepOwnerId !== void 0 && typeof value.sweepOwnerId !== "string" || value.sweepSinceMs !== void 0 && (typeof value.sweepSinceMs !== "number" || !Number.isFinite(value.sweepSinceMs)) || value.sweepOwnerId !== void 0 && value.artifactSweep !== "pending" || value.status === "created" && !isCanonicalGithubUrl(value.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, false) || value.status === "fallback" && !isCanonicalGithubUrl(value.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, true) || value.cleanup !== void 0 && value.status !== "created" && value.status !== "retryable" || value.status !== "created" && value.url !== void 0 || value.status !== "fallback" && value.fallbackUrl !== void 0) return null;
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
/** Reads one existing report receipt without creating state. */
function readUpdateFailureReportReceiptRowSync(db, attemptId) {
	const current = readRestartSentinelRowForKeySync(db, receiptKey(attemptId));
	return parseReceipt(current.kind === "valid" ? current.sentinel : null);
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
function mutateReceipt(db, attemptId, update) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const receipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !receipt) return false;
	const next = update(receipt);
	return next && replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, next);
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
			receipt: readUpdateFailureReportReceiptRowSync(db, attemptId),
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
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId) return false;
		return {
			...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: currentReceipt.status,
			...currentReceipt.status === "prepared" ? { preparingSinceMs: Date.now() } : {}
		};
	});
}
/** Fences final artifact publication behind one process-owned preparation. */
function markUpdateFailureReportReceiptPreparedRowSync(db, attemptId, reservationId, previewDigest) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.status !== "preparing" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId || currentReceipt.previewDigest !== previewDigest) return false;
		return {
			preparingSinceMs: Date.now(),
			previewDigest,
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "prepared"
		};
	});
}
/** Makes one published preparation ambiguity-safe immediately before issue creation starts. */
function markUpdateFailureReportReceiptPendingRowSync(db, attemptId, reservationId, previewDigest) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.status !== "prepared" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId || currentReceipt.previewDigest !== previewDigest) return false;
		return {
			...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "pending"
		};
	});
}
/** Finalizes only a process-owned reservation in the required prior phase. */
function finalizeUpdateFailureReportReceiptRowSync(db, attemptId, receipt) {
	if (!isValidTerminalReceipt(receipt)) return false;
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.sweepOwnerId !== void 0 || (receipt.status === "fallback" || receipt.status === "retryable" ? currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" : currentReceipt.status !== "pending") || currentReceipt.reservationId !== receipt.reservationId || currentReceipt.previewDigest === void 0 || currentReceipt.previewDigest !== receipt.previewDigest) return false;
		return {
			...receipt,
			...retainedArtifactSweep(currentReceipt)
		};
	});
}
/** Records post-commit cleanup intent without performing filesystem work in SQLite. */
function beginUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" && currentReceipt.status !== "retryable" || currentReceipt.cleanup !== void 0 || currentReceipt.reservationId !== reservationId) return false;
		return {
			cleanup: "pending",
			...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "retryable"
		};
	});
}
/** Atomically transfers an expired preparation into durable cleanup custody. */
function beginStaleUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		const nowMs = Date.now();
		if (currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" || currentReceipt.preparingSinceMs === void 0 || currentReceipt.preparingSinceMs > nowMs - PREPARING_RECEIPT_STALE_AFTER_MS || currentReceipt.reservationId !== reservationId || !currentReceipt.previewDigest) return false;
		return {
			artifactSweep: "pending",
			cleanup: "pending",
			previewDigest: currentReceipt.previewDigest,
			reservationId,
			status: "retryable"
		};
	});
}
/** Serializes one attempt-wide retired-artifact sweep against successor publication. */
function claimUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		const nowMs = Date.now();
		if (currentReceipt.artifactSweep !== "pending" || currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== void 0 && currentReceipt.sweepSinceMs !== void 0 && currentReceipt.sweepSinceMs > nowMs - ARTIFACT_SWEEP_STALE_AFTER_MS) return false;
		return {
			...currentReceipt,
			sweepGeneration,
			sweepOwnerId,
			sweepSinceMs: nowMs
		};
	});
}
/** Checks the exact sweep generation without renewing or otherwise mutating it. */
function hasUpdateFailureReportArtifactSweepLeaseRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	const currentReceipt = readUpdateFailureReportReceiptRowSync(db, attemptId);
	return currentReceipt?.artifactSweep === "pending" && currentReceipt.reservationId === expectedReservationId && currentReceipt.sweepOwnerId === sweepOwnerId && currentReceipt.sweepGeneration === sweepGeneration;
}
/** Releases only the exact attempt-wide artifact sweep lease held by this worker. */
function releaseUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== sweepOwnerId || currentReceipt.sweepGeneration !== sweepGeneration) return false;
		const { sweepGeneration: _generation, sweepOwnerId: _owner, sweepSinceMs: _since, ...released } = currentReceipt;
		return released;
	});
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
//#region src/infra/restart-sentinel.ts
const sentinelLog = createSubsystemLogger("restart-sentinel");
function formatDoctorNonInteractiveHint(env = process.env) {
	return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function runRestartSentinelOperation(command, context, assertProducerCurrent) {
	const captured = structuredClone(command);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertProducerCurrent?.();
	};
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
	context.admission.assertCurrent();
	return result;
}
async function writeRestartSentinel(payload, env = process.env, assertProducerCurrent) {
	return runRestartSentinelOperation({
		type: "restartSentinel.write",
		input: payload
	}, captureOpenClawStateWorkerContext({ env }), assertProducerCurrent);
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
	const retired = /* @__PURE__ */ new Error("Restart sentinel producer retired");
	try {
		return await runRestartSentinelOperation({
			type: "restartSentinel.writeIfUnchanged",
			input: {
				payload: params.payload,
				expectedRevision: params.expectedRevision
			}
		}, captureOpenClawStateWorkerContext(), () => {
			if (!params.isCurrent()) throw retired;
		});
	} catch (error) {
		if (error === retired) return null;
		throw error;
	}
}
async function readRestartSentinelSnapshot() {
	const reply = await readSentinelState("restartSentinel.snapshot", captureOpenClawStateWorkerContext());
	if (!reply?.ok || reply.type !== "restartSentinel.snapshot") throw new Error("Restart sentinel snapshot unavailable");
	return reply.snapshot;
}
async function finalizeUpdateRestartSentinelRunningVersion(version = resolveRuntimeServiceVersion(process.env), env = process.env, commit = resolveRuntimeServiceCommit(), runningRoot) {
	const context = captureOpenClawStateWorkerContext({ env });
	let snapshot;
	try {
		const reply = await readSentinelState("restartSentinel.current", context);
		snapshot = currentSentinel(reply?.ok && reply.type === "restartSentinel.current" ? reply.state : void 0);
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
	if (!snapshot || snapshot.payload.kind !== "update") return null;
	const snapshotRoot = snapshot.payload.stats?.root;
	const expectedRoot = typeof snapshotRoot === "string" ? resolveUpdateInstallRoot(snapshotRoot) : null;
	const discoveredRoot = expectedRoot ? runningRoot ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : null;
	const actualRoot = discoveredRoot ? resolveUpdateInstallRoot(discoveredRoot) : null;
	return runRestartSentinelOperation({
		type: "restartSentinel.finalize",
		input: {
			expectedRevision: snapshot.revision,
			version,
			commit,
			expectedRoot,
			actualRoot
		}
	}, context);
}
async function markUpdateRestartSentinelFailure(reason, env = process.env, expectedOwner) {
	return runRestartSentinelOperation({
		type: "restartSentinel.markFailure",
		input: {
			reason,
			expectedOwner
		}
	}, captureOpenClawStateWorkerContext({ env }));
}
async function clearRestartSentinelIfRevision(expectedRevision, env = process.env) {
	return runRestartSentinelOperation({
		type: "restartSentinel.clear",
		input: expectedRevision
	}, captureOpenClawStateWorkerContext({ env }));
}
async function readSentinelState(type, context, existingOnly = false) {
	if (!existingOnly) await executeOpenClawStateWorker(context, {
		type: "restartSentinel.admit",
		input: void 0
	});
	const reply = await executeExistingOpenClawStateRead({
		env: context.environment,
		path: context.admission.databasePath
	}, {
		type,
		input: void 0
	}, { context });
	context.admission.assertCurrent();
	if (reply && !reply.ok) throw new Error(reply.message);
	return reply;
}
function currentSentinel(current) {
	if (current?.kind === "invalid") sentinelLog.warn("Ignoring invalid typed restart sentinel row");
	return current?.kind === "valid" ? current.sentinel : null;
}
async function readRestartSentinel(env = process.env) {
	try {
		const reply = await readSentinelState("restartSentinel.current", captureOpenClawStateWorkerContext({ env }));
		return currentSentinel(reply?.ok && reply.type === "restartSentinel.current" ? reply.state : void 0);
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
/** Read the restart sentinel without creating or mutating shared state. */
async function readRestartSentinelReadOnly(env = process.env) {
	try {
		const reply = await readSentinelState("restartSentinel.current", captureOpenClawStateWorkerContext({ env }), true);
		return currentSentinel(reply?.ok && reply.type === "restartSentinel.current" ? reply.state : void 0);
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function readUpdateInstallReceiptPayload(env = process.env) {
	try {
		const reply = await readSentinelState("restartSentinel.installReceipt", captureOpenClawStateWorkerContext({ env }));
		return reply?.ok && reply.type === "restartSentinel.installReceipt" ? reply.sentinel?.payload ?? null : null;
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
		const reply = await readSentinelState("restartSentinel.current", captureOpenClawStateWorkerContext({ env }));
		return currentSentinel(reply?.ok && reply.type === "restartSentinel.current" ? reply.state : void 0) !== null;
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
export { summarizeRestartSentinel as C, writeRestartSentinelIfUnchanged as E, reserveUpdateFailureReportReceipt as S, writeRestartSentinel as T, readRestartSentinelSnapshot as _, completeUpdateFailureReportReceiptCleanup as a, refreshUpdateFailureReportReceiptPreparation as b, formatDoctorNonInteractiveHint as c, hasUpdateFailureReportArtifactSweepLease as d, markUpdateFailureReportReceiptPending as f, readRestartSentinelReadOnly as g, readRestartSentinel as h, clearRestartSentinelIfRevision as i, formatRestartSentinelMessage as l, markUpdateRestartSentinelFailure as m, beginUpdateFailureReportReceiptCleanup as n, finalizeUpdateFailureReportReceipt as o, markUpdateFailureReportReceiptPrepared as p, claimUpdateFailureReportArtifactSweep as r, finalizeUpdateRestartSentinelRunningVersion as s, beginStaleUpdateFailureReportReceiptCleanup as t, hasRestartSentinel as u, readUpdateFailureReportReceipt as v, trimLogTail as w, releaseUpdateFailureReportArtifactSweep as x, readVerifiedGitUpdateReceipt as y };
