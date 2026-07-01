import type { GatewayStatusSummary } from "./tui-types.js";
/** Formats Gateway/session health into compact status lines for the TUI. */
export declare function formatStatusSummary(summary: GatewayStatusSummary): string[];
