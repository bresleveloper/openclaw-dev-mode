import { u as upsertAuthProfileWithLockOrThrow } from "./profiles-bOpxmzRV.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-CBQXA_V3.mjs";
import { n as buildApiKeyCredential, t as applyAuthProfileConfig } from "./provider-auth-helpers-DYE6_4KQ.mjs";
import { c as validateApiKeyInput, i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt } from "./provider-auth-input-DbalvXU_.mjs";
//#region src/plugins/provider-api-key-auth.runtime.ts
/** Runtime API-key auth helper bundle exposed to provider setup code. */
const providerApiKeyAuthRuntime = {
	upsertAuthProfileWithLockOrThrow,
	applyAuthProfileConfig,
	applyPrimaryModel,
	buildApiKeyCredential,
	ensureApiKeyFromOptionEnvOrPrompt,
	normalizeApiKeyInput,
	validateApiKeyInput
};
//#endregion
export { providerApiKeyAuthRuntime };
