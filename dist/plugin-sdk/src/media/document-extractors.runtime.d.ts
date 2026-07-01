import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DocumentExtractionRequest, DocumentExtractionResult } from "../plugins/document-extractor-types.js";
/** Runs the first matching plugin document extractor and tags successful results with its extractor id. */
export declare function extractDocumentContent(params: DocumentExtractionRequest & {
    config?: OpenClawConfig;
}): Promise<(DocumentExtractionResult & {
    extractor: string;
}) | null>;
