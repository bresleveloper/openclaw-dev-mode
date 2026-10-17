import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { u as readMediaBuffer } from "./store-A0dMc8iV.mjs";
import { r as resolveInboundMediaReference } from "./media-reference-BIOMSmeS.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { d as sendMethodNotAllowed, x as respondNotFound } from "./http-common-D3e5uEH1.mjs";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-BhzlHO9u.mjs";
import "./http-utils-B-HtYJ8A.mjs";
import { o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-CJ3oDAly.mjs";
//#region src/gateway/channel-avatar-http.ts
const channelAvatarCache = new LruCache(128);
const channelAvatarLoads = /* @__PURE__ */ new Map();
const getSessionStoreModule = createLazyRuntimeModule(() => import("./session-utils-store-Ch8DayhA.mjs"));
async function loadChannelAvatar(sessionKey, reference) {
	let loads = channelAvatarLoads.get(sessionKey);
	if (loads) loads.reference = reference;
	const cached = channelAvatarCache.peek(sessionKey);
	if (cached?.reference === reference) {
		channelAvatarCache.get(sessionKey);
		return cached.image;
	}
	if (!loads) {
		loads = {
			reference,
			pending: /* @__PURE__ */ new Map()
		};
		channelAvatarLoads.set(sessionKey, loads);
	}
	let pending = loads.pending.get(reference);
	if (!pending) {
		const sessionLoads = loads;
		pending = (async () => {
			const resolved = await resolveInboundMediaReference(reference);
			if (!resolved) return;
			const stored = await readMediaBuffer(resolved.id, "inbound", HTTP_IMAGE_MAX_BYTES);
			const image = await resolveHttpImageRepresentation(resolved.id, stored.buffer);
			if (image && sessionLoads.reference === reference) channelAvatarCache.set(sessionKey, {
				reference,
				image
			});
			return image;
		})().finally(() => {
			sessionLoads.pending.delete(reference);
			if (sessionLoads.pending.size === 0) channelAvatarLoads.delete(sessionKey);
		});
		loads.pending.set(reference, pending);
	}
	return pending;
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
