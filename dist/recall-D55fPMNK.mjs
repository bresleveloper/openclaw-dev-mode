import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-runtime-BXs_VkH-.mjs";
import { a as normalizeActiveMemoryFastMode } from "./config-BxNoMMde.mjs";
import { o as getModelRef } from "./query-BDQoVIAg.mjs";
import { d as scheduleMemorySearchCleanupAfterTimeout, f as setCachedResult, h as toSingleLineLogValue, i as getCachedResult, l as resetCircuitBreaker, m as toSingleLineErrorMessage, n as buildCircuitBreakerKey, o as isCircuitBreakerOpen, p as shouldCacheResult, s as recordCircuitBreakerTimeout, t as buildCacheKey, u as resolveActiveRecallForRun } from "./recall-state-Da6a2By7.mjs";
import { i as resolveCanonicalSessionKeyFromSessionId, n as buildPluginStatusLine, r as persistPluginStatusLines, t as buildPersistedDebugSummary } from "./session-DY9rSceD.mjs";
import { n as watchTerminalMemorySearchResult } from "./transcript-watch-BYyW8-uH.mjs";
import { n as buildSubagentRecallResult, r as buildTimeoutRecallResult, s as readPartialTimeoutData } from "./transcript-result-CYXFyLjf.mjs";
import { t as runRecallSubagent } from "./recall-run-5h09nQ8M.mjs";
//#region extensions/active-memory/recall.ts
function buildRecallDoneLogLine(logPrefix, result) {
	const reason = result.status === "unavailable" ? result.searchDebug?.error ? "search-error" : "search-unavailable" : void 0;
	return [
		logPrefix,
		"done",
		`status=${result.status}`,
		...reason ? [`reason=${reason}`] : [],
		`elapsedMs=${String(result.elapsedMs)}`,
		`summaryChars=${String(result.summary?.length ?? 0)}`
	].join(" ");
}
function formatActiveMemoryFastMode(fastMode) {
	return fastMode === void 0 ? "inherit" : fastMode === true ? "on" : fastMode === false ? "off" : "auto";
}
function prepareRecallRunContext(params) {
	const parentSessionKey = params.sessionKey ?? resolveCanonicalSessionKeyFromSessionId({
		api: params.api,
		agentId: params.agentId,
		sessionId: params.sessionId
	});
	const storePath = params.api.runtime.agent.session.resolveStorePath(params.runtimeConfig.session?.store, { agentId: params.agentId });
	if (params.config.fastMode !== void 0) return {
		parentSessionKey,
		storePath,
		fastMode: params.config.fastMode
	};
	const sessionFastMode = parentSessionKey ? params.api.runtime.agent.session.getSessionEntry({
		agentId: params.agentId,
		sessionKey: parentSessionKey,
		storePath,
		readConsistency: "latest"
	})?.fastMode : void 0;
	return {
		parentSessionKey,
		storePath,
		fastMode: normalizeActiveMemoryFastMode(sessionFastMode) ?? normalizeActiveMemoryFastMode(resolveAgentConfig(params.runtimeConfig, params.agentId)?.fastModeDefault)
	};
}
async function recordRecallResult(params) {
	if (params.config.logging) params.api.logger.info?.(buildRecallDoneLogLine(params.logPrefix, params.result));
	params.abortSignal?.throwIfAborted();
	await persistPluginStatusLines({
		api: params.api,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		statusLine: buildPluginStatusLine({
			result: params.result,
			config: params.config
		}),
		debugSummary: buildPersistedDebugSummary(params.result),
		searchDebug: params.result.searchDebug
	});
	params.abortSignal?.throwIfAborted();
}
async function resolveActiveRecall(params) {
	params.abortSignal?.throwIfAborted();
	const startedAt = Date.now();
	const resolvedModelRef = getModelRef(params.runtimeConfig, params.agentId, params.config, {
		modelProviderId: params.currentModelProviderId,
		modelId: params.currentModelId
	});
	const cacheKey = params.conversationRecall ? void 0 : buildCacheKey({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		query: params.query,
		authorityFingerprint: params.authorityFingerprint,
		memorySlot: params.memorySlot,
		activeProjectKeys: params.activeProjectKeys,
		modelProviderId: resolvedModelRef?.provider,
		modelId: resolvedModelRef?.model,
		recallToolNames: params.config.toolsAllow
	});
	const cached = cacheKey ? getCachedResult(cacheKey) : void 0;
	const buildLogPrefix = (fastMode) => [
		`active-memory: agent=${toSingleLineLogValue(params.agentId)}`,
		`session=${toSingleLineLogValue(params.sessionKey ?? params.sessionId ?? "none")}`,
		...resolvedModelRef?.provider ? [`activeProvider=${toSingleLineLogValue(resolvedModelRef.provider)}`] : [],
		...resolvedModelRef?.model ? [`activeModel=${toSingleLineLogValue(resolvedModelRef.model)}`] : [],
		`thinking=${params.config.thinking}`,
		`fast=${formatActiveMemoryFastMode(fastMode)}`
	].join(" ");
	let logPrefix = buildLogPrefix(params.config.fastMode);
	if (cached) {
		params.abortSignal?.throwIfAborted();
		await persistPluginStatusLines({
			api: params.api,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			statusLine: `${buildPluginStatusLine({
				result: cached,
				config: params.config
			})} cached`,
			debugSummary: buildPersistedDebugSummary(cached),
			searchDebug: cached.searchDebug
		});
		params.abortSignal?.throwIfAborted();
		if (params.config.logging) params.api.logger.info?.(`${logPrefix} cached status=${cached.status} summaryChars=${String(cached.summary?.length ?? 0)} queryChars=${String(params.query.length)}`);
		return cached;
	}
	const cbKey = buildCircuitBreakerKey(params.agentId, resolvedModelRef?.provider, resolvedModelRef?.model);
	let timeoutCleanupScheduled = false;
	const scheduleTimeoutCleanup = () => {
		if (timeoutCleanupScheduled) return;
		timeoutCleanupScheduled = true;
		const cleanup = scheduleMemorySearchCleanupAfterTimeout(params.api, logPrefix, params.agentId);
		params.onTimeoutCleanup?.(cleanup);
	};
	let circuitBreakerTimeoutRecorded = false;
	const recordRecallTimeout = () => {
		if (!circuitBreakerTimeoutRecorded) {
			circuitBreakerTimeoutRecorded = true;
			recordCircuitBreakerTimeout(cbKey, params.config.circuitBreakerCooldownMs);
		}
		scheduleTimeoutCleanup();
	};
	if (isCircuitBreakerOpen(cbKey, params.config.circuitBreakerMaxTimeouts, params.config.circuitBreakerCooldownMs)) {
		const result = {
			status: "timeout",
			elapsedMs: 0,
			summary: null
		};
		if (params.config.logging) params.api.logger.info?.(`${logPrefix} skipped (circuit breaker open after consecutive timeouts)`);
		params.abortSignal?.throwIfAborted();
		await persistPluginStatusLines({
			api: params.api,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			statusLine: `${buildPluginStatusLine({
				result,
				config: params.config
			})} circuit-breaker`
		});
		return result;
	}
	const runContext = prepareRecallRunContext(params);
	logPrefix = buildLogPrefix(runContext.fastMode);
	if (params.config.logging) params.api.logger.info?.(`${logPrefix} start timeoutMs=${String(params.config.timeoutMs)} queryChars=${String(params.query.length)} searchQueryChars=${String(params.searchQuery.length)}`);
	const controller = new AbortController();
	const abortFromParent = () => controller.abort(params.abortSignal?.reason);
	params.abortSignal?.addEventListener("abort", abortFromParent, { once: true });
	if (params.abortSignal?.aborted) abortFromParent();
	const TIMEOUT_SENTINEL = Symbol("timeout");
	let transcriptSources = [];
	let recallTimedOut = false;
	const watchdogTimeoutMs = params.config.timeoutMs + params.config.setupGraceTimeoutMs;
	const timeoutId = setTimeout(() => {
		if (params.abortSignal?.aborted) return;
		recallTimedOut = true;
		controller.abort(/* @__PURE__ */ new Error(`active-memory timeout after ${watchdogTimeoutMs}ms`));
	}, watchdogTimeoutMs);
	timeoutId.unref?.();
	const timeoutPromise = new Promise((resolve) => {
		controller.signal.addEventListener("abort", () => {
			resolve(TIMEOUT_SENTINEL);
		}, { once: true });
	});
	let terminalMemorySearchWatch;
	let recallInFlight = false;
	try {
		recallInFlight = true;
		const subagentPromise = runRecallSubagent({
			...params,
			modelRef: resolvedModelRef,
			parentSessionKey: runContext.parentSessionKey,
			storePath: runContext.storePath,
			fastMode: runContext.fastMode,
			abortSignal: controller.signal,
			onTranscriptSources: (sources) => {
				transcriptSources = sources;
			},
			onEmbeddedRunSettled: () => terminalMemorySearchWatch?.stop()
		});
		terminalMemorySearchWatch = watchTerminalMemorySearchResult({
			getTranscriptSources: () => transcriptSources,
			abortSignal: controller.signal,
			toolsAllow: params.config.toolsAllow
		});
		subagentPromise.catch(() => void 0);
		let raceResult = await Promise.race([
			subagentPromise,
			timeoutPromise,
			terminalMemorySearchWatch.promise
		]);
		terminalMemorySearchWatch.stop();
		let fallbackSearchDebug;
		let fallbackHasUsableMemoryResult = false;
		if (raceResult !== TIMEOUT_SENTINEL && "status" in raceResult && raceResult.hasUsableMemoryResult) {
			fallbackSearchDebug = raceResult.searchDebug;
			fallbackHasUsableMemoryResult = true;
			raceResult = await Promise.race([subagentPromise, timeoutPromise]);
		}
		if (raceResult !== TIMEOUT_SENTINEL) recallInFlight = false;
		if (raceResult === TIMEOUT_SENTINEL) {
			if (recallTimedOut) recordRecallTimeout();
			else if (params.abortSignal?.aborted && recallInFlight) scheduleTimeoutCleanup();
			const elapsedMs = Date.now() - startedAt;
			const result = await buildTimeoutRecallResult({
				elapsedMs,
				maxSummaryChars: params.config.maxSummaryChars,
				transcriptSources,
				subagentPromise,
				hasUsableMemoryResult: fallbackHasUsableMemoryResult,
				searchDebug: fallbackSearchDebug,
				toolsAllow: params.config.toolsAllow
			});
			await recordRecallResult({
				...params,
				logPrefix,
				result
			});
			return result;
		}
		if ("status" in raceResult) {
			controller.abort(/* @__PURE__ */ new Error("active-memory terminal memory search result"));
			const result = {
				status: raceResult.status,
				elapsedMs: Date.now() - startedAt,
				summary: null,
				searchDebug: raceResult.searchDebug
			};
			resetCircuitBreaker(cbKey);
			await recordRecallResult({
				...params,
				logPrefix,
				result
			});
			return result;
		}
		const { transcriptPath } = raceResult;
		if (params.config.logging && transcriptPath) params.api.logger.info?.(`${logPrefix} transcript=${transcriptPath}`);
		const result = buildSubagentRecallResult({
			subagentResult: raceResult,
			fallbackSearchDebug,
			fallbackHasUsableMemoryResult,
			elapsedMs: Date.now() - startedAt,
			maxSummaryChars: params.config.maxSummaryChars
		});
		resetCircuitBreaker(cbKey);
		await recordRecallResult({
			...params,
			logPrefix,
			result
		});
		if (cacheKey && shouldCacheResult(result)) setCachedResult(cacheKey, result, params.config.cacheTtlMs);
		return result;
	} catch (error) {
		if (params.abortSignal?.aborted) {
			if (recallTimedOut) recordRecallTimeout();
			else if (recallInFlight) scheduleTimeoutCleanup();
			params.abortSignal.throwIfAborted();
		}
		if (controller.signal.aborted) {
			if (recallTimedOut) recordRecallTimeout();
			const partialTimeoutData = readPartialTimeoutData(error);
			const result = await buildTimeoutRecallResult({
				elapsedMs: Date.now() - startedAt,
				maxSummaryChars: params.config.maxSummaryChars,
				transcriptSources,
				...partialTimeoutData,
				toolsAllow: params.config.toolsAllow
			});
			await recordRecallResult({
				...params,
				logPrefix,
				result
			});
			return result;
		}
		const message = toSingleLineErrorMessage(error);
		if (params.config.logging) params.api.logger.warn?.(`${logPrefix} failed error=${message}; skipping recall`);
		const result = {
			status: "failed",
			elapsedMs: Date.now() - startedAt,
			summary: null
		};
		await recordRecallResult({
			...params,
			logPrefix,
			result
		});
		return result;
	} finally {
		params.abortSignal?.removeEventListener("abort", abortFromParent);
		terminalMemorySearchWatch?.stop();
		clearTimeout(timeoutId);
	}
}
async function maybeResolveActiveRecall(params) {
	const { runId, ...recallParams } = params;
	if (!runId || params.requestKey === null) return await resolveActiveRecall(recallParams);
	const model = getModelRef(params.runtimeConfig, params.agentId, params.config, {
		modelProviderId: params.currentModelProviderId,
		modelId: params.currentModelId
	});
	const scopeFingerprint = buildCacheKey({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		query: params.requestKey ?? params.query,
		authorityFingerprint: params.authorityFingerprint,
		memorySlot: params.memorySlot,
		activeProjectKeys: params.activeProjectKeys,
		modelProviderId: model?.provider,
		modelId: model?.model,
		recallToolNames: params.config.toolsAllow,
		resourceScope: JSON.stringify(params.conversationRecall ?? null)
	});
	return await resolveActiveRecallForRun(`${runId}:${scopeFingerprint}`, (onTimeoutCleanup) => resolveActiveRecall({
		...recallParams,
		onTimeoutCleanup
	}));
}
//#endregion
export { maybeResolveActiveRecall as t };
