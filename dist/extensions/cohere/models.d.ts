import { s as ModelDefinitionConfig } from "../../types.models-Nc1Z-tAz.js";
//#region extensions/cohere/models.d.ts
declare const COHERE_BASE_URL: string;
declare const COHERE_MODEL_CATALOG: {
  id: string;
  name: string;
  input: string[];
  contextWindow: number;
  maxTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  compat: {
    supportsStore: boolean;
    supportsUsageInStreaming: boolean;
    maxTokensField: string;
  };
}[];
declare function buildCohereCatalogModels(): ModelDefinitionConfig[];
declare function buildCohereModelDefinition(model: (typeof COHERE_MODEL_CATALOG)[number]): ModelDefinitionConfig;
//#endregion
export { COHERE_BASE_URL, COHERE_MODEL_CATALOG, buildCohereCatalogModels, buildCohereModelDefinition };