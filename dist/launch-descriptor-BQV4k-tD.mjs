import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Nt as array, Pn as number, nr as tuple, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { s as SessionPermissionModeSchema } from "./sessions-row-DAFw32gg.mjs";
import "./worker-protocol-primitives-BajTgPT4.mjs";
import { l as WorkerInferenceModelRefSchema, u as WorkerInferenceOptionsSchema } from "./worker-inference-B7U4TRc2.mjs";
import { L as WorkerTranscriptMessageSchema, R as WorkerTranscriptUserMessageSchema, b as WorkerConnectRequestFrameSchema } from "./worker-admission-CNeLWzVQ.mjs";
import "./version-CwNT1gaY.mjs";
import { d as ComputerUseCapabilityDescriptorSchema } from "./computer-use-contract-g23cJXOi.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BafGwQBm.mjs";
import { a as resolveGatewayWebSocketTransport, n as GatewayWebSocketTransportConfigurationError } from "./websocket-transport-D1HAAgy3.mjs";
import { a as workerProtocolObject, r as hasExactOwnKeys } from "./protocol-record-CQCXx-YV.mjs";
import { n as SkillResourceDeliverySchema } from "./skill-resources-BYZ-VOKK.mjs";
import { n as isWorkerDesktopArgs, r as isWorkerDesktopString } from "./worker-desktop-descriptor-DZyj9bOd.mjs";
import { n as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-Dz1c-AeG.mjs";
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
	constructor(..._args) {
		super(..._args);
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
	return EndpointSchema.safeParse(value).data;
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
}).transform(({ node, ...authority }) => ({
	...authority,
	...node === void 0 ? {} : { node }
}))]).refine((value) => !Object.hasOwn(value, "safeBins") || value.safeBins !== void 0);
const ToolAuthoritySchema = workerProtocolObject({
	allowedToolNames: array(Identifier).max(256).refine((names) => new Set(names).size === names.length),
	exec: ExecAuthoritySchema.optional()
}).transform(({ exec, ...authority }) => ({
	...authority,
	...exec === void 0 ? {} : { exec }
}));
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
	return GitHubLaunchSchema.safeParse(value).data;
}
const AssignmentSchema = workerProtocolObject({
	skillAuthoring: workerProtocolObject({ multipleProfiles: boolean() }).optional(),
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
	const parsed = AssignmentSchema.safeParse(value.assignment).data;
	if (!parsed || !isRecord(value.admission)) throw new Error("invalid worker launch descriptor");
	const { permissionMode, workerContainmentRoot, ...assignment } = parsed;
	return validateWorkerLaunchPlan({
		version: LAUNCH_VERSION,
		admission: value.admission,
		assignment: permissionMode !== void 0 && workerContainmentRoot !== void 0 ? {
			...assignment,
			permissionMode,
			workerContainmentRoot
		} : assignment
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
export { parseWorkerLaunchPlan as a, parseWorkerConnectionEndpoint as c, CF_ACCESS_CLIENT_SECRET_HEADER as d, buildCloudflareAccessHeaders as f, parseWorkerLaunchDescriptor as i, resolveWorkerConnectionTarget as l, completeWorkerLaunchDescriptor as n, WORKER_CONNECTION_ENDPOINT_MAX_JSON_BYTES as o, parseWorkerGitHubLaunchBinding as r, WorkerConnectionEndpointError as s, buildWorkerConnectParams as t, CF_ACCESS_CLIENT_ID_HEADER as u };
