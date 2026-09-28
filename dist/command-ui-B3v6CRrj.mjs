import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./number-runtime-CGwowceO.mjs";
import { s as fitsTelegramCallbackData, t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-C11bj7rj.mjs";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/model-buttons.ts
/**
* Telegram inline button utilities for model selection.
*
* Callback data patterns (max 64 bytes for Telegram):
* - mdl_prov              - show providers list
* - mdl_list_{prov}_{pg}  - show models for provider (page N, 1-indexed)
* - mdl_sel_{provider/id} - select model (standard)
* - mdl_sel/{model}       - read legacy providerless model selections
* - mdl1~m:{sha256}       - select an opaque provider/model ref
* - mdl1~p:{sha256}:{pg}  - show models for an opaque provider ref
* - mdl_back              - back to providers list
*/
const MODELS_PAGE_SIZE = 8;
const MODEL_BUTTON_LABEL_MAX_LENGTH = 38;
const LEGACY_PROVIDER_PATTERN = /^[a-z0-9_.-]+$/i;
const CALLBACK_PREFIX = {
	providers: "mdl_prov",
	back: "mdl_back",
	list: "mdl_list_",
	selectStandard: "mdl_sel_",
	opaqueModel: "mdl1~m:",
	opaqueProvider: "mdl1~p:"
};
function hashOpaqueCallback(domain, ...values) {
	return createHash("sha256").update(JSON.stringify([`openclaw.telegram.${domain}-callback.v1`, ...values])).digest("base64url");
}
/**
* Parse a model callback_data string into a structured object.
* Returns null if the data doesn't match a known pattern.
*/
function parseModelCallbackData(data) {
	const trimmed = data.trim();
	const opaqueModelMatch = trimmed.match(/^mdl1~m:([A-Za-z0-9_-]{43})$/);
	if (opaqueModelMatch?.[1]) return {
		type: "select-ref",
		digest: opaqueModelMatch[1]
	};
	const opaqueProviderMatch = trimmed.match(/^mdl1~p:([A-Za-z0-9_-]{43}):(\d+)$/);
	if (opaqueProviderMatch?.[1]) {
		const page = parseStrictPositiveInteger(opaqueProviderMatch[2]);
		if (page !== void 0 && fitsTelegramCallbackData(trimmed)) return {
			type: "list-ref",
			digest: opaqueProviderMatch[1],
			page
		};
	}
	if (trimmed === CALLBACK_PREFIX.providers || trimmed === CALLBACK_PREFIX.back) return { type: trimmed === CALLBACK_PREFIX.providers ? "providers" : "back" };
	const listMatch = trimmed.match(/^mdl_list_([a-z0-9_.-]+)_(\d+)$/i);
	if (listMatch) {
		const [, provider, pageStr] = listMatch;
		const page = parseStrictPositiveInteger(pageStr);
		if (provider && page !== void 0) return {
			type: "list",
			provider,
			page
		};
	}
	const compactModel = trimmed.match(/^mdl_sel\/(.+)$/)?.[1];
	if (compactModel) return {
		type: "select",
		model: compactModel
	};
	const [, provider, model] = trimmed.match(/^mdl_sel_([^/]+)\/(.+)$/) ?? [];
	return provider && model ? {
		type: "select",
		provider,
		model
	} : null;
}
function buildModelSelectionCallbackData(params) {
	const fullCallbackData = `${CALLBACK_PREFIX.selectStandard}${params.provider}/${params.model}`;
	if (LEGACY_PROVIDER_PATTERN.test(params.provider) && fitsTelegramCallbackData(fullCallbackData)) return fullCallbackData;
	return `${CALLBACK_PREFIX.opaqueModel}${hashOpaqueCallback("model", params.provider, params.model)}`;
}
function buildProviderListCallbackData(provider, page) {
	const callbackData = `${CALLBACK_PREFIX.list}${provider}_${page}`;
	return LEGACY_PROVIDER_PATTERN.test(provider) && fitsTelegramCallbackData(callbackData) ? callbackData : `${CALLBACK_PREFIX.opaqueProvider}${hashOpaqueCallback("provider", provider)}:${page}`;
}
function resolveModelSelection(params) {
	const callback = params.callback;
	if (callback.type === "select" && callback.provider) return {
		kind: "resolved",
		provider: callback.provider,
		model: callback.model
	};
	const matches = params.providers.flatMap((provider) => {
		const models = params.byProvider.get(provider);
		if (callback.type === "select") return models?.has(callback.model) ? [{
			provider,
			model: callback.model
		}] : [];
		return [...models ?? []].filter((model) => hashOpaqueCallback("model", provider, model) === callback.digest).map((model) => ({
			provider,
			model
		}));
	});
	const [match] = matches;
	return matches.length === 1 && match ? {
		kind: "resolved",
		...match
	} : {
		kind: "ambiguous",
		model: callback.type === "select" ? callback.model : callback.digest,
		matchingProviders: matches.map(({ provider }) => provider)
	};
}
function resolveModelListCallback(params) {
	const { callback } = params;
	if (callback.type === "list") return {
		provider: callback.provider,
		page: callback.page
	};
	const matches = params.providers.filter((provider) => hashOpaqueCallback("provider", provider) === callback.digest);
	const [provider] = matches;
	return matches.length === 1 && provider !== void 0 ? {
		provider,
		page: callback.page
	} : void 0;
}
function isCurrentModelSelection(params) {
	const currentModel = params.currentModel?.trim();
	if (!currentModel) return false;
	return currentModel.includes("/") ? currentModel === `${params.provider}/${params.model}` : currentModel === params.model;
}
/**
* Build provider selection keyboard with 2 providers per row.
*/
function buildProviderKeyboard(providers) {
	const rows = [];
	for (const [index, provider] of providers.entries()) (rows[Math.floor(index / 2)] ??= []).push({
		text: `${provider.id} (${provider.count})`,
		callback_data: buildProviderListCallbackData(provider.id, 1)
	});
	return rows;
}
/**
* Build model list keyboard with pagination and back button.
*/
function buildModelsKeyboard(params) {
	const { provider, models, currentModel, currentPage, totalPages, modelNames } = params;
	const pageSize = params.pageSize ?? MODELS_PAGE_SIZE;
	if (models.length === 0) return [[{
		text: "<< Back",
		callback_data: CALLBACK_PREFIX.back
	}]];
	const rows = [];
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, models.length);
	const pageModels = models.slice(startIndex, endIndex);
	for (const model of pageModels) {
		const callbackData = buildModelSelectionCallbackData({
			provider,
			model
		});
		const isCurrentModel = isCurrentModelSelection({
			currentModel,
			provider,
			model
		});
		const fallbackLabel = model.includes("/") ? `${provider}/${model}` : model;
		const displayText = truncateModelLabel(modelNames?.get(`${provider}/${model}`) ?? fallbackLabel, MODEL_BUTTON_LABEL_MAX_LENGTH);
		const text = isCurrentModel ? `${displayText} ✓` : displayText;
		rows.push([{
			text,
			callback_data: callbackData
		}]);
	}
	if (totalPages > 1) {
		const paginationRow = [];
		if (currentPage > 1) paginationRow.push({
			text: "◀ Prev",
			callback_data: buildProviderListCallbackData(provider, currentPage - 1)
		});
		paginationRow.push({
			text: `${currentPage}/${totalPages}`,
			callback_data: buildProviderListCallbackData(provider, currentPage)
		});
		if (currentPage < totalPages) paginationRow.push({
			text: "Next ▶",
			callback_data: buildProviderListCallbackData(provider, currentPage + 1)
		});
		rows.push(paginationRow);
	}
	rows.push([{
		text: "<< Back",
		callback_data: CALLBACK_PREFIX.back
	}]);
	return rows;
}
/**
* Build "Browse providers" button for /model summary.
*/
function buildBrowseProvidersButton() {
	return [[{
		text: "Browse providers",
		callback_data: CALLBACK_PREFIX.providers
	}]];
}
/**
* Truncate a model label for display, preserving its end if too long.
*/
function truncateModelLabel(modelLabel, maxLen) {
	if (modelLabel.length <= maxLen) return modelLabel;
	return `…${sliceUtf16Safe(modelLabel, -(maxLen - 1))}`;
}
/**
* Get page size for model list pagination.
*/
function getModelsPageSize() {
	return MODELS_PAGE_SIZE;
}
/**
* Calculate total pages for a model list.
*/
function calculateTotalPages(totalModels, pageSize) {
	const size = pageSize ?? MODELS_PAGE_SIZE;
	return size > 0 ? Math.ceil(totalModels / size) : 1;
}
//#endregion
//#region extensions/telegram/src/command-ui.ts
function buildCommandsPaginationKeyboard(currentPage, totalPages, agentId) {
	const buttons = [];
	const suffix = agentId ? `:${agentId}` : "";
	if (currentPage > 1) buttons.push({
		text: "◀ Prev",
		callback_data: `commands_page_${currentPage - 1}${suffix}`
	});
	buttons.push({
		text: `${currentPage}/${totalPages}`,
		callback_data: `commands_page_noop${suffix}`
	});
	if (currentPage < totalPages) buttons.push({
		text: "Next ▶",
		callback_data: `commands_page_${currentPage + 1}${suffix}`
	});
	return [buttons];
}
function buildTelegramModelsMenuButtons(params) {
	return buildProviderKeyboard(params.providers);
}
function buildTelegramCommandsListChannelData(params) {
	if (params.totalPages <= 1) return null;
	return { telegram: { buttons: buildCommandsPaginationKeyboard(params.currentPage, params.totalPages, params.agentId) } };
}
function buildTelegramModelsProviderChannelData(params) {
	if (params.providers.length === 0) return null;
	return { telegram: { buttons: buildProviderKeyboard(params.providers) } };
}
function buildTelegramModelsAddProviderChannelData(params) {
	if (params.providers.length === 0) return null;
	return { telegram: { buttons: params.providers.map((provider) => [{
		text: provider.id,
		callback_data: buildTelegramNativeCommandCallbackData(`/models add ${provider.id}`)
	}]) } };
}
function buildTelegramModelsListChannelData(params) {
	return { telegram: { buttons: buildModelsKeyboard(params) } };
}
function buildTelegramModelBrowseChannelData() {
	return { telegram: { buttons: buildBrowseProvidersButton() } };
}
//#endregion
export { buildTelegramModelsListChannelData as a, buildBrowseProvidersButton as c, buildProviderKeyboard as d, calculateTotalPages as f, resolveModelSelection as g, resolveModelListCallback as h, buildTelegramModelsAddProviderChannelData as i, buildModelSelectionCallbackData as l, parseModelCallbackData as m, buildTelegramCommandsListChannelData as n, buildTelegramModelsMenuButtons as o, getModelsPageSize as p, buildTelegramModelBrowseChannelData as r, buildTelegramModelsProviderChannelData as s, buildCommandsPaginationKeyboard as t, buildModelsKeyboard as u };
