import { E as getDiscordEndpointRuntime } from "./channel-type-DKnjV1XW.mjs";
import { m as normalizeDiscordToken } from "./accounts-CwJQoLjM.mjs";
import { n as DiscordApiError, r as fetchDiscord } from "./api-CBK9zcq5.mjs";
import { resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { fetchWithTimeout, runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/discord/src/probe.ts
const DISCORD_API_BASE = "https://discord.com/api/v10";
const DISCORD_PROBE_GET_ME_LABEL = "discord.probe.getMe";
const DISCORD_PROBE_JSON_MAX_BYTES = 16777216;
const DISCORD_PROBE_COMPLETION_RESERVE_MAX_MS = 25;
const DISCORD_APP_FLAG_GATEWAY_PRESENCE = 4096;
const DISCORD_APP_FLAG_GATEWAY_PRESENCE_LIMITED = 8192;
const DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS = 16384;
const DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS_LIMITED = 32768;
const DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT = 1 << 18;
const DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19;
async function fetchDiscordApplicationMe(token, timeoutMs, fetcher, endpointRuntime) {
	try {
		const normalized = normalizeDiscordToken(token, "channels.discord.token");
		if (!normalized) return;
		return await fetchDiscord("/oauth2/applications/@me", normalized, fetcher, {
			endpointRuntime,
			retry: { attempts: 1 },
			timeoutMs
		});
	} catch {
		return;
	}
}
function resolveDiscordPrivilegedIntentsFromFlags(flags) {
	const resolve = (enabledBit, limitedBit) => {
		if ((flags & enabledBit) !== 0) return "enabled";
		if ((flags & limitedBit) !== 0) return "limited";
		return "disabled";
	};
	return {
		presence: resolve(DISCORD_APP_FLAG_GATEWAY_PRESENCE, DISCORD_APP_FLAG_GATEWAY_PRESENCE_LIMITED),
		guildMembers: resolve(DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS, DISCORD_APP_FLAG_GATEWAY_GUILD_MEMBERS_LIMITED),
		messageContent: resolve(DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT, DISCORD_APP_FLAG_GATEWAY_MESSAGE_CONTENT_LIMITED)
	};
}
async function fetchDiscordApplicationSummary(token, timeoutMs, fetcher = fetch, endpointRuntime) {
	const json = await fetchDiscordApplicationMe(token, timeoutMs, fetcher, (endpointRuntime === void 0 ? getDiscordEndpointRuntime() : endpointRuntime) ?? null);
	if (!json) return;
	const flags = typeof json.flags === "number" && Number.isFinite(json.flags) ? json.flags : void 0;
	return {
		id: json.id ?? null,
		flags: flags ?? null,
		intents: typeof flags === "number" ? resolveDiscordPrivilegedIntentsFromFlags(flags) : void 0
	};
}
function getResolvedFetch(fetcher) {
	const fetchImpl = resolveFetch(fetcher);
	if (!fetchImpl) throw new Error("fetch is not available");
	return fetchImpl;
}
async function readDiscordProbeGetMeJson(response, timeoutMs, deadlineMs) {
	const bytes = await readResponseWithLimit(response, DISCORD_PROBE_JSON_MAX_BYTES, {
		chunkTimeoutMs: timeoutMs,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${DISCORD_PROBE_GET_ME_LABEL}: JSON response stalled after ${chunkTimeoutMs}ms`),
		timeoutMs: Math.max(1, deadlineMs - Date.now()),
		onTimeout: () => /* @__PURE__ */ new Error(`${DISCORD_PROBE_GET_ME_LABEL}: JSON response timed out after ${timeoutMs}ms`),
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${DISCORD_PROBE_GET_ME_LABEL}: JSON response exceeds ${maxBytes} bytes`)
	});
	try {
		return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
	} catch (cause) {
		throw new Error(`${DISCORD_PROBE_GET_ME_LABEL}: malformed JSON response`, { cause });
	}
}
async function probeDiscord(token, timeoutMs, opts) {
	return await runChannelProbe(void 0, async ({ startedAt }) => {
		const endpoint = getDiscordEndpointRuntime();
		const fetcher = endpoint?.fetch ?? opts?.fetcher ?? fetch;
		const includeApplication = opts?.includeApplication === true;
		const normalized = normalizeDiscordToken(token, "channels.discord.token");
		const result = {
			ok: false,
			status: null,
			error: null
		};
		if (!normalized) return {
			...result,
			error: "missing token"
		};
		let res;
		try {
			const getMeUrl = `${endpoint?.descriptor.restApiBaseUrl ?? DISCORD_API_BASE}/users/@me`;
			const getMeDeadlineMs = Date.now() + timeoutMs;
			res = await fetchWithTimeout(getMeUrl, { headers: { Authorization: `Bot ${normalized}` } }, timeoutMs, getResolvedFetch(fetcher));
			if (!res.ok) return {
				...result,
				status: res.status,
				error: `getMe failed (${res.status})`
			};
			const json = await readDiscordProbeGetMeJson(res, timeoutMs, getMeDeadlineMs);
			result.ok = true;
			result.bot = {
				id: json.id ?? null,
				username: json.username ?? null
			};
			if (includeApplication) {
				const elapsedMs = Math.max(0, Date.now() - startedAt);
				const completionReserveMs = Math.min(DISCORD_PROBE_COMPLETION_RESERVE_MAX_MS, Math.max(1, Math.floor(timeoutMs / 10)));
				const applicationTimeoutMs = Math.floor(timeoutMs - elapsedMs - completionReserveMs);
				if (applicationTimeoutMs > 0) result.application = await fetchDiscordApplicationSummary(normalized, applicationTimeoutMs, fetcher, endpoint ?? null) ?? void 0;
			}
			return result;
		} finally {
			if (res?.bodyUsed !== true) await res?.body?.cancel().catch(() => void 0);
		}
	}, (error) => ({
		ok: false,
		status: error instanceof Response ? error.status : null,
		error: formatErrorMessage(error)
	}));
}
/**
* Extract the application (bot user) ID from a Discord bot token by
* base64-decoding the first segment.  Discord tokens have the format:
*   base64(user_id) . timestamp . hmac
* The decoded first segment is the numeric snowflake ID as a plain string,
* so we keep it as a string to avoid precision loss for IDs that exceed
* Number.MAX_SAFE_INTEGER.
*/
function parseApplicationIdFromToken(token) {
	const normalized = normalizeDiscordToken(token, "channels.discord.token");
	if (!normalized) return;
	const firstDot = normalized.indexOf(".");
	if (firstDot <= 0) return;
	try {
		const decoded = Buffer.from(normalized.slice(0, firstDot), "base64").toString("utf-8");
		if (/^\d+$/.test(decoded)) return decoded;
		return;
	} catch {
		return;
	}
}
async function probeDiscordApplicationId(token, timeoutMs, fetcher = fetch) {
	const normalized = normalizeDiscordToken(token, "channels.discord.token");
	if (!normalized) return {
		kind: "unavailable",
		status: null,
		error: /* @__PURE__ */ new Error("missing token")
	};
	const parsedApplicationId = parseApplicationIdFromToken(token);
	if (parsedApplicationId) return {
		kind: "resolved",
		applicationId: parsedApplicationId
	};
	try {
		const endpoint = getDiscordEndpointRuntime();
		const json = await fetchDiscord("/oauth2/applications/@me", normalized, endpoint?.fetch ?? fetcher, { timeoutMs });
		if (json?.id) return {
			kind: "resolved",
			applicationId: json.id
		};
		return {
			kind: "unavailable",
			status: null,
			error: /* @__PURE__ */ new Error("Discord application response did not include an id")
		};
	} catch (error) {
		if (error instanceof DiscordApiError && (error.status === 401 || error.status === 403)) return {
			kind: "rejected",
			status: error.status,
			error
		};
		return {
			kind: "unavailable",
			status: error instanceof DiscordApiError ? error.status : null,
			error
		};
	}
}
async function fetchDiscordApplicationId(token, timeoutMs, fetcher = fetch) {
	const result = await probeDiscordApplicationId(token, timeoutMs, fetcher);
	if (result.kind === "resolved") return result.applicationId;
	if (result.kind === "unavailable" && result.status === 429) throw result.error;
}
//#endregion
export { probeDiscordApplicationId as a, probeDiscord as i, fetchDiscordApplicationSummary as n, resolveDiscordPrivilegedIntentsFromFlags as o, parseApplicationIdFromToken as r, fetchDiscordApplicationId as t };
