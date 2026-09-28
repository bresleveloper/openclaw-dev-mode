import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { i as normalizeSignalTransportHost } from "./transport-url-CAC0JcuI.mjs";
import { i as resolveSignalAccount, o as resolveSignalReplyToMode } from "./accounts-BV6tDOTc.mjs";
import { n as normalizeSignalMessagingTarget } from "./normalize-l_b99hap.mjs";
import { a as normalizeSignalAllowRecipient, c as resolveSignalSender, i as isSignalSenderAllowed, l as looksLikeUuid, n as formatSignalSenderDisplay, o as resolveSignalPeerId, r as formatSignalSenderId, s as resolveSignalRecipient, t as formatSignalPairingIdLine } from "./identity-YXPmgFMu.mjs";
import { a as getSignalRuntime, i as getOptionalSignalRuntime, l as resolveSignalReactionLevel, n as registerSignalReplyContext, p as isSignalNativeApprovalHandlerConfigured, s as materializeSignalPresentationFallback, u as formatSignalMediaText } from "./transport-detection-CoiRl7Gx.mjs";
import { a as prepareSignalSocketPath, t as SignalSseRejectionError } from "./client-BseAt7F7.mjs";
import { n as signalRpcRequest, r as streamSignalEvents, t as signalCheck } from "./client-adapter-dvFa47YL.mjs";
import { n as sendReactionSignal } from "./reaction-runtime-api-BnQGHcrB.mjs";
import { i as maybeResolveSignalApprovalReaction, o as registerSignalApprovalReactionTargetForDeliveredPayload, s as resolveSignalApprovalConversationKey, t as addSignalApprovalReactionHintToStructuredPayload } from "./approval-reactions-DDQvPP_z.mjs";
import { r as registerSignalQuestionReactionTargetForDeliveredPayload, t as maybeResolveSignalQuestionReaction } from "./question-reactions-C8cSEjVf.mjs";
import { n as sendReadReceiptSignal, r as sendTypingSignal, t as sendMessageSignal } from "./send-B78M_eFp.mjs";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageReplyPipeline, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { asPositiveSafeInteger, isRecord, normalizeNullableString, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { normalizeE164, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { buildChannelInboundEventContext, buildMentionRegexes, createChannelInboundDebouncer, filterChannelInboundQuoteContext, formatInboundEnvelope, formatInboundFromLabel, formatInboundMediaUnavailableText, hasVisibleInboundReplyDispatch, logInboundDrop, matchesMentionPatterns, readAgentRunTerminalOutcome, resolveEnvelopeFormatOptions, resolveInboundDebounceMs, resolveInboundMentionDecision, resolveInboundSupplementalSenderAllowed, runChannelInboundEvent, shouldDebounceTextInbound, toHistoryMediaEntries, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { canonicalizeBase64, detectMime, estimateBase64DecodedBytes, kindFromMime, saveMediaBuffer } from "openclaw/plugin-sdk/media-runtime";
import { resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { collectErrorGraphCandidates, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { ensurePortAvailable, extractErrorCode as extractErrorCode$1, formatErrorMessage as formatErrorMessage$1, resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
import { spawn } from "node:child_process";
import os from "node:os";
import { resolveChannelGroupPolicy, resolveChannelGroupRequireMention, resolveChannelGroups, resolveChannelGroupsConfigPath } from "openclaw/plugin-sdk/channel-policy";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { deliverTextOrMediaReply, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { chunkTextWithMode, createReplyReferencePlanner, resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-runtime";
import { createRuntimeConfigReader, getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { computeBackoff, createNonExitingRuntime, danger, logVerbose, shouldLogVerbose, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { waitForTransportReady } from "openclaw/plugin-sdk/transport-ready-runtime";
import { createInterface } from "node:readline";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { DEFAULT_EMOJIS, DEFAULT_TIMING, createStatusReactionController, logAckFailure, logTypingFailure, resolveAckReaction, shouldAckReaction } from "openclaw/plugin-sdk/channel-feedback";
import { defineStableChannelIngressIdentity, fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { isControlCommandMessage } from "openclaw/plugin-sdk/command-detection";
import { createInternalHookEvent, fireAndForgetHook, toInternalMessageReceivedContext, triggerInternalHook } from "openclaw/plugin-sdk/hook-runtime";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { resolveBatchedReplyThreadingPolicy } from "openclaw/plugin-sdk/reply-reference";
import { readSessionUpdatedAt, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { enqueueSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { listChatCommands, maybeResolveTextAlias, normalizeCommandBody } from "openclaw/plugin-sdk/command-auth-native";
import { isAbortRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
import { channelBlockedPatch, channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
//#region extensions/signal/src/daemon.ts
const SIGNAL_DAEMON_STOP_KILL_TIMEOUT_MS = 1500;
function formatSignalDaemonExit(exit) {
	return `signal daemon exited (source=${exit.source} code=${exit.code ?? "null"} signal=${exit.signal ?? "null"})`;
}
function formatSignalDaemonEndpoint(httpHost, httpPort) {
	return `${httpHost.includes(":") ? `[${httpHost}]` : httpHost}:${httpPort}`;
}
async function assertSignalDaemonEndpointAvailable(params) {
	if (params.socketPath) {
		params.abortSignal?.throwIfAborted();
		await prepareSignalSocketPath(params.socketPath, params.abortSignal);
		params.abortSignal?.throwIfAborted();
		return;
	}
	try {
		await ensurePortAvailable(params.httpPort, params.httpHost, params.abortSignal);
	} catch (error) {
		if (params.abortSignal?.aborted) throw params.abortSignal.reason;
		if (!(extractErrorCode$1(error) === "EADDRINUSE" || error instanceof Error && error.name === "PortInUseError")) return;
		const endpoint = formatSignalDaemonEndpoint(params.httpHost, params.httpPort);
		throw new Error(`Signal managed native endpoint ${endpoint} is unavailable: ${formatErrorMessage$1(error)} Stop the conflicting service, configure this Signal account with a different transport.httpPort, or use external-native for an intentionally operator-managed daemon.`, { cause: error });
	}
}
async function waitForSignalDaemonReady(params) {
	await (params.waitForTransportReadyFn ?? waitForTransportReady)({
		label: "signal daemon",
		timeoutMs: Math.max(0, params.startupDeadlineMs - Date.now()),
		logAfterMs: params.logAfterMs,
		logIntervalMs: params.logIntervalMs,
		pollIntervalMs: 150,
		abortSignal: params.abortSignal,
		runtime: params.runtime,
		check: async () => {
			const remainingMs = params.startupDeadlineMs - Date.now();
			if (remainingMs <= 0) return {
				ok: false,
				error: "startup deadline exceeded"
			};
			const res = await signalCheck(params.baseUrl, Math.min(1e3, remainingMs));
			if (Date.now() >= params.startupDeadlineMs) return {
				ok: false,
				error: "startup deadline exceeded"
			};
			if (res.ok) return { ok: true };
			return {
				ok: false,
				error: res.error ?? (res.status ? `HTTP ${res.status}` : "unreachable")
			};
		}
	});
}
function isRecoverableSignalCliReceiveException(line) {
	return /\breceive exception:\s+.*\binvalid PreKey message:\s+decryption failed\b/i.test(line);
}
function classifySignalCliLogLine(line) {
	const trimmed = line.trim();
	if (!trimmed) return null;
	if (/\bERROR\b/.test(trimmed)) return "error";
	if (isRecoverableSignalCliReceiveException(trimmed)) return "log";
	if (/\b(FAILED|SEVERE|EXCEPTION)\b/i.test(trimmed)) return "error";
	return "log";
}
function bindSignalCliOutput(params) {
	if (!params.stream) return;
	createInterface({ input: params.stream }).on("line", (line) => {
		const kind = classifySignalCliLogLine(line);
		if (kind === "log") params.log(`signal-cli: ${line.trim()}`);
		else if (kind === "error") params.error(`signal-cli: ${line.trim()}`);
	});
}
function resolveSignalCliConfigPath(raw) {
	const value = raw.trim();
	if (value === "~") return os.homedir();
	if (value.startsWith("~/") || value.startsWith("~\\")) return path.join(os.homedir(), value.slice(2));
	return value;
}
function buildDaemonArgs(opts) {
	const args = [];
	if (opts.configPath?.trim()) args.push("--config", resolveSignalCliConfigPath(opts.configPath));
	if (opts.account) args.push("-a", opts.account);
	args.push("daemon");
	if (opts.socketPath) args.push("--socket", opts.socketPath);
	else args.push("--http", `${opts.httpHost}:${opts.httpPort}`);
	args.push("--no-receive-stdout");
	if (opts.socketPath) args.push("--receive-mode", "manual");
	else if (opts.receiveMode) args.push("--receive-mode", opts.receiveMode);
	if (opts.ignoreAttachments) args.push("--ignore-attachments");
	if (opts.ignoreStories) args.push("--ignore-stories");
	if (opts.sendReadReceipts) args.push("--send-read-receipts");
	return args;
}
function spawnSignalDaemon(opts) {
	const args = buildDaemonArgs(opts);
	const child = spawn(opts.cliPath, args, { stdio: [
		"ignore",
		"pipe",
		"pipe"
	] });
	const log = opts.runtime?.log ?? (() => {});
	const error = opts.runtime?.error ?? (() => {});
	let exited = false;
	let settledExit = false;
	let stopPromise;
	let resolveExit;
	const exitedPromise = new Promise((resolve) => {
		resolveExit = resolve;
	});
	const settleExit = (value) => {
		if (settledExit) return;
		settledExit = true;
		exited = true;
		resolveExit(value);
	};
	bindSignalCliOutput({
		stream: child.stdout,
		log,
		error
	});
	bindSignalCliOutput({
		stream: child.stderr,
		log,
		error
	});
	child.once("exit", (code, signal) => {
		settleExit({
			source: "process",
			code: typeof code === "number" ? code : null,
			signal: signal ?? null
		});
		error(formatSignalDaemonExit({
			source: "process",
			code: code ?? null,
			signal: signal ?? null
		}));
	});
	child.once("close", (code, signal) => {
		settleExit({
			source: "process",
			code: typeof code === "number" ? code : null,
			signal: signal ?? null
		});
	});
	child.on("error", (err) => {
		if (child.pid === void 0) {
			error(`signal-cli spawn error: ${String(err)}`);
			settleExit({
				source: "spawn-error",
				code: null,
				signal: null
			});
		} else error(`signal-cli process error: ${String(err)}`);
	});
	return {
		pid: child.pid ?? void 0,
		exited: exitedPromise,
		isExited: () => exited,
		stop: () => {
			if (exited) return Promise.resolve();
			if (stopPromise) return stopPromise;
			if (!child.killed) try {
				child.kill("SIGTERM");
			} catch (err) {
				error(`signal-cli stop error: ${String(err)}`);
			}
			stopPromise = new Promise((resolve) => {
				const timeout = setTimeout(() => {
					if (!exited) try {
						child.kill("SIGKILL");
					} catch (err) {
						error(`signal-cli force-stop error: ${String(err)}`);
					}
				}, SIGNAL_DAEMON_STOP_KILL_TIMEOUT_MS);
				timeout.unref?.();
				exitedPromise.then(() => {
					clearTimeout(timeout);
					resolve();
				});
			});
			return stopPromise;
		}
	};
}
//#endregion
//#region extensions/signal/src/daemon-lifecycle.ts
function createSignalDaemonLifecycle(params) {
	let daemonHandle = null;
	let daemonStopRequested = false;
	let daemonStopPromise;
	let daemonExitError;
	const daemonAbortController = new AbortController();
	const abortSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, daemonAbortController.signal]) : daemonAbortController.signal;
	const stop = () => {
		if (daemonStopPromise) return daemonStopPromise;
		daemonStopRequested = true;
		if (!daemonAbortController.signal.aborted) daemonAbortController.abort(params.abortSignal?.reason ?? /* @__PURE__ */ new Error("Signal monitor stopped"));
		daemonStopPromise = daemonHandle?.stop() ?? Promise.resolve();
		return daemonStopPromise;
	};
	const attach = (handle) => {
		daemonHandle = handle;
		handle.exited.then((exit) => {
			if (daemonStopRequested || params.abortSignal?.aborted) return;
			daemonExitError = new Error(formatSignalDaemonExit(exit));
			if (!daemonAbortController.signal.aborted) daemonAbortController.abort(daemonExitError);
		});
	};
	return {
		attach,
		stop,
		getExitError: () => daemonExitError,
		abortSignal
	};
}
//#endregion
//#region extensions/signal/src/native-reply.ts
function resolveSignalNativeReplyId(params) {
	if (params.payload.replyToCurrent === false) return;
	const payloadReplyToId = normalizeOptionalString(params.payload.replyToId);
	const isExplicitCurrentReply = params.payload.replyToTag === true || params.payload.replyToCurrent === true;
	if (!payloadReplyToId && !isExplicitCurrentReply && params.replyContext?.allowImplicitCurrentMessage === false) return;
	const contextReplyToId = normalizeOptionalString(params.replyContext?.replyToId);
	if (!contextReplyToId || payloadReplyToId && payloadReplyToId !== contextReplyToId) return;
	return payloadReplyToId ?? contextReplyToId;
}
function isSignalStatusNoticePayload(payload) {
	return Boolean(payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice);
}
function createSignalNativeReplyIdPlan(params) {
	const replyToId = resolveSignalNativeReplyId(params);
	if (!replyToId) return {
		peek: () => void 0,
		markSent: () => void 0
	};
	const isExplicitReply = params.payload.replyToTag === true || params.payload.replyToCurrent === true;
	if (isSignalStatusNoticePayload(params.payload)) return {
		peek: params.replyToMode === "off" ? () => void 0 : () => replyToId,
		markSent: () => void 0
	};
	if (isExplicitReply) return {
		peek: () => replyToId,
		markSent: () => void 0
	};
	const planner = createReplyReferencePlanner({
		replyToMode: params.replyToMode,
		existingId: replyToId,
		hasReplied: params.replyContext?.state?.hasReplied
	});
	return {
		peek: () => planner.peek(),
		markSent: () => {
			planner.markSent();
			if (params.replyContext?.state) params.replyContext.state.hasReplied = planner.hasReplied();
		}
	};
}
//#endregion
//#region extensions/signal/src/monitor/access-policy.ts
const SIGNAL_UUID_KIND = "plugin:signal-uuid";
const SIGNAL_GROUP_KIND = "plugin:signal-group";
function strippedSignalEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return null;
	const signalStripped = trimmed.replace(/^signal:/i, "").trim();
	return {
		trimmed,
		signalStripped,
		lower: signalStripped.toLowerCase()
	};
}
function normalizeSignalGroupEntry(entry) {
	const parsed = strippedSignalEntry(entry);
	if (!parsed) return null;
	const { trimmed, signalStripped, lower } = parsed;
	if (lower.startsWith("group:")) return signalStripped.slice(6).trim() || null;
	return trimmed;
}
function normalizeSignalUuidEntry(entry) {
	const parsed = strippedSignalEntry(entry);
	if (!parsed) return null;
	const { signalStripped, lower } = parsed;
	if (lower.startsWith("uuid:")) return signalStripped.slice(5).trim() || null;
	return looksLikeUuid(signalStripped) ? signalStripped : null;
}
function normalizeSignalPhoneEntry(entry) {
	const parsed = strippedSignalEntry(entry);
	if (!parsed) return null;
	return normalizeSignalAllowRecipient(parsed.trimmed) ?? null;
}
const signalIngressIdentity = defineStableChannelIngressIdentity({
	key: "stable",
	normalizeEntry: () => null,
	aliases: [
		{
			key: "phone",
			kind: "phone",
			normalizeEntry: normalizeSignalPhoneEntry,
			normalizeSubject: (value) => value,
			sensitivity: "pii"
		},
		{
			key: "uuid",
			kind: SIGNAL_UUID_KIND,
			normalizeEntry: normalizeSignalUuidEntry,
			normalizeSubject: (value) => value,
			sensitivity: "pii"
		},
		{
			key: "group",
			kind: SIGNAL_GROUP_KIND,
			normalizeEntry: normalizeSignalGroupEntry,
			normalizeSubject: (value) => value
		}
	],
	isWildcardEntry: (entry) => entry.trim() === "*",
	resolveEntryId({ entryIndex, fieldKey }) {
		return `entry-${entryIndex + 1}:${fieldKey}`;
	}
});
function signalSubjectInput(params) {
	return {
		stableId: formatSignalSenderId(params.sender),
		aliases: {
			phone: params.sender.kind === "phone" ? params.sender.e164 : params.sender.aliases?.e164,
			uuid: params.sender.kind === "uuid" ? params.sender.raw : params.sender.aliases?.uuid,
			group: params.groupId
		}
	};
}
async function resolveSignalAccessState(params) {
	const isGroup = params.isGroup ?? params.groupId != null;
	const command = params.hasControlCommand === true ? {
		allowTextCommands: true,
		directGroupAllowFrom: "effective"
	} : void 0;
	return await getSignalRuntime().channel.inbound.ingress.createResolver({
		channelId: "signal",
		accountId: params.accountId,
		identity: signalIngressIdentity,
		cfg: params.cfg,
		...params.readStoreAllowFrom ? { readStoreAllowFrom: params.readStoreAllowFrom } : {},
		useDefaultPairingStore: params.readStoreAllowFrom == null
	}).message({
		subject: signalSubjectInput({
			sender: params.sender,
			groupId: isGroup ? params.groupId : void 0
		}),
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? params.groupId ?? "unknown" : params.sender.raw
		},
		contextBinding: params.contextBinding,
		...isGroup ? { event: { mayPair: false } } : {},
		dmPolicy: params.dmPolicy,
		groupPolicy: params.groupPolicy,
		policy: { groupAllowFromFallbackToAllowFrom: true },
		allowFrom: params.allowFrom,
		groupAllowFrom: params.groupAllowFrom,
		command
	});
}
async function handleSignalDirectMessageAccess(params) {
	if (params.dmAccessDecision === "allow") return true;
	if (params.dmAccessDecision === "block") {
		if (params.dmPolicy !== "disabled") params.log(`Blocked signal sender ${params.senderDisplay} (dmPolicy=${params.dmPolicy})`);
		return false;
	}
	if (params.dmPolicy === "pairing") await createChannelPairingChallengeIssuer({
		channel: "signal",
		accountId: params.accountId,
		upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
			channel: "signal",
			id,
			accountId: params.accountId,
			meta
		})
	})({
		senderId: params.senderId,
		senderIdLine: params.senderIdLine,
		meta: { name: params.senderName },
		sendPairingReply: params.sendPairingReply,
		onCreated: () => {
			params.log(`signal pairing request sender=${params.senderId}`);
		},
		onReplyError: (err) => {
			params.log(`signal pairing reply failed for ${params.senderId}: ${String(err)}`);
		}
	});
	return false;
}
//#endregion
//#region extensions/signal/src/monitor/event-handler.control-lane.ts
const SIGNAL_ACTIVE_RUN_CONTROL_COMMAND_KEYS = /* @__PURE__ */ new Set([
	"approve",
	"commands",
	"context",
	"help",
	"status",
	"steer",
	"tasks",
	"tools",
	"whoami"
]);
function resolveSignalConversationId(entry) {
	return (entry.isGroup ? entry.groupId : entry.senderPeerId)?.trim() || null;
}
function resolveSignalInboundDebounceKey(accountId, entry) {
	const conversationId = resolveSignalConversationId(entry);
	if (!conversationId || !entry.senderPeerId) return null;
	return `signal:${accountId}:${conversationId}:${entry.senderPeerId}`;
}
function resolveSignalInboundConversationKey(accountId, entry) {
	const conversationId = resolveSignalConversationId(entry);
	return conversationId ? `signal:${accountId}:${conversationId}` : null;
}
function isSignalActiveRunControlText(text) {
	if (isAbortRequestText(text)) return true;
	const normalizedBody = normalizeCommandBody(text.trim());
	const alias = maybeResolveTextAlias(normalizedBody);
	if (!alias) return false;
	const command = listChatCommands().find((entry) => entry.textAliases.some((candidate) => candidate.trim().toLowerCase() === alias));
	if (command?.key === "queue") return normalizedBody.slice(alias.length).trim() === "";
	return command ? SIGNAL_ACTIVE_RUN_CONTROL_COMMAND_KEYS.has(command.key) : false;
}
function resolveSignalControlLaneKey(accountId, entry) {
	if (!entry.commandAuthorized || !isSignalActiveRunControlText(entry.commandBody)) return null;
	const conversationId = resolveSignalConversationId(entry);
	return conversationId ? `signal:${accountId}:${conversationId}:control` : null;
}
function createSignalPendingInboundRegistry(accountId) {
	const trackedEntries = /* @__PURE__ */ new WeakMap();
	const countsByConversation = /* @__PURE__ */ new Map();
	const track = (entry) => {
		if (trackedEntries.has(entry)) return;
		const conversationKey = resolveSignalInboundConversationKey(accountId, entry);
		const inboundKey = resolveSignalInboundDebounceKey(accountId, entry);
		if (!conversationKey || !inboundKey) return;
		const counts = countsByConversation.get(conversationKey) ?? /* @__PURE__ */ new Map();
		counts.set(inboundKey, (counts.get(inboundKey) ?? 0) + 1);
		countsByConversation.set(conversationKey, counts);
		trackedEntries.set(entry, {
			conversationKey,
			inboundKey
		});
	};
	const complete = (entries) => {
		for (const entry of entries) {
			const tracked = trackedEntries.get(entry);
			if (!tracked) continue;
			trackedEntries.delete(entry);
			const counts = countsByConversation.get(tracked.conversationKey);
			const nextCount = (counts?.get(tracked.inboundKey) ?? 0) - 1;
			if (nextCount > 0) {
				counts?.set(tracked.inboundKey, nextCount);
				continue;
			}
			counts?.delete(tracked.inboundKey);
			if (counts?.size === 0) countsByConversation.delete(tracked.conversationKey);
		}
	};
	const cancelPendingOnAbort = (entry, cancelKey) => {
		if (!entry.commandAuthorized || !isAbortRequestText(entry.commandBody)) return;
		const conversationKey = resolveSignalInboundConversationKey(accountId, entry);
		if (!conversationKey) return;
		for (const inboundKey of countsByConversation.get(conversationKey)?.keys() ?? []) cancelKey(inboundKey);
	};
	return {
		track,
		complete,
		cancelPendingOnAbort
	};
}
//#endregion
//#region extensions/signal/src/monitor/inbound-context.ts
function resolveSignalQuoteContext(params) {
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg: params.cfg,
		channel: "signal",
		accountId: params.accountId
	});
	const quoteText = normalizeOptionalString(params.dataMessage?.quote?.text) ?? "";
	const quoteSender = resolveSignalSender({
		sourceNumber: params.dataMessage?.quote?.author ?? null,
		sourceUuid: params.dataMessage?.quote?.authorUuid ?? null
	});
	const quoteSenderAllowed = resolveInboundSupplementalSenderAllowed({
		isGroup: params.isGroup,
		groupPolicy: params.effectiveGroupAllow.length === 0 ? "open" : "allowlist",
		allowFrom: params.effectiveGroupAllow,
		isSenderAllowed: (allowFrom) => quoteSender ? isSignalSenderAllowed(quoteSender, allowFrom) : false
	});
	const visibleQuote = filterChannelInboundQuoteContext(contextVisibilityMode, {
		body: quoteText,
		sender: quoteSender ? formatSignalSenderDisplay(quoteSender) : void 0,
		senderAllowed: quoteSenderAllowed,
		isQuote: true
	});
	return {
		contextVisibilityMode,
		decision: {
			include: Boolean(visibleQuote),
			reason: visibleQuote ? contextVisibilityMode === "all" ? "mode_all" : quoteSenderAllowed ? "sender_allowed" : "quote_override" : "blocked"
		},
		quoteSenderAllowed,
		visibleQuoteText: visibleQuote?.body ?? "",
		visibleQuoteSender: visibleQuote?.sender
	};
}
//#endregion
//#region extensions/signal/src/monitor/mentions.ts
const OBJECT_REPLACEMENT = "￼";
function isValidMention(mention) {
	if (!mention) return false;
	if (!(mention.uuid || mention.number)) return false;
	if (typeof mention.start !== "number" || Number.isNaN(mention.start)) return false;
	if (typeof mention.length !== "number" || Number.isNaN(mention.length)) return false;
	return mention.length > 0;
}
function clampBounds(start, length, textLength) {
	const safeStart = Math.max(0, Math.trunc(start));
	return {
		start: safeStart,
		end: Math.min(textLength, safeStart + Math.max(0, Math.trunc(length)))
	};
}
function isValidStructuredMention(message, mention) {
	if (!mention || !(mention.uuid || mention.number)) return false;
	const { start, length } = mention;
	if (typeof start !== "number" || typeof length !== "number") return false;
	return Number.isInteger(start) && Number.isInteger(length) && start >= 0 && length > 0 && start + length <= message.length;
}
function normalizeAccountPhone(account) {
	const trimmed = account?.trim();
	return trimmed ? normalizeE164(trimmed) : void 0;
}
function resolveSignalNativeMentionFacts(params) {
	const validMentions = (params.mentions ?? []).filter((mention) => isValidStructuredMention(params.message, mention));
	const botUuid = params.accountUuid?.trim();
	const botPhone = normalizeAccountPhone(params.account);
	const canDetectBotMention = Boolean(botUuid || botPhone);
	const mentionsBot = validMentions.some((mention) => {
		const mentionUuid = mention.uuid?.trim();
		if (botUuid && mentionUuid === botUuid) return true;
		const mentionNumber = mention.number?.trim();
		return Boolean(botPhone && mentionNumber && normalizeE164(mentionNumber) === botPhone);
	});
	return {
		canDetectBotMention,
		hasAnyMention: validMentions.length > 0,
		mentionsBot
	};
}
function resolveSignalMentionFacts(identity, message, mentions) {
	return resolveSignalNativeMentionFacts({
		message,
		mentions,
		account: identity.account,
		accountUuid: identity.accountUuid
	});
}
function renderSignalMentions(message, mentions) {
	if (!message || !mentions?.length) return message;
	let normalized = message;
	const candidates = mentions.filter(isValidMention).toSorted((a, b) => b.start - a.start);
	for (const mention of candidates) {
		const identifier = mention.uuid ?? mention.number;
		if (!identifier) continue;
		const { start, end } = clampBounds(mention.start, mention.length, normalized.length);
		if (start >= end) continue;
		if (!normalized.slice(start, end).includes(OBJECT_REPLACEMENT)) continue;
		normalized = normalized.slice(0, start) + `@${identifier}` + normalized.slice(end);
	}
	return normalized;
}
//#endregion
//#region extensions/signal/src/monitor/event-handler.ts
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /reply session initialization conflicted for \S+/u;
const RETRYABLE_FLUSH_RETRY_DELAYS_MS = [
	1e3,
	2e3,
	4e3
];
function isSignalReplySessionInitConflictError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(formatErrorMessage(candidate)));
}
function resolveSignalInboundRoute(params) {
	return resolveAgentRoute({
		cfg: params.cfg,
		channel: "signal",
		accountId: params.accountId,
		peer: {
			kind: params.isGroup ? "group" : "direct",
			id: params.isGroup ? params.groupId ?? "unknown" : params.senderPeerId
		}
	});
}
function resolveSignalStatusReactionTimestamp(params) {
	if (typeof params.timestamp === "number") return Number.isFinite(params.timestamp) && params.timestamp > 0 ? params.timestamp : null;
	const parsed = Number(params.messageId);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
function hasSignalStatusReplyDeliveryFailure(result) {
	return Object.values(result.settledReceipt?.counts ?? {}).some((counts) => counts.failedBeforeSend > 0 || counts.failedAfterSend > 0);
}
function resolveSignalStatusReactionEmojis(emojis) {
	if (emojis?.stallHard !== void 0) return emojis;
	return {
		...emojis,
		stallHard: DEFAULT_EMOJIS.stallSoft
	};
}
async function finalizeSignalStatusReaction(params) {
	if (params.outcome === "done") await params.controller.setDone();
	else await params.controller.setError();
	await params.controller.restoreInitial();
}
function createSignalEventHandler(deps) {
	const readConfig = createRuntimeConfigReader(deps.cfg);
	const groupsConfigPath = resolveChannelGroupsConfigPath({
		cfg: deps.cfg,
		channel: "signal",
		accountId: deps.accountId,
		groups: resolveChannelGroups(deps.cfg, "signal", deps.accountId)
	});
	const statusReactionTiming = deps.statusReactionTiming ?? DEFAULT_TIMING;
	const activeEnqueueEntries = /* @__PURE__ */ new WeakSet();
	async function handleSignalInboundMessage(entry) {
		const { cfg } = entry;
		const fromLabel = formatInboundFromLabel({
			isGroup: entry.isGroup,
			groupLabel: entry.groupName ?? void 0,
			groupId: entry.groupId ?? "unknown",
			groupFallback: "Group",
			directLabel: entry.senderName,
			directId: entry.senderDisplay
		});
		const route = resolveSignalInboundRoute({
			cfg,
			accountId: deps.accountId,
			isGroup: entry.isGroup,
			groupId: entry.groupId,
			senderPeerId: entry.senderPeerId
		});
		const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
		const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
		const previousTimestamp = readSessionUpdatedAt({
			storePath,
			sessionKey: route.sessionKey
		});
		const body = formatInboundEnvelope({
			channel: "Signal",
			from: fromLabel,
			timestamp: entry.timestamp ?? void 0,
			body: entry.bodyText,
			chatType: entry.isGroup ? "group" : "direct",
			sender: {
				name: entry.senderName,
				id: entry.senderDisplay
			},
			previousTimestamp,
			envelope: envelopeOptions
		});
		let combinedBody = body;
		const historyKey = entry.isGroup ? entry.groupId ?? "unknown" : void 0;
		if (entry.isGroup && historyKey) combinedBody = createChannelHistoryWindow({ historyMap: deps.groupHistories }).buildPendingContext({
			historyKey,
			limit: deps.historyLimit,
			currentMessage: combinedBody,
			formatEntry: (historyEntry) => formatInboundEnvelope({
				channel: "Signal",
				from: fromLabel,
				timestamp: historyEntry.timestamp,
				body: `${[historyEntry.body, formatSignalMediaText(historyEntry.media ?? [])].filter(Boolean).join("\n")}${historyEntry.messageId ? ` [id:${historyEntry.messageId}]` : ""}`,
				chatType: "group",
				senderLabel: historyEntry.sender,
				envelope: envelopeOptions
			})
		});
		const signalToRaw = entry.isGroup ? `group:${entry.groupId}` : `signal:${entry.senderRecipient}`;
		const signalTo = normalizeSignalMessagingTarget(signalToRaw) ?? signalToRaw;
		const inboundHistory = entry.isGroup && historyKey && deps.historyLimit > 0 ? createChannelHistoryWindow({ historyMap: deps.groupHistories }).buildInboundHistory({
			historyKey,
			limit: deps.historyLimit
		}) : void 0;
		const replyToMode = resolveSignalReplyToMode({
			cfg,
			accountId: deps.accountId,
			chatType: entry.isGroup ? "group" : "direct"
		});
		const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, entry.isBatched === true);
		const media = await toInboundMediaFactsWithMetadata(entry.media);
		const ctxPayload = (deps.channelRuntime?.inbound.buildContext ?? buildChannelInboundEventContext)({
			channel: "signal",
			supplemental: { quote: entry.replyToBody ? {
				body: entry.replyToBody,
				sender: entry.replyToSender,
				isQuote: entry.replyToIsQuote
			} : void 0 },
			messageId: entry.messageId,
			timestamp: entry.timestamp ?? void 0,
			from: entry.isGroup ? `group:${entry.groupId ?? "unknown"}` : `signal:${entry.senderRecipient}`,
			sender: {
				id: entry.senderDisplay,
				name: entry.senderName
			},
			conversation: {
				kind: entry.isGroup ? "group" : "direct",
				id: entry.isGroup ? entry.groupId ?? "unknown" : entry.senderRecipient,
				label: fromLabel
			},
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				accountId: route.accountId,
				routeSessionKey: route.sessionKey
			},
			reply: {
				to: signalTo,
				replyToId: entry.replyToId ?? entry.messageId
			},
			message: {
				body: combinedBody,
				bodyForAgent: entry.bodyText,
				inboundHistory,
				rawBody: entry.commandBody,
				commandBody: entry.commandBody
			},
			sessionTranscript: { historyLimit: entry.isGroup ? deps.historyLimit : 0 },
			access: {
				...entry.isGroup ? { mentions: {
					canDetectMention: true,
					wasMentioned: entry.wasMentioned === true
				} } : {},
				commands: { authorized: entry.commandAuthorized }
			},
			channelIngress: entry.channelIngress,
			media,
			extra: {
				GroupSubject: entry.isGroup ? entry.groupName ?? void 0 : void 0,
				ReplyThreading: replyThreading
			}
		});
		if (shouldLogVerbose()) {
			const preview = truncateUtf16Safe(body, 200).replace(/\r/g, "\\r").replace(/\n/g, "\\n");
			logVerbose(`signal inbound: from=${ctxPayload.From} len=${body.length} preview="${preview}"`);
		}
		const statusReactionTimestamp = resolveSignalStatusReactionTimestamp(entry);
		const statusReactionsConfig = cfg.messages?.statusReactions;
		const signalReactionLevel = resolveSignalReactionLevel({
			cfg,
			accountId: route.accountId
		});
		const ackReaction = resolveAckReaction(cfg, route.agentId, {
			channel: "signal",
			accountId: route.accountId
		});
		const shouldSendStatusReaction = Boolean(ackReaction && shouldAckReaction({
			scope: cfg.messages?.ackReactionScope,
			isDirect: !entry.isGroup,
			isGroup: entry.isGroup,
			isMentionableGroup: entry.isGroup,
			canDetectMention: entry.canDetectMention === true,
			effectiveWasMentioned: entry.wasMentioned === true
		}));
		const statusReactionTarget = `${entry.groupId ?? entry.senderRecipient}/${statusReactionTimestamp ?? "unknown"}`;
		const signalReactionOpts = {
			cfg,
			...deps.baseUrl ? { baseUrl: deps.baseUrl } : {},
			...deps.account ? { account: deps.account } : {},
			...deps.accountId ? { accountId: deps.accountId } : {},
			...entry.isGroup && entry.groupId ? {
				groupId: entry.groupId,
				targetAuthor: entry.senderRecipient
			} : {}
		};
		const statusReactionRecipient = entry.isGroup ? "" : entry.senderRecipient;
		const statusReactionController = statusReactionsConfig?.enabled === true && signalReactionLevel.level !== "off" && shouldSendStatusReaction && statusReactionTimestamp ? createStatusReactionController({
			enabled: true,
			adapter: { setReaction: async (emoji) => {
				await sendReactionSignal(statusReactionRecipient, statusReactionTimestamp, emoji, signalReactionOpts);
			} },
			initialEmoji: ackReaction,
			emojis: resolveSignalStatusReactionEmojis(void 0),
			timing: statusReactionTiming,
			onError: (err) => {
				logAckFailure({
					log: logVerbose,
					channel: "signal",
					target: statusReactionTarget,
					error: err
				});
			}
		}) : null;
		if (statusReactionController) statusReactionController.setQueued();
		const { onModelSelected, typingCallbacks, ...replyPipeline } = createChannelMessageReplyPipeline({
			cfg,
			agentId: route.agentId,
			channel: "signal",
			accountId: route.accountId,
			typing: {
				start: async () => {
					if (!ctxPayload.To) return;
					await sendTypingSignal(ctxPayload.To, {
						cfg,
						baseUrl: deps.baseUrl,
						account: deps.account,
						accountId: deps.accountId
					});
				},
				onStartError: (err) => {
					logTypingFailure({
						log: logVerbose,
						channel: "signal",
						target: ctxPayload.To ?? void 0,
						error: err
					});
				}
			}
		});
		const nativeReplyContext = {
			replyToId: ctxPayload.ReplyToId,
			author: entry.senderRecipient,
			body: entry.nativeReplyBody ?? entry.bodyText,
			allowImplicitCurrentMessage: replyToMode !== "off" && replyThreading?.implicitCurrentMessage !== "deny",
			state: { hasReplied: false }
		};
		const dispatcherOptions = {
			...replyPipeline,
			propagateRetryableNoSendFailure: true,
			humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
			typingCallbacks
		};
		const delivery = {
			deliver: async (payload, _info) => {
				await deps.deliverReplies({
					cfg,
					replies: [payload],
					target: ctxPayload.To,
					baseUrl: deps.baseUrl,
					account: deps.account,
					accountUuid: deps.accountUuid,
					accountId: deps.accountId,
					runtime: deps.runtime,
					maxBytes: deps.mediaMaxBytes,
					textLimit: deps.textLimit,
					replyContext: nativeReplyContext,
					chatType: entry.isGroup ? "group" : "direct"
				});
			},
			durable: (payload, info) => {
				if (info.kind !== "final") return false;
				const replyPlan = createSignalNativeReplyIdPlan({
					payload,
					replyContext: nativeReplyContext,
					replyToMode
				});
				const send = async (to, text, options) => {
					entry.turnAdoptionLifecycle?.abortSignal.throwIfAborted();
					deps.abortSignal?.throwIfAborted();
					const result = await sendMessageSignal(to, text, {
						...options,
						baseUrl: deps.baseUrl,
						account: deps.account,
						maxBytes: deps.mediaMaxBytes,
						accountId: deps.accountId
					});
					replyPlan.markSent();
					return result;
				};
				return {
					deps: { signal: send },
					replyToId: replyPlan.peek() ?? null,
					replyToMode
				};
			},
			onError: (err, info) => {
				deps.runtime.error?.(danger(`signal ${info.kind} reply failed: ${String(err)}`));
			}
		};
		const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
			route,
			sessionKey: route.sessionKey
		});
		await runChannelInboundEvent({
			channel: "signal",
			accountId: route.accountId,
			raw: entry,
			adapter: {
				ingest: () => ({
					id: entry.messageId ?? `${entry.timestamp ?? Date.now()}`,
					timestamp: entry.timestamp,
					rawText: entry.commandBody,
					raw: entry
				}),
				resolveTurn: () => ({
					cfg,
					channel: "signal",
					accountId: route.accountId,
					route: {
						agentId: route.agentId,
						sessionKey: route.sessionKey
					},
					ctxPayload,
					dispatchReplyFromConfig: deps.channelRuntime?.reply?.dispatchReplyFromConfig,
					record: {
						updateLastRoute: !entry.isGroup ? {
							sessionKey: inboundLastRouteSessionKey,
							channel: "signal",
							to: entry.senderRecipient,
							accountId: route.accountId,
							mainDmOwnerPin: (() => {
								if (inboundLastRouteSessionKey !== route.mainSessionKey) return;
								const pinnedOwner = resolvePinnedMainDmOwnerFromAllowlist({
									dmScope: cfg.session?.dmScope,
									allowFrom: deps.allowFrom,
									normalizeEntry: normalizeSignalAllowRecipient
								});
								if (!pinnedOwner) return;
								return {
									ownerRecipient: pinnedOwner,
									senderRecipient: entry.senderRecipient,
									onSkip: ({ ownerRecipient, senderRecipient }) => {
										logVerbose(`signal: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
									}
								};
							})()
						} : void 0,
						onRecordError: (err) => {
							logVerbose(`signal: failed updating session meta: ${String(err)}`);
						}
					},
					history: {
						isGroup: entry.isGroup,
						historyKey,
						historyMap: deps.groupHistories,
						limit: deps.historyLimit
					},
					afterRecord: () => {
						if (statusReactionController) statusReactionController.setThinking();
					},
					dispatcherOptions,
					delivery,
					sessionInitRetry: { delaysMs: [] },
					replyOptions: {
						...entry.turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(entry.turnAdoptionLifecycle) : {},
						disableBlockStreaming: typeof deps.blockStreaming === "boolean" ? !deps.blockStreaming : void 0,
						...statusReactionController ? {
							allowProgressCallbacksWhenSourceDeliverySuppressed: true,
							allowToolLifecycleWhenProgressHidden: true,
							onToolStart: async (payload) => {
								const toolName = payload.name?.trim();
								if (toolName) await statusReactionController.setTool(toolName);
								return false;
							},
							onCompactionStart: async () => {
								await statusReactionController.setCompacting();
								return false;
							},
							onCompactionEnd: async () => {
								statusReactionController.cancelPending();
								await statusReactionController.setThinking();
								return false;
							}
						} : {},
						onModelSelected
					}
				}),
				onFinalize: (result) => {
					if (!statusReactionController) return;
					const hasFinalResponse = result.dispatched && hasVisibleInboundReplyDispatch(result.dispatchResult);
					const hasDeliveryFailure = result.dispatched && hasSignalStatusReplyDeliveryFailure(result.dispatchResult);
					const hasAgentRunFailure = result.dispatched && readAgentRunTerminalOutcome(result.dispatchResult) === "failed";
					finalizeSignalStatusReaction({
						controller: statusReactionController,
						outcome: hasFinalResponse && !hasDeliveryFailure && !hasAgentRunFailure ? "done" : "error"
					}).catch((err) => {
						logVerbose(`signal: status reaction finalize failed: ${String(err)}`);
					});
				}
			}
		});
	}
	async function flushSignalInboundEntries(entries, lifecycle, settle) {
		const last = entries.at(-1);
		if (!last) return;
		const channelIngress = await resolveSignalBatchChannelIngress(entries, last);
		if (channelIngress.some((entry) => !entry.senderAccess.allowed)) {
			logVerbose("signal: authorization changed before dispatch");
			await settle();
			return;
		}
		if (entries.length === 1) {
			await handleSignalInboundMessage({
				...last,
				channelIngress,
				turnAdoptionLifecycle: lifecycle
			});
			await settle();
			return;
		}
		const combinedText = entries.map((entry) => entry.bodyText).filter(Boolean).join("\n");
		const combinedCommandBody = entries.map((entry) => entry.commandBody).filter(Boolean).join("\n");
		if (!combinedText.trim()) {
			await settle();
			return;
		}
		await handleSignalInboundMessage({
			...last,
			bodyText: combinedText,
			commandBody: combinedCommandBody,
			turnAdoptionLifecycle: lifecycle,
			isBatched: true,
			nativeReplyBody: last.nativeReplyBody ?? last.bodyText,
			media: entries.flatMap((entry) => entry.media ?? []),
			channelIngress
		});
		await settle();
	}
	async function resolveSignalBatchChannelIngress(entries, last) {
		if (last.boundChannelIngress) return last.boundChannelIngress;
		const route = resolveSignalInboundRoute({
			cfg: last.cfg,
			accountId: deps.accountId,
			isGroup: last.isGroup,
			groupId: last.groupId,
			senderPeerId: last.senderPeerId
		});
		const contextBinding = {
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			...last.messageId ? { messageId: last.messageId } : {},
			inboundEventKind: "user_request"
		};
		const resolved = await Promise.all(entries.flatMap((entry) => entry.resolveChannelIngress ? [entry.resolveChannelIngress(contextBinding)] : (entry.channelIngress ?? []).map(async (ingress) => ingress)));
		last.boundChannelIngress = resolved;
		return resolved;
	}
	async function retrySignalInboundFlush(entries, lifecycle, settle, initialError) {
		let lastError = initialError;
		for (const [attemptIndex, delayMs] of RETRYABLE_FLUSH_RETRY_DELAYS_MS.entries()) {
			const attempt = attemptIndex + 1;
			logVerbose(`signal: reply session init conflict, retrying ${entries.length} inbound message(s) in ${delayMs}ms (attempt ${attempt}/${RETRYABLE_FLUSH_RETRY_DELAYS_MS.length})`);
			try {
				await setTimeout$1(delayMs, void 0, {
					ref: false,
					signal: deps.abortSignal
				});
			} catch (err) {
				if (deps.abortSignal?.aborted) return;
				throw err;
			}
			if (deps.abortSignal?.aborted) return;
			try {
				await flushSignalInboundEntries(entries, lifecycle, settle);
				return;
			} catch (err) {
				if (deps.abortSignal?.aborted) return;
				lastError = err;
				if (!isSignalReplySessionInitConflictError(err)) throw err;
			}
		}
		throw lastError;
	}
	const flushDebouncedSignalInboundEntries = (entries, createFlush) => {
		const { lifecycle, settle } = fanInChannelIngressLifecycles(entries.map((entry) => entry.turnAdoptionLifecycle));
		return createFlush({
			lifecycle,
			dispatch: async (admissionLifecycle) => {
				if (!entries.some((entry) => activeEnqueueEntries.has(entry)) && deps.abortSignal?.aborted) return;
				try {
					await flushSignalInboundEntries(entries, admissionLifecycle, settle);
				} catch (err) {
					if (!isSignalReplySessionInitConflictError(err)) throw err;
					if (deps.abortSignal?.aborted) return;
					await retrySignalInboundFlush(entries, admissionLifecycle, settle, err).catch(async (terminalError) => {
						await lifecycle?.onAbandoned();
						throw terminalError;
					});
				}
			}
		});
	};
	const reportSignalInboundFlushError = (err) => {
		deps.runtime.error?.(`signal debounce flush failed: ${String(err)}`);
	};
	const pendingInboundRegistry = createSignalPendingInboundRegistry(deps.accountId);
	const trackSignalInboundFlush = (flush) => {
		deps.runTrackedTask?.(() => flush.completion.catch(() => void 0));
		return flush;
	};
	const flushNormalSignalInboundEntries = (entries, createFlush) => {
		const flush = flushDebouncedSignalInboundEntries(entries, createFlush);
		const completion = flush.completion.finally(() => pendingInboundRegistry.complete(entries));
		return trackSignalInboundFlush({
			admission: flush.admission,
			completion
		});
	};
	const { debouncer } = createChannelInboundDebouncer({
		cfg: deps.cfg,
		channel: "signal",
		resolveDebounceMs: (entry) => resolveInboundDebounceMs({
			cfg: entry.cfg,
			channel: "signal"
		}),
		buildKey: (entry) => resolveSignalInboundDebounceKey(deps.accountId, entry),
		shouldDebounce: (entry) => shouldDebounceTextInbound({
			text: entry.commandBody,
			cfg: deps.cfg,
			hasMedia: entry.media?.some((media) => Boolean(media.path || media.url)) === true
		}),
		onFlush: flushNormalSignalInboundEntries,
		onError: reportSignalInboundFlushError,
		onCancel: pendingInboundRegistry.complete
	});
	const { debouncer: controlDebouncer } = createChannelInboundDebouncer({
		cfg: deps.cfg,
		channel: "signal",
		serializeImmediate: true,
		buildKey: (entry) => resolveSignalControlLaneKey(deps.accountId, entry),
		shouldDebounce: () => false,
		onFlush: (entries, createFlush) => trackSignalInboundFlush(flushDebouncedSignalInboundEntries(entries, createFlush)),
		onError: reportSignalInboundFlushError
	});
	async function handleReactionOnlyInbound(params) {
		if (params.hasBodyContent) return false;
		if (params.reaction.isRemove) return true;
		const emojiLabel = normalizeOptionalString(params.reaction.emoji) ?? "emoji";
		const senderName = params.envelope.sourceName ?? params.senderDisplay;
		logVerbose(`signal reaction: ${emojiLabel} from ${senderName}`);
		const groupId = params.reaction.groupInfo?.groupId ?? void 0;
		const groupName = params.reaction.groupInfo?.groupName ?? void 0;
		const isGroup = Boolean(groupId);
		const messageId = params.reaction.targetSentTimestamp ? String(params.reaction.targetSentTimestamp) : "unknown";
		const conversationKey = resolveSignalApprovalConversationKey(groupId ? `group:${groupId}` : `signal:${resolveSignalRecipient(params.sender)}`);
		if (conversationKey && await maybeResolveSignalApprovalReaction({
			cfg: params.cfg,
			accountId: deps.accountId,
			conversationKey,
			messageId,
			reactionKey: emojiLabel,
			actorId: formatSignalSenderId(params.sender),
			targetAuthor: params.reaction.targetAuthor,
			targetAuthorUuid: params.reaction.targetAuthorUuid,
			logVerboseMessage: logVerbose
		})) return true;
		if (params.accessDecision.decision !== "allow") {
			logVerbose(`Blocked signal reaction sender ${params.senderDisplay} (${params.accessDecision.reasonCode})`);
			return true;
		}
		if (conversationKey && await maybeResolveSignalQuestionReaction({
			cfg: params.cfg,
			accountId: deps.accountId,
			conversationKey,
			messageId,
			reactionKey: emojiLabel,
			isRemove: Boolean(params.reaction.isRemove),
			actorId: formatSignalSenderId(params.sender),
			targetAuthor: params.reaction.targetAuthor,
			targetAuthorUuid: params.reaction.targetAuthorUuid,
			logDebug: logVerbose
		})) return true;
		const targets = deps.resolveSignalReactionTargets(params.reaction);
		if (!deps.shouldEmitSignalReactionNotification({
			mode: deps.reactionMode,
			account: deps.account,
			accountUuid: deps.accountUuid,
			targets,
			sender: params.sender,
			allowlist: deps.reactionAllowlist
		})) return true;
		const senderPeerId = resolveSignalPeerId(params.sender);
		const route = resolveSignalInboundRoute({
			cfg: params.cfg,
			accountId: deps.accountId,
			isGroup,
			groupId,
			senderPeerId
		});
		const groupLabel = isGroup ? `${groupName ?? "Signal Group"} id:${groupId}` : void 0;
		const text = deps.buildSignalReactionSystemEventText({
			emojiLabel,
			actorLabel: senderName,
			messageId,
			targetLabel: targets[0]?.display,
			groupLabel
		});
		const contextKey = [
			"signal",
			"reaction",
			"added",
			messageId,
			formatSignalSenderId(params.sender),
			emojiLabel,
			groupId ?? ""
		].filter(Boolean).join(":");
		enqueueSystemEvent(text, {
			sessionKey: route.sessionKey,
			contextKey
		});
		return true;
	}
	return async (event, turnAdoptionLifecycle, preparedPayload) => {
		if (event.event !== "receive" || !event.data) return;
		const cfg = readConfig();
		let payload = preparedPayload ?? null;
		if (!preparedPayload) try {
			payload = JSON.parse(event.data);
		} catch (err) {
			deps.runtime.error?.(`failed to parse event: ${String(err)}`);
			return;
		}
		if (payload?.exception?.message) deps.runtime.error?.(`receive exception: ${payload.exception.message}`);
		const envelope = payload?.envelope;
		if (!envelope) return;
		const sender = resolveSignalSender(envelope);
		if (!sender) return;
		const normalizedAccount = deps.account ? normalizeE164(deps.account) : void 0;
		if (sender.kind === "phone" && normalizedAccount != null && sender.e164 === normalizedAccount || sender.kind === "uuid" && deps.accountUuid != null && sender.raw === deps.accountUuid) return;
		if ("syncMessage" in envelope) return;
		const dataMessage = envelope.dataMessage ?? envelope.editMessage?.dataMessage;
		const reaction = deps.isSignalReactionMessage(envelope.reactionMessage) ? envelope.reactionMessage : deps.isSignalReactionMessage(dataMessage?.reaction) ? dataMessage?.reaction : null;
		const rawMessage = dataMessage?.message ?? "";
		const messageText = renderSignalMentions(rawMessage, dataMessage?.mentions).trim();
		const groupId = dataMessage?.groupInfo?.groupId ?? reaction?.groupInfo?.groupId ?? void 0;
		const isGroup = Boolean(groupId);
		const hasControlCommandInMessage = isControlCommandMessage(messageText, cfg);
		const senderDisplay = formatSignalSenderDisplay(sender);
		const resolveChannelIngress = async (contextBinding) => await resolveSignalAccessState({
			accountId: deps.accountId,
			dmPolicy: deps.dmPolicy,
			groupPolicy: deps.groupPolicy,
			allowFrom: deps.allowFrom,
			groupAllowFrom: deps.groupAllowFrom,
			sender,
			groupId,
			isGroup,
			cfg,
			hasControlCommand: hasControlCommandInMessage,
			contextBinding
		});
		const { senderAccess, commandAccess } = await resolveChannelIngress();
		const quoteText = normalizeOptionalString(dataMessage?.quote?.text) ?? "";
		const { contextVisibilityMode, quoteSenderAllowed, visibleQuoteText, visibleQuoteSender } = resolveSignalQuoteContext({
			cfg,
			accountId: deps.accountId,
			isGroup,
			dataMessage,
			effectiveGroupAllow: senderAccess.effectiveGroupAllowFrom
		});
		if (quoteText && !visibleQuoteText && isGroup) logVerbose(`signal: drop quote context (mode=${contextVisibilityMode}, sender_allowed=${quoteSenderAllowed ? "yes" : "no"})`);
		const hasBodyContent = Boolean(messageText || visibleQuoteText) || Boolean(!reaction && dataMessage?.attachments?.length);
		if (reaction && await handleReactionOnlyInbound({
			cfg,
			envelope,
			sender,
			senderDisplay,
			reaction,
			hasBodyContent,
			accessDecision: senderAccess
		})) return;
		if (!dataMessage) return;
		const senderRecipient = resolveSignalRecipient(sender);
		const senderPeerId = resolveSignalPeerId(sender);
		const senderAllowId = formatSignalSenderId(sender);
		if (!senderRecipient) return;
		const senderIdLine = formatSignalPairingIdLine(sender);
		const groupName = dataMessage.groupInfo?.groupName ?? void 0;
		if (!isGroup) {
			if (!await handleSignalDirectMessageAccess({
				dmPolicy: deps.dmPolicy,
				dmAccessDecision: senderAccess.decision,
				senderId: senderAllowId,
				senderIdLine,
				senderDisplay,
				senderName: envelope.sourceName ?? void 0,
				accountId: deps.accountId,
				sendPairingReply: async (text) => {
					await sendMessageSignal(`signal:${senderRecipient}`, text, {
						cfg,
						baseUrl: deps.baseUrl,
						account: deps.account,
						maxBytes: deps.mediaMaxBytes,
						accountId: deps.accountId
					});
				},
				log: logVerbose
			})) return;
		}
		if (isGroup) {
			if (senderAccess.decision !== "allow") {
				if (senderAccess.reasonCode === "group_policy_disabled") logVerbose("Blocked signal group message (groupPolicy: disabled)");
				else if (senderAccess.reasonCode === "group_policy_empty_allowlist") logVerbose("Blocked signal group message (groupPolicy: allowlist, no groupAllowFrom)");
				else logVerbose(`Blocked signal group sender ${senderDisplay} (not in groupAllowFrom)`);
				return;
			}
		}
		const commandAuthorized = commandAccess.authorized;
		if (isGroup && commandAccess.shouldBlockControlCommand) {
			logInboundDrop({
				log: logVerbose,
				channel: "signal",
				reason: "control command (unauthorized)",
				target: senderDisplay
			});
			return;
		}
		const route = resolveSignalInboundRoute({
			cfg,
			accountId: deps.accountId,
			isGroup,
			groupId,
			senderPeerId
		});
		const inboundTimestamp = typeof envelope.timestamp === "number" ? envelope.timestamp : typeof dataMessage.timestamp === "number" ? dataMessage.timestamp : void 0;
		const nativeReplyTargetTimestamp = typeof envelope.editMessage?.targetSentTimestamp === "number" ? envelope.editMessage.targetSentTimestamp : inboundTimestamp;
		const messageId = typeof inboundTimestamp === "number" ? String(inboundTimestamp) : void 0;
		const replyToId = typeof nativeReplyTargetTimestamp === "number" ? String(nativeReplyTargetTimestamp) : void 0;
		const signalToRaw = isGroup ? `group:${groupId}` : `signal:${senderRecipient}`;
		const signalTo = normalizeSignalMessagingTarget(signalToRaw) ?? signalToRaw;
		const mentionRegexes = buildMentionRegexes(cfg, route.agentId);
		const textWasMentioned = isGroup && matchesMentionPatterns(messageText, mentionRegexes);
		const nativeMentionFacts = resolveSignalMentionFacts(deps, rawMessage, dataMessage?.mentions);
		const wasMentioned = isGroup && (textWasMentioned || nativeMentionFacts.mentionsBot);
		const requireMention = isGroup && resolveChannelGroupRequireMention({
			cfg,
			channel: "signal",
			groupId,
			accountId: deps.accountId,
			configuredGroupDefaultsToNoMention: true
		});
		const canDetectMention = mentionRegexes.length > 0 || nativeMentionFacts.canDetectBotMention;
		const mentionDecision = resolveInboundMentionDecision({
			facts: {
				canDetectMention,
				wasMentioned,
				hasAnyMention: nativeMentionFacts.hasAnyMention,
				implicitMentionKinds: []
			},
			policy: {
				isGroup,
				requireMention,
				allowTextCommands: true,
				hasControlCommand: hasControlCommandInMessage,
				commandAuthorized
			}
		});
		const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
		if (isGroup && requireMention && canDetectMention && mentionDecision.shouldSkip) {
			logInboundDrop({
				log: deps.runtime.log,
				channel: "signal",
				reason: "no mention",
				target: groupId,
				onceKey: JSON.stringify([deps.accountId, groupId]),
				hint: `Mention patterns can be derived from the agent identity name. Set ${groupsConfigPath}[${JSON.stringify(groupId)}].requireMention=false to process messages without a mention. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`
			});
			const pendingMedia = (dataMessage.attachments ?? []).map((attachment) => {
				const contentType = attachment?.contentType ?? void 0;
				return {
					contentType,
					kind: kindFromMime(contentType) ?? "unknown"
				};
			});
			const pendingMediaText = formatSignalMediaText(pendingMedia);
			const pendingBodyText = messageText || pendingMediaText || visibleQuoteText;
			const historyKey = groupId ?? "unknown";
			createChannelHistoryWindow({ historyMap: deps.groupHistories }).record({
				historyKey,
				limit: deps.historyLimit,
				entry: {
					sender: envelope.sourceName ?? senderDisplay,
					body: messageText || visibleQuoteText,
					media: toHistoryMediaEntries(pendingMedia),
					timestamp: inboundTimestamp,
					messageId
				}
			});
			await registerSignalReplyContext({
				accountId: deps.accountId,
				to: signalTo,
				replyToId,
				author: senderRecipient,
				body: messageText || visibleQuoteText,
				media: pendingMedia,
				sourceTimestamp: inboundTimestamp
			});
			const signalGroupPolicy = resolveChannelGroupPolicy({
				cfg,
				channel: "signal",
				groupId,
				accountId: deps.accountId
			});
			if ((signalGroupPolicy.groupConfig?.ingest ?? signalGroupPolicy.defaultConfig?.ingest) === true) fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "received", route.sessionKey, toInternalMessageReceivedContext({
				from: `group:${groupId}`,
				to: signalTo,
				content: pendingBodyText,
				timestamp: envelope.timestamp ?? void 0,
				channelId: "signal",
				accountId: deps.accountId,
				conversationId: signalTo,
				messageId: typeof envelope.timestamp === "number" ? String(envelope.timestamp) : void 0,
				senderId: senderDisplay,
				senderName: envelope.sourceName ?? void 0,
				provider: "signal",
				surface: "signal",
				originatingChannel: "signal",
				originatingTo: signalTo,
				isGroup: true,
				groupId: signalTo
			}))), "signal: mention-skip message hook failed");
			return;
		}
		const attachments = dataMessage.attachments ?? [];
		const mediaFacts = attachments.map((attachment) => {
			const contentType = attachment?.contentType ?? void 0;
			return {
				contentType,
				kind: kindFromMime(contentType) ?? "unknown"
			};
		});
		let unavailableAttachmentCount = deps.ignoreAttachments ? attachments.length : 0;
		if (!deps.ignoreAttachments) for (const [index, attachment] of attachments.entries()) {
			if (!attachment?.id) {
				unavailableAttachmentCount += 1;
				continue;
			}
			try {
				const fetched = await deps.fetchAttachment({
					baseUrl: deps.baseUrl,
					account: deps.account,
					attachment,
					sender: senderRecipient,
					groupId,
					maxBytes: deps.mediaMaxBytes
				});
				if (fetched) {
					const contentType = fetched.contentType ?? attachment.contentType ?? "application/octet-stream";
					mediaFacts[index] = {
						path: fetched.path,
						url: fetched.path,
						contentType,
						kind: kindFromMime(contentType) ?? "unknown"
					};
				} else unavailableAttachmentCount += 1;
			} catch (err) {
				unavailableAttachmentCount += 1;
				deps.runtime.error?.(danger(`attachment fetch failed: ${String(err)}`));
			}
		}
		let bodyText = messageText;
		if (unavailableAttachmentCount > 0) {
			const attachmentLabel = unavailableAttachmentCount === 1 ? "attachment" : "attachments";
			bodyText = formatInboundMediaUnavailableText({
				body: bodyText,
				notice: `[signal ${unavailableAttachmentCount > 1 ? `${unavailableAttachmentCount} ` : ""}${attachmentLabel} unavailable]`
			});
		}
		if (!bodyText && mediaFacts.length === 0 && !visibleQuoteText) return;
		if (deps.sendReadReceipts && !deps.readReceiptsViaDaemon && !isGroup && inboundTimestamp) try {
			await sendReadReceiptSignal(`signal:${senderRecipient}`, inboundTimestamp, {
				cfg,
				baseUrl: deps.baseUrl,
				account: deps.account,
				accountId: deps.accountId
			});
		} catch (err) {
			logVerbose(`signal read receipt failed for ${senderDisplay}: ${String(err)}`);
		}
		else if (deps.sendReadReceipts && !deps.readReceiptsViaDaemon && !isGroup && !inboundTimestamp) logVerbose(`signal read receipt skipped (missing timestamp) for ${senderDisplay}`);
		const senderName = envelope.sourceName ?? senderDisplay;
		await registerSignalReplyContext({
			accountId: deps.accountId,
			to: signalTo,
			replyToId,
			author: senderRecipient,
			body: messageText,
			media: mediaFacts,
			sourceTimestamp: inboundTimestamp
		});
		const entry = {
			cfg,
			senderName,
			senderDisplay,
			senderRecipient,
			senderPeerId,
			groupId,
			groupName,
			isGroup,
			bodyText,
			nativeReplyBody: [messageText, formatSignalMediaText(mediaFacts)].filter(Boolean).join("\n"),
			commandBody: messageText,
			timestamp: inboundTimestamp,
			messageId,
			replyToId,
			media: mediaFacts,
			commandAuthorized,
			canDetectMention,
			requireMention,
			wasMentioned: effectiveWasMentioned,
			replyToBody: visibleQuoteText || void 0,
			replyToSender: visibleQuoteSender,
			replyToIsQuote: visibleQuoteText ? true : void 0,
			turnAdoptionLifecycle,
			resolveChannelIngress
		};
		pendingInboundRegistry.cancelPendingOnAbort(entry, debouncer.cancelKey);
		const inboundLane = resolveSignalControlLaneKey(deps.accountId, entry) ? controlDebouncer : debouncer;
		if (inboundLane === debouncer) pendingInboundRegistry.track(entry);
		activeEnqueueEntries.add(entry);
		try {
			await inboundLane.enqueue(entry);
		} finally {
			activeEnqueueEntries.delete(entry);
		}
		if (turnAdoptionLifecycle) return { kind: "deferred" };
	};
}
//#endregion
//#region extensions/signal/src/reaction-targets.ts
async function registerSignalReactionTargetsForDeliveredPayload(params) {
	registerSignalQuestionReactionTargetForDeliveredPayload(params);
	await registerSignalApprovalReactionTargetForDeliveredPayload(params);
}
//#endregion
//#region extensions/signal/src/signal-ingress.ts
const SIGNAL_INGRESS_DRAIN_INTERVAL_MS = 1e3;
const SignalIngressPermanentError = createChannelIngressError("SignalIngressPermanentError", { withReason: true });
function normalizeTimestamp(value) {
	return asPositiveSafeInteger(value) ?? null;
}
function parseReceivePayload(event) {
	if (event.event !== "receive" || !event.data) return null;
	let parsed;
	try {
		parsed = JSON.parse(event.data);
	} catch (error) {
		throw new SignalIngressPermanentError("parse-error", "Signal receive event contains invalid JSON", { cause: error });
	}
	if (!isRecord(parsed)) throw new SignalIngressPermanentError("parse-error", "Signal receive event must contain a JSON object");
	return parsed;
}
function resolveDataMessage(envelope) {
	if (isRecord(envelope.dataMessage)) return envelope.dataMessage;
	return isRecord(envelope.editMessage?.dataMessage) ? envelope.editMessage.dataMessage : null;
}
function inspectSignalIngressEvent(prepared) {
	const payload = prepared[1] ??= parseReceivePayload(prepared[0]);
	const envelope = isRecord(payload?.envelope) ? payload.envelope : null;
	if (!envelope || "syncMessage" in envelope) return null;
	const dataMessage = resolveDataMessage(envelope);
	const reactionMessage = isRecord(envelope.reactionMessage) ? envelope.reactionMessage : null;
	if (!dataMessage && !reactionMessage) return null;
	const senderUuid = normalizeNullableString(envelope.sourceUuid);
	const senderNumber = normalizeNullableString(envelope.sourceNumber);
	const senderKey = senderUuid ? `uuid:${senderUuid}` : senderNumber ? `number:${senderNumber}` : null;
	if (!senderKey) throw new SignalIngressPermanentError("missing-sender", "Signal dispatchable envelope is missing sourceUuid/sourceNumber");
	const timestamp = normalizeTimestamp(envelope.timestamp) ?? normalizeTimestamp(dataMessage?.timestamp);
	if (timestamp === null) throw new SignalIngressPermanentError("missing-timestamp", "Signal dispatchable envelope is missing a stable timestamp");
	const dataGroup = isRecord(dataMessage?.groupInfo) ? dataMessage.groupInfo : null;
	const reactionGroup = isRecord(reactionMessage?.groupInfo) ? reactionMessage.groupInfo : null;
	const groupId = normalizeNullableString(dataGroup?.groupId) ?? normalizeNullableString(reactionGroup?.groupId);
	return {
		eventId: JSON.stringify([senderKey, timestamp]),
		laneKey: groupId ? `group:${groupId}` : `direct:${senderKey}`,
		...senderUuid && senderNumber ? { numberAliasEventId: JSON.stringify([`number:${senderNumber}`, timestamp]) } : {}
	};
}
function resolveSignalIngressNonRetryableFailure(error) {
	return error instanceof SignalIngressPermanentError ? {
		reason: error.reason,
		message: error.message
	} : null;
}
/** Open the account queue, recover it, and keep newly appended rows draining. */
async function startSignalIngressMonitor(params) {
	let queue = params.queue;
	if (!queue) {
		const pluginRuntime = getOptionalSignalRuntime();
		if (!pluginRuntime) throw new Error("Signal runtime not initialized for durable ingress");
		queue = pluginRuntime.state.openChannelIngressQueue({ accountId: params.accountId });
	}
	const ingressQueue = queue;
	const monitor = createChannelIngressMonitor({
		queue: ingressQueue,
		inspect: (prepared) => inspectSignalIngressEvent(prepared),
		payload: {
			version: 1,
			serialize: ([event], { receivedAt }) => ({
				receivedAt,
				event
			}),
			deserialize: (body) => [body.event, void 0],
			encode: ({ body }) => ({
				version: 1,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: payload
			}),
			createClaimError: (_kind, claim) => new SignalIngressPermanentError("unsupported-event", `Signal ingress row ${claim.id} has an invalid payload`)
		},
		deliver: ([event, parsedPayload], lifecycle) => parsedPayload ? params.dispatch(event, lifecycle, parsedPayload) : void 0,
		onDurableAdmission: async (_event, { facts, isNew }) => {
			const { numberAliasEventId } = facts;
			if (!numberAliasEventId) return;
			if (!await ingressQueue.complete(numberAliasEventId) && isNew) await ingressQueue.complete(facts.eventId);
		},
		pollIntervalMs: SIGNAL_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedMaxEntries: 2e3,
			failedMaxEntries: 1e3
		},
		appendRetryDelaysMs: [0],
		drain: {
			resolveNonRetryableFailure: resolveSignalIngressNonRetryableFailure,
			onLog: (message) => params.runtime.log?.(`signal ${message}`)
		},
		onError: (error) => params.runtime.error?.(`signal ingress drain failed: ${String(error)}`)
	});
	monitor.start();
	return {
		receive: async (event) => {
			await monitor.admit([event, void 0]);
			await monitor.waitForPumpIdle();
		},
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/signal/src/sse-reconnect.ts
const DEFAULT_RECONNECT_POLICY = {
	initialMs: 1e3,
	maxMs: 1e4,
	factor: 2,
	jitter: .2
};
function isPermanentSignalSseRejection(error) {
	if (!(error instanceof SignalSseRejectionError)) return false;
	return error.status >= 400 && error.status < 500 && ![
		408,
		425,
		429
	].includes(error.status);
}
function publishSignalRecovering(statusSink, lastError) {
	statusSink?.({
		connected: false,
		lifecycle: "recovering",
		...lastError ? { lastError } : {}
	});
}
async function runSignalSseLoop({ baseUrl, account, abortSignal, runtime, onEvent, timeoutMs, transportKind, policy, statusSink }) {
	const reconnectPolicy = {
		...DEFAULT_RECONNECT_POLICY,
		...policy
	};
	let reconnectAttempts = 0;
	const logReconnectVerbose = (message) => {
		if (!shouldLogVerbose()) return;
		logVerbose(message);
	};
	for (;;) {
		if (abortSignal?.aborted) break;
		try {
			await streamSignalEvents({
				baseUrl,
				account,
				abortSignal,
				timeoutMs,
				transportKind,
				onStreamOpen: () => {
					statusSink?.(channelReadyPatch());
				},
				onEvent: async (event) => {
					reconnectAttempts = 0;
					await onEvent(event);
				},
				logger: {
					log: runtime.log,
					error: runtime.error
				}
			});
			if (abortSignal?.aborted) return;
			publishSignalRecovering(statusSink);
			reconnectAttempts += 1;
			const delayMs = computeBackoff(reconnectPolicy, reconnectAttempts);
			logReconnectVerbose(`Signal stream ended, reconnecting in ${delayMs / 1e3}s...`);
			await sleepWithAbort(delayMs, abortSignal);
		} catch (err) {
			if (abortSignal?.aborted) return;
			runtime.error?.(`Signal stream error: ${String(err)}`);
			if (isPermanentSignalSseRejection(err)) {
				const lastError = `Signal daemon rejected the event stream: ${err.message}. Check the configured account and daemon URL, fix the daemon or proxy response, then restart the channel.`;
				runtime.log?.(`Signal reconnect stopped: ${lastError}`);
				statusSink?.(channelBlockedPatch(lastError, { connected: false }));
				return;
			}
			publishSignalRecovering(statusSink, String(err));
			reconnectAttempts += 1;
			const delayMs = computeBackoff(reconnectPolicy, reconnectAttempts);
			runtime.log?.(`Signal connection lost, reconnecting in ${delayMs / 1e3}s...`);
			try {
				await sleepWithAbort(delayMs, abortSignal);
			} catch (sleepErr) {
				if (abortSignal?.aborted) return;
				throw sleepErr;
			}
		}
	}
}
//#endregion
//#region extensions/signal/src/monitor.ts
var monitor_exports = /* @__PURE__ */ __exportAll({
	deliverReplies: () => deliverReplies,
	monitorSignalProvider: () => monitorSignalProvider
});
function createSignalMonitorTaskRunner(runtime) {
	const inFlight = /* @__PURE__ */ new Set();
	return {
		runTask(task) {
			const trackedTask = Promise.resolve().then(task);
			inFlight.add(trackedTask);
			trackedTask.catch((err) => runtime.error?.(`signal monitor task failed: ${String(err)}`));
			trackedTask.finally(() => inFlight.delete(trackedTask)).catch(() => void 0);
			return trackedTask;
		},
		async waitForIdle() {
			while (inFlight.size > 0) await Promise.allSettled(inFlight);
		}
	};
}
function resolveSignalReactionTargets(reaction) {
	const targets = [];
	const uuid = reaction.targetAuthorUuid?.trim();
	if (uuid) targets.push({
		kind: "uuid",
		id: uuid,
		display: `uuid:${uuid}`
	});
	const author = reaction.targetAuthor?.trim();
	if (author) {
		const normalized = normalizeE164(author);
		targets.push({
			kind: "phone",
			id: normalized,
			display: normalized
		});
	}
	return targets;
}
function isSignalReactionMessage(reaction) {
	if (!reaction) return false;
	const emoji = reaction.emoji?.trim();
	const timestamp = reaction.targetSentTimestamp;
	const hasTarget = Boolean(normalizeOptionalString(reaction.targetAuthor) || normalizeOptionalString(reaction.targetAuthorUuid));
	return Boolean(emoji && typeof timestamp === "number" && timestamp > 0 && hasTarget);
}
function shouldEmitSignalReactionNotification(params) {
	const { mode, account, accountUuid, targets, sender, allowlist } = params;
	const effectiveMode = mode ?? "own";
	if (effectiveMode === "off") return false;
	if (effectiveMode === "own") {
		const accountId = normalizeOptionalString(account);
		const normalizedAccountUuid = normalizeOptionalString(accountUuid);
		if (!accountId && !normalizedAccountUuid || !targets || targets.length === 0) return false;
		const normalizedAccount = accountId ? normalizeE164(accountId) : void 0;
		return targets.some((target) => {
			if (target.kind === "uuid") return [accountId, normalizedAccountUuid].some((candidate) => candidate === target.id || candidate === `uuid:${target.id}`);
			return Boolean(normalizedAccount) && normalizedAccount === target.id;
		});
	}
	if (effectiveMode === "allowlist") {
		if (!sender || !allowlist || allowlist.length === 0) return false;
		return isSignalSenderAllowed(sender, allowlist);
	}
	return true;
}
function buildSignalReactionSystemEventText(params) {
	const base = `Signal reaction added: ${params.emojiLabel} by ${params.actorLabel} msg ${params.messageId}`;
	const withTarget = params.targetLabel ? `${base} from ${params.targetLabel}` : base;
	return params.groupLabel ? `${withTarget} in ${params.groupLabel}` : withTarget;
}
const SIGNAL_ATTACHMENT_RPC_RESPONSE_HEADROOM_BYTES = 65536;
const SIGNAL_BASE64_OVERHEAD_NUMERATOR = 4;
const SIGNAL_BASE64_OVERHEAD_DENOMINATOR = 3;
function deriveSignalAttachmentRpcMaxResponseBytes(maxBytes) {
	if (!Number.isFinite(maxBytes) || maxBytes <= 0) return;
	return Math.ceil(maxBytes * SIGNAL_BASE64_OVERHEAD_NUMERATOR / SIGNAL_BASE64_OVERHEAD_DENOMINATOR) + SIGNAL_ATTACHMENT_RPC_RESPONSE_HEADROOM_BYTES;
}
async function fetchAttachment(params) {
	const { attachment } = params;
	if (!attachment?.id) return null;
	if (typeof attachment.size === "number" && attachment.size > params.maxBytes) throw new Error(`Signal attachment ${attachment.id} exceeds ${(params.maxBytes / 1048576).toFixed(0)}MB limit`);
	const rpcParams = { id: attachment.id };
	if (params.account) rpcParams.account = params.account;
	if (params.groupId) rpcParams.groupId = params.groupId;
	else if (params.sender) rpcParams.recipient = params.sender;
	else return null;
	const result = await signalRpcRequest("getAttachment", rpcParams, {
		baseUrl: params.baseUrl,
		maxResponseBytes: deriveSignalAttachmentRpcMaxResponseBytes(params.maxBytes),
		transportKind: params.transportKind
	});
	if (!result?.data) return null;
	if (estimateBase64DecodedBytes(result.data) > params.maxBytes) throw new Error(`Signal attachment ${attachment.id} exceeds ${(params.maxBytes / 1048576).toFixed(0)}MB limit`);
	const canonicalData = canonicalizeBase64(result.data);
	if (!canonicalData) throw new Error(`Signal attachment ${attachment.id} returned malformed base64 data`);
	const buffer = Buffer.from(canonicalData, "base64");
	const originalFilename = normalizeOptionalString(attachment.filename ?? void 0);
	const contentType = normalizeOptionalString(attachment.contentType ?? void 0) ?? await detectMime({
		buffer,
		filePath: originalFilename
	});
	const saved = await saveMediaBuffer(buffer, contentType, "inbound", params.maxBytes, originalFilename);
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
async function deliverReplies(params) {
	const { replies, target, baseUrl, account, accountUuid, accountId, runtime, maxBytes, textLimit, chunkMode } = params;
	const replyToMode = resolveSignalReplyToMode({
		cfg: params.cfg,
		accountId,
		chatType: params.chatType
	});
	const replyToAuthor = normalizeOptionalString(params.replyContext?.author);
	for (const payload of replies) {
		const deliveryResults = [];
		const presentationPayload = materializeSignalPresentationFallback(payload);
		const deliveredPayload = addSignalApprovalReactionHintToStructuredPayload({
			cfg: params.cfg,
			accountId,
			to: target,
			payload: presentationPayload,
			targetAuthor: account,
			targetAuthorUuid: accountUuid
		}) ?? presentationPayload;
		const reply = resolveSendableOutboundReplyParts(deliveredPayload);
		const replyPlan = createSignalNativeReplyIdPlan({
			payload: deliveredPayload,
			replyContext: params.replyContext,
			replyToMode
		});
		const send = async (visibleText, mediaUrl) => {
			const replyToId = replyPlan.peek();
			const result = await sendMessageSignal(target, visibleText, {
				cfg: params.cfg,
				baseUrl,
				account,
				maxBytes,
				accountId,
				...mediaUrl ? { mediaUrl } : {},
				...replyToId ? {
					replyToId,
					...replyToAuthor ? {
						replyToAuthor,
						replyToBody: params.replyContext?.body ?? ""
					} : {}
				} : {}
			});
			replyPlan.markSent();
			const messageId = typeof result?.messageId === "string" && result.messageId.trim() ? result.messageId.trim() : null;
			if (messageId) deliveryResults.push({
				channel: "signal",
				messageId,
				meta: { signalVisibleText: visibleText }
			});
		};
		if (await deliverTextOrMediaReply({
			payload: deliveredPayload,
			text: reply.text,
			chunkText: (value) => chunkTextWithMode(value, textLimit, chunkMode),
			sendText: send,
			sendMedia: ({ mediaUrl, caption }) => send(caption ?? "", mediaUrl)
		}) !== "empty") {
			await registerSignalReactionTargetsForDeliveredPayload({
				cfg: params.cfg,
				target: {
					channel: "signal",
					to: target,
					accountId
				},
				payload: deliveredPayload,
				results: deliveryResults,
				targetAuthor: account,
				targetAuthorUuid: accountUuid
			});
			runtime.log?.(`delivered reply to ${target}`);
		}
	}
}
async function monitorSignalProvider(opts = {}) {
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const cfg = opts.config ?? getRuntimeConfig();
	const accountInfo = resolveSignalAccount({
		cfg,
		accountId: opts.accountId
	});
	const historyLimit = resolvePromptHistoryLimit(accountInfo.config.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const groupHistories = /* @__PURE__ */ new Map();
	const textLimit = resolveTextChunkLimit(cfg, "signal", accountInfo.accountId);
	const chunkMode = resolveChunkMode(cfg, "signal", accountInfo.accountId);
	const baseUrl = normalizeOptionalString(opts.baseUrl) ?? accountInfo.baseUrl;
	const account = normalizeOptionalString(opts.account) ?? normalizeOptionalString(accountInfo.config.account);
	const dmPolicy = accountInfo.config.dmPolicy ?? "pairing";
	const allowFrom = normalizeStringEntries(opts.allowFrom ?? accountInfo.config.allowFrom);
	const groupAllowFrom = normalizeStringEntries(opts.groupAllowFrom ?? accountInfo.config.groupAllowFrom ?? (accountInfo.config.allowFrom && accountInfo.config.allowFrom.length > 0 ? accountInfo.config.allowFrom : []));
	const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.signal !== void 0,
		groupPolicy: accountInfo.config.groupPolicy,
		defaultGroupPolicy
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "signal",
		accountId: accountInfo.accountId,
		log: (message) => runtime.log?.(message)
	});
	const reactionMode = accountInfo.config.reactionNotifications ?? "own";
	const reactionAllowlist = normalizeStringEntries(accountInfo.config.reactionAllowlist);
	const mediaMaxBytes = (opts.mediaMaxMb ?? accountInfo.config.mediaMaxMb ?? 8) * 1024 * 1024;
	const transportKind = accountInfo.transport.kind;
	const managedTransport = accountInfo.transport.kind === "managed-native" ? accountInfo.transport : void 0;
	const socketPath = managedTransport?.socketPath;
	if (socketPath && (opts.baseUrl !== void 0 || opts.httpHost !== void 0 || opts.httpPort !== void 0)) throw new Error("Signal socket transport cannot be combined with HTTP endpoint overrides");
	const ignoreAttachments = opts.ignoreAttachments ?? accountInfo.config.ignoreAttachments ?? false;
	const sendReadReceipts = Boolean(opts.sendReadReceipts ?? accountInfo.config.sendReadReceipts);
	const waitForTransportReadyFn = opts.waitForTransportReady ?? waitForTransportReady;
	const autoStart = Boolean(managedTransport) && (opts.autoStart ?? true);
	const startupTimeoutMs = Math.min(12e4, Math.max(1e3, opts.startupTimeoutMs ?? managedTransport?.startupTimeoutMs ?? 3e4));
	const readReceiptsViaDaemon = autoStart && sendReadReceipts;
	const daemonLifecycle = createSignalDaemonLifecycle({ abortSignal: opts.abortSignal });
	const monitorTaskRunner = createSignalMonitorTaskRunner(runtime);
	let daemonHandle = null;
	let ingressMonitor;
	const startupDeadline = Date.now() + startupTimeoutMs;
	if (autoStart) {
		const cliPath = opts.cliPath ?? managedTransport?.cliPath ?? "signal-cli";
		const configPath = normalizeOptionalString(opts.configPath) ?? normalizeOptionalString(managedTransport?.configPath);
		const httpHost = normalizeSignalTransportHost(opts.httpHost ?? managedTransport?.httpHost ?? "127.0.0.1");
		const httpPort = opts.httpPort ?? managedTransport?.httpPort ?? 8080;
		const startupTimeoutSignal = AbortSignal.timeout(startupTimeoutMs);
		const endpointProbeSignal = opts.abortSignal ? AbortSignal.any([opts.abortSignal, startupTimeoutSignal]) : startupTimeoutSignal;
		try {
			await assertSignalDaemonEndpointAvailable({
				httpHost,
				httpPort,
				...socketPath ? { socketPath } : {},
				abortSignal: endpointProbeSignal
			});
		} catch (error) {
			if (opts.abortSignal?.aborted) return;
			if (startupTimeoutSignal.aborted || Date.now() >= startupDeadline) throw new Error(`signal daemon startup timed out after ${startupTimeoutMs}ms while checking its endpoint`, { cause: error });
			throw error;
		}
		if (opts.abortSignal?.aborted) return;
		if (Date.now() >= startupDeadline) throw new Error(`signal daemon startup timed out after ${startupTimeoutMs}ms before starting`);
		daemonHandle = spawnSignalDaemon({
			cliPath,
			...configPath ? { configPath } : {},
			account,
			httpHost,
			httpPort,
			...socketPath ? { socketPath } : {},
			receiveMode: opts.receiveMode ?? managedTransport?.receiveMode,
			ignoreAttachments: opts.ignoreAttachments ?? accountInfo.config.ignoreAttachments,
			ignoreStories: opts.ignoreStories ?? managedTransport?.ignoreStories,
			sendReadReceipts,
			runtime
		});
		daemonLifecycle.attach(daemonHandle);
	}
	const onAbort = () => void daemonLifecycle.stop();
	opts.abortSignal?.addEventListener("abort", onAbort, { once: true });
	try {
		if (daemonHandle) {
			await waitForSignalDaemonReady({
				baseUrl,
				abortSignal: daemonLifecycle.abortSignal,
				startupDeadlineMs: startupDeadline,
				logAfterMs: 1e4,
				logIntervalMs: 1e4,
				runtime,
				waitForTransportReadyFn
			});
			const daemonExitError = daemonLifecycle.getExitError();
			if (daemonExitError) throw daemonExitError;
		}
		registerChannelRuntimeContext({
			channelRuntime: opts.channelRuntime,
			channelId: "signal",
			accountId: accountInfo.accountId,
			capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
			context: isSignalNativeApprovalHandlerConfigured({
				cfg,
				accountId: accountInfo.accountId
			}) ? {
				accountId: accountInfo.accountId,
				baseUrl,
				account,
				accountUuid: accountInfo.config.accountUuid
			} : null,
			abortSignal: opts.abortSignal
		});
		const handleEvent = createSignalEventHandler({
			runtime,
			channelRuntime: opts.channelRuntime,
			abortSignal: daemonLifecycle.abortSignal,
			runTrackedTask: (task) => {
				monitorTaskRunner.runTask(task);
			},
			cfg,
			baseUrl,
			account,
			accountUuid: accountInfo.config.accountUuid,
			accountId: accountInfo.accountId,
			blockStreaming: resolveChannelStreamingBlockEnabled(accountInfo.config),
			historyLimit,
			groupHistories,
			textLimit,
			dmPolicy,
			allowFrom,
			groupAllowFrom,
			groupPolicy,
			reactionMode,
			reactionAllowlist,
			mediaMaxBytes,
			ignoreAttachments,
			sendReadReceipts,
			readReceiptsViaDaemon,
			fetchAttachment: (params) => fetchAttachment({
				...params,
				transportKind
			}),
			deliverReplies: (params) => deliverReplies({
				...params,
				cfg,
				chunkMode
			}),
			resolveSignalReactionTargets,
			isSignalReactionMessage,
			shouldEmitSignalReactionNotification,
			buildSignalReactionSystemEventText
		});
		ingressMonitor = await startSignalIngressMonitor({
			accountId: accountInfo.accountId,
			dispatch: handleEvent,
			runtime
		});
		await runSignalSseLoop({
			baseUrl,
			account,
			abortSignal: daemonLifecycle.abortSignal,
			runtime,
			timeoutMs: 0,
			transportKind,
			policy: opts.reconnectPolicy,
			statusSink: opts.statusSink,
			onEvent: (event) => monitorTaskRunner.runTask(async () => await ingressMonitor?.receive(event))
		});
		const daemonExitError = daemonLifecycle.getExitError();
		if (daemonExitError) throw daemonExitError;
	} catch (err) {
		const daemonExitError = daemonLifecycle.getExitError();
		if (opts.abortSignal?.aborted && !daemonExitError) return;
		if (daemonExitError) publishSignalRecovering(opts.statusSink, daemonExitError.message);
		throw err;
	} finally {
		await ingressMonitor?.stop();
		await Promise.all([daemonLifecycle.stop(), monitorTaskRunner.waitForIdle()]);
		opts.abortSignal?.removeEventListener("abort", onAbort);
	}
}
//#endregion
export { monitor_exports as n, monitorSignalProvider as t };
