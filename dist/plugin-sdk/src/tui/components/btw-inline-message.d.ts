import { Container } from "@earendil-works/pi-tui";
type BtwInlineMessageParams = {
    question: string;
    text: string;
    isError?: boolean;
};
/** Renders a dismissible BTW result, with error text or assistant markdown content. */
export declare class BtwInlineMessage extends Container {
    constructor(params: BtwInlineMessageParams);
    /** Replaces the current BTW content without reallocating the host component. */
    setResult(params: BtwInlineMessageParams): void;
}
export {};
