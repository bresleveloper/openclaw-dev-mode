import { t as NON_ENV_SECRETREF_MARKER } from "../provider-credential-values-Cf7LMsFg.mjs";
import { t as resolveEnvApiKey } from "../model-auth-env-CPdn6zH8.mjs";
import { A as requireApiKey, j as resolveAwsSdkEnvVarName, k as isProviderAuthError } from "../model-auth-provider-config-C_EL9CxV.mjs";
import { a as removeProviderAuthProfilesWithLock } from "../profiles-Df1OQ7iN.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "../api-key-rotation-Dw4l5GMT.mjs";
import { i as removeAuthProfileConfig } from "../provider-auth-helpers-olPFvVdo.mjs";
import { a as resolveApiKeyForProvider, c as startProviderOAuthLoopbackCallbackServer, i as parseOAuthCallbackInput, l as waitForLocalOAuthCallback, n as generateHexOAuthState, o as resolveProviderAuthProfileMetadata, r as getRuntimeAuthForModel, s as resolveProviderAuthProfileMetadataAsync, t as buildOAuthCallbackOriginResolver } from "../provider-auth-runtime-CMRSW7VK.mjs";
export { NON_ENV_SECRETREF_MARKER, buildOAuthCallbackOriginResolver, collectProviderApiKeysForExecution, executeWithApiKeyRotation, generateHexOAuthState as generateOAuthState, getRuntimeAuthForModel, isProviderAuthError, parseOAuthCallbackInput, removeAuthProfileConfig, removeProviderAuthProfilesWithLock, requireApiKey, resolveApiKeyForProvider, resolveAwsSdkEnvVarName, resolveEnvApiKey, resolveProviderAuthProfileMetadata, resolveProviderAuthProfileMetadataAsync, startProviderOAuthLoopbackCallbackServer, waitForLocalOAuthCallback };
