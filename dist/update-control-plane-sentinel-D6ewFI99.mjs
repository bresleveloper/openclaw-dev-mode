import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { T as writeRestartSentinel, c as formatDoctorNonInteractiveHint, m as markUpdateRestartSentinelFailure } from "./restart-sentinel-KM6PPxhT.mjs";
import { a as mergeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { d as updateRunStepKey } from "./update-run-write-rAL063vt.mjs";
import { r as isUpdateGatewayReadinessPending } from "./update-run-step-ijjXM1mH.mjs";
import "./update-run-ledger-CwAEg-5V.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import fs from "node:fs/promises";
//#region src/infra/update-restart-notice.ts
/** Explicit routing wins; fallback belongs only to the original session owner. */
function resolveUpdateRestartNoticeMeta(run, meta) {
	const sessionKey = meta.sessionKey ?? run?.origin.sessionKey;
	const originDelivery = !meta.sessionKey || meta.sessionKey === run?.origin.sessionKey ? run?.origin.deliveryContext : void 0;
	const resolvedMeta = {
		...meta,
		...sessionKey ? { sessionKey } : {}
	};
	if (!originDelivery) return resolvedMeta;
	const route = mergeDeliveryContext({
		...meta.deliveryContext,
		...meta.threadId != null ? { threadId: meta.threadId } : {}
	}, originDelivery);
	if (!route) return resolvedMeta;
	const { threadId, ...deliveryContext } = route;
	return {
		...resolvedMeta,
		deliveryContext,
		...threadId != null ? { threadId: String(threadId) } : {}
	};
}
/** Notices resume requested work; a standalone CLI run is reported by its ledger. */
function shouldPublishUpdateRestartNotice(run, meta) {
	return !(run?.trigger === "cli" && !run.origin.sessionKey && !run.origin.deliveryContext && !meta.sessionKey?.trim() && !meta.deliveryContext && meta.threadId == null && !meta.note?.trim() && !meta.continuationMessage?.trim());
}
//#endregion
//#region src/infra/update-restart-sentinel-payload.ts
function normalizeControlPlaneUpdateResult(input) {
	const lint = input.postUpdate?.plugins?.doctorLint;
	const result = lint && !input.steps.some((step) => step.name === lint.name) ? {
		...input,
		steps: [...input.steps, lint]
	} : input;
	if ((result.status === "ok" || result.status === "skipped" && result.reason === "already-current") && isUpdateGatewayReadinessPending(result)) return {
		...result,
		status: "skipped",
		reason: result.reason === "still-starting" ? "still-starting" : "gateway-readiness-unverified"
	};
	return result;
}
function resolvePersistedRecovery(result) {
	const recovery = result.recovery;
	if (!recovery) return;
	return recovery.serviceRestartSafe ? {
		serviceRestartSafe: true,
		version: recovery.version,
		buildId: recovery.buildId,
		service: recovery.service
	} : {
		serviceRestartSafe: false,
		reason: recovery.reason
	};
}
/** Build the restart sentinel payload written after update runs. */
function buildUpdateRestartSentinelPayload(params) {
	const result = normalizeControlPlaneUpdateResult(params.result);
	const recovery = resolvePersistedRecovery(result);
	const { meta } = params;
	const continuationMessage = result.status === "ok" ? meta.continuationMessage?.trim() : void 0;
	const continuation = continuationMessage ? {
		kind: "agentTurn",
		message: continuationMessage
	} : null;
	return {
		kind: "update",
		status: result.status,
		ts: params.nowMs ?? Date.now(),
		...meta.sessionKey ? { sessionKey: meta.sessionKey } : {},
		...meta.deliveryContext ? { deliveryContext: meta.deliveryContext } : {},
		...meta.threadId ? { threadId: meta.threadId } : {},
		message: meta.note ?? null,
		...continuation ? { continuation } : {},
		doctorHint: formatDoctorNonInteractiveHint(),
		stats: {
			...meta.runId || result.runId ? { runId: meta.runId ?? result.runId } : {},
			mode: result.mode,
			...meta.root || result.root ? { root: meta.root ?? result.root } : {},
			...meta.target ? { target: meta.target } : {},
			...meta.handoffId ? { handoffId: meta.handoffId } : {},
			...recovery ? { recovery } : {},
			before: result.before ?? null,
			after: result.after ?? null,
			steps: result.steps.map((step) => ({
				name: updateRunStepKey(step.name),
				command: step.command,
				cwd: step.cwd,
				durationMs: step.durationMs,
				...step.advisory ? { advisory: true } : {},
				...step.failureFacts?.length ? { failureFacts: step.failureFacts } : {},
				log: {
					stdoutTail: step.stdoutTail ?? null,
					stderrTail: step.stderrTail ?? null,
					exitCode: step.exitCode ?? null
				}
			})),
			reason: result.reason ?? null,
			durationMs: result.durationMs
		}
	};
}
//#endregion
//#region src/infra/update-control-plane-sentinel.ts
const CONTROL_PLANE_UPDATE_SENTINEL_META_ENV = "OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META";
const UPDATE_RUN_ID_ENV = "OPENCLAW_UPDATE_RUN_ID";
const CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON = "managed-service-handoff-started";
const CONTROL_PLANE_UPDATE_RESTART_HEALTH_PENDING_REASON = "restart-health-pending";
function resolveManagedServiceUpdateFailureExitCode(result) {
	return process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" && result.recovery?.serviceRestartSafe === false ? 79 : 1;
}
const CONTROL_PLANE_UPDATE_PENDING_REASONS = /* @__PURE__ */ new Set([CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON, CONTROL_PLANE_UPDATE_RESTART_HEALTH_PENDING_REASON]);
/** Convert an update result into the restart-health-pending sentinel result. */
function buildControlPlaneUpdateRestartHealthPendingResult(result) {
	return {
		...result.runId ? { runId: result.runId } : {},
		status: "skipped",
		mode: result.mode,
		...result.root ? { root: result.root } : {},
		reason: CONTROL_PLANE_UPDATE_RESTART_HEALTH_PENDING_REASON,
		...result.before ? { before: result.before } : {},
		...result.after ? { after: result.after } : {},
		steps: result.steps,
		durationMs: result.durationMs
	};
}
/** Return true when an update sentinel represents an in-progress control-plane restart. */
function isPendingControlPlaneUpdateRestartSentinel(payload) {
	const reason = payload.stats?.reason;
	return payload.kind === "update" && payload.status === "skipped" && typeof reason === "string" && CONTROL_PLANE_UPDATE_PENDING_REASONS.has(reason);
}
function normalizeMeta(value) {
	if (!isRecord(value)) return null;
	const sessionKey = readNonBlankString(value.sessionKey);
	const runId = readNonBlankString(value.runId);
	const threadId = readNonBlankString(value.threadId);
	const handoffId = readNonBlankString(value.handoffId);
	const root = readNonBlankString(value.root);
	const target = readNonBlankString(value.target);
	const triageContextPath = readNonBlankString(value.triageContextPath);
	let foregroundOrigin;
	if (value.foregroundOrigin !== void 0) {
		const origin = value.foregroundOrigin;
		if (!isRecord(origin)) return null;
		const owner = readNonBlankString(origin.owner);
		const pid = asPositiveSafeInteger(origin.pid);
		const host = readNonBlankString(origin.host);
		const port = asPositiveSafeInteger(origin.port);
		const stateDatabasePath = readNonBlankString(origin.stateDatabasePath);
		const configPath = readNonBlankString(origin.configPath);
		if (!owner || !pid || !host || !port || port > 65535 || typeof origin.startedAt !== "number" || !Number.isSafeInteger(origin.startedAt) || origin.startedAt < 0 || !stateDatabasePath || !configPath) return null;
		foregroundOrigin = {
			owner,
			pid,
			host,
			startedAt: origin.startedAt,
			port,
			stateDatabasePath,
			configPath
		};
	}
	const channel = isRecord(value.deliveryContext) ? readNonBlankString(value.deliveryContext.channel) : void 0;
	const to = isRecord(value.deliveryContext) ? readNonBlankString(value.deliveryContext.to) : void 0;
	const accountId = isRecord(value.deliveryContext) ? readNonBlankString(value.deliveryContext.accountId) : void 0;
	const deliveryContext = channel || to || accountId ? {
		...channel ? { channel } : {},
		...to ? { to } : {},
		...accountId ? { accountId } : {}
	} : void 0;
	return {
		...runId ? { runId } : {},
		...foregroundOrigin ? { foregroundOrigin } : {},
		...value.completionOwner === "gateway-restart" ? { completionOwner: "gateway-restart" } : {},
		...typeof value.serviceStoppedAtMs === "number" && Number.isSafeInteger(value.serviceStoppedAtMs) && value.serviceStoppedAtMs >= 0 ? { serviceStoppedAtMs: value.serviceStoppedAtMs } : {},
		...root ? { root } : {},
		...target ? { target } : {},
		...triageContextPath ? { triageContextPath } : {},
		...sessionKey ? { sessionKey } : {},
		...deliveryContext ? { deliveryContext } : {},
		...threadId ? { threadId } : {},
		...handoffId ? { handoffId } : {},
		note: typeof value.note === "string" ? value.note : null,
		continuationMessage: typeof value.continuationMessage === "string" ? value.continuationMessage : null
	};
}
/** Read update sentinel routing metadata from the configured handoff file. */
async function readControlPlaneUpdateSentinelMeta(env = process.env) {
	const filePath = env[CONTROL_PLANE_UPDATE_SENTINEL_META_ENV]?.trim();
	if (!filePath) return null;
	try {
		const raw = await fs.readFile(filePath, "utf-8");
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed) || parsed.version !== 1) return null;
		return normalizeMeta(parsed.meta);
	} catch {
		return null;
	}
}
/** Write an update restart sentinel with control-plane routing metadata. */
async function writeControlPlaneUpdateRestartSentinel(params, env = process.env) {
	const runId = params.meta.runId ?? params.result.runId;
	const run = runId ? getUpdateRun(runId, { env }) : void 0;
	const meta = resolveUpdateRestartNoticeMeta(run, params.meta);
	if (!shouldPublishUpdateRestartNotice(run, meta)) return;
	const payload = buildUpdateRestartSentinelPayload({
		result: params.result,
		meta
	});
	if (meta.completionOwner === "gateway-restart" && !isPendingControlPlaneUpdateRestartSentinel(payload) && payload.stats) delete payload.stats.handoffId;
	await writeRestartSentinel(payload, env);
}
/** Mark the pending update restart sentinel as failed. */
async function markControlPlaneUpdateRestartSentinelFailure(reason, meta, env = process.env) {
	if (meta?.runId && !shouldPublishUpdateRestartNotice(getUpdateRun(meta.runId, { env }), meta)) return null;
	return (await markUpdateRestartSentinelFailure(reason, env, meta))?.payload ?? null;
}
//#endregion
export { isPendingControlPlaneUpdateRestartSentinel as a, resolveManagedServiceUpdateFailureExitCode as c, normalizeControlPlaneUpdateResult as d, buildControlPlaneUpdateRestartHealthPendingResult as i, writeControlPlaneUpdateRestartSentinel as l, CONTROL_PLANE_UPDATE_SENTINEL_META_ENV as n, markControlPlaneUpdateRestartSentinelFailure as o, UPDATE_RUN_ID_ENV as r, readControlPlaneUpdateSentinelMeta as s, CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON as t, buildUpdateRestartSentinelPayload as u };
