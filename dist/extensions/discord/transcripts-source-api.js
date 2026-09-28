import { n as discordVoiceTranscriptsSourceProvider } from "./.setup/transcripts-source-DVegW0WI.mjs";
//#region extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
//#endregion
export { registerDiscordTranscriptSourceProvider };
