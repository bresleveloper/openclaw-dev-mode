import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { ii as validateSessionsActivitySummaryEnsureParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BNrKHiJ3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget, O as prepareSessionSharing, j as authorizeIncognitoSessionTarget } from "./session-sharing-C4w_but1.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/session-activity-summary.ts
const sessionActivitySummaryHandlers = { "sessions.activitySummary.ensure": ({ params, client, context, respond }) => {
	if (!assertValidParams(params, validateSessionsActivitySummaryEnsureParams, "sessions.activitySummary.ensure", respond)) return;
	const service = context.sessionActivitySummaries;
	if (!service) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Activity recaps are unavailable."));
		return;
	}
	const cfg = context.getRuntimeConfig();
	const sharing = prepareSessionSharing({
		client,
		cfg
	});
	const targets = [];
	for (const requested of params.sessions) {
		const agent = resolveRequestedSessionAgentId(cfg, requested.key, requested.agentId);
		if (!agent.ok) {
			respond(false, void 0, agent.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: requested.key,
			agentId: agent.agentId
		});
		if (!target || hasOperatorBoundary(client, cfg) && sharing.entryFilter?.(target.canonicalKey, target.entry) === false) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable."));
			return;
		}
		const error = authorizeIncognitoSessionTarget({
			client,
			sessionKey: requested.key,
			target
		}) ?? authorizeSessionSharingTarget({
			cfg,
			client,
			target
		});
		if (error) {
			respond(false, void 0, error);
			return;
		}
		targets.push({
			key: target.canonicalKey,
			agentId: target.agentId
		});
	}
	respond(true, { sessions: targets.map((target) => ({
		key: target.key,
		agentId: target.agentId,
		activitySummary: {
			...service.ensure(target),
			canEnsure: true
		}
	})) });
} };
//#endregion
export { sessionActivitySummaryHandlers };
