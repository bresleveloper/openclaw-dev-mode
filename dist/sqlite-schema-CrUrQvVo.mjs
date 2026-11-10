import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-ensure-BdqUBvvX.mjs";
//#region src/transcripts/sqlite-schema.ts
const ensureMeetingTranscriptsSchema = createOpenClawStateSchemaEnsurer({
	table: "meeting_transcript_sessions",
	additionalTables: ["meeting_transcript_utterances", "meeting_transcript_summaries"],
	indexes: [
		"idx_meeting_transcript_sessions_started",
		"idx_meeting_transcript_sessions_id",
		"idx_meeting_transcript_sessions_slug",
		"idx_meeting_transcript_sessions_export_key",
		"idx_meeting_transcript_utterances_id"
	],
	endMarker: "  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n",
	operationLabel: "meeting-transcripts.schema.ensure"
});
//#endregion
export { ensureMeetingTranscriptsSchema as t };
