import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveRuntimeServiceCommit, l as resolveRuntimeServiceVersion } from "./version-jg_14gWz.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { n as decodeUpdateFailureReportMutation, r as decodeUpdateFailureReportReservation } from "./update-failure-report-receipt-Bx33fJze.mjs";
//#region src/infra/restart-sentinel.ts
const sentinelLog = createSubsystemLogger("restart-sentinel");
function formatDoctorNonInteractiveHint(env = process.env) {
	return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function runRestartSentinelOperation(command, context, assertProducerCurrent, decodeCommit) {
	const captured = structuredClone(command);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertProducerCurrent?.();
	};
	for (let attempt = 0;; attempt += 1) {
		let admission;
		let transactionRequested = false;
		const createAdmission = createSqliteWorkerWriteAdmission(() => {
			transactionRequested = true;
			assertCurrent();
		}, [context.admission.databasePath]);
		try {
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), {
				assertCurrent,
				createAdmission: (operation) => {
					const retained = createAdmission(operation);
					admission = retained.admission;
					return retained;
				}
			});
			context.admission.assertCurrent();
			return result;
		} catch (error) {
			context.admission.assertCurrent();
			const facts = admission?.committed?.facts;
			if (decodeCommit && isRecord(facts) && facts.kind === "update-report-result") {
				const result = decodeCommit(facts.value);
				if (result !== void 0) return result;
			}
			if (decodeCommit && attempt === 0 && !transactionRequested && isSqliteLockError(error)) continue;
			throw error;
		}
	}
}
async function writeRestartSentinel(payload, env = process.env, assertProducerCurrent) {
	return runRestartSentinelOperation({
		type: "restartSentinel.write",
		input: payload
	}, captureOpenClawStateWorkerContext({ env }), assertProducerCurrent);
}
function reserveUpdateFailureReportReceipt(attemptId, reservationId, previewDigest, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.reserve",
		input: {
			attemptId,
			reservationId,
			previewDigest
		}
	}, context, void 0, decodeUpdateFailureReportReservation);
}
function beginUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.beginCleanup",
		input: {
			attemptId,
			reservationId
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function beginStaleUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.beginStaleCleanup",
		input: {
			attemptId,
			reservationId
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function completeUpdateFailureReportReceiptCleanup(attemptId, reservationId, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.completeCleanup",
		input: {
			attemptId,
			reservationId
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function claimUpdateFailureReportArtifactSweep(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.claimSweep",
		input: {
			attemptId,
			expectedReservationId,
			sweepOwnerId,
			sweepGeneration
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function releaseUpdateFailureReportArtifactSweep(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.releaseSweep",
		input: {
			attemptId,
			expectedReservationId,
			sweepOwnerId,
			sweepGeneration
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function refreshUpdateFailureReportReceiptPreparation(attemptId, reservationId, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.refreshPreparation",
		input: {
			attemptId,
			reservationId
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function finalizeUpdateFailureReportReceipt(attemptId, receipt, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.finalizeReceipt",
		input: {
			attemptId,
			receipt
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
function markUpdateFailureReportReceiptPending(attemptId, reservationId, previewDigest, env = process.env, context = captureOpenClawStateWorkerContext({ env }), assertProducerCurrent) {
	return runRestartSentinelOperation({
		type: "restartSentinel.markPending",
		input: {
			attemptId,
			reservationId,
			previewDigest
		}
	}, context, assertProducerCurrent, decodeUpdateFailureReportMutation);
}
function markUpdateFailureReportReceiptPrepared(attemptId, reservationId, previewDigest, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	return runRestartSentinelOperation({
		type: "restartSentinel.markPrepared",
		input: {
			attemptId,
			reservationId,
			previewDigest
		}
	}, context, void 0, decodeUpdateFailureReportMutation);
}
async function readUpdateFailureReportReceipt(attemptId, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	const reply = await executeExistingOpenClawStateRead({
		env: context.environment,
		path: context.admission.databasePath
	}, {
		type: "restartSentinel.reportReceipt",
		input: attemptId
	}, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	return reply?.receipt ?? null;
}
async function hasUpdateFailureReportArtifactSweepLease(attemptId, expectedReservationId, sweepOwnerId, sweepGeneration, env = process.env, context = captureOpenClawStateWorkerContext({ env })) {
	const receipt = await readUpdateFailureReportReceipt(attemptId, env, context);
	return receipt?.artifactSweep === "pending" && receipt.reservationId === expectedReservationId && receipt.sweepOwnerId === sweepOwnerId && receipt.sweepGeneration === sweepGeneration;
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
async function readRestartSentinelSnapshot(env = process.env) {
	const reply = await readSentinelState({
		type: "restartSentinel.snapshot",
		input: void 0
	}, captureOpenClawStateWorkerContext({ env }));
	if (!reply) throw new Error("Restart sentinel snapshot unavailable");
	return reply.snapshot;
}
async function finalizeUpdateRestartSentinelRunningVersion(version = resolveRuntimeServiceVersion(process.env), env = process.env, commit = resolveRuntimeServiceCommit(), runningRoot) {
	const context = captureOpenClawStateWorkerContext({ env });
	const snapshot = await readCurrentRestartSentinel(() => context, false);
	if (!snapshot || snapshot.payload.kind !== "update") return null;
	const snapshotRoot = snapshot.payload.stats?.root;
	const expectedRoot = snapshotRoot === void 0 ? null : resolveUpdateInstallRoot(snapshotRoot);
	const discoveredRoot = expectedRoot ? runningRoot ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : null;
	const actualRoot = discoveredRoot ? resolveUpdateInstallRoot(discoveredRoot) : null;
	const finalized = await runRestartSentinelOperation({
		type: "restartSentinel.finalize",
		input: {
			expectedRevision: snapshot.revision,
			version,
			commit,
			expectedRoot,
			actualRoot
		}
	}, context);
	if (finalized.installReceipt) try {
		await runRestartSentinelOperation({
			type: "restartSentinel.recordInstall",
			input: finalized.installReceipt
		}, context);
	} catch (error) {
		sentinelLog.warn(`Failed to record update install history: ${formatErrorMessage(error)}`);
	}
	return finalized.sentinel;
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
async function readSentinelState(command, context, existingOnly = false) {
	if (!existingOnly) await executeOpenClawStateWorker(context, {
		type: "restartSentinel.admit",
		input: void 0
	});
	const reply = await executeExistingOpenClawStateRead({
		env: context.environment,
		path: context.admission.databasePath
	}, command, { context });
	context.admission.assertCurrent();
	return reply;
}
function currentSentinel(current) {
	if (current?.kind === "invalid") sentinelLog.warn("Ignoring invalid typed restart sentinel row");
	return current?.kind === "valid" ? current.sentinel : null;
}
async function readCurrentRestartSentinel(resolveContext, existingOnly, action = "read") {
	try {
		return currentSentinel((await readSentinelState({
			type: "restartSentinel.current",
			input: void 0
		}, resolveContext(), existingOnly))?.state);
	} catch (err) {
		sentinelLog.warn(`Failed to ${action} restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
function readRestartSentinel(env = process.env) {
	return readCurrentRestartSentinel(() => captureOpenClawStateWorkerContext({ env }), false);
}
/** Read the restart sentinel without creating or mutating shared state. */
function readRestartSentinelReadOnly(env = process.env) {
	return readCurrentRestartSentinel(() => captureOpenClawStateWorkerContext({ env }), true);
}
async function readUpdateInstallReceiptPayload(env = process.env) {
	try {
		return (await readSentinelState({
			type: "restartSentinel.installReceipt",
			input: void 0
		}, captureOpenClawStateWorkerContext({ env })))?.sentinel?.payload ?? null;
	} catch (err) {
		sentinelLog.warn(`Failed to read update install receipt: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function readVerifiedGitUpdateReceipt(env = process.env) {
	const payload = await readUpdateInstallReceiptPayload(env);
	if (payload?.kind !== "update" || payload.stats?.mode !== "git" || !payload.stats.after) return null;
	const root = payload.stats.root?.trim() ?? "";
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
async function hasRestartSentinel(env = process.env) {
	return await readCurrentRestartSentinel(() => captureOpenClawStateWorkerContext({ env }), false, "check") !== null;
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
function summarizeRestartSentinel(payload) {
	if (payload.kind === "config-auto-recovery") return "Gateway auto-recovery";
	if ((payload.kind === "config-apply" || payload.kind === "config-patch") && payload.status === "ok" && payload.stats?.requiresRestart === true) return `Gateway restart required${payload.stats?.mode ? ` (${payload.stats.mode})` : ""}`.trim();
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
