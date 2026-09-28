import { i as normalizeCodexServiceTier, m as CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN } from "./config-utils-DujwEnhg.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { z } from "zod";
//#region extensions/codex/src/app-server/native-subagent-history-owner.ts
const nonBlankString = z.string().refine((value) => Boolean(value.trim()));
const codexNativeSubagentHistoryOwnerSchema = z.object({
	parentThreadId: nonBlankString,
	sessionId: nonBlankString,
	lifecycleRevision: nonBlankString.optional(),
	connectionFingerprint: z.string().regex(/^[a-f0-9]{64}$/u)
});
/** Automatic recovery may follow native rotation only within the same host lifecycle and connection. */
function matchesCodexNativeSubagentHistoryOwner(stored, current) {
	return stored.connectionFingerprint === current.connectionFingerprint && stored.lifecycleRevision === current.lifecycleRevision && (stored.lifecycleRevision !== void 0 || stored.sessionId === current.sessionId);
}
function codexNativeSubagentHistoryConnectionFingerprint(binding) {
	if (!binding.appServerRuntimeFingerprint) return;
	return createHash("sha256").update(JSON.stringify([
		binding.appServerRuntimeFingerprint,
		binding.connectionScope ?? null,
		binding.authProfileId ?? null
	])).digest("hex");
}
function createCodexNativeSubagentHistoryOwner(params) {
	const connectionFingerprint = codexNativeSubagentHistoryConnectionFingerprint(params.binding);
	return connectionFingerprint ? {
		parentThreadId: params.parentThreadId,
		sessionId: params.sessionId,
		...params.lifecycleRevision ? { lifecycleRevision: params.lifecycleRevision } : {},
		connectionFingerprint
	} : void 0;
}
function readCodexNativeSubagentHistoryOwner(detail) {
	const value = asOptionalRecord(detail)?.nativeHistory;
	if (value === void 0) return;
	const owner = codexNativeSubagentHistoryOwnerSchema.safeParse(value);
	if (!owner.success) throw new Error("Subagent history owner is invalid.");
	const { lifecycleRevision, ...required } = owner.data;
	return lifecycleRevision === void 0 ? required : {
		...required,
		lifecycleRevision
	};
}
function assertHistoryOwnerMatchesRegistration(saved, current, parentThreadId, requireSaved = false) {
	if (requireSaved && !saved) throw new Error("Subagent completion history owner is missing.");
	if (saved && (!current || saved.parentThreadId !== parentThreadId || saved.connectionFingerprint !== current.connectionFingerprint || saved.sessionId !== current.sessionId || saved.lifecycleRevision !== current.lifecycleRevision)) throw new Error("Subagent completion history owner is contradictory.");
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission.ts
const identifier = z.string().refine((value) => Boolean(value.trim()));
const submissionSchema = z.object({
	parentTurnId: identifier,
	callId: identifier,
	childThreadId: identifier,
	submissionId: identifier,
	predecessorRunId: identifier,
	predecessorNativeTurnId: identifier
}).strict();
const submissionsSchema = z.object({
	version: z.literal(1),
	owner: codexNativeSubagentHistoryOwnerSchema,
	receipts: z.array(submissionSchema)
}).strict().refine(({ receipts }) => new Set(receipts.map(({ parentTurnId, callId }) => JSON.stringify([parentTurnId, callId]))).size === receipts.length);
function matchesCodexNativeSubagentSubmissionOwner(stored, current) {
	return stored.parentThreadId === current.parentThreadId && matchesCodexNativeSubagentHistoryOwner(stored, current);
}
function readCodexNativeSubagentSubmissions(value) {
	if (value === void 0) return;
	const parsed = submissionsSchema.safeParse(value);
	if (!parsed.success) throw new Error("Invalid Codex native subagent submission metadata.");
	return parsed.data;
}
function mutateCodexNativeSubagentSubmissions(params) {
	const current = readCodexNativeSubagentSubmissions(params.current);
	const owner = codexNativeSubagentHistoryOwnerSchema.parse(params.owner);
	const receipt = submissionSchema.parse(params.receipt);
	if (current && !matchesCodexNativeSubagentSubmissionOwner(current.owner, owner)) return { applied: false };
	const receipts = current?.receipts ?? [];
	const existing = receipts.find((entry) => entry.parentTurnId === receipt.parentTurnId && entry.callId === receipt.callId);
	if (existing && !isDeepStrictEqual(existing, receipt)) return { applied: false };
	if (params.consume) {
		if (!current) return { applied: false };
		const remaining = receipts.filter((entry) => entry !== existing);
		return {
			applied: true,
			...remaining.length ? { next: {
				version: 1,
				owner: current.owner,
				receipts: remaining
			} } : {}
		};
	}
	return {
		applied: true,
		next: {
			version: 1,
			owner: current?.owner ?? owner,
			receipts: existing ? receipts : [...receipts, receipt]
		}
	};
}
/** Physical adoption cannot establish continuity for an unstamped receipt. */
function adoptCodexNativeSubagentSubmissions(value) {
	if (value === void 0) return;
	const parsed = submissionsSchema.safeParse(value);
	return !parsed.success || parsed.data.owner.lifecycleRevision ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/session-binding-record.ts
/** Canonical binding codec and synchronous generation-aware reads; no lifecycle or auth loading. */
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
const optionalStringSchema = z.string().optional().catch(void 0);
const optionalBooleanSchema = z.boolean().optional().catch(void 0);
const optionalNonBlankStringSchema = z.string().refine((value) => Boolean(value.trim())).optional().catch(void 0);
const optionalTimestampSchema = z.string().refine((value) => Number.isFinite(Date.parse(value))).optional().catch(void 0);
const pendingSupervisionBranchSchema = z.object({
	sourceThreadId: z.string().trim().min(1),
	connectionFingerprint: z.string().trim().min(1).optional(),
	lastTurnId: z.string().trim().min(1).optional(),
	cleanupThreadIds: z.array(z.string().trim().min(1)).max(2).optional()
}).strict().superRefine((pending, context) => {
	const cleanupThreadIds = pending.cleanupThreadIds ?? [];
	if (new Set(cleanupThreadIds).size !== cleanupThreadIds.length) context.addIssue({
		code: "custom",
		message: "pending supervision cleanup thread ids must be unique"
	});
	if (cleanupThreadIds.includes(pending.sourceThreadId)) context.addIssue({
		code: "custom",
		message: "pending supervision cleanup cannot target its source"
	});
});
const contextEngineProjectionSchema = z.object({
	schemaVersion: z.literal(1),
	mode: z.literal("thread_bootstrap"),
	epoch: z.string().refine((value) => Boolean(value.trim())),
	fingerprint: optionalStringSchema
}).strict();
const contextEngineSchema = z.object({
	schemaVersion: z.literal(1),
	engineId: z.string(),
	policyFingerprint: z.string(),
	projection: contextEngineProjectionSchema.optional().catch(void 0)
}).strict();
const destructiveApprovalModeSchema = z.enum([
	"allow",
	"deny",
	"auto",
	"ask"
]).optional().catch(void 0);
const accountAppPolicyEntrySchema = z.object({
	source: z.literal("account"),
	appName: z.string(),
	allowDestructiveActions: z.boolean(),
	allowOpenWorld: z.boolean().optional(),
	destructiveApprovalMode: destructiveApprovalModeSchema,
	mcpServerNames: z.array(z.string())
}).strict();
const pluginAppPolicyEntrySchema = z.object({
	source: z.literal("plugin").optional(),
	configKey: z.string(),
	marketplaceName: z.string().regex(CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN),
	pluginName: z.string(),
	allowDestructiveActions: z.boolean(),
	allowOpenWorld: z.boolean().optional(),
	destructiveApprovalMode: destructiveApprovalModeSchema,
	mcpServerNames: z.array(z.string())
}).strict();
const pluginAppPolicyContextSchema = z.object({
	fingerprint: z.string(),
	apps: z.record(z.string(), z.union([accountAppPolicyEntrySchema, pluginAppPolicyEntrySchema])),
	pluginAppIds: z.record(z.string(), z.array(z.string())).default({})
}).strict();
const threadBindingSchema = z.object({
	threadId: z.string().refine((value) => Boolean(value.trim())),
	clientId: optionalStringSchema,
	cwd: z.string(),
	rolloutPath: optionalNonBlankStringSchema,
	connectionScope: z.literal("supervision").optional(),
	supervisionSourceThreadId: z.string().trim().min(1).optional(),
	authProfileId: optionalStringSchema,
	agentWorkspaceDeveloperInstructions: optionalStringSchema,
	model: optionalStringSchema,
	preserveNativeModel: z.literal(true).optional().catch(void 0),
	pendingSupervisionBranch: pendingSupervisionBranchSchema.optional(),
	pendingResumeConfiguration: z.literal(true).optional(),
	modelProvider: z.string().transform((value) => value.trim()).pipe(z.string().min(1)).optional().catch(void 0),
	approvalPolicy: z.preprocess((value) => value === "on-failure" ? "on-request" : value, z.enum([
		"never",
		"on-request",
		"untrusted"
	]).optional()).catch(void 0),
	sandbox: z.enum([
		"read-only",
		"workspace-write",
		"danger-full-access"
	]).optional().catch(void 0),
	serviceTier: z.preprocess(normalizeCodexServiceTier, z.custom((value) => typeof value === "string").optional()).optional().catch(void 0),
	networkProxyProfileName: optionalStringSchema,
	networkProxyConfigFingerprint: optionalStringSchema,
	dynamicToolsFingerprint: optionalStringSchema,
	dynamicToolsContainDeferred: optionalBooleanSchema,
	webSearchThreadConfigFingerprint: optionalStringSchema,
	nativeSkillIsolationFingerprint: optionalStringSchema,
	userMcpServersFingerprint: optionalStringSchema,
	mcpServersFingerprint: optionalStringSchema,
	configuredMcpOwnershipVersion: z.literal(1).optional().catch(void 0),
	ringZeroConfigFingerprint: optionalStringSchema,
	ringZeroClientInstanceId: optionalStringSchema,
	/** Durable fact preventing a later unrestricted turn from widening this thread. */
	nativeToolPolicyRestricted: z.literal(true).optional().catch(void 0),
	nativeHookRelayGeneration: optionalNonBlankStringSchema,
	appServerRuntimeFingerprint: optionalStringSchema,
	pluginAppsFingerprint: optionalStringSchema,
	pluginAppsInputFingerprint: optionalStringSchema,
	pluginAppPolicyContext: pluginAppPolicyContextSchema.optional().catch(void 0),
	contextEngine: contextEngineSchema.optional().catch(void 0),
	environmentSelectionFingerprint: optionalStringSchema,
	conversationStartId: optionalStringSchema,
	conversationSourceTransferComplete: z.literal(true).optional().catch(void 0),
	historyCoveredThrough: optionalTimestampSchema,
	continuityCalibration: z.object({
		promptChars: z.number().int().positive(),
		inputTokens: z.number().int().positive()
	}).optional().catch(void 0)
}).superRefine((binding, context) => {
	if (binding.connectionScope === "supervision") {
		if (!binding.supervisionSourceThreadId) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires its native source thread id"
		});
		if (binding.preserveNativeModel !== true) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires native model ownership"
		});
		if (binding.conversationSourceTransferComplete !== true) context.addIssue({
			code: "custom",
			message: "supervision connection ownership requires a completed source transfer"
		});
		if (!binding.pendingSupervisionBranch && (!binding.model?.trim() || !binding.modelProvider)) context.addIssue({
			code: "custom",
			message: "materialized supervision bindings require a native model and provider"
		});
	}
	if (binding.supervisionSourceThreadId && binding.connectionScope !== "supervision") context.addIssue({
		code: "custom",
		message: "a supervision source thread id requires supervision connection ownership"
	});
	if (!binding.pendingSupervisionBranch) return;
	if (binding.threadId !== binding.pendingSupervisionBranch.sourceThreadId) context.addIssue({
		code: "custom",
		message: "pending supervision source must match the provisional thread binding"
	});
	if (binding.supervisionSourceThreadId !== binding.pendingSupervisionBranch.sourceThreadId) context.addIssue({
		code: "custom",
		message: "pending supervision source must match its durable source identity"
	});
	if (binding.preserveNativeModel !== true) context.addIssue({
		code: "custom",
		message: "pending supervision bindings must defer model selection to Codex App Server"
	});
	if (binding.connectionScope !== "supervision") context.addIssue({
		code: "custom",
		message: "pending supervision bindings require supervision connection ownership"
	});
});
const bindingLeaseSchema = z.object({
	token: z.string().refine((value) => Boolean(value.trim())),
	expiresAt: z.number().finite()
});
const storedSessionIdSchema = z.string().transform((value) => value.trim()).pipe(z.string().min(1)).optional().catch(void 0);
const storedBindingSchema = z.discriminatedUnion("state", [z.object({
	version: z.literal(1),
	state: z.literal("active"),
	binding: threadBindingSchema,
	sessionId: storedSessionIdSchema,
	lease: bindingLeaseSchema.optional().catch(void 0),
	nativeSubagentSubmissions: z.unknown().optional()
}), z.object({
	version: z.literal(1),
	state: z.literal("cleared"),
	sessionId: storedSessionIdSchema,
	lease: bindingLeaseSchema.optional().catch(void 0),
	retired: z.literal(true).optional().catch(void 0)
})]);
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
function readStoredCodexAppServerBinding(value) {
	const result = storedBindingSchema.safeParse(value);
	if (!result.success) return;
	return stripUndefinedValue(result.data);
}
function ownsStoredSessionGeneration(identity, current) {
	return identity.kind !== "session" || !current?.sessionId || current.sessionId === identity.sessionId;
}
function validateBindingForWrite(binding) {
	const validated = readCodexAppServerThreadBinding(binding);
	if (!validated) throw new Error("Invalid Codex app-server thread binding");
	return stripUndefinedBinding(validated);
}
/** Parses stored or shipped sidecar data into the current domain value. */
function readCodexAppServerThreadBinding(value) {
	const result = threadBindingSchema.safeParse(value);
	if (!result.success) return;
	return result.data;
}
function stripUndefinedBinding(binding) {
	return stripUndefinedValue(binding);
}
function stripUndefinedValue(value) {
	if (Array.isArray(value)) return value.map(stripUndefinedValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0).map(([key, entry]) => [key, stripUndefinedValue(entry)]));
}
function readCodexBindingTimestamp(value) {
	return optionalTimestampSchema.parse(value);
}
/** The same physical-generation check serves execution and read-only projections. */
function readCurrentCodexAppServerBinding(state, identity) {
	const key = bindingStoreKey(identity);
	return decodeCurrentCodexAppServerBinding(key, state.lookup(key), identity);
}
function decodeCurrentCodexAppServerBinding(key, raw, identity) {
	const stored = readStoredCodexAppServerBinding(raw);
	if (raw !== void 0 && !stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
	return stored?.state === "active" && ownsStoredSessionGeneration(identity, stored) ? stored.binding : void 0;
}
/** Consume synchronously so each list phase acquires fresh binding authority. */
function* readCurrentCodexAppServerBindings(state, identities) {
	let keys;
	if (state.lookupMany && identities.length > 1 && identities.length <= 1e4) try {
		keys = identities.map(bindingStoreKey);
	} catch {}
	if (!keys || !state.lookupMany) {
		for (const identity of identities) yield readCurrentCodexAppServerBinding(state, identity);
		return;
	}
	const values = state.lookupMany(keys);
	for (let index = 0; index < identities.length; index++) {
		const value = values[index];
		if (!value.ok) throw value.error;
		yield decodeCurrentCodexAppServerBinding(keys[index], value.value, identities[index]);
	}
}
function matchesCodexNativeSubagentSubmissionBinding(binding, owner) {
	return binding.threadId === owner.parentThreadId && !binding.pendingSupervisionBranch && codexNativeSubagentHistoryConnectionFingerprint(binding) === owner.connectionFingerprint;
}
/** Unknown metadata stays opaque through ordinary binding writes. */
function preserveCodexNativeSubagentSubmissions(currentBinding, nextBinding, value) {
	return currentBinding.threadId === nextBinding.threadId && codexNativeSubagentHistoryConnectionFingerprint(currentBinding) === codexNativeSubagentHistoryConnectionFingerprint(nextBinding) && isDeepStrictEqual(currentBinding.pendingSupervisionBranch, nextBinding.pendingSupervisionBranch) ? value : void 0;
}
function readCurrentCodexNativeSubagentSubmissions(state, identity, owner) {
	const key = bindingStoreKey(identity);
	const raw = state.lookup(key);
	const stored = readStoredCodexAppServerBinding(raw);
	if (raw !== void 0 && !stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
	if (stored?.state !== "active" || !ownsStoredSessionGeneration(identity, stored) || identity.kind === "session" && owner.sessionId !== identity.sessionId || !matchesCodexNativeSubagentSubmissionBinding(stored.binding, owner)) return [];
	const submissions = readCodexNativeSubagentSubmissions(stored.nativeSubagentSubmissions);
	return submissions && matchesCodexNativeSubagentSubmissionOwner(submissions.owner, owner) ? submissions.receipts : [];
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
function readPluginAppPolicyContext(value, bindingSchemaVersion) {
	const record = asOptionalRecord(value);
	if (!record || typeof record.fingerprint !== "string") return;
	const apps = asOptionalRecord(record.apps);
	if (!apps) return;
	const parsedApps = {};
	for (const [appId, rawEntry] of Object.entries(apps)) {
		const entry = asOptionalRecord(rawEntry);
		if (!entry) return;
		const destructiveApprovalMode = readDestructiveApprovalMode(entry.destructiveApprovalMode, bindingSchemaVersion);
		const mcpServerNames = Array.isArray(entry.mcpServerNames) && entry.mcpServerNames.every((serverName) => typeof serverName === "string") ? entry.mcpServerNames : void 0;
		if (entry.source === "account") {
			if ("appId" in entry || typeof entry.appName !== "string" || typeof entry.allowDestructiveActions !== "boolean" || entry.allowOpenWorld !== void 0 && typeof entry.allowOpenWorld !== "boolean" || destructiveApprovalMode === "invalid" || !mcpServerNames) return;
			parsedApps[appId] = {
				source: "account",
				appName: entry.appName,
				allowDestructiveActions: entry.allowDestructiveActions,
				...typeof entry.allowOpenWorld === "boolean" ? { allowOpenWorld: entry.allowOpenWorld } : {},
				...destructiveApprovalMode ? { destructiveApprovalMode } : {},
				mcpServerNames
			};
			continue;
		}
		if ("appId" in entry || entry.source !== void 0 && entry.source !== "plugin" || typeof entry.configKey !== "string" || typeof entry.marketplaceName !== "string" || !CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN.test(entry.marketplaceName) || typeof entry.pluginName !== "string" || typeof entry.allowDestructiveActions !== "boolean" || entry.allowOpenWorld !== void 0 && typeof entry.allowOpenWorld !== "boolean" || destructiveApprovalMode === "invalid" || !mcpServerNames) return;
		parsedApps[appId] = {
			configKey: entry.configKey,
			marketplaceName: entry.marketplaceName,
			pluginName: entry.pluginName,
			allowDestructiveActions: entry.allowDestructiveActions,
			...typeof entry.allowOpenWorld === "boolean" ? { allowOpenWorld: entry.allowOpenWorld } : {},
			...destructiveApprovalMode ? { destructiveApprovalMode } : {},
			mcpServerNames
		};
	}
	const parsedPluginAppIds = {};
	if (record.pluginAppIds !== void 0 && (!record.pluginAppIds || typeof record.pluginAppIds !== "object" || Array.isArray(record.pluginAppIds))) return;
	if (record.pluginAppIds && typeof record.pluginAppIds === "object") for (const [configKey, appIds] of Object.entries(record.pluginAppIds)) {
		if (!Array.isArray(appIds) || appIds.some((appId) => typeof appId !== "string")) return;
		parsedPluginAppIds[configKey] = appIds;
	}
	return {
		fingerprint: record.fingerprint,
		apps: parsedApps,
		pluginAppIds: parsedPluginAppIds
	};
}
function readDestructiveApprovalMode(value, bindingSchemaVersion) {
	if (value === void 0) return;
	if (value === "allow" || value === "deny") return value;
	if (value === "auto") return bindingSchemaVersion === 1 ? "allow" : "auto";
	if (value === "ask" && bindingSchemaVersion === 2) return "ask";
	if (value === "on-request" && bindingSchemaVersion === 1) return "auto";
	return "invalid";
}
//#endregion
export { readCodexNativeSubagentHistoryOwner as C, matchesCodexNativeSubagentHistoryOwner as S, adoptCodexNativeSubagentSubmissions as _, ownsStoredSessionGeneration as a, codexNativeSubagentHistoryConnectionFingerprint as b, readCodexBindingTimestamp as c, readCurrentCodexNativeSubagentSubmissions as d, readPluginAppPolicyContext as f, validateBindingForWrite as g, stripUndefinedBinding as h, matchesCodexNativeSubagentSubmissionBinding as i, readCurrentCodexAppServerBinding as l, sessionBindingIdentity as m, assertCodexBindingMayBeReplaced as n, preserveCodexNativeSubagentSubmissions as o, readStoredCodexAppServerBinding as p, bindingStoreKey as r, readCodexAppServerThreadBinding as s, CodexSupervisionBindingReplacementError as t, readCurrentCodexAppServerBindings as u, mutateCodexNativeSubagentSubmissions as v, createCodexNativeSubagentHistoryOwner as x, assertHistoryOwnerMatchesRegistration as y };
