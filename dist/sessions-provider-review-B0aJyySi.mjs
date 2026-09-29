import { s as isOperatorUiClient } from "./message-channel-DDcHHhpX.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ji as validateSessionsProviderReviewContinueParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { _ as issueProviderReviewAcknowledgment, b as retireProviderReviewAcknowledgment, v as readProviderReviewAcknowledgment } from "./lifecycle-WWQJH57y.mjs";
import { K as resolveSessionSharingTarget, t as resolveSessionMutationAuthorization } from "./session-sharing-C4w_but1.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/sessions-provider-review.ts
const sessionProviderReviewHandlers = { "sessions.providerReview.continue": async (options) => {
	const { params, client, context, respond } = options;
	if (!assertValidParams(params, validateSessionsProviderReviewContinueParams, "sessions.providerReview.continue", respond)) return;
	if (!client || !isOperatorUiClient(client.connect.client) || client.internal?.syntheticClient || client.internal?.senderAttribution) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Review and acknowledge the findings in chat."));
		return;
	}
	let acknowledgment;
	let handedOff = false;
	try {
		const authorization = options.sessionMutationAuthorization ? {
			authorization: options.sessionMutationAuthorization,
			error: null
		} : resolveSessionMutationAuthorization({
			client,
			method: "sessions.providerReview.continue",
			requestParams: params,
			context
		});
		if (authorization.error) {
			respond(false, void 0, authorization.error);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: params.sessionKey,
			agentId: requested.agentId
		});
		if (!target || target.entry.sessionId !== params.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "The session changed; refresh its findings."));
			return;
		}
		const assertCurrent = () => {
			options.signal?.throwIfAborted();
			if (options.hasCurrentClientAuthority?.() === false) throw new Error("Provider review caller authority is no longer current");
			(authorization.authorization?.assertAdmittedInputCurrent ?? authorization.authorization?.assertCurrent)?.();
		};
		acknowledgment = await issueProviderReviewAcknowledgment({
			target: {
				agentId: target.agentId,
				storePath: target.storePath,
				sessionKey: target.storeKey,
				sessionId: target.entry.sessionId,
				lifecycleRevision: target.entry.lifecycleRevision
			},
			reviewId: params.reviewId,
			nextRunId: params.idempotencyKey,
			assertCurrent
		});
		const { review } = readProviderReviewAcknowledgment(acknowledgment);
		const message = review.review?.continuation?.message;
		if (message === void 0) throw new Error("Provider review has no continuation");
		const { handleProviderReviewContinuationChat } = await import("./chat-send-handler-Bw9iaZn0.mjs");
		assertCurrent();
		handedOff = true;
		await handleProviderReviewContinuationChat({
			...options,
			sessionMutationAuthorization: authorization.authorization,
			params: {
				sessionKey: target.canonicalKey,
				agentId: target.agentId,
				sessionId: target.entry.sessionId,
				message,
				idempotencyKey: params.idempotencyKey,
				deliver: false
			}
		}, acknowledgment);
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) respond(false, void 0, error.error);
		else respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Could not continue this chat. Refresh its current findings before trying again."));
	} finally {
		if (acknowledgment && !handedOff) retireProviderReviewAcknowledgment(acknowledgment);
	}
} };
//#endregion
export { sessionProviderReviewHandlers };
