import "./src-CdRlGRnW.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Jn as string, Kt as custom, or as union, tr as transform, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as workerProtocolObject, i as workerProtocolIdentifier, t as WorkerGatewayNamespace } from "./protocol-record-CQCXx-YV.mjs";
import { a as parseWorkerLaunchPlan } from "./launch-descriptor-BQV4k-tD.mjs";
//#region src/worker/node-supervisor-protocol.ts
const NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES = 4096;
const NODE_WORKER_STATUS_WAIT_MAX_MS = 2e4;
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
const nonNegativeInteger = (label) => custom(isNonNegativeInteger, { error: `INVALID_REQUEST: ${label} must be a non-negative safe integer` });
const IdentityShape = {
	launchId: workerProtocolIdentifier("launchId"),
	planHash: custom(isPlanHash, { error: "INVALID_REQUEST: planHash must be 64 lowercase hexadecimal characters" }),
	environmentId: workerProtocolIdentifier("environmentId"),
	sessionId: workerProtocolIdentifier("sessionId"),
	ownerEpoch: nonNegativeInteger("ownerEpoch"),
	placementGeneration: nonNegativeInteger("placementGeneration"),
	runId: workerProtocolIdentifier("runId")
};
const Identity = workerProtocolObject(IdentityShape);
const EnvironmentStop = workerProtocolObject({
	gatewayNamespace: WorkerGatewayNamespace,
	environmentId: IdentityShape.environmentId,
	sessionId: IdentityShape.sessionId,
	ownerEpoch: IdentityShape.ownerEpoch
});
const LaunchInput = workerProtocolObject({
	environmentSession: literal(1, { error: "INVALID_REQUEST: node worker environment lifetime support required" }),
	sessionKey: workerProtocolIdentifier("sessionKey", 1024).optional(),
	idleRetention: literal(true, { error: "INVALID_REQUEST: idleRetention must be true" }).optional(),
	launchId: IdentityShape.launchId,
	gatewayNamespace: WorkerGatewayNamespace,
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
const Lookup = workerProtocolObject({
	launchId: IdentityShape.launchId,
	waitMs: custom((value) => isNonNegativeInteger(value) && value >= 1 && value <= 2e4, { error: "INVALID_REQUEST: waitMs must be an integer between 1 and 20000" }).optional()
});
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
function parseNodeWorkerLaunchInput(raw) {
	return validateNodeWorkerLaunchInput(decodeRequest(raw));
}
function validateNodeWorkerLaunchInput(value) {
	const input = parseRequest(LaunchInput, value, "launch");
	if (input.descriptor.assignment.turnId !== input.launchId) throw new Error("INVALID_REQUEST: launchId must match descriptor assignment turnId");
	if (input.descriptor.admission.handshake.bundleHash !== input.expectedBundleHash) throw new Error("INVALID_REQUEST: descriptor bundle hash does not match expectedBundleHash");
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
	return sha256Hex(stableStringify({
		expectedBundleHash: input.expectedBundleHash,
		descriptor: input.descriptor,
		gatewayNamespace: input.gatewayNamespace,
		placementGeneration: input.placementGeneration,
		...input.sessionKey === void 0 ? {} : { sessionKey: input.sessionKey },
		...input.idleRetention ? { idleRetention: true } : {}
	}));
}
function isBoundedResultJson(value) {
	if (typeof value !== "string" || value.length === 0 || Buffer.byteLength(value, "utf8") > NODE_WORKER_RESULT_JSON_MAX_BYTES) return false;
	return safeParseJsonRecord(value) !== void 0;
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
function nodeWorkerTurnMatchesIdentity(receipt, expected) {
	return receipt.launchId === expected.launchId && receipt.planHash === expected.planHash && receipt.environmentId === expected.environmentId && receipt.sessionId === expected.sessionId && receipt.ownerEpoch === expected.ownerEpoch && receipt.placementGeneration === expected.placementGeneration && receipt.runId === expected.runId;
}
//#endregion
export { parseNodeWorkerCancelInput as a, parseNodeWorkerLaunchInput as c, validateNodeWorkerLaunchInput as d, nodeWorkerTurnMatchesIdentity as i, parseNodeWorkerLookupInput as l, NODE_WORKER_STATUS_WAIT_MAX_MS as n, parseNodeWorkerConnectionFailureMessage as o, nodeWorkerPlanHash as r, parseNodeWorkerEnvironmentStopInput as s, NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE as t, parseNodeWorkerSupervisorReceipt as u };
