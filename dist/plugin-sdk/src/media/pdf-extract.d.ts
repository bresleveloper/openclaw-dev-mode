import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DocumentExtractedImage, DocumentExtractionResult } from "../plugins/document-extractor-types.js";
/** Image payload extracted from a PDF page by the document-extract plugin. */
export type PdfExtractedImage = DocumentExtractedImage;
/** Text and extracted image payloads returned by PDF extraction callers. */
export type PdfExtractedContent = DocumentExtractionResult;
/** Extracts PDF content through the configured document extractor and hides extractor metadata. */
export declare function extractPdfContent(params: {
    buffer: Buffer;
    maxPages: number;
    maxPixels: number;
    minTextChars: number;
    password?: string;
    pageNumbers?: number[];
    config?: OpenClawConfig;
    onImageExtractionError?: (error: unknown) => void;
}): Promise<PdfExtractedContent>;
