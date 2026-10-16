import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { t as createEnumOptionParser } from "./enum-option-BpnBZVLh.mjs";
import { a as providerSummaryText, i as formatEnvelopeForText, n as runCapabilityCommand, t as registerLocalProvidersCommand } from "./providers-command-DBfG4bA0.mjs";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
import path from "node:path";
//#region src/cli/capability-cli/image.ts
const IMAGE_OUTPUT_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const IMAGE_BACKGROUNDS = [
	"transparent",
	"opaque",
	"auto"
];
const IMAGE_QUALITIES = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"auto"
];
const IMAGE_MODERATIONS = ["low", "auto"];
const parseImageOption = createEnumOptionParser();
async function runImageGenerate(params) {
	const { requireProviderModelOverride, resolveLocalCapabilityAgent } = await import("./shared-DGHyWmnS.mjs");
	const { getModelsCommandSecretTargetIds } = await import("./command-secret-targets-CgRezXzx.mjs");
	const { generateImage } = await import("./runtime-CHwgRuNW.mjs");
	const { getImageMetadata } = await import("./media-services-4dd9Mh1T.mjs");
	const { readInputFiles, writeOutputAsset } = await import("./media-output-D0klUgv9.mjs");
	requireProviderModelOverride(params.model);
	const { cfg, agentDir } = await resolveLocalCapabilityAgent({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds(),
		agent: params.agent
	});
	const inputImages = params.file && params.file.length > 0 ? await Promise.all((await readInputFiles(params.file)).map(async (entry) => ({
		buffer: entry.buffer,
		fileName: path.basename(entry.path),
		mimeType: await detectMime({
			buffer: entry.buffer,
			filePath: entry.path
		}) ?? "image/png"
	}))) : void 0;
	const result = await generateImage({
		cfg,
		agentDir,
		prompt: params.prompt,
		modelOverride: params.model,
		count: params.count,
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		quality: params.quality,
		outputFormat: params.outputFormat,
		background: params.background,
		providerOptions: params.openaiBackground || params.openaiModeration ? { openai: {
			...params.openaiBackground ? { background: params.openaiBackground } : {},
			...params.openaiModeration ? { moderation: params.openaiModeration } : {}
		} } : void 0,
		timeoutMs: params.timeoutMs,
		inputImages
	});
	const outputs = await Promise.all(result.images.map(async (image, index) => {
		const written = await writeOutputAsset({
			buffer: image.buffer,
			mimeType: image.mimeType,
			originalFilename: image.fileName,
			outputPath: params.output,
			outputIndex: index,
			outputCount: result.images.length,
			subdir: "generated"
		});
		const metadata = await getImageMetadata(image.buffer).catch(() => void 0);
		return {
			...written,
			width: metadata?.width,
			height: metadata?.height,
			revisedPrompt: image.revisedPrompt
		};
	}));
	return {
		ok: true,
		capability: params.capability,
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: result.attempts,
		outputs,
		ignoredOverrides: result.ignoredOverrides
	};
}
async function runImageDescribe(params) {
	const { requireProviderModelOverride, resolveLocalCapabilityAgent } = await import("./shared-DGHyWmnS.mjs");
	const { getModelsCommandSecretTargetIds } = await import("./command-secret-targets-CgRezXzx.mjs");
	const { runWithImageModelFallback } = await import("./model-fallback-image-CA-O1Sok.mjs");
	const { describeImageFile, describePreparedImageWithModel, prepareImageDescriptionInput } = await import("./runtime-BQnB8qTR.mjs");
	const { cfg, agentId, agentDir } = await resolveLocalCapabilityAgent({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds(),
		agent: params.agent
	});
	const activeModel = requireProviderModelOverride(params.model);
	const prompt = normalizeOptionalString(params.prompt);
	const outputs = await Promise.all(params.files.map(async (filePath) => {
		const resolvedPath = resolveImageDescribeInput(filePath);
		const isRemoteUrl = /^https?:\/\//i.test(resolvedPath);
		const preparedImage = activeModel ? await prepareImageDescriptionInput({
			filePath: resolvedPath,
			...isRemoteUrl ? { mediaUrl: resolvedPath } : {},
			cfg,
			timeoutMs: params.timeoutMs
		}) : void 0;
		const result = activeModel && preparedImage ? await runWithImageModelFallback({
			cfg,
			modelOverride: `${activeModel.provider}/${activeModel.model}`,
			run: async (provider, model) => {
				const described = await describePreparedImageWithModel({
					image: preparedImage,
					cfg,
					agentId,
					agentDir,
					provider,
					model,
					prompt: prompt ?? "Describe the image.",
					timeoutMs: params.timeoutMs
				});
				if (!described.text?.trim()) throw new Error(`No description returned for image: ${resolvedPath}`);
				return described;
			}
		}) : {
			result: await describeImageFile({
				filePath: resolvedPath,
				...isRemoteUrl ? { mediaUrl: resolvedPath } : {},
				cfg,
				agentId,
				agentDir,
				prompt,
				timeoutMs: params.timeoutMs
			}),
			provider: void 0,
			model: void 0,
			attempts: []
		};
		if (!result.result.text) {
			if (isMissingMediaUnderstandingProvider(result.result)) throw new Error("No image understanding provider is configured or ready. Configure an image-capable tools.media.models entry or agents.defaults.imageModel.primary, or pass --model <provider/model> after configuring that provider's auth/API key.");
			throw new Error(`No description returned for image: ${resolvedPath}`);
		}
		return {
			path: resolvedPath,
			text: result.result.text,
			provider: result.provider ?? result.result.provider,
			model: result.result.model ?? result.model,
			attempts: result.attempts,
			kind: "image.description"
		};
	}));
	return {
		ok: true,
		capability: params.capability,
		transport: "local",
		provider: outputs[0]?.provider,
		model: outputs[0]?.model,
		attempts: outputs.flatMap((output) => output.attempts),
		outputs: outputs.map(({ attempts: _attempts, ...output }) => output)
	};
}
function resolveImageDescribeInput(filePath) {
	const trimmed = filePath.trim();
	return /^https?:\/\//i.test(trimmed) ? trimmed : path.resolve(filePath);
}
function addImageGenerationOptions(command) {
	return command.option("--model <provider/model>", "Model override").option("--count <n>", "Number of images").option("--size <size>", "Size hint like 1024x1024").option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9").option("--resolution <value>", "Resolution hint: 1K, 2K, or 4K").option("--output-format <format>", "Output format hint: png, jpeg, or webp").option("--background <value>", "Background hint: transparent, opaque, or auto").option("--openai-background <value>", "OpenAI background hint: transparent, opaque, or auto").option("--openai-moderation <value>", "OpenAI moderation hint: low or auto").option("--quality <value>", "Quality hint: low, medium, high, xhigh, max, or auto").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--output <path>", "Output path").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false);
}
async function resolveImageGenerationOptions(opts, command) {
	const { resolveCapabilityAgentOption, parseOptionalPositiveInteger, parseOptionalTimeoutMs } = await import("./shared-DGHyWmnS.mjs");
	return {
		agent: resolveCapabilityAgentOption(command, opts.agent),
		model: opts.model,
		count: parseOptionalPositiveInteger(opts.count, "--count"),
		size: opts.size,
		aspectRatio: opts.aspectRatio,
		resolution: opts.resolution,
		outputFormat: parseImageOption(opts.outputFormat, IMAGE_OUTPUT_FORMATS, "--output-format"),
		background: parseImageOption(opts.background, IMAGE_BACKGROUNDS, "--background"),
		openaiBackground: parseImageOption(opts.openaiBackground, IMAGE_BACKGROUNDS, "--openai-background"),
		openaiModeration: parseImageOption(opts.openaiModeration, IMAGE_MODERATIONS, "--openai-moderation"),
		quality: parseImageOption(opts.quality, IMAGE_QUALITIES, "--quality"),
		timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
		output: opts.output
	};
}
function registerImageCapabilityCommands(capability) {
	const image = capability.command("image").description("Image generation and description").option("--agent <id>", "Agent whose model and auth state should be used");
	for (const [commandName, description] of [["generate", "Generate images"], ["edit", "Edit images with one or more input files"]]) {
		const generate = image.command(commandName).description(description);
		if (commandName === "edit") generate.requiredOption("--file <path>", "Input file", collectOption);
		addImageGenerationOptions(generate.requiredOption("--prompt <text>", "Prompt text")).action((opts, command) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
			return runImageGenerate({
				capability: `image.${commandName}`,
				prompt: String(opts.prompt),
				...commandName === "edit" ? { file: Array.isArray(opts.file) ? opts.file : [String(opts.file)] } : {},
				...await resolveImageGenerationOptions(opts, command)
			});
		}));
	}
	for (const [commandName, description] of [["describe", "Describe one image file"], ["describe-many", "Describe multiple image files"]]) {
		const describe = image.command(commandName).description(description);
		const multiple = commandName === "describe-many";
		if (multiple) describe.requiredOption("--file <path>", "Image file", collectOption);
		else describe.requiredOption("--file <path>", "Image file");
		describe.option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action((opts, command) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
			const { parseOptionalTimeoutMs, resolveCapabilityAgentOption } = await import("./shared-DGHyWmnS.mjs");
			return runImageDescribe({
				capability: `image.${commandName}`,
				files: multiple ? opts.file : [String(opts.file)],
				model: opts.model,
				prompt: opts.prompt,
				timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
				agent: resolveCapabilityAgentOption(command, opts.agent)
			});
		}));
	}
	registerLocalProvidersCommand(image, "List image generation providers", async (cfg, agentId) => {
		const { providerHasGenericConfig, resolveSelectedProviderFromModelRef } = await import("./shared-DGHyWmnS.mjs");
		const { listRuntimeImageGenerationProviders } = await import("./runtime-CHwgRuNW.mjs");
		const selectedProvider = resolveSelectedProviderFromModelRef(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.mediaModels?.image));
		return listRuntimeImageGenerationProviders({ config: cfg }).map((provider) => ({
			available: true,
			configured: selectedProvider === provider.id || providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: selectedProvider === provider.id,
			id: provider.id,
			label: provider.label,
			defaultModel: provider.defaultModel,
			models: provider.models ?? [],
			capabilities: provider.capabilities
		}));
	}, providerSummaryText);
}
//#endregion
export { registerImageCapabilityCommands };
