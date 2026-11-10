import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { s as isSessionTargetMethod } from "./session-method-policy-B7o-3I76.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as resolveGatewayPersonalToolParticipant, o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
//#region src/gateway/session-tool-participant.ts
/** Unselected calls can retain the owner only for the shared turn's own session. */
function resolveRuntimeSessionParticipant(params) {
	const caller = getGatewayToolCallerIdentity();
	const { method, runtimeIdentity, context } = params;
	if (caller?.personalToolIdentityScoped || !isSessionTargetMethod(method)) return;
	const turn = caller ?? runtimeIdentity;
	const allowTurnOwner = () => {
		if (!turn) return false;
		try {
			const targets = context.resolveSessionRequestTargets?.({
				method,
				requestParams: params.requestParams,
				connId: params.connId
			});
			const cfg = context.getRuntimeConfig();
			const own = resolveSessionStoreIdentity({
				cfg,
				...turn
			});
			return Boolean(targets?.length && targets.every((target) => {
				const resolved = resolveSessionStoreIdentity({
					cfg,
					...target
				});
				return resolved.agentId === own.agentId && resolved.canonicalKey === own.canonicalKey;
			}));
		} catch {
			return false;
		}
	};
	const checked = (run) => {
		try {
			return run();
		} catch (error) {
			throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, `${formatErrorMessage(error)} Use a session tool with the requester's requester_profile.id as user.`));
		}
	};
	const participant = checked(() => resolveGatewayPersonalToolParticipant(runtimeIdentity, {
		requireSingleParticipant: true,
		allowMissingRegistry: true,
		allowTurnOwner
	}));
	return participant && { assertCurrent: () => checked(participant.assertCurrent) };
}
/** Expected participant refusals are request policy outcomes, not handler failures. */
function resolveRuntimeSessionParticipantRequest(options) {
	try {
		return resolveRuntimeSessionParticipant({
			method: options.req.method,
			requestParams: options.req.params,
			runtimeIdentity: options.client?.internal?.agentRuntimeIdentity,
			context: options.context,
			connId: options.client?.connId
		});
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		return null;
	}
}
//#endregion
export { resolveRuntimeSessionParticipantRequest as n, resolveRuntimeSessionParticipant as t };
