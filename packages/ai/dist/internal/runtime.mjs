import { o as getEventStreamCompletion } from "../event-stream-Bf6cK7-d.mjs";
import { r as createApiRegistry, t as createLlmRuntime } from "../stream-1NFlqyZV.mjs";
import { A as headersToRecord, F as modelsAreEqual, M as calculateCost, N as clampThinkingLevel, P as getSupportedThinkingLevels, j as applyProviderReportedUsageCost } from "../host-Dm4e6L6R.mjs";
import { cleanupSessionResources, getSessionResourceOwnerId, registerSessionResourceCleanup } from "./session-resources.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-B3kUqQ-q.mjs";
import { A as parseStreamingJson, O as createToolArgumentPreviewSchedule, j as repairJson, k as parseJsonWithRepair, v as parseTerminalToolCallArguments } from "../transport-stream-shared-DPUASGj0.mjs";
import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-DlUbTgKq.mjs";
import { t as createDeferredEventBuffer } from "../deferred-event-buffer-BgT1IIfq.mjs";
import { n as onLlmRequestActivity, t as notifyLlmRequestActivity } from "../llm-request-activity-v1liRqNt.mjs";
import { t as shortHash } from "../hash-Cx359qsb.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, n as createFirstStreamEventTimeoutError, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "../stream-first-event-timeout-CWiv_y--.mjs";
import { n as createSseByteGuard, t as boundResponseBody } from "../streaming-byte-guard-gOcUrHJF.mjs";
import { n as resolveOpenAICodexAccountId, t as decodeOpenAICodexJwtPayload } from "../openai-chatgpt-jwt-v5F5jJmX.mjs";
import { t as isContextOverflow } from "../overflow-CM0yZomw.mjs";
// packages/ai/src/internal/default-runtime.ts
const DEFAULT_RUNTIME_KEY = Symbol.for("openclaw.ai.defaultRuntime");
function resolveDefaultRuntime() {
	const globalStore = globalThis;
	if (Object.hasOwn(globalStore, DEFAULT_RUNTIME_KEY)) return globalStore[DEFAULT_RUNTIME_KEY];
	const registry = createApiRegistry();
	const state = {
		registry,
		runtime: createLlmRuntime(registry)
	};
	globalStore[DEFAULT_RUNTIME_KEY] = state;
	return state;
}
const defaultRuntime = resolveDefaultRuntime();
const defaultApiRegistry = defaultRuntime.registry;
const defaultLlmRuntime = defaultRuntime.runtime;
const { getApiProvider, getApiProviders } = defaultApiRegistry;
const { stream, complete, streamSimple, completeSimple } = defaultLlmRuntime;
export { applyProviderReportedUsageCost, boundResponseBody, calculateCost, clampThinkingLevel, cleanupSessionResources, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createSseByteGuard, createToolArgumentPreviewSchedule, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getEventStreamCompletion, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSessionResourceOwnerId, getSupportedThinkingLevels, headersToRecord, isContextOverflow, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, parseTerminalToolCallArguments, registerSessionResourceCleanup, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, withFirstStreamEventTimeout };
