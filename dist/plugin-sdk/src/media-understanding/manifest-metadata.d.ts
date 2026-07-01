import type { OpenClawConfig } from "../config/types.js";
import type { MediaUnderstandingProvider } from "./types.js";
/** Builds a media provider registry from trusted manifest metadata without loading plugin code. */
export declare function buildMediaUnderstandingManifestMetadataRegistry(cfg?: OpenClawConfig, workspaceDir?: string): Map<string, MediaUnderstandingProvider>;
