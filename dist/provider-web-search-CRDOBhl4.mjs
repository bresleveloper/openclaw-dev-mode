import { p as resolveSecretInputRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./enable-35XtW1Wg.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import "./external-content-CLufk6dK.mjs";
import "./common-XfKigJno.mjs";
import "./web-fetch-utils-DnxqFjuE.mjs";
import "./web-shared-7z6bteLg.mjs";
import "./web-search-provider-common-6Yt6-I5E.mjs";
import { r as withStrictWebToolsEndpoint } from "./web-guarded-fetch-BbdLcXP-.mjs";
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
/**
* Web-search provider credential resolver.
*
* Reads config values, env-backed secret refs, and provider-specific environment variables.
*/
/**
* Resolves web-search provider credentials from config values, secret refs, or
* provider-specific environment variables.
*/
/** Returns the first usable credential for a web-search provider. */
function resolveWebSearchProviderCredential(params) {
	const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
	if (credentialRef) {
		if (credentialRef.source !== "env") return;
		const fromEnvRef = normalizeSecretInput(process.env[credentialRef.id]);
		if (fromEnvRef) return fromEnvRef;
		return;
	}
	const fromConfigRaw = normalizeSecretInputString(params.credentialValue);
	const fromConfig = normalizeSecretInput(fromConfigRaw);
	if (fromConfig) return fromConfig;
	for (const envVar of params.envVars) {
		const fromEnv = normalizeSecretInput(process.env[envVar]);
		if (fromEnv) return fromEnv;
	}
}
//#endregion
export { resolveCitationRedirectUrl as n, resolveWebSearchProviderCredential as t };
