import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./operator-scopes-DsrPoRc4.mjs";
import { u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { N as readCommittedIncognitoSessionSharing } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
import { i as resolveSessionEventAgentScope } from "./session-request-agent-Bxi11ET4.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DnDs09-7.mjs";
import { f as isGatewayAdmin } from "./session-sharing-policy-BVt5saXn.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
//#region src/gateway/presence-projection.ts
/** Roster objects are immutable for one publication; authority is checked for every recipient. */
function createPresenceRecipientProjection(params) {
	const keys = [...new Set(params.presence.flatMap((row) => row.watchedSessions ?? []))];
	const views = /* @__PURE__ */ new Map();
	let routingConfig;
	let watches = [];
	let revision;
	const targets = /* @__PURE__ */ new Map();
	const resolveTarget = (sessionKey, key, agentId) => {
		if (isIncognitoSessionKey(key)) {
			const database = getOpenIncognitoAgentDatabase(agentId, resolveIncognitoOpenClawAgentSqlitePath({ agentId }));
			const entry = database && readCommittedIncognitoSessionSharing(database.db, key)?.entry;
			return entry ? {
				canonicalKey: key,
				entry
			} : void 0;
		}
		if (!targets.has(sessionKey)) targets.set(sessionKey, params.projection?.sharingTarget({
			key,
			agentId
		}) ?? null);
		return targets.get(sessionKey);
	};
	return (client) => {
		if (!client?.connect || (client.connect.role ?? "operator") !== "operator" || !authorizeOperatorScopesForRequiredScope("operator.read", client.connect.scopes ?? []).allowed) return [];
		const cfg = params.projection?.getPolicyConfig() ?? params.cfg;
		if (routingConfig !== cfg) {
			routingConfig = cfg;
			watches = keys.map((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				const key = parsed?.rest === "global" || parsed?.rest === "unknown" ? parsed.rest : sessionKey;
				return {
					sessionKey,
					key,
					agentId: resolveSessionEventAgentScope(cfg, key, parsed?.agentId)?.[1]
				};
			});
			targets.clear();
		}
		const currentRevision = params.projection?.sharingRevision;
		if (revision !== currentRevision || currentRevision === void 0) {
			revision = currentRevision;
			targets.clear();
		}
		const canReadSessions = isGatewayAdmin(client) || !isGatewayClientProfilePending(client);
		const { entryFilter } = prepareProjectedSessionSharing({
			cfg,
			client,
			isMember: () => false
		});
		const visible = /* @__PURE__ */ new Set();
		const indexes = [];
		if (canReadSessions) for (const [index, { sessionKey, key, agentId }] of watches.entries()) {
			if (!agentId) continue;
			const target = resolveTarget(sessionKey, key, agentId);
			if (target && (entryFilter?.(target.canonicalKey, target.entry) ?? true)) {
				visible.add(sessionKey);
				indexes.push(index);
			}
		}
		const signature = indexes.join(",");
		let view = views.get(signature);
		if (!view) {
			view = params.presence.map((row) => {
				if (!row.watchedSessions) return row;
				const watchedSessions = row.watchedSessions.filter((key) => visible.has(key));
				const { watchedSessions: _watchedSessions, ...person } = row;
				return watchedSessions.length ? {
					...person,
					watchedSessions
				} : person;
			});
			views.set(signature, view);
		}
		return view;
	};
}
//#endregion
export { createPresenceRecipientProjection as t };
