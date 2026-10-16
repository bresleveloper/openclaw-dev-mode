import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
//#region src/channels/channel-config.ts
/** Copies match metadata onto resolved channel config output. */
function applyChannelMatchMeta(result, match) {
	if (match.matchKey && match.matchSource) {
		result.matchKey = match.matchKey;
		result.matchSource = match.matchSource;
	}
	return result;
}
/** Resolves a matched entry and preserves the config key that selected it. */
function resolveChannelMatchConfig(match, resolveEntry) {
	if (!match.entry) return null;
	return applyChannelMatchMeta(resolveEntry(match.entry), match);
}
/** Normalizes human channel names into config-safe slugs. */
function normalizeChannelSlug(value) {
	return normalizeLowercaseStringOrEmpty(value).replace(/^#/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
/** Builds unique config lookup keys from optional channel/account identifiers. */
function buildChannelKeyCandidates(...keys) {
	return normalizeUniqueSingleOrTrimmedStringList(keys);
}
/** Finds a direct channel entry and separately carries a wildcard fallback candidate. */
function resolveChannelEntryMatch(params) {
	const entries = params.entries ?? {};
	const match = {};
	for (const key of params.keys) {
		if (!Object.hasOwn(entries, key)) continue;
		match.entry = entries[key];
		match.key = key;
		break;
	}
	if (params.wildcardKey && Object.hasOwn(entries, params.wildcardKey)) {
		match.wildcardEntry = entries[params.wildcardKey];
		match.wildcardKey = params.wildcardKey;
	}
	return match;
}
/** Resolves config entry precedence: direct, normalized direct, parent, normalized parent, wildcard. */
function resolveChannelEntryMatchWithFallback(params) {
	const direct = resolveChannelEntryMatch({
		entries: params.entries,
		keys: params.keys,
		wildcardKey: params.wildcardKey
	});
	for (const source of ["direct", "parent"]) {
		const keys = source === "direct" ? params.keys : params.parentKeys ?? [];
		const candidate = source === "direct" ? direct : resolveChannelEntryMatch({
			entries: params.entries,
			keys
		});
		let found = candidate.entry && candidate.key ? candidate : void 0;
		const normalizeKey = params.normalizeKey;
		if (!found && normalizeKey) {
			const normalizedKeys = keys.map((key) => normalizeKey(key)).filter(Boolean);
			if (normalizedKeys.length > 0) for (const [entryKey, entry] of Object.entries(params.entries ?? {})) {
				const normalizedEntry = normalizeKey(entryKey);
				if (normalizedEntry && normalizedKeys.includes(normalizedEntry)) {
					found = {
						entry,
						key: entryKey
					};
					break;
				}
			}
		}
		if (found) return {
			...direct,
			entry: found.entry,
			key: found.key,
			...source === "parent" ? {
				parentEntry: found.entry,
				parentKey: found.key
			} : {},
			matchKey: found.key,
			matchSource: source
		};
	}
	if (direct.wildcardEntry && direct.wildcardKey) return {
		...direct,
		entry: direct.wildcardEntry,
		key: direct.wildcardKey,
		matchKey: direct.wildcardKey,
		matchSource: "wildcard"
	};
	return direct;
}
/** Resolves nested allowlists where an inner list only applies after the outer list matches. */
function resolveNestedAllowlistDecision(params) {
	if (!params.outerConfigured) return true;
	if (!params.outerMatched) return false;
	if (!params.innerConfigured) return true;
	return params.innerMatched;
}
//#endregion
export { resolveChannelEntryMatchWithFallback as a, resolveChannelEntryMatch as i, buildChannelKeyCandidates as n, resolveChannelMatchConfig as o, normalizeChannelSlug as r, resolveNestedAllowlistDecision as s, applyChannelMatchMeta as t };
