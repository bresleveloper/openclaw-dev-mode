import type { RenderTableOptions, TableColumn } from "../../../packages/terminal-core/src/table.js";
import type { StatusReportSection } from "./text-report.js";
type TableRenderer = (input: RenderTableOptions) => string;
/** Builds the top-level status overview table section. */
export declare function buildStatusOverviewSection(params: {
    width: number;
    renderTable: TableRenderer;
    rows: Array<{
        Item: string;
        Value: string;
    }>;
}): StatusReportSection;
/** Builds the channel summary section with gateway issue overlays. */
export declare function buildStatusChannelsSection(params: {
    width: number;
    renderTable: TableRenderer;
    rows: Array<{
        id: string;
        label: string;
        enabled: boolean;
        state: "ok" | "warn" | "off" | "setup";
        detail: string;
    }>;
    channelIssues: Array<{
        channel: string;
        message: string;
    }>;
    ok: (text: string) => string;
    warn: (text: string) => string;
    muted: (text: string) => string;
    accentDim: (text: string) => string;
    formatIssueMessage?: (message: string) => string;
}): StatusReportSection;
/** Wraps preformatted channel rows into a status report section. */
export declare function buildStatusChannelsTableSection(params: {
    width: number;
    renderTable: TableRenderer;
    columns: readonly TableColumn[];
    rows: Array<Record<string, string>>;
}): StatusReportSection;
/** Builds one account-detail section per configured channel. */
export declare function buildStatusChannelDetailsSections(params: {
    details: Array<{
        title: string;
        columns: string[];
        rows: Array<Record<string, string>>;
    }>;
    width: number;
    renderTable: TableRenderer;
    ok: (text: string) => string;
    warn: (text: string) => string;
}): StatusReportSection[];
/** Builds the agent sessions/bootstrap summary table section. */
export declare function buildStatusAgentsSection(params: {
    width: number;
    renderTable: TableRenderer;
    agentStatus: {
        agents: Array<{
            id: string;
            name?: string | null;
            bootstrapPending?: boolean | null;
            sessionsCount: number;
            lastActiveAgeMs?: number | null;
            sessionsPath: string;
        }>;
    };
    ok: (text: string) => string;
    warn: (text: string) => string;
}): StatusReportSection;
/** Builds the session table section used by status variants that include recent sessions. */
export declare function buildStatusSessionsSection(params: {
    width: number;
    renderTable: TableRenderer;
    columns: readonly TableColumn[];
    rows: Array<Record<string, string>>;
}): StatusReportSection;
/** Builds the optional system-events section, skipped when no rows are present. */
export declare function buildStatusSystemEventsSection(params: {
    width: number;
    renderTable: TableRenderer;
    rows?: Array<Record<string, string>>;
    trailer?: string | null;
}): StatusReportSection;
/** Builds the optional health table section. */
export declare function buildStatusHealthSection(params: {
    width: number;
    renderTable: TableRenderer;
    columns?: readonly TableColumn[];
    rows?: Array<Record<string, string>>;
}): StatusReportSection;
/** Builds the optional usage text section. */
export declare function buildStatusUsageSection(params: {
    usageLines?: string[];
}): StatusReportSection;
export {};
