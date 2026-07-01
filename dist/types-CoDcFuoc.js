import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/config/sessions/session-file-rotation.ts
/** Rewrites transcript file paths when a session id changes during reset or fork. */
function rewriteSessionFileForNewSessionId(params) {
	const trimmed = normalizeOptionalString(params.sessionFile);
	if (!trimmed) return;
	const base = path.basename(trimmed);
	if (!base.endsWith(".jsonl")) return;
	const withoutExt = base.slice(0, -6);
	if (withoutExt === params.previousSessionId) return path.join(path.dirname(trimmed), `${params.nextSessionId}.jsonl`);
	if (withoutExt.startsWith(`${params.previousSessionId}-topic-`)) return path.join(path.dirname(trimmed), `${params.nextSessionId}${base.slice(params.previousSessionId.length)}`);
	const forkMatch = withoutExt.match(/^(\d{4}-\d{2}-\d{2}T[\w-]+(?:Z|[+-]\d{2}(?:-\d{2})?)?)_(.+)$/);
	if (forkMatch?.[2] === params.previousSessionId) return path.join(path.dirname(trimmed), `${forkMatch[1]}_${params.nextSessionId}.jsonl`);
}
function canonicalizeAbsoluteSessionFilePath(filePath) {
	const resolved = path.resolve(filePath);
	const missingSegments = [];
	let cursor = resolved;
	while (true) try {
		return path.join(fs.realpathSync(cursor), ...missingSegments.toReversed());
	} catch {
		const parent = path.dirname(cursor);
		if (parent === cursor) return resolved;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
//#endregion
//#region src/config/sessions/types.ts
function isTerminalSessionStatus(status) {
	return status === "done" || status === "failed" || status === "killed" || status === "timeout";
}
function isSessionPluginTraceLine(line) {
	const trimmed = line.trim();
	return trimmed.startsWith("🔎 ") || /(?:^|\s)(?:Debug|Trace):/.test(trimmed);
}
function resolveSessionPluginLines(entry, includeLine) {
	return Array.isArray(entry?.pluginDebugEntries) ? entry.pluginDebugEntries.flatMap((pluginEntry) => Array.isArray(pluginEntry?.lines) ? pluginEntry.lines.filter((line) => typeof line === "string" && line.trim().length > 0 && includeLine(line)) : []) : [];
}
function resolveSessionPluginStatusLines(entry) {
	return resolveSessionPluginLines(entry, (line) => !isSessionPluginTraceLine(line));
}
function resolveSessionPluginTraceLines(entry) {
	return resolveSessionPluginLines(entry, isSessionPluginTraceLine);
}
function normalizeSessionRuntimeModelFields(entry) {
	const normalizedModel = normalizeOptionalString(entry.model);
	const normalizedProvider = normalizeOptionalString(entry.modelProvider);
	let next = entry;
	if (!normalizedModel) {
		if (entry.model !== void 0 || entry.modelProvider !== void 0) {
			next = { ...next };
			delete next.model;
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.model !== normalizedModel) {
		if (next === entry) next = { ...next };
		next.model = normalizedModel;
	}
	if (!normalizedProvider) {
		if (entry.modelProvider !== void 0) {
			if (next === entry) next = { ...next };
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.modelProvider !== normalizedProvider) {
		if (next === entry) next = { ...next };
		next.modelProvider = normalizedProvider;
	}
	return next;
}
function setSessionRuntimeModel(entry, runtime) {
	const provider = runtime.provider.trim();
	const model = runtime.model.trim();
	if (!provider || !model) return false;
	entry.modelProvider = provider;
	entry.model = model;
	return true;
}
function resolveMergedUpdatedAt(existing, patch, options) {
	const now = options?.now ?? Date.now();
	const existingUpdatedAt = normalizeMergedUpdatedAt(existing?.updatedAt, now);
	const patchUpdatedAt = normalizeMergedUpdatedAt(patch.updatedAt, now);
	if (options?.policy === "preserve-activity" && existing) return existingUpdatedAt ?? patchUpdatedAt ?? now;
	return Math.max(existingUpdatedAt ?? 0, patchUpdatedAt ?? 0, now);
}
function normalizeMergedUpdatedAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.min(value, now);
}
function mergeSessionEntryWithPolicy(existing, patch, options) {
	const sessionId = patch.sessionId ?? existing?.sessionId ?? crypto.randomUUID();
	const updatedAt = resolveMergedUpdatedAt(existing, patch, options);
	if (!existing) return normalizeSessionRuntimeModelFields({
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? updatedAt
	});
	const next = {
		...existing,
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? (existing.sessionId === sessionId ? existing.sessionStartedAt : updatedAt)
	};
	if (existing.sessionId !== sessionId) {
		const rewrittenSessionFile = rewriteSessionFileForNewSessionId({
			sessionFile: Object.hasOwn(patch, "sessionFile") ? patch.sessionFile : existing.sessionFile,
			previousSessionId: existing.sessionId,
			nextSessionId: sessionId
		});
		if (rewrittenSessionFile) next.sessionFile = rewrittenSessionFile;
	}
	if (Object.hasOwn(patch, "model") && !Object.hasOwn(patch, "modelProvider")) {
		const patchedModel = normalizeOptionalString(patch.model);
		const existingModel = normalizeOptionalString(existing.model);
		if (patchedModel && patchedModel !== existingModel) delete next.modelProvider;
	}
	return normalizeSessionRuntimeModelFields(next);
}
function mergeSessionEntry(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch);
}
function mergeSessionEntryPreserveActivity(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch, { policy: "preserve-activity" });
}
function resolveSessionTotalTokens(entry) {
	const total = entry?.totalTokens;
	if (typeof total !== "number" || !Number.isFinite(total) || total < 0) return;
	return total;
}
function resolveFreshSessionTotalTokens(entry) {
	const total = resolveSessionTotalTokens(entry);
	if (total === void 0) return;
	if (entry?.totalTokensFresh === false) return;
	return total;
}
const DEFAULT_RESET_TRIGGERS = ["/new", "/reset"];
//#endregion
export { mergeSessionEntryWithPolicy as a, resolveSessionPluginStatusLines as c, setSessionRuntimeModel as d, canonicalizeAbsoluteSessionFilePath as f, mergeSessionEntryPreserveActivity as i, resolveSessionPluginTraceLines as l, isTerminalSessionStatus as n, normalizeSessionRuntimeModelFields as o, rewriteSessionFileForNewSessionId as p, mergeSessionEntry as r, resolveFreshSessionTotalTokens as s, DEFAULT_RESET_TRIGGERS as t, resolveSessionTotalTokens as u };
