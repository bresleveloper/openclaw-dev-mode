import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { $t as validateExecApprovalsNodeGetParams, Qt as validateExecApprovalsGetParams, en as validateExecApprovalsNodeSetParams, nn as validateExecApprovalsSetParams, tn as validateExecApprovalsNodeSnapshot } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { l as mergeExecApprovalsSocketDefaults, u as normalizeExecApprovalsInternal } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { b as resolveExecApprovalsFromFileInternal } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import { n as ensureExecApprovalsSnapshot, s as readExecApprovalsSnapshot, u as updateExecApprovals } from "./exec-approvals-store-DGp2moY9.mjs";
import { t as redactExecApprovals } from "./exec-approvals-B1rZTeax.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-DgjgVMrc.mjs";
import { n as respondUnavailableOnNodeInvokeErrorWithProvenance, r as parseGatewayPayload } from "./nodes.helpers-BTGo-Hel.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { t as captureLocalStateMutationGuard } from "./local-state-owner-CdeTOsDa.mjs";
import { t as resolveBaseHashParam } from "./base-hash-DxpcXxxb.mjs";
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
	if (!snapshot.hash || !baseHash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `exec approvals base hash ${snapshot.hash ? "required" : "unavailable"}; re-run exec.approvals.get and retry`));
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
		resolvedDefaults: resolveExecApprovalsFromFileInternal({ file: snapshot.file }).defaults
	};
}
function captureExecApprovalsOwnerGuard(expectedOwnerId, options) {
	if (!expectedOwnerId) return;
	try {
		return captureLocalStateMutationGuard(expectedOwnerId, options);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error), {
			details: {
				reason: "STATE_OWNER_CHANGED",
				mutationAccepted: false
			},
			retryable: false
		}));
		return null;
	}
}
function isMacAppNode(session) {
	const platform = session?.platform?.trim().toLowerCase();
	return session?.clientId === GATEWAY_CLIENT_IDS.MACOS_APP && session.clientMode === GATEWAY_CLIENT_MODES.NODE && (platform === "macos" || platform?.startsWith("macos ") === true);
}
function execApprovalsNodeHandler(definition) {
	return defineValidatedGatewayHandler(definition.method, definition.validate, async ({ params, context, respond }) => {
		const nodeId = params.nodeId.trim();
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		const nodeSession = context.nodeRegistry.get(nodeId);
		if (nodeSession) {
			const allowed = isNodeCommandAllowed({
				command: definition.command,
				declaredCommands: nodeSession.commands,
				allowlist: resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
					...nodeSession,
					approvedCommands: nodeSession.commands
				})
			});
			if (!allowed.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node command not allowed: ${definition.command} (${allowed.reason})`, { details: {
					command: definition.command,
					reason: allowed.reason
				} }));
				return;
			}
		}
		await respondUnavailableOnThrow(respond, async () => {
			let nodeCommandDispatched = false;
			const res = await context.nodeRegistry.invoke({
				nodeId,
				...nodeSession ? {
					expectedConnId: nodeSession.connId,
					...nodeSession.pairingGeneration ? { expectedPairingGeneration: nodeSession.pairingGeneration } : {}
				} : {},
				command: definition.command,
				params: definition.commandParams(params, nodeSession),
				onDispatchReady: () => {
					nodeCommandDispatched = true;
				}
			});
			if (!respondUnavailableOnNodeInvokeErrorWithProvenance(respond, res, { nodeCommandDispatched })) return;
			const payload = res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload;
			if (definition.validatePayload && !definition.validatePayload(payload)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node returned invalid exec approvals payload"));
				return;
			}
			respond(true, payload, void 0);
		});
	});
}
const execApprovalsHandlers = {
	"exec.approvals.get": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateExecApprovalsGetParams, "exec.approvals.get", respond)) return;
		const assertCurrent = captureExecApprovalsOwnerGuard(params.expectedOwnerId, options);
		if (assertCurrent === null) return;
		await respondUnavailableOnThrow(respond, async () => {
			assertCurrent?.();
			const snapshot = params.expectedOwnerId ? readExecApprovalsSnapshot() : await ensureExecApprovalsSnapshot();
			assertCurrent?.();
			respond(true, toExecApprovalsPayload(snapshot), void 0);
		});
	},
	"exec.approvals.set": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
		const assertCurrent = captureExecApprovalsOwnerGuard(params.expectedOwnerId, options);
		if (assertCurrent === null) return;
		await respondUnavailableOnThrow(respond, async () => {
			assertCurrent?.();
			const snapshot = readExecApprovalsSnapshot();
			if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
			const normalized = normalizeExecApprovalsInternal(params.file);
			const nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				assertCurrent,
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
	"exec.approvals.node.get": execApprovalsNodeHandler({
		method: "exec.approvals.node.get",
		validate: validateExecApprovalsNodeGetParams,
		command: "system.execApprovals.get",
		commandParams: (_parsedParams, nodeSession) => isMacAppNode(nodeSession) ? { includeResolvedDefaults: true } : {},
		validatePayload: validateExecApprovalsNodeSnapshot
	}),
	"exec.approvals.node.set": execApprovalsNodeHandler({
		method: "exec.approvals.node.set",
		validate: validateExecApprovalsNodeSetParams,
		command: "system.execApprovals.set",
		commandParams: (parsedParams) => "native" in parsedParams ? {
			...parsedParams.native,
			baseHash: parsedParams.baseHash
		} : {
			file: parsedParams.file,
			baseHash: parsedParams.baseHash
		}
	})
};
//#endregion
export { execApprovalsHandlers };
