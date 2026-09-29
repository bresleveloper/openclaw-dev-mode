import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { n as THINKING_LEVELS_HELP, s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { g as randomIdempotencyKey, o as callGateway } from "./call-C_MP4_Gs.mjs";
import { p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { o as loadAuthProfileStoreForRuntime, p as updateAuthProfileStoreWithLock } from "./store-runtime-BcoYkagW.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { t as canonicalizeCaseOnlyCatalogModelRef } from "./model-selection-CaFyCMqp.mjs";
import { d as normalizeMimeType, n as detectMime } from "./mime-1zBUMwu6.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-C3E7Txvc.mjs";
import "./media-services-VTwDQdlk.mjs";
import { r as convertHeicToJpeg } from "./image-ops-CU4vxSlO.mjs";
import { t as buildExplicitSessionIdSessionKey } from "./session-Dk2nIhSp.mjs";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-execution-fisLWRz4.mjs";
import { t as acquireSimpleCompletionModelForAgent } from "./simple-completion-runtime-B7YSNxmE.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { n as formatEnvelopeForText, r as providerSummaryText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { t as prepareLocalCapabilityAccountSecrets } from "./local-account-secrets-qdPUsTvD.mjs";
import { a as providerHasGenericConfig, c as resolveCapabilityAgentOption, f as resolveSelectedProviderFromModelRef, l as resolveCapabilityProviderAgentId, p as resolveTransport, s as requireProviderModelOverride, u as resolveLocalCapabilityRuntimeConfig } from "./shared-Bg3km3d1.mjs";
import { t as collectOption } from "./helpers-BuPKARfv.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/cli/capability-cli/model.ts
const LOCAL_MODEL_RUN_SYSTEM_PROMPT = "You are a personal assistant running inside OpenClaw.";
const HEIC_MODEL_RUN_MIMES = /* @__PURE__ */ new Set([
	"image/heic",
	"image/heic-sequence",
	"image/heif",
	"image/heif-sequence"
]);
async function loadModelCatalogForInspection(cfg, rawAgentId) {
	const agentId = rawAgentId === void 0 ? void 0 : resolveCapabilityProviderAgentId(cfg, rawAgentId);
	return (await readPreparedModelCatalog({
		config: cfg,
		agentId,
		readOnly: true
	})).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}
async function canonicalizeModelRunRef(params) {
	return await canonicalizeCaseOnlyCatalogModelRef({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: DEFAULT_PROVIDER,
		loadCatalog: () => readPreparedModelCatalog({
			config: params.cfg,
			agentId: params.agentId,
			readOnly: true
		}),
		preserveAuthProfile: params.preserveAuthProfile
	});
}
function collectModelRunText(content) {
	return content.map((block) => block.type === "text" && typeof block.text === "string" ? block.text : "").join("").trim();
}
function requireModelRunPrompt(value) {
	if (typeof value !== "string" || normalizeOptionalString(value) === void 0) throw new Error("--prompt cannot be empty or whitespace-only.");
	return value;
}
async function readModelRunImageFiles(files) {
	if (!files || files.length === 0) return [];
	return await Promise.all(files.map(async (filePath) => {
		const resolvedPath = path.resolve(filePath);
		const buffer = await fs.readFile(resolvedPath);
		const mimeType = normalizeMimeType(await detectMime({
			buffer,
			filePath: resolvedPath
		}));
		if (!mimeType?.startsWith("image/")) throw new Error(`Unsupported --file for model run: ${resolvedPath}. Only image files are supported; use infer audio transcribe for audio files.`);
		if (HEIC_MODEL_RUN_MIMES.has(mimeType)) {
			const converted = await convertHeicToJpeg(buffer);
			return {
				path: resolvedPath,
				fileName: path.basename(resolvedPath),
				mimeType: "image/jpeg",
				data: converted.toString("base64")
			};
		}
		return {
			path: resolvedPath,
			fileName: path.basename(resolvedPath),
			mimeType,
			data: buffer.toString("base64")
		};
	}));
}
function normalizeModelRunThinking(value) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error("--thinking must be a string.");
	const normalized = normalizeThinkLevel(value);
	if (!normalized) throw new Error(`Invalid thinking level. Use one of: ${THINKING_LEVELS_HELP}.`);
	return normalized;
}
async function runModelRun(params) {
	const explicitModelOverride = requireProviderModelOverride(params.model);
	const cfg = params.transport === "local" ? await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer model run",
		targetIds: getModelsCommandSecretTargetIds()
	}) : getRuntimeConfig();
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, "infer model run");
	const modelRef = await canonicalizeModelRunRef({
		raw: params.model,
		cfg,
		agentId,
		preserveAuthProfile: params.transport === "local"
	});
	const hasExplicitProviderModelOverride = Boolean(explicitModelOverride);
	const imageFiles = await readModelRunImageFiles(params.files);
	const messageContent = imageFiles.length > 0 ? [{
		type: "text",
		text: params.prompt
	}, ...imageFiles.map((image) => ({
		type: "image",
		data: image.data,
		mimeType: image.mimeType
	}))] : params.prompt;
	if (params.transport === "local") {
		const callerResult = createDeferredCore();
		captureAsyncWorkTracker()(async () => {
			await prepareLocalCapabilityAccountSecrets({
				cfg,
				agentId
			});
			const prepared = await acquireSimpleCompletionModelForAgent({
				cfg,
				agentId,
				modelRef,
				allowMissingApiKeyModes: ["aws-sdk"],
				...hasExplicitProviderModelOverride ? { allowBundledStaticCatalogFallback: true } : {},
				skipAgentDiscovery: true
			});
			if ("error" in prepared) throw new Error(prepared.error);
			const work = new AsyncWorkScope();
			try {
				callerResult.resolve(await work.track(async () => {
					if (prepared.selection.provider === "codex") throw new Error("The codex provider is served by the Codex app-server agent runtime, not the local simple-completion transport. Use an openai/<model> ref with provider/model agentRuntime.id: \"codex\", run through the gateway, or use /codex commands.");
					const localModelRunSystemPrompt = prepared.model.api === "openai-chatgpt-responses" ? LOCAL_MODEL_RUN_SYSTEM_PROMPT : void 0;
					const result = await completeWithPreparedSimpleCompletionModel({
						model: prepared.model,
						auth: prepared.auth,
						cfg,
						context: {
							...localModelRunSystemPrompt ? { systemPrompt: localModelRunSystemPrompt } : {},
							messages: [{
								role: "user",
								content: messageContent,
								timestamp: Date.now()
							}]
						},
						options: {
							maxTokens: typeof prepared.model.maxTokens === "number" && Number.isFinite(prepared.model.maxTokens) ? prepared.model.maxTokens : void 0,
							...params.thinking ? { reasoning: params.thinking } : {}
						}
					});
					const text = collectModelRunText(result.content);
					if (!text) {
						const providerErrorMessage = result.errorMessage;
						const detail = typeof providerErrorMessage === "string" && providerErrorMessage.trim() ? `: ${providerErrorMessage.trim()}` : "";
						throw new Error(`No text output returned for provider "${prepared.selection.provider}" model "${prepared.selection.modelId}"${detail}.`);
					}
					return {
						ok: true,
						capability: "model.run",
						transport: "local",
						provider: prepared.selection.provider,
						model: prepared.selection.modelId,
						attempts: [],
						...imageFiles.length > 0 ? { inputs: imageFiles.map((image) => ({
							path: image.path,
							mimeType: image.mimeType
						})) } : {},
						outputs: [{
							text,
							mediaUrl: null
						}]
					};
				}));
			} catch (error) {
				callerResult.reject(error);
			} finally {
				await work.drain();
				await prepared[Symbol.asyncDispose]();
			}
		}).catch((error) => callerResult.reject(error));
		return await callerResult.promise;
	}
	const { provider, model } = requireProviderModelOverride(modelRef) ?? {};
	const hasModelOverride = Boolean(provider || model);
	const sessionId = `model-run-${randomUUID()}`;
	const sessionKey = buildExplicitSessionIdSessionKey({
		agentId,
		sessionId
	});
	const response = await callGateway({
		method: "agent",
		params: {
			agentId,
			sessionId,
			sessionKey,
			message: params.prompt,
			attachments: imageFiles.length > 0 ? imageFiles.map((image) => ({
				type: "image",
				fileName: image.fileName,
				mimeType: image.mimeType,
				content: image.data
			})) : void 0,
			provider,
			model,
			...params.thinking ? { thinking: params.thinking } : {},
			modelRun: true,
			promptMode: "none",
			cleanupBundleMcpOnRunEnd: true,
			idempotencyKey: randomIdempotencyKey()
		},
		expectFinal: true,
		timeoutMs: 12e4,
		clientName: hasModelOverride ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: hasModelOverride ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		...hasModelOverride ? { scopes: [ADMIN_SCOPE] } : {}
	});
	return {
		ok: true,
		capability: "model.run",
		transport: "gateway",
		provider: response?.result?.meta?.agentMeta?.provider,
		model: response?.result?.meta?.agentMeta?.model,
		attempts: response?.result?.meta?.agentMeta?.fallbackAttempts ?? [],
		outputs: (response?.result?.payloads ?? []).map((payload) => ({
			text: payload.text,
			mediaUrl: payload.mediaUrl,
			mediaUrls: payload.mediaUrls
		})),
		...imageFiles.length > 0 ? { inputs: imageFiles.map((image) => ({
			path: image.path,
			mimeType: image.mimeType
		})) } : {}
	};
}
async function buildModelProviders(rawAgentId) {
	const cfg = getRuntimeConfig();
	const agentId = resolveCapabilityProviderAgentId(cfg, rawAgentId);
	const catalog = await loadModelCatalogForInspection(cfg, agentId);
	const selectedProvider = resolveSelectedProviderFromModelRef(resolveAgentEffectiveModelPrimary(cfg, agentId));
	const grouped = /* @__PURE__ */ new Map();
	for (const entry of catalog) {
		const current = grouped.get(entry.provider) ?? {
			provider: entry.provider,
			count: 0,
			defaults: [],
			available: true,
			configured: providerHasGenericConfig({
				cfg,
				providerId: entry.provider,
				agentId,
				envVars: getProviderEnvVarsCore(entry.provider)
			}),
			selected: selectedProvider === entry.provider
		};
		current.count += 1;
		if (current.defaults.length < 3) current.defaults.push(entry.id);
		grouped.set(entry.provider, current);
	}
	return [...grouped.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
async function runModelAuthStatus(agent) {
	const captured = [];
	const { modelsStatusCommand } = await import("./list.status-command-7qG87sia.mjs");
	await modelsStatusCommand({
		json: true,
		agent
	}, {
		log: (...args) => captured.push(args.join(" ")),
		error: (message) => {
			throw message instanceof Error ? message : new Error(String(message));
		},
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	});
	const raw = captured.find((line) => line.trim().startsWith("{"));
	return raw ? JSON.parse(raw) : {};
}
async function runModelAuthLogout(provider, agent) {
	const cfg = getRuntimeConfig();
	const agentDir = resolveAgentDir(cfg, agent);
	const store = loadAuthProfileStoreForRuntime(agentDir);
	const profileIds = listProfilesForProvider(store, provider);
	if (!await updateAuthProfileStoreWithLock({
		agentDir,
		updater: (nextStore) => {
			let changed = false;
			for (const profileId of profileIds) {
				if (nextStore.profiles[profileId]) {
					delete nextStore.profiles[profileId];
					changed = true;
				}
				if (nextStore.usageStats?.[profileId]) {
					delete nextStore.usageStats[profileId];
					changed = true;
				}
			}
			if (nextStore.order?.[provider]) {
				delete nextStore.order[provider];
				changed = true;
			}
			if (nextStore.lastGood?.[provider]) {
				delete nextStore.lastGood[provider];
				changed = true;
			}
			return changed;
		}
	})) throw new Error(`Failed to remove saved auth profiles for provider ${provider}.`);
	return {
		provider,
		removedProfiles: profileIds
	};
}
function registerModelCapabilityCommands(capability) {
	const model = capability.command("model").description("Text inference and model catalog commands").option("--agent <id>", "Agent whose model and auth state should be used");
	model.command("run").description("Run a one-shot model turn").requiredOption("--prompt <text>", "Prompt text").option("--file <path>", "Image file", collectOption, []).option("--model <provider/model>", "Model override").option("--thinking <level>", "Thinking level override").option("--local", "Force local execution", false).option("--gateway", "Force gateway execution", false).option("--agent <id>", "Agent whose model and credentials own the run (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const prompt = requireModelRunPrompt(opts.prompt);
			const thinking = normalizeModelRunThinking(opts.thinking);
			const transport = resolveTransport({
				local: Boolean(opts.local),
				gateway: Boolean(opts.gateway),
				supported: ["local", "gateway"],
				defaultTransport: "local"
			});
			const result = await runModelRun({
				prompt,
				agent: resolveCapabilityAgentOption(command, opts.agent),
				files: opts.file,
				model: opts.model,
				thinking,
				transport
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	model.command("list").description("List known models").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await loadModelCatalogForInspection(getRuntimeConfig(), resolveCapabilityAgentOption(command, opts.agent));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	model.command("inspect").description("Inspect one model catalog entry").requiredOption("--model <provider/model>", "Model id").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const target = normalizeStringifiedOptionalString(opts.model) ?? "";
			const catalog = await loadModelCatalogForInspection(getRuntimeConfig(), resolveCapabilityAgentOption(command, opts.agent));
			const entry = catalog.find((candidate) => `${candidate.provider}/${candidate.id}` === target) ?? catalog.find((candidate) => candidate.id === target);
			if (!entry) throw new Error(`Model not found: ${target}`);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) => JSON.stringify(value, null, 2));
		});
	});
	model.command("providers").description("List model providers from the catalog").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await buildModelProviders(resolveCapabilityAgentOption(command, opts.agent));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
		});
	});
	const modelAuth = model.command("auth").description("Provider auth helpers").option("--agent <id>", "Agent id (default: configured default agent)");
	const resolveModelAuthAgent = (command, rawAgentId, surface) => resolveCapabilityProviderAgentId(getRuntimeConfig(), resolveCapabilityAgentOption(command, rawAgentId), surface);
	modelAuth.command("login").description("Run provider auth login").requiredOption("--provider <id>", "Provider id").option("--method <id>", "Provider auth method id").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const agent = resolveModelAuthAgent(command, opts.agent, "infer model auth login");
			const { modelsAuthLoginCommand } = await import("./auth-ir7uuxl9.mjs");
			await modelsAuthLoginCommand({
				provider: String(opts.provider),
				method: opts.method ? String(opts.method) : void 0,
				agent
			}, defaultRuntime);
		});
	});
	modelAuth.command("logout").description("Remove saved auth profiles for one provider").requiredOption("--provider <id>", "Provider id").option("--agent <id>", "Agent id (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runModelAuthLogout(String(opts.provider), resolveModelAuthAgent(command, opts.agent, "infer model auth logout"));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
	modelAuth.command("status").description("Show configured auth state").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runModelAuthStatus(resolveModelAuthAgent(command, opts.agent, "infer model auth status"));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) => JSON.stringify(value, null, 2));
		});
	});
}
//#endregion
export { registerModelCapabilityCommands };
