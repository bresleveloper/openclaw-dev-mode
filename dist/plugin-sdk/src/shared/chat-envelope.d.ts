/** Removes recognized channel/timestamp prefixes while preserving user-authored bracket text. */
export declare function stripEnvelope(text: string): string;
/** Removes standalone message-id hint lines without touching inline user mentions. */
export declare function stripMessageIdHints(text: string): string;
