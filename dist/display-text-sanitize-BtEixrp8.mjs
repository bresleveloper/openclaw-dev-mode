import { g as stripInternalRuntimeContext } from "./internal-runtime-context-CAWYwg4i.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-BWIgBUDF.mjs";
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
	return stripInboundMetadata(stripInternalRuntimeContext(text));
}
//#endregion
export { stripInternalMetadataForDisplay as t };
