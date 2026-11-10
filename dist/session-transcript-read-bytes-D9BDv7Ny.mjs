import { p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { m as transcriptEventUtf8BytesSql } from "./transcript-payload-Cu49oQKq.mjs";
//#region src/config/sessions/session-transcript-read-bytes.ts
/** Preserve native identity accounting where a legacy row has no exact UTF-8 size. */
function transcriptEventReadBytesSql(alias = "transcript_events") {
	const identity = sql.ref(`${alias}.event_json`);
	return sql`coalesce(${transcriptEventUtf8BytesSql(alias)}, octet_length(${identity}))`;
}
/** Bound transient decoded payloads retained by one SQLite export slice. */
const TRANSCRIPT_PAYLOAD_SLICE_BYTES = 2097152;
//#endregion
export { transcriptEventReadBytesSql as n, TRANSCRIPT_PAYLOAD_SLICE_BYTES as t };
