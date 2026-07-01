export type ConfigObserveSuspiciousBaseline = {
    bytes: number;
    hasMeta: boolean;
    gatewayMode: string | null;
};
export declare function resolveConfigObserveSuspiciousReasons(params: {
    bytes: number;
    hasMeta: boolean;
    gatewayMode: string | null;
    parsed: unknown;
    lastKnownGood?: ConfigObserveSuspiciousBaseline;
}): string[];
