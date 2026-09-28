import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { Z as compileConfigRegexes } from "./redact-B5EGyLvV.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { t as getLoadedChannelPluginById } from "./registry-loaded-CYq2sa_C.mjs";
import "./history-BQl9FdG2.mjs";
//#region src/channels/mention-pattern-policy.ts
/**
* Mention-pattern policy resolver.
*
* Applies provider and conversation allow/deny rules to mention pattern matching.
*/
function normalizeIdList(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const next = normalizeOptionalString(value);
		if (next) normalized.add(next);
	}
	return normalized;
}
function isMentionPatternsPolicyConfig(value) {
	return isRecord(value);
}
function resolveProviderMentionPatternsPolicy(cfg, provider) {
	if (!cfg || !provider) return;
	const channelConfig = cfg.channels?.[provider];
	const policy = isRecord(channelConfig) ? channelConfig.mentionPatterns : void 0;
	return isMentionPatternsPolicyConfig(policy) ? policy : void 0;
}
/**
* Resolves provider-scoped mention-pattern policy for a single conversation.
*/
function resolveMentionPatternPolicy(params) {
	const conversationId = normalizeOptionalString(params.conversationId ?? void 0) ?? void 0;
	const providerPolicy = params.providerPolicy ?? resolveProviderMentionPatternsPolicy(params.cfg, params.provider);
	const effectiveMode = providerPolicy?.mode === "allow" || providerPolicy?.mode === "deny" ? providerPolicy.mode : "allow";
	const allowMatched = conversationId != null && normalizeIdList(providerPolicy?.allowIn).has(conversationId);
	const denyMatched = conversationId != null && normalizeIdList(providerPolicy?.denyIn).has(conversationId);
	return {
		effectiveMode,
		allowMatched,
		denyMatched,
		enabled: effectiveMode === "allow" ? !denyMatched : allowMatched && !denyMatched
	};
}
//#endregion
//#region src/auto-reply/reply/mentions.ts
/** Mention matching, stripping, and explicit mention handling for group triggers. */
const NAME_IDENTITY_CHARS = String.raw`\p{L}\p{N}\p{Pc}`;
const NAME_TOKEN_CHARS = String.raw`${NAME_IDENTITY_CHARS}\p{M}`;
const JOINER_CHARS = String.raw`\u200C\u200D`;
const DECORATION_SPACING = String.raw`[${JOINER_CHARS}\s]*`;
const OPTIONAL_JOINER_GAP = String.raw`[${JOINER_CHARS}]*`;
const UNICODE_WORD_CHAR = String.raw`[${NAME_TOKEN_CHARS}${JOINER_CHARS}]`;
const JOINER_RUN = new RegExp(`[${JOINER_CHARS}]+`, "u");
const JOINER_ONLY = new RegExp(`^[${JOINER_CHARS}]+$`, "u");
const OMISSIBLE_DECORATION_CHAR = new RegExp(String.raw`[\p{So}\p{M}\u{1F3FB}-\u{1F3FF}\u200B-\u200F\u202A-\u202E\u2060-\u206F\u{E0020}-\u{E007F}]`, "u");
const EMOJI_PRESENTATION_MARKS = /* @__PURE__ */ new Set(["️", "⃣"]);
const EMOJI_PRESENTATION_BASE = /\p{Emoji}/u;
const NAME_IDENTITY_GRAPHEME = new RegExp(`[${NAME_IDENTITY_CHARS}]`, "u");
const NAME_GRAPHEME_SEGMENTER = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function wrapDerivedMentionPattern(parts) {
	const leading = parts.leading ? `(?:${parts.leading}${DECORATION_SPACING}|)` : "";
	const trailing = parts.trailing ? `(?:${DECORATION_SPACING}${parts.trailing}(?!${UNICODE_WORD_CHAR})|(?!${UNICODE_WORD_CHAR})(?!${DECORATION_SPACING}${parts.trailing}${UNICODE_WORD_CHAR}))` : `(?!${UNICODE_WORD_CHAR})`;
	return `(?:@|(?<!${UNICODE_WORD_CHAR}${leading}))${leading}${parts.core}${trailing}`;
}
function encodeOptionalJoiners(literal) {
	return literal.split(/([\u200C\u200D]+)/u).filter(Boolean).map((part) => JOINER_ONLY.test(part) ? `(?:${escapeRegExp(part)}|)` : escapeRegExp(part)).join("");
}
function escapeJoinerTolerantLiteral(literal) {
	if (Array.from(literal).every((character) => JOINER_ONLY.test(character))) return "";
	return encodeOptionalJoiners(literal);
}
function isEmojiPresentationGrapheme(grapheme) {
	const characters = Array.from(grapheme);
	const first = characters[0];
	return Boolean(first && EMOJI_PRESENTATION_BASE.test(first) && characters.some((character) => EMOJI_PRESENTATION_MARKS.has(character)));
}
function isIdentityGrapheme(grapheme) {
	return NAME_IDENTITY_GRAPHEME.test(grapheme) && !isEmojiPresentationGrapheme(grapheme);
}
function isDecorationGrapheme(grapheme) {
	if (isEmojiPresentationGrapheme(grapheme)) return true;
	return Array.from(grapheme).every((character) => /\s/u.test(character) || JOINER_RUN.test(character) || OMISSIBLE_DECORATION_CHAR.test(character));
}
function parseNameUnits(name) {
	const graphemes = Array.from(NAME_GRAPHEME_SEGMENTER.segment(name), (part) => part.segment);
	const runs = [];
	for (const grapheme of graphemes) {
		const identity = isIdentityGrapheme(grapheme);
		const previous = runs.at(-1);
		if (previous?.identity === identity) previous.literal += grapheme;
		else runs.push({
			identity,
			literal: grapheme
		});
	}
	return runs.map((run) => {
		if (run.identity) return {
			kind: "token",
			literal: run.literal
		};
		const gapGraphemes = Array.from(NAME_GRAPHEME_SEGMENTER.segment(run.literal), (part) => part.segment);
		if (!gapGraphemes.every(isDecorationGrapheme)) return {
			kind: "separator",
			literal: run.literal
		};
		return {
			kind: "decoration",
			literal: run.literal,
			spellings: gapGraphemes.filter((grapheme) => !/^\s+$/u.test(grapheme) && !JOINER_ONLY.test(grapheme)).map(escapeJoinerTolerantLiteral),
			spaced: /\s/u.test(run.literal)
		};
	});
}
function encodeSeparator(unit) {
	return unit.literal.split(/(\s+|[\u200C\u200D]+)/u).filter(Boolean).map((piece) => /^\s+$/u.test(piece) ? String.raw`\s+` : JOINER_ONLY.test(piece) ? encodeOptionalJoiners(piece) : escapeRegExp(piece)).join("");
}
function encodeEdgeDecorationLiteral(unit) {
	if (unit?.kind !== "decoration") return "";
	const spelled = unit.spellings.join(OPTIONAL_JOINER_GAP);
	if (!spelled) return encodeOptionalJoiners(Array.from(unit.literal).filter((character) => JOINER_ONLY.test(character)).join(""));
	return spelled;
}
function encodeInteriorDecoration(unit) {
	const spelled = unit.spellings.join(DECORATION_SPACING);
	if (!spelled) {
		const joiners = encodeOptionalJoiners(Array.from(unit.literal).filter((character) => JOINER_ONLY.test(character)).join(""));
		return unit.spaced ? String.raw`${joiners}\s${DECORATION_SPACING}` : joiners;
	}
	return `(?:${DECORATION_SPACING}${spelled}${DECORATION_SPACING}|\\s${unit.spaced ? "+" : "*"})`;
}
function deriveNameParts(name) {
	const units = parseNameUnits(name);
	if (!units.some((unit) => unit.kind === "token")) return {
		leading: "",
		core: escapeJoinerTolerantLiteral(name),
		trailing: ""
	};
	const start = units[0]?.kind === "decoration" ? 1 : 0;
	const end = units.at(-1)?.kind === "decoration" ? units.length - 1 : units.length;
	let core = "";
	for (const unit of units.slice(start, end)) core += unit.kind === "token" ? escapeJoinerTolerantLiteral(unit.literal) : unit.kind === "separator" ? encodeSeparator(unit) : encodeInteriorDecoration(unit);
	return {
		leading: encodeEdgeDecorationLiteral(units[0]),
		core,
		trailing: encodeEdgeDecorationLiteral(units.at(-1))
	};
}
function deriveMentionPatterns(identity) {
	const patterns = [];
	const name = normalizeOptionalString(identity?.name);
	const parts = name ? deriveNameParts(name) : void 0;
	if (parts?.core) patterns.push(wrapDerivedMentionPattern(parts));
	const emoji = normalizeOptionalString(identity?.emoji);
	const emojiPattern = emoji ? escapeJoinerTolerantLiteral(emoji) : "";
	if (emojiPattern) patterns.push(emojiPattern);
	return patterns;
}
const BACKSPACE_CHAR = "\b";
const mentionMatchRegexCompileCache = /* @__PURE__ */ new Map();
const mentionStripRegexCompileCache = /* @__PURE__ */ new Map();
const MAX_MENTION_REGEX_COMPILE_CACHE_KEYS = 512;
const mentionPatternWarningCache = /* @__PURE__ */ new Set();
const MAX_MENTION_PATTERN_WARNING_KEYS = 512;
const log = createSubsystemLogger("mentions");
function normalizeMentionPattern(pattern) {
	if (!pattern.includes(BACKSPACE_CHAR)) return pattern;
	return pattern.split(BACKSPACE_CHAR).join("\\b");
}
function normalizeMentionPatterns(patterns) {
	return patterns.map(normalizeMentionPattern);
}
function warnRejectedMentionPattern(pattern, flags, reason) {
	const key = `${flags}::${reason}::${pattern}`;
	if (mentionPatternWarningCache.has(key)) return;
	mentionPatternWarningCache.add(key);
	if (mentionPatternWarningCache.size > MAX_MENTION_PATTERN_WARNING_KEYS) {
		mentionPatternWarningCache.clear();
		mentionPatternWarningCache.add(key);
	}
	log.warn("Ignoring unsupported group mention pattern", {
		pattern,
		flags,
		reason
	});
}
function cacheMentionRegexes(cache, cacheKey, regexes) {
	cache.set(cacheKey, regexes);
	if (cache.size > MAX_MENTION_REGEX_COMPILE_CACHE_KEYS) {
		cache.clear();
		cache.set(cacheKey, regexes);
	}
	return [...regexes];
}
function compileMentionPatternsCached(params) {
	if (params.patterns.length === 0) return [];
	const cacheKey = `${params.flags}\u001e${params.patterns.join("")}`;
	const cached = params.cache.get(cacheKey);
	if (cached) return [...cached];
	const compiled = compileConfigRegexes(params.patterns, params.flags);
	if (params.warnRejected) for (const rejected of compiled.rejected) warnRejectedMentionPattern(rejected.pattern, rejected.flags, rejected.reason);
	return cacheMentionRegexes(params.cache, cacheKey, compiled.regexes);
}
function resolveMentionPatterns(cfg, agentId) {
	if (!cfg) return {
		patterns: [],
		unicode: false
	};
	const agentConfig = agentId ? resolveAgentConfig(cfg, agentId) : void 0;
	const agentGroupChat = agentConfig?.groupChat;
	if (agentGroupChat && Object.hasOwn(agentGroupChat, "mentionPatterns")) return {
		patterns: agentGroupChat.mentionPatterns ?? [],
		unicode: false
	};
	const globalGroupChat = cfg.messages?.groupChat;
	if (globalGroupChat && Object.hasOwn(globalGroupChat, "mentionPatterns")) return {
		patterns: globalGroupChat.mentionPatterns ?? [],
		unicode: false
	};
	const derived = deriveMentionPatterns(agentConfig?.identity);
	return {
		patterns: derived,
		unicode: derived.length > 0
	};
}
/** Builds mention regexes from config, agent identity, and channel policy. */
function buildMentionRegexes(cfg, agentId, options) {
	if (!resolveMentionPatternPolicy({
		...options,
		cfg,
		agentId
	}).enabled) return [];
	const resolved = resolveMentionPatterns(cfg, agentId);
	return compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(resolved.patterns),
		flags: resolved.unicode ? "iu" : "i",
		cache: mentionMatchRegexCompileCache,
		warnRejected: true
	});
}
/** Normalizes text before mention matching. */
function normalizeMentionText(text) {
	return normalizeLowercaseStringOrEmpty((text ?? "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, ""));
}
/** Returns true when text matches one of the configured mention patterns. */
function matchesMentionPatterns(text, mentionRegexes) {
	if (mentionRegexes.length === 0) return false;
	const cleaned = normalizeMentionText(text ?? "");
	return mentionRegexes.some((re) => re.test(cleaned));
}
/** Combines regex mention matching with provider-native explicit mention metadata. */
function matchesMentionWithExplicit(params) {
	const cleaned = normalizeMentionText(params.text ?? "");
	const explicit = params.explicit?.isExplicitlyMentioned === true;
	const transcriptCleaned = params.transcript ? normalizeMentionText(params.transcript) : "";
	const textToCheck = cleaned || transcriptCleaned;
	return explicit || params.mentionRegexes.some((re) => re.test(textToCheck));
}
/** Removes structural prompt prefixes before mention stripping. */
function stripStructuralPrefixes(text) {
	if (!text) return "";
	if (text.trimStart().startsWith("[Chat messages since your last reply - for context]") || text.trimStart().startsWith("[Recent chat messages - for context]")) return text.trim();
	const afterMarker = text;
	const afterEnvelope = afterMarker.replace(/^(?:[ \t]*\[[^\]\n]+\][ \t]*)+/, "");
	const senderPrefixPattern = afterEnvelope === afterMarker ? /^[ \t]*(?!\/)[^\n:]{1,120}:\s+/gm : /^[ \t]*[^\n:]{1,120}:\s+/gm;
	const stripped = afterEnvelope.replace(senderPrefixPattern, "").replace(/\\n/g, " ").trim();
	if (stripped.startsWith("/")) return stripped.replace(/[ \t]+/g, " ");
	return stripped.replace(/\s+/g, " ");
}
/** Removes bot mentions from command text before command normalization. */
function stripMentions(text, ctx, cfg, agentId) {
	let result = text;
	const providerId = (ctx.Provider ? normalizeAnyChannelId(ctx.Provider) : null) ?? normalizeOptionalLowercaseString(ctx.Provider) ?? null;
	const providerMentions = providerId ? getLoadedChannelPluginById(providerId)?.mentions : void 0;
	const resolvedPatterns = resolveMentionPatterns(cfg, agentId);
	const configRegexes = compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(resolvedPatterns.patterns),
		flags: resolvedPatterns.unicode ? "giu" : "gi",
		cache: mentionStripRegexCompileCache,
		warnRejected: true
	});
	const providerRegexes = providerMentions?.stripRegexes?.({
		ctx,
		cfg,
		agentId
	}) ?? compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(providerMentions?.stripPatterns?.({
			ctx,
			cfg,
			agentId
		}) ?? []),
		flags: "gi",
		cache: mentionStripRegexCompileCache,
		warnRejected: false
	});
	for (const re of [...configRegexes, ...providerRegexes]) result = result.replace(re, " ");
	if (providerMentions?.stripMentions) result = providerMentions.stripMentions({
		text: result,
		ctx,
		cfg,
		agentId
	});
	result = result.replace(/@[0-9+]{5,}/g, " ");
	return result.replace(/\s+/g, " ").trim();
}
//#endregion
export { stripMentions as a, normalizeMentionText as i, matchesMentionPatterns as n, stripStructuralPrefixes as o, matchesMentionWithExplicit as r, resolveMentionPatternPolicy as s, buildMentionRegexes as t };
