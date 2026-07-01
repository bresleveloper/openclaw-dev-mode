import http2 from "node:http2";
import type { ManagedProxyTlsOptions } from "./net/proxy/proxy-tls.js";
export declare const APNS_HTTP2_CANCEL_CODE: number;
export declare const APNS_RESPONSE_BODY_MAX_BYTES = 8192;
export type ApnsResponseBodyCapture = {
    text: string;
    bytes: number;
    truncated: boolean;
};
/** Parameters for opening an APNs HTTP/2 client session. */
export type ConnectApnsHttp2SessionParams = {
    authority: string;
    timeoutMs: number;
};
/** Parameters for validating APNs reachability through an explicit proxy. */
export type ProbeApnsHttp2ReachabilityViaProxyParams = {
    authority: string;
    proxyUrl: string;
    proxyTls?: ManagedProxyTlsOptions;
    timeoutMs: number;
};
/** APNs probe response used to prove a proxy tunneled to Apple. */
export type ProbeApnsHttp2ReachabilityViaProxyResult = {
    status: number;
    body: string;
    /** Raw response headers from APNs. Includes apns-id when the connection was truly tunneled to Apple. */
    responseHeaders: Record<string, string>;
};
/** Connects to APNs directly, or through the active managed proxy when present. */
export declare function connectApnsHttp2Session(params: ConnectApnsHttp2SessionParams): Promise<http2.ClientHttp2Session>;
export declare function createApnsResponseBodyCapture(): ApnsResponseBodyCapture;
export declare function appendApnsResponseBodyCapture(capture: ApnsResponseBodyCapture, chunk: unknown, maxBytes?: number): void;
/** Sends an intentionally invalid APNs push through a proxy to prove HTTP/2 reachability. */
export declare function probeApnsHttp2ReachabilityViaProxy(params: ProbeApnsHttp2ReachabilityViaProxyParams): Promise<ProbeApnsHttp2ReachabilityViaProxyResult>;
