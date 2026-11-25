import { k as Model, tt as SimpleStreamOptions } from "../types-B1ZIh9Ch.mjs";
import "../types-CeCl7cJZ.mjs";
import "../event-stream-qCU9FGtl.mjs";
import { GenerateContentConfig, ThinkingLevel } from "@google/genai";
type GoogleThinkingOptions = {
  enabled: boolean;
  budgetTokens?: number;
  level?: `${ThinkingLevel}`;
};
/** Shared wire policy for the Gemini API and Vertex, with or without the Google SDK. */
export declare function buildGoogleGenerationConfig(model: Pick<Model, "id" | "reasoning" | "maxTokens">, thinking: GoogleThinkingOptions | undefined, maxTokens: number | undefined): Pick<GenerateContentConfig, "maxOutputTokens" | "thinkingConfig">;
export declare function buildGoogleSimpleThinking(model: Model, options: SimpleStreamOptions | undefined): GoogleThinkingOptions;
export {};