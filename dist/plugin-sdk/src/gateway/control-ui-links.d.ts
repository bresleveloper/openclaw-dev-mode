/** Resolve the advertised HTTP and websocket URLs for the Control UI. */
export declare function resolveControlUiLinks(params: {
    port: number;
    bind?: "auto" | "lan" | "loopback" | "custom" | "tailnet";
    customBindHost?: string;
    basePath?: string;
    tlsEnabled?: boolean;
}): {
    httpUrl: string;
    wsUrl: string;
};
