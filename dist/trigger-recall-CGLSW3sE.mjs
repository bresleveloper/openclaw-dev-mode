import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import { a as stripMemoryAnnotationCarriers } from "./curated-annotations-DM9mz8Th.mjs";
import { n as isAutomaticMemoryEntryEligible } from "./types-BH9UhQoF.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { r as getActiveMemorySearchManager } from "./memory-host-search-HoRcVoWs.mjs";
import { n as buildPromptPrefix } from "./prompt-CWowzqLF.mjs";
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
		if (!entry.triggers) return 0;
		const triggerScore = Math.max(0, ...splitTriggerPhrases(entry.triggers).map(scorePhrase));
		const relevance = Math.max(0, Math.min(1, entry.score));
		return triggerScore * .8 + relevance * .2;
	};
}
function isPromotedTrustedMemoryEntry(entry, activeProjectKeys = []) {
	if (entry.projectKey) {
		const storedProjectKeys = [...new Set(entry.projectKey.split(";").map((key) => key.trim()).filter(Boolean))];
		if (storedProjectKeys.length === 0 || !storedProjectKeys.every((key) => activeProjectKeys.includes(key))) return false;
	}
	return entry.source === "memory" && isAutomaticMemoryEntryEligible(entry);
}
function selectStrongTriggerMatches(message, entries, activeProjectKeys = []) {
	const scoreTriggerMatch = prepareTriggerScorer(message);
	return entries.filter((entry) => isPromotedTrustedMemoryEntry(entry, activeProjectKeys)).map((entry) => Object.assign({}, entry, { matchScore: scoreTriggerMatch(entry) })).filter((entry) => entry.matchScore >= STRONG_TRIGGER_MATCH_SCORE).toSorted((left, right) => right.matchScore - left.matchScore || left.path.localeCompare(right.path) || left.startLine - right.startLine).slice(0, TRIGGER_INJECTION_LIMIT);
}
function buildTriggerRecallContext(matches) {
	if (matches.length === 0) return;
	const summary = matches.map((entry) => `- ${stripMemoryAnnotationCarriers(entry.snippet).trim()} (Source: ${entry.path}#L${String(entry.startLine)})`).join("\n");
	return buildPromptPrefix(truncateUtf16Safe(summary, MAX_TRIGGER_CONTEXT_CHARS));
}
const triggerRecallRuns = /* @__PURE__ */ new Map();
async function loadTriggerRecallCandidates(params) {
	params.signal?.throwIfAborted();
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
	return [...new Map([...triggerCandidates, ...retrieved].map((entry) => [`${entry.source}:${entry.path}:${String(entry.startLine)}:${String(entry.endLine)}`, entry])).values()];
}
function resolveTriggerRecallCandidates(params) {
	const runId = params.runId?.trim();
	if (!runId || params.requestKey === null) return loadTriggerRecallCandidates(params);
	const runKey = `${runId}:${JSON.stringify([params.authorityFingerprint, params.requestKey])}`;
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
async function resolveTriggerRecall(params) {
	params.signal?.throwIfAborted();
	const activeProjectKeys = params.activeProjectKeys ?? [];
	const candidates = await waitForTriggerLookup(resolveTriggerRecallCandidates(params), params.signal);
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
export { resetTriggerRecallRunsForTests as a, isPromotedTrustedMemoryEntry as i, buildTriggerRecallContext as n, resolveTriggerRecall as o, forgetTriggerRecallRun as r, selectStrongTriggerMatches as s, MAX_TRIGGER_CONTEXT_CHARS as t };
