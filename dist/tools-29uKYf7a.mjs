import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam, s as readFiniteNumberParam, u as readPositiveIntegerParam } from "./common-BofcG96e.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { b as resolveMemoryDreamingConfig, x as resolveMemoryDreamingPluginConfig } from "./dreaming-D2xE6WEV.mjs";
import { n as createMemorySearchDeadlineControl, t as MEMORY_SEARCH_DEADLINE_CONTROL } from "./search-deadline-control-CvwcTLrz.mjs";
import { d as listMemoryCorpusSupplements } from "./memory-state-CrbG6eAa.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { a as stripMemoryAnnotationCarriers } from "./curated-annotations-DM9mz8Th.mjs";
import { a as resolveMemoryIndexIdentityDiagnostic, i as readMemorySearchManagerStatus, o as resolveMemoryIndexSearchDiagnostic, s as resolveMemorySearchStaleness } from "./types-CGuNDIwt.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import "./memory-core-host-runtime-core-CNLFAky0.mjs";
import { i as resolveMemoryToolContext, n as MEMORY_SEARCH_TOOL_CONTRACT, t as MEMORY_GET_TOOL_CONTRACT } from "./memory-tool-contract-5re4KrF1.mjs";
import { t as filterMemorySearchHitsBySessionVisibility } from "./session-search-visibility-Du0ZabkD.mjs";
import { t as captureMemoryRebuildNotice } from "./memory-rebuild-notice-C11wwQEg.mjs";
import { t as createPausedDeadline } from "./paused-deadline-BS0-lwCR.mjs";
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
function isMemorySearchDeadlineError(error) {
	return typeof error === "object" && error !== null && memorySearchDeadlineErrors.has(error);
}
async function runMemorySearchWithDeadline(params) {
	if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
	const controller = new AbortController();
	const timeoutError = createMemorySearchDeadlineError(`memory_search timed out after ${Math.round(params.timeoutMs / 1e3)}s`);
	const cancellation = createDeferredCore();
	const deadlineStartedAt = Date.now();
	const abort = (error) => {
		cancellation.reject(error);
		controller.abort(error);
	};
	const timer = setTimeout(() => abort(timeoutError), params.timeoutMs);
	timer.unref?.();
	const parentSignal = params.parentSignal;
	const onParentAbort = () => abort(resolveMemorySearchAbortError(parentSignal));
	parentSignal?.addEventListener("abort", onParentAbort, { once: true });
	const task = Promise.resolve().then(() => params.run(controller.signal));
	try {
		const result = await Promise.race([task, cancellation.promise]);
		if (parentSignal?.aborted) throw resolveMemorySearchAbortError(parentSignal);
		if (Date.now() - deadlineStartedAt >= params.timeoutMs) {
			controller.abort(timeoutError);
			throw timeoutError;
		}
		return result;
	} finally {
		clearTimeout(timer);
		parentSignal?.removeEventListener("abort", onParentAbort);
	}
}
//#endregion
//#region extensions/memory-core/src/memory-corpus.ts
const memoryCorpusDeadlineChecks = /* @__PURE__ */ new WeakMap();
function unavailableMemoryCorpus(corpus, value, error) {
	const code = extractErrorCode(error);
	return {
		corpus,
		outcome: "unavailable",
		value,
		error: formatErrorMessage(error),
		deadline: isMemorySearchDeadlineError(error),
		...code ? { code } : {}
	};
}
async function raceMemoryCorpusSignal(signal, run) {
	if (signal.aborted) throw resolveMemorySearchAbortError(signal);
	const result = await racePromiseWithAbortSignal(Promise.resolve().then(run), signal, resolveMemorySearchAbortError);
	memoryCorpusDeadlineChecks.get(signal)?.();
	if (signal.aborted) throw resolveMemorySearchAbortError(signal);
	return result;
}
async function attemptMemoryCorpus(params) {
	try {
		return {
			corpus: "memory",
			outcome: "ok",
			value: await raceMemoryCorpusSignal(params.signal, params.run)
		};
	} catch (error) {
		const partial = isMemorySearchDeadlineError(error) ? params.getPartialValue?.() : null;
		if (partial != null) return {
			...unavailableMemoryCorpus("memory", partial, error),
			outcome: "partial"
		};
		return unavailableMemoryCorpus("memory", null, error);
	}
}
async function runMemoryCorpusDeadline(params) {
	if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
	const controller = new AbortController();
	const timeoutError = createMemorySearchDeadlineError(`${params.operation} timed out after ${DEFAULT_MEMORY_SEARCH_TIMEOUT_MS / 1e3}s`);
	const expire = () => controller.abort(timeoutError);
	const control = createMemorySearchDeadlineControl();
	const deadline = createPausedDeadline({
		kind: "corpus",
		timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS,
		signal: controller.signal,
		control,
		expire
	});
	const checkDeadline = () => {
		if (!controller.signal.aborted && deadline.isExpired()) expire();
	};
	memoryCorpusDeadlineChecks.set(controller.signal, checkDeadline);
	deadline.start();
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
		deadline.close();
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
function attemptValue(attempt) {
	return !attempt || attempt.outcome === "not-registered" ? null : attempt.value;
}
async function executeMemoryReadResult(params) {
	if (params.requestedCorpus !== "all" && params.requestedCorpus !== "wiki") try {
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
			const [memory, wiki] = await Promise.all([params.requestedCorpus === "all" ? attemptMemoryCorpus({
				signal,
				run: params.read
			}) : null, readMemoryCorpusSupplements({
				lookup: params.relPath,
				fromLine: params.from,
				lineCount: params.lines,
				agentId: params.agentId,
				agentSessionKey: params.agentSessionKey,
				sandboxed: params.sandboxed,
				signal
			})]);
			const memoryResult = attemptValue(memory);
			const wikiResult = attemptValue(wiki);
			const result = memoryResult?.status !== "not_found" && memoryResult !== null ? memoryResult : wikiResult ?? (memory?.outcome === "ok" || wiki.outcome === "ok" ? {
				status: "not_found",
				path: params.relPath,
				text: ""
			} : {
				...memory ? { status: "error" } : {},
				path: params.relPath,
				text: ""
			});
			return jsonResult({
				...result,
				...composeMemoryCorpusMetadata(memory ? [memory, wiki] : [wiki])
			});
		}
	});
}
//#endregion
//#region extensions/memory-core/src/tools.shared.ts
const SESSION_CANONICAL_KEY_MIGRATION_REQUIRED = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
const SESSION_CANONICAL_KEY_MIGRATION_WARNING = "Memory search is unavailable because the session catalog requires session-key migration.";
const SESSION_CANONICAL_KEY_MIGRATION_ACTION = "Stop the Gateway and run openclaw doctor --fix, then restart the Gateway and retry memory_search.";
const loadMemoryToolRuntime = createLazyRuntimeModule(() => import("./tools.runtime.js"));
async function getMemoryManagerContextWithPurpose(params) {
	const { getMemorySearchManager } = await loadMemoryToolRuntime();
	const { manager, debug, error } = await getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose,
		...params.acquireLocalService ? { acquireLocalService: params.acquireLocalService } : {},
		runInBackgroundContext: params.runInBackgroundContext
	});
	return manager ? {
		manager,
		debug
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
		prepareArguments: params.contract.prepareArguments,
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
	const [defaultWarning, defaultAction] = overrides?.code === SESSION_CANONICAL_KEY_MIGRATION_REQUIRED ? [SESSION_CANONICAL_KEY_MIGRATION_WARNING, SESSION_CANONICAL_KEY_MIGRATION_ACTION] : isQuotaError ? ["Memory search is unavailable because the embedding provider quota is exhausted.", "Top up or switch embedding provider, then retry memory_search."] : isMissingNodeSqlite ? ["Memory search is unavailable because this OpenClaw Node runtime does not provide SQLite support.", "Run OpenClaw with a Node runtime that includes node:sqlite, then retry memory_search."] : isSearchDeadline ? ["Memory search did not finish within its time limit.", deadlineAction] : ["Memory search is unavailable due to an embedding/provider error.", "Check embedding provider configuration and retry memory_search."];
	const warning = overrides?.warning ?? defaultWarning;
	const action = overrides?.action ?? defaultAction;
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
async function executeMemorySearchToolQuery(params) {
	const startedAt = Date.now();
	const runtimeDebug = [];
	const active = params.initialManager;
	const { query, signal, visibility } = params;
	const searchSources = query.explicitSources ?? (query.requestedCorpus === "sessions" ? query.defaultSources : query.requestedCorpus == null || query.requestedCorpus === "all" ? query.conversationRecall?.corpus === "configured" ? query.indexedSources : query.defaultSources : void 0);
	const queryContext = {
		query,
		visibility,
		searchSources,
		startedAt
	};
	const searchOnce = async () => {
		const searchesSessions = searchSources?.includes("sessions") === true;
		if (params.onRebuildNotice) params.onRebuildNotice(captureMemoryRebuildNotice(await readMemorySearchManagerStatus(active.manager, { includeCounts: false })));
		const searchWindow = searchesSessions ? MEMORY_SEARCH_POST_FILTER_MAX_CANDIDATES : query.resultLimit;
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
							if (!signal.aborted) params.onPartialResults?.(result.pausedIndexIdentity ? null : result);
						}, () => {});
					} : void 0,
					...searchSources ? { sources: searchSources } : {}
				}),
				searchWindow
			},
			status: await readMemorySearchManagerStatus(active.manager, { includeCounts: false })
		};
	};
	return await finalizeMemorySearchToolQuery({
		active,
		...await searchOnce(),
		...queryContext,
		runtimeDebug
	});
}
async function finalizeMemorySearchToolQuery(params) {
	const { active, searched, query, visibility, searchSources, runtimeDebug, startedAt } = params;
	const status = params.status ?? await readMemorySearchManagerStatus(active.manager, { includeCounts: false });
	const pausedIndexIdentity = resolveMemoryIndexIdentityDiagnostic(status);
	const formatUpgradeKeywordOnly = pausedIndexIdentity?.status === "mismatched" && pausedIndexIdentity.owner === "openclaw" && (pausedIndexIdentity.chunkingVersionOnly === true || pausedIndexIdentity.lexicalCompatible === true) && Boolean(status.fts?.enabled && status.fts?.available);
	if (pausedIndexIdentity && !formatUpgradeKeywordOnly) return {
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
	if (query.requestedCorpus === "sessions" || query.requestedCorpus === "memory") filtered = filtered.filter((hit) => hit.source === query.requestedCorpus);
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
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!parsed?.rest) return true;
	const tokens = new Set(normalizeLowercaseStringOrEmpty(parsed.rest).split(":").filter(Boolean));
	return !tokens.has("channel") && !tokens.has("group");
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
function readMemorySearchToolCooldown(key) {
	const entry = memorySearchToolCooldowns.get(key);
	if (!entry) return;
	if (entry.until <= Date.now()) {
		memorySearchToolCooldowns.delete(key);
		return;
	}
	return {
		error: entry.error,
		deadline: entry.deadline,
		...entry.code ? { code: entry.code } : {}
	};
}
function recordMemorySearchToolCooldown(key, failure) {
	memorySearchToolCooldowns.set(key, {
		until: Date.now() + MEMORY_SEARCH_TOOL_COOLDOWN_MS,
		...failure
	});
}
const testing = { resetMemorySearchToolCooldowns() {
	memorySearchToolCooldowns.clear();
} };
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
			const rawParams = asNonArrayRecord(params);
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
			const cooldown = requestedCorpus === "wiki" ? void 0 : readMemorySearchToolCooldown(agentId);
			const toolStartedAt = Date.now();
			const searchesMemory = requestedCorpus !== "wiki";
			const searchesWiki = requestedCorpus === "wiki" || requestedCorpus === "all";
			const memoryManagerPurpose = options.oneShotCliRun ? "cli" : void 0;
			const memoryManagersToClose = /* @__PURE__ */ new Set();
			let cleanupStarted = false;
			let searchSignal;
			const rebuildNotices = [];
			const readRebuildWarning = () => [...new Set(rebuildNotices.map((read) => read()).filter(Boolean))].join(" ") || void 0;
			const acquireMemoryManager = async () => {
				const context = await getMemoryManagerContextWithPurpose({
					cfg,
					agentId,
					purpose: memoryManagerPurpose,
					acquireLocalService: options.acquireLocalService,
					runInBackgroundContext: options.runInBackgroundContext
				});
				if (memoryManagerPurpose === "cli" && "manager" in context) {
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
					signal,
					getPartialValue: () => partial?.rawResults.length ? partial : null,
					run: async () => {
						const memory = await acquireMemoryManager();
						if ("error" in memory) throw new Error(memory.error ?? "memory search unavailable");
						signal.throwIfAborted();
						const explicitSources = requestedCorpus === "sessions" && (options.conversationRecall || settings.searchSources.includes("sessions")) ? ["sessions"] : requestedCorpus === "memory" ? ["memory"] : void 0;
						return await executeMemorySearchToolQuery({
							onRebuildNotice: (read) => rebuildNotices.push(read),
							initialManager: {
								manager: memory.manager,
								managerMs: memory.debug?.managerMs
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
					recordMemorySearchToolCooldown(agentId, failure);
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
							import("./short-term-promotion-record-YlABW2xA.mjs").then(({ recordShortTermRecalls }) => recordShortTermRecalls(recall)).catch(() => {});
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
				if (requestedCorpus !== "wiki") recordMemorySearchToolCooldown(agentId, failed);
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
			const rawParams = asNonArrayRecord(params);
			const relPath = readToolStringParam(rawParams, "path", { required: true });
			const from = readPositiveIntegerParam(rawParams, "from");
			const lines = readPositiveIntegerParam(rawParams, "lines");
			const requestedCorpus = readCorpusParam(rawParams, [
				"memory",
				"wiki",
				"all"
			]);
			const { readAgentMemoryFile } = await loadMemoryToolRuntime();
			return await executeMemoryReadResult({
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentId,
				agentSessionKey: options.agentSessionKey,
				sandboxed: options.sandboxed,
				requestedCorpus,
				signal: callerSignal,
				read: async () => await readAgentMemoryFile({
					cfg,
					agentId,
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				})
			});
		}
	});
}
//#endregion
export { createMemoryGetTool, createMemorySearchTool, testing };
