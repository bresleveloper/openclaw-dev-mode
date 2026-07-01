type AnthropicAuthModel = {
    provider?: string;
    authHeader?: boolean;
    headers?: Record<string, string>;
};
export declare function usesFoundryBearerAuth(model: AnthropicAuthModel): boolean;
export declare function omitFoundryBearerCredentialHeaders(headers?: Record<string, string>): Record<string, string> | undefined;
export {};
