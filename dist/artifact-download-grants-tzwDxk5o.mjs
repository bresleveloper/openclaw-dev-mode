import { t as ARTIFACT_DOWNLOAD_PATH } from "./artifact-download-CXaDlLGk.mjs";
import { randomBytes } from "node:crypto";
//#region src/gateway/artifact-download-grants.ts
const DOWNLOAD_TTL_MS = 3e5;
const MAX_DOWNLOADS_PER_CONNECTION = 128;
const downloads = /* @__PURE__ */ new WeakMap();
function removeDownload(grants, ticket) {
	const grant = grants.get(ticket);
	if (grant && grants.delete(ticket)) grant.release();
}
function canCreateArtifactDownload(client) {
	return Boolean(client?.connId && client.connectionSignal?.aborted === false && !client.invalidated);
}
function pruneExpiredArtifactDownloads(clients, now) {
	for (const client of clients) {
		const grants = downloads.get(client);
		if (!grants) continue;
		for (const [ticket, grant] of grants) if (!canCreateArtifactDownload(client) || grant.expiresAt <= now) removeDownload(grants, ticket);
	}
}
function createArtifactDownload(params) {
	const { client } = params;
	if (!canCreateArtifactDownload(client)) throw new Error("Artifact download connection is no longer available");
	params.assertCurrent();
	let grants = downloads.get(client);
	if (!grants) {
		grants = /* @__PURE__ */ new Map();
		downloads.set(client, grants);
		const owned = grants;
		client.connectionSignal.addEventListener("abort", () => {
			for (const ticket of owned.keys()) removeDownload(owned, ticket);
			downloads.delete(client);
		}, { once: true });
	}
	const now = Date.now();
	pruneExpiredArtifactDownloads([client], now);
	for (const ticket of grants.keys()) {
		if (grants.size < MAX_DOWNLOADS_PER_CONNECTION) break;
		removeDownload(grants, ticket);
	}
	const ticket = randomBytes(32).toString("base64url");
	const expiresAt = now + DOWNLOAD_TTL_MS;
	grants.set(ticket, {
		expiresAt,
		digest: params.prepared.digest,
		image: params.prepared.artifact.type === "image",
		assertCurrent: params.assertCurrent,
		read: params.read,
		release: params.release
	});
	return {
		url: `${ARTIFACT_DOWNLOAD_PATH}${encodeURIComponent(client.connId)}/${ticket}`,
		expiresAt: new Date(expiresAt).toISOString()
	};
}
function getArtifactDownloadGrant(client, ticket) {
	return downloads.get(client)?.get(ticket);
}
function assertArtifactDownloadGrantCurrent(clients, client, ticket, grant) {
	const grants = downloads.get(client);
	if (!clients.has(client) || !canCreateArtifactDownload(client) || grant.expiresAt <= Date.now() || grants?.get(ticket) !== grant) {
		if (grants?.get(ticket) === grant) removeDownload(grants, ticket);
		throw new Error("Artifact download expired");
	}
	grant.assertCurrent();
}
//#endregion
export { pruneExpiredArtifactDownloads as a, getArtifactDownloadGrant as i, canCreateArtifactDownload as n, createArtifactDownload as r, assertArtifactDownloadGrantCurrent as t };
