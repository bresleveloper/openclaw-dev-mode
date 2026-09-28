import { m as getInternalToolResultProvenance, s as attachInternalToolResultProvenance } from "./internal-hooks-DUPhyX-W.mjs";
//#region src/agents/tools/tts-tool-result-provenance.ts
const coreTtsMediaByProvenance = /* @__PURE__ */ new WeakMap();
const coreTtsProvenanceByAttemptResult = /* @__PURE__ */ new WeakMap();
function markCoreTtsToolResult(result, mediaUrls) {
	const provenance = {};
	coreTtsMediaByProvenance.set(provenance, Object.freeze([...mediaUrls]));
	return attachInternalToolResultProvenance(result, provenance);
}
function getCoreTtsToolResultMediaUrls(result) {
	if (typeof result !== "object" || result === null) return;
	const provenance = getInternalToolResultProvenance(result);
	return provenance ? coreTtsMediaByProvenance.get(provenance) : void 0;
}
function markCoreTtsAttemptResult(result, mediaUrls, operationalRunInstance) {
	coreTtsProvenanceByAttemptResult.set(result, Object.freeze({
		mediaUrls: Object.freeze([...mediaUrls]),
		operationalRunInstance
	}));
	return result;
}
/** Transfer only built-in TTS provenance; callers cannot mint delivery authority. */
function transferCoreTtsToolResultProvenance(toolResult, attemptResult, eligibleMediaUrls, operationalRunInstance) {
	const toolMediaUrls = getCoreTtsToolResultMediaUrls(toolResult);
	if (!toolMediaUrls) return attemptResult;
	const eligible = new Set(eligibleMediaUrls.map((url) => url.trim()));
	const transferred = toolMediaUrls.filter((url) => eligible.has(url.trim()));
	if (transferred.length === 0) return attemptResult;
	const existing = coreTtsProvenanceByAttemptResult.get(attemptResult)?.mediaUrls ?? [];
	return markCoreTtsAttemptResult(attemptResult, [.../* @__PURE__ */ new Set([...existing, ...transferred])], operationalRunInstance);
}
/** Core lifecycle copies preserve attestation; plugin-created result copies stay untrusted. */
function copyCoreTtsAttemptResultProvenance(source, target) {
	const provenance = coreTtsProvenanceByAttemptResult.get(source);
	if (provenance) coreTtsProvenanceByAttemptResult.set(target, provenance);
	return target;
}
function getCoreTtsAttemptResultMediaUrls(result, deliveredMediaUrls, operationalRunInstance) {
	const provenance = coreTtsProvenanceByAttemptResult.get(result);
	if (!provenance || provenance.operationalRunInstance !== operationalRunInstance) return [];
	const delivered = new Set(deliveredMediaUrls?.map((url) => url.trim()));
	return provenance.mediaUrls.filter((url) => delivered.has(url.trim()));
}
//#endregion
export { markCoreTtsToolResult as a, markCoreTtsAttemptResult as i, getCoreTtsAttemptResultMediaUrls as n, transferCoreTtsToolResultProvenance as o, getCoreTtsToolResultMediaUrls as r, copyCoreTtsAttemptResultProvenance as t };
