/** Run cleanup and swallow failures after invoking the optional error hook. */
export declare function runBestEffortCleanup<T>(params: {
    cleanup: () => Promise<T>;
    onError?: (error: unknown) => void;
}): Promise<T | undefined>;
