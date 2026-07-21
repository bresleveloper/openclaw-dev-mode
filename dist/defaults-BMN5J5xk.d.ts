import { a as ModelApi, l as ModelMediaInputConfig, o as ModelCompatConfig } from "./types.models-BvJnk7Su.js";

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
//#region src/agents/defaults.d.ts
declare const DEFAULT_PROVIDER = "openai";
declare const DEFAULT_MODEL = "gpt-5.5";
declare const DEFAULT_CONTEXT_TOKENS = 200000;
//#endregion
export { ModelInputType as a, ModelCatalogEntry as i, DEFAULT_MODEL as n, DEFAULT_PROVIDER as r, DEFAULT_CONTEXT_TOKENS as t };