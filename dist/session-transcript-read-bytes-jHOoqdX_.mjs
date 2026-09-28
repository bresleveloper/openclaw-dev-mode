import { u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { f as transcriptEventUtf8BytesSql } from "./transcript-payload-qsg5dB6v.mjs";
//#region src/config/sessions/session-transcript-read-bytes.ts
/** Preserve native identity accounting where a legacy row has no exact UTF-8 size. */
function transcriptEventReadBytesSql(alias = "transcript_events") {
	const identity = sql.ref(`${alias}.event_json`);
	return sql`coalesce(${transcriptEventUtf8BytesSql(alias)}, octet_length(${identity}))`;
}
//#endregion
export { transcriptEventReadBytesSql as t };
