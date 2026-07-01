/** SQLite column codec for cron payload variants. */
import type { CronPayload } from "../types.js";
import type { CronJobInsert, CronJobRow } from "./schema.js";
/** Maps cron payload variants into normalized SQLite columns. */
export declare function bindPayloadColumns(payload: CronPayload): Pick<CronJobInsert, "payload_allow_unsafe_external_content" | "payload_external_content_source_json" | "payload_fallbacks_json" | "payload_kind" | "payload_light_context" | "payload_message" | "payload_model" | "payload_thinking" | "payload_timeout_seconds" | "payload_tools_allow_json">;
/** Reconstructs cron payload variants from SQLite columns, returning null for invalid rows. */
export declare function payloadFromRow(row: CronJobRow): CronPayload | null;
