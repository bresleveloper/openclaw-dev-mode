import { t as MODEL_APIS } from "./model-config-vocabulary-CIfiDXNP.mjs";
import "./types.models-ZwQV51CR.mjs";
//#region src/agents/model-catalog-entry.ts
function isCatalogModelApi(value) {
	return value !== void 0 && MODEL_APIS.some((api) => api === value);
}
/** Shared metadata projection; keep transport headers and authoring fields out of catalog entries. */
function modelCatalogRowToEntry(row) {
	const contextWindow = row.contextWindow ?? row.contextTokens;
	return {
		id: row.id,
		name: row.name,
		provider: row.provider,
		...isCatalogModelApi(row.api) ? { api: row.api } : {},
		...row.baseUrl ? { baseUrl: row.baseUrl } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...row.contextWindows ? { contextWindows: row.contextWindows.map((option) => ({ ...option })) } : {},
		...row.contextWindowDefault ? { contextWindowDefault: row.contextWindowDefault } : {},
		...row.contextTokens !== void 0 ? { contextTokens: row.contextTokens } : {},
		reasoning: row.reasoning,
		...row.thinkingLevelMap ? { thinkingLevelMap: { ...row.thinkingLevelMap } } : {},
		...row.input ? { input: [...row.input] } : {},
		...row.params ? { params: { ...row.params } } : {},
		...row.compat ? { compat: row.compat } : {},
		...row.mediaInput ? { mediaInput: row.mediaInput } : {},
		status: row.status,
		...row.statusReason ? { statusReason: row.statusReason } : {},
		...row.replaces ? { replaces: [...row.replaces] } : {},
		...row.replacedBy ? { replacedBy: row.replacedBy } : {}
	};
}
//#endregion
export { modelCatalogRowToEntry as t };
