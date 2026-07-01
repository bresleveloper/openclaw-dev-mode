import { Agent } from "node:http";

//#region src/infra/net/node-proxy-agent.d.ts
type NodeProxyProtocol = "http" | "https";
/** Selects either ambient env proxy resolution or a caller-supplied fixed proxy URL. */
type CreateNodeProxyAgentOptions = {
  mode: "env";
  targetUrl: string | URL;
  protocol?: NodeProxyProtocol;
} | {
  mode: "explicit";
  proxyUrl: string | URL;
  protocol?: NodeProxyProtocol;
};
/** Creates a Node HTTP(S) agent for explicit proxy URLs; unsupported protocols throw. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "explicit";
}>): Agent;
/** Creates a Node HTTP(S) agent from env proxy settings, or undefined when bypassed. */
declare function createNodeProxyAgent(options: Extract<CreateNodeProxyAgentOptions, {
  mode: "env";
}>): Agent | undefined;
//#endregion
export { createNodeProxyAgent as n, CreateNodeProxyAgentOptions as t };