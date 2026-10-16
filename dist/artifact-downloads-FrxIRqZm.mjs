import { d as normalizeMimeType, f as sliceMimeSniffBuffer } from "./mime-CGDYrRzL.mjs";
import { l as isStillPngBuffer, s as isAnimatedWebpBuffer } from "./image-ops-D7Ua5lUp.mjs";
import { d as sendMethodNotAllowed, x as respondNotFound } from "./http-common-DJ7rKVvj.mjs";
import { t as buildAssistantMediaContentDisposition } from "./assistant-media-content-disposition-B3NSqIRL.mjs";
import { i as writeByteHeaders, r as resolveByteResponse } from "./http-byte-range-3Zwag20C.mjs";
import { n as resolveManagedImageThumbnail, t as encodeImageThumbnail } from "./managed-image-thumbnail-cache-zJv36Ylu.mjs";
import { t as ARTIFACT_DOWNLOAD_PATH } from "./artifact-download-CXaDlLGk.mjs";
import { i as getArtifactDownloadGrant, t as assertArtifactDownloadGrantCurrent } from "./artifact-download-grants-tzwDxk5o.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/artifact-downloads.ts
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
	const grant = client && ticket && extra === void 0 ? getArtifactDownloadGrant(client, ticket) : void 0;
	if (!client || !grant || !ticket) {
		respondNotFound(res);
		return true;
	}
	const assertCurrent = () => assertArtifactDownloadGrantCurrent(opts.clients, client, ticket, grant);
	let prepared;
	const thumbnail = grant.image && url.searchParams.get("variant") === "thumbnail";
	try {
		assertCurrent();
		prepared = await grant.read({
			expectedDigest: grant.digest,
			method: thumbnail ? "GET" : req.method,
			headers: thumbnail ? {} : {
				range: req.headers.range,
				"if-range": req.headers["if-range"],
				"if-none-match": req.headers["if-none-match"]
			}
		});
		assertCurrent();
		if (thumbnail && prepared?.body) {
			let bytes = prepared.body;
			const source = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const sourceType = await import("file-type").then(({ fileTypeFromBuffer }) => fileTypeFromBuffer(sliceMimeSniffBuffer(source))).catch(() => void 0);
			const still = sourceType?.mime === "image/png" && isStillPngBuffer(source) || sourceType?.mime === "image/jpeg" || sourceType?.mime === "image/webp" && !isAnimatedWebpBuffer(source);
			const cacheKey = createHash("sha256").update(bytes).digest("hex");
			const encoded = still ? await resolveManagedImageThumbnail(cacheKey, () => encodeImageThumbnail(bytes)).catch(() => void 0) : void 0;
			if (encoded && encoded.byteLength < bytes.byteLength) {
				bytes = new Uint8Array(encoded);
				prepared.artifact = {
					...prepared.artifact,
					mimeType: "image/png"
				};
			}
			const response = resolveByteResponse({
				file: { size: bytes.byteLength },
				method: req.method,
				request: req
			});
			prepared.response = response;
			prepared.body = req.method === "HEAD" || response.kind === "not-modified" || response.kind === "unsatisfiable" ? void 0 : response.kind === "partial" ? bytes.subarray(response.range.start, response.range.end + 1) : bytes;
			assertCurrent();
		}
	} catch {
		respondNotFound(res);
		return true;
	}
	if (!prepared) {
		respondNotFound(res);
		return true;
	}
	const { artifact, response, body } = prepared;
	const mime = normalizeMimeType(artifact.mimeType);
	const contentType = mime && /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mime) ? mime : "application/octet-stream";
	res.setHeader("content-type", contentType);
	res.setHeader("content-disposition", buildAssistantMediaContentDisposition(artifact.title));
	res.setHeader("content-security-policy", "default-src 'none'; sandbox");
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("referrer-policy", "no-referrer");
	res.setHeader("cache-control", "private, no-store");
	writeByteHeaders(res, response);
	res.end(body);
	return true;
}
//#endregion
export { handleArtifactDownloadHttpRequest };
