import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Jn as string, Kt as custom, or as union, tr as transform, xn as literal } from "./schemas-BOYIvvln.mjs";
import { S as parseWorkerLaunchPlan } from "./worker-process-protocol-B6pCNPWA.mjs";
import { n as workerProtocolObject } from "./protocol-record-sxcNOJSy.mjs";
import { createHash } from "node:crypto";
//#region src/worker/node-supervisor-protocol.ts
const IDENTIFIER_MAX_CHARS = 256;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES = 4096;
const NODE_WORKER_RESULT_JSON_MAX_BYTES = 65536;
const NODE_WORKER_ERROR_TEXT_MAX_BYTES = 4096;
const NODE_WORKER_CONNECTION_FAILURE_CAUSE_MAX_BYTES = 65536;
const NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE = "openclaw-worker-connection-failure-v1";
function isNonNegativeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isPlanHash(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
const identifier = (label, maxChars = IDENTIFIER_MAX_CHARS) => custom((value) => typeof value === "string" && value.length > 0 && value.length <= maxChars && value.trim() === value && !value.includes("\0"), { error: `INVALID_REQUEST: ${label} must be a bounded non-empty identifier` });
const nonNegativeInteger = (label) => custom(isNonNegativeInteger, { error: `INVALID_REQUEST: ${label} must be a non-negative safe integer` });
const GatewayNamespace = identifier("gatewayNamespace").refine((value) => typeof value === "string" && GATEWAY_NAMESPACE_PATTERN.test(value), { error: "INVALID_REQUEST: gatewayNamespace must be a safe bounded path component" });
const IdentityShape = {
	launchId: identifier("launchId"),
	planHash: custom(isPlanHash, { error: "INVALID_REQUEST: planHash must be 64 lowercase hexadecimal characters" }),
	environmentId: identifier("environmentId"),
	sessionId: identifier("sessionId"),
	ownerEpoch: nonNegativeInteger("ownerEpoch"),
	placementGeneration: nonNegativeInteger("placementGeneration"),
	runId: identifier("runId")
};
const Identity = workerProtocolObject(IdentityShape);
const EnvironmentStop = workerProtocolObject({
	gatewayNamespace: GatewayNamespace,
	environmentId: IdentityShape.environmentId,
	sessionId: IdentityShape.sessionId,
	ownerEpoch: IdentityShape.ownerEpoch
});
const LaunchInput = workerProtocolObject({
	environmentSession: literal(1, { error: "INVALID_REQUEST: node worker environment lifetime support required" }),
	sessionKey: identifier("sessionKey", 1024).optional(),
	launchId: IdentityShape.launchId,
	gatewayNamespace: GatewayNamespace,
	expectedBundleHash: custom(isPlanHash, { error: "INVALID_REQUEST: expectedBundleHash must be 64 lowercase hexadecimal characters" }),
	descriptor: transform((value, context) => {
		try {
			return parseWorkerLaunchPlan(value);
		} catch {
			context.addIssue({
				code: "custom",
				message: "INVALID_REQUEST: invalid worker launch descriptor"
			});
			return NEVER;
		}
	}),
	placementGeneration: IdentityShape.placementGeneration
});
const Lookup = workerProtocolObject({ launchId: IdentityShape.launchId });
const Receipt = union([
	workerProtocolObject({
		...IdentityShape,
		state: _enum(["pending", "running"])
	}),
	workerProtocolObject({
		...IdentityShape,
		state: literal("completed"),
		resultJson: custom(isBoundedResultJson)
	}),
	workerProtocolObject({
		...IdentityShape,
		state: _enum([
			"failed",
			"interrupted",
			"cancelled"
		]),
		errorText: custom(isBoundedErrorText)
	})
]);
const ConnectionFailure = workerProtocolObject({
	type: literal(NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE),
	cause: string().min(1).refine((value) => Buffer.byteLength(value, "utf8") <= NODE_WORKER_CONNECTION_FAILURE_CAUSE_MAX_BYTES).nullable()
});
function parseRequest(schema, value, operation) {
	const parsed = schema.safeParse(value);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		throw new Error(issue?.path.length ? issue.message : `INVALID_REQUEST: invalid node worker ${operation} request`);
	}
	return parsed.data;
}
function decodeRequest(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
function assertNodeWorkerLaunchIdentity(input, descriptor) {
	if (descriptor.assignment.turnId !== input.launchId) throw new Error("INVALID_REQUEST: launchId must match descriptor assignment turnId");
	if (descriptor.admission.handshake.bundleHash !== input.expectedBundleHash) throw new Error("INVALID_REQUEST: descriptor bundle hash does not match expectedBundleHash");
}
function parseNodeWorkerLaunchInput(raw) {
	return validateNodeWorkerLaunchInput(decodeRequest(raw));
}
function validateNodeWorkerLaunchInput(value) {
	const input = parseRequest(LaunchInput, value, "launch");
	assertNodeWorkerLaunchIdentity(input, input.descriptor);
	if (input.sessionKey === void 0) delete input.sessionKey;
	return input;
}
function parseNodeWorkerLookupInput(raw) {
	return parseRequest(Lookup, decodeRequest(raw), "lookup");
}
function parseNodeWorkerCancelInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker cancel request");
	return parseRequest(Identity, decodeRequest(raw), "cancel");
}
function parseNodeWorkerEnvironmentStopInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker environment stop request");
	return parseRequest(EnvironmentStop, decodeRequest(raw), "environment stop");
}
function nodeWorkerPlanHash(input) {
	return createHash("sha256").update(stableStringify({
		expectedBundleHash: input.expectedBundleHash,
		descriptor: input.descriptor,
		gatewayNamespace: input.gatewayNamespace,
		placementGeneration: input.placementGeneration,
		...input.sessionKey === void 0 ? {} : { sessionKey: input.sessionKey }
	})).digest("hex");
}
function isBoundedResultJson(value) {
	if (typeof value !== "string" || value.length === 0 || Buffer.byteLength(value, "utf8") > NODE_WORKER_RESULT_JSON_MAX_BYTES) return false;
	try {
		return isRecord(JSON.parse(value));
	} catch {
		return false;
	}
}
function isBoundedErrorText(value) {
	return typeof value === "string" && value.length > 0 && Buffer.byteLength(value, "utf8") <= NODE_WORKER_ERROR_TEXT_MAX_BYTES && !/[\r\n]/u.test(value);
}
function parseNodeWorkerConnectionFailureMessage(value) {
	return ConnectionFailure.safeParse(value).data ?? null;
}
function parseNodeWorkerSupervisorReceipt(value) {
	return Receipt.safeParse(value).data ?? null;
}
//#endregion
export { parseNodeWorkerEnvironmentStopInput as a, parseNodeWorkerSupervisorReceipt as c, parseNodeWorkerConnectionFailureMessage as i, validateNodeWorkerLaunchInput as l, nodeWorkerPlanHash as n, parseNodeWorkerLaunchInput as o, parseNodeWorkerCancelInput as r, parseNodeWorkerLookupInput as s, NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE as t };
