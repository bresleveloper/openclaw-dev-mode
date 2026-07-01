import tls from "node:tls";
import type { GatewayTlsConfig } from "../../config/types.gateway.js";
export type GatewayTlsRuntime = {
    enabled: boolean;
    required: boolean;
    certPath?: string;
    keyPath?: string;
    caPath?: string;
    fingerprintSha256?: string;
    tlsOptions?: tls.TlsOptions;
    error?: string;
};
/** Load or generate gateway TLS material and return server-ready TLS options. */
export declare function loadGatewayTlsRuntime(cfg: GatewayTlsConfig | undefined, log?: {
    info?: (msg: string) => void;
    warn?: (msg: string) => void;
}): Promise<GatewayTlsRuntime>;
