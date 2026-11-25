import { BD as ImageGenerationProvider, Qx as ProviderRuntimeModel, qx as ProviderResolveDynamicModelContext } from "../../config-contracts-hzlacViZ.js";
import { _ as ModelCompatConfig, l as ModelDefinitionConfig, p as ModelProviderDeclarationConfig, r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { t as Api, u as Model } from "../../types-B1zI2CfC.js";
import "../../index-DU_vyQtb.js";
import "../../provider-model-shared-OQQj5XdR.js";
import "../../provider-onboard-BitR1dNE.js";
import "../../provider-catalog-live-runtime-DnKGuU0_.js";
import "../../image-generation-ChnYK1I-.js";
export declare function normalizeXaiModelId(id: string): string;
export declare const XAI_TOOL_SCHEMA_PROFILE: string;
export declare const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING: "html-entities";
export declare function applyXaiModelCompat<T extends {
  compat?: ModelCompatConfig;
}>(model: T): T;
export declare function buildXaiProvider(api?: ModelProviderDeclarationConfig["api"], authMode?: "oauth" | "token"): ModelProviderDeclarationConfig;
export declare const XAI_DEFAULT_MODEL_REF = "xai/grok-4.7";
export declare function applyXaiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function applyXaiConfig(cfg: OpenClawConfig): OpenClawConfig;
export declare function buildXaiImageGenerationProvider(): ImageGenerationProvider;
export declare const XAI_BASE_URL: string;
export declare const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
export declare const XAI_IMAGE_MODELS: readonly ["grok-imagine-image", "grok-imagine-image-2.0", "grok-imagine-image-quality"];
export declare const XAI_DEFAULT_CONTEXT_WINDOW = 1000000;
export declare const XAI_DEFAULT_MAX_TOKENS = 64000;
export declare const XAI_DEFAULT_MODEL_ID = "grok-4.7";
/** Curated pricing and supported-family capabilities share one lookup owner. */
export declare function resolveXaiCatalogEntry(modelId: string): ModelDefinitionConfig | undefined;
export declare function buildXaiModelDefinition(): ModelDefinitionConfig;
export declare function buildXaiCatalogModels(): ModelDefinitionConfig[];
export declare function isModernXaiModel(modelId: string): boolean;
export declare function resolveXaiForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
}): (Model<Api> & {
  compat: ModelCompatConfig;
  thinkingLevelMap: Partial<Record<"high" | "low" | "medium" | "minimal" | "off" | "xhigh", string | null>>;
}) | undefined;
type XaiRuntimeModelCompat = Pick<ProviderRuntimeModel, "id" | "reasoning"> & Partial<Pick<ProviderRuntimeModel, "api" | "baseUrl" | "compat">> & {
  thinkingLevelMap?: XaiThinkingLevelMap;
};
type XaiThinkingLevelMap = Partial<Record<"off" | "minimal" | "low" | "medium" | "high" | "xhigh", string | null>>;
export declare function applyXaiRuntimeModelCompat<T extends XaiRuntimeModelCompat>(model: T): T & {
  compat: ModelCompatConfig;
  thinkingLevelMap: XaiThinkingLevelMap;
};
export declare function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): {
  api: "openai-responses";
  baseUrl?: string;
} | undefined;
export {};