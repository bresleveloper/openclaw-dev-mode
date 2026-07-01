export type ConfiguredLocalOriginManagedProxyBypass = {
    kind: "configured-local-origin";
    baseUrl: string;
};
/** Return whether a configured local provider origin may bypass the managed proxy. */
export declare function shouldUseConfiguredLocalOriginManagedProxyBypass(params: {
    url: URL;
    managedProxyBypass: ConfiguredLocalOriginManagedProxyBypass | undefined;
    resolvedAddresses: readonly string[];
}): boolean;
