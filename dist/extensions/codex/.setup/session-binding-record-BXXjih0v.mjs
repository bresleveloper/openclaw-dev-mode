import { c as readCodexNativeSubagentSubmissions, g as codexNativeSubagentHistoryConnectionFingerprint, i as readNativePendingAssignments, o as matchesCodexNativeSubagentSubmissionOwner, t as matchesNativeAssignmentLifecycle } from "./native-subagent-pending-assignments-CX-LtYDX.mjs";
import { a as readStoredCodexAppServerBinding, t as legacyAppPolicyEntrySchema } from "./session-binding-record-codec-0m3ftJ1e.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
//#region extensions/codex/src/app-server/session-binding-record.ts
/** Generation-aware binding reads and ownership checks over the canonical persisted codec. */
var session_binding_record_exports = /* @__PURE__ */ __exportAll({
	CodexSupervisionBindingReplacementError: () => CodexSupervisionBindingReplacementError,
	assertCodexBindingMayBeReplaced: () => assertCodexBindingMayBeReplaced,
	bindingStoreKey: () => bindingStoreKey,
	matchesCodexNativeSubagentSubmissionBinding: () => matchesCodexNativeSubagentSubmissionBinding,
	ownsStoredSessionGeneration: () => ownsStoredSessionGeneration,
	preserveCodexNativeSubagentSubmissions: () => preserveCodexNativeSubagentSubmissions,
	preserveNativePendingAssignments: () => preserveNativePendingAssignments,
	preserveNativeTaskImport: () => preserveNativeTaskImport,
	preservedSessionGeneration: () => preservedSessionGeneration,
	readCurrentCodexAppServerBinding: () => readCurrentCodexAppServerBinding,
	readCurrentCodexAppServerBindingAsync: () => readCurrentCodexAppServerBindingAsync,
	readCurrentCodexAppServerBindings: () => readCurrentCodexAppServerBindings,
	readCurrentCodexNativeSubagentSubmissions: () => readCurrentCodexNativeSubagentSubmissions,
	readCurrentNativePendingAssignments: () => readCurrentNativePendingAssignments,
	readPluginAppPolicyContext: () => readPluginAppPolicyContext,
	readStoredCodexAppServerBinding: () => readStoredCodexAppServerBinding,
	sessionBindingIdentity: () => sessionBindingIdentity,
	storedSessionGeneration: () => storedSessionGeneration
});
/** Resolves the same agent scope OpenClaw uses for transcript/session ownership. */
function sessionBindingIdentity(params) {
	const { sessionAgentId } = resolveSessionAgentIdsStrict(params);
	const sessionKey = params.sessionKey?.trim();
	return {
		kind: "session",
		agentId: sessionAgentId,
		sessionId: params.sessionId,
		...sessionKey ? { sessionKey } : {}
	};
}
/** Stable plugin-state key for one current binding owner. */
function bindingStoreKey(identity) {
	if (identity.kind === "session") {
		const rawAgentId = identity.agentId.trim();
		const sessionId = identity.sessionId.trim();
		if (!rawAgentId) throw new Error("Codex app-server binding requires an agent id");
		if (!sessionId) throw new Error("Codex app-server binding requires a session id");
		const agentId = resolveSessionAgentIdsStrict({ agentId: rawAgentId }).sessionAgentId;
		const sessionKey = identity.sessionKey?.trim();
		if (sessionKey) return `session-key:${agentId}:${createHash("sha256").update(sessionKey).digest("base64url")}`;
		return `session:${agentId}:${sessionId}`;
	}
	const bindingId = identity.bindingId.trim();
	if (!bindingId) throw new Error("Codex app-server conversation binding requires a binding id");
	return `conversation:${bindingId}`;
}
function ownsStoredSessionGeneration(identity, current) {
	return identity.kind !== "session" || !current?.sessionId || current.sessionId === identity.sessionId;
}
/** Final effect guards retain the live row until raw SDK binding writers retire. */
function readCurrentCodexAppServerBinding(state, identity) {
	const key = bindingStoreKey(identity);
	return decodeCurrentCodexAppServerBinding(key, state.lookup(key), identity);
}
async function readCurrentCodexAppServerBindingAsync(state, identity) {
	const key = bindingStoreKey(identity);
	return decodeCurrentCodexAppServerBinding(key, await state.lookup(key), identity);
}
function decodeCurrentCodexAppServerBinding(key, raw, identity) {
	const stored = readStoredCodexAppServerBinding(raw);
	if (raw !== void 0 && !stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
	return stored?.state === "active" && ownsStoredSessionGeneration(identity, stored) ? stored.binding : void 0;
}
/** Acquire fresh rows off-thread; decode lazily to preserve caller failure ordering. */
async function* readCurrentCodexAppServerBindings(state, identities) {
	const lookupMany = state.lookupMany?.bind(state);
	for (let offset = 0; offset < identities.length; offset += 1e4) {
		const batch = identities.slice(offset, offset + 1e4);
		let keys;
		if (lookupMany) try {
			keys = batch.map(bindingStoreKey);
		} catch {}
		if (!keys || !lookupMany) {
			for (const identity of batch) {
				const key = bindingStoreKey(identity);
				yield decodeCurrentCodexAppServerBinding(key, await state.lookup(key), identity);
			}
			continue;
		}
		const values = await lookupMany(keys);
		for (let index = 0; index < batch.length; index++) {
			const value = values[index];
			if (!value.ok) throw value.error;
			yield decodeCurrentCodexAppServerBinding(keys[index], value.value, batch[index]);
		}
	}
}
function matchesCodexNativeSubagentSubmissionBinding(binding, owner) {
	return binding.threadId === owner.parentThreadId && !binding.pendingSupervisionBranch && codexNativeSubagentHistoryConnectionFingerprint(binding) === owner.connectionFingerprint;
}
/** Unknown metadata stays opaque through ordinary binding writes. */
function preserveCodexNativeSubagentSubmissions(currentBinding, nextBinding, value) {
	return currentBinding.threadId === nextBinding.threadId ? preserveNativePendingAssignments(currentBinding, nextBinding, value) : void 0;
}
async function readCurrentCodexNativeSubagentSubmissions(state, identity, owner) {
	const stored = await readCurrentNativeSubagentBinding(state, identity, owner);
	if (!stored) return [];
	const submissions = readCodexNativeSubagentSubmissions(stored.nativeSubagentSubmissions);
	return submissions && matchesCodexNativeSubagentSubmissionOwner(submissions.owner, owner) ? submissions.receipts : [];
}
async function readCurrentNativePendingAssignments(state, identity, owner) {
	const stored = await readCurrentNativeSubagentBinding(state, identity, owner);
	return (readNativePendingAssignments(stored?.nativeSubagentAssignments)?.assignments ?? []).filter((entry) => matchesNativeAssignmentLifecycle(entry.owner, owner));
}
async function readCurrentNativeSubagentBinding(state, identity, owner) {
	const key = bindingStoreKey(identity);
	const raw = await state.lookup(key);
	const stored = readStoredCodexAppServerBinding(raw);
	if (raw !== void 0 && !stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
	if (stored?.state !== "active" || !ownsStoredSessionGeneration(identity, stored) || identity.kind === "session" && owner.sessionId !== identity.sessionId || !matchesCodexNativeSubagentSubmissionBinding(stored.binding, owner)) return;
	return stored;
}
function preserveNativeTaskImport(current) {
	return current?.nativeSubagentTaskImport !== void 0 ? { nativeSubagentTaskImport: current.nativeSubagentTaskImport } : {};
}
/** Preserve inventory through native rotation, never across a connection-policy change. */
function preserveNativePendingAssignments(current, next, value) {
	return codexNativeSubagentHistoryConnectionFingerprint(current) === codexNativeSubagentHistoryConnectionFingerprint(next) && isDeepStrictEqual(current.pendingSupervisionBranch, next.pendingSupervisionBranch) ? value : void 0;
}
var CodexSupervisionBindingReplacementError = class extends Error {
	constructor(threadId, operation) {
		super(`Refusing to replace supervised Codex thread ${threadId} while ${operation}; its native user-home connection and model ownership must be preserved`);
		this.name = "CodexSupervisionBindingReplacementError";
	}
};
function assertCodexBindingMayBeReplaced(binding, operation, expected) {
	if (expected) throw new AgentHarnessPreflightError(`Codex native model ownership prevents ${operation}. Continue or compact the original session in its native runtime, or create a new chat with a concrete model; the original binding was preserved.`);
	if (binding?.connectionScope === "supervision") throw new CodexSupervisionBindingReplacementError(binding.threadId, operation);
}
function readPluginAppPolicyContext(value) {
	const record = asOptionalRecord(value);
	if (!record || typeof record.fingerprint !== "string") return;
	const apps = asOptionalRecord(record.apps);
	if (!apps) return;
	const parsedApps = {};
	for (const [appId, rawEntry] of Object.entries(apps)) {
		const entry = asOptionalRecord(rawEntry);
		if (!entry || "appId" in entry) return;
		const parsed = legacyAppPolicyEntrySchema.safeParse(entry);
		if (!parsed.success) return;
		const validated = parsed.data;
		const { destructiveApprovalMode } = validated;
		const policy = {
			allowDestructiveActions: validated.allowDestructiveActions,
			...validated.allowOpenWorld !== void 0 ? { allowOpenWorld: validated.allowOpenWorld } : {},
			...destructiveApprovalMode ? { destructiveApprovalMode } : {},
			mcpServerNames: validated.mcpServerNames
		};
		if (validated.source === "account") parsedApps[appId] = {
			source: "account",
			appName: validated.appName,
			...policy
		};
		else parsedApps[appId] = {
			configKey: validated.configKey,
			marketplaceName: validated.marketplaceName,
			pluginName: validated.pluginName,
			...policy
		};
	}
	const parsedPluginAppIds = {};
	const pluginAppIds = record.pluginAppIds === void 0 ? {} : asOptionalRecord(record.pluginAppIds);
	if (!pluginAppIds) return;
	for (const [configKey, appIds] of Object.entries(pluginAppIds)) {
		if (!Array.isArray(appIds) || appIds.some((appId) => typeof appId !== "string")) return;
		parsedPluginAppIds[configKey] = appIds;
	}
	return {
		fingerprint: record.fingerprint,
		apps: parsedApps,
		pluginAppIds: parsedPluginAppIds
	};
}
function storedSessionGeneration(identity, current) {
	if (identity.kind === "session") return { sessionId: identity.sessionId };
	return current?.sessionId ? { sessionId: current.sessionId } : {};
}
function preservedSessionGeneration(identity, current) {
	if (current?.sessionId) return { sessionId: current.sessionId };
	return storedSessionGeneration(identity, current);
}
//#endregion
export { session_binding_record_exports as _, ownsStoredSessionGeneration as a, preserveNativeTaskImport as c, readCurrentCodexAppServerBindingAsync as d, readCurrentCodexAppServerBindings as f, sessionBindingIdentity as g, readPluginAppPolicyContext as h, matchesCodexNativeSubagentSubmissionBinding as i, preservedSessionGeneration as l, readCurrentNativePendingAssignments as m, assertCodexBindingMayBeReplaced as n, preserveCodexNativeSubagentSubmissions as o, readCurrentCodexNativeSubagentSubmissions as p, bindingStoreKey as r, preserveNativePendingAssignments as s, CodexSupervisionBindingReplacementError as t, readCurrentCodexAppServerBinding as u, storedSessionGeneration as v };
