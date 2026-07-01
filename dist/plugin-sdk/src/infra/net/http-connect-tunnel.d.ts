import * as tls from "node:tls";
import type { ManagedProxyTlsOptions } from "./proxy/proxy-tls.js";
/** Parameters for opening an APNs HTTP/2 tunnel through an HTTP(S) forward proxy. */
export type HttpConnectTunnelParams = {
    proxyUrl: URL;
    proxyTls?: ManagedProxyTlsOptions;
    targetHost: string;
    targetPort: number;
    timeoutMs?: number;
};
/** Opens a TLS-over-CONNECT tunnel and verifies the target negotiated HTTP/2. */
export declare function openHttpConnectTunnel(params: HttpConnectTunnelParams): Promise<tls.TLSSocket>;
