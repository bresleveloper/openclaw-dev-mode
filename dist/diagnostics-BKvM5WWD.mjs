import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as getDiagnosticStabilitySnapshot, r as normalizeDiagnosticStabilityQuery } from "./diagnostic-stability-BaUvRyHr.mjs";
import { t as STATIC_COMMAND_LANES } from "./lanes-W9o_i0xH.mjs";
import { a as getCommandLaneSnapshot, d as listCommandLaneTotals } from "./command-queue-CaY517ob.mjs";
import { n as getBackgroundWorkSnapshot, r as isBackgroundWorkLane } from "./background-work-DnTXrmXN.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/diagnostics.ts
/** Integer inputs are clamped by the capture owner to safe sampling bounds. */
const DiagnosticsHeapProfileParamsSchema = Type.Object({
	durationMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	samplingIntervalBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
}, { additionalProperties: false });
const validateDiagnosticsHeapProfileParams = /* @__PURE__ */ lazyCompile(DiagnosticsHeapProfileParamsSchema);
//#endregion
//#region src/process/command-lane-diagnostics.ts
const STATIC_COMMAND_LANE_SET = new Set(STATIC_COMMAND_LANES);
function getCommandLaneDiagnostics() {
	const lanes = [...STATIC_COMMAND_LANES].toSorted().map((lane) => lane === "background" ? getBackgroundWorkSnapshot() : getCommandLaneSnapshot(lane)).filter((lane) => lane.maxConcurrent > 0 || lane.activeCount > 0 || lane.queuedCount > 0);
	const dynamic = {
		laneCount: 0,
		activeCount: 0,
		queuedCount: 0,
		queuedLaneCount: 0
	};
	for (const totals of listCommandLaneTotals()) {
		if (STATIC_COMMAND_LANE_SET.has(totals.lane) || isBackgroundWorkLane(totals.lane)) continue;
		dynamic.laneCount += 1;
		dynamic.activeCount += totals.activeCount;
		dynamic.queuedCount += totals.queuedCount;
		if (totals.queuedCount > 0) dynamic.queuedLaneCount += 1;
	}
	return {
		lanes,
		dynamic: dynamic.laneCount > 0 ? dynamic : null
	};
}
//#endregion
//#region src/gateway/server-methods/diagnostics.ts
/** Gateway handlers for bounded runtime diagnostics. */
const diagnosticsHandlers = {
	"diagnostics.cpuProfile": async ({ req, client, signal, context, respond, hasCurrentClientAuthority }) => {
		if (req.params !== void 0 && (!isRecord(req.params) || Object.keys(req.params).length > 0)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "diagnostics.cpuProfile accepts only empty params"));
			return;
		}
		const lifetime = AbortSignal.any([
			signal,
			client?.connectionSignal,
			context.requestEntryLifetime?.signal
		].filter((value) => value !== void 0));
		const hasAuthority = () => !client?.invalidated && (hasCurrentClientAuthority?.() ?? true);
		const { captureDiagnosticCpuProfile } = await import("./diagnostic-cpu-profile-aX_rEZRK.mjs");
		const outcome = await captureDiagnosticCpuProfile({
			signal: lifetime,
			hasAuthority
		});
		if (lifetime.aborted || !hasAuthority()) return;
		if (outcome.status === "complete") respond(true, outcome.result, void 0);
		else {
			const message = outcome.reason === "tracing-active" ? "CPU profile unavailable: stop active Node tracing, including non-CPU categories, before requesting a profile" : `CPU profile unavailable: ${outcome.reason}`;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details: {
				reason: outcome.reason,
				cleanupFailed: outcome.cleanupFailed
			} }));
		}
	},
	"diagnostics.heapProfile": async ({ req, client, signal, context, respond, hasCurrentClientAuthority }) => {
		const params = req.params === void 0 ? {} : req.params;
		if (!validateDiagnosticsHeapProfileParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "diagnostics.heapProfile accepts only positive integer durationMs and samplingIntervalBytes"));
			return;
		}
		const lifetime = AbortSignal.any([
			signal,
			client?.connectionSignal,
			context.requestEntryLifetime?.signal
		].filter((value) => value !== void 0));
		const hasAuthority = () => !client?.invalidated && (hasCurrentClientAuthority?.() ?? true);
		const { captureDiagnosticHeapProfile } = await import("./diagnostic-heap-profile-BL2iIi_D.mjs");
		const outcome = await captureDiagnosticHeapProfile({
			...params,
			signal: lifetime,
			hasAuthority
		});
		if (lifetime.aborted || !hasAuthority()) return;
		if (outcome.status === "complete") respond(true, outcome.result, void 0);
		else {
			const message = outcome.reason === "tracing-active" ? "Heap profile unavailable: stop active Node tracing, including non-CPU categories, before requesting a profile" : `Heap profile unavailable: ${outcome.reason}`;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details: {
				reason: outcome.reason,
				cleanupFailed: outcome.cleanupFailed
			} }));
		}
	},
	"diagnostics.lanes": ({ respond }) => {
		respond(true, {
			ts: Date.now(),
			...getCommandLaneDiagnostics()
		}, void 0);
	},
	"diagnostics.stability": async ({ params, respond }) => {
		try {
			const query = normalizeDiagnosticStabilityQuery(params);
			respond(true, getDiagnosticStabilitySnapshot(query), void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, err instanceof Error ? err.message : "invalid diagnostics.stability params"));
		}
	}
};
//#endregion
export { diagnosticsHandlers };
