import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { resolveApiKeyForProfile } from "openclaw/plugin-sdk/agent-runtime";
import { fingerprintResolvedAuthProfileCredential } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveOpenAICodexAuthIdentity } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/codex/src/app-server/auth-binding.ts
var auth_binding_exports = /* @__PURE__ */ __exportAll({
	fingerprintCodexAppServerAuthBinding: () => fingerprintCodexAppServerAuthBinding,
	prepareCodexAppServerAuthBinding: () => prepareCodexAppServerAuthBinding
});
function withMaterializedCredential(params) {
	const store = structuredClone(params.store);
	if (params.credential.type === "api_key") {
		const { keyRef: _keyRef, ...credential } = params.credential;
		store.profiles[params.profileId] = {
			...credential,
			key: params.value
		};
	} else if (params.credential.type === "token") {
		const { tokenRef: _tokenRef, ...credential } = params.credential;
		store.profiles[params.profileId] = {
			...credential,
			token: params.value
		};
	}
	return store;
}
/** Resolves one forwarded profile once so attestation and execution share exact material. */
async function prepareCodexAppServerAuthBinding(params) {
	const credential = params.authProfileStore.profiles[params.authProfileId];
	if (!credential) return;
	if (credential.type === "oauth") {
		const fingerprint = fingerprintResolvedAuthProfileCredential({
			profileId: params.authProfileId,
			credential: {
				...credential,
				accountId: resolveOpenAICodexAuthIdentity(credential).accountId
			},
			resolvedAuth: void 0
		});
		return fingerprint ? {
			fingerprint,
			authProfileStore: structuredClone(params.authProfileStore)
		} : void 0;
	}
	const resolved = await resolveApiKeyForProfile({
		cfg: params.config,
		store: params.authProfileStore,
		profileId: params.authProfileId,
		agentDir: params.agentDir
	});
	if (!resolved?.apiKey) throw new Error(`Codex could not resolve auth profile "${params.authProfileId}". Repair or replace its credential or SecretRef, then retry.`);
	const fingerprint = fingerprintResolvedAuthProfileCredential({
		profileId: params.authProfileId,
		credential,
		resolvedAuth: {
			apiKey: resolved.apiKey,
			profileId: params.authProfileId,
			source: `profile:${params.authProfileId}`,
			mode: credential.type === "api_key" ? "api-key" : "token"
		}
	});
	if (!fingerprint) throw new Error(`Codex could not attest auth profile "${params.authProfileId}". Re-select the OpenAI profile and retry.`);
	return {
		fingerprint,
		authProfileStore: withMaterializedCredential({
			store: params.authProfileStore,
			profileId: params.authProfileId,
			credential,
			value: resolved.apiKey
		})
	};
}
async function fingerprintCodexAppServerAuthBinding(params) {
	return (await prepareCodexAppServerAuthBinding(params))?.fingerprint;
}
//#endregion
export { fingerprintCodexAppServerAuthBinding as n, prepareCodexAppServerAuthBinding as r, auth_binding_exports as t };
