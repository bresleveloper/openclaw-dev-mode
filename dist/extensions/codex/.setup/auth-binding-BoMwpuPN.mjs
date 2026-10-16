import { i as isCodexResponsesOAuthCredential, o as resolveCodexResponsesOAuthProfileFingerprint } from "./responses-oauth-twnuTaAa.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { fingerprintResolvedAuthProfileCredential } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveApiKeyForProfile } from "openclaw/plugin-sdk/agent-runtime";
import { resolveOpenAICodexAuthIdentity } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/codex/src/app-server/auth-binding.ts
var auth_binding_exports = /* @__PURE__ */ __exportAll({
	fingerprintCodexAppServerAuthBinding: () => fingerprintCodexAppServerAuthBinding,
	prepareCodexAppServerAuthBinding: () => prepareCodexAppServerAuthBinding
});
/** Resolves one forwarded profile once so attestation and execution share exact material. */
async function prepareCodexAppServerAuthBinding(params) {
	const credential = params.authProfileStore.profiles[params.authProfileId];
	if (!credential) return;
	if (credential.type === "oauth") {
		if (isCodexResponsesOAuthCredential(credential)) {
			const store = structuredClone(params.authProfileStore);
			return {
				fingerprint: await resolveCodexResponsesOAuthProfileFingerprint({
					profileId: params.authProfileId,
					store,
					agentDir: params.agentDir,
					config: params.config
				}),
				authProfileStore: store
			};
		}
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
	const store = structuredClone(params.authProfileStore);
	if (credential.type === "api_key") {
		const { keyRef: _keyRef, ...materialized } = credential;
		store.profiles[params.authProfileId] = {
			...materialized,
			key: resolved.apiKey
		};
	} else {
		const { tokenRef: _tokenRef, ...materialized } = credential;
		store.profiles[params.authProfileId] = {
			...materialized,
			token: resolved.apiKey
		};
	}
	return {
		fingerprint,
		authProfileStore: store
	};
}
async function fingerprintCodexAppServerAuthBinding(params) {
	return (await prepareCodexAppServerAuthBinding(params))?.fingerprint;
}
//#endregion
export { fingerprintCodexAppServerAuthBinding as n, prepareCodexAppServerAuthBinding as r, auth_binding_exports as t };
