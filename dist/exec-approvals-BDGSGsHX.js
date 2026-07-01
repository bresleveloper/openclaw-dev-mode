import { D as readExecApprovalsSnapshot, J as saveExecApprovals, g as mergeExecApprovalsSocketDefaults, l as ensureExecApprovals, y as normalizeExecApprovals } from "./exec-approvals-BQlhahST.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { at as validateExecApprovalsSetParams, it as validateExecApprovalsNodeSetParams, nt as validateExecApprovalsGetParams, rt as validateExecApprovalsNodeGetParams } from "./src-CSp7rUPX.js";
import { i as safeParseJson, n as respondUnavailableOnNodeInvokeError, r as respondUnavailableOnThrow } from "./nodes.helpers-DEkKdBJ_.js";
import { t as assertValidParams } from "./validation-CGUihuqY.js";
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
	await respondUnavailableOnThrow(params.respond, async () => {
		const res = await params.context.nodeRegistry.invoke({
			nodeId,
			command: params.command,
			params: params.commandParams(parsedParams)
		});
		if (!respondUnavailableOnNodeInvokeError(params.respond, res)) return;
		params.respond(true, params.readPayload(res), void 0);
	});
}
const execApprovalsHandlers = {
	"exec.approvals.get": ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsGetParams, "exec.approvals.get", respond)) return;
		ensureExecApprovals();
		respond(true, toExecApprovalsPayload(readExecApprovalsSnapshot()), void 0);
	},
	"exec.approvals.set": ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
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
			readPayload: (res) => res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload
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
			commandParams: (parsedParams) => ({
				file: parsedParams.file,
				baseHash: parsedParams.baseHash
			}),
			readPayload: (res) => safeParseJson(res.payloadJSON ?? null)
		});
	}
};
//#endregion
export { execApprovalsHandlers };
