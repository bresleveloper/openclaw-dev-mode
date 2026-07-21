import { o as prepareClawRouterRequestModel } from "./provider-catalog-D-Mf25kS.js";
//#region extensions/clawrouter/stream.ts
const ENV_API_KEY_MARKER = "CLAWROUTER_API_KEY";
function withBearerAuthorization(headers, apiKey) {
	const next = {};
	for (const [name, value] of Object.entries(headers ?? {})) if (name.toLowerCase() !== "authorization") next[name] = value;
	next.Authorization = `Bearer ${apiKey}`;
	return next;
}
function createClawRouterStreamWrapper(underlying) {
	if (!underlying) return;
	return (model, context, options) => {
		const apiKey = options?.apiKey?.trim();
		const preparedModel = prepareClawRouterRequestModel(model);
		if (!apiKey || apiKey === ENV_API_KEY_MARKER) return underlying(preparedModel, context, options);
		return underlying({
			...preparedModel,
			headers: withBearerAuthorization(preparedModel.headers, apiKey)
		}, context, options);
	};
}
function wrapClawRouterProviderStream(ctx) {
	return createClawRouterStreamWrapper(ctx.streamFn);
}
//#endregion
export { wrapClawRouterProviderStream as t };
