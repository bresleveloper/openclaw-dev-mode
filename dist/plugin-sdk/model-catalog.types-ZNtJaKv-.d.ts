import { a as ModelApi, l as ModelMediaInputConfig, o as ModelCompatConfig } from "./types.models-C597Wbu7.js";

//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  alias?: string;
  api?: ModelApi;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
};
//#endregion
export { ModelInputType as n, ModelCatalogEntry as t };