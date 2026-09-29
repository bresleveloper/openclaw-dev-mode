import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import "./media-services-VTwDQdlk.mjs";
import { o as getImageMetadata } from "./image-ops-CU4vxSlO.mjs";
import { n as createEnumOptionParser, t as runWithImageModelFallback } from "./model-fallback-image-CMuqJZA7.mjs";
import { n as listRuntimeImageGenerationProviders, t as generateImage } from "./runtime-WrqZPQnT.mjs";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { o as prepareImageDescriptionInput, r as describePreparedImageWithModel, t as describeImageFile } from "./runtime-6t44WwNq.mjs";
import { n as formatEnvelopeForText, r as providerSummaryText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { t as prepareLocalCapabilityAccountSecrets } from "./local-account-secrets-qdPUsTvD.mjs";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.mjs";
import { a as providerHasGenericConfig, c as resolveCapabilityAgentOption, f as resolveSelectedProviderFromModelRef, l as resolveCapabilityProviderAgentId, n as parseOptionalPositiveInteger, o as registerLocalProvidersCommand, r as parseOptionalTimeoutMs, s as requireProviderModelOverride, u as resolveLocalCapabilityRuntimeConfig } from "./shared-Bg3km3d1.mjs";
import { t as collectOption } from "./helpers-BuPKARfv.mjs";
import { n as writeOutputAsset, t as readInputFiles } from "./media-output-bSZ5YjIO.mjs";
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
	requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, `infer ${params.capability}`);
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const agentDir = resolveAgentDir(cfg, agentId);
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
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: `infer ${params.capability}`,
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, `infer ${params.capability}`);
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const agentDir = resolveAgentDir(cfg, agentId);
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
function resolveImageGenerationOptions(opts, command) {
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
	addImageGenerationOptions(image.command("generate").description("Generate images").requiredOption("--prompt <text>", "Prompt text")).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runImageGenerate({
				capability: "image.generate",
				prompt: String(opts.prompt),
				...resolveImageGenerationOptions(opts, command)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	addImageGenerationOptions(image.command("edit").description("Edit images with one or more input files").requiredOption("--file <path>", "Input file", collectOption).requiredOption("--prompt <text>", "Prompt text")).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const files = Array.isArray(opts.file) ? opts.file : [String(opts.file)];
			const result = await runImageGenerate({
				capability: "image.edit",
				prompt: String(opts.prompt),
				file: files,
				...resolveImageGenerationOptions(opts, command)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	for (const [commandName, description] of [["describe", "Describe one image file"], ["describe-many", "Describe multiple image files"]]) {
		const describe = image.command(commandName).description(description);
		const multiple = commandName === "describe-many";
		if (multiple) describe.requiredOption("--file <path>", "Image file", collectOption);
		else describe.requiredOption("--file <path>", "Image file");
		describe.option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
			await runCommandWithRuntime(defaultRuntime, async () => {
				const result = await runImageDescribe({
					capability: `image.${commandName}`,
					files: multiple ? opts.file : [String(opts.file)],
					model: opts.model,
					prompt: opts.prompt,
					timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
					agent: resolveCapabilityAgentOption(command, opts.agent)
				});
				emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
			});
		});
	}
	registerLocalProvidersCommand(image, "List image generation providers", (cfg, agentId) => {
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
