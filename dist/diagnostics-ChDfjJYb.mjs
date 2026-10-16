import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getTrackedWorkerPoolSnapshot } from "./worker-cpu-DU6Cf6Aq.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { c as normalizeDiagnosticStabilityQuery, t as getDiagnosticStabilitySnapshot } from "./diagnostic-stability-D-6e47hh.mjs";
import { n as SUBAGENT_LANE_PREFIX, r as SWARM_LANE_PREFIX, t as STATIC_COMMAND_LANES } from "./lanes-D7a4ntDu.mjs";
import { _ as getQueueState, d as listCommandLaneTotals, o as getCommandLaneSnapshot } from "./command-queue-CFE60Avj.mjs";
import { n as getBackgroundWorkSnapshot, r as isBackgroundWorkLane } from "./background-work-53N6rVrD.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/diagnostics.ts
/** Integer inputs are clamped by the capture owner to safe sampling bounds. */
const DiagnosticsHeapProfileParamsSchema = closedObject({
	durationMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	samplingIntervalBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	includeObjectsCollectedByMajorGC: Type.Optional(Type.Boolean()),
	includeObjectsCollectedByMinorGC: Type.Optional(Type.Boolean())
});
const validateDiagnosticsHeapProfileParams = /* @__PURE__ */ lazyCompile(DiagnosticsHeapProfileParamsSchema);
const DiagnosticsHeapSnapshotParamsSchema = closedObject({ reason: Type.Optional(Type.String({ maxLength: 256 })) });
const validateDiagnosticsHeapSnapshotParams = /* @__PURE__ */ lazyCompile(DiagnosticsHeapSnapshotParamsSchema);
//#endregion
//#region src/process/command-lane-diagnostics.ts
const STATIC_COMMAND_LANE_SET = new Set(STATIC_COMMAND_LANES);
const MAX_SWARM_LANE_SNAPSHOTS = 32;
function getSubagentLaneSnapshot() {
	const snapshot = {
		...getCommandLaneSnapshot("subagent"),
		concurrencyScope: "session",
		saturatedLaneCount: 0
	};
	for (const state of getQueueState().lanes.values()) {
		if (!state.lane.startsWith(SUBAGENT_LANE_PREFIX) || state.lane.startsWith(SWARM_LANE_PREFIX)) continue;
		const activeCount = state.activeTaskIds.size;
		snapshot.activeCount += activeCount;
		snapshot.queuedCount += state.queue.length;
		snapshot.draining ||= state.draining;
		snapshot.generation = Math.max(snapshot.generation, state.generation);
		if (activeCount >= state.maxConcurrent) {
			snapshot.saturatedLaneCount = (snapshot.saturatedLaneCount ?? 0) + 1;
			snapshot.blockedBy = "lane";
		}
	}
	return snapshot;
}
function getCommandLaneDiagnostics() {
	const lanes = [...STATIC_COMMAND_LANES].toSorted().map((lane) => {
		if (lane === "background") return getBackgroundWorkSnapshot();
		if (lane === "subagent") return getSubagentLaneSnapshot();
		return getCommandLaneSnapshot(lane);
	}).filter((lane) => lane.maxConcurrent > 0 || lane.activeCount > 0 || lane.queuedCount > 0);
	const dynamic = {
		laneCount: 0,
		activeCount: 0,
		queuedCount: 0,
		queuedLaneCount: 0
	};
	let swarmSnapshots = 0;
	for (const totals of listCommandLaneTotals()) {
		if (totals.lane.startsWith(SWARM_LANE_PREFIX)) {
			if (swarmSnapshots < MAX_SWARM_LANE_SNAPSHOTS) {
				lanes.push(getCommandLaneSnapshot(totals.lane));
				swarmSnapshots += 1;
				continue;
			}
		} else if (STATIC_COMMAND_LANE_SET.has(totals.lane) || isBackgroundWorkLane(totals.lane) || totals.lane.startsWith(SUBAGENT_LANE_PREFIX)) continue;
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
async function captureProfile({ client, signal, context, respond, hasCurrentClientAuthority }, label, capture) {
	const lifetime = AbortSignal.any([
		signal,
		client?.connectionSignal,
		context.requestEntryLifetime?.signal
	].filter((value) => value !== void 0));
	const hasAuthority = () => !client?.invalidated && (hasCurrentClientAuthority?.() ?? true);
	const outcome = await capture({
		signal: lifetime,
		hasAuthority
	});
	if (lifetime.aborted || !hasAuthority()) return;
	if (outcome.status === "complete") respond(true, outcome.result, void 0);
	else {
		const message = outcome.reason === "tracing-active" ? `${label} unavailable: stop active Node tracing, including non-CPU categories, before requesting a profile` : `${label} unavailable: ${outcome.reason}`;
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details: {
			reason: outcome.reason,
			cleanupFailed: outcome.cleanupFailed
		} }));
	}
}
const diagnosticsHandlers = {
	"diagnostics.cpuProfile": async (options) => {
		const { req, respond } = options;
		if (req.params !== void 0 && (!isRecord(req.params) || Object.keys(req.params).length > 0)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "diagnostics.cpuProfile accepts only empty params"));
			return;
		}
		await captureProfile(options, "CPU profile", async (authority) => {
			const { captureDiagnosticCpuProfile } = await import("./diagnostic-cpu-profile-UaPKKcM6.mjs");
			return captureDiagnosticCpuProfile(authority);
		});
	},
	"diagnostics.heapProfile": async (options) => {
		const { req, respond } = options;
		const params = req.params === void 0 ? {} : req.params;
		if (!validateDiagnosticsHeapProfileParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "diagnostics.heapProfile accepts only positive integer durationMs and samplingIntervalBytes, and boolean includeObjectsCollectedByMajorGC and includeObjectsCollectedByMinorGC"));
			return;
		}
		await captureProfile(options, "Heap profile", async (authority) => {
			const { captureDiagnosticHeapProfile } = await import("./diagnostic-heap-profile-DGdCXv1t.mjs");
			return captureDiagnosticHeapProfile({
				...params,
				...authority
			});
		});
	},
	"diagnostics.heapSnapshot": async (options) => {
		const params = options.req.params === void 0 ? {} : options.req.params;
		if (!validateDiagnosticsHeapSnapshotParams(params)) {
			options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "diagnostics.heapSnapshot accepts only an optional reason string (at most 256 characters)"));
			return;
		}
		await captureProfile(options, "Heap snapshot", async (authority) => {
			const { captureDiagnosticHeapSnapshot } = await import("./diagnostic-heap-snapshot-39uLLB7J.mjs");
			return captureDiagnosticHeapSnapshot({
				...params,
				...authority
			});
		});
	},
	"diagnostics.lanes": ({ respond }) => {
		respond(true, {
			ts: Date.now(),
			...getCommandLaneDiagnostics(),
			...getTrackedWorkerPoolSnapshot()
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
