import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
import type { ModelManifestNormalizationContext, ModelRef } from "./model-selection-normalize.js";
import { type ModelRefStatus } from "./model-selection-shared.js";
export { buildConfiguredAllowlistKeys, buildModelAliasIndex, normalizeModelSelection, resolveConfiguredModelRef, resolveHooksGmailModel, resolveModelRefFromString, } from "./model-selection-shared.js";
export type { ModelRefStatus } from "./model-selection-shared.js";
/** Returns whether a normalized model ref is available, allowed, or fallback-backed. */
export declare function getModelRefStatus(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    ref: ModelRef;
    defaultProvider: string;
    defaultModel?: string;
} & ModelManifestNormalizationContext): ModelRefStatus;
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
export declare function resolveAllowedModelRef(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    raw: string;
    defaultProvider: string;
    defaultModel?: string;
} & ModelManifestNormalizationContext): {
    ref: ModelRef;
    key: string;
} | {
    error: string;
};
