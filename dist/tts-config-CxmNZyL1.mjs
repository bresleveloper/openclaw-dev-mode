import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as mergeDeep } from "./deep-merge-B-AVx-Uc.mjs";
import { _ as resolveConfigDir } from "./utils-DgZn2dLu.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { C as TtsAutoSchema } from "./zod-schema.core-MaNAY9dn.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
//#region src/tts/tts-auto-mode.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
const TTS_AUTO_MODES = new Set(TtsAutoSchema.options);
function isTtsAutoMode(value) {
	return TtsAutoSchema.safeParse(value).success;
}
/** Normalize an unknown value into a supported TTS auto mode. */
function normalizeTtsAutoMode(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized && isTtsAutoMode(normalized)) return normalized;
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
function resolveChannelConfig(cfg, channelId) {
	if (!isRecord(cfg.channels)) return;
	const normalizedChannelId = normalizeOptionalString(channelId);
	if (!normalizedChannelId) return;
	return asOptionalRecord(resolveRecordEntry(cfg.channels, normalizedChannelId, normalizeLowercaseStringOrEmpty));
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
	const context = typeof contextOrAgentId === "string" ? { agentId: contextOrAgentId } : contextOrAgentId ?? {};
	const base = cfg.tts ?? {};
	const agentOverride = context.agentId ? resolveAgentConfig(cfg, context.agentId)?.tts : void 0;
	const channelConfig = resolveChannelConfig(cfg, context.channelId);
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
	const machinePrefsPath = readConfigMachineState("tts.prefsPath");
	const prefsAuto = resolveTtsAutoModeFromPrefs(readTtsPrefs(resolveTtsPrefsPathValue(scopedPrefsPath, () => machinePrefsPath)));
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
