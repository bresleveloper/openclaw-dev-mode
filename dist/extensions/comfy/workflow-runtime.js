import { randomInt } from "node:crypto";
import fs from "node:fs/promises";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { assertOkOrThrowHttpError, readProviderBinaryResponse, readProviderJsonResponse, redactProviderResponseErrorText, resolveProviderHttpRequestConfig } from "openclaw/plugin-sdk/provider-http";
import { normalizeSecretInputString, resolveConfiguredSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input-runtime";
import { canResolveEnvSecretRefInReadOnlyPath } from "openclaw/plugin-sdk/secret-ref-readonly";
import { fetchWithSsrFGuard, isPrivateOrLoopbackHost, mergeSsrFPolicies, ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
import { asBoolean, isRecord, normalizeOptionalLowercaseString, normalizeOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/comfy/workflow-runtime.ts
const DEFAULT_COMFY_LOCAL_BASE_URL = "http://127.0.0.1:8188";
const DEFAULT_COMFY_CLOUD_BASE_URL = "https://cloud.comfy.org";
const DEFAULT_POLL_INTERVAL_MS = 1500;
const DEFAULT_TIMEOUT_MS = 3e5;
const RANDOM_SEED_EXCLUSIVE_MAX = 2 ** 48 - 1;
const DEFAULT_COMFY_MODEL = "workflow";
function readConfigInteger(config, key) {
	const value = config[key];
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function getComfyConfig(cfg) {
	const pluginConfig = cfg?.plugins?.entries?.comfy?.config;
	if (isRecord(pluginConfig)) return {
		config: pluginConfig,
		path: "plugins.entries.comfy.config"
	};
	const legacyConfig = cfg?.models?.providers?.comfy;
	return {
		config: isRecord(legacyConfig) ? legacyConfig : {},
		path: "models.providers.comfy"
	};
}
function getComfyCapabilityConfig(config, capability) {
	const shared = { ...config };
	delete shared.image;
	delete shared.video;
	delete shared.music;
	const nested = config[capability];
	return isRecord(nested) ? {
		...shared,
		...nested
	} : shared;
}
function resolveComfyMode(config) {
	return normalizeOptionalString(config.mode) === "cloud" ? "cloud" : "local";
}
function resolveComfyApiKey(config, cfg) {
	const resolved = resolveSecretInputString({
		value: config.apiKey,
		path: "plugins.entries.comfy.config.apiKey",
		defaults: cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") {
		const apiKey = normalizeSecretInputString(resolved.value);
		return apiKey ? {
			status: "available",
			apiKey
		} : { status: "missing" };
	}
	if (resolved.status === "configured_unavailable") {
		if (resolved.ref.source !== "env") return { status: "configured_unavailable" };
		const envVarName = resolved.ref.id.trim();
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg,
			provider: resolved.ref.provider,
			id: envVarName
		})) return { status: "configured_unavailable" };
		const apiKey = normalizeSecretInputString(process.env[envVarName]);
		return apiKey ? {
			status: "available",
			apiKey
		} : { status: "configured_unavailable" };
	}
	return { status: "missing" };
}
async function loadComfyWorkflow(config) {
	const workflow = config.workflow;
	if (isRecord(workflow)) return structuredClone(workflow);
	const workflowPath = normalizeOptionalString(config.workflowPath);
	if (!workflowPath) throw new Error("plugins.entries.comfy.config.<capability>.workflow or workflowPath is required");
	const resolvedPath = resolveUserPath(workflowPath);
	const raw = await fs.readFile(resolvedPath, "utf8");
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed)) throw new Error(`Comfy workflow at ${resolvedPath} must be a JSON object`);
	return parsed;
}
function setWorkflowInput(workflow, nodeId, inputName, value) {
	const node = workflow[nodeId];
	if (!isRecord(node)) throw new Error(`Comfy workflow missing node "${nodeId}"`);
	const inputs = node.inputs;
	if (!isRecord(inputs)) throw new Error(`Comfy workflow node "${nodeId}" is missing an inputs object`);
	inputs[inputName] = value;
}
async function resolveComfyHeadersConfig(value, cfg, configPath) {
	const headers = new Headers();
	if (!isRecord(value)) return headers;
	for (const [name, headerValue] of Object.entries(value)) {
		const path = `${configPath}.headers[${JSON.stringify(name)}]`;
		const resolved = await resolveConfiguredSecretInputString({
			config: cfg,
			env: process.env,
			value: headerValue,
			path,
			unresolvedReasonStyle: "detailed"
		});
		if (resolved.unresolvedRefReason) throw new Error(`${path} references an unavailable secret: ${resolved.unresolvedRefReason}`);
		if (resolved.value) headers.set(name, resolved.value);
	}
	return headers;
}
function resolveComfyNetworkPolicy(params) {
	const parsed = URL.parse(params.baseUrl);
	if (!parsed) return;
	const hostname = normalizeOptionalLowercaseString(parsed.hostname) ?? "";
	if (!hostname) return;
	const localHostnamePolicy = params.mode === "local" ? { hostnameAllowlist: [hostname] } : void 0;
	if (!params.allowPrivateNetwork) return localHostnamePolicy;
	if (!params.explicitAllowPrivateNetwork && params.mode !== "local") return;
	if (!params.explicitAllowPrivateNetwork && params.mode === "local" && !isPrivateOrLoopbackHost(hostname) && !isSingleLabelServiceHostname(hostname)) return localHostnamePolicy;
	const originPolicy = ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.baseUrl);
	if (!originPolicy) return localHostnamePolicy;
	return params.mode === "local" ? mergeSsrFPolicies(originPolicy, localHostnamePolicy) : originPolicy;
}
function isSingleLabelServiceHostname(hostname) {
	return /^[a-z0-9_](?:[a-z0-9_-]{0,61}[a-z0-9_])?$/u.test(hostname);
}
async function readJsonResponse(params) {
	const { errorPrefix, ...request } = params;
	const { response, release } = await fetchWithSsrFGuard(request);
	try {
		const requestHeaders = params.init?.headers;
		await assertOkOrThrowHttpError(response, errorPrefix, { requestHeaders });
		return await readProviderJsonResponse(response, errorPrefix, { requestHeaders });
	} finally {
		await release();
	}
}
async function uploadInputImage(params) {
	const form = new FormData();
	form.set("image", new Blob([bufferToBlobPart(params.image.buffer)], { type: params.image.mimeType }), normalizeOptionalString(params.image.fileName) || `input.${extensionForMime(params.image.mimeType)?.slice(1) || "bin"}`);
	form.set("type", "input");
	form.set("overwrite", "true");
	const headers = new Headers(params.headers);
	headers.delete("Content-Type");
	const payload = await readJsonResponse({
		url: `${params.baseUrl}${params.mode === "cloud" ? "/api/upload/image" : "/upload/image"}`,
		init: {
			method: "POST",
			headers,
			body: form
		},
		timeoutMs: params.timeoutMs,
		policy: params.policy,
		dispatcherPolicy: params.dispatcherPolicy,
		auditContext: `comfy-${params.capability}-upload`,
		errorPrefix: "Comfy image upload failed"
	});
	const uploadedName = normalizeOptionalString(payload.filename) || normalizeOptionalString(payload.name);
	if (!uploadedName) throw new Error("Comfy image upload response missing filename");
	return uploadedName;
}
function extractHistoryEntry(history, promptId) {
	if (!isRecord(history)) return null;
	const directOutputs = history.outputs;
	if (isRecord(directOutputs)) return history;
	const nested = history[promptId];
	if (isRecord(nested)) return nested;
	return null;
}
async function waitForComfyHistory(params) {
	const deadline = Date.now() + params.timeoutMs;
	const read = (path, kind, timeoutMs) => readJsonResponse({
		url: `${params.baseUrl}${path}`,
		init: {
			method: "GET",
			headers: params.headers
		},
		timeoutMs,
		policy: params.policy,
		dispatcherPolicy: params.dispatcherPolicy,
		auditContext: `comfy-${kind}`,
		errorPrefix: `Comfy ${kind} lookup failed`
	});
	for (;;) {
		const requestTimeoutMs = resolveComfyRemainingMs(deadline, params.timeoutMs);
		if (params.mode === "cloud") {
			const status = await read(`/api/job/${params.promptId}/status`, "status", requestTimeoutMs);
			if (status.status === "completed") return await read(`/api/history_v2/${params.promptId}`, "history", params.timeoutMs);
			if (status.status === "failed" || status.status === "cancelled") {
				const detail = redactProviderResponseErrorText(status.error ?? status.message ?? params.promptId, params.headers);
				throw new Error(`Comfy workflow ${status.status}: ${detail}`);
			}
		} else {
			const entry = extractHistoryEntry(await read(`/history/${params.promptId}`, "history", requestTimeoutMs), params.promptId);
			if (entry?.outputs && Object.keys(entry.outputs).length > 0) return entry;
		}
		const pollDelayMs = resolveComfyRemainingMs(deadline, params.timeoutMs, params.pollIntervalMs);
		await new Promise((resolve) => {
			setTimeout(resolve, pollDelayMs);
		});
	}
}
function resolveComfyRemainingMs(deadline, timeoutMs, defaultTimeoutMs = timeoutMs) {
	const defaultMs = resolvePositiveTimerTimeoutMs(defaultTimeoutMs, 1);
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) throw new Error(`Comfy workflow did not finish within ${Math.ceil(timeoutMs / 1e3)}s`);
	return Math.max(1, Math.min(defaultMs, remainingMs));
}
function collectOutputFiles(params) {
	const outputs = params.history.outputs;
	if (!outputs) return [];
	const nodeIds = params.outputNodeId ? [params.outputNodeId] : Object.keys(outputs);
	const files = [];
	for (const nodeId of nodeIds) {
		const entry = outputs[nodeId];
		if (!entry) continue;
		for (const kind of params.outputKinds) {
			const bucket = entry[kind];
			if (!Array.isArray(bucket)) continue;
			for (const file of bucket) {
				if (params.capability === "video" && kind === "images") {
					const fileName = normalizeOptionalString(file.filename) || normalizeOptionalString(file.name);
					if (!fileName || !/\.(?:mp4|webm)$/i.test(fileName)) continue;
				}
				files.push({
					nodeId,
					file
				});
			}
		}
	}
	return files;
}
async function downloadOutputFile(params) {
	const fileName = normalizeOptionalString(params.file.filename) || normalizeOptionalString(params.file.name);
	if (!fileName) throw new Error("Comfy output entry missing filename");
	const query = new URLSearchParams({
		filename: fileName,
		subfolder: normalizeOptionalString(params.file.subfolder) ?? "",
		type: normalizeOptionalString(params.file.type) ?? "output"
	});
	const viewPath = params.mode === "cloud" ? "/api/view" : "/view";
	const auditContext = `comfy-${params.capability}-download`;
	const firstResponse = await fetchWithSsrFGuard({
		url: `${params.baseUrl}${viewPath}?${query.toString()}`,
		init: {
			method: "GET",
			headers: params.headers
		},
		timeoutMs: params.timeoutMs,
		policy: params.policy,
		dispatcherPolicy: params.dispatcherPolicy,
		auditContext
	});
	try {
		await assertOkOrThrowHttpError(firstResponse.response, "Comfy output download failed", { requestHeaders: params.headers });
		const mimeType = normalizeOptionalString(firstResponse.response.headers.get("content-type")) || "application/octet-stream";
		const downloadLabel = `Comfy ${params.capability} output download`;
		return {
			buffer: await readProviderBinaryResponse(firstResponse.response, downloadLabel, params.capability, {
				maxBytes: params.maxBytes,
				chunkTimeoutMs: params.timeoutMs,
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${downloadLabel} exceeds ${maxBytes} bytes`),
				onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${downloadLabel} stalled after ${chunkTimeoutMs}ms`)
			}),
			mimeType,
			fileName
		};
	} finally {
		await firstResponse.release();
	}
}
function hasUnavailableComfyHeaderSecret(value, cfg) {
	if (!isRecord(value)) return false;
	return Object.entries(value).some(([name, headerValue]) => {
		const inspected = resolveSecretInputString({
			value: headerValue,
			path: `plugins.entries.comfy.config.headers.${name}`,
			defaults: cfg?.secrets?.defaults,
			mode: "inspect"
		});
		if (inspected.status !== "configured_unavailable" || inspected.ref.source !== "env") return false;
		const envVarName = inspected.ref.id.trim();
		return !(canResolveEnvSecretRefInReadOnlyPath({
			cfg,
			provider: inspected.ref.provider,
			id: envVarName
		}) && Boolean(normalizeSecretInputString(process.env[envVarName])));
	});
}
function isComfyCapabilityConfigured(params) {
	const { config } = getComfyConfig(params.cfg);
	const capabilityConfig = getComfyCapabilityConfig(config, params.capability);
	const hasWorkflow = Boolean(isRecord(capabilityConfig.workflow) || normalizeOptionalString(capabilityConfig.workflowPath));
	const hasPromptNode = Boolean(normalizeOptionalString(capabilityConfig.promptNodeId));
	if (!hasWorkflow || !hasPromptNode) return false;
	if (hasUnavailableComfyHeaderSecret(capabilityConfig.headers, params.cfg)) return false;
	if (resolveComfyMode(capabilityConfig) === "local") return true;
	const configuredApiKey = resolveComfyApiKey(capabilityConfig, params.cfg);
	if (configuredApiKey.status === "available") return true;
	if (configuredApiKey.status === "configured_unavailable") return false;
	return isProviderApiKeyConfigured({
		provider: "comfy",
		cfg: params.cfg,
		agentDir: params.agentDir
	});
}
async function runComfyWorkflow(params) {
	const { config, path: configPath } = getComfyConfig(params.cfg);
	const capabilityConfig = getComfyCapabilityConfig(config, params.capability);
	const mode = resolveComfyMode(capabilityConfig);
	const workflow = await loadComfyWorkflow(capabilityConfig);
	const promptNodeId = normalizeOptionalString(capabilityConfig.promptNodeId);
	if (!promptNodeId) throw new Error("plugins.entries.comfy.config.promptNodeId is required");
	const promptInputName = normalizeOptionalString(capabilityConfig.promptInputName) ?? "text";
	const inputImageNodeId = normalizeOptionalString(capabilityConfig.inputImageNodeId);
	const inputImageInputName = normalizeOptionalString(capabilityConfig.inputImageInputName) ?? "image";
	const seedNodeId = normalizeOptionalString(capabilityConfig.seedNodeId);
	const seedInputName = normalizeOptionalString(capabilityConfig.seedInputName) ?? "seed";
	const outputNodeId = normalizeOptionalString(capabilityConfig.outputNodeId);
	const pollIntervalMs = resolvePositiveTimerTimeoutMs(readConfigInteger(capabilityConfig, "pollIntervalMs"), DEFAULT_POLL_INTERVAL_MS);
	const timeoutMs = resolvePositiveTimerTimeoutMs(readConfigInteger(capabilityConfig, "timeoutMs") ?? params.timeoutMs, DEFAULT_TIMEOUT_MS);
	const providerModel = normalizeOptionalString(params.model) || "workflow";
	setWorkflowInput(workflow, promptNodeId, promptInputName, params.prompt);
	if (seedNodeId) setWorkflowInput(workflow, seedNodeId, seedInputName, randomInt(RANDOM_SEED_EXCLUSIVE_MAX));
	const pluginApiKey = resolveComfyApiKey(capabilityConfig, params.cfg);
	const apiKey = mode === "cloud" ? pluginApiKey.status === "available" ? pluginApiKey.apiKey : pluginApiKey.status === "configured_unavailable" ? void 0 : (await resolveApiKeyForProvider({
		provider: "comfy",
		cfg: params.cfg,
		agentDir: params.agentDir,
		store: params.authStore
	})).apiKey : void 0;
	if (mode === "cloud" && !apiKey) throw new Error("Comfy Cloud API key missing");
	const explicitAllowPrivateNetwork = asBoolean(capabilityConfig.allowPrivateNetwork) === true;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: normalizeOptionalString(capabilityConfig.baseUrl),
		defaultBaseUrl: mode === "cloud" ? DEFAULT_COMFY_CLOUD_BASE_URL : DEFAULT_COMFY_LOCAL_BASE_URL,
		allowPrivateNetwork: mode === "local" || explicitAllowPrivateNetwork,
		headers: await resolveComfyHeadersConfig(capabilityConfig.headers, params.cfg, configPath),
		defaultHeaders: mode === "cloud" ? {
			"X-API-Key": apiKey ?? "",
			"Content-Type": "application/json"
		} : { "Content-Type": "application/json" },
		provider: "comfy",
		capability: params.capability === "music" ? "audio" : params.capability,
		transport: "http"
	});
	const networkPolicy = resolveComfyNetworkPolicy({
		baseUrl,
		allowPrivateNetwork,
		explicitAllowPrivateNetwork,
		mode
	});
	if (params.inputImage) {
		if (!inputImageNodeId) throw new Error("Comfy edit requests require plugins.entries.comfy.config.<capability>.inputImageNodeId to be configured");
		setWorkflowInput(workflow, inputImageNodeId, inputImageInputName, await uploadInputImage({
			baseUrl,
			headers: new Headers(headers),
			timeoutMs,
			policy: networkPolicy,
			dispatcherPolicy,
			image: params.inputImage,
			mode,
			capability: params.capability
		}));
	}
	const submitPayload = {
		prompt: workflow,
		...mode === "cloud" && apiKey ? { extra_data: { api_key_comfy_org: apiKey } } : {}
	};
	const promptResponse = await readJsonResponse({
		url: `${baseUrl}${mode === "cloud" ? "/api/prompt" : "/prompt"}`,
		init: {
			method: "POST",
			headers,
			body: JSON.stringify(submitPayload)
		},
		timeoutMs,
		policy: networkPolicy,
		dispatcherPolicy,
		auditContext: `comfy-${params.capability}-generate`,
		errorPrefix: "Comfy workflow submit failed"
	});
	const promptId = normalizeOptionalString(promptResponse.prompt_id);
	if (!promptId) throw new Error("Comfy workflow submit response missing prompt_id");
	const historyEntry = extractHistoryEntry(await waitForComfyHistory({
		baseUrl,
		promptId,
		headers: new Headers(headers),
		timeoutMs,
		pollIntervalMs,
		policy: networkPolicy,
		dispatcherPolicy,
		mode
	}), promptId);
	if (!historyEntry) throw new Error(`Comfy history response missing outputs for prompt ${promptId}`);
	const outputFiles = collectOutputFiles({
		history: historyEntry,
		outputNodeId,
		outputKinds: params.capability === "music" ? ["audio"] : params.capability === "video" ? [
			"images",
			"gifs",
			"videos"
		] : ["images"],
		capability: params.capability
	});
	if (outputFiles.length === 0) throw new Error(`Comfy workflow ${promptId} completed without ${params.capability} outputs`);
	const assets = [];
	const outputKind = params.capability === "music" ? "audio" : params.capability;
	const maxOutputBytes = resolveGeneratedMediaMaxBytes(params.cfg, outputKind);
	for (const output of outputFiles) {
		const downloaded = await downloadOutputFile({
			baseUrl,
			headers: new Headers(headers),
			timeoutMs,
			policy: networkPolicy,
			dispatcherPolicy,
			file: output.file,
			mode,
			capability: params.capability,
			maxBytes: maxOutputBytes
		});
		assets.push({
			...downloaded,
			metadata: {
				nodeId: output.nodeId,
				promptId
			}
		});
	}
	return {
		assets,
		model: providerModel,
		metadata: {
			promptId,
			outputNodeIds: uniqueStrings(outputFiles.map((entry) => entry.nodeId))
		}
	};
}
//#endregion
export { DEFAULT_COMFY_MODEL, isComfyCapabilityConfigured, runComfyWorkflow };
