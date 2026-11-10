import { E as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { i as maybeGenerateDashboardSessionTitle, r as isDashboardSessionTitleCandidate, t as buildDashboardSessionTitleSource } from "./dashboard-session-title-2wgQueAj.mjs";
//#region src/gateway/server-methods/chat-send-background.ts
function scheduleCreatedDashboardSessionTitle(created, cfg, context, titleSource) {
	if (!created.isNew || created.entry.incognito || !titleSource) return;
	scheduleChatDashboardSessionTitle({
		admittedSessionId: created.entry.sessionId,
		agentId: created.agentId,
		cfg,
		context,
		request: {
			rawMessage: titleSource,
			normalizedAttachments: []
		},
		sessionKey: created.key,
		storePath: created.storePath
	});
}
function scheduleChatDashboardSessionTitle(params, retryAfter) {
	const titleSource = buildDashboardSessionTitleSource({
		message: params.request.rawMessage,
		attachments: params.request.normalizedAttachments
	});
	if (!isDashboardSessionTitleCandidate({
		sessionKey: params.sessionKey,
		userMessage: titleSource
	})) return;
	runWithGatewayIndependentRootWorkContinuation(async () => {
		if (await maybeGenerateDashboardSessionTitle({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionId: params.admittedSessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			currentUserMessage: params.request.rawMessage,
			userMessage: titleSource,
			...retryAfter ? { retryAfter } : {},
			onFallback: () => params.context.logGateway.warn("dashboard session title generation exhausted; using a crustacean fallback name")
		})) emitSessionsChanged(params.context, {
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			reason: "chat.title"
		});
	}, "chat-send:background").catch((err) => {
		params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(err)}`);
	});
}
//#endregion
export { scheduleCreatedDashboardSessionTitle as n, scheduleChatDashboardSessionTitle as t };
