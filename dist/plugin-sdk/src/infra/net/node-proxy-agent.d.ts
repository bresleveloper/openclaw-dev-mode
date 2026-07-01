import type { Agent as HttpAgent } from "node:http";
export declare const UNSUPPORTED_PROXY_PROTOCOL_MESSAGE = "Unsupported proxy protocol. SOCKS and PAC proxy URLs are not supported; use an HTTP or HTTPS proxy URL.";
type NodeProxyProtocol = "http" | "https";
/** Selects either ambient env proxy resolution or a caller-supplied fixed proxy URL. */
export type CreateNodeProxyAgentOptions = {
    mode: "env";
    targetUrl: string | URL;
    protocol?: NodeProxyProtocol;
} | {
    mode: "explicit";
    proxyUrl: string | URL;
    protocol?: NodeProxyProtocol;
};
/** Resolves the env proxy URL that should be used for a specific Node target. */
export declare function resolveEnvNodeProxyUrlForTarget(targetUrl: string | URL, env?: NodeJS.ProcessEnv): URL | undefined;
/** Creates a Node HTTP(S) agent for explicit proxy URLs; unsupported protocols throw. */
export declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
    mode: "explicit";
}>): HttpAgent;
/** Creates a Node HTTP(S) agent from env proxy settings, or undefined when bypassed. */
export declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
    mode: "env";
}>): HttpAgent | undefined;
/** Builds paired HTTP and HTTPS agents for libraries that require both slots. */
export declare function createFixedNodeProxyAgentPair(proxyUrl: string | URL): {
    httpAgent: HttpAgent;
    httpsAgent: HttpAgent;
};
export {};
