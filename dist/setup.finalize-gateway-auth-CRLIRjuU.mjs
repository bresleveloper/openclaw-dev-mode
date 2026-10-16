import { t as resolveSetupSecretInputString } from "./setup.secret-input-CZUVZxSA.mjs";
//#region src/wizard/setup.finalize-gateway-auth.ts
function gatewayAuthUsesLocalPassword(authMode) {
	return authMode === "password" || authMode === "trusted-proxy";
}
async function resolveGatewayLocalPassword(params) {
	return await resolveSetupSecretInputString({
		config: params.nextConfig,
		value: params.nextConfig.gateway?.auth?.password,
		path: "gateway.auth.password",
		env: params.env
	}) ?? params.env.OPENCLAW_GATEWAY_PASSWORD?.trim() ?? "";
}
function buildSessionGatewayAuthOverride(params) {
	if (params.settings.authMode === "token" && params.settings.gatewayToken) return {
		...params.nextConfig.gateway?.auth,
		mode: "token",
		token: params.settings.gatewayToken
	};
	if (gatewayAuthUsesLocalPassword(params.settings.authMode) && params.resolvedGatewayPassword) return {
		...params.nextConfig.gateway?.auth,
		mode: params.settings.authMode,
		password: params.resolvedGatewayPassword
	};
	return params.nextConfig.gateway?.auth;
}
//#endregion
export { gatewayAuthUsesLocalPassword as n, resolveGatewayLocalPassword as r, buildSessionGatewayAuthOverride as t };
