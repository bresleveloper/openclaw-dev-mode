import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { d as normalizeMimeType } from "./mime-1zBUMwu6.mjs";
import { l as sendMethodNotAllowed, y as respondNotFound } from "./http-common-oJ4rIoMl.mjs";
import { a as buildAssistantMediaContentDisposition, i as writeByteHeaders, r as resolveByteResponse } from "./http-byte-range-k1_X9iV6.mjs";
import { t as ARTIFACT_DOWNLOAD_PATH } from "./artifact-download-CXaDlLGk.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region src/gateway/artifact-downloads.ts
const DOWNLOAD_TTL_MS = 3e5;
const downloads = /* @__PURE__ */ new WeakMap();
function artifactContentDigest(artifact) {
	return createHash("sha256").update(JSON.stringify([
		artifact.id,
		artifact.type,
		artifact.title,
		artifact.mimeType
	])).update("\0").update(artifact.data ?? "").digest("hex");
}
function createArtifactDownload(params) {
	const { client } = params;
	if (!client?.connId || client.connectionSignal?.aborted !== false || client.invalidated || params.artifact.download.mode !== "bytes" || params.artifact.data === void 0) return;
	params.assertCurrent();
	let grants = downloads.get(client);
	if (!grants) {
		grants = /* @__PURE__ */ new Map();
		downloads.set(client, grants);
	}
	const now = Date.now();
	for (const [ticket, grant] of grants) if (grant.expiresAt <= now) grants.delete(ticket);
	pruneMapToMaxSize(grants, 127);
	const ticket = randomBytes(32).toString("base64url");
	const expiresAt = now + DOWNLOAD_TTL_MS;
	grants.set(ticket, {
		expiresAt,
		digest: artifactContentDigest(params.artifact),
		assertCurrent: params.assertCurrent,
		read: params.read
	});
	return {
		url: `${ARTIFACT_DOWNLOAD_PATH}${encodeURIComponent(client.connId)}/${ticket}`,
		expiresAt: new Date(expiresAt).toISOString()
	};
}
/** The RPC chooses and authorizes the resource; HTTP never accepts a replacement query. */
async function handleArtifactDownloadHttpRequest(req, res, opts) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const pathname = opts.basePath && url.pathname.startsWith(`${opts.basePath}/api/artifacts/download/`) ? url.pathname.slice(opts.basePath.length) : url.pathname;
	if (!pathname.startsWith("/api/artifacts/download/")) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const [connection, ticket, extra] = pathname.slice(ARTIFACT_DOWNLOAD_PATH.length).split("/");
	const client = [...opts.clients].find((candidate) => candidate.connId && encodeURIComponent(candidate.connId) === connection);
	const grants = client ? downloads.get(client) : void 0;
	const grant = ticket && extra === void 0 ? grants?.get(ticket) : void 0;
	if (!client || !grant || !ticket) {
		respondNotFound(res);
		return true;
	}
	const assertCurrent = () => {
		if (!opts.clients.has(client) || client.connectionSignal?.aborted !== false || client.invalidated || grant.expiresAt <= Date.now() || grants?.get(ticket) !== grant) throw new Error("Artifact download expired");
		grant.assertCurrent();
	};
	let artifact;
	try {
		assertCurrent();
		artifact = await grant.read();
		assertCurrent();
	} catch {
		respondNotFound(res);
		return true;
	}
	if (artifact?.download.mode !== "bytes" || artifact.data === void 0 || artifactContentDigest(artifact) !== grant.digest) {
		respondNotFound(res);
		return true;
	}
	const bytes = Buffer.from(artifact.data, "base64");
	const mime = normalizeMimeType(artifact.mimeType);
	const contentType = mime && /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mime) ? mime : "application/octet-stream";
	res.setHeader("content-type", contentType);
	res.setHeader("content-disposition", buildAssistantMediaContentDisposition(artifact.title));
	res.setHeader("content-security-policy", "default-src 'none'; sandbox");
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("referrer-policy", "no-referrer");
	res.setHeader("cache-control", "private, no-store");
	const response = resolveByteResponse({
		file: { size: bytes.length },
		method: req.method,
		request: req
	});
	writeByteHeaders(res, response);
	res.end(req.method === "HEAD" || response.kind === "unsatisfiable" || response.kind === "not-modified" ? void 0 : response.kind === "partial" ? bytes.subarray(response.range.start, response.range.end + 1) : bytes);
	return true;
}
//#endregion
export { handleArtifactDownloadHttpRequest as n, createArtifactDownload as t };
