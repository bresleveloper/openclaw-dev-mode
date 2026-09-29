import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { n as inspectLocalAudioSelection } from "./local-audio-BUgxXnl2.mjs";
import { n as buildMediaUnderstandingRegistry } from "./image-compression-policy-SmOjiyMB.mjs";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { l as transcribeAudioFile } from "./runtime-6t44WwNq.mjs";
import { n as formatEnvelopeForText, r as providerSummaryText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { t as prepareLocalCapabilityAccountSecrets } from "./local-account-secrets-qdPUsTvD.mjs";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.mjs";
import { a as providerHasGenericConfig, c as resolveCapabilityAgentOption, l as resolveCapabilityProviderAgentId, o as registerLocalProvidersCommand, s as requireProviderModelOverride, u as resolveLocalCapabilityRuntimeConfig } from "./shared-Bg3km3d1.mjs";
import path from "node:path";
//#region src/cli/capability-cli/audio.ts
async function runAudioTranscribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer audio transcribe",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, "infer audio transcribe");
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const result = await transcribeAudioFile({
		agentDir: resolveAgentDir(cfg, agentId),
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
	audio.command("transcribe").description("Transcribe one audio file").requiredOption("--file <path>", "Audio file").option("--agent <id>", "Agent whose model and auth state should be used").option("--language <code>", "Language hint").option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runAudioTranscribe({
				file: String(opts.file),
				agent: resolveCapabilityAgentOption(command, opts.agent),
				language: opts.language,
				model: opts.model,
				prompt: opts.prompt
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	registerLocalProvidersCommand(audio, "List audio transcription providers", async (cfg, agentId) => {
		const remoteProviders = [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("audio")).map((provider) => ({
			available: true,
			configured: providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId,
				envVars: getProviderEnvVarsCore(provider.id, {
					config: cfg,
					includeUntrustedWorkspacePlugins: false
				})
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
