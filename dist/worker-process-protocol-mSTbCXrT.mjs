import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Jn as string, Kt as custom, Lt as boolean, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./worker-protocol-primitives-wrWgxYRD.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES } from "./worker-inference-DQS6vE1x.mjs";
import { l as SessionsProcessesStopResultSchema, s as SessionsProcessesListResultSchema } from "./session-processes-C3V27wAB.mjs";
import { a as workerProtocolObject, i as workerProtocolIdentifier, r as hasExactOwnKeys, t as WorkerGatewayNamespace } from "./protocol-record-qtYtFfXV.mjs";
import { a as WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES, r as parseWorkerLaunchDescriptor } from "./launch-descriptor-DPZyXmqm.mjs";
import { r as WorkerAdmissionDeadlineResultSchema } from "./worker-connection-contract-BLrCYghU.mjs";
import { Value } from "typebox/value";
//#region src/worker/worker-process-observation.ts
const identifier = workerProtocolIdentifier;
const binding = {
	environmentId: identifier("environmentId"),
	sessionId: identifier("sessionId"),
	ownerEpoch: number().int().nonnegative()
};
const operation = union([workerProtocolObject({ action: literal("list") }), workerProtocolObject({
	action: literal("stop"),
	processId: identifier("processId"),
	instanceId: identifier("instanceId")
})]);
const nodeRequest = workerProtocolObject({
	...binding,
	gatewayNamespace: WorkerGatewayNamespace,
	placementGeneration: number().int().nonnegative(),
	expectedBundleHash: string().regex(/^[a-f0-9]{64}$/u),
	operation
});
function parseNodeWorkerProcessInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > 4096) throw new Error("INVALID_REQUEST: invalid worker process request");
	return nodeRequest.parse(JSON.parse(raw));
}
const WorkerProcessObservationRequestSchema = workerProtocolObject({
	type: literal("process"),
	requestId: identifier("requestId"),
	...binding,
	operation
});
const WorkerProcessObservationResultSchema = workerProtocolObject({
	type: literal("process-result"),
	requestId: identifier("requestId"),
	result: union([custom((value) => Value.Check(SessionsProcessesListResultSchema, value)), custom((value) => Value.Check(SessionsProcessesStopResultSchema, value))]).optional(),
	error: string().max(512).optional()
}).refine((value) => value.result !== void 0 !== (value.error !== void 0));
//#endregion
//#region src/worker/worker-process-protocol.ts
function buildWorkerProcessTurn(descriptor, idleRetention = false, canonicalWorkspace = false) {
	return {
		type: "turn",
		turnId: descriptor.assignment.turnId,
		descriptor,
		...idleRetention ? { idleRetention: true } : {},
		...canonicalWorkspace ? { canonicalWorkspace: true } : {}
	};
}
function measureWorkerProcessTurnBytes(plan, idleRetention = false) {
	return Buffer.byteLength(JSON.stringify(buildWorkerProcessTurn({
		...plan,
		connectionEndpoint: null
	}, idleRetention, true))) - 4 + WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES;
}
function serializeWorkerProcessInput(message) {
	const json = JSON.stringify(message);
	if (Buffer.byteLength(json, "utf8") > WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) throw new Error("managed worker request exceeds the protocol payload limit");
	return `${json}\n`;
}
const TranscriptResultFields = {
	transcriptLeafId: string().nullable(),
	transcriptNextSeq: number().int().min(1).max(Number.MAX_SAFE_INTEGER)
};
const RuntimeResultSchema = union([
	WorkerAdmissionDeadlineResultSchema,
	workerProtocolObject({
		status: literal("fenced"),
		reason: _enum(["credential-replaced", "owner-epoch-mismatch"])
	}),
	workerProtocolObject({
		status: literal("completed"),
		...TranscriptResultFields
	}),
	workerProtocolObject({
		status: literal("failed"),
		reason: _enum(["turn-failed", "node-lost"]),
		...TranscriptResultFields
	})
]);
const TurnIdSchema = string().refine((value) => Boolean(value.trim()) && value.length <= 256);
const ProcessResultSchema = workerProtocolObject({
	type: literal("result"),
	turnId: TurnIdSchema,
	result: RuntimeResultSchema,
	retainWorker: boolean(),
	retention: _enum(["background", "idle"]).optional()
}).refine(({ result, retainWorker, retention }) => (retention === void 0 || retainWorker) && (!retainWorker || result.status === "completed" || result.status === "failed" && result.reason === "turn-failed"));
const ProcessMessageSchema = union([
	WorkerProcessObservationResultSchema,
	ProcessResultSchema,
	workerProtocolObject({
		type: literal("idle-ready"),
		turnId: TurnIdSchema
	})
]);
function parseWorkerProcessRequest(value) {
	const observation = WorkerProcessObservationRequestSchema.safeParse(value);
	if (observation.success) return observation.data;
	if (!isRecord(value) || typeof value.turnId !== "string" || !value.turnId.trim() || value.turnId.length > 256) throw new Error("invalid managed worker request");
	if (value.type === "cancel" && hasExactOwnKeys(value, ["type", "turnId"])) return {
		type: "cancel",
		turnId: value.turnId
	};
	if (value.type === "turn" && hasExactOwnKeys(value, [
		"type",
		"turnId",
		"descriptor"
	], ["idleRetention", "canonicalWorkspace"]) && (value.idleRetention === void 0 || value.idleRetention === true) && (value.canonicalWorkspace === void 0 || value.canonicalWorkspace === true)) {
		const descriptor = parseWorkerLaunchDescriptor(value.descriptor);
		if (descriptor.assignment.turnId !== value.turnId) throw new Error("managed worker request disagrees with its assigned turn");
		return buildWorkerProcessTurn(descriptor, value.idleRetention === true, value.canonicalWorkspace === true);
	}
	throw new Error("invalid managed worker request");
}
function parseWorkerRuntimeResult(value) {
	return RuntimeResultSchema.safeParse(value).data ?? null;
}
function parseWorkerProcessMessage(value) {
	return ProcessMessageSchema.safeParse(value).data ?? null;
}
//#endregion
export { parseWorkerRuntimeResult as a, parseWorkerProcessRequest as i, measureWorkerProcessTurnBytes as n, serializeWorkerProcessInput as o, parseWorkerProcessMessage as r, parseNodeWorkerProcessInput as s, buildWorkerProcessTurn as t };
