import { D as readExecApprovalsSnapshot, J as saveExecApprovals, g as mergeExecApprovalsSocketDefaults, l as ensureExecApprovals, y as normalizeExecApprovals } from "./exec-approvals-BIKWP8_V.js";
import { dt as validateExecApprovalsNodeSetParams, ft as validateExecApprovalsNodeSnapshot, lt as validateExecApprovalsGetParams, pt as validateExecApprovalsSetParams, ut as validateExecApprovalsNodeGetParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { i as isNodeCommandAllowed, s as resolveNodeCommandAllowlist } from "./node-command-policy-CDDCPmwi.js";
import { i as safeParseJson, n as respondUnavailableOnNodeInvokeError, r as respondUnavailableOnThrow } from "./nodes.helpers-BeMwLOux.js";
import { t as assertValidParams } from "./validation-BlJXIosl.js";
import { t as resolveBaseHashParam } from "./base-hash-BJkn_bB6.js";
//#region src/gateway/server-methods/exec-approvals.ts
function requireApprovalsBaseHash(params, snapshot, respond) {
	if (!snapshot.exists) return true;
	if (!snapshot.hash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash unavailable; re-run exec.approvals.get and retry"));
		return false;
	}
	const baseHash = resolveBaseHashParam(params);
	if (!baseHash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash required; re-run exec.approvals.get and retry"));
		return false;
	}
	if (baseHash !== snapshot.hash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals changed since last load; re-run exec.approvals.get and retry"));
		return false;
	}
	return true;
}
function redactExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	return {
		...file,
		socket: socketPath ? { path: socketPath } : void 0
	};
}
function toExecApprovalsPayload(snapshot) {
	return {
		path: snapshot.path,
		exists: snapshot.exists,
		hash: snapshot.hash,
		file: redactExecApprovals(snapshot.file)
	};
}
async function respondWithExecApprovalsNodePayload(params) {
	const rawParams = params.rawParams;
	if (!assertValidParams(rawParams, params.validate, params.method, params.respond)) return;
	const parsedParams = rawParams;
	const nodeId = parsedParams.nodeId.trim();
	if (!nodeId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
		return;
	}
	const nodeSession = params.context.nodeRegistry.get(nodeId);
	if (nodeSession) {
		const allowed = isNodeCommandAllowed({
			command: params.command,
			declaredCommands: nodeSession.commands,
			allowlist: resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
				...nodeSession,
				approvedCommands: nodeSession.commands
			})
		});
		if (!allowed.ok) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node command not allowed: ${params.command} (${allowed.reason})`, { details: {
				command: params.command,
				reason: allowed.reason
			} }));
			return;
		}
	}
	await respondUnavailableOnThrow(params.respond, async () => {
		const res = await params.context.nodeRegistry.invoke({
			nodeId,
			command: params.command,
			params: params.commandParams(parsedParams)
		});
		if (!respondUnavailableOnNodeInvokeError(params.respond, res)) return;
		const payload = params.readPayload(res);
		if (params.validatePayload && !params.validatePayload(payload)) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node returned invalid exec approvals payload"));
			return;
		}
		params.respond(true, payload, void 0);
	});
}
const execApprovalsHandlers = {
	"exec.approvals.get": async ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsGetParams, "exec.approvals.get", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			ensureExecApprovals();
			respond(true, toExecApprovalsPayload(readExecApprovalsSnapshot()), void 0);
		});
	},
	"exec.approvals.set": async ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			ensureExecApprovals();
			const snapshot = readExecApprovalsSnapshot();
			if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
			const incoming = params.file;
			if (!incoming || typeof incoming !== "object") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals file is required"));
				return;
			}
			saveExecApprovals(mergeExecApprovalsSocketDefaults({
				normalized: normalizeExecApprovals(incoming),
				current: snapshot.file
			}));
			respond(true, toExecApprovalsPayload(readExecApprovalsSnapshot()), void 0);
		});
	},
	"exec.approvals.node.get": async ({ params, respond, context }) => {
		await respondWithExecApprovalsNodePayload({
			method: "exec.approvals.node.get",
			rawParams: params,
			validate: validateExecApprovalsNodeGetParams,
			context,
			respond,
			command: "system.execApprovals.get",
			commandParams: () => ({}),
			readPayload: (res) => res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload,
			validatePayload: validateExecApprovalsNodeSnapshot
		});
	},
	"exec.approvals.node.set": async ({ params, respond, context }) => {
		await respondWithExecApprovalsNodePayload({
			method: "exec.approvals.node.set",
			rawParams: params,
			validate: validateExecApprovalsNodeSetParams,
			context,
			respond,
			command: "system.execApprovals.set",
			commandParams: (parsedParams) => "native" in parsedParams ? {
				...parsedParams.native,
				baseHash: parsedParams.baseHash
			} : {
				file: parsedParams.file,
				baseHash: parsedParams.baseHash
			},
			readPayload: (res) => res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload
		});
	}
};
//#endregion
export { execApprovalsHandlers };
