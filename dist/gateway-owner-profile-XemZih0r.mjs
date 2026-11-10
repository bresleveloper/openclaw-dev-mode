//#region src/gateway/gateway-owner-profile.ts
/** Owner attribution never supplies a verified login or changes operator authority. */
function shouldUseGatewayOwnerProfile(params) {
	return params.role === "operator" && !params.authenticatedUserId && (!params.rolesConfigured || params.authMethod === "token" || params.authMethod === "password");
}
//#endregion
export { shouldUseGatewayOwnerProfile as t };
