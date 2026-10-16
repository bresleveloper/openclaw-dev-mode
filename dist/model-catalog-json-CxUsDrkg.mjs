//#region src/agents/model-catalog-json.ts
/** Parses the JSON-with-comments syntax accepted by root model catalogs. */
function parseModelCatalogJson(input) {
	const json = input.replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*/g, (match) => match[0] === "\"" ? match : "").replace(/"(?:\\.|[^"\\])*"|,(\s*[}\]])/g, (match, tail) => tail ?? (match[0] === "\"" ? match : ""));
	return JSON.parse(json);
}
//#endregion
export { parseModelCatalogJson as t };
