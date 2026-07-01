import type { ModelCatalogEntry } from "../agents/model-catalog.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Loads live catalog models for the user's preferred provider, ordered by discovery priority. */
export declare function loadPreferredProviderPickerCatalog(params: {
    cfg: OpenClawConfig;
    preferredProvider: string;
    agentDir?: string;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<ModelCatalogEntry[]>;
