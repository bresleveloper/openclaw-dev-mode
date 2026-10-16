import { s as resolveNostrAccount } from "./.setup/setup-surface-b-YWJSGV.mjs";
import { getPluginRuntimeGatewayRequestScope } from "./runtime-api.js";
import { n as NostrProfileSchema } from "./.setup/config-schema-HuEK1L2K.mjs";
import { a as getNostrRuntime, i as contentToProfile, n as nostrPlugin, o as setNostrRuntime, r as publishNostrProfile, t as getNostrProfileState } from "./.setup/channel-BaBU_Q15.mjs";
import { getPluginRuntimeGatewayRequestScope as getPluginRuntimeGatewayRequestScope$1 } from "openclaw/plugin-sdk/plugin-runtime";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { SimplePool } from "nostr-tools";
import { createFixedWindowRateLimiter } from "openclaw/plugin-sdk/webhook-ingress";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { isBlockedHostnameOrIp, isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
import { readJsonBodyWithLimit, requestBodyErrorToText } from "openclaw/plugin-sdk/webhook-request-guards";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/nostr/src/nostr-profile-url-safety.ts
function normalizeNostrProfileUrlForRuntime(urlStr) {
	return urlStr.replace(/^([a-z][a-z\d+.-]*:\/\/\[[\da-f:]*:)(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})(\].*)$/iu, (original, prefix, a, b, c, d, suffix) => {
		const octets = [
			a,
			b,
			c,
			d
		].map(Number);
		if (octets.some((octet) => !Number.isInteger(octet) || octet > 255)) return original;
		const high = (octets[0] ?? 0) << 8 | (octets[1] ?? 0);
		const low = (octets[2] ?? 0) << 8 | (octets[3] ?? 0);
		return `${prefix}${high.toString(16)}:${low.toString(16)}${suffix}`;
	});
}
function validateUrlSafety(urlStr) {
	try {
		const url = new URL(normalizeNostrProfileUrlForRuntime(urlStr));
		if (url.protocol !== "https:") return {
			ok: false,
			error: "URL must use https:// protocol"
		};
		const hostname = url.hostname.trim().toLowerCase();
		if (isBlockedHostnameOrIp(hostname)) return {
			ok: false,
			error: "URL must not point to private/internal addresses"
		};
		return { ok: true };
	} catch {
		return {
			ok: false,
			error: "Invalid URL format"
		};
	}
}
//#endregion
//#region extensions/nostr/src/nostr-profile-import.ts
const DEFAULT_TIMEOUT_MS = 5e3;
function sanitizeProfileUrls(profile) {
	const result = { ...profile };
	for (const field of [
		"picture",
		"banner",
		"website"
	]) {
		const value = result[field];
		if (value && typeof value === "string") {
			if (!validateUrlSafety(value).ok) delete result[field];
		}
	}
	return result;
}
/** Import the latest verified kind:0 profile across the configured relays. */
async function importProfileFromRelays(opts) {
	const { pubkey, relays } = opts;
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, DEFAULT_TIMEOUT_MS);
	if (!pubkey || !/^[0-9a-fA-F]{64}$/.test(pubkey)) return {
		ok: false,
		error: "Invalid pubkey format (must be 64 hex characters)",
		relaysQueried: []
	};
	if (relays.length === 0) return {
		ok: false,
		error: "No relays configured",
		relaysQueried: []
	};
	const pool = new SimplePool();
	const relaysQueried = [...relays];
	const subscriptions = [];
	try {
		const events = [];
		await raceWithTimeout(() => Promise.all(relays.map((relay) => new Promise((resolve) => {
			const subscription = pool.subscribeMany([relay], {
				kinds: [0],
				authors: [pubkey],
				limit: 1
			}, {
				onevent(event) {
					events.push({
						event,
						relay
					});
				},
				oneose() {
					resolve();
				},
				onclose() {
					resolve();
				}
			});
			subscriptions.push(subscription);
		}))), timeoutMs, () => void 0, { ref: false });
		if (events.length === 0) return {
			ok: false,
			error: "No profile found on any relay",
			relaysQueried
		};
		const bestEvent = events.reduce((current, candidate) => {
			const candidateIsNewer = candidate.event.created_at > current.event.created_at;
			const candidateWinsTie = candidate.event.created_at === current.event.created_at && candidate.event.id < current.event.id;
			return candidateIsNewer || candidateWinsTie ? candidate : current;
		});
		let parsedContent;
		try {
			parsedContent = JSON.parse(bestEvent.event.content);
		} catch {
			return {
				ok: false,
				error: "Profile event has invalid JSON content",
				relaysQueried,
				sourceRelay: bestEvent.relay
			};
		}
		if (typeof parsedContent !== "object" || parsedContent === null || Array.isArray(parsedContent)) return {
			ok: false,
			error: "Profile event content must be a JSON object",
			relaysQueried,
			sourceRelay: bestEvent.relay
		};
		const sanitizedProfile = sanitizeProfileUrls(contentToProfile(parsedContent));
		const validatedProfile = NostrProfileSchema.safeParse(sanitizedProfile);
		if (!validatedProfile.success) return {
			ok: false,
			error: "Profile event content has invalid fields",
			relaysQueried,
			sourceRelay: bestEvent.relay
		};
		return {
			ok: true,
			profile: validatedProfile.data,
			event: {
				id: bestEvent.event.id,
				pubkey: bestEvent.event.pubkey,
				created_at: bestEvent.event.created_at
			},
			relaysQueried,
			sourceRelay: bestEvent.relay
		};
	} finally {
		for (const subscription of subscriptions) subscription.close();
		pool.close(relays);
	}
}
/** Preserve local customizations while filling missing fields from the imported profile. */
function mergeProfiles(local, imported) {
	if (!imported) return local ?? {};
	if (!local) return imported;
	return {
		name: local.name ?? imported.name,
		displayName: local.displayName ?? imported.displayName,
		about: local.about ?? imported.about,
		picture: local.picture ?? imported.picture,
		banner: local.banner ?? imported.banner,
		website: local.website ?? imported.website,
		nip05: local.nip05 ?? imported.nip05,
		lud16: local.lud16 ?? imported.lud16
	};
}
//#endregion
//#region extensions/nostr/src/nostr-profile-http.ts
const profileRateLimiter = createFixedWindowRateLimiter({
	windowMs: 6e4,
	maxRequests: 5,
	maxTrackedKeys: 2048
});
const publishLocks = new KeyedAsyncQueue();
const nip05FormatSchema = z.string().regex(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid NIP-05 format (user@domain.com)").optional();
const lud16FormatSchema = z.string().regex(/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid Lightning address format").optional();
const ProfileUpdateSchema = NostrProfileSchema.extend({
	nip05: nip05FormatSchema,
	lud16: lud16FormatSchema
});
const PROFILE_MUTATION_SCOPE = "operator.admin";
const PROFILE_URL_FIELDS = [
	"picture",
	"banner",
	"website"
];
function normalizeProfileUpdateUrlInputs(value) {
	if (!isRecord(value)) return value;
	let normalized;
	for (const field of PROFILE_URL_FIELDS) {
		const input = value[field];
		if (typeof input !== "string") continue;
		const next = normalizeNostrProfileUrlForRuntime(input);
		if (next !== input) {
			normalized ??= { ...value };
			normalized[field] = next;
		}
	}
	return normalized ?? value;
}
function restoreProfileUpdateUrlInputs(profile, value) {
	if (!isRecord(value)) return profile;
	return {
		...profile,
		...typeof value.picture === "string" ? { picture: value.picture } : {},
		...typeof value.banner === "string" ? { banner: value.banner } : {},
		...typeof value.website === "string" ? { website: value.website } : {}
	};
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(body));
}
async function readJsonBody(req, maxBytes = 65536, timeoutMs = 3e4) {
	const result = await readJsonBodyWithLimit(req, {
		maxBytes,
		timeoutMs,
		emptyObjectOnEmpty: true
	});
	if (result.ok) return result.value;
	if (result.code === "PAYLOAD_TOO_LARGE") throw new Error("Request body too large");
	if (result.code === "REQUEST_BODY_TIMEOUT" || result.code === "CONNECTION_CLOSED") throw new Error(requestBodyErrorToText(result.code));
	throw new Error(result.code === "INVALID_JSON" ? "Invalid JSON" : result.error);
}
function parseAccountIdFromPath(pathname) {
	return pathname.match(/^\/api\/channels\/nostr\/([^/]+)\/profile/)?.[1] ?? null;
}
function isLoopbackRemoteAddress(remoteAddress) {
	if (!remoteAddress) return false;
	const ipLower = normalizeLowercaseStringOrEmpty(remoteAddress).replace(/^\[|\]$/g, "");
	if (ipLower === "::1") return true;
	if (ipLower === "127.0.0.1" || ipLower.startsWith("127.")) return true;
	const v4Mapped = ipLower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
	if (v4Mapped) return isLoopbackRemoteAddress(v4Mapped[1]);
	return false;
}
function isLoopbackOriginLike(value) {
	try {
		const url = new URL(value);
		return isLoopbackHost(url.hostname);
	} catch {
		return false;
	}
}
function firstHeaderValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function normalizeIpCandidate(raw) {
	const unquoted = raw.trim().replace(/^"|"$/g, "");
	const bracketedWithOptionalPort = unquoted.match(/^\[([^[\]]+)\](?::\d+)?$/);
	if (bracketedWithOptionalPort) return bracketedWithOptionalPort[1] ?? "";
	const ipv4WithPort = unquoted.match(/^(\d+\.\d+\.\d+\.\d+):\d+$/);
	if (ipv4WithPort) return ipv4WithPort[1] ?? "";
	return unquoted;
}
function hasNonLoopbackForwardedClient(req) {
	const forwardedFor = firstHeaderValue(req.headers["x-forwarded-for"]);
	if (forwardedFor) for (const hop of forwardedFor.split(",")) {
		const candidate = normalizeIpCandidate(hop);
		if (!candidate) continue;
		if (!isLoopbackRemoteAddress(candidate)) return true;
	}
	const realIp = firstHeaderValue(req.headers["x-real-ip"]);
	if (realIp) {
		const candidate = normalizeIpCandidate(realIp);
		if (candidate && !isLoopbackRemoteAddress(candidate)) return true;
	}
	return false;
}
function resolveLoopbackMutationRejection(req) {
	const remoteAddress = req.socket.remoteAddress;
	if (!isLoopbackRemoteAddress(remoteAddress)) return `Rejected mutation from non-loopback remoteAddress=${String(remoteAddress)}`;
	if (hasNonLoopbackForwardedClient(req)) return "Rejected mutation with non-loopback forwarded client headers";
	if (normalizeOptionalLowercaseString(firstHeaderValue(req.headers["sec-fetch-site"])) === "cross-site") return "Rejected mutation with cross-site sec-fetch-site header";
	const origin = firstHeaderValue(req.headers.origin);
	if (typeof origin === "string" && !isLoopbackOriginLike(origin)) return `Rejected mutation with non-loopback origin=${origin}`;
	const referer = firstHeaderValue(req.headers.referer ?? req.headers.referrer);
	if (typeof referer === "string" && !isLoopbackOriginLike(referer)) return `Rejected mutation with non-loopback referer=${referer}`;
}
function enforceGatewayMutationScope(ctx, accountId, res) {
	const runtimeScopes = getPluginRuntimeGatewayRequestScope$1()?.client?.connect?.scopes;
	if ((Array.isArray(runtimeScopes) ? runtimeScopes : []).includes(PROFILE_MUTATION_SCOPE)) return true;
	ctx.log?.warn?.(`[${accountId}] Rejected profile mutation missing ${PROFILE_MUTATION_SCOPE}`);
	sendJson(res, 403, {
		ok: false,
		error: `missing scope: ${PROFILE_MUTATION_SCOPE}`
	});
	return false;
}
function createNostrProfileHttpHandler(ctx) {
	return async (req, res) => {
		const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
		if (!url.pathname.startsWith("/api/channels/nostr/")) return false;
		const accountId = parseAccountIdFromPath(url.pathname);
		if (!accountId) return false;
		const isImport = url.pathname.endsWith("/profile/import");
		if (!(url.pathname.endsWith("/profile") || isImport)) return false;
		try {
			if (req.method === "GET" && !isImport) return await handleGetProfile(accountId, ctx, res);
			if (req.method === "PUT" && !isImport || req.method === "POST" && isImport) {
				if (!enforceGatewayMutationScope(ctx, accountId, res)) return true;
				const rejection = resolveLoopbackMutationRejection(req);
				if (rejection) {
					ctx.log?.warn?.(rejection);
					sendJson(res, 403, {
						ok: false,
						error: "Forbidden"
					});
					return true;
				}
				return await (isImport ? handleImportProfile : handleUpdateProfile)(accountId, ctx, req, res);
			}
			sendJson(res, 405, {
				ok: false,
				error: "Method not allowed"
			});
			return true;
		} catch (err) {
			if (res.writableEnded) return true;
			ctx.log?.error(`Profile HTTP error: ${String(err)}`);
			sendJson(res, 500, {
				ok: false,
				error: "Internal server error"
			});
			return true;
		}
	};
}
async function handleGetProfile(accountId, ctx, res) {
	const configProfile = ctx.getConfigProfile(accountId);
	const publishState = await getNostrProfileState(accountId);
	sendJson(res, 200, {
		ok: true,
		profile: configProfile ?? null,
		publishState: publishState ?? null
	});
	return true;
}
async function handleUpdateProfile(accountId, ctx, req, res) {
	if (profileRateLimiter.isRateLimited(accountId)) {
		sendJson(res, 429, {
			ok: false,
			error: "Rate limit exceeded (5 requests/minute)"
		});
		return true;
	}
	let body;
	try {
		body = await readJsonBody(req);
	} catch (err) {
		sendJson(res, 400, {
			ok: false,
			error: String(err)
		});
		return true;
	}
	const parseResult = ProfileUpdateSchema.safeParse(normalizeProfileUpdateUrlInputs(body));
	if (!parseResult.success) {
		sendJson(res, 400, {
			ok: false,
			error: "Validation failed",
			details: parseResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
		});
		return true;
	}
	const profile = restoreProfileUpdateUrlInputs(parseResult.data, body);
	for (const field of PROFILE_URL_FIELDS) {
		const url = profile[field];
		if (!url) continue;
		const check = validateUrlSafety(url);
		if (!check.ok) {
			sendJson(res, 400, {
				ok: false,
				error: `${field}: ${check.error}`
			});
			return true;
		}
	}
	const mergedProfile = {
		...ctx.getConfigProfile(accountId) ?? {},
		...profile
	};
	try {
		const result = await publishLocks.enqueue(accountId, async () => {
			await getPluginRuntimeGatewayRequestScope$1()?.revalidate?.();
			return await publishNostrProfile(accountId, mergedProfile);
		});
		if (result.successes.length > 0) {
			await getPluginRuntimeGatewayRequestScope$1()?.revalidate?.();
			await ctx.updateConfigProfile(accountId, mergedProfile);
			ctx.log?.info(`[${accountId}] Profile published to ${result.successes.length} relay(s)`);
		} else ctx.log?.warn(`[${accountId}] Profile publish failed on all relays`);
		sendJson(res, 200, {
			ok: true,
			eventId: result.eventId,
			createdAt: result.createdAt,
			successes: result.successes,
			failures: result.failures,
			persisted: result.successes.length > 0
		});
	} catch (err) {
		if (res.writableEnded) return true;
		ctx.log?.error(`[${accountId}] Profile publish error: ${String(err)}`);
		sendJson(res, 500, {
			ok: false,
			error: `Publish failed: ${String(err)}`
		});
	}
	return true;
}
async function handleImportProfile(accountId, ctx, req, res) {
	const accountInfo = ctx.getAccountInfo(accountId);
	if (!accountInfo) {
		sendJson(res, 404, {
			ok: false,
			error: `Account not found: ${accountId}`
		});
		return true;
	}
	const { pubkey, relays } = accountInfo;
	if (!pubkey) {
		sendJson(res, 400, {
			ok: false,
			error: "Account has no public key configured"
		});
		return true;
	}
	let autoMerge = false;
	try {
		const body = await readJsonBody(req);
		if (typeof body === "object" && body !== null) autoMerge = body.autoMerge === true;
	} catch {}
	await getPluginRuntimeGatewayRequestScope$1()?.revalidate?.();
	ctx.log?.info(`[${accountId}] Importing profile for ${pubkey.slice(0, 8)}...`);
	const result = await importProfileFromRelays({
		pubkey,
		relays,
		timeoutMs: 1e4
	});
	if (!result.ok) {
		sendJson(res, 200, {
			ok: false,
			error: result.error,
			relaysQueried: result.relaysQueried
		});
		return true;
	}
	let merged;
	if (autoMerge && result.profile) {
		await getPluginRuntimeGatewayRequestScope$1()?.revalidate?.();
		merged = mergeProfiles(ctx.getConfigProfile(accountId), result.profile);
		await ctx.updateConfigProfile(accountId, merged);
		ctx.log?.info(`[${accountId}] Profile imported and merged`);
	}
	sendJson(res, 200, {
		ok: true,
		imported: result.profile,
		...merged ? { merged } : {},
		saved: merged !== void 0,
		event: result.event,
		sourceRelay: result.sourceRelay,
		relaysQueried: result.relaysQueried
	});
	return true;
}
//#endregion
export { createNostrProfileHttpHandler, getNostrRuntime, getPluginRuntimeGatewayRequestScope, nostrPlugin, resolveNostrAccount, setNostrRuntime };
