import "./types.secrets-DsPRn9Dz.mjs";
import "./utils-DgZn2dLu.mjs";
import "./command-format-DwEdrDKL.mjs";
import "./session-key-C09ow4h0.mjs";
import "./detect-binary-1PDZeQ8f.mjs";
import "./setup-helpers-CDK4xLs4.mjs";
import "./setup-wizard-helpers-Z9EJ5vhW.mjs";
import "./setup-credential-BC9vFRHC.mjs";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
