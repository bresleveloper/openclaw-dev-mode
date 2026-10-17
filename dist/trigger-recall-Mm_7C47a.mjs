import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as createNormalizedPluginsConfig } from "./config-state-DY_WJYue.mjs";
import "./memory-core-host-engine-storage-D1iAJzGI.mjs";
import { a as stripMemoryAnnotationCarriers } from "./curated-annotations-DM9mz8Th.mjs";
import { n as isAutomaticMemoryEntryEligible } from "./types-DTVBdCzw.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./plugin-config-runtime-DKh00pJ1.mjs";
import { i as getActiveMemorySearchManager, r as getActiveMemoryProvider } from "./memory-host-search-B_8-MPF8.mjs";
import { t as buildPromptPrefix } from "./prompt-DM3fsjGv.mjs";
import { r as buildMemoryAudienceCacheIdentity } from "./recall-state-BkoI2py5.mjs";
//#region extensions/active-memory/trigger-recall.ts
const TRIGGER_CANDIDATE_LIMIT = 24;
const TRIGGER_INJECTION_LIMIT = 3;
const MAX_TRIGGER_CONTEXT_CHARS = 1800;
const STRONG_TRIGGER_MATCH_SCORE = .65;
const WORD_RE = /[\p{L}\p{N}_]+/gu;
function normalizeWords(value) {
	return (value.toLowerCase().match(WORD_RE) ?? []).filter((word) => word.length > 1);
}
function splitTriggerPhrases(value) {
	return value.split(/[\n;|]+/u).map((phrase) => phrase.trim()).filter(Boolean);
}
function prepareTriggerScorer(message) {
	let messageWordSet;
	const scorePhrase = (phrase) => {
		const triggerWords = [...new Set(normalizeWords(phrase))];
		if (triggerWords.length === 0) return 0;
		const words = messageWordSet ??= new Set(normalizeWords(message));
		if (triggerWords.length === 1) return words.has(triggerWords[0] ?? "") ? .85 : 0;
		const overlap = triggerWords.filter((word) => words.has(word)).length;
		if (overlap === 0) return 0;
		return overlap / triggerWords.length * .8 + Math.min(1, overlap / 2) * .2;
	};
	return (entry) => {
		if (!entry.automaticRecall?.triggers) return 0;
		const triggerScore = Math.max(0, ...splitTriggerPhrases(entry.automaticRecall?.triggers).map(scorePhrase));
		const relevance = Math.max(0, Math.min(1, entry.score ?? 0));
		return triggerScore * .8 + relevance * .2;
	};
}
function isPromotedTrustedMemoryEntry(entry, activeProjectKeys = []) {
	const projectKeys = entry.automaticRecall?.projectKeys;
	return entry.automaticRecall?.eligible === true && (!projectKeys || projectKeys.every((key) => activeProjectKeys.includes(key)));
}
function selectStrongTriggerMatches(message, entries, activeProjectKeys = []) {
	const scoreTriggerMatch = prepareTriggerScorer(message);
	return entries.filter((entry) => isPromotedTrustedMemoryEntry(entry, activeProjectKeys)).map((entry) => Object.assign({}, entry, { matchScore: scoreTriggerMatch(entry) })).filter((entry) => entry.matchScore >= STRONG_TRIGGER_MATCH_SCORE).toSorted((left, right) => right.matchScore - left.matchScore || left.reference.providerId.localeCompare(right.reference.providerId) || left.reference.id.localeCompare(right.reference.id) || (left.reference.fragment ?? "").localeCompare(right.reference.fragment ?? "", void 0, { numeric: true })).slice(0, TRIGGER_INJECTION_LIMIT);
}
function buildTriggerRecallContext(matches) {
	if (matches.length === 0) return;
	const summary = matches.map((entry) => `- ${entry.excerpt.trim()} (Source: ${entry.citations?.map((citation) => citation.label).join(", ") || `${entry.reference.providerId}:${entry.reference.id}`})`).join("\n");
	return buildPromptPrefix(truncateUtf16Safe(summary, MAX_TRIGGER_CONTEXT_CHARS));
}
const triggerRecallRuns = /* @__PURE__ */ new Map();
async function loadTriggerRecallCandidates(params) {
	params.signal?.throwIfAborted();
	return params.source.kind === "native" ? await loadNativeTriggerRecallCandidates(params, params.source.context) : await loadLegacyTriggerRecallCandidates(params);
}
function prefersTriggerEntry(next, current) {
	const nextEligible = next.automaticRecall?.eligible === true;
	if (nextEligible !== (current.automaticRecall?.eligible === true)) return nextEligible;
	return (next.score ?? Number.NEGATIVE_INFINITY) > (current.score ?? Number.NEGATIVE_INFINITY);
}
async function loadNativeTriggerRecallCandidates(params, context) {
	const activeProjectKeys = params.activeProjectKeys ?? [];
	context.assertCurrent();
	const lookup = await waitForTriggerLookup(getActiveMemoryProvider({
		cfg: params.cfg,
		agentId: params.agentId,
		context: {
			...context,
			signal: params.signal && context.signal ? AbortSignal.any([params.signal, context.signal]) : params.signal ?? context.signal
		}
	}), params.signal);
	if (!lookup.provider) {
		params.debug?.(`active-memory: trigger recall denied by ${lookup.providerId ?? "selected memory plugin"}: ${lookup.error ?? "provider unavailable"}`);
		return [];
	}
	try {
		if (!lookup.provider.candidates || !lookup.provider.capabilities.candidates.includes("trigger")) {
			params.debug?.(`active-memory: trigger recall unsupported by ${lookup.providerId ?? "selected memory plugin"}`);
			return [];
		}
		const projectFilter = lookup.provider.capabilities.projectFilter ? { activeProjectKeys: [...activeProjectKeys] } : {};
		const [retrieved, triggerCandidates] = await waitForTriggerLookup(Promise.all([lookup.provider.search({
			query: params.query,
			maxResults: TRIGGER_CANDIDATE_LIMIT,
			minScore: 0,
			sources: ["memory"],
			lexicalOnly: true,
			...projectFilter
		}).catch((error) => {
			params.debug?.(`active-memory: trigger recall search failed for ${lookup.providerId ?? "selected memory plugin"}: ${String(error)}`);
			return { hits: [] };
		}), lookup.provider.candidates({
			kind: "trigger",
			...projectFilter
		}).catch((error) => {
			params.debug?.(`active-memory: trigger recall candidates failed for ${lookup.providerId ?? "selected memory plugin"}: ${String(error)}`);
			return { hits: [] };
		})]), params.signal);
		context.assertCurrent();
		const entries = /* @__PURE__ */ new Map();
		for (const entry of [...retrieved.hits, ...triggerCandidates.hits]) {
			const key = JSON.stringify([
				entry.reference.providerId,
				entry.reference.id,
				entry.reference.fragment,
				entry.reference.revision
			]);
			const existing = entries.get(key);
			if (!existing || prefersTriggerEntry(entry, existing)) entries.set(key, entry);
		}
		return [...entries.values()];
	} finally {
		await lookup.provider.close();
	}
}
/**
* Lane one's view of a legacy result: curated eligibility over every stored project key,
* the annotation-free snippet, and the `path#L<start>` citation legacy prompts carry.
*/
function toLegacyTriggerRecallHit(entry, providerId) {
	const projectKeys = entry.projectKey ? [...new Set(entry.projectKey.split(";").map((key) => key.trim()).filter(Boolean))] : void 0;
	return {
		reference: {
			providerId,
			id: entry.path,
			fragment: `L${String(entry.startLine)}`
		},
		excerpt: stripMemoryAnnotationCarriers(entry.snippet),
		score: entry.score,
		source: entry.source,
		citations: [{ label: `${entry.path}#L${String(entry.startLine)}` }],
		automaticRecall: {
			eligible: entry.source === "memory" && isAutomaticMemoryEntryEligible(entry) && projectKeys?.length !== 0,
			...projectKeys ? { projectKeys } : {},
			triggers: entry.triggers
		}
	};
}
async function loadLegacyTriggerRecallCandidates(params) {
	const activeProjectKeys = params.activeProjectKeys ?? [];
	const lookup = await waitForTriggerLookup(getActiveMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId
	}), params.signal);
	if (!lookup.manager?.listTriggerCandidates) return [];
	const [retrieved, triggerCandidates] = await waitForTriggerLookup(Promise.all([lookup.manager.search(params.query, {
		maxResults: TRIGGER_CANDIDATE_LIMIT,
		minScore: 0,
		sources: ["memory"],
		signal: params.signal,
		lexicalOnly: true,
		activeProjectKeys: [...activeProjectKeys]
	}).catch(() => []), lookup.manager.listTriggerCandidates({ activeProjectKeys: [...activeProjectKeys] }).catch(() => [])]), params.signal);
	const providerId = createNormalizedPluginsConfig(params.cfg.plugins).slots.memory ?? "memory";
	return [...new Map([...triggerCandidates, ...retrieved].map((entry) => [`${entry.source}:${entry.path}:${String(entry.startLine)}:${String(entry.endLine)}`, entry])).values()].map((entry) => toLegacyTriggerRecallHit(entry, providerId));
}
function resolveTriggerRecallCandidates(params) {
	const runId = params.runId?.trim();
	if (!runId || params.requestKey === null) return loadTriggerRecallCandidates(params);
	const memoryAudience = params.source.kind === "native" && params.source.context.authority.kind === "session" ? params.source.context.authority.audience : void 0;
	const runKey = `${runId}:${JSON.stringify([
		params.authorityFingerprint,
		params.requestKey,
		buildMemoryAudienceCacheIdentity(memoryAudience)
	])}`;
	const existing = triggerRecallRuns.get(runKey);
	const activeProjectKeys = params.activeProjectKeys ?? [];
	if (existing && existing.cfg === params.cfg && existing.agentId === params.agentId && (params.requestKey !== void 0 || existing.query === params.query) && existing.activeProjectKeys.length === activeProjectKeys.length && existing.activeProjectKeys.every((key, index) => key === activeProjectKeys[index])) return existing.promise;
	const entry = {
		activeProjectKeys: [...activeProjectKeys],
		agentId: params.agentId,
		cfg: params.cfg,
		promise: loadTriggerRecallCandidates(params),
		query: params.query
	};
	triggerRecallRuns.set(runKey, entry);
	entry.promise.catch(() => {
		if (triggerRecallRuns.get(runKey) === entry) triggerRecallRuns.delete(runKey);
	});
	return entry.promise;
}
function assertTriggerSourceCurrent(source) {
	if (source.kind === "native") source.context.assertCurrent();
}
async function resolveTriggerRecall(params) {
	params.signal?.throwIfAborted();
	assertTriggerSourceCurrent(params.source);
	const activeProjectKeys = params.activeProjectKeys ?? [];
	const candidates = await waitForTriggerLookup(resolveTriggerRecallCandidates(params), params.signal);
	assertTriggerSourceCurrent(params.source);
	const matches = selectStrongTriggerMatches(params.message, candidates, activeProjectKeys);
	const context = buildTriggerRecallContext(matches);
	return {
		...context ? { context } : {},
		hasStrongHit: matches.length > 0,
		injectedCount: matches.length
	};
}
function forgetTriggerRecallRun(runId) {
	if (runId) {
		for (const key of triggerRecallRuns.keys()) if (key.startsWith(`${runId}:`)) triggerRecallRuns.delete(key);
	}
}
function resetTriggerRecallRunsForTests() {
	triggerRecallRuns.clear();
}
function waitForTriggerLookup(work, signal) {
	if (!signal) return work;
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(signal.reason instanceof Error ? signal.reason : new Error("active-memory trigger recall aborted", { cause: signal.reason }));
		signal.addEventListener("abort", onAbort, { once: true });
		work.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
//#endregion
export { resolveTriggerRecall as a, resetTriggerRecallRunsForTests as i, buildTriggerRecallContext as n, selectStrongTriggerMatches as o, forgetTriggerRecallRun as r, MAX_TRIGGER_CONTEXT_CHARS as t };
