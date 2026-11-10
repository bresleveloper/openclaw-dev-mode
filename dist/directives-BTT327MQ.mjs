import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { r as resolveTtsDirectiveBody, t as extractTtsDirectiveFacts } from "./directive-facts-BhZzS84j.mjs";
import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-Cov0065J.mjs";
import "./active-runtime-registry-BrXk-dcA.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-CM-mwRei.mjs";
import { n as createInlineCodeState, t as buildCodeSpanIndex } from "./code-spans-CZQEb2AV.mjs";
//#region src/tts/provider-registry-core.ts
/** Order speech providers by priority and provider ID for deterministic equal-priority fallback. */
function compareSpeechProviderOrder(left, right) {
	const leftOrder = left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	return left.id.localeCompare(right.id);
}
/** Create a registry facade with canonical listing, alias lookup, and ID canonicalization. */
function createSpeechProviderRegistry(resolver) {
	const getProvider = (providerId, cfg) => {
		const normalized = normalizeCapabilityProviderId(providerId);
		if (!normalized) return;
		return resolver.getProvider(normalized, cfg) ?? buildCapabilityProviderIndex(resolver.listProviders(cfg), "aliases").get(normalized);
	};
	return {
		canonicalizeSpeechProviderId: (providerId, cfg) => {
			const normalized = normalizeCapabilityProviderId(providerId);
			return normalized ? getProvider(normalized, cfg)?.id ?? normalized : void 0;
		},
		getSpeechProvider: getProvider,
		listSpeechProviders: (cfg) => [...buildCapabilityProviderIndex(resolver.listProviders(cfg), "canonical").values()]
	};
}
//#endregion
//#region src/tts/provider-registry.ts
/** Config-aware registry used by setup/status/runtime paths before plugins are loaded. */
const defaultSpeechProviderRegistry = createSpeechProviderRegistry({
	getProvider: (providerId, cfg) => resolvePluginCapabilityProvider({
		key: "speechProviders",
		providerId,
		cfg
	}),
	listProviders: (cfg) => resolvePluginCapabilityProviders({
		key: "speechProviders",
		cfg
	})
});
/** List configured speech providers using manifest/capability discovery. */
const listSpeechProviders = defaultSpeechProviderRegistry.listSpeechProviders;
/** List currently loaded speech providers from the active runtime registry. */
function listLoadedSpeechProviders(_cfg) {
	const providers = (getActivePluginRegistry()?.speechProviders ?? []).map((entry) => entry.provider);
	return [...buildCapabilityProviderIndex(providers, "canonical").values()];
}
/** Resolve a configured speech provider by canonical ID or alias. */
const getSpeechProvider = defaultSpeechProviderRegistry.getSpeechProvider;
/** Resolve an input provider ID or alias to the provider's canonical ID. */
const canonicalizeSpeechProviderId = defaultSpeechProviderRegistry.canonicalizeSpeechProviderId;
//#endregion
//#region src/tts/directives.ts
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
			speakerVoice: params.value,
			voice: params.value,
			voiceName: params.value
		};
		case "speakervoiceid":
		case "speaker_voice_id": return {
			speakerVoiceId: params.value,
			voiceId: params.value
		};
		default: return;
	}
}
function classifyTtsTag(body) {
	const normalized = body.trim().replace(/\s+/g, "").toLowerCase();
	if (normalized === "tts:text") return "hidden-open";
	if (normalized === "/tts:text") return "hidden-close";
	if (normalized === "tts" || normalized.startsWith("tts:") || normalized === "/tts" || normalized.startsWith("/tts:")) return "tts";
	return "other";
}
/** Create an incremental cleaner for hiding [[tts:*]] directive text while streaming. */
function createTtsDirectiveTextStreamCleaner() {
	let pending = "";
	let insideHiddenTextBlock = false;
	let inlineCode = createInlineCodeState();
	let fence = {};
	const trackVisibleText = (text, code = buildCodeSpanIndex(text, inlineCode, fence)) => {
		inlineCode = code.inlineState;
		fence = code.fenceState;
		return text;
	};
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
					if (!insideHiddenTextBlock) output += trackVisibleText(input.slice(index, tail));
					pending = input.slice(tail);
					break;
				}
				const tagEnd = input.indexOf("]]", tagStart + 2);
				if (tagEnd === -1) {
					if (!insideHiddenTextBlock) output += trackVisibleText(input.slice(index, tagStart));
					pending = input.slice(tagStart);
					break;
				}
				const tag = classifyTtsTag(input.slice(tagStart + 2, tagEnd));
				const keepTag = tag === "other";
				if (!insideHiddenTextBlock) {
					const segment = input.slice(index, tagEnd + 2);
					const code = buildCodeSpanIndex(segment, inlineCode, fence);
					if (code.isInside(tagStart - index)) {
						output += trackVisibleText(segment, code);
						index = tagEnd + 2;
						continue;
					}
					output += trackVisibleText(input.slice(index, keepTag ? tagEnd + 2 : tagStart), keepTag ? code : void 0);
				}
				if (tag === "hidden-open") insideHiddenTextBlock = true;
				else if (tag === "hidden-close") insideHiddenTextBlock = false;
				else if (tag === "tts" && !insideHiddenTextBlock) {
					const body = /^\s*tts\s*:([\s\S]*)$/i.exec(input.slice(tagStart + 2, tagEnd))?.[1];
					if (body !== void 0) output += trackVisibleText(resolveTtsDirectiveBody(body) ?? "");
				}
				index = tagEnd + 2;
			}
			return output;
		},
		flush() {
			const tail = insideHiddenTextBlock ? "" : pending;
			pending = "";
			insideHiddenTextBlock = false;
			inlineCode = createInlineCodeState();
			fence = {};
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
	const overrides = {};
	const warnings = [];
	if (policy.allowText && facts.text != null) overrides.ttsText = facts.text;
	for (const directive of facts.directives ?? []) {
		const declaredProviderId = policy.allowProvider ? directive.provider : void 0;
		if (declaredProviderId) overrides.provider = declaredProviderId;
		const values = Object.entries(directive.values);
		if (values.length === 0) continue;
		providers ??= (options?.providers ?? listSpeechProviders(options?.cfg)).toSorted(compareSpeechProviderOrder);
		const selectedProvider = resolveDirectiveProvider(providers, declaredProviderId || normalizeLowercaseStringOrEmpty(options?.preferredProviderId));
		if (declaredProviderId && !selectedProvider) {
			warnings.push(`unknown provider "${declaredProviderId}"`);
			continue;
		}
		const directiveProviders = selectedProvider ? [selectedProvider, ...declaredProviderId ? [] : providers.filter((provider) => provider.id !== selectedProvider.id)] : providers;
		for (const [key, value] of values) {
			let handled = false;
			for (const provider of directiveProviders) {
				const genericSpeakerOverrides = parseGenericSpeakerDirective({
					key,
					value,
					policy
				});
				const parsed = genericSpeakerOverrides ? {
					handled: true,
					overrides: genericSpeakerOverrides
				} : provider.parseDirectiveToken?.({
					key,
					value,
					policy,
					selectedProvider: declaredProviderId ? provider.id : void 0,
					providerConfig: options?.providerConfigs?.[provider.id],
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
			if (!handled && declaredProviderId && directiveProviders.length > 0) warnings.push(`unsupported ${declaredProviderId} directive key "${key}"`);
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
export { getSpeechProvider as a, compareSpeechProviderOrder as c, canonicalizeSpeechProviderId as i, createSpeechProviderRegistry as l, parseTtsDirectives as n, listLoadedSpeechProviders as o, resolveTtsDirectiveFacts as r, listSpeechProviders as s, createTtsDirectiveTextStreamCleaner as t };
