import { p as toStructuredErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as workerProtocolObject } from "./protocol-record-qtYtFfXV.mjs";
//#region src/worker/worker-connection-contract.ts
function isFencedCloseReason(reason) {
	return reason === "credential-replaced" || reason === "owner-epoch-mismatch";
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
export { WorkerConnectionInterruptedError as a, formatWorkerConnectionFailure as c, resolvePositiveTimeout as d, WorkerAdmissionError as i, isFencedCloseReason as l, WorkerAdmissionDeadlineExceededError as n, WorkerConnectionStoppedError as o, WorkerAdmissionDeadlineResultSchema as r, WorkerFencedError as s, WORKER_ADMISSION_DEADLINE_MS as t, parseWorkerAdmissionDeadlineResult as u };
