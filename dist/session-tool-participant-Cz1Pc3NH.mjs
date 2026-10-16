import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as isSessionTargetMethod } from "./session-method-policy-B_ndZirn.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { a as getGatewayToolCallerIdentity, s as resolveGatewayPersonalToolParticipant } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
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
