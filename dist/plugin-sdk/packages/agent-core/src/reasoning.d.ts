import { type Model, type SimpleStreamOptions } from "../../llm-core/src/index.js";
import type { ThinkingLevel } from "./types.js";
export declare function resolveAgentReasoningOption(model: Model, thinkingLevel: ThinkingLevel): SimpleStreamOptions["reasoning"];
