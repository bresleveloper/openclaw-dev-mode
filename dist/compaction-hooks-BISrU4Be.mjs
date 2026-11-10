import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as emitSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { v as resolveLoadedMemoryProviderKind } from "./memory-state-CrbG6eAa.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { a as getActiveMemoryProviderCore, o as getActiveMemorySearchManagerCore, u as refreshMemoryProviderWithHandoff } from "./memory-runtime-CXcwwGi2.mjs";
import { r as estimateCompactedRequestTokens } from "./request-budget-DkXbt99N.mjs";
import { r as resolveMemorySearchIndexConfig } from "./memory-search-Fa28vl7G.mjs";
//#region src/agents/embedded-agent-runner/compaction-hooks.ts
async function runPostCompactionSessionMemorySync(params, onStarted) {
	try {
		const agentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		if (resolveLoadedMemoryProviderKind(params.config) === "native") {
			const sessionKey = params.sessionKey?.trim();
			const authority = params.memoryAudience && sessionKey ? {
				kind: "session",
				sessionKey,
				sessionId: params.sessionId?.trim() || void 0,
				sandboxed: params.sandboxed === true,
				audience: params.memoryAudience
			} : {
				kind: "host",
				operation: "post-compaction-refresh"
			};
			let provider = null;
			try {
				await params.assertActive?.();
				const acquired = await getActiveMemoryProviderCore({
					cfg: params.config,
					agentId,
					context: {
						authority,
						assertCurrent: () => {}
					}
				});
				provider = acquired.provider;
				await params.assertActive?.();
				if (!provider) {
					log.debug(`memory refresh denied (post-compaction) for ${acquired.providerId ?? "selected memory provider"}: ${acquired.error ?? "provider unavailable"}`);
					return;
				}
				if (!provider.refresh) {
					log.debug(`memory refresh unsupported (post-compaction) for ${acquired.providerId ?? "selected memory provider"}`);
					return;
				}
				await refreshMemoryProviderWithHandoff(provider, onStarted);
				await params.assertActive?.();
			} catch (error) {
				log.debug(`memory refresh failed (post-compaction): ${formatErrorMessage(error)}`);
			} finally {
				await provider?.close().catch(() => {});
			}
			return;
		}
		const resolvedMemory = resolveMemorySearchIndexConfig(params.config, agentId);
		if (!resolvedMemory || !resolvedMemory.sources.includes("sessions")) return;
		if (!resolvedMemory.sync.sessions.postCompactionForce) return;
		await params.assertActive?.();
		const { manager } = await getActiveMemorySearchManagerCore({
			cfg: params.config,
			agentId
		});
		await params.assertActive?.();
		if (!manager?.sync) return;
		const sessionId = params.sessionId?.trim();
		const sync = manager.sync({
			reason: "post-compaction",
			...sessionId ? { sessions: [{
				agentId,
				sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {}
			}] } : { archiveFiles: [params.sessionFile] }
		});
		onStarted();
		await sync;
	} catch (err) {
		await params.assertActive?.();
		log.warn(`memory sync skipped (post-compaction): ${formatErrorMessage(err)}`);
	}
}
async function runPostCompactionSideEffects(params) {
	await params.assertActive?.();
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return;
	emitSessionTranscriptUpdate({
		sessionFile,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	await params.assertActive?.();
	const mode = params.config?.agents?.defaults?.compaction?.postIndexSync ?? "async";
	const started = createDeferredCore();
	const syncTask = mode !== "off" && params.config ? runPostCompactionSessionMemorySync({
		...params,
		config: params.config,
		sessionFile
	}, started.resolve) : void 0;
	if (mode !== "await") syncTask?.catch((error) => {
		log.debug(`memory sync cancelled (post-compaction): ${formatErrorMessage(error)}`);
	});
	if (syncTask) {
		syncTask.then(() => started.resolve(), () => started.resolve());
		await (mode === "await" ? syncTask : started.promise);
	}
	await params.assertActive?.();
}
function estimateTokenCountSafe(messages, estimateTokensFn) {
	try {
		let total = 0;
		for (const message of messages) total += estimateTokensFn(message);
		return total;
	} catch {
		return;
	}
}
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
function buildBeforeCompactionHookMetrics(params) {
	return {
		messageCountOriginal: params.originalMessages.length,
		tokenCountOriginal: estimateTokenCountSafe(params.originalMessages, params.estimateTokensFn),
		messageCountBefore: params.currentMessages.length,
		tokenCountBefore: params.observedTokenCount ?? estimateTokenCountSafe(params.currentMessages, params.estimateTokensFn)
	};
}
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
function estimateTokensAfterCompaction(params) {
	if (params.requestBudget) return estimateCompactedRequestTokens(params.messagesAfter, {
		...params.requestBudget,
		pendingTokens: 0
	});
	const tokensAfter = estimateTokenCountSafe(params.messagesAfter, params.estimateTokensFn);
	if (tokensAfter === void 0) return;
	const sanityCheckBaseline = params.observedTokenCount ?? params.fullSessionTokensBefore;
	return sanityCheckBaseline > 0 && tokensAfter > (params.observedTokenCount !== void 0 ? sanityCheckBaseline : sanityCheckBaseline * 1.1) ? void 0 : tokensAfter;
}
/** Internal hooks settle and forward messages before plugin hooks see the same phase. */
async function runCompactionHooks(params) {
	params.assertActive?.();
	const logHookFailure = (hookName, error) => {
		params.assertActive?.();
		log.warn(`${hookName} hook failed`, {
			errorMessage: formatErrorMessage(error),
			errorStack: error instanceof Error ? error.stack : void 0
		});
	};
	try {
		const hookEvent = createInternalHookEvent("session", `compact:${params.phase}`, params.sessionKey, {
			sessionId: params.sessionId,
			missingSessionKey: false,
			...params.phase === "before" ? {
				messageCount: params.metrics.messageCountBefore,
				tokenCount: params.metrics.tokenCountBefore,
				messageCountOriginal: params.metrics.messageCountOriginal,
				tokenCountOriginal: params.metrics.tokenCountOriginal
			} : {
				messageCount: params.messageCountAfter,
				tokenCount: params.tokensAfter,
				compactedCount: params.compactedCount,
				...params.compactionOutcome ? { compactionOutcome: params.compactionOutcome } : {},
				summaryLength: params.summaryLength,
				tokensBefore: params.tokensBefore,
				tokensAfter: params.tokensAfter,
				firstKeptEntryId: params.firstKeptEntryId
			}
		});
		await triggerInternalHook(hookEvent);
		params.assertActive?.();
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: params.phase,
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
	} catch (err) {
		logHookFailure(`session:compact:${params.phase}`, err);
	}
	params.assertActive?.();
	if (params.hookRunner?.hasHooks?.(`${params.phase}_compaction`)) try {
		const context = {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		};
		if (params.phase === "before") await params.hookRunner.runBeforeCompaction?.({
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore
		}, context);
		else await params.hookRunner.runAfterCompaction?.({
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile,
			...params.previousSessionId ? { previousSessionId: params.previousSessionId } : {}
		}, context);
	} catch (err) {
		logHookFailure(`${params.phase}_compaction`, err);
	}
	params.assertActive?.();
}
//#endregion
export { runPostCompactionSideEffects as i, estimateTokensAfterCompaction as n, runCompactionHooks as r, buildBeforeCompactionHookMetrics as t };
