import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { Ng as errorShape, n as validateAgentParams, r as validateAgentWaitParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { d as isGatewayAdmin, y as withSessionSharingTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as prepareAgentRequestPreflight } from "./agent-request-preflight-C7S905wb.mjs";
import { t as createAgentTurnService } from "./agent-turn-service-BMWNat3i.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-B3KjbGu2.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { n as resolveAgentTurnRunObserver, t as captureAgentTurnPrincipal } from "./principal-DazrCi1V.mjs";
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
	const assertAdmissionCurrent = composeSessionSourceAssertion([captureExternalSessionCommitGuard(sessionMutationCommitGuard)], (assertSource) => {
		assertSource();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	});
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
	const preflight = await prepareAgentRequestPreflight({
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
//#region src/gateway/server-methods/agent.ts
const agentWaitHandler = async ({ params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateAgentWaitParams, "agent.wait", respond)) return;
	const gatewayClient = client ?? null;
	const prepared = createAgentTurnService({
		context,
		isWebchatConnect
	}).prepareWaitForTurn(params);
	let profiles;
	const authorizeWait = async (run, respondWithResult) => {
		if (!gatewayClient?.authenticatedUserProfile || isGatewayAdmin(gatewayClient)) {
			respondWithResult?.();
			return true;
		}
		const preparedProfiles = await (profiles ??= prepareSessionSharingProfiles(gatewayClient));
		const cfg = context.getRuntimeConfig();
		if (prepareProjectedSessionSharing({
			client: gatewayClient,
			cfg,
			profiles: preparedProfiles,
			isMember: () => false
		}).policy?.sessions.others !== "none") {
			respondWithResult?.();
			return true;
		}
		const deny = () => {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent run was not found"));
			return false;
		};
		if (!run?.sessionKey) return deny();
		return withSessionSharingTarget({
			cfg,
			sessionKey: run.sessionKey,
			agentId: run.agentId
		}, ({ target, members, assertCurrent }) => {
			assertCurrent();
			const currentSharing = prepareProjectedSessionSharing({
				cfg: context.getRuntimeConfig(),
				client: gatewayClient,
				profiles: preparedProfiles,
				isMember: (_target, id) => members.some((member) => member.identityId === id)
			});
			if (!target || run.lifecycleGeneration !== getAgentRunLifecycleGeneration() || run.sessionId !== void 0 && target.entry.sessionId !== run.sessionId || currentSharing.entryFilter?.(target.storeKey, target.entry) === false) return deny();
			respondWithResult?.();
			return true;
		});
	};
	const observation = await prepared.wait();
	await authorizeWait(observation.session, () => respond(true, observation.result));
};
const agentHandlers = {
	agent: agentRunHandler,
	"agent.wait": agentWaitHandler
};
//#endregion
export { agentHandlers };
