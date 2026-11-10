import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ii as validateSessionsActivitySummaryEnsureParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { o as withGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { c as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
//#region src/gateway/server-methods/session-activity-summary.ts
const sessionActivitySummaryHandlers = { "sessions.activitySummary.ensure": defineValidatedGatewayHandler("sessions.activitySummary.ensure", validateSessionsActivitySummaryEnsureParams, async ({ params, client, context, respond }) => {
	const service = context.sessionActivitySummaries;
	if (!service) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Activity recaps are unavailable."));
		return;
	}
	const cfg = context.getRuntimeConfig();
	const profiles = await prepareSessionSharingProfiles(client);
	const reads = [];
	try {
		const requestedTargets = [];
		for (const requested of params.sessions) {
			const agent = resolveRequestedSessionAgentId(cfg, requested.key, requested.agentId);
			if (!agent.ok) {
				respond(false, void 0, agent.error);
				return;
			}
			requestedTargets.push({
				requested,
				agentId: agent.agentId
			});
		}
		const prepared = (await Promise.allSettled(requestedTargets.map(async ({ requested, agentId }) => {
			if (isIncognitoSessionKey(requested.key)) return;
			const [sharing, entry] = await Promise.allSettled([prepareSessionMutationFacts({
				cfg,
				sessionKey: requested.key,
				agentId,
				allowMissing: true
			}).then((read) => {
				reads.push(read);
				return read;
			}), withGatewaySessionStoreTarget({
				cfg,
				key: requested.key,
				agentId,
				projection: "list"
			}, (target) => resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys))]);
			if (sharing.status === "rejected") throw sharing.reason;
			if (entry.status === "rejected") throw entry.reason;
			return {
				read: sharing.value,
				entry: entry.value
			};
		}))).map((result) => {
			if (result.status === "rejected") throw result.reason;
			return result.value;
		});
		const targets = [];
		for (const [index, { requested, agentId }] of requestedTargets.entries()) {
			if (isIncognitoSessionKey(requested.key)) {
				const error = authorizeIncognitoSessionTarget({
					client,
					sessionKey: requested.key,
					target: null
				});
				if (error) {
					respond(false, void 0, error);
					return;
				}
				targets.push({
					key: requested.key,
					agentId,
					unavailable: true
				});
				continue;
			}
			const currentCfg = context.getRuntimeConfig();
			const selected = prepared[index];
			const facts = selected.read.readCurrent(currentCfg);
			const target = facts.target;
			const sharing = prepareProjectedSessionSharing({
				cfg: currentCfg,
				client,
				profiles,
				isMember: (_target, id) => facts.membership.has(id)
			});
			if (!target || !selected.entry || selected.entry.sessionId !== target.entry.sessionId || selected.entry.lifecycleRevision !== target.entry.lifecycleRevision || hasOperatorBoundary(client, currentCfg) && sharing.entryFilter?.(target.canonicalKey, target.entry) === false) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable."));
				return;
			}
			const error = authorizeIncognitoSessionTarget({
				client,
				sessionKey: requested.key,
				target
			}) ?? sharing.authorizeTarget(target);
			if (error) {
				respond(false, void 0, error);
				return;
			}
			targets.push({
				key: target.canonicalKey,
				agentId: target.agentId,
				entry: {
					...selected.entry,
					...target.entry
				}
			});
		}
		const sessions = await Promise.all(targets.map(async (target) => ({
			key: target.key,
			agentId: target.agentId,
			activitySummary: {
				...target.unavailable ? { state: "unavailable" } : await service.ensure(target, target.entry),
				canEnsure: true
			}
		})));
		const currentCfg = context.getRuntimeConfig();
		for (const [index, { requested }] of requestedTargets.entries()) {
			const selected = prepared[index];
			if (!selected) continue;
			const facts = selected.read.readCurrent(currentCfg);
			const target = facts.target;
			const sharing = prepareProjectedSessionSharing({
				cfg: currentCfg,
				client,
				profiles,
				isMember: (_target, id) => facts.membership.has(id)
			});
			const error = target ? authorizeIncognitoSessionTarget({
				client,
				sessionKey: requested.key,
				target
			}) ?? sharing.authorizeTarget(target) : errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable.");
			if (error || target && hasOperatorBoundary(client, currentCfg) && sharing.entryFilter?.(target.canonicalKey, target.entry) === false) {
				respond(false, void 0, error ?? errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable."));
				return;
			}
		}
		respond(true, { sessions });
	} finally {
		for (const read of reads) read.release();
	}
}) };
//#endregion
export { sessionActivitySummaryHandlers };
