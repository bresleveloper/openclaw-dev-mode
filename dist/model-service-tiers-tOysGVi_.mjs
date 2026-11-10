import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as OPENAI_CODEX_RESPONSES_BASE_URL } from "./base-url-Baro1bPi.mjs";
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
/**
* A successful account-scoped listing is authoritative even when every row is hidden; static
* hints must not invent subscription access. Hidden rows stay listed: the account is entitled.
*/
function buildOpenAICodexReadyOutcome(rows) {
	const modelServiceTiers = readOpenAICodexServiceTiers(rows);
	return {
		provider: "openai",
		status: "ready",
		...modelServiceTiers.length ? { modelServiceTiers } : {},
		listedModelIds: rows.flatMap((row) => {
			const record = asOptionalRecord(row);
			return normalizeOptionalString(record?.slug) ?? normalizeOptionalString(record?.id) ?? [];
		})
	};
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
export { projectOpenAICatalog as n, buildOpenAICodexReadyOutcome as t };
