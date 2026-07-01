import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
/** Resolves the default thinking level for a provider/model pair. */
export declare function resolveThinkingDefault(params: {
    cfg: OpenClawConfig;
    provider: string;
    model: string;
    catalog?: ModelCatalogEntry[];
}): ThinkLevel;
/** Resolves thinking default after loading runtime catalog only when needed. */
export declare function resolveThinkingDefaultWithRuntimeCatalog(params: {
    cfg: OpenClawConfig;
    provider: string;
    model: string;
    loadModelCatalog: () => Promise<ModelCatalogEntry[]>;
}): Promise<ThinkLevel>;
export {};
