import { n as discordVoiceTranscriptsSourceProvider } from "./.setup/transcripts-source-CaZQnGRH.mjs";
//#region extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
//#endregion
export { registerDiscordTranscriptSourceProvider };
