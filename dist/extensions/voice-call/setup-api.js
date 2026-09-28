import { asFiniteNumber, asOptionalRecord, isRecord, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/voice-call/src/config-migration.ts
/** Migrate legacy voice-call config input to the current canonical shape. */
function migrateVoiceCallLegacyConfigInput(params) {
	const raw = asOptionalRecord(params.value) ?? {};
	const realtime = asOptionalRecord(raw.realtime);
	const realtimeAgentContext = asOptionalRecord(realtime?.agentContext);
	const twilio = asOptionalRecord(raw.twilio);
	const streaming = asOptionalRecord(raw.streaming);
	const configPathPrefix = params.configPathPrefix ?? "plugins.entries.voice-call.config";
	const changes = [];
	if (raw.provider === "log") changes.push(`Moved ${configPathPrefix}.provider "log" → "mock".`);
	if (typeof twilio?.from === "string") {
		const source = `${configPathPrefix}.twilio.from`;
		const target = `${configPathPrefix}.fromNumber`;
		changes.push(raw.fromNumber != null ? `Removed ${source} (kept ${target}).` : `Moved ${source} → ${target}.`);
	}
	const streamingProvider = readStringField(streaming, "provider");
	const legacyStreamingProvider = readStringField(streaming, "sttProvider");
	const normalizedStreaming = streaming ? {
		...streaming,
		provider: streamingProvider ?? legacyStreamingProvider
	} : void 0;
	if (normalizedStreaming) {
		delete normalizedStreaming.sttProvider;
		if (legacyStreamingProvider !== void 0) {
			const source = `${configPathPrefix}.streaming.sttProvider`;
			const target = `${configPathPrefix}.streaming.provider`;
			changes.push(streamingProvider !== void 0 ? `Removed ${source} (kept ${target}).` : `Moved ${source} → ${target}.`);
		}
		for (const [legacyKey, canonicalKey, value] of [
			[
				"openaiApiKey",
				"apiKey",
				readStringField(streaming, "openaiApiKey")
			],
			[
				"sttModel",
				"model",
				readStringField(streaming, "sttModel")
			],
			[
				"silenceDurationMs",
				"silenceDurationMs",
				asFiniteNumber(streaming?.silenceDurationMs)
			],
			[
				"vadThreshold",
				"vadThreshold",
				asFiniteNumber(streaming?.vadThreshold)
			]
		]) {
			if (!Object.hasOwn(normalizedStreaming, legacyKey)) continue;
			delete normalizedStreaming[legacyKey];
			const source = `${configPathPrefix}.streaming.${legacyKey}`;
			if (value === void 0 || value === "") {
				changes.push(`Removed invalid ${source}.`);
				continue;
			}
			const providers = asOptionalRecord(normalizedStreaming.providers);
			const existing = asOptionalRecord(providers?.openai);
			const target = `${configPathPrefix}.streaming.providers.openai.${canonicalKey}`;
			if (existing?.[canonicalKey] !== void 0) {
				changes.push(`Removed ${source} (kept ${target}).`);
				continue;
			}
			normalizedStreaming.providers = {
				...providers,
				openai: {
					...existing,
					[canonicalKey]: value
				}
			};
			changes.push(`Moved ${source} → ${target}.`);
		}
	}
	const normalizedTwilio = twilio ? { ...twilio } : void 0;
	if (normalizedTwilio) delete normalizedTwilio.from;
	const normalizedRealtimeAgentContext = realtimeAgentContext ? { ...realtimeAgentContext } : void 0;
	if (normalizedRealtimeAgentContext) delete normalizedRealtimeAgentContext.includeSystemPrompt;
	const normalizedRealtime = realtime ? {
		...realtime,
		agentContext: normalizedRealtimeAgentContext ?? realtime.agentContext
	} : void 0;
	const config = {
		...raw,
		provider: raw.provider === "log" ? "mock" : raw.provider,
		fromNumber: raw.fromNumber ?? (typeof twilio?.from === "string" ? twilio.from : void 0),
		twilio: normalizedTwilio,
		streaming: normalizedStreaming,
		realtime: normalizedRealtime
	};
	if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt")) changes.push(`Removed ${configPathPrefix}.realtime.agentContext.includeSystemPrompt.`);
	return {
		config,
		changes
	};
}
//#endregion
//#region extensions/voice-call/setup-api.ts
/** Migrate voice-call plugin config inside the full OpenClaw config object. */
function migrateVoiceCallPluginConfig(config) {
	const rawVoiceCallConfig = config.plugins?.entries?.["voice-call"]?.config;
	if (!isRecord(rawVoiceCallConfig)) return null;
	const migration = migrateVoiceCallLegacyConfigInput({
		value: rawVoiceCallConfig,
		configPathPrefix: "plugins.entries.voice-call.config"
	});
	if (migration.changes.length === 0) return null;
	const plugins = structuredClone(config.plugins ?? {});
	const entries = { ...plugins.entries };
	entries["voice-call"] = {
		...isRecord(entries["voice-call"]) ? entries["voice-call"] : {},
		config: migration.config
	};
	plugins.entries = entries;
	return {
		config: {
			...config,
			plugins
		},
		changes: migration.changes
	};
}
/** Setup plugin entry that registers voice-call config migrations. */
var setup_api_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call Setup",
	description: "Lightweight Voice Call setup hooks",
	register(api) {
		api.registerConfigMigration((config) => migrateVoiceCallPluginConfig(config));
	}
});
//#endregion
export { setup_api_default as default };
