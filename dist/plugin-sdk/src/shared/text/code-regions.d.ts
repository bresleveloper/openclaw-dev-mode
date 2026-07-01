export interface CodeRegion {
    start: number;
    end: number;
}
/** Finds fenced and inline Markdown code regions so text sanitizers can avoid examples. */
export declare function findCodeRegions(text: string): CodeRegion[];
/** Returns true when a character offset falls inside one of the discovered code regions. */
export declare function isInsideCode(pos: number, regions: CodeRegion[]): boolean;
