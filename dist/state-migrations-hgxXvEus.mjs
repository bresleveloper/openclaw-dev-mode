import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { n as listTelegramAccountIds, r as resolveDefaultTelegramAccountId } from "./account-selection-DO7ZNLRi.mjs";
import "./session-store-paths-C0kAfy_y.mjs";
import { t as fileExists } from "./file-access-runtime-CWjkXCju.mjs";
import { n as parseTelegramMessageThreadId } from "./outbound-params-CEIp4vNq.mjs";
import { a as resolveTelegramBotInfoCachePath, r as listTelegramLegacyBotInfoCacheEntries, t as TELEGRAM_BOT_INFO_CACHE_NAMESPACE } from "./bot-info-cache-XVPcmXOj.mjs";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CELLJV4K.mjs";
import { a as resolveTelegramThreadBindingsPath, n as TELEGRAM_THREAD_BINDINGS_NAMESPACE, r as listTelegramLegacyThreadBindingEntries, t as TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES } from "./thread-bindings-store-CVXkXmPI.mjs";
import { n as TELEGRAM_STICKER_CACHE_NAMESPACE, r as listTelegramLegacyStickerCacheEntries, t as TELEGRAM_STICKER_CACHE_MAX_ENTRIES } from "./sticker-cache-store.legacy-state-DV-1hOQr.mjs";
import { a as normalizeTelegramUpdateOffsetAccountId, i as listTelegramLegacyUpdateOffsetEntries, n as TELEGRAM_UPDATE_OFFSET_NAMESPACE, s as shouldReplaceTelegramUpdateOffsetEntry, t as TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES } from "./update-offset-store-nORl6cFs.mjs";
import { c as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE, d as resolveTelegramMessageCachePath, f as resolveTelegramMessageCachePersistentScopeKey, i as listTelegramLegacySentMessageCacheEntries, l as isTelegramMessageCacheSourceMessage, n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE, s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES, t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES } from "./sent-message-cache.legacy-state-Ckozzcje.mjs";
import { a as resolveTopicNameCachePath, i as resolveTopicNameCacheNamespace, o as resolveTopicNameCacheScope, r as listTelegramLegacyTopicNameCacheEntries, t as TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES } from "./topic-name-cache-DVMmy0yC.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/telegram/src/state-migrations.ts
function resolveLegacySessionStorePath(params) {
	return path.join(resolveMigrationStateDir(params), "sessions", "sessions.json");
}
function resolveAgentSessionStorePath(params) {
	return resolveSessionStorePathCore(params.cfg.session?.store, {
		env: params.env,
		agentId: params.agentId
	});
}
function listLegacyAgentSessionStoreSources(params) {
	const asSource = (targetStorePath) => ({
		sourcePath: params.resolveSourcePath(targetStorePath),
		targetStorePath
	});
	const sources = uniqueStrings([...listAgentIds(params.cfg), "main"].map((agentId) => resolveAgentSessionStorePath({
		...params,
		agentId
	}))).map(asSource).filter(({ sourcePath }) => fileExists(sourcePath));
	const legacySourcePath = params.resolveSourcePath(resolveLegacySessionStorePath(params));
	if (!fileExists(legacySourcePath) || sources.some(({ sourcePath }) => sourcePath === legacySourcePath)) return sources;
	const targetAgentId = params.preserveLegacyAccountScope && params.cfg.agents?.entries === void 0 && params.cfg.agents?.list === void 0 ? resolveDefaultTelegramAccountId(params.cfg) : resolveTelegramLegacyStateOwnerAgentId(params.cfg);
	return [...sources, {
		sourcePath: legacySourcePath,
		targetStorePath: resolveAgentSessionStorePath({
			...params,
			agentId: targetAgentId
		})
	}];
}
function resolveTelegramLegacyStateOwnerAgentId(cfg) {
	const configuredAccountIds = listTelegramAccountIds(cfg);
	const accountIds = configuredAccountIds.length > 0 ? configuredAccountIds : [resolveDefaultTelegramAccountId(cfg)];
	const ownerAgentIds = uniqueStrings(accountIds.map((accountId) => resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId
	})));
	if (ownerAgentIds.length === 1) return ownerAgentIds[0];
	throw new Error(`Legacy Telegram state has multiple routed owners (${ownerAgentIds.join(", ")}); preserve it until one migration owner is configured.`);
}
function resolveMigrationStateDir(params) {
	return params.stateDir ?? path.dirname(path.dirname(path.dirname(path.dirname(resolveSessionStorePathCore(void 0, {
		env: params.env,
		agentId: "main"
	})))));
}
function telegramStateImport(params) {
	return {
		...params,
		kind: "plugin-state-import",
		targetPath: `plugin state:${params.namespace}`,
		pluginId: "telegram",
		scopeKey: params.scopeKey ?? "",
		cleanupSource: "rename",
		preview: `- ${params.label}: ${params.sourcePath} → plugin state (${params.namespace})`
	};
}
function parseLegacyMessageCacheJson(text) {
	try {
		const value = JSON.parse(text);
		return Array.isArray(value) ? value : [value];
	} catch {
		return;
	}
}
function readLegacyMessageCacheValues(raw) {
	const text = raw.trim();
	const whole = parseLegacyMessageCacheJson(text);
	if (whole) return whole;
	const values = [];
	let jsonl = text;
	if (text.startsWith("[")) for (const match of text.matchAll(/\](?=\s*\{\s*"key"\s*:)/g)) {
		const arrayEnd = (match.index ?? -1) + 1;
		const initial = parseLegacyMessageCacheJson(text.slice(0, arrayEnd));
		if (initial) {
			values.push(...initial);
			jsonl = text.slice(arrayEnd);
			break;
		}
	}
	for (const line of jsonl.split("\n")) values.push(...parseLegacyMessageCacheJson(line) ?? []);
	return values;
}
function listTelegramLegacyMessageCacheEntries(persistedPath) {
	let raw;
	try {
		raw = fs.readFileSync(persistedPath, "utf8");
	} catch {
		return [];
	}
	const entries = /* @__PURE__ */ new Map();
	for (const value of readLegacyMessageCacheValues(raw)) {
		if (!isRecord(value) || typeof value.key !== "string" || !value.key.trim() || !value.key.includes(":") || !isRecord(value.node)) continue;
		const sourceMessage = value.node.sourceMessage;
		if (!isTelegramMessageCacheSourceMessage(sourceMessage)) continue;
		const { openclaw_prompt_context_projection: _projection, ...canonicalSourceMessage } = sourceMessage;
		const parsedThreadId = parseTelegramMessageThreadId(value.node.threadId);
		const threadId = parsedThreadId === void 0 ? void 0 : String(parsedThreadId);
		const key = `${value.key.slice(0, value.key.lastIndexOf(":") + 1)}${sourceMessage.message_id}`;
		entries.delete(key);
		entries.set(key, {
			version: 1,
			sourceMessage: canonicalSourceMessage,
			...threadId ? { threadId } : {}
		});
		if (entries.size > 3e3) {
			const oldest = entries.keys().next().value;
			if (oldest !== void 0) entries.delete(oldest);
		}
	}
	return Array.from(entries, ([key, value]) => ({
		key,
		value
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
	return listLegacyAgentSessionStoreSources({
		...params,
		resolveSourcePath: resolveTelegramMessageCachePath
	}).map(({ sourcePath, targetStorePath }) => telegramStateImport({
		label: "Telegram prompt-context message cache",
		sourcePath,
		namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
		maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
		scopeKey: resolveTelegramMessageCachePersistentScopeKey(resolveTelegramMessageCachePath(targetStorePath)),
		readEntries: () => listTelegramLegacyMessageCacheEntries(sourcePath)
	}));
}
function detectTelegramBotInfoCacheLegacyStateMigration(params) {
	return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
		const persistedPath = resolveTelegramBotInfoCachePath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return telegramStateImport({
			label: "Telegram startup bot info cache",
			sourcePath: persistedPath,
			namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
			maxEntries: 128,
			readEntries: () => {
				return listTelegramLegacyBotInfoCacheEntries({
					accountId,
					persistedPath
				});
			}
		});
	});
}
async function detectTelegramUpdateOffsetLegacyStateMigration(params) {
	const { resolveTelegramToken } = await import("./telegram/token.js");
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
		return telegramStateImport({
			label: "Telegram update offset",
			sourcePath: persistedPath,
			namespace: TELEGRAM_UPDATE_OFFSET_NAMESPACE,
			maxEntries: TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
			readEntries: () => listTelegramLegacyUpdateOffsetEntries({
				accountId,
				persistedPath
			}),
			shouldReplaceExistingEntry: ({ existingValue, incomingValue }) => shouldReplaceTelegramUpdateOffsetEntry({
				existingValue,
				incomingValue,
				botToken
			})
		});
	});
}
function detectTelegramStickerCacheLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	const persistedPath = path.join(stateDir, "telegram", "sticker-cache.json");
	if (!fileExists(persistedPath)) return [];
	return [telegramStateImport({
		label: "Telegram sticker cache",
		sourcePath: persistedPath,
		namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES,
		readEntries: () => listTelegramLegacyStickerCacheEntries({ persistedPath })
	})];
}
function detectTelegramSentMessageCacheLegacyStateMigration(params) {
	return listLegacyAgentSessionStoreSources({
		...params,
		resolveSourcePath: (storePath) => `${storePath}.telegram-sent-messages.json`
	}).map(({ sourcePath, targetStorePath }) => telegramStateImport({
		label: "Telegram sent-message cache",
		sourcePath,
		namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES,
		cleanupWhenEmpty: true,
		readEntries: () => listTelegramLegacySentMessageCacheEntries({
			persistedPath: sourcePath,
			targetStorePath
		})
	}));
}
function detectTelegramThreadBindingLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	return listTelegramLegacySidecarAccountIds({
		cfg: params.cfg,
		stateDir,
		prefix: "thread-bindings-",
		suffix: ".json"
	}).flatMap((accountId) => {
		const persistedPath = resolveTelegramThreadBindingsPath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return telegramStateImport({
			label: "Telegram thread bindings",
			sourcePath: persistedPath,
			namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
			maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES,
			readEntries: () => listTelegramLegacyThreadBindingEntries({
				accountId,
				persistedPath
			})
		});
	});
}
function topicNameCacheImportSource(sourcePath, targetStorePath) {
	return {
		sourcePath,
		namespace: resolveTopicNameCacheNamespace(resolveTopicNameCacheScope(targetStorePath))
	};
}
function detectTelegramTopicNameCacheLegacyStateMigration(params) {
	const accountSources = listTelegramAccountIds(params.cfg).map((accountId) => {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, {
			env: params.env,
			agentId: accountId
		});
		return topicNameCacheImportSource(resolveTopicNameCachePath(storePath), storePath);
	});
	const sessionSources = listLegacyAgentSessionStoreSources({
		...params,
		resolveSourcePath: resolveTopicNameCachePath,
		preserveLegacyAccountScope: true
	}).map(({ sourcePath, targetStorePath }) => topicNameCacheImportSource(sourcePath, targetStorePath));
	return [...new Map([...accountSources.filter((source) => fileExists(source.sourcePath)), ...sessionSources].map((source) => [`${source.sourcePath}\0${source.namespace}`, source])).values()].map((source) => telegramStateImport({
		label: "Telegram forum topic-name cache",
		sourcePath: source.sourcePath,
		namespace: source.namespace,
		maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
		readEntries: () => {
			return listTelegramLegacyTopicNameCacheEntries({
				persistedPath: source.sourcePath,
				maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES
			});
		}
	}));
}
async function detectTelegramLegacyStateMigrations(params) {
	const plans = [];
	plans.push(...await detectTelegramUpdateOffsetLegacyStateMigration(params));
	plans.push(...detectTelegramBotInfoCacheLegacyStateMigration(params));
	plans.push(...detectTelegramStickerCacheLegacyStateMigration(params));
	plans.push(...detectTelegramMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramSentMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramTopicNameCacheLegacyStateMigration(params));
	plans.push(...detectTelegramThreadBindingLegacyStateMigration(params));
	return plans;
}
//#endregion
export { detectTelegramLegacyStateMigrations };
