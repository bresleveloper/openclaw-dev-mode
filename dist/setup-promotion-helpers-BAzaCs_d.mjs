import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
//#region src/channels/plugins/setup-promotion-keys.ts
/**
* Common root-level channel config keys safe to promote into a single account.
*/
const COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS = [
	"name",
	"token",
	"tokenFile",
	"botId",
	"secret",
	"botToken",
	"webhookPath",
	"webhookUrl",
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom",
	"defaultTo"
];
/**
* Setup-only config keys that can move during single-account migration.
*/
const SETUP_SINGLE_ACCOUNT_PROMOTION_KEYS = [
	...COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS,
	"streaming",
	"allowBots",
	"blockStreaming",
	"replyToMode",
	"textChunkLimit",
	"chunkMode",
	"responsePrefix",
	"ackReaction",
	"ackReactionScope",
	"reactionNotifications",
	"threadBindings",
	"mediaMaxMb",
	"dm",
	"groups",
	"actions"
];
const commonSingleAccountPromotionKeys = new Set(COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS);
const setupSingleAccountPromotionKeys = new Set(SETUP_SINGLE_ACCOUNT_PROMOTION_KEYS);
/**
* Returns whether a config key is part of the channel-agnostic promotion set.
*/
function isCommonSingleAccountPromotionKey(key) {
	return commonSingleAccountPromotionKeys.has(key);
}
/**
* Returns whether a config key can be promoted by setup migration flows.
*/
function isSetupSingleAccountPromotionKey(key) {
	return setupSingleAccountPromotionKeys.has(key);
}
/**
* Lists root-level channel keys that could be promoted into account config.
*/
function collectSingleAccountPromotionEntries(channel) {
	const hasNamedAccounts = Object.keys(channel.accounts ?? {}).some(Boolean);
	return {
		entries: Object.entries(channel).filter(([key, value]) => key !== "accounts" && key !== "defaultAccount" && key !== "enabled" && value !== void 0).map(([key]) => key),
		hasNamedAccounts
	};
}
//#endregion
//#region src/channels/plugins/setup-promotion-helpers.ts
/**
* Channel setup promotion helpers.
*
* Moves legacy single-account channel config into account-scoped config records.
*/
const LEGACY_UNDECLARED_ADAPTER_PROMOTION_KEYS = {
	common: [
		"accessToken",
		"appToken",
		"httpUrl",
		"password",
		"userId",
		"webhookSecret"
	],
	setupOnly: ["rooms"]
};
const legacyUndeclaredAdapterCommonPromotionKeys = new Set(LEGACY_UNDECLARED_ADAPTER_PROMOTION_KEYS.common);
const legacyUndeclaredAdapterSetupOnlyPromotionKeys = new Set(LEGACY_UNDECLARED_ADAPTER_PROMOTION_KEYS.setupOnly);
function hasPromotionDeclarations(surface) {
	return Boolean(surface && Object.hasOwn(surface, "singleAccountKeysToMove"));
}
function isLegacyUndeclaredAdapterPromotionKey(key, includeSetupKeys) {
	return legacyUndeclaredAdapterCommonPromotionKeys.has(key) || includeSetupKeys && legacyUndeclaredAdapterSetupOnlyPromotionKeys.has(key);
}
function asPromotionSurface(setup) {
	return setup && typeof setup === "object" ? setup : null;
}
function getLoadedChannelSetupPromotionSurface(channelKey) {
	const plugin = getLoadedChannelPluginForRead(channelKey);
	return asPromotionSurface(plugin?.setupContract ?? plugin?.setup);
}
/**
* Resolves all root-level keys eligible for single-account promotion.
*/
function resolveSingleAccountPromotion(params) {
	const callerSetupSurface = params.setupSurface === void 0 ? void 0 : asPromotionSurface(params.setupSurface);
	let discoveredSetupSurface;
	const resolveSetupSurface = () => {
		if (callerSetupSurface !== void 0) return callerSetupSurface;
		if (discoveredSetupSurface === void 0) discoveredSetupSurface = getLoadedChannelSetupPromotionSurface(params.channelKey) ?? params.resolveBundledSurface?.(params.channelKey) ?? null;
		return discoveredSetupSurface;
	};
	if (resolveSetupSurface()?.configPromotion === "preserve-root") return { kind: "preserve-root" };
	const { entries, hasNamedAccounts } = collectSingleAccountPromotionEntries(params.channel);
	if (entries.length === 0) return {
		kind: "promote",
		keysToMove: [],
		shouldDeferPromotion: false
	};
	const isGenericPromotionKey = params.includeSetupKeys ? isSetupSingleAccountPromotionKey : isCommonSingleAccountPromotionKey;
	const isLegacyPromotionKey = (key) => isLegacyUndeclaredAdapterPromotionKey(key, params.includeSetupKeys === true);
	const hasUncoveredRootKeys = entries.some((key) => !isGenericPromotionKey(key) && !isLegacyPromotionKey(key));
	const buildResult = (keysToMove) => ({
		kind: "promote",
		keysToMove,
		shouldDeferPromotion: hasUncoveredRootKeys && !hasPromotionDeclarations(resolveSetupSurface())
	});
	const keysToMove = entries.filter((key) => {
		if (isGenericPromotionKey(key)) return true;
		const setupSurface = resolveSetupSurface();
		return hasPromotionDeclarations(setupSurface) ? Boolean(setupSurface?.singleAccountKeysToMove?.includes(key)) : isLegacyPromotionKey(key);
	});
	if (!hasNamedAccounts || keysToMove.length === 0) return buildResult(keysToMove);
	const namedAccountPromotionKeys = resolveSetupSurface()?.namedAccountPromotionKeys;
	if (!namedAccountPromotionKeys) return buildResult(keysToMove);
	return buildResult(keysToMove.filter((key) => namedAccountPromotionKeys.includes(key)));
}
//#endregion
export { resolveSingleAccountPromotion as t };
