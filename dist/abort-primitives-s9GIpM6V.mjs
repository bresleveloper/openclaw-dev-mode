import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import { n as normalizeAbortTriggerText, t as isAbortTrigger } from "./abort-trigger-text-ptqrLO20.mjs";
//#region src/auto-reply/reply/abort-primitives.ts
const ABORT_MEMORY = resolveGlobalMap(Symbol.for("openclaw.abortMemory"), "close-and-restart");
const ABORT_MEMORY_MAX = 2e3;
function isAbortRequestText(text, options) {
	if (!text) return false;
	const normalized = normalizeCommandBody(text, options);
	return normalizeAbortTriggerText(normalized) === "/stop" || isAbortTrigger(normalized);
}
function getAbortMemory(key) {
	const normalized = key.trim();
	return normalized ? ABORT_MEMORY.get(normalized) : void 0;
}
function setAbortMemory(key, value) {
	const normalized = key.trim();
	if (!normalized) return;
	ABORT_MEMORY.delete(normalized);
	if (!value) return;
	ABORT_MEMORY.set(normalized, true);
	pruneMapToMaxSize(ABORT_MEMORY, ABORT_MEMORY_MAX);
}
//#endregion
export { isAbortRequestText as n, setAbortMemory as r, getAbortMemory as t };
