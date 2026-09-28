import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-Dr91v3w1.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-BSynTdAu.mjs";
import "./model-auth-D3hh0-wa.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { r as normalizeSpeechProviderId } from "./provider-registry-core-DdKgepX8.mjs";
import { i as canonicalizeSpeechProviderId, s as listSpeechProviders } from "./directives-B6mSsaw8.mjs";
import { _ as resolveTtsPrefsPath, h as resolveTtsConfig, l as listTtsPersonas, o as getTtsPersona } from "./tts-settings-CuXW4C4p.mjs";
import { h as getTtsCommandSecretTargetIds } from "./command-secret-targets-Dxp8wSEx.mjs";
import { _ as setTtsProvider, g as setTtsPersona, l as listSpeechVoices, m as setTtsEnabled, s as resolveExplicitTtsOverrides, t as getTtsProvider } from "./runtime-api-JsepPOHv.mjs";
import { n as textToSpeech } from "./tts-DFUY8QkW.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { n as formatEnvelopeForText, r as providerSummaryText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { a as providerHasGenericConfig, d as resolveModelRefOverride, f as resolveSelectedProviderFromModelRef, i as pinRuntimeConfigSnapshot, l as resolveCapabilityProviderAgentId, p as resolveTransport, u as resolveLocalCapabilityRuntimeConfig } from "./shared-CcZCj91E.mjs";
import "./media-output-CNqngb8c.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { Option } from "commander";
//#region src/cli/capability-cli/tts-runtime.ts
async function copyTtsOutputAtomically(sourcePath, targetPath) {
	await publishOutputFileAtomically({
		filePath: targetPath,
		writeTemp: async (tempPath) => {
			await fs.copyFile(sourcePath, tempPath);
		}
	});
}
async function runTtsConvert(params) {
	if (params.transport === "gateway") {
		const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({ config: getRuntimeConfig() });
		if (params.output && !isLoopbackHost(new URL(gatewayConnection.url).hostname)) throw new Error(`--output is not supported for remote gateway TTS yet (gateway target: ${gatewayConnection.url}).`);
		const result = await callGateway({
			method: "tts.convert",
			params: {
				text: params.text,
				channel: params.channel,
				provider: normalizeOptionalString(params.provider),
				modelId: params.modelId,
				voiceId: params.voiceId
			},
			timeoutMs: 12e4
		});
		let outputPath = result.audioPath;
		if (params.output && result.audioPath) {
			const target = path.resolve(params.output);
			await copyTtsOutputAtomically(result.audioPath, target);
			outputPath = target;
		}
		return {
			ok: true,
			capability: "tts.convert",
			transport: "gateway",
			provider: result.provider,
			attempts: [],
			outputs: [{
				path: outputPath,
				format: result.outputFormat,
				voiceCompatible: result.voiceCompatible
			}]
		};
	}
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer tts convert",
		targetIds: getTtsCommandSecretTargetIds()
	});
	const effectiveCfg = await injectTtsAuthProfileApiKey({
		cfg,
		provider: resolveTtsProviderForAuthHydration({
			cfg,
			provider: params.provider,
			modelId: params.modelId,
			channelId: params.channel
		}),
		channelId: params.channel
	});
	if (effectiveCfg !== cfg) pinRuntimeConfigSnapshot(effectiveCfg);
	const overrides = resolveExplicitTtsOverrides({
		cfg: effectiveCfg,
		provider: params.provider,
		modelId: params.modelId,
		voiceId: params.voiceId,
		channelId: params.channel
	});
	const hasExplicitSelection = Boolean(overrides.provider || normalizeOptionalString(params.modelId) || normalizeOptionalString(params.voiceId));
	const result = await textToSpeech({
		text: params.text,
		cfg: effectiveCfg,
		channel: params.channel,
		overrides,
		disableFallback: hasExplicitSelection
	});
	if (!result.success || !result.audioPath) throw new Error(result.error ?? "TTS conversion failed");
	let outputPath = result.audioPath;
	if (params.output) {
		const target = path.resolve(params.output);
		await copyTtsOutputAtomically(result.audioPath, target);
		outputPath = target;
	}
	return {
		ok: true,
		capability: "tts.convert",
		transport: "local",
		provider: result.provider,
		attempts: result.attempts ?? [],
		outputs: [{
			path: outputPath,
			format: result.outputFormat,
			voiceCompatible: result.voiceCompatible
		}]
	};
}
function resolveTtsProviderForAuthHydration(params) {
	const explicitProvider = params.provider ?? resolveSelectedProviderFromModelRef(normalizeOptionalString(params.modelId));
	if (explicitProvider) return explicitProvider;
	const ttsConfig = resolveTtsConfig(params.cfg, { channelId: params.channelId });
	return getTtsProvider(ttsConfig, resolveTtsPrefsPath(ttsConfig));
}
async function injectTtsAuthProfileApiKey(params) {
	if (!params.provider) return params.cfg;
	const providerId = canonicalizeSpeechProviderId(params.provider, params.cfg) ?? normalizeLowercaseStringOrEmpty(params.provider);
	if (!providerId) return params.cfg;
	if (resolvedTtsConfigHasProviderApiKey(resolveTtsConfig(params.cfg, { channelId: params.channelId }), providerId)) return params.cfg;
	const existingProviderConfig = resolveExistingTtsProviderConfig({
		cfg: params.cfg,
		providerId,
		channelId: params.channelId
	});
	if (ttsProviderConfigHasApiKey(existingProviderConfig?.value)) return params.cfg;
	const auth = await resolveApiKeyForProviderCore({
		provider: providerId,
		cfg: params.cfg,
		credentialPrecedence: "profile-first"
	}).catch(() => void 0);
	if (!auth?.apiKey || auth.mode !== "api-key") return params.cfg;
	if (existingProviderConfig?.scope === "channel") {
		const channels = { ...params.cfg.channels };
		const channel = channels[existingProviderConfig.channelKey];
		if (!isRecord(channel)) return params.cfg;
		const nextChannel = {
			...channel,
			tts: buildTtsConfigWithHydratedProvider({
				tts: channel.tts,
				existingProviderConfig,
				providerId,
				apiKey: auth.apiKey
			})
		};
		return {
			...params.cfg,
			channels: {
				...channels,
				[existingProviderConfig.channelKey]: nextChannel
			}
		};
	}
	const nextTts = buildTtsConfigWithHydratedProvider({
		tts: params.cfg.tts,
		existingProviderConfig,
		providerId,
		apiKey: auth.apiKey
	});
	return {
		...params.cfg,
		tts: nextTts
	};
}
function resolveExistingTtsProviderConfig(params) {
	const channelTts = resolveChannelTtsConfigForAuthHydration(params);
	if (channelTts) {
		const channelProviderConfig = resolveExistingTtsProviderConfigInTts({
			cfg: params.cfg,
			tts: channelTts.tts,
			providerId: params.providerId
		});
		if (channelProviderConfig) return {
			...channelProviderConfig,
			scope: "channel",
			channelKey: channelTts.channelKey
		};
	}
	const rootProviderConfig = resolveExistingTtsProviderConfigInTts({
		cfg: params.cfg,
		tts: params.cfg.tts,
		providerId: params.providerId
	});
	return rootProviderConfig ? {
		...rootProviderConfig,
		scope: "root"
	} : void 0;
}
function resolveExistingTtsProviderConfigInTts(params) {
	if (!isRecord(params.tts)) return;
	const providers = isRecord(params.tts.providers) ? params.tts.providers : void 0;
	if (!providers) return resolveDirectTtsProviderConfig(params);
	const exact = providers[params.providerId];
	if (exact !== void 0) return {
		container: "providers",
		key: params.providerId,
		value: exact
	};
	for (const [key, value] of Object.entries(providers)) if (normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) === params.providerId) return {
		container: "providers",
		key,
		value
	};
	return resolveDirectTtsProviderConfig(params);
}
const TTS_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
	"auto",
	"enabled",
	"maxTextLength",
	"mode",
	"modelOverrides",
	"persona",
	"personas",
	"prefsPath",
	"provider",
	"providers",
	"summaryModel",
	"timeoutMs"
]);
function resolveDirectTtsProviderConfig(params) {
	if (!isRecord(params.tts)) return;
	for (const [key, value] of Object.entries(params.tts)) {
		if (TTS_CONFIG_RESERVED_KEYS.has(key)) continue;
		if (normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) === params.providerId) return {
			container: "direct",
			key,
			value
		};
	}
}
function resolveChannelTtsConfigForAuthHydration(params) {
	const channels = params.cfg.channels;
	const normalizedChannelId = normalizeOptionalString(params.channelId);
	if (!isRecord(channels) || !normalizedChannelId) return;
	const channelKey = Object.hasOwn(channels, normalizedChannelId) ? normalizedChannelId : Object.keys(channels).find((candidate) => normalizeLowercaseStringOrEmpty(candidate) === normalizeLowercaseStringOrEmpty(normalizedChannelId));
	const channel = channelKey ? channels[channelKey] : void 0;
	if (!channelKey || !isRecord(channel)) return;
	return {
		channelKey,
		tts: channel.tts
	};
}
function buildTtsConfigWithHydratedProvider(params) {
	const tts = isRecord(params.tts) ? { ...params.tts } : {};
	const providers = isRecord(tts.providers) ? { ...tts.providers } : {};
	const providerConfigKey = params.existingProviderConfig?.key ?? params.providerId;
	const nextProviderConfig = {
		...isRecord(params.existingProviderConfig?.value) ? params.existingProviderConfig.value : {},
		apiKey: params.apiKey
	};
	if (params.existingProviderConfig?.container === "direct") tts[providerConfigKey] = nextProviderConfig;
	else {
		providers[providerConfigKey] = nextProviderConfig;
		tts.providers = providers;
	}
	return tts;
}
function ttsProviderConfigHasApiKey(value) {
	return isRecord(value) && "apiKey" in value;
}
function resolvedTtsConfigHasProviderApiKey(config, providerId) {
	if (!isRecord(config) || !isRecord(config.providerConfigs)) return false;
	return ttsProviderConfigHasApiKey(config.providerConfigs[providerId]);
}
async function runTtsProviders(transport, rawAgentId) {
	const cfg = getRuntimeConfig();
	if (transport === "gateway") {
		if (rawAgentId !== void 0) throw new Error("--agent is only supported with local TTS provider inspection.");
		const payload = await callGateway({
			method: "tts.providers",
			timeoutMs: 3e4
		});
		return {
			...payload,
			providers: (payload.providers ?? []).map((provider) => {
				const id = typeof provider.id === "string" ? provider.id : "";
				return Object.assign({
					available: true,
					configured: typeof provider.configured === `boolean` ? provider.configured : providerHasGenericConfig({
						cfg,
						providerId: id
					}),
					selected: Boolean(id && payload.active === id)
				}, provider);
			})
		};
	}
	const agentId = resolveCapabilityProviderAgentId(cfg, rawAgentId);
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	const active = getTtsProvider(config, prefsPath);
	return {
		providers: listSpeechProviders(cfg).map((provider) => ({
			available: true,
			configured: active === provider.id || providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: active === provider.id,
			id: provider.id,
			name: provider.label,
			models: [...provider.models ?? []],
			voices: [...provider.voices ?? []]
		})),
		active
	};
}
async function runTtsPersonas(transport) {
	if (transport === "gateway") return await callGateway({
		method: "tts.personas",
		timeoutMs: 3e4
	});
	const cfg = getRuntimeConfig();
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	return {
		active: getTtsPersona(config, prefsPath)?.id ?? null,
		personas: listTtsPersonas(config).map((persona) => ({
			id: persona.id,
			label: persona.label,
			description: persona.description,
			provider: persona.provider,
			fallbackPolicy: persona.fallbackPolicy,
			providers: Object.keys(persona.providers ?? {})
		}))
	};
}
async function runTtsVoices(providerRaw) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer tts voices",
		targetIds: getTtsCommandSecretTargetIds()
	});
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	const provider = normalizeOptionalString(providerRaw) || getTtsProvider(config, prefsPath);
	return await listSpeechVoices({
		provider,
		cfg,
		config
	});
}
async function runTtsStateMutation(params) {
	if (params.transport === "gateway") {
		const method = params.capability === "tts.enable" ? "tts.enable" : params.capability === "tts.disable" ? "tts.disable" : params.capability === "tts.set-provider" ? "tts.setProvider" : "tts.setPersona";
		return await callGateway({
			method,
			params: params.capability === "tts.set-provider" ? { provider: params.provider } : params.capability === "tts.set-persona" ? { persona: params.persona ?? "off" } : void 0,
			timeoutMs: 3e4
		});
	}
	const cfg = getRuntimeConfig();
	const config = resolveTtsConfig(cfg);
	const prefsPath = resolveTtsPrefsPath(config);
	if (params.capability === "tts.enable") {
		setTtsEnabled(prefsPath, true);
		return { enabled: true };
	}
	if (params.capability === "tts.disable") {
		setTtsEnabled(prefsPath, false);
		return { enabled: false };
	}
	if (params.capability === "tts.set-persona") {
		if (!params.persona) {
			setTtsPersona(prefsPath, null);
			return { persona: null };
		}
		const persona = listTtsPersonas(config).find((entry) => entry.id === normalizeLowercaseStringOrEmpty(params.persona ?? ""));
		if (!persona) throw new Error(`Unknown TTS persona: ${params.persona}`);
		setTtsPersona(prefsPath, persona.id);
		return { persona: persona.id };
	}
	if (!params.provider) throw new Error("--provider is required");
	const provider = canonicalizeSpeechProviderId(params.provider, cfg);
	if (!provider) throw new Error(`Unknown speech provider: ${params.provider}`);
	setTtsProvider(prefsPath, provider);
	return { provider };
}
//#endregion
//#region src/cli/capability-cli/tts.ts
function registerTransportTtsCommand(command, defaultTransport, run, formatText = (value) => JSON.stringify(value, null, 2)) {
	command.option("--local", "Force local execution", false).option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await run(opts, resolveTransport({
				local: Boolean(opts.local),
				gateway: Boolean(opts.gateway),
				supported: ["local", "gateway"],
				defaultTransport
			}));
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatText);
		});
	});
}
function registerTtsCapabilityCommands(capability) {
	const tts = capability.command("tts").description("Text to speech");
	registerTransportTtsCommand(tts.command("convert").description("Convert text to speech").requiredOption("--text <text>", "Input text").option("--channel <id>", "Channel hint").option("--voice <id>", "Voice hint").option("--provider <id>", "Speech provider id").option("--model <provider/model>", "Model override").option("--output <path>", "Output path"), "local", async (opts, transport) => {
		const modelRef = resolveModelRefOverride(opts.model);
		if (opts.model && !modelRef.provider) throw new Error("TTS model overrides must use the form <provider/model>.");
		const provider = normalizeSpeechProviderId(typeof opts.provider === "string" && opts.provider.trim() ? opts.provider.trim() : modelRef.provider);
		const modelProvider = normalizeSpeechProviderId(modelRef.provider);
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
	tts.command("voices").description("List voices for a TTS provider").option("--provider <id>", "Speech provider id").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const voices = await runTtsVoices(opts.provider);
			emitJsonOrText(defaultRuntime, Boolean(opts.json), voices, providerSummaryText);
		});
	});
	registerTransportTtsCommand(tts.command("providers").description("List speech providers").option("--agent <id>", "Agent whose provider state should be inspected"), "local", (opts, transport) => runTtsProviders(transport, opts.agent));
	registerTransportTtsCommand(tts.command("personas").description("List TTS personas"), "local", (_, transport) => runTtsPersonas(transport));
	tts.command("status").description("Show TTS status").option("--gateway", "Force gateway execution", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const transport = resolveTransport({
				gateway: Boolean(opts.gateway),
				supported: ["gateway"],
				defaultTransport: "gateway"
			});
			const result = await callGateway({
				method: "tts.status",
				timeoutMs: 3e4
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), {
				transport,
				...result
			}, (value) => JSON.stringify(value, null, 2));
		});
	});
	for (const [commandName, capabilityId] of [["enable", "tts.enable"], ["disable", "tts.disable"]]) registerTransportTtsCommand(tts.command(commandName).description(`${commandName === "enable" ? "Enable" : "Disable"} TTS`), "gateway", (_, transport) => runTtsStateMutation({
		capability: capabilityId,
		transport
	}));
	registerTransportTtsCommand(tts.command("set-provider").description("Set the active TTS provider").requiredOption("--provider <id>", "Speech provider id"), "gateway", (opts, transport) => runTtsStateMutation({
		capability: "tts.set-provider",
		provider: String(opts.provider),
		transport
	}));
	registerTransportTtsCommand(tts.command("set-persona").description("Set the active TTS persona").addOption(new Option("--persona <id>", "TTS persona id").conflicts("off")).option("--off", "Disable the active TTS persona", false), "gateway", (opts, transport) => {
		if (!opts.off && !opts.persona) throw new Error("--persona is required unless --off is set");
		return runTtsStateMutation({
			capability: "tts.set-persona",
			persona: opts.off ? null : String(opts.persona),
			transport
		});
	});
}
//#endregion
export { registerTtsCapabilityCommands };
