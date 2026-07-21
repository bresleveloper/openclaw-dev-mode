//#region src/gateway/model-pricing-config.ts
/** Returns whether gateway model pricing/cost metadata should be shown. */
function isGatewayModelPricingEnabled(config) {
	return config.models?.pricing?.enabled !== false;
}
//#endregion
export { isGatewayModelPricingEnabled as t };
