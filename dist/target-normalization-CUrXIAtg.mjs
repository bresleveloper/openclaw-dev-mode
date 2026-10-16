import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as getActivePluginChannelRegistryVersion } from "./runtime-D4MkflNJ.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-BugfxX6l.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as captureChannelReadAuthority } from "./channel-read-authority-CyorchNP.mjs";
//#region src/infra/outbound/target-normalization.ts
const targetNormalizerCacheByChannelId = /* @__PURE__ */ new Map();
const preparedPluginSignatureIds = /* @__PURE__ */ new WeakMap();
let nextPreparedPluginSignatureId = 1;
function resolveChannelPluginForTargetRead(channelId) {
	return getLoadedChannelPluginForRead(channelId) ?? getChannelPlugin(channelId);
}
function stripNormalizedTargetProviderPrefixes(raw, prefixes) {
	let target = raw.trim();
	while (target) {
		const lowered = target.toLowerCase();
		const prefix = prefixes.find((candidate) => lowered.startsWith(`${candidate}:`));
		if (!prefix) return target;
		target = target.slice(prefix.length + 1).trim();
	}
	return target;
}
function resolveReservedTargetLiteral(params) {
	const raw = normalizeOptionalString(params.raw);
	const plugin = params.plugin;
	const reservedLiterals = plugin?.messaging?.targetResolver?.reservedLiterals;
	if (!raw || !plugin || !reservedLiterals?.length) return;
	const stripped = stripNormalizedTargetProviderPrefixes(raw, [plugin.id, ...plugin.messaging?.targetPrefixes ?? []].map((prefix) => normalizeOptionalLowercaseString(String(prefix))).filter((prefix) => Boolean(prefix)));
	if (!stripped || /^[@#]/.test(stripped) || /^(channel|group|user):/i.test(stripped)) return;
	const normalized = stripped.toLowerCase();
	return reservedLiterals.some((literal) => normalizeOptionalLowercaseString(literal) === normalized) ? normalized : void 0;
}
function resolveTargetNormalizer(channelId, preparedPlugin) {
	if (preparedPlugin) return preparedPlugin.messaging?.normalizeTarget;
	const version = getActivePluginChannelRegistryVersion();
	const cached = targetNormalizerCacheByChannelId.get(channelId);
	if (cached && cached.version === version) return cached.normalizer;
	const normalizer = resolveChannelPluginForTargetRead(channelId)?.messaging?.normalizeTarget;
	targetNormalizerCacheByChannelId.set(channelId, {
		version,
		normalizer
	});
	return normalizer;
}
function resolvePreparedPluginSignatureId(plugin) {
	const existing = preparedPluginSignatureIds.get(plugin);
	if (existing) return existing;
	const id = nextPreparedPluginSignatureId;
	nextPreparedPluginSignatureId += 1;
	preparedPluginSignatureIds.set(plugin, id);
	return id;
}
function normalizeTargetForProvider(provider, raw = "", plugin) {
	const fallback = normalizeOptionalString(raw);
	if (!fallback) return;
	const providerId = normalizeOptionalLowercaseString(provider);
	const normalizer = providerId ? resolveTargetNormalizer(providerId, plugin) : void 0;
	return normalizeOptionalString(normalizer?.(raw) ?? fallback);
}
function resolveNormalizedTargetInput(provider, raw, plugin) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return {
		raw: trimmed,
		normalized: normalizeTargetForProvider(provider, trimmed, plugin) ?? trimmed
	};
}
function looksLikeTargetId(params) {
	const normalizedInput = params.normalized ?? normalizeTargetForProvider(params.channel, params.raw, params.plugin);
	const lookup = (params.plugin ?? resolveChannelPluginForTargetRead(params.channel))?.messaging?.targetResolver?.looksLikeId;
	if (lookup) return lookup(params.raw, normalizedInput ?? params.raw);
	return /^(channel|group|user|conversation):/i.test(params.raw) || /^[@#]/.test(params.raw) || /^\+?\d{6,}$/.test(params.raw) || params.raw.includes("@thread");
}
async function maybeResolvePluginMessagingTarget(params) {
	const normalizedInput = resolveNormalizedTargetInput(params.channel, params.input, params.plugin);
	if (!normalizedInput) return;
	const resolver = (params.plugin ?? resolveChannelPluginForTargetRead(params.channel))?.messaging?.targetResolver;
	if (!resolver?.resolveTarget) return;
	if (params.requireIdLike && !looksLikeTargetId({
		channel: params.channel,
		raw: normalizedInput.raw,
		normalized: normalizedInput.normalized,
		plugin: params.plugin
	})) return;
	captureChannelReadAuthority()?.();
	const resolved = await resolver.resolveTarget({
		cfg: params.cfg,
		accountId: params.accountId,
		input: normalizedInput.raw,
		normalized: normalizedInput.normalized,
		preferredKind: params.preferredKind
	});
	if (!resolved) return;
	return {
		to: resolved.to,
		kind: resolved.kind,
		display: resolved.display,
		source: resolved.source ?? "normalized",
		resolutionSource: "plugin"
	};
}
function buildTargetResolverSignature(channel, preparedPlugin) {
	const plugin = preparedPlugin ?? resolveChannelPluginForTargetRead(channel);
	const registryScope = preparedPlugin ? `prepared:${resolvePreparedPluginSignatureId(preparedPlugin)}` : "pinned";
	const resolver = plugin?.messaging?.targetResolver;
	const hint = resolver?.hint ?? "";
	const reserved = (resolver?.reservedLiterals ?? []).map(normalizeOptionalLowercaseString).filter((literal) => Boolean(literal)).toSorted().join(",");
	const looksLike = resolver?.looksLikeId;
	return hashSignature(`${registryScope}|${hint}|${reserved}|${looksLike ? looksLike.toString() : ""}`);
}
function hashSignature(value) {
	let hash = 5381;
	for (let i = 0; i < value.length; i += 1) hash = (hash << 5) + hash ^ value.charCodeAt(i);
	return (hash >>> 0).toString(36);
}
//#endregion
export { resolveNormalizedTargetInput as a, normalizeTargetForProvider as i, looksLikeTargetId as n, resolveReservedTargetLiteral as o, maybeResolvePluginMessagingTarget as r, stripNormalizedTargetProviderPrefixes as s, buildTargetResolverSignature as t };
