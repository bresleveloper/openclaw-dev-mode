type CanvasSurface = "assistant_message";
type CanvasPreview = {
    kind: "canvas";
    surface: CanvasSurface;
    render: "url";
    title?: string;
    preferredHeight?: number;
    url?: string;
    viewId?: string;
    className?: string;
    style?: string;
};
/** Extracts a canvas preview from a JSON-shaped tool or assistant payload. */
export declare function extractCanvasFromText(outputText: string | undefined, _toolName?: string): CanvasPreview | undefined;
/** Extracts [embed ...] shortcodes outside code fences and returns stripped text. */
export declare function extractCanvasShortcodes(text: string | undefined): {
    text: string;
    previews: CanvasPreview[];
};
export {};
