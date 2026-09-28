import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { c as readFiniteNumberParam, d as readPositiveIntegerParam, h as readToolStringParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./channel-actions-BjxmEiuN.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./param-readers-BfezLD6d.mjs";
import { o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-Dkg1KktH.mjs";
import { b as throwIfOllamaRequestAborted, c as enrichOllamaModelsWithContext, l as fetchLoadedOllamaModelNames, n as buildOllamaBaseUrlSsrFPolicy, p as isOllamaRemoteModel, s as enrichOllamaCompletionModels, u as fetchOllamaModels, y as resolveOllamaApiBase } from "./provider-models-DGKSrDJa.mjs";
import { a as MAX_SYSTEM_PROMPT_CHARS, c as OLLAMA_MODELS_COMMAND, f as ollamaNodeInferenceToolDefinition, i as MAX_PROMPT_CHARS, l as OLLAMA_NODE_INFERENCE_CAPABILITY, n as DISCOVERY_TRANSPORT_TIMEOUT_MS, s as OLLAMA_CHAT_COMMAND } from "./node-inference-contract-D1sQshq_.mjs";
//#region extensions/ollama/src/node-inference.ts
const MAX_ERROR_BODY_BYTES = 500;
function readNodeCommandParams(paramsJSON) {
	if (!paramsJSON) return {};
	const parsed = asNullableRecord(JSON.parse(paramsJSON));
	if (!parsed) throw new Error("node inference params must be a JSON object");
	return parsed;
}
function durationMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.round(value / 1e6 * 100) / 100;
}
async function requestOllamaJson(params) {
	const apiBase = resolveOllamaApiBase(params.baseUrl);
	let response;
	let release;
	try {
		const guarded = await fetchWithSsrFGuard({
			url: `${apiBase}${params.path}`,
			init: params.init,
			timeoutMs: params.timeoutMs,
			...params.signal ? { signal: params.signal } : {},
			policy: buildOllamaBaseUrlSsrFPolicy(apiBase),
			auditContext: `ollama-node-inference${params.path}`
		});
		response = guarded.response;
		release = guarded.release;
	} catch (error) {
		throwIfOllamaRequestAborted(params.signal);
		throw new Error(`Ollama is unavailable at ${apiBase}: ${formatErrorMessage(error)}`, { cause: error });
	}
	try {
		if (!response.ok) {
			const body = (await readResponseTextLimited(response, MAX_ERROR_BODY_BYTES)).trim();
			let detail = body;
			try {
				const parsed = asNullableRecord(JSON.parse(body));
				detail = typeof parsed?.error === "string" ? parsed.error : body;
			} catch {}
			throw new Error(`Ollama ${params.path} failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}`);
		}
		return await readProviderJsonResponse(response, `ollama-node-inference${params.path}`);
	} finally {
		await release();
	}
}
async function discoverOllamaNodeModels(baseUrl = OLLAMA_DEFAULT_BASE_URL, signal) {
	const apiBase = resolveOllamaApiBase(baseUrl);
	const discovered = await fetchOllamaModels(apiBase, signal ? { signal } : void 0);
	if (!discovered.reachable) throw new Error(`Ollama is not running at ${apiBase}`);
	const localModels = discovered.models.filter((model) => !isOllamaRemoteModel(model));
	const loaded = await fetchLoadedOllamaModelNames(apiBase, signal ? { signal } : void 0);
	const loadedNames = new Set(loaded.models);
	const prioritizedModels = localModels.toSorted((left, right) => Number(loadedNames.has(right.name)) - Number(loadedNames.has(left.name)));
	return {
		provider: "ollama",
		models: (await enrichOllamaCompletionModels(apiBase, prioritizedModels, {
			requireCompletionCapability: true,
			...signal ? { signal } : {}
		})).map((model) => {
			const details = model.details;
			const row = {
				name: model.name,
				loaded: loadedNames.has(model.name)
			};
			if (typeof model.size === "number") row.size = model.size;
			if (typeof model.modified_at === "string") row.modifiedAt = model.modified_at;
			if (details?.family) row.family = details.family;
			if (details?.parameter_size) row.parameterSize = details.parameter_size;
			if (details?.quantization_level) row.quantization = details.quantization_level;
			if (typeof model.contextWindow === "number") row.contextWindow = model.contextWindow;
			if (model.capabilities) row.capabilities = model.capabilities;
			return row;
		}).toSorted((left, right) => {
			if (left.loaded !== right.loaded) return left.loaded ? -1 : 1;
			return (left.size ?? Number.MAX_SAFE_INTEGER) - (right.size ?? Number.MAX_SAFE_INTEGER) || left.name.localeCompare(right.name);
		})
	};
}
async function runOllamaNodeChat(params) {
	const apiBase = resolveOllamaApiBase(params.baseUrl);
	const deadlineMs = performance.now() + params.timeoutMs;
	const remainingTimeoutMs = () => {
		const remainingMs = Math.ceil(deadlineMs - performance.now());
		if (remainingMs <= 0) throw new Error(`Ollama node inference timed out after ${params.timeoutMs}ms`);
		return remainingMs;
	};
	const discovered = await fetchOllamaModels(apiBase, {
		timeoutMs: remainingTimeoutMs(),
		...params.signal ? { signal: params.signal } : {}
	});
	const localModel = discovered.models.find((model) => model.name === params.model && !isOllamaRemoteModel(model));
	const [model] = localModel ? await enrichOllamaModelsWithContext(apiBase, [localModel], {
		timeoutMs: remainingTimeoutMs(),
		...params.signal ? { signal: params.signal } : {}
	}) : [];
	if (!discovered.reachable || model?.capabilities?.includes("completion") !== true) {
		remainingTimeoutMs();
		throw new Error(`Ollama model ${JSON.stringify(params.model)} is not a local chat model; discover models first`);
	}
	const messages = [...params.system ? [{
		role: "system",
		content: params.system
	}] : [], {
		role: "user",
		content: params.prompt
	}];
	const data = await requestOllamaJson({
		baseUrl: params.baseUrl,
		path: "/api/chat",
		timeoutMs: remainingTimeoutMs(),
		...params.signal ? { signal: params.signal } : {},
		init: {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: params.model,
				messages,
				stream: false,
				think: false,
				options: {
					num_predict: params.maxTokens,
					...params.temperature !== void 0 && { temperature: params.temperature }
				}
			})
		}
	});
	const response = typeof data.message?.content === "string" ? data.message.content : void 0;
	if (response === void 0) throw new Error("Ollama /api/chat response did not contain message.content");
	if (data.done_reason === "length") throw new Error(`Ollama stopped after reaching maxTokens (${params.maxTokens}); retry with a larger maxTokens value`);
	const promptTokens = asFiniteNumber(data.prompt_eval_count);
	const completionTokens = asFiniteNumber(data.eval_count);
	const loadMs = durationMs(data.load_duration);
	const totalMs = durationMs(data.total_duration);
	return {
		provider: "ollama",
		model: typeof data.model === "string" && data.model.trim() ? data.model : params.model,
		response,
		...promptTokens !== void 0 || completionTokens !== void 0 ? { usage: {
			promptTokens,
			completionTokens
		} } : {},
		...loadMs !== void 0 || totalMs !== void 0 ? { timings: {
			loadMs,
			totalMs
		} } : {}
	};
}
function createOllamaNodeHostCommands(options) {
	const baseUrl = options?.baseUrl ?? "http://127.0.0.1:11434";
	return [{
		command: OLLAMA_MODELS_COMMAND,
		cap: OLLAMA_NODE_INFERENCE_CAPABILITY,
		hasActiveWork: () => false,
		handle: async (_paramsJSON, _io, context) => JSON.stringify(await discoverOllamaNodeModels(baseUrl, context?.signal))
	}, {
		command: OLLAMA_CHAT_COMMAND,
		cap: OLLAMA_NODE_INFERENCE_CAPABILITY,
		hasActiveWork: () => false,
		handle: async (paramsJSON, _io, context) => {
			const params = readNodeCommandParams(paramsJSON);
			const model = readToolStringParam(params, "model", { required: true });
			const prompt = readToolStringParam(params, "prompt", {
				required: true,
				trim: false
			});
			const system = readToolStringParam(params, "system", { trim: false });
			const maxTokens = readPositiveIntegerParam(params, "maxTokens", {
				max: 8192,
				message: `maxTokens must be an integer between 1 and 8192`
			}) ?? 512;
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs", {
				max: 6e5,
				message: `timeoutMs must be an integer between 1 and 600000`
			}) ?? 12e4;
			const temperature = readFiniteNumberParam(params, "temperature", {
				min: 0,
				max: 2,
				message: "temperature must be between 0 and 2"
			});
			if (prompt.length > 128e3) throw new Error(`prompt exceeds ${MAX_PROMPT_CHARS} characters`);
			if (system && system.length > 32e3) throw new Error(`system exceeds ${MAX_SYSTEM_PROMPT_CHARS} characters`);
			return JSON.stringify(await runOllamaNodeChat({
				baseUrl,
				model,
				prompt,
				system,
				temperature,
				maxTokens,
				timeoutMs,
				...context?.signal ? { signal: context.signal } : {}
			}));
		}
	}];
}
function findNode(nodes, query) {
	const normalized = query.trim().toLowerCase();
	const matches = nodes.filter((node) => node.nodeId.toLowerCase() === normalized || node.displayName?.toLowerCase() === normalized);
	if (matches.length === 0) throw new Error(`node ${JSON.stringify(query)} is not connected with Ollama inference support`);
	if (matches.length > 1) throw new Error(`node ${JSON.stringify(query)} is ambiguous; use its nodeId`);
	return expectDefined(matches[0], "single matching Ollama inference node");
}
function parseInvokePayload(raw) {
	const result = asNullableRecord(raw);
	let payload = asNullableRecord(result?.payload);
	if (!payload && typeof result?.payloadJSON === "string") payload = asNullableRecord(JSON.parse(result.payloadJSON));
	if (!payload) throw new Error("node returned an invalid Ollama inference payload");
	return payload;
}
async function invokeNode(api, nodeId, command, params, timeoutMs, signal) {
	throwIfOllamaRequestAborted(signal);
	return parseInvokePayload(await api.runtime.nodes.invoke({
		nodeId,
		command,
		params,
		timeoutMs,
		scopes: ["operator.write"],
		...signal ? { signal } : {}
	}));
}
function createOllamaNodeInferenceTool(api) {
	return {
		...ollamaNodeInferenceToolDefinition,
		execute: async (_toolCallId, args, signal) => {
			throwIfOllamaRequestAborted(signal);
			const params = asNullableRecord(args) ?? {};
			const action = readToolStringParam(params, "action", { required: true });
			const nodeQuery = readToolStringParam(params, "node");
			const modelNodes = (await api.runtime.nodes.list({ connected: true })).nodes.filter((node) => (node.invocableCommands ?? node.commands)?.includes(OLLAMA_MODELS_COMMAND));
			if (action === "discover") {
				const targets = nodeQuery ? [findNode(modelNodes, nodeQuery)] : modelNodes;
				const nodes = await Promise.all(targets.map(async (node) => {
					try {
						const payload = await invokeNode(api, node.nodeId, OLLAMA_MODELS_COMMAND, {}, DISCOVERY_TRANSPORT_TIMEOUT_MS, signal);
						const result = {
							nodeId: node.nodeId,
							ok: true
						};
						if (node.displayName) result.displayName = node.displayName;
						return Object.assign(result, payload);
					} catch (error) {
						throwIfOllamaRequestAborted(signal);
						const result = {
							nodeId: node.nodeId,
							ok: false,
							error: formatErrorMessage(error)
						};
						if (node.displayName) result.displayName = node.displayName;
						return result;
					}
				}));
				return jsonResult({
					nodes,
					...modelNodes.length === 0 && { hint: "No connected node advertises Ollama inference. Start Ollama and `openclaw node run` on the target machine, then approve any request shown by `openclaw nodes pending`." }
				});
			}
			if (action !== "run") throw new Error("action must be discover or run");
			const chatNodes = modelNodes.filter((node) => (node.invocableCommands ?? node.commands)?.includes(OLLAMA_CHAT_COMMAND));
			const node = nodeQuery ? findNode(chatNodes, nodeQuery) : chatNodes.length === 1 ? chatNodes[0] : void 0;
			if (!node) throw new Error(chatNodes.length === 0 ? "no connected node advertises Ollama inference" : "multiple nodes advertise Ollama inference; specify node");
			const model = readToolStringParam(params, "model", { required: true });
			const prompt = readToolStringParam(params, "prompt", {
				required: true,
				trim: false
			});
			const maxTokens = readPositiveIntegerParam(params, "maxTokens", { max: 8192 }) ?? 512;
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs", { max: 6e5 }) ?? 12e4;
			const system = readToolStringParam(params, "system", { trim: false });
			const temperature = readFiniteNumberParam(params, "temperature", {
				min: 0,
				max: 2
			});
			const commandParams = {
				model,
				prompt,
				maxTokens,
				timeoutMs
			};
			if (system !== void 0) commandParams.system = system;
			if (temperature !== void 0) commandParams.temperature = temperature;
			const result = await invokeNode(api, node.nodeId, OLLAMA_CHAT_COMMAND, commandParams, timeoutMs, signal);
			return jsonResult({
				nodeId: node.nodeId,
				...node.displayName && { displayName: node.displayName },
				...result
			});
		}
	};
}
//#endregion
export { createOllamaNodeHostCommands, createOllamaNodeInferenceTool };
