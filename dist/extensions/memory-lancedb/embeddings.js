import { formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { Buffer } from "node:buffer";
import { resolve } from "node:path";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { canonicalizeBase64 } from "openclaw/plugin-sdk/media-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { ensureGlobalUndiciEnvProxyDispatcher } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/memory-lancedb/embeddings.ts
const loadOpenAiModule = createLazyRuntimeModule(() => import("openai"));
const loadMemoryEmbeddingProviderModule = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/memory-core-host-engine-embeddings"));
const PROVIDER_ADAPTER_LIFECYCLE = resolveGlobalSingleton(Symbol.for("openclaw.memoryLanceDbEmbeddingProviderLifecycle.v1"), () => ({
	retainedProviders: /* @__PURE__ */ new Set(),
	tail: Promise.resolve()
}));
function runProviderAdapterLifecycle(operation) {
	const result = PROVIDER_ADAPTER_LIFECYCLE.tail.then(operation, operation);
	PROVIDER_ADAPTER_LIFECYCLE.tail = result.then(() => void 0, () => void 0);
	return result;
}
async function drainRetainedProviders() {
	let firstError;
	let closeFailed = false;
	for (const provider of PROVIDER_ADAPTER_LIFECYCLE.retainedProviders) try {
		await provider.close?.();
		PROVIDER_ADAPTER_LIFECYCLE.retainedProviders.delete(provider);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (closeFailed) throw toErrorObject(firstError, "memory-lancedb embedding provider retirement failed");
}
function embeddingConfigFingerprint(embedding) {
	const { provider, model, apiKey, baseUrl, dimensions } = embedding;
	return JSON.stringify([
		provider,
		model,
		apiKey,
		baseUrl,
		dimensions
	]);
}
var OpenAiCompatibleEmbeddings = class {
	constructor(apiKey, model, baseUrl, dimensions) {
		this.model = model;
		this.dimensions = dimensions;
		this.clientPromise = loadOpenAiModule().then(({ default: OpenAI }) => new OpenAI({
			apiKey,
			baseURL: baseUrl
		}));
	}
	async embed(text, options) {
		const dimensions = this.dimensions;
		const startedAtMs = options?.timeoutMs && Number.isFinite(options.timeoutMs) ? Date.now() : null;
		try {
			return normalizeEmbeddingVector((await this.postEmbedding(text, {
				includeDimensions: true,
				options
			})).data?.[0]?.embedding);
		} catch (error) {
			if (typeof dimensions !== "number" || !isEmbeddingDimensionsRejectedError(error)) throw error;
		}
		const fallbackOptions = startedAtMs === null || options?.timeoutMs === void 0 ? options : { timeoutMs: Math.max(1, options.timeoutMs - (Date.now() - startedAtMs)) };
		return truncateEmbeddingVector(normalizeEmbeddingVector((await this.postEmbedding(text, {
			includeDimensions: false,
			options: fallbackOptions
		})).data?.[0]?.embedding), dimensions, this.model);
	}
	async postEmbedding(text, request) {
		const params = {
			model: this.model,
			input: text,
			...request.includeDimensions && typeof this.dimensions === "number" ? { dimensions: this.dimensions } : {}
		};
		ensureGlobalUndiciEnvProxyDispatcher();
		return await (await this.clientPromise).post("/embeddings", {
			body: params,
			...request.options?.timeoutMs ? {
				timeout: request.options.timeoutMs,
				maxRetries: 0
			} : {}
		});
	}
};
function isEmbeddingDimensionsRejectedError(error) {
	const record = asOptionalRecord(error);
	if (record?.status !== 400 && record?.status !== 422) return false;
	const details = stringifyEmbeddingApiError(error).toLowerCase();
	return /\bdimensions\b/.test(details) && isUnsupportedEmbeddingFieldError(details);
}
function isUnsupportedEmbeddingFieldError(details) {
	if (/\b(?:parameter|field|argument)[_ -]value\b/.test(details)) return false;
	return /\bextra[_ -]forbidden\b/.test(details) || /\bextra inputs? (?:are )?not permitted\b/.test(details) || /\bextra fields? (?:are )?not permitted\b/.test(details) || /\b(?:unknown|unrecognized|unexpected|unsupported)[_ -](?:request[_ -])?(?:parameter|field|argument)\b/.test(details);
}
function stringifyEmbeddingApiError(error) {
	const record = asOptionalRecord(error);
	const parts = error instanceof Error ? [error.message] : [];
	for (const value of [
		record?.code,
		record?.type,
		record?.param,
		record?.error
	]) {
		if (typeof value === "string" || typeof value === "number") {
			parts.push(String(value));
			continue;
		}
		if (value && typeof value === "object") try {
			parts.push(JSON.stringify(value));
		} catch {}
	}
	return parts.join("\n");
}
function truncateEmbeddingVector(embedding, dimensions, model) {
	if (embedding.length < dimensions) throw new Error(`Embedding model ${model} returned ${embedding.length} dimensions, need at least ${dimensions} for local truncation`);
	const truncated = embedding.slice(0, dimensions);
	const magnitude = Math.sqrt(truncated.reduce((sum, value) => sum + value * value, 0));
	return magnitude > 0 ? truncated.map((value) => value / magnitude) : truncated;
}
var ProviderAdapterEmbeddings = class {
	constructor(api) {
		this.api = api;
		this.providers = /* @__PURE__ */ new Map();
		this.closePromise = null;
		this.closed = false;
	}
	getProvider(agentId, embedding) {
		const config = this.api.runtime.config?.current?.() ?? this.api.config;
		const agentDir = this.api.runtime.agent.resolveAgentDir(config, agentId);
		const existing = this.providers.get(agentId);
		if (existing?.config === config && existing.agentDir === agentDir) return existing;
		if (existing) {
			this.providers.delete(agentId);
			this.retireProviders([existing]).catch(() => void 0);
		}
		const entry = {
			config,
			agentDir,
			promise: this.createProvider(config, agentDir, embedding).catch((err) => {
				if (this.providers.get(agentId) === entry) this.providers.delete(agentId);
				throw err;
			}),
			activeUses: 0
		};
		this.providers.set(agentId, entry);
		return entry;
	}
	invalidate(fingerprint) {
		if (this.embeddingFingerprint === fingerprint) return;
		this.embeddingFingerprint = fingerprint;
		this.retireMatchingProviders(() => true);
	}
	retireMatchingProviders(predicate) {
		const entries = [];
		for (const [agentId, entry] of this.providers) if (predicate(entry)) {
			this.providers.delete(agentId);
			entries.push(entry);
		}
		if (entries.length === 0) return;
		this.retireProviders(entries).catch(() => void 0);
	}
	invalidateProvidersForAuthMutation(event) {
		const changedAgentDir = event.agentDir ? resolve(event.agentDir) : void 0;
		this.retireMatchingProviders((entry) => event.affectsInheritedStores || resolve(entry.agentDir) === changedAgentDir);
	}
	async retireProviders(entries) {
		await runProviderAdapterLifecycle(async () => {
			for (const entry of entries) {
				if (entry.activeUses > 0) await new Promise((resolve) => {
					entry.idleResolver = resolve;
				});
				const provider = await entry.promise.catch(() => null);
				if (provider) PROVIDER_ADAPTER_LIFECYCLE.retainedProviders.add(provider);
			}
			await drainRetainedProviders();
		});
	}
	async createProvider(config, agentDir, embedding) {
		return await runProviderAdapterLifecycle(async () => {
			await drainRetainedProviders();
			return await this.createProviderAfterRetirement(config, agentDir, embedding);
		});
	}
	async createProviderAfterRetirement(config, agentDir, embedding) {
		const providerId = embedding.provider;
		const { getMemoryEmbeddingProvider, registerRuntimeAuthProfileStoreMutationListener } = await loadMemoryEmbeddingProviderModule();
		if (!this.closed && !this.unregisterAuthMutationListener) this.unregisterAuthMutationListener = registerRuntimeAuthProfileStoreMutationListener((event) => this.invalidateProvidersForAuthMutation(event));
		const adapter = getMemoryEmbeddingProvider(providerId, config);
		if (!adapter) throw new Error(`Unknown memory embedding provider: ${providerId}`);
		const remote = embedding.apiKey || embedding.baseUrl ? {
			...embedding.apiKey ? { apiKey: embedding.apiKey } : {},
			...embedding.baseUrl ? { baseUrl: embedding.baseUrl } : {}
		} : void 0;
		const result = await adapter.create({
			config,
			agentDir,
			provider: providerId,
			fallback: "none",
			model: embedding.model,
			...remote ? { remote } : {},
			...typeof embedding.dimensions === "number" ? { dimensions: embedding.dimensions } : {}
		});
		if (!result.provider) throw new Error(`Memory embedding provider ${providerId} is unavailable.`);
		return result.provider;
	}
	async embed(agentId, text, embeddingConfig, timeoutMs) {
		if (this.closed) throw new Error("memory-lancedb embeddings are closed");
		const embedding = { ...embeddingConfig };
		const fingerprint = embeddingConfigFingerprint(embedding);
		this.invalidate(fingerprint);
		const entry = this.getProvider(normalizeAgentId(agentId), embedding);
		entry.activeUses += 1;
		try {
			const provider = await entry.promise;
			if (!timeoutMs) return await provider.embed(text, { inputType: "query" });
			const controller = new AbortController();
			let timer;
			try {
				timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("memory-lancedb embedding timed out")), resolveTimerTimeoutMs(timeoutMs, 1));
				timer.unref?.();
				return await provider.embed(text, {
					signal: controller.signal,
					inputType: "query"
				});
			} finally {
				if (timer) clearTimeout(timer);
			}
		} finally {
			entry.activeUses -= 1;
			if (entry.activeUses === 0) {
				const resolveIdle = entry.idleResolver;
				entry.idleResolver = void 0;
				resolveIdle?.();
			}
		}
	}
	async close() {
		const existingClose = this.closePromise;
		if (existingClose) {
			await existingClose;
			return;
		}
		const closeOperation = this.closeOnce();
		this.closePromise = closeOperation;
		try {
			await closeOperation;
		} catch (err) {
			if (this.closePromise === closeOperation) this.closePromise = null;
			throw err;
		}
	}
	async closeOnce() {
		this.closed = true;
		this.unregisterAuthMutationListener?.();
		this.unregisterAuthMutationListener = void 0;
		const providers = Array.from(this.providers.values());
		this.providers.clear();
		await this.retireProviders(providers);
	}
};
async function runWithTimeout(params) {
	let timeout;
	const TIMEOUT = Symbol("timeout");
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const deadlineAtMs = Date.now() + timeoutMs;
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => resolve(TIMEOUT), timeoutMs);
		timeout.unref?.();
	});
	const taskPromise = params.task(deadlineAtMs);
	taskPromise.catch(() => void 0);
	try {
		const result = await Promise.race([taskPromise, timeoutPromise]);
		if (result === TIMEOUT || Date.now() >= deadlineAtMs) return { status: "timeout" };
		return {
			status: "ok",
			value: result
		};
	} catch (error) {
		if (Date.now() >= deadlineAtMs) return { status: "timeout" };
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function isMemoryRecallTimeoutError(error) {
	let current = error;
	for (let depth = 0; depth < 3 && current !== void 0; depth += 1) {
		const record = asOptionalRecord(current);
		const name = current instanceof Error ? current.name : typeof record?.name === "string" ? record.name : "";
		const message = current instanceof Error ? current.message : typeof record?.message === "string" ? record.message : "";
		const code = typeof record?.code === "string" ? record.code : "";
		if (name === "APIConnectionTimeoutError" || name === "TimeoutError" || code === "ETIMEDOUT" || /^UND_ERR_.*_TIMEOUT$/.test(code) || /\btimed out\b/i.test(message)) return true;
		current = record?.cause;
	}
	return false;
}
function buildMemoryRecallUnavailableResult(error) {
	return textResult("Memory recall is unavailable right now.", {
		count: 0,
		disabled: true,
		unavailable: true,
		error
	});
}
var MemoryRecallEmbeddingError = class extends Error {
	constructor(originalError) {
		super(formatErrorMessage(originalError));
		this.originalError = originalError;
		this.name = "MemoryRecallEmbeddingError";
	}
};
function createEmbeddings(api) {
	let provider = new ProviderAdapterEmbeddings(api);
	let direct;
	let closed = false;
	return {
		start() {
			if (closed) {
				provider = new ProviderAdapterEmbeddings(api);
				closed = false;
			}
		},
		async embed(agentId, text, embeddingConfig, timeoutMs) {
			if (closed) throw new Error("memory-lancedb embeddings are closed");
			const embedding = { ...embeddingConfig };
			if (embedding.provider === "openai" && embedding.apiKey) {
				provider.invalidate();
				const fingerprint = embeddingConfigFingerprint(embedding);
				direct = direct?.fingerprint === fingerprint ? direct : {
					fingerprint,
					client: new OpenAiCompatibleEmbeddings(embedding.apiKey, embedding.model, embedding.baseUrl, embedding.dimensions)
				};
				return await direct.client.embed(text, timeoutMs ? { timeoutMs } : void 0);
			}
			direct = void 0;
			return await provider.embed(agentId, text, embedding, timeoutMs);
		},
		async close() {
			closed = true;
			direct = void 0;
			await provider.close();
		}
	};
}
function normalizeEmbeddingVector(value) {
	if (typeof value === "string") {
		const canonicalEmbedding = canonicalizeBase64(value);
		if (!canonicalEmbedding) throw new Error("Base64 embedding response is malformed");
		const bytes = Buffer.from(canonicalEmbedding, "base64");
		if (bytes.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) throw new Error("Base64 embedding response has invalid byte length");
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		const floats = [];
		for (let offset = 0; offset < bytes.byteLength; offset += Float32Array.BYTES_PER_ELEMENT) floats.push(view.getFloat32(offset, true));
		return normalizeEmbeddingVector(floats);
	}
	if (!Array.isArray(value)) throw new Error("Embedding response is missing a vector");
	if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) throw new Error("Embedding response contains non-numeric values");
	return value;
}
//#endregion
export { MemoryRecallEmbeddingError, buildMemoryRecallUnavailableResult, createEmbeddings, isMemoryRecallTimeoutError, normalizeEmbeddingVector, runWithTimeout };
