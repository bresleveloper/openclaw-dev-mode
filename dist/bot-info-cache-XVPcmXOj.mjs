import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as readJsonFileWithFallback } from "./json-store-EnZiK23B.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { t as normalizeTelegramBotInfo } from "./bot-info-BabEIyfI.mjs";
import { n as getTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.mjs";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-Ct5hUe3A.mjs";
import path from "node:path";
import os from "node:os";
//#region extensions/telegram/src/bot-info-cache.ts
const LEGACY_STORE_VERSION = 1;
const TELEGRAM_BOT_INFO_CACHE_NAMESPACE = "telegram.bot-info-cache";
const TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS = 864e5;
function fingerprintFromToken(botToken) {
	const trimmed = botToken?.trim();
	if (!trimmed) return null;
	return fingerprintTelegramBotToken(trimmed);
}
function resolveTelegramBotInfoCachePath(accountId, env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	return path.join(stateDir, "telegram", `bot-info-${normalizeTelegramStateAccountId(accountId)}.json`);
}
function openBotInfoCacheStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
		maxEntries: 128,
		defaultTtlMs: TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS
	});
}
function parseCachedTelegramBotInfo(value) {
	if (!value || typeof value !== "object") return null;
	const state = value;
	if (typeof state.tokenFingerprint !== "string" || typeof state.fetchedAt !== "string" || Number.isNaN(Date.parse(state.fetchedAt))) return null;
	const botInfo = normalizeTelegramBotInfo(state.botInfo);
	if (!botInfo) return null;
	return {
		tokenFingerprint: state.tokenFingerprint,
		fetchedAt: state.fetchedAt,
		botInfo
	};
}
function parseLegacyCachedTelegramBotInfo(value) {
	if (!value || typeof value !== "object") return null;
	if (value.version !== LEGACY_STORE_VERSION) return null;
	return parseCachedTelegramBotInfo(value);
}
async function readCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return null;
	const parsed = parseCachedTelegramBotInfo(await openBotInfoCacheStore().lookup(normalizeTelegramStateAccountId(params.accountId)));
	if (!parsed || parsed.tokenFingerprint !== tokenFingerprint) return null;
	const fetchedAtMs = Date.parse(parsed.fetchedAt);
	if ((params.now?.getTime() ?? Date.now()) - fetchedAtMs > TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS) return null;
	return {
		botInfo: parsed.botInfo,
		fetchedAt: parsed.fetchedAt
	};
}
async function writeCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return;
	const botInfo = normalizeTelegramBotInfo(params.botInfo);
	if (!botInfo) return;
	await openBotInfoCacheStore().register(normalizeTelegramStateAccountId(params.accountId), {
		tokenFingerprint,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		botInfo
	});
}
async function deleteCachedTelegramBotInfo(params) {
	await openBotInfoCacheStore().delete(normalizeTelegramStateAccountId(params.accountId));
}
async function listTelegramLegacyBotInfoCacheEntries(params) {
	const { value } = await readJsonFileWithFallback(params.persistedPath, null);
	const parsed = parseLegacyCachedTelegramBotInfo(value);
	if (!parsed) return [];
	return [{
		key: normalizeTelegramStateAccountId(params.accountId),
		value: parsed
	}];
}
//#endregion
export { resolveTelegramBotInfoCachePath as a, readCachedTelegramBotInfo as i, deleteCachedTelegramBotInfo as n, writeCachedTelegramBotInfo as o, listTelegramLegacyBotInfoCacheEntries as r, TELEGRAM_BOT_INFO_CACHE_NAMESPACE as t };
