import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";
import { Sd as upsertAuthProfileWithLock, xd as upsertAuthProfile } from "./types-CXLy55Xw.js";
import { a as upsertApiKeyProfile, i as buildApiKeyCredential, r as applyAuthProfileConfig, t as ApiKeyStorageOptions } from "./provider-auth-helpers-CVqHyPFU.js";
import { a as normalizeSecretInputModeInput, c as promptSecretRefForSetup, i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt, o as validateApiKeyInput, r as formatApiKeyPreview, s as resolveSecretInputModeForEnvSelection } from "./provider-auth-input-BM24sC0Q.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-DlqJDH2M.js";
import { n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "./normalize-secret-input-DuM-MDGm.js";
export { type ApiKeyStorageOptions, type OpenClawConfig, type SecretInput, applyAuthProfileConfig, buildApiKeyCredential, createProviderApiKeyAuthMethod, ensureApiKeyFromOptionEnvOrPrompt, formatApiKeyPreview, normalizeApiKeyInput, normalizeOptionalSecretInput, normalizeSecretInput, normalizeSecretInputModeInput, promptSecretRefForSetup, resolveSecretInputModeForEnvSelection, upsertApiKeyProfile, upsertAuthProfile, upsertAuthProfileWithLock, validateApiKeyInput };