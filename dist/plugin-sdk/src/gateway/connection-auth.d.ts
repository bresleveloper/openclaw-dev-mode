import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { resolveGatewayCredentialsFromConfig } from "./credentials.js";
type GatewayCredentialConfigOptions = Parameters<typeof resolveGatewayCredentialsFromConfig>[0];
/** Connection auth options accepted by gateway clients that already loaded config. */
export type GatewayConnectionAuthOptions = Omit<GatewayCredentialConfigOptions, "cfg"> & {
    config: OpenClawConfig;
};
/** Resolves gateway connection credentials, including configured SecretRef inputs. */
export declare function resolveGatewayConnectionAuth(params: GatewayConnectionAuthOptions): Promise<{
    token?: string;
    password?: string;
}>;
export {};
