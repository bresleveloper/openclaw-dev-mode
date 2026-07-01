import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SsrFPolicy } from "../infra/net/ssrf.js";
import { type PdfExtractedImage } from "./pdf-extract.js";
/** Image payload shape reused for extracted PDF images and normalized input images. */
type InputImageContent = PdfExtractedImage;
/** Text/images extracted from an input_file source after MIME-specific processing. */
type InputFileExtractResult = {
    filename: string;
    text?: string;
    images?: InputImageContent[];
};
/** PDF extraction limits applied before model-visible input_file content is produced. */
type InputPdfLimits = {
    maxPages: number;
    maxPixels: number;
    minTextChars: number;
};
/** Resolved input_file limits with normalized MIME allowlist and PDF sub-limits. */
export type InputFileLimits = {
    allowUrl: boolean;
    urlAllowlist?: string[];
    allowedMimes: Set<string>;
    maxBytes: number;
    maxChars: number;
    maxRedirects: number;
    timeoutMs: number;
    pdf: InputPdfLimits;
};
/** Optional config shape accepted by input_file limit resolution. */
export type InputFileLimitsConfig = {
    allowUrl?: boolean;
    allowedMimes?: string[];
    maxBytes?: number;
    maxChars?: number;
    maxRedirects?: number;
    timeoutMs?: number;
    pdf?: {
        maxPages?: number;
        maxPixels?: number;
        minTextChars?: number;
    };
};
/** Resolved input_image limits with normalized MIME allowlist and URL fetch controls. */
export type InputImageLimits = {
    allowUrl: boolean;
    urlAllowlist?: string[];
    allowedMimes: Set<string>;
    maxBytes: number;
    maxRedirects: number;
    timeoutMs: number;
};
/** Supported input_image source variants before base64 decoding or guarded URL fetch. */
export type InputImageSource = {
    type: "base64";
    data: string;
    mediaType?: string;
} | {
    type: "url";
    url: string;
    mediaType?: string;
};
/** Supported input_file source variants before text/PDF extraction. */
type InputFileSource = {
    type: "base64";
    data: string;
    mediaType?: string;
    filename?: string;
} | {
    type: "url";
    url: string;
    mediaType?: string;
    filename?: string;
};
/** Guarded URL fetch result before final MIME allowlist validation. */
type InputFetchResult = {
    buffer: Buffer;
    mimeType: string;
    contentType?: string;
};
/** Default MIME allowlist for input_image sources. */
export declare const DEFAULT_INPUT_IMAGE_MIMES: string[];
/** Default MIME allowlist for input_file text/PDF extraction. */
export declare const DEFAULT_INPUT_FILE_MIMES: string[];
/** Default decoded-byte cap for input_image payloads. */
export declare const DEFAULT_INPUT_IMAGE_MAX_BYTES: number;
/** Default decoded-byte cap for input_file payloads. */
export declare const DEFAULT_INPUT_FILE_MAX_BYTES: number;
/** Default maximum model-visible characters emitted from input_file text. */
export declare const DEFAULT_INPUT_FILE_MAX_CHARS = 60000;
/** Default redirect cap for guarded input source URL fetches. */
export declare const DEFAULT_INPUT_MAX_REDIRECTS = 3;
/** Default timeout for guarded input source URL fetches. */
export declare const DEFAULT_INPUT_TIMEOUT_MS = 10000;
/** Default PDF page cap for input_file extraction. */
export declare const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
/** Default PDF raster pixel cap for extracted input_file images. */
export declare const DEFAULT_INPUT_PDF_MAX_PIXELS = 4000000;
/** Default text threshold before PDF extraction keeps text-only output. */
export declare const DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
/** Normalizes a MIME value by stripping parameters and lowercasing the media type. */
export declare function normalizeMimeType(value: string | undefined): string | undefined;
/** Parses a Content-Type header into normalized MIME and optional charset values. */
export declare function parseContentType(value: string | undefined): {
    mimeType?: string;
    charset?: string;
};
/** Converts configured MIME lists into a normalized allowlist, using fallback defaults when empty. */
export declare function normalizeMimeList(values: string[] | undefined, fallback: string[]): Set<string>;
/** Resolves input_file extraction limits from partial config and stable defaults. */
export declare function resolveInputFileLimits(config?: InputFileLimitsConfig): InputFileLimits;
/** Fetches an input source URL through SSRF, redirect, timeout, and byte-limit guards. */
export declare function fetchWithGuard(params: {
    url: string;
    maxBytes: number;
    timeoutMs: number;
    maxRedirects: number;
    policy?: SsrFPolicy;
    auditContext?: string;
}): Promise<InputFetchResult>;
/** Extracts and normalizes an input_image source from base64 or guarded URL input. */
export declare function extractImageContentFromSource(source: InputImageSource, limits: InputImageLimits): Promise<InputImageContent>;
/** Extracts model-visible text and images from an input_file source after MIME validation. */
export declare function extractFileContentFromSource(params: {
    source: InputFileSource;
    limits: InputFileLimits;
    config?: OpenClawConfig;
}): Promise<InputFileExtractResult>;
export {};
