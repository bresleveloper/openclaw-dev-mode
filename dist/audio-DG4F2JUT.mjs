import { a as providerSummaryText, t as registerLocalProvidersCommand } from "./providers-command-BKm6xsdL.mjs";
import { t as registerMediaUnderstandingCommand } from "./media-understanding-command-CVDYGREl.mjs";
//#region src/cli/capability-cli/audio.ts
function registerAudioCapabilityCommands(capability) {
	const audio = capability.command("audio").description("Audio transcription").option("--agent <id>", "Agent whose model and auth state should be used");
	registerMediaUnderstandingCommand(audio, "audio");
	registerLocalProvidersCommand(audio, "List audio transcription providers", async (cfg, agentId) => {
		const { inspectLocalAudioSelection } = await import("./local-audio-nHhUQkVG.mjs");
		const { listUnderstandingProviders } = await import("./media-providers-73FLDzW2.mjs");
		const remoteProviders = await listUnderstandingProviders("audio", cfg, agentId);
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
