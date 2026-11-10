import { d as normalizeStringEntries, f as normalizeStringEntriesLower, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as extractKeywords } from "./query-expansion-8IlqIzbI.mjs";
import "./memory-core-host-engine-knn--De7HW1q.mjs";
import { n as projectMemorySearchRow, r as resolveSnippetProjection, t as buildMemoryModelFilter } from "./manager-search-shared-DHkMIpCm.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { i as sdkGetNodeSqliteKysely, n as sdkExecuteSqliteQuerySync } from "./sqlite-runtime-COh9hQA9.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import fs from "node:fs";
import { setImmediate } from "node:timers/promises";
//#region extensions/memory-core/src/memory/manager-search-scorer.ts
function createEmbeddingScorer(queryVec) {
	const queryNorms = new Float64Array(queryVec.length + 1);
	let querySquaredNorm = 0;
	for (let i = 0; i < queryVec.length; i += 1) {
		const value = queryVec[i] ?? 0;
		querySquaredNorm += value * value;
		queryNorms[i + 1] = Math.sqrt(querySquaredNorm);
	}
	return (blob) => {
		if (blob.byteLength % 8 !== 0) return 0;
		const view = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
		const count = blob.byteLength / 8;
		const length = Math.min(count, queryVec.length);
		let dot = 0;
		let normB = 0;
		for (let i = 0; i < count; i += 1) {
			const value = view.getFloat64(i * 8, true);
			if (!Number.isFinite(value)) return 0;
			if (i < length) {
				dot += (queryVec[i] ?? 0) * value;
				normB += value * value;
			}
		}
		const normA = queryNorms[length] ?? 0;
		if (normA === 0 || normB === 0) return 0;
		return dot / (normA * Math.sqrt(normB));
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-vector.ts
const FALLBACK_VECTOR_BATCH_SIZE = 256;
function resolveProviderModels(primary, aliases) {
	return Array.from(/* @__PURE__ */ new Set([primary, ...(aliases ?? []).filter(Boolean)]));
}
async function searchVector(params) {
	if (params.queryVec.length === 0 || params.limit <= 0) return [];
	params.signal?.throwIfAborted();
	const providerModels = resolveProviderModels(params.providerModel, params.providerModelAliases);
	const vectorReady = await params.ensureVectorReady(params.queryVec.length);
	params.signal?.throwIfAborted();
	if (vectorReady) {
		if (!params.runVectorKnn) throw new Error("memory vector KNN subprocess is unavailable");
		const response = await params.runVectorKnn({
			vectorTable: params.vectorTable,
			providerModels,
			queryVec: params.queryVec,
			limit: params.limit,
			snippetMaxChars: params.snippetMaxChars,
			sourceFilter: params.sourceFilterVec
		}, params.signal);
		if (!response.fallbackScanRequired) return response.rows.map((row) => projectMemorySearchRow(row, params.snippetMaxChars, 1 - row.dist));
	}
	return await params.runFallback();
}
async function searchChunksByEmbedding(params) {
	if (params.limit <= 0 || params.candidateIds?.length === 0) return [];
	const providerModels = resolveProviderModels(params.providerModel, params.providerModelAliases);
	const projection = `SELECT rowid AS rowid, embedding
  FROM memory_index_chunks
 WHERE ${buildMemoryModelFilter("model", providerModels)}${params.candidateIds ? ` AND id IN (${params.candidateIds.map(() => "?").join(", ")})` : ""}`;
	const ordering = `${params.sourceFilter.sql}\n ORDER BY rowid ASC\n LIMIT ?`;
	const firstStmt = params.db.prepare(`${projection}${ordering}`);
	const stmt = params.db.prepare(`${projection} AND rowid > ?${ordering}`);
	firstStmt.setReadBigInts(true);
	stmt.setReadBigInts(true);
	const snippet = resolveSnippetProjection("text", params.snippetMaxChars);
	const payloadStmt = params.db.prepare(`SELECT id, path, start_line, end_line, ${snippet.sql} AS text, source FROM memory_index_chunks WHERE rowid = ?`);
	const scoreEmbedding = createEmbeddingScorer(params.queryVec);
	const topResults = [];
	let lastRowid;
	while (true) {
		const batch = (lastRowid === void 0 ? firstStmt : stmt).iterate(...providerModels, ...params.candidateIds ?? [], ...lastRowid === void 0 ? [] : [lastRowid], ...params.sourceFilter.params, FALLBACK_VECTOR_BATCH_SIZE);
		let batchSize = 0;
		for (const row of batch) {
			batchSize += 1;
			lastRowid = row.rowid;
			const score = scoreEmbedding(row.embedding);
			const lowest = topResults.at(-1);
			if (Number.isFinite(score) && (topResults.length < params.limit || lowest && score > lowest.score)) {
				const payload = payloadStmt.get(...snippet.params, row.rowid);
				const result = projectMemorySearchRow(payload, params.snippetMaxChars, score);
				if (topResults.length < params.limit) {
					topResults.push(result);
					if (topResults.length === params.limit) topResults.sort((a, b) => b.score - a.score);
				} else {
					topResults[topResults.length - 1] = result;
					topResults.sort((a, b) => b.score - a.score);
				}
			}
		}
		if (batchSize < FALLBACK_VECTOR_BATCH_SIZE) break;
		await setImmediate();
		params.signal?.throwIfAborted();
	}
	topResults.sort((a, b) => b.score - a.score);
	return topResults;
}
//#endregion
//#region extensions/memory-core/src/memory/keyword-query.ts
function tokenizeFtsQuery(raw, includeLeadingMarks = false) {
	const pattern = includeLeadingMarks ? /[\p{L}\p{M}\p{N}_]+/gu : /[\p{L}\p{N}_][\p{L}\p{M}\p{N}_]*/gu;
	return normalizeStringEntries(raw.match(pattern) ?? []);
}
function simpleCaseFold(character) {
	const upper = character.toUpperCase();
	const folded = Array.from(upper).length === 1 ? upper.toLowerCase() : character.toLowerCase();
	return Array.from(folded).length === 1 ? folded : character;
}
const UNICODE61_DIACRITIC = /[\u0300-\u0304\u0306-\u030c\u030f\u0311\u031b\u0323-\u0328\u032d\u032e\u0330\u0331]/u;
const UNICODE61_MARK = /* @__PURE__ */ new RegExp("[̀-ͯ҃-҉֑-ֽֿׁ-ׂׄ-ׇׅؐ-ًؚ-ٰٟۖ-ۜ۟-ۤۧ-۪ۨ-ܑۭܰ-݊ަ-ް߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣঁ-ঃ়া-ৄে-ৈো-্ৗৢ-ৣਁ-ਃ਼ਾ-ੂੇ-ੈੋ-੍ੑੰ-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣଁ-ଃ଼ା-ୄେ-ୈୋ-୍ୖ-ୗୢ-ୣஂா-ூெ-ைொ-்ௗఁ-ఃా-ౄె-ైొ-్ౕ-ౖౢ-ౣಂ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕ-ೖೢ-ೣം-ഃാ-ൄെ-ൈൊ-്ൗൢ-ൣං-ඃ්ා-ුූෘ-ෟෲ-ෳัิ-ฺ็-๎ັິ-ູົ-ຼ່-ໍ༘-༹༙༵༷༾-༿ཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆ါ-ှၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏႚ-ႝ፝-፟ᜒ-᜔ᜲ-᜴ᝒ-ᝓᝲ-ᝳ឴-៓៝᠋-᠍ᢩᤠ-ᤫᤰ-᤻ᦰ-ᧀᧈ-ᧉᨗ-ᨛᩕ-ᩞ᩠-᩿᩼ᬀ-ᬄ᬴-᭄᭫-᭳ᮀ-ᮂᮡ-ᮭ᯦-᯳ᰤ-᰷᳐-᳔᳒-᳨᳭ᳲ-᳴᷀-ᷦ᷼-᷿⃐-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙〯-゚꙯-꙲ꙴ-꙽ꚟ꛰-꛱ꠂ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣠-꣱ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀ꨩ-ꨶꩃꩌ-ꩍꩻꪰꪲ-ꪴꪷ-ꪸꪾ-꪿꫁ꫫ-ꫯꫵ-꫶ꯣ-ꯪ꯬-꯭ﬞ︀-️︠-𐇽︦𐨁-𐨃𐨅-𐨆𐨌-𐨏𐨸-𐨿𐨺𑀀-𑀂𑀸-𑁆𑂀-𑂂𑂰-𑂺𑄀-𑄂𑄧-𑄴𑆀-𑆂𑆳-𑇀𑚫-𑚷𖽑-𖽾𖾏-𖾒𝅥-𝅩𝅭-𝅲𝅻-𝆂𝆅-𝆋𝆪-𝆭𝉂-𝉄󠄀-󠇯]", "u");
function unicode61TokenizerKey(term) {
	let key = "";
	for (const character of term) {
		if (UNICODE61_DIACRITIC.test(character)) continue;
		if (UNICODE61_MARK.test(character)) {
			key += " ";
			continue;
		}
		const decomposed = Array.from(character.normalize("NFD"));
		const base = decomposed[0];
		const foldedBase = base ? simpleCaseFold(base) : void 0;
		if (decomposed.length === 2 && UNICODE61_DIACRITIC.test(decomposed[1] ?? "") && foldedBase && /^[a-z]$/u.test(foldedBase)) {
			key += foldedBase;
			continue;
		}
		key += simpleCaseFold(character);
	}
	return key.replace(/ +/g, " ").trim();
}
function canonicalTermForms(term, tokenizer) {
	if (!tokenizer) return [term];
	const seen = /* @__PURE__ */ new Set();
	return [
		term,
		term.normalize("NFC"),
		term.normalize("NFD")
	].filter((form) => {
		const key = tokenizer === "unicode61" ? unicode61TokenizerKey(form) : Array.from(form, simpleCaseFold).join("");
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function buildMatchQueryFromTerms(terms, canonicalTokenizer, matchAny = false) {
	if (terms.length === 0) return null;
	return uniqueStrings(terms).map((term) => {
		const alternatives = canonicalTermForms(term, canonicalTokenizer).map((form) => `"${form.replaceAll("\"", "")}"`);
		return alternatives.length === 1 ? alternatives[0] : `(${alternatives.join(" OR ")})`;
	}).join(matchAny ? " OR " : " AND ");
}
function planKeywordSearch(params) {
	const canonicalTokenizer = params.canonicalVariants ? params.ftsTokenizer ?? "unicode61" : void 0;
	const tokens = tokenizeFtsQuery(params.query, params.ftsTokenizer === "trigram" && params.includeLeadingMarks);
	if (params.matchAny) {
		const key = (term) => Array.from(term.normalize("NFC"), simpleCaseFold).join("");
		const seen = new Set(tokens.map(key));
		const expanded = extractKeywords(params.query.normalize("NFC"), params).slice(0, 6);
		for (const token of tokenizeFtsQuery(expanded.join(" "))) if (!seen.has(key(token))) {
			seen.add(key(token));
			tokens.push(token);
		}
	}
	if (params.ftsTokenizer !== "trigram") return {
		matchQuery: buildMatchQueryFromTerms(tokens, canonicalTokenizer, params.matchAny),
		substringTerms: [],
		tokens
	};
	const matchTerms = [];
	const substringTerms = [];
	for (const token of tokens) if (canonicalTermForms(token, canonicalTokenizer).some((form) => Array.from(form).length < 3)) substringTerms.push(token);
	else matchTerms.push(token);
	return {
		matchQuery: buildMatchQueryFromTerms(matchTerms, canonicalTokenizer, params.matchAny),
		substringTerms,
		tokens
	};
}
function bm25RankToScore(rank) {
	if (!Number.isFinite(rank)) return 1 / 1e3;
	if (rank < 0) {
		const relevance = -rank;
		return relevance / (1 + relevance);
	}
	return 1 / (1 + rank);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search.ts
const EXACT_PATH_SPECIFICITY_SQL_FUNCTION = "openclaw_memory_exact_path_specificity";
const NORMALIZED_CONTAINS_SQL_FUNCTION = "openclaw_memory_normalized_contains";
function loadKeywordRowsWithFallback(plan, loadRows, fallbackTokens, warning) {
	if (plan.matchQuery) try {
		return {
			rows: loadRows(plan.matchQuery, plan.substringTerms),
			usedMatch: true
		};
	} catch (error) {
		console.warn(`${warning}: ${String(error)}`);
		return {
			rows: loadRows(null, uniqueStrings([...fallbackTokens(), ...plan.substringTerms])),
			usedMatch: false
		};
	}
	return {
		rows: loadRows(null, plan.substringTerms),
		usedMatch: false
	};
}
function mergePathKeywordScores(target, hit) {
	target.pathScore = Math.max(target.pathScore, hit.pathScore);
	target.score = Math.max(target.score, hit.score);
	target.exactPathSpecificity = Math.max(target.exactPathSpecificity, hit.exactPathSpecificity);
}
function comparePathKeywordSearchResults(left, right) {
	const specificityDelta = right.exactPathSpecificity - left.exactPathSpecificity;
	if (specificityDelta !== 0) return specificityDelta;
	if (left.exactPathSpecificity === 0) {
		const pathDelta = right.pathScore - left.pathScore;
		if (pathDelta !== 0) return pathDelta;
	}
	return left.path.localeCompare(right.path) || left.startLine - right.startLine || left.id.localeCompare(right.id);
}
function normalizeSearchTokens(raw) {
	return normalizeStringEntriesLower(tokenizeFtsQuery(raw.normalize("NFC")));
}
function literalSearchMatcher(value, whole = false) {
	const literal = escapeRegExp(value.normalize("NFC"));
	return new RegExp(whole ? `^(?:${literal})$` : literal, "iu");
}
function scoreFallbackKeywordResult(params) {
	const { queryMatchers } = params;
	if (queryMatchers.length === 0) return params.ftsScore;
	const textTokens = normalizeSearchTokens(params.text);
	const textTokenSet = new Set(textTokens);
	const overlap = queryMatchers.filter(({ word }) => textTokens.some((token) => word.test(token))).length;
	const uniqueQueryOverlap = overlap / queryMatchers.length;
	const density = overlap / Math.max(textTokenSet.size, 1);
	const normalizedPath = params.path.normalize("NFC");
	const pathBoost = queryMatchers.reduce((score, { substring }) => score + (substring.test(normalizedPath) ? .18 : 0), 0);
	const textLengthBoost = Math.min(params.text.length / 160, .18);
	const lexicalBoost = uniqueQueryOverlap * .45 + density * .2 + pathBoost + textLengthBoost;
	return (params.ftsScore + lexicalBoost) / (1 + lexicalBoost);
}
function escapeLikePattern(term) {
	return term.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
function isAscii(value) {
	return !/[^\p{ASCII}]/u.test(value);
}
function resolveUnicodeCandidateAnchors(value) {
	const firstNonAsciiCodePoint = Array.from(value).find((codePoint) => !isAscii(codePoint));
	if (!firstNonAsciiCodePoint) return [];
	return [.../* @__PURE__ */ new Set([
		firstNonAsciiCodePoint,
		firstNonAsciiCodePoint.toLowerCase(),
		firstNonAsciiCodePoint.toUpperCase()
	])];
}
function normalizePathIdentifier(value) {
	return value.trim().replaceAll("\\", "/").replace(/^\.\//, "").normalize("NFC").toLowerCase();
}
function prepareExactPathMatcher(query) {
	const normalizedQuery = normalizePathIdentifier(query);
	if (!normalizedQuery || normalizedQuery === ".") return () => 0;
	const hasDirectory = normalizedQuery.includes("/");
	return (candidatePath) => {
		const normalizedPath = normalizePathIdentifier(candidatePath);
		if (normalizedQuery === normalizedPath) return 3;
		if (hasDirectory) return 0;
		const basename = normalizedPath.split("/").at(-1) ?? normalizedPath;
		if (normalizedQuery === basename) return 2;
		const extensionIndex = basename.lastIndexOf(".");
		const stem = extensionIndex > 0 ? basename.slice(0, extensionIndex) : basename;
		return normalizedQuery === stem ? 1 : 0;
	};
}
function registerSubstringSqlFunction(db, terms) {
	const matchers = new Map(terms.map((term) => [term, literalSearchMatcher(term)]));
	db.function(NORMALIZED_CONTAINS_SQL_FUNCTION, { deterministic: true }, (value, query) => typeof value === "string" && typeof query === "string" ? Number(matchers.get(query)?.test(value.normalize("NFC")) === true) : 0);
}
function buildSubstringFilter(terms, column, matchAny = false) {
	if (terms.length === 0) return "";
	return ` AND (${terms.map(() => `${NORMALIZED_CONTAINS_SQL_FUNCTION}(${column}, ?) = 1`).join(matchAny ? " OR " : " AND ")})`;
}
function buildExactPathCandidatePatterns(query) {
	const normalized = query.trim().replaceAll("\\", "/").replace(/^\.\//, "");
	if (!normalized || normalized === ".") return [];
	const canonicalForms = [normalized.normalize("NFC"), normalized.normalize("NFD")];
	const forms = new Set(canonicalForms);
	if (!isAscii(normalized)) for (const form of canonicalForms) {
		forms.add(form.toLowerCase());
		forms.add(form.toUpperCase());
	}
	const patterns = /* @__PURE__ */ new Set();
	for (const form of forms) {
		const escaped = escapeLikePattern(form);
		if (normalized.includes("/")) {
			patterns.add(escaped);
			continue;
		}
		patterns.add(escaped);
		patterns.add(`${escaped}.%`);
		patterns.add(`%/${escaped}`);
		patterns.add(`%/${escaped}.%`);
	}
	if (!isAscii(normalized)) {
		const asciiAnchor = normalized.normalize("NFD").toLowerCase().match(/[a-z0-9_]+/g)?.toSorted((left, right) => right.length - left.length)[0];
		if (asciiAnchor) patterns.add(`%${escapeLikePattern(asciiAnchor)}%`);
		if (normalized.toLowerCase() !== normalized.toUpperCase()) for (const anchor of resolveUnicodeCandidateAnchors(normalized)) patterns.add(`%${escapeLikePattern(anchor)}%`);
	}
	return [...patterns];
}
function planPathKeywordSearch(params) {
	const forms = params.ftsTokenizer === "trigram" ? /* @__PURE__ */ new Set([params.query.normalize("NFC"), params.query.normalize("NFD")]) : /* @__PURE__ */ new Set([params.query]);
	const seen = /* @__PURE__ */ new Set();
	const plans = [];
	const addPlan = (query, plan) => {
		const key = JSON.stringify([plan.matchQuery, plan.substringTerms]);
		if (!seen.has(key)) {
			seen.add(key);
			plans.push({
				query,
				...plan
			});
		}
	};
	for (const query of forms) addPlan(query, planKeywordSearch({
		...params,
		query,
		includeLeadingMarks: true
	}));
	if (params.ftsTokenizer !== "trigram") for (const query of /* @__PURE__ */ new Set([params.query.normalize("NFC"), params.query.normalize("NFD")])) {
		const tokens = tokenizeFtsQuery(query, true);
		const substringTerms = tokens.filter((token) => !isAscii(token));
		if (substringTerms.length > 0) addPlan(query, {
			matchQuery: buildMatchQueryFromTerms(tokens.filter(isAscii)),
			substringTerms
		});
	}
	return plans;
}
async function searchKeyword(params) {
	if (params.limit <= 0) return [];
	const plan = planKeywordSearch({
		query: params.query,
		ftsTokenizer: params.ftsTokenizer,
		canonicalVariants: true,
		matchAny: params.matchAny
	});
	if (!plan.matchQuery && plan.substringTerms.length === 0) return [];
	const liveChunkClause = ` AND EXISTS (SELECT 1 FROM memory_index_chunks c WHERE c.id = ${params.ftsTable}.id)`;
	const loadRows = (matchQuery, terms) => {
		const filter = buildSubstringFilter(terms, "text", params.matchAny);
		if (terms.length > 0) registerSubstringSqlFunction(params.db, terms);
		const matchClause = matchQuery ? `${params.ftsTable} MATCH ? AND ${params.ftsTable}.rank MATCH 'bm25()'` : "1=1";
		const columns = "id, path, source, start_line, end_line, text";
		const ranked = `SELECT ${columns}, ${params.ftsTable}.rank AS rank
      FROM ${params.ftsTable}
      WHERE ${matchClause}${liveChunkClause}${params.sourceFilter.sql}
      ORDER BY rank ASC LIMIT ?`;
		const mixedOr = params.matchAny && matchQuery && terms.length > 0;
		const sql = mixedOr ? `WITH matches AS MATERIALIZED (${ranked}), substrings AS (
           SELECT ${columns}, NULL AS rank FROM ${params.ftsTable}
           WHERE 1=1${filter}${liveChunkClause}${params.sourceFilter.sql}
             AND id NOT IN (SELECT id FROM matches)
           LIMIT max(0, ? - (SELECT count(*) FROM matches))
         )
         SELECT * FROM matches UNION ALL SELECT * FROM substrings
         ORDER BY rank ASC NULLS LAST` : `SELECT ${columns}, ${matchQuery ? `${params.ftsTable}.rank` : "NULL"} AS rank
         FROM ${params.ftsTable}
         WHERE ${matchClause}${filter}${liveChunkClause}${params.sourceFilter.sql}
         ${matchQuery ? "ORDER BY rank ASC" : ""} LIMIT ?`;
		return params.db.prepare(sql).all(...matchQuery ? [matchQuery] : [], ...mixedOr ? [...params.sourceFilter.params, params.limit] : [], ...terms, ...params.sourceFilter.params, params.limit);
	};
	const { rows, usedMatch } = loadKeywordRowsWithFallback(plan, loadRows, () => plan.tokens, "memory search: FTS5 MATCH failed, falling back to substring search");
	const queryMatchers = params.boostFallbackRanking ? uniqueStrings(normalizeSearchTokens(params.query)).map((token) => ({
		word: literalSearchMatcher(token, true),
		substring: literalSearchMatcher(token)
	})) : [];
	return rows.map((row) => {
		const textScore = usedMatch && row.rank !== null ? bm25RankToScore(row.rank) : 0;
		const score = params.boostFallbackRanking ? scoreFallbackKeywordResult({
			queryMatchers,
			path: row.path,
			text: row.text,
			ftsScore: textScore
		}) : textScore;
		return Object.assign(projectMemorySearchRow(row, params.snippetMaxChars, score), {
			textScore,
			hasBodyMatch: true
		});
	});
}
async function searchKeywordWithFallback(params) {
	const runBody = (matchAny = false) => searchKeyword({
		...params.body,
		db: params.db,
		matchAny
	}).then((rows) => ({
		rows,
		error: void 0
	})).catch((error) => ({
		rows: [],
		error: formatErrorMessage(error)
	}));
	let body = await runBody();
	const path = await searchPathKeyword({
		...params.path,
		db: params.db
	}).then((rows) => ({
		rows,
		error: void 0
	})).catch((error) => ({
		rows: [],
		error: formatErrorMessage(error)
	}));
	if (body.rows.length === 0 && path.rows.length === 0 && !body.error && !path.error) body = await runBody(true);
	return {
		body,
		path
	};
}
async function searchPathKeyword(params) {
	if (params.limit <= 0) return [];
	const snippet = resolveSnippetProjection("c.text", params.snippetMaxChars);
	const pathColumn = `${params.pathFtsTable}.path`;
	const pathPlans = planPathKeywordSearch({
		query: params.query,
		ftsTokenizer: params.ftsTokenizer
	});
	const plan = pathPlans[0] ?? {
		query: params.query,
		matchQuery: null,
		substringTerms: []
	};
	const planSubstringFilter = buildSubstringFilter(plan.substringTerms, pathColumn);
	registerSubstringSqlFunction(params.db, plan.substringTerms);
	const matchExactPath = prepareExactPathMatcher(params.query);
	params.db.function(EXACT_PATH_SPECIFICITY_SQL_FUNCTION, { deterministic: true }, (candidatePath) => typeof candidatePath === "string" ? matchExactPath(candidatePath) : 0);
	const projectPathRow = (row, pathScore, exactPathSpecificity = matchExactPath(row.path)) => Object.assign(projectMemorySearchRow(row, params.snippetMaxChars, pathScore), {
		textScore: 0,
		pathScore,
		exactPathSpecificity,
		hasBodyMatch: false
	});
	const projectFirstChunks = (paths, score, direction) => `SELECT c.id, ${paths}.path, ${paths}.source,\n       c.start_line, c.end_line, ${snippet.sql} AS text, ${paths}.${score}\n  FROM ${paths}\n  CROSS JOIN memory_index_chunks c INDEXED BY sqlite_autoindex_memory_index_chunks_1 ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate INDEXED BY idx_memory_index_chunks_path_source\n     WHERE candidate.path = ${paths}.path\n       AND candidate.source = ${paths}.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n ORDER BY ${paths}.${score} ${direction}, ${paths}.path ASC, ${paths}.source ASC`;
	const hasExplicitExactPathHeadroom = params.exactPathLimit !== void 0;
	const exactPathLimit = Math.max(0, Math.floor(params.exactPathLimit ?? params.limit));
	const exactCandidatePatterns = buildExactPathCandidatePatterns(params.query);
	const loadExactRows = (useLexicalCandidates) => {
		const qualifiedPatternClause = exactCandidatePatterns.map(() => `${pathColumn} LIKE ? ESCAPE '\\'`).join(" OR ");
		const candidateCtes = useLexicalCandidates ? `candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE ${plan.matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${planSubstringFilter}${params.sourceFilter.sql}\n), pattern_candidates AS MATERIALIZED (\n  SELECT path, source FROM candidates\n   WHERE (${exactCandidatePatterns.map(() => "path LIKE ? ESCAPE '\\'").join(" OR ")})\n)` : `pattern_candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE (${qualifiedPatternClause})${params.sourceFilter.sql}\n)`;
		const candidateParams = useLexicalCandidates ? [
			...plan.matchQuery ? [plan.matchQuery] : [],
			...plan.substringTerms,
			...params.sourceFilter.params,
			...exactCandidatePatterns
		] : [...exactCandidatePatterns, ...params.sourceFilter.params];
		return params.db.prepare(`WITH ${candidateCtes}, scored_paths AS MATERIALIZED (\n  SELECT path, source,\n         ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(path) AS exact_path_specificity\n    FROM pattern_candidates\n), exact_paths AS MATERIALIZED (\n  SELECT path, source, exact_path_specificity FROM scored_paths\n   WHERE exact_path_specificity > 0\n     AND EXISTS (SELECT 1 FROM memory_index_chunks live\n                  WHERE live.path = scored_paths.path\n                    AND live.source = scored_paths.source)\n   ORDER BY exact_path_specificity DESC, path ASC, source ASC\n   LIMIT ?\n)\n` + projectFirstChunks("exact_paths", "exact_path_specificity", "DESC")).all(...candidateParams, exactPathLimit, ...snippet.params);
	};
	const useLexicalExactCandidates = isAscii(params.query) && (plan.matchQuery !== null || plan.substringTerms.length > 0);
	let exactRows = [];
	if (exactCandidatePatterns.length > 0 && exactPathLimit > 0) try {
		exactRows = loadExactRows(useLexicalExactCandidates);
	} catch (err) {
		if (!useLexicalExactCandidates) throw err;
		exactRows = loadExactRows(false);
	}
	const exactResults = exactRows.map((row) => projectPathRow(row, 0, row.exact_path_specificity));
	if (!pathPlans.some((entry) => entry.matchQuery || entry.substringTerms.length > 0)) return exactResults;
	const loadFilteredLexicalRows = (matchQuery, terms, specificity, resultLimit) => {
		const filter = buildSubstringFilter(terms, pathColumn);
		const qualifiedSpecificityClause = ` AND ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(${pathColumn}) ${specificity === "exact" ? ">" : "="} 0`;
		const queryParams = [
			...matchQuery ? [matchQuery] : [],
			...terms,
			...params.sourceFilter.params
		];
		return params.db.prepare(`WITH retained_paths AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source,\n         ${matchQuery ? `bm25(${params.pathFtsTable})` : "0"} AS rank\n    FROM ${params.pathFtsTable}\n   WHERE ${matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${filter}${params.sourceFilter.sql}${qualifiedSpecificityClause}\n     AND EXISTS (SELECT 1 FROM memory_index_chunks live\n                  WHERE live.path = ${params.pathFtsTable}.path\n                    AND live.source = ${params.pathFtsTable}.source)\n   ORDER BY rank ASC, ${params.pathFtsTable}.path ASC, ${params.pathFtsTable}.source ASC\n   LIMIT ?\n)\n` + projectFirstChunks("retained_paths", "rank", "ASC")).all(...queryParams, resultLimit, ...snippet.params);
	};
	const loadLexicalRows = (lexicalPlan) => {
		const loadPartitions = (matchQuery, terms) => {
			registerSubstringSqlFunction(params.db, terms);
			return [...exactPathLimit > 0 ? loadFilteredLexicalRows(matchQuery, terms, "exact", exactPathLimit) : [], ...loadFilteredLexicalRows(matchQuery, terms, "non-exact", params.limit)];
		};
		return loadKeywordRowsWithFallback(lexicalPlan, loadPartitions, () => tokenizeFtsQuery(lexicalPlan.query, true), "memory search: path FTS5 MATCH failed, falling back to substring search");
	};
	const lexicalById = /* @__PURE__ */ new Map();
	for (const lexicalPlan of pathPlans) {
		if (!lexicalPlan.matchQuery && lexicalPlan.substringTerms.length === 0) continue;
		const { rows, usedMatch } = loadLexicalRows(lexicalPlan);
		for (const row of rows) {
			const result = projectPathRow(row, usedMatch ? bm25RankToScore(row.rank) : 1);
			const existing = lexicalById.get(result.id);
			if (!existing) {
				lexicalById.set(result.id, result);
				continue;
			}
			mergePathKeywordScores(existing, result);
		}
	}
	const byId = new Map(exactResults.map((entry) => [entry.id, entry]));
	let nonExactCount = 0;
	for (const entry of [...lexicalById.values()].toSorted(comparePathKeywordSearchResults)) {
		const exact = byId.get(entry.id);
		if (entry.exactPathSpecificity > 0) {
			if (!exact) continue;
			mergePathKeywordScores(exact, entry);
			continue;
		}
		if (nonExactCount >= params.limit) continue;
		byId.set(entry.id, entry);
		nonExactCount += 1;
	}
	const resultLimit = hasExplicitExactPathHeadroom ? exactPathLimit + params.limit : params.limit;
	return [...byId.values()].toSorted(comparePathKeywordSearchResults).slice(0, resultLimit);
}
//#endregion
//#region extensions/memory-core/src/memory/source-filter.ts
function buildMemorySourceFilter(alias, sources) {
	if (sources.length === 0) return {
		sql: "",
		params: []
	};
	return {
		sql: ` AND ${alias ? `${alias}.source` : "source"} IN (${sources.map(() => "?").join(", ")})`,
		params: [...sources]
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-status-state.ts
function collectMemoryStatusSnapshot(db, databasePath, query) {
	const filter = buildMemorySourceFilter(void 0, query.sources);
	const aggregate = collectMemoryStatusAggregate({
		db,
		sources: query.sources,
		sourceFilterSql: filter.sql,
		sourceFilterParams: filter.params,
		includeChunkBytes: query.includeStorage
	});
	const storage = query.includeStorage ? collectMemoryStorageStatus(db, databasePath) : void 0;
	return {
		aggregate,
		storage,
		cacheEntries: storage?.embeddingCacheEntries ?? (db && query.cacheEnabled ? Number(db.prepare("SELECT COUNT(*) as c FROM memory_embedding_cache").get()?.c ?? 0) : 0)
	};
}
/** Read only for explicit diagnostics: retained cache payloads can be large even when disabled. */
function collectMemoryStorageStatus(db, databasePath) {
	const query = db ? sdkGetNodeSqliteKysely(db).selectFrom("memory_embedding_cache").select((eb) => [eb.fn.countAll().as("entries"), eb.fn.coalesce(eb.fn.sum(eb.fn("octet_length", ["embedding"])), eb.val(0)).as("bytes")]) : void 0;
	const cache = db && query ? sdkExecuteSqliteQuerySync(db, query).rows[0] : {
		bytes: 0,
		entries: 0
	};
	const pageSize = db ? Number(db.prepare("PRAGMA page_size").get()?.page_size) : 0;
	const freePages = db ? Number(db.prepare("PRAGMA freelist_count").get()?.freelist_count) : 0;
	return {
		databaseBytes: fs.statSync(databasePath, { throwIfNoEntry: false })?.size ?? 0,
		walBytes: fs.statSync(`${databasePath}-wal`, { throwIfNoEntry: false })?.size ?? 0,
		reusableBytes: freePages * pageSize,
		embeddingCacheBytes: cache.bytes,
		embeddingCacheEntries: cache.entries
	};
}
function resolveStatusProviderInfo(params) {
	if (params.provider) return {
		provider: params.provider.id,
		model: params.provider.model,
		searchMode: "hybrid"
	};
	if (params.providerInitialized) return {
		provider: "none",
		model: void 0,
		searchMode: "fts-only"
	};
	return {
		provider: params.requestedProvider,
		model: params.resolveConfiguredModel?.() || void 0,
		searchMode: "hybrid"
	};
}
function collectMemoryStatusAggregate(params) {
	const totals = {
		files: 0,
		chunks: 0
	};
	const emptyCounts = {
		...totals,
		...params.includeChunkBytes ? { chunkBytes: 0 } : {}
	};
	const bySource = /* @__PURE__ */ new Map();
	const chunkBytes = params.includeChunkBytes ? "COALESCE(SUM(octet_length(text) + octet_length(embedding)), 0)" : "NULL";
	const sourceFilterSql = params.sourceFilterSql ?? "";
	const query = `SELECT 'files' AS kind, source, COUNT(*) as c, 0 AS bytes FROM memory_index_sources WHERE 1=1${sourceFilterSql} GROUP BY source\nUNION ALL\nSELECT 'chunks' AS kind, source, COUNT(*) as c, ${chunkBytes} AS bytes FROM memory_index_chunks WHERE 1=1${sourceFilterSql} GROUP BY source`;
	const filterParams = params.sourceFilterParams ?? [];
	const rows = params.db?.prepare(query).all(...filterParams, ...filterParams);
	for (const row of rows ?? []) {
		const entry = bySource.get(row.source) ?? { ...emptyCounts };
		entry[row.kind] = row.c;
		totals[row.kind] += row.c;
		if (row.kind === "chunks" && row.bytes !== null) entry.chunkBytes = row.bytes;
		bySource.set(row.source, entry);
	}
	return {
		...totals,
		sourceCounts: Array.from(params.sources, (source) => Object.assign({
			source,
			...emptyCounts
		}, bySource.get(source)))
	};
}
//#endregion
export { searchKeywordWithFallback as a, prepareExactPathMatcher as i, resolveStatusProviderInfo as n, searchChunksByEmbedding as o, buildMemorySourceFilter as r, searchVector as s, collectMemoryStatusSnapshot as t };
