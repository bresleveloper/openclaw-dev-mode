import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { h as resolveProviderHttpRequestConfig } from "./shared-DcnGQdHV.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-B-PBEJIo.mjs";
import "./provider-http-CuRGJD0L.mjs";
//#region extensions/fal/http-config.ts
const DEFAULT_FAL_BASE_URL = "https://fal.run";
async function resolveFalHttpRequestConfig(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "fal",
		cfg: params.req.cfg,
		agentDir: params.req.agentDir,
		store: params.req.authStore
	});
	if (!auth.apiKey) throw new Error("fal API key missing");
	return resolveProviderHttpRequestConfig({
		baseUrl: normalizeOptionalString(params.req.cfg?.models?.providers?.fal?.baseUrl),
		defaultBaseUrl: DEFAULT_FAL_BASE_URL,
		allowPrivateNetwork: false,
		defaultHeaders: {
			Authorization: `Key ${auth.apiKey}`,
			"Content-Type": "application/json"
		},
		provider: "fal",
		capability: params.capability,
		transport: "http"
	});
}
//#endregion
export { resolveFalHttpRequestConfig as t };
