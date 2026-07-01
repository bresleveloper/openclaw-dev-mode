type FinalTagMatch = {
    index: number;
    text: string;
    isClose: boolean;
    isSelfClosing: boolean;
};
/** Finds valid `<final>` control tags so callers can strip only actual model markers. */
export declare function findFinalTagMatches(text: string): FinalTagMatch[];
/** Removes valid `<final>` tags while preserving their enclosed visible answer text. */
export declare function stripFinalTags(text: string): string;
export {};
