import "./types.secrets-Dgbd2kyP.mjs";
import "./utils-gjJ-tD2q.mjs";
import "./session-key-CSDERtm3.mjs";
import "./command-format-CYoE8cOC.mjs";
import "./detect-binary-BlNusQ8Q.mjs";
import "./setup-helpers-BkS00G-w.mjs";
import "./setup-wizard-helpers-B7ZmEvzm.mjs";
import "./setup-credential-DKyBKT9L.mjs";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
