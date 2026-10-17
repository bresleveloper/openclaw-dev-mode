import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-BYw8loNa.mjs";
import "./model-auth-efmtIdn2.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import { r as callGateway } from "./call-DnqhP17M.mjs";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BcuL3xPn.mjs";
import { i as canonicalizeSpeechProviderId, s as listSpeechProviders } from "./directives-C6jXm9yj.mjs";
import { _ as resolveTtsPrefsPath, g as resolveTtsPersonaList, l as listTtsPersonas, m as resolveTtsConfig, s as isTtsConfigReservedKey } from "./tts-settings-BjvUxLqs.mjs";
import { p as getTtsCommandSecretTargetIds } from "./command-secret-targets-C5LZrFZ5.mjs";
import { _ as setTtsProvider, g as setTtsPersona, l as listSpeechVoices, m as setTtsEnabled, s as resolveExplicitTtsOverrides, t as getTtsProvider } from "./runtime-api-wIBt-FEY.mjs";
import { n as textToSpeech } from "./tts-B6u94w1F.mjs";
import { a as providerHasGenericConfig, c as resolveCapabilityProviderAgentId, d as resolveSelectedProviderFromModelRef, i as pinRuntimeConfigSnapshot, u as resolveLocalCapabilityRuntimeConfig } from "./shared-B13FktqB.mjs";
import "./media-output-BoQ_CIXM.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cli/capability-cli/tts-runtime.ts
async function runTtsConvert(params) {
	let result;
	let attempts = [];
	if (params.transport === "gateway") {
		const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({ config: getRuntimeConfig() });
		if (params.output && !isLoopbackHost(new URL(gatewayConnection.url).hostname)) throw new Error(`--output is not supported for remote gateway TTS yet (gateway target: ${gatewayConnection.url}).`);
		result = await callGateway({
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
	} else {
		const cfg = await resolveLocalCapabilityRuntimeConfig({
			commandName: "infer tts convert",
			targetIds: getTtsCommandSecretTargetIds()
		});
		let ttsProvider = params.provider ?? resolveSelectedProviderFromModelRef(normalizeOptionalString(params.modelId));
		if (!ttsProvider) {
			const ttsConfig = resolveTtsConfig(cfg, { channelId: params.channel });
			ttsProvider = getTtsProvider(ttsConfig, resolveTtsPrefsPath(ttsConfig));
		}
		const effectiveCfg = await injectTtsAuthProfileApiKey({
			cfg,
			provider: ttsProvider,
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
		const localResult = await textToSpeech({
			text: params.text,
			cfg: effectiveCfg,
			channel: params.channel,
			overrides,
			disableFallback: hasExplicitSelection
		});
		if (!localResult.success || !localResult.audioPath) throw new Error(localResult.error ?? "TTS conversion failed");
		result = localResult;
		attempts = localResult.attempts ?? [];
	}
	let outputPath = result.audioPath;
	if (params.output && result.audioPath) {
		const sourcePath = result.audioPath;
		outputPath = path.resolve(params.output);
		await publishOutputFileAtomically({
			filePath: outputPath,
			writeTemp: (tempPath) => fs.copyFile(sourcePath, tempPath)
		});
	}
	return {
		ok: true,
		capability: "tts.convert",
		transport: params.transport,
		provider: result.provider,
		attempts,
		outputs: [{
			path: outputPath,
			format: result.outputFormat,
			voiceCompatible: result.voiceCompatible
		}]
	};
}
async function injectTtsAuthProfileApiKey(params) {
	const { cfg } = params;
	if (!params.provider) return cfg;
	const providerId = canonicalizeSpeechProviderId(params.provider, cfg) ?? normalizeLowercaseStringOrEmpty(params.provider);
	if (!providerId) return cfg;
	if (ttsProviderConfigHasApiKey(resolveTtsConfig(cfg, { channelId: params.channelId }).providerConfigs[providerId])) return cfg;
	const channelId = normalizeOptionalString(params.channelId);
	const channelKey = isRecord(cfg.channels) && channelId ? Object.hasOwn(cfg.channels, channelId) ? channelId : Object.keys(cfg.channels).find((key) => normalizeLowercaseStringOrEmpty(key) === channelId.toLowerCase()) : void 0;
	let channel = channelKey ? cfg.channels?.[channelKey] : void 0;
	const channelProvider = isRecord(channel) ? findTtsProviderConfig(channel.tts, providerId, cfg) : void 0;
	const existing = channelProvider ?? findTtsProviderConfig(cfg.tts, providerId, cfg);
	if (ttsProviderConfigHasApiKey(existing?.value)) return cfg;
	const auth = await resolveApiKeyForProviderCore({
		provider: providerId,
		cfg,
		credentialPrecedence: "profile-first"
	}).catch(() => void 0);
	if (!auth?.apiKey || auth.mode !== "api-key") return cfg;
	if (channelProvider && channelKey) {
		channel = cfg.channels?.[channelKey];
		if (!isRecord(channel)) return cfg;
	}
	const rawTts = channelProvider && isRecord(channel) ? channel.tts : cfg.tts;
	const tts = isRecord(rawTts) ? { ...rawTts } : {};
	const key = existing?.key ?? providerId;
	const providerConfig = {
		...isRecord(existing?.value) ? existing.value : {},
		apiKey: auth.apiKey
	};
	if (existing?.container === "direct") tts[key] = providerConfig;
	else tts.providers = {
		...isRecord(tts.providers) ? tts.providers : {},
		[key]: providerConfig
	};
	return channelProvider && channelKey && isRecord(channel) ? {
		...cfg,
		channels: {
			...cfg.channels,
			[channelKey]: {
				...channel,
				tts
			}
		}
	} : {
		...cfg,
		tts
	};
}
function findTtsProviderConfig(tts, providerId, cfg) {
	if (!isRecord(tts)) return;
	const providers = isRecord(tts.providers) ? tts.providers : void 0;
	const exact = providers?.[providerId];
	if (exact !== void 0) return {
		container: "providers",
		key: providerId,
		value: exact
	};
	for (const [container, entries] of [["providers", providers], ["direct", tts]]) for (const [key, value] of Object.entries(entries ?? {})) {
		if (container === "direct" && isTtsConfigReservedKey(key)) continue;
		if (normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, cfg) ?? key) === providerId) return {
			container,
			key,
			value
		};
	}
}
function ttsProviderConfigHasApiKey(value) {
	return isRecord(value) && "apiKey" in value;
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
	return resolveTtsPersonaList(cfg);
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
	if (params.capability === "tts.enable" || params.capability === "tts.disable") {
		const enabled = params.capability === "tts.enable";
		setTtsEnabled(prefsPath, enabled);
		return { enabled };
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
export { runTtsConvert, runTtsPersonas, runTtsProviders, runTtsStateMutation, runTtsVoices };
