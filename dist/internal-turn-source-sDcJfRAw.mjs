import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { a as INTERNAL_WAKE_TRANSCRIPT_PROMPTS } from "./heartbeat-C40cs1ec.mjs";
//#region src/auto-reply/internal-turn-source.ts
/** Keep wake history compact while preserving the producer's actual event identity. */
function resolveInternalTurnTranscript(ctx) {
	const provenance = ctx.InputProvenance?.kind === "internal_system" ? ctx.InputProvenance : {
		kind: "internal_system",
		sourceTool: ctx.InternalTurnSource ?? "heartbeat"
	};
	const source = provenance.sourceTool ?? ctx.InternalTurnSource ?? "heartbeat";
	return {
		text: source === "heartbeat" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.heartbeat : source === "exec" || source === "exec-event" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.exec : source === "cron" ? INTERNAL_WAKE_TRANSCRIPT_PROMPTS.cron : INTERNAL_WAKE_TRANSCRIPT_PROMPTS.event,
		provenance
	};
}
const LEGACY_INTERNAL_TURN_SOURCES = /* @__PURE__ */ new Map([
	["heartbeat", "heartbeat"],
	["cron-event", "cron"],
	["exec-event", "exec"]
]);
function legacyInternalTurnSource(value) {
	return value ? LEGACY_INTERNAL_TURN_SOURCES.get(value) : void 0;
}
/** Fold shipped SDK source labels at ingress; runtime channels describe transport only. */
function normalizeInternalTurnContext(ctx) {
	const source = isStringOption(ctx.InternalTurnSource, [
		"heartbeat",
		"cron",
		"exec",
		"event",
		"progress-card-refresh"
	]) ? ctx.InternalTurnSource : legacyInternalTurnSource(ctx.Provider);
	if (source) ctx.InternalTurnSource = source;
	else delete ctx.InternalTurnSource;
	for (const field of [
		"Provider",
		"Surface",
		"OriginatingChannel"
	]) if (legacyInternalTurnSource(ctx[field])) delete ctx[field];
}
//#endregion
export { resolveInternalTurnTranscript as n, normalizeInternalTurnContext as t };
