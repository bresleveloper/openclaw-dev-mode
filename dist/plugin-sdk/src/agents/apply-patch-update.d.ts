type UpdateFileChunk = {
    changeContext?: string;
    oldLines: string[];
    newLines: string[];
    isEndOfFile: boolean;
};
/** Apply parsed update chunks to one file and return the new file contents. */
export declare function applyUpdateHunk(filePath: string, chunks: UpdateFileChunk[], options?: {
    readFile?: (filePath: string) => Promise<string>;
}): Promise<string>;
export {};
