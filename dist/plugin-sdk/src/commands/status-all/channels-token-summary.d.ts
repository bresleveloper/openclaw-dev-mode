import type { ChannelAccountSnapshot } from "../../channels/plugins/types.public.js";
export type ChannelAccountTokenSummaryRow = {
    account: unknown;
    enabled: boolean;
    snapshot: ChannelAccountSnapshot;
};
/** Returns the credential status sentence for enabled channel accounts, if the plugin exposes token fields. */
export declare function summarizeTokenConfig(params: {
    accounts: ChannelAccountTokenSummaryRow[];
    showSecrets: boolean;
}): {
    state: "ok" | "setup" | "warn" | null;
    detail: string | null;
};
