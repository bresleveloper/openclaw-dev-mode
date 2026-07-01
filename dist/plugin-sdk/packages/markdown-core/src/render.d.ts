import type { MarkdownIR, MarkdownLinkSpan, MarkdownStyle, MarkdownStyleSpan } from "./ir.js";
/** Marker pair used to wrap a styled Markdown span in the target renderer. */
export type RenderStyleMarker = {
    open: string | ((span: MarkdownStyleSpan) => string);
    close: string;
};
/** Optional marker map; omitted styles are emitted as plain escaped text. */
export type RenderStyleMap = Partial<Record<MarkdownStyle, RenderStyleMarker>>;
/** Link wrapper boundaries after a renderer has accepted or rewritten a link span. */
export type RenderLink = {
    start: number;
    end: number;
    open: string;
    close: string;
};
/** Renderer hooks for converting Markdown IR into a marker-based target format. */
export type RenderOptions = {
    styleMarkers: RenderStyleMap;
    escapeText: (text: string) => string;
    buildLink?: (link: MarkdownLinkSpan, text: string) => RenderLink | null;
};
/** Renders Markdown IR by nesting configured style markers and optional link markers. */
export declare function renderMarkdownWithMarkers(ir: MarkdownIR, options: RenderOptions): string;
