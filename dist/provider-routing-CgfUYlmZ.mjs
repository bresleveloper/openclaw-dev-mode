//#region extensions/openrouter/provider-routing.ts
const BLOCKED_RECORD_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
function sanitizeJsonLikeValue(value) {
	if (value === void 0) return;
	if (Array.isArray(value)) return value.map(sanitizeJsonLikeValue).filter((entry) => entry !== void 0);
	if (!value || typeof value !== "object") return value;
	return sanitizeRecord(value);
}
function sanitizeRecord(value) {
	return Object.fromEntries(Object.entries(value).filter(([key, entry]) => !BLOCKED_RECORD_KEYS.has(key) && entry !== void 0).map(([key, entry]) => [key, sanitizeJsonLikeValue(entry)]));
}
function readRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const sanitized = sanitizeRecord(value);
	return Object.keys(sanitized).length > 0 ? sanitized : void 0;
}
function resolveOpenRouterExtraParamsForTransport(ctx) {
	const providerConfigParams = readRecord(ctx.config?.models?.providers?.[ctx.provider]?.params);
	const modelParams = readRecord(ctx.model?.params);
	const providerRouting = {
		...readRecord(providerConfigParams?.provider),
		...readRecord(modelParams?.provider),
		...readRecord(ctx.extraParams.provider)
	};
	const hasProviderRouting = Object.keys(providerRouting).length > 0;
	if (!providerConfigParams && !modelParams && !hasProviderRouting) return;
	return { patch: {
		...providerConfigParams,
		...modelParams,
		...ctx.extraParams,
		...hasProviderRouting ? { provider: providerRouting } : {}
	} };
}
//#endregion
export { resolveOpenRouterExtraParamsForTransport as t };
