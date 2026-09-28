import { t as COHERE_BASE_URL } from "./.setup/models-DxsOE4Aq.mjs";
//#region extensions/cohere/provider-catalog.ts
const COHERE_LIVE_MODEL_DISCOVERY = {
	endpointUrl: {
		url: "https://api.cohere.com/v1/models?endpoint=chat&page_size=1000",
		requireBaseUrl: COHERE_BASE_URL
	},
	readRows: (body) => {
		if (!body || typeof body !== "object" || !Array.isArray(body.models)) throw new Error("Cohere model catalog response must contain models[]");
		return body.models.flatMap((row) => {
			if (!row || typeof row !== "object" || Array.isArray(row)) return [];
			const record = row;
			const modelId = typeof record.name === "string" ? record.name.trim() : "";
			return modelId ? [{
				...record,
				id: modelId,
				active: record.is_deprecated !== true
			}] : [];
		});
	}
};
//#endregion
export { COHERE_LIVE_MODEL_DISCOVERY };
