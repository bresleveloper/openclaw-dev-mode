import { Container } from "@earendil-works/pi-tui";
import { HyperlinkMarkdown } from "./hyperlink-markdown.js";
type MarkdownOptions = ConstructorParameters<typeof HyperlinkMarkdown>[4];
/** Container-backed markdown message that can update text in place. */
export declare class MarkdownMessageComponent extends Container {
    private body;
    constructor(text: string, y: number, options?: MarkdownOptions);
    /** Updates the rendered markdown without replacing the component. */
    setText(text: string): void;
}
export {};
