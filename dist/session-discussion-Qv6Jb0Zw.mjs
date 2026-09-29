import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Br as validateSessionDiscussionInfoParams, Hr as validateSessionDiscussionOpenParams, Ur as validateSessionDiscussionOpenResult, Vr as validateSessionDiscussionInfoResult, _h as formatValidationErrors } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { t as getSessionDiscussionProvider } from "./session-discussion-registry-BmssJ7JH.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-DFVq928u.mjs";
import { a as maybeGenerateSessionTitle } from "./dashboard-session-title-Dfgz25-G.mjs";
//#region src/gateway/server-methods/session-discussion.ts
const DISCUSSION_TITLE_TIMEOUT_MS = 1e4;
async function maybeGenerateTitleBeforeDiscussionOpen(params) {
	try {
		const cfg = params.context.getRuntimeConfig();
		const resolved = loadAccessorSessionEntryForGatewayTarget({
			cfg,
			key: params.sessionKey,
			agentId: params.agentId
		});
		const { entry } = resolved;
		const sessionId = entry?.sessionId;
		if (!entry || !sessionId || hasExplicitSessionName(entry)) return;
		const observedTitleRequest = maybeGenerateSessionTitle({
			cfg,
			agentId: resolved.target.agentId,
			entry,
			sessionId,
			sessionKey: resolved.canonicalKey,
			storePath: resolved.storePath,
			userMessage: ""
		}).catch((error) => {
			params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
			return false;
		});
		let timeout;
		let persisted;
		try {
			persisted = await Promise.race([observedTitleRequest, new Promise((resolve) => {
				timeout = setTimeout(() => resolve(false), DISCUSSION_TITLE_TIMEOUT_MS);
				timeout.unref?.();
			})]);
		} finally {
			clearTimeout(timeout);
		}
		if (persisted) emitSessionsChanged(params.context, {
			sessionKey: resolved.canonicalKey,
			agentId: resolved.target.agentId,
			reason: "chat.title"
		});
	} catch (error) {
		params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
	}
}
function sessionDiscussionHandler(operation) {
	const method = operation === "info" ? "session.discussion.info" : "session.discussion.open";
	const validateParams = operation === "info" ? validateSessionDiscussionInfoParams : validateSessionDiscussionOpenParams;
	const validateResult = operation === "info" ? validateSessionDiscussionInfoResult : validateSessionDiscussionOpenResult;
	return async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateParams, method, respond)) return;
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const provider = getSessionDiscussionProvider();
		if (!provider) {
			respond(true, { state: "none" }, void 0);
			return;
		}
		try {
			if (operation === "open") await maybeGenerateTitleBeforeDiscussionOpen({
				context,
				sessionKey: params.sessionKey,
				agentId: requestedAgent.agentId
			});
			const sessionKey = resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: requestedAgent.agentId,
				sessionKey: params.sessionKey
			});
			const result = await provider[operation]({
				sessionKey,
				agentId: requestedAgent.agentId
			});
			if (!validateResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid ${method} result: ${formatValidationErrors(validateResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	};
}
const sessionDiscussionHandlers = {
	"session.discussion.info": sessionDiscussionHandler("info"),
	"session.discussion.open": sessionDiscussionHandler("open")
};
//#endregion
export { sessionDiscussionHandlers };
