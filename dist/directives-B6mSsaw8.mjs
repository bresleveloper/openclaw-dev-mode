import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getActiveRuntimePluginRegistry } from "./active-runtime-registry-k2s7FqfS.mjs";
import { t as buildCapabilityProviderIndex } from "./provider-registry-shared-CGngP_UC.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BdPCG__9.mjs";
import { t as extractTtsDirectiveFacts } from "./directive-facts-C2V6h8RE.mjs";
import { n as createSpeechProviderRegistry, t as compareSpeechProviderOrder } from "./provider-registry-core-DdKgepX8.mjs";
//#region src/tts/provider-registry.ts
/** Resolve speech providers from configured plugin capabilities. */
function resolveSpeechProviderPluginEntries(cfg) {
	return resolvePluginCapabilityProviders({
		key: "speechProviders",
		cfg
	});
}
/** Config-aware registry used by setup/status/runtime paths before plugins are loaded. */
const defaultSpeechProviderRegistry = createSpeechProviderRegistry({
	getProvider: (providerId, cfg) => resolvePluginCapabilityProvider({
		key: "speechProviders",
		providerId,
		cfg
	}),
	listProviders: resolveSpeechProviderPluginEntries
});
/** List configured speech providers using manifest/capability discovery. */
const listSpeechProviders = defaultSpeechProviderRegistry.listSpeechProviders;
/** List currently loaded speech providers from the active runtime registry. */
function listLoadedSpeechProviders(_cfg) {
	const providers = (getActiveRuntimePluginRegistry()?.speechProviders ?? []).map((entry) => entry.provider);
	return [...buildCapabilityProviderIndex(providers, "canonical").values()];
}
/** Resolve a configured speech provider by canonical ID or alias. */
const getSpeechProvider = defaultSpeechProviderRegistry.getSpeechProvider;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
const canonicalizeSpeechProviderId = defaultSpeechProviderRegistry.canonicalizeSpeechProviderId;
//#endregion
//#region src/tts/directives.ts
function resolveDirectiveProviders(options) {
	return (options?.providers ?? listSpeechProviders(options?.cfg)).toSorted(compareSpeechProviderOrder);
}
function resolveDirectiveProviderConfig(provider, options) {
	return options?.providerConfigs?.[provider.id];
}
function prioritizeProvider(providers, providerId) {
	if (!providerId) return [...providers];
	const preferredProvider = resolveDirectiveProvider(providers, providerId);
	if (!preferredProvider) return [...providers];
	return [preferredProvider, ...providers.filter((provider) => provider.id !== preferredProvider.id)];
}
function resolveDirectiveProvider(providers, providerId) {
	const normalized = normalizeLowercaseStringOrEmpty(providerId);
	if (!normalized) return;
	return providers.find((provider) => provider.id === normalized || provider.aliases?.some((alias) => normalizeLowercaseStringOrEmpty(alias) === normalized));
}
function parseGenericSpeakerDirective(params) {
	if (!params.policy.allowVoice) return;
	switch (params.key) {
		case "speakervoice":
		case "speaker_voice": return {
			...params.currentOverrides,
			speakerVoice: params.value,
			voice: params.value,
			voiceName: params.value
		};
		case "speakervoiceid":
		case "speaker_voice_id": return {
			...params.currentOverrides,
			speakerVoiceId: params.value,
			voiceId: params.value
		};
		default: return;
	}
}
function normalizeTtsTagBody(body) {
	return body.trim().replace(/\s+/g, "").toLowerCase();
}
function classifyTtsTag(body) {
	const normalized = normalizeTtsTagBody(body);
	if (normalized === "tts:text") return "hidden-open";
	if (normalized === "/tts:text") return "hidden-close";
	if (normalized === "tts" || normalized.startsWith("tts:") || normalized === "/tts" || normalized.startsWith("/tts:")) return "tts";
	return "other";
}
/** Create an incremental cleaner for hiding [[tts:*]] directive text while streaming. */
function createTtsDirectiveTextStreamCleaner() {
	let pending = "";
	let insideHiddenTextBlock = false;
	return {
		push(text) {
			const input = pending + text;
			pending = "";
			let output = "";
			let index = 0;
			while (index < input.length) {
				const tagStart = input.indexOf("[[", index);
				if (tagStart === -1) {
					const tail = input.endsWith("[") ? input.length - 1 : input.length;
					if (!insideHiddenTextBlock) output += input.slice(index, tail);
					pending = input.slice(tail);
					break;
				}
				if (!insideHiddenTextBlock) output += input.slice(index, tagStart);
				const tagEnd = input.indexOf("]]", tagStart + 2);
				if (tagEnd === -1) {
					pending = input.slice(tagStart);
					break;
				}
				const rawTag = input.slice(tagStart, tagEnd + 2);
				const tag = classifyTtsTag(input.slice(tagStart + 2, tagEnd));
				if (tag === "hidden-open") insideHiddenTextBlock = true;
				else if (tag === "hidden-close") insideHiddenTextBlock = false;
				else if (tag === "other" && !insideHiddenTextBlock) output += rawTag;
				index = tagEnd + 2;
			}
			return output;
		},
		flush() {
			const tail = insideHiddenTextBlock ? "" : pending;
			pending = "";
			insideHiddenTextBlock = false;
			return tail;
		},
		hasBufferedDirectiveText() {
			return pending.length > 0 || insideHiddenTextBlock;
		}
	};
}
/** Resolve persisted TTS facts against the active model/provider policy. */
function resolveTtsDirectiveFacts(facts, policy, options) {
	if (!facts || !policy.enabled) return {
		overrides: {},
		warnings: [],
		hasDirective: false
	};
	let providers;
	const getProviders = () => {
		providers ??= resolveDirectiveProviders(options);
		return providers;
	};
	const overrides = {};
	const warnings = [];
	if (policy.allowText && facts.text != null) overrides.ttsText = facts.text;
	for (const directive of facts.directives ?? []) {
		const declaredProviderId = policy.allowProvider ? directive.provider : void 0;
		if (declaredProviderId) overrides.provider = declaredProviderId;
		let directiveProviders;
		const getDirectiveProviders = () => {
			if (directiveProviders) return directiveProviders;
			if (declaredProviderId) {
				const declaredProvider = resolveDirectiveProvider(getProviders(), declaredProviderId);
				if (!declaredProvider) {
					warnings.push(`unknown provider "${declaredProviderId}"`);
					directiveProviders = [];
					return directiveProviders;
				}
				directiveProviders = [declaredProvider];
				return directiveProviders;
			}
			directiveProviders = prioritizeProvider(getProviders(), normalizeLowercaseStringOrEmpty(options?.preferredProviderId));
			return directiveProviders;
		};
		for (const [key, value] of Object.entries(directive.values)) {
			let handled = false;
			const directiveProvidersLocal = getDirectiveProviders();
			for (const provider of directiveProvidersLocal) {
				const genericSpeakerOverrides = parseGenericSpeakerDirective({
					key,
					value,
					policy,
					currentOverrides: overrides.providerOverrides?.[provider.id]
				});
				if (genericSpeakerOverrides) {
					overrides.providerOverrides = {
						...overrides.providerOverrides,
						[provider.id]: {
							...overrides.providerOverrides?.[provider.id],
							...genericSpeakerOverrides
						}
					};
					handled = true;
					break;
				}
				const parsed = provider.parseDirectiveToken?.({
					key,
					value,
					policy,
					selectedProvider: declaredProviderId ? provider.id : void 0,
					providerConfig: resolveDirectiveProviderConfig(provider, options),
					currentOverrides: overrides.providerOverrides?.[provider.id]
				});
				if (!parsed?.handled) continue;
				if (parsed.overrides) overrides.providerOverrides = {
					...overrides.providerOverrides,
					[provider.id]: {
						...overrides.providerOverrides?.[provider.id],
						...parsed.overrides
					}
				};
				if (parsed.warnings?.length) warnings.push(...parsed.warnings);
				handled = true;
				break;
			}
			if (!handled && declaredProviderId && directiveProvidersLocal.length > 0) warnings.push(`unsupported ${declaredProviderId} directive key "${key}"`);
		}
	}
	return {
		ttsText: overrides.ttsText,
		hasDirective: true,
		overrides,
		warnings
	};
}
/** Parse TTS directives from final message text, leaving markdown code spans unchanged. */
function parseTtsDirectives(text, policy, options) {
	if (!policy.enabled) return {
		cleanedText: text,
		overrides: {},
		warnings: [],
		hasDirective: false
	};
	const extracted = extractTtsDirectiveFacts(text);
	const resolved = resolveTtsDirectiveFacts(extracted.facts, policy, options);
	return {
		cleanedText: extracted.cleanedText,
		...resolved
	};
}
//#endregion
export { getSpeechProvider as a, canonicalizeSpeechProviderId as i, parseTtsDirectives as n, listLoadedSpeechProviders as o, resolveTtsDirectiveFacts as r, listSpeechProviders as s, createTtsDirectiveTextStreamCleaner as t };
