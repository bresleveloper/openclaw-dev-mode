import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, _n as validateExecApprovalsGetParams, bn as validateExecApprovalsNodeSnapshot, vn as validateExecApprovalsNodeGetParams, xn as validateExecApprovalsSetParams, yn as validateExecApprovalsNodeSetParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { s as normalizeExecApprovalsInternal } from "./exec-approvals-config-JiuCEgOc.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { d as updateExecApprovals, l as readExecApprovalsSnapshotAsync, n as ensureExecApprovalsSnapshot } from "./exec-approvals-store-BhzM_h1C.mjs";
import { t as redactExecApprovals } from "./exec-approvals-ByI8H66l.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CCKsZy54.mjs";
import { n as respondUnavailableOnNodeInvokeErrorWithProvenance, r as parseGatewayPayload } from "./nodes.helpers-DNIGJMq6.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import { t as resolveBaseHashParam } from "./base-hash-DxpcXxxb.mjs";
//#region src/gateway/server-methods/exec-approvals.ts
function requireApprovalsBaseHash(params, snapshot, respond) {
	const baseHash = resolveBaseHashParam(params);
	if (snapshot.exists && (!snapshot.hash || !baseHash)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `exec approvals base hash ${snapshot.hash ? "required" : "unavailable"}; re-run exec.approvals.get and retry`));
		return false;
	}
	if (baseHash && baseHash !== snapshot.hash) {
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
	const authority = readGatewayRequestMutationAuthority(options);
	try {
		const assertOwner = expectedOwnerId ? captureLocalStateMutationGuard(expectedOwnerId, options) : void 0;
		return {
			assertPreparationCurrent: authority.assertPreparationCurrent,
			assertCurrent: () => {
				if (authority.family === "worker") {
					authority.assertWorkerCurrent();
					authority.expectedProfileBinding?.assertCurrent();
				} else authority.assertCurrent();
				assertOwner?.();
			}
		};
	} catch (error) {
		options.respond(false, void 0, localStateOwnerChangedError(error));
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
		const guard = captureExecApprovalsOwnerGuard(params.expectedOwnerId, options);
		if (guard === null) return;
		await respondUnavailableOnThrow(respond, async () => {
			guard.assertPreparationCurrent();
			const snapshot = params.expectedOwnerId ? await readExecApprovalsSnapshotAsync() : await ensureExecApprovalsSnapshot(guard.assertCurrent, guard.assertPreparationCurrent);
			guard.assertCurrent();
			respond(true, toExecApprovalsPayload(snapshot), void 0);
		});
	},
	"exec.approvals.set": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond)) return;
		const guard = captureExecApprovalsOwnerGuard(params.expectedOwnerId, options);
		if (guard === null) return;
		await respondUnavailableOnThrow(respond, async () => {
			guard.assertPreparationCurrent();
			const context = captureOpenClawStateWorkerContext();
			const snapshot = await readExecApprovalsSnapshotAsync(context);
			guard.assertPreparationCurrent();
			if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
			const normalized = normalizeExecApprovalsInternal(params.file);
			const nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				...guard,
				update: {
					kind: "replace",
					file: normalized,
					preserveSocket: true
				}
			}, context);
			if (!nextSnapshot) {
				respondApprovalsChanged(respond);
				return;
			}
			context.admission.assertCurrent();
			guard.assertCurrent();
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
