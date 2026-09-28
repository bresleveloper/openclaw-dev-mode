import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { t as mergeDeep } from "./deep-merge-CthyICF6.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { C as TtsAutoSchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { existsSync, readFileSync } from "node:fs";
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
function resolveAgentTtsOverride(cfg, agentId) {
	if (!agentId) return;
	return resolveAgentConfig(cfg, agentId)?.tts;
}
function resolveTtsConfigContext(contextOrAgentId) {
	return typeof contextOrAgentId === "string" ? { agentId: contextOrAgentId } : contextOrAgentId ?? {};
}
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
function resolveChannelTtsOverride(cfg, context) {
	return asTtsConfig(resolveChannelConfig(cfg, context.channelId)?.tts);
}
function resolveAccountTtsOverride(cfg, context) {
	const channelConfig = resolveChannelConfig(cfg, context.channelId);
	const accountConfig = resolveRecordEntry(isRecord(channelConfig?.accounts) ? channelConfig.accounts : void 0, context.accountId, normalizeAccountId);
	return asTtsConfig(asOptionalRecord(accountConfig)?.tts);
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
	const context = resolveTtsConfigContext(contextOrAgentId);
	const base = cfg.tts ?? {};
	const agentOverride = resolveAgentTtsOverride(cfg, context.agentId);
	const channelOverride = resolveChannelTtsOverride(cfg, context);
	const accountOverride = resolveAccountTtsOverride(cfg, context);
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
	if (machinePrefsPath?.trim()) return resolveUserPath(machinePrefsPath.trim());
	return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function readTtsPrefsAutoMode(prefsPath) {
	try {
		if (!existsSync(prefsPath)) return;
		const prefs = JSON.parse(readFileSync(prefsPath, "utf8"));
		const auto = normalizeTtsAutoMode(prefs.tts?.auto);
		if (auto) return auto;
		if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
	} catch {
		return;
	}
}
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
function shouldAttemptTtsPayload(params) {
	const sessionAuto = normalizeTtsAutoMode(params.ttsAuto);
	if (sessionAuto) return sessionAuto !== "off";
	const raw = resolveEffectiveTtsConfig(params.cfg, params);
	const scopedPrefsPath = raw.prefsPath;
	const prefsAuto = readTtsPrefsAutoMode(resolveTtsPrefsPathValue(scopedPrefsPath, readConfigMachineState("tts.prefsPath")));
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
export { TTS_AUTO_MODES as a, shouldCleanTtsDirectiveText as i, resolveEffectiveTtsConfig as n, normalizeTtsAutoMode as o, shouldAttemptTtsPayload as r, resolveConfiguredTtsMode as t };
