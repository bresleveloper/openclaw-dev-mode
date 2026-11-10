import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { Ng as errorShape, fi as validateSessionDiscussionInfoParams, hi as validateSessionDiscussionOpenResult, mi as validateSessionDiscussionOpenParams, pi as validateSessionDiscussionInfoResult } from "./src-pLJQA6J5.mjs";
import { w as formatValidationErrors } from "./worker-protocol-primitives-wrWgxYRD.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { o as withGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { c as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { a as maybeGenerateSessionTitle } from "./dashboard-session-title-2wgQueAj.mjs";
import { t as getSessionDiscussionProvider } from "./session-discussion-registry-DvOauvdC.mjs";
import { t as measureSessionCollaborationPhase } from "./sessions-collaboration-diagnostics-rkGOzsws.mjs";
//#region src/gateway/server-methods/session-discussion.ts
const DISCUSSION_TITLE_TIMEOUT_MS = 1e4;
async function maybeGenerateTitleBeforeDiscussionOpen(params) {
	const warn = (error) => params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(error)}`);
	try {
		const cfg = params.context.getRuntimeConfig();
		const resolved = await withGatewaySessionStoreTarget({
			cfg,
			key: params.sessionKey,
			agentId: params.agentId
		}, (target) => ({
			target,
			entry: resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys),
			canonicalKey: target.canonicalKey,
			storePath: target.storePath
		}));
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
			warn(error);
			return false;
		});
		if (await raceWithTimeout(observedTitleRequest, DISCUSSION_TITLE_TIMEOUT_MS, () => false, { ref: false })) emitSessionsChanged(params.context, {
			sessionKey: resolved.canonicalKey,
			agentId: resolved.target.agentId,
			reason: "chat.title"
		});
	} catch (error) {
		warn(error);
	}
}
function sessionDiscussionHandler(operation) {
	const method = operation === "info" ? "session.discussion.info" : "session.discussion.open";
	const validateParams = operation === "info" ? validateSessionDiscussionInfoParams : validateSessionDiscussionOpenParams;
	const validateResult = operation === "info" ? validateSessionDiscussionInfoResult : validateSessionDiscussionOpenResult;
	return defineValidatedGatewayHandler(method, validateParams, async ({ params, respond, context }) => {
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
			const result = await measureSessionCollaborationPhase(`${method}.provider`, () => provider[operation]({
				sessionKey,
				agentId: requestedAgent.agentId
			}));
			if (!validateResult(result)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid ${method} result: ${formatValidationErrors(validateResult.errors)}`));
				return;
			}
			respond(true, result, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "session discussion provider failed"));
		}
	});
}
const sessionDiscussionHandlers = {
	"session.discussion.info": sessionDiscussionHandler("info"),
	"session.discussion.open": sessionDiscussionHandler("open")
};
//#endregion
export { sessionDiscussionHandlers };
