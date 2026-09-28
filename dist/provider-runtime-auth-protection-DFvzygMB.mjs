import { o as looksLikeSecretSentinel, s as mintSecretSentinel } from "./sentinel-C86v7W15.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
//#region src/agents/provider-runtime-auth-protection.ts
function protectRuntimeAuthValue(params) {
	if (!params.value) return params.value;
	return looksLikeSecretSentinel(params.value) ? params.value : mintSecretSentinel(params.value, { label: `model-auth:${params.provider}:${params.label}` });
}
/** Re-sentinels credentials returned by a provider auth exchange. */
function protectPreparedProviderRuntimeAuth(params) {
	const { preparedAuth } = params;
	if (!preparedAuth) return;
	const protect = (value, label) => !value || isNonSecretApiKeyMarker(value) ? value : protectRuntimeAuthValue({
		value,
		provider: params.provider,
		label
	});
	const request = preparedAuth.request;
	const headers = request?.headers ? Object.fromEntries(Object.entries(request.headers).map(([name, value]) => [name, protect(value, `runtime-header:${name.toLowerCase()}`)])) : void 0;
	const auth = request?.auth;
	const protectedAuth = auth?.mode === "authorization-bearer" ? {
		...auth,
		token: protect(auth.token, "runtime-bearer")
	} : auth?.mode === "header" ? {
		...auth,
		value: protect(auth.value, `runtime-auth-header:${auth.headerName.toLowerCase()}`)
	} : auth;
	return {
		...preparedAuth,
		apiKey: protect(preparedAuth.apiKey, "runtime-api-key"),
		...request ? { request: {
			...request,
			...headers ? { headers } : {},
			...protectedAuth ? { auth: protectedAuth } : {}
		} } : {}
	};
}
//#endregion
export { protectPreparedProviderRuntimeAuth as t };
