type AllowedValuesSummary = {
    values: string[];
    hiddenCount: number;
    formatted: string;
};
/** Summarizes enum/allowed-value candidates for compact validation error hints. */
export declare function summarizeAllowedValues(values: ReadonlyArray<unknown>): AllowedValuesSummary | null;
/** Appends an allowed-values hint unless the validation message already includes one. */
export declare function appendAllowedValuesHint(message: string, summary: AllowedValuesSummary): string;
export {};
