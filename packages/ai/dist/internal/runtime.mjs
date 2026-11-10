import { o as getEventStreamCompletion } from "../event-stream-X2gmsUWv.mjs";
import { r as createApiRegistry, t as createLlmRuntime } from "../stream-C4YDqhFj.mjs";
import { A as getSupportedThinkingLevels, D as applyProviderReportedUsageCost, E as headersToRecord, O as calculateCost, j as modelsAreEqual, k as clampThinkingLevel } from "../host-CWt55nnF.mjs";
import { n as getSessionResourceOwnerId, r as registerSessionResourceCleanup, t as cleanupSessionResources } from "../session-resources-vKvGIE3J.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-CRGuMONI.mjs";
import { A as shortHash, D as parseJsonWithRepair, E as createToolArgumentPreviewSchedule, O as parseStreamingJson, g as parseTerminalToolCallArguments, k as repairJson } from "../transport-stream-shared-lhgkTOz3.mjs";
import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-Xd8dm_aV.mjs";
import { t as createDeferredEventBuffer } from "../deferred-event-buffer-DAvyP7qA.mjs";
import { n as onLlmRequestActivity, t as notifyLlmRequestActivity } from "../llm-request-activity-CfMuh5cC.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, n as createFirstStreamEventTimeoutError, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "../stream-first-event-timeout-D_TfJHRJ.mjs";
import { n as createSseByteGuard, t as boundResponseBody } from "../streaming-byte-guard-DBXr1XYn.mjs";
import { t as createReasoningTagTextPartitioner } from "../reasoning-tag-text-partitioner-CU9A4Lg8.mjs";
import { n as resolveOpenAICodexAccountId, t as decodeOpenAICodexJwtPayload } from "../openai-chatgpt-jwt-KWcgd0d_.mjs";
import { t as isContextOverflow } from "../overflow-OF3PgPbw.mjs";
//#region packages/ai/src/internal/default-runtime.ts
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
//#endregion
export { applyProviderReportedUsageCost, boundResponseBody, calculateCost, clampThinkingLevel, cleanupSessionResources, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createReasoningTagTextPartitioner, createSseByteGuard, createToolArgumentPreviewSchedule, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getEventStreamCompletion, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSessionResourceOwnerId, getSupportedThinkingLevels, headersToRecord, isContextOverflow, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, parseTerminalToolCallArguments, registerSessionResourceCleanup, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, withFirstStreamEventTimeout };
