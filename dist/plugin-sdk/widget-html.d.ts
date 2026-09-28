//#region src/plugin-sdk/widget-html.d.ts
/** Public static assets available to widget documents; never a connect-src grant. */
export declare const WIDGET_CDN_ORIGINS: readonly string[];
/** Input error surfaced by tools that accept agent-supplied widget HTML. */
export declare class WidgetHtmlInputError extends Error {
  constructor(message: string);
}
/** Returns true when HTML already contains its own document shell. */
export declare function isCompleteHtmlDocument(html: string): boolean;
/** Enforces a widget HTML size limit while preserving the caller's input label and unit. */
export declare function assertWidgetHtmlSize(html: string, maxSize: number, options?: {
  inputName?: string;
  unit?: "bytes" | "characters";
}): void;
//#endregion