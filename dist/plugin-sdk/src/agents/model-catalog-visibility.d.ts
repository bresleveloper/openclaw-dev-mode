/**
 * Resolves model catalog entries visible to browse/UI surfaces. Visibility
 * combines explicit policy, configured models, defaults, and runtime
 * auth-backed availability.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.js";
type ModelCatalogVisibilityView = "default" | "configured" | "all";
type ProviderAuthChecker = (provider: string, modelApi?: string) => boolean | Promise<boolean>;
export declare function isCodexRoutableOpenAIPlatformCatalogEntry(entry: ModelCatalogEntry): boolean;
/**
 * Resolve catalog entries visible for one view, honoring explicit visibility
 * policy, configured models, and providers with usable auth.
 */
export declare function resolveVisibleModelCatalog(params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    defaultProvider: string;
    defaultModel?: string;
    agentDir?: string;
    agentId?: string;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    view?: ModelCatalogVisibilityView;
    runtimeAuthDiscovery?: boolean;
    providerAuthChecker?: ProviderAuthChecker;
}): Promise<ModelCatalogEntry[]>;
export {};
