import { buildCloudflareAiGatewayModelDefinition, resolveCloudflareAiGatewayBaseUrl } from "./models.js";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceSecretRef, resolveNonEnvSecretRefApiKeyMarker } from "openclaw/plugin-sdk/secret-input";
//#region extensions/cloudflare-ai-gateway/catalog-provider.ts
function resolveCloudflareAiGatewayApiKey(cred) {
	if (!cred || cred.type !== "api_key") return;
	const keyRef = coerceSecretRef(cred.keyRef);
	const keyRefId = normalizeOptionalString(keyRef?.id);
	if (keyRef && keyRefId) return keyRef.source === "env" ? keyRefId : resolveNonEnvSecretRefApiKeyMarker(keyRef.source);
	return normalizeOptionalString(cred.key);
}
/**
* Returns a provider catalog entry when credentials and Gateway metadata are
* complete enough to construct an Anthropic-compatible base URL.
*/
function buildCloudflareAiGatewayCatalogProvider(params) {
	const apiKey = normalizeOptionalString(params.envApiKey) ?? resolveCloudflareAiGatewayApiKey(params.credential);
	if (!apiKey) return null;
	const metadata = params.credential?.type === "api_key" ? params.credential.metadata : void 0;
	const accountId = normalizeOptionalString(metadata?.accountId);
	const gatewayId = normalizeOptionalString(metadata?.gatewayId);
	if (!accountId || !gatewayId) return null;
	return {
		baseUrl: resolveCloudflareAiGatewayBaseUrl({
			accountId,
			gatewayId
		}),
		api: "anthropic-messages",
		apiKey,
		models: [buildCloudflareAiGatewayModelDefinition()]
	};
}
//#endregion
export { buildCloudflareAiGatewayCatalogProvider };
