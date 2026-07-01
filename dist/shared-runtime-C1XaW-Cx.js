import "./shared-BBO4vA80.js";
//#region extensions/microsoft-foundry/shared-runtime.ts
function getFoundryTokenCacheKey(params) {
	return `${params?.scope ?? ""}:${params?.subscriptionId ?? ""}:${params?.tenantId ?? ""}`;
}
//#endregion
export { getFoundryTokenCacheKey as t };
