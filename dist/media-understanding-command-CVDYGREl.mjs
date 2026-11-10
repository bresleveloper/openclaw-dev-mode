import { i as formatEnvelopeForText, n as runCapabilityCommand } from "./providers-command-BKm6xsdL.mjs";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.mjs";
import path from "node:path";
//#region src/cli/capability-cli/media-understanding-command.ts
function registerMediaUnderstandingCommand(parent, kind) {
	const audio = kind === "audio";
	const command = parent.command(audio ? "transcribe" : "describe").description(audio ? "Transcribe one audio file" : "Describe one video file").requiredOption("--file <path>", audio ? "Audio file" : "Video file").option("--agent <id>", "Agent whose model and auth state should be used");
	if (audio) command.option("--language <code>", "Language hint").option("--prompt <text>", "Prompt hint");
	command.option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action((opts, actionCommand) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
		const { requireProviderModelOverride, resolveLocalCapabilityAgent, resolveCapabilityAgentOption } = await import("./shared-44vrfXju.mjs");
		const file = opts.file;
		const agent = resolveCapabilityAgentOption(actionCommand, opts.agent);
		const { getModelsCommandSecretTargetIds } = await import("./command-secret-targets-BF6Ekt_4.mjs");
		const { transcribeAudioFile, describeVideoFile } = await import("./runtime-DhyhsA0K.mjs");
		const { cfg, agentId, agentDir } = await resolveLocalCapabilityAgent({
			commandName: audio ? "infer audio transcribe" : "infer video.describe",
			targetIds: getModelsCommandSecretTargetIds(),
			agent,
			...audio ? {} : { surface: "infer video describe" }
		});
		const activeModel = requireProviderModelOverride(opts.model);
		const input = {
			filePath: path.resolve(file),
			cfg,
			agentId,
			agentDir,
			activeModel
		};
		const result = audio ? await transcribeAudioFile({
			...input,
			language: opts.language,
			prompt: opts.prompt
		}) : await describeVideoFile(input);
		if (!result.text) {
			if (audio && isMissingMediaUnderstandingProvider(result)) throw new Error("No audio transcription provider is configured or ready. Configure an audio-capable tools.media.models entry, or pass --model <provider/model> after configuring that provider's auth/API key.");
			throw new Error(`No ${audio ? "transcript" : "description"} returned for ${kind}: ${path.resolve(file)}`);
		}
		return {
			ok: true,
			capability: audio ? "audio.transcribe" : "video.describe",
			transport: "local",
			provider: result.provider,
			model: result.model,
			attempts: [],
			outputs: [{
				path: path.resolve(file),
				text: result.text,
				kind: audio ? "audio.transcription" : "video.description"
			}]
		};
	}));
}
//#endregion
export { registerMediaUnderstandingCommand as t };
