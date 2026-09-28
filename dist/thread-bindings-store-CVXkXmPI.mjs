import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/thread-bindings-store.ts
const TELEGRAM_THREAD_BINDINGS_NAMESPACE = "telegram.thread-bindings";
const TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES = 5e3;
const TELEGRAM_THREAD_BINDINGS_STORE_VERSION = 1;
function resolveStoredBindingKey(params) {
	return createHash("sha256").update(`${params.accountId}\0${params.conversationId}`, "utf8").digest("hex").slice(0, 32);
}
function resolveTelegramThreadBindingsPath(accountId, env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	return path.join(stateDir, "telegram", `thread-bindings-${accountId}.json`);
}
function normalizeMetadataForStore(metadata) {
	if (!metadata) return;
	const serialized = JSON.stringify(metadata);
	if (!serialized) return;
	const parsed = JSON.parse(serialized);
	return Object.keys(parsed).length > 0 ? parsed : void 0;
}
function sanitizeStoredBinding(accountId, entry) {
	const conversationId = normalizeOptionalString(entry?.conversationId);
	const targetSessionKey = normalizeOptionalString(entry?.targetSessionKey) ?? "";
	const targetKind = entry?.targetKind === "subagent" ? "subagent" : "acp";
	if (!conversationId || !targetSessionKey) return null;
	const boundAt = typeof entry?.boundAt === "number" && Number.isFinite(entry.boundAt) ? Math.floor(entry.boundAt) : Date.now();
	const record = {
		accountId,
		conversationId,
		targetSessionKey,
		targetKind,
		boundAt,
		lastActivityAt: typeof entry?.lastActivityAt === "number" && Number.isFinite(entry.lastActivityAt) ? Math.floor(entry.lastActivityAt) : boundAt
	};
	if (typeof entry?.idleTimeoutMs === "number" && Number.isFinite(entry.idleTimeoutMs)) record.idleTimeoutMs = Math.max(0, Math.floor(entry.idleTimeoutMs));
	if (typeof entry?.maxAgeMs === "number" && Number.isFinite(entry.maxAgeMs)) record.maxAgeMs = Math.max(0, Math.floor(entry.maxAgeMs));
	if (typeof entry?.agentId === "string" && entry.agentId.trim()) record.agentId = entry.agentId.trim();
	if (typeof entry?.label === "string" && entry.label.trim()) record.label = entry.label.trim();
	if (typeof entry?.boundBy === "string" && entry.boundBy.trim()) record.boundBy = entry.boundBy.trim();
	const metadata = normalizeMetadataForStore(entry?.metadata && typeof entry.metadata === "object" ? { ...entry.metadata } : void 0);
	if (metadata) record.metadata = metadata;
	return record;
}
function readLegacyBindingsFile(filePath, accountId) {
	try {
		const raw = fs.readFileSync(filePath, "utf-8");
		const parsed = JSON.parse(raw);
		if (parsed?.version !== TELEGRAM_THREAD_BINDINGS_STORE_VERSION || !Array.isArray(parsed.bindings)) return [];
		const bindings = [];
		for (const entry of parsed.bindings) {
			const record = sanitizeStoredBinding(accountId, entry);
			if (record) bindings.push(record);
		}
		return bindings;
	} catch (err) {
		if (err.code !== "ENOENT") logVerbose(`telegram thread bindings load failed (${accountId}): ${String(err)}`);
		return [];
	}
}
function listTelegramLegacyThreadBindingEntries(params) {
	return readLegacyBindingsFile(params.persistedPath ?? resolveTelegramThreadBindingsPath(params.accountId), params.accountId).map((value) => ({
		key: resolveStoredBindingKey(value),
		value
	}));
}
//#endregion
export { resolveTelegramThreadBindingsPath as a, resolveStoredBindingKey as i, TELEGRAM_THREAD_BINDINGS_NAMESPACE as n, sanitizeStoredBinding as o, listTelegramLegacyThreadBindingEntries as r, TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES as t };
