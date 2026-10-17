import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { u as readMediaBuffer } from "./store-A0dMc8iV.mjs";
import "./media-reference-BIOMSmeS.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { l as readManagedOutgoingImageThumbnail, s as parseManagedOutgoingRoute } from "./managed-image-attachments-DbHPJZAc.mjs";
import { n as MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX } from "./managed-outgoing-artifact-id-Ba11Ib46.mjs";
import { n as decodeTuiImageData, r as prepareTuiImage, t as TUI_IMAGE_MAX_BYTES } from "./tui-image-data-B0I8wO40.mjs";
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
