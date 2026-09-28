import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/config/schema.shared.ts
/** Deep-clone schema payloads before callers mutate plugin or base schema fragments. */
function cloneSchema(value) {
	return structuredClone(value);
}
/** Narrow unknown JSON-schema fragments to non-array objects. */
function asSchemaObject(value) {
	return asNullableRecord(value);
}
/** Return whether a schema node exposes nested fields through properties, items, or unions. */
function schemaHasChildren(schema) {
	if (schema.properties && Object.keys(schema.properties).length > 0) return true;
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") return true;
	if (Array.isArray(schema.items)) return schema.items.some((entry) => typeof entry === "object" && entry !== null);
	for (const branch of [
		schema.oneOf,
		schema.anyOf,
		schema.allOf
	]) if (branch?.some((entry) => entry && typeof entry === "object" && schemaHasChildren(entry))) return true;
	return Boolean(schema.items && typeof schema.items === "object");
}
/** Find the most specific wildcard UI hint that matches a concrete config path. */
function findWildcardHintMatch(params) {
	const targetParts = params.targetParts ?? params.splitPath(params.path);
	let bestMatch;
	for (const [hintPath, hint] of Object.entries(params.uiHints)) {
		if (params.acceptHint && !params.acceptHint(hint)) continue;
		const hintParts = params.splitPath(hintPath);
		if (hintParts.length > targetParts.length || !params.includeAncestors && hintParts.length !== targetParts.length) continue;
		let wildcardCount = 0;
		let matches = true;
		for (let index = 0; index < hintParts.length; index += 1) {
			const hintPart = hintParts[index];
			if (hintPart === targetParts[index]) continue;
			if (hintPart === "*") {
				wildcardCount += 1;
				continue;
			}
			matches = false;
			break;
		}
		if (!matches) continue;
		if (!bestMatch || hintParts.length > bestMatch.partCount || hintParts.length === bestMatch.partCount && wildcardCount < bestMatch.wildcardCount) bestMatch = {
			path: hintPath,
			hint,
			partCount: hintParts.length,
			wildcardCount
		};
	}
	return bestMatch ? {
		path: bestMatch.path,
		hint: bestMatch.hint
	} : null;
}
//#endregion
export { schemaHasChildren as i, cloneSchema as n, findWildcardHintMatch as r, asSchemaObject as t };
