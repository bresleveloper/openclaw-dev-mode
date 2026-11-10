import { n as discordVoiceTranscriptsSourceProvider } from "./.setup/transcripts-source-8RDQrSVb.mjs";
//#region extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
//#endregion
export { registerDiscordTranscriptSourceProvider };
