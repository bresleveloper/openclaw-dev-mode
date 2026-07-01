import type { Api, Model, ModelThinkingLevel, Usage } from "./types.js";
/** Calculates and stores model cost fields from token usage and per-million pricing. */
export declare function calculateCost<TApi extends Api>(model: Model<TApi>, usage: Usage): Usage["cost"];
/** Returns thinking levels exposed by a reasoning-capable model. */
export declare function getSupportedThinkingLevels<TApi extends Api>(model: Model<TApi>): ModelThinkingLevel[];
/** Clamps a requested thinking level to the closest supported level for a model. */
export declare function clampThinkingLevel<TApi extends Api>(model: Model<TApi>, level: ModelThinkingLevel): ModelThinkingLevel;
/** Compares model identity by provider and id. */
export declare function modelsAreEqual<TApi extends Api>(a: Model<TApi> | null | undefined, b: Model<TApi> | null | undefined): boolean;
