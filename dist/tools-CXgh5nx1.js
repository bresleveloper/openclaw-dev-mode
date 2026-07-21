import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { v as resolveSessionAgentId, y as resolveSessionAgentIds } from "./agent-scope-B2Pk_xhT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { G as resolveMemoryDeepDreamingConfig, K as resolveMemoryDreamingConfig, W as resolveMemoryCorePluginConfig } from "./dreaming-DqzMSXGC.js";
import { s as listMemoryCorpusSupplements } from "./memory-state-DefveORB.js";
import { f as readFiniteNumberParam, h as readPositiveIntegerParam, r as asToolParamsRecord, y as readStringParam } from "./common-DWyiui3y.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-CzF585qn.js";
import { r as optionalFiniteNumberSchema, s as stringEnum } from "./typebox-B_TbP7xZ.js";
import { o as resolveEffectiveSessionToolsVisibility, r as createSessionVisibilityGuard, t as createAgentToAgentPolicy } from "./session-visibility-DAoDjTqU.js";
import "./error-runtime-CDUW9C58.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import { t as resolveMemorySearchConfig } from "./memory-search-JiXKdx8t.js";
import "./channel-actions-BCdRlnH7.js";
import { r as resolveSessionTranscriptMemoryHitKeyToSessionKeys } from "./session-transcript-memory-hit-BM_9f4ft.js";
import { r as resolveTranscriptStemToSessionKeys, t as extractTranscriptIdentityFromSessionsMemoryHit } from "./session-transcript-hit-nLjDFaBA.js";
import "./memory-core-host-status-BkahMnJL.js";
import "./memory-core-host-runtime-core-Di4rpgdo.js";
import "./memory-host-core-DgawxPlM.js";
import "./dreaming-shared-CCl2ex70.js";
import { b as recordShortTermRecalls } from "./short-term-promotion-B_Tp_IBc.js";
import { r as readQmdSessionArtifactIdentity } from "./qmd-session-artifacts-Dn4NO3bg.js";
import { Type } from "typebox";
//#region extensions/memory-core/src/session-search-visibility.ts
function normalizeAgentIdForCompare(value) {
	return value?.trim().toLowerCase() || void 0;
}
function isGlobalSessionKeyForSharedScope(cfg, key) {
	return cfg.session?.scope === "global" && key.trim().toLowerCase() === "global";
}
function filterSessionKeysByScopedAgent(params) {
	const scopedAgentId = normalizeAgentIdForCompare(params.scopedAgentId);
	if (!scopedAgentId) return params.keys;
	return params.keys.filter((key) => {
		if (isGlobalSessionKeyForSharedScope(params.cfg, key)) return true;
		return normalizeAgentIdForCompare(resolveSessionAgentId({
			sessionKey: key,
			config: params.cfg
		})) === scopedAgentId;
	});
}
async function filterMemorySearchHitsBySessionVisibility(params) {
	const visibility = resolveEffectiveSessionToolsVisibility({
		cfg: params.cfg,
		sandboxed: params.sandboxed
	});
	const a2aPolicy = createAgentToAgentPolicy(params.cfg);
	const requesterAgentId = params.requesterSessionKey ? resolveSessionAgentId({
		sessionKey: params.requesterSessionKey,
		config: params.cfg
	}) : void 0;
	const scopedAgentId = params.agentId?.trim() || requesterAgentId;
	const guard = params.requesterSessionKey ? await createSessionVisibilityGuard({
		action: "history",
		requesterSessionKey: params.requesterSessionKey,
		visibility,
		a2aPolicy
	}) : null;
	const { store: combinedSessionStore } = loadCombinedSessionStoreForGateway(params.cfg, scopedAgentId ? { agentId: scopedAgentId } : {});
	const next = [];
	for (const hit of params.hits) {
		if (hit.source !== "sessions") {
			next.push(hit);
			continue;
		}
		if (!params.requesterSessionKey || !guard) continue;
		const artifactIdentity = readQmdSessionArtifactIdentity(hit);
		if (artifactIdentity) {
			const normalizedScopedAgentId = normalizeAgentIdForCompare(scopedAgentId);
			const normalizedOwnerAgentId = normalizeAgentIdForCompare(artifactIdentity.agentId);
			if (normalizedScopedAgentId && normalizedOwnerAgentId && normalizedOwnerAgentId !== normalizedScopedAgentId) continue;
			const keys = filterSessionKeysByScopedAgent({
				cfg: params.cfg,
				scopedAgentId,
				keys: resolveSessionTranscriptMemoryHitKeyToSessionKeys({
					store: combinedSessionStore,
					key: artifactIdentity.memoryKey,
					includeSyntheticFallback: artifactIdentity.archived
				})
			});
			if (keys.length === 0) continue;
			if (!keys.some((key) => guard.check(key).allowed)) continue;
			next.push(hit);
			continue;
		}
		const identity = extractTranscriptIdentityFromSessionsMemoryHit(hit.path);
		if (!identity) continue;
		const isQmdSessionHit = hit.path.replace(/\\/g, "/").startsWith("qmd/");
		const normalizedScopedAgentId = normalizeAgentIdForCompare(scopedAgentId);
		const normalizedOwnerAgentId = normalizeAgentIdForCompare(identity.ownerAgentId);
		if (normalizedScopedAgentId && normalizedOwnerAgentId && normalizedOwnerAgentId !== normalizedScopedAgentId) continue;
		const archivedOwnerAgentId = Boolean(identity.archived && (identity.ownerAgentId && (!scopedAgentId || normalizeAgentIdForCompare(identity.ownerAgentId) === normalizeAgentIdForCompare(scopedAgentId)) || isQmdSessionHit && scopedAgentId)) ? identity.ownerAgentId ?? scopedAgentId : void 0;
		const liveKeys = identity.liveStem ? resolveTranscriptStemToSessionKeys({
			store: combinedSessionStore,
			stem: identity.liveStem,
			allowQmdSlugFallback: false
		}) : [];
		const keys = filterSessionKeysByScopedAgent({
			cfg: params.cfg,
			scopedAgentId,
			keys: liveKeys.length > 0 ? liveKeys : resolveTranscriptStemToSessionKeys({
				store: combinedSessionStore,
				stem: identity.stem,
				allowQmdSlugFallback: isQmdSessionHit && !identity.archived,
				...archivedOwnerAgentId ? { archivedOwnerAgentId } : {}
			})
		});
		if (keys.length === 0) continue;
		if (!keys.some((key) => guard.check(key).allowed)) continue;
		next.push(hit);
	}
	return next;
}
//#endregion
//#region extensions/memory-core/src/tools.citations.ts
function resolveMemoryCitationsMode(cfg) {
	const mode = cfg.memory?.citations;
	if (mode === "on" || mode === "off" || mode === "auto") return mode;
	return "auto";
}
function decorateCitations(results, include) {
	if (!include) return results.map((entry) => ({
		...entry,
		citation: void 0
	}));
	return results.map((entry) => {
		const citation = formatCitation(entry);
		const snippet = `${entry.snippet.trim()}\n\nSource: ${citation}`;
		return {
			...entry,
			citation,
			snippet
		};
	});
}
function formatCitation(entry) {
	const lineRange = entry.startLine === entry.endLine ? `#L${entry.startLine}` : `#L${entry.startLine}-L${entry.endLine}`;
	return `${entry.path}${lineRange}`;
}
function clampResultsByInjectedChars(results, budget) {
	if (!budget || budget <= 0) return results;
	let remaining = budget;
	const clamped = [];
	for (const entry of results) {
		if (remaining <= 0) break;
		const snippet = entry.snippet ?? "";
		if (snippet.length <= remaining) {
			clamped.push(entry);
			remaining -= snippet.length;
		} else {
			const trimmed = snippet.slice(0, Math.max(0, remaining));
			clamped.push({
				...entry,
				snippet: trimmed
			});
			break;
		}
	}
	return clamped;
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
//#region extensions/memory-core/src/tools.shared.ts
const loadMemoryToolRuntime = createLazyRuntimeModule(() => import("./tools.runtime.js"));
const MemorySearchSchema = Type.Object({
	query: Type.String(),
	maxResults: Type.Optional(Type.Integer({ minimum: 1 })),
	minScore: optionalFiniteNumberSchema(),
	corpus: Type.Optional(stringEnum([
		"memory",
		"wiki",
		"all",
		"sessions"
	]))
});
const MemoryGetSchema = Type.Object({
	path: Type.String(),
	from: Type.Optional(Type.Integer()),
	lines: Type.Optional(Type.Integer()),
	corpus: Type.Optional(stringEnum([
		"memory",
		"wiki",
		"all"
	]))
});
function resolveMemoryToolContext(options) {
	const cfg = options.getConfig?.() ?? options.config;
	if (!cfg) return null;
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		sessionKey: options.agentSessionKey,
		config: cfg,
		agentId: options.agentId
	});
	if (!resolveMemorySearchConfig(cfg, agentId)) return null;
	return {
		cfg,
		agentId
	};
}
async function getMemoryManagerContextWithPurpose(params) {
	const { getMemorySearchManager } = await loadMemoryToolRuntime();
	const startedAt = Date.now();
	const { manager, debug, error } = await getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose
	});
	return manager ? {
		manager,
		debug: {
			...debug,
			managerMs: debug?.managerMs ?? Math.max(0, Date.now() - startedAt)
		}
	} : { error };
}
function createMemoryTool(params) {
	const ctx = resolveMemoryToolContext(params.options);
	if (!ctx) return null;
	return {
		label: params.label,
		name: params.name,
		description: params.description,
		parameters: params.parameters,
		execute: async (toolCallId, toolParams) => {
			const latestCtx = resolveMemoryToolContext(params.options) ?? ctx;
			return await params.execute(latestCtx)(toolCallId, toolParams);
		}
	};
}
function buildMemorySearchUnavailableResult(error, overrides) {
	const reason = (error ?? "memory search unavailable").trim() || "memory search unavailable";
	const normalizedReason = normalizeLowercaseStringOrEmpty(reason);
	const isQuotaError = /insufficient_quota|quota|429/.test(normalizedReason);
	const isMissingNodeSqlite = /missing node:sqlite|no such built-?in module: node:sqlite/.test(normalizedReason);
	const warning = overrides?.warning ?? (isQuotaError ? "Memory search is unavailable because the embedding provider quota is exhausted." : isMissingNodeSqlite ? "Memory search is unavailable because this OpenClaw Node runtime does not provide SQLite support." : "Memory search is unavailable due to an embedding/provider error.");
	const action = overrides?.action ?? (isQuotaError ? "Top up or switch embedding provider, then retry memory_search." : isMissingNodeSqlite ? "Run OpenClaw with a Node runtime that includes node:sqlite, then retry memory_search." : "Check embedding provider configuration and retry memory_search.");
	return {
		results: [],
		disabled: true,
		unavailable: true,
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
async function searchMemoryCorpusSupplements(params) {
	if (params.corpus === "memory" || params.corpus === "sessions") return [];
	const supplements = listMemoryCorpusSupplements();
	if (supplements.length === 0) return [];
	return (await Promise.all(supplements.map(async (registration) => await registration.supplement.search(params)))).flat().toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.path.localeCompare(right.path);
	}).slice(0, Math.max(1, params.maxResults ?? 10));
}
async function getMemoryCorpusSupplementResult(params) {
	if (params.corpus === "memory" || params.corpus === "sessions") return null;
	for (const registration of listMemoryCorpusSupplements()) {
		const result = await registration.supplement.get(params);
		if (result) return result;
	}
	return null;
}
//#endregion
//#region extensions/memory-core/src/tools.ts
const MEMORY_SEARCH_TOOL_TIMEOUT_MS = 15e3;
const MEMORY_SEARCH_TOOL_COOLDOWN_MS = 6e4;
const memorySearchToolCooldowns = /* @__PURE__ */ new Map();
function mergeQmdRuntimeDebug(entries) {
	const merged = {};
	for (const entry of entries) {
		const qmd = entry.qmd;
		if (!qmd) continue;
		if (!merged.collectionValidation && qmd.collectionValidation) merged.collectionValidation = qmd.collectionValidation;
		if (qmd.multiCollectionProbe) merged.multiCollectionProbe = qmd.multiCollectionProbe;
		if (qmd.searchPlan) merged.searchPlan = qmd.searchPlan;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function resolveMemorySearchToolCooldownKey(options) {
	return options.agentId ?? options.agentSessionKey ?? "default";
}
function readMemorySearchToolCooldown(key) {
	const entry = memorySearchToolCooldowns.get(key);
	if (!entry) return;
	if (entry.until <= Date.now()) {
		memorySearchToolCooldowns.delete(key);
		return;
	}
	return { error: entry.error };
}
function recordMemorySearchToolCooldown(key, error) {
	memorySearchToolCooldowns.set(key, {
		until: Date.now() + MEMORY_SEARCH_TOOL_COOLDOWN_MS,
		error
	});
}
const testing = { resetMemorySearchToolCooldowns() {
	memorySearchToolCooldowns.clear();
} };
function isActiveMemoryManagerContext(context) {
	return context !== null && "manager" in context;
}
async function closeMemoryManagers(managers) {
	for (const manager of managers) try {
		await manager.close?.();
	} catch {}
}
async function runMemorySearchToolWithDeadline(params) {
	const timeoutError = () => /* @__PURE__ */ new Error(`memory_search timed out after ${Math.round(params.timeoutMs / 1e3)}s`);
	const controller = new AbortController();
	let timer;
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => {
			resolve("timeout");
			controller.abort(timeoutError());
		}, params.timeoutMs);
		timer.unref?.();
	});
	const task = params.run(controller.signal);
	task.catch(() => void 0);
	try {
		const result = await Promise.race([task, timeoutPromise]);
		if (result === "timeout") return {
			status: "unavailable",
			error: timeoutError().message
		};
		return {
			status: "ok",
			value: result
		};
	} catch (error) {
		return {
			status: "unavailable",
			error: formatErrorMessage(error)
		};
	} finally {
		if (timer) clearTimeout(timer);
	}
}
const PAUSED_MEMORY_INDEX_WARNING = "Tell the user: memory search is paused because the memory index was built with a different embedding provider/model/settings.";
const PAUSED_MEMORY_INDEX_ACTION = "Tell the user to run: openclaw memory status --index or openclaw memory index --force.";
function resolvePausedMemoryIndexIdentityReason(status) {
	const indexIdentity = asNullableRecord(asNullableRecord(status.custom)?.indexIdentity);
	if (indexIdentity?.status !== "mismatched" && indexIdentity?.status !== "missing") return;
	return typeof indexIdentity.reason === "string" && indexIdentity.reason.trim() ? indexIdentity.reason.trim() : "memory index identity is missing or mismatched";
}
function buildPausedMemoryIndexUnavailableResult(reason) {
	return buildMemorySearchUnavailableResult(reason, {
		warning: PAUSED_MEMORY_INDEX_WARNING,
		action: PAUSED_MEMORY_INDEX_ACTION
	});
}
function sortMemorySearchToolResults(results) {
	return results.toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.path.localeCompare(right.path);
	});
}
function mergeMemorySearchCorpusResults(params) {
	const memoryResults = sortMemorySearchToolResults(params.memoryResults);
	const supplementResults = sortMemorySearchToolResults(params.supplementResults);
	if (!params.balanceCorpora || memoryResults.length === 0 || supplementResults.length === 0) return sortMemorySearchToolResults([...memoryResults, ...supplementResults]).slice(0, params.maxResults);
	const perCorpusCap = Math.ceil(params.maxResults / 2);
	const selectedMemory = memoryResults.slice(0, perCorpusCap);
	const selectedSupplements = supplementResults.slice(0, perCorpusCap);
	const selected = [...selectedMemory, ...selectedSupplements];
	if (selected.length < params.maxResults) selected.push(...sortMemorySearchToolResults([...memoryResults.slice(selectedMemory.length), ...supplementResults.slice(selectedSupplements.length)]).slice(0, params.maxResults - selected.length));
	return sortMemorySearchToolResults(selected).slice(0, params.maxResults);
}
function isClosedMemoryStoreError(error) {
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("database is not open") || message.includes("database connection is not open") || message.includes("database handle is closed") || message.includes("memory search manager is closed");
}
function buildRecallKey(result) {
	return `${result.source}:${result.path}:${result.startLine}:${result.endLine}`;
}
function resolveRecallTrackingResults(rawResults, surfacedResults) {
	if (surfacedResults.length === 0 || rawResults.length === 0) return surfacedResults;
	const rawByKey = /* @__PURE__ */ new Map();
	for (const raw of rawResults) {
		const key = buildRecallKey(raw);
		if (!rawByKey.has(key)) rawByKey.set(key, raw);
	}
	return surfacedResults.map((surfaced) => rawByKey.get(buildRecallKey(surfaced)) ?? surfaced);
}
function queueShortTermRecallTracking(params) {
	const trackingResults = resolveRecallTrackingResults(params.rawResults, params.surfacedResults);
	recordShortTermRecalls({
		workspaceDir: params.workspaceDir,
		query: params.query,
		results: trackingResults,
		timezone: params.timezone
	}).catch(() => {});
}
function normalizeActiveMemoryQmdSearchMode(value) {
	return value === "inherit" || value === "search" || value === "vsearch" || value === "query" ? value : "search";
}
function isActiveMemorySessionKey(sessionKey) {
	return typeof sessionKey === "string" && sessionKey.includes(":active-memory:");
}
function resolveActiveMemoryQmdSearchModeOverride(cfg, sessionKey) {
	if (!isActiveMemorySessionKey(sessionKey)) return;
	const entry = cfg.plugins?.entries?.["active-memory"];
	const entryRecord = entry && typeof entry === "object" && !Array.isArray(entry) ? entry : void 0;
	const searchMode = normalizeActiveMemoryQmdSearchMode((entryRecord?.config && typeof entryRecord.config === "object" && !Array.isArray(entryRecord.config) ? entryRecord.config : void 0)?.qmd?.searchMode);
	return searchMode === "inherit" ? void 0 : searchMode;
}
async function getSupplementMemoryReadResult(params) {
	const supplement = await getMemoryCorpusSupplementResult({
		lookup: params.relPath,
		fromLine: params.from,
		lineCount: params.lines,
		agentSessionKey: params.agentSessionKey,
		corpus: params.corpus
	});
	if (!supplement) return null;
	const { content, ...rest } = supplement;
	return {
		...rest,
		text: content
	};
}
async function resolveMemoryReadFailureResult(params) {
	if (params.requestedCorpus === "all") try {
		const supplement = await getSupplementMemoryReadResult({
			relPath: params.relPath,
			from: params.from,
			lines: params.lines,
			agentSessionKey: params.agentSessionKey,
			corpus: params.requestedCorpus
		});
		if (supplement) return jsonResult(supplement);
	} catch {}
	const message = formatErrorMessage(params.error);
	return jsonResult({
		path: params.relPath,
		text: "",
		disabled: true,
		error: message
	});
}
function isMissingMemoryReadResult(result, relPath) {
	return result.path === relPath && result.text === "" && result.from === void 0;
}
async function executeMemoryReadResult(params) {
	try {
		const result = await params.read();
		if (params.requestedCorpus === "all" && isMissingMemoryReadResult(result, params.relPath)) {
			const supplement = await getSupplementMemoryReadResult({
				relPath: params.relPath,
				from: params.from,
				lines: params.lines,
				agentSessionKey: params.agentSessionKey,
				corpus: params.requestedCorpus
			});
			if (supplement) return jsonResult(supplement);
		}
		return jsonResult(result);
	} catch (error) {
		return await resolveMemoryReadFailureResult({
			error,
			requestedCorpus: params.requestedCorpus,
			relPath: params.relPath,
			from: params.from,
			lines: params.lines,
			agentSessionKey: params.agentSessionKey
		});
	}
}
function createMemorySearchTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Search",
		name: "memory_search",
		description: "Mandatory recall step: semantically search MEMORY.md + memory/*.md (and optional session transcripts) before answering questions about prior work, decisions, dates, people, preferences, or todos. Optional `corpus=wiki` or `corpus=all` also searches registered compiled-wiki supplements. `corpus=memory` restricts hits to indexed memory files (excludes session transcript chunks from ranking). `corpus=sessions` restricts hits to indexed session transcripts (same visibility rules as session history tools). If response has disabled=true, memory retrieval is unavailable; you must tell the user and include the warning/action guidance.",
		parameters: MemorySearchSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params) => {
			const rawParams = asToolParamsRecord(params);
			const query = readStringParam(rawParams, "query", { required: true });
			const maxResults = readPositiveIntegerParam(rawParams, "maxResults");
			const minScore = readFiniteNumberParam(rawParams, "minScore");
			const requestedCorpus = readStringParam(rawParams, "corpus");
			const cooldownKey = resolveMemorySearchToolCooldownKey({
				agentId,
				agentSessionKey: options.agentSessionKey
			});
			const cooldown = requestedCorpus === "wiki" ? void 0 : readMemorySearchToolCooldown(cooldownKey);
			let activeUnavailablePhase;
			let failedUnavailablePhase;
			const runUnavailablePhase = async (phase, task) => {
				activeUnavailablePhase = phase;
				try {
					return await task();
				} catch (error) {
					failedUnavailablePhase = phase;
					throw error;
				} finally {
					if (activeUnavailablePhase === phase) activeUnavailablePhase = void 0;
				}
			};
			const outcome = await runMemorySearchToolWithDeadline({
				timeoutMs: MEMORY_SEARCH_TOOL_TIMEOUT_MS,
				run: async (deadlineSignal) => {
					const toolStartedAt = Date.now();
					const { resolveMemoryBackendConfig } = await loadMemoryToolRuntime();
					const shouldQuerySupplements = requestedCorpus === "wiki" || requestedCorpus === "all";
					const shouldQueryMemory = requestedCorpus !== "wiki" && !cooldown;
					if (cooldown && !shouldQuerySupplements) return jsonResult(buildMemorySearchUnavailableResult(cooldown.error));
					const memoryManagerPurpose = options.oneShotCliRun ? "cli" : void 0;
					const memoryManagersToClose = /* @__PURE__ */ new Set();
					const trackMemoryManager = (context) => {
						if (memoryManagerPurpose === "cli" && isActiveMemoryManagerContext(context)) memoryManagersToClose.add(context.manager);
						return context;
					};
					try {
						const memory = shouldQueryMemory ? await runUnavailablePhase("memory", async () => trackMemoryManager(await getMemoryManagerContextWithPurpose({
							cfg,
							agentId,
							purpose: memoryManagerPurpose
						}))) : null;
						if (shouldQueryMemory && memory && "error" in memory && !shouldQuerySupplements) {
							recordMemorySearchToolCooldown(cooldownKey, memory.error ?? "memory search unavailable");
							return jsonResult(buildMemorySearchUnavailableResult(memory.error));
						}
						const citationsMode = resolveMemoryCitationsMode(cfg);
						const includeCitations = shouldIncludeCitations({
							mode: citationsMode,
							sessionKey: options.agentSessionKey
						});
						const pluginConfig = resolveMemoryCorePluginConfig(cfg);
						const dreamingEnabled = resolveMemoryDreamingConfig({
							pluginConfig,
							cfg
						}).enabled;
						const dreaming = resolveMemoryDeepDreamingConfig({
							pluginConfig,
							cfg
						});
						const searchStartedAt = Date.now();
						let rawResults = [];
						let surfacedMemoryResults = [];
						let provider;
						let model;
						let fallback;
						let searchMode;
						let pausedIndexIdentityReason;
						let managerMs;
						let managerCacheState;
						let searchDebug;
						if (shouldQueryMemory && memory && !("error" in memory)) {
							await runUnavailablePhase("memory", async () => {
								let activeMemory = memory;
								const runtimeDebug = [];
								const qmdSearchModeOverride = resolveActiveMemoryQmdSearchModeOverride(cfg, options.agentSessionKey);
								const searchSources = requestedCorpus === "sessions" ? ["sessions"] : requestedCorpus === "memory" ? ["memory"] : void 0;
								const searchOptions = {
									maxResults,
									minScore,
									sessionKey: options.agentSessionKey,
									qmdSearchModeOverride,
									signal: deadlineSignal,
									onDebug: (debug) => {
										runtimeDebug.push(debug);
									},
									...searchSources ? { sources: searchSources } : {}
								};
								managerMs = memory.debug?.managerMs;
								managerCacheState = memory.debug?.managerCacheState;
								try {
									rawResults = await activeMemory.manager.search(query, searchOptions);
								} catch (error) {
									if (!isClosedMemoryStoreError(error)) throw error;
									const refreshed = trackMemoryManager(await getMemoryManagerContextWithPurpose({
										cfg,
										agentId,
										purpose: memoryManagerPurpose
									}));
									if ("error" in refreshed) throw error;
									managerMs = refreshed.debug?.managerMs;
									managerCacheState = refreshed.debug?.managerCacheState;
									activeMemory = refreshed;
									rawResults = await activeMemory.manager.search(query, searchOptions);
								}
								const statusBeforeRetry = activeMemory.manager.status();
								pausedIndexIdentityReason = resolvePausedMemoryIndexIdentityReason(statusBeforeRetry);
								if (pausedIndexIdentityReason) return;
								if (rawResults.length === 0 && activeMemory.manager.sync && (statusBeforeRetry.backend !== "qmd" || options.oneShotCliRun === true)) {
									await activeMemory.manager.sync({
										reason: "search",
										force: true
									});
									rawResults = await activeMemory.manager.search(query, searchOptions);
									pausedIndexIdentityReason = resolvePausedMemoryIndexIdentityReason(activeMemory.manager.status());
									if (pausedIndexIdentityReason) return;
								}
								rawResults = await filterMemorySearchHitsBySessionVisibility({
									cfg,
									agentId,
									requesterSessionKey: options.agentSessionKey,
									sandboxed: options.sandboxed === true,
									hits: rawResults
								});
								if (requestedCorpus === "sessions") rawResults = rawResults.filter((hit) => hit.source === "sessions");
								else if (requestedCorpus === "memory") rawResults = rawResults.filter((hit) => hit.source === "memory");
								const status = activeMemory.manager.status();
								const decorated = decorateCitations(rawResults, includeCitations);
								const resolved = resolveMemoryBackendConfig({
									cfg,
									agentId
								});
								const memoryResults = status.backend === "qmd" ? clampResultsByInjectedChars(decorated, resolved.qmd?.limits.maxInjectedChars) : decorated;
								surfacedMemoryResults = memoryResults.map((result) => ({
									...result,
									corpus: result.source
								}));
								if (dreamingEnabled) queueShortTermRecallTracking({
									workspaceDir: status.workspaceDir,
									query,
									rawResults,
									surfacedResults: memoryResults,
									timezone: dreaming.timezone
								});
								provider = status.provider;
								model = status.model;
								fallback = status.fallback;
								const latestDebug = runtimeDebug.at(-1);
								const qmdDebug = mergeQmdRuntimeDebug(runtimeDebug);
								searchMode = latestDebug?.effectiveMode;
								const searchMs = Math.max(0, Date.now() - searchStartedAt);
								searchDebug = {
									backend: status.backend,
									configuredMode: latestDebug?.configuredMode,
									effectiveMode: status.backend === "qmd" ? latestDebug?.effectiveMode ?? latestDebug?.configuredMode : "n/a",
									fallback: latestDebug?.fallback,
									managerMs,
									searchMs,
									managerCacheState,
									qmd: qmdDebug,
									hits: rawResults.length
								};
							});
							if (pausedIndexIdentityReason) return jsonResult(buildPausedMemoryIndexUnavailableResult(pausedIndexIdentityReason));
						}
						const supplementResults = shouldQuerySupplements ? await runUnavailablePhase("supplement", async () => await searchMemoryCorpusSupplements({
							query,
							maxResults,
							agentSessionKey: options.agentSessionKey,
							corpus: requestedCorpus
						})) : [];
						const results = mergeMemorySearchCorpusResults({
							memoryResults: surfacedMemoryResults,
							supplementResults,
							maxResults: Math.max(1, maxResults ?? 10),
							balanceCorpora: requestedCorpus === "all"
						});
						if (searchDebug) {
							const finalToolMs = Math.max(0, Date.now() - toolStartedAt);
							searchDebug = {
								...searchDebug,
								toolMs: finalToolMs,
								outsideSearchMs: Math.max(0, finalToolMs - searchDebug.searchMs)
							};
						}
						return jsonResult({
							results,
							provider,
							model,
							fallback,
							citations: citationsMode,
							mode: searchMode,
							debug: searchDebug
						});
					} finally {
						await closeMemoryManagers(memoryManagersToClose);
					}
				}
			});
			if (outcome.status === "unavailable") {
				if (requestedCorpus !== "wiki" && (requestedCorpus !== "all" || (failedUnavailablePhase ?? activeUnavailablePhase) === "memory")) recordMemorySearchToolCooldown(cooldownKey, outcome.error);
				return jsonResult(buildMemorySearchUnavailableResult(outcome.error));
			}
			return outcome.value;
		}
	});
}
function createMemoryGetTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Get",
		name: "memory_get",
		description: "Safe exact excerpt read from MEMORY.md or memory/*.md. Defaults to a bounded excerpt when lines are omitted, includes truncation/continuation info when more content exists, and `corpus=wiki` reads from registered compiled-wiki supplements.",
		parameters: MemoryGetSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params) => {
			const rawParams = asToolParamsRecord(params);
			const relPath = readStringParam(rawParams, "path", { required: true });
			const from = readPositiveIntegerParam(rawParams, "from");
			const lines = readPositiveIntegerParam(rawParams, "lines");
			const requestedCorpus = readStringParam(rawParams, "corpus");
			const { readAgentMemoryFile, resolveMemoryBackendConfig } = await loadMemoryToolRuntime();
			if (requestedCorpus === "wiki") return jsonResult(await getSupplementMemoryReadResult({
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentSessionKey: options.agentSessionKey,
				corpus: requestedCorpus
			}) ?? {
				path: relPath,
				text: "",
				disabled: true,
				error: "wiki corpus result not found"
			});
			if (resolveMemoryBackendConfig({
				cfg,
				agentId
			}).backend === "builtin") return await executeMemoryReadResult({
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
				agentSessionKey: options.agentSessionKey
			});
			const memory = await getMemoryManagerContextWithPurpose({
				cfg,
				agentId,
				purpose: "status"
			});
			if ("error" in memory) return jsonResult({
				path: relPath,
				text: "",
				disabled: true,
				error: memory.error
			});
			return await executeMemoryReadResult({
				read: async () => await memory.manager.readFile({
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				}),
				requestedCorpus,
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentSessionKey: options.agentSessionKey
			});
		}
	});
}
//#endregion
export { createMemoryGetTool, createMemorySearchTool, testing };
