/** Installs deterministic DNS pinning hooks for audio provider tests. */
export declare function installPinnedHostnameTestHooks(): void;
/** Creates a fetch mock that records the outbound Authorization header. */
export declare function createAuthCaptureJsonFetch(responseBody: unknown): {
    fetchFn: ((_input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) & {
        preconnect: (url: string | URL, options?: {
            dns?: boolean;
            tcp?: boolean;
            http?: boolean;
            https?: boolean;
        }) => void;
        __openclawAcceptsDispatcher: true;
    };
    getAuthHeader: () => string | null;
};
/** Creates a fetch mock that records the outbound URL and init payload. */
export declare function createRequestCaptureJsonFetch(responseBody: unknown): {
    fetchFn: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) & {
        preconnect: (url: string | URL, options?: {
            dns?: boolean;
            tcp?: boolean;
            http?: boolean;
            https?: boolean;
        }) => void;
        __openclawAcceptsDispatcher: true;
    };
    getRequest: () => {
        url: string | null;
        init: RequestInit | undefined;
    };
};
