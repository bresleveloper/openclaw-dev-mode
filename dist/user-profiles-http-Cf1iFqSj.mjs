import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { g as readRegularFile } from "./fs-safe-BAPek8At.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { n as formatUserProfileAvatarEtag, r as getProfileAvatar, x as UserProfileNotFoundError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { i as getUserProfileListItem } from "./user-profiles-BA6bh7Le.mjs";
import { f as resizeToJpeg } from "./image-ops-CU4vxSlO.mjs";
import { a as parseControlUiUserAvatarPath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BJQtuB_7.mjs";
import { c as sendJson, h as watchClientDisconnect, l as sendMethodNotAllowed } from "./http-common-Ckbyca3h.mjs";
import { n as matchesHttpIfNoneMatch } from "./http-conditional-vOFTJV-M.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/infra/host-account-avatar.ts
const MAX_ACCOUNT_PHOTO_BYTES = 1048576;
let cachedAvatar;
async function readAccountAttribute(username, attribute) {
	try {
		const { stdout } = await runExec("/usr/bin/dscl", [
			".",
			"-read",
			`/Users/${username}`,
			attribute
		], {
			timeoutMs: 1e3,
			maxBuffer: MAX_ACCOUNT_PHOTO_BYTES * 3,
			logOutput: false
		});
		const prefix = `${attribute}:`;
		return stdout.startsWith(prefix) ? stdout.slice(prefix.length).trim() : null;
	} catch {
		return null;
	}
}
async function readHostAccountAvatar() {
	if (process.platform !== "darwin") return null;
	const { username } = os.userInfo();
	const photo = (await readAccountAttribute(username, "JPEGPhoto"))?.replace(/\s/gu, "");
	let buffer;
	if (photo) {
		if (photo.length > MAX_ACCOUNT_PHOTO_BYTES * 2 || photo.length % 2 !== 0 || /[^\da-f]/iu.test(photo)) return null;
		buffer = Buffer.from(photo, "hex");
	} else {
		const picture = await readAccountAttribute(username, "Picture");
		if (!picture || !path.isAbsolute(picture)) return null;
		({buffer} = await readRegularFile({
			filePath: await fs.realpath(picture),
			maxBytes: MAX_ACCOUNT_PHOTO_BYTES
		}));
	}
	const bytes = await resizeToJpeg({
		buffer,
		maxSide: 256,
		quality: 85
	});
	if (bytes.length === 0 || bytes.length > MAX_ACCOUNT_PHOTO_BYTES) return null;
	return {
		bytes,
		mime: "image/jpeg",
		sha256: createHash("sha256").update(bytes).digest("hex")
	};
}
/** Best-effort macOS host photo; callers bind it only to the Gateway owner. */
function resolveHostAccountAvatar() {
	cachedAvatar ??= readHostAccountAvatar().catch(() => null);
	return cachedAvatar;
}
//#endregion
//#region src/gateway/user-profiles-http.ts
const GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar";
const GRAVATAR_FETCH_TIMEOUT_MS = 5e3;
const GRAVATAR_TOTAL_TIMEOUT_MS = 6e3;
const GRAVATAR_CACHE_MAX_ENTRIES = 256;
const GRAVATAR_CACHE_MAX_BYTES = 16777216;
const GRAVATAR_HIT_TTL_MS = 864e5;
const GRAVATAR_MISS_TTL_MS = 9e5;
const MAX_GRAVATAR_BYTES = 1e6;
const MAX_GRAVATAR_EMAIL_LOOKUPS = 8;
const GRAVATAR_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
function resolveAvatarCorsOrigin(req, cfg) {
	const rawOrigin = typeof req.headers.origin === "string" ? req.headers.origin.trim() : "";
	if (!rawOrigin) return;
	let origin;
	try {
		const parsed = new URL(rawOrigin);
		if (parsed.origin !== rawOrigin || parsed.username || parsed.password) return;
		origin = parsed.origin;
	} catch {
		return;
	}
	return (cfg.gateway?.controlUi?.allowedOrigins ?? []).some((candidate) => candidate.trim() === "*" || candidate.trim() === origin) ? origin : void 0;
}
function setAvatarCorsHeaders(req, res, cfg) {
	if (!req.headers.origin) return true;
	const origin = resolveAvatarCorsOrigin(req, cfg);
	if (!origin) return false;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Vary", "Origin");
	return true;
}
const gravatarCache = /* @__PURE__ */ new Map();
const gravatarRequests = /* @__PURE__ */ new Map();
let gravatarCacheBytes = 0;
function deleteCachedGravatar(hash) {
	const cached = gravatarCache.get(hash);
	if (cached?.kind === "hit") gravatarCacheBytes -= cached.bytes.byteLength;
	gravatarCache.delete(hash);
}
function hashEmail(email) {
	return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
function getCachedGravatar(hash, nowMs) {
	const cached = gravatarCache.get(hash);
	if (!cached) return;
	if (cached.expiresAtMs <= nowMs) {
		deleteCachedGravatar(hash);
		return;
	}
	deleteCachedGravatar(hash);
	gravatarCache.set(hash, cached);
	if (cached.kind === "hit") gravatarCacheBytes += cached.bytes.byteLength;
	return cached.kind === "hit" ? {
		kind: "hit",
		bytes: cached.bytes,
		mime: cached.mime,
		etag: cached.etag
	} : { kind: "miss" };
}
function cacheGravatar(hash, result, nowMs) {
	const ttlMs = result.kind === "hit" ? GRAVATAR_HIT_TTL_MS : GRAVATAR_MISS_TTL_MS;
	deleteCachedGravatar(hash);
	const cached = {
		...result,
		expiresAtMs: nowMs + ttlMs
	};
	gravatarCache.set(hash, cached);
	if (cached.kind === "hit") gravatarCacheBytes += cached.bytes.byteLength;
	while (gravatarCache.size > GRAVATAR_CACHE_MAX_ENTRIES || gravatarCacheBytes > GRAVATAR_CACHE_MAX_BYTES) {
		const oldest = gravatarCache.keys().next().value;
		if (oldest === void 0) break;
		deleteCachedGravatar(oldest);
	}
}
function normalizeContentType(value) {
	return value?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}
async function readBoundedGravatarBody(body) {
	if (!body) return;
	const reader = body.getReader();
	const chunks = [];
	let totalBytes = 0;
	try {
		while (true) {
			const next = await reader.read();
			if (next.done) break;
			totalBytes += next.value.byteLength;
			if (totalBytes > MAX_GRAVATAR_BYTES) {
				await reader.cancel();
				return;
			}
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	if (totalBytes === 0) return;
	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}
async function cancelGravatarBody(body) {
	try {
		await body?.cancel();
	} catch {}
}
async function fetchGravatar(hash, fetchImpl) {
	try {
		const response = await fetchImpl(`${GRAVATAR_BASE_URL}/${hash}?s=256&d=404`, {
			headers: { Accept: "image/webp,image/png,image/jpeg,image/gif" },
			signal: AbortSignal.timeout(GRAVATAR_FETCH_TIMEOUT_MS)
		});
		if (response.status === 404) {
			await cancelGravatarBody(response.body);
			return { kind: "miss" };
		}
		if (!response.ok) {
			await cancelGravatarBody(response.body);
			return { kind: "error" };
		}
		const mime = normalizeContentType(response.headers.get("content-type"));
		const declaredLength = Number(response.headers.get("content-length"));
		if (!GRAVATAR_MIME_TYPES.has(mime) || Number.isFinite(declaredLength) && declaredLength > MAX_GRAVATAR_BYTES) {
			await cancelGravatarBody(response.body);
			return { kind: "error" };
		}
		const bytes = await readBoundedGravatarBody(response.body);
		if (!bytes) return { kind: "error" };
		return {
			kind: "hit",
			bytes,
			mime,
			etag: `"gravatar-${createHash("sha256").update(bytes).digest("hex")}"`
		};
	} catch {
		return { kind: "error" };
	}
}
async function resolveGravatar(hash, options) {
	const cached = getCachedGravatar(hash, options.nowMs());
	if (cached) return cached;
	return await getOrCreatePromise(gravatarRequests, hash, async () => {
		const result = await fetchGravatar(hash, options.fetchImpl);
		if (result.kind !== "error") cacheGravatar(hash, result, options.nowMs());
		return result;
	}, { evictOnSettled: true });
}
function sendAvatar(req, res, avatar, cacheControl) {
	if (matchesHttpIfNoneMatch(req.headers["if-none-match"], avatar.etag)) {
		res.writeHead(304, {
			ETag: avatar.etag,
			"Cache-Control": cacheControl
		});
		res.end();
		return;
	}
	res.writeHead(200, {
		"Content-Type": avatar.mime,
		"Content-Length": avatar.bytes.byteLength,
		"Cache-Control": cacheControl,
		ETag: avatar.etag
	});
	res.end(req.method === "HEAD" ? void 0 : avatar.bytes);
}
/** Serves a profile avatar to authenticated Control UI readers. */
async function handleUserProfileAvatarHttpRequest(req, res, pathname, opts) {
	const parsed = parseControlUiUserAvatarPath(pathname, opts.basePath ?? "");
	if (!parsed.matched) return false;
	const method = req.method;
	const cfg = opts.cfg ?? getRuntimeConfig();
	const corsAllowed = setAvatarCorsHeaders(req, res, cfg);
	if (method === "OPTIONS") {
		if (!corsAllowed) {
			sendJson(res, 403, {
				ok: false,
				error: { type: "origin_not_allowed" }
			});
			return true;
		}
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
		res.setHeader("Access-Control-Allow-Headers", "Authorization");
		res.setHeader("Access-Control-Max-Age", "600");
		res.writeHead(204);
		res.end();
		return true;
	}
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const authResult = await authorizeControlUiReadRequestOrReply({
		...opts,
		req,
		res,
		cfg,
		trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback,
		requiredOperatorMethod: "users.list"
	});
	if (!authResult) return true;
	authResult.assertCurrent();
	res.setHeader("Cache-Control", "no-store");
	const profileId = parsed.value;
	if (!profileId) {
		sendJson(res, 404, {
			ok: false,
			error: { type: "not_found" }
		});
		return true;
	}
	let uploadedAvatar;
	let profile;
	try {
		uploadedAvatar = getProfileAvatar(profileId);
		profile = uploadedAvatar ? void 0 : getUserProfileListItem(profileId);
	} catch (error) {
		if (error instanceof UserProfileNotFoundError) {
			sendJson(res, 404, {
				ok: false,
				error: { type: "not_found" }
			});
			return true;
		}
		sendJson(res, 500, {
			ok: false,
			error: { type: "profile_lookup_failed" }
		});
		return true;
	}
	const avatar = uploadedAvatar ?? (profileId === "gateway-owner" && profile?.id === profileId && !profile.mergedInto ? await resolveHostAccountAvatar() : null);
	authResult.assertCurrent();
	if (avatar) {
		sendAvatar(req, res, {
			bytes: avatar.bytes,
			mime: avatar.mime,
			etag: formatUserProfileAvatarEtag(avatar.sha256, avatar.mime)
		}, "private, max-age=0, must-revalidate");
		return true;
	}
	const hashes = profile?.emails.slice(0, MAX_GRAVATAR_EMAIL_LOOKUPS).map(hashEmail) ?? [];
	const clientAbort = new AbortController();
	const stopWatchingDisconnect = watchClientDisconnect(req, res, clientAbort);
	const waiterSignal = AbortSignal.any([clientAbort.signal, AbortSignal.timeout(GRAVATAR_TOTAL_TIMEOUT_MS)]);
	let transientFailure = false;
	try {
		for (const hash of hashes) {
			waiterSignal.throwIfAborted();
			const result = await racePromiseWithAbortSignal(resolveGravatar(hash, {
				fetchImpl: opts.fetchImpl ?? globalThis.fetch,
				nowMs: opts.nowMs ?? Date.now
			}), waiterSignal);
			waiterSignal.throwIfAborted();
			authResult.assertCurrent();
			if (result.kind === "hit") {
				sendAvatar(req, res, result, "private, max-age=0, must-revalidate");
				return true;
			}
			transientFailure ||= result.kind === "error";
		}
	} catch (error) {
		if (!waiterSignal.aborted) throw error;
		transientFailure = true;
	} finally {
		stopWatchingDisconnect();
	}
	if (clientAbort.signal.aborted) return true;
	authResult.assertCurrent();
	sendJson(res, transientFailure ? 502 : 404, {
		ok: false,
		error: { type: transientFailure ? "avatar_upstream_unavailable" : "not_found" }
	});
	return true;
}
//#endregion
export { handleUserProfileAvatarHttpRequest };
