import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CSDERtm3.mjs";
import "./io-DIF-KW3P.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { n as matchesChannelAvatarSender } from "./channel-avatar-reference-BD2jqCs9.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { d as sendMethodNotAllowed } from "./http-common-DyL3AdjD.mjs";
import { u as readMediaBuffer } from "./store-BOkrav0N.mjs";
import { r as resolveInboundMediaReference } from "./media-reference-Dlq4zAi4.mjs";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import "./http-utils-C7PagBsR.mjs";
import { o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-W_WEsC5b.mjs";
//#region src/gateway/channel-avatar-http.ts
const channelAvatarCache = new LruCache(128);
const channelAvatarLoads = /* @__PURE__ */ new Map();
const getSessionStoreModule = createLazyRuntimeModule(() => import("./session-utils-store-worker-CmMErbaH.mjs"));
async function loadChannelAvatar(sessionKey, reference) {
	const cached = channelAvatarCache.get(sessionKey);
	if (cached?.reference === reference) return cached.image;
	const loadKey = JSON.stringify([sessionKey, reference]);
	let pending = channelAvatarLoads.get(loadKey);
	if (!pending) {
		pending = (async () => {
			const resolved = await resolveInboundMediaReference(reference);
			if (!resolved) return;
			const stored = await readMediaBuffer(resolved.id, "inbound", HTTP_IMAGE_MAX_BYTES);
			const image = await resolveHttpImageRepresentation(resolved.id, stored.buffer);
			if (image) channelAvatarCache.set(sessionKey, {
				reference,
				image
			});
			return image;
		})().finally(() => {
			channelAvatarLoads.delete(loadKey);
		});
		channelAvatarLoads.set(loadKey, pending);
	}
	return pending;
}
/** Serves the current channel-avatar snapshot for an owner-visible session. */
async function handleChannelAvatarHttpRequest(req, res, opts) {
	const requestUrl = new URL(req.url ?? "/", "http://localhost");
	const pathname = requestUrl.pathname;
	const parsed = parseControlUiResourcePath("channelAvatar", pathname, opts.basePath);
	if (!parsed.matched) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestedKey = parsed.value;
	const sessionKey = requestedKey ? normalizeSessionKeyPreservingOpaquePeerIds(requestedKey) : void 0;
	let selected;
	try {
		selected = ok(sessionKey ? captureSessionEntryMetadataRead({ sessionKey }, () => {}) : void 0);
	} catch (error) {
		selected = err(error);
	}
	const requestAuth = await authorizeControlUiSessionOwnerReadRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	if (!selected.ok) throw selected.error;
	const source = selected.value;
	if (!requestedKey || !sessionKey) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	const serve = async (reference, assertCurrent) => {
		assertCurrent();
		if (!reference) {
			res.setHeader("cache-control", "no-store");
			respondNotFound(res);
			return true;
		}
		let image;
		try {
			image = await loadChannelAvatar(sessionKey, reference);
		} catch {}
		assertCurrent();
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
	};
	if (source) {
		const entry = source.readCurrent();
		const origin = sessionDeliveryOrigin(entry);
		const reference = origin?.avatar;
		const assertCurrent = () => {
			requestAuth.assertCurrent();
			const current = source.readCurrent();
			if (current?.sessionId !== entry?.sessionId || current?.lifecycleRevision !== entry?.lifecycleRevision || sessionDeliveryOrigin(current)?.avatar !== reference) throw new Error("Channel avatar session authority changed");
		};
		return serve(matchesChannelAvatarSender(requestUrl.searchParams, origin) ? reference : void 0, assertCurrent);
	}
	let reference;
	try {
		const { entry } = await (await getSessionStoreModule()).loadGatewaySessionEntryReadOnlyInWorker({
			cfg: readRuntimeConfig(),
			key: requestedKey,
			assertActive: requestAuth.assertCurrent
		});
		const origin = sessionDeliveryOrigin(entry);
		reference = matchesChannelAvatarSender(requestUrl.searchParams, origin) ? origin?.avatar : void 0;
	} catch {}
	return serve(reference, requestAuth.assertCurrent);
}
//#endregion
export { handleChannelAvatarHttpRequest };
