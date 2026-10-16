import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/shared/transcript-only-openclaw-assistant.ts
const OPENCLAW_TRANSCRIPT_ARTIFACT_API = "openclaw-transcript";
const OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER = "openclaw";
const OPENCLAW_DELIVERY_MIRROR_MODEL = "delivery-mirror";
const CRON_DIRECT_DELIVERY_CONTEXT_KIND = "cron-direct-delivery-context";
const TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS = /* @__PURE__ */ new Set([OPENCLAW_DELIVERY_MIRROR_MODEL, "gateway-injected"]);
const OPENCLAW_DELIVERY_MIRROR_KINDS = /* @__PURE__ */ new Set([
	"channel-final",
	"channel-final-suppressed",
	"message-tool-source-reply",
	CRON_DIRECT_DELIVERY_CONTEXT_KIND
]);
function isOpenClawDeliveryMirrorMarker(value) {
	const kind = asOptionalRecord(value)?.kind;
	return typeof kind === "string" && OPENCLAW_DELIVERY_MIRROR_KINDS.has(kind);
}
function isTranscriptOnlyOpenClawAssistantModel(provider, model) {
	return provider === "openclaw" && typeof model === "string" && TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS.has(model);
}
/**
* Returns true when the message is an OpenClaw-authored transcript artifact
* that must not be replayed to providers.
*
* Primary check: provider="openclaw" + model in known transcript-only set.
* Fallback: a valid openclawDeliveryMirror marker catches observed historical
* rows whose provider/model provenance was stripped (#99470).
*/
function isTranscriptOnlyOpenClawAssistantMessage(message) {
	const entry = asOptionalRecord(message);
	if (entry?.role !== "assistant") return false;
	if (isTranscriptOnlyOpenClawAssistantModel(entry.provider, entry.model)) return true;
	return isOpenClawDeliveryMirrorMarker(entry.openclawDeliveryMirror);
}
function isOpenClawMessageToolMirrorAssistantMessage(message) {
	const entry = asOptionalRecord(message);
	return entry?.role === "assistant" && entry.openclawMessageToolMirror !== void 0;
}
function isOpenClawDeliveryMirrorAssistantMessage(message) {
	const entry = asOptionalRecord(message);
	return entry?.role === "assistant" && entry.provider === "openclaw" && entry.model === "delivery-mirror";
}
//#endregion
export { isOpenClawDeliveryMirrorAssistantMessage as a, isTranscriptOnlyOpenClawAssistantModel as c, OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER as i, OPENCLAW_DELIVERY_MIRROR_MODEL as n, isOpenClawMessageToolMirrorAssistantMessage as o, OPENCLAW_TRANSCRIPT_ARTIFACT_API as r, isTranscriptOnlyOpenClawAssistantMessage as s, CRON_DIRECT_DELIVERY_CONTEXT_KIND as t };
