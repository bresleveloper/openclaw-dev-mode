import { D as readJsonObjectMembers } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
//#region src/transcripts/store-columns.ts
function stringFields(json) {
	try {
		return json === null ? /* @__PURE__ */ new Map() : readJsonObjectMembers(json);
	} catch {
		return /* @__PURE__ */ new Map();
	}
}
function text(fields, key) {
	const raw = fields.get(key);
	const value = raw?.startsWith("\"") ? JSON.parse(raw) : null;
	return typeof value === "string" ? value : null;
}
function deriveMeetingTranscriptSessionColumns(sourceJson, metadataJson) {
	const source = stringFields(sourceJson);
	const metadata = stringFields(metadataJson);
	return {
		source_account_id: text(source, "accountId"),
		source_guild_id: text(source, "guildId"),
		source_channel_id: text(source, "channelId"),
		source_meeting_url: text(source, "meetingUrl"),
		source_thread_ts: text(source, "threadTs"),
		source_file_id: text(source, "fileId"),
		metadata_agent_id: text(metadata, "agentId")
	};
}
function deriveMeetingTranscriptSummaryColumns(summaryJson) {
	return { overview: text(stringFields(summaryJson), "overview") };
}
//#endregion
export { deriveMeetingTranscriptSummaryColumns as n, deriveMeetingTranscriptSessionColumns as t };
