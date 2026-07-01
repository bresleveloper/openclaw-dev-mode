import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as getActivePluginChannelRegistryVersion } from "./runtime-wIYJz8NY.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import { t as getLoadedChannelPluginForRead } from "./registry-loaded-read-kWBL-Dpo.js";
import "./plugins-DnKj2WmH.js";
//#region src/infra/outbound/target-normalization.ts
/**
* Normalizes raw user/channel target input before provider-specific parsing.
*/
function normalizeChannelTargetInput(raw) {
	return raw.trim();
}
const targetNormalizerCacheByChannelId = /* @__PURE__ */ new Map();
const preparedPluginSignatureIds = /* @__PURE__ */ new WeakMap();
let nextPreparedPluginSignatureId = 1;
function resolveChannelPluginForTargetRead(channelId) {
	return getLoadedChannelPluginForRead(channelId) ?? getChannelPlugin(channelId);
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
/**
* Applies a channel plugin normalizer and falls back to trimmed input.
*/
function normalizeTargetForProvider(provider, raw, plugin) {
	if (!raw) return;
	const fallback = normalizeOptionalString(raw);
	if (!fallback) return;
	const providerId = normalizeOptionalLowercaseString(provider);
	return normalizeOptionalString((providerId ? resolveTargetNormalizer(providerId, plugin) : void 0)?.(raw) ?? fallback);
}
/**
* Produces raw and provider-normalized forms of a nonblank target input.
*/
function resolveNormalizedTargetInput(provider, raw, plugin) {
	const trimmed = normalizeChannelTargetInput(raw ?? "");
	if (!trimmed) return;
	return {
		raw: trimmed,
		normalized: normalizeTargetForProvider(provider, trimmed, plugin) ?? trimmed
	};
}
/**
* Detects whether input is specific enough to invoke plugin target resolution.
*/
function looksLikeTargetId(params) {
	const normalizedInput = params.normalized ?? normalizeTargetForProvider(params.channel, params.raw, params.plugin);
	const lookup = (params.plugin ?? resolveChannelPluginForTargetRead(params.channel))?.messaging?.targetResolver?.looksLikeId;
	if (lookup) return lookup(params.raw, normalizedInput ?? params.raw);
	if (/^(channel|group|user):/i.test(params.raw)) return true;
	if (/^[@#]/.test(params.raw)) return true;
	if (/^\+?\d{6,}$/.test(params.raw)) return true;
	if (params.raw.includes("@thread")) return true;
	return /^(conversation|user):/i.test(params.raw);
}
/**
* Resolves a normalized target through the channel plugin when a resolver is available.
*/
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
/**
* Builds a cache signature for target-resolution behavior exposed by a channel plugin.
*/
function buildTargetResolverSignature(channel, preparedPlugin) {
	const plugin = preparedPlugin ?? resolveChannelPluginForTargetRead(channel);
	const registryScope = preparedPlugin ? `prepared:${resolvePreparedPluginSignatureId(preparedPlugin)}` : "pinned";
	const resolver = plugin?.messaging?.targetResolver;
	const hint = resolver?.hint ?? "";
	const looksLike = resolver?.looksLikeId;
	return hashSignature(`${registryScope}|${hint}|${looksLike ? looksLike.toString() : ""}`);
}
function hashSignature(value) {
	let hash = 5381;
	for (let i = 0; i < value.length; i += 1) hash = (hash << 5) + hash ^ value.charCodeAt(i);
	return (hash >>> 0).toString(36);
}
//#endregion
export { normalizeTargetForProvider as a, normalizeChannelTargetInput as i, looksLikeTargetId as n, resolveNormalizedTargetInput as o, maybeResolvePluginMessagingTarget as r, buildTargetResolverSignature as t };
