//#region src/meeting-bot/transcripts-bridge.ts
function createMeetingTranscriptSourceProvider(params) {
	return {
		id: params.id,
		aliases: params.aliases,
		name: params.name,
		sourceKinds: ["live-caption"],
		start: async (request) => await (await params.runtime()).startTranscriptSource(request),
		stop: async (request) => await (await params.runtime()).stopTranscriptSource(request)
	};
}
//#endregion
export { createMeetingTranscriptSourceProvider as t };
