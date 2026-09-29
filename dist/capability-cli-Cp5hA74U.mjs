import { i as getCommandArgsWithRootOptions } from "./cli-root-options-vGuJ5JgW.mjs";
import { h as normalizeRootLogLevelArgv, n as getCommandPathWithRootOptions } from "./argv-IYTsfFsq.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.mjs";
import { r as providerSummaryText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
//#region src/cli/capability-cli/metadata.ts
const CAPABILITY_METADATA = [
	{
		id: "model.run",
		description: "Run a one-shot inference turn through the selected model provider.",
		transports: ["local", "gateway"],
		flags: [
			"--prompt",
			"--file",
			"--model",
			"--thinking",
			"--local",
			"--gateway",
			"--agent",
			"--json"
		],
		resultShape: "normalized payloads plus provider/model attribution"
	},
	{
		id: "model.list",
		description: "List known models from the model catalog.",
		transports: ["local"],
		flags: ["--json"],
		resultShape: "catalog entries"
	},
	{
		id: "model.inspect",
		description: "Inspect one model catalog entry.",
		transports: ["local"],
		flags: ["--model", "--json"],
		resultShape: "single catalog entry"
	},
	{
		id: "model.providers",
		description: "List model providers discovered from the catalog.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids with counts and defaults"
	},
	{
		id: "model.auth.login",
		description: "Run the existing provider auth login flow.",
		transports: ["local"],
		flags: [
			"--provider",
			"--method",
			"--agent"
		],
		resultShape: "interactive auth result"
	},
	{
		id: "model.auth.logout",
		description: "Remove saved auth profiles for one provider.",
		transports: ["local"],
		flags: [
			"--provider",
			"--agent",
			"--json"
		],
		resultShape: "removed profile ids"
	},
	{
		id: "model.auth.status",
		description: "Show configured model auth state.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "model status summary"
	},
	{
		id: "image.generate",
		description: "Generate raster images with configured image providers.",
		transports: ["local"],
		flags: [
			"--prompt",
			"--model",
			"--count",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--output-format",
			"--background",
			"--openai-background",
			"--openai-moderation",
			"--quality",
			"--timeout-ms",
			"--output",
			"--agent",
			"--json"
		],
		resultShape: "saved image files plus attempts"
	},
	{
		id: "image.edit",
		description: "Generate edited images from one or more input files.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--count",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--output-format",
			"--background",
			"--openai-background",
			"--openai-moderation",
			"--quality",
			"--timeout-ms",
			"--output",
			"--agent",
			"--json"
		],
		resultShape: "saved image files plus attempts"
	},
	{
		id: "image.describe",
		description: "Describe one image file through media-understanding providers.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--timeout-ms",
			"--agent",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "image.describe-many",
		description: "Describe multiple image files independently.",
		transports: ["local"],
		flags: [
			"--file",
			"--prompt",
			"--model",
			"--timeout-ms",
			"--agent",
			"--json"
		],
		resultShape: "one text output per file"
	},
	{
		id: "image.providers",
		description: "List image generation providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and defaults"
	},
	{
		id: "audio.transcribe",
		description: "Transcribe one audio file.",
		transports: ["local"],
		flags: [
			"--file",
			"--agent",
			"--language",
			"--prompt",
			"--model",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "audio.providers",
		description: "List audio transcription providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and capabilities"
	},
	{
		id: "tts.convert",
		description: "Convert text to speech.",
		transports: ["local", "gateway"],
		flags: [
			"--text",
			"--channel",
			"--voice",
			"--provider",
			"--model",
			"--output",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "saved audio file plus attempts"
	},
	{
		id: "tts.voices",
		description: "List voices for a speech provider.",
		transports: ["local"],
		flags: ["--provider", "--json"],
		resultShape: "voice entries"
	},
	{
		id: "tts.providers",
		description: "List speech providers.",
		transports: ["local", "gateway"],
		flags: [
			"--agent",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "provider ids, configured state, models, voices"
	},
	{
		id: "tts.personas",
		description: "List TTS personas.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "persona ids, labels, providers, active persona"
	},
	{
		id: "tts.status",
		description: "Show gateway-managed TTS state.",
		transports: ["gateway"],
		flags: ["--gateway", "--json"],
		resultShape: "enabled/provider state"
	},
	{
		id: "tts.enable",
		description: "Enable TTS in prefs.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "enabled state"
	},
	{
		id: "tts.disable",
		description: "Disable TTS in prefs.",
		transports: ["local", "gateway"],
		flags: [
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "enabled state"
	},
	{
		id: "tts.set-provider",
		description: "Set the active TTS provider.",
		transports: ["local", "gateway"],
		flags: [
			"--provider",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "selected provider"
	},
	{
		id: "tts.set-persona",
		description: "Set the active TTS persona.",
		transports: ["local", "gateway"],
		flags: [
			"--persona",
			"--off",
			"--local",
			"--gateway",
			"--json"
		],
		resultShape: "selected persona"
	},
	{
		id: "video.generate",
		description: "Generate video files with configured video providers.",
		transports: ["local"],
		flags: [
			"--prompt",
			"--model",
			"--size",
			"--aspect-ratio",
			"--resolution",
			"--duration",
			"--audio",
			"--watermark",
			"--timeout-ms",
			"--output",
			"--agent",
			"--json"
		],
		resultShape: "saved video files plus attempts"
	},
	{
		id: "video.describe",
		description: "Describe one video file through media-understanding providers.",
		transports: ["local"],
		flags: [
			"--file",
			"--agent",
			"--model",
			"--json"
		],
		resultShape: "normalized text output"
	},
	{
		id: "video.providers",
		description: "List video generation and description providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and defaults"
	},
	{
		id: "web.search",
		description: "Run provider-backed web search.",
		transports: ["local"],
		flags: [
			"--query",
			"--provider",
			"--limit",
			"--json"
		],
		resultShape: "search provider result"
	},
	{
		id: "web.fetch",
		description: "Fetch URL content through configured web fetch providers.",
		transports: ["local"],
		flags: [
			"--url",
			"--provider",
			"--format",
			"--json"
		],
		resultShape: "fetch provider result"
	},
	{
		id: "web.providers",
		description: "List web search and fetch providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids grouped by family"
	},
	{
		id: "embedding.create",
		description: "Create embeddings through embedding providers.",
		transports: ["local"],
		flags: [
			"--text",
			"--provider",
			"--model",
			"--agent",
			"--json"
		],
		resultShape: "vectors with provider/model attribution"
	},
	{
		id: "embedding.providers",
		description: "List embedding providers.",
		transports: ["local"],
		flags: ["--agent", "--json"],
		resultShape: "provider ids and default models"
	}
];
function findCapabilityMetadata(id) {
	return CAPABILITY_METADATA.find((entry) => entry.id === id);
}
//#endregion
//#region src/cli/capability-cli.ts
const capabilityCommandGroups = [
	["model", async () => (await import("./model-CKLQlT-W.mjs")).registerModelCapabilityCommands],
	["image", async () => (await import("./image-Z8HP5vrt.mjs")).registerImageCapabilityCommands],
	["audio", async () => (await import("./audio-HUZm6NtC.mjs")).registerAudioCapabilityCommands],
	["tts", async () => (await import("./tts-BxT2IVXQ.mjs")).registerTtsCapabilityCommands],
	["video", async () => (await import("./video-DavL8hHy.mjs")).registerVideoCapabilityCommands],
	["web", async () => (await import("./web-B57e0k6y.mjs")).registerWebCapabilityCommands],
	["embedding", async () => (await import("./embedding-CFZFHk75.mjs")).registerEmbeddingCapabilityCommands]
];
function registerCapabilityListAndInspect(capability) {
	capability.command("list").description("List canonical capability ids and supported transports").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = CAPABILITY_METADATA.map((entry) => ({
				id: entry.id,
				transports: entry.transports,
				description: entry.description
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	capability.command("inspect").description("Inspect one canonical capability id").requiredOption("--name <capability>", "Capability id").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const entry = findCapabilityMetadata(String(opts.name));
			if (!entry) throw new Error(`Unknown capability: ${String(opts.name)}`);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) => JSON.stringify(value, null, 2));
		});
	});
}
async function registerCapabilityDomainCommands(capability, argv) {
	const selectionArgv = normalizeRootLogLevelArgv(argv);
	const commandPath = getCommandPathWithRootOptions(selectionArgv, 2);
	const primary = commandPath[0];
	const commandArgs = primary === "infer" || primary === "capability" ? getCommandArgsWithRootOptions(selectionArgv, {
		commandPath: [primary],
		mode: "command-path"
	}) : void 0;
	const selectedName = commandArgs?.[0] === "--" ? commandPath[1] : commandArgs?.[0];
	if (selectedName === "list" || selectedName === "inspect") return;
	const selected = capabilityCommandGroups.find(([name]) => name === selectedName);
	if (selected) {
		(await selected[1]())(capability);
		return;
	}
	const registrars = await Promise.all(capabilityCommandGroups.map(([, load]) => load()));
	for (const register of registrars) register(capability);
}
async function registerCapabilityCli(program, argv = process.argv) {
	removeCommandByName(program, "infer");
	removeCommandByName(program, "capability");
	const capability = program.command("infer").alias("capability").description("Run provider-backed inference commands through a stable CLI surface").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/infer", "docs.openclaw.ai/cli/infer")}\n`);
	registerCapabilityListAndInspect(capability);
	await registerCapabilityDomainCommands(capability, argv);
}
//#endregion
export { registerCapabilityCli };
