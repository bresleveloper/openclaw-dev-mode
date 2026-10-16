import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-DjwhuBCy.mjs";
import { n as normalizeAbortTriggerText, t as isAbortTrigger } from "./abort-trigger-text-DmDtxg5D.mjs";
//#region src/auto-reply/reply/abort-primitives.ts
const ABORT_MEMORY = resolveGlobalMap(Symbol.for("openclaw.abortMemory"), "close-and-restart");
const ABORT_MEMORY_MAX = 2e3;
function isAbortRequestText(text, options) {
	if (!text) return false;
	const normalized = normalizeCommandBody(text, options).trim();
	if (!normalized) return false;
	const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
	return normalizedLower === "/stop" || normalizeAbortTriggerText(normalizedLower) === "/stop" || isAbortTrigger(normalizedLower);
}
function getAbortMemory(key) {
	const normalized = key.trim();
	if (!normalized) return;
	return ABORT_MEMORY.get(normalized);
}
function setAbortMemory(key, value) {
	const normalized = key.trim();
	if (!normalized) return;
	if (!value) {
		ABORT_MEMORY.delete(normalized);
		return;
	}
	ABORT_MEMORY.delete(normalized);
	ABORT_MEMORY.set(normalized, true);
	pruneMapToMaxSize(ABORT_MEMORY, ABORT_MEMORY_MAX);
}
//#endregion
export { isAbortRequestText as n, setAbortMemory as r, getAbortMemory as t };
