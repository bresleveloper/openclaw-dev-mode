import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as makeZeroUsageSnapshot, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { f as sanitizeTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { n as compactWithSafetyTimeout } from "./compaction-safety-timeout-Cgwbj_da.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { a as agentSessionRunProviderCompaction, t as recordSessionModelUsage } from "./session-model-usage-C52vsLrM.mjs";
import { r as getRawSessionAppendMessageAsync } from "./transcript-rewrite-exk4oVrD.mjs";
import { t as MidTurnPrecheckSignal } from "./midturn-precheck-BtRLC6ta.mjs";
import { c as resolveProjectedRequestPressure, i as estimateLlmBoundaryTokenPressure, l as shouldPreemptivelyCompactBeforePrompt, o as estimateToolSchemaTokenPressure } from "./preemptive-compaction-Dka97wCW.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-CdpV1a6G.mjs";
import { a as withSessionManagerWriteAssertion } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { isDeepStrictEqual } from "node:util";
import { captureOpenAIResponsesCompaction, requestPreparedOpenAIResponsesCompaction, usesNativeOpenAICodexResponsesBackend } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/run/chatgpt-v2-compaction.ts
/** Only the native ChatGPT request path owns V2; proxies keep their existing policy. */
function isChatGPTV2CompactionEligible(params) {
	return params.compactionEnabled && params.compactionReplayEnabled && !params.contextEngineOwnsCompaction && !params.config?.agents?.defaults?.compaction?.model?.trim() && !params.config?.agents?.defaults?.compaction?.provider && params.operation !== "settled-tool-finalization" && params.extraParams.responsesCompactEndpoint !== false && params.extraParams.responsesServerCompaction !== false && usesNativeOpenAICodexResponsesBackend(params.model);
}
/** One attempt-local boundary, called only after the normal prompt projections have settled. */
function createChatGPTV2CompactionBoundary(params) {
	let failed = false;
	let softSkipLogged = false;
	return async (streamFn, model, context, options, requestAnchor) => {
		if (!usesNativeOpenAICodexResponsesBackend(model) || params.session.isCompacting) return;
		const requestOptions = {
			...options,
			authProfileId: params.authProfileId
		};
		const assertActive = () => {
			requestOptions.signal?.throwIfAborted();
			params.assertActive();
		};
		assertActive();
		const budget = {
			contextTokenBudget: params.contextTokenBudget,
			reserveTokens: params.reserveTokens,
			replay: {
				model,
				sessionId: requestOptions.sessionId,
				authProfileId: requestOptions.authProfileId
			}
		};
		const preflight = requestAnchor ? void 0 : shouldPreemptivelyCompactBeforePrompt({
			...budget,
			messages: context.messages,
			systemPrompt: context.systemPrompt,
			prompt: "",
			toolSchemaTokens: estimateToolSchemaTokenPressure(context.tools)
		});
		const outgoing = preflight ? preflight.compactionReplay ?? preflight : resolveProjectedRequestPressure({
			...budget,
			context,
			previousRequest: requestAnchor
		});
		const contextTokens = Math.min(params.contextTokenBudget, model.contextWindow ?? params.contextTokenBudget);
		const softTriggerTokens = Math.min(outgoing.promptBudgetBeforeReserve, Math.max(1, Math.floor(contextTokens * .9)));
		if (outgoing.estimatedPromptTokens < softTriggerTokens) return;
		const fallback = (reason, hardLimit = false) => {
			if (!hardLimit && outgoing.route === "fits") {
				if (!softSkipLogged) {
					log.debug(`ChatGPT V2 compaction skipped while the request still fits: ${reason}`);
					softSkipLogged = true;
				}
				return;
			}
			log.warn(`ChatGPT V2 compaction unavailable; falling back to client compaction: ${reason}`);
			const request = {
				...outgoing,
				route: "compact_only"
			};
			params.onFallback(request);
			throw new MidTurnPrecheckSignal(request);
		};
		if (outgoing.estimatedPromptTokens > (model.contextWindow ?? params.contextTokenBudget)) return fallback("the outgoing request exceeds the model context window", true);
		if (failed) return fallback("an earlier V2 attempt in this run failed");
		if (params.session.agent.state.pendingToolCalls.size > 0) return fallback("tool calls are still pending");
		const manager = params.session.sessionManager;
		const coveredLeaf = manager.getLeafId();
		let committed = false;
		let persistenceStarted = false;
		let providerSignal;
		try {
			for (const message of context.messages) if (message.role === "user" && !message.synthetic && !message.operatorMessage && !message.runtimeContextCarrier && !message.runtimeContext) {
				const prepared = sanitizeTranscriptMessage(message);
				if (prepared.role !== "user" || !isDeepStrictEqual(prepared.content, message.content)) throw new Error("ChatGPT V2 retained input requires transcript normalization");
			} else if (message.role === "assistant" && message.providerReplay) {
				const prepared = sanitizeTranscriptMessage(message);
				if (prepared.role !== "assistant" || !isDeepStrictEqual(prepared.providerReplay, message.providerReplay)) throw new Error("ChatGPT V2 prior checkpoint requires transcript normalization");
			}
			const hooks = params.hookContext || params.postCompaction ? await import("./compaction-hooks-BQxkMRVz.mjs") : void 0;
			if (params.hookContext) await hooks.runCompactionHooks({
				...params.hookContext,
				assertActive,
				phase: "before",
				metrics: {
					messageCountOriginal: context.messages.length,
					messageCountBefore: context.messages.length,
					tokenCountOriginal: outgoing.estimatedPromptTokens,
					tokenCountBefore: outgoing.estimatedPromptTokens
				}
			});
			assertActive();
			if (manager.getLeafId() !== coveredLeaf) throw new Error("Session transcript changed before ChatGPT V2 compaction");
			return await params.session[agentSessionRunProviderCompaction](async (signal, reportCommit) => {
				providerSignal = signal;
				const compacted = await compactWithSafetyTimeout((timeoutSignal) => requestPreparedOpenAIResponsesCompaction(streamFn, model, context, {
					...requestOptions,
					signal: timeoutSignal
				}, "v2", {
					maxTokens: outgoing.promptBudgetBeforeReserve,
					estimateTokens: (output, outputTokens) => {
						const checkpoint = {
							role: "assistant",
							content: [],
							api: model.api,
							provider: model.provider,
							model: model.id,
							stopReason: "stop",
							usage: makeZeroUsageSnapshot(),
							timestamp: 0
						};
						const item = output.at(-1);
						if (!item || item.type !== "compaction") throw new Error("ChatGPT V2 replay window is missing its checkpoint");
						captureOpenAIResponsesCompaction(checkpoint, item, "retained-users", model, void 0, output, outputTokens);
						return estimateLlmBoundaryTokenPressure({
							messages: [checkpoint],
							systemPrompt: context.systemPrompt,
							prompt: "",
							toolSchemaTokens: estimateToolSchemaTokenPressure(context.tools),
							replay: { model }
						});
					}
				}), params.timeoutMs, { abortSignal: requestOptions.signal ? AbortSignal.any([signal, requestOptions.signal]) : signal });
				assertActive();
				signal.throwIfAborted();
				const usage = normalizeUsage(compacted.usage);
				recordSessionModelUsage(manager, compacted.modelUsage ?? {
					...makeZeroUsageSnapshot(),
					input: usage?.input ?? 0,
					output: usage?.output ?? 0,
					cacheRead: usage?.cacheRead ?? 0,
					cacheWrite: usage?.cacheWrite ?? 0,
					totalTokens: usage?.total ?? 0
				});
				const checkpoint = {
					role: "assistant",
					content: [],
					api: compacted.model.api,
					provider: compacted.model.provider,
					model: compacted.model.id,
					stopReason: "stop",
					usage: makeZeroUsageSnapshot(),
					timestamp: Date.now()
				};
				captureOpenAIResponsesCompaction(checkpoint, compacted.item, "retained-users", compacted.model, compacted.replayMetadata, compacted.output, compacted.usage.output_tokens);
				const tokensAfter = estimateLlmBoundaryTokenPressure({
					messages: [checkpoint],
					systemPrompt: context.systemPrompt,
					prompt: "",
					toolSchemaTokens: estimateToolSchemaTokenPressure(context.tools),
					replay: {
						model,
						sessionId: requestOptions.sessionId,
						authProfileId: requestOptions.authProfileId
					}
				});
				if (tokensAfter > outgoing.promptBudgetBeforeReserve) throw new Error("ChatGPT V2 checkpoint exceeds the next request budget");
				const prepared = sanitizeTranscriptMessage(checkpoint);
				if (prepared.role !== "assistant" || !isDeepStrictEqual(prepared.providerReplay, checkpoint.providerReplay)) throw new Error("ChatGPT V2 checkpoint requires transcript normalization");
				const assertCommitCurrent = () => {
					assertActive();
					signal.throwIfAborted();
				};
				await params.withTranscriptWrite(() => withSessionManagerWriteAssertion(manager, assertCommitCurrent, async () => {
					assertCommitCurrent();
					if (manager.getLeafId() !== coveredLeaf) throw new Error("Session transcript changed during ChatGPT V2 compaction");
					persistenceStarted = true;
					if (!await getRawSessionAppendMessageAsync(manager)(prepared)) throw new Error("ChatGPT V2 checkpoint was not persisted");
					committed = true;
					params.session.agent.state.messages.push(prepared);
					reportCommit(compacted.usage.input_tokens, tokensAfter);
				}));
				if (params.postCompaction) await hooks.runPostCompactionSideEffects({
					...params.postCompaction,
					assertActive
				});
				if (params.hookContext) await hooks.runCompactionHooks({
					...params.hookContext,
					assertActive,
					phase: "after",
					messageCountAfter: compacted.output.length,
					tokensAfter,
					compactedCount: context.messages.length,
					tokensBefore: compacted.usage.input_tokens,
					sessionFile: params.session.sessionFile ?? ""
				});
				return prepared;
			}, Boolean(params.hookContext));
		} catch (error) {
			assertActive();
			providerSignal?.throwIfAborted();
			if (committed || persistenceStarted || error instanceof SessionTranscriptMessageCommittedError) throw error;
			failed = true;
			return fallback(`request failed: ${formatErrorMessage(error)}`);
		}
	};
}
//#endregion
export { isChatGPTV2CompactionEligible as n, createChatGPTV2CompactionBoundary as t };
