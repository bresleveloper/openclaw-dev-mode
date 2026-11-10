import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as mergeDeep } from "./deep-merge-D15Q7TVh.mjs";
import { g as resolveConfigDir } from "./utils-gjJ-tD2q.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { C as TtsAutoSchema } from "./zod-schema.core-BohYkI3l.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
//#region src/tts/tts-auto-mode.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
const TTS_AUTO_MODES = new Set(TtsAutoSchema.options);
function normalizeTtsAutoMode(value) {
	const parsed = TtsAutoSchema.safeParse(normalizeOptionalLowercaseString(value));
	return parsed.success ? parsed.data : void 0;
}
//#endregion
//#region src/tts/tts-config.ts
function resolveRecordEntry(entries, id, normalize) {
	const normalizedId = normalizeOptionalString(id);
	if (!entries || !normalizedId) return;
	if (Object.hasOwn(entries, normalizedId)) return entries[normalizedId];
	const normalized = normalize(normalizedId);
	const key = Object.keys(entries).find((candidate) => normalize(candidate) === normalized);
	return key ? entries[key] : void 0;
}
function asTtsConfig(value) {
	return isRecord(value) ? value : void 0;
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
	const context = typeof contextOrAgentId === "string" ? { agentId: contextOrAgentId } : contextOrAgentId ?? {};
	const base = cfg.tts ?? {};
	const agentOverride = context.agentId ? resolveAgentConfig(cfg, context.agentId)?.tts : void 0;
	const channelConfig = isRecord(cfg.channels) ? asOptionalRecord(resolveRecordEntry(cfg.channels, context.channelId, normalizeLowercaseStringOrEmpty)) : void 0;
	const channelOverride = asTtsConfig(channelConfig?.tts);
	const accountConfig = resolveRecordEntry(isRecord(channelConfig?.accounts) ? channelConfig.accounts : void 0, context.accountId, normalizeAccountId);
	const accountOverride = asTtsConfig(asOptionalRecord(accountConfig)?.tts);
	let merged = base;
	for (const override of [
		agentOverride,
		channelOverride,
		accountOverride
	]) merged = mergeDeep(merged, override ?? {});
	return merged;
}
/** Resolve the configured TTS mode, defaulting to final-answer synthesis. */
function resolveConfiguredTtsMode(cfg, contextOrAgentId) {
	return resolveEffectiveTtsConfig(cfg, contextOrAgentId).mode ?? "final";
}
function resolveTtsPrefsPathValue(prefsPath, machinePrefsPath) {
	if (prefsPath?.trim()) return resolveUserPath(prefsPath.trim());
	const envPath = process.env.OPENCLAW_TTS_PREFS?.trim();
	if (envPath) return resolveUserPath(envPath);
	const machinePath = machinePrefsPath()?.trim();
	if (machinePath) return resolveUserPath(machinePath);
	return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function readTtsPrefs(prefsPath) {
	try {
		return asNonArrayRecord(JSON.parse(readFileSync(prefsPath, "utf8")));
	} catch {
		return {};
	}
}
function resolveTtsAutoModeFromPrefs(prefs) {
	const auto = normalizeTtsAutoMode(prefs.tts?.auto);
	if (auto) return auto;
	if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
}
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
function shouldAttemptTtsPayload(params) {
	const sessionAuto = normalizeTtsAutoMode(params.ttsAuto);
	if (sessionAuto) return sessionAuto !== "off";
	const raw = resolveEffectiveTtsConfig(params.cfg, params);
	const scopedPrefsPath = raw.prefsPath;
	const prefsAuto = resolveTtsAutoModeFromPrefs(readTtsPrefs(resolveTtsPrefsPathValue(scopedPrefsPath, () => params.preparedTtsPreferences.machinePrefsPath)));
	if (prefsAuto) return prefsAuto !== "off";
	const configuredAuto = normalizeTtsAutoMode(raw?.auto);
	if (configuredAuto) return configuredAuto !== "off";
	return raw?.enabled === true;
}
/** Return whether TTS directive markup should be stripped from user-visible text. */
function shouldCleanTtsDirectiveText(params) {
	if (!shouldAttemptTtsPayload(params)) return false;
	return resolveEffectiveTtsConfig(params.cfg, params).modelOverrides?.enabled !== false;
}
//#endregion
export { resolveTtsPrefsPathValue as a, TTS_AUTO_MODES as c, resolveTtsAutoModeFromPrefs as i, normalizeTtsAutoMode as l, resolveConfiguredTtsMode as n, shouldAttemptTtsPayload as o, resolveEffectiveTtsConfig as r, shouldCleanTtsDirectiveText as s, readTtsPrefs as t };
