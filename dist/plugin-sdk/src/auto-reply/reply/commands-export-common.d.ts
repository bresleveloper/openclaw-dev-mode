import type { SessionEntry } from "../../config/sessions/types.js";
import type { ReplyPayload } from "../types.js";
import type { HandleCommandsParams } from "./commands-types.js";
/** Resolved session entry and transcript file targeted by an export command. */
interface ExportCommandSessionTarget {
    entry: SessionEntry;
    sessionFile: string;
}
/** Parses an optional non-flag output path from export command text. */
export declare function parseExportCommandOutputPath(commandBodyNormalized: string, aliases: readonly string[]): {
    outputPath?: string;
    error?: string;
};
/** Resolves the session store entry and transcript file for an export command. */
export declare function resolveExportCommandSessionTarget(params: HandleCommandsParams): ExportCommandSessionTarget | ReplyPayload;
/** Distinguishes command error replies from successful export session targets. */
export declare function isReplyPayload(value: ExportCommandSessionTarget | ReplyPayload): value is ReplyPayload;
export {};
