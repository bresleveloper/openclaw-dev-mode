import { n as __exportAll } from "./runtime-doctor-migrations-CSvRANPN.mjs";
import { i as requiresExplicitMatrixDefaultAccount, n as findMatrixAccountEntry, r as hasImplicitMatrixAccountConfig } from "./account-selection-Cow3TMFO.mjs";
import { a as resolveMatrixAccountConfig } from "./account-config-CVM2a28p.mjs";
import { _ as resolveMatrixAccount, g as resolveDefaultMatrixAccountId, m as listMatrixAccountIds, v as resolveMatrixAccountAsync } from "./setup-core-BRD4PRVa.mjs";
import { i as normalizeMatrixUserId, t as matrixPluginBase } from "./channel.setup-tIeMccfh.mjs";
import { a as isMatrixExecApprovalAuthorizedSender, c as shouldSuppressLocalMatrixExecApprovalPrompt, d as normalizeMatrixApproverId, i as isMatrixApprovalClientEnabled, l as getMatrixApprovalAuthApprovers, n as getMatrixExecApprovalApprovers, o as resolveMatrixExecApprovalTarget, r as isMatrixAnyApprovalClientEnabled, s as shouldHandleMatrixApprovalRequest, t as getMatrixApprovalApprovers, u as matrixApprovalAuth } from "./exec-approvals-C692_FeS.mjs";
import { a as normalizeMatrixResolvableTarget, i as normalizeMatrixMessagingTarget, n as isMatrixQualifiedUserId, o as resolveMatrixDirectUserId, r as isMatrixRoomId, s as resolveMatrixTargetIdentity } from "./target-ids-DltG_ZHJ.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-GiXgCj7k.mjs";
import { f as setMatrixThreadBindingMaxAgeBySessionKey, l as setMatrixThreadBindingIdleTimeoutBySessionKey, p as setMatrixThreadBindingMaxAgeBySessionKeyAsync, u as setMatrixThreadBindingIdleTimeoutBySessionKeyAsync } from "./thread-bindings-shared-DEAGGuDA.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-AKnr45nw.mjs";
import { n as resolveMatrixInboundConversation, t as defaultTopLevelPlacement } from "./thread-binding-api-OtSciHmZ.mjs";
import { createLazyRuntimeModule, createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { adaptScopedAccountAccessor, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound, createRuntimeOutboundDelegates } from "openclaw/plugin-sdk/channel-outbound";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createAllowlistProviderOpenWarningCollector, createConditionalWarningCollector, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { createScopedAccountReplyToModeResolver } from "openclaw/plugin-sdk/conversation-runtime";
import { createChannelDirectoryAdapter, createResolvedDirectoryEntriesLister, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { buildProbeChannelStatusSummary, collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { Type } from "typebox";
import { createApproverRestrictedNativeApprovalCapabilityAsync, createChannelApprovalCapability, splitChannelApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelNativeOriginTargetResolverAsync, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildAgentSessionKey, deriveLastRoutePolicy, parseThreadSessionSuffix, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { resolveConfiguredAcpBindingRecord } from "openclaw/plugin-sdk/acp-binding-resolve-runtime";
import { inspectConversationBindingAsync } from "openclaw/plugin-sdk/conversation-binding-inspection-runtime";
import { inspectRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { deliveryContextFromSession, getSessionEntryAsync, resolveStorePath, sessionDeliveryOrigin } from "openclaw/plugin-sdk/session-store-runtime";
// extensions/matrix/src/actions.ts
const MATRIX_PLUGIN_HANDLED_ACTIONS = /* @__PURE__ */ new Set([
	"send",
	"poll-vote",
	"react",
	"reactions",
	"emoji-list",
	"read",
	"edit",
	"delete",
	"pin",
	"unpin",
	"list-pins",
	"set-profile",
	"member-info",
	"channel-info",
	"permissions"
]);
const MATRIX_PROFILE_MEDIA_PROPERTIES = {
	avatarUrl: Type.Optional(Type.String({ description: "Profile avatar URL for Matrix self-profile update actions. Matrix accepts mxc:// and http(s) URLs." })),
	avatar_url: Type.Optional(Type.String({ description: "snake_case alias of avatarUrl for Matrix self-profile update actions. Matrix accepts mxc:// and http(s) URLs." })),
	avatarPath: Type.Optional(Type.String({ description: "Local avatar file path for Matrix self-profile update actions. Matrix uploads this file and sets the resulting MXC URI." })),
	avatar_path: Type.Optional(Type.String({ description: "snake_case alias of avatarPath for Matrix self-profile update actions. Matrix uploads this file and sets the resulting MXC URI." }))
};
const MATRIX_PROFILE_MEDIA_SOURCE_PARAMS = ["avatarUrl", "avatarPath"];
function resolveMatrixActionAccount(params) {
	if (!params.accountId && requiresExplicitMatrixDefaultAccount(params.cfg)) return null;
	const account = resolveMatrixAccount({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMatrixAccountId(params.cfg)
	});
	return account.enabled && account.configured ? account : null;
}
function describeMatrixMessageTool(account, senderIsOwner) {
	if (!account?.enabled || !account.configured) return {
		actions: [],
		capabilities: []
	};
	const gate = createActionGate(account.config.actions);
	const encryptionEnabled = account.config.encryption === true;
	const actions = /* @__PURE__ */ new Set(["poll", "poll-vote"]);
	const addGatedActions = (key, ...names) => {
		if (gate(key)) for (const name of names) actions.add(name);
	};
	addGatedActions("messages", "send", "read", "edit", "delete");
	addGatedActions("reactions", "react", "reactions", "emoji-list");
	addGatedActions("pins", "pin", "unpin", "list-pins");
	if (gate("profile") && senderIsOwner === true) actions.add("set-profile");
	addGatedActions("memberInfo", "member-info");
	addGatedActions("channelInfo", "channel-info");
	if (encryptionEnabled && gate("verification") && senderIsOwner === true) actions.add("permissions");
	const listedActions = Array.from(actions);
	const schema = [];
	if (actions.has("read")) {
		const cursor = "Matrix read: pagination token from a previous read's nextBatch/prevBatch, not an event id;";
		schema.push({
			actions: [],
			properties: {
				before: Type.Optional(Type.String({ description: `${cursor} pages toward older messages.` })),
				after: Type.Optional(Type.String({ description: `${cursor} pages toward newer messages.` }))
			}
		});
	}
	if (actions.has("set-profile")) schema.push({
		actions: ["set-profile"],
		properties: {
			displayName: Type.Optional(Type.String({ description: "Profile display name for Matrix self-profile update actions." })),
			display_name: Type.Optional(Type.String({ description: "snake_case alias of displayName for Matrix self-profile update actions." })),
			...MATRIX_PROFILE_MEDIA_PROPERTIES
		}
	});
	if (actions.has("react")) schema.push({
		actions: ["react", "reactions"],
		properties: { emoji: Type.Optional(Type.String({ description: `Unicode emoji or custom emote shortcode.${actions.has("emoji-list") ? " Discover room and personal custom emotes with action:\"emoji-list\"." : ""}` })) }
	});
	return {
		actions: listedActions,
		capabilities: ["presentation"],
		schema: schema.length > 1 ? schema : schema[0] ?? null,
		mediaSourceParams: listedActions.includes("set-profile") ? { "set-profile": MATRIX_PROFILE_MEDIA_SOURCE_PARAMS } : null
	};
}
const matrixMessageActions = {
	providerOwnedReadGates: true,
	readAuthorityActions: [
		"read",
		"reactions",
		"list-pins",
		"emoji-list",
		"member-info",
		"channel-info"
	],
	/** @deprecated Use describeMessageToolAsync. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
	describeMessageTool: ({ cfg, accountId, senderIsOwner }) => {
		return describeMatrixMessageTool(resolveMatrixActionAccount({
			cfg,
			accountId
		}), senderIsOwner);
	},
	describeMessageToolAsync: async ({ cfg, accountId, senderIsOwner }) => {
		const resolvedCfg = cfg;
		return describeMatrixMessageTool(!accountId && requiresExplicitMatrixDefaultAccount(resolvedCfg) ? null : await resolveMatrixAccountAsync({
			cfg: resolvedCfg,
			accountId: accountId ?? resolveDefaultMatrixAccountId(resolvedCfg)
		}), senderIsOwner);
	},
	supportsAction: ({ action }) => MATRIX_PLUGIN_HANDLED_ACTIONS.has(action),
	extractToolSend: ({ args }) => {
		return extractToolSend(args, "sendMessage");
	},
	prepareSendPayload: async ({ ctx, payload }) => {
		if (ctx.action !== "send") return null;
		const cfg = ctx.cfg;
		if (!ctx.accountId && requiresExplicitMatrixDefaultAccount(cfg)) return null;
		const account = await resolveMatrixAccountAsync({
			cfg,
			accountId: ctx.accountId
		});
		return account.enabled && account.configured && createActionGate(account.config.actions)("messages") ? payload : null;
	},
	handleAction: async (ctx) => {
		const { handleMatrixAction } = await import("./tool-actions-4dKbrHJ5.mjs");
		return await handleMatrixAction(ctx);
	}
};
// extensions/matrix/src/approval-reaction-auth.ts
var approval_reaction_auth_exports = /* @__PURE__ */ __exportAll({ isMatrixApprovalReactionAuthorizedSender: () => isMatrixApprovalReactionAuthorizedSender });
function isMatrixApprovalReactionAuthorizedSender(params) {
	const normalizedSenderId = params.senderId ? normalizeMatrixApproverId(params.senderId) : void 0;
	if (!normalizedSenderId) return false;
	return getMatrixApprovalApprovers(params).includes(normalizedSenderId);
}
// extensions/matrix/src/approval-native.ts
function normalizeComparableTarget(value) {
	const target = resolveMatrixTargetIdentity(value);
	if (!target) return normalizeLowercaseStringOrEmpty(value);
	if (target.kind === "user") return `user:${normalizeMatrixUserId(target.id)}`;
	return `${normalizeLowercaseStringOrEmpty(target.kind)}:${target.id}`;
}
function resolveMatrixNativeTarget(raw) {
	const target = resolveMatrixTargetIdentity(raw);
	if (!target) return null;
	return target.kind === "user" ? `user:${target.id}` : `room:${target.id}`;
}
function resolveTurnSourceMatrixOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const target = resolveMatrixNativeTarget(request.request.turnSourceTo?.trim() || "");
	if (turnSourceChannel !== "matrix" || !target) return null;
	return {
		to: target,
		threadId: normalizeOptionalStringifiedId(request.request.turnSourceThreadId)
	};
}
function resolveSessionMatrixOriginTarget(sessionTarget) {
	const target = resolveMatrixNativeTarget(sessionTarget.to);
	if (!target) return null;
	return {
		to: target,
		threadId: normalizeOptionalStringifiedId(sessionTarget.threadId)
	};
}
function hasMatrixPluginApprovers(params) {
	return getMatrixApprovalAuthApprovers(params).length > 0;
}
function resolveSuppressionAccountId(params) {
	return params.target.accountId?.trim() || params.request.request.turnSourceAccountId?.trim() || void 0;
}
const resolveMatrixOriginTargetBase = createChannelNativeOriginTargetResolverAsync({
	channel: "matrix",
	resolveTurnSourceTarget: resolveTurnSourceMatrixOriginTarget,
	resolveSessionTarget: resolveSessionMatrixOriginTarget,
	normalizeTargetForMatch: (target) => ({
		...target,
		to: normalizeComparableTarget(target.to)
	}),
	resolveFallbackTarget: (request) => {
		const sessionConversation = resolveApprovalRequestSessionConversation({
			request,
			channel: "matrix"
		});
		if (!sessionConversation) return null;
		return resolveSessionMatrixOriginTarget({
			to: sessionConversation.id,
			threadId: sessionConversation.threadId
		});
	}
});
const matrixNativeApprovalCapability = createApproverRestrictedNativeApprovalCapabilityAsync({
	channel: "matrix",
	channelLabel: "Matrix",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.matrix.accounts.${accountId}` : "channels.matrix";
		return `Approve it from the Web UI for now. Matrix supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`${prefix}.dm.allowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
	},
	listAccountIds: listMatrixAccountIds,
	hasApprovers: (params) => getMatrixExecApprovalApprovers(params).length > 0 || getMatrixApprovalAuthApprovers(params).length > 0,
	isExecAuthorizedSender: isMatrixExecApprovalAuthorizedSender,
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => isMatrixApprovalReactionAuthorizedSender({
		cfg,
		accountId,
		senderId,
		approvalKind: "plugin"
	}),
	isNativeDeliveryEnabled: ({ approvalKind, ...params }) => isMatrixApprovalClientEnabled({
		...params,
		approvalKind: approvalKind ?? "exec"
	}),
	resolveNativeDeliveryMode: resolveMatrixExecApprovalTarget,
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId,
	resolveOriginTarget: async (params) => {
		const approvalKind = params.approvalKind;
		if (!approvalKind) return null;
		return await shouldHandleMatrixApprovalRequest({
			...params,
			approvalKind
		}) ? resolveMatrixOriginTargetBase(params) : null;
	},
	resolveApproverDmTargets: async (params) => {
		if (!await shouldHandleMatrixApprovalRequest(params)) return [];
		return getMatrixApprovalApprovers(params).map((approver) => {
			const normalized = normalizeMatrixUserId(approver);
			return normalized ? { to: `user:${normalized}` } : null;
		}).filter((target) => target !== null);
	},
	notifyOriginWhenDmOnly: true,
	nativeRuntimeAsync: createLazyChannelApprovalNativeRuntimeAdapterAsync({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: isMatrixAnyApprovalClientEnabled,
		shouldHandle: shouldHandleMatrixApprovalRequest,
		load: async () => (await import("./approval-handler.runtime-KhjfA3Qm.mjs")).matrixApprovalNativeRuntime
	})
});
const splitMatrixApprovalCapability = splitChannelApprovalCapability(matrixNativeApprovalCapability);
const matrixBaseNativeApprovalAdapter = splitMatrixApprovalCapability.nativeAsync;
const matrixBaseDeliveryAdapter = splitMatrixApprovalCapability.delivery;
const matrixDeliveryAdapter = matrixBaseDeliveryAdapter && {
	...matrixBaseDeliveryAdapter,
	shouldSuppressForwardingFallbackAsync: async (params) => {
		const accountId = resolveSuppressionAccountId(params);
		if (getMatrixApprovalApprovers({
			cfg: params.cfg,
			accountId,
			approvalKind: params.approvalKind
		}).length === 0) return false;
		if (params.approvalKind === "plugin") {
			const targetChannel = normalizeLowercaseStringOrEmpty(params.target.channel);
			const turnSourceChannel = normalizeLowercaseStringOrEmpty(params.request.request.turnSourceChannel);
			return targetChannel === "matrix" && turnSourceChannel === "matrix" && await shouldHandleMatrixApprovalRequest({
				cfg: params.cfg,
				accountId,
				approvalKind: "plugin",
				request: params.request
			});
		}
		return matrixBaseDeliveryAdapter.shouldSuppressForwardingFallbackAsync?.(params) ?? false;
	}
};
const matrixApprovalCapability = createChannelApprovalCapability({
	authorizeActorActionAsync: async (params) => {
		if (params.approvalKind !== "plugin") return await matrixNativeApprovalCapability.authorizeActorActionAsync?.(params) ?? { authorized: true };
		if (!hasMatrixPluginApprovers({
			cfg: params.cfg,
			accountId: params.accountId
		})) return {
			authorized: false,
			reason: "❌ Matrix plugin approvals are not enabled for this bot account."
		};
		return matrixApprovalAuth.authorizeActorAction(params);
	},
	getActionAvailabilityState: (params) => {
		if (params.approvalKind === "plugin") return hasMatrixPluginApprovers({
			cfg: params.cfg,
			accountId: params.accountId
		}) ? { kind: "enabled" } : { kind: "disabled" };
		return matrixNativeApprovalCapability.getActionAvailabilityState?.(params) ?? { kind: "disabled" };
	},
	getExecInitiatingSurfaceStateAsync: async (params) => await matrixNativeApprovalCapability.getExecInitiatingSurfaceStateAsync?.(params) ?? { kind: "disabled" },
	describeExecApprovalSetup: matrixNativeApprovalCapability.describeExecApprovalSetup,
	delivery: matrixDeliveryAdapter,
	nativeRuntimeAsync: matrixNativeApprovalCapability.nativeRuntimeAsync,
	nativeAsync: matrixBaseNativeApprovalAdapter,
	render: matrixNativeApprovalCapability.render
});
// extensions/matrix/src/matrix/monitor/threads.ts
function resolveMatrixThreadSessionKeys(params) {
	return resolveThreadSessionKeys({
		...params,
		normalizeThreadId: (threadId) => threadId
	});
}
function resolveMatrixThreadRouting(params) {
	const effectiveThreadReplies = params.isDirectMessage && params.dmThreadReplies !== void 0 ? params.dmThreadReplies : params.threadReplies;
	const messageId = params.messageId.trim();
	const threadRootId = params.threadRootId?.trim();
	const inboundThreadId = threadRootId && threadRootId !== messageId ? threadRootId : void 0;
	return { threadId: effectiveThreadReplies === "off" ? void 0 : effectiveThreadReplies === "inbound" ? inboundThreadId : inboundThreadId ?? (messageId || void 0) };
}
// extensions/matrix/src/matrix/monitor/route.ts
function resolveMatrixBindingRef(params) {
	return {
		channel: "matrix",
		accountId: params.accountId,
		conversationId: params.threadId ?? params.roomId,
		parentConversationId: params.threadId ? params.roomId : void 0
	};
}
async function resolveMatrixInboundRouteAsync(params) {
	return projectMatrixInboundRoute(params, await inspectConversationBindingAsync(resolveMatrixBindingRef(params)));
}
function projectMatrixInboundRoute(params, inspection) {
	const baseRoute = params.resolveAgentRoute({
		cfg: params.cfg,
		channel: "matrix",
		accountId: params.accountId,
		peer: {
			kind: params.isDirectMessage ? "direct" : "channel",
			id: params.isDirectMessage ? params.senderId : params.roomId
		},
		parentPeer: params.isDirectMessage ? {
			kind: "channel",
			id: params.roomId
		} : void 0
	});
	const bindingConversationId = params.threadId ?? params.roomId;
	const bindingParentConversationId = params.threadId ? params.roomId : void 0;
	const runtimeRoute = inspectRuntimeConversationBindingRoute({
		route: baseRoute,
		inspection
	});
	const runtimeBinding = runtimeRoute.bindingRecord;
	if (runtimeBinding && runtimeRoute.boundSessionKey) return {
		route: runtimeRoute.route,
		configuredBinding: null,
		bindingOwnerAvailable: true,
		runtimeBindingId: runtimeBinding.bindingId
	};
	const configuredBinding = runtimeBinding == null ? resolveConfiguredAcpBindingRecord({
		cfg: params.cfg,
		channel: "matrix",
		accountId: params.accountId,
		conversationId: bindingConversationId,
		parentConversationId: bindingParentConversationId
	}) : null;
	const configuredSessionKey = configuredBinding?.record.targetSessionKey?.trim();
	const configuredFallbackRoute = configuredBinding && configuredSessionKey ? {
		...baseRoute,
		sessionKey: configuredSessionKey,
		agentId: resolveAgentIdFromSessionKey(configuredSessionKey, configuredBinding.spec.agentId),
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey: configuredSessionKey,
			mainSessionKey: baseRoute.mainSessionKey
		}),
		matchedBy: "binding.channel"
	} : runtimeRoute.route;
	const effectiveRoute = configuredBinding ? inspectRuntimeConversationBindingRoute({
		route: configuredFallbackRoute,
		inspection
	}).route : configuredFallbackRoute;
	const dmSessionKey = params.isDirectMessage && !configuredSessionKey && params.dmSessionScope === "per-room" ? buildAgentSessionKey({
		agentId: effectiveRoute.agentId,
		channel: "matrix",
		accountId: params.accountId,
		peer: {
			kind: "channel",
			id: params.roomId
		}
	}) : effectiveRoute.sessionKey;
	let routeWithDmScope = dmSessionKey === effectiveRoute.sessionKey ? effectiveRoute : {
		...effectiveRoute,
		sessionKey: dmSessionKey,
		lastRoutePolicy: "session"
	};
	if (!configuredBinding && !configuredSessionKey && params.threadId) {
		const threadKeys = resolveMatrixThreadSessionKeys({
			baseSessionKey: routeWithDmScope.sessionKey,
			threadId: params.threadId,
			parentSessionKey: routeWithDmScope.sessionKey
		});
		routeWithDmScope = {
			...routeWithDmScope,
			sessionKey: threadKeys.sessionKey,
			mainSessionKey: threadKeys.parentSessionKey ?? routeWithDmScope.sessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey: threadKeys.sessionKey,
				mainSessionKey: threadKeys.parentSessionKey ?? routeWithDmScope.sessionKey
			})
		};
	}
	return {
		route: routeWithDmScope,
		configuredBinding,
		bindingOwnerAvailable: runtimeRoute.bindingOwnerAvailable ?? true,
		runtimeBindingId: runtimeBinding?.bindingId ?? null,
		pluginId: runtimeRoute.pluginId
	};
}
// extensions/matrix/src/matrix/conversation-route-owner.ts
async function prepareMatrixConversationRouteOwnersAsync(inputs, inspectBindings) {
	const prepared = inputs.map((params) => {
		const { cfg, conversation } = params;
		const accountId = normalizeAccountId(params.accountId);
		const accountConfig = findMatrixAccountEntry(cfg, accountId);
		if (cfg.channels?.matrix?.enabled === false || accountConfig?.enabled === false || !accountConfig && !hasImplicitMatrixAccountConfig(cfg, accountId)) return null;
		const roomId = conversation.nativeChannelId?.trim() || (conversation.kind === "direct" ? "" : conversation.peerId.trim());
		if (!roomId) return null;
		const isDirectMessage = conversation.kind === "direct";
		const route = {
			cfg,
			accountId,
			roomId,
			senderId: conversation.peerId,
			isDirectMessage,
			threadId: conversation.threadId,
			resolveAgentRoute
		};
		return {
			conversation: resolveMatrixBindingRef(route),
			resolve(inspection) {
				const result = projectMatrixInboundRoute(route, inspection);
				if (!result.bindingOwnerAvailable) return { kind: "unavailable" };
				if (result.pluginId) return {
					kind: "plugin",
					pluginId: result.pluginId,
					fallbackAgentId: result.route.agentId
				};
				return {
					kind: "agent",
					agentId: result.route.agentId
				};
			}
		};
	});
	const inspect = await inspectBindings(prepared.flatMap((item) => item ? [item.conversation] : []));
	let index = 0;
	return prepared.map((item) => {
		if (!item) return () => null;
		const position = index++;
		return () => item.resolve(inspect()[position]);
	});
}
// extensions/matrix/src/matrix/monitor/rooms.ts
function readLegacyRoomAllowAlias(room) {
	const rawRoom = room;
	return typeof rawRoom?.allow === "boolean" ? rawRoom.allow : void 0;
}
function buildMatrixRoomScopeTree(rooms) {
	const scopes = {};
	for (const [key, room] of Object.entries(rooms ?? {})) scopes[key] = {
		requireMention: typeof room.autoReply === "boolean" ? !room.autoReply : room.requireMention,
		tools: room.tools
	};
	return { scopes };
}
function resolveMatrixRoomScopePath(params) {
	const key = buildChannelKeyCandidates(params.roomId, `room:${params.roomId}`, ...params.aliases).find((candidate) => Object.hasOwn(params.tree.scopes, candidate)) ?? (Object.hasOwn(params.tree.scopes, "*") ? "*" : void 0);
	return key ? [key] : [];
}
function resolveMatrixRoomConfig(params) {
	const rooms = params.rooms ?? {};
	const tree = { scopes: rooms };
	const [matchKey] = resolveMatrixRoomScopePath({
		...params,
		tree
	});
	const resolved = matchKey ? rooms[matchKey] : void 0;
	const legacyAllow = readLegacyRoomAllowAlias(resolved);
	return {
		allowed: resolved ? resolved.enabled !== false && legacyAllow !== false : false,
		allowlistConfigured: Object.keys(rooms).length > 0,
		config: resolved,
		matchKey,
		matchSource: resolved ? matchKey === "*" ? "wildcard" : "direct" : void 0
	};
}
// extensions/matrix/src/presentation-capabilities.ts
const matrixPresentationCapabilities = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	limits: { text: {
		markdownDialect: "markdown",
		supportsEdit: true
	} }
};
// extensions/matrix/src/matrix/session-store-metadata.ts
function resolveMatrixRoomTargetId(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const target = resolveMatrixTargetIdentity(trimmed);
	return target?.kind === "room" && target.id.startsWith("!") ? target.id : void 0;
}
function resolveMatrixStoredSessionMeta(entry) {
	if (!entry) return null;
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const channel = normalizeOptionalString(deliveryContext?.channel) ?? normalizeOptionalString(origin?.provider);
	const storedAccountId = normalizeOptionalString(deliveryContext?.accountId ?? origin?.accountId);
	const accountId = storedAccountId ? normalizeAccountId(storedAccountId) : void 0;
	const roomId = resolveMatrixRoomTargetId(deliveryContext?.to) ?? resolveMatrixRoomTargetId(origin?.nativeChannelId) ?? resolveMatrixRoomTargetId(origin?.to);
	const chatType = normalizeOptionalString(origin?.chatType) ?? normalizeOptionalString(entry.chatType);
	const directUserId = chatType === "direct" ? normalizeOptionalString(origin?.nativeDirectUserId) ?? resolveMatrixDirectUserId({
		from: normalizeOptionalString(origin?.from),
		to: (roomId ? `room:${roomId}` : void 0) ?? normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(origin?.to),
		chatType
	}) : void 0;
	if (!channel && !accountId && !roomId && !directUserId) return null;
	return {
		...channel ? { channel } : {},
		...accountId ? { accountId } : {},
		...roomId ? { roomId } : {},
		...directUserId ? { directUserId } : {}
	};
}
// extensions/matrix/src/session-route.ts
async function resolveMatrixOutboundSessionRoute(params) {
	const target = resolveMatrixTargetIdentity(params.resolvedTarget?.to ?? params.target) ?? resolveMatrixTargetIdentity(params.target);
	if (!target) return null;
	const effectiveAccountId = normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg));
	const dmSessionScope = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: effectiveAccountId
	}).dm?.sessionScope ?? "per-user";
	async function resolveMatrixCurrentDmRoomId(targetUserId) {
		const sessionKey = parseThreadSessionSuffix(params.currentSessionKey).baseSessionKey ?? params.currentSessionKey?.trim();
		if (!sessionKey) return;
		try {
			const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
			const currentSession = resolveMatrixStoredSessionMeta(await getSessionEntryAsync({
				storePath,
				sessionKey
			}));
			if (!currentSession) return;
			if (currentSession.accountId && currentSession.accountId !== effectiveAccountId) return;
			if (!currentSession.directUserId || currentSession.directUserId !== targetUserId) return;
			return currentSession.roomId;
		} catch {
			return;
		}
	}
	const roomScopedDmId = target.kind === "user" && dmSessionScope === "per-room" ? await resolveMatrixCurrentDmRoomId(target.id) : void 0;
	const peer = roomScopedDmId !== void 0 ? {
		kind: "channel",
		id: roomScopedDmId
	} : {
		kind: target.kind === "user" ? "direct" : "channel",
		id: target.id
	};
	const chatType = target.kind === "user" ? "direct" : "channel";
	const from = target.kind === "user" ? `matrix:${target.id}` : `matrix:channel:${target.id}`;
	const to = `room:${roomScopedDmId ?? target.id}`;
	const baseRoute = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "matrix",
		accountId: effectiveAccountId,
		recipientSessionExact: target.kind === "room" ? dmSessionScope === "per-room" && isMatrixRoomId(target.id) : dmSessionScope === "per-user" ? isMatrixQualifiedUserId(target.id) : roomScopedDmId !== void 0,
		peer,
		chatType,
		from,
		to
	});
	return buildThreadAwareOutboundSessionRoute({
		route: baseRoute,
		replyToId: params.replyToId,
		threadId: params.threadId,
		currentSessionKey: params.currentSessionKey,
		precedence: [
			"threadId",
			"replyToId",
			"currentSession"
		],
		normalizeThreadId: (threadId) => threadId,
		canRecoverCurrentThread: ({ route }) => route.peer.kind !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main"
	});
}
// extensions/matrix/src/channel.ts
const loadMatrixChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-DOjRmnx0.mjs"), "matrixChannelRuntime");
const loadMatrixMonitorModule = createLazyRuntimeModule(() => import("./monitor-Ci1BOpAp.mjs").catch((error) => {
	loadMatrixMonitorModule.clear();
	throw error;
}));
const loadMatrixResolver = createLazyRuntimeNamedExport(() => import("./resolve-targets-B3NLls5a.mjs").then((n) => n.n), "resolveMatrixTargets");
const matrixDoctor = {
	dmAllowFromMode: "nestedOnly",
	groupModel: "sender",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: true,
	legacyConfigRules,
	normalizeCompatibilityConfig
};
function resolveMatrixGroupScope(params) {
	const matrixConfig = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const tree = buildMatrixRoomScopeTree(matrixConfig.groups ?? matrixConfig.rooms);
	const roomId = normalizeMatrixResolvableTarget(params.groupId ?? "");
	const groupChannel = normalizeMatrixResolvableTarget(params.groupChannel ?? "");
	return {
		tree,
		path: resolveMatrixRoomScopePath({
			tree,
			roomId,
			aliases: roomId && groupChannel.toLowerCase() === roomId.toLowerCase() ? [groupChannel] : []
		})
	};
}
function resolveMatrixDirectoryAccount(cfg, accountId) {
	return resolveMatrixAccountConfig({
		cfg,
		accountId: accountId ?? resolveDefaultMatrixAccountId(cfg)
	});
}
function normalizeMatrixDirectoryId(entry, kind) {
	const raw = entry.replace(/^matrix:/i, "").trim();
	if (!raw || raw === "*") return null;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (kind === "user") {
		const cleaned = lowered.startsWith("user:") ? raw.slice(5).trim() : raw;
		return cleaned.startsWith("@") ? `user:${cleaned}` : cleaned;
	}
	if (lowered.startsWith("room:") || lowered.startsWith("channel:")) return raw;
	return raw.startsWith("!") ? `room:${raw}` : raw;
}
const listMatrixDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: resolveMatrixDirectoryAccount,
	resolveSources: (account) => [
		account.dm?.allowFrom ?? [],
		account.groupAllowFrom ?? [],
		...Object.values(account.groups ?? account.rooms ?? {}).map((room) => room.users ?? [])
	],
	normalizeId: (entry) => normalizeMatrixDirectoryId(entry, "user")
});
const listMatrixDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: resolveMatrixDirectoryAccount,
	resolveSources: (account) => [Object.keys(account.groups ?? account.rooms ?? {})],
	normalizeId: (entry) => normalizeMatrixDirectoryId(entry, "group")
});
async function sendMatrixHeartbeatTyping(to, isTyping, cfg, accountId) {
	await (await loadMatrixChannelRuntime()).sendTypingMatrix(to, isTyping, {
		cfg,
		...accountId ? { accountId } : {}
	});
}
function projectMatrixConversationBinding(binding) {
	return {
		boundAt: binding.boundAt,
		lastActivityAt: typeof binding.metadata?.lastActivityAt === "number" ? binding.metadata.lastActivityAt : binding.boundAt,
		idleTimeoutMs: typeof binding.metadata?.idleTimeoutMs === "number" ? binding.metadata.idleTimeoutMs : void 0,
		maxAgeMs: typeof binding.metadata?.maxAgeMs === "number" ? binding.metadata.maxAgeMs : void 0
	};
}
const resolveMatrixDmPolicy = createScopedDmSecurityResolver({
	channelKey: "matrix",
	resolvePolicy: (account) => account.config.dm?.policy,
	resolveAllowFrom: (account) => account.config.dm?.allowFrom,
	allowFromPathSuffix: "dm.",
	normalizeEntry: (raw) => normalizeMatrixUserId(raw)
});
const collectMatrixGroupPolicyWarnings = createAllowlistProviderOpenWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.matrix !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	buildOpenWarning: {
		surface: "Matrix rooms",
		openBehavior: "allows any room to trigger (mention-gated)",
		remediation: "Set channels.matrix.groupPolicy=\"allowlist\" + channels.matrix.groups (and optionally channels.matrix.groupAllowFrom) to restrict rooms"
	}
});
function resolveMatrixAccountConfigPath(accountId, field) {
	return accountId === DEFAULT_ACCOUNT_ID ? `channels.matrix.${field}` : `channels.matrix.accounts.${accountId}.${field}`;
}
const collectMatrixOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: (params) => {
		const warnings = collectMatrixGroupPolicyWarnings(params);
		if (params.account.accountId !== DEFAULT_ACCOUNT_ID) {
			const groupPolicyPath = resolveMatrixAccountConfigPath(params.account.accountId, "groupPolicy");
			const groupsPath = resolveMatrixAccountConfigPath(params.account.accountId, "groups");
			const groupAllowFromPath = resolveMatrixAccountConfigPath(params.account.accountId, "groupAllowFrom");
			return warnings.map((warning) => warning.replace("channels.matrix.groupPolicy", groupPolicyPath).replace("channels.matrix.groups", groupsPath).replace("channels.matrix.groupAllowFrom", groupAllowFromPath));
		}
		return warnings;
	},
	checkId: "channels.matrix.groups.open",
	severity: "warn",
	title: "Matrix security warning"
});
function normalizeMatrixAcpConversationId(conversationId) {
	const target = resolveMatrixTargetIdentity(conversationId);
	if (!target || target.kind !== "room") return null;
	return { conversationId: target.id };
}
function matchesMatrixToolContextRoom(params) {
	const { toolContext } = params;
	if (toolContext.currentChannelProvider && toolContext.currentChannelProvider !== "matrix") return false;
	const currentTarget = toolContext.currentChannelId ? resolveMatrixTargetIdentity(toolContext.currentChannelId) : null;
	const target = resolveMatrixTargetIdentity(params.target);
	return currentTarget?.kind === "room" && target?.kind === "room" && currentTarget.id === target.id;
}
const matrixChannelOutbound = {
	deliveryMode: "direct",
	chunker: (text, limit) => chunkMarkdownTextWithMode(text, limit, "length"),
	chunkerMode: "markdown",
	textChunkLimit: 4e3,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true,
		afterCommit: true,
		reconcileUnknownSend: true
	} },
	presentationCapabilities: matrixPresentationCapabilities,
	shouldSuppressLocalPayloadPromptAsync: shouldSuppressLocalMatrixExecApprovalPrompt,
	...createRuntimeOutboundDelegates({
		getRuntime: loadMatrixChannelRuntime,
		renderPresentation: {
			resolve: (runtime) => runtime.matrixOutbound.renderPresentation,
			unavailableMessage: "Matrix outbound presentation rendering is unavailable"
		},
		sendPayload: {
			resolve: (runtime) => runtime.matrixOutbound.sendPayload,
			unavailableMessage: "Matrix outbound payload delivery is unavailable"
		},
		sendText: {
			resolve: (runtime) => runtime.matrixOutbound.sendText,
			unavailableMessage: "Matrix outbound text delivery is unavailable"
		},
		sendMedia: {
			resolve: (runtime) => runtime.matrixOutbound.sendMedia,
			unavailableMessage: "Matrix outbound media delivery is unavailable"
		},
		sendPoll: {
			resolve: (runtime) => runtime.matrixOutbound.sendPoll,
			unavailableMessage: "Matrix outbound poll delivery is unavailable"
		}
	})
};
const matrixMessageAdapterBase = createChannelMessageAdapterFromOutbound({
	id: "matrix",
	outbound: matrixChannelOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true,
			quietFinalization: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			discardPending: true,
			previewReceipt: true
		} }
	}
});
const matrixMessageAdapter = {
	...matrixMessageAdapterBase,
	durableFinal: {
		...matrixMessageAdapterBase.durableFinal,
		automaticUnknownSendReconciliation: true,
		capabilities: {
			...matrixMessageAdapterBase.durableFinal?.capabilities,
			afterCommit: true,
			reconcileUnknownSend: true
		},
		reconcileUnknownSendKinds: {
			text: true,
			media: true
		},
		reconcileUnknownSend: async (ctx) => await (await loadMatrixChannelRuntime()).reconcileMatrixUnknownSend(ctx),
		afterUnknownSendTerminal: async (ctx) => await (await loadMatrixChannelRuntime()).cleanupMatrixDeliveryPlans({ queueId: ctx.queueId })
	},
	send: {
		...matrixMessageAdapterBase.send,
		lifecycle: { afterCommit: async (ctx) => {
			if (!ctx.deliveryQueueId) return;
			await (await loadMatrixChannelRuntime()).cleanupMatrixDeliveryPlans({ queueId: ctx.deliveryQueueId });
		} }
	}
};
const matrixPlugin = createChatChannelPlugin({
	base: {
		...matrixPluginBase,
		meta: {
			...matrixPluginBase.meta,
			markdownCapable: true
		},
		capabilities: {
			...matrixPluginBase.capabilities,
			tts: { voice: { synthesisTarget: "voice-note" } }
		},
		approvalCapability: matrixApprovalCapability,
		groups: {
			resolveRequireMention: (params) => resolveScopeRequireMention(resolveMatrixGroupScope(params)),
			resolveToolPolicy: (params) => resolveScopeToolsPolicy(resolveMatrixGroupScope(params))
		},
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			bindingStore: "adapter",
			defaultTopLevelPlacement,
			setIdleTimeoutBySessionKey: ({ targetSessionKey, accountId, idleTimeoutMs }) => setMatrixThreadBindingIdleTimeoutBySessionKey({
				targetSessionKey,
				accountId: accountId ?? "",
				idleTimeoutMs
			}).map(projectMatrixConversationBinding),
			setMaxAgeBySessionKey: ({ targetSessionKey, accountId, maxAgeMs }) => setMatrixThreadBindingMaxAgeBySessionKey({
				targetSessionKey,
				accountId: accountId ?? "",
				maxAgeMs
			}).map(projectMatrixConversationBinding),
			setIdleTimeoutBySessionKeyAsync: async ({ targetSessionKey, accountId, idleTimeoutMs }) => (await setMatrixThreadBindingIdleTimeoutBySessionKeyAsync({
				targetSessionKey,
				accountId: accountId ?? "",
				idleTimeoutMs
			})).map(projectMatrixConversationBinding),
			setMaxAgeBySessionKeyAsync: async ({ targetSessionKey, accountId, maxAgeMs }) => (await setMatrixThreadBindingMaxAgeBySessionKeyAsync({
				targetSessionKey,
				accountId: accountId ?? "",
				maxAgeMs
			})).map(projectMatrixConversationBinding)
		},
		messaging: {
			defaultMarkdownTableMode: "block",
			targetPrefixes: ["matrix"],
			targetIdComparison: "case-sensitive",
			normalizeTarget: normalizeMatrixMessagingTarget,
			inferTargetChatType: ({ to }) => {
				const target = resolveMatrixTargetIdentity(to);
				return target ? target.kind === "user" ? "direct" : "channel" : void 0;
			},
			resolveInboundConversation: resolveMatrixInboundConversation,
			resolveDeliveryTarget: (params) => {
				const parentConversationId = params.parentConversationId?.trim();
				if (parentConversationId && parentConversationId !== params.conversationId.trim()) {
					const parentTarget = resolveMatrixTargetIdentity(parentConversationId);
					if (parentTarget?.kind === "room") return {
						to: `room:${parentTarget.id}`,
						threadId: params.conversationId.trim()
					};
				}
				const conversationTarget = resolveMatrixTargetIdentity(params.conversationId);
				if (conversationTarget?.kind === "room") return { to: `room:${conversationTarget.id}` };
				return null;
			},
			resolveOutboundSessionRoute: resolveMatrixOutboundSessionRoute,
			prepareConversationRouteOwnersAsync: prepareMatrixConversationRouteOwnersAsync,
			targetResolver: {
				looksLikeId: (raw) => {
					const trimmed = raw.trim();
					if (!trimmed) return false;
					if (/^(matrix:)?[!#@]/i.test(trimmed)) return true;
					return trimmed.includes(":");
				},
				hint: "<room|alias|user>"
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => {
				return (await listMatrixDirectoryPeersFromConfig(params)).map((entry) => {
					const raw = entry.id.startsWith("user:") ? entry.id.slice(5) : entry.id;
					return !raw.startsWith("@") || !raw.includes(":") ? Object.assign({}, entry, { name: `incomplete id; expected @user:server` }) : entry;
				});
			},
			listGroups: async (params) => await listMatrixDirectoryGroupsFromConfig(params),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadMatrixChannelRuntime,
				listPeersLive: (runtime) => runtime.listMatrixDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listMatrixDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async (params) => (await loadMatrixResolver())(params) },
		actions: matrixMessageActions,
		message: matrixMessageAdapter,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeMatrixAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => {
				const binding = normalizeMatrixAcpConversationId(compiledBinding.conversationId);
				if (!binding) return null;
				if (binding.conversationId === conversationId) return {
					conversationId,
					matchPriority: 2
				};
				if (parentConversationId && parentConversationId !== conversationId && binding.conversationId === parentConversationId) return {
					conversationId: parentConversationId,
					matchPriority: 1
				};
				return null;
			},
			resolveCommandConversation: (params) => {
				const parentConversationId = [
					params.originatingTo,
					params.commandTo,
					params.fallbackTo
				].map((candidate) => {
					const trimmed = candidate?.trim();
					if (!trimmed) return;
					const target = resolveMatrixTargetIdentity(trimmed);
					return target?.kind === "room" ? target.id : void 0;
				}).find((candidate) => Boolean(candidate));
				if (params.threadId) return {
					conversationId: params.threadId,
					...parentConversationId ? { parentConversationId } : {}
				};
				return parentConversationId ? { conversationId: parentConversationId } : null;
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("matrix", accounts),
			buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { baseUrl: snapshot.baseUrl ?? null }),
			probeAccount: async ({ account, timeoutMs, cfg }) => {
				try {
					const runtime = await loadMatrixChannelRuntime();
					const auth = await runtime.resolveMatrixAuth({
						cfg,
						accountId: account.accountId
					});
					return await runtime.probeMatrix({
						homeserver: auth.homeserver,
						accessToken: auth.accessToken,
						userId: auth.userId,
						deviceId: auth.deviceId,
						timeoutMs: timeoutMs ?? 5e3,
						accountId: account.accountId,
						allowPrivateNetwork: auth.allowPrivateNetwork,
						ssrfPolicy: auth.ssrfPolicy,
						dispatcherPolicy: auth.dispatcherPolicy
					});
				} catch (err) {
					return {
						ok: false,
						error: formatErrorMessage(err),
						elapsedMs: 0
					};
				}
			},
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					baseUrl: account.homeserver,
					lastProbeAt: runtime?.lastProbeAt ?? null,
					lastInboundAt: runtime?.lastInboundAt ?? null,
					lastOutboundAt: runtime?.lastOutboundAt ?? null
				}
			})
		}),
		gateway: { startAccount: async (ctx) => {
			const account = ctx.account;
			ctx.setStatus({
				accountId: account.accountId,
				baseUrl: account.homeserver
			});
			ctx.log?.info(`[${account.accountId}] starting provider (${account.homeserver ?? "matrix"})`);
			const { monitorMatrixProvider } = await loadMatrixMonitorModule();
			return monitorMatrixProvider({
				runtime: ctx.runtime,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				mediaMaxMb: account.config.mediaMaxMb,
				initialSyncLimit: account.config.initialSyncLimit,
				replyToMode: account.config.replyToMode,
				accountId: account.accountId,
				setStatus: ctx.setStatus
			});
		} },
		doctor: matrixDoctor,
		heartbeat: {
			sendTyping: ({ cfg, to, accountId }) => sendMatrixHeartbeatTyping(to, true, cfg, accountId),
			clearTyping: ({ cfg, to, accountId }) => sendMatrixHeartbeatTyping(to, false, cfg, accountId)
		}
	},
	security: {
		resolveDmPolicy: resolveMatrixDmPolicy,
		collectWarnings: ({ account, cfg }) => {
			const params = {
				account,
				cfg
			};
			const findings = collectMatrixOpenGroupFindings(params);
			if (params.account.accountId !== DEFAULT_ACCOUNT_ID || params.account.config.autoJoin !== "always") return findings;
			const autoJoinPath = resolveMatrixAccountConfigPath(params.account.accountId, "autoJoin");
			const autoJoinAllowlistPath = resolveMatrixAccountConfigPath(params.account.accountId, "autoJoinAllowlist");
			return [...findings, `- Matrix invites: autoJoin="always" joins any invited room before message policy applies. Set ${autoJoinPath}="allowlist" + ${autoJoinAllowlistPath} (or ${autoJoinPath}="off") to restrict joins.`];
		}
	},
	pairing: { text: {
		idLabel: "matrixUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^matrix:/i),
		notify: async ({ id, message, cfg, accountId }) => {
			await (await loadMatrixChannelRuntime()).sendMessageMatrix(`user:${id}`, message, {
				cfg,
				...accountId ? { accountId } : {}
			});
		}
	} },
	threading: {
		matchesToolContextTarget: matchesMatrixToolContextRoom,
		resolveAutoThreadId: ({ to, toolContext }) => {
			const threadId = normalizeOptionalString(toolContext?.currentThreadTs);
			if (!threadId || !toolContext) return;
			return matchesMatrixToolContextRoom({
				target: to,
				toolContext
			}) ? threadId : void 0;
		},
		resolveReplyToMode: createScopedAccountReplyToModeResolver({
			resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccountConfig),
			resolveReplyToMode: (account) => account.replyToMode
		}),
		buildToolContext: ({ context, hasRepliedRef }) => {
			const currentTarget = context.To;
			return {
				currentChannelId: normalizeOptionalString(currentTarget),
				currentThreadTs: context.MessageThreadId != null ? String(context.MessageThreadId) : void 0,
				currentDirectUserId: resolveMatrixDirectUserId({
					from: context.From,
					to: context.To,
					chatType: context.ChatType
				}),
				hasRepliedRef
			};
		}
	},
	outbound: matrixChannelOutbound
});
export { resolveMatrixInboundRouteAsync as a, resolveMatrixRoomConfig as i, resolveMatrixStoredSessionMeta as n, resolveMatrixThreadRouting as o, matrixPresentationCapabilities as r, approval_reaction_auth_exports as s, matrixPlugin as t };
