import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as OPENAI_CODEX_RESPONSES_BASE_URL } from "./base-url-BUR_8zW8.mjs";
//#region extensions/openai/model-service-tiers.ts
/** Only authenticated remote rows may supply this private observation, never fallback seeds. */
function readOpenAICodexServiceTiers(rows) {
	return rows.flatMap((row) => {
		const record = asOptionalRecord(row);
		const modelId = normalizeOptionalString(record?.slug) ?? normalizeOptionalString(record?.id);
		const tiers = record?.service_tiers;
		if (!modelId || !Array.isArray(tiers)) return [];
		const serviceTiers = [];
		for (const tier of tiers) {
			const id = normalizeOptionalString(asOptionalRecord(tier)?.id);
			if (!id) return [];
			serviceTiers.push(id);
		}
		return [{
			modelId,
			runtimeId: "codex",
			api: "openai-chatgpt-responses",
			baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
			serviceTiers: [...new Set(serviceTiers)]
		}];
	});
}
function projectOpenAICatalog(catalog, profileId) {
	const scopedProfileId = profileId?.trim();
	return {
		providers: { openai: catalog.provider },
		...catalog.outcome ? { outcomes: [scopedProfileId ? {
			...catalog.outcome,
			profileId: scopedProfileId
		} : catalog.outcome] } : {}
	};
}
//#endregion
export { readOpenAICodexServiceTiers as n, projectOpenAICatalog as t };
