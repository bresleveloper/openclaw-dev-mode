/** Removes terminal device-status-report cursor requests and counts them. */
export declare function stripDsrRequests(input: string): {
    cleaned: string;
    requests: number;
};
/** Builds a terminal cursor-position response for intercepted DSR requests. */
export declare function buildCursorPositionResponse(row?: number, col?: number): string;
