import { i as requiresExplicitMatrixDefaultAccount, n as findMatrixAccountEntry, r as hasImplicitMatrixAccountConfig } from "./account-selection-BHkfU1eC.mjs";
import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { i as resolveMatrixAccount, r as resolveDefaultMatrixAccountId, t as listMatrixAccountIds } from "./accounts-iThMol10.mjs";
import { a as normalizeMatrixUserId, r as DEFAULT_ACCOUNT_ID$2, t as matrixPluginBase } from "./channel.setup-C6KvBV8l.mjs";
import { t as normalizeMatrixApproverId } from "./approval-ids-j08q8LEG.mjs";
import { a as resolveMatrixDirectUserId, i as normalizeMatrixResolvableTarget, n as isMatrixRoomId, o as resolveMatrixTargetIdentity, r as normalizeMatrixMessagingTarget, t as isMatrixQualifiedUserId } from "./target-ids-Nwx7cMVE.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-HyWFZQVG.mjs";
import { f as setMatrixThreadBindingMaxAgeBySessionKey, u as setMatrixThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings-shared-oNPiyMWY.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-JlB6VmI3.mjs";
import { n as resolveMatrixInboundConversation, t as defaultTopLevelPlacement } from "./thread-binding-api-DRMC62cs.mjs";
import { createLazyRuntimeModule, createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { adaptScopedAccountAccessor, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound, createReplyPrefixOptions, createRuntimeOutboundDelegates, createTypingCallbacks, logTypingFailure } from "openclaw/plugin-sdk/channel-outbound";
import { createAllowlistProviderOpenWarningCollector, createConditionalWarningCollector, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { createScopedAccountReplyToModeResolver } from "openclaw/plugin-sdk/conversation-runtime";
import { createChannelDirectoryAdapter, createResolvedDirectoryEntriesLister, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { buildProbeChannelStatusSummary, collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { Type } from "typebox";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createApproverRestrictedNativeApprovalCapability, createChannelApprovalCapability, splitChannelApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelNativeOriginTargetResolver, doesApprovalRequestSelectChannelAccount, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { addAllowlistUserEntriesFromConfigEntry, buildAllowlistResolutionSummary, canonicalizeAllowlistWithResolvedIds, patchAllowlistUsersInConfigEntries, summarizeMapping } from "openclaw/plugin-sdk/allow-from";
import { createChannelExecApprovalProfile, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { buildAgentSessionKey, deriveLastRoutePolicy, parseThreadSessionSuffix, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { formatLocationText, logInboundDrop, toLocationContext } from "openclaw/plugin-sdk/channel-inbound";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-local-roots";
import { buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { resolveConfiguredAcpBindingRecord } from "openclaw/plugin-sdk/acp-binding-resolve-runtime";
import { inspectConversationBinding } from "openclaw/plugin-sdk/conversation-binding-inspection-runtime";
import { inspectRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { deliveryContextFromSession, getSessionEntry, resolveStorePath, sessionDeliveryOrigin } from "openclaw/plugin-sdk/session-store-runtime";
//#region extensions/matrix/src/actions.ts
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
const MATRIX_PROFILE_MEDIA_SOURCE_PARAMS = Object.freeze(["avatarUrl", "avatarPath"]);
function createMatrixExposedActions(params) {
	const actions = /* @__PURE__ */ new Set(["poll", "poll-vote"]);
	if (params.gate("messages")) {
		actions.add("send");
		actions.add("read");
		actions.add("edit");
		actions.add("delete");
	}
	if (params.gate("reactions")) {
		actions.add("react");
		actions.add("reactions");
		actions.add("emoji-list");
	}
	if (params.gate("pins")) {
		actions.add("pin");
		actions.add("unpin");
		actions.add("list-pins");
	}
	if (params.gate("profile") && params.senderIsOwner === true) actions.add("set-profile");
	if (params.gate("memberInfo")) actions.add("member-info");
	if (params.gate("channelInfo")) actions.add("channel-info");
	if (params.encryptionEnabled && params.gate("verification") && params.senderIsOwner === true) actions.add("permissions");
	return actions;
}
function buildMatrixProfileToolSchema() {
	return {
		actions: ["set-profile"],
		properties: {
			displayName: Type.Optional(Type.String({ description: "Profile display name for Matrix self-profile update actions." })),
			display_name: Type.Optional(Type.String({ description: "snake_case alias of displayName for Matrix self-profile update actions." })),
			...MATRIX_PROFILE_MEDIA_PROPERTIES
		}
	};
}
function resolveMatrixActionAccount(params) {
	if (!params.accountId && requiresExplicitMatrixDefaultAccount(params.cfg)) return null;
	const account = resolveMatrixAccount({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMatrixAccountId(params.cfg)
	});
	return account.enabled && account.configured ? account : null;
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
	describeMessageTool: ({ cfg, accountId, senderIsOwner }) => {
		const account = resolveMatrixActionAccount({
			cfg,
			accountId
		});
		if (!account) return {
			actions: [],
			capabilities: []
		};
		const actions = createMatrixExposedActions({
			gate: createActionGate(account.config.actions),
			encryptionEnabled: account.config.encryption === true,
			senderIsOwner
		});
		const listedActions = Array.from(actions);
		const schema = [];
		if (actions.has("set-profile")) schema.push(buildMatrixProfileToolSchema());
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
	},
	supportsAction: ({ action }) => MATRIX_PLUGIN_HANDLED_ACTIONS.has(action),
	extractToolSend: ({ args }) => {
		return extractToolSend(args, "sendMessage");
	},
	prepareSendPayload: ({ ctx, payload }) => {
		if (ctx.action !== "send") return null;
		const account = resolveMatrixActionAccount({
			cfg: ctx.cfg,
			accountId: ctx.accountId
		});
		return account && createActionGate(account.config.actions)("messages") ? payload : null;
	},
	handleAction: async (ctx) => {
		const { handleMatrixAction } = await import("./tool-actions.runtime-REzYTNxm.mjs");
		return await handleMatrixAction(ctx);
	}
};
//#endregion
//#region extensions/matrix/src/approval-auth.ts
const matrixApproval = createChannelApprovalAuth({
	channelLabel: "Matrix",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveMatrixAccountConfig({
			cfg,
			accountId: accountId ?? resolveDefaultMatrixAccountId(cfg)
		}).dm?.allowFrom };
	},
	normalizeApprover: normalizeMatrixApproverId
});
const getMatrixApprovalAuthApprovers = matrixApproval.resolveApprovers;
const matrixApprovalAuth = matrixApproval.approvalAuth;
//#endregion
//#region extensions/matrix/src/exec-approvals.ts
function normalizeMatrixExecApproverId(value) {
	const normalized = normalizeMatrixApproverId(value);
	return normalized === "*" ? void 0 : normalized;
}
function resolveMatrixExecApprovalConfig(params) {
	const account = resolveMatrixAccount(params);
	const config = account.config.execApprovals;
	if (!config) return;
	return {
		...config,
		enabled: account.enabled && account.configured ? config.enabled : false
	};
}
function isMatrixExecApprovalAccountEligible(params) {
	const account = resolveMatrixAccount(params);
	if (!account.enabled || !account.configured) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	const filters = config?.enabled ? {
		agentFilter: config.agentFilter,
		sessionFilter: config.sessionFilter
	} : {
		agentFilter: void 0,
		sessionFilter: void 0
	};
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: filters.agentFilter,
		sessionFilter: filters.sessionFilter
	});
}
function matchesMatrixRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultMatrixAccountId(params.cfg);
	return doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "matrix",
		defaultAccountId: resolveDefaultMatrixAccountId(params.cfg),
		eligibleAccountIds: isMatrixExecApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	});
}
function getMatrixExecApprovalApprovers(params) {
	const account = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMatrixAccountId(params.cfg)
	});
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers,
		allowFrom: account.dm?.allowFrom,
		normalizeApprover: normalizeMatrixExecApproverId
	});
}
function getMatrixApprovalApprovers(params) {
	if (params.approvalKind === "plugin") return getMatrixApprovalAuthApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return getMatrixExecApprovalApprovers(params);
}
function isMatrixExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "matrix",
		normalizeSenderId: normalizeMatrixApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeMatrixApproverId(target.to) === normalizedSenderId
	});
}
const matrixExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: resolveMatrixExecApprovalConfig,
	resolveApprovers: getMatrixExecApprovalApprovers,
	normalizeSenderId: normalizeMatrixApproverId,
	isTargetRecipient: isMatrixExecApprovalTargetRecipient,
	matchesRequestAccount: (params) => matchesMatrixRequestAccount({
		...params,
		approvalKind: "exec"
	})
});
const isMatrixExecApprovalClientEnabled = matrixExecApprovalProfile.isClientEnabled;
const isMatrixExecApprovalAuthorizedSender = matrixExecApprovalProfile.isAuthorizedSender;
const resolveMatrixExecApprovalTarget = matrixExecApprovalProfile.resolveTarget;
function isMatrixApprovalClientEnabled(params) {
	if (params.approvalKind === "exec" || params.approvalKind === "system-agent") return isMatrixExecApprovalClientEnabled(params);
	const config = resolveMatrixExecApprovalConfig(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	});
}
function isMatrixAnyApprovalClientEnabled(params) {
	return isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "exec"
	}) || isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "plugin"
	}) || isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "system-agent"
	});
}
function shouldHandleMatrixApprovalRequest(params) {
	if (params.approvalKind !== "exec" && params.approvalKind !== "plugin" && params.approvalKind !== "system-agent") return false;
	if (!matchesMatrixRequestAccount({
		...params,
		approvalKind: params.approvalKind
	})) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	if (!isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers({
			...params,
			approvalKind: params.approvalKind
		}).length
	})) return false;
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function buildFilterCheckRequest(params) {
	if (params.metadata.approvalKind === "plugin") return {
		approvalKind: "plugin",
		id: params.metadata.approvalId,
		request: {
			title: "Plugin Approval Required",
			description: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
	return {
		approvalKind: "exec",
		id: params.metadata.approvalId,
		request: {
			command: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
}
function shouldSuppressLocalMatrixExecApprovalPrompt(params) {
	if (!matrixExecApprovalProfile.shouldSuppressLocalPrompt(params)) return false;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata) return false;
	const request = buildFilterCheckRequest({ metadata });
	return shouldHandleMatrixApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: metadata.approvalKind,
		request
	});
}
//#endregion
//#region extensions/matrix/src/approval-native.ts
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
function normalizeMatrixOriginTarget(target) {
	return {
		...target,
		to: normalizeComparableTarget(target.to)
	};
}
function hasMatrixPluginApprovers(params) {
	return getMatrixApprovalAuthApprovers(params).length > 0;
}
function availabilityState(enabled) {
	return enabled ? { kind: "enabled" } : { kind: "disabled" };
}
function hasMatrixApprovalApprovers(params) {
	return getMatrixApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: params.approvalKind
	}).length > 0;
}
function hasAnyMatrixApprovalApprovers(params) {
	return getMatrixExecApprovalApprovers(params).length > 0 || getMatrixApprovalAuthApprovers(params).length > 0;
}
function isMatrixPluginAuthorizedSender(params) {
	const normalizedSenderId = params.senderId ? normalizeMatrixApproverId(params.senderId) : void 0;
	if (!normalizedSenderId) return false;
	return getMatrixApprovalAuthApprovers(params).includes(normalizedSenderId);
}
function resolveSuppressionAccountId(params) {
	return params.target.accountId?.trim() || params.request.request.turnSourceAccountId?.trim() || void 0;
}
const resolveMatrixOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "matrix",
	shouldHandleRequest: ({ cfg, accountId, approvalKind, request }) => {
		if (approvalKind !== "exec" && approvalKind !== "plugin" && approvalKind !== "system-agent") return false;
		return shouldHandleMatrixApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		});
	},
	resolveTurnSourceTarget: resolveTurnSourceMatrixOriginTarget,
	resolveSessionTarget: resolveSessionMatrixOriginTarget,
	normalizeTargetForMatch: normalizeMatrixOriginTarget,
	resolveFallbackTarget: (request) => {
		const sessionConversation = resolveApprovalRequestSessionConversation({
			request,
			channel: "matrix"
		});
		if (!sessionConversation) return null;
		const target = resolveMatrixNativeTarget(sessionConversation.id);
		if (!target) return null;
		return {
			to: target,
			threadId: normalizeOptionalStringifiedId(sessionConversation.threadId)
		};
	}
});
function resolveMatrixApproverDmTargets(params) {
	if (!shouldHandleMatrixApprovalRequest(params)) return [];
	return getMatrixApprovalApprovers(params).map((approver) => {
		const normalized = normalizeMatrixUserId(approver);
		return normalized ? { to: `user:${normalized}` } : null;
	}).filter((target) => target !== null);
}
const matrixNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "matrix",
	channelLabel: "Matrix",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.matrix.accounts.${accountId}` : "channels.matrix";
		return `Approve it from the Web UI or terminal UI for now. Matrix supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`${prefix}.dm.allowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
	},
	listAccountIds: listMatrixAccountIds,
	hasApprovers: ({ cfg, accountId }) => hasAnyMatrixApprovalApprovers({
		cfg,
		accountId
	}),
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => isMatrixExecApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => isMatrixPluginAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isNativeDeliveryEnabled: ({ cfg, accountId }) => isMatrixExecApprovalClientEnabled({
		cfg,
		accountId
	}),
	resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveMatrixExecApprovalTarget({
		cfg,
		accountId
	}),
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId,
	resolveOriginTarget: resolveMatrixOriginTarget,
	resolveApproverDmTargets: resolveMatrixApproverDmTargets,
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: ({ cfg, accountId }) => isMatrixAnyApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleMatrixApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-9W7R2ZMq.mjs")).matrixApprovalNativeRuntime
	})
});
const splitMatrixApprovalCapability = splitChannelApprovalCapability(matrixNativeApprovalCapability);
const matrixBaseNativeApprovalAdapter = splitMatrixApprovalCapability.native;
const matrixBaseDeliveryAdapter = splitMatrixApprovalCapability.delivery;
const matrixDeliveryAdapter = matrixBaseDeliveryAdapter && {
	...matrixBaseDeliveryAdapter,
	shouldSuppressForwardingFallback: (params) => {
		const accountId = resolveSuppressionAccountId(params);
		if (!hasMatrixApprovalApprovers({
			cfg: params.cfg,
			accountId,
			approvalKind: params.approvalKind
		})) return false;
		if (params.approvalKind === "plugin") {
			const targetChannel = normalizeLowercaseStringOrEmpty(params.target.channel);
			const turnSourceChannel = normalizeLowercaseStringOrEmpty(params.request.request.turnSourceChannel);
			return targetChannel === "matrix" && turnSourceChannel === "matrix" && shouldHandleMatrixApprovalRequest({
				cfg: params.cfg,
				accountId,
				approvalKind: "plugin",
				request: params.request
			});
		}
		return matrixBaseDeliveryAdapter.shouldSuppressForwardingFallback?.(params) ?? false;
	}
};
const matrixNativeAdapter = matrixBaseNativeApprovalAdapter && {
	describeDeliveryCapabilities: (params) => {
		const capabilities = matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities(params);
		const hasApprovers = hasMatrixApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId,
			approvalKind: params.approvalKind
		});
		const clientEnabled = isMatrixApprovalClientEnabled({
			cfg: params.cfg,
			accountId: params.accountId,
			approvalKind: params.approvalKind
		});
		return {
			...capabilities,
			enabled: hasApprovers && clientEnabled
		};
	},
	resolveOriginTarget: matrixBaseNativeApprovalAdapter.resolveOriginTarget,
	resolveApproverDmTargets: matrixBaseNativeApprovalAdapter.resolveApproverDmTargets
};
const matrixApprovalCapability = createChannelApprovalCapability({
	authorizeActorAction: (params) => {
		if (params.approvalKind !== "plugin") return matrixNativeApprovalCapability.authorizeActorAction?.(params) ?? { authorized: true };
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
		if (params.approvalKind === "plugin") return availabilityState(hasMatrixPluginApprovers({
			cfg: params.cfg,
			accountId: params.accountId
		}));
		return matrixNativeApprovalCapability.getActionAvailabilityState?.(params) ?? { kind: "disabled" };
	},
	getExecInitiatingSurfaceState: (params) => matrixNativeApprovalCapability.getExecInitiatingSurfaceState?.(params) ?? { kind: "disabled" },
	describeExecApprovalSetup: matrixNativeApprovalCapability.describeExecApprovalSetup,
	delivery: matrixDeliveryAdapter,
	nativeRuntime: matrixNativeApprovalCapability.nativeRuntime,
	native: matrixNativeAdapter,
	render: matrixNativeApprovalCapability.render
});
//#endregion
//#region extensions/matrix/src/channel-account-paths.ts
function createMatrixProbeAccount(params) {
	return async ({ account, timeoutMs, cfg }) => {
		try {
			const auth = await params.resolveMatrixAuth({
				cfg,
				accountId: account.accountId
			});
			return await params.probeMatrix({
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
	};
}
function createMatrixPairingText(sendMessageMatrix) {
	return {
		idLabel: "matrixUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^matrix:/i),
		notify: async ({ id, message, cfg, accountId }) => {
			await sendMessageMatrix(`user:${id}`, message, {
				cfg,
				...accountId ? { accountId } : {}
			});
		}
	};
}
//#endregion
//#region extensions/matrix/src/channel-message-adapter.ts
function createMatrixMessageAdapter(params) {
	const base = createChannelMessageAdapterFromOutbound({
		id: "matrix",
		outbound: params.outbound,
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
	return {
		...base,
		durableFinal: {
			...base.durableFinal,
			automaticUnknownSendReconciliation: true,
			capabilities: {
				...base.durableFinal?.capabilities,
				afterCommit: true,
				reconcileUnknownSend: true
			},
			reconcileUnknownSendKinds: {
				text: true,
				media: true
			},
			reconcileUnknownSend: async (ctx) => await (await params.getRuntime()).reconcileMatrixUnknownSend(ctx),
			afterUnknownSendTerminal: async (ctx) => await (await params.getRuntime()).cleanupMatrixDeliveryPlans({ queueId: ctx.queueId })
		},
		send: {
			...base.send,
			lifecycle: { afterCommit: async (ctx) => {
				if (!ctx.deliveryQueueId) return;
				await (await params.getRuntime()).cleanupMatrixDeliveryPlans({ queueId: ctx.deliveryQueueId });
			} }
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/rooms.ts
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
//#endregion
//#region extensions/matrix/src/group-mentions.ts
function resolveMatrixGroupScope(params) {
	const matrixConfig = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const tree = buildMatrixRoomScopeTree(matrixConfig.groups ?? matrixConfig.rooms);
	const roomId = normalizeMatrixResolvableTarget(params.groupId?.trim() ?? "");
	const groupChannel = normalizeMatrixResolvableTarget(params.groupChannel?.trim() ?? "");
	return {
		tree,
		path: resolveMatrixRoomScopePath({
			tree,
			roomId,
			aliases: groupChannel ? [groupChannel] : []
		})
	};
}
function resolveMatrixGroupRequireMention(params) {
	return resolveScopeRequireMention(resolveMatrixGroupScope(params));
}
function resolveMatrixGroupToolPolicy(params) {
	return resolveScopeToolsPolicy(resolveMatrixGroupScope(params));
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/threads.ts
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
//#endregion
//#region extensions/matrix/src/matrix/monitor/route.ts
function resolveMatrixDmSessionKey(params) {
	if (params.dmSessionScope !== "per-room") return params.fallbackSessionKey;
	return buildAgentSessionKey({
		agentId: params.agentId,
		channel: "matrix",
		accountId: params.accountId,
		peer: {
			kind: "channel",
			id: params.roomId
		}
	});
}
function resolveMatrixInboundRoute(params) {
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
	const bindingRef = {
		channel: "matrix",
		accountId: params.accountId,
		conversationId: bindingConversationId,
		parentConversationId: bindingParentConversationId
	};
	const inspection = inspectConversationBinding(bindingRef);
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
	const dmSessionKey = params.isDirectMessage && !configuredSessionKey ? resolveMatrixDmSessionKey({
		accountId: params.accountId,
		agentId: effectiveRoute.agentId,
		roomId: params.roomId,
		dmSessionScope: params.dmSessionScope,
		fallbackSessionKey: effectiveRoute.sessionKey
	}) : effectiveRoute.sessionKey;
	const routeWithDmScope = dmSessionKey === effectiveRoute.sessionKey ? effectiveRoute : {
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
		return {
			route: {
				...routeWithDmScope,
				sessionKey: threadKeys.sessionKey,
				mainSessionKey: threadKeys.parentSessionKey ?? routeWithDmScope.sessionKey,
				lastRoutePolicy: deriveLastRoutePolicy({
					sessionKey: threadKeys.sessionKey,
					mainSessionKey: threadKeys.parentSessionKey ?? routeWithDmScope.sessionKey
				})
			},
			configuredBinding,
			bindingOwnerAvailable: runtimeRoute.bindingOwnerAvailable ?? true,
			runtimeBindingId: runtimeBinding?.bindingId ?? null,
			pluginId: runtimeRoute.pluginId
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
//#endregion
//#region extensions/matrix/src/matrix/conversation-route-owner.ts
function resolveMatrixConversationRouteOwner(params) {
	const { cfg, conversation } = params;
	const accountId = normalizeAccountId(params.accountId);
	const accountConfig = findMatrixAccountEntry(cfg, accountId);
	if (cfg.channels?.matrix?.enabled === false || accountConfig?.enabled === false || !accountConfig && !hasImplicitMatrixAccountConfig(cfg, accountId)) return null;
	const roomId = conversation.nativeChannelId?.trim() || (conversation.kind === "direct" ? "" : conversation.peerId.trim());
	if (!roomId) return null;
	const isDirectMessage = conversation.kind === "direct";
	const result = resolveMatrixInboundRoute({
		cfg,
		accountId,
		roomId,
		senderId: conversation.peerId,
		isDirectMessage,
		threadId: conversation.threadId,
		resolveAgentRoute
	});
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
//#endregion
//#region extensions/matrix/src/resolver.ts
const loadMatrixChannelRuntime$1 = createLazyRuntimeNamedExport(() => import("./resolver.runtime-CuLQ2uHe.mjs"), "matrixResolverRuntime");
const matrixResolverAdapter = { resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) => (await loadMatrixChannelRuntime$1()).resolveMatrixTargets({
	cfg,
	accountId,
	inputs,
	kind,
	runtime
}) };
//#endregion
//#region extensions/matrix/src/matrix/session-store-metadata.ts
function resolveMatrixRoomTargetId(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const target = resolveMatrixTargetIdentity(trimmed);
	return target?.kind === "room" && target.id.startsWith("!") ? target.id : void 0;
}
function resolveMatrixSessionAccountId(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? normalizeAccountId(trimmed) : void 0;
}
function resolveMatrixStoredRoomId(params) {
	return resolveMatrixRoomTargetId(params.deliveryTo) ?? resolveMatrixRoomTargetId(params.originNativeChannelId) ?? resolveMatrixRoomTargetId(params.originTo);
}
function resolveMatrixStoredSessionMeta(entry) {
	if (!entry) return null;
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const channel = normalizeOptionalString(deliveryContext?.channel) ?? normalizeOptionalString(origin?.provider);
	const accountId = resolveMatrixSessionAccountId(deliveryContext?.accountId ?? origin?.accountId) ?? void 0;
	const roomId = resolveMatrixStoredRoomId({
		deliveryTo: deliveryContext?.to,
		originNativeChannelId: origin?.nativeChannelId,
		originTo: origin?.to
	});
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
//#endregion
//#region extensions/matrix/src/session-route.ts
function resolveEffectiveMatrixAccountId(params) {
	return normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg));
}
function resolveMatrixDmSessionScope(params) {
	return resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	}).dm?.sessionScope ?? "per-user";
}
function resolveMatrixCurrentDmRoomId(params) {
	const sessionKey = parseThreadSessionSuffix(params.currentSessionKey).baseSessionKey ?? params.currentSessionKey?.trim();
	if (!sessionKey) return;
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const currentSession = resolveMatrixStoredSessionMeta(getSessionEntry({
			storePath,
			sessionKey
		}));
		if (!currentSession) return;
		if (currentSession.accountId && currentSession.accountId !== params.accountId) return;
		if (!currentSession.directUserId || currentSession.directUserId !== params.targetUserId) return;
		return currentSession.roomId;
	} catch {
		return;
	}
}
function resolveMatrixOutboundSessionRoute(params) {
	const target = resolveMatrixTargetIdentity(params.resolvedTarget?.to ?? params.target) ?? resolveMatrixTargetIdentity(params.target);
	if (!target) return null;
	const effectiveAccountId = resolveEffectiveMatrixAccountId(params);
	const dmSessionScope = resolveMatrixDmSessionScope({
		cfg: params.cfg,
		accountId: effectiveAccountId
	});
	const roomScopedDmId = target.kind === "user" && dmSessionScope === "per-room" ? resolveMatrixCurrentDmRoomId({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: effectiveAccountId,
		currentSessionKey: params.currentSessionKey,
		targetUserId: target.id
	}) : void 0;
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
//#endregion
//#region extensions/matrix/src/channel.ts
let matrixStartupLock = Promise.resolve();
const loadMatrixChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-CnxR2JUK.mjs"), "matrixChannelRuntime");
const loadMatrixDoctorModule = createLazyRuntimeModule(() => import("./doctor-BLCvdOFo.mjs"));
function buildMatrixTrafficStatusSummary(snapshot) {
	return {
		lastInboundAt: snapshot?.lastInboundAt ?? null,
		lastOutboundAt: snapshot?.lastOutboundAt ?? null
	};
}
const matrixDoctor = {
	dmAllowFromMode: "nestedOnly",
	groupModel: "sender",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: true,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	runConfigSequence: async ({ cfg, env, shouldRepair }) => await (await loadMatrixDoctorModule()).runMatrixDoctorSequence({
		cfg,
		env,
		shouldRepair
	}),
	cleanStaleConfig: async ({ cfg }) => await (await loadMatrixDoctorModule()).cleanStaleMatrixPluginConfig(cfg)
};
const listMatrixDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
	kind: "user",
	resolveAccount: (cfg, accountId) => resolveMatrixAccountConfig({
		cfg,
		accountId: accountId ?? resolveDefaultMatrixAccountId(cfg)
	}),
	resolveSources: (account) => [
		account.dm?.allowFrom ?? [],
		account.groupAllowFrom ?? [],
		...Object.values(account.groups ?? account.rooms ?? {}).map((room) => room.users ?? [])
	],
	normalizeId: (entry) => {
		const raw = entry.replace(/^matrix:/i, "").trim();
		if (!raw || raw === "*") return null;
		const cleaned = normalizeLowercaseStringOrEmpty(raw).startsWith("user:") ? raw.slice(5).trim() : raw;
		return cleaned.startsWith("@") ? `user:${cleaned}` : cleaned;
	}
});
const listMatrixDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
	kind: "group",
	resolveAccount: (cfg, accountId) => resolveMatrixAccountConfig({
		cfg,
		accountId: accountId ?? resolveDefaultMatrixAccountId(cfg)
	}),
	resolveSources: (account) => [Object.keys(account.groups ?? account.rooms ?? {})],
	normalizeId: (entry) => {
		const raw = entry.replace(/^matrix:/i, "").trim();
		if (!raw || raw === "*") return null;
		const lowered = normalizeLowercaseStringOrEmpty(raw);
		if (lowered.startsWith("room:") || lowered.startsWith("channel:")) return raw;
		return raw.startsWith("!") ? `room:${raw}` : raw;
	}
});
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
	return accountId === DEFAULT_ACCOUNT_ID$2 ? `channels.matrix.${field}` : `channels.matrix.accounts.${accountId}.${field}`;
}
function collectMatrixGroupPolicyWarningsForAccount(params) {
	const warnings = collectMatrixGroupPolicyWarnings(params);
	if (params.account.accountId !== DEFAULT_ACCOUNT_ID$2) {
		const groupPolicyPath = resolveMatrixAccountConfigPath(params.account.accountId, "groupPolicy");
		const groupsPath = resolveMatrixAccountConfigPath(params.account.accountId, "groups");
		const groupAllowFromPath = resolveMatrixAccountConfigPath(params.account.accountId, "groupAllowFrom");
		return warnings.map((warning) => warning.replace("channels.matrix.groupPolicy", groupPolicyPath).replace("channels.matrix.groups", groupsPath).replace("channels.matrix.groupAllowFrom", groupAllowFromPath));
	}
	return warnings;
}
const collectMatrixOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectMatrixGroupPolicyWarningsForAccount,
	checkId: "channels.matrix.groups.open",
	severity: "warn",
	title: "Matrix security warning"
});
function collectMatrixSecurityWarningsForAccount(params) {
	const findings = collectMatrixOpenGroupFindings(params);
	if (params.account.accountId !== DEFAULT_ACCOUNT_ID$2 || params.account.config.autoJoin !== "always") return findings;
	const autoJoinPath = resolveMatrixAccountConfigPath(params.account.accountId, "autoJoin");
	const autoJoinAllowlistPath = resolveMatrixAccountConfigPath(params.account.accountId, "autoJoinAllowlist");
	return [...findings, `- Matrix invites: autoJoin="always" joins any invited room before message policy applies. Set ${autoJoinPath}="allowlist" + ${autoJoinAllowlistPath} (or ${autoJoinPath}="off") to restrict joins.`];
}
function normalizeMatrixAcpConversationId(conversationId) {
	const target = resolveMatrixTargetIdentity(conversationId);
	if (!target || target.kind !== "room") return null;
	return { conversationId: target.id };
}
function matchMatrixAcpConversation(params) {
	const binding = normalizeMatrixAcpConversationId(params.bindingConversationId);
	if (!binding) return null;
	if (binding.conversationId === params.conversationId) return {
		conversationId: params.conversationId,
		matchPriority: 2
	};
	if (params.parentConversationId && params.parentConversationId !== params.conversationId && binding.conversationId === params.parentConversationId) return {
		conversationId: params.parentConversationId,
		matchPriority: 1
	};
	return null;
}
function resolveMatrixCommandConversation(params) {
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
function resolveMatrixDeliveryTarget(params) {
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
	chunker: chunkTextForOutbound,
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
	presentationCapabilities: {
		supported: true,
		buttons: true,
		selects: true,
		context: true,
		divider: true,
		limits: { text: {
			markdownDialect: "markdown",
			supportsEdit: true
		} }
	},
	shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload }) => shouldSuppressLocalMatrixExecApprovalPrompt({
		cfg,
		accountId,
		payload
	}),
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
const matrixMessageAdapter = createMatrixMessageAdapter({
	outbound: matrixChannelOutbound,
	getRuntime: loadMatrixChannelRuntime
});
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
			resolveRequireMention: resolveMatrixGroupRequireMention,
			resolveToolPolicy: resolveMatrixGroupToolPolicy
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
			}).map(projectMatrixConversationBinding)
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
			resolveInboundConversation: ({ to, conversationId, threadId }) => resolveMatrixInboundConversation({
				to,
				conversationId,
				threadId
			}),
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => resolveMatrixDeliveryTarget({
				conversationId,
				parentConversationId
			}),
			resolveOutboundSessionRoute: (params) => resolveMatrixOutboundSessionRoute(params),
			resolveConversationRouteOwner: resolveMatrixConversationRouteOwner,
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
		resolver: matrixResolverAdapter,
		actions: matrixMessageActions,
		message: matrixMessageAdapter,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeMatrixAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchMatrixAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			}),
			resolveCommandConversation: ({ threadId, originatingTo, commandTo, fallbackTo }) => resolveMatrixCommandConversation({
				threadId,
				originatingTo,
				commandTo,
				fallbackTo
			})
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$2),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("matrix", accounts),
			buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { baseUrl: snapshot.baseUrl ?? null }),
			probeAccount: async ({ account, timeoutMs, cfg }) => await createMatrixProbeAccount({
				resolveMatrixAuth: async ({ cfg: cfgLocal, accountId }) => (await loadMatrixChannelRuntime()).resolveMatrixAuth({
					cfg: cfgLocal,
					accountId
				}),
				probeMatrix: async (params) => await (await loadMatrixChannelRuntime()).probeMatrix(params)
			})({
				account,
				timeoutMs,
				cfg
			}),
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					baseUrl: account.homeserver,
					lastProbeAt: runtime?.lastProbeAt ?? null,
					...buildMatrixTrafficStatusSummary(runtime)
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
			const previousLock = matrixStartupLock;
			let releaseLock = () => {};
			matrixStartupLock = new Promise((resolve) => {
				releaseLock = resolve;
			});
			await previousLock;
			let monitorMatrixProvider;
			try {
				monitorMatrixProvider = (await import("./monitor-CzE3myC_.mjs")).monitorMatrixProvider;
			} finally {
				releaseLock();
			}
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
			sendTyping: async ({ cfg, to, accountId }) => {
				await (await loadMatrixChannelRuntime()).sendTypingMatrix(to, true, {
					cfg,
					...accountId ? { accountId } : {}
				});
			},
			clearTyping: async ({ cfg, to, accountId }) => {
				await (await loadMatrixChannelRuntime()).sendTypingMatrix(to, false, {
					cfg,
					...accountId ? { accountId } : {}
				});
			}
		}
	},
	security: {
		resolveDmPolicy: resolveMatrixDmPolicy,
		collectWarnings: ({ account, cfg }) => collectMatrixSecurityWarningsForAccount({
			account,
			cfg
		})
	},
	pairing: { text: createMatrixPairingText(async (to, message, options) => await (await loadMatrixChannelRuntime()).sendMessageMatrix(to, message, options)) },
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
//#endregion
export { toLocationContext as _, resolveMatrixRoomConfig as a, canonicalizeAllowlistWithResolvedIds as c, formatLocationText as d, getAgentScopedMediaLocalRoots as f, summarizeMapping as g, patchAllowlistUsersInConfigEntries as h, resolveMatrixThreadRouting as i, createReplyPrefixOptions as l, logTypingFailure as m, resolveMatrixStoredSessionMeta as n, addAllowlistUserEntriesFromConfigEntry as o, logInboundDrop as p, resolveMatrixInboundRoute as r, buildAllowlistResolutionSummary as s, matrixPlugin as t, createTypingCallbacks as u, isMatrixAnyApprovalClientEnabled as v, shouldHandleMatrixApprovalRequest as y };
