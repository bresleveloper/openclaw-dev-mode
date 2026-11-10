import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, Oa as validateSessionsProviderReviewContinueParams } from "./src-pLJQA6J5.mjs";
import { s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { d as issueProviderReviewAcknowledgment, f as readProviderReviewAcknowledgment, m as retireProviderReviewAcknowledgment } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { g as resolveSessionSharingTargetAsync } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
//#region src/gateway/server-methods/sessions-provider-review.ts
const sessionProviderReviewHandlers = { "sessions.providerReview.continue": defineValidatedGatewayHandler("sessions.providerReview.continue", validateSessionsProviderReviewContinueParams, async (options) => {
	const { params, client, context, respond } = options;
	if (!client || !isOperatorUiClient(client.connect.client) || client.internal?.syntheticClient || client.internal?.senderAttribution) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Review and acknowledge the findings in chat."));
		return;
	}
	let acknowledgment;
	let handedOff = false;
	let releaseAuthorization;
	try {
		if (isIncognitoSessionKey(params.sessionKey)) throw new Error("Provider review cannot be continued in an incognito session");
		const authorization = options.sessionMutationAuthorization ? {
			authorization: options.sessionMutationAuthorization,
			error: null
		} : await resolveSessionMutationAuthorizationAsync({
			client,
			method: "sessions.providerReview.continue",
			requestParams: params,
			context
		});
		if (!options.sessionMutationAuthorization) releaseAuthorization = authorization.authorization?.release;
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
		const target = await resolveSessionSharingTargetAsync({
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
		const { handleProviderReviewContinuationChat } = await import("./chat-send-handler-DDgslroc.mjs");
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
		releaseAuthorization?.();
		if (acknowledgment && !handedOff) retireProviderReviewAcknowledgment(acknowledgment);
	}
}) };
//#endregion
export { sessionProviderReviewHandlers };
