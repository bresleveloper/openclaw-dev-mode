import { Gt as ImageGenerationProvider, Jt as OpenClawConfig, Lt as ProviderResolveDynamicModelContext, Qt as Api, Yt as ModelDefinitionConfig, Zt as ModelProviderDeclarationConfig, en as Model } from "../../runtime-api-Bekxb7wO.js";
import "../../provider-model-shared-D4njaASJ.js";
import "../../provider-catalog-live-runtime-2BVXlv_j.js";
//#region extensions/xai/model-id.d.ts
export declare function normalizeXaiModelId(id: string): string;
//#endregion
//#region extensions/xai/model-compat.d.ts
export declare const XAI_TOOL_SCHEMA_PROFILE = "xai";
export declare const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
export declare function applyXaiModelCompat<T extends {
  compat?: unknown;
}>(model: T): T;
//#endregion
//#region extensions/xai/provider-catalog.d.ts
export declare function buildXaiProvider(api?: ModelProviderDeclarationConfig["api"], authMode?: "oauth" | "token"): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/xai/onboard.d.ts
export declare const XAI_DEFAULT_MODEL_REF = "xai/grok-4.7";
export declare function applyXaiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyXaiConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
//#region extensions/xai/image-generation-provider.d.ts
export declare function buildXaiImageGenerationProvider(): ImageGenerationProvider;
//#endregion
//#region extensions/xai/model-definitions.d.ts
export declare const XAI_BASE_URL: string;
export declare const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
export declare const XAI_IMAGE_MODELS: readonly ["grok-imagine-image", "grok-imagine-image-quality"];
export declare const XAI_DEFAULT_CONTEXT_WINDOW = 1000000;
export declare const XAI_DEFAULT_MAX_TOKENS = 64000;
export declare const XAI_DEFAULT_MODEL_ID = "grok-4.7";
/** Curated pricing and supported-family capabilities share one lookup owner. */
export declare function resolveXaiCatalogEntry(modelId: string): ModelDefinitionConfig | undefined;
export declare function buildXaiModelDefinition(): ModelDefinitionConfig;
export declare function buildXaiCatalogModels(): ModelDefinitionConfig[];
//#endregion
//#region extensions/xai/provider-models.d.ts
export declare function isModernXaiModel(modelId: string): boolean;
export declare function resolveXaiForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
}): (Model<Api> & {
  compat: Record<string, unknown>;
  thinkingLevelMap: Partial<Record<"high" | "low" | "medium" | "minimal" | "off" | "xhigh", string | null>>;
}) | undefined;
//#endregion
//#region extensions/xai/runtime-model-compat.d.ts
type XaiRuntimeModelCompat = {
  api?: unknown;
  baseUrl?: unknown;
  compat?: unknown;
  id?: unknown;
  reasoning?: unknown;
  thinkingLevelMap?: XaiThinkingLevelMap;
};
type XaiThinkingLevelMap = Partial<Record<"off" | "minimal" | "low" | "medium" | "high" | "xhigh", string | null>>;
export declare function applyXaiRuntimeModelCompat<T extends XaiRuntimeModelCompat>(model: T): T & {
  compat: Record<string, unknown>;
  thinkingLevelMap: XaiThinkingLevelMap;
};
//#endregion
//#region extensions/xai/provider-routing.d.ts
export declare function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): {
  api: "openai-responses";
  baseUrl?: string;
} | undefined;
//#endregion