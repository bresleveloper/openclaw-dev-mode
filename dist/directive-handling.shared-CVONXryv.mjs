import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { i as findPersistedAuthProfileCredential } from "./store-SwwRUDrm.mjs";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-sYn17idc.mjs";
import { n as assertOperatorModelAllowed } from "./admitted-run-context-QJnFIxUZ.mjs";
import { r as resolveOperatorModelDefault } from "./operator-model-policy-q5o4hsUa.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Dq4ZIwNP.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, o as sessionSnapshotChangesApplied, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import "./model-selection-DSmx0k7F.mjs";
import { t as resolveModelDirectiveSelection } from "./model-selection-directive-DB33mIzF.mjs";
import { n as applyVerboseOverride, t as applyTraceOverride } from "./level-overrides-DxgdA38D.mjs";
import { t as persistReplySessionEntry } from "./session-entry-persistence-OVMLx9nw.mjs";
//#region src/auto-reply/reply/directive-handling.arguments.ts
function resolveInvalidExecDirectiveMessage(directives) {
	return directives.invalidExecHost ? `Unrecognized exec host "${directives.rawExecHost ?? ""}". Valid hosts: auto, sandbox, gateway, node.` : directives.invalidExecSecurity ? `Unrecognized exec security "${directives.rawExecSecurity ?? ""}". Valid: deny, allowlist, full.` : directives.invalidExecAsk ? `Unrecognized exec ask "${directives.rawExecAsk ?? ""}". Valid: off, on-miss, always.` : directives.invalidExecNode ? "Exec node requires a value." : void 0;
}
/** Rejects prose left over after canonical command-specific validation succeeds. */
function maybeHandleUnexpectedDirectiveArguments(directives) {
	const command = directives.command;
	const unconsumedArguments = command?.unconsumedArguments;
	if (!command || !unconsumedArguments) return;
	return { text: `Unexpected argument "${unconsumedArguments.trimStart().split(/\s+/, 1)[0] ?? unconsumedArguments}" for /${command.name}.` };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.auth-profile.ts
/** Resolves a user-selected auth profile override for the requested provider. */
function resolveProfileOverride(params) {
	const raw = normalizeOptionalString(params.rawProfile);
	if (!raw) return {};
	const requesterProfileId = params.requesterProfileId;
	const validateSelection = isUserModelAuthProfileId(raw) ? () => requesterProfileId && isUserModelAuthProfileOwner({
		profileId: requesterProfileId,
		authProfileId: raw
	}) ? void 0 : "Select a personal model account connected to your signed-in profile." : void 0;
	const selectionError = validateSelection?.();
	if (selectionError) return { error: selectionError };
	const profile = findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId: raw
	}) ?? ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[raw];
	if (!profile) return { error: `Auth profile "${raw}" not found.` };
	if (profile.provider !== params.provider) return { error: `Auth profile "${raw}" is for ${profile.provider}, not ${params.provider}.` };
	return {
		profileId: raw,
		...validateSelection ? { validateSelection } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model-selection.ts
/** Resolves /model directive selections and auth profile overrides. */
function validateOperatorSelection(authority, selection) {
	try {
		assertOperatorModelAllowed(authority, selection);
		return;
	} catch (error) {
		return formatErrorMessage(error);
	}
}
function resolveStoredNumericProfileModelDirective(params) {
	const trimmed = params.raw.trim();
	const lastSlash = trimmed.lastIndexOf("/");
	const profileDelimiter = trimmed.indexOf("@", lastSlash + 1);
	if (profileDelimiter <= 0) return null;
	const profileId = trimmed.slice(profileDelimiter + 1).trim();
	if (!/^\d{8}$/.test(profileId)) return null;
	const modelRaw = trimmed.slice(0, profileDelimiter).trim();
	if (!modelRaw) return null;
	const profile = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }).profiles[profileId];
	if (!profile) return null;
	return {
		modelRaw,
		profileId,
		profileProvider: profile.provider
	};
}
/** Resolves the requested model/profile override from parsed inline directives. */
function resolveModelSelectionFromDirective(params) {
	if (!params.directives.hasModelDirective || !params.directives.rawModelDirective) {
		if (params.directives.rawModelProfile) return { errorText: "Auth profile override requires a model selection." };
		return {};
	}
	const raw = params.directives.rawModelDirective.trim();
	if (/^default$/i.test(raw)) {
		const policy = params.modelPolicy ?? createModelVisibilityPolicy({
			cfg: params.cfg,
			agentId: params.agentId,
			catalog: [],
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel
		});
		const selection = resolveOperatorModelDefault({
			cfg: params.cfg,
			agentId: params.agentId,
			policy: params.operatorAuthority?.modelPolicy,
			model: {
				provider: params.defaultProvider,
				model: params.defaultModel
			},
			allows: policy.allows
		});
		const errorText = validateOperatorSelection(params.operatorAuthority, selection);
		if (errorText) return { errorText };
		if (!selection) return { errorText: "No model is available for this operator role and agent." };
		return {
			modelSelection: {
				...selection,
				isDefault: true,
				resetToDefault: true
			},
			validateModelSelection: () => validateOperatorSelection(params.operatorAuthority, selection)
		};
	}
	const storedNumericProfile = params.directives.rawModelProfile === void 0 ? resolveStoredNumericProfileModelDirective({
		raw,
		agentDir: params.agentDir
	}) : null;
	const resolveSelection = (directive) => resolveModelDirectiveSelection({
		raw: directive,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		aliasIndex: params.aliasIndex,
		allowedModelKeys: params.allowedModelKeys,
		modelPolicy: params.modelPolicy,
		operatorModelPolicy: params.operatorAuthority?.modelPolicy,
		cfg: params.cfg,
		agentId: params.agentId,
		rawRuntime: params.directives.rawModelRuntime
	});
	const storedNumericProfileSelection = storedNumericProfile ? resolveSelection(storedNumericProfile.modelRaw) : null;
	const useStoredNumericProfile = Boolean(storedNumericProfileSelection?.selection) && resolveProviderIdForAuth(storedNumericProfileSelection?.selection?.provider ?? "", { config: params.cfg }) === resolveProviderIdForAuth(storedNumericProfile?.profileProvider ?? "", {
		config: params.cfg,
		storedCredential: true
	});
	const modelRaw = useStoredNumericProfile && storedNumericProfile ? storedNumericProfile.modelRaw : raw;
	if (/^[0-9]+$/.test(raw)) return { errorText: [
		"Numeric model selection is not supported in chat.",
		"",
		"Browse: /models or /models <provider>",
		"Switch: /model <provider/model>"
	].join("\n") };
	const resolved = resolveSelection(modelRaw);
	if (resolved.error) return { errorText: resolved.error };
	const modelSelection = resolved.selection;
	if (modelSelection) {
		const errorText = validateOperatorSelection(params.operatorAuthority, modelSelection);
		if (errorText) return { errorText };
	}
	let profileOverride;
	let validateAuthProfileSelection;
	const rawProfile = params.directives.rawModelProfile ?? (useStoredNumericProfile ? storedNumericProfile?.profileId : void 0);
	if (modelSelection && rawProfile) {
		const profileResolved = resolveProfileOverride({
			rawProfile,
			provider: modelSelection.provider,
			agentDir: params.agentDir,
			requesterProfileId: params.requesterProfileId
		});
		if (profileResolved.error) return { errorText: profileResolved.error };
		profileOverride = profileResolved.profileId;
		validateAuthProfileSelection = profileResolved.validateSelection;
	}
	return {
		modelSelection,
		profileOverride,
		...validateAuthProfileSelection ? { validateAuthProfileSelection } : {},
		...modelSelection ? { validateModelSelection: () => validateOperatorSelection(params.operatorAuthority, modelSelection) ?? validateAuthProfileSelection?.() } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.shared.ts
const DIRECTIVE_ACK_MESSAGES = {
	verbose: {
		off: "Verbose logging disabled.",
		on: "Verbose logging enabled.",
		full: "Verbose logging set to full."
	},
	trace: {
		off: "Trace disabled.",
		on: "Trace enabled. Warning: trace output may contain sensitive information.",
		raw: "Trace set to raw. Warning: trace output may contain sensitive information."
	},
	reasoning: {
		off: "Reasoning visibility disabled.",
		on: "Reasoning visibility enabled.",
		stream: "Reasoning stream enabled."
	},
	elevated: {
		off: "Elevated mode disabled.",
		on: "Elevated mode set to ask (approvals may still apply).",
		ask: "Elevated mode set to ask (approvals may still apply).",
		full: "Elevated mode set to full (auto-approve)."
	}
};
const withOptions = (line, options) => `${line}\nOptions: ${options}.`;
function formatModelSelectionScopeAck(params) {
	if (params.isDefault && !params.stickyModelSelectionTarget) return `Session model reset to configured default (${params.label}).`;
	const targetLabel = params.stickyModelSelectionTarget === "agent" ? "Agent default" : params.stickyModelSelectionTarget === "defaults" ? "Global default" : "Configured default";
	if (params.configuredDefaultUpdate === "requested") return `Model set to ${params.label} for this session. ${targetLabel} update requested.`;
	if (params.configuredDefaultUpdate === "skipped-immutable") return `Model set to ${params.label} for this session. ${targetLabel} unchanged because configuration is immutable.`;
	return `Model set to ${params.label} for this session only; configured default unchanged.`;
}
function canPersistSessionDirectiveDefaults(params) {
	const messageProvider = normalizeOptionalString(params.messageProvider);
	const surface = normalizeOptionalString(params.surface);
	const authoritativeChannel = messageProvider ?? surface;
	if (!authoritativeChannel) return true;
	if (isInternalMessageChannel(authoritativeChannel)) return params.gatewayClientScopes?.includes("operator.admin") === true;
	return params.commandAuthorized === true || params.senderIsOwner === true;
}
const SESSION_LEVEL_DIRECTIVE_FIELDS = [
	["hasThinkDirective", "thinkingLevel"],
	["hasFastDirective", "fastMode"],
	["hasVerboseDirective", "verboseLevel"],
	["hasTraceDirective", "traceLevel"],
	["hasReasoningDirective", "reasoningLevel"],
	["hasElevatedDirective", "elevatedLevel"]
];
const SESSION_EXEC_DIRECTIVE_FIELDS = ["execHost", "execNode"];
const SESSION_QUEUE_DIRECTIVE_FIELDS = [
	["queueMode", "queueMode"],
	["debounceMs", "queueDebounceMs"],
	["cap", "queueCap"],
	["dropPolicy", "queueDrop"]
];
/** Names explicit directive writes that snapshot equality cannot infer. */
function resolveDirectiveTouchedSessionFields(params) {
	const { directives } = params;
	const fields = /* @__PURE__ */ new Set();
	if (directives.hasModelDirective) for (const field of SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS) fields.add(field);
	if (!params.directiveOnly) return [...fields];
	for (const [directiveField, sessionField] of SESSION_LEVEL_DIRECTIVE_FIELDS) if (directives[directiveField] && (sessionField !== "verboseLevel" || params.allowPrivilegedPersistence)) fields.add(sessionField);
	if (directives.hasExecDirective && params.allowPrivilegedPersistence) {
		for (const field of SESSION_EXEC_DIRECTIVE_FIELDS) if (directives[field]) fields.add(field);
	}
	if (directives.hasQueueDirective) for (const [directiveField, sessionField] of SESSION_QUEUE_DIRECTIVE_FIELDS) {
		const value = directives[directiveField];
		if (directives.queueReset || typeof value === "number" || Boolean(value)) fields.add(sessionField);
	}
	return [...fields];
}
/** Keeps the first informational/denied acknowledgement while validating the remaining hints. */
async function acknowledgeIgnoredSessionDirective(params) {
	if (!params.persistenceState) return params.reply;
	const { directives, ignoredDirective } = params;
	const remainingDirectives = ignoredDirective === "hasExecDirective" && directives.hasExecOptions ? {
		...directives,
		invalidExecHost: false,
		invalidExecSecurity: false,
		invalidExecAsk: false,
		invalidExecNode: false
	} : {
		...directives,
		[ignoredDirective]: false,
		...ignoredDirective === "hasThinkDirective" ? { clearThinkLevel: false } : {},
		...ignoredDirective === "hasFastDirective" ? { clearFastMode: false } : {},
		...ignoredDirective === "hasModelDirective" ? { rawModelProfile: void 0 } : {}
	};
	const siblingReply = await params.applyRemainingDirectives(remainingDirectives);
	if (params.persistenceState.outcome.kind === "rejected") return siblingReply ?? params.reply;
	return params.reply;
}
/** Applies canonical session settings while each caller retains its authorization boundaries. */
function applySessionDirectiveFields(params) {
	const { directives, sessionEntry } = params;
	let updated = false;
	const updateField = (field, value) => {
		sessionEntry[field] = value;
		updated = true;
	};
	if (directives.clearThinkLevel) {
		if (sessionEntry.thinkingLevel) {
			delete sessionEntry.thinkingLevel;
			updated = true;
		}
	} else if (directives.hasThinkDirective && directives.thinkLevel) updateField("thinkingLevel", directives.thinkLevel);
	if (directives.clearFastMode) {
		if (sessionEntry.fastMode !== void 0) {
			delete sessionEntry.fastMode;
			updated = true;
		}
	} else if (directives.hasFastDirective && directives.fastMode !== void 0) updateField("fastMode", directives.fastMode);
	if (directives.hasVerboseDirective && directives.verboseLevel && params.allowPrivilegedPersistence) {
		applyVerboseOverride(sessionEntry, directives.verboseLevel);
		updated = true;
	}
	if (directives.hasTraceDirective && directives.traceLevel) {
		applyTraceOverride(sessionEntry, directives.traceLevel);
		updated = true;
	}
	if (directives.hasReasoningDirective && directives.reasoningLevel) updateField("reasoningLevel", directives.reasoningLevel);
	if (directives.hasElevatedDirective && directives.elevatedLevel && params.allowElevatedPersistence) updateField("elevatedLevel", directives.elevatedLevel);
	if (directives.hasExecDirective && directives.hasExecOptions && params.allowPrivilegedPersistence) for (const field of SESSION_EXEC_DIRECTIVE_FIELDS) {
		const value = directives[field];
		if (value) updateField(field, value);
	}
	if (directives.hasQueueDirective && directives.queueReset) {
		for (const [, field] of SESSION_QUEUE_DIRECTIVE_FIELDS) delete sessionEntry[field];
		updated = true;
	} else if (directives.hasQueueDirective) for (const [directiveField, sessionField] of SESSION_QUEUE_DIRECTIVE_FIELDS) {
		const value = directives[directiveField];
		if (typeof value === "number" || value) updateField(sessionField, value);
	}
	return updated;
}
/** Commits a directive snapshot only when its touched fields still win the session transaction. */
async function persistSessionDirectiveSnapshot(params) {
	const { sessionEntry, sessionKey, sessionStore } = params;
	const persistence = await persistReplySessionEntry({
		storePath: params.storePath,
		sessionKey,
		initialEntry: params.initialEntry,
		entry: sessionEntry,
		reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending,
		requireModelSelectionUnlocked: params.hasModelSelection,
		touchedFields: params.touchedFields,
		validateCommit: params.validateCommit
	});
	if (persistence.status !== "current") {
		if (persistence.entry) {
			sessionStore[sessionKey] = persistence.entry;
			adoptPersistedSessionSnapshot(sessionEntry, persistence.entry);
		}
		if (persistence.status === "commit-rejected") return persistence;
		return { status: persistence.status === "model-selection-locked" ? persistence.status : "conflict" };
	}
	const persistedEntry = persistence.entry;
	sessionStore[sessionKey] = persistedEntry;
	const sessionChangesApplied = sessionSnapshotChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		touchedFields: params.touchedFields
	});
	const modelSelectionApplied = !params.hasModelSelection || sessionChangesApplied && sessionModelOverrideChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending
	});
	adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
	return { status: sessionChangesApplied && modelSelectionApplied ? "applied" : "conflict" };
}
const formatElevatedEvent = (level) => {
	if (level === "full") return "Elevated FULL - exec runs on host with auto-approval.";
	if (level === "ask" || level === "on") return "Elevated ASK - exec runs on host; approvals may still apply.";
	return "Elevated OFF - exec stays in sandbox.";
};
const formatReasoningEvent = (level) => {
	if (level === "stream") return "Reasoning STREAM - emit live <think>.";
	if (level === "on") return "Reasoning ON - include <think>.";
	return "Reasoning OFF - hide <think>.";
};
function formatElevatedUnavailableText(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	const failures = params.failures ?? [];
	if (failures.length > 0) lines.push(`Failing gates: ${failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.entries.*.tools.elevated.*");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { formatElevatedEvent as a, formatReasoningEvent as c, withOptions as d, resolveModelSelectionFromDirective as f, canPersistSessionDirectiveDefaults as i, persistSessionDirectiveSnapshot as l, resolveInvalidExecDirectiveMessage as m, acknowledgeIgnoredSessionDirective as n, formatElevatedUnavailableText as o, maybeHandleUnexpectedDirectiveArguments as p, applySessionDirectiveFields as r, formatModelSelectionScopeAck as s, DIRECTIVE_ACK_MESSAGES as t, resolveDirectiveTouchedSessionFields as u };
