import { mi as validateSessionsActivitySummaryEnsureParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { _ as resolveSessionSharingTarget, n as authorizeIncognitoSessionTarget, s as authorizeSessionSharingTarget } from "./session-sharing-policy-4QkIpHi4.mjs";
import { d as prepareSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/session-activity-summary.ts
const sessionActivitySummaryHandlers = { "sessions.activitySummary.ensure": defineValidatedGatewayHandler("sessions.activitySummary.ensure", validateSessionsActivitySummaryEnsureParams, ({ params, client, context, respond }) => {
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
}) };
//#endregion
export { sessionActivitySummaryHandlers };
