import { f as normalizeSecretInputString, g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import "./command-format-CYoE8cOC.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import "./enable-yRbPluWX.mjs";
import "./common-BofcG96e.mjs";
import "./external-content-Bkm4w5qo.mjs";
import { r as readWebProviderEnvValue } from "./provider-runtime-shared-De_5Rq_i.mjs";
import "./web-fetch-utils-_ON8SiFP.mjs";
import "./web-shared-DT676edC.mjs";
import "./web-search-provider-common-BhatwETt.mjs";
import { r as withStrictWebToolsEndpoint } from "./web-guarded-fetch-L3tENgKC.mjs";
//#region src/agents/tools/web-search-citation-redirect.ts
const REDIRECT_TIMEOUT_MS = 5e3;
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
