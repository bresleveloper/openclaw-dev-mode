import { f as toStructuredErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, nr as tuple, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { X as WorkerTranscriptMessageSchema, Z as WorkerTranscriptUserMessageSchema, w as WorkerConnectRequestFrameSchema } from "./worker-admission-BB3C4gz4.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import "./version-CwNT1gaY.mjs";
import { a as resolveGatewayWebSocketTransport, n as GatewayWebSocketTransportConfigurationError } from "./websocket-transport-BVr0oSpL.mjs";
import { i as SessionPermissionModeSchema } from "./sessions-row-CU6LvmZ_.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, l as WorkerInferenceModelRefSchema, u as WorkerInferenceOptionsSchema } from "./worker-inference-m2fwUhbe.mjs";
import { c as ComputerUseCapabilityDescriptorSchema } from "./computer-use-contract-DzawlQtp.mjs";
import { r as WorkerSkillWorkshopBindingSchema } from "./worker-skill-workshop-CtIZXAKM.mjs";
import { n as SkillResourceDeliverySchema } from "./skill-resources-C_go8RE1.mjs";
import { n as isWorkerDesktopArgs, r as isWorkerDesktopString } from "./worker-desktop-descriptor-DZyj9bOd.mjs";
import { n as workerProtocolObject, t as hasExactOwnKeys } from "./protocol-record-sxcNOJSy.mjs";
import { a as isWorkerToolName } from "./tool-authority-Duog_7TW.mjs";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-D33QMqiJ.mjs";
import path from "node:path";
import { Value } from "typebox/value";
//#region packages/gateway-client/src/cloudflare-access.ts
const CF_ACCESS_CLIENT_ID_HEADER = "CF-Access-Client-Id";
const CF_ACCESS_CLIENT_SECRET_HEADER = "CF-Access-Client-Secret";
/** Build only the two headers Cloudflare Access defines for service-token auth. */
function buildCloudflareAccessHeaders(credentials) {
	return {
		[CF_ACCESS_CLIENT_ID_HEADER]: credentials.clientId,
		[CF_ACCESS_CLIENT_SECRET_HEADER]: credentials.clientSecret
	};
}
//#endregion
//#region src/worker/worker-connection-endpoint.ts
const ENDPOINT_FIELD_MAX_LENGTH = 4096;
const WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES = Math.max(Buffer.byteLength(JSON.stringify({
	kind: "unix",
	socketPath: "\0".repeat(256)
})), Buffer.byteLength(JSON.stringify({
	kind: "websocket",
	url: "\0".repeat(ENDPOINT_FIELD_MAX_LENGTH),
	tlsFingerprint: "0".repeat(64),
	cloudflareAccess: {
		clientId: "\0".repeat(ENDPOINT_FIELD_MAX_LENGTH),
		clientSecret: "\0".repeat(ENDPOINT_FIELD_MAX_LENGTH)
	}
})));
var WorkerConnectionEndpointError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "WorkerConnectionEndpointError";
	}
};
const AccessCredential = string().refine((value) => Boolean(value.trim()) && value.length <= ENDPOINT_FIELD_MAX_LENGTH);
const EndpointSchema = union([workerProtocolObject({
	kind: literal("unix"),
	socketPath: string().refine((value) => value.length <= 256 && path.isAbsolute(value) && !value.includes(":"))
}), workerProtocolObject({
	kind: literal("websocket"),
	url: string().refine((value) => value.length <= ENDPOINT_FIELD_MAX_LENGTH),
	tlsFingerprint: string().transform(normalizeTlsFingerprint).refine(Boolean).optional(),
	cloudflareAccess: workerProtocolObject({
		clientId: AccessCredential,
		clientSecret: AccessCredential
	}).optional()
}).refine((value) => {
	const url = URL.parse(value.url);
	return url !== null && (url.protocol === "ws:" || url.protocol === "wss:") && url.username === "" && url.password === "" && url.search === "" && url.hash === "" && url.pathname.endsWith("/__openclaw__/worker") && (value.tlsFingerprint === void 0 && value.cloudflareAccess === void 0 || url.protocol === "wss:");
}).transform(({ tlsFingerprint, cloudflareAccess, ...endpoint }) => ({
	...endpoint,
	...tlsFingerprint ? { tlsFingerprint } : {},
	...cloudflareAccess ? { cloudflareAccess } : {}
}))]);
function parseWorkerConnectionEndpoint(value) {
	const parsed = EndpointSchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
function resolveWorkerConnectionTarget(endpoint, env = process.env) {
	if (endpoint.kind === "unix") return {
		url: `ws+unix://${endpoint.socketPath}:/`,
		options: {}
	};
	if (endpoint.cloudflareAccess && new URL(endpoint.url).protocol !== "wss:") throw new WorkerConnectionEndpointError("Cloudflare Access credentials require a wss:// worker endpoint");
	try {
		const transport = resolveGatewayWebSocketTransport({
			url: endpoint.url,
			tlsFingerprint: endpoint.tlsFingerprint,
			env,
			options: endpoint.cloudflareAccess ? {
				followRedirects: false,
				headers: buildCloudflareAccessHeaders(endpoint.cloudflareAccess)
			} : {}
		});
		return {
			url: endpoint.url,
			...transport
		};
	} catch (error) {
		if (error instanceof GatewayWebSocketTransportConfigurationError) throw new WorkerConnectionEndpointError(error.message);
		throw error;
	}
}
//#endregion
//#region src/worker/launch-descriptor.ts
const LAUNCH_VERSION = 4;
const Identifier = string().min(1).max(256).refine((value) => value.trim() === value);
const Sequence = number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const AbsoluteHostPath = string().refine((value) => path.posix.isAbsolute(value) || path.win32.isAbsolute(value));
const WorkspacePath = AbsoluteHostPath.refine((value) => value.trim() === value && value.length <= 4096 && !value.includes("\0"));
const ExecAuthorityFields = {
	security: _enum([
		"deny",
		"allowlist",
		"full"
	]),
	ask: _enum([
		"off",
		"on-miss",
		"always"
	]),
	safeBins: tuple([]).optional()
};
const ExecAuthoritySchema = union([unknown().refine((value) => isRecord(value) && value.node === void 0).pipe(workerProtocolObject({
	host: _enum(["sandbox", "gateway"]),
	...ExecAuthorityFields
})), workerProtocolObject({
	host: literal("node"),
	...ExecAuthorityFields,
	node: string().min(1).refine((value) => value.trim() === value).optional()
}).transform(({ node, ...authority }) => node === void 0 ? authority : {
	...authority,
	node
})]).refine((value) => !Object.hasOwn(value, "safeBins") || value.safeBins !== void 0);
const ToolAuthoritySchema = workerProtocolObject({
	allowedToolNames: custom((names) => Array.isArray(names) && names.every(isWorkerToolName) && new Set(names).size === names.length).transform((names) => [...names]),
	exec: ExecAuthoritySchema.optional()
}).transform(({ exec, ...authority }) => exec === void 0 ? authority : {
	...authority,
	exec
});
const BrowserLaunchSchema = workerProtocolObject({
	cdpUrl: string().refine((value) => {
		const url = URL.parse(value);
		return url !== null && url.protocol === "http:" && url.hostname === "127.0.0.1" && url.username === "" && url.password === "" && url.port !== "" && Number(url.port) >= 1 && Number(url.port) <= 65535 && url.pathname === "/" && url.search === "" && url.hash === "";
	}),
	launcherPath: AbsoluteHostPath.refine(isWorkerDesktopString),
	launcherArgs: custom(isWorkerDesktopArgs).optional()
});
const ComputerLaunchSchema = workerProtocolObject({
	nodeId: Identifier,
	computerUse: custom((value) => Value.Check(ComputerUseCapabilityDescriptorSchema, value))
});
const GitAuthorField = string().max(256).refine((value) => Boolean(value.trim()) && !/[\0\r\n]/u.test(value));
const GitAuthorSchema = workerProtocolObject({
	name: GitAuthorField.optional(),
	email: GitAuthorField.optional()
}).refine((value) => Object.values(value).every((entry) => entry !== void 0));
const GitHubLaunchSchema = workerProtocolObject({
	token: string().min(1).max(2048).refine((value) => !/[\s\p{Cc}]/u.test(value)),
	login: string().regex(/^[A-Za-z0-9-]{1,39}$/u).refine((value) => value.trim() === value),
	branch: string().min(1).max(256).refine((value) => !/[\s~^:?*[\\]/u.test(value) && !value.includes("\0") && !value.startsWith("-") && !value.includes("..") && !value.includes("@{")),
	remoteUrl: string().regex(/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/u).refine((value) => value.trim() === value).optional(),
	gitAuthor: GitAuthorSchema.optional()
}).refine((value) => Object.values(value).every((entry) => entry !== void 0));
function parseWorkerGitHubLaunchBinding(value) {
	const parsed = GitHubLaunchSchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
const AssignmentSchema = workerProtocolObject({
	skillAuthoring: custom((value) => Value.Check(WorkerSkillWorkshopBindingSchema, value)).optional(),
	skillResources: custom((value) => Value.Check(SkillResourceDeliverySchema, value)).optional(),
	agentId: Identifier,
	operationalRunInstance: object({
		instanceId: Identifier,
		runId: Identifier
	}).readonly(),
	agentRuntimeIdentityToken: string().min(1).max(16384),
	runId: Identifier,
	turnId: Identifier,
	prompt: custom((value) => typeof value === "string" || Value.Check(WorkerTranscriptUserMessageSchema, {
		role: "user",
		content: value,
		timestamp: 0
	})),
	suppressPromptTranscript: boolean(),
	workspaceDir: WorkspacePath,
	modelRef: custom((value) => Value.Check(WorkerInferenceModelRefSchema, value)),
	inferenceOptions: custom((value) => Value.Check(WorkerInferenceOptionsSchema, value)),
	systemPrompt: string().optional(),
	initialMessages: custom((value) => Array.isArray(value) && value.length <= 1024 && value.every((message) => Value.Check(WorkerTranscriptMessageSchema, message))),
	transcript: workerProtocolObject({
		baseLeafId: Identifier.nullable(),
		nextSeq: Sequence.min(1)
	}),
	liveEvents: workerProtocolObject({
		ackedSeq: Sequence,
		nextSeq: Sequence.min(1)
	}).refine((value) => value.nextSeq === value.ackedSeq + 1),
	toolAuthority: ToolAuthoritySchema,
	browser: BrowserLaunchSchema.optional(),
	computer: ComputerLaunchSchema.optional(),
	github: GitHubLaunchSchema.optional(),
	permissionMode: custom((value) => Value.Check(SessionPermissionModeSchema, value)).optional(),
	workerContainmentRoot: WorkspacePath.optional()
}).refine((value) => value.operationalRunInstance.runId === value.runId && value.toolAuthority.allowedToolNames.includes("computer") === (value.computer !== void 0) && (!Object.hasOwn(value, "github") || value.github !== void 0) && (Object.hasOwn(value, "permissionMode") ? value.permissionMode !== void 0 && value.workerContainmentRoot !== void 0 : !Object.hasOwn(value, "workerContainmentRoot")));
function parseAssignment(value) {
	const parsed = AssignmentSchema.safeParse(value);
	if (!parsed.success) return;
	const { permissionMode, workerContainmentRoot, ...assignment } = parsed.data;
	if (permissionMode !== void 0 && workerContainmentRoot !== void 0) return {
		...assignment,
		permissionMode,
		workerContainmentRoot
	};
	return assignment;
}
function buildWorkerConnectParams(descriptor) {
	return {
		minProtocol: 4,
		maxProtocol: 4,
		client: {
			id: GATEWAY_CLIENT_IDS.WORKER,
			version: descriptor.admission.handshake.openclawVersion,
			platform: process.platform,
			mode: GATEWAY_CLIENT_MODES.WORKER
		},
		role: "worker",
		admission: {
			...descriptor.admission,
			runId: descriptor.assignment.runId
		}
	};
}
function validateWorkerLaunchPlan(candidate) {
	const frame = {
		type: "req",
		id: "launch-validation",
		method: "connect",
		params: buildWorkerConnectParams(candidate)
	};
	if (!Value.Check(WorkerConnectRequestFrameSchema, frame) || candidate.admission.sessionId === null || candidate.admission.ownerEpoch < 1 || !isWorkerTranscriptMessageFrameSafe({
		role: "user",
		content: typeof candidate.assignment.prompt === "string" ? [{
			type: "text",
			text: candidate.assignment.prompt
		}] : candidate.assignment.prompt,
		timestamp: Number.MAX_SAFE_INTEGER
	})) throw new Error("invalid worker launch descriptor");
	return candidate;
}
function parseWorkerLaunchPlan(value) {
	if (!isRecord(value) || !hasExactOwnKeys(value, [
		"version",
		"admission",
		"assignment"
	]) || value.version !== LAUNCH_VERSION) throw new Error("invalid worker launch descriptor");
	const assignment = parseAssignment(value.assignment);
	if (!assignment || !isRecord(value.admission)) throw new Error("invalid worker launch descriptor");
	return validateWorkerLaunchPlan({
		version: LAUNCH_VERSION,
		admission: value.admission,
		assignment
	});
}
function completeWorkerLaunchDescriptor(plan, connectionEndpoint) {
	const parsedPlan = parseWorkerLaunchPlan(plan);
	const parsedEndpoint = parseWorkerConnectionEndpoint(connectionEndpoint);
	if (!parsedEndpoint) throw new Error("invalid worker launch descriptor");
	return {
		...parsedPlan,
		connectionEndpoint: parsedEndpoint
	};
}
function parseWorkerLaunchDescriptor(value) {
	if (!isRecord(value) || !hasExactOwnKeys(value, [
		"version",
		"connectionEndpoint",
		"admission",
		"assignment"
	])) throw new Error("invalid worker launch descriptor");
	return completeWorkerLaunchDescriptor({
		version: value.version,
		admission: value.admission,
		assignment: value.assignment
	}, value.connectionEndpoint);
}
//#endregion
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
	const parsed = WorkerAdmissionDeadlineResultSchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
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
function toWorkerConnectionError(error) {
	return toStructuredErrorObject(error);
}
function formatWorkerConnectionFailure(options, error, attempts) {
	const endpoint = options.endpoint;
	let address;
	if (endpoint.kind === "websocket") {
		const url = new URL(endpoint.url);
		address = `${url.hostname}:${url.port || (url.protocol === "wss:" ? "443" : "80")}`;
	} else address = endpoint.socketPath;
	const target = truncateUtf16Safe(address, 128);
	let detail = toWorkerConnectionError(error).message;
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
function buildWorkerProcessTurn(descriptor) {
	return {
		type: "turn",
		turnId: descriptor.assignment.turnId,
		descriptor
	};
}
function measureWorkerProcessTurnBytes(plan) {
	return Buffer.byteLength(JSON.stringify(buildWorkerProcessTurn({
		...plan,
		connectionEndpoint: null
	}))) - 4 + WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES;
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
const ProcessResultSchema = workerProtocolObject({
	type: literal("result"),
	turnId: string().refine((value) => Boolean(value.trim()) && value.length <= 256),
	result: RuntimeResultSchema,
	retainWorker: boolean()
}).refine(({ result, retainWorker }) => !retainWorker || result.status === "completed" || result.status === "failed");
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
	])) {
		const descriptor = parseWorkerLaunchDescriptor(value.descriptor);
		if (descriptor.assignment.turnId !== value.turnId) throw new Error("managed worker request disagrees with its assigned turn");
		return {
			type: "turn",
			turnId: value.turnId,
			descriptor
		};
	}
	throw new Error("invalid managed worker request");
}
function parseWorkerRuntimeResult(value) {
	const parsed = RuntimeResultSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
function parseWorkerProcessResult(value) {
	const parsed = ProcessResultSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
//#endregion
export { WorkerConnectionEndpointError as C, CF_ACCESS_CLIENT_SECRET_HEADER as D, CF_ACCESS_CLIENT_ID_HEADER as E, buildCloudflareAccessHeaders as O, parseWorkerLaunchPlan as S, resolveWorkerConnectionTarget as T, toWorkerConnectionError as _, parseWorkerRuntimeResult as a, parseWorkerGitHubLaunchBinding as b, WorkerAdmissionDeadlineExceededError as c, WorkerConnectionStoppedError as d, WorkerFencedError as f, resolvePositiveTimeout as g, parseWorkerAdmissionDeadlineResult as h, parseWorkerProcessResult as i, WorkerAdmissionError as l, isFencedCloseReason as m, measureWorkerProcessTurnBytes as n, serializeWorkerProcessInput as o, formatWorkerConnectionFailure as p, parseWorkerProcessRequest as r, WORKER_ADMISSION_DEADLINE_MS as s, buildWorkerProcessTurn as t, WorkerConnectionInterruptedError as u, buildWorkerConnectParams as v, parseWorkerConnectionEndpoint as w, parseWorkerLaunchDescriptor as x, completeWorkerLaunchDescriptor as y };
