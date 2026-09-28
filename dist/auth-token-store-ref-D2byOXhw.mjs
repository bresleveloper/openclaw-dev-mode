import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { h as resolveDefaultSecretProviderAlias } from "./ref-contract-BVi3ykLT.mjs";
import { c as readSecretStoreValue, t as assertSecretStoreValue, u as writeSecretStoreEntry } from "./secret-store-BjhT4Kcc.mjs";
import { t as randomToken } from "./random-token-B1woZa_H.mjs";
//#region src/gateway/auth-token-store-ref.ts
/** Store-backed SecretRef provisioning for gateway auth tokens setup generates itself. */
/** Store entry name for the gateway token; mirrors the documented env-var contract. */
const GATEWAY_AUTH_TOKEN_STORE_NAME = "OPENCLAW_GATEWAY_TOKEN";
const GATEWAY_AUTH_TOKEN_STORE_SCOPE = { kind: "team" };
function readStoredGatewayToken() {
	const existing = readSecretStoreValue({
		scope: GATEWAY_AUTH_TOKEN_STORE_SCOPE,
		name: GATEWAY_AUTH_TOKEN_STORE_NAME
	});
	return existing.ok ? normalizeOptionalString(existing.value) : void 0;
}
/**
* Provisions the gateway token in the secret store and returns the ref config points at.
*
* Omit `token` when setup has no value of its own: an existing store entry then wins so
* reruns never rotate a token already paired with clients or a running service, and a
* fresh one is minted otherwise. A supplied token always wins, which also migrates a
* previously persisted plaintext token without invalidating it. The store write stays
* ahead of the config write on purpose — a ref persisted without its value would leave
* the gateway unauthenticatable, while an entry whose config write later fails is simply
* picked up by the next run.
*/
function provisionGatewayTokenStoreRef(params) {
	const stored = params.token ? void 0 : readStoredGatewayToken();
	const token = params.token ?? stored ?? randomToken();
	assertSecretStoreValue(token, "secret", GATEWAY_AUTH_TOKEN_STORE_NAME);
	if (token !== stored) writeSecretStoreEntry({
		scope: GATEWAY_AUTH_TOKEN_STORE_SCOPE,
		name: GATEWAY_AUTH_TOKEN_STORE_NAME,
		value: token,
		kind: "secret",
		updatedBy: "setup"
	});
	return {
		ref: {
			source: "store",
			provider: resolveDefaultSecretProviderAlias(params.config, "store", { preferFirstProviderForSource: true }),
			id: GATEWAY_AUTH_TOKEN_STORE_NAME
		},
		token
	};
}
//#endregion
export { provisionGatewayTokenStoreRef as t };
