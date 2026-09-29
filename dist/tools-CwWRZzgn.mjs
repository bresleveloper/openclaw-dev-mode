import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { T as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import { A as createMemorySearchDeadlineControl, k as MEMORY_SEARCH_DEADLINE_CONTROL } from "./gateway-startup-plugin-config-AVh0bjkO.mjs";
import { l as listMemoryCorpusSupplements } from "./memory-state-D4zZpGOe.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import { a as stripMemoryAnnotationCarriers } from "./curated-annotations-DM9mz8Th.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { c as readFiniteNumberParam, d as readPositiveIntegerParam, h as readToolStringParam, t as asToolParamsRecord } from "./common-XfKigJno.mjs";
import { i as resolveMemoryIndexIdentityDiagnostic, o as resolveMemoryIndexSearchDiagnostic, s as resolveMemorySearchStaleness } from "./types-BH9UhQoF.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./concurrency-runtime-BevFACIQ.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import "./memory-core-host-runtime-core-C8uEsC2w.mjs";
import { i as resolveMemoryToolContext, n as MEMORY_SEARCH_TOOL_CONTRACT, t as MEMORY_GET_TOOL_CONTRACT } from "./memory-tool-contract-BszrX-0d.mjs";
import { t as filterMemorySearchHitsBySessionVisibility } from "./session-search-visibility-Bskri8eu.mjs";
import { t as captureMemoryRebuildNotice } from "./memory-rebuild-notice-1g-sm2bb.mjs";
//#region extensions/memory-core/src/memory/search-deadline.ts
const DEFAULT_MEMORY_SEARCH_TIMEOUT_MS = 3e4;
function resolveMemorySearchAbortError(signal) {
	const { reason } = signal;
	if (reason instanceof Error) return reason;
	return new Error(typeof reason === "string" ? reason : "memory search aborted");
}
const memorySearchDeadlineErrors = /* @__PURE__ */ new WeakSet();
function createMemorySearchDeadlineError(message) {
	const error = new Error(message);
	memorySearchDeadlineErrors.add(error);
	return error;
}
function createMemorySearchTimeoutError(timeoutMs) {
	return createMemorySearchDeadlineError(`memory_search timed out after ${Math.round(timeoutMs / 1e3)}s`);
}
function isMemorySearchDeadlineError(error) {
	return typeof error === "object" && error !== null && memorySearchDeadlineErrors.has(error);
}
async function runMemorySearchWithDeadline(params) {
	if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
	const controller = new AbortController();
	const timeoutError = createMemorySearchTimeoutError(params.timeoutMs);
	const timeoutOutcome = { type: "timeout" };
	const parentAbortOutcome = { type: "parent-abort" };
	let timer;
	const deadlineStartedAt = Date.now();
	let removeParentAbort;
	let resolveTimeout;
	const timeoutPromise = new Promise((resolve) => {
		resolveTimeout = resolve;
	});
	const reachDefaultDeadline = () => {
		resolveTimeout(timeoutOutcome);
		controller.abort(timeoutError);
	};
	timer = setTimeout(() => {
		timer = void 0;
		reachDefaultDeadline();
	}, params.timeoutMs);
	timer.unref?.();
	const parentSignal = params.parentSignal;
	const parentAbortPromise = parentSignal ? new Promise((resolve) => {
		const onAbort = () => {
			resolve(parentAbortOutcome);
			controller.abort(resolveMemorySearchAbortError(parentSignal));
		};
		parentSignal.addEventListener("abort", onAbort, { once: true });
		removeParentAbort = () => parentSignal.removeEventListener("abort", onAbort);
	}) : void 0;
	const task = Promise.resolve().then(() => params.run(controller.signal));
	task.catch(() => void 0);
	try {
		const result = await Promise.race(parentAbortPromise ? [
			task,
			timeoutPromise,
			parentAbortPromise
		] : [task, timeoutPromise]);
		if (result === parentAbortOutcome) throw resolveMemorySearchAbortError(parentSignal);
		if (result === timeoutOutcome) throw timeoutError;
		if (parentSignal?.aborted) throw resolveMemorySearchAbortError(parentSignal);
		if (timer !== void 0 && Date.now() - deadlineStartedAt >= params.timeoutMs) {
			reachDefaultDeadline();
			throw timeoutError;
		}
		return result;
	} finally {
		if (timer) clearTimeout(timer);
		removeParentAbort?.();
	}
}
//#endregion
//#region extensions/memory-core/src/memory-corpus.ts
const memoryCorpusDeadlineChecks = /* @__PURE__ */ new WeakMap();
/**
* Flattening the failure to a string is where provenance would be lost: a
* provider is free to emit the very text this tool uses for its own timeout, so
* the deadline is carried across the boundary as a flag taken from the error
* object while it is still here. Callers that already hold a flattened error
* pass the flag they were given.
*/
function unavailableMemoryCorpus(corpus, value, error, deadline = isMemorySearchDeadlineError(error)) {
	const code = extractErrorCode(error);
	return {
		corpus,
		outcome: "unavailable",
		value,
		error: formatErrorMessage(error),
		deadline,
		...code ? { code } : {}
	};
}
async function raceMemoryCorpusSignal(signal, run) {
	if (signal.aborted) throw resolveMemorySearchAbortError(signal);
	let removeAbort = () => {};
	const aborted = new Promise((_resolve, reject) => {
		const onAbort = () => reject(resolveMemorySearchAbortError(signal));
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbort = () => signal.removeEventListener("abort", onAbort);
	});
	try {
		const task = Promise.resolve().then(run);
		const result = await Promise.race([task, aborted]);
		memoryCorpusDeadlineChecks.get(signal)?.();
		if (signal.aborted) throw resolveMemorySearchAbortError(signal);
		return result;
	} finally {
		removeAbort();
	}
}
async function attemptMemoryCorpus(params) {
	try {
		return {
			corpus: params.corpus,
			outcome: "ok",
			value: await raceMemoryCorpusSignal(params.signal, params.run)
		};
	} catch (error) {
		const partial = isMemorySearchDeadlineError(error) ? params.getPartialValue?.() : null;
		if (partial != null) return {
			...unavailableMemoryCorpus(params.corpus, partial, error),
			outcome: "partial"
		};
		return unavailableMemoryCorpus(params.corpus, params.unavailableValue, error);
	}
}
async function runMemoryCorpusDeadline(params) {
	if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
	const controller = new AbortController();
	const timeoutError = createMemorySearchDeadlineError(`${params.operation} timed out after ${DEFAULT_MEMORY_SEARCH_TIMEOUT_MS / 1e3}s`);
	const expire = () => controller.abort(timeoutError);
	let remainingMs = DEFAULT_MEMORY_SEARCH_TIMEOUT_MS;
	let segmentStartedAt = performance.now();
	let paused = false;
	let timer;
	const armTimer = () => {
		segmentStartedAt = performance.now();
		timer = setTimeout(() => {
			timer = void 0;
			expire();
		}, remainingMs);
		timer.unref?.();
	};
	const checkDeadline = () => {
		if (controller.signal.aborted || paused) return;
		if (performance.now() - segmentStartedAt >= remainingMs) expire();
	};
	const control = createMemorySearchDeadlineControl();
	const unsubscribe = control.subscribe((action) => {
		if (controller.signal.aborted) return;
		if (action === "pause") {
			paused = true;
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
			remainingMs = Math.max(0, remainingMs - (performance.now() - segmentStartedAt));
			if (remainingMs === 0) expire();
			return;
		}
		paused = false;
		armTimer();
	});
	memoryCorpusDeadlineChecks.set(controller.signal, checkDeadline);
	armTimer();
	const onParentAbort = () => controller.abort(resolveMemorySearchAbortError(params.parentSignal));
	params.parentSignal?.addEventListener("abort", onParentAbort, { once: true });
	try {
		const result = await params.run(controller.signal, control);
		if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
		const alreadyAborted = controller.signal.aborted;
		checkDeadline();
		if (!alreadyAborted && controller.signal.aborted) throw timeoutError;
		return result;
	} finally {
		unsubscribe();
		if (timer) clearTimeout(timer);
		memoryCorpusDeadlineChecks.delete(controller.signal);
		params.parentSignal?.removeEventListener("abort", onParentAbort);
	}
}
function composeMemoryCorpusMetadata(attempts, extraWarnings = []) {
	const ordered = attempts.toSorted((left, right) => Number(left.corpus === "wiki") - Number(right.corpus === "wiki"));
	const warnings = ordered.flatMap((attempt) => {
		const label = attempt.corpus === "memory" ? "Memory" : "Wiki";
		if ("error" in attempt) return [`${label} corpus ${attempt.outcome}: ${attempt.error}`];
		return attempt.outcome === "not-registered" && ordered.length === 1 ? [`${label} corpus is not registered; results do not cover that requested corpus.`] : [];
	});
	warnings.push(...extraWarnings);
	const errors = ordered.flatMap((attempt) => "error" in attempt ? [attempt.error] : []);
	return {
		corpora: ordered.map((attempt) => "error" in attempt ? {
			corpus: attempt.corpus,
			outcome: attempt.outcome,
			error: attempt.error
		} : {
			corpus: attempt.corpus,
			outcome: attempt.outcome
		}),
		...warnings.length > 0 ? { warning: warnings.join(" ") } : {},
		...errors.length > 0 ? { error: errors.join("; ") } : {},
		...ordered.some((attempt) => "deadline" in attempt && attempt.deadline) ? {
			timedOut: true,
			timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS
		} : {}
	};
}
async function settleMemorySupplements(params) {
	const supplements = listMemoryCorpusSupplements().toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
	if (supplements.length === 0) return {
		corpus: "wiki",
		outcome: "not-registered"
	};
	const failures = [];
	const completed = Array.from({ length: supplements.length });
	try {
		await raceMemoryCorpusSignal(params.signal, () => runTasksWithConcurrency({
			tasks: supplements.map((registration, index) => async () => {
				const result = await params.run(registration);
				completed[index] = result;
				return result;
			}),
			limit: Math.min(4, supplements.length),
			onTaskError: (error, index) => {
				failures.push({
					pluginId: supplements[index].pluginId,
					error: formatErrorMessage(error)
				});
			}
		}));
	} catch (error) {
		return unavailableMemoryCorpus("wiki", params.merge(completed.filter((result) => result !== void 0)), error);
	}
	const value = params.merge(completed.filter((result) => result !== void 0));
	if (failures.length === 0) return {
		corpus: "wiki",
		outcome: "ok",
		value
	};
	const orderedFailures = failures.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
	return {
		corpus: "wiki",
		outcome: "unavailable",
		value,
		error: orderedFailures.length === 1 ? orderedFailures[0].error : orderedFailures.map((entry) => `${entry.pluginId}: ${entry.error}`).join("; "),
		deadline: false
	};
}
async function searchMemoryCorpusSupplements(params) {
	const { signal, ...query } = params;
	return await settleMemorySupplements({
		signal,
		run: async ({ supplement }) => await supplement.search(query),
		merge: (results) => results.flat().toSorted((left, right) => right.score - left.score || left.path.localeCompare(right.path)).slice(0, Math.max(1, params.maxResults ?? 10))
	});
}
async function readMemoryCorpusSupplements(params) {
	const { signal, ...query } = params;
	return await settleMemorySupplements({
		signal,
		run: async ({ supplement }) => {
			const result = await supplement.get(query);
			if (!result) return null;
			const { content, ...details } = result;
			return {
				...details,
				status: "ok",
				text: content
			};
		},
		merge: (results) => results.find((result) => result !== null) ?? null
	});
}
//#endregion
//#region extensions/memory-core/src/memory-read-tool.ts
function readWiki(params, signal) {
	return readMemoryCorpusSupplements({
		lookup: params.relPath,
		fromLine: params.from,
		lineCount: params.lines,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed,
		signal
	});
}
function attemptValue(attempt) {
	return attempt.outcome === "not-registered" ? null : attempt.value;
}
async function executeWikiMemoryReadResult(params) {
	return await runMemoryCorpusDeadline({
		operation: "memory_get",
		parentSignal: params.signal,
		run: async (signal) => {
			const wiki = await readWiki(params, signal);
			const result = attemptValue(wiki) ?? (wiki.outcome === "ok" ? {
				status: "not_found",
				path: params.relPath,
				text: ""
			} : {
				path: params.relPath,
				text: ""
			});
			return jsonResult({
				...result,
				...composeMemoryCorpusMetadata([wiki])
			});
		}
	});
}
async function executeMemoryReadResult(params) {
	if (params.requestedCorpus !== "all") try {
		return jsonResult(await params.read());
	} catch (error) {
		return jsonResult({
			path: params.relPath,
			text: "",
			status: "error",
			code: extractErrorCode(error) ?? "MEMORY_READ_FAILED",
			error: formatErrorMessage(error)
		});
	}
	return await runMemoryCorpusDeadline({
		operation: "memory_get",
		parentSignal: params.signal,
		run: async (signal) => {
			const [memory, wiki] = await Promise.all([attemptMemoryCorpus({
				corpus: "memory",
				signal,
				unavailableValue: null,
				run: params.read
			}), readWiki(params, signal)]);
			const memoryResult = attemptValue(memory);
			const wikiResult = attemptValue(wiki);
			const result = memoryResult?.status !== "not_found" && memoryResult !== null ? memoryResult : wikiResult ?? (memory.outcome === "ok" || wiki.outcome === "ok" ? {
				status: "not_found",
				path: params.relPath,
				text: ""
			} : {
				status: "error",
				path: params.relPath,
				text: ""
			});
			return jsonResult({
				...result,
				...composeMemoryCorpusMetadata([memory, wiki])
			});
		}
	});
}
//#endregion
//#region extensions/memory-core/src/tools.shared.ts
const SESSION_CANONICAL_KEY_MIGRATION_REQUIRED = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
const SESSION_CANONICAL_KEY_MIGRATION_WARNING = "Memory search is unavailable because the session catalog requires canonical-key migration.";
const SESSION_CANONICAL_KEY_MIGRATION_ACTION = "Stop the Gateway and run openclaw doctor --fix, then restart the Gateway and retry memory_search.";
const loadMemoryToolRuntime = createLazyRuntimeModule(() => import("./tools.runtime.js"));
async function getMemoryManagerContextWithPurpose(params) {
	const { getMemorySearchManager } = await loadMemoryToolRuntime();
	const startedAt = Date.now();
	const { manager, debug, error } = await getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose,
		...params.acquireLocalService ? { acquireLocalService: params.acquireLocalService } : {}
	});
	return manager ? {
		manager,
		debug: {
			backend: debug?.backend ?? "builtin",
			purpose: debug?.purpose ?? params.purpose ?? "default",
			managerMs: debug?.managerMs ?? Math.max(0, Date.now() - startedAt)
		}
	} : { error };
}
function createMemoryTool(params) {
	const ctx = resolveMemoryToolContext(params.options);
	if (!ctx) return null;
	return {
		label: params.contract.label,
		name: params.contract.name,
		description: params.contract.describe(ctx.sources),
		parameters: params.contract.parameters,
		execute: async (toolCallId, toolParams, signal, onUpdate) => {
			const latestCtx = params.options.getConfig ? resolveMemoryToolContext(params.options) : ctx;
			if (!latestCtx) throw new Error("Memory is disabled for this agent. Enable memory search for this agent, then retry.");
			return await params.execute(latestCtx)(toolCallId, toolParams, signal, onUpdate);
		}
	};
}
function buildMemorySearchUnavailableResult(error, overrides) {
	const reason = (error ?? "memory search unavailable").trim() || "memory search unavailable";
	const normalizedReason = normalizeLowercaseStringOrEmpty(reason);
	const isQuotaError = /insufficient_quota|quota|429/.test(normalizedReason);
	const isMissingNodeSqlite = /missing node:sqlite|no such built-?in module: node:sqlite/.test(normalizedReason);
	const isSearchDeadline = overrides?.deadline === true;
	const deadlineAction = overrides?.agentId ? `Retry memory_search after a short wait: a memory-corpus timeout pauses retries for up to a minute. If memory-corpus timeouts persist, run: openclaw memory status --deep --agent ${overrides.agentId}, and rebuild with openclaw memory index --force --agent ${overrides.agentId} only if it reports the index dirty or incomplete` : "Retry memory_search after a short wait. If memory-corpus timeouts persist, inspect this agent's memory index before rebuilding it.";
	const warning = overrides?.warning ?? (overrides?.code === SESSION_CANONICAL_KEY_MIGRATION_REQUIRED ? SESSION_CANONICAL_KEY_MIGRATION_WARNING : isQuotaError ? "Memory search is unavailable because the embedding provider quota is exhausted." : isMissingNodeSqlite ? "Memory search is unavailable because this OpenClaw Node runtime does not provide SQLite support." : isSearchDeadline ? "Memory search did not finish within its time limit." : "Memory search is unavailable due to an embedding/provider error.");
	const action = overrides?.action ?? (overrides?.code === SESSION_CANONICAL_KEY_MIGRATION_REQUIRED ? SESSION_CANONICAL_KEY_MIGRATION_ACTION : isQuotaError ? "Top up or switch embedding provider, then retry memory_search." : isMissingNodeSqlite ? "Run OpenClaw with a Node runtime that includes node:sqlite, then retry memory_search." : isSearchDeadline ? deadlineAction : "Check embedding provider configuration and retry memory_search.");
	return {
		results: [],
		disabled: true,
		unavailable: true,
		...isSearchDeadline ? {
			timedOut: true,
			timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS
		} : {},
		error: reason,
		warning,
		action,
		debug: {
			warning,
			action,
			error: reason
		}
	};
}
//#endregion
//#region extensions/memory-core/src/memory-search-tool-query.ts
const MEMORY_SEARCH_POST_FILTER_MAX_CANDIDATES = 200;
function buildPausedMemoryIndexUnavailableResult(diagnostic, params) {
	const { error, warning, action } = resolveMemoryIndexSearchDiagnostic(diagnostic, params.status, params.agentId);
	return buildMemorySearchUnavailableResult(error, {
		warning,
		action
	});
}
function isClosedMemoryStoreError(error) {
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("database is not open") || message.includes("database connection is not open") || message.includes("database handle is closed") || message.includes("memory index manager is closed");
}
async function executeMemorySearchToolQuery(params) {
	const startedAt = Date.now();
	const runtimeDebug = [];
	let active = params.initialManager;
	let partialGeneration = 0;
	const { query, signal, visibility } = params;
	const searchSources = query.explicitSources ?? (query.requestedCorpus === "sessions" ? query.defaultSources : query.requestedCorpus == null || query.requestedCorpus === "all" ? query.conversationRecall?.corpus === "configured" ? query.indexedSources : query.defaultSources : void 0);
	const queryContext = {
		query,
		visibility,
		searchSources,
		startedAt
	};
	const searchOnce = async () => {
		params.onRebuildNotice?.(captureMemoryRebuildNotice(active.manager.status()));
		const allowedSources = searchSources ? new Set(searchSources) : void 0;
		const searchesSessions = searchSources?.includes("sessions") === true;
		const indexedCandidateCount = searchesSessions ? (active.manager.status().sourceCounts ?? []).filter((entry) => allowedSources?.has(entry.source)).reduce((total, entry) => total + entry.chunks, 0) : query.resultLimit;
		const searchWindow = searchesSessions ? Math.min(MEMORY_SEARCH_POST_FILTER_MAX_CANDIDATES, indexedCandidateCount > 0 ? indexedCandidateCount : MEMORY_SEARCH_POST_FILTER_MAX_CANDIDATES) : query.resultLimit;
		return {
			searched: {
				candidates: await active.manager.search(query.text, {
					maxResults: searchWindow,
					minScore: query.minScore,
					sessionKey: query.sessionKey,
					activeProjectKeys: query.activeProjectKeys ? [...query.activeProjectKeys] : void 0,
					signal,
					...params.deadlineControl ? { [MEMORY_SEARCH_DEADLINE_CONTROL]: params.deadlineControl } : {},
					onDebug: (debug) => runtimeDebug.push(debug),
					onPartialResults: params.onPartialResults ? (partialCandidates) => {
						const generation = ++partialGeneration;
						params.onPartialResults?.(null);
						const memoryCandidates = partialCandidates?.filter((entry) => entry.source === "memory");
						if (!memoryCandidates?.length || signal.aborted) return;
						finalizeMemorySearchToolQuery({
							active,
							searched: {
								candidates: memoryCandidates,
								searchWindow
							},
							...queryContext,
							runtimeDebug: [...runtimeDebug],
							effectiveMode: "keyword-only"
						}).then((result) => {
							if (generation === partialGeneration && !signal.aborted) params.onPartialResults?.(result.pausedIndexIdentity ? null : result);
						}, () => {});
					} : void 0,
					...searchSources ? { sources: searchSources } : {}
				}),
				searchWindow
			},
			status: active.manager.status()
		};
	};
	let searched;
	try {
		searched = await searchOnce();
	} catch (error) {
		if (!isClosedMemoryStoreError(error)) throw error;
		partialGeneration += 1;
		params.onPartialResults?.(null);
		const refreshed = await params.refreshManager();
		if (!refreshed) throw error;
		active = refreshed;
		searched = await searchOnce();
	} finally {
		partialGeneration += 1;
	}
	return await finalizeMemorySearchToolQuery({
		active,
		...searched,
		...queryContext,
		runtimeDebug
	});
}
async function finalizeMemorySearchToolQuery(params) {
	const { active, searched, query, visibility, searchSources, runtimeDebug, startedAt } = params;
	const status = params.status ?? active.manager.status();
	const pausedIndexIdentity = resolveMemoryIndexIdentityDiagnostic(status);
	const chunkingUpgradeKeywordOnly = pausedIndexIdentity?.status === "mismatched" && pausedIndexIdentity.owner === "openclaw" && pausedIndexIdentity.code === "chunking_version" && pausedIndexIdentity.chunkingVersionOnly === true && Boolean(status.fts?.enabled && status.fts?.available);
	if (pausedIndexIdentity && !chunkingUpgradeKeywordOnly) return {
		searchStartedAt: startedAt,
		status,
		rawResults: [],
		pausedIndexIdentity,
		searchMode: void 0,
		debug: void 0
	};
	let filtered = await filterMemorySearchHitsBySessionVisibility({
		cfg: visibility.cfg,
		agentId: visibility.agentId,
		requesterSessionKey: query.sessionKey,
		sandboxed: visibility.sandboxed,
		hits: searched.candidates,
		conversationRecall: query.conversationRecall
	});
	if (searchSources) {
		const allowedSources = new Set(searchSources);
		filtered = filtered.filter((hit) => allowedSources.has(hit.source));
	}
	if (query.requestedCorpus === "sessions") filtered = filtered.filter((hit) => hit.source === "sessions");
	else if (query.requestedCorpus === "memory") filtered = filtered.filter((hit) => hit.source === "memory");
	const rawResults = filtered.slice(0, query.resultLimit);
	const latestDebug = runtimeDebug.at(-1);
	return {
		searchStartedAt: startedAt,
		status,
		rawResults,
		pausedIndexIdentity: void 0,
		searchMode: params.effectiveMode ?? latestDebug?.effectiveMode,
		debug: {
			backend: status.backend,
			configuredMode: latestDebug?.configuredMode,
			effectiveMode: params.effectiveMode ?? "n/a",
			fallback: latestDebug?.fallback,
			managerMs: active.managerMs,
			searchMs: Math.max(0, Date.now() - startedAt),
			embeddingBootstrap: runtimeDebug.findLast((entry) => entry.embeddingBootstrap)?.embeddingBootstrap,
			hits: rawResults.length,
			candidateHits: searched.candidates.length,
			withheldHits: Math.max(0, searched.candidates.length - filtered.length),
			searchWindow: searched.searchWindow
		}
	};
}
//#endregion
//#region extensions/memory-core/src/tools.citations.ts
function resolveMemoryCitationsMode(cfg) {
	const mode = cfg.memory?.citations;
	if (mode === "on" || mode === "off" || mode === "auto") return mode;
	return "auto";
}
function buildMemorySearchPresentation(results, include) {
	const presentation = /* @__PURE__ */ new Map();
	for (const entry of results) {
		const presented = {
			...entry,
			corpus: entry.source,
			snippet: stripMemoryAnnotationCarriers(entry.snippet)
		};
		presented.citation = include ? formatCitation(presented) : void 0;
		if (include) presented.snippet = `${presented.snippet.trimEnd()}\n\nSource: ${presented.citation}`;
		presentation.set(entry, presented);
	}
	return presentation;
}
function formatCitation(entry) {
	const lineRange = entry.startLine === entry.endLine ? `#L${entry.startLine}` : `#L${entry.startLine}-L${entry.endLine}`;
	return `${entry.path}${lineRange}`;
}
function shouldIncludeCitations(params) {
	if (params.mode === "on") return true;
	if (params.mode === "off") return false;
	return deriveChatTypeFromSessionKey(params.sessionKey) === "direct";
}
function deriveChatTypeFromSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed?.rest) return "direct";
	const tokens = new Set(normalizeLowercaseStringOrEmpty(parsed.rest).split(":").filter(Boolean));
	if (tokens.has("channel")) return "channel";
	if (tokens.has("group")) return "group";
	return "direct";
}
//#endregion
//#region extensions/memory-core/src/tools.ts
const MEMORY_SEARCH_TOOL_COOLDOWN_MS = 6e4;
const memorySearchToolCooldowns = /* @__PURE__ */ new Map();
/**
* Validate the model-authored corpus argument against the tool's closed enum.
* Provider tool schemas do not guarantee enum enforcement; an unknown corpus
* must fail closed instead of falling through to an unrestricted search that
* could surface recall-only indexed transcripts.
*/
function readCorpusParam(rawParams, allowed) {
	const raw = readToolStringParam(rawParams, "corpus");
	if (raw === void 0) return;
	if (allowed.includes(raw)) return raw;
	throw new Error(`corpus must be one of: ${allowed.join(", ")}`);
}
function readMemorySearchToolCooldown(key, cfg) {
	const entry = memorySearchToolCooldowns.get(key);
	if (!entry) return;
	if (entry.until <= Date.now() || entry.configKey !== resolveRuntimeConfigCacheKey(cfg)) {
		memorySearchToolCooldowns.delete(key);
		return;
	}
	return {
		error: entry.error,
		deadline: entry.deadline,
		...entry.code ? { code: entry.code } : {}
	};
}
function recordMemorySearchToolCooldown(key, cfg, failure) {
	memorySearchToolCooldowns.set(key, {
		until: Date.now() + MEMORY_SEARCH_TOOL_COOLDOWN_MS,
		configKey: resolveRuntimeConfigCacheKey(cfg),
		...failure
	});
}
const testing = { resetMemorySearchToolCooldowns() {
	memorySearchToolCooldowns.clear();
} };
function isActiveMemoryManagerContext(context) {
	return context !== null && "manager" in context;
}
async function closeMemoryManagers(managers, parentSignal) {
	const pending = Array.from(managers, async (manager) => await manager.close?.());
	if (pending.length === 0) return;
	try {
		await runMemorySearchWithDeadline({
			timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS,
			parentSignal,
			run: async () => {
				await Promise.allSettled(pending);
			}
		});
	} catch (error) {
		if (parentSignal?.aborted) throw error;
	}
}
function mergeRankedMemorySearchToolStreams(memoryResults, supplementResults) {
	const merged = [];
	let memoryIndex = 0;
	let supplementIndex = 0;
	while (memoryIndex < memoryResults.length && supplementIndex < supplementResults.length) {
		const memory = memoryResults[memoryIndex];
		const supplement = supplementResults[supplementIndex];
		if ((memory?.score ?? 0) >= (supplement?.score ?? 0)) {
			if (memory) merged.push(memory);
			memoryIndex += 1;
		} else {
			if (supplement) merged.push(supplement);
			supplementIndex += 1;
		}
	}
	merged.push(...memoryResults.slice(memoryIndex), ...supplementResults.slice(supplementIndex));
	return merged;
}
function mergeMemorySearchCorpusResults(params) {
	const { memoryResults, supplementResults } = params;
	if (!params.balanceCorpora || memoryResults.length === 0 || supplementResults.length === 0) return mergeRankedMemorySearchToolStreams(memoryResults, supplementResults).slice(0, params.maxResults);
	const perCorpusCap = Math.ceil(params.maxResults / 2);
	let memoryTake = Math.min(perCorpusCap, memoryResults.length);
	let supplementTake = Math.min(perCorpusCap, supplementResults.length);
	while (memoryTake + supplementTake < params.maxResults) {
		const memory = memoryResults[memoryTake];
		const supplement = supplementResults[supplementTake];
		if (!memory && !supplement) break;
		if (!supplement || memory && memory.score >= supplement.score) memoryTake += 1;
		else supplementTake += 1;
	}
	return mergeRankedMemorySearchToolStreams(memoryResults.slice(0, memoryTake), supplementResults.slice(0, supplementTake)).slice(0, params.maxResults);
}
function createMemorySearchTool(options) {
	return createMemoryTool({
		options,
		contract: MEMORY_SEARCH_TOOL_CONTRACT,
		execute: ({ cfg, agentId, settings }) => async (_toolCallId, params, callerSignal) => {
			const rawParams = asToolParamsRecord(params);
			if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
			const query = readToolStringParam(rawParams, "query", { required: true });
			const maxResults = readPositiveIntegerParam(rawParams, "maxResults");
			const minScore = readFiniteNumberParam(rawParams, "minScore");
			const modelRequestedCorpus = readCorpusParam(rawParams, [
				"memory",
				"wiki",
				"all",
				"sessions"
			]);
			const requestedCorpus = options.conversationRecall?.corpus === "sessions" ? "sessions" : modelRequestedCorpus;
			if (requestedCorpus === "sessions" && !options.conversationRecall && !settings.searchSources.includes("sessions")) return jsonResult(buildMemorySearchUnavailableResult("Session transcript search is not enabled.", {
				warning: "Session transcript search is unavailable for this agent.",
				action: "If an exact session-history capability is available for this run, use it. Otherwise, ask the operator to enable semantic session search by enabling memory.search.experimental.sessionMemory and adding \"sessions\" to memory.search.sources."
			}));
			const cooldown = requestedCorpus === "wiki" ? void 0 : readMemorySearchToolCooldown(agentId, cfg);
			const toolStartedAt = Date.now();
			const searchesMemory = requestedCorpus !== "wiki";
			const searchesWiki = requestedCorpus === "wiki" || requestedCorpus === "all";
			const memoryManagerPurpose = options.oneShotCliRun ? "cli" : void 0;
			const memoryManagersToClose = /* @__PURE__ */ new Set();
			let cleanupStarted = false;
			let searchSignal;
			const rebuildNotices = [];
			const readRebuildWarning = () => [...new Set(rebuildNotices.map((read) => read()).filter(Boolean))].join(" ") || void 0;
			const trackMemoryManager = (context) => {
				if (memoryManagerPurpose === "cli" && isActiveMemoryManagerContext(context)) {
					if (cleanupStarted) closeMemoryManagers([context.manager]);
					else memoryManagersToClose.add(context.manager);
				}
				return context;
			};
			const searchMemory = async (signal, deadlineControl) => {
				if (cooldown) return {
					corpus: "memory",
					outcome: "unavailable",
					value: null,
					...cooldown
				};
				let partial = null;
				let acceptingPartial = true;
				const attempted = await attemptMemoryCorpus({
					corpus: "memory",
					signal,
					unavailableValue: null,
					getPartialValue: () => partial?.rawResults.length ? partial : null,
					run: async () => {
						const memory = trackMemoryManager(await getMemoryManagerContextWithPurpose({
							cfg,
							agentId,
							purpose: memoryManagerPurpose,
							acquireLocalService: options.acquireLocalService
						}));
						if ("error" in memory) throw new Error(memory.error ?? "memory search unavailable");
						signal.throwIfAborted();
						const explicitSources = requestedCorpus === "sessions" && (options.conversationRecall || settings.searchSources.includes("sessions")) ? ["sessions"] : requestedCorpus === "memory" ? ["memory"] : void 0;
						return await executeMemorySearchToolQuery({
							onRebuildNotice: (read) => rebuildNotices.push(read),
							initialManager: {
								manager: memory.manager,
								managerMs: memory.debug?.managerMs
							},
							refreshManager: async () => {
								const refreshed = trackMemoryManager(await getMemoryManagerContextWithPurpose({
									cfg,
									agentId,
									purpose: memoryManagerPurpose,
									acquireLocalService: options.acquireLocalService
								}));
								return "error" in refreshed ? null : {
									manager: refreshed.manager,
									managerMs: refreshed.debug?.managerMs
								};
							},
							query: {
								text: query,
								resultLimit: maxResults ?? settings.query.maxResults,
								minScore,
								explicitSources,
								defaultSources: settings.searchSources,
								indexedSources: settings.sources,
								requestedCorpus,
								sessionKey: options.agentSessionKey,
								activeProjectKeys: options.activeProjectKeys,
								conversationRecall: options.conversationRecall
							},
							visibility: {
								cfg,
								agentId,
								sandboxed: options.sandboxed === true
							},
							signal,
							deadlineControl,
							onPartialResults: (result) => {
								if (acceptingPartial) partial = result;
							}
						});
					}
				});
				acceptingPartial = false;
				if (attempted.outcome !== "ok" && attempted.outcome !== "partial") {
					if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
					const failure = attempted.outcome === "unavailable" ? {
						error: attempted.error,
						deadline: attempted.deadline,
						...attempted.code ? { code: attempted.code } : {}
					} : {
						error: "memory search unavailable",
						deadline: false
					};
					recordMemorySearchToolCooldown(agentId, cfg, failure);
					return {
						corpus: "memory",
						outcome: "unavailable",
						value: {
							results: [],
							automaticRebuildWarning: readRebuildWarning()
						},
						...failure
					};
				}
				const executed = attempted.value;
				if (executed.pausedIndexIdentity) {
					const unavailableResult = buildPausedMemoryIndexUnavailableResult(executed.pausedIndexIdentity, {
						agentId,
						status: executed.status
					});
					const rebuildWarning = readRebuildWarning();
					if (rebuildWarning) unavailableResult.warning = [unavailableResult.warning, rebuildWarning].filter(Boolean).join(" ");
					return unavailableMemoryCorpus("memory", {
						results: [],
						unavailableResult
					}, unavailableResult.error);
				}
				const status = executed.status;
				return {
					...attempted,
					value: {
						results: executed.rawResults,
						workspaceDir: status.workspaceDir,
						provider: status.provider,
						model: status.model,
						fallback: status.fallback,
						mode: executed.searchMode,
						staleness: resolveMemorySearchStaleness(status, agentId) ?? void 0,
						automaticRebuildWarning: readRebuildWarning(),
						debug: attempted.outcome === "partial" && executed.debug ? {
							...executed.debug,
							searchMs: Math.max(0, Date.now() - executed.searchStartedAt),
							fallback: attempted.error
						} : executed.debug
					}
				};
			};
			try {
				return await runMemoryCorpusDeadline({
					operation: "memory_search",
					parentSignal: callerSignal,
					run: async (signal, deadlineControl) => {
						searchSignal = signal;
						const [memory, wiki] = await Promise.all([searchesMemory ? searchMemory(signal, deadlineControl) : Promise.resolve(null), searchesWiki ? runMemoryCorpusDeadline({
							operation: "memory_search",
							parentSignal: callerSignal,
							run: (wikiSignal) => searchMemoryCorpusSupplements({
								query,
								maxResults,
								agentId,
								agentSessionKey: options.agentSessionKey,
								sandboxed: options.sandboxed,
								signal: wikiSignal
							})
						}) : Promise.resolve(null)]);
						const memoryValue = memory?.outcome === "not-registered" ? null : memory?.value;
						if (searchesMemory && !searchesWiki && memory?.outcome === "unavailable") return jsonResult(memoryValue?.unavailableResult ?? buildMemorySearchUnavailableResult(memory.error, {
							warning: readRebuildWarning(),
							agentId,
							deadline: memory.deadline,
							code: memory.code
						}));
						const wikiResults = wiki?.outcome === "not-registered" ? [] : wiki?.value ?? [];
						const results = searchesWiki ? mergeMemorySearchCorpusResults({
							memoryResults: memoryValue?.results ?? [],
							supplementResults: wikiResults,
							maxResults: maxResults ?? 10,
							balanceCorpora: requestedCorpus === "all"
						}) : memoryValue?.results ?? [];
						const surfaced = new Set(results);
						const recalled = (memoryValue?.results ?? []).filter((result) => surfaced.has(result));
						const citationsMode = resolveMemoryCitationsMode(cfg);
						const presentation = buildMemorySearchPresentation(recalled, shouldIncludeCitations({
							mode: citationsMode,
							sessionKey: options.agentSessionKey
						}));
						const dreaming = resolveMemoryDreamingConfig({
							pluginConfig: resolveMemoryDreamingPluginConfig(cfg),
							cfg
						});
						if ((memory?.outcome === "ok" || memory?.outcome === "partial") && dreaming.enabled) {
							const recall = {
								workspaceDir: memoryValue?.workspaceDir,
								query,
								results: recalled,
								nowMs: Date.now(),
								timezone: dreaming.timezone
							};
							import("./short-term-promotion-record-BYuVo6i0.mjs").then(({ recordShortTermRecalls }) => recordShortTermRecalls(recall)).catch(() => {});
						}
						const attempts = [...(requestedCorpus === "all" || memory?.outcome === "partial") && memory ? [memory] : [], ...wiki ? [wiki] : []];
						const staleness = memoryValue?.staleness;
						const recovery = memoryValue?.unavailableResult;
						const metadata = composeMemoryCorpusMetadata(attempts, [
							...memoryValue?.automaticRebuildWarning ? [memoryValue.automaticRebuildWarning] : [],
							...staleness?.warning ? [staleness.warning] : [],
							...recovery?.warning ? [recovery.warning] : [],
							...memory?.outcome === "partial" ? ["Only memory-file keyword matches are included; semantic memory retrieval did not finish within the search time limit. Session transcript results are not included."] : []
						]);
						const elapsed = Math.max(0, Date.now() - toolStartedAt);
						const debug = memoryValue?.debug ? {
							...memoryValue.debug,
							toolMs: elapsed,
							outsideSearchMs: Math.max(0, elapsed - memoryValue.debug.searchMs)
						} : void 0;
						return jsonResult({
							results: results.map((result) => presentation.get(result) ?? result),
							provider: memoryValue?.provider,
							model: memoryValue?.model,
							fallback: memoryValue?.fallback,
							citations: citationsMode,
							mode: memoryValue?.mode,
							...staleness,
							...attempts.length > 0 || memoryValue?.automaticRebuildWarning ? metadata : {},
							...memory?.outcome === "partial" ? { partial: true } : {},
							...recovery?.action ? { action: recovery.action } : {},
							debug
						});
					}
				});
			} catch (error) {
				if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
				const failed = unavailableMemoryCorpus("memory", null, error);
				if (requestedCorpus !== "wiki") recordMemorySearchToolCooldown(agentId, cfg, failed);
				return jsonResult(buildMemorySearchUnavailableResult(failed.error, {
					warning: readRebuildWarning(),
					agentId,
					deadline: failed.deadline,
					code: failed.code
				}));
			} finally {
				cleanupStarted = true;
				if (searchSignal?.aborted) closeMemoryManagers(memoryManagersToClose);
				else await closeMemoryManagers(memoryManagersToClose, callerSignal);
			}
		}
	});
}
function createMemoryGetTool(options) {
	return createMemoryTool({
		options,
		contract: MEMORY_GET_TOOL_CONTRACT,
		execute: ({ cfg, agentId }) => async (_toolCallId, params, callerSignal) => {
			const rawParams = asToolParamsRecord(params);
			const relPath = readToolStringParam(rawParams, "path", { required: true });
			const from = readPositiveIntegerParam(rawParams, "from");
			const lines = readPositiveIntegerParam(rawParams, "lines");
			const requestedCorpus = readCorpusParam(rawParams, [
				"memory",
				"wiki",
				"all"
			]);
			const { readAgentMemoryFile } = await loadMemoryToolRuntime();
			if (requestedCorpus === "wiki") return await executeWikiMemoryReadResult({
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentId,
				agentSessionKey: options.agentSessionKey,
				sandboxed: options.sandboxed,
				requestedCorpus,
				signal: callerSignal
			});
			return await executeMemoryReadResult({
				read: async () => await readAgentMemoryFile({
					cfg,
					agentId,
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				}),
				requestedCorpus,
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentId,
				agentSessionKey: options.agentSessionKey,
				sandboxed: options.sandboxed,
				signal: callerSignal
			});
		}
	});
}
//#endregion
export { createMemoryGetTool, createMemorySearchTool, testing };
