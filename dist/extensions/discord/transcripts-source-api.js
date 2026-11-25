import { n as discordVoiceTranscriptsSourceProvider } from "./.setup/transcripts-source-C3F_ErM1.mjs";
// extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
export { registerDiscordTranscriptSourceProvider };
