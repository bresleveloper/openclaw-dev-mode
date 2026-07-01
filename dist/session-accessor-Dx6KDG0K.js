import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { a as redactSensitiveFieldValue, c as redactSensitiveText, i as redactSecrets, n as getDefaultRedactPatterns, p as readLoggingConfig } from "./redact-CQ2tlRRk.js";
import { M as resolveTimestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { o as resolveRequiredHomeDir } from "./home-dir-BjcCg_IW.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { n as resolveAgentMainSessionKey } from "./main-session-DWI7gPJU.js";
import { D as normalizeSessionEntrySlotKey, W as parseSessionThreadInfo, _ as updateSessionStore, a as cleanupSessionLifecycleArtifacts$1, b as loadSessionStore, c as listSessionEntries$1, d as purgeDeletedAgentSessionEntries$1, et as resolveSessionStoreEntry, f as readSessionUpdatedAt$1, it as resolveSessionStoreKey, l as patchSessionEntry$1, m as resetSessionEntryLifecycle$1, n as applySessionEntryPatchProjection, o as deleteSessionEntryLifecycle$1, rt as resolveSessionStoreAgentId, s as getSessionEntry, t as applySessionEntryLifecycleMutation$1, u as patchSessionEntryWithKey$1, v as updateSessionStoreEntry } from "./store-DJ7wx5_V.js";
import { a as resolveSessionFilePath, c as resolveSessionTranscriptPathInDir, d as resolveStorePath, o as resolveSessionFilePathOptions, p as formatSessionArchiveTimestamp, s as resolveSessionTranscriptPath } from "./paths-CHZBIGhF.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.js";
import "./version-Bsehiavt.js";
import { r as resolveAllAgentSessionStoreTargetsSync } from "./targets-7kfDzi_O.js";
import { s as resolveSessionWriteLockOptions, t as acquireSessionWriteLock } from "./session-write-lock-B7bsl0mX.js";
import { i as sanitizeInlineImageDataUrlForStorage, n as sanitizeInlineImageBase64 } from "./inline-image-data-url-CwAAaSvc.js";
import { a as withOwnedSessionTranscriptWrites, c as appendSerializedJsonlEntry, d as serializeJsonlLine, i as resolveOwnedSessionTranscriptWriteLockRunner, m as writeJsonlLines, o as appendJsonlEntry, p as writeJsonlEntry, u as serializeJsonlEntry } from "./transcript-write-context-B0xLNm13.js";
import { l as selectSessionTranscriptTreePathNodes, s as scanSessionTranscriptTree, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-3cM1TqAJ.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
import readline from "node:readline";
//#region src/config/sessions/plugin-host-cleanup.ts
/** File-backed implementation for plugin host-owned session-state cleanup. */
function collectStoredSessionEntrySlotKeys(entry, pluginId) {
	const slotKeys = /* @__PURE__ */ new Set();
	const storedSlotKeys = entry.pluginExtensionSlotKeys;
	if (!storedSlotKeys) return slotKeys;
	const records = pluginId === void 0 ? Object.values(storedSlotKeys) : storedSlotKeys[pluginId] ? [storedSlotKeys[pluginId]] : [];
	for (const record of records) for (const slotKey of Object.values(record)) {
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	return slotKeys;
}
function collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectStoredSessionEntrySlotKeys(entry, pluginId);
	for (const slotKey of sessionEntrySlotKeys ?? []) slotKeys.add(slotKey);
	return slotKeys;
}
function clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys, options = {}) {
	const slotKeys = options.includeStoredSlotKeys === false && sessionEntrySlotKeys ? new Set(sessionEntrySlotKeys) : collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	const entryRecord = entry;
	for (const slotKey of slotKeys) delete entryRecord[slotKey];
	if (!options.pruneSlotOwnership || !entry.pluginExtensionSlotKeys) return;
	const pruneRecord = (record) => {
		for (const [namespace, slotKey] of Object.entries(record)) {
			const normalized = normalizeSessionEntrySlotKey(slotKey);
			if (normalized.ok && slotKeys.has(normalized.key)) delete record[namespace];
		}
	};
	if (pluginId) {
		const record = entry.pluginExtensionSlotKeys[pluginId];
		if (record) {
			pruneRecord(record);
			if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[pluginId];
		}
	} else {
		for (const record of Object.values(entry.pluginExtensionSlotKeys)) pruneRecord(record);
		for (const [ownerPluginId, record] of Object.entries(entry.pluginExtensionSlotKeys)) if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[ownerPluginId];
	}
	if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
}
/** Clears plugin-owned extension state from one session entry. */
function clearPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys);
	if (!pluginId) {
		delete entry.pluginExtensions;
		delete entry.pluginExtensionSlotKeys;
		delete entry.pluginNextTurnInjections;
		return;
	}
	if (entry.pluginExtensions) {
		delete entry.pluginExtensions[pluginId];
		if (Object.keys(entry.pluginExtensions).length === 0) delete entry.pluginExtensions;
	}
	if (entry.pluginExtensionSlotKeys) {
		delete entry.pluginExtensionSlotKeys[pluginId];
		if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
	}
	if (entry.pluginNextTurnInjections) {
		delete entry.pluginNextTurnInjections[pluginId];
		if (Object.keys(entry.pluginNextTurnInjections).length === 0) delete entry.pluginNextTurnInjections;
	}
}
function hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	if (slotKeys.size === 0) return false;
	const entryRecord = entry;
	for (const slotKey of slotKeys) if (Object.hasOwn(entryRecord, slotKey)) return true;
	return false;
}
function hasPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	if (hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys)) return true;
	if (!pluginId) return Boolean(entry.pluginExtensions || entry.pluginExtensionSlotKeys || entry.pluginNextTurnInjections);
	return Boolean(entry.pluginExtensions?.[pluginId] || entry.pluginExtensionSlotKeys?.[pluginId] || entry.pluginNextTurnInjections?.[pluginId]);
}
function matchesCleanupSession(entryKey, entry, sessionKey) {
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!normalizedSessionKey) return true;
	return normalizeLowercaseStringOrEmpty(entryKey) === normalizedSessionKey || normalizeLowercaseStringOrEmpty(entry.sessionId) === normalizedSessionKey;
}
function shouldSkipCleanupStore(params) {
	if (!params.pluginId && !params.sessionKey) return true;
	return params.mode === "promoted-slots" && (params.sessionEntrySlotKeys?.size ?? 0) === 0;
}
function hasCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") return hasPromotedSessionEntrySlot(entry, params.pluginId, params.sessionEntrySlotKeys);
	return hasPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
function clearCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") {
		clearPromotedSessionEntrySlots(entry, params.pluginId, params.sessionEntrySlotKeys, {
			includeStoredSlotKeys: false,
			pruneSlotOwnership: true
		});
		return;
	}
	clearPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
/** Clears plugin host-owned session state in one store transaction. */
async function cleanupPluginHostSessionStore$1(params) {
	if (shouldSkipCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	return await updateSessionStore(params.storePath, (store) => {
		if (params.shouldCleanup && !params.shouldCleanup()) return 0;
		let clearedInStore = 0;
		const now = Date.now();
		for (const [entryKey, entry] of Object.entries(store)) {
			if (!matchesCleanupSession(entryKey, entry, params.sessionKey) || !hasCleanupTarget(entry, params)) continue;
			clearCleanupTarget(entry, params);
			entry.updatedAt = now;
			clearedInStore += 1;
		}
		return clearedInStore;
	}, {
		skipSaveWhenResult: (clearedInStore) => clearedInStore === 0,
		takeCacheOwnership: true
	});
}
//#endregion
//#region src/config/sessions/session-file.ts
/** Resolves a transcript file path and persists it into the session store when needed. */
async function resolveAndPersistSessionFile(params) {
	const { sessionId, sessionKey, sessionStore, storePath } = params;
	const now = Date.now();
	const baseEntry = params.sessionEntry ?? sessionStore[sessionKey] ?? {
		sessionId,
		updatedAt: now,
		sessionStartedAt: now
	};
	const shouldReusePersistedSessionFile = baseEntry.sessionId === sessionId;
	const fallbackSessionFile = params.fallbackSessionFile?.trim();
	const sessionFile = resolveSessionFilePath(sessionId, !shouldReusePersistedSessionFile ? fallbackSessionFile ? {
		...baseEntry,
		sessionFile: fallbackSessionFile
	} : {
		...baseEntry,
		sessionFile: void 0
	} : !baseEntry.sessionFile && fallbackSessionFile ? {
		...baseEntry,
		sessionFile: fallbackSessionFile
	} : baseEntry, {
		agentId: params.agentId,
		sessionsDir: params.sessionsDir
	});
	const persistedEntry = {
		...baseEntry,
		sessionId,
		updatedAt: now,
		sessionStartedAt: baseEntry.sessionId === sessionId ? baseEntry.sessionStartedAt ?? now : now,
		sessionFile
	};
	if (baseEntry.sessionId !== sessionId || baseEntry.sessionFile !== sessionFile) {
		sessionStore[sessionKey] = persistedEntry;
		await updateSessionStore(storePath, (store) => {
			store[sessionKey] = {
				...store[sessionKey],
				...persistedEntry
			};
		}, params.activeSessionKey || params.maintenanceConfig ? {
			...params.activeSessionKey ? { activeSessionKey: params.activeSessionKey } : {},
			...params.maintenanceConfig ? { maintenanceConfig: params.maintenanceConfig } : {}
		} : void 0);
		return {
			sessionFile,
			sessionEntry: persistedEntry
		};
	}
	sessionStore[sessionKey] = persistedEntry;
	return {
		sessionFile,
		sessionEntry: persistedEntry
	};
}
//#endregion
//#region src/agents/transcript-redact.ts
/**
* Agent transcript redaction helpers.
*
* Applies logging redaction rules to persisted messages while preserving unchanged object identity.
*/
function resolveTranscriptRedactPatterns(patterns) {
	return patterns && patterns.length > 0 ? [...patterns, ...getDefaultRedactPatterns()] : void 0;
}
function redactTranscriptOptions(cfg) {
	const configuredLogging = readLoggingConfig();
	const mode = cfg?.logging?.redactSensitive ?? configuredLogging?.redactSensitive;
	const patterns = resolveTranscriptRedactPatterns(cfg?.logging?.redactPatterns ?? configuredLogging?.redactPatterns);
	if (mode === void 0 && patterns === void 0) return;
	return {
		...mode !== void 0 ? { mode } : {},
		...patterns !== void 0 ? { patterns } : {}
	};
}
function isTranscriptRedactionDisabled(cfg) {
	return (cfg?.logging?.redactSensitive ?? readLoggingConfig()?.redactSensitive) === "off";
}
function redactTranscriptText(value, cfg) {
	if (cfg?.logging?.redactSensitive === "off") return value;
	return redactSensitiveText(value, redactTranscriptOptions(cfg));
}
function redactTranscriptStructuredFieldValue(key, value, cfg) {
	if (cfg?.logging?.redactSensitive === "off") return value;
	return redactSensitiveFieldValue(key, value, redactTranscriptOptions(cfg));
}
function isPlainTranscriptObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function isImageMimeType(value) {
	return typeof value === "string" && /^image\//iu.test(value.trim());
}
function normalizeImageMimeType(value) {
	return isImageMimeType(value) ? value.trim().toLowerCase() : void 0;
}
function imageMimeTypeForRecord(value) {
	return normalizeImageMimeType(value.mimeType) ?? normalizeImageMimeType(value.mediaType) ?? normalizeImageMimeType(value.media_type);
}
function imageMimeTypeFieldsForRecord(value) {
	return [
		"mimeType",
		"mediaType",
		"media_type"
	].filter((key) => isImageMimeType(value[key]));
}
function sanitizeOpaqueImageBase64(base64, mimeType) {
	return mimeType ? sanitizeInlineImageBase64({
		mimeType,
		base64
	}) : void 0;
}
function isValidOpaqueImageBase64(base64, mimeType) {
	return sanitizeOpaqueImageBase64(base64, mimeType) !== void 0;
}
function isTranscriptImageContentBlock(value) {
	return value.type === "image" && typeof value.data === "string" && isValidOpaqueImageBase64(value.data, imageMimeTypeForRecord(value));
}
function isImageBase64SourceBlock(value) {
	return value.type === "base64" && typeof value.data === "string" && isValidOpaqueImageBase64(value.data, imageMimeTypeForRecord(value));
}
function sanitizeImageRecord(source) {
	const isImageBlock = source.type === "image";
	const isBase64SourceBlock = source.type === "base64";
	if (!isImageBlock && !isBase64SourceBlock || typeof source.data !== "string") return;
	const mimeTypeFields = imageMimeTypeFieldsForRecord(source);
	if (mimeTypeFields.length === 0) return;
	const sanitized = sanitizeOpaqueImageBase64(source.data, imageMimeTypeForRecord(source));
	if (!sanitized) return;
	const hasCanonicalMimeTypes = mimeTypeFields.every((key) => source[key] === sanitized.mimeType);
	if (source.data === sanitized.base64 && hasCanonicalMimeTypes) return source;
	const next = {
		...source,
		data: sanitized.base64
	};
	for (const field of mimeTypeFields) next[field] = sanitized.mimeType;
	return next;
}
function startsWithDataUrl(value) {
	return value.slice(0, 5).toLowerCase() === "data:";
}
function sanitizeImageDataUrlField(source, key, value) {
	if (!startsWithDataUrl(value)) return;
	return source.type === "input_image" && key === "image_url" || (source.type === "image" || source.type === "image_url") && key === "url" || source.type === "image" && (key === "source" || key === "data") ? sanitizeInlineImageDataUrlForStorage(value) : void 0;
}
function shouldPreserveOpaqueImagePayload(source, key, item, preserveImageDataUrlFields) {
	if (typeof item !== "string") return false;
	if (key === "data" && (isTranscriptImageContentBlock(source) || isImageBase64SourceBlock(source))) return true;
	if (preserveImageDataUrlFields && key === "url") return startsWithDataUrl(item) && sanitizeInlineImageDataUrlForStorage(item) !== void 0;
	return sanitizeImageDataUrlField(source, key, item) !== void 0;
}
function shouldPreserveNestedImageDataUrlFields(source, key) {
	return key === "image_url" && (source.type === "image_url" || source.type === "input_image" || source.type === "image");
}
const OPENAI_RESPONSES_APIS = new Set([
	"openai-responses",
	"azure-openai-responses",
	"openai-chatgpt-responses",
	"openclaw-openai-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
const GOOGLE_REASONING_APIS = new Set([
	"google-generative-ai",
	"google-vertex",
	"google-gemini-cli",
	"openclaw-google-generative-ai-transport"
]);
const ANTHROPIC_REASONING_APIS = new Set([
	"anthropic-messages",
	"bedrock-converse-stream",
	"openclaw-anthropic-messages-transport"
]);
const OPENAI_COMPLETIONS_APIS = new Set(["openai-completions", "openclaw-openai-completions-transport"]);
const OPAQUE_REPLAY_TOKEN_RE = /^[A-Za-z0-9+/_-]+={0,2}$/;
const OPENAI_REPLAY_CONTEXT_HASH_RE = /^[a-f0-9]{16}$/;
function isOpenAIResponsesRoute(route) {
	return typeof route?.api === "string" && OPENAI_RESPONSES_APIS.has(route.api);
}
function isGoogleReasoningRoute(route) {
	return typeof route?.api === "string" && GOOGLE_REASONING_APIS.has(route.api);
}
function isAnthropicReasoningRoute(route) {
	return typeof route?.api === "string" && ANTHROPIC_REASONING_APIS.has(route.api);
}
function isOpenAICompletionsRoute(route) {
	return typeof route?.api === "string" && OPENAI_COMPLETIONS_APIS.has(route.api);
}
function isCustomProviderRoute(route) {
	return Boolean(route?.api && route.model && route.provider) && route?.api !== "mistral-conversations" && !isOpenAIResponsesRoute(route) && !isGoogleReasoningRoute(route) && !isAnthropicReasoningRoute(route) && !isOpenAICompletionsRoute(route);
}
function isGitHubCopilotResponsesRoute(route) {
	return (route?.api === "openai-responses" || route?.api === "openclaw-openai-responses-transport") && route.provider === "github-copilot";
}
function isOpaqueReplayToken(value) {
	if (value.length === 0 || value !== value.trim() || !OPAQUE_REPLAY_TOKEN_RE.test(value) || value.includes("…")) return false;
	return value.startsWith("gAAAA") || redactSensitiveText(value, { mode: "tools" }) === value;
}
function isSafeReplayIdentifier(value, maxLength = 512) {
	return value.length > 0 && value.length <= maxLength && value === value.trim() && /^[A-Za-z0-9+/_:.=-]+$/.test(value) && redactSensitiveText(value, { mode: "tools" }) === value;
}
function isOpenAIResponseItemId(value, route) {
	return isSafeReplayIdentifier(value, isGitHubCopilotResponsesRoute(route) ? 64 : 512);
}
function isOpenAITextSignature(value, route) {
	if (value.startsWith("{")) try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed)) return false;
		if (!Object.keys(parsed).every((key) => key === "v" || key === "id" || key === "phase")) return false;
		const id = typeof parsed.id === "string" && isOpenAIResponseItemId(parsed.id, route) ? parsed.id : void 0;
		const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
		if (parsed.id !== void 0 && id === void 0) return false;
		return parsed.v === 1 && (id !== void 0 || phase !== void 0);
	} catch {
		return false;
	}
	return isOpenAIResponseItemId(value, route);
}
const OPENAI_REASONING_REPLAY_METADATA_KEYS = new Set([
	"v",
	"source",
	"provider",
	"api",
	"model",
	"baseUrlHash",
	"sessionHash",
	"authProfileHash"
]);
const OPENAI_REASONING_REPLAY_METADATA_KEY = "__openclaw_replay";
function sanitizeOpenAIReasoningReplayMetadata(value, route) {
	if (!value || typeof value !== "object" || !isPlainTranscriptObject(value) || !route?.api || !route.model || !route.provider) return;
	if (value.v !== 1 || value.source !== "openai-responses" || value.provider !== route?.provider || value.api !== route.api || value.model !== route.model || value.baseUrlHash !== void 0 && (typeof value.baseUrlHash !== "string" || !OPENAI_REPLAY_CONTEXT_HASH_RE.test(value.baseUrlHash)) || value.sessionHash !== void 0 && (typeof value.sessionHash !== "string" || !OPENAI_REPLAY_CONTEXT_HASH_RE.test(value.sessionHash)) || value.authProfileHash !== void 0 && (typeof value.authProfileHash !== "string" || !OPENAI_REPLAY_CONTEXT_HASH_RE.test(value.authProfileHash))) return;
	if (Object.keys(value).every((key) => OPENAI_REASONING_REPLAY_METADATA_KEYS.has(key))) return value;
	return {
		v: 1,
		source: "openai-responses",
		provider: value.provider,
		api: value.api,
		model: value.model,
		...value.baseUrlHash !== void 0 ? { baseUrlHash: value.baseUrlHash } : {},
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {}
	};
}
function shouldPreserveOpaqueProviderPayload(source, key, item, location, route) {
	if (location !== "assistant-content-block" || typeof item !== "string" || !isOpaqueReplayToken(item)) return false;
	const type = source.type;
	const customRoute = isCustomProviderRoute(route);
	return type === "text" && key === "textSignature" && (isGoogleReasoningRoute(route) || customRoute) || type === "thinking" && (key === "thinkingSignature" && (isAnthropicReasoningRoute(route) || isGoogleReasoningRoute(route) || customRoute) || key === "signature" && (isAnthropicReasoningRoute(route) || customRoute) || key === "thought_signature" && (isGoogleReasoningRoute(route) || customRoute)) || type === "redacted_thinking" && (isAnthropicReasoningRoute(route) || customRoute) && (key === "data" || key === "signature" || key === "thinkingSignature") || type === "toolCall" && key === "thoughtSignature" && (isGoogleReasoningRoute(route) || isOpenAICompletionsRoute(route) || customRoute);
}
function sanitizeOpenAIReasoningSignature(value, route) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning" || parsed.summary !== void 0 && !Array.isArray(parsed.summary)) return;
	const encryptedContent = parsed.encrypted_content;
	const hasEncryptedContent = Object.hasOwn(parsed, "encrypted_content");
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !isOpaqueReplayToken(encryptedContent))) return;
	if (parsed.id !== void 0 && (typeof parsed.id !== "string" || !isOpenAIResponseItemId(parsed.id, route))) return;
	if (parsed.status !== void 0 && parsed.status !== "in_progress" && parsed.status !== "completed" && parsed.status !== "incomplete") return;
	if (!hasEncryptedContent && typeof parsed.id !== "string") return;
	const replayMetadata = sanitizeOpenAIReasoningReplayMetadata(parsed[OPENAI_REASONING_REPLAY_METADATA_KEY], route);
	return JSON.stringify({
		...typeof parsed.id === "string" ? { id: parsed.id } : {},
		type: "reasoning",
		summary: [],
		...parsed.status !== void 0 ? { status: parsed.status } : {},
		...hasEncryptedContent ? { encrypted_content: encryptedContent } : {},
		...replayMetadata ? { [OPENAI_REASONING_REPLAY_METADATA_KEY]: replayMetadata } : {}
	});
}
function sanitizeOpenAICompletionsToolSignature(value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning.encrypted" || typeof parsed.data !== "string" || !isOpaqueReplayToken(parsed.data) || parsed.id !== void 0 && parsed.id !== null && (typeof parsed.id !== "string" || !isSafeReplayIdentifier(parsed.id)) || parsed.format !== void 0 && parsed.format !== null && (typeof parsed.format !== "string" || parsed.format.length > 64 || !/^[a-z0-9.-]+$/.test(parsed.format)) || parsed.index !== void 0 && (!Number.isSafeInteger(parsed.index) || parsed.index < 0)) return;
	return JSON.stringify({
		type: "reasoning.encrypted",
		data: parsed.data,
		...parsed.id !== void 0 ? { id: parsed.id } : {},
		...parsed.format !== void 0 ? { format: parsed.format } : {},
		...parsed.index !== void 0 ? { index: parsed.index } : {}
	});
}
function redactTranscriptStructuredValue(value, cfg, fieldKey, seen = /* @__PURE__ */ new WeakSet(), preserveImageDataUrlFields = false, location = "nested", assistantRoute) {
	if (typeof value === "string") {
		if (fieldKey) return redactTranscriptStructuredFieldValue(fieldKey, value, cfg);
		return redactTranscriptText(value, cfg);
	}
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		let changed = false;
		const redacted = value.map((item) => {
			const next = redactTranscriptStructuredValue(item, cfg, fieldKey, seen, preserveImageDataUrlFields, location === "assistant-content-array" ? "assistant-content-block" : "nested", assistantRoute);
			changed ||= next !== item;
			return next;
		});
		seen.delete(value);
		return changed ? redacted : value;
	}
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	if (!isPlainTranscriptObject(value)) return value;
	seen.add(value);
	const source = sanitizeImageRecord(value) ?? value;
	const currentAssistantRoute = location === "root" && source.role === "assistant" ? {
		...typeof source.api === "string" ? { api: source.api } : {},
		...typeof source.model === "string" ? { model: source.model } : {},
		...typeof source.provider === "string" ? { provider: source.provider } : {}
	} : assistantRoute;
	let next = null;
	if (source !== value) next = { ...source };
	for (const [key, item] of Object.entries(source)) {
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "openclawReasoningReplay") {
			const sanitizedMetadata = sanitizeOpenAIReasoningReplayMetadata(item, currentAssistantRoute);
			if (sanitizedMetadata !== void 0) {
				if (sanitizedMetadata !== item) {
					next ??= { ...source };
					next[key] = sanitizedMetadata;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "thinkingSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAIReasoningSignature(item, currentAssistantRoute);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "text" && key === "textSignature" && typeof item === "string" && isOpenAITextSignature(item, currentAssistantRoute)) continue;
		if (location === "assistant-content-block" && (isOpenAICompletionsRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "toolCall" && key === "thoughtSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAICompletionsToolSignature(item);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (shouldPreserveOpaqueProviderPayload(source, key, item, location, currentAssistantRoute)) continue;
		if (typeof item === "string") {
			const sanitizedDataUrl = preserveImageDataUrlFields && key === "url" ? startsWithDataUrl(item) ? sanitizeInlineImageDataUrlForStorage(item) : void 0 : sanitizeImageDataUrlField(source, key, item);
			if (sanitizedDataUrl !== void 0) {
				if (sanitizedDataUrl !== item) {
					next ??= { ...source };
					next[key] = sanitizedDataUrl;
				}
				continue;
			}
		}
		if (shouldPreserveOpaqueImagePayload(source, key, item, preserveImageDataUrlFields)) continue;
		const redacted = redactTranscriptStructuredValue(item, cfg, key, seen, preserveImageDataUrlFields || shouldPreserveNestedImageDataUrlFields(source, key), location === "root" && source.role === "assistant" && key === "content" && Array.isArray(item) ? "assistant-content-array" : "nested", currentAssistantRoute);
		if (redacted === item) continue;
		next ??= { ...source };
		next[key] = redacted;
	}
	seen.delete(value);
	return next ?? value;
}
/** Return a redacted transcript message according to logging config. */
function redactTranscriptMessage(message, cfg) {
	if (isTranscriptRedactionDisabled(cfg)) return message;
	return redactTranscriptStructuredValue(message, cfg, void 0, /* @__PURE__ */ new WeakSet(), false, "root");
}
//#endregion
//#region src/shared/transcript-only-openclaw-assistant.ts
const TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS = new Set(["delivery-mirror", "gateway-injected"]);
function isTranscriptOnlyOpenClawAssistantModel(provider, model) {
	return provider === "openclaw" && typeof model === "string" && TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS.has(model);
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	const entry = message;
	return entry.role === "assistant" && isTranscriptOnlyOpenClawAssistantModel(entry.provider, entry.model);
}
function isOpenClawDeliveryMirrorAssistantMessage(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return false;
	const entry = message;
	return entry.role === "assistant" && entry.provider === "openclaw" && entry.model === "delivery-mirror";
}
//#endregion
//#region src/config/sessions/transcript-header.ts
/** Creates a session transcript header entry with current version metadata. */
function createSessionTranscriptHeader(params = {}) {
	return {
		type: "session",
		version: 3,
		id: params.sessionId ?? randomUUID(),
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		cwd: params.cwd ?? process.cwd()
	};
}
//#endregion
//#region src/config/sessions/file-range.ts
async function readFileRangeAsync(fileHandle, position, length) {
	const buffer = Buffer.alloc(length);
	let offset = 0;
	while (offset < length) {
		const { bytesRead } = await fileHandle.read(buffer, offset, length - offset, position + offset);
		if (bytesRead <= 0) break;
		offset += bytesRead;
	}
	return offset === length ? buffer : buffer.subarray(0, offset);
}
//#endregion
//#region src/config/sessions/transcript-stream.ts
const DEFAULT_REVERSE_CHUNK_BYTES = 64 * 1024;
const MAX_REVERSE_CHUNK_BYTES = 1024 * 1024;
const MIN_REVERSE_CHUNK_BYTES = 1024;
/**
* Stream the non-empty, trimmed JSONL lines of a transcript file in order.
*
* Returns an empty async iterator if the file does not exist, is empty, or is
* not a regular file. Honours `options.signal` between lines so long scans can
* cooperate with abort signals.
*/
async function* streamSessionTranscriptLines(filePath, options = {}) {
	let stat;
	try {
		stat = await fs.promises.stat(filePath);
	} catch {
		return;
	}
	if (!stat.isFile() || stat.size <= 0) return;
	if (options.signal?.aborted) return;
	const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	try {
		for await (const line of rl) {
			if (options.signal?.aborted) return;
			const trimmed = line.trim();
			if (!trimmed) continue;
			yield trimmed;
		}
	} finally {
		rl.close();
		stream.destroy();
	}
}
/**
* Stream the non-empty, trimmed JSONL lines of a transcript file in reverse
* (newest-first) order.
*
* Returns an empty async iterator if the file cannot be opened, is empty, or is
* not a regular file. The implementation splits on newline bytes before UTF-8
* decoding so multibyte characters survive arbitrary chunk boundaries.
*/
async function* streamSessionTranscriptLinesReverse(filePath, options = {}) {
	const requestedChunkBytes = Number.isFinite(options.chunkBytes) ? Math.max(MIN_REVERSE_CHUNK_BYTES, Math.floor(options.chunkBytes)) : DEFAULT_REVERSE_CHUNK_BYTES;
	const chunkBytes = Math.min(requestedChunkBytes, MAX_REVERSE_CHUNK_BYTES);
	let fileHandle;
	try {
		fileHandle = await fs.promises.open(filePath, "r");
	} catch {
		return;
	}
	try {
		const stat = await fileHandle.stat();
		if (!stat.isFile() || stat.size <= 0 || options.signal?.aborted) return;
		let position = stat.size;
		let carry = Buffer.alloc(0);
		while (position > 0) {
			if (options.signal?.aborted) return;
			const readLength = Math.min(position, chunkBytes);
			position -= readLength;
			const chunk = await readFileRangeAsync(fileHandle, position, readLength);
			const combined = carry.length > 0 ? Buffer.concat([chunk, carry]) : chunk;
			let lineEnd = combined.length;
			for (let index = combined.length - 1; index >= 0; index -= 1) {
				if (combined[index] !== 10) continue;
				const line = decodeTrimmedLine(combined.subarray(index + 1, lineEnd));
				if (line) {
					yield line;
					if (options.signal?.aborted) return;
				}
				lineEnd = index;
			}
			carry = combined.subarray(0, lineEnd);
		}
		const firstLine = decodeTrimmedLine(carry);
		if (firstLine && !options.signal?.aborted) yield firstLine;
	} finally {
		await fileHandle.close().catch(() => void 0);
	}
}
function decodeTrimmedLine(line) {
	return line.toString("utf-8").trim();
}
//#endregion
//#region src/config/sessions/transcript-append.ts
const SESSION_MANAGER_APPEND_MAX_BYTES = 8 * 1024 * 1024;
const transcriptAppendQueues = /* @__PURE__ */ new Map();
function readTranscriptLineInfo(line) {
	if (!line.trim()) return {
		isNonSessionEntry: false,
		hasParentLinkedEntry: false
	};
	try {
		const parsed = JSON.parse(line);
		if (parsed.type === "session") return {
			isNonSessionEntry: false,
			hasParentLinkedEntry: false
		};
		const entryId = normalizeEntryId(parsed.id);
		if (!entryId) return {
			isNonSessionEntry: true,
			hasParentLinkedEntry: false
		};
		if (!("parentId" in parsed)) {
			const isCanonicalEntry = isCanonicalSessionTranscriptEntry(parsed);
			return {
				isNonSessionEntry: true,
				hasParentLinkedEntry: false,
				...isCanonicalEntry ? {
					entryId,
					isCanonicalEntry: true
				} : {},
				...isCanonicalEntry && parsed.appendMode === "side" ? { appendMode: parsed.appendMode } : {}
			};
		}
		if (parsed.type === "leaf") {
			const targetId = parsed.targetId === null ? null : normalizeEntryId(parsed.targetId);
			const appendParentId = parsed.appendParentId === void 0 ? void 0 : parsed.appendParentId === null ? null : normalizeEntryId(parsed.appendParentId);
			if (parsed.targetId !== null && targetId === void 0 || parsed.appendParentId !== void 0 && appendParentId === void 0 || parsed.appendMode !== void 0 && parsed.appendMode !== "side") return {
				isNonSessionEntry: true,
				hasParentLinkedEntry: true,
				entryId,
				invalidLeafControl: true
			};
			return {
				isNonSessionEntry: true,
				hasParentLinkedEntry: true,
				entryId,
				leafControl: {
					targetId: targetId ?? null,
					...appendParentId !== void 0 ? { appendParentId } : {},
					...parsed.appendMode === "side" ? { appendMode: parsed.appendMode } : {}
				}
			};
		}
		const isCanonicalEntry = isCanonicalSessionTranscriptEntry(parsed);
		return {
			isNonSessionEntry: true,
			hasParentLinkedEntry: true,
			entryId,
			...isCanonicalEntry ? { isCanonicalEntry: true } : {},
			...isCanonicalEntry && parsed.appendMode === "side" ? { appendMode: parsed.appendMode } : {}
		};
	} catch {
		return {
			isNonSessionEntry: false,
			hasParentLinkedEntry: false
		};
	}
}
function normalizeEntryId(value) {
	return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
async function validateTranscriptLeafControlReferences(params) {
	const referenceIds = new Set([params.leafControl.targetId, params.leafControl.appendParentId].filter((id) => typeof id === "string"));
	if (referenceIds.size === 0) return true;
	for await (const line of streamSessionTranscriptLines(params.transcriptPath)) {
		const lineInfo = readTranscriptLineInfo(line);
		if (lineInfo.entryId === params.leafControlId) break;
		if (!lineInfo.entryId || !referenceIds.has(lineInfo.entryId)) continue;
		if (lineInfo.invalidLeafControl || lineInfo.leafControl && !await validateTranscriptLeafControlReferences({
			transcriptPath: params.transcriptPath,
			leafControlId: lineInfo.entryId,
			leafControl: lineInfo.leafControl
		})) return false;
		referenceIds.delete(lineInfo.entryId);
		if (referenceIds.size === 0) return true;
	}
	return false;
}
async function resolveTranscriptLeafIdFromTrailingControls(transcriptPath) {
	for await (const line of streamSessionTranscriptLinesReverse(transcriptPath)) {
		const lineInfo = readTranscriptLineInfo(line);
		if (!lineInfo.entryId || lineInfo.invalidLeafControl) continue;
		if (!lineInfo.leafControl) return {
			leafId: lineInfo.entryId,
			appendMode: lineInfo.appendMode === "side" ? "side" : "active"
		};
		if (await validateTranscriptLeafControlReferences({
			transcriptPath,
			leafControlId: lineInfo.entryId,
			leafControl: lineInfo.leafControl
		})) {
			const { targetId, appendParentId, appendMode } = lineInfo.leafControl;
			const leafId = (appendParentId === void 0 ? targetId : appendParentId) ?? void 0;
			return {
				...leafId ? { leafId } : {},
				appendMode: appendMode === "side" ? "side" : "active"
			};
		}
	}
	return { appendMode: "active" };
}
async function readTranscriptLeafInfoForward(transcriptPath) {
	let leafId;
	let hasParentLinkedEntries = false;
	let nonSessionEntryCount = 0;
	let hasTrailingLeafControl = false;
	let appendMode = "active";
	for await (const line of streamSessionTranscriptLines(transcriptPath)) {
		const lineInfo = readTranscriptLineInfo(line);
		if (lineInfo.isNonSessionEntry) nonSessionEntryCount += 1;
		if (lineInfo.hasParentLinkedEntry) hasParentLinkedEntries = true;
		if (!lineInfo.entryId) continue;
		if (lineInfo.invalidLeafControl || lineInfo.leafControl) {
			if (lineInfo.leafControl) appendMode = lineInfo.leafControl.appendMode === "side" ? "side" : "active";
			hasTrailingLeafControl = true;
			continue;
		}
		leafId = lineInfo.entryId;
		if (lineInfo.isCanonicalEntry) appendMode = lineInfo.appendMode === "side" ? "side" : "active";
		hasTrailingLeafControl = false;
	}
	if (hasTrailingLeafControl) {
		const resolvedLeaf = await resolveTranscriptLeafIdFromTrailingControls(transcriptPath);
		leafId = resolvedLeaf.leafId;
		appendMode = resolvedLeaf.appendMode;
	}
	return {
		...leafId ? { leafId } : {},
		appendMode,
		hasParentLinkedEntries,
		nonSessionEntryCount
	};
}
async function readTranscriptLeafInfo(transcriptPath) {
	let latestEntryId;
	for await (const line of streamSessionTranscriptLinesReverse(transcriptPath)) {
		const lineInfo = readTranscriptLineInfo(line);
		if (!lineInfo.entryId) continue;
		if (lineInfo.invalidLeafControl) break;
		if (lineInfo.leafControl) {
			if (latestEntryId) {
				if (!await validateTranscriptLeafControlReferences({
					transcriptPath,
					leafControlId: lineInfo.entryId,
					leafControl: lineInfo.leafControl
				})) break;
				return {
					leafId: latestEntryId,
					appendMode: lineInfo.leafControl.appendMode === "side" ? "side" : "active",
					hasParentLinkedEntries: true,
					nonSessionEntryCount: 0
				};
			}
			const resolvedLeaf = await resolveTranscriptLeafIdFromTrailingControls(transcriptPath);
			return {
				...resolvedLeaf.leafId ? { leafId: resolvedLeaf.leafId } : {},
				appendMode: resolvedLeaf.appendMode,
				hasParentLinkedEntries: true,
				nonSessionEntryCount: 0
			};
		}
		latestEntryId ??= lineInfo.entryId;
		if (lineInfo.isCanonicalEntry && lineInfo.hasParentLinkedEntry) return {
			leafId: latestEntryId,
			appendMode: lineInfo.appendMode === "side" ? "side" : "active",
			hasParentLinkedEntries: true,
			nonSessionEntryCount: 0
		};
		break;
	}
	return await readTranscriptLeafInfoForward(transcriptPath);
}
async function migrateLinearTranscriptToParentLinked(transcriptPath) {
	const raw = await fs$1.readFile(transcriptPath, "utf-8");
	const existingIds = /* @__PURE__ */ new Set();
	const output = [];
	let previousId = null;
	let leafId;
	for (const line of raw.split(/\r?\n/)) {
		if (!line.trim()) continue;
		let parsed;
		try {
			parsed = JSON.parse(line);
		} catch {
			output.push(line);
			continue;
		}
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			output.push(line);
			continue;
		}
		const record = parsed;
		if (record.type === "session") {
			output.push(serializeJsonlLine({
				...record,
				version: 3
			}));
			continue;
		}
		const id = normalizeEntryId(record.id) ?? generateEntryId(existingIds);
		existingIds.add(id);
		record.id = id;
		if (!Object.hasOwn(record, "parentId")) record.parentId = previousId;
		previousId = id;
		leafId = id;
		output.push(serializeJsonlLine(record));
	}
	await writeJsonlLines(transcriptPath, output, { mode: 384 });
	const result = {};
	if (leafId) result.leafId = leafId;
	return result;
}
async function ensureTranscriptHeader(transcriptPath, params = {}) {
	const stat = await fs$1.stat(transcriptPath).catch(() => null);
	if (stat?.isFile() && stat.size > 0) return;
	await fs$1.mkdir(path.dirname(transcriptPath), { recursive: true });
	const header = createSessionTranscriptHeader(params);
	await writeJsonlEntry(transcriptPath, header, {
		mode: 384,
		flag: stat?.isFile() ? "w" : "wx"
	});
	return serializeJsonlLine(header);
}
async function resolveTranscriptAppendQueueKey(transcriptPath) {
	const resolvedTranscriptPath = path.resolve(transcriptPath);
	const transcriptDir = path.dirname(resolvedTranscriptPath);
	await fs$1.mkdir(transcriptDir, { recursive: true });
	try {
		return path.join(await fs$1.realpath(transcriptDir), path.basename(resolvedTranscriptPath));
	} catch {
		return resolvedTranscriptPath;
	}
}
async function withSessionTranscriptAppendQueue(transcriptPath, fn) {
	const queueKey = await resolveTranscriptAppendQueueKey(transcriptPath);
	const previous = transcriptAppendQueues.get(queueKey) ?? Promise.resolve();
	let releaseCurrent;
	const current = new Promise((resolve) => {
		releaseCurrent = resolve;
	});
	const tail = previous.catch(() => void 0).then(() => current);
	transcriptAppendQueues.set(queueKey, tail);
	await previous.catch(() => void 0);
	try {
		return await fn();
	} finally {
		releaseCurrent();
		if (transcriptAppendQueues.get(queueKey) === tail) transcriptAppendQueues.delete(queueKey);
	}
}
function isTranscriptAgentMessage(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && typeof value.role === "string";
}
async function appendSessionTranscriptMessage(params) {
	const activeLockRunner = resolveOwnedSessionTranscriptWriteLockRunner({ sessionFile: params.transcriptPath });
	if (activeLockRunner) {
		let publishedHeader;
		return await activeLockRunner(() => withSessionTranscriptAppendQueue(params.transcriptPath, () => appendSessionTranscriptMessageLocked({
			...params,
			onHeaderCreated: (header) => {
				publishedHeader = header;
			}
		})), {
			publishOwnedWrite: true,
			resolvePublishedEntries: (result) => [...publishedHeader ? [{
				kind: "header",
				serialized: publishedHeader
			}] : [], ...result?.appended === true ? [{
				kind: "id",
				id: result.messageId
			}] : []],
			resolvePublishedEntriesAfterFailure: () => publishedHeader ? [{
				kind: "header",
				serialized: publishedHeader
			}] : []
		});
	}
	return await withSessionTranscriptAppendQueue(params.transcriptPath, () => withSessionTranscriptWriteLock(params, () => appendSessionTranscriptMessageLocked(params)));
}
async function appendSessionTranscriptMessageWithOwnedWriteLock(params) {
	const activeLockRunner = resolveOwnedSessionTranscriptWriteLockRunner({ sessionFile: params.transcriptPath });
	if (!activeLockRunner) throw new Error("Owned transcript write lock is required for batch transcript append");
	return await activeLockRunner(() => appendSessionTranscriptMessageLocked(params));
}
/**
* Runs a group of transcript appends through one append queue and write lock.
*/
async function runSessionTranscriptAppendTransaction(params, run) {
	const publishedEntries = [];
	const runTransaction = async () => await run({
		appendEvent: async (event) => {
			const result = await appendSessionTranscriptEventLocked({
				config: params.config,
				event,
				transcriptPath: params.transcriptPath
			});
			publishedEntries.push({
				kind: "serialized",
				serialized: result.serializedEntry
			});
		},
		appendMessage: async (messageParams) => {
			const result = await appendSessionTranscriptMessageLocked({
				...messageParams,
				config: params.config,
				onHeaderCreated: (header) => {
					publishedEntries.push({
						kind: "header",
						serialized: header
					});
				},
				transcriptPath: params.transcriptPath
			});
			if (result?.appended === true) publishedEntries.push({
				kind: "id",
				id: result.messageId
			});
			return result;
		}
	});
	const activeLockRunner = resolveOwnedSessionTranscriptWriteLockRunner({ sessionFile: params.transcriptPath });
	if (activeLockRunner) return await activeLockRunner(() => withSessionTranscriptAppendQueue(params.transcriptPath, runTransaction), {
		publishOwnedWrite: true,
		resolvePublishedEntries: () => publishedEntries,
		resolvePublishedEntriesAfterFailure: () => publishedEntries
	});
	return await withSessionTranscriptAppendQueue(params.transcriptPath, () => withSessionTranscriptWriteLock(params, runTransaction));
}
/** Appends a raw transcript event using the same write lock and FIFO as message appends. */
async function appendSessionTranscriptEvent(params) {
	const activeLockRunner = resolveOwnedSessionTranscriptWriteLockRunner({ sessionFile: params.transcriptPath });
	if (activeLockRunner) {
		await activeLockRunner(() => withSessionTranscriptAppendQueue(params.transcriptPath, () => appendSessionTranscriptEventLocked(params)), {
			publishOwnedWrite: true,
			resolvePublishedEntries: (result) => [{
				kind: "serialized",
				serialized: result.serializedEntry
			}]
		});
		return;
	}
	await withSessionTranscriptAppendQueue(params.transcriptPath, () => withSessionTranscriptWriteLock(params, () => appendSessionTranscriptEventLocked(params)));
}
async function withSessionTranscriptWriteLock(params, run) {
	const lock = await acquireSessionWriteLock({
		sessionFile: params.transcriptPath,
		...resolveSessionWriteLockOptions(params.config),
		allowReentrant: true
	});
	try {
		return await run();
	} finally {
		await lock.release();
	}
}
async function appendSessionTranscriptEventLocked(params) {
	await fs$1.mkdir(path.dirname(params.transcriptPath), { recursive: true });
	const serializedEvent = serializeJsonlEntry(params.event);
	await appendSerializedJsonlEntry(params.transcriptPath, serializedEvent);
	return { serializedEntry: serializedEvent.slice(0, -1) };
}
async function appendSessionTranscriptMessageLocked(params) {
	const now = params.now ?? Date.now();
	const serializedHeader = await ensureTranscriptHeader(params.transcriptPath, {
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.cwd ? { cwd: params.cwd } : {}
	});
	if (serializedHeader) params.onHeaderCreated?.(serializedHeader);
	const idempotencyKey = readMessageIdempotencyKey(params.message);
	const existing = idempotencyKey && params.idempotencyLookup === "scan" ? await findTranscriptMessageByIdempotencyKey(params.transcriptPath, idempotencyKey) : void 0;
	if (existing) return {
		...existing,
		message: existing.message,
		appended: false
	};
	const message = params.prepareMessageAfterIdempotencyCheck ? params.prepareMessageAfterIdempotencyCheck(params.message) : params.message;
	if (message === void 0) return;
	const messageId = randomUUID();
	const stat = await fs$1.stat(params.transcriptPath).catch(() => null);
	let leafInfo = await readTranscriptLeafInfo(params.transcriptPath).catch(() => ({
		hasParentLinkedEntries: false,
		nonSessionEntryCount: 0,
		appendMode: "active"
	}));
	const hasLinearEntries = !leafInfo.hasParentLinkedEntries && leafInfo.nonSessionEntryCount > 0;
	const shouldRawAppend = params.useRawWhenLinear !== false && hasLinearEntries && (stat?.size ?? 0) > SESSION_MANAGER_APPEND_MAX_BYTES;
	if (hasLinearEntries && !shouldRawAppend) {
		const migrated = await migrateLinearTranscriptToParentLinked(params.transcriptPath);
		leafInfo = {
			...migrated.leafId ? { leafId: migrated.leafId } : {},
			appendMode: "active",
			hasParentLinkedEntries: Boolean(migrated.leafId),
			nonSessionEntryCount: leafInfo.nonSessionEntryCount
		};
	}
	const finalMessage = isTranscriptAgentMessage(message) ? redactTranscriptMessage(message, params.config) : redactSecrets(message);
	const entry = {
		type: "message",
		id: messageId,
		...shouldRawAppend ? {} : { parentId: leafInfo.leafId ?? null },
		timestamp: resolveTimestampMsToIsoString(now),
		message: finalMessage,
		...leafInfo.appendMode === "side" && isTranscriptOnlyOpenClawAssistantMessage(finalMessage) ? { appendMode: "side" } : {}
	};
	await appendJsonlEntry(params.transcriptPath, entry);
	return {
		messageId,
		message: finalMessage,
		appended: true
	};
}
function readMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
async function findTranscriptMessageByIdempotencyKey(transcriptPath, idempotencyKey) {
	for await (const line of streamSessionTranscriptLinesReverse(transcriptPath)) try {
		const parsed = JSON.parse(line);
		const message = parsed.message;
		if (readMessageIdempotencyKey(message) !== idempotencyKey) continue;
		return {
			messageId: typeof parsed.id === "string" && parsed.id.trim().length > 0 ? parsed.id : idempotencyKey,
			message
		};
	} catch {
		continue;
	}
}
//#endregion
//#region src/config/sessions/transcript-file-resolve.ts
/**
* Resolves the transcript file for a session and persists the resolved target
* when the caller supplies the owning session store.
*/
async function resolveSessionTranscriptFile(params) {
	const sessionPathOpts = resolveSessionFilePathOptions({
		agentId: params.agentId,
		storePath: params.storePath
	});
	let sessionFile = resolveSessionFilePath(params.sessionId, params.sessionEntry, sessionPathOpts);
	let sessionEntry = params.sessionEntry;
	if (params.sessionStore && params.storePath) {
		const threadIdFromSessionKey = parseSessionThreadInfo(params.sessionKey).threadId;
		const fallbackSessionFile = !sessionEntry?.sessionFile ? resolveSessionTranscriptPath(params.sessionId, params.agentId, params.threadId ?? threadIdFromSessionKey) : void 0;
		const resolvedSessionFile = await resolveAndPersistSessionFile({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionStore: params.sessionStore,
			storePath: params.storePath,
			sessionEntry,
			agentId: sessionPathOpts?.agentId,
			sessionsDir: sessionPathOpts?.sessionsDir,
			fallbackSessionFile
		});
		sessionFile = resolvedSessionFile.sessionFile;
		sessionEntry = resolvedSessionFile.sessionEntry;
	}
	return {
		sessionFile,
		sessionEntry
	};
}
function isValidReplayTimestamp(value) {
	if (typeof value === "number") return Number.isFinite(value);
	return typeof value === "string" && value.trim().length > 0;
}
function replayableRole(record) {
	if (!record || record.type !== "message" || typeof record.id !== "string" || record.id.trim().length === 0 || !isValidReplayTimestamp(record.timestamp) || !(record.parentId === null || record.parentId === void 0 || typeof record.parentId === "string")) return;
	const role = record.message?.role;
	return role === "user" || role === "assistant" ? role : void 0;
}
/**
* Copy the tail of user/assistant JSONL records from a prior transcript into a
* freshly-rotated one. Tool, system, and compaction records are skipped so
* replay cannot reshape tool/role ordering, and the tail is aligned and
* coalesced into alternating user/assistant turns so role-ordering resets
* cannot immediately recur. Uses async I/O so long transcripts do not block
* the event loop. Returns 0 on any error.
*/
async function replayRecentUserAssistantMessages(params) {
	const max = Math.max(0, params.maxMessages ?? 6);
	const src = params.sourceTranscript;
	if (max === 0 || !src || !fs.existsSync(src)) return 0;
	try {
		const kept = [];
		for (const line of (await fs$1.readFile(src, "utf-8")).split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const role = replayableRole(JSON.parse(line));
				if (role) kept.push({
					role,
					line
				});
			} catch {}
		}
		if (kept.length === 0) return 0;
		let startIdx = Math.max(0, kept.length - max);
		while (startIdx < kept.length && kept[startIdx].role === "assistant") startIdx += 1;
		if (startIdx === kept.length) return 0;
		const tail = coalesceAlternatingReplayTail(kept.slice(startIdx)).map((entry) => entry.line);
		if (!fs.existsSync(params.targetTranscript)) {
			await fs$1.mkdir(path.dirname(params.targetTranscript), { recursive: true });
			const header = JSON.stringify({
				type: "session",
				version: 3,
				id: params.newSessionId,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				cwd: process.cwd()
			});
			await fs$1.writeFile(params.targetTranscript, `${header}\n`, {
				encoding: "utf-8",
				mode: 384
			});
		}
		await fs$1.appendFile(params.targetTranscript, `${tail.join("\n")}\n`, "utf-8");
		return tail.length;
	} catch {
		return 0;
	}
}
function coalesceAlternatingReplayTail(entries) {
	const tail = [];
	for (const entry of entries) {
		const lastIdx = tail.length - 1;
		if (lastIdx >= 0 && tail[lastIdx]?.role === entry.role) {
			tail[lastIdx] = entry;
			continue;
		}
		tail.push(entry);
	}
	return tail;
}
//#endregion
//#region src/config/sessions/session-accessor.ts
let sessionArchiveRuntimePromise = null;
function loadSessionArchiveRuntime() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime.js");
	return sessionArchiveRuntimePromise;
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveLogicalSessionStoreCandidates(params) {
	const storeConfig = params.cfg.session?.store;
	const defaultTarget = {
		agentId: params.agentId,
		storePath: resolveStorePath(storeConfig, {
			agentId: params.agentId,
			env: params.env
		})
	};
	if (!isStorePathTemplate(storeConfig)) return [defaultTarget];
	const targets = /* @__PURE__ */ new Map();
	targets.set(defaultTarget.storePath, defaultTarget);
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) if (target.agentId === params.agentId) targets.set(target.storePath, target);
	return [...targets.values()];
}
function buildLogicalSessionEntryCandidateKeys(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.requestedKey && params.requestedKey !== params.canonicalKey) targets.add(params.requestedKey);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function findFreshestSessionEntryMatch(entries, candidateKeys) {
	let freshest;
	for (const candidate of candidateKeys) {
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const match = entries.find((entry) => entry.sessionKey === trimmed);
		if (match && (!freshest || (match.entry.updatedAt ?? 0) >= (freshest.entry.updatedAt ?? 0))) freshest = match;
	}
	return freshest;
}
/**
* Resolves a logical session key to the freshest matching entry across the
* configured store and discovered same-agent stores.
*/
function resolveSessionEntryAccessTarget(scope) {
	const target = resolveSessionEntryStoreTarget(scope);
	return {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: target.entry,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey
	};
}
function resolveSessionEntryStoreTarget(scope) {
	const requestedKey = scope.sessionKey.trim();
	const canonicalKey = resolveSessionStoreKey({
		cfg: scope.cfg,
		sessionKey: requestedKey
	});
	const agentId = resolveSessionStoreAgentId(scope.cfg, canonicalKey);
	const scanTargets = buildLogicalSessionEntryCandidateKeys({
		agentId,
		canonicalKey,
		cfg: scope.cfg,
		requestedKey
	});
	const candidates = resolveLogicalSessionStoreCandidates({
		agentId,
		cfg: scope.cfg,
		env: scope.env
	});
	const fallback = candidates[0] ?? {
		agentId,
		storePath: resolveStorePath(scope.cfg.session?.store, {
			agentId,
			env: scope.env
		})
	};
	let selectedStorePath = fallback.storePath;
	let selectedMatch = findFreshestSessionEntryMatch(listSessionEntries({ storePath: fallback.storePath }), scanTargets);
	for (let index = 1; index < candidates.length; index += 1) {
		const candidate = candidates[index];
		if (!candidate) continue;
		const match = findFreshestSessionEntryMatch(listSessionEntries({ storePath: candidate.storePath }), scanTargets);
		if (match && (!selectedMatch || (match.entry.updatedAt ?? 0) >= (selectedMatch.entry.updatedAt ?? 0))) {
			selectedStorePath = candidate.storePath;
			selectedMatch = match;
		}
	}
	return {
		agentId,
		canonicalKey,
		entry: selectedMatch?.entry,
		requestedKey,
		storeKey: selectedMatch?.sessionKey ?? canonicalKey,
		storePath: selectedStorePath
	};
}
/**
* Mutates the freshest matching logical session entry without exposing the
* backing store map to callers.
*/
async function updateResolvedSessionEntry(scope, update) {
	const target = resolveSessionEntryStoreTarget(scope);
	if (!target.entry) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	return await updateSessionStore(target.storePath, async (store) => {
		const entry = store[target.storeKey];
		if (!entry) return {
			canonicalKey: target.canonicalKey,
			found: false
		};
		const result = await update(entry, {
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			entry,
			requestedKey: target.requestedKey,
			storeKey: target.storeKey
		});
		return {
			canonicalKey: target.canonicalKey,
			entry: structuredClone(entry),
			found: true,
			result,
			storeKey: target.storeKey
		};
	});
}
/** Returns the entry for a canonical or alias session key, if one exists. */
function loadSessionEntry(scope) {
	if (scope.clone === false || scope.readConsistency === "latest") return resolveSessionStoreEntry({
		store: loadSessionStore(resolveAccessStorePath(scope), {
			...scope.clone === false ? { clone: false } : {},
			...scope.readConsistency === "latest" ? { skipCache: true } : {},
			...scope.hydrateSkillPromptRefs === false ? { hydrateSkillPromptRefs: false } : {}
		}),
		sessionKey: scope.sessionKey
	}).existing;
	return getSessionEntry(scope);
}
/** Lists entries from the resolved store, preserving the persisted key for each row. */
function listSessionEntries(scope = {}) {
	if (scope.clone === false) return Object.entries(loadSessionStore(resolveAccessStorePath({
		...scope,
		sessionKey: ""
	}), {
		clone: false,
		...scope.hydrateSkillPromptRefs === false ? { hydrateSkillPromptRefs: false } : {}
	})).map(([sessionKey, entry]) => ({
		sessionKey,
		entry
	}));
	return listSessionEntries$1(scope);
}
/** Reads the last activity timestamp for one session entry, or undefined when absent. */
function readSessionUpdatedAt(scope) {
	if (scope.storePath) return readSessionUpdatedAt$1({
		storePath: scope.storePath,
		sessionKey: scope.sessionKey
	});
	return loadSessionEntry(scope)?.updatedAt;
}
/** Creates or updates one entry from a partial patch and returns the persisted entry. */
async function upsertSessionEntry(scope, patch) {
	return await patchSessionEntry$1({
		...scope,
		fallbackEntry: createFallbackSessionEntry(patch),
		update: () => patch
	});
}
/** Replaces one entry with the supplied value and returns the persisted entry. */
async function replaceSessionEntry(scope, entry) {
	return await patchSessionEntry$1({
		...scope,
		fallbackEntry: entry,
		replaceEntry: true,
		update: () => entry
	});
}
/**
* Applies an atomic patch to one entry.
* The updater sees the current entry plus whether it was synthesized from a
* fallback; returning null skips persistence.
*/
async function patchSessionEntry(scope, update, options = {}) {
	return await patchSessionEntry$1({
		...scope,
		fallbackEntry: options.fallbackEntry,
		maintenanceConfig: options.maintenanceConfig,
		preserveActivity: options.preserveActivity,
		requireWriteSuccess: options.requireWriteSuccess,
		replaceEntry: options.replaceEntry,
		skipMaintenance: options.skipMaintenance,
		takeCacheOwnership: options.takeCacheOwnership,
		update
	});
}
/**
* Applies an atomic patch and returns the persisted key selected by the backing
* store. Use when a caller must keep sidecar state keyed to the final row.
*/
async function patchSessionEntryWithKey(scope, update, options = {}) {
	return await patchSessionEntryWithKey$1({
		...scope,
		fallbackEntry: options.fallbackEntry,
		maintenanceConfig: options.maintenanceConfig,
		preserveActivity: options.preserveActivity,
		requireWriteSuccess: options.requireWriteSuccess,
		replaceEntry: options.replaceEntry,
		skipMaintenance: options.skipMaintenance,
		takeCacheOwnership: options.takeCacheOwnership,
		update
	});
}
/**
* Promotes the freshest alias row to the canonical key, prunes legacy aliases,
* and optionally patches the canonical entry under one accessor operation.
*/
async function canonicalizeSessionEntryAliases(params) {
	return await updateSessionStore(params.storePath, async (store) => {
		const targetKeys = normalizeTargetStoreKeys(params.target);
		const freshest = resolveFreshestTargetEntry(store, targetKeys);
		if (freshest) {
			const current = store[params.target.canonicalKey];
			if (!current || (freshest.entry.updatedAt ?? 0) > (current.updatedAt ?? 0)) store[params.target.canonicalKey] = freshest.entry;
		}
		const currentEntry = store[params.target.canonicalKey];
		const patch = params.update ? await params.update(cloneOptionalEntry(currentEntry)) : null;
		if (patch) store[params.target.canonicalKey] = {
			...currentEntry,
			...patch
		};
		for (const key of targetKeys) if (key !== params.target.canonicalKey) delete store[key];
		const entry = cloneOptionalEntry(store[params.target.canonicalKey]);
		return {
			canonicalKey: params.target.canonicalKey,
			...entry ? { entry } : {}
		};
	});
}
function normalizeTargetStoreKeys(target) {
	const keys = /* @__PURE__ */ new Set();
	const remember = (value) => {
		const trimmed = value.trim();
		if (trimmed) keys.add(trimmed);
	};
	remember(target.canonicalKey);
	for (const key of target.storeKeys) remember(key);
	return [...keys];
}
function resolveFreshestTargetEntry(store, targetKeys) {
	let freshest;
	for (const key of targetKeys) {
		const entry = store[key];
		if (!entry) continue;
		if (!freshest || (entry.updatedAt ?? 0) > (freshest.entry.updatedAt ?? 0)) freshest = {
			key,
			entry
		};
	}
	return freshest;
}
function cloneOptionalEntry(entry) {
	return entry ? structuredClone(entry) : void 0;
}
/**
* Creates or updates one session entry and initializes its transcript header as
* one storage-sized lifecycle operation. File-backed storage still writes JSON
* plus JSONL, but callers no longer compose entry write, header creation,
* rollback, and normalized sessionFile persistence themselves.
*/
async function createSessionEntryWithTranscript(scope, createEntry) {
	const storePath = resolveAccessStorePath(scope);
	return await updateSessionStore(storePath, async (store) => {
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey: scope.sessionKey
		});
		const created = await createEntry({
			existingEntry: resolved.existing ? { ...resolved.existing } : void 0,
			sessionEntries: cloneSessionEntries(store)
		});
		if (!created.ok) return {
			ok: false,
			error: created.error,
			phase: "entry"
		};
		const ensured = ensureCreatedSessionTranscript({
			agentId: scope.agentId,
			entry: created.entry,
			storePath
		});
		if (!ensured.ok) {
			delete store[resolved.normalizedKey];
			return ensured;
		}
		const entry = created.entry.sessionFile === ensured.sessionFile ? created.entry : {
			...created.entry,
			sessionFile: ensured.sessionFile
		};
		store[resolved.normalizedKey] = entry;
		for (const legacyKey of resolved.legacyKeys) delete store[legacyKey];
		return {
			ok: true,
			entry,
			sessionFile: ensured.sessionFile
		};
	});
}
function cloneSessionEntries(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, { ...entry }]));
}
function createReplySessionInitializationRevision(entry) {
	return JSON.stringify(entry ?? null);
}
function resolveInitializedReplySessionEntry(params) {
	const fallbackSessionFile = params.fallbackSessionFile?.trim();
	const currentSessionFile = params.currentEntry?.sessionFile;
	const inheritedPreviousSessionFile = Boolean(currentSessionFile) && params.currentEntry?.sessionId !== params.sessionEntry.sessionId && currentSessionFile === params.sessionEntry.sessionFile;
	const entryForResolve = fallbackSessionFile && (inheritedPreviousSessionFile || !params.sessionEntry.sessionFile) ? {
		...params.sessionEntry,
		sessionFile: fallbackSessionFile
	} : inheritedPreviousSessionFile ? {
		...params.sessionEntry,
		sessionFile: void 0
	} : params.sessionEntry;
	const sessionFile = resolveSessionFilePath(params.sessionEntry.sessionId, entryForResolve, {
		agentId: params.agentId,
		sessionsDir: path.dirname(path.resolve(params.storePath))
	});
	return {
		...params.sessionEntry,
		sessionFile
	};
}
function ensureCreatedSessionTranscript(params) {
	try {
		const sessionFile = resolveSessionFilePath(params.entry.sessionId, params.entry.sessionFile ? { sessionFile: params.entry.sessionFile } : void 0, {
			agentId: params.agentId,
			sessionsDir: path.dirname(path.resolve(params.storePath))
		});
		if (!fs.existsSync(sessionFile)) {
			fs.mkdirSync(path.dirname(sessionFile), { recursive: true });
			fs.writeFileSync(sessionFile, `${JSON.stringify(createSessionTranscriptHeader({ sessionId: params.entry.sessionId }))}\n`, {
				encoding: "utf-8",
				mode: 384
			});
		}
		return {
			ok: true,
			sessionFile
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err),
			phase: "transcript"
		};
	}
}
/** Updates an existing entry only; returns null when the session is absent. */
async function updateSessionEntry(scope, update, options = {}) {
	return await updateSessionStoreEntry({
		storePath: resolveAccessStorePath(scope),
		sessionKey: scope.sessionKey,
		skipMaintenance: options.skipMaintenance,
		takeCacheOwnership: options.takeCacheOwnership,
		requireWriteSuccess: options.requireWriteSuccess,
		update
	});
}
/** Resolves one abort target identity without exposing the mutable store. */
function resolveSessionAbortTarget(scope) {
	const resolved = resolveSessionStoreEntry({
		store: loadSessionStore(resolveAccessStorePath(scope)),
		sessionKey: scope.sessionKey
	});
	if (!resolved.existing) return null;
	return {
		entry: { ...resolved.existing },
		sessionId: resolved.existing.sessionId,
		sessionKey: resolved.normalizedKey
	};
}
/**
* Resolves, marks, touches, and canonicalizes one abort target entry as a
* storage-sized operation. Runtime abort side effects remain with callers.
*/
async function markSessionAbortTarget(params) {
	const storePath = resolveAccessStorePath(params.scope);
	let canPersistSingleEntry = false;
	let resolvedTarget = null;
	try {
		return await updateSessionStore(storePath, (store) => {
			const resolved = resolveSessionStoreEntry({
				store,
				sessionKey: params.scope.sessionKey
			});
			if (!resolved.existing) return null;
			const sessionKey = resolved.normalizedKey;
			resolvedTarget = {
				entry: { ...resolved.existing },
				persisted: false,
				sessionId: resolved.existing.sessionId,
				sessionKey
			};
			const entry = {
				...resolved.existing,
				abortedLastRun: true,
				updatedAt: params.now?.() ?? Date.now()
			};
			applySessionAbortCutoff(entry, params.resolveAbortCutoff?.({
				entry: { ...resolved.existing },
				sessionKey
			}));
			store[sessionKey] = entry;
			canPersistSingleEntry = resolved.legacyKeys.length === 0;
			for (const legacyKey of resolved.legacyKeys) if (legacyKey !== sessionKey) delete store[legacyKey];
			return {
				entry: { ...entry },
				persisted: true,
				sessionId: entry.sessionId,
				sessionKey
			};
		}, {
			resolveSingleEntryPersistence: (result) => result && result.sessionKey && canPersistSingleEntry ? {
				sessionKey: result.sessionKey,
				entry: result.entry
			} : null,
			skipSaveWhenResult: (result) => result === null
		});
	} catch (error) {
		const fallbackTarget = resolvedTarget;
		if (fallbackTarget) return {
			entry: fallbackTarget.entry,
			persisted: fallbackTarget.persisted,
			sessionId: fallbackTarget.sessionId,
			sessionKey: fallbackTarget.sessionKey,
			persistenceError: formatErrorMessage(error)
		};
		throw error;
	}
}
function applySessionAbortCutoff(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
/**
* Applies a session patch projection through the accessor boundary.
* The resolver sees a read-only snapshot and names the persisted key set; the
* projector returns one replacement entry without receiving the mutable store.
*/
async function applySessionPatchProjection(params) {
	return await applySessionEntryPatchProjection(params);
}
/**
* Applies restart-recovery lifecycle replacements without exposing the backing
* store shape. The file backend runs selection and replacement under one writer
* lock; the SQLite backend can map the same callback to a transaction.
*/
async function applyRestartRecoveryLifecycle(params) {
	return (await updateSessionStore(params.storePath, async (store) => {
		const entries = Object.entries(store).map(([sessionKey, entry]) => ({
			sessionKey,
			entry: structuredClone(entry)
		}));
		const operation = await params.update(entries);
		let changed = false;
		for (const replacement of operation.replacements ?? []) {
			if (!Object.hasOwn(store, replacement.sessionKey)) continue;
			store[replacement.sessionKey] = structuredClone(replacement.entry);
			changed = true;
		}
		return {
			changed,
			result: operation.result
		};
	}, {
		requireWriteSuccess: params.requireWriteSuccess,
		skipMaintenance: params.skipMaintenance ?? true,
		skipSaveWhenResult: (result) => !result.changed
	})).result;
}
/** Removes entries and orphan transcript artifacts owned by a named session lifecycle. */
async function cleanupSessionLifecycleArtifacts(params) {
	return await cleanupSessionLifecycleArtifacts$1(params);
}
/** Resets one persisted session entry and transitions its transcript state. */
async function resetSessionEntryLifecycle(params) {
	return await resetSessionEntryLifecycle$1(params);
}
/** Deletes one persisted session entry and transitions its transcript state. */
async function deleteSessionEntryLifecycle(params) {
	return await deleteSessionEntryLifecycle$1(params);
}
/** Applies exact entry lifecycle mutations and artifact cleanup at the storage boundary. */
async function applySessionEntryLifecycleMutation(params) {
	return await applySessionEntryLifecycleMutation$1(params);
}
/** Purges session entries owned by a deleted agent at the storage boundary. */
async function purgeDeletedAgentSessionEntries(params) {
	return await purgeDeletedAgentSessionEntries$1(params);
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	return await cleanupPluginHostSessionStore$1(params);
}
/**
* Persists a runner-driven reset rotation together with transcript replay and
* optional cleanup. File storage performs these steps sequentially; database
* backends implement this operation as one lifecycle transaction.
*/
async function persistSessionResetLifecycle(params) {
	let persistError;
	try {
		await updateSessionStore(params.storePath, (store) => {
			store[params.sessionKey] = params.nextEntry;
		});
	} catch (err) {
		persistError = err instanceof Error ? err : new Error(String(err));
	}
	const replayedMessages = await replayRecentUserAssistantMessages({
		sourceTranscript: params.previousEntry.sessionFile,
		targetTranscript: params.nextSessionFile,
		newSessionId: params.nextEntry.sessionId
	});
	if (params.cleanupPreviousTranscript && params.previousSessionId) cleanupPreviousResetTranscripts({
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		previousEntry: params.previousEntry,
		previousSessionId: params.previousSessionId,
		storePath: params.storePath
	});
	if (persistError) throw persistError;
	return { replayedMessages };
}
/**
* Persists a reply session rollover and returns stable previous-transcript
* data for lifecycle hooks. Non-storage runtime cleanup remains with callers.
*/
async function persistSessionRolloverLifecycle(params) {
	await updateSessionStore(params.storePath, (store) => {
		store[params.sessionKey] = {
			...store[params.sessionKey],
			...params.sessionEntry
		};
		if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
		return store[params.sessionKey] ?? params.sessionEntry;
	}, {
		activeSessionKey: params.activeSessionKey,
		maintenanceConfig: params.maintenanceConfig,
		onWarn: params.onMaintenanceWarning
	});
	return {
		previousSessionTranscript: await archivePreviousSessionTranscript({
			agentId: params.agentId,
			onArchiveError: params.onArchiveError,
			previousEntry: params.previousEntry,
			storePath: params.storePath
		}),
		sessionEntry: params.sessionEntry
	};
}
/** Loads the reply-session initialization rows without exposing a mutable store. */
function loadReplySessionInitializationSnapshot(params) {
	const store = loadSessionStore(params.storePath, {
		skipCache: true,
		clone: false
	});
	const resolved = resolveSessionStoreEntry({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	const entries = cloneSessionEntries(store);
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntry({
				store: entries,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
/**
* Persists one reply-session initialization result and archives the previous
* transcript after metadata commits. SQLite adapters map the guarded write to a
* transaction and keep archive failure warning-only, matching file storage.
*/
async function commitReplySessionInitialization(params) {
	const committed = await updateSessionStore(params.storePath, async (store) => {
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey: params.sessionKey
		});
		const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
		const revision = createReplySessionInitializationRevision(currentEntry);
		if (revision !== params.expectedRevision) return {
			ok: false,
			...currentEntry ? { currentEntry } : {},
			reason: "stale-snapshot",
			revision
		};
		const readEntry = (sessionKey) => {
			const entry = resolveSessionStoreEntry({
				store,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		};
		const preparedSessionEntry = params.prepareSessionEntry ? await params.prepareSessionEntry({
			...currentEntry ? { currentEntry } : {},
			readEntry,
			sessionEntry: params.sessionEntry
		}) : params.sessionEntry;
		const sessionEntry = resolveInitializedReplySessionEntry({
			agentId: params.agentId,
			...currentEntry ? { currentEntry } : {},
			fallbackSessionFile: params.fallbackSessionFile,
			sessionEntry: preparedSessionEntry,
			storePath: params.storePath
		});
		store[resolved.normalizedKey] = sessionEntry;
		if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
		return {
			ok: true,
			previousSessionTranscript: {},
			sessionEntry: { ...store[resolved.normalizedKey] ?? sessionEntry },
			sessionStoreView: cloneSessionEntries(store)
		};
	}, {
		activeSessionKey: params.activeSessionKey,
		maintenanceConfig: params.maintenanceConfig,
		onWarn: params.onMaintenanceWarning,
		skipSaveWhenResult: (result) => !result.ok
	});
	if (!committed.ok) return committed;
	const previousSessionTranscript = await archivePreviousSessionTranscript({
		agentId: params.agentId,
		onArchiveError: params.onArchiveError,
		previousEntry: params.previousEntry,
		storePath: params.storePath
	});
	return {
		...committed,
		previousSessionTranscript
	};
}
/**
* Appends a non-message transcript record such as session or metadata events.
* Message records must use appendTranscriptMessage so parent links, idempotency,
* and redaction are preserved.
*/
async function appendTranscriptEvent(scope, event) {
	assertNonMessageTranscriptEvent(event);
	await appendSessionTranscriptEvent({
		event,
		transcriptPath: (await resolveTranscriptAccess(scope)).sessionFile
	});
}
function assertNonMessageTranscriptEvent(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	if (event.type === "message") throw new Error("appendTranscriptEvent cannot write message transcript records; use appendTranscriptMessage instead.");
}
async function appendTranscriptMessage(scope, options) {
	return await appendSessionTranscriptMessage({
		transcriptPath: (await resolveTranscriptAccess(scope)).sessionFile,
		message: options.message,
		...scope.sessionId ? { sessionId: scope.sessionId } : {},
		...options.cwd ? { cwd: options.cwd } : {},
		...options.config ? { config: options.config } : {},
		...options.idempotencyLookup ? { idempotencyLookup: options.idempotencyLookup } : {},
		...options.now !== void 0 ? { now: options.now } : {},
		...options.prepareMessageAfterIdempotencyCheck ? { prepareMessageAfterIdempotencyCheck: options.prepareMessageAfterIdempotencyCheck } : {},
		...options.useRawWhenLinear !== void 0 ? { useRawWhenLinear: options.useRawWhenLinear } : {}
	});
}
/** Emits a transcript update after resolving the current transcript target. */
async function publishTranscriptUpdate(scope, update = {}) {
	const transcript = await resolveTranscriptAccess(scope);
	emitSessionTranscriptUpdate({
		...update,
		sessionFile: transcript.sessionFile,
		...transcript.target ? { target: transcript.target } : {}
	});
}
/**
* Trims a transcript for manual sessions.compact and clears stale token metadata.
* This is one storage-sized mutation: future stores can trim transcript rows and
* update entry metadata inside the same backend transaction.
*/
async function preflightSessionTranscriptForManualCompact(scope, params) {
	const transcript = await resolveManualCompactTranscriptTarget(scope, params.sessionFile);
	if (!transcript) return {
		compacted: false,
		reason: "no transcript"
	};
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	let totalLines = 0;
	try {
		for await (const line of streamSessionTranscriptLines(transcript.sessionFile)) {
			if (!line) continue;
			totalLines += 1;
			if (totalLines > maxLines) return { compacted: true };
		}
	} catch {
		return {
			compacted: false,
			kept: 0
		};
	}
	return {
		compacted: false,
		kept: totalLines
	};
}
async function trimSessionTranscriptForManualCompact(scope, params) {
	const transcript = await resolveManualCompactTranscriptTarget(scope, params.sessionFile);
	if (!transcript) return {
		compacted: false,
		reason: "no transcript"
	};
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	let headerLine;
	const tailLines = [];
	const maxTailLines = Math.max(0, maxLines - 1);
	let totalLines = 0;
	try {
		for await (const line of streamSessionTranscriptLines(transcript.sessionFile)) {
			totalLines += 1;
			if (totalLines === 1) {
				headerLine = line;
				continue;
			}
			tailLines.push(line);
			if (tailLines.length > maxTailLines) tailLines.shift();
		}
	} catch {
		return {
			compacted: false,
			kept: 0
		};
	}
	if (totalLines <= maxLines) return {
		compacted: false,
		kept: totalLines
	};
	const lines = normalizeManualCompactTranscriptLines(headerLine, tailLines);
	if (!lines) return {
		compacted: false,
		kept: 0
	};
	const archived = await replaceTranscriptForManualCompact(transcript.sessionFile, lines);
	await patchSessionEntry({
		...scope,
		sessionKey: transcript.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		delete entry.contextBudgetStatus;
		delete entry.inputTokens;
		delete entry.outputTokens;
		delete entry.totalTokens;
		delete entry.totalTokensFresh;
		entry.updatedAt = params.nowMs ?? Date.now();
		return entry;
	}, { replaceEntry: true });
	return {
		archived,
		compacted: true,
		kept: lines.length
	};
}
function parseManualCompactTranscriptRecord(line) {
	try {
		const parsed = JSON.parse(line);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function normalizeManualCompactTranscriptLines(headerLine, tailLines) {
	if (!headerLine) return null;
	const header = parseManualCompactTranscriptRecord(headerLine);
	if (header?.type !== "session" || typeof header.id !== "string") return null;
	const records = tailLines.map(parseManualCompactTranscriptRecord).filter((record) => record !== null);
	const retainedIds = /* @__PURE__ */ new Set();
	const transparentParents = /* @__PURE__ */ new Map();
	const normalizedRecords = [];
	for (const record of records) {
		let parentId = record.parentId;
		const seenTransparentParents = /* @__PURE__ */ new Set();
		while (typeof parentId === "string" && transparentParents.has(parentId) && !seenTransparentParents.has(parentId)) {
			seenTransparentParents.add(parentId);
			parentId = transparentParents.get(parentId) ?? null;
		}
		let next = typeof parentId === "string" && !retainedIds.has(parentId) ? {
			...record,
			parentId: null
		} : parentId !== record.parentId ? {
			...record,
			parentId
		} : record;
		if (next.type === "leaf") {
			const targetId = next.targetId;
			const validTargetId = targetId === null || typeof targetId === "string" && targetId.trim().length > 0;
			if (!validTargetId && typeof next.id === "string") transparentParents.set(next.id, next.parentId === null || typeof next.parentId === "string" ? next.parentId : null);
			if (typeof targetId === "string" && targetId.trim() && !retainedIds.has(targetId)) next = {
				...next,
				targetId: null,
				appendParentId: null
			};
			else if (validTargetId && typeof next.appendParentId === "string" && !retainedIds.has(next.appendParentId)) next = {
				...next,
				appendParentId: targetId
			};
		}
		if (next.type === "compaction" && typeof next.id === "string") {
			const firstKeptEntryId = next.firstKeptEntryId;
			if (typeof firstKeptEntryId === "string" && firstKeptEntryId !== next.id) {
				const branchPath = selectSessionTranscriptTreePathNodes(scanSessionTranscriptTree([...normalizedRecords, next]), next.id);
				if (!branchPath.some((node) => node.id === firstKeptEntryId)) next = {
					...next,
					firstKeptEntryId: branchPath[0]?.id ?? next.id
				};
			}
		}
		normalizedRecords.push(next);
		if (typeof next.id === "string" && next.id.trim()) retainedIds.add(next.id);
	}
	return [JSON.stringify(header), ...normalizedRecords.map((record) => JSON.stringify(record))];
}
async function replaceTranscriptForManualCompact(filePath, lines) {
	const archived = `${filePath}.bak.${formatSessionArchiveTimestamp()}`;
	const replacement = `${filePath}.compact.${randomUUID()}.tmp`;
	try {
		await writeJsonlLines(replacement, lines, {
			flag: "wx",
			mode: 384
		});
		await fs.promises.rename(filePath, archived);
		try {
			await fs.promises.rename(replacement, filePath);
		} catch (err) {
			await fs.promises.rename(archived, filePath).catch(() => void 0);
			throw err;
		}
	} catch (err) {
		await fs.promises.unlink(replacement).catch(() => void 0);
		throw err;
	}
	emitSessionTranscriptUpdate({ sessionFile: archived });
	emitSessionTranscriptUpdate({ sessionFile: filePath });
	return archived;
}
async function resolveManualCompactTranscriptTarget(scope, sessionFile) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const candidates = resolveManualCompactTranscriptCandidates({
		agentId,
		sessionFile,
		sessionId: scope.sessionId,
		storePath: scope.storePath
	});
	for (const candidate of candidates) if ((await fs.promises.stat(candidate).catch(() => null))?.isFile()) return {
		agentId,
		sessionFile: candidate,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey
	};
	return null;
}
function resolveManualCompactTranscriptCandidates(params) {
	const candidates = [];
	const sessionFileState = classifyGeneratedTranscriptCandidate(params.sessionId, params.sessionFile);
	const pushCandidate = (resolve) => {
		try {
			const candidate = resolve();
			if (!candidates.includes(candidate)) candidates.push(candidate);
		} catch {}
	};
	if (params.storePath) {
		const sessionsDir = path.dirname(params.storePath);
		if (params.sessionFile && sessionFileState !== "stale") pushCandidate(() => resolveSessionFilePath(params.sessionId, { sessionFile: params.sessionFile }, {
			sessionsDir,
			agentId: params.agentId
		}));
		pushCandidate(() => resolveSessionTranscriptPathInDir(params.sessionId, sessionsDir));
		if (params.sessionFile && sessionFileState === "stale") pushCandidate(() => resolveSessionFilePath(params.sessionId, { sessionFile: params.sessionFile }, {
			sessionsDir,
			agentId: params.agentId
		}));
	} else if (params.sessionFile) if (params.agentId) {
		if (sessionFileState !== "stale") pushCandidate(() => resolveSessionFilePath(params.sessionId, { sessionFile: params.sessionFile }, { agentId: params.agentId }));
	} else {
		const trimmed = params.sessionFile.trim();
		if (trimmed) candidates.push(path.resolve(trimmed));
	}
	if (params.agentId) {
		pushCandidate(() => resolveSessionTranscriptPath(params.sessionId, params.agentId));
		if (params.sessionFile && sessionFileState === "stale") pushCandidate(() => resolveSessionFilePath(params.sessionId, { sessionFile: params.sessionFile }, { agentId: params.agentId }));
	}
	const legacyDir = path.join(resolveRequiredHomeDir(process.env, os.homedir), ".openclaw", "sessions");
	pushCandidate(() => resolveSessionTranscriptPathInDir(params.sessionId, legacyDir));
	return candidates;
}
function classifyGeneratedTranscriptCandidate(sessionId, sessionFile) {
	const transcriptSessionId = extractGeneratedTranscriptSessionId(sessionFile);
	if (!transcriptSessionId) return "custom";
	return transcriptSessionId === sessionId ? "current" : "stale";
}
/**
* Persists one logical transcript turn through the current file-backed writer.
* The file implementation resolves/rebinds the transcript file, holds one
* session write lock across all message appends, optionally touches session
* metadata, then publishes after the write has completed.
*
* SQLite implementation note: the transcript row append(s), sessionFile marker,
* and requested updatedAt touch become one SQLite write transaction; transcript
* update delivery must run only after commit.
*/
async function persistSessionTranscriptTurn(scope, options) {
	const expectedSessionId = options.expectedSessionId;
	if (expectedSessionId) return await persistExpectedSessionTranscriptTurn(scope, {
		...options,
		expectedSessionId
	});
	const target = await resolveTranscriptTurnTarget(scope);
	const appendedMessages = await appendTranscriptTurnMessages(target, options);
	const appendedCount = countAppendedTranscriptMessages(appendedMessages);
	const sessionEntry = await touchTranscriptTurnSessionEntry({
		scope,
		target,
		shouldTouch: options.touchSessionEntry === true && appendedCount > 0
	});
	await publishTranscriptTurnUpdate({
		target,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages
	});
	return {
		appendedCount,
		messages: appendedMessages,
		sessionEntry,
		sessionFile: target.sessionFile
	};
}
async function appendTranscriptTurnMessages(target, options) {
	const appendedMessages = [];
	const publishedEntries = [];
	const appendMessages = async (appendMessage) => {
		for (const append of options.messages) {
			if (!(append.shouldAppend ? await append.shouldAppend({
				...target.agentId ? { agentId: target.agentId } : {},
				sessionFile: target.sessionFile,
				...target.sessionId ? { sessionId: target.sessionId } : {},
				...target.sessionKey ? { sessionKey: target.sessionKey } : {}
			}) : true)) continue;
			const result = await appendMessage({
				transcriptPath: target.sessionFile,
				message: append.message,
				...target.sessionId ? { sessionId: target.sessionId } : {},
				...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
				...append.config ?? options.config ? { config: append.config ?? options.config } : {},
				...append.idempotencyLookup ? { idempotencyLookup: append.idempotencyLookup } : {},
				...append.now !== void 0 ? { now: append.now } : {},
				...append.prepareMessageAfterIdempotencyCheck ? { prepareMessageAfterIdempotencyCheck: append.prepareMessageAfterIdempotencyCheck } : {},
				onHeaderCreated: (header) => {
					publishedEntries.push({
						kind: "header",
						serialized: header
					});
				},
				...append.useRawWhenLinear !== void 0 ? { useRawWhenLinear: append.useRawWhenLinear } : {}
			});
			if (result) {
				appendedMessages.push(result);
				if (result.appended) publishedEntries.push({
					kind: "id",
					id: result.messageId
				});
			}
		}
	};
	const activeLockRunner = resolveOwnedSessionTranscriptWriteLockRunner({
		sessionFile: target.sessionFile,
		sessionKey: target.sessionKey
	});
	const runBatchWithOwnedLock = async () => await withOwnedSessionTranscriptWrites({
		sessionFile: target.sessionFile,
		sessionKey: target.sessionKey,
		withSessionWriteLock: async (run) => await run()
	}, async () => await appendMessages(appendSessionTranscriptMessageWithOwnedWriteLock));
	if (activeLockRunner) await activeLockRunner(() => withSessionTranscriptAppendQueue(target.sessionFile, runBatchWithOwnedLock), {
		publishOwnedWrite: true,
		resolvePublishedEntries: () => publishedEntries,
		resolvePublishedEntriesAfterFailure: () => publishedEntries
	});
	else await withSessionTranscriptAppendQueue(target.sessionFile, async () => {
		const lock = await acquireSessionWriteLock({
			sessionFile: target.sessionFile,
			...resolveSessionWriteLockOptions(options.config),
			allowReentrant: true
		});
		try {
			await runBatchWithOwnedLock();
		} finally {
			await lock.release();
		}
	});
	return appendedMessages;
}
function countAppendedTranscriptMessages(messages) {
	return messages.filter((message) => message.appended).length;
}
async function persistExpectedSessionTranscriptTurn(scope, options) {
	const sessionKey = scope.sessionKey?.trim();
	if (!scope.storePath || !sessionKey) throw new Error("Cannot guard a transcript turn without a session store and key");
	const expectedSessionId = options.expectedSessionId;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript turn without an agent id: ${sessionKey}`);
	const resolved = resolveSessionStoreEntry({
		store: scope.sessionStore ?? loadSessionStore(scope.storePath, {
			skipCache: true,
			clone: false
		}),
		sessionKey
	});
	let appendedMessages = [];
	let target = {
		agentId,
		sessionFile: scope.sessionFile ?? resolveSessionTranscriptPathInDir(expectedSessionId, path.dirname(scope.storePath)),
		sessionId: expectedSessionId,
		sessionKey: resolved.normalizedKey
	};
	let rejectedEntry;
	let touchUpdatedAt;
	const updated = await updateSessionEntry({
		sessionKey: resolved.normalizedKey,
		storePath: scope.storePath
	}, async (currentEntry) => {
		if (currentEntry.sessionId !== expectedSessionId) {
			rejectedEntry = currentEntry;
			return null;
		}
		const sessionFile = scope.sessionFile ?? resolveSessionFilePath(currentEntry.sessionId, currentEntry, resolveSessionFilePathOptions({
			agentId,
			storePath: scope.storePath
		}));
		target = {
			agentId,
			sessionFile,
			sessionId: currentEntry.sessionId,
			sessionKey: resolved.normalizedKey
		};
		appendedMessages = await appendTranscriptTurnMessages(target, options);
		const appendedCount = countAppendedTranscriptMessages(appendedMessages);
		if (options.touchSessionEntry === true && appendedCount > 0) touchUpdatedAt = Date.now();
		const patch = {
			...currentEntry.sessionFile === sessionFile ? {} : { sessionFile },
			...touchUpdatedAt !== void 0 ? { updatedAt: Math.max(currentEntry.updatedAt ?? 0, touchUpdatedAt) } : {}
		};
		return Object.keys(patch).length > 0 ? patch : null;
	}, { skipMaintenance: true });
	if (rejectedEntry || updated?.sessionId !== expectedSessionId) return {
		appendedCount: 0,
		messages: [],
		rejectedReason: "session-rebound",
		sessionEntry: rejectedEntry ?? updated ?? void 0,
		sessionFile: target.sessionFile
	};
	await publishTranscriptTurnUpdate({
		target,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages
	});
	if (updated && scope.sessionStore) scope.sessionStore[resolved.normalizedKey] = updated;
	return {
		appendedCount: countAppendedTranscriptMessages(appendedMessages),
		messages: appendedMessages,
		sessionEntry: updated ?? scope.sessionEntry,
		sessionFile: target.sessionFile
	};
}
/**
* Resolves the current file-backed target for a storage-neutral runtime
* transcript scope. Callers use the scope as identity; sessionFile is returned
* only for current file-backed implementation details such as locks/events.
*/
async function resolveSessionTranscriptRuntimeTarget(scope) {
	const { agentId, sessionEntry, sessionKey, sessionStore } = resolveSessionTranscriptRuntimeContext(scope);
	if (scope.sessionFile?.trim()) return {
		agentId,
		sessionFile: path.resolve(scope.sessionFile),
		sessionId: scope.sessionId,
		sessionKey
	};
	if (sessionStore && scope.storePath) {
		const sessionsDir = path.dirname(path.resolve(scope.storePath));
		const threadId = scope.threadId ?? parseSessionThreadInfo(scope.sessionKey).threadId;
		return {
			agentId,
			sessionFile: (await resolveAndPersistSessionFile({
				agentId,
				fallbackSessionFile: (!sessionEntry?.sessionFile || sessionEntry.sessionId !== scope.sessionId) && threadId !== void 0 ? resolveSessionTranscriptPathInDir(scope.sessionId, sessionsDir, threadId) : void 0,
				sessionEntry,
				sessionId: scope.sessionId,
				sessionKey,
				sessionStore,
				sessionsDir,
				storePath: scope.storePath
			})).sessionFile,
			sessionId: scope.sessionId,
			sessionKey
		};
	}
	return {
		agentId,
		sessionFile: (await resolveSessionTranscriptFile({
			agentId,
			sessionEntry,
			sessionId: scope.sessionId,
			sessionKey: scope.sessionKey,
			...sessionStore ? { sessionStore } : {},
			...scope.storePath ? { storePath: scope.storePath } : {},
			...scope.threadId !== void 0 ? { threadId: scope.threadId } : {}
		})).sessionFile,
		sessionId: scope.sessionId,
		sessionKey
	};
}
/**
* Resolves the file-backed runtime transcript target for read/delete probes
* without persisting missing sessionFile metadata into the session store.
*/
async function resolveSessionTranscriptRuntimeReadTarget(scope) {
	const { agentId, sessionEntry, sessionKey } = resolveSessionTranscriptRuntimeContext(scope);
	if (scope.sessionFile?.trim()) return {
		agentId,
		sessionFile: path.resolve(scope.sessionFile),
		sessionId: scope.sessionId,
		sessionKey
	};
	const matchingSessionEntry = sessionEntry?.sessionId === scope.sessionId ? sessionEntry : void 0;
	if (scope.storePath) {
		const sessionsDir = path.dirname(path.resolve(scope.storePath));
		const threadId = scope.threadId ?? parseSessionThreadInfo(sessionKey).threadId;
		return {
			agentId,
			sessionFile: matchingSessionEntry?.sessionFile ? resolveSessionFilePath(scope.sessionId, matchingSessionEntry, {
				agentId,
				sessionsDir
			}) : resolveSessionTranscriptPathInDir(scope.sessionId, sessionsDir, threadId),
			sessionId: scope.sessionId,
			sessionKey
		};
	}
	const threadId = scope.threadId ?? parseSessionThreadInfo(sessionKey).threadId;
	return {
		agentId,
		sessionFile: matchingSessionEntry?.sessionFile ? resolveSessionFilePath(scope.sessionId, matchingSessionEntry, { agentId }) : resolveSessionTranscriptPath(scope.sessionId, agentId, threadId),
		sessionId: scope.sessionId,
		sessionKey
	};
}
function resolveSessionTranscriptRuntimeContext(scope) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const sessionStore = scope.storePath ? loadSessionStore(scope.storePath, { skipCache: true }) : void 0;
	const resolvedStoreEntry = sessionStore ? resolveSessionStoreEntry({
		store: sessionStore,
		sessionKey: scope.sessionKey
	}) : void 0;
	const sessionEntry = resolvedStoreEntry?.existing ?? loadSessionEntry(scope);
	return {
		agentId,
		sessionKey: resolvedStoreEntry?.normalizedKey ?? scope.sessionKey,
		sessionStore,
		sessionEntry
	};
}
/**
* Resolves the current file-backed target for read-only transcript callers.
* Unlike writer/runtime resolution, this does not persist missing sessionFile
* metadata; reader projections must not mutate session metadata.
*/
function resolveSessionTranscriptReadTarget(scope) {
	const explicitSessionFile = scope.sessionFile?.trim();
	if (explicitSessionFile) return {
		sessionFile: explicitSessionFile,
		sessionId: scope.sessionId,
		...scope.agentId ? { agentId: scope.agentId } : {},
		...scope.sessionKey ? { sessionKey: scope.sessionKey } : {}
	};
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const storePath = resolveConcreteReadStorePath(scope.storePath);
	const resolvedStoreEntry = scope.sessionEntry || !scope.sessionKey ? void 0 : storePath ? resolveSessionStoreEntry({
		store: loadSessionStore(storePath, { skipCache: true }),
		sessionKey: scope.sessionKey
	}) : void 0;
	const sessionEntry = scope.sessionEntry ?? resolvedStoreEntry?.existing ?? (scope.sessionKey ? loadSessionEntry({
		...scope,
		sessionKey: scope.sessionKey
	}) : void 0);
	const sessionKey = resolvedStoreEntry?.normalizedKey ?? scope.sessionKey;
	const matchingSessionEntry = sessionEntry?.sessionId === void 0 || sessionEntry.sessionId === scope.sessionId ? sessionEntry : void 0;
	const threadId = scope.threadId ?? (sessionKey ? parseSessionThreadInfo(sessionKey).threadId : void 0);
	return {
		agentId,
		sessionFile: matchingSessionEntry?.sessionFile ? resolveSessionFilePath(scope.sessionId, matchingSessionEntry, resolveSessionFilePathOptions({
			agentId,
			...storePath ? { storePath } : {}
		})) : storePath ? resolveSessionTranscriptPathInDir(scope.sessionId, path.dirname(path.resolve(storePath)), threadId) : resolveSessionTranscriptPath(scope.sessionId, agentId, threadId),
		sessionId: scope.sessionId,
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveConcreteReadStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function cleanupPreviousResetTranscripts(params) {
	const transcriptCandidates = /* @__PURE__ */ new Set();
	const resolved = resolveSessionFilePath(params.previousSessionId, params.previousEntry, resolveSessionFilePathOptions({
		agentId: params.agentId,
		storePath: params.storePath
	}));
	if (resolved) transcriptCandidates.add(resolved);
	transcriptCandidates.add(resolveSessionTranscriptPath(params.previousSessionId, params.agentId));
	for (const candidate of transcriptCandidates) try {
		fs.unlinkSync(candidate);
	} catch {}
}
async function archivePreviousSessionTranscript(params) {
	if (!params.previousEntry?.sessionId) return {};
	const { archiveSessionTranscriptsDetailed, resolveStableSessionEndTranscript } = await loadSessionArchiveRuntime();
	const archivedTranscripts = archiveSessionTranscriptsDetailed({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		sessionFile: params.previousEntry.sessionFile,
		agentId: params.agentId,
		reason: "reset",
		onArchiveError: params.onArchiveError
	});
	return resolveStableSessionEndTranscript({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		sessionFile: params.previousEntry.sessionFile,
		agentId: params.agentId,
		archivedTranscripts
	});
}
function resolveAccessStorePath(scope) {
	if (scope.storePath) return scope.storePath;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveStorePath(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
}
function projectTranscriptUpdateTarget(target) {
	if (!target.agentId || !target.sessionId || !target.sessionKey) return;
	return {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey
	};
}
async function resolveTranscriptAccess(scope) {
	if (scope.sessionFile?.trim()) {
		const scopeSessionKey = scope.sessionKey?.trim();
		const agentId = scopeSessionKey ? scope.agentId ?? resolveAgentIdFromSessionKey(scopeSessionKey) : void 0;
		return {
			sessionFile: scope.sessionFile,
			...agentId && scope.sessionId && scopeSessionKey ? { target: projectTranscriptUpdateTarget({
				agentId,
				sessionId: scope.sessionId,
				sessionKey: scopeSessionKey
			}) } : {}
		};
	}
	if (!scope.sessionId) throw new Error(`Cannot resolve transcript scope without a session id: ${scope.sessionKey}`);
	const scopeSessionKey = scope.sessionKey?.trim();
	if (!scopeSessionKey) throw new Error("Cannot resolve a transcript write scope without a session key or explicit session file");
	const target = await resolveSessionTranscriptRuntimeTarget({
		...scope,
		sessionId: scope.sessionId,
		sessionKey: scopeSessionKey
	});
	const updateTarget = projectTranscriptUpdateTarget(target);
	return {
		sessionFile: target.sessionFile,
		...updateTarget ? { target: updateTarget } : {}
	};
}
async function resolveTranscriptTurnTarget(scope) {
	if (scope.sessionFile?.trim()) return {
		...scope.agentId ? { agentId: scope.agentId } : {},
		sessionFile: scope.sessionFile,
		...scope.sessionId ? { sessionId: scope.sessionId } : {},
		...scope.sessionKey ? { sessionKey: scope.sessionKey } : {},
		sessionEntry: scope.sessionEntry
	};
	const sessionKey = scope.sessionKey?.trim();
	if (!sessionKey || !scope.sessionId) throw new Error("Cannot persist a transcript turn without a session key and session id or explicit session file");
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript turn without an agent id: ${sessionKey}`);
	const store = scope.sessionStore ?? (scope.storePath ? loadSessionStore(scope.storePath, { skipCache: true }) : void 0);
	const resolved = store ? resolveSessionStoreEntry({
		store,
		sessionKey
	}) : void 0;
	const resolvedFile = await resolveSessionTranscriptFile({
		agentId,
		sessionEntry: resolved?.existing ?? scope.sessionEntry ?? loadSessionEntry({
			...scope,
			sessionKey
		}),
		sessionId: scope.sessionId,
		sessionKey,
		...store ? { sessionStore: store } : {},
		...scope.storePath ? { storePath: scope.storePath } : {},
		...scope.threadId !== void 0 ? { threadId: scope.threadId } : {}
	});
	return {
		agentId,
		sessionFile: resolvedFile.sessionFile,
		sessionId: scope.sessionId,
		sessionKey: resolved?.normalizedKey ?? sessionKey,
		sessionEntry: resolvedFile.sessionEntry
	};
}
async function touchTranscriptTurnSessionEntry(params) {
	if (!params.shouldTouch || !params.scope.storePath || !params.target.sessionKey || !params.target.sessionId) return params.target.sessionEntry;
	const markerUpdatedAt = Date.now();
	const updated = await updateSessionEntry({
		sessionKey: params.target.sessionKey,
		storePath: params.scope.storePath
	}, (current) => current.sessionId === params.target.sessionId ? {
		sessionFile: params.target.sessionFile,
		updatedAt: Math.max(current.updatedAt ?? 0, markerUpdatedAt)
	} : null, { skipMaintenance: true });
	if (updated && params.scope.sessionStore) params.scope.sessionStore[params.target.sessionKey] = updated;
	return updated ?? params.target.sessionEntry;
}
async function publishTranscriptTurnUpdate(params) {
	if (params.updateMode === "none") return;
	const lastAppended = params.appendedMessages.findLast((message) => message.appended);
	if (params.publishWhen === "when-appended" && !lastAppended) return;
	emitSessionTranscriptUpdate({
		...params.target.sessionKey ? { sessionKey: params.target.sessionKey } : {},
		...params.target.agentId ? { agentId: params.target.agentId } : {},
		...params.updateMode === "inline" && lastAppended ? {
			message: lastAppended.message,
			messageId: lastAppended.messageId
		} : {},
		sessionFile: params.target.sessionFile
	});
}
//#endregion
export { resolveSessionTranscriptRuntimeReadTarget as A, streamSessionTranscriptLinesReverse as B, purgeDeletedAgentSessionEntries as C, resolveSessionAbortTarget as D, resetSessionEntryLifecycle as E, upsertSessionEntry as F, redactTranscriptMessage as G, isOpenClawDeliveryMirrorAssistantMessage as H, resolveSessionTranscriptFile as I, resolveAndPersistSessionFile as K, appendSessionTranscriptMessage as L, trimSessionTranscriptForManualCompact as M, updateResolvedSessionEntry as N, resolveSessionEntryAccessTarget as O, updateSessionEntry as P, runSessionTranscriptAppendTransaction as R, publishTranscriptUpdate as S, replaceSessionEntry as T, isTranscriptOnlyOpenClawAssistantMessage as U, readFileRangeAsync as V, isTranscriptOnlyOpenClawAssistantModel as W, patchSessionEntryWithKey as _, applySessionPatchProjection as a, persistSessionTranscriptTurn as b, cleanupSessionLifecycleArtifacts as c, deleteSessionEntryLifecycle as d, listSessionEntries as f, patchSessionEntry as g, markSessionAbortTarget as h, applySessionEntryLifecycleMutation as i, resolveSessionTranscriptRuntimeTarget as j, resolveSessionTranscriptReadTarget as k, commitReplySessionInitialization as l, loadSessionEntry as m, appendTranscriptMessage as n, canonicalizeSessionEntryAliases as o, loadReplySessionInitializationSnapshot as p, clearPluginOwnedSessionState as q, applyRestartRecoveryLifecycle as r, cleanupPluginHostSessionStore as s, appendTranscriptEvent as t, createSessionEntryWithTranscript as u, persistSessionResetLifecycle as v, readSessionUpdatedAt as w, preflightSessionTranscriptForManualCompact as x, persistSessionRolloverLifecycle as y, streamSessionTranscriptLines as z };
