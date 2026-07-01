import type { ChannelAccountSnapshot, ChannelGatewayContext, OpenClawConfig, RuntimeEnv } from "../testing.js";
/** Creates a minimal ChannelGatewayContext with mutable status for startAccount tests. */
export declare function createStartAccountContext<TAccount extends {
    accountId: string;
}>(params: {
    account: TAccount;
    abortSignal?: AbortSignal;
    cfg?: OpenClawConfig;
    runtime?: RuntimeEnv;
    statusPatchSink?: (next: ChannelAccountSnapshot) => void;
}): ChannelGatewayContext<TAccount>;
