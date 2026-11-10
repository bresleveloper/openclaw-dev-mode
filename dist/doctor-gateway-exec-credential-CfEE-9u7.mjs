//#region src/flows/doctor-gateway-exec-credential.ts
async function hasActiveGatewayExecCredential(params) {
	const [{ resolveSecretInputRef }, { gatewaySecretInputPathCanWin }, secretPaths] = await Promise.all([
		import("./types.secrets-lw2AHHZJ.mjs"),
		import("./credentials-secret-inputs-BilsIgu1.mjs"),
		import("./secret-input-paths-CNOIRfxe.mjs")
	]);
	const isExecRef = (value) => resolveSecretInputRef({
		value,
		defaults: params.cfg.secrets?.defaults
	}).ref?.source === "exec";
	const mode = params.cfg.gateway?.mode === "remote" ? "remote" : "local";
	const hasExecCredential = secretPaths.ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
		if (!gatewaySecretInputPathCanWin({
			config: params.cfg,
			env: params.env ?? process.env,
			modeOverride: mode,
			path
		})) return false;
		return isExecRef(secretPaths.readGatewaySecretInputValue(params.cfg, path));
	});
	if (hasExecCredential || !params.cfg.gateway?.remote?.edgeAuth) return hasExecCredential;
	const [{ buildGatewayProbeConnectionDetails }, edgeAuth] = await Promise.all([import("./call-BvbeEASg.mjs"), import("./edge-auth-C3VkeBNT.mjs")]);
	const targetUrl = params.targetUrl ?? (await buildGatewayProbeConnectionDetails({ config: params.cfg })).url;
	const { gatewayEdgeAuthValueForTarget, normalizeEdgeAuthHeadersConfig } = edgeAuth;
	const headers = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: params.cfg,
		targetUrl
	}));
	return Object.values(headers ?? {}).some(isExecRef);
}
//#endregion
export { hasActiveGatewayExecCredential as t };
