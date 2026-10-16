import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import crypto from "node:crypto";
function isTerminalSessionStatus(status) {
	return status === "done" || status === "failed" || status === "interrupted" || status === "killed" || status === "timeout";
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
	const modelProvider = normalizedModel ? normalizedProvider : void 0;
	if (entry.model === normalizedModel && entry.modelProvider === modelProvider) return entry;
	const next = { ...entry };
	if (normalizedModel) next.model = normalizedModel;
	else delete next.model;
	if (modelProvider) next.modelProvider = modelProvider;
	else if (!normalizedModel || entry.modelProvider !== void 0) delete next.modelProvider;
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
function resolveMergedUpdatedAt(existing, patch, preserveActivity) {
	const now = Date.now();
	const existingUpdatedAt = normalizeMergedUpdatedAt(existing?.updatedAt, now);
	const patchUpdatedAt = normalizeMergedUpdatedAt(patch.updatedAt, now);
	if (preserveActivity && existing) return existingUpdatedAt ?? patchUpdatedAt ?? now;
	return Math.max(existingUpdatedAt ?? 0, patchUpdatedAt ?? 0, now);
}
function normalizeMergedUpdatedAt(value, now) {
	const normalized = asNonNegativeFiniteNumber(value);
	return normalized === void 0 ? void 0 : Math.min(normalized, now);
}
function mergeSessionEntryWithPolicy(existing, patch, preserveActivity = false) {
	const sessionId = patch.sessionId ?? existing?.sessionId ?? crypto.randomUUID();
	const updatedAt = resolveMergedUpdatedAt(existing, patch, preserveActivity);
	if (!existing) return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields({
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? updatedAt
	}));
	const next = {
		...existing,
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? (existing.sessionId === sessionId ? existing.sessionStartedAt : updatedAt)
	};
	if (existing.createdVia !== void 0) next.createdVia = existing.createdVia;
	if (existing.createdActor !== void 0) next.createdActor = existing.createdActor;
	next.inheritedGitContributorProfileIds = existing.inheritedGitContributorProfileIds;
	if (existing.sandbox === "required") next.sandbox = existing.sandbox;
	else delete next.sandbox;
	if (existing.createdAt !== void 0) next.createdAt = existing.createdAt;
	if (existing.conversationLink !== void 0) next.conversationLink = existing.conversationLink;
	if (existing.projectId !== void 0) next.projectId = existing.projectId;
	if (existing.repositoryWorkspaceId !== void 0) next.repositoryWorkspaceId = existing.repositoryWorkspaceId;
	if (existing.forkSource !== void 0) next.forkSource = existing.forkSource;
	if (Object.hasOwn(patch, "model") && !Object.hasOwn(patch, "modelProvider")) {
		const patchedModel = normalizeOptionalString(patch.model);
		const existingModel = normalizeOptionalString(existing.model);
		if (patchedModel && patchedModel !== existingModel) delete next.modelProvider;
	}
	return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields(next));
}
function stripRetiredSessionEntryLocators(entry) {
	const mutable = entry;
	delete mutable.sessionFile;
	delete mutable.transcriptPath;
	return entry;
}
function mergeSessionEntry(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch);
}
function mergeSessionEntryPreserveActivity(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch, true);
}
function resolveSessionTotalTokens(entry) {
	return asNonNegativeFiniteNumber(entry?.totalTokens);
}
function resolveFreshSessionTotalTokens(entry) {
	const total = resolveSessionTotalTokens(entry);
	if (total === void 0) return;
	if (entry?.totalTokensFresh !== true || entry.totalTokensVersion !== 1) return;
	return total;
}
const DEFAULT_RESET_TRIGGERS = ["/new", "/reset"];
//#endregion
export { normalizeSessionRuntimeModelFields as a, resolveSessionPluginTraceLines as c, mergeSessionEntryPreserveActivity as i, resolveSessionTotalTokens as l, isTerminalSessionStatus as n, resolveFreshSessionTotalTokens as o, mergeSessionEntry as r, resolveSessionPluginStatusLines as s, DEFAULT_RESET_TRIGGERS as t, setSessionRuntimeModel as u };
