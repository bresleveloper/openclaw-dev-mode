import { w as parseStrictPositiveInteger } from "../../number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-BPNHa36e.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { i as resolveActiveTalkProviderConfig } from "../../talk-CaH8Mknv.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../number-runtime-CGwowceO.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../talk-config-runtime-CjZYxmxA.mjs";
import "../../api-C1QhMyxy.mjs";
//#region extensions/talk-voice/index.ts
function mask(s, keep = 6) {
	const trimmed = s.trim();
	if (trimmed.length <= keep) return "***";
	return `${trimmed.slice(0, keep)}…`;
}
function isLikelyVoiceId(value) {
	const v = value.trim();
	if (v.length < 10 || v.length > 64) return false;
	return /^[a-zA-Z0-9_-]+$/.test(v);
}
function resolveProviderLabel(providerId) {
	switch (providerId) {
		case "openai": return "OpenAI";
		case "microsoft": return "Microsoft";
		case "elevenlabs": return "ElevenLabs";
		default: return providerId;
	}
}
function formatVoiceMeta(voice) {
	const parts = [voice.locale, voice.gender];
	const personalities = voice.personalities?.filter((value) => value.trim().length > 0) ?? [];
	if (personalities.length > 0) parts.push(personalities.join(", "));
	const filtered = parts.filter((part) => Boolean(part?.trim()));
	return filtered.length > 0 ? filtered.join(" · ") : void 0;
}
function formatVoiceList(voices, limit, providerId) {
	const sliced = voices.slice(0, Math.max(1, Math.min(limit, 50)));
	const lines = [];
	lines.push(`${resolveProviderLabel(providerId)} voices: ${voices.length}`);
	lines.push("");
	for (const v of sliced) {
		const name = (v.name ?? "").trim() || "(unnamed)";
		const category = (v.category ?? "").trim();
		const meta = category ? ` · ${category}` : "";
		lines.push(`- ${name}${meta}`);
		lines.push(`  id: ${v.id}`);
		const details = formatVoiceMeta(v);
		if (details) lines.push(`  meta: ${details}`);
		const description = (v.description ?? "").trim();
		if (description) lines.push(`  note: ${description}`);
	}
	if (voices.length > sliced.length) {
		lines.push("");
		lines.push(`(showing first ${sliced.length})`);
	}
	return lines.join("\n");
}
function findVoice(voices, query) {
	const q = query.trim();
	if (!q) return null;
	const lower = normalizeLowercaseStringOrEmpty(q);
	const byId = voices.find((v) => v.id === q);
	if (byId) return byId;
	const exactName = voices.find((v) => normalizeOptionalLowercaseString(v.name) === lower);
	if (exactName) return exactName;
	return voices.find((v) => normalizeLowercaseStringOrEmpty(v.name).includes(lower)) ?? null;
}
function asTrimmedString(value) {
	return normalizeOptionalString(value) ?? "";
}
function resolveCommandLabel(channel) {
	return channel === "discord" ? "/talkvoice" : "/voice";
}
const TALK_ADMIN_SCOPE = "operator.admin";
function requiresAdminToSetVoice(params) {
	const { senderIsOwner, gatewayClientScopes } = params;
	if (Array.isArray(gatewayClientScopes)) return !gatewayClientScopes.includes(TALK_ADMIN_SCOPE);
	return senderIsOwner !== true;
}
var talk_voice_default = definePluginEntry({
	id: "talk-voice",
	name: "Talk Voice",
	description: "Select the active Talk voice and manage Talk voice configuration",
	register(api) {
		const loadTool = createLazyRuntimeModule(() => import("./tool.js"));
		api.registerTool({
			name: "talk_voice",
			label: "Talk Voice",
			description: "List or change the voice of the active realtime Talk call (browser, iOS, or Android) or Discord voice call in this conversation. Use list to see its provider, model, current voice, available voice IDs, and whether it can change. Use set with an available voice ID to reconnect the active call, preserving conversation and ongoing agent work. Success means the replacement call is ready. Saved voice defaults stay unchanged.",
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						enum: ["list", "set"]
					},
					voice: {
						type: "string",
						description: "Voice ID from list; required for set."
					}
				},
				required: ["action"],
				additionalProperties: false
			},
			execute: async (...args) => await (await loadTool()).executeTalkVoiceTool(...args)
		});
		api.registerCommand({
			name: "voice",
			nativeNames: { discord: "talkvoice" },
			description: "List/set Talk provider voices (affects iOS Talk playback).",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const assertOwnerCurrent = ctx.assertOwnerCurrent;
				const commandLabel = resolveCommandLabel(ctx.channel);
				const tokens = (ctx.args?.trim() ?? "").split(/\s+/).filter(Boolean);
				const action = normalizeLowercaseStringOrEmpty(tokens[0] ?? "status");
				const cfg = api.runtime.config.current();
				const active = resolveActiveTalkProviderConfig(cfg.talk);
				if (!active) return { text: "Talk voice is not configured.\n\nMissing: talk.provider and talk.providers.<provider>.\nSet it on the gateway, then retry." };
				const providerId = active.provider;
				const providerLabel = resolveProviderLabel(providerId);
				const apiKey = asTrimmedString(active.config.apiKey);
				const baseUrl = normalizeOptionalString(active.config.baseUrl);
				const currentVoiceId = asTrimmedString(active.config.voiceId);
				if (action === "status") return { text: `Talk voice status:
- provider: ${providerId}\n- talk.providers.${providerId}.voiceId: ${currentVoiceId ? currentVoiceId : "(unset)"}\n- ${providerId}.apiKey: ${apiKey ? mask(apiKey) : "(unset)"}` };
				if (action === "list") {
					const limit = parseStrictPositiveInteger(tokens[1]) ?? 12;
					try {
						return { text: formatVoiceList(await api.runtime.tts.listVoices({
							provider: providerId,
							cfg,
							apiKey: apiKey || void 0,
							baseUrl
						}), limit, providerId) };
					} catch (error) {
						return { text: `${providerLabel} voice list failed: ${formatErrorMessage(error)}` };
					}
				}
				if (action === "set") {
					if (requiresAdminToSetVoice({
						senderIsOwner: ctx.senderIsOwner,
						gatewayClientScopes: ctx.gatewayClientScopes
					})) return { text: `⚠️ ${commandLabel} set requires operator.admin.` };
					const query = tokens.slice(1).join(" ").trim();
					if (!query) return { text: `Usage: ${commandLabel} set <voiceId|name>` };
					let voices;
					try {
						voices = await api.runtime.tts.listVoices({
							provider: providerId,
							cfg,
							apiKey: apiKey || void 0,
							baseUrl
						});
					} catch (error) {
						return { text: `${providerLabel} voice lookup failed: ${formatErrorMessage(error)}` };
					}
					const chosen = findVoice(voices, query);
					if (!chosen) return { text: `No voice found for ${isLikelyVoiceId(query) ? query : `"${query}"`}. Try: ${commandLabel} list` };
					await api.runtime.config.mutateConfigFile({
						afterWrite: { mode: "auto" },
						writeOptions: { assertCurrent: Array.isArray(ctx.gatewayClientScopes) ? void 0 : assertOwnerCurrent },
						mutate: (draft) => {
							const nextConfig = {
								...draft,
								talk: {
									...draft.talk,
									provider: providerId,
									providers: {
										...draft.talk?.providers,
										[providerId]: {
											...draft.talk?.providers?.[providerId],
											voiceId: chosen.id
										}
									}
								}
							};
							Object.assign(draft, nextConfig);
						}
					});
					return { text: `✅ ${providerLabel} Talk voice set to ${(chosen.name ?? "").trim() || "(unnamed)"}\n${chosen.id}` };
				}
				return { text: [
					"Voice commands:",
					"",
					`${commandLabel} status`,
					`${commandLabel} list [limit]`,
					`${commandLabel} set <voiceId|name>`
				].join("\n") };
			}
		});
	}
});
//#endregion
export { talk_voice_default as default };
