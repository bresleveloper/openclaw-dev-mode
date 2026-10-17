import { a as providerSummaryText, i as formatEnvelopeForText, n as runCapabilityCommand, t as registerLocalProvidersCommand } from "./providers-command-DH2kgqMZ.mjs";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.mjs";
import path from "node:path";
//#region src/cli/capability-cli/audio.ts
async function runAudioTranscribe(params) {
	const { requireProviderModelOverride, resolveLocalCapabilityAgent } = await import("./shared-CjdG1Gdc.mjs");
	const { getModelsCommandSecretTargetIds } = await import("./command-secret-targets-B6SXHGID.mjs");
	const { transcribeAudioFile } = await import("./runtime-RuAqSqIc.mjs");
	const { cfg, agentId, agentDir } = await resolveLocalCapabilityAgent({
		commandName: "infer audio transcribe",
		targetIds: getModelsCommandSecretTargetIds(),
		agent: params.agent
	});
	const result = await transcribeAudioFile({
		agentDir,
		activeModel: requireProviderModelOverride(params.model),
		filePath: path.resolve(params.file),
		cfg,
		agentId,
		language: params.language,
		prompt: params.prompt
	});
	if (!result.text) {
		if (isMissingMediaUnderstandingProvider(result)) throw new Error("No audio transcription provider is configured or ready. Configure an audio-capable tools.media.models entry, or pass --model <provider/model> after configuring that provider's auth/API key.");
		throw new Error(`No transcript returned for audio: ${path.resolve(params.file)}`);
	}
	return {
		ok: true,
		capability: "audio.transcribe",
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: [],
		outputs: [{
			path: path.resolve(params.file),
			text: result.text,
			kind: "audio.transcription"
		}]
	};
}
function registerAudioCapabilityCommands(capability) {
	const audio = capability.command("audio").description("Audio transcription").option("--agent <id>", "Agent whose model and auth state should be used");
	audio.command("transcribe").description("Transcribe one audio file").requiredOption("--file <path>", "Audio file").option("--agent <id>", "Agent whose model and auth state should be used").option("--language <code>", "Language hint").option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action((opts, command) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
		const { resolveCapabilityAgentOption } = await import("./shared-CjdG1Gdc.mjs");
		return runAudioTranscribe({
			file: String(opts.file),
			agent: resolveCapabilityAgentOption(command, opts.agent),
			language: opts.language,
			model: opts.model,
			prompt: opts.prompt
		});
	}));
	registerLocalProvidersCommand(audio, "List audio transcription providers", async (cfg, agentId) => {
		const { providerHasGenericConfig } = await import("./shared-CjdG1Gdc.mjs");
		const { inspectLocalAudioSelection } = await import("./local-audio-JTLsb7mc.mjs");
		const { buildMediaUnderstandingRegistry } = await import("./provider-registry-CWDriFfT.mjs");
		const remoteProviders = [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("audio")).map((provider) => ({
			available: true,
			configured: providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: false,
			id: provider.id,
			capabilities: provider.capabilities,
			defaultModels: provider.defaultModels
		}));
		const localProviders = (await inspectLocalAudioSelection()).candidates.filter((candidate) => candidate.available).map((candidate) => Object.assign({
			available: candidate.available,
			configured: candidate.ready,
			selected: false,
			localFallbackSelected: candidate.selected,
			id: `local/${candidate.id}`,
			transport: "local-cli",
			command: candidate.command,
			observedBackend: candidate.observedBackend ?? "unknown",
			evidence: candidate.evidence
		}, candidate.capableBackend ? { capableBackend: candidate.capableBackend } : {}, candidate.requestedBackend ? { requestedBackend: candidate.requestedBackend } : {}, candidate.reason ? { reason: candidate.reason } : {}));
		return [...remoteProviders, ...localProviders];
	}, providerSummaryText);
}
//#endregion
export { registerAudioCapabilityCommands };
