import type { IncomingMessage } from "node:http";
export { authorizeOpenAiCompatibleHttpModelOverride, authorizeGatewayHttpRequestOrReply, authorizeScopedGatewayHttpRequestOrReply, checkGatewayHttpRequestAuth, getBearerToken, getHeader, isGatewayBearerHttpRequest, resolveHttpBrowserOriginPolicy, resolveHttpSenderIsOwner, resolveOpenAiCompatibleHttpOperatorScopes, resolveOpenAiCompatibleHttpSenderIsOwner, resolveSharedSecretHttpOperatorScopes, resolveTrustedHttpOperatorScopes, type AuthorizedGatewayHttpRequest, type GatewayHttpRequestAuthCheckResult, } from "./http-auth-utils.js";
export declare const OPENCLAW_MODEL_ID = "openclaw";
/** Default OpenAI-compatible model alias that targets the default OpenClaw agent. */
export declare const OPENCLAW_DEFAULT_MODEL_ID = "openclaw/default";
export declare class UnknownGatewayAgentError extends Error {
    readonly agentId: string;
    constructor(agentId: string);
}
export declare class GatewaySessionKeyOverrideError extends Error {
    constructor();
}
export declare function isUnknownGatewayAgentError(err: unknown): err is UnknownGatewayAgentError;
export declare function isGatewaySessionKeyOverrideError(err: unknown): err is GatewaySessionKeyOverrideError;
/** Resolves the target agent encoded by an OpenAI-compatible model id. */
export declare function resolveAgentIdFromModel(model: string | undefined, cfg?: import("../config/types.openclaw.ts").OpenClawConfig): string | undefined;
/** Validates and resolves the `x-openclaw-model` override for OpenAI-compatible requests. */
export declare function resolveOpenAiCompatModelOverride(params: {
    req: IncomingMessage;
    agentId: string;
    model: string | undefined;
}): Promise<{
    modelOverride?: string;
    errorMessage?: string;
}>;
/** Resolves the request agent from headers, model alias, or the configured default. */
export declare function resolveAgentIdForRequest(params: {
    req: IncomingMessage;
    model: string | undefined;
}): string;
/** Resolves gateway agent/session/channel context for OpenAI-compatible handlers. */
export declare function resolveGatewayRequestContext(params: {
    req: IncomingMessage;
    model: string | undefined;
    user?: string | undefined;
    sessionPrefix: string;
    defaultMessageChannel: string;
    useMessageChannelHeader?: boolean;
}): {
    agentId: string;
    sessionKey: string;
    messageChannel: string;
};
