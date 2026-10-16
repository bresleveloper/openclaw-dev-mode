import { d as sql } from "./kysely-sync-K7ftY-g4.mjs";
import { f as transcriptEventUtf8BytesSql } from "./transcript-payload-Yc_w8Yx5.mjs";
//#region src/config/sessions/session-transcript-read-bytes.ts
/** Preserve native identity accounting where a legacy row has no exact UTF-8 size. */
function transcriptEventReadBytesSql(alias = "transcript_events") {
	const identity = sql.ref(`${alias}.event_json`);
	return sql`coalesce(${transcriptEventUtf8BytesSql(alias)}, octet_length(${identity}))`;
}
//#endregion
export { transcriptEventReadBytesSql as t };
