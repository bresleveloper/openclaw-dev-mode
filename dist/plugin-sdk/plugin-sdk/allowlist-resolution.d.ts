export type BasicAllowlistResolutionEntry = {
    input: string;
    resolved: boolean;
    id?: string;
    name?: string;
    note?: string;
};
export declare function mapBasicAllowlistResolutionEntries(entries: BasicAllowlistResolutionEntry[]): BasicAllowlistResolutionEntry[];
