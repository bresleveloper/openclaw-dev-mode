import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { $t as validateExecApprovalsNodeSnapshot, Qt as validateExecApprovalsNodeSetParams, Xt as validateExecApprovalsGetParams, Zt as validateExecApprovalsNodeGetParams, en as validateExecApprovalsSetParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as mergeExecApprovalsSocketDefaults } from "./exec-approvals-config-C7iYNiP7.mjs";
import { h as updateExecApprovals, l as readExecApprovalsSnapshot, r as ensureExecApprovalsSnapshot } from "./exec-approvals-store-CTT-ox-I.mjs";
import { i as resolveExecApprovalsFromFile, n as redactExecApprovals, t as normalizeExecApprovals } from "./exec-approvals-BgZlQ2Qp.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { n as respondUnavailableOnNodeInvokeErrorWithProvenance, r as parseGatewayPayload } from "./nodes.helpers-i6ZoxrHI.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { t as resolveBaseHashParam } from "./base-hash-BJkn_bB6.mjs";
//#region src/gateway/server-methods/exec-approvals.ts
function requireApprovalsBaseHash(params, snapshot, respond) {
	const baseHash = resolveBaseHashParam(params);
	if (!snapshot.exists) {
		if (baseHash && baseHash !== snapshot.hash) {
			respondApprovalsChanged(respond);
			return false;
		}
		return true;
	}
	if (!snapshot.hash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash unavailable; re-run exec.approvals.get and retry"));
		return false;
	}
	if (!baseHash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals base hash required; re-run exec.approvals.get and retry"));
		return false;
	}
	if (baseHash !== snapshot.hash) {
		respondApprovalsChanged(respond);
		return false;
	}
	return true;
}
function respondApprovalsChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals changed since last load; re-run exec.approvals.get and retry"));
}
function toExecApprovalsPayload(snapshot) {
	return {
		...redactExecApprovals(snapshot),
		resolvedDefaults: resolveExecApprovalsFromFile({ file: snapshot.file }).defaults
	};
}
function isMacAppNode(session) {
	const platform = session?.platform?.trim().toLowerCase();
	return session?.clientId === GATEWAY_CLIENT_IDS.MACOS_APP && session.clientMode === GATEWAY_CLIENT_MODES.NODE && (platform === "macos" || platform?.startsWith("macos ") === true);
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
		let nodeCommandDispatched = false;
		const res = await params.context.nodeRegistry.invoke({
			nodeId,
			...nodeSession ? {
				expectedConnId: nodeSession.connId,
				...nodeSession.pairingGeneration ? { expectedPairingGeneration: nodeSession.pairingGeneration } : {}
			} : {},
			command: params.command,
			params: params.commandParams(parsedParams, nodeSession),
			onDispatchReady: () => {
				nodeCommandDispatched = true;
			}
		});
		if (!respondUnavailableOnNodeInvokeErrorWithProvenance(params.respond, res, { nodeCommandDispatched })) return;
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
			respond(true, toExecApprovalsPayload(await ensureExecApprovalsSnapshot()), void 0);
		});
	},
	"exec.approvals.set": async ({ params, respond }) => {
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const snapshot = readExecApprovalsSnapshot();
			if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
			const incoming = params.file;
			if (!incoming || typeof incoming !== "object") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals file is required"));
				return;
			}
			const normalized = normalizeExecApprovals(incoming);
			const nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				update: (current) => mergeExecApprovalsSocketDefaults({
					normalized,
					current
				})
			});
			if (!nextSnapshot) {
				respondApprovalsChanged(respond);
				return;
			}
			respond(true, toExecApprovalsPayload(nextSnapshot), void 0);
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
			commandParams: (_parsedParams, nodeSession) => isMacAppNode(nodeSession) ? { includeResolvedDefaults: true } : {},
			readPayload: (res) => res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload,
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
			readPayload: (res) => res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload
		});
	}
};
//#endregion
export { execApprovalsHandlers };
