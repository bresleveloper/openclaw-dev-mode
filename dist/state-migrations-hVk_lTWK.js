import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { s as statRegularFileSync } from "./regular-file-BD2zl6_l.js";
import { r as createPluginStateSyncKeyedStore } from "./plugin-state-store-D2450Zn3.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import "./security-runtime-ZGC3cmUc.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as resolveTelegramToken } from "./token-CoLDddcp.js";
import { u as resolveChannelAllowFromPath } from "./pairing-store-uQh6I0SL.js";
import { n as readJsonFileWithFallback } from "./json-store-CWaMsrLM.js";
import "./session-store-runtime-BlqMkGtn.js";
import "./runtime-doctor-BuW75S_W.js";
import "./channel-pairing-BhZI8NmU.js";
import { i as listPersistentDedupeLegacyJsonFileEntries, o as resolvePersistentDedupePluginStateNamespace, r as createPersistentDedupeImportEntry, s as shouldReplacePersistentDedupeEntry } from "./persistent-dedupe-Ck7XvmNX.js";
import "./state-paths-DshOQl4X.js";
import { n as resolveDefaultTelegramAccountId, t as listTelegramAccountIds } from "./account-selection-C9Q4IYkV.js";
import { f as listTelegramLegacyMessageCacheEntries, m as resolveTelegramMessageCachePersistentScopeKey, n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE, o as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES, p as resolveTelegramMessageCachePath, r as listTelegramLegacySentMessageCacheEntries, s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE, t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES } from "./sent-message-cache-lP89voPo.js";
import { t as normalizeTelegramBotInfo } from "./bot-info-Bv59m7ss.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import { a as normalizeTelegramUpdateOffsetAccountId, i as listTelegramLegacyUpdateOffsetEntries, l as normalizeTelegramStateAccountId, n as TELEGRAM_UPDATE_OFFSET_NAMESPACE, s as shouldReplaceTelegramUpdateOffsetEntry, t as TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES } from "./update-offset-store-DeeaDJaf.js";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-5R81vEJi.js";
import { a as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS, i as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID, n as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX, o as buildTelegramMessageDispatchAccountReplayKey, p as resolveTelegramMessageDispatchLegacyPath, r as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES, t as TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE } from "./message-dispatch-dedupe-C6uFvVMh.js";
import { n as TELEGRAM_STICKER_CACHE_NAMESPACE, s as listTelegramLegacyStickerCacheEntries, t as TELEGRAM_STICKER_CACHE_MAX_ENTRIES } from "./sticker-cache-store-DsngcT6t.js";
import { a as listTelegramLegacyThreadBindingEntries, l as testing, n as TELEGRAM_THREAD_BINDINGS_NAMESPACE, t as TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES } from "./thread-bindings-BMfvV1CV.js";
import { a as resolveTopicNameCachePath, i as resolveTopicNameCacheNamespace, o as resolveTopicNameCacheScope, r as listTelegramLegacyTopicNameCacheEntries, t as TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES } from "./topic-name-cache-C7HdiXmc.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region extensions/telegram/src/bot-info-cache.ts
const LEGACY_STORE_VERSION = 1;
const TELEGRAM_BOT_INFO_CACHE_NAMESPACE = "telegram.bot-info-cache";
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
		namespace: "telegram.bot-info-cache",
		maxEntries: 128,
		defaultTtlMs: 864e5
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
	if ((params.now?.getTime() ?? Date.now()) - fetchedAtMs > 864e5) return null;
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
//#region extensions/telegram/src/state-migrations.ts
const TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_MAX_ENTRIES = 4096;
function fileExists(pathValue) {
	try {
		return !statRegularFileSync(pathValue).missing;
	} catch {
		return false;
	}
}
function resolveLegacySessionStorePath(params) {
	return path.join(resolveMigrationStateDir(params), "sessions", "sessions.json");
}
function resolveMigrationStateDir(params) {
	return params.stateDir ?? path.dirname(path.dirname(path.dirname(path.dirname(resolveStorePath(void 0, { env: params.env })))));
}
function isObjectRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function readLegacyMessageDispatchDedupeRecord(value) {
	if (!isObjectRecord(value) || typeof value.namespace !== "string") return;
	if (!isObjectRecord(value.entries)) return;
	const entries = {};
	for (const [key, seenAt] of Object.entries(value.entries)) if (typeof seenAt === "number" && Number.isFinite(seenAt) && seenAt > 0) entries[key] = seenAt;
	return {
		namespace: value.namespace,
		entries
	};
}
function remainingMessageDispatchDedupeTtlMs(seenAt, now) {
	const ttlMs = TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS - Math.max(0, now - seenAt);
	return ttlMs > 0 ? ttlMs : void 0;
}
function openTelegramLegacyMessageDispatchBucketStore(env) {
	return createPluginStateSyncKeyedStore("telegram", {
		namespace: TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE,
		maxEntries: TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_MAX_ENTRIES,
		env
	});
}
function readTelegramLegacyMessageDispatchBuckets(params) {
	const store = openTelegramLegacyMessageDispatchBucketStore(params.env);
	const latestSeenAtByKey = /* @__PURE__ */ new Map();
	const recordKeys = [];
	for (const entry of store.entries()) {
		const record = readLegacyMessageDispatchDedupeRecord(entry.value);
		if (!record) continue;
		if (!(record.namespace === params.accountId || record.namespace.startsWith(`${params.accountId}:`))) continue;
		recordKeys.push(entry.key);
		if (record.namespace !== params.accountId) continue;
		for (const [key, seenAt] of Object.entries(record.entries)) latestSeenAtByKey.set(key, Math.max(latestSeenAtByKey.get(key) ?? 0, seenAt));
	}
	const now = params.now ?? Date.now();
	return {
		importEntries: [...latestSeenAtByKey.entries()].flatMap(([key, seenAt]) => {
			const ttlMs = remainingMessageDispatchDedupeTtlMs(seenAt, now);
			return ttlMs == null ? [] : [createPersistentDedupeImportEntry({
				key: buildTelegramMessageDispatchAccountReplayKey({
					accountId: params.accountId,
					key
				}),
				seenAt,
				ttlMs
			})];
		}),
		recordKeys
	};
}
function removeTelegramLegacyMessageDispatchBuckets(params) {
	const store = openTelegramLegacyMessageDispatchBucketStore(params.env);
	for (const key of readTelegramLegacyMessageDispatchBuckets(params).recordKeys) store.delete(key);
}
function mapTelegramMessageDispatchDedupeImportEntries(params) {
	return params.entries.map((entry) => createPersistentDedupeImportEntry({
		key: buildTelegramMessageDispatchAccountReplayKey({
			accountId: params.accountId,
			key: entry.value.key
		}),
		seenAt: entry.value.seenAt,
		...entry.ttlMs != null ? { ttlMs: entry.ttlMs } : {}
	}));
}
function listTelegramLegacySidecarAccountIds(params) {
	let persistedAccountIds;
	try {
		persistedAccountIds = fs.readdirSync(path.join(params.stateDir, "telegram"), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(params.prefix) && entry.name.endsWith(params.suffix)).map((entry) => entry.name.slice(params.prefix.length, -params.suffix.length)).filter(Boolean);
	} catch {
		persistedAccountIds = [];
	}
	return uniqueStrings([...listTelegramAccountIds(params.cfg), ...persistedAccountIds]);
}
function detectTelegramMessageCacheLegacyStateMigration(params) {
	const runtimePersistedPath = resolveTelegramMessageCachePath(resolveStorePath(params.cfg.session?.store, { env: params.env }));
	const legacyPersistedPath = resolveTelegramMessageCachePath(resolveLegacySessionStorePath(params));
	const scopeKey = resolveTelegramMessageCachePersistentScopeKey(runtimePersistedPath);
	return uniqueStrings([runtimePersistedPath, legacyPersistedPath]).flatMap((persistedPath) => {
		if (!fileExists(persistedPath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram prompt-context message cache",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
			maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
			scopeKey,
			cleanupSource: "rename",
			preview: `- Telegram prompt-context message cache: ${persistedPath} → plugin state (${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE})`,
			readEntries: () => {
				return listTelegramLegacyMessageCacheEntries({
					persistedPath,
					maxMessages: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES
				});
			}
		};
	});
}
function detectTelegramBotInfoCacheLegacyStateMigration(params) {
	return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
		const persistedPath = resolveTelegramBotInfoCachePath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram startup bot info cache",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_BOT_INFO_CACHE_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
			maxEntries: 128,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram startup bot info cache: ${persistedPath} → plugin state (${TELEGRAM_BOT_INFO_CACHE_NAMESPACE})`,
			readEntries: () => {
				return listTelegramLegacyBotInfoCacheEntries({
					accountId,
					persistedPath
				});
			}
		};
	});
}
function detectTelegramUpdateOffsetLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	return listTelegramLegacySidecarAccountIds({
		cfg: params.cfg,
		stateDir,
		prefix: "update-offset-",
		suffix: ".json"
	}).flatMap((accountId) => {
		const normalized = normalizeTelegramUpdateOffsetAccountId(accountId);
		const persistedPath = path.join(stateDir, "telegram", `update-offset-${normalized}.json`);
		if (!fileExists(persistedPath)) return [];
		let botToken;
		try {
			botToken = resolveTelegramToken(params.cfg, {
				accountId,
				envToken: params.env.TELEGRAM_BOT_TOKEN
			}).token || void 0;
		} catch {
			botToken = void 0;
		}
		return {
			kind: "plugin-state-import",
			label: "Telegram update offset",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_UPDATE_OFFSET_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_UPDATE_OFFSET_NAMESPACE,
			maxEntries: TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram update offset: ${persistedPath} → plugin state (${TELEGRAM_UPDATE_OFFSET_NAMESPACE})`,
			readEntries: () => listTelegramLegacyUpdateOffsetEntries({
				accountId,
				persistedPath
			}),
			shouldReplaceExistingEntry: ({ existingValue, incomingValue }) => shouldReplaceTelegramUpdateOffsetEntry({
				existingValue,
				incomingValue,
				botToken
			})
		};
	});
}
function detectTelegramStickerCacheLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	const persistedPath = path.join(stateDir, "telegram", "sticker-cache.json");
	if (!fileExists(persistedPath)) return [];
	return [{
		kind: "plugin-state-import",
		label: "Telegram sticker cache",
		sourcePath: persistedPath,
		targetPath: `plugin state:${TELEGRAM_STICKER_CACHE_NAMESPACE}`,
		pluginId: "telegram",
		namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES,
		scopeKey: "",
		cleanupSource: "rename",
		preview: `- Telegram sticker cache: ${persistedPath} → plugin state (${TELEGRAM_STICKER_CACHE_NAMESPACE})`,
		readEntries: () => listTelegramLegacyStickerCacheEntries({ persistedPath })
	}];
}
function detectTelegramSentMessageCacheLegacyStateMigration(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
	return uniqueStrings([storePath, resolveLegacySessionStorePath(params)]).map((sourceStorePath) => ({
		targetStorePath: storePath,
		sourcePath: `${sourceStorePath}.telegram-sent-messages.json`
	})).flatMap((source) => {
		if (!fileExists(source.sourcePath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram sent-message cache",
			sourcePath: source.sourcePath,
			targetPath: `plugin state:${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
			maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram sent-message cache: ${source.sourcePath} → plugin state (${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE})`,
			readEntries: () => listTelegramLegacySentMessageCacheEntries({
				cfg: { session: { store: source.targetStorePath } },
				persistedPath: source.sourcePath
			})
		};
	});
}
function detectTelegramThreadBindingLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	return listTelegramLegacySidecarAccountIds({
		cfg: params.cfg,
		stateDir,
		prefix: "thread-bindings-",
		suffix: ".json"
	}).flatMap((accountId) => {
		const persistedPath = testing.resolveBindingsPath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram thread bindings",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_THREAD_BINDINGS_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
			maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram thread bindings: ${persistedPath} → plugin state (${TELEGRAM_THREAD_BINDINGS_NAMESPACE})`,
			readEntries: () => listTelegramLegacyThreadBindingEntries({
				accountId,
				persistedPath
			})
		};
	});
}
function detectTelegramMessageDispatchLegacyStateMigration(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
	const legacyStorePath = resolveLegacySessionStorePath(params);
	const env = params.stateDir ? {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} : params.env;
	const namespace = resolvePersistentDedupePluginStateNamespace({
		namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
		namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX
	});
	return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
		const jsonPlans = uniqueStrings([storePath, legacyStorePath]).map((sourceStorePath) => ({ sourcePath: resolveTelegramMessageDispatchLegacyPath({
			storePath: sourceStorePath,
			namespace: accountId
		}) })).flatMap((source) => {
			const sourcePath = source.sourcePath;
			if (!fileExists(sourcePath)) return [];
			return {
				kind: "plugin-state-import",
				label: "Telegram message dispatch dedupe",
				sourcePath,
				targetPath: `plugin state:${namespace}`,
				pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
				namespace,
				maxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
				defaultTtlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
				scopeKey: "",
				cleanupSource: "rename",
				preview: `- Telegram message dispatch dedupe: ${sourcePath} → plugin state (${namespace})`,
				shouldReplaceExistingEntry: ({ existingValue, incomingValue }) => shouldReplacePersistentDedupeEntry({
					existingValue,
					incomingValue
				}),
				readEntries: async () => mapTelegramMessageDispatchDedupeImportEntries({
					accountId,
					entries: await listPersistentDedupeLegacyJsonFileEntries({
						filePath: source.sourcePath,
						ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS
					})
				})
			};
		});
		let legacyRecordKeys;
		try {
			legacyRecordKeys = readTelegramLegacyMessageDispatchBuckets({
				accountId,
				env
			}).recordKeys;
		} catch {
			legacyRecordKeys = [];
		}
		if (legacyRecordKeys.length === 0) return jsonPlans;
		const pluginStatePlan = {
			kind: "plugin-state-import",
			label: "Telegram message dispatch dedupe",
			sourcePath: `plugin state:${TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE}:${accountId}`,
			targetPath: `plugin state:${namespace}`,
			pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
			namespace,
			maxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
			defaultTtlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
			scopeKey: "",
			cleanupWhenEmpty: true,
			preview: `- Telegram message dispatch dedupe: plugin state (${TELEGRAM_MESSAGE_DISPATCH_LEGACY_BUCKET_NAMESPACE}) → plugin state (${namespace})`,
			shouldReplaceExistingEntry: ({ existingValue, incomingValue }) => shouldReplacePersistentDedupeEntry({
				existingValue,
				incomingValue
			}),
			readEntries: () => readTelegramLegacyMessageDispatchBuckets({
				accountId,
				env
			}).importEntries,
			removeSource: () => removeTelegramLegacyMessageDispatchBuckets({
				accountId,
				env
			})
		};
		return jsonPlans.concat(pluginStatePlan);
	});
}
function topicNameCacheImportSource(params) {
	const scope = resolveTopicNameCacheScope(params.targetStorePath ?? params.sourceStorePath);
	return {
		sourcePath: resolveTopicNameCachePath(params.sourceStorePath),
		namespace: resolveTopicNameCacheNamespace(scope)
	};
}
function detectTelegramTopicNameCacheLegacyStateMigration(params) {
	const accountSources = listTelegramAccountIds(params.cfg).map((accountId) => {
		return topicNameCacheImportSource({ sourceStorePath: resolveStorePath(params.cfg.session?.store, {
			env: params.env,
			agentId: accountId
		}) });
	});
	const defaultStorePath = resolveStorePath(params.cfg.session?.store, { env: params.env });
	const defaultAccountStorePath = resolveStorePath(params.cfg.session?.store, {
		env: params.env,
		agentId: resolveDefaultTelegramAccountId(params.cfg)
	});
	const legacyStorePath = resolveLegacySessionStorePath(params);
	return [...new Map([
		...accountSources,
		topicNameCacheImportSource({ sourceStorePath: defaultStorePath }),
		topicNameCacheImportSource({
			sourceStorePath: legacyStorePath,
			targetStorePath: defaultAccountStorePath
		})
	].map((source) => [`${source.sourcePath}\0${source.namespace}`, source])).values()].flatMap((source) => {
		if (!fileExists(source.sourcePath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram forum topic-name cache",
			sourcePath: source.sourcePath,
			targetPath: `plugin state:${source.namespace}`,
			pluginId: "telegram",
			namespace: source.namespace,
			maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram forum topic-name cache: ${source.sourcePath} → plugin state (${source.namespace})`,
			readEntries: () => {
				return listTelegramLegacyTopicNameCacheEntries({
					persistedPath: source.sourcePath,
					maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES
				});
			}
		};
	});
}
async function detectTelegramLegacyStateMigrations(params) {
	const plans = [];
	const legacyPath = resolveChannelAllowFromPath("telegram", params.env);
	if (fileExists(legacyPath)) {
		const accountId = resolveDefaultTelegramAccountId(params.cfg);
		const targetPath = resolveChannelAllowFromPath("telegram", params.env, accountId);
		if (!fileExists(targetPath)) plans.push({
			kind: "copy",
			label: "Telegram pairing allowFrom",
			sourcePath: legacyPath,
			targetPath
		});
	}
	plans.push(...detectTelegramUpdateOffsetLegacyStateMigration(params));
	plans.push(...detectTelegramBotInfoCacheLegacyStateMigration(params));
	plans.push(...detectTelegramStickerCacheLegacyStateMigration(params));
	plans.push(...detectTelegramMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramSentMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramTopicNameCacheLegacyStateMigration(params));
	plans.push(...detectTelegramThreadBindingLegacyStateMigration(params));
	plans.push(...detectTelegramMessageDispatchLegacyStateMigration(params));
	return plans;
}
//#endregion
export { writeCachedTelegramBotInfo as i, deleteCachedTelegramBotInfo as n, readCachedTelegramBotInfo as r, detectTelegramLegacyStateMigrations as t };
