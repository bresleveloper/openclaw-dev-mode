import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/auto-reply/thinking.shared.ts
/** Shared normalization for thinking, verbosity, tracing, reasoning, and usage directives. */
/** Canonical thinking level values accepted by chat commands and session state. */
const ALL_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"adaptive",
	"max",
	"ultra"
];
const THINKING_LEVELS_HELP = ALL_THINKING_LEVELS.join("|");
const BASE_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high"
];
const THINKING_LEVEL_RANKS = {
	off: 0,
	minimal: 10,
	low: 20,
	medium: 30,
	high: 40,
	adaptive: 30,
	xhigh: 60,
	max: 70,
	ultra: 80
};
function formatThinkingLevelClampNotice(params) {
	if (!params.requested || !params.effective || params.requested === params.effective) return;
	return `Thinking level clamped to ${params.effective} for ${params.provider}/${params.model} (requested ${params.requested}; preference retained).`;
}
/** Normalizes user-provided thinking level strings to the canonical enum. */
function normalizeThinkLevel(raw) {
	const key = normalizeOptionalLowercaseString(raw);
	if (!key) return;
	return normalizeAliasedLevel(key.replace(/[\s_-]+/g, ""), [
		["adaptive", "auto"],
		["max", "maximum"],
		["ultra"],
		["xhigh", "extrahigh"]
	]) ?? normalizeAliasedLevel(key, [
		["off", "none"],
		[
			"low",
			"on",
			"enable",
			"enabled",
			"thinkhard",
			"think-hard",
			"think_hard"
		],
		[
			"minimal",
			"min",
			"think"
		],
		[
			"medium",
			"mid",
			"med",
			"thinkharder",
			"think-harder",
			"harder"
		],
		[
			"high",
			"ultrathink",
			"thinkhardest",
			"highest"
		]
	]);
}
/** Returns true for command values that clear an inherited session override. */
function isSessionDefaultDirectiveValue(raw) {
	const key = normalizeOptionalLowercaseString(raw);
	if (!key) return false;
	return [
		"default",
		"inherit",
		"inherited",
		"clear",
		"reset",
		"unpin"
	].includes(key);
}
function normalizeAliasedLevel(raw, aliases) {
	const key = normalizeOptionalLowercaseString(raw);
	return key ? aliases.find((group) => group.includes(key))?.[0] : void 0;
}
/** Normalizes /verbose values. */
function normalizeVerboseLevel(raw) {
	return normalizeAliasedLevel(raw, [
		[
			"off",
			"false",
			"no",
			"0"
		],
		[
			"full",
			"all",
			"everything"
		],
		[
			"on",
			"minimal",
			"true",
			"yes",
			"1"
		]
	]);
}
/** Normalizes /trace values. */
function normalizeTraceLevel(raw) {
	return normalizeAliasedLevel(raw, [
		[
			"off",
			"false",
			"no",
			"0"
		],
		[
			"on",
			"true",
			"yes",
			"1"
		],
		["raw", "unfiltered"]
	]);
}
/** Normalizes response usage display values. */
function normalizeUsageDisplay(raw) {
	return normalizeAliasedLevel(raw, [
		[
			"off",
			"false",
			"no",
			"0",
			"disable",
			"disabled"
		],
		[
			"tokens",
			"token",
			"tok",
			"minimal",
			"min",
			"on",
			"true",
			"yes",
			"1",
			"enable",
			"enabled"
		],
		["full", "session"]
	]);
}
/** Resolves response usage display mode with the persisted default. */
function resolveResponseUsageMode(raw) {
	return normalizeUsageDisplay(raw) ?? "off";
}
function resolveEffectiveResponseUsage(sessionRaw, configured, channel) {
	const sessionNormalized = normalizeUsageDisplay(sessionRaw);
	if (sessionNormalized !== void 0) return sessionNormalized;
	return resolveResponseUsageMode(typeof configured === "string" ? configured : (channel ? configured?.[channel] : void 0) ?? configured?.default);
}
/** Normalizes elevated execution policy values. */
function normalizeElevatedLevel(raw) {
	return normalizeAliasedLevel(raw, [
		[
			"off",
			"false",
			"no",
			"0"
		],
		[
			"full",
			"auto",
			"auto-approve",
			"autoapprove"
		],
		[
			"ask",
			"prompt",
			"approval",
			"approve"
		],
		[
			"on",
			"true",
			"yes",
			"1"
		]
	]);
}
/** Normalizes reasoning visibility values. */
function normalizeReasoningLevel(raw) {
	return normalizeAliasedLevel(raw, [
		[
			"off",
			"false",
			"no",
			"0",
			"hide",
			"hidden",
			"disable",
			"disabled"
		],
		[
			"on",
			"true",
			"yes",
			"1",
			"show",
			"visible",
			"enable",
			"enabled"
		],
		[
			"stream",
			"streaming",
			"draft",
			"live"
		]
	]);
}
//#endregion
export { formatThinkingLevelClampNotice as a, normalizeReasoningLevel as c, normalizeUsageDisplay as d, normalizeVerboseLevel as f, THINKING_LEVEL_RANKS as i, normalizeThinkLevel as l, resolveResponseUsageMode as m, BASE_THINKING_LEVELS as n, isSessionDefaultDirectiveValue as o, resolveEffectiveResponseUsage as p, THINKING_LEVELS_HELP as r, normalizeElevatedLevel as s, ALL_THINKING_LEVELS as t, normalizeTraceLevel as u };
