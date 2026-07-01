/** Creates a human-readable unique session slug with numbered and random fallbacks. */
export declare function createSessionSlug(isTaken?: (id: string) => boolean): string;
