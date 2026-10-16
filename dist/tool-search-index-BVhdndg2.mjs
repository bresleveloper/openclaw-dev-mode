import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, w as selectApplicableRuntimeConfig } from "./runtime-snapshot-DYptB0Cf.mjs";
import "./config-CzeZu5J_.mjs";
import { createHash } from "node:crypto";
//#region src/agents/tool-runtime-config.ts
function resolveAgentRuntimeToolConfig(inputConfig) {
	const runtimeConfig = getRuntimeConfigSnapshot() ?? void 0;
	if (!runtimeConfig) return inputConfig;
	if (!inputConfig || inputConfig === runtimeConfig) return runtimeConfig;
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
	if (!runtimeSourceConfig) return inputConfig;
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig,
		runtimeSourceConfig
	});
}
//#endregion
//#region src/agents/tool-search-ranking.ts
/** Collects property names and descriptions from a JSON-Schema-shaped value. */
function readParameterText(parameters, depth = 0) {
	const parts = [];
	collectParameterText(parameters, depth, parts);
	return parts.join(" ");
}
function collectParameterText(parameters, depth, parts) {
	if (depth > 4 || !isRecord(parameters)) return;
	const description = parameters.description;
	if (typeof description === "string" && description) parts.push(description);
	const properties = parameters.properties;
	if (isRecord(properties)) for (const [name, child] of Object.entries(properties)) {
		if (name) parts.push(name);
		collectParameterText(child, depth + 1, parts);
	}
	for (const keyword of [
		"items",
		"anyOf",
		"oneOf",
		"allOf"
	]) {
		const schemas = parameters[keyword];
		for (const child of Array.isArray(schemas) ? schemas : [schemas]) collectParameterText(child, depth + 1, parts);
	}
}
/** BM25 term-frequency saturation. Standard Okapi default. */
const BM25_K1 = 1.2;
/** BM25 length normalization. Standard Okapi default. */
const BM25_B = .75;
const STOPWORDS = /* @__PURE__ */ new Set([
	"a",
	"an",
	"and",
	"are",
	"as",
	"at",
	"be",
	"but",
	"by",
	"can",
	"do",
	"for",
	"from",
	"had",
	"has",
	"have",
	"here",
	"how",
	"i",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"me",
	"my",
	"no",
	"not",
	"of",
	"on",
	"or",
	"our",
	"so",
	"that",
	"the",
	"their",
	"them",
	"then",
	"there",
	"these",
	"they",
	"this",
	"to",
	"up",
	"us",
	"was",
	"we",
	"were",
	"what",
	"when",
	"where",
	"which",
	"who",
	"why",
	"will",
	"with",
	"you",
	"your"
]);
const QUERY_EXPANSIONS = [
	{
		terms: [
			"look",
			"lookup",
			"google",
			"research"
		],
		add: [
			"search",
			"web",
			"find"
		]
	},
	{
		terms: [
			"current",
			"today",
			"latest",
			"now",
			"recent",
			"news",
			"price",
			"weather"
		],
		add: ["search", "web"]
	},
	{
		terms: [
			"url",
			"link",
			"page",
			"article",
			"site",
			"website"
		],
		add: [
			"fetch",
			"web",
			"browse"
		]
	},
	{
		terms: [
			"remember",
			"recall",
			"memory",
			"earlier",
			"previously",
			"discussed",
			"decided"
		],
		add: [
			"memory",
			"recall",
			"history"
		]
	},
	{
		terms: [
			"remind",
			"reminder",
			"later",
			"tomorrow",
			"daily",
			"weekly",
			"recurring"
		],
		add: [
			"schedule",
			"automations",
			"cron",
			"reminder"
		]
	},
	{
		terms: [
			"say",
			"tell",
			"reply",
			"respond",
			"answer"
		],
		add: ["message", "send"]
	},
	{
		terms: [
			"picture",
			"photo",
			"meme",
			"screenshot"
		],
		add: ["image"]
	},
	{
		terms: [
			"speak",
			"say",
			"voice"
		],
		add: ["audio", "speech"]
	},
	{
		terms: [
			"run",
			"execute",
			"command",
			"shell",
			"terminal"
		],
		add: ["exec", "process"]
	},
	{
		terms: [
			"directory",
			"folder",
			"path"
		],
		add: ["file", "list"]
	}
];
function stem(token) {
	let current = token;
	for (let pass = 0; pass < 3; pass += 1) {
		const next = stripOneSuffix(current);
		if (next === current) return current;
		current = next;
	}
	return current;
}
const NON_PLURAL_S_WORDS = /* @__PURE__ */ new Set([
	"news",
	"status",
	"alias",
	"canvas",
	"focus",
	"bonus",
	"virus",
	"atlas",
	"lens",
	"axis",
	"basis",
	"analysis",
	"gas",
	"bus",
	"plus"
]);
/** Suffixes whose stripping can expose a consonant doubled only by inflection. */
const UNDOUBLING_SUFFIXES = /* @__PURE__ */ new Set([
	"ing",
	"ed",
	"er"
]);
/** Doubles that belong to the root ("call", "process", "off", "buzz"). */
const KEPT_DOUBLE_CONSONANTS = /* @__PURE__ */ new Set([
	"l",
	"s",
	"f",
	"z"
]);
function undoubleFinalConsonant(token) {
	const last = token.at(-1);
	if (!last || last !== token.at(-2) || KEPT_DOUBLE_CONSONANTS.has(last) || "aeiou".includes(last) || token.length <= 3) return token;
	return token.slice(0, -1);
}
function stripOneSuffix(token) {
	if (token.length <= 3 || NON_PLURAL_S_WORDS.has(token)) return token;
	for (const suffix of [
		"ies",
		"ing",
		"ed",
		"ly",
		"es",
		"er",
		"s",
		"e"
	]) {
		if (!token.endsWith(suffix) || token.length - suffix.length < 3) continue;
		if (suffix === "s" && token.endsWith("ss")) continue;
		if (suffix === "ies") return `${token.slice(0, -3)}y`;
		const stripped = token.slice(0, -suffix.length);
		return UNDOUBLING_SUFFIXES.has(suffix) ? undoubleFinalConsonant(stripped) : stripped;
	}
	return token;
}
const WORD_SEPARATORS = /[^\p{L}\p{N}_]+/u;
const WORD_PARTS = /\p{Lu}+s?(?![\p{Ll}])|\p{Lu}?\p{Ll}+|\p{N}+/gu;
function splitWords(input) {
	const words = [];
	for (const raw of input.split(WORD_SEPARATORS)) {
		if (!raw) continue;
		words.push(raw.toLowerCase());
		const parts = raw.match(WORD_PARTS) ?? [];
		if (parts.length >= 2) for (const part of parts) words.push(part.toLowerCase());
	}
	return words;
}
function stemVariants(word) {
	if (word.length > 4 && word.endsWith("ies")) {
		const base = word.slice(0, -3);
		return [`${base}y`, stem(`${base}ie`)];
	}
	const stemmed = stem(word);
	return stemmed ? [stemmed] : [];
}
/** Indexable terms for one document, with stopwords dropped and roots collapsed. */
function tokenizeDocument(input) {
	return splitWords(input).filter((word) => !STOPWORDS.has(word)).flatMap(stemVariants);
}
function normalizeTrigger(word) {
	if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
	return word.length > 4 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
}
const NORMALIZED_EXPANSIONS = QUERY_EXPANSIONS.map((group) => ({
	triggers: group.terms.map(normalizeTrigger),
	add: group.add.map(stem)
}));
const EXPANSION_WEIGHT = .35;
/** Query terms: literal words at full weight, expansions discounted. */
function tokenizeQuery(input) {
	const words = splitWords(input).filter((word) => !STOPWORDS.has(word));
	const weights = /* @__PURE__ */ new Map();
	for (const term of words.flatMap(stemVariants)) weights.set(term, 1);
	const triggers = new Set(words.map(normalizeTrigger));
	for (const group of NORMALIZED_EXPANSIONS) {
		if (!group.triggers.some((trigger) => triggers.has(trigger))) continue;
		for (const addition of group.add) weights.set(addition, Math.max(weights.get(addition) ?? 0, EXPANSION_WEIGHT));
	}
	return [...weights].map(([term, weight]) => ({
		term,
		weight
	}));
}
function buildLexicalIndex(documents) {
	const postings = /* @__PURE__ */ new Map();
	const documentCount = documents.length;
	let totalLength = 0;
	documents.forEach((document, position) => {
		const indexed = {
			value: document.value,
			length: document.terms.length,
			position
		};
		for (const term of document.terms) {
			let matches = postings.get(term);
			if (!matches) {
				matches = /* @__PURE__ */ new Map();
				postings.set(term, matches);
			}
			matches.set(indexed, (matches.get(indexed) ?? 0) + 1);
		}
		totalLength += indexed.length;
	});
	return {
		postings,
		documentCount,
		averageLength: documentCount > 0 ? totalLength / documentCount : 0
	};
}
/**
* Okapi BM25; empty queries return no hits. Callers rank literal matches first:
* rare expansions can still outscore a common literal despite their discount.
*/
function scoreLexical(index, queryTerms) {
	if (queryTerms.length === 0 || index.documentCount === 0) return [];
	const total = index.documentCount;
	const results = [];
	for (const { term, weight } of queryTerms) {
		const matches = index.postings.get(term);
		if (!matches) continue;
		const matching = matches.size;
		const idf = Math.log(1 + (total - matching + .5) / (matching + .5));
		for (const [document, frequency] of matches) {
			let result = results[document.position];
			if (!result) {
				result = {
					value: document.value,
					score: 0,
					matchedLiteral: false
				};
				results[document.position] = result;
			}
			if (weight >= 1) result.matchedLiteral = true;
			const normalized = index.averageLength > 0 ? document.length / index.averageLength : 1;
			result.score += weight * (idf * (frequency * 2.2)) / (frequency + BM25_K1 * (.25 + BM25_B * normalized));
		}
	}
	return results.filter((result) => result.score > 0);
}
//#endregion
//#region src/agents/tool-search-index.ts
const indexes = new LruCache(32, {
	maxBytes: 8388608,
	sizeOf: (entry) => entry.bytes
});
function getTextLexicalIndex(documents) {
	const revision = createHash("sha256").update(JSON.stringify(documents)).digest("hex");
	const cached = indexes.get(revision);
	if (cached) return cached.index;
	let bytes = 0;
	const index = Object.freeze(buildLexicalIndex(documents.map((text, value) => {
		const terms = tokenizeDocument(text);
		bytes += text.length * 2 + 64;
		bytes += terms.reduce((size, term) => size + 64 + term.length * 2, 0);
		return {
			value,
			terms
		};
	})));
	indexes.set(revision, {
		index,
		bytes
	});
	return index;
}
//#endregion
export { tokenizeDocument as a, scoreLexical as i, buildLexicalIndex as n, tokenizeQuery as o, readParameterText as r, resolveAgentRuntimeToolConfig as s, getTextLexicalIndex as t };
