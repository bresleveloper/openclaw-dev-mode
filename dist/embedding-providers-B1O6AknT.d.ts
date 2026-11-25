import "./config-contracts-hzlacViZ.js";
import "./types.openclaw-D8uW-XQA.js";
import "./usage-cost-B-pDV9kv.js";
import "./registry-contribution-types-2o1L1H_Q.js";
import { y as SsrFPolicy } from "./web-media-B8Te5SZ2.js";
import "./embedding-provider-runtime-types-CuJxbTgC.js";
import "./provider-network-policy-Bx8BOjVw.js";
/** Resolve current credentials for one request, or refresh after an expired-token rejection. */
type RemoteEmbeddingRequestAuth = (params: {
  forceRefresh: boolean;
  signal?: AbortSignal;
}) => Promise<Record<string, string>>;
/** HTTP client details required by a remote embedding provider. */
type RemoteEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  resolveRequestHeaders?: RemoteEmbeddingRequestAuth;
  model: string;
};
export { RemoteEmbeddingClient as t };