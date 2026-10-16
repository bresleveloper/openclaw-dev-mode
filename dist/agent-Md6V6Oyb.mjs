import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-BaxMDLZF.mjs";
import { n as validateAgentParams, r as validateAgentWaitParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as operatorSessionCap } from "./operator-role-policy-BqPaarjx.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { _ as resolveSessionSharingTarget, f as isGatewayAdmin } from "./session-sharing-policy-4QkIpHi4.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as prepareAgentRequestPreflight } from "./agent-request-preflight-oQdMKV66.mjs";
import { t as createAgentTurnService } from "./agent-turn-service-DQl0GLTQ.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as resolveAgentTurnRunObserver, t as captureAgentTurnPrincipal } from "./principal-DQ8O16Zh.mjs";
//#region src/gateway/agent-turn/io.ts
function createAgentTurnIo(respond) {
	const emit = (frame, meta) => {
		if (meta === void 0) {
			respond(...frame);
			return;
		}
		respond(...frame, meta);
	};
	return {
		emitAcceptance: emit,
		emitFinal: emit
	};
}
//#endregion
//#region src/gateway/server-methods/agent-run-handler.ts
const agentRunHandler = async ({ params, respond, context, client, isWebchatConnect, hasCurrentClientAuthority, sessionMutationCommitGuard }) => {
	const assertUploadAllowed = captureGatewayClientUploadCommitGuard({
		method: "agent",
		requestParams: params,
		client,
		context
	});
	const assertAdmissionCurrent = () => {
		sessionMutationCommitGuard?.();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	};
	assertAdmissionCurrent();
	const io = createAgentTurnIo(respond);
	if (!assertValidParams(params, validateAgentParams, "agent", (ok, payload, error, meta) => io.emitAcceptance([
		ok,
		payload,
		error
	], meta))) return;
	const runtimeAuthority = createAgentRuntimeAuthorityGuard(client, context, respond, assertAdmissionCurrent);
	if (!runtimeAuthority.ensureActive()) return;
	const request = params;
	const principal = captureAgentTurnPrincipal(client);
	const preflight = prepareAgentRequestPreflight({
		request,
		context,
		client: principal,
		io
	});
	if (!preflight) return;
	const onRunObserved = resolveAgentTurnRunObserver({
		principal,
		registerToolEventRecipient: context.registerToolEventRecipient
	});
	try {
		await createAgentTurnService({
			context,
			isWebchatConnect
		}).startTurn({
			assertAdmissionCurrent: runtimeAuthority.commitGuard,
			assertInputCommitAllowed: assertUploadAllowed,
			hasCurrentClientAuthority,
			preflight,
			principal,
			io,
			onRunObserved
		});
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) {
			respond(false, void 0, error.error);
			return;
		}
		runtimeAuthority.handleClosedError(error);
	}
};
//#endregion
//#region src/gateway/server-methods/agent-wait.ts
const agentWaitHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateAgentWaitParams, "agent.wait", respond)) return;
	const gatewayClient = client ?? null;
	const prepared = createAgentTurnService({
		context,
		isWebchatConnect
	}).prepareWaitForTurn(params);
	const authorizeWait = (run) => {
		if (!gatewayClient?.authenticatedUserProfile || isGatewayAdmin(gatewayClient)) return true;
		const cfg = context.getRuntimeConfig();
		if (operatorSessionCap(gatewayClient, cfg) !== "none") return true;
		const target = run?.sessionKey ? resolveSessionSharingTarget({
			cfg,
			sessionKey: run.sessionKey,
			agentId: run.agentId
		}) : null;
		const visibilityFilter = createSessionListEntryFilter({
			client: gatewayClient,
			cfg
		});
		if (!target || run?.lifecycleGeneration !== getAgentRunLifecycleGeneration() || run?.sessionId !== void 0 && target.entry.sessionId !== run.sessionId || visibilityFilter?.(target.storeKey, target.entry) === false) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent run was not found"));
			return false;
		}
		return true;
	};
	if (!authorizeWait(prepared.session)) return;
	const observation = await prepared.wait();
	if (authorizeWait(observation.session)) respond(true, observation.result);
};
//#endregion
//#region src/gateway/server-methods/agent.ts
const agentHandlers = {
	agent: agentRunHandler,
	"agent.wait": agentWaitHandler
};
//#endregion
export { agentHandlers };
