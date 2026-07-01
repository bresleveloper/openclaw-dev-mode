/** Parse an ISO-like session timestamp to milliseconds. */
export declare function parseSessionTimestampMs(value: unknown): number | undefined;
/** Parse a required timestamp or throw a labeled validation error. */
export declare function requireSessionTimestampMs(value: string, label: string): number;
