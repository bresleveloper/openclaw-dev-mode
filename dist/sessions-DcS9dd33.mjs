import { p as generateSummary$1 } from "./agent-core-BbGXCiXw.mjs";
import "./model-registry-pyM1O0Zs.mjs";
import "./auth-storage-DHC97REI.mjs";
import "./tools-CsYUPwyX.mjs";
import "./context-token-pressure-II9nRGTn.mjs";
import { u as createCompactionRuntime, x as unwrapCoreResult } from "./settings-manager-D9ggLoN1.mjs";
import "./session-manager-Mve5HWCW.mjs";
//#region src/agents/sessions/compaction/compaction.ts
/** Generates a compaction summary through the shared agent-core runtime. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, usageSink, summaryPrompt) {
	return unwrapCoreResult(await generateSummary$1(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, createCompactionRuntime(usageSink), summaryPrompt));
}
//#endregion
export { generateSummary as t };
