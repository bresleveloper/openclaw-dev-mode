/** Parses tar verbose metadata into type and byte size entries. */
export declare function parseTarVerboseMetadata(stdout: string): Array<{
    type: string;
    size: number;
}>;
