import { p as stripInternalRuntimeContext } from "./internal-runtime-context-BH-o1oq1.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
	return stripInboundMetadata(stripInternalRuntimeContext(text));
}
//#endregion
export { stripInternalMetadataForDisplay as t };
