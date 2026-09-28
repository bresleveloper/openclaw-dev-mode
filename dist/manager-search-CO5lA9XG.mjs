import { d as normalizeStringEntries, f as normalizeStringEntriesLower, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as MEMORY_INDEX_VECTOR_TABLE } from "./memory-schema-CkxujvZk.mjs";
import { n as decodeMemoryEmbedding, t as cosineSimilarity } from "./embedding-vector-CGPWflQ5.mjs";
import "./memory-core-host-engine-knn-Dps9fjJT.mjs";
import { o as readMemoryRecallMetadata } from "./engine-storage-8YoODh2M.mjs";
import "./memory-core-host-engine-storage-BwYLAX9e.mjs";
import { a as listMemoryFiles, l as runMemoryHostTasksWithConcurrency, t as buildFileEntry } from "./internal-CDL7w83q.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as readMemorySourceHash } from "./manager-source-index-kernel-Bb4WOObH.mjs";
import { a as resolvePersistedMemoryVectorIndexState, r as memoryTableExists } from "./manager-vector-rebuild-state-anPytK-9.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
//#region extensions/memory-core/src/memory/keyword-query.ts
function buildFtsQuery(raw) {
	const tokens = normalizeStringEntries(raw.match(/[\p{L}\p{N}_]+/gu) ?? []);
	if (tokens.length === 0) return null;
	return tokens.map((t) => `"${t.replaceAll("\"", "")}"`).join(" AND ");
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
//#region extensions/memory-core/src/memory/manager-source-state.ts
/** Resolve exactly the entries eligible for indexing, including validated multimodal files. */
async function resolveMemorySourceFileEntries(params) {
	const files = await (params.files?.listFiles ?? listMemoryFiles)(params.workspaceDir, params.settings.extraPaths, params.settings.multimodal, params.onSkippedSymlinkRoot);
	return (await runMemoryHostTasksWithConcurrency(files.map((file) => async () => await (params.files?.inspectFile ?? buildFileEntry)(file, params.workspaceDir, params.settings.multimodal)), params.concurrency)).filter((entry) => entry !== null);
}
/** Compare a resolved source snapshot with the persisted index without writing either side. */
function hasMemorySourceDrift(params) {
	const indexedByPath = new Map(params.indexedRows.map((row) => [row.path, row]));
	if (indexedByPath.size !== params.entries.length) return true;
	return params.entries.some((entry) => indexedByPath.get(entry.path)?.hash !== entry.hash);
}
async function inspectMemorySourceState(params) {
	const skippedRoots = /* @__PURE__ */ new Set();
	const entries = await resolveMemorySourceFileEntries({
		...params,
		onSkippedSymlinkRoot: (root) => skippedRoots.add(root)
	});
	return {
		source: "memory",
		dirty: hasMemorySourceDrift({
			entries,
			indexedRows: loadMemorySourceFileState({
				db: params.db,
				source: "memory"
			})
		}),
		eligible: entries.length,
		issues: [...entries.length === 0 ? ["no eligible memory files found"] : [], ...Array.from(skippedRoots, (root) => `extra path "${root}" is a symlink root; symlinked roots are not traversed, so configure its canonical absolute directory instead`)]
	};
}
function loadMemorySourceFileState(params) {
	let query = getNodeSqliteKysely(params.db).selectFrom("memory_index_sources").select([
		"path",
		"hash",
		"mtime",
		"size"
	]).where("source", "=", params.source);
	if (params.paths) query = query.where("path", "in", sqliteStringSet(params.paths));
	return executeSqliteQuerySync(params.db, query).rows;
}
function resolveMemorySourceExistingHash(params) {
	if (params.existingHashes) return params.existingHashes.get(params.path);
	return readMemorySourceHash(params.db, params.source, params.path);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-retrieval-read.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
function readMemoryIndexMetadata(db) {
	const row = db.prepare("SELECT value FROM memory_index_meta WHERE key = ?").get(MEMORY_INDEX_META_KEY);
	if (typeof row?.value !== "string" || !row.value) return {
		meta: null,
		serialized: null
	};
	try {
		return {
			meta: JSON.parse(row.value),
			serialized: row.value
		};
	} catch {
		return {
			meta: null,
			serialized: null
		};
	}
}
function readMemoryRetrievalIndexState(db) {
	const { meta } = readMemoryIndexMetadata(db);
	const hasIndexedChunks = db.prepare("SELECT 1 FROM memory_index_chunks LIMIT 1").get() !== void 0;
	return {
		meta,
		hasIndexedChunks,
		hasFtsContent: !hasIndexedChunks && memoryTableExists(db, "memory_index_chunks_fts") && db.prepare(`SELECT 1 FROM memory_index_chunks_fts LIMIT 1`).get() !== void 0,
		vectorState: meta && meta.provider !== "none" ? resolvePersistedMemoryVectorIndexState({
			db,
			vectorTable: MEMORY_INDEX_VECTOR_TABLE,
			metaVectorDims: meta.vectorDims,
			hasSemanticChunks: db.prepare("SELECT 1 FROM memory_index_chunks WHERE model != 'fts-only' LIMIT 1").get() !== void 0
		}) : { state: "empty" }
	};
}
function readMemoryRecallData(db, request) {
	const rows = readMemoryRecallMetadata(db, request.candidates.map((entry) => entry.id));
	const sourceMtimes = {
		memory: /* @__PURE__ */ new Map(),
		sessions: /* @__PURE__ */ new Map()
	};
	for (const source of ["sessions", "memory"]) {
		if (source === "memory" && !request.includeMemoryMtimes) continue;
		const paths = Array.from(new Set(request.candidates.filter((entry) => entry.source === source && rows.has(entry.id)).map((entry) => entry.path)));
		if (paths.length > 0) sourceMtimes[source] = new Map(loadMemorySourceFileState({
			db,
			source,
			paths
		}).map((row) => [row.path, row.mtime]));
	}
	return {
		rows,
		sourceMtimes
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-shared.ts
function resolveSnippetProjection(column, snippetMaxChars) {
	const snippetByteLimit = Number.isSafeInteger(snippetMaxChars) && snippetMaxChars > 0 ? snippetMaxChars * 4 : void 0;
	return {
		sql: snippetByteLimit === void 0 ? column : `COALESCE(CAST(substr(CAST(${column} AS BLOB), 1, ?) AS TEXT), ${column})`,
		params: snippetByteLimit === void 0 ? [] : [snippetByteLimit]
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-vector.ts
const FALLBACK_VECTOR_BATCH_SIZE = 256;
function yieldToEventLoop() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function resolveProviderModels(primary, aliases) {
	return Array.from(/* @__PURE__ */ new Set([primary, ...(aliases ?? []).filter(Boolean)]));
}
function buildModelFilter(column, models) {
	return models.length === 1 ? `${column} = ?` : `${column} IN (${models.map(() => "?").join(", ")})`;
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
		if (response.fallbackScanRequired) return await params.runFallback();
		return response.rows.map((row) => ({
			id: row.id,
			path: row.path,
			startLine: row.start_line,
			endLine: row.end_line,
			score: 1 - row.dist,
			snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
			source: row.source
		}));
	}
	return await params.runFallback();
}
async function searchChunksByEmbedding(params) {
	if (params.limit <= 0) return [];
	const providerModels = resolveProviderModels(params.providerModel, params.providerModelAliases);
	const projection = `SELECT rowid AS rowid, embedding
  FROM memory_index_chunks
 WHERE ${buildModelFilter("model", providerModels)}`;
	const ordering = `${params.sourceFilter.sql}\n ORDER BY rowid ASC\n LIMIT ?`;
	const firstStmt = params.db.prepare(`${projection}${ordering}`);
	const stmt = params.db.prepare(`${projection} AND rowid > ?${ordering}`);
	firstStmt.setReadBigInts(true);
	stmt.setReadBigInts(true);
	const snippet = resolveSnippetProjection("text", params.snippetMaxChars);
	const payloadStmt = params.db.prepare(`SELECT id, path, start_line, end_line, ${snippet.sql} AS text, source FROM memory_index_chunks WHERE rowid = ?`);
	const topResults = [];
	let lastRowid;
	while (true) {
		const batch = lastRowid === void 0 ? firstStmt.iterate(...providerModels, ...params.sourceFilter.params, FALLBACK_VECTOR_BATCH_SIZE) : stmt.iterate(...providerModels, lastRowid, ...params.sourceFilter.params, FALLBACK_VECTOR_BATCH_SIZE);
		let batchSize = 0;
		for (const row of batch) {
			batchSize += 1;
			lastRowid = row.rowid;
			const score = cosineSimilarity(params.queryVec, decodeMemoryEmbedding(row.embedding));
			const lowest = topResults.at(-1);
			if (Number.isFinite(score) && (topResults.length < params.limit || lowest && score > lowest.score)) {
				const payload = payloadStmt.get(...snippet.params, row.rowid);
				const result = {
					id: payload.id,
					path: payload.path,
					startLine: payload.start_line,
					endLine: payload.end_line,
					score,
					snippet: truncateUtf16Safe(payload.text, params.snippetMaxChars),
					source: payload.source
				};
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
		await yieldToEventLoop();
		params.signal?.throwIfAborted();
	}
	topResults.sort((a, b) => b.score - a.score);
	return topResults;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search.ts
const FTS_QUERY_TOKEN_RE = /[\p{L}\p{N}_]+/gu;
const EXACT_PATH_SPECIFICITY_SQL_FUNCTION = "openclaw_memory_exact_path_specificity";
const NORMALIZED_CONTAINS_SQL_FUNCTION = "openclaw_memory_normalized_contains";
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
	return normalizeStringEntriesLower(raw.normalize("NFC").match(FTS_QUERY_TOKEN_RE) ?? []);
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
	return Math.min(1, params.ftsScore + lexicalBoost);
}
function escapeLikePattern(term) {
	return term.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
function isAscii(value) {
	for (const codePoint of value) if ((codePoint.codePointAt(0) ?? 0) > 127) return false;
	return true;
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
function buildSubstringFilter(params) {
	return {
		sql: params.terms.map(() => ` AND ${NORMALIZED_CONTAINS_SQL_FUNCTION}(${params.column}, ?) = 1`).join(""),
		params: params.terms
	};
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
function buildMatchQueryFromTerms(terms) {
	if (terms.length === 0) return null;
	return terms.map((term) => `"${term.replaceAll("\"", "")}"`).join(" AND ");
}
function planKeywordSearch(params) {
	if (params.ftsTokenizer !== "trigram") return {
		matchQuery: params.buildFtsQuery(params.query),
		substringTerms: []
	};
	const tokenPattern = params.includeCombiningMarks ? /[\p{L}\p{M}\p{N}_]+/gu : FTS_QUERY_TOKEN_RE;
	const tokens = normalizeStringEntries(params.query.match(tokenPattern) ?? []);
	if (tokens.length === 0) return {
		matchQuery: null,
		substringTerms: []
	};
	const matchTerms = [];
	const substringTerms = [];
	for (const token of tokens) {
		if (Array.from(token).length < 3) {
			substringTerms.push(token);
			continue;
		}
		matchTerms.push(token);
	}
	return {
		matchQuery: buildMatchQueryFromTerms(matchTerms),
		substringTerms
	};
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
		includeCombiningMarks: true
	}));
	if (params.ftsTokenizer !== "trigram") for (const query of /* @__PURE__ */ new Set([params.query.normalize("NFC"), params.query.normalize("NFD")])) {
		const tokens = normalizeStringEntries(query.match(/[\p{L}\p{M}\p{N}_]+/gu) ?? []);
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
		buildFtsQuery: params.buildFtsQuery
	});
	if (!plan.matchQuery && plan.substringTerms.length === 0) return [];
	const liveChunkClause = ` AND EXISTS (SELECT 1 FROM memory_index_chunks c WHERE c.id = ${params.ftsTable}.id)`;
	let rows;
	let usedMatch = false;
	const loadRows = (matchQuery, terms) => {
		const filter = buildSubstringFilter({
			terms,
			column: "text"
		});
		if (terms.length > 0) registerSubstringSqlFunction(params.db, terms);
		const matchClause = matchQuery ? `${params.ftsTable} MATCH ? AND ${params.ftsTable}.rank MATCH 'bm25()'` : "1=1";
		return params.db.prepare(`SELECT id, path, source, start_line, end_line, text,\n       ${matchQuery ? `${params.ftsTable}.rank` : "0"} AS rank\n  FROM ${params.ftsTable}\n WHERE ${matchClause}${filter.sql}${liveChunkClause}${params.sourceFilter.sql}\n` + (matchQuery ? ` ORDER BY rank ASC\n` : "") + ` LIMIT ?`).all(...matchQuery ? [matchQuery] : [], ...filter.params, ...params.sourceFilter.params, params.limit);
	};
	if (plan.matchQuery) try {
		rows = loadRows(plan.matchQuery, plan.substringTerms);
		usedMatch = true;
	} catch (matchErr) {
		console.warn(`memory search: FTS5 MATCH failed, falling back to substring search: ${String(matchErr)}`);
		const queryTokens = normalizeStringEntries(params.query.match(FTS_QUERY_TOKEN_RE) ?? []);
		rows = loadRows(null, uniqueStrings([...queryTokens, ...plan.substringTerms]));
	}
	else rows = loadRows(null, plan.substringTerms);
	const queryMatchers = params.boostFallbackRanking ? uniqueStrings(normalizeSearchTokens(params.rankingQuery ?? params.query)).map((token) => ({
		word: literalSearchMatcher(token, true),
		substring: literalSearchMatcher(token)
	})) : [];
	return rows.map((row) => {
		const textScore = usedMatch ? params.bm25RankToScore(row.rank) : 0;
		const score = params.boostFallbackRanking ? scoreFallbackKeywordResult({
			queryMatchers,
			path: row.path,
			text: row.text,
			ftsScore: textScore
		}) : textScore;
		return {
			id: row.id,
			path: row.path,
			startLine: row.start_line,
			endLine: row.end_line,
			score,
			textScore,
			hasBodyMatch: true,
			snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
			source: row.source
		};
	});
}
async function searchPathKeyword(params) {
	if (params.limit <= 0) return [];
	const snippet = resolveSnippetProjection("c.text", params.snippetMaxChars);
	const pathColumn = `${params.pathFtsTable}.path`;
	const pathPlans = planPathKeywordSearch({
		query: params.query,
		ftsTokenizer: params.ftsTokenizer,
		buildFtsQuery: params.buildFtsQuery
	});
	const plan = pathPlans[0] ?? {
		query: params.query,
		matchQuery: null,
		substringTerms: []
	};
	const planSubstringFilter = buildSubstringFilter({
		terms: plan.substringTerms,
		column: pathColumn
	});
	registerSubstringSqlFunction(params.db, plan.substringTerms);
	const exactPathQuery = params.exactPathQuery ?? params.query;
	const matchExactPath = prepareExactPathMatcher(exactPathQuery);
	params.db.function(EXACT_PATH_SPECIFICITY_SQL_FUNCTION, { deterministic: true }, (candidatePath) => typeof candidatePath === "string" ? matchExactPath(candidatePath) : 0);
	const hasExplicitExactPathHeadroom = params.exactPathLimit !== void 0;
	const exactPathLimit = Math.max(0, Math.floor(params.exactPathLimit ?? params.limit));
	const exactCandidatePatterns = buildExactPathCandidatePatterns(exactPathQuery);
	const loadExactRows = (useLexicalCandidates) => {
		const qualifiedPatternClause = exactCandidatePatterns.map(() => `${pathColumn} LIKE ? ESCAPE '\\'`).join(" OR ");
		const candidateCtes = useLexicalCandidates ? `candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE ${plan.matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${planSubstringFilter.sql}${params.sourceFilter.sql}\n), pattern_candidates AS MATERIALIZED (\n  SELECT path, source FROM candidates\n   WHERE (${exactCandidatePatterns.map(() => "path LIKE ? ESCAPE '\\'").join(" OR ")})\n)` : `pattern_candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE (${qualifiedPatternClause})${params.sourceFilter.sql}\n)`;
		const candidateParams = useLexicalCandidates ? [
			...plan.matchQuery ? [plan.matchQuery] : [],
			...planSubstringFilter.params,
			...params.sourceFilter.params,
			...exactCandidatePatterns
		] : [...exactCandidatePatterns, ...params.sourceFilter.params];
		return params.db.prepare(`WITH ${candidateCtes}, scored_paths AS MATERIALIZED (\n  SELECT path, source,\n         ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(path) AS exact_path_specificity\n    FROM pattern_candidates\n), exact_paths AS MATERIALIZED (\n  SELECT path, source, exact_path_specificity FROM scored_paths\n   WHERE exact_path_specificity > 0\n     AND EXISTS (SELECT 1 FROM memory_index_chunks live\n                  WHERE live.path = scored_paths.path\n                    AND live.source = scored_paths.source)\n   ORDER BY exact_path_specificity DESC, path ASC, source ASC\n   LIMIT ?\n)\nSELECT c.id, exact_paths.path, exact_paths.source,\n       c.start_line, c.end_line, ${snippet.sql} AS text, exact_paths.exact_path_specificity\n  FROM exact_paths\n  JOIN memory_index_chunks c ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate\n     WHERE candidate.path = exact_paths.path\n       AND candidate.source = exact_paths.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n ORDER BY exact_paths.exact_path_specificity DESC,\n          exact_paths.path ASC, exact_paths.source ASC`).all(...candidateParams, exactPathLimit, ...snippet.params);
	};
	const useLexicalExactCandidates = isAscii(exactPathQuery) && (plan.matchQuery !== null || plan.substringTerms.length > 0);
	let exactRows = [];
	if (exactCandidatePatterns.length > 0 && exactPathLimit > 0) try {
		exactRows = loadExactRows(useLexicalExactCandidates);
	} catch (err) {
		if (!useLexicalExactCandidates) throw err;
		exactRows = loadExactRows(false);
	}
	const exactResults = exactRows.map((row) => {
		return {
			id: row.id,
			path: row.path,
			startLine: row.start_line,
			endLine: row.end_line,
			score: 0,
			textScore: 0,
			pathScore: 0,
			exactPathSpecificity: row.exact_path_specificity,
			hasBodyMatch: false,
			snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
			source: row.source
		};
	});
	if (!pathPlans.some((entry) => entry.matchQuery || entry.substringTerms.length > 0)) return exactResults;
	const loadFilteredLexicalRows = (matchQuery, terms, specificity, resultLimit) => {
		const filter = buildSubstringFilter({
			terms,
			column: pathColumn
		});
		const qualifiedSpecificityClause = ` AND ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(${pathColumn}) ${specificity === "exact" ? ">" : "="} 0`;
		const queryParams = [
			...matchQuery ? [matchQuery] : [],
			...filter.params,
			...params.sourceFilter.params
		];
		return params.db.prepare(`WITH retained_paths AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source,\n         ${matchQuery ? `bm25(${params.pathFtsTable})` : "0"} AS rank\n    FROM ${params.pathFtsTable}\n   WHERE ${matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${filter.sql}${params.sourceFilter.sql}${qualifiedSpecificityClause}\n     AND EXISTS (SELECT 1 FROM memory_index_chunks live\n                  WHERE live.path = ${params.pathFtsTable}.path\n                    AND live.source = ${params.pathFtsTable}.source)\n   ORDER BY rank ASC, ${params.pathFtsTable}.path ASC, ${params.pathFtsTable}.source ASC\n   LIMIT ?\n)\nSELECT c.id, retained_paths.path, retained_paths.source,\n       c.start_line, c.end_line, ${snippet.sql} AS text, retained_paths.rank\n  FROM retained_paths\n  JOIN memory_index_chunks c ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate\n     WHERE candidate.path = retained_paths.path\n       AND candidate.source = retained_paths.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n ORDER BY retained_paths.rank ASC, retained_paths.path ASC, retained_paths.source ASC`).all(...queryParams, resultLimit, ...snippet.params);
	};
	const loadLexicalRows = (lexicalPlan) => {
		const loadPartitions = (matchQuery, terms) => {
			registerSubstringSqlFunction(params.db, terms);
			return [...exactPathLimit > 0 ? loadFilteredLexicalRows(matchQuery, terms, "exact", exactPathLimit) : [], ...loadFilteredLexicalRows(matchQuery, terms, "non-exact", params.limit)];
		};
		if (lexicalPlan.matchQuery) try {
			return {
				rows: loadPartitions(lexicalPlan.matchQuery, lexicalPlan.substringTerms),
				usedMatch: true
			};
		} catch (matchErr) {
			console.warn(`memory search: path FTS5 MATCH failed, falling back to substring search: ${String(matchErr)}`);
			const queryTokens = normalizeStringEntries(lexicalPlan.query.match(/[\p{L}\p{M}\p{N}_]+/gu) ?? []);
			return {
				rows: loadPartitions(null, uniqueStrings([...queryTokens, ...lexicalPlan.substringTerms])),
				usedMatch: false
			};
		}
		return {
			rows: loadPartitions(null, lexicalPlan.substringTerms),
			usedMatch: false
		};
	};
	const lexicalById = /* @__PURE__ */ new Map();
	for (const lexicalPlan of pathPlans) {
		if (!lexicalPlan.matchQuery && lexicalPlan.substringTerms.length === 0) continue;
		const { rows, usedMatch } = loadLexicalRows(lexicalPlan);
		for (const row of rows) {
			const pathScore = usedMatch ? params.bm25RankToScore(row.rank) : 1;
			const exactPathSpecificity = matchExactPath(row.path);
			const result = {
				id: row.id,
				path: row.path,
				startLine: row.start_line,
				endLine: row.end_line,
				score: pathScore,
				textScore: 0,
				pathScore,
				exactPathSpecificity,
				hasBodyMatch: false,
				snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
				source: row.source
			};
			const existing = lexicalById.get(result.id);
			if (!existing) {
				lexicalById.set(result.id, result);
				continue;
			}
			existing.pathScore = Math.max(existing.pathScore, result.pathScore);
			existing.score = Math.max(existing.score, result.score);
			existing.exactPathSpecificity = Math.max(existing.exactPathSpecificity, result.exactPathSpecificity);
		}
	}
	const byId = new Map(exactResults.map((entry) => [entry.id, entry]));
	let nonExactCount = 0;
	for (const entry of [...lexicalById.values()].toSorted(comparePathKeywordSearchResults)) {
		const exact = byId.get(entry.id);
		if (entry.exactPathSpecificity > 0) {
			if (!exact) continue;
			exact.pathScore = Math.max(exact.pathScore, entry.pathScore);
			exact.score = Math.max(exact.score, entry.score);
			exact.exactPathSpecificity = Math.max(exact.exactPathSpecificity, entry.exactPathSpecificity);
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
export { searchVector as a, readMemoryRecallData as c, loadMemorySourceFileState as d, resolveMemorySourceExistingHash as f, buildFtsQuery as h, searchChunksByEmbedding as i, readMemoryRetrievalIndexState as l, bm25RankToScore as m, searchKeyword as n, MEMORY_INDEX_META_KEY as o, resolveMemorySourceFileEntries as p, searchPathKeyword as r, readMemoryIndexMetadata as s, prepareExactPathMatcher as t, inspectMemorySourceState as u };
