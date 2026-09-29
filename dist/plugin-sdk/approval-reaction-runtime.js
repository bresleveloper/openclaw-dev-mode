import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { t as pruneMapToMaxSize } from "../map-size-CNcWiFKu.mjs";
import { t as formatFencedCodeBlock } from "../markdown-code-Buzx6wvi.mjs";
import { t as isApprovalNotFoundError } from "../approval-errors-BPkaCbRr.mjs";
import "../error-runtime-Bf1fYXFh.mjs";
import { n as summarizeApprovalScope } from "../approval-scope-CfvRogZm.mjs";
import { n as sanitizeForPromptLiteral } from "../sanitize-for-prompt-bzCyHFCH.mjs";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-DlQSsCnq.mjs";
import { a as buildExecApprovalPendingReplyPayload, f as formatExecApprovalExpiresIn } from "../exec-approval-reply-Cd667sf7.mjs";
import { s as normalizeApprovalRequest } from "../approval-request-account-binding-CJyRIlPn.mjs";
import { c as shouldSuppressLocalNativeExecApprovalPrompt } from "../approval-native-helpers-Bu6FTCbI.mjs";
import { r as buildPluginApprovalPendingReplyPayload, t as buildApprovalPendingReplyPayload } from "../approval-renderers-CXRXTpSo.mjs";
import { n as buildPendingApprovalView } from "../approval-view-model-CMf56Nbk.mjs";
//#region src/plugin-sdk/approval-reaction-binding.ts
/** Build the private marker revalidated after channel delivery. */
function buildApprovalReactionDeliveredBindingMarker(binding) {
	return {
		version: 1,
		...binding
	};
}
/** Read a nonempty, duplicate-free list without accepting unrecognized decisions. */
function readApprovalReactionDecisionList(value) {
	if (!Array.isArray(value) || value.length === 0) return null;
	const decisions = [];
	for (const decision of value) {
		if (decision !== "allow-once" && decision !== "allow-always" && decision !== "deny" || decisions.includes(decision)) return null;
		decisions.push(decision);
	}
	return decisions;
}
/** Normalize the shipped approval command spelling without accepting other decisions. */
function normalizeApprovalReactionDecision(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "always") return "allow-always";
	return normalized === "allow-once" || normalized === "allow-always" || normalized === "deny" ? normalized : null;
}
/** Compare approved decision sets independently of presentation order. */
function approvalReactionDecisionSetsMatch(left, right) {
	return left.length === right.length && left.every((decision) => right.includes(decision));
}
/** Validate canonical approval metadata without inferring its owner from text. */
function readApprovalReactionDeliveryMetadata(payload, options = {}) {
	const value = payload.channelData?.execApproval;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	if (typeof record.approvalId !== "string") return null;
	const approvalId = options.trimApprovalId ? record.approvalId.trim() : record.approvalId;
	const approvalSlug = typeof record.approvalSlug === "string" ? record.approvalSlug.trim() : "";
	const allowedDecisions = readApprovalReactionDecisionList(record.allowedDecisions);
	if (!approvalId || !options.trimApprovalId && approvalId !== approvalId.trim() || options.requireApprovalSlug && !approvalSlug || record.approvalKind !== "exec" && record.approvalKind !== "plugin" || !allowedDecisions) return null;
	return {
		approvalId,
		approvalKind: record.approvalKind,
		allowedDecisions,
		...approvalSlug ? { approvalSlug } : {}
	};
}
/** Verify that typed presentation controls exactly match authoritative approval metadata. */
function readApprovalReactionPresentationBinding(params) {
	const metadata = readApprovalReactionDeliveryMetadata(params.payload, params);
	if (!metadata) return null;
	const actions = (params.presentation ?? params.payload.presentation)?.blocks.flatMap((block) => block.type === "buttons" ? block.buttons.flatMap((button) => button.action?.type === "approval" ? [button.action] : []) : []);
	if (!actions?.length || actions.some((action) => action.approvalId !== metadata.approvalId || action.approvalKind !== metadata.approvalKind)) return null;
	const decisions = readApprovalReactionDecisionList(actions.map((action) => action.decision));
	return decisions && approvalReactionDecisionSetsMatch(metadata.allowedDecisions, decisions) ? metadata : null;
}
/** Revalidate the private delivery marker against canonical typed approval metadata. */
function readApprovalReactionDeliveredBinding(params) {
	const metadata = readApprovalReactionDeliveryMetadata(params.payload, params);
	const marker = params.payload.channelData?.[params.channelDataKey];
	if (!metadata || !marker || typeof marker !== "object" || Array.isArray(marker)) return null;
	const record = marker;
	const markerId = typeof record.approvalId === "string" && params.trimApprovalId ? record.approvalId.trim() : record.approvalId;
	const markerSlug = typeof record.approvalSlug === "string" ? record.approvalSlug.trim() : "";
	const decisions = readApprovalReactionDecisionList(record.allowedDecisions);
	return record.version === 1 && markerId === metadata.approvalId && record.approvalKind === metadata.approvalKind && (!params.requireApprovalSlug || markerSlug === metadata.approvalSlug) && decisions && approvalReactionDecisionSetsMatch(metadata.allowedDecisions, decisions) ? metadata : null;
}
//#endregion
//#region src/plugin-sdk/approval-reaction-runtime.ts
/** Validate the shared persisted fields without changing transport-owned metadata. */
function readApprovalReactionTargetRecord(target) {
	if (!isRecord(target) || typeof target.approvalId !== "string" || target.approvalKind !== "exec" && target.approvalKind !== "plugin") return null;
	const allowedDecisions = readApprovalReactionDecisionList(target.allowedDecisions);
	return allowedDecisions ? {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		allowedDecisions
	} : null;
}
/** Admit an explicit approver and retire transport bindings only on terminal resolution. */
async function settleApprovalReaction(params) {
	const { request, logVerboseMessage } = params;
	const { channel, approvalId, senderId } = request;
	if (params.approvers.length === 0) {
		logVerboseMessage?.(`${channel}: approval reaction denied id=${approvalId}; reactions require explicit approvers`);
		return "denied";
	}
	if (!params.authorizeActorAction({
		...request,
		action: "approve"
	}).authorized) {
		logVerboseMessage?.(`${channel}: approval reaction denied id=${approvalId} sender=${senderId}`);
		return "denied";
	}
	const resolve = await params.loadResolver();
	let result;
	try {
		result = await resolve(request);
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			await params.clearTarget();
			logVerboseMessage?.(`${channel}: approval reaction ignored for expired approval id=${approvalId} sender=${senderId}`);
			return "not-found";
		}
		params.onError?.(error);
		logVerboseMessage?.(`${channel}: approval reaction failed id=${approvalId} sender=${senderId}: ${String(error)}`);
		throw error;
	}
	await params.clearTarget();
	params.onResolved(result);
	return "resolved";
}
/** Canonical reaction controls shown for approval prompts, in product display order. */
const APPROVAL_REACTION_BINDINGS = [
	{
		decision: "allow-once",
		emoji: "👍",
		label: "Allow Once"
	},
	{
		decision: "allow-always",
		emoji: "♾️",
		label: "Allow Always"
	},
	{
		decision: "deny",
		emoji: "👎",
		label: "Deny"
	}
];
const APPROVAL_REACTION_ORDER = APPROVAL_REACTION_BINDINGS.map((binding) => binding.decision);
const VARIATION_SELECTOR_RE = /[\uFE0E\uFE0F]/gu;
const FITZPATRICK_MODIFIER_RE = /[\u{1F3FB}-\u{1F3FF}]/gu;
function normalizeDecisionList(allowedDecisions) {
	const allowed = new Set(allowedDecisions);
	return APPROVAL_REACTION_ORDER.filter((decision) => allowed.has(decision));
}
/** List the canonical reaction bindings allowed for a specific approval request. */
function listApprovalReactionBindings(params) {
	const allowed = new Set(normalizeDecisionList(params.allowedDecisions));
	return APPROVAL_REACTION_BINDINGS.filter((binding) => allowed.has(binding.decision)).map((binding) => ({
		decision: binding.decision,
		emoji: binding.emoji,
		label: binding.label
	}));
}
/** Build user-facing reaction instructions, or null when no reaction decisions are allowed. */
function buildApprovalReactionHint(params) {
	const bindings = listApprovalReactionBindings(params);
	if (bindings.length === 0) return null;
	return `React with:\n\n${bindings.map((binding) => `${binding.emoji} ${binding.label}`).join("\n")}`;
}
const APPROVAL_REACTION_HINT_PRESENT_RE = /(^|\n)React with:\s*(\n|$)/i;
/** True when approval prompt text already carries a reaction hint block. */
function hasApprovalReactionHintText(text) {
	return APPROVAL_REACTION_HINT_PRESENT_RE.test(text ?? "");
}
/** Inserts a reaction hint after the `ID: <id>` header line, else prepends it. */
function insertApprovalReactionHintNearIdHeader(params) {
	const lines = params.text.split(/\r?\n/);
	const idLineIndex = lines.findIndex((line) => /^ID:\s*\S+/.test(line.trim()));
	if (idLineIndex >= 0) {
		const before = lines.slice(0, idLineIndex + 1).join("\n");
		const after = lines.slice(idLineIndex + 1).join("\n").replace(/^\n+/, "");
		return after ? `${before}\n\n${params.hint}\n\n${after}` : `${before}\n\n${params.hint}`;
	}
	return `${params.hint}\n\n${params.text}`;
}
/** Adds the canonical reaction hint to approval prompt text unless one is present. */
function addApprovalReactionHintToText(params) {
	if (hasApprovalReactionHintText(params.text)) return params.text;
	const hint = buildApprovalReactionHint({ allowedDecisions: params.allowedDecisions });
	return hint ? insertApprovalReactionHintNearIdHeader({
		text: params.text,
		hint
	}) : params.text;
}
/** Normalize reaction emoji so skin-tone and text/presentation variants match canonical bindings. */
function normalizeApprovalReactionEmoji(reactionKey) {
	const normalized = reactionKey.trim().replace(VARIATION_SELECTOR_RE, "").replace(FITZPATRICK_MODIFIER_RE, "");
	if (normalized === "♾") return "♾️";
	return normalized;
}
/** Resolve a reaction key to an allowed approval decision. */
function resolveApprovalReactionDecision(params) {
	const normalizedEmoji = normalizeApprovalReactionEmoji(params.reactionKey);
	if (!normalizedEmoji) return null;
	for (const binding of listApprovalReactionBindings(params)) if (binding.emoji === normalizedEmoji) return {
		decision: binding.decision,
		normalizedEmoji
	};
	return null;
}
function resolveApprovalReactionTargetInternal(params) {
	const target = params.target;
	if (!target) return null;
	const decision = resolveApprovalReactionDecision({
		reactionKey: params.reactionKey,
		allowedDecisions: target.allowedDecisions
	});
	if (!decision) return null;
	const approvalId = params.allowLegacyKindInference ? target.approvalId.trim() : target.approvalId;
	const approvalKind = target.approvalKind;
	if (!approvalId) return null;
	const resolvedKind = approvalKind === "exec" || approvalKind === "plugin" ? approvalKind : params.allowLegacyKindInference ? approvalId.startsWith("plugin:") ? "plugin" : "exec" : null;
	if (!resolvedKind) return null;
	return {
		approvalId,
		approvalKind: resolvedKind,
		decision: decision.decision,
		normalizedEmoji: decision.normalizedEmoji,
		...target.route === void 0 ? {} : { route: target.route }
	};
}
/** Resolve an explicitly typed target without deriving ownership from its id. */
function resolveTypedApprovalReactionTarget(params) {
	return resolveApprovalReactionTargetInternal({
		...params,
		allowLegacyKindInference: false
	});
}
function formatSeverity(value) {
	return value === "critical" ? "Critical" : value === "info" ? "Info" : "Warning";
}
function buildDecisionText(allowedDecisions) {
	return allowedDecisions.join("|");
}
function buildManualInstructionSection(params) {
	const lines = [];
	if (!params.allowedDecisions.includes("allow-always")) lines.push(params.approvalKind === "exec" ? "Allow Always is unavailable for this command." : "Allow Always is unavailable because the effective policy requires approval every time.");
	if (params.allowedDecisions.length > 0) lines.push(`Reply with: /approve ${params.approvalId} ${buildDecisionText(params.allowedDecisions)}`);
	return lines;
}
function buildCommandActionInstructionSection(actions) {
	return actions.flatMap((action) => action.command.trim() ? [`${action.label}: ${action.command}`] : []);
}
function listDecisionActions(actions) {
	return normalizeDecisionList(actions.flatMap((action) => "decision" in action && action.decision ? [action.decision] : []));
}
function buildApprovalReactionPromptText(params) {
	const { view } = params;
	const scopeSummary = view.scope ? summarizeApprovalScope(view.scope) : void 0;
	const allowedDecisions = listDecisionActions(view.actions);
	const sections = [];
	if (view.approvalKind === "exec") {
		const header = ["**Exec approval required**", `**ID:** ${view.approvalId}`];
		sections.push(header.join("\n"));
		const warningText = view.warningText?.trim();
		if (warningText) sections.push(`**${warningText}**`);
		const warningLines = view.commandAnalysis?.warningLines?.map((line) => line.trim()).filter(Boolean).slice(0, 5);
		if (warningLines?.length) sections.push(["**Command analysis:**", ...warningLines.map((line) => `- ${line}`)].join("\n"));
		sections.push(["**Pending command:**", formatFencedCodeBlock(view.commandText, "sh")].join("\n"));
		const info = [];
		if (view.cwd) info.push(`**CWD:** ${formatApprovalDisplayPath(sanitizeForPromptLiteral(view.cwd))}`);
		if (view.host) info.push(`**Host:** ${view.host}`);
		if (view.nodeId) info.push(`**Node:** ${view.nodeId}`);
		if (scopeSummary) info.push(`**Scope:** ${scopeSummary}`);
		if (view.agentId) info.push(`**Agent:** ${view.agentId}`);
		if (view.ask) info.push(`**Ask:** ${view.ask}`);
		info.push(`**Expires in:** ${formatExecApprovalExpiresIn(view.expiresAtMs, params.nowMs)}`);
		info.push(`**Full id:** \`${view.approvalId}\``);
		sections.push(info.join("\n"));
	} else if (view.approvalKind === "system-agent") {
		const details = ["**OpenClaw change requires approval**", `**Change:** ${view.operationSummary}`];
		if (view.agentId) details.push(`**Agent:** ${view.agentId}`);
		details.push(`**Expires in:** ${formatExecApprovalExpiresIn(view.expiresAtMs, params.nowMs)}`);
		sections.push(details.join("\n"));
	} else {
		const header = ["**Plugin approval required**", `**ID:** ${view.approvalId}`];
		sections.push(header.join("\n"));
		const details = [`**Title:** ${view.title}`];
		if (view.description) details.push(`**Description:** ${view.description}`);
		if (scopeSummary) details.push(`**Scope:** ${scopeSummary}`);
		details.push(`**Severity:** ${formatSeverity(view.severity)}`);
		if (view.toolName) details.push(`**Tool:** ${view.toolName}`);
		if (view.pluginId) details.push(`**Plugin:** ${view.pluginId}`);
		if (view.agentId) details.push(`**Agent:** ${view.agentId}`);
		details.push(`**Expires in:** ${formatExecApprovalExpiresIn(view.expiresAtMs, params.nowMs)}`);
		details.push(`**Full id:** \`${view.approvalId}\``);
		sections.push(details.join("\n"));
	}
	if (params.reactionHint) sections.push(params.reactionHint);
	const commandInstructions = buildCommandActionInstructionSection(view.actions);
	if (commandInstructions.length > 0) sections.push(commandInstructions.join("\n"));
	const manualInstructions = buildManualInstructionSection({
		approvalKind: view.approvalKind,
		approvalId: view.approvalId,
		allowedDecisions
	});
	if (manualInstructions.length > 0) sections.push(manualInstructions.join("\n"));
	return sections.filter(Boolean).join("\n\n");
}
function withoutPresentation(payload) {
	const { presentation: _presentation, interactive: _interactive, ...rest } = payload;
	return rest;
}
function buildMetadataPayload(params) {
	const sessionKey = params.request.request.sessionKey ?? null;
	return withoutPresentation(buildApprovalPendingReplyPayload({
		approvalKind: params.view.approvalKind,
		approvalId: params.view.approvalId,
		approvalSlug: params.view.approvalId.slice(0, 8),
		text: params.text,
		agentId: params.view.agentId ?? null,
		allowedDecisions: params.allowedDecisions,
		sessionKey
	}));
}
/** Build an approval prompt payload with reaction bindings for a prepared view. */
function buildApprovalPendingPromptPayload(params) {
	const allowedDecisions = listDecisionActions(params.view.actions);
	const reactionBindings = listApprovalReactionBindings({ allowedDecisions });
	const text = buildApprovalReactionPromptText({
		view: params.view,
		nowMs: params.nowMs,
		reactionHint: buildApprovalReactionHint({ allowedDecisions })
	});
	return {
		...buildMetadataPayload({
			request: params.request,
			view: params.view,
			text,
			allowedDecisions
		}),
		allowedDecisions,
		reactionBindings
	};
}
/** Build an approval prompt payload with reaction bindings directly from a request. */
function buildApprovalReactionPromptPayloadForRequest(params) {
	return buildApprovalPendingPromptPayload({
		request: params.request,
		view: buildPendingApprovalView(params.request),
		nowMs: params.nowMs
	});
}
function replaceApprovalIdPlaceholder(text, approvalId) {
	return (text ?? "").replace(/\/approve\s+<id>/g, `/approve ${approvalId}`);
}
/** Build reaction and manual-fallback pending approval content for a prepared view. */
function buildApprovalReactionPendingContent(params) {
	const reactionPayload = buildApprovalPendingPromptPayload(params);
	const request = normalizeApprovalRequest(params.request);
	if (params.view.approvalKind === "plugin") {
		if (request.approvalKind !== "plugin") throw new Error("approval request and view kinds do not match");
		const payload = buildPluginApprovalPendingReplyPayload({
			request,
			nowMs: params.nowMs,
			allowedDecisions: reactionPayload.allowedDecisions
		});
		return {
			reactionPayload,
			manualFallbackPayload: withoutPresentation({
				...payload,
				text: replaceApprovalIdPlaceholder(payload.text, request.id)
			})
		};
	}
	if (params.view.approvalKind === "system-agent") {
		if (request.approvalKind !== "system-agent") throw new Error("approval request and view kinds do not match");
		return {
			reactionPayload,
			manualFallbackPayload: withoutPresentation(buildApprovalPendingReplyPayload({
				approvalKind: "system-agent",
				approvalId: request.id,
				approvalSlug: request.id.slice(0, 8),
				text: reactionPayload.text ?? "",
				agentId: params.view.agentId ?? null,
				allowedDecisions: reactionPayload.allowedDecisions,
				sessionKey: request.request.sessionKey ?? null
			}))
		};
	}
	if (request.approvalKind !== "exec") throw new Error("approval request and view kinds do not match");
	return {
		reactionPayload,
		manualFallbackPayload: withoutPresentation(buildExecApprovalPendingReplyPayload({
			approvalId: request.id,
			approvalSlug: request.id.slice(0, 8),
			approvalCommandId: request.id,
			warningText: params.view.warningText ?? void 0,
			ask: params.view.ask ?? null,
			agentId: params.view.agentId ?? null,
			allowedDecisions: reactionPayload.allowedDecisions,
			command: params.view.commandText,
			cwd: params.view.cwd ?? void 0,
			host: params.view.host === "node" ? "node" : "gateway",
			nodeId: params.view.nodeId ?? void 0,
			scope: params.view.scope ?? void 0,
			sessionKey: params.view.sessionKey ?? null,
			expiresAtMs: request.expiresAtMs,
			nowMs: params.nowMs
		}))
	};
}
/**
* Prompt copy for channels whose native controls (Apple Messages polls, inline
* buttons) own the decision surface. Same bold headers and labels as the
* reaction prompt (#85954) minus the tapback hint, which would advertise a
* second, redundant control path next to the native one.
*/
function buildApprovalNativeControlsPromptText(params) {
	return buildApprovalReactionPromptText({
		view: params.view,
		nowMs: params.nowMs,
		reactionHint: null
	});
}
/** Build reaction and manual-fallback pending approval content directly from a request. */
function buildApprovalReactionPendingContentForRequest(params) {
	return buildApprovalReactionPendingContent({
		request: params.request,
		view: buildPendingApprovalView(params.request),
		nowMs: params.nowMs
	});
}
/** Create an approval target store backed by memory with optional persistent storage. */
function createApprovalReactionTargetStore(params) {
	const nowMs = params.nowMs ?? (() => Date.now());
	const memory = /* @__PURE__ */ new Map();
	let persistentStore;
	let persistentStoreDisabled = false;
	const disablePersistentStore = (error) => {
		persistentStoreDisabled = true;
		persistentStore = void 0;
		params.logPersistentError?.(error);
	};
	const getPersistentStore = () => {
		if (persistentStoreDisabled || !params.openStore) return;
		if (persistentStore) return persistentStore;
		try {
			persistentStore = params.openStore({
				namespace: params.namespace,
				maxEntries: params.maxEntries,
				defaultTtlMs: params.defaultTtlMs
			});
			return persistentStore;
		} catch (error) {
			disablePersistentStore(error);
			return;
		}
	};
	const pruneMemory = () => {
		const now = nowMs();
		for (const [key, entry] of memory) if (entry.expiresAtMs <= now) memory.delete(key);
		pruneMapToMaxSize(memory, params.maxEntries);
	};
	return {
		async register(key, target, opts) {
			const normalizedKey = key.trim();
			if (!normalizedKey) return;
			const ttlMs = Math.max(1, opts?.ttlMs ?? params.defaultTtlMs);
			memory.set(normalizedKey, {
				target,
				expiresAtMs: nowMs() + ttlMs
			});
			pruneMemory();
			const store = getPersistentStore();
			if (!store) return;
			await store.register(normalizedKey, {
				version: 1,
				target
			}, { ttlMs }).catch(disablePersistentStore);
		},
		async lookup(key) {
			const normalizedKey = key.trim();
			if (!normalizedKey) return null;
			pruneMemory();
			const entry = memory.get(normalizedKey);
			if (entry) return entry.target;
			const store = getPersistentStore();
			if (!store) return null;
			try {
				const persisted = await store.lookup(normalizedKey);
				if (persisted?.version !== 1) return null;
				return params.readPersistedTarget ? params.readPersistedTarget(persisted.target) : persisted.target;
			} catch (error) {
				disablePersistentStore(error);
				return null;
			}
		},
		async delete(key) {
			const normalizedKey = key.trim();
			if (!normalizedKey) return;
			memory.delete(normalizedKey);
			const store = getPersistentStore();
			if (!store) return;
			await store.delete(normalizedKey).catch(disablePersistentStore);
		},
		clearForTest() {
			memory.clear();
			persistentStore = void 0;
			persistentStoreDisabled = false;
		}
	};
}
//#endregion
export { APPROVAL_REACTION_BINDINGS, addApprovalReactionHintToText, approvalReactionDecisionSetsMatch, buildApprovalNativeControlsPromptText, buildApprovalPendingPromptPayload, buildApprovalReactionDeliveredBindingMarker, buildApprovalReactionHint, buildApprovalReactionPendingContent, buildApprovalReactionPendingContentForRequest, buildApprovalReactionPromptPayloadForRequest, createApprovalReactionTargetStore, hasApprovalReactionHintText, insertApprovalReactionHintNearIdHeader, listApprovalReactionBindings, normalizeApprovalReactionDecision, normalizeApprovalReactionEmoji, readApprovalReactionDecisionList, readApprovalReactionDeliveredBinding, readApprovalReactionDeliveryMetadata, readApprovalReactionPresentationBinding, readApprovalReactionTargetRecord, resolveApprovalReactionDecision, resolveTypedApprovalReactionTarget, settleApprovalReaction, shouldSuppressLocalNativeExecApprovalPrompt };
