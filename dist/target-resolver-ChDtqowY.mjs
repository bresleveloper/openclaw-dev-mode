import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-CyorchNP.mjs";
import { a as resolveNormalizedTargetInput, i as normalizeTargetForProvider, n as looksLikeTargetId, o as resolveReservedTargetLiteral, r as maybeResolvePluginMessagingTarget, s as stripNormalizedTargetProviderPrefixes, t as buildTargetResolverSignature } from "./target-normalization-OW_Z4SOC.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-NjzJcucv.mjs";
import { a as missingTargetError, o as reservedTargetLiteralError, s as unknownTargetError, t as ambiguousTargetError } from "./target-errors-DJNFH5hc.mjs";
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
	directoryCache.clearMatching((key) => {
		if (!key.startsWith(`${channelKey}:`)) return false;
		if (!params.accountId) return true;
		return key.startsWith(`${channelKey}:${accountKey}:`);
	}, params.cfg);
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
	const inferredChatType = (plugin ?? getRuntimeVisibleChannelPlugin(channel))?.messaging?.inferTargetChatType?.({ to: raw });
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
	const query = normalizeLowercaseStringOrEmpty(params.query);
	if (!query) return false;
	return [
		normalizeDirectoryEntryId(params.channel, params.entry, params.plugin),
		params.entry.name,
		params.entry.handle
	].map((value) => value ? stripTargetPrefixes(value, params.channel, params.plugin) : "").map(normalizeLowercaseStringOrEmpty).filter(Boolean).some((value) => params.exactOnly ? value === query : value === query || value.includes(query));
}
async function listDirectoryEntries(params) {
	const directory = (params.plugin ?? getRuntimeVisibleChannelPlugin(params.channel))?.directory;
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
	let entries = await listDirectoryEntries({
		...params,
		source: "cache"
	});
	if (entries.length === 0 && params.preferLiveOnMiss) entries = await listDirectoryEntries({
		...params,
		source: "live"
	});
	directoryCache.set(cacheKey, entries, params.cfg);
	return entries;
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
async function resolveChannelTarget(params) {
	const raw = params.input.trim();
	if (!raw) {
		const plugin = params.plugin ?? getRuntimeVisibleChannelPlugin(params.channel);
		return {
			ok: false,
			error: missingTargetError(plugin?.meta?.label ?? params.channel, plugin?.messaging?.targetResolver?.hint)
		};
	}
	const plugin = params.plugin ?? getRuntimeVisibleChannelPlugin(params.channel);
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
		const resolvedIdLikeTarget = await maybeResolvePluginMessagingTarget({
			cfg: params.cfg,
			channel: params.channel,
			input: raw,
			accountId: params.accountId,
			preferredKind: params.preferredKind,
			plugin,
			requireIdLike: true
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
	const matches = (await getDirectoryEntries({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		kind: kind === "user" ? "user" : "group",
		query,
		runtime: params.runtime,
		preferLiveOnMiss: true,
		plugin
	})).filter((entry) => matchesDirectoryEntry({
		channel: params.channel,
		entry,
		query,
		plugin,
		exactOnly: Boolean(reservedLiteral)
	}));
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
	const resolvedFallbackTarget = await maybeResolvePluginMessagingTarget({
		cfg: params.cfg,
		channel: params.channel,
		input: raw,
		accountId: params.accountId,
		preferredKind: params.preferredKind,
		plugin
	});
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
