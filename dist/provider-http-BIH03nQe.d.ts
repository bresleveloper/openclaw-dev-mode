import { ES as ProviderRequestTransport, TS as ProviderRequestCapability } from "./config-contracts-hzlacViZ.js";
import "./types.openclaw-D8uW-XQA.js";
import { f as ModelRequestHeaders } from "./types-B1zI2CfC.js";
import { t as ModelProviderRequestTransportOverrides } from "./provider-request-config.types-BDimJcpZ.js";
import { _ as PinnedDispatcherPolicy } from "./web-media-B8Te5SZ2.js";
import "./image-runtime-CA1hAb1m.js";
import "./websocket-D7KFeEfD.js";
import "./provider-context-BvC7EnIY.js";
import "./provider-auth-helpers-D1yG5izX.js";
import "./provider-credential-values-CtEhgdpI.js";
import "./provider-network-policy-Bx8BOjVw.js";
type ResolvedProviderHttpRequestConfig = {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
type ResolvedProviderHttpRequestConfigWithOriginTrust = ResolvedProviderHttpRequestConfig & {
  trustConfiguredBaseUrlOrigin: boolean;
};
declare function resolveProviderHttpRequestConfigWithOriginTrust(params: {
  baseUrl?: string;
  defaultBaseUrl: string;
  allowPrivateNetwork?: boolean;
  headers?: HeadersInit | ModelRequestHeaders;
  defaultHeaders?: ModelRequestHeaders;
  request?: ModelProviderRequestTransportOverrides;
  provider?: string;
  api?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
}): ResolvedProviderHttpRequestConfigWithOriginTrust;
declare function resolveProviderHttpRequestConfig(params: Parameters<typeof resolveProviderHttpRequestConfigWithOriginTrust>[0]): ResolvedProviderHttpRequestConfig;
export { resolveProviderHttpRequestConfig as t };