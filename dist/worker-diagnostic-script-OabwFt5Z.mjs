import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { basename } from "node:path";
//#region src/infra/worker-diagnostic-script.ts
const workerScriptNames = /* @__PURE__ */ new Set([
	...Object.values(runtimeProcessEntrypoints).map((entry) => basename(entry.distWorkerPath)),
	"catalog-page.worker.js",
	"code-mode.worker.js",
	"compaction-planning.worker.js",
	"disk-budget.worker.js",
	"document-extractor.worker.js",
	"manager-index.worker.js",
	"manager-search.worker.js",
	"memory-index.worker.js",
	"memory-search.worker.js",
	"session-history.worker.js",
	"audio-worker.runtime.js",
	"realtime-quicksilver-audio.worker.js",
	"realtime-quicksilver-socket.worker.js",
	"telegram-ingress-worker.runtime.js"
]);
/** Imported diagnostics may contain arbitrary paths or names. Preserve only known scripts. */
function normalizeDiagnosticWorkerScript(value) {
	return typeof value === "string" && workerScriptNames.has(value) ? value : "other";
}
//#endregion
export { normalizeDiagnosticWorkerScript as t };
