type HostSource = string | null | undefined;
/** Inputs used to infer the externally reachable plugin surface URL. */
export type HostedPluginSurfaceUrlParams = {
    port?: number;
    hostOverride?: HostSource;
    forwardedHost?: HostSource | HostSource[];
    requestHost?: HostSource;
    forwardedProto?: HostSource | HostSource[];
    localAddress?: HostSource;
    scheme?: "http" | "https";
};
/** Resolve the URL that plugins should advertise for hosted node surfaces. */
export declare function resolveHostedPluginSurfaceUrl(params: HostedPluginSurfaceUrlParams): string | undefined;
export {};
