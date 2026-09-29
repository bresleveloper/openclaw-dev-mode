import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Uo as validateTtsSpeakParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { a as getSpeechProvider, i as canonicalizeSpeechProviderId, s as listSpeechProviders } from "./directives-B0TC0IWT.mjs";
import { _ as resolveTtsPrefsPath, h as resolveTtsConfig, l as listTtsPersonas, o as getTtsPersona, y as resolveTtsSettingsSnapshot } from "./tts-settings-CuXW4C4p.mjs";
import { D as resolveTtsProviderOrder, E as resolvePreparedTtsProvider, T as isTtsProviderConfigured, _ as setTtsProvider, g as setTtsPersona, m as setTtsEnabled, s as resolveExplicitTtsOverrides, v as synthesizeSpeech } from "./runtime-api-BvEX7sJP.mjs";
import { n as textToSpeech } from "./tts-DydeHokL.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { t as inferSpeechMimeType } from "./speech-mime-BifVvenT.mjs";
//#region src/gateway/server-methods/tts.ts
function yieldBeforeTtsStatusSetup() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function resolveTtsGatewayStatusFacts(cfg) {
	const settings = resolveTtsSettingsSnapshot({ cfg });
	const speechProviders = listSpeechProviders(cfg);
	const configuredByProvider = new Map(speechProviders.map((provider) => [provider.id, isTtsProviderConfigured(settings.config, provider, cfg)]));
	return {
		configuredByProvider,
		provider: resolvePreparedTtsProvider({
			config: settings.config,
			preference: settings.providerPreference,
			providers: speechProviders,
			configuredByProvider
		}),
		settings,
		speechProviders
	};
}
/** Gateway request handlers for TTS status, preference mutation, and synthesis. */
const ttsHandlers = {
	"tts.status": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			await yieldBeforeTtsStatusSetup();
			const cfg = context.getRuntimeConfig();
			const { configuredByProvider, provider, settings, speechProviders } = resolveTtsGatewayStatusFacts(cfg);
			const fallbackProviders = resolveTtsProviderOrder(provider, cfg, speechProviders).slice(1).filter((candidate) => {
				if (configuredByProvider.has(candidate)) return configuredByProvider.get(candidate) === true;
				return isTtsProviderConfigured(settings.config, candidate, cfg);
			});
			const providerStates = speechProviders.map((candidate) => ({
				id: candidate.id,
				label: candidate.label,
				configured: configuredByProvider.get(candidate.id) === true
			}));
			respond(true, {
				enabled: settings.autoMode !== "off",
				auto: settings.autoMode,
				provider,
				persona: settings.persona?.id ?? null,
				personas: listTtsPersonas(settings.config).map((entry) => ({
					id: entry.id,
					label: entry.label,
					description: entry.description,
					provider: entry.provider
				})),
				fallbackProvider: fallbackProviders[0] ?? null,
				fallbackProviders,
				prefsPath: settings.prefsPath,
				providerStates
			});
		});
	},
	"tts.enable": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			setTtsEnabled(prefsPath, true);
			respond(true, { enabled: true });
		});
	},
	"tts.disable": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			setTtsEnabled(prefsPath, false);
			respond(true, { enabled: false });
		});
	},
	"tts.convert": async ({ params, respond, context }) => {
		const text = normalizeOptionalString(params.text) ?? "";
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "tts.convert requires text"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const channel = normalizeOptionalString(params.channel);
			const providerRaw = normalizeOptionalString(params.provider);
			const modelId = normalizeOptionalString(params.modelId);
			const voiceId = normalizeOptionalString(params.voiceId);
			let overrides;
			try {
				overrides = resolveExplicitTtsOverrides({
					cfg,
					provider: providerRaw,
					modelId,
					voiceId
				});
			} catch (err) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
				return;
			}
			const result = await textToSpeech({
				text,
				cfg,
				channel,
				overrides,
				disableFallback: Boolean(overrides.provider || modelId || voiceId)
			});
			if (result.success && result.audioPath) {
				respond(true, {
					audioPath: result.audioPath,
					provider: result.provider,
					outputFormat: result.outputFormat,
					voiceCompatible: result.voiceCompatible
				});
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error ?? "TTS conversion failed"));
		});
	},
	"tts.speak": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateTtsSpeakParams, "tts.speak", respond)) return;
		const text = normalizeOptionalString(params.text);
		if (!text) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "tts.speak requires text"));
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const maxTextLength = resolveTtsConfig(cfg).maxTextLength;
			if (text.length > maxTextLength) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `tts.speak text too long (${text.length} chars, max ${maxTextLength})`));
				return;
			}
			assertSecretOwnerAvailable("capability", "tts");
			const result = await synthesizeSpeech({
				text,
				cfg
			});
			const provider = normalizeOptionalString(result.provider);
			if (!result.success || !result.audioBuffer || result.audioBuffer.length === 0 || !provider) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, result.error ?? "TTS synthesis failed"));
				return;
			}
			respond(true, {
				audioBase64: result.audioBuffer.toString("base64"),
				provider,
				outputFormat: result.outputFormat,
				mimeType: inferSpeechMimeType(result.outputFormat, result.fileExtension),
				fileExtension: result.fileExtension
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err), err instanceof SecretSurfaceUnavailableError ? { details: {
				reason: err.code,
				ownerKind: err.ownerKind,
				ownerId: err.ownerId
			} } : void 0));
		}
	},
	"tts.setProvider": async ({ params, respond, context }) => {
		const cfg = context.getRuntimeConfig();
		const provider = canonicalizeSpeechProviderId(normalizeOptionalString(params.provider) ?? "", cfg);
		if (!provider || !getSpeechProvider(provider, cfg)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid provider. Use a registered TTS provider id."));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			setTtsProvider(prefsPath, provider);
			respond(true, { provider });
		});
	},
	"tts.personas": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			respond(true, {
				active: getTtsPersona(config, prefsPath)?.id ?? null,
				personas: listTtsPersonas(config).map((persona) => ({
					id: persona.id,
					label: persona.label,
					description: persona.description,
					provider: persona.provider,
					fallbackPolicy: persona.fallbackPolicy,
					providers: Object.keys(persona.providers ?? {})
				}))
			});
		});
	},
	"tts.setPersona": async ({ params, respond, context }) => {
		const cfg = context.getRuntimeConfig();
		const rawPersona = normalizeOptionalString(params.persona);
		await respondUnavailableOnThrow(respond, async () => {
			const config = resolveTtsConfig(cfg);
			const prefsPath = resolveTtsPrefsPath(config);
			if (!rawPersona || [
				"off",
				"none",
				"default"
			].includes(rawPersona.toLowerCase())) {
				setTtsPersona(prefsPath, null);
				respond(true, { persona: null });
				return;
			}
			const persona = listTtsPersonas(config).find((entry) => entry.id === rawPersona.toLowerCase());
			if (!persona) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid persona. Use a configured TTS persona id."));
				return;
			}
			setTtsPersona(prefsPath, persona.id);
			respond(true, { persona: persona.id });
		});
	},
	"tts.providers": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const { configuredByProvider, provider, speechProviders } = resolveTtsGatewayStatusFacts(context.getRuntimeConfig());
			respond(true, {
				providers: speechProviders.map((candidate) => ({
					id: candidate.id,
					name: candidate.label,
					configured: configuredByProvider.get(candidate.id) === true,
					models: [...candidate.models ?? []],
					voices: [...candidate.voices ?? []]
				})),
				active: provider
			});
		});
	}
};
//#endregion
export { ttsHandlers };
