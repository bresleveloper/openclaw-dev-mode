import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { u as readMediaBuffer } from "./store-BrX2xbJz.mjs";
import { o as resolveInboundMediaReference } from "./media-reference-C0dWWfb0.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-DnAyBVQj.mjs";
import { l as sendMethodNotAllowed, y as respondNotFound } from "./http-common-oJ4rIoMl.mjs";
import "./http-utils-B5XpnbIs.mjs";
import { o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-DQqwbtvS.mjs";
//#region src/gateway/channel-avatar-http.ts
const CHANNEL_AVATAR_CACHE_MAX_ENTRIES = 128;
const channelAvatarCache = /* @__PURE__ */ new Map();
const getSessionStoreModule = createLazyRuntimeModule(() => import("./session-utils-store-DsKFp-bu.mjs"));
function touchChannelAvatarCache(sessionKey, reference) {
	const cached = channelAvatarCache.get(sessionKey);
	if (!cached || cached.reference !== reference) return;
	channelAvatarCache.delete(sessionKey);
	channelAvatarCache.set(sessionKey, cached);
	return cached.image;
}
async function loadChannelAvatar(sessionKey, reference) {
	const cached = touchChannelAvatarCache(sessionKey, reference);
	if (cached) return cached;
	const resolved = await resolveInboundMediaReference(reference);
	if (!resolved) return;
	const stored = await readMediaBuffer(resolved.id, "inbound", HTTP_IMAGE_MAX_BYTES);
	const image = await resolveHttpImageRepresentation(resolved.id, stored.buffer);
	if (!image) return;
	channelAvatarCache.delete(sessionKey);
	channelAvatarCache.set(sessionKey, {
		reference,
		image
	});
	pruneMapToMaxSize(channelAvatarCache, CHANNEL_AVATAR_CACHE_MAX_ENTRIES);
	return image;
}
/** Serves the current channel-avatar snapshot for an owner-visible session. */
async function handleChannelAvatarHttpRequest(req, res, opts) {
	const pathname = req.url ? new URL(req.url, "http://localhost").pathname : void 0;
	const parsed = parseControlUiResourcePath("channelAvatar", pathname, opts.basePath);
	if (!parsed.matched) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestAuth = await authorizeControlUiSessionOwnerReadRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	if (!parsed.value) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let reference;
	try {
		const { entry } = (await getSessionStoreModule()).loadGatewaySessionEntryReadOnly(parsed.value, { clone: false });
		reference = sessionDeliveryOrigin(entry)?.avatar;
	} catch {}
	requestAuth.assertCurrent();
	if (!reference) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	let image;
	try {
		image = await loadChannelAvatar(parsed.value, reference);
	} catch {}
	requestAuth.assertCurrent();
	if (!image) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image,
		filename: "channel-avatar"
	});
	return true;
}
//#endregion
export { handleChannelAvatarHttpRequest };
