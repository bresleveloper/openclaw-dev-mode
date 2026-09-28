import { a as normalizeSignalTransportUrl } from "./transport-url-CAC0JcuI.mjs";
import { i as resolveSignalAccount, n as listSignalAccountIds, r as resolveDefaultSignalAccountId, t as listEnabledSignalAccounts } from "./accounts-BV6tDOTc.mjs";
import { n as normalizeSignalMessagingTarget, r as normalizeSignalReactionRecipient } from "./normalize-l_b99hap.mjs";
import { n as signalApprovalAuth, t as getSignalApprovalApprovers } from "./approval-auth-BBI9BTRm.mjs";
import { n as sendReactionSignal, t as removeReactionSignal } from "./reaction-runtime-api-BnQGHcrB.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveReactionLevel } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { FormatCapabilityProfile, markdownToIR, renderMarkdownIRChunksWithinLimit, renderMarkdownWithAttributedRanges } from "openclaw/plugin-sdk/text-chunking";
import { createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { shouldSuppressLocalNativeExecApprovalPrompt } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalReactionPendingContentForRequest } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { formatMediaPlaceholderText } from "openclaw/plugin-sdk/channel-inbound";
import { kindFromMime } from "openclaw/plugin-sdk/media-runtime";
import { createActionGate, jsonResult, readStringParam, resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { getExecApprovalReplyMetadata } from "openclaw/plugin-sdk/approval-reply-runtime";
import { isMessagePresentationInteractiveBlock, normalizeMessagePresentation, renderMessagePresentationFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/signal/src/approval-native.ts
function isSignalApprovalTransportEnabled(params) {
	return resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).enabled;
}
const signalApproval = createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes({
	channel: "signal",
	channelLabel: "Signal",
	authorizeActorAction: (params) => signalApprovalAuth.authorizeActorAction(params),
	routing: {
		defaultForwardingMode: "session",
		isTransportEnabled: isSignalApprovalTransportEnabled,
		listAccountIds: listSignalAccountIds,
		resolveDefaultAccountId: resolveDefaultSignalAccountId,
		normalizeTo: normalizeSignalMessagingTarget,
		resolveApprovers: getSignalApprovalApprovers,
		suppressExplicitTargetFallback: false,
		isOriginTargetAllowed: ({ cfg, accountId, target }) => !isSignalGroupTarget(target.to) || getSignalApprovalApprovers({
			cfg,
			accountId
		}).length > 0
	},
	describeExecApprovalSetup: ({ accountId }) => {
		return `Signal supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows Signal. Link Signal and keep the gateway running; configure \`${accountId && accountId !== "default" ? `channels.signal.accounts.${accountId}` : "channels.signal"}.allowFrom\` to restrict approvers.`;
	},
	render: {
		exec: { buildPendingPayload: ({ request, nowMs }) => buildApprovalReactionPendingContentForRequest({
			request,
			nowMs
		}).manualFallbackPayload },
		plugin: { buildPendingPayload: ({ request, nowMs }) => buildApprovalReactionPendingContentForRequest({
			request,
			nowMs
		}).manualFallbackPayload }
	},
	createNativeRuntime: (routing) => createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: ({ cfg, accountId, context }) => Boolean(context) && routing.isNativeApprovalHandlerConfigured({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, context, approvalKind, request }) => Boolean(context) && routing.shouldHandleApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-C3vN5OWd.mjs")).signalApprovalNativeRuntime
	})
});
const signalApprovalRouting = signalApproval.routing;
function isSignalNativeApprovalHandlerConfigured(params) {
	return signalApprovalRouting.isNativeApprovalHandlerConfigured(params);
}
function resolveSignalSessionTargetFromSessionKey(sessionKey) {
	const rest = parseAgentSessionKey(sessionKey)?.rest ?? normalizeOptionalString(sessionKey);
	if (!rest || !normalizeLowercaseStringOrEmpty(rest).startsWith("signal:")) return null;
	return normalizeSignalMessagingTarget(rest.slice(7)) ?? null;
}
function shouldSuppressLocalSignalExecApprovalPrompt(params) {
	return shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isTransportEnabled: isSignalApprovalTransportEnabled,
		isSessionRouteEligible: ({ cfg, accountId, metadata }) => {
			if (getSignalApprovalApprovers({
				cfg,
				accountId
			}).length > 0) return true;
			const sessionTarget = resolveSignalSessionTargetFromSessionKey(metadata.sessionKey);
			return Boolean(sessionTarget && !isSignalGroupTarget(sessionTarget));
		}
	});
}
function isSignalGroupTarget(to) {
	return normalizeLowercaseStringOrEmpty(to).startsWith("group:");
}
const signalApprovalCapability = signalApproval.capability;
//#endregion
//#region extensions/signal/src/format.ts
const SIGNAL_STYLE_MAP = {
	bold: "BOLD",
	italic: "ITALIC",
	strikethrough: "STRIKETHROUGH",
	code: "MONOSPACE",
	code_block: "MONOSPACE",
	spoiler: "SPOILER"
};
const SIGNAL_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "ranges",
	constructs: {
		underline: "strip",
		codeLanguage: "fallback",
		linkLabel: "fallback",
		heading: "fallback",
		bulletList: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		blockquote: "fallback",
		image: "fallback",
		mention: "strip"
	},
	chunk: {
		limit: 4e3,
		unit: "chars"
	}
});
function stripEquivalentSignalLinks(ir) {
	const normalize = (value, preserveSuffixCase) => {
		const normalized = value.trim().replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace(/\/+$/, "");
		return preserveSuffixCase ? normalized.replace(/^[^/?#]+/, (host) => host.toLowerCase()) : normalizeLowercaseStringOrEmpty(normalized);
	};
	return {
		...ir,
		links: ir.links.filter((link) => {
			const label = ir.text.slice(link.start, link.end);
			const href = link.href.trim();
			const preserveSuffixCase = /^https?:\/\//i.test(href);
			return normalize(label, preserveSuffixCase) !== normalize(href.replace(/^mailto:/, ""), preserveSuffixCase);
		})
	};
}
function renderSignalText(ir) {
	const rendered = renderMarkdownWithAttributedRanges(stripEquivalentSignalLinks(ir), {
		styleMap: SIGNAL_STYLE_MAP,
		annotationStyleMap: { assistant_transcript_role: "MONOSPACE" },
		trimEnd: true
	}, SIGNAL_FORMAT_PROFILE);
	return {
		text: rendered.text,
		styles: rendered.ranges
	};
}
function markdownToSignalIR(markdown, options) {
	return markdownToIR(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: true,
		enableSpoilers: true,
		headingStyle: "rich",
		blockquotePrefix: "> ",
		tableMode: options.tableMode
	});
}
function markdownToSignalText(markdown, options = {}) {
	return renderSignalText(markdownToSignalIR(markdown, options));
}
function markdownToSignalTextChunks(markdown, limit, options = {}) {
	const ir = markdownToSignalIR(markdown, options);
	if (ir.listItems && ir.text.length > limit) ir.listItems = ir.listItems.map((item) => ({ ...item }));
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit,
		assistantTranscriptRoleMessageBoundaries: true,
		renderChunk: renderSignalText,
		measureRendered: (rendered) => rendered.text.length
	}).map(({ rendered }) => rendered);
}
//#endregion
//#region extensions/signal/src/media-text.ts
function formatAttachmentKindCount(kind, count) {
	if (kind === "attachment") return `${count} file${count > 1 ? "s" : ""}`;
	return `${count} ${kind}${count > 1 ? "s" : ""}`;
}
/** Keeps Signal's established multi-attachment text while sharing single-item rendering. */
function formatSignalMediaText(media) {
	if (media.length <= 1) return formatMediaPlaceholderText(media);
	const kindCounts = /* @__PURE__ */ new Map();
	for (const entry of media) {
		const kind = entry.kind && entry.kind !== "unknown" ? entry.kind : kindFromMime(entry.contentType) ?? "attachment";
		kindCounts.set(kind, (kindCounts.get(kind) ?? 0) + 1);
	}
	return `[${[...kindCounts.entries()].map(([kind, count]) => formatAttachmentKindCount(kind, count)).join(" + ")} attached]`;
}
//#endregion
//#region extensions/signal/src/reaction-level.ts
/**
* Resolve the effective reaction level and its implications for Signal.
*
* Levels:
* - "off": No reactions at all
* - "ack": Only automatic ack reactions (👀 when processing), no agent reactions
* - "minimal": Agent can react, but sparingly (default)
* - "extensive": Agent can react liberally
*/
function resolveSignalReactionLevel(params) {
	const account = resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return resolveReactionLevel({
		value: account.config.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "minimal"
	});
}
//#endregion
//#region extensions/signal/src/message-actions.ts
const providerId = "signal";
const GROUP_PREFIX = "group:";
function resolveSignalReactionTarget(raw) {
	const withoutSignal = raw.trim().replace(/^signal:/i, "").trim();
	if (!withoutSignal) return {};
	if (normalizeLowercaseStringOrEmpty(withoutSignal).startsWith(GROUP_PREFIX)) {
		const groupId = withoutSignal.slice(6).trim();
		return groupId ? { groupId } : {};
	}
	return { recipient: normalizeSignalReactionRecipient(withoutSignal) };
}
async function mutateSignalReaction(params) {
	const options = {
		cfg: params.cfg,
		accountId: params.accountId,
		groupId: params.target.groupId,
		targetAuthor: params.targetAuthor,
		targetAuthorUuid: params.targetAuthorUuid,
		...params.assertDirectAdapterHandoff ? { assertDirectAdapterHandoff: params.assertDirectAdapterHandoff } : {}
	};
	await (params.remove ? removeReactionSignal : sendReactionSignal)(params.target.recipient ?? "", params.timestamp, params.emoji, options);
	return jsonResult({
		ok: true,
		[params.remove ? "removed" : "added"]: params.emoji
	});
}
const signalMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		const configuredAccounts = accountId ? [resolveSignalAccount({
			cfg,
			accountId
		})].filter((account) => account.enabled && account.configured) : listEnabledSignalAccounts(cfg).filter((account) => account.configured);
		if (configuredAccounts.length === 0) return null;
		const actions = /* @__PURE__ */ new Set(["send"]);
		if (configuredAccounts.some((account) => createActionGate(account.config.actions)("reactions"))) actions.add("react");
		return { actions: Array.from(actions) };
	},
	supportsAction: ({ action }) => action === "react",
	prepareSendPayload: ({ ctx, payload, replyToId, replyToIdSource }) => {
		if (ctx.action !== "send") return null;
		const normalizedReplyToId = replyToId?.trim();
		if (!normalizedReplyToId) return payload;
		return replyToIdSource === "implicit" ? payload : {
			...payload,
			replyToId: normalizedReplyToId
		};
	},
	handleAction: async ({ action, params, cfg, accountId, toolContext, assertDirectAdapterHandoff }) => {
		if (action === "send") throw new Error("Send should be handled by outbound, not actions handler.");
		if (action === "react") {
			const account = resolveSignalAccount({
				cfg,
				accountId
			});
			if (!account.enabled) throw new Error(`Signal account "${account.accountId}" is disabled.`);
			if (!account.configured) throw new Error(`Signal account "${account.accountId}" is not configured.`);
			const reactionLevelInfo = resolveSignalReactionLevel({
				cfg,
				accountId: account.accountId
			});
			if (!reactionLevelInfo.agentReactionsEnabled) throw new Error(`Signal agent reactions disabled (reactionLevel="${reactionLevelInfo.level}"). Set channels.signal.reactionLevel to "minimal" or "extensive" to enable.`);
			if (!createActionGate(account.config.actions)("reactions")) throw new Error("Signal reactions are disabled via actions.reactions.");
			const target = resolveSignalReactionTarget(readStringParam(params, "to", {
				required: true,
				label: "recipient (UUID, phone number, or group)"
			}));
			if (!target.recipient && !target.groupId) throw new Error("recipient or group required");
			const messageIdRaw = resolveReactionMessageId({
				args: params,
				toolContext
			});
			const messageId = messageIdRaw != null ? String(messageIdRaw) : void 0;
			if (!messageId) throw new Error("messageId (timestamp) required. Provide messageId explicitly or react to the current inbound message.");
			const targetAuthor = readStringParam(params, "targetAuthor");
			const targetAuthorUuid = readStringParam(params, "targetAuthorUuid");
			if (target.groupId && !targetAuthor && !targetAuthorUuid) throw new Error("targetAuthor or targetAuthorUuid required for group reactions.");
			const emoji = readStringParam(params, "emoji", { allowEmpty: true });
			const remove = typeof params.remove === "boolean" ? params.remove : void 0;
			const timestamp = parseStrictNonNegativeInteger(messageId);
			if (timestamp === void 0) throw new Error(`Invalid messageId: ${messageId}. Expected numeric timestamp.`);
			if (!emoji) throw new Error(`Emoji required to ${remove ? "remove" : "add"} reaction.`);
			return await mutateSignalReaction({
				cfg,
				accountId: account.accountId,
				target,
				timestamp,
				emoji,
				remove: Boolean(remove),
				targetAuthor,
				targetAuthorUuid,
				assertDirectAdapterHandoff
			});
		}
		throw new Error(`Action ${action} not supported for ${providerId}.`);
	}
};
//#endregion
//#region extensions/signal/src/presentation-fallback.ts
/** Materialize presentation content once before Signal's text-only delivery funnels. */
function materializeSignalPresentationFallback(payload, presentationOverride) {
	const reactionPayload = questionGatewayRuntime.prepareReactionPayloadForDelivery({
		payload,
		presentation: presentationOverride ?? payload.presentation
	});
	if (reactionPayload) return reactionPayload;
	const presentation = presentationOverride ?? normalizeMessagePresentation(payload.presentation);
	if (!presentation) return payload;
	const currentText = payload.text?.trim() ?? "";
	const fallbackPresentation = Boolean(getExecApprovalReplyMetadata(payload) && currentText) ? {
		...presentation,
		blocks: presentation.blocks.filter((block) => !isMessagePresentationInteractiveBlock(block))
	} : presentation;
	const presentationFallback = renderMessagePresentationFallbackText({ presentation: fallbackPresentation });
	const text = currentText.includes(presentationFallback) ? currentText : [currentText, presentationFallback].filter(Boolean).join("\n\n");
	const { presentation: _presentation, ...withoutPresentation } = payload;
	return {
		...withoutPresentation,
		text
	};
}
//#endregion
//#region extensions/signal/src/reply-authors-state.ts
const signalReplyAuthorState = {
	memoryReplyContexts: /* @__PURE__ */ new Map(),
	persistentStoreDisabled: false
};
//#endregion
//#region extensions/signal/src/runtime.ts
const { setRuntime: setSignalRuntime, getRuntime: getSignalRuntime, tryGetRuntime: getOptionalSignalRuntime } = createPluginRuntimeStore({
	pluginId: "signal",
	errorMessage: "Signal runtime not initialized"
});
//#endregion
//#region extensions/signal/src/reply-authors.ts
const PERSISTENT_NAMESPACE = "signal.reply-authors.v1";
const PERSISTENT_MAX_ENTRIES = 5e3;
const DEFAULT_REPLY_AUTHOR_TTL_MS = 6048e5;
const { memoryReplyContexts } = signalReplyAuthorState;
function openSignalReplyAuthorStore() {
	if (signalReplyAuthorState.persistentStoreDisabled) return;
	const runtime = getOptionalSignalRuntime();
	try {
		return runtime?.state.openKeyedStore({
			namespace: PERSISTENT_NAMESPACE,
			maxEntries: PERSISTENT_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_REPLY_AUTHOR_TTL_MS
		});
	} catch (error) {
		signalReplyAuthorState.persistentStoreDisabled = true;
		runtime?.logging.getChildLogger({
			plugin: "signal",
			feature: "reply-author-state"
		}).warn("Signal persistent reply author state unavailable", { error: String(error) });
		return;
	}
}
function buildSignalReplyAuthorStoreKey(params) {
	const conversationKey = normalizeSignalMessagingTarget(params.to);
	const replyToId = normalizeOptionalString(params.replyToId);
	if (!conversationKey || !replyToId) return;
	return `account=${normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.accountId) ?? DEFAULT_ACCOUNT_ID)}|to=${conversationKey}|id=${replyToId}`;
}
function pruneMemoryReplyContexts(now = Date.now()) {
	for (const [key, record] of memoryReplyContexts) if (record.expiresAt <= now) memoryReplyContexts.delete(key);
	while (memoryReplyContexts.size > PERSISTENT_MAX_ENTRIES) {
		const oldestKey = memoryReplyContexts.keys().next().value;
		if (!oldestKey) break;
		memoryReplyContexts.delete(oldestKey);
	}
}
function resolveReplyContext(record) {
	if (!record) return;
	if (record.kind === "ambiguous") return { ambiguous: true };
	const author = normalizeOptionalString(record.author);
	if (!author) return;
	const body = normalizeOptionalString(record.body);
	const media = record.media;
	return {
		author,
		...body ? { body } : {},
		...media?.length ? { media } : {}
	};
}
function resolveSourceTimestamp(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : Date.now();
}
function mergeReplyContext(current, next) {
	if (!current) return next;
	if (current.kind === "ambiguous") return current;
	if (next.kind === "ambiguous") return next;
	if (current.author !== next.author) {
		const { author: _author, body: _body, media: _media, ...identity } = next;
		return {
			...identity,
			kind: "ambiguous"
		};
	}
	return next.sourceTimestamp >= current.sourceTimestamp ? next : current;
}
async function registerSignalReplyContext(params) {
	const store = openSignalReplyAuthorStore();
	const key = buildSignalReplyAuthorStoreKey(params);
	const author = normalizeOptionalString(params.author);
	const body = normalizeOptionalString(params.body);
	const media = params.media?.map((entry) => ({
		contentType: normalizeOptionalString(entry.contentType),
		kind: entry.kind ?? void 0
	}));
	const conversationKey = normalizeSignalMessagingTarget(params.to);
	const replyToId = normalizeOptionalString(params.replyToId);
	const accountKey = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.accountId) ?? DEFAULT_ACCOUNT_ID);
	const sourceTimestamp = resolveSourceTimestamp(params.sourceTimestamp);
	if (!key || !author || !conversationKey || !replyToId) return;
	const registeredAt = Date.now();
	const record = {
		kind: "resolved",
		author,
		...body ? { body } : {},
		...media?.length ? { media } : {},
		accountId: accountKey,
		conversationKey,
		replyToId,
		sourceTimestamp,
		registeredAt
	};
	const expiresAt = registeredAt + DEFAULT_REPLY_AUTHOR_TTL_MS;
	if (!store) {
		const next = mergeReplyContext(memoryReplyContexts.get(key), record);
		memoryReplyContexts.set(key, {
			...next,
			expiresAt
		});
		pruneMemoryReplyContexts(registeredAt);
		return;
	}
	const usesComparisons = Boolean(store.observe && store.compareAndApply);
	if (!store.update && !usesComparisons) {
		const next = mergeReplyContext(memoryReplyContexts.get(key), record);
		memoryReplyContexts.set(key, {
			...next,
			expiresAt
		});
		pruneMemoryReplyContexts(registeredAt);
		signalReplyAuthorState.persistentStoreDisabled = true;
		getOptionalSignalRuntime()?.logging.getChildLogger({
			plugin: "signal",
			feature: "reply-author-state"
		}).warn("Signal persistent reply author state lacks atomic updates");
		return;
	}
	const cachedBeforeUpdate = memoryReplyContexts.get(key);
	const cacheReplyContext = (next) => {
		const current = memoryReplyContexts.get(key);
		const changedDuringUpdate = usesComparisons && current !== cachedBeforeUpdate;
		if (!next) {
			if (!changedDuringUpdate) memoryReplyContexts.delete(key);
			return;
		}
		const concurrent = changedDuringUpdate && current && current.expiresAt > registeredAt ? current : void 0;
		memoryReplyContexts.set(key, {
			...concurrent ? mergeReplyContext(concurrent, next) : next,
			expiresAt: Math.max(expiresAt, concurrent?.expiresAt ?? expiresAt)
		});
	};
	let updateEvaluated = false;
	let nextRecord;
	try {
		let updated = false;
		if (store.observe && store.compareAndApply) {
			let observation = await store.observe(key);
			for (;;) {
				updateEvaluated = true;
				nextRecord = mergeReplyContext(observation.value, record);
				const result = await store.compareAndApply(key, observation.comparison, {
					operation: "update",
					action: "set",
					value: nextRecord
				});
				if (result.status !== "conflict") {
					updated = result.status === "applied";
					break;
				}
				observation = result.current;
			}
		} else if (store.update) updated = await store.update(key, (current) => {
			updateEvaluated = true;
			nextRecord = mergeReplyContext(current, record);
			return nextRecord;
		});
		cacheReplyContext(updated ? nextRecord : void 0);
		pruneMemoryReplyContexts(registeredAt);
	} catch (error) {
		if (!updateEvaluated) try {
			nextRecord = mergeReplyContext(await store.lookup(key), record);
		} catch {
			nextRecord = void 0;
		}
		const next = nextRecord;
		if (next || updateEvaluated) cacheReplyContext(next);
		pruneMemoryReplyContexts(registeredAt);
		getOptionalSignalRuntime()?.logging.getChildLogger({
			plugin: "signal",
			feature: "reply-author-state"
		}).warn("Signal persistent reply author state failed", { error: String(error) });
	}
}
async function resolveSignalReplyContextWithPersistence(params) {
	const store = openSignalReplyAuthorStore();
	const key = buildSignalReplyAuthorStoreKey(params);
	if (!key) return;
	if (!store) {
		pruneMemoryReplyContexts();
		return resolveReplyContext(memoryReplyContexts.get(key));
	}
	pruneMemoryReplyContexts();
	const memoryContext = resolveReplyContext(memoryReplyContexts.get(key));
	if (memoryContext) return memoryContext;
	try {
		return resolveReplyContext(await store.lookup(key));
	} catch (error) {
		getOptionalSignalRuntime()?.logging.getChildLogger({
			plugin: "signal",
			feature: "reply-author-state"
		}).warn("Signal persistent reply author lookup failed", { error: String(error) });
		return;
	}
}
//#endregion
//#region extensions/signal/src/transport-detection.ts
const DEFAULT_PROBE_TIMEOUT_MS = 1e4;
async function detectSignalTransport(params) {
	const url = normalizeSignalTransportUrl(params.url);
	const timeoutMs = params.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS;
	const probes = params.probeNative && params.probeContainer ? void 0 : await import("./transport-probes.runtime-WprAyBbL.mjs");
	const probeNative = params.probeNative ?? probes?.nativeCheck;
	const probeContainer = params.probeContainer ?? probes?.containerCheck;
	if (!probeNative || !probeContainer) throw new Error("Signal transport probes are unavailable");
	const [native, container] = await Promise.all([probeNative(url, timeoutMs).catch(() => ({ ok: false })), probeContainer(url, timeoutMs, params.account).catch(() => ({ ok: false }))]);
	if (native.ok) return {
		kind: "external-native",
		url
	};
	if (container.ok) return {
		kind: "container",
		url
	};
	throw new Error(`Signal transport not reachable at ${url}`);
}
//#endregion
export { getSignalRuntime as a, signalMessageActions as c, markdownToSignalText as d, markdownToSignalTextChunks as f, signalApprovalCapability as h, getOptionalSignalRuntime as i, resolveSignalReactionLevel as l, shouldSuppressLocalSignalExecApprovalPrompt as m, registerSignalReplyContext as n, setSignalRuntime as o, isSignalNativeApprovalHandlerConfigured as p, resolveSignalReplyContextWithPersistence as r, materializeSignalPresentationFallback as s, detectSignalTransport as t, formatSignalMediaText as u };
