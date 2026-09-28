import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _h as formatValidationErrors, _i as validateSessionsCompanionStateParams, gi as validateSessionsCompanionResetParams, hi as validateSessionsCompanionAskParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { B as hiddenSessionNotFound, K as resolveSessionSharingTarget, O as prepareSessionSharing } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionCompanionAskError } from "./session-companion-ask-DBWUdVQe.mjs";
//#region src/gateway/session-companion-rpc.ts
function resolveCompanionTarget(params, context) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) return requested;
	return {
		ok: true,
		agentId: requested.agentId,
		sessionKey: resolveSessionStoreKey({
			cfg,
			sessionKey: params.sessionKey,
			storeAgentId: requested.agentId
		})
	};
}
function companionTargetIsVisible(target, client, context) {
	if (client?.connId && context.isConnectionActive?.(client.connId) === false) return false;
	const cfg = context.getRuntimeConfig();
	const sharingTarget = resolveSessionSharingTarget({
		cfg,
		sessionKey: target.sessionKey,
		agentId: target.agentId
	});
	if (!sharingTarget) return cfg.gateway?.roles === void 0;
	return prepareSessionSharing({
		client,
		cfg
	}).entryFilter?.(sharingTarget.storeKey, sharingTarget.entry) !== false;
}
const sessionCompanionHandlers = {
	"sessions.companion.ask": async ({ params, respond, client, context, signal }) => {
		if (!validateSessionsCompanionAskParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.ask params: ${formatValidationErrors(validateSessionsCompanionAskParams.errors)}`));
			return;
		}
		const { sessionKey, agentId, question } = params;
		if (!question.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "question must contain non-whitespace text"));
			return;
		}
		if (!client?.connId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Side chat questions require a connected client."));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		if (!companionTargetIsVisible(target, client, context)) {
			respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
			return;
		}
		const assertSourceCurrent = () => {
			if (!companionTargetIsVisible(target, client, context)) throw new SessionCompanionAskError("session-missing", "Side chat is unavailable.");
		};
		try {
			respond(true, await context.sessionCompanion.ask({
				sessionKey: target.sessionKey,
				agentId: target.agentId,
				question,
				connId: client.connId,
				assertSourceCurrent,
				...signal ? { signal } : {}
			}));
		} catch (error) {
			if (!(error instanceof SessionCompanionAskError)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat could not answer right now."));
				return;
			}
			if (error.reason === "busy") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
					details: { code: GatewayErrorDetailCodes.SESSION_COMPANION_BUSY },
					retryable: true
				}));
				return;
			}
			const retryable = error.reason === "rate-limited" || error.reason === "context-unavailable";
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
				details: { reason: error.reason },
				retryable,
				...error.retryAfterMs ? { retryAfterMs: error.retryAfterMs } : {}
			}));
		}
	},
	"sessions.companion.state": ({ params, respond, client, context }) => {
		if (!validateSessionsCompanionStateParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.state params: ${formatValidationErrors(validateSessionsCompanionStateParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		if (!companionTargetIsVisible(target, client, context)) {
			respond(false, void 0, hiddenSessionNotFound(target.sessionKey));
			return;
		}
		respond(true, context.sessionCompanion.state({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		}));
	},
	"sessions.companion.reset": ({ params, respond, context }) => {
		if (!validateSessionsCompanionResetParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.companion.reset params: ${formatValidationErrors(validateSessionsCompanionResetParams.errors)}`));
			return;
		}
		if (!context.sessionCompanion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Side chat is unavailable."));
			return;
		}
		const { sessionKey, agentId } = params;
		const target = resolveCompanionTarget({
			sessionKey,
			agentId
		}, context);
		if (!target.ok) {
			respond(false, void 0, target.error);
			return;
		}
		context.sessionCompanion.reset({
			agentId: target.agentId,
			sessionKey: target.sessionKey
		});
		respond(true, { ok: true });
	}
};
//#endregion
export { sessionCompanionHandlers };
