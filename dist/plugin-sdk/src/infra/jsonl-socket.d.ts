/**
 * Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
 */
declare function resolveJsonlSocketTimeoutMs(timeoutMs: number): number;
export declare function requestJsonlSocket<T>(params: {
    socketPath: string;
    requestLine: string;
    timeoutMs: number;
    accept: (msg: unknown) => T | null | undefined;
}): Promise<T | null>;
export declare const testApi: {
    resolveJsonlSocketTimeoutMs: typeof resolveJsonlSocketTimeoutMs;
};
export { testApi as __test__ };
