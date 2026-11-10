import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { Ng as errorShape, ms as validateTtsSpeakParams } from "./src-pLJQA6J5.mjs";
import { n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as getSpeechProvider, i as canonicalizeSpeechProviderId, s as listSpeechProviders } from "./directives-BTT327MQ.mjs";
import { _ as resolveTtsPersonaList, h as resolveTtsConfig, u as listTtsPersonas, x as resolveTtsSettingsSnapshot, y as resolveTtsPrefsPathAsync } from "./tts-settings-D0coreBP.mjs";
import { n as prepareTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { A as resolveTtsProviderOrder, O as isTtsProviderConfiguredAsync, b as synthesizeSpeech, g as setTtsEnabled, k as resolvePreparedTtsProvider, l as resolveExplicitTtsOverridesAsync, v as setTtsPersona, y as setTtsProvider } from "./runtime-api-BSuqjkok.mjs";
import { n as textToSpeech } from "./tts-C0gbbadU.mjs";
import { t as inferSpeechMimeType } from "./speech-mime-8luU_Lj5.mjs";
//#region src/gateway/server-methods/tts.ts
async function resolveTtsGatewayStatusFacts(cfg) {
	const settings = resolveTtsSettingsSnapshot({
		cfg,
		preparedTtsPreferences: await prepareTtsPreferences()
	});
	const speechProviders = listSpeechProviders(cfg);
	const configuredByProvider = new Map(await Promise.all(speechProviders.map(async (provider) => [provider.id, await isTtsProviderConfiguredAsync(settings.config, provider, cfg)])));
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
function setTtsEnabledHandler(enabled) {
	return async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const config = resolveTtsConfig(context.getRuntimeConfig());
			setTtsEnabled(await resolveTtsPrefsPathAsync(config), enabled);
			respond(true, { enabled });
		});
	};
}
const ttsHandlers = {
	"tts.status": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			const { configuredByProvider, provider, settings, speechProviders } = await resolveTtsGatewayStatusFacts(cfg);
			const fallbackCandidates = resolveTtsProviderOrder(provider, cfg, speechProviders).slice(1);
			await Promise.all(fallbackCandidates.map(async (candidate) => {
				if (!configuredByProvider.has(candidate)) configuredByProvider.set(candidate, await isTtsProviderConfiguredAsync(settings.config, candidate, cfg));
			}));
			const fallbackProviders = fallbackCandidates.filter((candidate) => configuredByProvider.get(candidate) === true);
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
	"tts.enable": setTtsEnabledHandler(true),
	"tts.disable": setTtsEnabledHandler(false),
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
			const prefsPath = await resolveTtsPrefsPathAsync(resolveTtsConfig(cfg));
			let overrides;
			try {
				overrides = await resolveExplicitTtsOverridesAsync({
					cfg,
					prefsPath,
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
				prefsPath,
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
			const prefsPath = await resolveTtsPrefsPathAsync(config);
			setTtsProvider(prefsPath, provider);
			respond(true, { provider });
		});
	},
	"tts.personas": async ({ respond, context }) => {
		await respondUnavailableOnThrow(respond, async () => {
			const cfg = context.getRuntimeConfig();
			respond(true, await resolveTtsPersonaList(cfg));
		});
	},
	"tts.setPersona": async ({ params, respond, context }) => {
		const cfg = context.getRuntimeConfig();
		const rawPersona = normalizeOptionalString(params.persona);
		await respondUnavailableOnThrow(respond, async () => {
			const config = resolveTtsConfig(cfg);
			const prefsPath = await resolveTtsPrefsPathAsync(config);
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
			const { configuredByProvider, provider, speechProviders } = await resolveTtsGatewayStatusFacts(context.getRuntimeConfig());
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
