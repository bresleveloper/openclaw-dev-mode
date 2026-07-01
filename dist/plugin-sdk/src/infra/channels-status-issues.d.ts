import type { ChannelStatusIssue } from "../channels/plugins/types.public.js";
/** Collects generic and plugin-specific issues from a channels status payload. */
export declare function collectChannelStatusIssues(payload: Record<string, unknown>): ChannelStatusIssue[];
