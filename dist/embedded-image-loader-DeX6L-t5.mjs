import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { u as readMediaBuffer } from "./store-BrX2xbJz.mjs";
import { a as parseInboundMediaUri } from "./media-reference-C0dWWfb0.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { f as readManagedOutgoingImageThumbnail, n as MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX, u as parseManagedOutgoingRoute } from "./managed-image-attachments-Ij6S9piG.mjs";
import { n as decodeTuiImageData, r as prepareTuiImage, t as TUI_IMAGE_MAX_BYTES } from "./tui-image-data-CP1vGIbo.mjs";
//#region src/tui/embedded-image-loader.ts
async function loadEmbeddedImage(request) {
	const { signal } = request;
	signal.throwIfAborted();
	const inline = decodeTuiImageData(request.source);
	if (inline) return await prepareTuiImage(inline, signal);
	const owner = resolveRequestedSessionAgentId(getRuntimeConfig(), request.sessionKey, request.agentId);
	if (!owner.ok) throw new Error(owner.error.message);
	const { canonicalKey, agentId, entry } = loadGatewaySessionEntryReadOnly(request.sessionKey, { agentId: owner.agentId });
	if (!entry?.sessionId) throw new Error("Image session is unavailable");
	const inbound = parseInboundMediaUri(request.source);
	if (inbound) {
		const { buffer } = await readMediaBuffer(inbound.id, "inbound", TUI_IMAGE_MAX_BYTES);
		return await prepareTuiImage(buffer, signal);
	}
	const managed = request.source.startsWith("/api/chat/media/outgoing/") ? parseManagedOutgoingRoute(request.source) : null;
	if (!managed || managed.sessionKey !== canonicalKey) throw new Error("Image source is not managed by this session");
	const artifactId = `${MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX}${managed.attachmentId}`;
	if (request.artifactId && request.artifactId !== artifactId) throw new Error("Image artifact does not match its source");
	const buffer = await readManagedOutgoingImageThumbnail({
		sessionKey: canonicalKey,
		agentId,
		artifactId,
		maxBytes: TUI_IMAGE_MAX_BYTES,
		signal
	});
	if (!buffer) throw new Error("Image artifact is unavailable");
	return await prepareTuiImage(buffer, signal);
}
//#endregion
export { loadEmbeddedImage };
