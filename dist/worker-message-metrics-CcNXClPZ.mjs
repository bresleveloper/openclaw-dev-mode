import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { isMainThread } from "node:worker_threads";
import { types } from "node:util";
//#region src/infra/worker-message-metrics.ts
const counters = resolveGlobalSingleton(Symbol.for("openclaw.workerMessageMetrics"), () => /* @__PURE__ */ new Map());
/** The main endpoint counts each crossing once, using byte lengths already known by its owner. */
function recordWorkerMessage(kind, direction, payloadBytes) {
	if (!isMainThread) return;
	let directions = counters.get(kind);
	if (!directions) {
		directions = {};
		counters.set(kind, directions);
	}
	const counter = directions[direction] ??= {
		kind,
		direction,
		messages: 0,
		payloadBytes: 0,
		unmeasuredMessages: 0
	};
	counter.messages++;
	if (payloadBytes === void 0) counter.unmeasuredMessages++;
	else counter.payloadBytes += payloadBytes;
}
/** Process-lifetime totals survive worker retirement and Gateway restarts in the same process. */
function getWorkerMessageMetrics() {
	return [...counters.values()].flatMap((directions) => Object.values(directions).map((counter) => Object.assign({}, counter)));
}
function messageData(message) {
	return isRecord(message) && !types.isProxy(message) ? message : void 0;
}
function dataProperty(message, key) {
	return Object.getOwnPropertyDescriptor(message, key)?.value;
}
function messageBody(message) {
	const data = messageData(message);
	const type = data && dataProperty(data, "type");
	return data && (type === "post" || type === "message") ? dataProperty(data, "value") : message;
}
/** Known payload bytes only: no serialization, graph traversal, or envelope estimate. */
function workerMessagePayloadBytes(message) {
	if (!isMainThread) return;
	const body = messageBody(message);
	const data = messageData(body);
	const payload = data && (Object.getOwnPropertyDescriptor(data, "value") ?? Object.getOwnPropertyDescriptor(data, "input"));
	if (payload && !("value" in payload)) return;
	const value = payload ? payload.value : body;
	if (types.isProxy(value)) return;
	if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
		const preparation = data && dataProperty(data, "type") === "open" ? dataProperty(data, "preparation") : void 0;
		return value.byteLength + (ArrayBuffer.isView(preparation) ? preparation.byteLength : 0);
	}
	if (typeof value === "string") return value.length * 2;
	if (value === null || value === void 0) return 0;
}
function messageKind(message, fallback) {
	const body = messageData(messageBody(message));
	if (!body) return fallback;
	switch (dataProperty(body, "status")) {
		case "ok":
		case "failed": return "task_reply";
		case "request": return "task_request";
		case "notification": return "task_notification";
		case "consumed": return "task_consumed";
		case "memory": return "memory";
		case "ready": return "lifecycle";
	}
	if (typeof dataProperty(body, "taskId") === "number") return "task_input";
	if (typeof dataProperty(body, "actor") === "number") return "sqlite_request";
	if (typeof dataProperty(body, "id") === "number" && typeof dataProperty(body, "ok") === "boolean") return "sqlite_reply";
	if (typeof dataProperty(body, "operationId") === "number") switch (dataProperty(body, "type")) {
		case "prepare":
		case "reclaim":
		case "canonical-validation": return "sqlite_request";
		case "reclaimed":
		case "refused":
		case "checkpoint": return "sqlite_reply";
		case "admission":
		case "admission-request":
		case "admission-release": return "admission";
		case "commit-request": return "authority";
	}
	switch (dataProperty(body, "type")) {
		case "resource-owner":
		case "resource-message":
		case "resource-closed": return "resource";
		case "cpu":
		case "heap": return "memory";
		case "create":
		case "created":
		case "stop":
		case "stopped":
		case "close":
		case "closed":
		case "release":
		case "ref":
		case "execution-exit":
		case "error":
		case "messageerror":
		case "create-error":
		case "stop-error":
		case "request-error": return "lifecycle";
	}
	return dataProperty(body, "closeResource") === true ? "resource" : fallback;
}
/** Observe each native boundary once; null preserves a prepared unknown byte count. */
function observeWorkerMessage(message, direction, fallbackKind = "other", payloadBytes) {
	if (isMainThread) recordWorkerMessage(messageKind(message, fallbackKind), direction, payloadBytes === void 0 ? workerMessagePayloadBytes(message) : payloadBytes ?? void 0);
}
//#endregion
export { workerMessagePayloadBytes as i, observeWorkerMessage as n, recordWorkerMessage as r, getWorkerMessageMetrics as t };
