import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as consumeResponseBytes } from "./src-CdRlGRnW.mjs";
import { g as readRegularFile } from "./fs-safe-BUXBSN-4.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { a as resolveControlUiAllowedOrigins } from "./gateway-control-ui-origins-WhL6Lrby.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { r as formatUserProfileAvatarEtag, w as UserProfileNotFoundError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { u as createProfileAvatarReader } from "./user-profiles-DYQbtiqy.mjs";
import { p as resizeToJpeg } from "./image-ops-D7Ua5lUp.mjs";
import { a as parseControlUiUserAvatarPath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { _ as watchClientDisconnect, d as sendMethodNotAllowed, u as sendJson } from "./http-common-D3e5uEH1.mjs";
import { n as matchesHttpIfNoneMatch } from "./http-conditional-DaagcxHO.mjs";
import { t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BhzlHO9u.mjs";
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
	return cachedAvatar ??= readHostAccountAvatar().catch(() => null);
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
	return resolveControlUiAllowedOrigins(cfg).some((candidate) => candidate.trim() === "*" || candidate.trim() === origin) ? origin : void 0;
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
const gravatarCache = new LruCache(GRAVATAR_CACHE_MAX_ENTRIES, {
	maxBytes: GRAVATAR_CACHE_MAX_BYTES,
	sizeOf: (result) => result.kind === "hit" ? result.bytes.byteLength : 0
});
const gravatarRequests = /* @__PURE__ */ new Map();
function hashEmail(email) {
	return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
function getCachedGravatar(hash, nowMs) {
	const cached = gravatarCache.get(hash);
	if (!cached) return;
	if (cached.expiresAtMs <= nowMs) {
		gravatarCache.delete(hash);
		return;
	}
	return cached.kind === "hit" ? {
		kind: "hit",
		bytes: cached.bytes,
		mime: cached.mime,
		etag: cached.etag
	} : { kind: "miss" };
}
function cacheGravatar(hash, result, nowMs) {
	const ttlMs = result.kind === "hit" ? GRAVATAR_HIT_TTL_MS : GRAVATAR_MISS_TTL_MS;
	gravatarCache.set(hash, {
		...result,
		expiresAtMs: nowMs + ttlMs
	});
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
		const { size, truncated } = await consumeResponseBytes({
			maxBytes: MAX_GRAVATAR_BYTES,
			read: () => reader.read(),
			onChunk: (chunk) => chunks.push(chunk),
			onLimit: () => reader.cancel()
		});
		if (truncated) return;
		totalBytes = size;
	} finally {
		reader.releaseLock();
	}
	if (totalBytes === 0) return;
	const bytes = Buffer.concat(chunks, totalBytes);
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
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
function sendAvatar(req, res, avatar) {
	const cacheControl = "private, max-age=0, must-revalidate";
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
		"Content-Length": avatar.byteLength,
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
	let emails;
	try {
		const reader = createProfileAvatarReader(profileId);
		for (;;) {
			const prepared = await reader.inspect();
			authResult.assertCurrent();
			const profile = prepared.profile;
			if (!profile) throw new UserProfileNotFoundError(profileId);
			const uploaded = prepared.avatar;
			if (uploaded) {
				const etag = formatUserProfileAvatarEtag(uploaded.sha256, uploaded.mime);
				const needsBytes = method !== "HEAD" && !matchesHttpIfNoneMatch(req.headers["if-none-match"], etag);
				const bytes = needsBytes ? await prepared.loadBytes() : void 0;
				authResult.assertCurrent();
				if (!prepared.isCurrent() || needsBytes && !bytes) continue;
				sendAvatar(req, res, {
					...uploaded,
					bytes: bytes?.bytes,
					etag
				});
				return true;
			}
			const hostAvatar = profileId === "gateway-owner" && profile.id === profileId && !profile.mergedInto ? await resolveHostAccountAvatar() : null;
			authResult.assertCurrent();
			if (!prepared.isCurrent()) continue;
			if (hostAvatar) {
				sendAvatar(req, res, {
					...hostAvatar,
					byteLength: hostAvatar.bytes.byteLength,
					etag: formatUserProfileAvatarEtag(hostAvatar.sha256, hostAvatar.mime)
				});
				return true;
			}
			emails = prepared.emails;
			break;
		}
	} catch (error) {
		authResult.assertCurrent();
		if (error instanceof UserProfileNotFoundError) {
			sendJson(res, 404, {
				ok: false,
				error: { type: "not_found" }
			});
			return true;
		}
		if (error instanceof WorkerTaskError && (error.code === "overloaded" || error.code === "timeout")) {
			res.setHeader("Retry-After", "1");
			sendJson(res, 503, {
				ok: false,
				error: { type: "avatar_temporarily_unavailable" }
			});
			return true;
		}
		sendJson(res, 500, {
			ok: false,
			error: { type: "profile_lookup_failed" }
		});
		return true;
	}
	const hashes = emails.slice(0, MAX_GRAVATAR_EMAIL_LOOKUPS).map(hashEmail);
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
				sendAvatar(req, res, {
					...result,
					byteLength: result.bytes.byteLength
				});
				return true;
			}
			if (result.kind === "error") {
				transientFailure = true;
				break;
			}
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
