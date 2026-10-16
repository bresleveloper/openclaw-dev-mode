import "typebox/guard";
import "typebox/schema";
//#region packages/normalization-core/src/json-schema.ts
/** Decode a local URI fragment before recognizing or splitting its JSON Pointer. */
function decodeLocalSchemaRefFragment(ref) {
	if (!ref.startsWith("#")) return;
	try {
		return decodeURIComponent(ref.slice(1));
	} catch {
		return;
	}
}
function decodeJsonPointerSegment(segment) {
	return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
/** Encoded slashes separate tokens; ~1 remains inside a single token. */
function parseLocalSchemaRefPointer(ref) {
	const fragment = decodeLocalSchemaRefFragment(ref);
	return fragment?.startsWith("/") ? fragment.slice(1).split("/").map(decodeJsonPointerSegment) : void 0;
}
//#endregion
export { parseLocalSchemaRefPointer as t };
