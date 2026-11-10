import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as parseNonNegativeByteSize } from "./byte-size-H0Vvh27E.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-DHFPcfdZ.mjs";
import { b as resolveMemoryFlushPlan } from "./memory-state-CrbG6eAa.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import { t as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR } from "./agent-settings-p_B_SpGc.mjs";
//#region src/auto-reply/reply/memory-flush-plan.ts
const log = createSubsystemLogger("auto-reply/memory-flush");
const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4e3;
const DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES = 2097152;
function resolveMemoryFlushTiming(params) {
	const defaults = params.cfg?.agents?.defaults?.compaction?.memoryFlush;
	if (defaults?.enabled === false) return null;
	let softThresholdTokens = Math.floor(asNonNegativeFiniteNumber(defaults?.softThresholdTokens) ?? DEFAULT_MEMORY_FLUSH_SOFT_TOKENS);
	const forceFlushTranscriptBytes = parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ?? DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES;
	let reserveTokensFloor = DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR;
	const contextWindowTokens = Math.floor(asNonNegativeFiniteNumber(params.contextWindowTokens) ?? 0);
	if (contextWindowTokens > 0) {
		reserveTokensFloor = resolveEffectiveCompactionReserveTokens({
			contextTokenBudget: contextWindowTokens,
			reserveTokens: reserveTokensFloor
		});
		softThresholdTokens = Math.min(softThresholdTokens, Math.floor((contextWindowTokens - reserveTokensFloor) / 2));
	}
	const model = defaults?.model?.trim() || void 0;
	return {
		softThresholdTokens,
		forceFlushTranscriptBytes,
		reserveTokensFloor,
		...model ? { model } : {}
	};
}
/** Narrow the provider-tool persistence arm; file plans never name persistence tools. */
function isToolsMemoryFlushPlan(plan) {
	return plan.persistenceToolNames !== void 0;
}
/** Admit file plans and only the selected slot owner's tool plans for execution. */
function resolveMemoryFlushPlanForRun(params) {
	const timing = resolveMemoryFlushTiming(params);
	if (!timing) return null;
	const resolution = resolveMemoryFlushPlan(params);
	if (resolution && isToolsMemoryFlushPlan(resolution.plan) && !resolution.selectedSlotOwner) {
		log.warn(`memory flush skipped: plugin "${resolution.pluginId}" supplied a tools-arm plan but is not the selected memory slot owner`);
		return null;
	}
	if (!resolution) return null;
	if (isToolsMemoryFlushPlan(resolution.plan)) {
		const persistenceNames = new Set(resolution.plan.persistenceToolNames);
		const overlappingNames = [...new Set((resolution.plan.lookupToolNames ?? []).filter((name) => persistenceNames.has(name)))];
		if (overlappingNames.length > 0) {
			log.warn(`memory flush skipped: plugin "${resolution.pluginId}" declared overlapping lookup and persistence tools (${overlappingNames.join(", ")})`);
			return null;
		}
	}
	return {
		...resolution,
		plan: {
			...resolution.plan,
			softThresholdTokens: resolution.plan.softThresholdTokens ?? timing.softThresholdTokens,
			forceFlushTranscriptBytes: resolution.plan.forceFlushTranscriptBytes ?? timing.forceFlushTranscriptBytes,
			reserveTokensFloor: resolution.plan.reserveTokensFloor ?? timing.reserveTokensFloor,
			model: isToolsMemoryFlushPlan(resolution.plan) ? resolution.plan.model ?? timing.model : resolution.plan.model
		}
	};
}
/** Recognize deliberate silence only in the final assistant output. */
function memoryFlushResultIsSilent(result) {
	const finalText = result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText;
	return isSilentReplyPayloadText(finalText ?? result.payloads?.at(-1)?.text);
}
//#endregion
export { memoryFlushResultIsSilent as n, resolveMemoryFlushPlanForRun as r, isToolsMemoryFlushPlan as t };
