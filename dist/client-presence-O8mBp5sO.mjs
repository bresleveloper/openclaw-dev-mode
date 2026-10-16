import { a as upsertPresence } from "./system-presence-CbgT1h20.mjs";
import { n as presenceUserKey } from "./presence-user-DFg4B6Vx.mjs";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-W1udm3RS.mjs";
//#region src/gateway/server/client-presence.ts
const ACTIVITY_BROADCAST_INTERVAL_MS = 3e4;
const activityPublications = /* @__PURE__ */ new WeakMap();
function isLiveClient(client) {
	return !client.invalidated && client.socket.readyState === 1;
}
function presenceIdentity(client) {
	const profileId = client.authenticatedUserProfile?.profileId;
	return profileId ? presenceUserKey({
		id: profileId,
		identity: {
			type: "profile",
			id: profileId
		}
	}) : client.authenticatedUserId && !client.authenticatedGitHubIdentitySync ? presenceUserKey({ id: client.authenticatedUserId }) : void 0;
}
/** Current transport facts are complete even when the legacy beacon cache evicts a row. */
function snapshotClientPresence(clients, observedAt = Date.now()) {
	return [...clients].filter((client) => client.presenceKey && isLiveClient(client)).map((client) => {
		const entry = {
			connectionId: client.connId,
			deviceId: client.connect.device?.id,
			instanceId: client.connect.client.instanceId,
			host: client.connect.client.displayName ?? client.connect.client.id,
			clientId: client.connect.client.id,
			platform: client.connect.client.platform,
			deviceFamily: client.connect.client.deviceFamily,
			timeZone: client.connect.client.timeZone,
			ip: client.internal?.isLocalClient ? void 0 : client.clientIp,
			roles: [client.connect.role ?? "operator"],
			user: presenceIdentity(client) ? buildAuthenticatedPresenceUser(client) : void 0,
			connectionLastActivityAt: client.connectionLastActivityAt,
			ts: observedAt
		};
		if (client.personPresence) {
			entry.onlineSince = client.personPresence.onlineSince;
			if (client.personPresence.lastActivityAt !== void 0) entry.lastActivityAt = client.personPresence.lastActivityAt;
		}
		return entry;
	});
}
/** Reconciles live identity/timing and returns whether a presence snapshot is needed. */
function refreshClientPresence(clients, client, activityAt) {
	if (!clients.has(client) || !isLiveClient(client) || !client.presenceKey) return false;
	const identity = presenceIdentity(client);
	if (!identity) return false;
	const peers = [...clients].filter((peer) => isLiveClient(peer) && peer.presenceKey && presenceIdentity(peer) === identity && (peer === client || client.personPresence && peer.personPresence));
	const timing = client.personPresence ? { ...client.personPresence } : void 0;
	for (const peer of peers) if (timing && peer.personPresence) {
		timing.onlineSince = Math.min(timing.onlineSince, peer.personPresence.onlineSince);
		const activity = peer.personPresence.lastActivityAt;
		if (activity !== void 0) timing.lastActivityAt = Math.max(timing.lastActivityAt ?? activity, activity);
	}
	const publication = activityPublications.get(client);
	const publish = activityAt === void 0 || timing?.lastActivityAt === void 0 || publication?.identity !== identity || activityAt < publication.at || activityAt - publication.at >= ACTIVITY_BROADCAST_INTERVAL_MS;
	if (timing && activityAt !== void 0) {
		timing.lastActivityAt = activityAt;
		client.connectionLastActivityAt = activityAt;
	}
	const nextPublication = publish ? {
		identity,
		at: activityAt ?? timing?.lastActivityAt ?? Date.now()
	} : publication;
	for (const peer of peers) {
		if (timing && peer.personPresence) peer.personPresence = { ...timing };
		if (nextPublication) activityPublications.set(peer, nextPublication);
		upsertPresence(peer.presenceKey, {
			connectionId: peer.connId,
			clientId: peer.connect.client.id,
			mode: peer.connect.client.mode,
			user: buildAuthenticatedPresenceUser(peer),
			...peer.personPresence,
			connectionLastActivityAt: peer.connectionLastActivityAt
		});
	}
	return publish;
}
/** Records accepted human activity; copies and clients closed during admission cannot write. */
function recordClientPresenceActivity(clients, client) {
	const live = client?.connId ? clients.getByConnectionId(client.connId) : void 0;
	return Boolean(live && live === client && live.personPresence && refreshClientPresence(clients, live, Date.now()));
}
//#endregion
export { refreshClientPresence as n, snapshotClientPresence as r, recordClientPresenceActivity as t };
