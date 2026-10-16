import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-BzoaiFSD.mjs";
import { n as buildChannelConfigSchema, t as GoogleChatConfigSchema } from "./config-api-CsD0IFxF.mjs";
import { c as resolveDefaultGoogleChatAccountId, l as resolveGoogleChatAccount, n as createGoogleChatPluginBase, o as inspectGoogleChatAccount, s as listGoogleChatAccountIds, t as GOOGLECHAT_CHANNEL_ID } from "./channel-base-BdCGLoFe.mjs";
import { a as googlechatPairingTextAdapter, f as isGoogleChatSpaceTarget, h as resolveGoogleChatOutboundSessionRoute, i as googlechatOutboundAdapter, m as normalizeGoogleChatTarget, n as googlechatGroupsAdapter, o as googlechatSecurityAdapter, p as isGoogleChatUserTarget, r as googlechatMessageAdapter, s as googlechatThreadingAdapter, t as googlechatDirectoryAdapter } from "./channel.adapters-CcYyfMMC.mjs";
import { n as googleChatApprovalAuth, r as normalizeGoogleChatApproverId, t as getGoogleChatApprovalApprovers } from "./approval-auth-7RuArHyo.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-020OItNt.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { createApproverRestrictedNativeApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY, createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelApproverDmTargetResolver, createChannelNativeOriginTargetResolver, createNativeApprovalChannelRouteGates, shouldSuppressLocalNativeExecApprovalPrompt } from "openclaw/plugin-sdk/approval-native-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAccountStatusSink, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { buildMutableAllowEntryDetector, collectStandardAllowlistLists, createDangerousNameMatchingMutableAllowlistWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { channelBlockedPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
//#region extensions/googlechat/src/approval-native.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
function isGoogleChatApprovalTransportEnabled(params) {
	const account = resolveGoogleChatAccount(params);
	return account.enabled && account.credentialSource !== "none" && account.tokenStatus !== "configured_unavailable" && Boolean(normalizeOptionalString(account.config.audience)) && (account.config.audienceType === "project-number" || account.config.audienceType === "app-url");
}
function normalizeGoogleChatForwardTarget(target) {
	if (normalizeLowercaseStringOrEmpty(target.channel) !== "googlechat") return null;
	const to = normalizeGoogleChatTarget(target.to);
	return to ? {
		to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: target.threadId ?? null
	} : null;
}
function resolveTurnSourceGoogleChatOriginTarget(request) {
	if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "googlechat") return null;
	const target = normalizeGoogleChatTarget(request.request.turnSourceTo ?? "");
	if (!target || !isGoogleChatSpaceTarget(target)) return null;
	return {
		to: target,
		accountId: normalizeOptionalString(request.request.turnSourceAccountId),
		threadId: request.request.turnSourceThreadId ?? null
	};
}
const googleChatApprovalRouteGates = createNativeApprovalChannelRouteGates({
	channel: "googlechat",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isGoogleChatApprovalTransportEnabled,
	listAccountIds: listGoogleChatAccountIds,
	resolveDefaultAccountId: resolveDefaultGoogleChatAccountId,
	normalizeForwardTarget: normalizeGoogleChatForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget
});
function isGoogleChatNativeApprovalClientEnabled(params) {
	return googleChatApprovalRouteGates.canAnyApprovalPotentiallyRouteToChannel({
		...params,
		nativeSessionOnly: true
	}) && getGoogleChatApprovalApprovers(params).length > 0;
}
function resolveSessionGoogleChatOriginTarget(sessionTarget) {
	const target = normalizeGoogleChatTarget(sessionTarget.to);
	return target && isGoogleChatSpaceTarget(target) ? {
		to: target,
		threadId: sessionTarget.threadId ?? null
	} : null;
}
function shouldHandleGoogleChatNativeApprovalRequest(params) {
	return googleChatApprovalRouteGates.shouldHandleApprovalRequest(params) && getGoogleChatApprovalApprovers(params).length > 0 && Boolean(resolveTurnSourceGoogleChatOriginTarget(params.request));
}
function shouldSuppressLocalGoogleChatExecApprovalPrompt(params) {
	return shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled
	});
}
const resolveGoogleChatOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "googlechat",
	shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
	resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget,
	resolveSessionTarget: resolveSessionGoogleChatOriginTarget
});
const resolveGoogleChatApproverDmTargets = createChannelApproverDmTargetResolver({
	shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
	resolveApprovers: getGoogleChatApprovalApprovers,
	mapApprover: (approver, params) => {
		const to = normalizeGoogleChatApproverId(approver);
		return to ? {
			to,
			accountId: normalizeOptionalString(params.accountId)
		} : null;
	}
});
const googleChatApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "googlechat",
	channelLabel: "Google Chat",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.googlechat.accounts.${accountId}` : "channels.googlechat";
		return `Approve it from the Web UI for now. Google Chat supports native approvals for this account when the webhook and service account are configured. Configure \`${prefix}.allowFrom\` or \`${prefix}.defaultTo\` with numeric \`users/{id}\` approvers.`;
	},
	listAccountIds: listGoogleChatAccountIds,
	hasApprovers: ({ cfg, accountId }) => getGoogleChatApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "exec"
	})?.authorized ?? false,
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "plugin"
	})?.authorized ?? false,
	isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled,
	resolveNativeDeliveryMode: () => "channel",
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: resolveGoogleChatOriginTarget,
	resolveApproverDmTargets: resolveGoogleChatApproverDmTargets,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: isGoogleChatNativeApprovalClientEnabled,
		shouldHandle: shouldHandleGoogleChatNativeApprovalRequest,
		load: async () => (await import("./approval-handler.runtime-D0dWJcjH.mjs")).googleChatApprovalNativeRuntime
	})
});
//#endregion
//#region extensions/googlechat/src/doctor.ts
const isGoogleChatMutableAllowEntry = buildMutableAllowEntryDetector({
	prefixes: [
		"googlechat:",
		"google-chat:",
		"gchat:",
		"users/"
	],
	stableIdPattern: /^[^@]+$/
});
const collectGoogleChatMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "googlechat",
	detector: isGoogleChatMutableAllowEntry,
	collectLists: (scope) => collectStandardAllowlistLists(scope, {
		includeGroups: true,
		groupField: "users"
	})
});
//#endregion
//#region extensions/googlechat/src/gateway.ts
const loadGoogleChatChannelRuntime$1 = createLazyRuntimeNamedExport(() => import("./channel.runtime-BEP3QsS4.mjs"), "googleChatChannelRuntime");
const UNRESOLVED_WEBHOOK_URL_ERROR = "Invalid webhookUrl: expected an absolute URL such as https://chat.example.com/googlechat. No inbound webhook route was registered.";
async function startGoogleChatGatewayAccount(ctx) {
	const account = ctx.account;
	const statusSink = createAccountStatusSink({
		accountId: account.accountId,
		setStatus: ctx.setStatus
	});
	ctx.log?.info?.(`[${account.accountId}] starting Google Chat webhook`);
	const { resolveGoogleChatWebhookPath, startGoogleChatMonitor } = await loadGoogleChatChannelRuntime$1();
	const webhookPath = resolveGoogleChatWebhookPath(account.config);
	statusSink({
		running: true,
		lastStartAt: Date.now(),
		...webhookPath ? {
			webhookPath,
			lifecycle: "starting"
		} : channelBlockedPatch(UNRESOLVED_WEBHOOK_URL_ERROR, { webhookPath: void 0 }),
		audienceType: account.config.audienceType,
		audience: account.config.audience
	});
	if (isGoogleChatNativeApprovalClientEnabled({
		cfg: ctx.cfg,
		accountId: account.accountId
	})) registerChannelRuntimeContext({
		channelRuntime: ctx.channelRuntime,
		channelId: "googlechat",
		accountId: account.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
		context: { account },
		abortSignal: ctx.abortSignal
	});
	try {
		await runPassiveAccountLifecycle({
			abortSignal: ctx.abortSignal,
			start: async () => await startGoogleChatMonitor({
				account,
				config: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				webhookPath: account.config.webhookPath,
				webhookUrl: account.config.webhookUrl,
				statusSink
			}),
			stop: async (unregister) => {
				await unregister?.();
			}
		});
	} finally {
		statusSink({
			running: false,
			lastStopAt: Date.now()
		});
	}
}
//#endregion
//#region extensions/googlechat/src/message-tool-api.ts
function describeGoogleChatMessageTool({ cfg, accountId }) {
	return (accountId ? [inspectGoogleChatAccount({
		cfg,
		accountId
	})] : listGoogleChatAccountIds(cfg).map((listedAccountId) => inspectGoogleChatAccount({
		cfg,
		accountId: listedAccountId
	}))).some((account) => account.enabled && account.credentialSource !== "none" && account.tokenStatus === "available") ? { actions: ["send"] } : null;
}
const googlechatMessageActions = {
	describeMessageTool: describeGoogleChatMessageTool,
	supportsAction: ({ action }) => action === "send",
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async (ctx) => (await import("./actions-BtW6Mbtw.mjs")).handleGoogleChatAction(ctx)
};
//#endregion
//#region extensions/googlechat/src/channel.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-BEP3QsS4.mjs"), "googleChatChannelRuntime");
const googlechatPlugin = createChatChannelPlugin({
	base: {
		...createGoogleChatPluginBase({ configSchema: buildChannelConfigSchema(GoogleChatConfigSchema) }),
		approvalCapability: googleChatApprovalCapability,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		groups: googlechatGroupsAdapter,
		messaging: {
			targetPrefixes: [
				"googlechat",
				"google-chat",
				"gchat"
			],
			targetIdComparison: "case-sensitive",
			normalizeTarget: normalizeGoogleChatTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeGoogleChatTarget(to);
				if (!target) return;
				if (isGoogleChatUserTarget(target)) return "direct";
				return isGoogleChatSpaceTarget(target) ? "group" : void 0;
			},
			resolveOutboundSessionRoute: resolveGoogleChatOutboundSessionRoute,
			targetResolver: {
				looksLikeId: (raw, normalized) => {
					const value = normalized ?? raw.trim();
					return isGoogleChatSpaceTarget(value) || isGoogleChatUserTarget(value);
				},
				hint: "<spaces/{space}|users/{user}>"
			}
		},
		directory: googlechatDirectoryAdapter,
		message: googlechatMessageAdapter,
		resolver: { resolveTargets: async ({ inputs, kind }) => {
			return inputs.map((input) => {
				const normalized = normalizeGoogleChatTarget(input);
				if (!normalized) return {
					input,
					resolved: false,
					note: "empty target"
				};
				if (kind === "user" && isGoogleChatUserTarget(normalized)) return {
					input,
					resolved: true,
					id: normalized
				};
				if (kind === "group" && isGoogleChatSpaceTarget(normalized)) return {
					input,
					resolved: true,
					id: normalized
				};
				return {
					input,
					resolved: false,
					note: "use spaces/{space} or users/{user}"
				};
			});
		} },
		actions: googlechatMessageActions,
		doctor: {
			dmAllowFromMode: "topOnly",
			groupModel: "route",
			groupAllowFromFallbackToAllowFrom: false,
			warnOnEmptyGroupSenderAllowlist: false,
			legacyConfigRules,
			normalizeCompatibilityConfig,
			collectMutableAllowlistWarnings: collectGoogleChatMutableAllowlistWarnings
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => accounts.flatMap((entry) => {
				if (entry.enabled === false || entry.configured !== true) return [];
				return [!entry.audience && "Google Chat audience is missing (set channels.googlechat.audience).", !entry.audienceType && "Google Chat audienceType is missing (app-url or project-number)."].flatMap((message) => message ? [{
					channel: GOOGLECHAT_CHANNEL_ID,
					accountId: entry.accountId ?? DEFAULT_ACCOUNT_ID,
					kind: "config",
					message,
					fix: "Set channels.googlechat.audienceType and channels.googlechat.audience."
				}] : []);
			}),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
				credentialSource: snapshot.credentialSource ?? "none",
				audienceType: snapshot.audienceType ?? null,
				audience: snapshot.audience ?? null,
				webhookPath: snapshot.webhookPath ?? null,
				webhookUrl: snapshot.webhookUrl ?? null
			}),
			probeAccount: async ({ account }) => (await loadGoogleChatChannelRuntime()).probeGoogleChat(account),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.credentialSource !== "none",
				extra: {
					credentialSource: account.credentialSource,
					tokenStatus: account.tokenStatus,
					audienceType: account.config.audienceType,
					audience: account.config.audience,
					webhookPath: account.config.webhookPath,
					webhookUrl: account.config.webhookUrl,
					dmPolicy: account.config.dmPolicy ?? "pairing"
				}
			})
		}),
		gateway: { startAccount: startGoogleChatGatewayAccount }
	},
	pairing: { text: googlechatPairingTextAdapter },
	security: googlechatSecurityAdapter,
	threading: googlechatThreadingAdapter,
	outbound: {
		...googlechatOutboundAdapter,
		base: {
			...googlechatOutboundAdapter.base,
			shouldSuppressLocalPayloadPrompt: shouldSuppressLocalGoogleChatExecApprovalPrompt
		}
	}
});
//#endregion
export { isGoogleChatNativeApprovalClientEnabled as n, shouldHandleGoogleChatNativeApprovalRequest as r, googlechatPlugin as t };
