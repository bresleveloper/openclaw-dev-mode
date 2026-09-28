import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { r as applyGatewayWebSocketTlsPin } from "./websocket-transport-BVr0oSpL.mjs";
import { a as parseInboundMediaUri } from "./media-reference-C0dWWfb0.mjs";
import { o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import { n as MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX, u as parseManagedOutgoingRoute } from "./managed-image-attachments-Ij6S9piG.mjs";
import { n as decodeTuiImageData, r as prepareTuiImage } from "./tui-image-data-CP1vGIbo.mjs";
import http from "node:http";
import https from "node:https";
//#region src/tui/gateway-image-loader.ts
async function readGatewayImageResponse(response) {
	try {
		if (response.statusCode !== 200) throw new Error(`Image preview request failed (${response.statusCode ?? "unknown"})`);
		if (Number(response.headers["content-length"]) > 12582912) throw new Error("Image exceeds the preview byte limit");
		const chunks = [];
		let received = 0;
		for await (const chunk of response) {
			if (!Buffer.isBuffer(chunk)) throw new Error("Invalid image response");
			received += chunk.byteLength;
			if (received > 12582912) throw new Error("Image exceeds the preview byte limit");
			chunks.push(chunk);
		}
		return Buffer.concat(chunks, received);
	} finally {
		response.destroy();
	}
}
async function requestGatewayImage(connection, route, credentials, signal, mediaBasePath) {
	const gateway = new URL(connection.url);
	if (gateway.protocol !== "ws:" && gateway.protocol !== "wss:") throw new Error("Invalid Gateway image transport");
	const target = new URL(gateway);
	target.protocol = gateway.protocol === "wss:" ? "https:" : "http:";
	const gatewayBasePath = normalizeControlUiBasePath(gateway.pathname);
	target.pathname = `${mediaBasePath && gatewayBasePath.endsWith(mediaBasePath) ? gatewayBasePath.slice(0, -mediaBasePath.length) : gatewayBasePath}${route.pathname}`;
	target.search = route.search;
	target.hash = "";
	target.username = "";
	target.password = "";
	const fingerprint = normalizeTlsFingerprint(connection.tlsFingerprint);
	if (connection.tlsFingerprint && (!fingerprint || target.protocol !== "https:")) throw new Error("Invalid Gateway image TLS fingerprint");
	for (const [index, token] of (credentials.length ? credentials : [""]).entries()) {
		signal.throwIfAborted();
		const options = { headers: {
			...connection.edgeAuthHeaders,
			accept: "image/png,image/jpeg,image/gif,image/webp",
			...token ? { authorization: `Bearer ${token}` } : {}
		} };
		if (fingerprint) applyGatewayWebSocketTlsPin(options, fingerprint);
		const request = (target.protocol === "https:" ? https : http).request(target, {
			method: "GET",
			headers: options.headers,
			signal,
			agent: false,
			...fingerprint ? { rejectUnauthorized: options.rejectUnauthorized } : {}
		});
		const responsePromise = new Promise((resolve, reject) => {
			request.once("response", resolve);
			request.once("error", reject);
		});
		if (options.finishRequest) options.finishRequest(request);
		else request.end();
		const response = await responsePromise;
		if (response.statusCode === 401 && index + 1 < credentials.length) {
			response.destroy();
			continue;
		}
		return await readGatewayImageResponse(response);
	}
	throw new Error("Image preview authentication failed");
}
async function loadGatewayImage(params) {
	const { request } = params;
	const signal = AbortSignal.any([request.signal, AbortSignal.timeout(3e4)]);
	signal.throwIfAborted();
	const inline = decodeTuiImageData(request.source);
	if (inline) return await prepareTuiImage(inline, signal);
	const inbound = parseInboundMediaUri(request.source);
	let route;
	let mediaBasePath = "";
	let credentials = params.credentials;
	if (inbound) {
		mediaBasePath = normalizeControlUiBasePath(await params.readMediaBasePath(signal));
		route = new URL(resolveAssistantMediaRoutePath(mediaBasePath), "http://localhost");
		route.searchParams.set("source", inbound.normalizedSource);
		route.searchParams.set("sessionKey", request.sessionKey);
		if (request.agentId) route.searchParams.set("agentId", request.agentId);
	} else {
		const managed = request.source.startsWith("/api/chat/media/outgoing/") ? parseManagedOutgoingRoute(request.source) : null;
		if (!managed) throw new Error("Image source is not managed by this Gateway");
		const artifactId = `${MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX}${managed.attachmentId}`;
		if (request.artifactId && request.artifactId !== artifactId) throw new Error("Image artifact does not match its source");
		const result = await params.downloadArtifact(artifactId, signal);
		const download = result.url;
		const downloadedRoute = download ? parseManagedOutgoingRoute(download) : null;
		if (!download?.startsWith("/api/chat/media/outgoing/") || result.artifact.id !== artifactId || result.artifact.type !== "image" || downloadedRoute?.attachmentId !== managed.attachmentId || downloadedRoute.sessionKey !== managed.sessionKey || result.artifact.sessionKey !== downloadedRoute.sessionKey) throw new Error("Image artifact is unavailable");
		route = new URL(download, "http://localhost");
		route.pathname = route.pathname.replace(/\/full$/, "/thumbnail");
		credentials = [];
	}
	const buffer = await requestGatewayImage(params.connection, route, credentials, signal, mediaBasePath);
	return await prepareTuiImage(buffer, signal);
}
//#endregion
export { loadGatewayImage };
