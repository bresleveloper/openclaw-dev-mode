import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { s as fitsTelegramCallbackData, t as buildTelegramNativeCommandCallbackData } from "./native-command-callback-data-egNNRPnG.mjs";
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
function buildProviderKeyboard(providers) {
	const rows = [];
	for (const [index, provider] of providers.entries()) (rows[Math.floor(index / 2)] ??= []).push({
		text: `${provider.id} (${provider.count})`,
		callback_data: buildProviderListCallbackData(provider.id, 1)
	});
	return rows;
}
function buildPaginationRow(currentPage, totalPages, callbackData) {
	return [
		{
			page: currentPage - 1,
			text: "◀ Prev",
			show: currentPage > 1
		},
		{
			page: null,
			text: `${currentPage}/${totalPages}`,
			show: true
		},
		{
			page: currentPage + 1,
			text: "Next ▶",
			show: currentPage < totalPages
		}
	].filter(({ show }) => show).map(({ page, text }) => ({
		text,
		callback_data: callbackData(page)
	}));
}
function buildModelsKeyboard(params) {
	const { provider, models, currentModel, currentPage, totalPages, modelNames } = params;
	const currentSelection = currentModel?.trim() ?? "";
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
		const isCurrentModel = currentSelection.length > 0 && currentSelection === (currentSelection.includes("/") ? `${provider}/${model}` : model);
		const fallbackLabel = model.includes("/") ? `${provider}/${model}` : model;
		const displayLabel = modelNames?.get(`${provider}/${model}`) ?? fallbackLabel;
		const displayText = displayLabel.length <= MODEL_BUTTON_LABEL_MAX_LENGTH ? displayLabel : `…${sliceUtf16Safe(displayLabel, -37)}`;
		const text = isCurrentModel ? `${displayText} ✓` : displayText;
		rows.push([{
			text,
			callback_data: callbackData
		}]);
	}
	if (totalPages > 1) rows.push(buildPaginationRow(currentPage, totalPages, (page) => buildProviderListCallbackData(provider, page ?? currentPage)));
	rows.push([{
		text: "<< Back",
		callback_data: CALLBACK_PREFIX.back
	}]);
	return rows;
}
function buildBrowseProvidersButton() {
	return [[{
		text: "Browse providers",
		callback_data: CALLBACK_PREFIX.providers
	}]];
}
function getModelsPageSize() {
	return MODELS_PAGE_SIZE;
}
function calculateTotalPages(totalModels, pageSize) {
	const size = pageSize ?? MODELS_PAGE_SIZE;
	return size > 0 ? Math.ceil(totalModels / size) : 1;
}
//#endregion
//#region extensions/telegram/src/command-ui.ts
function withTelegramButtons(buttons) {
	return { telegram: { buttons } };
}
function buildCommandsPaginationKeyboard(currentPage, totalPages, agentId) {
	const suffix = agentId ? `:${agentId}` : "";
	return [buildPaginationRow(currentPage, totalPages, (page) => `commands_page_${page ?? "noop"}${suffix}`)];
}
function buildTelegramCommandsListChannelData(params) {
	if (params.totalPages <= 1) return null;
	return withTelegramButtons(buildCommandsPaginationKeyboard(params.currentPage, params.totalPages, params.agentId));
}
function buildTelegramModelsProviderChannelData(params) {
	if (params.providers.length === 0) return null;
	return withTelegramButtons(buildProviderKeyboard(params.providers));
}
function buildTelegramModelsAddProviderChannelData(params) {
	if (params.providers.length === 0) return null;
	return withTelegramButtons(params.providers.map((provider) => [{
		text: provider.id,
		callback_data: buildTelegramNativeCommandCallbackData(`/models add ${provider.id}`)
	}]));
}
function buildTelegramModelsListChannelData(params) {
	return withTelegramButtons(buildModelsKeyboard(params));
}
function buildTelegramModelBrowseChannelData() {
	return withTelegramButtons(buildBrowseProvidersButton());
}
//#endregion
export { buildTelegramModelsListChannelData as a, buildModelSelectionCallbackData as c, calculateTotalPages as d, getModelsPageSize as f, resolveModelSelection as h, buildTelegramModelsAddProviderChannelData as i, buildModelsKeyboard as l, resolveModelListCallback as m, buildTelegramCommandsListChannelData as n, buildTelegramModelsProviderChannelData as o, parseModelCallbackData as p, buildTelegramModelBrowseChannelData as r, buildBrowseProvidersButton as s, buildCommandsPaginationKeyboard as t, buildProviderKeyboard as u };
