import { a as normalizeWhitespace, i as markdownToText, n as extractBasicHtmlContent, r as htmlToMarkdown } from "./web-fetch-utils-Cx-FHkJu.js";

//#region src/plugins/web-content-extractor-types.d.ts
/** Web content extraction mode requested from extractor plugins. */
type WebContentExtractMode = "markdown" | "text";
/** Request passed to a web content extractor plugin. */
type WebContentExtractionRequest = {
  html: string;
  url: string;
  extractMode: WebContentExtractMode;
};
/** Result returned by a web content extractor plugin. */
type WebContentExtractionResult = {
  text: string;
  title?: string;
};
/** Web content extractor plugin contract. */
type WebContentExtractorPlugin = {
  id: string;
  label: string;
  autoDetectOrder?: number;
  extract: (request: WebContentExtractionRequest) => Promise<WebContentExtractionResult | null>;
};
//#endregion
//#region src/agents/tools/web-fetch-visibility.d.ts
declare function sanitizeHtml(html: string): Promise<string>;
declare function stripInvisibleUnicode(text: string): string;
//#endregion
export { type WebContentExtractMode, type WebContentExtractionRequest, type WebContentExtractionResult, type WebContentExtractorPlugin, extractBasicHtmlContent, htmlToMarkdown, markdownToText, normalizeWhitespace, sanitizeHtml, stripInvisibleUnicode };