import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as classifyToolUseResultPairing } from "./tool-result-pairing-B20tITEh.mjs";
import "./defaults-Bg930vxE.mjs";
import { b as runWithPreparedRunSourceScope } from "./admitted-run-context-h1ULFETN.mjs";
import { u as estimateTokens } from "./agent-core-BbGXCiXw.mjs";
import { _ as stripRuntimeContextCustomMessages } from "./internal-runtime-context-DLJtDQoI.mjs";
import { i as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as readActiveTranscriptEntryAnchorAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { c as resolveContextEngineTranscriptByteLimit } from "./registry-BNFZRyO5.mjs";
import { x as runWithPreparedMemoryPromptSection } from "./memory-state-CrbG6eAa.mjs";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-DWLjZN89.mjs";
import { i as sanitizeToolUseResultPairingForModel } from "./session-transcript-repair-BTNxtQ4j.mjs";
import { a as estimateRenderedLlmBoundaryTokenPressure } from "./preemptive-compaction-Dka97wCW.mjs";
import { t as runContextEngineMaintenance } from "./context-engine-maintenance-DybI5s-J.mjs";
import { a as completedTurnMessageAnchor } from "./session-manager-Mve5HWCW.mjs";
import { createHash } from "node:crypto";
import { prependSystemPromptAdditionAfterCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/context-engine/runtime-settings.ts
const RUNTIME_REASON_PATTERNS = [
	["provider_timeout", /timeout/iu],
	["rate_limited", /rate|limit|429/iu],
	["context_overflow", /overflow|context|pressure/iu],
	["runtime_unavailable", /runtime/iu],
	["provider_unavailable", /provider|primary|unavailable/iu]
];
function normalizeReasonCode(value) {
	const normalized = normalizeNullableString(value);
	if (!normalized) return null;
	return RUNTIME_REASON_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "unknown";
}
function buildContextEngineRuntimeSettings(params) {
	const hostId = normalizeNullableString(params.contextEngineHost.id);
	const selectedId = normalizeNullableString(params.selectedContextEngineId);
	const selectionSource = params.contextEngineSelectionSource ?? (selectedId ? "configured" : "unknown");
	const requestedModel = normalizeNullableString(params.requestedModel);
	const resolvedModel = normalizeNullableString(params.resolvedModel);
	const fallbackReason = normalizeReasonCode(params.fallbackReason);
	const degradedReason = normalizeReasonCode(params.degradedReason);
	const resolvedViaFallback = requestedModel !== null && resolvedModel !== null && requestedModel !== resolvedModel;
	return {
		schemaVersion: 1,
		runtime: {
			host: "openclaw",
			mode: params.mode ?? (degradedReason ? "degraded" : fallbackReason || resolvedViaFallback ? "fallback" : "normal"),
			harnessId: normalizeNullableString(params.harnessId),
			runtimeId: normalizeNullableString(params.runtimeId)
		},
		model: {
			requested: requestedModel,
			resolved: resolvedModel,
			provider: normalizeNullableString(params.provider),
			family: normalizeNullableString(params.modelFamily)
		},
		contextEngineSelection: {
			selectedId,
			source: selectionSource
		},
		executionHost: {
			id: hostId,
			label: normalizeNullableString(params.contextEngineHost.label)
		},
		limits: {
			promptTokenBudget: asFiniteNumber(params.promptTokenBudget) ?? null,
			maxOutputTokens: asFiniteNumber(params.maxOutputTokens) ?? null
		},
		diagnostics: {
			fallbackReason,
			degradedReason
		}
	};
}
//#endregion
//#region src/context-engine/bounded-context.ts
/** Bounds only the model view; required instructions and the pending input stay with their owners. */
function boundContextEngineAssembly(assembled, maxBytes, tokenBudget) {
	if (maxBytes === void 0) return assembled;
	const { messages } = assembled;
	let bytes = 2;
	let tokens = 0;
	let cut = messages.length;
	let exceedsByteBudget = false;
	for (let index = messages.length - 1; index >= 0; index--) {
		const message = messages[index];
		bytes += Buffer.byteLength(JSON.stringify(message), "utf8") + 1;
		tokens += estimateTokens(message);
		if (bytes > maxBytes) {
			exceedsByteBudget = true;
			break;
		}
		if (tokenBudget !== void 0 && tokens > tokenBudget) continue;
		if (index === 0 || message.role === "user") cut = index;
	}
	if (!exceedsByteBudget) return assembled;
	for (const frame of classifyToolUseResultPairing(messages).frames) {
		if (frame.startIndex >= cut) break;
		for (const occurrence of frame.occurrences) if (occurrence.sourceResultIndex !== void 0 && occurrence.sourceResultIndex >= cut) {
			cut = occurrence.sourceResultIndex + 1;
			while (cut < messages.length && messages[cut]?.role !== "user") cut++;
		}
	}
	const retained = messages.slice(cut);
	const fingerprint = createHash("sha256").update(JSON.stringify([
		assembled.contextProjection,
		maxBytes,
		messages[cut - 1],
		retained,
		assembled.systemPromptAddition
	])).digest("hex");
	return {
		...assembled,
		messages: retained,
		estimatedTokens: retained.reduce((sum, message) => sum + estimateTokens(message), 0),
		promptAuthority: "assembled",
		contextProjection: {
			mode: "thread_bootstrap",
			epoch: `bounded:${fingerprint}`,
			fingerprint
		}
	};
}
//#endregion
//#region src/agents/harness/context-engine-lifecycle.ts
function preparePreTurnRuntimeContext(runtimeContext) {
	if (!runtimeContext?.rewriteTranscriptEntries) return runtimeContext;
	const { rewriteTranscriptEntries: _rewriteTranscriptEntries, ...fenced } = runtimeContext;
	return fenced;
}
function runWithHarnessSourceFence(params, run) {
	return runWithSessionTranscriptReadFence(params.transcriptReadFence, () => runWithPreparedRunSourceScope(params, run));
}
function buildHarnessContextEngineRuntimeSettings(params) {
	if (params.runtimeSettings !== void 0 && params.runtimeSettings !== null) return params.runtimeSettings;
	const selectedId = params.contextEngine?.info.id;
	return buildContextEngineRuntimeSettings({
		contextEngineHost: params.contextEngineHostSupport ?? OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
		harnessId: params.harnessId,
		runtimeId: params.runtimeId,
		provider: params.providerId,
		requestedModel: params.requestedModelId,
		resolvedModel: params.modelId ?? params.requestedModelId,
		modelFamily: params.modelFamily ?? null,
		selectedContextEngineId: selectedId,
		contextEngineSelectionSource: selectedId === "legacy" ? "default" : selectedId ? "configured" : "unknown",
		promptTokenBudget: params.tokenBudget,
		maxOutputTokens: params.maxOutputTokens,
		fallbackReason: params.fallbackReason,
		degradedReason: params.degradedReason
	});
}
async function bootstrapHarnessContextEngine(params) {
	if (!params.hadSessionFile || !(params.contextEngine?.bootstrap || params.contextEngine?.maintain)) return;
	await runWithHarnessSourceFence(params, async () => {
		try {
			const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
			const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
			if (typeof params.contextEngine?.bootstrap === "function") await params.contextEngine.bootstrap({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				runtimeSettings,
				runtimeContext
			});
			await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
				contextEngine: params.contextEngine,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				reason: "bootstrap",
				sessionManager: params.sessionManager,
				runtimeContext,
				runtimeSettings,
				config: params.config
			});
		} catch (bootstrapErr) {
			params.warn(`context engine bootstrap failed: ${String(bootstrapErr)}`);
		}
	});
}
async function assembleHarnessContextEngine(params) {
	const contextEngine = params.contextEngine;
	if (!contextEngine) return;
	return runWithHarnessSourceFence(params, async () => {
		return boundContextEngineAssembly(await assembleHarnessContextEngineWithinSourceScope(params, contextEngine), resolveContextEngineTranscriptByteLimit(contextEngine), resolveAssemblyHistoryTokenBudget(params));
	});
}
function resolveAssemblyHistoryTokenBudget(params) {
	if (!params.promptBudget) return params.tokenBudget;
	const { contextTokens, reserveTokens, systemPrompt, prompt } = params.promptBudget;
	return Math.max(1, Math.max(1, Math.max(1, Math.floor(contextTokens ?? 2e5)) - Math.max(0, Math.floor(reserveTokens))) - estimateRenderedLlmBoundaryTokenPressure({
		systemPrompt,
		prompt
	}));
}
async function assembleHarnessContextEngineWithinSourceScope(params, contextEngine) {
	const tokenBudget = resolveAssemblyHistoryTokenBudget(params);
	const maxOutputTokens = params.promptBudget ? Math.max(0, Math.floor(params.promptBudget.reserveTokens)) : params.maxOutputTokens;
	const messages = (params.appendOnlyRuntimeContext ? params.messages : stripRuntimeContextCustomMessages(params.messages)).slice();
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings({
		...params,
		maxOutputTokens,
		tokenBudget
	});
	const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
	const assemble = () => contextEngine.assemble({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		messages,
		tokenBudget,
		...params.availableTools ? { availableTools: params.availableTools } : {},
		...params.citationsMode ? { citationsMode: params.citationsMode } : {},
		model: params.modelId,
		runtimeSettings,
		runtimeContext,
		...params.prompt !== void 0 ? { prompt: params.prompt } : {}
	});
	return ensureAssembleResultShape(contextEngine.info.id === "legacy" ? await assemble() : await runWithPreparedMemoryPromptSection({
		availableTools: params.availableTools ?? /* @__PURE__ */ new Set(),
		citationsMode: params.citationsMode,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		agentSessionKey: params.sessionKey,
		sandboxed: params.sandboxed
	}, assemble), contextEngine.info.id);
}
async function prepareHarnessContextEnginePrompt(params) {
	const initial = {
		messages: params.messages,
		systemPrompt: params.promptBudget.systemPrompt,
		contextEnginePromptAuthority: "assembled"
	};
	const contextEngine = params.contextEngine;
	if (!contextEngine) return {
		...initial,
		messages: params.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(initial.messages, params.isOpenAIResponsesApi) : initial.messages
	};
	return runWithHarnessSourceFence(params, async () => {
		const pipelineMessages = params.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(params.messages, params.isOpenAIResponsesApi) : params.messages;
		const preassemblyMessages = pipelineMessages.slice();
		const prepareAssembly = (assembled) => boundContextEngineAssembly({
			...assembled,
			messages: params.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(assembled.messages, params.isOpenAIResponsesApi) : assembled.messages
		}, resolveContextEngineTranscriptByteLimit(contextEngine), resolveAssemblyHistoryTokenBudget(params));
		let bounded;
		try {
			bounded = prepareAssembly(await assembleHarnessContextEngineWithinSourceScope({
				...params,
				messages: pipelineMessages
			}, contextEngine));
		} catch (error) {
			params.warn(`context engine assemble failed, using pipeline messages: ${String(error)}`);
			bounded = prepareAssembly({
				messages: pipelineMessages,
				estimatedTokens: 0
			});
		}
		const authority = bounded.promptAuthority ?? "assembled";
		return {
			messages: bounded.messages,
			systemPrompt: bounded.systemPromptAddition ? prependSystemPromptAdditionAfterCacheBoundary({
				systemPrompt: initial.systemPrompt,
				systemPromptAddition: bounded.systemPromptAddition
			}) : initial.systemPrompt,
			contextEnginePromptAuthority: authority,
			...authority === "preassembly_may_overflow" ? { unwindowedContextEngineMessagesForPrecheck: preassemblyMessages } : {}
		};
	});
}
/** Invalid plugin results must fail here so the runner can fall back without poisoning state. */
function ensureAssembleResultShape(result, engineId) {
	if (!result || typeof result !== "object") throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got ${describeAssembleResultType(result)})`);
	const candidate = result;
	if (!Array.isArray(candidate.messages)) throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got messages of type ${describeAssembleResultType(candidate.messages)})`);
	return result;
}
function describeAssembleResultType(value) {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	return typeof value;
}
async function finalizeHarnessContextEngineTurn(params) {
	if (!params.contextEngine || params.promptError || params.aborted || params.yieldAborted) return { postTurnFinalizationSucceeded: true };
	if (params.turnCandidate) {
		const { admission, terminalEntryId, record } = params.turnCandidate;
		if (admission && terminalEntryId) {
			const committed = params.turnCandidate[completedTurnMessageAnchor];
			if (!committed) {
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection(admission, params.abortSignal);
				params.abortSignal?.throwIfAborted();
			}
			const terminal = committed ? committed.anchor : await readActiveTranscriptEntryAnchorAsync({
				...admission,
				entryId: terminalEntryId
			}, params.abortSignal);
			params.abortSignal?.throwIfAborted();
			committed?.assertCurrent();
			if (terminal) record({
				boundary: {
					admission,
					terminal
				},
				sessionIdUsed: params.sessionIdUsed,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				promptError: params.promptError,
				aborted: params.aborted,
				yieldAborted: params.yieldAborted,
				isHeartbeat: params.isHeartbeat,
				runtimeContext: {
					provider: params.providerId ?? void 0,
					modelId: params.modelId ?? void 0,
					modelContextWindow: params.modelContextWindow,
					tokenBudget: params.tokenBudget ?? void 0
				}
			});
		}
		return { postTurnFinalizationSucceeded: true };
	}
	const conversationSnapshot = buildContextEngineConversationSnapshot({
		messagesSnapshot: params.messagesSnapshot,
		prePromptMessageCount: params.prePromptMessageCount
	});
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	const runtimeContext = params.runtimeContext;
	let postTurnFinalizationSucceeded = true;
	if (typeof params.contextEngine.afterTurn === "function") try {
		await params.contextEngine.afterTurn({
			sessionId: params.sessionIdUsed,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			sessionFile: params.sessionFile,
			messages: conversationSnapshot.messages,
			prePromptMessageCount: conversationSnapshot.prePromptMessageCount,
			tokenBudget: params.tokenBudget,
			runtimeSettings,
			runtimeContext,
			isHeartbeat: params.isHeartbeat
		});
	} catch (afterTurnErr) {
		postTurnFinalizationSucceeded = false;
		params.warn(`context engine afterTurn failed: ${String(afterTurnErr)}`);
	}
	else {
		const newMessages = conversationSnapshot.messages.slice(conversationSnapshot.prePromptMessageCount);
		if (newMessages.length > 0) {
			if (typeof params.contextEngine.ingestBatch === "function") try {
				await params.contextEngine.ingestBatch({
					sessionId: params.sessionIdUsed,
					sessionKey: params.sessionKey,
					messages: newMessages,
					isHeartbeat: params.isHeartbeat
				});
			} catch (ingestErr) {
				postTurnFinalizationSucceeded = false;
				params.warn(`context engine ingest failed: ${String(ingestErr)}`);
			}
			else for (const msg of newMessages) try {
				await params.contextEngine.ingest?.({
					sessionId: params.sessionIdUsed,
					sessionKey: params.sessionKey,
					message: msg,
					isHeartbeat: params.isHeartbeat
				});
			} catch (ingestErr) {
				postTurnFinalizationSucceeded = false;
				params.warn(`context engine ingest failed: ${String(ingestErr)}`);
			}
		}
	}
	if (postTurnFinalizationSucceeded) await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
		contextEngine: params.contextEngine,
		sessionId: params.sessionIdUsed,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: "turn",
		sessionManager: params.sessionManager,
		runtimeContext,
		runtimeSettings,
		config: params.config
	});
	return { postTurnFinalizationSucceeded };
}
function buildContextEngineConversationSnapshot(params) {
	const prePromptMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(0, params.prePromptMessageCount));
	const turnMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(params.prePromptMessageCount));
	return {
		messages: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length
	};
}
async function runHarnessContextEngineMaintenance(params) {
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	return await runContextEngineMaintenance({
		contextEngine: params.contextEngine,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: params.reason,
		sessionManager: params.sessionManager,
		withSessionManagerRewriteLock: params.withSessionManagerRewriteLock,
		runtimeContext: params.runtimeContext,
		runtimeSettings,
		executionMode: params.executionMode,
		onDeferredMaintenance: params.onDeferredMaintenance,
		config: params.config
	});
}
function isActiveHarnessContextEngine(contextEngine) {
	return Boolean(contextEngine && contextEngine.info.id !== "legacy");
}
//#endregion
export { prepareHarnessContextEnginePrompt as a, isActiveHarnessContextEngine as i, bootstrapHarnessContextEngine as n, runHarnessContextEngineMaintenance as o, finalizeHarnessContextEngineTurn as r, buildContextEngineRuntimeSettings as s, assembleHarnessContextEngine as t };
