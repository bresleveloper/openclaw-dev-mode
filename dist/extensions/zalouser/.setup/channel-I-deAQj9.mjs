import { a as writeQrDataUrlToTempFile, c as resolveDefaultZalouserAccountId, i as zalouserSetupContract, l as resolveZalouserAccountSync, n as createZalouserSetupWizardProxy, o as checkZcaAuthenticated, s as listZalouserAccountIds, t as createZalouserPluginBase } from "./shared-Dv-QbpZj.mjs";
import { r as getZalouserRuntime } from "./doctor-contract-DcONa6Y4.mjs";
import { t as resolveZalouserDmSessionScope } from "./session-scope-BjOC6bJs.mjs";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createAccountStatusSink, defineChannelMessageAdapter } from "openclaw/plugin-sdk/channel-outbound";
import { buildPassiveProbedChannelStatusSummary, coerceStatusIssueAccountId, readStatusIssueFields } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, standardDmPolicyOpenIssue, standardNotConfiguredIssue } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { createEmptyChannelResult } from "openclaw/plugin-sdk/channel-send-result";
import { createStaticReplyToModeResolver } from "openclaw/plugin-sdk/conversation-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { isNumericTargetId, sendPayloadWithChunkedTextAndMedia } from "openclaw/plugin-sdk/reply-payload";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { buildChannelOutboundSessionRoute } from "openclaw/plugin-sdk/core";
//#region extensions/zalouser/src/group-policy.ts
const toGroupCandidate = (value) => value?.trim() ?? "";
function normalizeZalouserGroupSlug(raw) {
	return (normalizeOptionalLowercaseString(raw) ?? "").replace(/^#/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function buildZalouserGroupCandidates(params) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	const push = (value) => {
		const normalized = toGroupCandidate(value);
		if (!normalized || seen.has(normalized)) return;
		seen.add(normalized);
		out.push(normalized);
	};
	const groupId = toGroupCandidate(params.groupId);
	const groupChannel = toGroupCandidate(params.groupChannel);
	const groupName = toGroupCandidate(params.groupName);
	push(groupId);
	if (params.includeGroupIdAlias === true && groupId) push(`group:${groupId}`);
	if (params.allowNameMatching !== false) [
		groupChannel,
		groupName,
		normalizeZalouserGroupSlug(groupName)
	].forEach(push);
	if (params.includeWildcard !== false) push("*");
	return out;
}
function findZalouserGroupEntry(groups, candidates) {
	const { tree, path } = resolveZalouserGroupScope(groups, candidates);
	const key = path[0];
	return key ? tree.scopes[key] : void 0;
}
function resolveZalouserGroupScope(groups, candidates) {
	const tree = { scopes: groups ?? {} };
	const key = candidates.find((candidate) => candidate !== "*" && Object.hasOwn(tree.scopes, candidate)) ?? (candidates.includes("*") && Object.hasOwn(tree.scopes, "*") ? "*" : void 0);
	return {
		tree,
		path: key ? [key] : []
	};
}
function isZalouserGroupEntryAllowed(entry) {
	if (!entry) return false;
	return entry.allow !== false && entry.enabled !== false;
}
//#endregion
//#region extensions/zalouser/src/message-sid.ts
function parseZalouserMessageSidFull(value) {
	const raw = normalizeOptionalStringifiedId(value) ?? "";
	if (!raw) return null;
	const [msgIdPart, cliMsgIdPart] = raw.split(":").map((entry) => entry.trim());
	if (!msgIdPart || !cliMsgIdPart) return null;
	return {
		msgId: msgIdPart,
		cliMsgId: cliMsgIdPart
	};
}
function resolveZalouserReactionMessageIds(params) {
	const explicitMessageId = normalizeOptionalStringifiedId(params.messageId) ?? "";
	const explicitCliMsgId = normalizeOptionalStringifiedId(params.cliMsgId) ?? "";
	if (explicitMessageId && explicitCliMsgId) return {
		msgId: explicitMessageId,
		cliMsgId: explicitCliMsgId
	};
	const parsedFromCurrent = parseZalouserMessageSidFull(params.currentMessageId);
	if (parsedFromCurrent) return parsedFromCurrent;
	const currentRaw = normalizeOptionalStringifiedId(params.currentMessageId) ?? "";
	if (!currentRaw) return null;
	if (explicitMessageId && !explicitCliMsgId) return {
		msgId: explicitMessageId,
		cliMsgId: currentRaw
	};
	if (!explicitMessageId && explicitCliMsgId) return {
		msgId: currentRaw,
		cliMsgId: explicitCliMsgId
	};
	return {
		msgId: currentRaw,
		cliMsgId: currentRaw
	};
}
function formatZalouserMessageSidFull(params) {
	const msgId = normalizeOptionalStringifiedId(params.msgId) ?? "";
	const cliMsgId = normalizeOptionalStringifiedId(params.cliMsgId) ?? "";
	if (!msgId && !cliMsgId) return;
	if (msgId && cliMsgId) return `${msgId}:${cliMsgId}`;
	return msgId || cliMsgId || void 0;
}
function resolveZalouserMessageSid(params) {
	const msgId = normalizeOptionalStringifiedId(params.msgId) ?? "";
	const cliMsgId = normalizeOptionalStringifiedId(params.cliMsgId) ?? "";
	if (msgId || cliMsgId) return msgId || cliMsgId;
	return normalizeOptionalStringifiedId(params.fallback);
}
//#endregion
//#region extensions/zalouser/src/session-route.ts
function stripZalouserTargetPrefix(raw) {
	return raw.trim().replace(/^(zalouser|zlu):/i, "").trim();
}
function normalizeZalouserTarget(raw) {
	const trimmed = stripZalouserTargetPrefix(raw);
	if (!trimmed) return;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("group:")) {
		const id = trimmed.slice(6).trim();
		return id ? `group:${id}` : void 0;
	}
	if (lower.startsWith("g:")) {
		const id = trimmed.slice(2).trim();
		return id ? `group:${id}` : void 0;
	}
	if (lower.startsWith("user:")) {
		const id = trimmed.slice(5).trim();
		return id ? `user:${id}` : void 0;
	}
	if (lower.startsWith("dm:")) {
		const id = trimmed.slice(3).trim();
		return id ? `user:${id}` : void 0;
	}
	if (lower.startsWith("u:")) {
		const id = trimmed.slice(2).trim();
		return id ? `user:${id}` : void 0;
	}
	if (/^g-\S+$/i.test(trimmed)) return `group:${trimmed}`;
	if (/^u-\S+$/i.test(trimmed)) return `user:${trimmed}`;
	return trimmed;
}
function parseZalouserOutboundTarget(raw) {
	const normalized = normalizeZalouserTarget(raw);
	if (!normalized) throw new Error("Zalouser target is required");
	const lowered = normalizeLowercaseStringOrEmpty(normalized);
	if (lowered.startsWith("group:")) {
		const threadId = normalized.slice(6).trim();
		if (!threadId) throw new Error("Zalouser group target is missing group id");
		return {
			threadId,
			isGroup: true
		};
	}
	if (lowered.startsWith("user:")) {
		const threadId = normalized.slice(5).trim();
		if (!threadId) throw new Error("Zalouser user target is missing user id");
		return {
			threadId,
			isGroup: false
		};
	}
	return {
		threadId: normalized,
		isGroup: false
	};
}
function parseZalouserDirectoryGroupId(raw) {
	const normalized = normalizeZalouserTarget(raw);
	if (!normalized) throw new Error("Zalouser group target is required");
	const lowered = normalizeLowercaseStringOrEmpty(normalized);
	if (lowered.startsWith("group:")) {
		const groupId = normalized.slice(6).trim();
		if (!groupId) throw new Error("Zalouser group target is missing group id");
		return groupId;
	}
	if (lowered.startsWith("user:")) throw new Error("Zalouser group members lookup requires a group target (group:<id>)");
	return normalized;
}
function resolveZalouserOutboundSessionRoute(params) {
	const normalized = normalizeZalouserTarget(params.target);
	if (!normalized) return null;
	const isGroup = (normalizeOptionalLowercaseString(normalized) ?? "").startsWith("group:");
	const peerId = normalized.replace(/^(group|user):/i, "").trim();
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "zalouser",
		accountId: params.accountId,
		recipientSessionExact: isGroup,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		},
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `zalouser:group:${peerId}` : `zalouser:${peerId}`,
		to: `zalouser:${peerId}`
	});
}
//#endregion
//#region extensions/zalouser/src/channel.adapters.ts
const loadZalouserChannelRuntime$1 = createLazyRuntimeModule(() => import("./channel.runtime-DTVuNw4g.mjs"));
const ZALOUSER_TEXT_CHUNK_LIMIT = 2e3;
function resolveZalouserQrProfile(accountId) {
	const normalized = normalizeAccountId(accountId);
	if (!normalized || normalized === DEFAULT_ACCOUNT_ID) return process.env.ZALOUSER_PROFILE?.trim() || process.env.ZCA_PROFILE?.trim() || "default";
	return normalized;
}
function resolveZalouserOutboundChunkMode(cfg, accountId) {
	return getZalouserRuntime().channel.text.resolveChunkMode(cfg, "zalouser", accountId);
}
function resolveZalouserOutboundTextChunkLimit(cfg, accountId) {
	return getZalouserRuntime().channel.text.resolveTextChunkLimit(cfg, "zalouser", accountId, { fallbackLimit: ZALOUSER_TEXT_CHUNK_LIMIT });
}
function toZalouserMessageSendResult(result) {
	return {
		messageId: result.messageId,
		receipt: result.receipt
	};
}
function resolveZalouserGroupPolicyScope(params) {
	const account = resolveZalouserAccountSync({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0
	});
	return resolveZalouserGroupScope(account.config.groups, buildZalouserGroupCandidates({
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		allowNameMatching: isDangerousNameMatchingEnabled(account.config)
	}));
}
function resolveZalouserGroupToolPolicy(params) {
	return resolveScopeToolsPolicy(resolveZalouserGroupPolicyScope(params));
}
function resolveZalouserRequireMention(params) {
	return resolveScopeRequireMention(resolveZalouserGroupPolicyScope(params));
}
async function sendZalouserTextFromContext({ to, text, accountId, cfg, signal, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) {
	const { sendMessageZalouser } = await loadZalouserChannelRuntime$1();
	const account = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const target = parseZalouserOutboundTarget(to);
	return toZalouserMessageSendResult(await sendMessageZalouser(target.threadId, text, {
		profile: account.profile,
		signal,
		assertDirectAdapterHandoff,
		onPlatformSendDispatch,
		isGroup: target.isGroup,
		textMode: "markdown",
		textChunkMode: resolveZalouserOutboundChunkMode(cfg, account.accountId),
		textChunkLimit: resolveZalouserOutboundTextChunkLimit(cfg, account.accountId),
		onDeliveryResult: async (progress) => {
			await onDeliveryResult?.(toZalouserMessageSendResult(progress));
		}
	}));
}
async function sendZalouserMediaFromContext({ to, text, mediaUrl, accountId, cfg, mediaLocalRoots, mediaReadFile, signal, assertDirectAdapterHandoff, onPlatformSendDispatch, onDeliveryResult }) {
	const { sendMessageZalouser } = await loadZalouserChannelRuntime$1();
	const account = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const target = parseZalouserOutboundTarget(to);
	return toZalouserMessageSendResult(await sendMessageZalouser(target.threadId, text, {
		profile: account.profile,
		signal,
		assertDirectAdapterHandoff,
		onPlatformSendDispatch,
		isGroup: target.isGroup,
		mediaUrl,
		mediaLocalRoots,
		mediaReadFile,
		mediaMaxBytes: account.mediaMaxBytes,
		textMode: "markdown",
		textChunkMode: resolveZalouserOutboundChunkMode(cfg, account.accountId),
		textChunkLimit: resolveZalouserOutboundTextChunkLimit(cfg, account.accountId),
		onDeliveryResult: async (progress) => {
			await onDeliveryResult?.(toZalouserMessageSendResult(progress));
		}
	}));
}
function adaptZalouserOutboundProgress(onDeliveryResult) {
	return onDeliveryResult ? async (result) => {
		await onDeliveryResult(toZalouserOutboundDeliveryResult(result));
	} : void 0;
}
function toZalouserOutboundDeliveryResult(result) {
	return createEmptyChannelResult("zalouser", {
		messageId: result.messageId ?? result.receipt.primaryPlatformMessageId ?? result.receipt.platformMessageIds[0],
		receipt: result.receipt
	});
}
const zalouserRawSendResultAdapter = {
	sendText: async ({ onDeliveryResult, ...ctx }) => toZalouserOutboundDeliveryResult(await sendZalouserTextFromContext({
		...ctx,
		onDeliveryResult: adaptZalouserOutboundProgress(onDeliveryResult)
	})),
	sendMedia: async ({ onDeliveryResult, ...ctx }) => toZalouserOutboundDeliveryResult(await sendZalouserMediaFromContext({
		...ctx,
		onDeliveryResult: adaptZalouserOutboundProgress(onDeliveryResult)
	}))
};
const zalouserMessageAdapter = defineChannelMessageAdapter({
	id: "zalouser",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	send: {
		text: sendZalouserTextFromContext,
		media: sendZalouserMediaFromContext
	}
});
const resolveZalouserDmPolicy = createScopedDmSecurityResolver({
	channelKey: "zalouser",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.trim().replace(/^(zalouser|zlu):/i, "")
});
const zalouserGroupsAdapter = {
	resolveRequireMention: resolveZalouserRequireMention,
	resolveToolPolicy: resolveZalouserGroupToolPolicy
};
const zalouserMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		if ((accountId ? [resolveZalouserAccountSync({
			cfg,
			accountId
		})].filter((account) => account.enabled) : listZalouserAccountIds(cfg).map((resolvedAccountId) => resolveZalouserAccountSync({
			cfg,
			accountId: resolvedAccountId
		})).filter((account) => account.enabled)).length === 0) return null;
		return { actions: ["react"] };
	},
	supportsAction: ({ action }) => action === "react",
	handleAction: async ({ action, channel, params, cfg, accountId, toolContext }) => {
		if (action !== "react") throw new Error(`Zalouser action ${action} not supported`);
		const { sendReactionZalouser } = await loadZalouserChannelRuntime$1();
		const account = resolveZalouserAccountSync({
			cfg,
			accountId
		});
		const explicitTarget = (typeof params.threadId === "string" ? params.threadId.trim() : "") || (typeof params.to === "string" ? params.to.trim() : "") || (typeof params.chatId === "string" ? params.chatId.trim() : "");
		const currentTarget = toolContext?.currentChannelId?.trim() ?? "";
		const rawTarget = explicitTarget || currentTarget;
		if (!rawTarget) throw new Error("Zalouser react requires threadId (or to/chatId).");
		const target = parseZalouserOutboundTarget(rawTarget);
		const isGroup = typeof params.isGroup === "boolean" ? params.isGroup : target.isGroup || rawTarget === currentTarget && toolContext?.currentChannelProvider === channel && toolContext?.currentChatType === "group";
		const emoji = typeof params.emoji === "string" ? params.emoji.trim() : "";
		if (!emoji) throw new Error("Zalouser react requires emoji.");
		const ids = resolveZalouserReactionMessageIds({
			messageId: typeof params.messageId === "string" ? params.messageId : void 0,
			cliMsgId: typeof params.cliMsgId === "string" ? params.cliMsgId : void 0,
			currentMessageId: toolContext?.currentMessageId
		});
		if (!ids) throw new Error("Zalouser react requires messageId + cliMsgId (or a current message context id).");
		const result = await sendReactionZalouser({
			profile: account.profile,
			threadId: target.threadId,
			isGroup,
			msgId: ids.msgId,
			cliMsgId: ids.cliMsgId,
			emoji,
			remove: params.remove === true
		});
		if (!result.ok) throw new Error(result.error || "Failed to react on Zalo message");
		return {
			content: [{
				type: "text",
				text: params.remove === true ? `Removed reaction ${emoji} from ${ids.msgId}` : `Reacted ${emoji} on ${ids.msgId}`
			}],
			details: {
				messageId: ids.msgId,
				cliMsgId: ids.cliMsgId,
				threadId: target.threadId
			}
		};
	}
};
const zalouserResolverAdapter = { resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) => {
	const results = [];
	for (const input of inputs) {
		const trimmed = input.trim();
		if (!trimmed) {
			results.push({
				input,
				resolved: false,
				note: "empty input"
			});
			continue;
		}
		if (/^\d+$/.test(trimmed)) {
			results.push({
				input,
				resolved: true,
				id: trimmed
			});
			continue;
		}
		try {
			const runtimeModule = await loadZalouserChannelRuntime$1();
			const account = resolveZalouserAccountSync({
				cfg,
				accountId: accountId ?? resolveDefaultZalouserAccountId(cfg)
			});
			if (kind === "user") {
				const friends = await runtimeModule.listZaloFriendsMatching(account.profile, trimmed);
				const best = friends[0];
				results.push({
					input,
					resolved: Boolean(best?.userId),
					id: best?.userId,
					name: best?.displayName,
					note: friends.length > 1 ? "multiple matches; chose first" : void 0
				});
			} else {
				const groups = await runtimeModule.listZaloGroupsMatching(account.profile, trimmed);
				const best = groups.find((group) => normalizeLowercaseStringOrEmpty(group.name) === normalizeLowercaseStringOrEmpty(trimmed)) ?? groups[0];
				results.push({
					input,
					resolved: Boolean(best?.groupId),
					id: best?.groupId,
					name: best?.name,
					note: groups.length > 1 ? "multiple matches; chose first" : void 0
				});
			}
		} catch (err) {
			runtime.error?.(`zalouser resolve failed: ${String(err)}`);
			results.push({
				input,
				resolved: false,
				note: "lookup failed"
			});
		}
	}
	return results;
} };
const zalouserAuthAdapter = { login: async ({ cfg, accountId, runtime }) => {
	const { startZaloQrLogin, waitForZaloQrLogin } = await loadZalouserChannelRuntime$1();
	const account = resolveZalouserAccountSync({
		cfg,
		accountId: accountId ?? resolveDefaultZalouserAccountId(cfg)
	});
	runtime.log(`Generating QR login for Zalo Personal (account: ${account.accountId}, profile: ${account.profile})...`);
	const started = await startZaloQrLogin({
		profile: account.profile,
		timeoutMs: 35e3
	});
	if (!started.qrDataUrl) throw new Error(started.message || "Failed to start QR login");
	const qrPath = await writeQrDataUrlToTempFile(started.qrDataUrl, account.profile);
	if (qrPath) runtime.log(`Scan QR image: ${qrPath}`);
	else runtime.log("QR generated but could not be written to a temp file.");
	const waited = await waitForZaloQrLogin({
		profile: account.profile,
		timeoutMs: 18e4
	});
	if (!waited.connected) throw new Error(waited.message || "Zalouser login failed");
	runtime.log(waited.message);
} };
const zalouserSecurityAdapter = {
	resolveDmPolicy: resolveZalouserDmPolicy,
	dmRouting: { resolveDmScope: ({ cfg }) => resolveZalouserDmSessionScope(cfg) },
	collectAuditFindings: async (params) => (await loadZalouserChannelRuntime$1()).collectZalouserSecurityAuditFindings(params)
};
const zalouserThreadingAdapter = { resolveReplyToMode: createStaticReplyToModeResolver("off") };
const zalouserPairingTextAdapter = {
	idLabel: "zalouserUserId",
	message: "Your pairing request has been approved.",
	normalizeAllowEntry: createPairingPrefixStripper(/^(zalouser|zlu):/i),
	notify: async ({ cfg, id, message, accountId }) => {
		const { sendMessageZalouser } = await loadZalouserChannelRuntime$1();
		const account = resolveZalouserAccountSync({
			cfg,
			accountId
		});
		if (!await checkZcaAuthenticated(account.profile)) throw new Error("Zalouser not authenticated");
		await sendMessageZalouser(id, message, { profile: account.profile });
	}
};
const zalouserOutboundAdapter = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	sendPayload: async (ctx) => await sendPayloadWithChunkedTextAndMedia({
		ctx,
		sendText: (nextCtx) => zalouserRawSendResultAdapter.sendText(nextCtx),
		sendMedia: (nextCtx) => zalouserRawSendResultAdapter.sendMedia(nextCtx),
		emptyResult: createEmptyChannelResult("zalouser")
	}),
	...zalouserRawSendResultAdapter,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text)
};
const zalouserMessagingAdapter = {
	targetPrefixes: ["zalouser", "zlu"],
	normalizeTarget: (raw) => normalizeZalouserTarget(raw),
	inferTargetChatType: ({ to }) => {
		try {
			return parseZalouserOutboundTarget(to).isGroup ? "group" : "direct";
		} catch {
			return;
		}
	},
	resolveOutboundSessionRoute: (params) => resolveZalouserOutboundSessionRoute(params),
	targetResolver: {
		looksLikeId: (raw) => {
			const normalized = normalizeZalouserTarget(raw);
			if (!normalized) return false;
			if (/^group:[^\s]+$/i.test(normalized) || /^user:[^\s]+$/i.test(normalized)) return true;
			return isNumericTargetId(normalized);
		},
		hint: "<user:id|group:id>"
	}
};
//#endregion
//#region extensions/zalouser/src/directory.ts
function mapZalouserDirectoryUser(params) {
	return {
		kind: "user",
		id: params.id,
		name: params.name ?? void 0,
		avatarUrl: params.avatarUrl ?? void 0,
		raw: params.raw
	};
}
async function listZalouserDirectoryGroupMembers(params, deps) {
	const account = resolveZalouserAccountSync({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const normalizedGroupId = parseZalouserDirectoryGroupId(params.groupId);
	const rows = (await deps.listZaloGroupMembers(account.profile, normalizedGroupId)).map((member) => mapZalouserDirectoryUser({
		id: member.userId,
		name: member.displayName,
		avatarUrl: member.avatar ?? null,
		raw: member
	}));
	return typeof params.limit === "number" && params.limit > 0 ? rows.slice(0, params.limit) : rows;
}
//#endregion
//#region extensions/zalouser/src/status-issues.ts
const ZALOUSER_STATUS_FIELDS = [
	"accountId",
	"enabled",
	"configured",
	"linked",
	"dmPolicy",
	"lastError"
];
function collectZalouserStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readStatusIssueFields(entry, ZALOUSER_STATUS_FIELDS);
		if (!account) continue;
		const accountId = coerceStatusIssueAccountId(account.accountId) ?? "default";
		if (!(account.enabled !== false)) continue;
		if (account.configured !== true || account.linked === false) {
			issues.push(standardNotConfiguredIssue({
				channel: "zalouser",
				accountId,
				message: "Not authenticated (no saved Zalo session).",
				fix: "Run: openclaw channels login --channel zalouser"
			}));
			continue;
		}
		if (account.dmPolicy === "open") issues.push(standardDmPolicyOpenIssue({
			channel: "zalouser",
			accountId,
			channelLabel: "Zalo Personal",
			configPath: "channels.zalouser"
		}));
	}
	return issues;
}
//#endregion
//#region extensions/zalouser/src/channel.ts
const loadZalouserChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-DTVuNw4g.mjs"));
const zalouserSetupWizardProxy = createZalouserSetupWizardProxy(async () => (await import("./setup-surface-BqN86eDL.mjs").then((n) => n.t)).zalouserSetupWizard);
function mapGroup(params) {
	return {
		kind: "group",
		id: params.id,
		name: params.name ?? void 0,
		raw: params.raw
	};
}
const zalouserPlugin = createChatChannelPlugin({
	base: {
		...createZalouserPluginBase({
			setupWizard: zalouserSetupWizardProxy,
			setupContract: zalouserSetupContract
		}),
		groups: zalouserGroupsAdapter,
		actions: zalouserMessageActions,
		messaging: zalouserMessagingAdapter,
		directory: {
			self: async ({ cfg, accountId }) => {
				const { getZaloUserInfo } = await loadZalouserChannelRuntime();
				const parsed = await getZaloUserInfo(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile);
				if (!parsed?.userId) return null;
				return mapZalouserDirectoryUser({
					id: parsed.userId,
					name: parsed.displayName ?? null,
					avatarUrl: parsed.avatar ?? null,
					raw: parsed
				});
			},
			listPeers: async ({ cfg, accountId, query, limit }) => {
				const { listZaloFriendsMatching } = await loadZalouserChannelRuntime();
				const rows = (await listZaloFriendsMatching(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile, query)).map((friend) => mapZalouserDirectoryUser({
					id: friend.userId,
					name: friend.displayName ?? null,
					avatarUrl: friend.avatar ?? null,
					raw: friend
				}));
				return typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
			},
			listGroups: async ({ cfg, accountId, query, limit }) => {
				const { listZaloGroupsMatching } = await loadZalouserChannelRuntime();
				const rows = (await listZaloGroupsMatching(resolveZalouserAccountSync({
					cfg,
					accountId
				}).profile, query)).map((group) => mapGroup({
					id: `group:${group.groupId}`,
					name: group.name ?? null,
					raw: group
				}));
				return typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
			},
			listGroupMembers: async ({ cfg, accountId, groupId, limit }) => {
				const { listZaloGroupMembers } = await loadZalouserChannelRuntime();
				return await listZalouserDirectoryGroupMembers({
					cfg,
					accountId: accountId ?? void 0,
					groupId,
					limit: limit ?? void 0
				}, { listZaloGroupMembers });
			}
		},
		resolver: zalouserResolverAdapter,
		auth: zalouserAuthAdapter,
		message: zalouserMessageAdapter,
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: collectZalouserStatusIssues,
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => (await loadZalouserChannelRuntime()).probeZalouser(account.profile, timeoutMs),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: Boolean(account.profile),
				extra: { dmPolicy: account.config.dmPolicy ?? "pairing" }
			})
		}),
		gateway: {
			startAccount: async (ctx) => {
				const { getZaloUserInfo } = await loadZalouserChannelRuntime();
				const account = ctx.account;
				let userLabel = "";
				try {
					const userInfo = await getZaloUserInfo(account.profile);
					if (userInfo?.displayName) userLabel = ` (${userInfo.displayName})`;
					ctx.setStatus({
						accountId: account.accountId,
						profile: userInfo
					});
				} catch {}
				const statusSink = createAccountStatusSink({
					accountId: ctx.accountId,
					setStatus: ctx.setStatus
				});
				ctx.log?.info(`[${account.accountId}] starting zalouser provider${userLabel}`);
				const { monitorZalouserProvider } = await import("./monitor-2jkNWJ3s.mjs");
				return monitorZalouserProvider({
					account,
					config: ctx.cfg,
					runtime: ctx.runtime,
					abortSignal: ctx.abortSignal,
					statusSink
				});
			},
			loginWithQrStart: async (params) => {
				const { startZaloQrLogin } = await loadZalouserChannelRuntime();
				return await startZaloQrLogin({
					profile: resolveZalouserQrProfile(params.accountId),
					force: params.force,
					timeoutMs: params.timeoutMs
				});
			},
			loginWithQrWait: async (params) => {
				const { waitForZaloQrLogin } = await loadZalouserChannelRuntime();
				return await waitForZaloQrLogin({
					profile: resolveZalouserQrProfile(params.accountId),
					timeoutMs: params.timeoutMs
				});
			},
			logoutAccount: async (ctx) => await (await loadZalouserChannelRuntime()).logoutZaloProfile(ctx.account.profile || resolveZalouserQrProfile(ctx.accountId))
		}
	},
	security: zalouserSecurityAdapter,
	threading: zalouserThreadingAdapter,
	pairing: { text: zalouserPairingTextAdapter },
	outbound: zalouserOutboundAdapter
});
//#endregion
export { buildZalouserGroupCandidates as a, resolveZalouserMessageSid as i, parseZalouserOutboundTarget as n, findZalouserGroupEntry as o, formatZalouserMessageSidFull as r, isZalouserGroupEntryAllowed as s, zalouserPlugin as t };
