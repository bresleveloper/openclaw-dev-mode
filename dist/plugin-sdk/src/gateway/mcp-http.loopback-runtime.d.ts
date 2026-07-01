type McpLoopbackRuntime = {
    port: number;
    ownerToken: string;
    nonOwnerToken: string;
};
export type McpLoopbackToolCallResult = {
    toolName: string;
    args: Record<string, unknown>;
    result?: unknown;
    isError: boolean;
};
export type McpLoopbackToolCallStart = Pick<McpLoopbackToolCallResult, "toolName" | "args">;
type McpLoopbackToolCallCapture = {
    generation: number;
    onYield?: (message: string) => Promise<void> | void;
    onRequestStart?: () => void;
    onRequestClassified?: () => void;
    onRequestFinish?: () => void;
    onToolCallStart?: (call: McpLoopbackToolCallStart) => void;
    onToolCallUpdate?: (calls: {
        previous: McpLoopbackToolCallStart;
        current: McpLoopbackToolCallStart;
    }) => void;
    onToolCallFinish?: (call: McpLoopbackToolCallStart, state: {
        prepared: boolean;
    }) => void;
    onToolCallResult: (call: McpLoopbackToolCallResult) => void;
    inFlight: number;
    activityVersion: number;
    activityWaiters: Set<() => void>;
};
export type McpLoopbackRequestCaptureHandle = {
    capture: McpLoopbackToolCallCapture;
    classified: boolean;
    finished: boolean;
};
export type McpLoopbackToolCallCaptureHandle = {
    capture: McpLoopbackToolCallCapture;
    call: McpLoopbackToolCallStart;
    prepared: boolean;
    finished: boolean;
};
/** Start loopback tool-call result capture for one serialized CLI invocation. */
export declare function beginMcpLoopbackToolCallCapture(params: {
    captureKey: string;
    onYield?: (message: string) => Promise<void> | void;
    onRequestStart?: () => void;
    onRequestClassified?: () => void;
    onRequestFinish?: () => void;
    onToolCallStart?: (call: McpLoopbackToolCallStart) => void;
    onToolCallUpdate?: (calls: {
        previous: McpLoopbackToolCallStart;
        current: McpLoopbackToolCallStart;
    }) => void;
    onToolCallFinish?: (call: McpLoopbackToolCallStart, state: {
        prepared: boolean;
    }) => void;
    onToolCallResult: (call: McpLoopbackToolCallResult) => void;
}): void;
/** Resolve yield state bound to the request's admitted CLI capture generation. */
export declare function resolveMcpLoopbackYieldContext(captureHandle: McpLoopbackRequestCaptureHandle | undefined): {
    cacheKey: string;
    onYield: (message: string) => Promise<void>;
} | undefined;
/** Bind an authenticated HTTP request to the active capture generation before reading its body. */
export declare function markMcpLoopbackRequestStarted(captureKey: string | undefined): McpLoopbackRequestCaptureHandle | undefined;
/** Mark a request body as parsed so it no longer represents an unknown possible send. */
export declare function markMcpLoopbackRequestClassified(captureHandle: McpLoopbackRequestCaptureHandle | undefined): void;
/** Mark an authenticated request as settled and wake capture drains. */
export declare function markMcpLoopbackRequestFinished(captureHandle: McpLoopbackRequestCaptureHandle | undefined): void;
/** Mark a captured loopback tool call as in flight. */
export declare function markMcpLoopbackToolCallStarted(params: {
    captureKey?: string;
    requestCaptureHandle?: McpLoopbackRequestCaptureHandle;
    toolName: string;
    args: Record<string, unknown>;
}): McpLoopbackToolCallCaptureHandle | undefined;
/** Update an admitted call with the final arguments produced by gateway hooks. */
export declare function updateMcpLoopbackToolCallCapture(captureHandle: McpLoopbackToolCallCaptureHandle | undefined, call: McpLoopbackToolCallStart): void;
/** Report a completed call without letting observer failures alter tool execution. */
export declare function recordMcpLoopbackToolCallResult(params: {
    captureHandle: McpLoopbackToolCallCaptureHandle;
    toolName: string;
    args: Record<string, unknown>;
    result?: unknown;
    isError: boolean;
}): void;
/** Mark a captured loopback tool call as settled and wake idle drains. */
export declare function markMcpLoopbackToolCallFinished(captureHandle: McpLoopbackToolCallCaptureHandle | undefined): void;
/** Wait for admitted calls to settle and for a quiet request-admission grace. */
export declare function waitForMcpLoopbackToolCallCaptureIdle(captureKey: string, options: {
    timeoutMs: number;
    admissionGraceMs: number;
}): Promise<boolean>;
/** Clear an unfinished invocation capture. Attempt keys are unique per CLI execution. */
export declare function clearMcpLoopbackToolCallCapture(captureKey: string): void;
/** Clear transient capture state between isolated tests. */
export declare function clearMcpLoopbackToolCallCapturesForTest(): void;
/** Return a copy of the active loopback runtime, if one has been installed. */
export declare function getActiveMcpLoopbackRuntime(): McpLoopbackRuntime | undefined;
/** Install the active loopback runtime used by in-process MCP callers. */
export declare function setActiveMcpLoopbackRuntime(runtime: McpLoopbackRuntime): void;
/** Choose the bearer token matching owner/non-owner caller identity. */
export declare function resolveMcpLoopbackBearerToken(runtime: McpLoopbackRuntime, senderIsOwner: boolean): string;
/** Clear loopback runtime only when the owning token matches the active runtime. */
export declare function clearActiveMcpLoopbackRuntimeByOwnerToken(ownerToken: string): void;
/** Build the MCP server config injected into agents for loopback tool access. */
export declare function createMcpLoopbackServerConfig(port: number): {
    mcpServers: {
        openclaw: {
            type: string;
            url: string;
            alwaysLoad: boolean;
            headers: {
                Authorization: string;
                "x-session-key": string;
                "x-openclaw-session-id": string;
                "x-openclaw-agent-id": string;
                "x-openclaw-account-id": string;
                "x-openclaw-message-channel": string;
                "x-openclaw-current-channel-id": string;
                "x-openclaw-current-thread-ts": string;
                "x-openclaw-current-message-id": string;
                "x-openclaw-current-inbound-audio": string;
                "x-openclaw-inbound-event-kind": string;
                "x-openclaw-source-reply-delivery-mode": string;
                "x-openclaw-require-explicit-message-target": string;
                "x-openclaw-cli-capture-key": string;
            };
        };
    };
};
export {};
