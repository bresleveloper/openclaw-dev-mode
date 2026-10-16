import { f as normalizeSecretInputString, g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import "./command-format-DwEdrDKL.mjs";
import "./enable-DF-H95Vb.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import "./external-content-Bkm4w5qo.mjs";
import "./common-Dyxcwsy8.mjs";
import { r as readWebProviderEnvValue } from "./provider-runtime-shared-rD0cvENJ.mjs";
import "./web-fetch-utils-Iv2Zmiom.mjs";
import "./web-shared-D8fUK6Vo.mjs";
import "./web-search-provider-common-CA2avHBq.mjs";
import { r as withStrictWebToolsEndpoint } from "./web-guarded-fetch-B0DIznrg.mjs";
//#region src/agents/tools/web-search-citation-redirect.ts
/**
* Citation redirect resolver for web search results.
*
* Follows provider citation redirect URLs through the strict web-tools network guard.
*/
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
	try {
		return await withStrictWebToolsEndpoint({
			url,
			init: { method: "HEAD" },
			timeoutMs: REDIRECT_TIMEOUT_MS
		}, async ({ finalUrl }) => finalUrl || url);
	} catch {
		return url;
	}
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
function resolveWebSearchProviderCredential(params) {
	const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
	if (credentialRef) {
		if (credentialRef.source !== "env") return;
		return normalizeSecretInput(process.env[credentialRef.id]) || void 0;
	}
	return normalizeSecretInput(normalizeSecretInputString(params.credentialValue)) || readWebProviderEnvValue(params.envVars);
}
//#endregion
export { resolveCitationRedirectUrl as n, resolveWebSearchProviderCredential as t };
