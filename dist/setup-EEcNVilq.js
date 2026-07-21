import "./utils-CRO4LGEB.js";
import "./types.secrets-OocW4TQ1.js";
import "./setup-helpers-CsYJ9GnD.js";
import "./detect-binary-eauRT8r9.js";
import "./setup-wizard-helpers-Bw5FK0as.js";
import "./setup-wizard-proxy-D1EPGV_R.js";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
