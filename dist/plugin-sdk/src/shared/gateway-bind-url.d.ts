export type GatewayBindUrlResult = {
    url: string;
    source: "gateway.bind=custom" | "gateway.bind=tailnet" | "gateway.bind=lan";
} | {
    error: string;
} | null;
/** Resolves the externally advertised gateway URL for non-loopback bind modes. */
export declare function resolveGatewayBindUrl(params: {
    bind?: string;
    customBindHost?: string;
    scheme: "ws" | "wss";
    port: number;
    pickTailnetHost: () => string | null;
    pickLanHost: () => string | null;
}): GatewayBindUrlResult;
