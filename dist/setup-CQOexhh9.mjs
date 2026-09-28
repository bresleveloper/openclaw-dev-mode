import "./utils-aKqR_F_U.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import "./detect-binary-CzJJYZjS.mjs";
import "./setup-helpers-gXEiNGC9.mjs";
import "./setup-wizard-helpers-DT-haSuo.mjs";
import "./setup-credential-C6qxR6mM.mjs";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
