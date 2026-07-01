/** Options for choosing the unit used by bare numeric duration values. */
export type DurationMsParseOptions = {
    defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
export declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
