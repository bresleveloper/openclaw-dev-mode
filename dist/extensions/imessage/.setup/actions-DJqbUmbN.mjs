import { c as parseIMessageTarget } from "./targets-BicBiYsM.mjs";
import { l as resolveIMessageRemoteHost, n as hasExclusiveIMessageLocalDatabase, o as resolveIMessageAccount, u as expandIMessageUserPath } from "./accounts-evTpvJMv.mjs";
import { a as setCachedIMessagePrivateApiStatus, n as getCachedIMessagePrivateApiStatus, o as IMESSAGE_ACTIONS, r as imessageRpcSupportsMethod, s as IMESSAGE_ACTION_NAMES, t as describeIMessageMessageTool } from "./message-tool-api-CqfRxLlT.mjs";
import { a as isIMessageCurrentMessageInChat, b as chatContextFromIMessageTarget, c as rememberIMessageReplyCache, i as findLatestIMessageEntryForChat, n as createIMessageRpcClient, o as isIMessageCurrentMessageInChatAsync } from "./client-12apu4Ip.mjs";
import { l as isAutoManagedIMessageCliPath, n as IMESSAGE_UPDATE_COMMAND, t as IMESSAGE_INSTALL_COMMAND } from "./setup-core-DqOBe-n0.mjs";
import { filterStringEntries, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import path from "node:path";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { createActionGate, jsonResult, readNonNegativeIntegerParam, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/channel-actions";
import { canonicalizeBase64 } from "openclaw/plugin-sdk/media-runtime";
import { normalizePollInput } from "openclaw/plugin-sdk/poll-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { detectBinary } from "openclaw/plugin-sdk/setup";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/imessage/src/message-action-reference.ts
async function resolveAuthorizedIMessageActionReference(params) {
	const options = {
		requireKnownShortId: true,
		chatContext: params.inputChatContext,
		...params.requireFromMe ? { requireFromMe: true } : {}
	};
	const rawMessageId = params.messageId ?? params.resolveFallbackMessageId(params.inputChatContext);
	const messageId = await params.resolveMessageId(rawMessageId, options);
	const authorize = (authorizedMessageId, chatContext) => params.authorize({
		...params.authorization,
		messageId: authorizedMessageId,
		chatContext
	});
	await authorize(messageId, params.inputChatContext);
	const chatGuid = await params.resolveChatGuid();
	const chatContext = { chatGuid };
	const resolvedMessageId = await params.resolveMessageId(messageId, {
		requireKnownShortId: true,
		chatContext
	});
	await authorize(resolvedMessageId, chatContext);
	return {
		messageId: resolvedMessageId,
		chatGuid
	};
}
//#endregion
//#region extensions/imessage/src/message-guid.ts
/** Strip the `p:<n>/` part prefix Messages puts on some GUIDs so keys match. */
function normalizeIMessageGuid(value) {
	return value.trim().replace(/^p:\d+\//iu, "");
}
/** Bridge status placeholders are not identities for receipts or echo matching. */
function normalizeIMessageMessageId(value) {
	const id = value?.trim();
	return id && id !== "ok" && id !== "unknown" ? id : void 0;
}
//#endregion
//#region extensions/imessage/src/probe.ts
const RPC_SUPPORT_CACHE_TTL_MS = 3e5;
const PRIVATE_API_NEGATIVE_TTL_MS = 1e4;
const rpcSupportCache = /* @__PURE__ */ new Map();
function cacheIMessagePrivateApiStatus(cliPath, status) {
	if (status.available) {
		setCachedIMessagePrivateApiStatus(cliPath, status, 0);
		return;
	}
	const expiresAt = resolveExpiresAtMsFromDurationMs(PRIVATE_API_NEGATIVE_TTL_MS);
	if (expiresAt !== void 0) setCachedIMessagePrivateApiStatus(cliPath, status, expiresAt);
}
function getCachedRpcSupport(cliPath) {
	const cached = rpcSupportCache.get(cliPath);
	if (!cached) return;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || cached.expiresAt <= now) {
		rpcSupportCache.delete(cliPath);
		return;
	}
	return cached.result;
}
function setCachedRpcSupport(cliPath, result) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(RPC_SUPPORT_CACHE_TTL_MS);
	if (expiresAt === void 0) return;
	rpcSupportCache.set(cliPath, {
		result,
		expiresAt
	});
}
function isDefaultLocalIMessageCliPath(cliPath) {
	const trimmed = cliPath.trim();
	return trimmed === "imsg" || !trimmed.includes("/") && path.basename(trimmed) === "imsg";
}
function resolveIMessageNonMacHostError(cliPath, platform = process.platform) {
	if (platform === "darwin" || !isDefaultLocalIMessageCliPath(cliPath)) return;
	return "iMessage via the default imsg CLI must run on macOS. Run OpenClaw on the signed-in Messages Mac, or set channels.imessage.cliPath to an SSH wrapper that runs imsg on that Mac.";
}
async function probeRpcSupport(cliPath, timeoutMs) {
	const cached = getCachedRpcSupport(cliPath);
	if (cached) return cached;
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(cliPath),
			"rpc",
			"--help"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const normalized = normalizeLowercaseStringOrEmpty(combined);
		if (normalized.includes("unknown command") && normalized.includes("rpc")) {
			const fatal = {
				supported: false,
				fatal: true,
				error: `imsg CLI does not support the "rpc" subcommand. Update imsg on the Messages Mac: ${IMESSAGE_UPDATE_COMMAND}`
			};
			setCachedRpcSupport(cliPath, fatal);
			return fatal;
		}
		if (result.code === 0) {
			const supported = { supported: true };
			setCachedRpcSupport(cliPath, supported);
			return supported;
		}
		return {
			supported: false,
			error: combined || `imsg rpc --help failed (code ${String(result.code ?? "unknown")})`
		};
	} catch (err) {
		return {
			supported: false,
			error: String(err)
		};
	}
}
function parseStatusPayload(stdout) {
	const lines = normalizeStringEntries(stdout.split(/\r?\n/));
	for (const line of lines.toReversed()) try {
		const value = JSON.parse(line);
		if (value && typeof value === "object" && !Array.isArray(value)) return { payload: value };
	} catch {}
	return {
		payload: null,
		firstLineSnippet: lines[0] ? truncateUtf16Safe(lines[0], 120) : void 0
	};
}
function selectorsFromPayload(payload) {
	const raw = payload.selectors;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const selectors = {};
	for (const [key, value] of Object.entries(raw)) if (typeof value === "boolean") selectors[key] = value;
	return selectors;
}
async function probeIMessageCliFlag(cliPath, timeoutMs, command, flag) {
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(cliPath),
			...command,
			"--help"
		], { timeoutMs });
		if (result.code !== 0) return false;
		const combined = `${result.stdout}\n${result.stderr}`;
		return flag.test(combined);
	} catch {
		return false;
	}
}
async function probeIMessagePrivateApi(cliPath, timeoutMs, options = {}) {
	const key = cliPath.trim() || "imsg";
	if (!options.forceRefresh) {
		const cached = getCachedIMessagePrivateApiStatus(key);
		if (cached) return cached;
	}
	try {
		const result = await runCommandWithTimeout([
			expandIMessageUserPath(key),
			"status",
			"--json"
		], { timeoutMs });
		const combined = `${result.stdout}\n${result.stderr}`.trim();
		const normalized = normalizeLowercaseStringOrEmpty(combined);
		if (result.code !== 0 && normalized.includes("unknown subcommand") && normalized.includes("status")) {
			const status = {
				available: false,
				v2Ready: false,
				selectors: {},
				rpcMethods: [],
				cliCapabilities: {
					sendRichSupportsAttachment: false,
					pollSendSupportsNoComment: false
				},
				error: `imsg CLI does not support the "status" subcommand. Update imsg on the Messages Mac: ${IMESSAGE_UPDATE_COMMAND}`
			};
			cacheIMessagePrivateApiStatus(key, status);
			return status;
		}
		const { payload, firstLineSnippet } = parseStatusPayload(result.stdout);
		const selectors = payload ? selectorsFromPayload(payload) : {};
		const rpcMethods = filterStringEntries(payload?.rpc_methods);
		const advancedFeatures = payload?.advanced_features === true;
		const v2Ready = payload?.v2_ready === true;
		const statusMessage = typeof payload?.message === "string" ? payload.message : void 0;
		const sendRichSupportsAttachment = await probeIMessageCliFlag(key, timeoutMs, ["send-rich"], /(?:^|\s)--file\b/m);
		const pollSendSupportsNoComment = await probeIMessageCliFlag(key, timeoutMs, ["poll", "send"], /(?:^|\s)--no-comment\b/m);
		const status = {
			available: result.code === 0 && advancedFeatures && v2Ready,
			v2Ready,
			selectors,
			rpcMethods,
			cliCapabilities: {
				sendRichSupportsAttachment,
				pollSendSupportsNoComment
			},
			...statusMessage ? { statusMessage } : {},
			...result.code === 0 ? !payload && firstLineSnippet ? { error: `imsg status --json returned no parseable JSONL (first line: "${firstLineSnippet}") — output schema may have changed` } : {} : { error: combined || `imsg status --json failed (code ${String(result.code)})` }
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	} catch (err) {
		const status = {
			available: false,
			v2Ready: false,
			selectors: {},
			rpcMethods: [],
			cliCapabilities: {
				sendRichSupportsAttachment: false,
				pollSendSupportsNoComment: false
			},
			error: String(err)
		};
		cacheIMessagePrivateApiStatus(key, status);
		return status;
	}
}
async function probeIMessage(timeoutMs, opts = {}) {
	const cfg = opts.cliPath || opts.dbPath ? void 0 : getRuntimeConfig();
	const explicitCliPath = opts.cliPath?.trim() || cfg?.channels?.imessage?.cliPath?.trim();
	const cliPath = explicitCliPath || "imsg";
	const dbPath = opts.dbPath?.trim() || cfg?.channels?.imessage?.dbPath?.trim();
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: opts.remoteHost ?? cfg?.channels?.imessage?.remoteHost
	});
	const effectiveTimeout = timeoutMs ?? cfg?.channels?.imessage?.probeTimeoutMs ?? 1e4;
	const nonMacHostError = resolveIMessageNonMacHostError(cliPath, opts.platform);
	if (nonMacHostError) return {
		ok: false,
		fatal: true,
		error: nonMacHostError
	};
	if (!await detectBinary(expandIMessageUserPath(cliPath))) return {
		ok: false,
		error: isAutoManagedIMessageCliPath(cliPath, { explicit: explicitCliPath !== void 0 }) ? `imsg not found (${cliPath}). Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}` : `imsg command not found (${cliPath}). Check the configured iMessage cliPath or wrapper.`
	};
	const rpcSupport = await probeRpcSupport(cliPath, effectiveTimeout);
	if (!rpcSupport.supported) return {
		ok: false,
		error: rpcSupport.error ?? "imsg rpc unavailable",
		fatal: rpcSupport.fatal
	};
	const privateApi = await probeIMessagePrivateApi(cliPath, effectiveTimeout, { forceRefresh: opts.forceRefresh });
	const client = await createIMessageRpcClient({
		cliPath,
		dbPath,
		remoteHost,
		runtime: opts.runtime
	});
	try {
		await client.request("chats.list", { limit: 1 }, { timeoutMs: effectiveTimeout });
		return {
			ok: true,
			privateApi
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err),
			privateApi
		};
	} finally {
		await client.stop();
	}
}
//#endregion
//#region extensions/imessage/src/actions.ts
const loadIMessageActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-DL5i-Y4J.mjs"), "imessageActionsRuntime");
const log = createSubsystemLogger("channels/imessage");
const providerId = "imessage";
const SUPPORTED_ACTIONS = /* @__PURE__ */ new Set([...IMESSAGE_ACTION_NAMES, "upload-file"]);
const GROUP_MANAGEMENT_ACTIONS = /* @__PURE__ */ new Set([
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup"
]);
function readMessageText(params) {
	return readStringParam(params, "text") ?? readStringParam(params, "message");
}
function rejectRedactedIMessageTarget(value) {
	if (value === "***") throw new Error("iMessage action target is a redacted display value. Omit the target to use the current conversation.");
	return value;
}
function resolveIMessageDeliveryTarget(args) {
	const chatGuid = rejectRedactedIMessageTarget(readStringParam(args, "chatGuid"));
	const chatId = readPositiveIntegerParam(args, "chatId");
	const chatIdentifier = rejectRedactedIMessageTarget(readStringParam(args, "chatIdentifier"));
	const targets = [
		chatGuid ? `chat_guid:${chatGuid}` : void 0,
		chatId !== void 0 ? `chat_id:${chatId}` : void 0,
		chatIdentifier ? `chat_identifier:${chatIdentifier}` : void 0
	].filter((value) => Boolean(value));
	if (targets.length > 1) throw new Error("iMessage action received conflicting delivery target aliases.");
	return targets[0];
}
function resolveIMessageActionTarget(params) {
	const rawTarget = resolveIMessageDeliveryTarget(params.actionParams) ?? readStringParam(params.actionParams, "to") ?? readStringParam(params.actionParams, "target") ?? (params.currentChannelId?.trim() || void 0);
	rejectRedactedIMessageTarget(rawTarget);
	return rawTarget ? parseIMessageTarget(rawTarget) : null;
}
const IMESSAGE_DELIVERY_TARGET_ALIASES = [
	"chatGuid",
	"chatIdentifier",
	"chatId"
];
function currentConversationMatchParams(params) {
	const currentMessageId = params.toolContext.currentMessageId;
	if (currentMessageId === void 0) return;
	return {
		accountId: params.accountId,
		currentMessageId,
		chatContext: {
			chatGuid: readStringParam(params.args, "chatGuid"),
			chatIdentifier: readStringParam(params.args, "chatIdentifier"),
			chatId: readPositiveIntegerParam(params.args, "chatId")
		}
	};
}
function createIMessageTargetAliases(resourceAliases = []) {
	return {
		aliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES, ...resourceAliases],
		deliveryTargetAliases: [...IMESSAGE_DELIVERY_TARGET_ALIASES],
		resolveDeliveryTarget: ({ args }) => resolveIMessageDeliveryTarget(args),
		matchesCurrentConversation: (params) => {
			const match = currentConversationMatchParams(params);
			return match ? isIMessageCurrentMessageInChat(match) : false;
		},
		matchesCurrentConversationAsync: async (params) => {
			const match = currentConversationMatchParams(params);
			return match ? await isIMessageCurrentMessageInChatAsync(match) : false;
		}
	};
}
async function completeOutboundBridgeMessage(params) {
	const messageId = normalizeIMessageMessageId(params.messageId);
	if (messageId) await rememberIMessageReplyCache({
		accountId: params.accountId,
		messageId,
		chatGuid: params.chatGuid,
		timestamp: Date.now(),
		isFromMe: true
	});
	return jsonResult({
		ok: true,
		messageId: params.messageId,
		...params.details
	});
}
/** An omitted action reference targets the most recent inbound in the same chat. */
function readMessageIdWithChatFallback(params, chatContext) {
	const explicit = readStringParam(params, "messageId");
	if (explicit) return explicit;
	const latest = findLatestIMessageEntryForChat(chatContext);
	if (latest?.messageId) return latest.messageId;
	return readStringParam(params, "messageId", { required: true });
}
async function resolveChatGuid(params) {
	const target = resolveIMessageActionTarget(params);
	if (!target) throw new Error(`iMessage ${params.action} requires chatGuid, chatId, chatIdentifier, or a chat target.`);
	if (target.kind === "chat_guid") return target.chatGuid;
	const synthesizedIdentifier = target.kind === "handle" ? `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}` : "";
	const lookupTarget = target.kind === "handle" ? {
		kind: "chat_identifier",
		chatIdentifier: synthesizedIdentifier
	} : target;
	const resolved = await params.runtime.resolveChatGuidForTarget({
		target: lookupTarget,
		options: params.options,
		conversationReadOrigin: params.conversationReadOrigin
	});
	if (resolved) return resolved;
	if (target.kind !== "handle") throw new Error(`iMessage ${params.action} failed: chatGuid not found for ${formatUnresolvedTarget(target)}.`);
	if (params.action === "react" || params.action === "edit" || params.action === "unsend") throw new Error(`iMessage ${params.action} requires a known chat. No registered chat for the supplied target; send a message first or pass an explicit chatGuid.`);
	return synthesizedIdentifier;
}
function formatUnresolvedTarget(target) {
	return target.kind === "chat_id" ? "chat_id:<redacted>" : "chat_identifier:<redacted>";
}
function buildChatContextFromActionParams(params) {
	const target = resolveIMessageActionTarget(params);
	return target ? chatContextFromIMessageTarget(target, params.service) : {};
}
function mapTapbackReaction(emoji) {
	const value = normalizeOptionalLowercaseString(emoji)?.replace(/\ufe0f/g, "");
	return value ? [
		[
			"love",
			"heart",
			"❤"
		],
		[
			"like",
			"+1",
			"thumbsup",
			"👍"
		],
		[
			"dislike",
			"-1",
			"thumbsdown",
			"👎"
		],
		[
			"laugh",
			"haha",
			"😂",
			"🤣"
		],
		[
			"emphasize",
			"!!",
			"‼"
		],
		[
			"question",
			"?",
			"？",
			"❓"
		]
	].find((aliases) => aliases.includes(value))?.[0] : void 0;
}
function decodeBase64Buffer(params, action) {
	const base64Buffer = readStringParam(params, "buffer");
	if (!base64Buffer) throw new Error(`iMessage ${action} requires buffer (base64) parameter.`);
	const canonical = canonicalizeBase64(base64Buffer.replaceAll("-", "+").replaceAll("_", "/"));
	if (!canonical) throw new Error(`iMessage ${action} buffer must be valid base64.`);
	return Uint8Array.from(Buffer.from(canonical, "base64"));
}
const REPLY_ATTACHMENT_PATH_PARAM_NAMES = [
	"filePath",
	"path",
	"media",
	"mediaUrl",
	"fileUrl"
];
function extractReplyAttachment(params) {
	if (readStringParam(params, "buffer")) {
		const filename = readStringParam(params, "filename") ?? "attachment.bin";
		return { spec: {
			kind: "buffer",
			buffer: decodeBase64Buffer(params, "reply attachment"),
			filename
		} };
	}
	for (const name of REPLY_ATTACHMENT_PATH_PARAM_NAMES) if (readStringParam(params, name)) return {
		spec: null,
		bypassParam: name
	};
	return null;
}
const EFFECT_ALIASES = {
	slam: "com.apple.MobileSMS.expressivesend.impact",
	impact: "com.apple.MobileSMS.expressivesend.impact",
	loud: "com.apple.MobileSMS.expressivesend.loud",
	gentle: "com.apple.MobileSMS.expressivesend.gentle",
	"invisible-ink": "com.apple.MobileSMS.expressivesend.invisibleink",
	invisibleink: "com.apple.MobileSMS.expressivesend.invisibleink",
	confetti: "com.apple.MobileSMS.expressivesend.confetti",
	lasers: "com.apple.MobileSMS.expressivesend.lasers",
	fireworks: "com.apple.MobileSMS.expressivesend.fireworks",
	balloons: "com.apple.MobileSMS.expressivesend.balloon",
	balloon: "com.apple.MobileSMS.expressivesend.balloon",
	heart: "com.apple.MobileSMS.expressivesend.heart",
	echo: "com.apple.messages.effect.CKEchoEffect",
	happybirthday: "com.apple.messages.effect.CKHappyBirthdayEffect",
	"happy-birthday": "com.apple.messages.effect.CKHappyBirthdayEffect",
	shootingstar: "com.apple.messages.effect.CKShootingStarEffect",
	"shooting-star": "com.apple.messages.effect.CKShootingStarEffect",
	sparkles: "com.apple.messages.effect.CKSparklesEffect",
	spotlight: "com.apple.messages.effect.CKSpotlightEffect"
};
const KNOWN_EFFECT_IDS = new Set(Object.values(EFFECT_ALIASES));
function effectIdFromParam(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	if (!value) return;
	const resolved = EFFECT_ALIASES[value] ?? raw;
	if (typeof resolved === "string" && KNOWN_EFFECT_IDS.has(resolved)) return resolved;
	throw new Error(`iMessage sendWithEffect rejected unknown effect "${raw}". Use one of: slam, loud, gentle, invisibleink, confetti, lasers, fireworks, balloon, heart, echo, happybirthday, shootingstar, sparkles, spotlight (or the canonical com.apple.MobileSMS.expressivesend.* / com.apple.messages.effect.* identifier).`);
}
function assertActionEnabled(action, actionsConfig) {
	const spec = IMESSAGE_ACTIONS[action === "upload-file" ? "sendAttachment" : action];
	if (!spec?.gate || !createActionGate(actionsConfig)(spec.gate)) throw new Error(`iMessage ${action} is disabled in config.`);
}
const imessageMessageActions = {
	describeMessageTool: describeIMessageMessageTool,
	supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),
	requiresTrustedRequesterSender: ({ action, toolContext }) => normalizeOptionalLowercaseString(toolContext?.currentChannelProvider) === "imessage" && GROUP_MANAGEMENT_ACTIONS.has(action),
	messageActionTargetAliases: {
		react: createIMessageTargetAliases(["messageId"]),
		edit: createIMessageTargetAliases(["messageId"]),
		unsend: createIMessageTargetAliases(["messageId"]),
		reply: createIMessageTargetAliases(["messageId"]),
		sendWithEffect: createIMessageTargetAliases(),
		sendAttachment: createIMessageTargetAliases(),
		poll: createIMessageTargetAliases(),
		"poll-vote": createIMessageTargetAliases(["pollId", "messageId"]),
		"upload-file": createIMessageTargetAliases(),
		renameGroup: createIMessageTargetAliases(),
		setGroupIcon: createIMessageTargetAliases(),
		addParticipant: createIMessageTargetAliases(),
		removeParticipant: createIMessageTargetAliases(),
		leaveGroup: createIMessageTargetAliases()
	},
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async ({ action, params, cfg, accountId, toolContext, senderIsOwner, gatewayClientScopes, conversationReadOrigin }) => {
		if (GROUP_MANAGEMENT_ACTIONS.has(action) && senderIsOwner !== true && !gatewayClientScopes?.includes("operator.admin")) throw new Error("iMessage group management requires an owner or operator.admin requester.");
		const runtime = await loadIMessageActionsRuntime();
		const account = resolveIMessageAccount({
			cfg,
			accountId: accountId ?? void 0
		});
		assertActionEnabled(action, account.config.actions);
		const cliPathForProbe = account.config.cliPath?.trim() || "imsg";
		const remoteHost = await resolveIMessageRemoteHost({
			cliPath: cliPathForProbe,
			remoteHost: account.config.remoteHost
		});
		let privateApiStatus = getCachedIMessagePrivateApiStatus(cliPathForProbe);
		const probePrivateApiStatus = async (forceRefresh = false) => {
			privateApiStatus = await probeIMessagePrivateApi(cliPathForProbe, account.config.probeTimeoutMs ?? 1e4, forceRefresh ? { forceRefresh: true } : void 0);
		};
		const assertPrivateApiEnabled = async () => {
			if (privateApiStatus?.available !== true) await probePrivateApiStatus();
			if (!privateApiStatus?.available) {
				const reason = privateApiStatus?.statusMessage ? ` imsg reports: ${privateApiStatus.statusMessage}` : "";
				log.warn(`iMessage ${action} blocked: private API bridge unavailable (accountId=${account.accountId}, cliPath=${cliPathForProbe}). Run \`imsg launch\` to re-inject the dylib, then \`openclaw channels status --probe\` to refresh.${reason}`);
				throw new Error(`iMessage ${action} requires the imsg private API bridge. Run imsg launch, then openclaw channels status --probe to refresh capability detection.${reason}`);
			}
		};
		const opts = {
			cliPath: account.config.cliPath?.trim() || "imsg",
			dbPath: account.config.dbPath?.trim() || void 0,
			remoteHost,
			timeoutMs: account.config.probeTimeoutMs
		};
		const attestedConversationReadOrigin = conversationReadOrigin ?? "delegated";
		const chatGuid = async () => await resolveChatGuid({
			action,
			actionParams: params,
			currentChannelId: toolContext?.currentChannelId,
			conversationReadOrigin: attestedConversationReadOrigin,
			runtime,
			options: opts
		});
		const messageReference = async (input) => {
			const inputChatContext = buildChatContextFromActionParams({
				actionParams: params,
				currentChannelId: toolContext?.currentChannelId,
				service: account.config.service
			});
			return await resolveAuthorizedIMessageActionReference({
				messageId: input?.messageId,
				inputChatContext,
				requireFromMe: input?.requireFromMe,
				resolveFallbackMessageId: (chatContext) => readMessageIdWithChatFallback(params, {
					...chatContext,
					accountId: account.accountId
				}),
				resolveMessageId: runtime.resolveIMessageMessageId,
				resolveChatGuid: chatGuid,
				authorize: (authorization) => runtime.authorizeMessageReference(authorization),
				authorization: {
					accountId: account.accountId,
					cliPath: opts.cliPath,
					dbPath: opts.dbPath,
					hasExclusiveLocalDatabase: hasExclusiveIMessageLocalDatabase({
						cfg,
						account,
						cliPath: opts.cliPath,
						dbPath: opts.dbPath,
						remoteHost: opts.remoteHost
					}),
					remoteHost: opts.remoteHost,
					conversationReadOrigin: attestedConversationReadOrigin
				}
			});
		};
		await assertPrivateApiEnabled();
		if (action === "react") {
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove an iMessage reaction." });
			const reaction = mapTapbackReaction(emoji);
			const TAPBACK_KINDS = [
				"love",
				"like",
				"dislike",
				"laugh",
				"emphasize",
				"question"
			];
			if (!remove && (isEmpty || !reaction)) throw new Error("iMessage react supports love, like, dislike, laugh, emphasize, and question tapbacks.");
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const reference = await messageReference();
			const reactionsToSend = remove && !reaction ? [...TAPBACK_KINDS] : reaction ? [reaction] : [];
			for (const kind of reactionsToSend) await runtime.sendReaction({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				reaction: kind,
				remove: remove || void 0,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				...remove ? { removed: true } : { added: reaction }
			});
		}
		if (action === "edit") {
			const text = readStringParam(params, "text") ?? readStringParam(params, "newText") ?? readStringParam(params, "message");
			if (!text) throw new Error("iMessage edit requires text, newText, or message.");
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const backwardsCompatMessage = readStringParam(params, "backwardsCompatMessage");
			const reference = await messageReference({ requireFromMe: true });
			await runtime.editMessage({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				text,
				backwardsCompatMessage,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				edited: reference.messageId
			});
		}
		if (action === "unsend") {
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const reference = await messageReference({ requireFromMe: true });
			await runtime.unsendMessage({
				chatGuid: reference.chatGuid,
				messageId: reference.messageId,
				partIndex,
				options: opts
			});
			return jsonResult({
				ok: true,
				unsent: reference.messageId
			});
		}
		if (action === "reply") {
			const text = readMessageText(params);
			if (!text) throw new Error("iMessage reply requires text or message.");
			const reference = await messageReference();
			const attachment = extractReplyAttachment(params);
			if (attachment) {
				if (attachment.spec === null) throw new Error(`iMessage reply rejected \`${attachment.bypassParam}\` because it did not pass through the outbound media resolver. Pass a base64 \`buffer\` + \`filename\` directly, or invoke message(action: "reply") through the runner so the resolver can validate the path against mediaLocalRoots/sandbox/size before sending.`);
				if (!opts.remoteHost && privateApiStatus?.cliCapabilities?.sendRichSupportsAttachment !== true) throw new Error("iMessage reply with an attachment needs an imsg build that exposes `send-rich --file` (openclaw/imsg#114). Upgrade imsg, or use action 'upload-file' (with filePath/filename) or action 'send' (with media) to deliver the file plus a separate 'reply' for any text.");
			}
			const partIndex = readNonNegativeIntegerParam(params, "partIndex");
			const result = await runtime.sendRichMessage({
				chatGuid: reference.chatGuid,
				text,
				replyToMessageId: reference.messageId,
				partIndex,
				attachment: attachment?.spec ?? void 0,
				options: opts
			});
			return await completeOutboundBridgeMessage({
				accountId: account.accountId,
				messageId: result.messageId,
				chatGuid: reference.chatGuid,
				details: { repliedTo: reference.messageId }
			});
		}
		if (action === "sendWithEffect") {
			const text = readMessageText(params);
			const effectId = effectIdFromParam(readStringParam(params, "effectId") ?? readStringParam(params, "effect"));
			if (!text || !effectId) throw new Error("iMessage sendWithEffect requires text/message and effect/effectId.");
			const resolvedChatGuid = await chatGuid();
			const result = await runtime.sendRichMessage({
				chatGuid: resolvedChatGuid,
				text,
				effectId,
				options: opts
			});
			return await completeOutboundBridgeMessage({
				accountId: account.accountId,
				messageId: result.messageId,
				chatGuid: resolvedChatGuid,
				details: { effect: effectId }
			});
		}
		if (action === "renameGroup") {
			const displayName = readStringParam(params, "displayName") ?? readStringParam(params, "name");
			if (!displayName) throw new Error("iMessage renameGroup requires displayName or name.");
			const resolvedChatGuid = await chatGuid();
			await runtime.renameGroup({
				chatGuid: resolvedChatGuid,
				displayName,
				options: opts
			});
			return jsonResult({
				ok: true,
				renamed: resolvedChatGuid,
				displayName
			});
		}
		if (action === "setGroupIcon") {
			const filename = readStringParam(params, "filename") ?? readStringParam(params, "name") ?? "icon.png";
			const resolvedChatGuid = await chatGuid();
			await runtime.setGroupIcon({
				chatGuid: resolvedChatGuid,
				buffer: decodeBase64Buffer(params, action),
				filename,
				options: opts
			});
			return jsonResult({
				ok: true,
				chatGuid: resolvedChatGuid,
				iconSet: true
			});
		}
		if (action === "addParticipant" || action === "removeParticipant") {
			const address = readStringParam(params, "address") ?? readStringParam(params, "participant");
			if (!address) throw new Error(`iMessage ${action} requires address or participant.`);
			const resolvedChatGuid = await chatGuid();
			await runtime[action]({
				chatGuid: resolvedChatGuid,
				address,
				options: opts
			});
			return jsonResult({
				ok: true,
				[action === "addParticipant" ? "added" : "removed"]: address,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "leaveGroup") {
			const resolvedChatGuid = await chatGuid();
			await runtime.leaveGroup({
				chatGuid: resolvedChatGuid,
				options: opts
			});
			return jsonResult({
				ok: true,
				left: resolvedChatGuid
			});
		}
		if (action === "sendAttachment" || action === "upload-file") {
			const filename = readStringParam(params, "filename", { required: true });
			const asVoice = readBooleanParam(params, "asVoice");
			const resolvedChatGuid = await chatGuid();
			const result = await runtime.sendAttachment({
				chatGuid: resolvedChatGuid,
				buffer: decodeBase64Buffer(params, action),
				filename,
				asVoice: asVoice ?? void 0,
				options: opts
			});
			return await completeOutboundBridgeMessage({
				accountId: account.accountId,
				messageId: result.messageId,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "poll") {
			if (privateApiStatus?.selectors?.pollPayloadMessage !== true) await probePrivateApiStatus(true);
			if (privateApiStatus?.selectors?.pollPayloadMessage !== true) throw new Error("iMessage poll requires an imsg bridge that advertises the pollPayloadMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.");
			const question = readStringParam(params, "pollQuestion", { required: true });
			const rawChoices = readStringArrayParam(params, "pollOption", { required: true });
			const poll = normalizePollInput({
				question,
				options: rawChoices
			}, { maxOptions: 12 });
			const resolvedChatGuid = await chatGuid();
			const result = await runtime.sendPoll({
				chatGuid: resolvedChatGuid,
				question: poll.question,
				choices: poll.options,
				options: opts
			});
			return await completeOutboundBridgeMessage({
				accountId: account.accountId,
				messageId: result.messageId,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "poll-vote") {
			if (privateApiStatus?.selectors?.pollVoteMessage !== true || !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) await probePrivateApiStatus(true);
			if (privateApiStatus?.selectors?.pollVoteMessage !== true) throw new Error("iMessage poll-vote requires an imsg bridge that advertises the pollVoteMessage selector. Update imsg, run imsg launch to re-inject the bridge, then run openclaw channels status --probe to refresh capability detection.");
			if (!imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) throw new Error("iMessage poll-vote requires an imsg build that advertises the poll.vote capability. Update imsg, then run openclaw channels status --probe to refresh capability detection.");
			const pollRef = readStringParam(params, "pollId") ?? readStringParam(params, "pollGuid") ?? readStringParam(params, "messageId") ?? (toolContext?.currentMessageId != null ? String(toolContext.currentMessageId) : void 0);
			if (!pollRef) throw new Error("iMessage poll-vote requires the poll message id (pollId or messageId).");
			const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex");
			const optionId = readStringParam(params, "pollOptionId");
			const optionText = readStringParam(params, "pollOptionText");
			const selectorCount = [
				optionIndex !== void 0,
				Boolean(optionId),
				Boolean(optionText)
			].filter(Boolean).length;
			if (selectorCount === 0) throw new Error("iMessage poll-vote requires pollOptionIndex, pollOptionId, or pollOptionText.");
			if (selectorCount > 1) throw new Error("iMessage poll-vote requires exactly one of pollOptionIndex, pollOptionId, or pollOptionText.");
			const pollReference = await messageReference({ messageId: pollRef });
			const result = await runtime.sendPollVote({
				chatGuid: pollReference.chatGuid,
				pollGuid: pollReference.messageId,
				optionIndex,
				optionId: optionId ?? void 0,
				optionText: optionText ?? void 0,
				options: opts
			});
			return await completeOutboundBridgeMessage({
				accountId: account.accountId,
				messageId: result.messageId,
				chatGuid: pollReference.chatGuid,
				details: result.optionText ? { pollVotedOption: result.optionText } : void 0
			});
		}
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
//#endregion
export { normalizeIMessageMessageId as a, normalizeIMessageGuid as i, probeIMessage as n, probeIMessagePrivateApi as r, imessageMessageActions as t };
