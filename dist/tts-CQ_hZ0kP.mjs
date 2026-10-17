import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
import { a as providerSummaryText, i as formatEnvelopeForText, n as runCapabilityCommand } from "./providers-command-DH2kgqMZ.mjs";
import { Option } from "commander";
//#region src/cli/capability-cli/tts.ts
function registerTransportTtsCommand(command, defaultTransport, run, formatText) {
	command.option("--local", "Force local execution", false).option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action((opts) => runCapabilityCommand(opts.json, formatText, async () => {
		const { resolveTransport } = await import("./shared-CjdG1Gdc.mjs");
		return run(opts, resolveTransport({
			local: Boolean(opts.local),
			gateway: Boolean(opts.gateway),
			supported: ["local", "gateway"],
			defaultTransport
		}));
	}));
}
function registerTtsCapabilityCommands(capability) {
	const tts = capability.command("tts").description("Text to speech");
	registerTransportTtsCommand(tts.command("convert").description("Convert text to speech").requiredOption("--text <text>", "Input text").option("--channel <id>", "Channel hint").option("--voice <id>", "Voice hint").option("--provider <id>", "Speech provider id").option("--model <provider/model>", "Model override").option("--output <path>", "Output path"), "local", async (opts, transport) => {
		const { resolveModelRefOverride } = await import("./model-ref-override-C2Pxc2VD.mjs");
		const { runTtsConvert } = await import("./tts-runtime-BQaKg8yL.mjs");
		const modelRef = resolveModelRefOverride(opts.model);
		if (opts.model && !modelRef.provider) throw new Error("TTS model overrides must use the form <provider/model>.");
		const provider = normalizeCapabilityProviderId(typeof opts.provider === "string" && opts.provider.trim() ? opts.provider.trim() : modelRef.provider);
		const modelProvider = normalizeCapabilityProviderId(modelRef.provider);
		if (provider && modelProvider && provider !== modelProvider) throw new Error("TTS --provider must match the provider in --model.");
		return await runTtsConvert({
			text: String(opts.text),
			channel: opts.channel,
			provider,
			modelId: modelProvider ? modelRef.model : void 0,
			voiceId: opts.voice,
			output: opts.output,
			transport
		});
	}, formatEnvelopeForText);
	tts.command("voices").description("List voices for a TTS provider").option("--provider <id>", "Speech provider id").option("--json", "Output JSON", false).action((opts) => runCapabilityCommand(opts.json, providerSummaryText, async () => {
		const { runTtsVoices } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsVoices(opts.provider);
	}));
	registerTransportTtsCommand(tts.command("providers").description("List speech providers").option("--agent <id>", "Agent whose provider state should be inspected"), "local", async (opts, transport) => {
		const { runTtsProviders } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsProviders(transport, opts.agent);
	});
	registerTransportTtsCommand(tts.command("personas").description("List TTS personas"), "local", async (_, transport) => {
		const { runTtsPersonas } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsPersonas(transport);
	});
	tts.command("status").description("Show TTS status").option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action((opts) => runCapabilityCommand(opts.json, void 0, async () => {
		const { resolveTransport } = await import("./shared-CjdG1Gdc.mjs");
		const transport = resolveTransport({
			gateway: Boolean(opts.gateway),
			supported: ["gateway"],
			defaultTransport: "gateway"
		});
		const { callGateway } = await import("./call-CWvmXO5x.mjs");
		return {
			transport,
			...await callGateway({
				method: "tts.status",
				timeoutMs: 3e4
			})
		};
	}));
	for (const [commandName, capabilityId] of [["enable", "tts.enable"], ["disable", "tts.disable"]]) registerTransportTtsCommand(tts.command(commandName).description(`${commandName === "enable" ? "Enable" : "Disable"} TTS`), "gateway", async (_, transport) => {
		const { runTtsStateMutation } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsStateMutation({
			capability: capabilityId,
			transport
		});
	});
	registerTransportTtsCommand(tts.command("set-provider").description("Set the active TTS provider").requiredOption("--provider <id>", "Speech provider id"), "gateway", async (opts, transport) => {
		const { runTtsStateMutation } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsStateMutation({
			capability: "tts.set-provider",
			provider: String(opts.provider),
			transport
		});
	});
	registerTransportTtsCommand(tts.command("set-persona").description("Set the active TTS persona").addOption(new Option("--persona <id>", "TTS persona id").conflicts("off")).option("--off", "Disable the active TTS persona", false), "gateway", async (opts, transport) => {
		if (!opts.off && !opts.persona) throw new Error("--persona is required unless --off is set");
		const { runTtsStateMutation } = await import("./tts-runtime-BQaKg8yL.mjs");
		return runTtsStateMutation({
			capability: "tts.set-persona",
			persona: opts.off ? null : String(opts.persona),
			transport
		});
	});
}
//#endregion
export { registerTtsCapabilityCommands };
