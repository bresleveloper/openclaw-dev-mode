//#region extensions/arcee/provider-policy-api.ts
/** Direct and OpenRouter wire ids identify the same logical Arcee catalog model. */
function normalizeModelCatalogId({ provider, modelId }) {
	if (provider.trim().toLowerCase() !== "arcee") return;
	const id = modelId.trim();
	return id.startsWith("arcee-ai/") ? id.slice(9) : id;
}
//#endregion
export { normalizeModelCatalogId };
