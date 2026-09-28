import { F as resolveTimerTimeoutMs, d as asPositiveSafeInteger, o as asDateTimestampMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as toAgentModelListLike } from "./model-input-DKxKaZGG.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { f as readProviderJsonArrayFieldResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-BSynTdAu.mjs";
import "./model-auth-D3hh0-wa.mjs";
import { t as runAbortableTimeout } from "./with-timeout-DGbC_uh0.mjs";
import { r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import "./ai-transport-host-DPaGzfm6.mjs";
import { i as withProgressTotals } from "./progress-BQygak_O.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-Di2tA0mA.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { _ as truncate, g as padTerminalCell, m as formatTokenK, r as formatMs, u as updateConfig } from "./shared-yzzedLUF.mjs";
import { t as loadModelsConfig } from "./load-config-CQ4HhFsY.mjs";
import { t as inferParamBFromIdOrName } from "./model-param-b-DBLunvNX.mjs";
import { Type } from "typebox";
import pMap from "p-map";
import { getEnvApiKey } from "@openclaw/ai/internal/runtime";
import { createLlmRuntime } from "@openclaw/ai";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
import { cancel, multiselect } from "@clack/prompts";
//#region src/agents/model-scan.ts
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const DEFAULT_TIMEOUT_MS = 12e3;
const DEFAULT_CONCURRENCY = 3;
const OPENROUTER_MODELS_BODY_MAX_BYTES = 16777216;
const BASE_IMAGE_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X3mIAAAAASUVORK5CYII=";
const TOOL_PING = {
	name: "ping",
	description: "Return OK.",
	parameters: Type.Object({})
};
function normalizeCreatedAtMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	if (value <= 0) return null;
	const timestampMs = value > 0xe8d4a51000 ? Math.round(value) : Math.round(value * 1e3);
	return asDateTimestampMs(timestampMs) ?? null;
}
function parseModality(modality) {
	if (!modality) return ["text"];
	return normalizeLowercaseStringOrEmpty(modality).split(/[^a-z]+/).filter(Boolean).includes("image") ? ["text", "image"] : ["text"];
}
function parseNumberString(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const num = Number(trimmed);
	if (!Number.isFinite(num)) return null;
	return num;
}
function parseOpenRouterPricing(value) {
	if (!value || typeof value !== "object") return null;
	const obj = value;
	const prompt = parseNumberString(obj.prompt);
	const completion = parseNumberString(obj.completion);
	const request = parseNumberString(obj.request) ?? 0;
	const image = parseNumberString(obj.image) ?? 0;
	const webSearch = parseNumberString(obj.web_search) ?? 0;
	const internalReasoning = parseNumberString(obj.internal_reasoning) ?? 0;
	if (prompt === null || completion === null) return null;
	return {
		prompt,
		completion,
		request,
		image,
		webSearch,
		internalReasoning
	};
}
function isFreeOpenRouterModel(entry) {
	if (entry.id.endsWith(":free")) return true;
	if (!entry.pricing) return false;
	return entry.pricing.prompt === 0 && entry.pricing.completion === 0;
}
async function fetchOpenRouterModels(fetchImpl, timeoutMs) {
	let res;
	try {
		return await runAbortableTimeout(async (signal) => {
			res = await fetchImpl(OPENROUTER_MODELS_URL, {
				headers: { Accept: "application/json" },
				signal
			});
			if (!res.ok) throw new Error(`OpenRouter /models failed: HTTP ${res.status}`);
			return (await readProviderJsonArrayFieldResponse(res, "OpenRouter /models", "data", {
				maxBytes: OPENROUTER_MODELS_BODY_MAX_BYTES,
				chunkTimeoutMs: timeoutMs,
				onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`OpenRouter /models response stalled after ${chunkTimeoutMs}ms`)
			})).map((entry) => {
				if (!entry || typeof entry !== "object") return null;
				const obj = entry;
				const id = normalizeOptionalString(obj.id) ?? "";
				if (!id) return null;
				const name = typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : id;
				const topProvider = asOptionalRecord(obj.top_provider);
				const contextLength = asPositiveSafeInteger(topProvider?.context_length) ?? asPositiveSafeInteger(obj.context_length) ?? null;
				const maxCompletionTokens = asPositiveSafeInteger(topProvider?.max_completion_tokens) ?? asPositiveSafeInteger(obj.max_completion_tokens) ?? asPositiveSafeInteger(obj.max_output_tokens) ?? null;
				const supportedParameters = Array.isArray(obj.supported_parameters) ? normalizeStringEntries(obj.supported_parameters.filter((value) => typeof value === "string")) : [];
				return {
					id,
					name,
					contextLength,
					maxCompletionTokens,
					supportedParameters,
					supportedParametersCount: supportedParameters.length,
					supportsToolsMeta: supportedParameters.includes("tools"),
					modality: typeof obj.modality === "string" && obj.modality.trim() ? obj.modality.trim() : null,
					inferredParamB: inferParamBFromIdOrName(`${id} ${name}`),
					createdAtMs: normalizeCreatedAtMs(obj.created_at),
					pricing: parseOpenRouterPricing(obj.pricing)
				};
			}).filter((entry) => Boolean(entry));
		}, timeoutMs, "OpenRouter model scan");
	} finally {
		await cancelUnreadResponseBody(res);
	}
}
async function probeTool(model, apiKey, timeoutMs, complete) {
	const context = {
		messages: [{
			role: "user",
			content: "Call the ping tool with {} and nothing else.",
			timestamp: Date.now()
		}],
		tools: [TOOL_PING]
	};
	const startedAt = Date.now();
	try {
		if (!(await runAbortableTimeout((signal) => complete(model, context, {
			apiKey,
			maxTokens: 256,
			temperature: 0,
			toolChoice: "required",
			signal
		}), timeoutMs, "model tool probe")).content.some((block) => block.type === "toolCall")) return {
			ok: false,
			latencyMs: Date.now() - startedAt,
			error: "No tool call returned"
		};
		return {
			ok: true,
			latencyMs: Date.now() - startedAt
		};
	} catch (err) {
		return {
			ok: false,
			latencyMs: Date.now() - startedAt,
			error: formatErrorMessage(err)
		};
	}
}
async function probeImage(model, apiKey, timeoutMs, complete) {
	const context = { messages: [{
		role: "user",
		content: [{
			type: "text",
			text: "Reply with OK."
		}, {
			type: "image",
			data: BASE_IMAGE_PNG,
			mimeType: "image/png"
		}],
		timestamp: Date.now()
	}] };
	const startedAt = Date.now();
	try {
		await runAbortableTimeout((signal) => complete(model, context, {
			apiKey,
			maxTokens: 16,
			temperature: 0,
			signal
		}), timeoutMs, "model image probe");
		return {
			ok: true,
			latencyMs: Date.now() - startedAt
		};
	} catch (err) {
		return {
			ok: false,
			latencyMs: Date.now() - startedAt,
			error: formatErrorMessage(err)
		};
	}
}
function ensureImageInput(model) {
	if (model.input?.includes("image")) return model;
	return {
		...model,
		input: uniqueStrings([...model.input ?? [], "image"])
	};
}
function buildOpenRouterScanResult(params) {
	const { entry, isFree } = params;
	return {
		id: entry.id,
		name: entry.name,
		provider: "openrouter",
		modelRef: `openrouter/${entry.id}`,
		contextLength: entry.contextLength,
		maxCompletionTokens: entry.maxCompletionTokens,
		supportedParametersCount: entry.supportedParametersCount,
		supportsToolsMeta: entry.supportsToolsMeta,
		modality: entry.modality,
		inferredParamB: entry.inferredParamB,
		createdAtMs: entry.createdAtMs,
		pricing: entry.pricing,
		isFree,
		tool: params.tool,
		image: params.image
	};
}
async function scanOpenRouterModels(options = {}) {
	const fetchImpl = options.fetchImpl ?? fetch;
	const probe = options.probe ?? true;
	const apiKey = options.apiKey?.trim() || getEnvApiKey("openrouter") || "";
	if (probe && !apiKey) throw new Error("Missing OpenRouter API key. Free OpenRouter models still require OPENROUTER_API_KEY for live probes and inference; call with probe:false to list public catalog metadata.");
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_TIMEOUT_MS);
	const concurrency = Math.max(1, Math.floor(options.concurrency ?? DEFAULT_CONCURRENCY));
	const minParamB = Math.max(0, Math.floor(options.minParamB ?? 0));
	const maxAgeDays = Math.max(0, Math.floor(options.maxAgeDays ?? 0));
	const providerFilter = normalizeProviderId(options.providerFilter ?? "");
	const catalog = await fetchOpenRouterModels(fetchImpl, timeoutMs);
	const llmRuntime = createLlmRuntime();
	registerBuiltInApiProviders(llmRuntime.registry);
	const now = Date.now();
	const filtered = catalog.filter((entry) => {
		if (!isFreeOpenRouterModel(entry)) return false;
		if (providerFilter) {
			if (normalizeProviderId(entry.id.split("/")[0] ?? "") !== providerFilter) return false;
		}
		if (minParamB > 0) {
			if ((entry.inferredParamB ?? 0) < minParamB) return false;
		}
		if (maxAgeDays > 0 && entry.createdAtMs) {
			if ((now - entry.createdAtMs) / 864e5 > maxAgeDays) return false;
		}
		return true;
	});
	const baseModel = {
		id: "openrouter/auto",
		name: "OpenRouter Auto",
		api: "openai-completions",
		provider: "openrouter",
		baseUrl: "https://openrouter.ai/api/v1",
		reasoning: false,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 128e3,
		maxTokens: 16384
	};
	options.onProgress?.({
		phase: "probe",
		completed: 0,
		total: filtered.length
	});
	let completed = 0;
	return pMap(filtered, async (entry) => {
		const isFree = isFreeOpenRouterModel(entry);
		let result;
		if (!probe) result = buildOpenRouterScanResult({
			entry,
			isFree,
			tool: {
				ok: false,
				latencyMs: null,
				skipped: true
			},
			image: {
				ok: false,
				latencyMs: null,
				skipped: true
			}
		});
		else {
			const model = {
				...baseModel,
				id: entry.id,
				name: entry.name || entry.id,
				contextWindow: entry.contextLength ?? baseModel.contextWindow,
				maxTokens: entry.maxCompletionTokens ?? baseModel.maxTokens,
				input: parseModality(entry.modality),
				reasoning: baseModel.reasoning
			};
			result = buildOpenRouterScanResult({
				entry,
				isFree,
				tool: await probeTool(model, apiKey, timeoutMs, llmRuntime.complete),
				image: model.input?.includes("image") ? await probeImage(ensureImageInput(model), apiKey, timeoutMs, llmRuntime.complete) : {
					ok: false,
					latencyMs: null,
					skipped: true
				}
			});
		}
		completed += 1;
		options.onProgress?.({
			phase: "probe",
			completed,
			total: filtered.length
		});
		return result;
	}, {
		concurrency,
		stopOnError: true
	});
}
//#endregion
//#region src/commands/models/scan.ts
/** OpenRouter free-model scanner and fallback updater for model commands. */
const MODEL_PAD = 42;
const CTX_PAD = 8;
const multiselect$1 = (params) => multiselect(styleSelectParams(params));
function guardPromptCancel(value, runtime) {
	if (typeof value === "symbol") {
		cancel(stylePromptTitle("Model scan cancelled.") ?? "Model scan cancelled.");
		runtime.exit(0);
		throw new Error("unreachable");
	}
	return value;
}
function sortScanResults(results) {
	return results.slice().toSorted((a, b) => {
		const aImage = a.image.ok ? 1 : 0;
		const bImage = b.image.ok ? 1 : 0;
		if (aImage !== bImage) return bImage - aImage;
		const aToolLatency = a.tool.latencyMs ?? Number.POSITIVE_INFINITY;
		const bToolLatency = b.tool.latencyMs ?? Number.POSITIVE_INFINITY;
		if (aToolLatency !== bToolLatency) return aToolLatency - bToolLatency;
		return compareScanMetadata(a, b);
	});
}
function sortImageResults(results) {
	return results.slice().toSorted((a, b) => {
		const aLatency = a.image.latencyMs ?? Number.POSITIVE_INFINITY;
		const bLatency = b.image.latencyMs ?? Number.POSITIVE_INFINITY;
		if (aLatency !== bLatency) return aLatency - bLatency;
		return compareScanMetadata(a, b);
	});
}
function compareScanMetadata(a, b) {
	const aCtx = a.contextLength ?? 0;
	const bCtx = b.contextLength ?? 0;
	if (aCtx !== bCtx) return bCtx - aCtx;
	const aParams = a.inferredParamB ?? 0;
	const bParams = b.inferredParamB ?? 0;
	if (aParams !== bParams) return bParams - aParams;
	return a.modelRef.localeCompare(b.modelRef);
}
function buildScanHint(result) {
	return [
		result.tool.skipped ? "tool skip" : result.tool.ok ? `tool ${formatMs(result.tool.latencyMs)}` : "tool fail",
		result.image.skipped ? "img skip" : result.image.ok ? `img ${formatMs(result.image.latencyMs)}` : "img fail",
		result.contextLength ? `ctx ${formatTokenK(result.contextLength)}` : "ctx ?",
		result.inferredParamB ? `${result.inferredParamB}b` : null
	].filter(Boolean).join(" | ");
}
function printScanSummary(results, runtime) {
	const toolOk = results.filter((r) => r.tool.ok);
	const imageOk = results.filter((r) => r.image.ok);
	const toolImageOk = results.filter((r) => r.tool.ok && r.image.ok);
	const imageOnly = imageOk.filter((r) => !r.tool.ok);
	runtime.log(`Scan results: tested ${results.length}, tool ok ${toolOk.length}, image ok ${imageOk.length}, tool+image ok ${toolImageOk.length}, image only ${imageOnly.length}`);
}
function printMetadataOnlyNotice(params) {
	if (params.autoDowngraded) params.runtime.log("OpenRouter free models still require OPENROUTER_API_KEY for live probes and inference. Listing public catalog metadata only.");
	params.runtime.log(`Found ${params.results.length} OpenRouter free models (metadata only; configure OPENROUTER_API_KEY to test tools/images).`);
}
function printScanTable(results, runtime) {
	const header = [
		padTerminalCell("Model", MODEL_PAD),
		padTerminalCell("Tool", 10),
		padTerminalCell("Image", 10),
		padTerminalCell("Ctx", CTX_PAD),
		padTerminalCell("Params", 8),
		"Notes"
	].join(" ");
	runtime.log(header);
	for (const entry of results) {
		const modelLabel = padTerminalCell(truncate(entry.modelRef, MODEL_PAD), MODEL_PAD);
		const toolLabel = padTerminalCell(entry.tool.skipped ? "skip" : entry.tool.ok ? formatMs(entry.tool.latencyMs) : "fail", 10);
		const imageLabel = padTerminalCell(entry.image.ok ? formatMs(entry.image.latencyMs) : entry.image.skipped ? "skip" : "fail", 10);
		const ctxLabel = padTerminalCell(formatTokenK(entry.contextLength), CTX_PAD);
		const paramsLabel = padTerminalCell(entry.inferredParamB ? `${entry.inferredParamB}b` : "-", 8);
		const notes = entry.modality ? `modality:${sanitizeTerminalText(entry.modality)}` : "";
		runtime.log([
			modelLabel,
			toolLabel,
			imageLabel,
			ctxLabel,
			paramsLabel,
			notes
		].join(" "));
	}
}
function parseOptionalNonNegativeFiniteOption(raw, label) {
	if (raw === void 0 || raw === null) return;
	const parsed = parseStrictFiniteNumber(raw);
	if (parsed === void 0 || parsed < 0) throw new Error(`${label} must be >= 0`);
	return parsed;
}
function parseOptionalPositiveFiniteOption(raw, label) {
	if (raw === void 0 || raw === null) return;
	const parsed = parseStrictFiniteNumber(raw);
	if (parsed === void 0 || parsed <= 0) throw new Error(`${label} must be > 0`);
	return parsed;
}
function parsePositiveIntegerOption(raw, label, fallback) {
	if (raw === void 0 || raw === null) return fallback;
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error(`${label} must be a positive integer`);
	return parsed;
}
/** Scans OpenRouter candidates, optionally probes them, then writes fallback defaults. */
async function modelsScanCommand(opts, runtime) {
	const minParams = parseOptionalNonNegativeFiniteOption(opts.minParams, "--min-params");
	const maxAgeDays = parseOptionalNonNegativeFiniteOption(opts.maxAgeDays, "--max-age-days");
	const maxCandidates = parsePositiveIntegerOption(opts.maxCandidates, "--max-candidates", 6);
	const timeout = parseOptionalPositiveFiniteOption(opts.timeout, "--timeout");
	const concurrency = opts.concurrency === void 0 ? void 0 : parsePositiveIntegerOption(opts.concurrency, "--concurrency", 1);
	const requestedProbe = opts.probe ?? true;
	if (!requestedProbe && (opts.setDefault || opts.setImage)) throw new Error("Cannot apply metadata-only OpenRouter scan results. Remove --no-probe or configure OPENROUTER_API_KEY and rerun with probes before changing defaults.");
	let probe = requestedProbe;
	let storedKey;
	if (requestedProbe) {
		storedKey = getEnvApiKey("openrouter")?.trim() || void 0;
		if (!storedKey) try {
			const cfg = await loadModelsConfig({ commandName: "models scan" });
			storedKey = (await resolveApiKeyForProviderCore({
				provider: "openrouter",
				cfg
			})).apiKey?.trim() || void 0;
		} catch {
			storedKey = void 0;
		}
		if (!storedKey) {
			if (opts.setDefault || opts.setImage) throw new Error("Cannot apply metadata-only OpenRouter scan results. Configure OPENROUTER_API_KEY and rerun with probes before changing defaults.");
			probe = false;
		}
	}
	const results = await withProgressTotals({
		label: "Scanning OpenRouter models...",
		indeterminate: false,
		enabled: opts.json !== true
	}, async (update) => await scanOpenRouterModels({
		apiKey: storedKey ?? void 0,
		minParamB: minParams,
		maxAgeDays,
		providerFilter: opts.provider,
		timeoutMs: timeout,
		concurrency,
		probe,
		onProgress: ({ phase, completed, total }) => {
			if (phase !== "probe") return;
			update({
				completed,
				total,
				label: `${probe ? "Probing models" : "Scanning models"} (${completed}/${total})`
			});
		}
	}));
	const sorted = sortScanResults(results);
	if (!probe) {
		if (!opts.json) {
			printMetadataOnlyNotice({
				results,
				runtime,
				autoDowngraded: requestedProbe
			});
			printScanTable(sorted, runtime);
		} else writeRuntimeJson(runtime, sorted);
		return;
	}
	const toolOk = results.filter((entry) => entry.tool.ok);
	if (toolOk.length === 0) throw new Error(`No tool-capable OpenRouter free models found. Try ${formatCliCommand("openclaw models scan --no-probe")} to inspect metadata-only candidates, or configure OPENROUTER_API_KEY before probing.`);
	const toolSorted = sortScanResults(toolOk);
	const imageSorted = sortImageResults(results.filter((entry) => entry.image.ok));
	const imagePreferred = toolSorted.filter((entry) => entry.image.ok);
	const preselected = (imagePreferred.length > 0 ? imagePreferred : toolSorted).slice(0, Math.floor(maxCandidates)).map((entry) => entry.modelRef);
	const imagePreselected = imageSorted.slice(0, Math.floor(maxCandidates)).map((entry) => entry.modelRef);
	if (!opts.json) {
		printScanSummary(results, runtime);
		printScanTable(sorted, runtime);
	}
	const noInput = opts.input === false;
	const canPrompt = process.stdin.isTTY && !opts.yes && !noInput && !opts.json;
	let selected = preselected;
	let selectedImages = imagePreselected;
	if (canPrompt) {
		selected = guardPromptCancel(await multiselect$1({
			message: "Select fallback models (ordered)",
			options: toolSorted.map((entry) => ({
				value: entry.modelRef,
				label: entry.modelRef,
				hint: buildScanHint(entry)
			})),
			initialValues: preselected
		}), runtime);
		if (imageSorted.length > 0) selectedImages = guardPromptCancel(await multiselect$1({
			message: "Select image fallback models (ordered)",
			options: imageSorted.map((entry) => ({
				value: entry.modelRef,
				label: entry.modelRef,
				hint: buildScanHint(entry)
			})),
			initialValues: imagePreselected
		}), runtime);
	} else if (!process.stdin.isTTY && !opts.yes && !noInput && !opts.json) throw new Error("Non-interactive scan: pass --yes to apply defaults.");
	if (selected.length === 0) throw new Error("No models selected for fallbacks.");
	if (opts.setImage && selectedImages.length === 0) throw new Error("No image-capable models selected for image model.");
	await updateConfig((cfg) => {
		const nextModels = { ...cfg.agents?.defaults?.models };
		for (const entry of selected) if (!nextModels[entry]) nextModels[entry] = {};
		for (const entry of selectedImages) if (!nextModels[entry]) nextModels[entry] = {};
		const existingImageModel = toAgentModelListLike(cfg.agents?.defaults?.imageModel);
		const nextImageModel = selectedImages.length > 0 ? {
			...existingImageModel?.primary ? { primary: existingImageModel.primary } : void 0,
			fallbacks: selectedImages,
			...opts.setImage ? { primary: selectedImages[0] } : {}
		} : cfg.agents?.defaults?.imageModel;
		const existingModel = toAgentModelListLike(cfg.agents?.defaults?.model);
		const defaults = {
			...cfg.agents?.defaults,
			model: {
				...existingModel?.primary ? { primary: existingModel.primary } : void 0,
				fallbacks: selected,
				...opts.setDefault ? { primary: selected[0] } : {}
			},
			...nextImageModel ? { imageModel: nextImageModel } : {},
			models: nextModels
		};
		return {
			...cfg,
			agents: {
				...cfg.agents,
				defaults
			}
		};
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			selected,
			selectedImages,
			setDefault: Boolean(opts.setDefault),
			setImage: Boolean(opts.setImage),
			results: sorted,
			warnings: []
		});
		return;
	}
	logConfigUpdated(runtime);
	runtime.log(`Fallbacks: ${selected.join(", ")}`);
	if (selectedImages.length > 0) runtime.log(`Image fallbacks: ${selectedImages.join(", ")}`);
	if (opts.setDefault) runtime.log(`Default model: ${selected[0]}`);
	if (opts.setImage && selectedImages.length > 0) runtime.log(`Image model: ${selectedImages[0]}`);
}
//#endregion
export { modelsScanCommand };
