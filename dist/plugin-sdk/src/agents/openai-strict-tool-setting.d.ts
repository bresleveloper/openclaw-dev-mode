type OpenAITransportKind = "stream" | "websocket";
type OpenAIStrictToolModel = {
    provider?: unknown;
    api?: unknown;
    baseUrl?: unknown;
    id?: unknown;
    compat?: unknown;
};
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
export declare function resolveOpenAIStrictToolSetting(model: OpenAIStrictToolModel, options?: {
    transport?: OpenAITransportKind;
    supportsStrictMode?: boolean;
}): boolean | undefined;
export {};
