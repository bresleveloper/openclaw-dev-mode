import { u as upsertAuthProfileWithLockOrThrow } from "./profiles-B-MkhBI8.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-eH18Zusd.mjs";
import { n as buildApiKeyCredential, t as applyAuthProfileConfig } from "./provider-auth-helpers-CqP4hf2X.mjs";
import { c as validateApiKeyInput, i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt } from "./provider-auth-input-Bs4B3uJA.mjs";
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
