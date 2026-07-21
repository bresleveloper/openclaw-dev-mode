import { i as OpenClawConfig } from "../types.openclaw-B5gtuEn_.js";
import { d as SecretInput } from "../types.secrets-C15Z_eLX.js";
import { df as upsertAuthProfile, ff as upsertAuthProfileWithLock } from "../types-BpDhk2ev.js";
import { a as normalizeSecretInputModeInput, c as promptSecretRefForSetup, i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt, o as validateApiKeyInput, r as formatApiKeyPreview, s as resolveSecretInputModeForEnvSelection } from "../provider-auth-input-IXb1_oAE.js";
import { a as upsertApiKeyProfile, i as buildApiKeyCredential, r as applyAuthProfileConfig, t as ApiKeyStorageOptions } from "../provider-auth-helpers-Cx88XAmn.js";
import { t as createProviderApiKeyAuthMethod } from "../provider-api-key-auth-D17Kd3hO.js";
import { n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "../normalize-secret-input-DuM-MDGm.js";
export { type ApiKeyStorageOptions, type OpenClawConfig, type SecretInput, applyAuthProfileConfig, buildApiKeyCredential, createProviderApiKeyAuthMethod, ensureApiKeyFromOptionEnvOrPrompt, formatApiKeyPreview, normalizeApiKeyInput, normalizeOptionalSecretInput, normalizeSecretInput, normalizeSecretInputModeInput, promptSecretRefForSetup, resolveSecretInputModeForEnvSelection, upsertApiKeyProfile, upsertAuthProfile, upsertAuthProfileWithLock, validateApiKeyInput };