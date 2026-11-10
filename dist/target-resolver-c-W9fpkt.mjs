import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-GGZXKqeN.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import { a as resolveNormalizedTargetInput, i as normalizeTargetForProvider, n as looksLikeTargetId, o as resolveReservedTargetLiteral, r as maybeResolvePluginMessagingTarget, s as stripNormalizedTargetProviderPrefixes, t as buildTargetResolverSignature } from "./target-normalization-Cz6f81yX.mjs";
import { a as missingTargetError, o as reservedTargetLiteralError, s as unknownTargetError, t as ambiguousTargetError } from "./target-errors-MHPko63s.mjs";
//#region src/infra/outbound/directory-cache.ts
function buildDirectoryCacheKey(key) {
	const signature = key.signature ?? "default";
	return `${key.channel}:${key.accountId ?? "default"}:${key.kind}:${signature}:query:${key.query ?? ""}`;
}
/** TTL and capacity are scoped to a config object reference. */
var DirectoryCache = class {
	constructor(ttlMs, maxSize = 2e3) {
		this.cachesByConfig = /* @__PURE__ */ new WeakMap();
		this.ttlMs = resolveNonNegativeIntegerOption(ttlMs, 0);
		this.maxSize = Math.max(1, resolveNonNegativeIntegerOption(maxSize, 2e3));
	}
	get(key, cfg) {
		const cache = this.cacheForConfig(cfg);
		this.pruneExpired(cache, Date.now());
		return cache.get(key)?.value;
	}
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
	clearMatching(match, cfg) {
		const cache = this.cachesByConfig.get(cfg);
		if (!cache) return;
		for (const key of cache.keys()) if (match(key)) cache.delete(key);
	}
	clear() {
		this.cachesByConfig = /* @__PURE__ */ new WeakMap();
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
//#region src/infra/outbound/target-resolver.ts
const directoryCache = new DirectoryCache(18e5);
function resetDirectoryCache(params) {
	if (!params) {
		directoryCache.clear();
		return;
	}
	const channelKey = params.channel;
	const accountKey = params.accountId ?? "default";
	directoryCache.clearMatching((key) => key.startsWith(`${channelKey}:`) && (!params.accountId || key.startsWith(`${channelKey}:${accountKey}:`)), params.cfg);
}
function stripTargetPrefixes(value, channel, plugin) {
	const providerPrefixes = [
		channel,
		plugin?.id,
		...plugin?.messaging?.targetPrefixes ?? []
	].map((prefix) => prefix?.trim().toLowerCase() ?? "").filter(Boolean);
	return stripNormalizedTargetProviderPrefixes(value, providerPrefixes).replace(/^(channel|group|user):/i, "").replace(/^[@#]/, "").trim();
}
function formatTargetDisplay(params) {
	const plugin = getRuntimeVisibleChannelPlugin(params.channel);
	if (plugin?.messaging?.formatTargetDisplay) return plugin.messaging.formatTargetDisplay({
		target: params.target,
		display: params.display,
		kind: params.kind
	});
	const trimmedTarget = params.target.trim();
	const lowered = trimmedTarget.toLowerCase();
	const display = params.display?.trim();
	const kind = params.kind ?? (lowered.startsWith("user:") ? "user" : lowered.startsWith("channel:") ? "group" : void 0);
	if (display) {
		if (display.startsWith("#") || display.startsWith("@")) return display;
		if (kind === "user") return `@${display}`;
		if (kind === "group" || kind === "channel") return `#${display}`;
		return display;
	}
	if (!trimmedTarget || trimmedTarget.startsWith("#") || trimmedTarget.startsWith("@")) return trimmedTarget;
	const channelPrefix = `${params.channel}:`;
	return (lowered.startsWith(channelPrefix) ? trimmedTarget.slice(channelPrefix.length) : trimmedTarget).replace(/^channel:/i, "#").replace(/^user:/i, "@");
}
function detectTargetKind(channel, raw, preferred, plugin) {
	if (preferred) return preferred;
	const inferredChatType = (plugin ?? getRuntimeVisibleChannelPlugin(channel))?.messaging?.inferTargetChatType?.({ to: raw });
	if (inferredChatType === "direct") return "user";
	if (inferredChatType === "channel" || inferredChatType === "group") return inferredChatType;
	if (raw.startsWith("@") || /^<@!?/.test(raw) || /^user:/i.test(raw)) return "user";
	if (raw.startsWith("#") || /^channel:/i.test(raw)) return "group";
	const chatTypes = plugin?.capabilities?.chatTypes ?? [];
	if (chatTypes.length > 0 && chatTypes.every((chatType) => chatType === "direct")) return "user";
	return "group";
}
function normalizeDirectoryEntryId(channel, entry, plugin) {
	return normalizeTargetForProvider(channel, entry.id, plugin) ?? entry.id.trim();
}
async function getDirectoryEntries(params) {
	const signature = buildTargetResolverSignature(params.channel, params.plugin);
	const cacheQuery = normalizeLowercaseStringOrEmpty(params.query ?? "");
	const cacheKey = buildDirectoryCacheKey({
		channel: params.channel,
		accountId: params.accountId,
		kind: params.kind,
		signature,
		query: cacheQuery
	});
	const cached = directoryCache.get(cacheKey, params.cfg);
	if (cached) return cached;
	const listEntries = async (useLive) => {
		const directory = (params.plugin ?? getRuntimeVisibleChannelPlugin(params.channel))?.directory;
		if (!directory) return [];
		const runtime = params.runtime ?? defaultRuntime;
		const method = params.kind === "user" ? "listPeers" : "listGroups";
		const fn = useLive ? directory[`${method}Live`] ?? directory[method] : directory[method];
		if (!fn) return [];
		captureChannelReadAuthority()?.();
		return await fn({
			cfg: params.cfg,
			accountId: params.accountId ?? void 0,
			query: params.query ?? void 0,
			limit: void 0,
			runtime
		});
	};
	let entries = await listEntries(false);
	if (entries.length === 0 && params.preferLiveOnMiss) entries = await listEntries(true);
	directoryCache.set(cacheKey, entries, params.cfg);
	return entries;
}
async function resolveChannelTarget(params) {
	const raw = params.input.trim();
	const plugin = params.plugin ?? getRuntimeVisibleChannelPlugin(params.channel);
	const providerLabel = plugin?.meta?.label ?? params.channel;
	const hint = plugin?.messaging?.targetResolver?.hint;
	if (!raw) return {
		ok: false,
		error: missingTargetError(providerLabel, hint)
	};
	const kind = detectTargetKind(params.channel, raw, params.preferredKind, plugin);
	const normalizedInput = resolveNormalizedTargetInput(params.channel, raw, plugin);
	const normalized = normalizedInput?.normalized ?? raw;
	const reservedLiteral = resolveReservedTargetLiteral({
		raw,
		plugin
	});
	const normalizedResult = () => ({
		ok: true,
		target: {
			to: normalized,
			kind,
			display: stripTargetPrefixes(normalized),
			source: "normalized",
			resolutionSource: "normalized"
		}
	});
	const resolvePluginTarget = (requireIdLike) => maybeResolvePluginMessagingTarget({
		...params,
		input: raw,
		plugin,
		requireIdLike
	});
	if (normalizedInput && !reservedLiteral && looksLikeTargetId({
		channel: params.channel,
		raw: normalizedInput.raw,
		normalized,
		plugin
	})) {
		const target = await resolvePluginTarget(true);
		return target ? {
			ok: true,
			target
		} : normalizedResult();
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
	const normalizedQuery = query.toLowerCase();
	const matches = normalizedQuery ? entries.filter((entry) => {
		return [
			normalizeDirectoryEntryId(params.channel, entry, plugin),
			entry.name,
			entry.handle
		].map((value) => value ? stripTargetPrefixes(value, params.channel, plugin).toLowerCase() : "").some((value) => reservedLiteral ? value === normalizedQuery : value.includes(normalizedQuery));
	}) : [];
	const [entry] = matches;
	if (matches.length === 1 && entry) return {
		ok: true,
		target: {
			to: normalizeDirectoryEntryId(params.channel, entry, plugin),
			kind,
			display: entry.name ?? entry.handle ?? stripTargetPrefixes(entry.id, params.channel, plugin),
			source: "directory",
			resolutionSource: "directory"
		}
	};
	if (matches.length > 1) return {
		ok: false,
		error: ambiguousTargetError(providerLabel, raw, hint),
		candidates: matches
	};
	if (reservedLiteral) return {
		ok: false,
		error: reservedTargetLiteralError(providerLabel, reservedLiteral, hint)
	};
	const resolvedFallbackTarget = await resolvePluginTarget();
	if (resolvedFallbackTarget) return {
		ok: true,
		target: resolvedFallbackTarget
	};
	if (params.unknownTargetMode === "normalized") return normalizedResult();
	return {
		ok: false,
		error: unknownTargetError(providerLabel, raw, hint)
	};
}
async function lookupDirectoryDisplay(params) {
	const normalized = normalizeTargetForProvider(params.channel, params.targetId) ?? params.targetId;
	const directories = await Promise.all(["group", "user"].map((kind) => getDirectoryEntries({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind,
		runtime: params.runtime,
		preferLiveOnMiss: false
	})));
	for (const entries of directories) {
		const entry = entries.find((candidate) => normalizeDirectoryEntryId(params.channel, candidate) === normalized);
		if (entry) return entry.name ?? entry.handle ?? void 0;
	}
}
//#endregion
export { DirectoryCache as a, resolveChannelTarget as i, lookupDirectoryDisplay as n, resetDirectoryCache as r, formatTargetDisplay as t };
