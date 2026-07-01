import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.types.js";
/** Apply a selected auth choice, returning the mutated config or retry/model override signals. */
export declare function applyAuthChoice(params: ApplyAuthChoiceParams): Promise<ApplyAuthChoiceResult>;
