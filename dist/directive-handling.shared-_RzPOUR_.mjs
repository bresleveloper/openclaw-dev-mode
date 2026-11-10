import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { l as createOperatorModelSelectionAssertion, n as assertOperatorModelAllowed } from "./admitted-run-context-h1ULFETN.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { i as resolveOperatorModelDefault } from "./operator-model-policy-3pT6BgLA.mjs";
import { i as ensureAuthProfileStoreAsync, l as findPersistedAuthProfileCredentialAsync } from "./store-runtime-CwqGD12G.mjs";
import { a as prepareUserModelAccountAuthority } from "./user-model-account-operations-DIqTwy80.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, o as sessionSnapshotChangesApplied, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import "./model-selection-_LS5TGCV.mjs";
import { t as resolveModelDirectiveSelection } from "./model-selection-directive-By2HuKqh.mjs";
import { t as persistReplySessionEntry } from "./session-entry-persistence-Cq7Ewsn6.mjs";
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
async function resolveProfileOverride(params) {
	const raw = normalizeOptionalString(params.rawProfile);
	if (!raw) return {};
	const selectProfile = (provider, validateSelection) => provider !== params.provider ? { error: `Auth profile "${raw}" is for ${provider}, not ${params.provider}.` } : {
		profileId: raw,
		...validateSelection ? { validateSelection } : {}
	};
	const requesterProfileId = params.requesterProfileId;
	if (isUserModelAuthProfileId(raw)) {
		const account = requesterProfileId ? await prepareUserModelAccountAuthority({
			profileId: requesterProfileId,
			authProfileId: raw
		}) : void 0;
		const unavailable = "Select a personal model account connected to your signed-in profile.";
		if (!account) return { error: unavailable };
		const validateSelection = () => account.isCurrent() ? void 0 : unavailable;
		const selectionError = validateSelection();
		if (selectionError) return { error: selectionError };
		return selectProfile(account.provider, validateSelection);
	}
	const profile = await findPersistedAuthProfileCredentialAsync({
		agentDir: params.agentDir,
		profileId: raw
	}) ?? (await ensureAuthProfileStoreAsync(params.agentDir, { allowKeychainPrompt: false })).profiles[raw];
	if (!profile) return { error: `Auth profile "${raw}" not found.` };
	return selectProfile(profile.provider);
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model-selection.ts
function validateOperatorSelection(authority, selection) {
	try {
		assertOperatorModelAllowed(authority, selection);
		return;
	} catch (error) {
		return formatErrorMessage(error);
	}
}
async function resolveStoredNumericProfileModelDirective(raw, agentDir) {
	const lastSlash = raw.lastIndexOf("/");
	const profileDelimiter = raw.indexOf("@", lastSlash + 1);
	if (profileDelimiter <= 0) return null;
	const profileId = raw.slice(profileDelimiter + 1).trim();
	if (!/^\d{8}$/.test(profileId)) return null;
	const modelRaw = raw.slice(0, profileDelimiter).trim();
	const profile = (await ensureAuthProfileStoreAsync(agentDir, { allowKeychainPrompt: false })).profiles[profileId];
	return profile ? {
		modelRaw,
		profileId,
		profileProvider: profile.provider
	} : null;
}
/** Resolves the requested model/profile override from parsed inline directives. */
async function resolveModelSelectionFromDirective(params) {
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
			validateModelSelection: () => validateOperatorSelection(params.operatorAuthority, selection),
			modelSelectionSource: createOperatorModelSelectionAssertion(params.operatorAuthority, selection)
		};
	}
	const storedNumericProfile = params.directives.rawModelProfile === void 0 ? await resolveStoredNumericProfileModelDirective(raw, params.agentDir) : null;
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
	if (/^[0-9]+$/.test(raw)) return { errorText: [
		"Numeric model selection is not supported in chat.",
		"",
		"Browse: /models or /models <provider>",
		"Switch: /model <provider/model>"
	].join("\n") };
	const resolved = useStoredNumericProfile && storedNumericProfileSelection ? storedNumericProfileSelection : resolveSelection(raw);
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
		const profileResolved = await resolveProfileOverride({
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
		...modelSelection ? {
			validateModelSelection: () => validateOperatorSelection(params.operatorAuthority, modelSelection) ?? validateAuthProfileSelection?.(),
			modelSelectionSource: composeSessionSourceAssertion([createOperatorModelSelectionAssertion(params.operatorAuthority, modelSelection)], (assertSource) => {
				assertSource();
				const error = validateAuthProfileSelection?.();
				if (error) throw new Error(error);
			})
		} : {}
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
	const { provider, model, alias, isDefault } = params.selection;
	const ref = `${provider}/${model}`;
	const label = alias ? `${alias} (${ref})` : ref;
	if (isDefault && !params.stickyModelSelectionTarget) return `Session model reset to configured default (${label}).`;
	const targetLabel = params.stickyModelSelectionTarget === "agent" ? "Agent default" : params.stickyModelSelectionTarget === "defaults" ? "Global default" : "Configured default";
	if (params.configuredDefaultUpdate === "requested") return `Model set to ${label} for this session. ${targetLabel} update requested.`;
	if (params.configuredDefaultUpdate === "skipped-immutable") return `Model set to ${label} for this session. ${targetLabel} unchanged because configuration is immutable.`;
	return `Model set to ${label} for this session only; configured default unchanged.`;
}
function canPersistSessionDirectiveDefaults(params) {
	const authoritativeChannel = normalizeOptionalString(params.messageProvider) ?? normalizeOptionalString(params.surface);
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
	const fields = new Set(directives.hasModelDirective ? SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS : []);
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
	if (directives.hasVerboseDirective && directives.verboseLevel && params.allowPrivilegedPersistence) updateField("verboseLevel", directives.verboseLevel);
	if (directives.hasTraceDirective && directives.traceLevel) updateField("traceLevel", directives.traceLevel);
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
		validateCommit: params.validateCommit,
		commitGuard: params.commitGuard
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
	const applied = sessionSnapshotChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		touchedFields: params.touchedFields
	}) && (!params.hasModelSelection || sessionModelOverrideChangesApplied({
		initial: params.initialEntry,
		next: sessionEntry,
		current: persistedEntry,
		reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending
	}));
	adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
	return { status: applied ? "applied" : "conflict" };
}
const formatElevatedEvent = (level) => level === "full" ? "Elevated FULL - exec runs on host with auto-approval." : level === "ask" || level === "on" ? "Elevated ASK - exec runs on host; approvals may still apply." : "Elevated OFF - exec stays in sandbox.";
const formatReasoningEvent = (level) => level === "stream" ? "Reasoning STREAM - emit live <think>." : level === "on" ? "Reasoning ON - include <think>." : "Reasoning OFF - hide <think>.";
function formatElevatedUnavailableText(params) {
	const failures = params.failures ?? [];
	const lines = [`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`, failures.length > 0 ? `Failing gates: ${failures.map((f) => `${f.gate} (${f.key})`).join(", ")}` : "Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.entries.*.tools.elevated.*"];
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { formatElevatedEvent as a, formatReasoningEvent as c, withOptions as d, resolveModelSelectionFromDirective as f, canPersistSessionDirectiveDefaults as i, persistSessionDirectiveSnapshot as l, resolveInvalidExecDirectiveMessage as m, acknowledgeIgnoredSessionDirective as n, formatElevatedUnavailableText as o, maybeHandleUnexpectedDirectiveArguments as p, applySessionDirectiveFields as r, formatModelSelectionScopeAck as s, DIRECTIVE_ACK_MESSAGES as t, resolveDirectiveTouchedSessionFields as u };
