import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { o as resolveSessionEventAgentScope } from "./session-request-agent-ByGzV8Af.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DXWhtQve.mjs";
import { d as isGatewayAdmin } from "./session-sharing-policy-vx7GWqzs.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
//#region src/gateway/presence-projection.ts
/** Roster objects are immutable for one publication; authority is checked for every recipient. */
function createPresenceRecipientProjection(params) {
	const keys = [...new Set(params.presence.flatMap((row) => row.watchedSessions ?? []))];
	const memory = getSessionActorStorageBinding({});
	const memoryOwners = /* @__PURE__ */ new Map();
	for (const key of keys) {
		if (!isIncognitoSessionKey(key)) continue;
		const agentId = resolveSessionEventAgentScope(params.cfg, key, parseAgentSessionKey(key)?.agentId)?.[1];
		if (agentId && !memoryOwners.has(agentId)) memoryOwners.set(agentId, captureSessionActorStorageOwner({
			agentId,
			sessionKey: key,
			sessionActor: memory
		}, {
			assertCurrent() {},
			authorize() {}
		}));
	}
	const views = /* @__PURE__ */ new Map();
	let routingConfig;
	let watches = [];
	let revision;
	const targets = /* @__PURE__ */ new Map();
	const resolveTarget = (sessionKey, key, agentId) => {
		if (isIncognitoSessionKey(key)) {
			memory?.actor.assertReadable();
			const captured = memoryOwners.get(agentId);
			const entry = captured?.owner?.readSession(key, captured.authority)?.entry;
			return entry ? {
				canonicalKey: key,
				entry
			} : void 0;
		}
		if (!targets.has(sessionKey)) {
			const state = params.projection?.sharingTargetState({
				key,
				agentId
			});
			targets.set(sessionKey, state?.status === "ready" ? state.target : null);
		}
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
