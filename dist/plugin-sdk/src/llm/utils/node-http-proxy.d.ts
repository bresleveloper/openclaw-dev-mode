import type { Agent as HttpAgent } from "node:http";
import type { Agent as HttpsAgent } from "node:https";
import { UNSUPPORTED_PROXY_PROTOCOL_MESSAGE } from "../../infra/net/node-proxy-agent.js";
/** HTTP(S) agent pair for Node fetch/client integrations that accept explicit agents. */
export interface NodeHttpProxyAgents {
    httpAgent: HttpAgent;
    httpsAgent: HttpsAgent;
}
export { UNSUPPORTED_PROXY_PROTOCOL_MESSAGE };
/** Resolves the environment proxy URL that applies to a target URL. */
export declare function resolveHttpProxyUrlForTarget(targetUrl: string | URL): URL | undefined;
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
export declare function createHttpProxyAgentsForTarget(targetUrl: string | URL): NodeHttpProxyAgents | undefined;
