//#region src/plugins/gateway-ingress.types.d.ts
/** A failure to admit remote Control UI transport through the host. */
type GatewayControlUiIngressErrorCode = "unsupported-auth" | "invalid-options" | "unavailable" | "closed" | "limit-exceeded" | "forbidden";
declare class GatewayControlUiIngressError extends Error {
  readonly code: GatewayControlUiIngressErrorCode;
  constructor(code: GatewayControlUiIngressErrorCode, message: string);
}
type GatewayIngressPrincipal = {
  kind: "owner";
} | {
  kind: "person";
  profileId: string;
};
/** The plugin owns consent, expiry, persistence, and revocation of this exact grant. */
type GatewayIngressPrincipalOptionsV1 = {
  audienceId: string;
  principal: GatewayIngressPrincipal;
  operatorScopeCeiling: readonly string[];
  signal: AbortSignal;
  assertCurrent: () => void;
};
type GatewayControlUiIngressPresentationOptionsV1 = {
  publicOrigin: string;
  sandboxOrigin: string;
  frameAncestors: readonly string[];
};
type GatewayControlUiIngressOpenOptionsV2 = GatewayIngressPrincipalOptionsV1 & GatewayControlUiIngressPresentationOptionsV1;
type GatewayIngressRequestOptionsV1 = {
  signal?: AbortSignal;
};
/** One live principal resolution shared by RPC and any Control UI transport it opens. */
interface GatewayIngressPrincipalBindingV1 {
  request<T = unknown>(method: string, params: Record<string, unknown>, options?: GatewayIngressRequestOptionsV1): Promise<T>;
  openControlUi(options: GatewayControlUiIngressPresentationOptionsV1): Promise<GatewayControlUiIngressV2>;
  close(): Promise<void>;
}
/** Versioned principal-bound ingress supplied by an admitted plugin service. */
interface GatewayControlUiIngressFactoryV2 {
  readonly capabilityVersion: 2;
  open(options: GatewayControlUiIngressOpenOptionsV2): Promise<GatewayControlUiIngressV2>;
  bindPrincipal(options: GatewayIngressPrincipalOptionsV1): Promise<GatewayIngressPrincipalBindingV1>;
}
type GatewayIngressMessage = {
  kind: "text";
  text: string;
} | {
  kind: "binary";
  bytes: Uint8Array;
};
interface GatewayIngressSocketV1 {
  send(message: GatewayIngressMessage): Promise<void>;
  readonly messages: AsyncIterable<GatewayIngressMessage>;
  readonly closed: Promise<{
    code: number;
    reason: string;
  }>;
  close(code?: number, reason?: string): void;
}
type GatewayControlUiIngressRequestV1 = {
  surface: "control-ui" | "sandbox";
  method: string;
  pathAndQuery: string;
  headers: readonly (readonly [string, string])[];
  body?: ReadableStream<Uint8Array>;
  signal: AbortSignal;
};
type GatewayControlUiIngressWebSocketRequestV1 = {
  pathAndQuery: string;
  /** Actual browser Origin, matched exactly against this handle's public origin. */
  origin: string;
  protocols: readonly string[];
  signal: AbortSignal;
};
/** Only core-issued signed read grants may be published as plugin cookies. */
interface GatewayPluginReadCookieV1 {
  name: string;
  value: string;
  path: string;
  maxAgeSeconds: number;
  kind: "native-assets" | "iframe-read";
}
interface GatewayControlUiIngressV2 {
  readonly presentation: {
    readonly basePath: string;
    readonly publicOrigin: string;
    readonly sandboxOrigin: string;
    readonly operatorScopeCeiling: readonly string[];
  };
  request(input: GatewayControlUiIngressRequestV1): Promise<{
    response: Response;
    pluginReadCookies: readonly GatewayPluginReadCookieV1[];
  }>;
  openWebSocket(input: GatewayControlUiIngressWebSocketRequestV1): Promise<{
    protocol?: string;
    socket: GatewayIngressSocketV1;
  }>;
  requestGateway: GatewayIngressPrincipalBindingV1["request"];
  /** Fence admission and abort transport; effect and publication guards reject stale work. */
  close(): Promise<void>;
}
//#endregion
export { GatewayControlUiIngressPresentationOptionsV1 as a, GatewayControlUiIngressWebSocketRequestV1 as c, GatewayIngressPrincipalBindingV1 as d, GatewayIngressPrincipalOptionsV1 as f, GatewayPluginReadCookieV1 as h, GatewayControlUiIngressOpenOptionsV2 as i, GatewayIngressMessage as l, GatewayIngressSocketV1 as m, GatewayControlUiIngressErrorCode as n, GatewayControlUiIngressRequestV1 as o, GatewayIngressRequestOptionsV1 as p, GatewayControlUiIngressFactoryV2 as r, GatewayControlUiIngressV2 as s, GatewayControlUiIngressError as t, GatewayIngressPrincipal as u };