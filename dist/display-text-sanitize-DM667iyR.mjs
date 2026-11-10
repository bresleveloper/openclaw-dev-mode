import { g as stripInternalRuntimeContext } from "./internal-runtime-context-DLJtDQoI.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
	return stripInboundMetadata(stripInternalRuntimeContext(text));
}
//#endregion
export { stripInternalMetadataForDisplay as t };
