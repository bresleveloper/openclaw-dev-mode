import { i as upsertPresence } from "./system-presence-BhyW53Ym.mjs";
import { t as presenceUserKey } from "./presence-user-ulXqGuvR.mjs";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-BJ-hRa6a.mjs";
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
	if (timing && activityAt !== void 0) timing.lastActivityAt = activityAt;
	const nextPublication = publish ? {
		identity,
		at: activityAt ?? timing?.lastActivityAt ?? Date.now()
	} : publication;
	for (const peer of peers) {
		if (timing && peer.personPresence) peer.personPresence = { ...timing };
		if (nextPublication) activityPublications.set(peer, nextPublication);
		upsertPresence(peer.presenceKey, {
			clientId: peer.connect.client.id,
			mode: peer.connect.client.mode,
			user: buildAuthenticatedPresenceUser(peer),
			...peer.personPresence
		});
	}
	return publish;
}
/** Records accepted human activity; copies and clients closed during admission cannot write. */
function recordClientPresenceActivity(clients, client) {
	for (const live of clients) {
		if (live !== client || !isLiveClient(live) || !live.presenceKey || !live.personPresence || !presenceIdentity(live)) continue;
		return refreshClientPresence(clients, live, Date.now());
	}
	return false;
}
//#endregion
export { refreshClientPresence as n, recordClientPresenceActivity as t };
