import type { EffectiveToolInventoryResult } from "../agents/tools-effective-inventory.types.js";
export { buildCommandsMessage, buildCommandsMessagePaginated, buildHelpMessage, type CommandsMessageOptions, type CommandsMessageResult, } from "./command-status-builders.js";
export { buildStatusMessage, formatContextUsageShort, type StatusArgs, } from "../status/status-message.js";
export { formatTokenCount } from "../utils/usage-format.js";
/** Formats the effective tool inventory shown by /tools. */
export declare function buildToolsMessage(result: EffectiveToolInventoryResult, options?: {
    verbose?: boolean;
}): string;
