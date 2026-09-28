import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { n as buildChannelAccountKey } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { t as isPluginOwnedBindingMetadata } from "./conversation-binding-metadata-CFOhDjMh.mjs";
import { n as buildPluginBindingSessionKey, r as normalizeChannel } from "./conversation-binding-session-key-B595E3Vw.mjs";
import crypto from "node:crypto";
//#region src/plugins/conversation-binding-pending.ts
const PENDING_PLUGIN_BINDING_REQUEST_TTL_MS = 18e5;
const MAX_PENDING_PLUGIN_BINDING_REQUESTS = 512;
const pendingRequests = resolveGlobalMap(Symbol.for("openclaw.pluginBindingPendingRequests"), (requests) => {
	for (const entry of requests.values()) clearTimeout(entry.timeoutId);
	requests.clear();
});
function removePendingPluginBindingRequest(approvalId, expected) {
	const entry = pendingRequests.get(approvalId);
	if (!entry || expected && entry !== expected) return;
	pendingRequests.delete(approvalId);
	clearTimeout(entry.timeoutId);
}
function addPendingPluginBindingRequest(request) {
	const entry = {
		request,
		expiresAtMs: Date.now() + PENDING_PLUGIN_BINDING_REQUEST_TTL_MS,
		timeoutId: setTimeout(() => {
			removePendingPluginBindingRequest(request.id, entry);
		}, PENDING_PLUGIN_BINDING_REQUEST_TTL_MS)
	};
	entry.timeoutId.unref?.();
	pendingRequests.set(request.id, entry);
	while (pendingRequests.size > MAX_PENDING_PLUGIN_BINDING_REQUESTS) {
		const oldestId = pendingRequests.keys().next().value;
		if (oldestId === void 0) break;
		removePendingPluginBindingRequest(oldestId);
	}
}
function takePluginBindingRequestForApproval(params) {
	const entry = pendingRequests.get(params.approvalId);
	if (!entry || Date.now() >= entry.expiresAtMs) {
		if (entry) removePendingPluginBindingRequest(params.approvalId, entry);
		return;
	}
	const request = entry.request;
	if (request.requestedBySenderId && params.senderId?.trim() && request.requestedBySenderId !== params.senderId.trim()) return;
	removePendingPluginBindingRequest(params.approvalId, entry);
	return request;
}
//#endregion
//#region src/plugins/conversation-binding-state.ts
const log$1 = createSubsystemLogger("plugins/binding");
const pluginBindingGlobalState = resolveGlobalSingleton(Symbol.for("openclaw.plugins.binding.global-state"), () => ({
	fallbackNoticeBindingIds: createDedupeCache({
		ttlMs: 0,
		maxSize: 4096
	}),
	approvalsCache: null,
	operations: /* @__PURE__ */ new Set(),
	generation: 0
}), (state) => {
	if (state.resetting) return state.resetting;
	state.generation++;
	const clear = () => {
		state.fallbackNoticeBindingIds.clear();
		state.approvalsCache = null;
	};
	if (!state.operations.size && !state.approvalTail) {
		clear();
		return;
	}
	state.resetting = Promise.allSettled([...state.operations, ...state.approvalTail ? [state.approvalTail] : []]).then(() => {
		clear();
		state.resetting = void 0;
	});
	return state.resetting;
});
async function withPluginBindingApprovalOperation(run) {
	const state = pluginBindingGlobalState;
	const generation = state.generation;
	const assertCurrent = () => {
		if (state.resetting || state.generation !== generation) throw new Error("Plugin conversation binding operation closed. Retry the bind request.");
	};
	assertCurrent();
	let release;
	const retained = new Promise((resolve) => {
		release = resolve;
	});
	state.operations.add(retained);
	try {
		return await run(assertCurrent);
	} finally {
		state.operations.delete(retained);
		release();
	}
}
function buildApprovalScopeKey(params) {
	return [
		params.pluginRoot,
		normalizeChannel(params.channel),
		params.accountId.trim() || "default"
	].join("::");
}
function serializeApprovalOperation(run) {
	const state = pluginBindingGlobalState;
	const operation = (state.approvalTail ?? Promise.resolve()).then(run);
	const tail = operation.then(() => {}, () => {});
	state.approvalTail = tail;
	tail.then(() => {
		if (state.approvalTail === tail) state.approvalTail = void 0;
	});
	return operation;
}
async function getApprovals(context) {
	if (pluginBindingGlobalState.approvalsCache) return pluginBindingGlobalState.approvalsCache;
	let approvals;
	try {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		approvals = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "plugins.conversationBindingApprovals.read",
			input: void 0
		}));
	} catch (error) {
		log$1.warn(`plugin binding approvals load failed: ${String(error)}`);
		approvals = [];
	}
	return pluginBindingGlobalState.approvalsCache = { approvals };
}
function hasPersistentApproval(params) {
	const key = buildApprovalScopeKey(params);
	const context = captureOpenClawStateWorkerContext();
	return serializeApprovalOperation(async () => (await getApprovals(context)).approvals.some((entry) => buildApprovalScopeKey(entry) === key));
}
function addPersistentApproval(entry) {
	const prepared = { ...entry };
	const key = buildApprovalScopeKey(prepared);
	const context = captureOpenClawStateWorkerContext();
	return serializeApprovalOperation(async () => {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "plugins.conversationBindingApprovals.upsert",
			input: prepared
		}));
		const approvals = (await getApprovals(context)).approvals.filter((existing) => buildApprovalScopeKey(existing) !== key);
		approvals.push(prepared);
		pluginBindingGlobalState.approvalsCache = { approvals };
	});
}
//#endregion
//#region src/plugins/conversation-binding.ts
const log = createSubsystemLogger("plugins/binding");
const PLUGIN_BINDING_CUSTOM_ID_PREFIX = "pluginbind";
const LEGACY_CODEX_PLUGIN_SESSION_PREFIXES = ["openclaw-app-server:thread:", "openclaw-codex-app-server:thread:"];
function normalizeConversation(params) {
	return {
		channel: normalizeChannel(params.channel),
		accountId: params.accountId.trim() || "default",
		conversationId: params.conversationId.trim(),
		parentConversationId: normalizeOptionalString(params.parentConversationId),
		threadId: typeof params.threadId === "number" ? Math.trunc(params.threadId) : normalizeOptionalString(params.threadId?.toString())
	};
}
function normalizeBindingData(data) {
	if (!data || typeof data !== "object" || Array.isArray(data)) return;
	return { ...data };
}
function toConversationRef(params) {
	const normalized = normalizeConversation(params);
	const channelId = normalizeChannelId(normalized.channel);
	const resolvedConversationRef = channelId ? getChannelPlugin(channelId)?.conversationBindings?.resolveConversationRef?.({
		accountId: normalized.accountId,
		conversationId: normalized.conversationId,
		parentConversationId: normalized.parentConversationId,
		threadId: normalized.threadId
	}) : null;
	if (resolvedConversationRef?.conversationId?.trim()) return {
		channel: normalized.channel,
		accountId: normalized.accountId,
		conversationId: resolvedConversationRef.conversationId.trim(),
		...resolvedConversationRef.parentConversationId?.trim() ? { parentConversationId: resolvedConversationRef.parentConversationId.trim() } : {}
	};
	return {
		channel: normalized.channel,
		accountId: normalized.accountId,
		conversationId: normalized.conversationId,
		...normalized.parentConversationId ? { parentConversationId: normalized.parentConversationId } : {}
	};
}
function logPluginBindingLifecycleEvent(params) {
	const parts = [
		`plugin binding ${params.event}`,
		`plugin=${params.identity.pluginId}`,
		`root=${params.identity.pluginRoot}`,
		...params.decision ? [`decision=${params.decision}`] : [],
		`channel=${params.conversation.channel}`,
		`account=${params.conversation.accountId}`,
		`conversation=${params.conversation.conversationId}`
	];
	log.info(parts.join(" "));
}
function isLegacyPluginBindingRecord(params) {
	if (!params.record || isPluginOwnedBindingMetadata(params.record.metadata)) return false;
	const targetSessionKey = params.record.targetSessionKey.trim();
	return targetSessionKey.startsWith(`plugin-binding:`) || LEGACY_CODEX_PLUGIN_SESSION_PREFIXES.some((prefix) => targetSessionKey.startsWith(prefix));
}
function buildApprovalInteractiveReply(approvalId) {
	return { blocks: [{
		type: "buttons",
		buttons: [
			{
				label: "Allow once",
				value: buildPluginBindingApprovalCustomId(approvalId, "allow-once"),
				style: "success"
			},
			{
				label: "Always allow",
				value: buildPluginBindingApprovalCustomId(approvalId, "allow-always"),
				style: "primary"
			},
			{
				label: "Deny",
				value: buildPluginBindingApprovalCustomId(approvalId, "deny"),
				style: "danger"
			}
		]
	}] };
}
function createApprovalRequestId() {
	return crypto.randomBytes(9).toString("base64url");
}
function buildBindingMetadata(params) {
	return {
		pluginBindingOwner: "plugin",
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		pluginRoot: params.pluginRoot,
		summary: normalizeOptionalString(params.summary),
		detachHint: normalizeOptionalString(params.detachHint),
		data: normalizeBindingData(params.data),
		bindingAttemptId: normalizeOptionalString(params.bindingAttemptId)
	};
}
function toPluginConversationBinding(record) {
	if (!record || !isPluginOwnedBindingMetadata(record.metadata)) return null;
	const metadata = record.metadata;
	return {
		bindingId: record.bindingId,
		pluginId: metadata.pluginId,
		pluginName: metadata.pluginName,
		pluginRoot: metadata.pluginRoot,
		channel: record.conversation.channel,
		accountId: record.conversation.accountId,
		conversationId: record.conversation.conversationId,
		parentConversationId: record.conversation.parentConversationId,
		boundAt: record.boundAt,
		summary: metadata.summary,
		detachHint: metadata.detachHint,
		data: metadata.data
	};
}
function withConversationBindingContext(binding, conversation) {
	return {
		...binding,
		parentConversationId: conversation.parentConversationId,
		threadId: conversation.threadId
	};
}
function resolvePluginConversationBindingState(conversation) {
	const ref = toConversationRef(conversation);
	const record = getSessionBindingService().resolveByConversation(ref);
	return {
		ref,
		record,
		binding: toPluginConversationBinding(record),
		isLegacyForeignBinding: isLegacyPluginBindingRecord({ record })
	};
}
function resolveOwnedPluginConversationBinding(params) {
	const state = resolvePluginConversationBindingState(params.conversation);
	if (!state.binding || state.binding.pluginRoot !== params.pluginRoot) return null;
	return withConversationBindingContext(state.binding, params.conversation);
}
function buildApprovalEntryFromRequest(request, approvedAt = Date.now()) {
	return {
		pluginRoot: request.pluginRoot,
		pluginId: request.pluginId,
		pluginName: request.pluginName,
		channel: request.conversation.channel,
		accountId: request.conversation.accountId,
		approvedAt
	};
}
async function bindConversationNow(params) {
	const assertCurrent = params.assertCurrent;
	const ref = toConversationRef(params.conversation);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey) ?? buildPluginBindingSessionKey({
		pluginId: params.identity.pluginId,
		channel: ref.channel,
		accountId: ref.accountId,
		conversationId: ref.conversationId
	});
	const binding = toPluginConversationBinding(await getSessionBindingService().bind({
		targetSessionKey,
		targetKind: "session",
		conversation: ref,
		placement: "current",
		...assertCurrent ? { assertCurrent } : {},
		metadata: buildBindingMetadata({
			pluginId: params.identity.pluginId,
			pluginName: params.identity.pluginName,
			pluginRoot: params.identity.pluginRoot,
			summary: params.summary,
			detachHint: params.detachHint,
			data: params.data,
			bindingAttemptId: params.bindingAttemptId
		})
	}));
	if (!binding) throw new Error("plugin binding was created without plugin metadata");
	return withConversationBindingContext(binding, params.conversation);
}
function buildApprovalMessage(request) {
	const lines = [
		`Plugin bind approval required`,
		`Plugin: ${request.pluginName ?? request.pluginId}`,
		`Channel: ${request.conversation.channel}`,
		`Account: ${request.conversation.accountId}`
	];
	if (request.summary?.trim()) lines.push(`Request: ${request.summary.trim()}`);
	else lines.push("Request: Bind this conversation so future plain messages route to the plugin.");
	lines.push("Choose whether to allow this plugin to bind the current conversation.");
	return lines.join("\n");
}
function resolvePluginBindingDisplayName(binding) {
	return normalizeOptionalString(binding.pluginName) || binding.pluginId;
}
function buildDetachHintSuffix(detachHint) {
	const trimmed = detachHint?.trim();
	return trimmed ? ` To detach this conversation, use ${trimmed}.` : "";
}
function buildPluginBindingUnavailableText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} is not currently loaded. Routing this message to OpenClaw instead. If this started after an update, run "openclaw doctor --fix"; otherwise reinstall or enable the plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingDeclinedText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} did not handle this message. This conversation is still bound to that plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingErrorText(binding) {
	return `The bound plugin ${resolvePluginBindingDisplayName(binding)} hit an error handling this message. This conversation is still bound to that plugin.${buildDetachHintSuffix(binding.detachHint)}`;
}
function buildPluginBindingFallbackNoticeKey(bindingId, scope) {
	const normalized = bindingId.trim();
	return normalized && scope ? JSON.stringify([buildChannelAccountKey(scope), normalized]) : normalized;
}
function hasShownPluginBindingFallbackNotice(bindingId, scope) {
	const normalized = buildPluginBindingFallbackNoticeKey(bindingId, scope);
	const cache = pluginBindingGlobalState.fallbackNoticeBindingIds;
	const shown = cache.peek(normalized);
	if (shown) cache.check(normalized);
	return shown;
}
function markPluginBindingFallbackNoticeShown(bindingId, scope) {
	pluginBindingGlobalState.fallbackNoticeBindingIds.check(buildPluginBindingFallbackNoticeKey(bindingId, scope));
}
function buildPendingReply(request) {
	return {
		text: buildApprovalMessage(request),
		interactive: buildApprovalInteractiveReply(request.id)
	};
}
function decodeCustomIdValue(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
function buildPluginBindingApprovalCustomId(approvalId, decision) {
	return `${PLUGIN_BINDING_CUSTOM_ID_PREFIX}:${encodeURIComponent(approvalId)}:${decision === "allow-once" ? "o" : decision === "allow-always" ? "a" : "d"}`;
}
function parsePluginBindingApprovalCustomId(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith(`${PLUGIN_BINDING_CUSTOM_ID_PREFIX}:`)) return null;
	const body = trimmed.slice(`${PLUGIN_BINDING_CUSTOM_ID_PREFIX}:`.length);
	const separator = body.lastIndexOf(":");
	if (separator <= 0 || separator === body.length - 1) return null;
	const rawId = body.slice(0, separator).trim();
	const rawDecisionCode = body.slice(separator + 1).trim();
	if (!rawId) return null;
	const rawDecision = rawDecisionCode === "o" ? "allow-once" : rawDecisionCode === "a" ? "allow-always" : rawDecisionCode === "d" ? "deny" : null;
	if (!rawDecision) return null;
	return {
		approvalId: decodeCustomIdValue(rawId),
		decision: rawDecision
	};
}
function pluginBindingOwnershipConflict(state, pluginRoot) {
	if (state.record && !state.binding && !state.isLegacyForeignBinding) return "This conversation is already bound by core routing and cannot be claimed by a plugin.";
	if (state.binding && state.binding.pluginRoot !== pluginRoot) return `This conversation is already bound by plugin "${state.binding.pluginName ?? state.binding.pluginId}".`;
}
async function requestPluginConversationBinding(params) {
	const assertCallerCurrent = params.assertCurrent;
	const requestParams = {
		...params,
		binding: params.binding ? {
			...params.binding,
			data: normalizeBindingData(params.binding.data)
		} : void 0
	};
	return await withPluginBindingApprovalOperation(async (assertCurrent) => {
		const assertBindingCurrent = () => {
			assertCurrent();
			assertCallerCurrent?.();
		};
		assertBindingCurrent();
		const conversation = normalizeConversation(requestParams.conversation);
		let state = resolvePluginConversationBindingState(conversation);
		const initialConflict = pluginBindingOwnershipConflict(state, requestParams.pluginRoot);
		if (initialConflict) return {
			status: "error",
			message: initialConflict
		};
		const approved = state.binding ? false : await hasPersistentApproval({
			pluginRoot: requestParams.pluginRoot,
			channel: state.ref.channel,
			accountId: state.ref.accountId
		});
		assertBindingCurrent();
		if (!state.binding) {
			state = resolvePluginConversationBindingState(conversation);
			const conflict = pluginBindingOwnershipConflict(state, requestParams.pluginRoot);
			if (conflict) return {
				status: "error",
				message: conflict
			};
		}
		if (state.isLegacyForeignBinding) logPluginBindingLifecycleEvent({
			event: "migrating legacy record",
			identity: requestParams,
			conversation: state.ref
		});
		if (state.binding || approved) {
			const bound = await bindConversationNow({
				identity: requestParams,
				conversation,
				summary: requestParams.binding?.summary,
				detachHint: requestParams.binding?.detachHint,
				data: requestParams.binding?.data,
				...assertCallerCurrent ? { assertCurrent: assertBindingCurrent } : {}
			});
			logPluginBindingLifecycleEvent({
				event: state.binding ? "auto-refresh" : "auto-approved",
				identity: requestParams,
				conversation: state.ref
			});
			return {
				status: "bound",
				binding: bound
			};
		}
		const request = {
			id: createApprovalRequestId(),
			pluginId: requestParams.pluginId,
			pluginName: requestParams.pluginName,
			pluginRoot: requestParams.pluginRoot,
			conversation,
			requestedBySenderId: normalizeOptionalString(requestParams.requestedBySenderId),
			summary: normalizeOptionalString(requestParams.binding?.summary),
			detachHint: normalizeOptionalString(requestParams.binding?.detachHint),
			data: normalizeBindingData(requestParams.binding?.data)
		};
		assertBindingCurrent();
		addPendingPluginBindingRequest(request);
		logPluginBindingLifecycleEvent({
			event: "requested",
			identity: requestParams,
			conversation: state.ref
		});
		return {
			status: "pending",
			approvalId: request.id,
			reply: buildPendingReply(request)
		};
	});
}
async function getCurrentPluginConversationBinding(params) {
	return resolveOwnedPluginConversationBinding(params);
}
async function detachPluginConversationBinding(params) {
	const binding = resolveOwnedPluginConversationBinding(params);
	if (!binding) return { removed: false };
	await getSessionBindingService().unbind({
		bindingId: binding.bindingId,
		reason: "plugin-detach",
		scope: binding
	});
	logPluginBindingLifecycleEvent({
		event: "detached",
		identity: binding,
		conversation: binding
	});
	return { removed: true };
}
async function resolvePluginConversationBindingApproval(params) {
	const resolution = { ...params };
	return await withPluginBindingApprovalOperation(async (assertCurrent) => {
		const request = takePluginBindingRequestForApproval(resolution);
		if (!request) return { status: "expired" };
		if (resolution.decision === "deny") {
			dispatchPluginConversationBindingResolved({
				status: "denied",
				decision: "deny",
				request
			});
			logPluginBindingLifecycleEvent({
				event: "denied",
				identity: request,
				conversation: request.conversation
			});
			return {
				status: "denied",
				request
			};
		}
		if (resolution.decision === "allow-always") {
			await addPersistentApproval(buildApprovalEntryFromRequest(request));
			assertCurrent();
			const conflict = pluginBindingOwnershipConflict(resolvePluginConversationBindingState(request.conversation), request.pluginRoot);
			if (conflict) throw new Error(conflict);
		}
		const binding = await bindConversationNow({
			identity: request,
			conversation: request.conversation,
			summary: request.summary,
			detachHint: request.detachHint,
			data: request.data
		});
		logPluginBindingLifecycleEvent({
			event: "approved",
			identity: request,
			conversation: request.conversation,
			decision: resolution.decision
		});
		dispatchPluginConversationBindingResolved({
			status: "approved",
			binding,
			decision: resolution.decision,
			request
		});
		return {
			status: "approved",
			binding,
			request,
			decision: resolution.decision
		};
	});
}
function dispatchPluginConversationBindingResolved(params) {
	queueMicrotask(() => {
		notifyPluginConversationBindingResolved(params).catch((error) => {
			log.warn(`plugin binding resolved dispatch failed: ${String(error)}`);
		});
	});
}
async function notifyPluginConversationBindingResolved(params) {
	const registrations = getActivePluginRegistry()?.conversationBindingResolvedHandlers ?? [];
	for (const registration of registrations) {
		if (registration.pluginId !== params.request.pluginId) continue;
		const registeredRoot = registration.pluginRoot?.trim();
		if (registeredRoot && registeredRoot !== params.request.pluginRoot) continue;
		try {
			const event = {
				status: params.status,
				binding: params.binding,
				decision: params.decision,
				request: {
					summary: params.request.summary,
					detachHint: params.request.detachHint,
					data: params.request.data,
					requestedBySenderId: params.request.requestedBySenderId,
					conversation: params.request.conversation
				}
			};
			await registration.handler(event);
		} catch (error) {
			log.warn(`plugin binding resolved callback failed plugin=${registration.pluginId} root=${registration.pluginRoot ?? "<none>"}: ${formatErrorMessage(error)}`);
		}
	}
}
function buildPluginBindingResolvedText(params) {
	if (params.status === "expired") return "That plugin bind approval expired. Retry the bind command.";
	if (params.status === "denied") return `Denied plugin bind request for ${params.request.pluginName ?? params.request.pluginId}.`;
	const summarySuffix = params.request.summary?.trim() ? ` ${params.request.summary.trim()}` : "";
	if (params.decision === "allow-always") return `Allowed ${params.request.pluginName ?? params.request.pluginId} to bind this conversation.${summarySuffix}`;
	return `Allowed ${params.request.pluginName ?? params.request.pluginId} to bind this conversation once.${summarySuffix}`;
}
//#endregion
export { buildPluginBindingResolvedText as a, getCurrentPluginConversationBinding as c, parsePluginBindingApprovalCustomId as d, requestPluginConversationBinding as f, buildPluginBindingErrorText as i, hasShownPluginBindingFallbackNotice as l, toPluginConversationBinding as m, buildPluginBindingApprovalCustomId as n, buildPluginBindingUnavailableText as o, resolvePluginConversationBindingApproval as p, buildPluginBindingDeclinedText as r, detachPluginConversationBinding as s, bindConversationNow as t, markPluginBindingFallbackNoticeShown as u };
