import { f as toStructuredErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./worker-protocol-primitives-BajTgPT4.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES } from "./worker-inference-B7U4TRc2.mjs";
import { a as workerProtocolObject, r as hasExactOwnKeys } from "./protocol-record-CQCXx-YV.mjs";
import { i as parseWorkerLaunchDescriptor, o as WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES } from "./launch-descriptor-BQV4k-tD.mjs";
//#region src/worker/worker-connection-contract.ts
const FENCED_CLOSE_REASONS = /* @__PURE__ */ new Set(["credential-replaced", "owner-epoch-mismatch"]);
function isFencedCloseReason(reason) {
	return FENCED_CLOSE_REASONS.has(reason);
}
var WorkerConnectionInterruptedError = class extends Error {
	constructor(message = "worker connection interrupted") {
		super(message);
		this.name = "WorkerConnectionInterruptedError";
	}
};
var WorkerConnectionStoppedError = class extends Error {
	constructor(message = "worker connection stopped") {
		super(message);
		this.name = "WorkerConnectionStoppedError";
	}
};
var WorkerAdmissionError = class extends Error {
	constructor(reason, retryable) {
		super(`worker admission rejected: ${reason}`);
		this.reason = reason;
		this.retryable = retryable;
		this.name = "WorkerAdmissionError";
	}
};
const WORKER_ADMISSION_DEADLINE_MS = 12e4;
var WorkerAdmissionDeadlineExceededError = class extends Error {
	constructor(diagnosis) {
		super(diagnosis);
		this.name = "WorkerAdmissionDeadlineExceededError";
	}
};
const WorkerAdmissionDeadlineResultSchema = workerProtocolObject({
	status: literal("not-started"),
	reason: literal("admission-deadline"),
	errorText: string().min(1).refine((value) => Buffer.byteLength(value, "utf8") <= 4096 && !/[\r\n\0]/u.test(value))
});
function parseWorkerAdmissionDeadlineResult(value) {
	return WorkerAdmissionDeadlineResultSchema.safeParse(value).data;
}
var WorkerFencedError = class extends Error {
	constructor(reason) {
		super(`worker fenced: ${reason}`);
		this.reason = reason;
		this.name = "WorkerFencedError";
	}
};
function resolvePositiveTimeout(value, fallback) {
	if (value === void 0) return fallback;
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error("worker connection timeout must be a positive safe integer");
	return value;
}
function formatWorkerConnectionFailure(options, error, attempts) {
	const endpoint = options.endpoint;
	let address;
	if (endpoint.kind === "websocket") {
		const url = new URL(endpoint.url);
		address = `${url.hostname}:${url.port || (url.protocol === "wss:" ? "443" : "80")}`;
	} else address = endpoint.socketPath;
	const target = truncateUtf16Safe(address, 128);
	let detail = toStructuredErrorObject(error).message;
	const access = endpoint.kind === "websocket" ? endpoint.cloudflareAccess : void 0;
	const credentials = [options.connectParams.admission.credential, ...access ? [access.clientId, access.clientSecret] : []];
	for (const credential of credentials) for (const value of [
		credential,
		encodeURIComponent(credential),
		JSON.stringify(credential).slice(1, -1)
	]) if (value) detail = detail.replaceAll(value, "[REDACTED]");
	if (endpoint.kind === "websocket") detail = detail.replaceAll(endpoint.url, target);
	const cause = truncateUtf16Safe(redactSensitiveText(detail, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 160) || "connection failed";
	if (attempts !== void 0) return `worker admission deadline exceeded after ${attempts} attempts to ${target}: ${cause}`;
	return `worker could not reach gateway ${target}: ${cause}; ${endpoint.kind === "websocket" ? "check TLS pin/publicUrl configuration" : "check the local gateway socket"}`;
}
//#endregion
//#region src/worker/worker-process-protocol.ts
function buildWorkerProcessTurn(descriptor, idleRetention = false) {
	return {
		type: "turn",
		turnId: descriptor.assignment.turnId,
		descriptor,
		...idleRetention ? { idleRetention: true } : {}
	};
}
function measureWorkerProcessTurnBytes(plan, idleRetention = false) {
	return Buffer.byteLength(JSON.stringify(buildWorkerProcessTurn({
		...plan,
		connectionEndpoint: null
	}, idleRetention))) - 4 + WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES;
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
		reason: literal("turn-failed"),
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
}).refine(({ result, retainWorker, retention }) => (retention === void 0 || retainWorker) && (!retainWorker || result.status === "completed" || result.status === "failed"));
const ProcessMessageSchema = union([ProcessResultSchema, workerProtocolObject({
	type: literal("idle-ready"),
	turnId: TurnIdSchema
})]);
function parseWorkerProcessRequest(value) {
	if (!isRecord(value) || typeof value.turnId !== "string" || !value.turnId.trim() || value.turnId.length > 256) throw new Error("invalid managed worker request");
	if (value.type === "cancel" && hasExactOwnKeys(value, ["type", "turnId"])) return {
		type: "cancel",
		turnId: value.turnId
	};
	if (value.type === "turn" && hasExactOwnKeys(value, [
		"type",
		"turnId",
		"descriptor"
	], ["idleRetention"]) && (value.idleRetention === void 0 || value.idleRetention === true)) {
		const descriptor = parseWorkerLaunchDescriptor(value.descriptor);
		if (descriptor.assignment.turnId !== value.turnId) throw new Error("managed worker request disagrees with its assigned turn");
		return buildWorkerProcessTurn(descriptor, value.idleRetention === true);
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
export { parseWorkerRuntimeResult as a, WorkerAdmissionDeadlineExceededError as c, WorkerConnectionStoppedError as d, WorkerFencedError as f, resolvePositiveTimeout as g, parseWorkerAdmissionDeadlineResult as h, parseWorkerProcessRequest as i, WorkerAdmissionError as l, isFencedCloseReason as m, measureWorkerProcessTurnBytes as n, serializeWorkerProcessInput as o, formatWorkerConnectionFailure as p, parseWorkerProcessMessage as r, WORKER_ADMISSION_DEADLINE_MS as s, buildWorkerProcessTurn as t, WorkerConnectionInterruptedError as u };
