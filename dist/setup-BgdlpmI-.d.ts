import "./types-D7I_F5Ux.js";
import "./types.secrets-BcsEzH0R.js";
import "./config-contracts-CY87ANNp.js";
import "./config-S5Zm-Svf.js";
import "./utils-DhaCU8ER.js";
import "./setup-credential-BOHSYxXF.js";
//#region src/plugin-sdk/resolution-notes.d.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
declare function formatResolvedUnresolvedNote(params: {
  resolved: string[];
  unresolved: string[];
}): string | undefined;
//#endregion
export { formatResolvedUnresolvedNote as t };