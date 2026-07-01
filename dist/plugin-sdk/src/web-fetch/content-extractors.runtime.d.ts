/** Runtime bridge for plugin-provided readable-content extractors used by web fetch. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { WebContentExtractionResult, WebContentExtractMode } from "../plugins/web-content-extractor-types.js";
/** Runs configured content extractors until one returns readable text. */
export declare function extractReadableContent(params: {
    html: string;
    url: string;
    extractMode: WebContentExtractMode;
    config?: OpenClawConfig;
}): Promise<(WebContentExtractionResult & {
    extractor: string;
}) | null>;
