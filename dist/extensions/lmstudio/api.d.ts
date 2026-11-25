import { Hx as ProviderPrepareDynamicModelContext, Qx as ProviderRuntimeModel, _A as WizardPrompter, aS as ProviderAuthResult, cS as SecretInputMode, iS as ProviderAuthMethodNonInteractiveContext, ix as ProviderCatalogResult, rx as ProviderCatalogContext, tS as ProviderAppGuidedSetupContext } from "../../config-contracts-hzlacViZ.js";
import { p as ModelProviderDeclarationConfig, r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import "../../provider-auth-QzauSf-u.js";
import "../../provider-model-shared-OQQj5XdR.js";
import { C as LMSTUDIO_DEFAULT_MODEL_ID, D as LMSTUDIO_MODEL_PLACEHOLDER, E as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, O as LMSTUDIO_PROVIDER_ID, S as LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, T as LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, _ as resolveLoadedContextWindow, a as resolveLmstudioRuntimeApiKey, b as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, c as buildLmstudioModelName, d as normalizeLmstudioConfiguredCatalogEntries, f as normalizeLmstudioProviderConfig, g as resolveLmstudioServerBase, h as resolveLmstudioReasoningCompat, i as resolveLmstudioRequestContext, k as LMSTUDIO_PROVIDER_LABEL, l as mapLmstudioWireEntry, m as resolveLmstudioReasoningCapability, n as resolveLmstudioConfiguredApiKey, o as LmstudioModelBase, p as resolveLmstudioInferenceBase, r as resolveLmstudioProviderHeaders, s as LmstudioModelWire, t as buildLmstudioAuthHeaders, u as mapLmstudioWireModelsToConfig, v as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, w as LMSTUDIO_DOCKER_HOST_BASE_URL, x as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, y as LMSTUDIO_DEFAULT_BASE_URL } from "../../runtime-DlEKNbPE.js";
import "../../setup-Bk0qGrve.js";
import "../../provider-catalog-shared-B0h2-zRI.js";
type ProviderPromptText = (params: {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string | undefined) => string | undefined;
}) => Promise<string | undefined>;
type ProviderPromptNote = (message: string, title?: string) => Promise<void> | void;
/** Acquires live inventory for the registered catalog; public helper calls stay advisory. */
export declare function discoverLmstudioProvider(ctx: ProviderCatalogContext): Promise<{
  provider: ModelProviderDeclarationConfig;
} | null>;
export declare function discoverLmstudioProvider(ctx: ProviderCatalogContext, options: {
  discoveryMode: "strict";
}): Promise<ProviderCatalogResult>;
/** Read-only local discovery plus a success-gated config proposal for guided setup. */
export declare function prepareAppGuidedLmstudioSetup(ctx: ProviderAppGuidedSetupContext & {
  modelRef?: string;
}): Promise<ProviderAuthResult | null>;
/** Read-only reachability probe for app-guided setup when no loaded model qualifies. */
export declare function detectAppGuidedLmstudioAvailability(ctx: ProviderAppGuidedSetupContext): Promise<boolean>;
/** Interactive LM Studio setup with connectivity and model-availability checks. */
export declare function promptAndConfigureLmstudioInteractive(params: {
  config: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  prompter?: WizardPrompter;
  secretInputMode?: SecretInputMode;
  allowSecretRefPrompt?: boolean;
  isRemote?: boolean;
  signal?: AbortSignal;
  suppliedApiKey?: string;
  requestedModelId?: string;
  promptText?: ProviderPromptText;
  note?: ProviderPromptNote;
}): Promise<ProviderAuthResult>;
/** Non-interactive setup path backed by the shared self-hosted helper. */
export declare function configureLmstudioNonInteractive(ctx: ProviderAuthMethodNonInteractiveContext): Promise<OpenClawConfig | null>;
export declare function prepareLmstudioDynamicModel(ctx: ProviderPrepareDynamicModelContext): Promise<ProviderRuntimeModel | undefined>;
export { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_DOCKER_HOST_BASE_URL, LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, type LmstudioModelBase, type LmstudioModelWire, buildLmstudioAuthHeaders, buildLmstudioModelName, mapLmstudioWireEntry, mapLmstudioWireModelsToConfig, normalizeLmstudioConfiguredCatalogEntries, normalizeLmstudioProviderConfig, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioReasoningCompat, resolveLmstudioRequestContext, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow };