import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-CiwNdke1.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { a as normalizeTargetForProvider, i as normalizeChannelTargetInput, n as looksLikeTargetId, o as resolveNormalizedTargetInput, r as maybeResolvePluginMessagingTarget, s as resolveReservedTargetLiteral, t as buildTargetResolverSignature } from "./target-normalization-Bh4bVQxW.mjs";
import { a as missingTargetError, o as reservedTargetLiteralError, s as unknownTargetError, t as ambiguousTargetError } from "./target-errors-BPI2bPFa.mjs";
//#region src/infra/outbound/directory-cache.ts
/**
* Serializes channel-directory lookup dimensions into a cache key.
*/
function buildDirectoryCacheKey(key) {
	const signature = key.signature ?? "default";
	return `${key.channel}:${key.accountId ?? "default"}:${key.kind}:${key.source}:${signature}:query:${key.query ?? ""}`;
}
/**
* Small TTL cache for channel directory lookups tied to a config object reference.
*/
var DirectoryCache = class {
	constructor(ttlMs, maxSize = 2e3) {
		this.cachesByConfig = /* @__PURE__ */ new WeakMap();
		this.ttlMs = resolveNonNegativeIntegerOption(ttlMs, 0);
		this.maxSize = Math.max(1, resolveNonNegativeIntegerOption(maxSize, 2e3));
	}
	/**
	* Returns a cached value after applying config scoping, TTL, and capacity invalidation.
	*/
	get(key, cfg) {
		const cache = this.cacheForConfig(cfg);
		this.pruneExpired(cache, Date.now());
		const entry = cache.get(key);
		if (!entry) return;
		return entry.value;
	}
	/**
	* Stores a value and refreshes its recency for bounded-size eviction.
	*/
	set(key, value, cfg) {
		const cache = this.cacheForConfig(cfg);
		const now = Date.now();
		this.pruneExpired(cache, now);
		cache.delete(key);
		cache.set(key, {
			value,
			fetchedAt: now
		});
		pruneMapToMaxSize(cache, this.maxSize);
	}
	/**
	* Clears matching entries without disturbing unrelated cached lookups.
	*/
	clearMatching(match, cfg) {
		const cache = this.cachesByConfig.get(cfg);
		if (!cache) return;
		for (const key of cache.keys()) if (match(key)) cache.delete(key);
	}
	/**
	* Drops one config scope or all cached entries.
	*/
	clear(cfg) {
		if (cfg) this.cachesByConfig.delete(cfg);
		else this.cachesByConfig = /* @__PURE__ */ new WeakMap();
	}
	cacheForConfig(cfg) {
		let cache = this.cachesByConfig.get(cfg);
		if (!cache) {
			cache = /* @__PURE__ */ new Map();
			this.cachesByConfig.set(cfg, cache);
		}
		return cache;
	}
	pruneExpired(cache, now) {
		if (this.ttlMs <= 0) return;
		for (const [cacheKey, entry] of cache) if (now - entry.fetchedAt >= this.ttlMs) cache.delete(cacheKey);
	}
};
//#endregion
//#region src/infra/outbound/target-id-resolution.ts
/** Resolves an id-like outbound target through the channel plugin directory. */
async function maybeResolveIdLikeTarget(params) {
	const target = await maybeResolvePluginMessagingTarget({
		...params,
		requireIdLike: true
	});
	if (!target) return;
	return target;
}
//#endregion
//#region src/infra/outbound/target-resolver.ts
function asResolvedMessagingTarget(target) {
	return target;
}
/** Resolves a channel target using the shared outbound target resolver. */
async function resolveChannelTarget(params) {
	return resolveMessagingTarget(params);
}
const directoryCache = new DirectoryCache(18e5);
/** Clears cached directory entries for all channels or one channel/account scope. */
function resetDirectoryCache(params) {
	if (!params) {
		directoryCache.clear();
		return;
	}
	const channelKey = params.channel;
	const accountKey = params.accountId ?? "default";
	directoryCache.clearMatching((key) => {
		if (!key.startsWith(`${channelKey}:`)) return false;
		if (!params.accountId) return true;
		return key.startsWith(`${channelKey}:${accountKey}:`);
	}, params.cfg);
}
function normalizeQuery(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function resolveTargetChannelPlugin(channel) {
	return getRuntimeVisibleChannelPlugin(channel);
}
function stripTargetPrefixes(value, channel, plugin) {
	const providerPrefixes = [
		channel,
		plugin?.id,
		...plugin?.messaging?.targetPrefixes ?? []
	].map((prefix) => prefix?.trim().toLowerCase() ?? "").filter(Boolean);
	let target = value.trim();
	while (target) {
		const lowered = target.toLowerCase();
		const prefix = providerPrefixes.find((candidate) => lowered.startsWith(`${candidate}:`));
		if (!prefix) break;
		target = target.slice(prefix.length + 1).trim();
	}
	return target.replace(/^(channel|group|user):/i, "").replace(/^[@#]/, "").trim();
}
/** Formats a resolved target for user-facing summaries. */
function formatTargetDisplay(params) {
	const plugin = resolveTargetChannelPlugin(params.channel);
	if (plugin?.messaging?.formatTargetDisplay) return plugin.messaging.formatTargetDisplay({
		target: params.target,
		display: params.display,
		kind: params.kind
	});
	const trimmedTarget = params.target.trim();
	const lowered = normalizeLowercaseStringOrEmpty(trimmedTarget);
	const display = params.display?.trim();
	const kind = params.kind ?? (lowered.startsWith("user:") ? "user" : lowered.startsWith("channel:") ? "group" : void 0);
	if (display) {
		if (display.startsWith("#") || display.startsWith("@")) return display;
		if (kind === "user") return `@${display}`;
		if (kind === "group" || kind === "channel") return `#${display}`;
		return display;
	}
	if (!trimmedTarget) return trimmedTarget;
	if (trimmedTarget.startsWith("#") || trimmedTarget.startsWith("@")) return trimmedTarget;
	const channelPrefix = `${params.channel}:`;
	const withoutProvider = lowered.startsWith(channelPrefix) ? trimmedTarget.slice(channelPrefix.length) : trimmedTarget;
	if (/^channel:/i.test(withoutProvider)) return `#${withoutProvider.replace(/^channel:/i, "")}`;
	if (/^user:/i.test(withoutProvider)) return `@${withoutProvider.replace(/^user:/i, "")}`;
	return withoutProvider;
}
function detectTargetKind(channel, raw, preferred, plugin) {
	if (preferred) return preferred;
	const trimmed = raw.trim();
	if (!trimmed) return "group";
	const inferredChatType = (plugin ?? resolveTargetChannelPlugin(channel))?.messaging?.inferTargetChatType?.({ to: raw });
	if (inferredChatType === "direct") return "user";
	if (inferredChatType === "channel") return "channel";
	if (inferredChatType === "group") return "group";
	if (trimmed.startsWith("@") || /^<@!?/.test(trimmed) || /^user:/i.test(trimmed)) return "user";
	if (trimmed.startsWith("#") || /^channel:/i.test(trimmed)) return "group";
	const chatTypes = plugin?.capabilities?.chatTypes ?? [];
	if (chatTypes.length > 0 && chatTypes.every((chatType) => chatType === "direct")) return "user";
	return "group";
}
function normalizeDirectoryEntryId(channel, entry, plugin) {
	return normalizeTargetForProvider(channel, entry.id, plugin) ?? entry.id.trim();
}
function matchesDirectoryEntry(params) {
	const query = normalizeQuery(params.query);
	if (!query) return false;
	return [
		stripTargetPrefixes(normalizeDirectoryEntryId(params.channel, params.entry, params.plugin), params.channel, params.plugin),
		params.entry.name ? stripTargetPrefixes(params.entry.name, params.channel, params.plugin) : "",
		params.entry.handle ? stripTargetPrefixes(params.entry.handle, params.channel, params.plugin) : ""
	].map((value) => normalizeQuery(value)).filter(Boolean).some((value) => params.exactOnly ? value === query : value === query || value.includes(query));
}
function resolveMatch(params) {
	const matches = params.entries.filter((entry) => matchesDirectoryEntry({
		channel: params.channel,
		entry,
		query: params.query,
		plugin: params.plugin,
		exactOnly: params.exactOnly
	}));
	if (matches.length === 0) return { kind: "none" };
	if (matches.length === 1) return {
		kind: "single",
		entry: matches[0]
	};
	return {
		kind: "ambiguous",
		entries: matches
	};
}
async function listDirectoryEntries(params) {
	const directory = (params.plugin ?? resolveTargetChannelPlugin(params.channel))?.directory;
	if (!directory) return [];
	const runtime = params.runtime ?? defaultRuntime;
	const useLive = params.source === "live";
	const fn = params.kind === "user" ? useLive ? directory.listPeersLive ?? directory.listPeers : directory.listPeers : useLive ? directory.listGroupsLive ?? directory.listGroups : directory.listGroups;
	if (!fn) return [];
	captureChannelReadAuthority()?.();
	return await fn({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0,
		query: params.query ?? void 0,
		limit: void 0,
		runtime
	});
}
async function getDirectoryEntries(params) {
	const signature = buildTargetResolverSignature(params.channel, params.plugin);
	const listParams = {
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind: params.kind,
		query: params.query,
		runtime: params.runtime,
		plugin: params.plugin
	};
	const cacheQuery = normalizeQuery(params.query ?? "");
	const cacheKey = buildDirectoryCacheKey({
		channel: params.channel,
		accountId: params.accountId,
		kind: params.kind,
		source: "cache",
		signature,
		query: cacheQuery
	});
	const cached = directoryCache.get(cacheKey, params.cfg);
	if (cached) return cached;
	const entries = await listDirectoryEntries({
		...listParams,
		source: "cache"
	});
	if (entries.length > 0 || !params.preferLiveOnMiss) {
		directoryCache.set(cacheKey, entries, params.cfg);
		return entries;
	}
	const liveKey = buildDirectoryCacheKey({
		channel: params.channel,
		accountId: params.accountId,
		kind: params.kind,
		source: "live",
		signature,
		query: cacheQuery
	});
	const liveEntries = await listDirectoryEntries({
		...listParams,
		source: "live"
	});
	directoryCache.set(liveKey, liveEntries, params.cfg);
	directoryCache.set(cacheKey, liveEntries, params.cfg);
	return liveEntries;
}
function buildNormalizedResolveResult(params) {
	return {
		ok: true,
		target: {
			to: params.normalized,
			kind: params.kind,
			display: stripTargetPrefixes(params.normalized),
			source: "normalized",
			resolutionSource: "normalized"
		}
	};
}
/** Resolves a user target through id-like, directory, plugin, and normalized fallback paths. */
async function resolveMessagingTarget(params) {
	const raw = normalizeChannelTargetInput(params.input);
	if (!raw) {
		const plugin = params.plugin ?? resolveTargetChannelPlugin(params.channel);
		return {
			ok: false,
			error: missingTargetError(plugin?.meta?.label ?? params.channel, plugin?.messaging?.targetResolver?.hint)
		};
	}
	const plugin = params.plugin ?? resolveTargetChannelPlugin(params.channel);
	const providerLabel = plugin?.meta?.label ?? params.channel;
	const hint = plugin?.messaging?.targetResolver?.hint;
	const kind = detectTargetKind(params.channel, raw, params.preferredKind, plugin);
	const normalizedInput = resolveNormalizedTargetInput(params.channel, raw, plugin);
	const normalized = normalizedInput?.normalized ?? raw;
	const reservedLiteral = resolveReservedTargetLiteral({
		raw,
		plugin
	});
	if (normalizedInput && !reservedLiteral && looksLikeTargetId({
		channel: params.channel,
		raw: normalizedInput.raw,
		normalized,
		plugin
	})) {
		const resolvedIdLikeTarget = await maybeResolveIdLikeTarget({
			cfg: params.cfg,
			channel: params.channel,
			input: raw,
			accountId: params.accountId,
			preferredKind: params.preferredKind,
			plugin
		});
		if (resolvedIdLikeTarget) return {
			ok: true,
			target: resolvedIdLikeTarget
		};
		return buildNormalizedResolveResult({
			normalized,
			kind
		});
	}
	const query = stripTargetPrefixes(raw, params.channel, plugin);
	const entries = await getDirectoryEntries({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind: kind === "user" ? "user" : "group",
		query,
		runtime: params.runtime,
		preferLiveOnMiss: true,
		plugin
	});
	const match = resolveMatch({
		channel: params.channel,
		entries,
		query,
		plugin,
		exactOnly: Boolean(reservedLiteral)
	});
	if (match.kind === "single") {
		const entry = match.entry;
		if (!entry) throw new Error("Single directory match is missing its entry");
		return {
			ok: true,
			target: {
				to: normalizeDirectoryEntryId(params.channel, entry, plugin),
				kind,
				display: entry.name ?? entry.handle ?? stripTargetPrefixes(entry.id, params.channel, plugin),
				source: "directory",
				resolutionSource: "directory"
			}
		};
	}
	if (match.kind === "ambiguous") return {
		ok: false,
		error: ambiguousTargetError(providerLabel, raw, hint),
		candidates: match.entries
	};
	if (reservedLiteral) return {
		ok: false,
		error: reservedTargetLiteralError(providerLabel, reservedLiteral, hint)
	};
	const resolvedFallbackTarget = asResolvedMessagingTarget(await maybeResolvePluginMessagingTarget({
		cfg: params.cfg,
		channel: params.channel,
		input: raw,
		accountId: params.accountId,
		preferredKind: params.preferredKind,
		plugin
	}));
	if (resolvedFallbackTarget) return {
		ok: true,
		target: resolvedFallbackTarget
	};
	if (params.unknownTargetMode === "normalized") return buildNormalizedResolveResult({
		normalized,
		kind
	});
	return {
		ok: false,
		error: unknownTargetError(providerLabel, raw, hint)
	};
}
/** Looks up a display label for a resolved target id from cached/live directory entries. */
async function lookupDirectoryDisplay(params) {
	const normalized = normalizeTargetForProvider(params.channel, params.targetId) ?? params.targetId;
	const [groups, users] = await Promise.all([getDirectoryEntries({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind: "group",
		runtime: params.runtime,
		preferLiveOnMiss: false
	}), getDirectoryEntries({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind: "user",
		runtime: params.runtime,
		preferLiveOnMiss: false
	})]);
	const findMatch = (candidates) => candidates.find((candidate) => normalizeDirectoryEntryId(params.channel, candidate) === normalized);
	const entry = findMatch(groups) ?? findMatch(users);
	return entry?.name ?? entry?.handle ?? void 0;
}
//#endregion
export { maybeResolveIdLikeTarget as a, resolveChannelTarget as i, lookupDirectoryDisplay as n, DirectoryCache as o, resetDirectoryCache as r, formatTargetDisplay as t };
