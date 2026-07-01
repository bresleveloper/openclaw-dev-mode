import type { NormalizedModelCatalogRow } from "@openclaw/model-catalog-core/model-catalog-types";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.types.js";
/** Loads authoritative static manifest catalog rows for model-list output. */
export declare function loadStaticManifestCatalogRowsForList(params: {
    cfg: OpenClawConfig;
    providerFilter?: string;
    env?: NodeJS.ProcessEnv;
    metadataSnapshot?: PluginMetadataSnapshot;
}): readonly NormalizedModelCatalogRow[];
/** Loads supplemental non-runtime manifest catalog rows for fallback list sources. */
export declare function loadSupplementalManifestCatalogRowsForList(params: {
    cfg: OpenClawConfig;
    providerFilter?: string;
    env?: NodeJS.ProcessEnv;
    metadataSnapshot?: PluginMetadataSnapshot;
}): readonly NormalizedModelCatalogRow[];
