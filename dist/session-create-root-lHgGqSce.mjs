import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as hasGatewayClientCap, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape, Z as validateChatSendParams } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { d as hasGatewayAdminScope, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { O as NODE_WORKER_WORKSPACE_EXEC_COMMAND } from "./node-commands-Bxo-2Y4j.mjs";
import { w as formatValidationErrors } from "./worker-protocol-primitives-wrWgxYRD.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { i as isGatewayCliClient, l as isWebchatClient, n as isBrowserOperatorUiClient, s as isOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-DmAdWHmL.mjs";
import { f as readProviderReviewAcknowledgment } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { h as normalizeInputProvenance, p as isProgressCardRefreshInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as formatChatWorkContext, t as captureChatWorkContext } from "./work-context-Cn4SLmAO.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OPzI_0T6.mjs";
import { t as loadChatRequestIdentityKeyAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { E as isPluginOwnedSessionBindingRecord } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { a as assertRequiredWorkerSelection } from "./required-worker-profile-B0DIhkdC.mjs";
import { s as NODE_WORKSPACE_VALIDATE_DEVICE_FOLDER_COMMAND, u as parseNodeWorkerWorkspaceExecResult } from "./node-workspace-protocol-FKrTt4nR.mjs";
import { n as isAbortRequestText } from "./abort-primitives-s9GIpM6V.mjs";
import { n as isBtwRequestText } from "./btw-command-BsR1Sazk.mjs";
import { r as resolveControlUiReconnectResumeParams } from "./chat-server-timing-pbaeJzGd.mjs";
import { t as fingerprintSessionGoalRequest } from "./session-goal-request-aWMiuDrs.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-C3E7cQQ3.mjs";
import fs from "node:fs";
import { createHmac, randomUUID } from "node:crypto";
import path from "node:path";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/attachment-normalize.ts
function normalizeAttachmentContent(content) {
	if (typeof content === "string") return content;
	if (ArrayBuffer.isView(content)) return Buffer.from(content.buffer, content.byteOffset, content.byteLength).toString("base64");
	if (content instanceof ArrayBuffer) return Buffer.from(content).toString("base64");
}
function normalizeRpcAttachmentsToChatAttachments(attachments) {
	return attachments?.map((a) => {
		const sourceRecord = a?.source && typeof a.source === "object" ? a.source : void 0;
		const sourceMimeType = typeof sourceRecord?.media_type === "string" ? sourceRecord.media_type : void 0;
		const sourceContent = sourceRecord?.type === "base64" ? normalizeAttachmentContent(sourceRecord.data) : void 0;
		const sizeBytes = asNonNegativeFiniteNumber(a?.sizeBytes);
		const durationMs = asNonNegativeFiniteNumber(a?.durationMs);
		const width = asNonNegativeFiniteNumber(a?.width);
		const height = asNonNegativeFiniteNumber(a?.height);
		return {
			type: typeof a?.type === "string" ? a.type : void 0,
			mimeType: typeof a?.mimeType === "string" ? a.mimeType : sourceMimeType,
			fileName: typeof a?.fileName === "string" ? a.fileName : void 0,
			content: normalizeAttachmentContent(a?.content) ?? sourceContent,
			...a?.origin === "paste" || a?.origin === "file" ? { origin: a.origin } : {},
			...sizeBytes !== void 0 ? { sizeBytes } : {},
			...durationMs !== void 0 ? { durationMs } : {},
			...width !== void 0 ? { width } : {},
			...height !== void 0 ? { height } : {}
		};
	}).filter((a) => a.content !== void 0) ?? [];
}
//#endregion
//#region src/gateway/chat-input-sanitize.ts
const DISALLOWED_CHAT_CONTROL_RANGE = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const DISALLOWED_CHAT_CONTROL_RE = new RegExp(`[${DISALLOWED_CHAT_CONTROL_RANGE}]`, "g");
function sanitizeChatSendMessageInput(message) {
	const normalized = message.normalize("NFC");
	if (normalized.includes("\0")) return {
		ok: false,
		error: "message must not contain null bytes"
	};
	return {
		ok: true,
		message: normalized.replace(DISALLOWED_CHAT_CONTROL_RE, "")
	};
}
//#endregion
//#region src/gateway/server-methods/chat-human-mentions.ts
const INVALID_MENTIONS = "Selected mentions no longer match the message. Select the people again.";
function splitsSurrogate(text, offset) {
	const before = text.charCodeAt(offset - 1);
	const after = text.charCodeAt(offset);
	return before >= 55296 && before <= 56319 && after >= 56320 && after <= 57343;
}
/** Normalize raw selected spans against the request boundary's sanitized message. */
function normalizeChatHumanMentions(text, mentions, sanitizedText) {
	if (!mentions?.length) return {
		ok: true,
		value: void 0
	};
	const leadingSpace = sanitizedText.length - sanitizedText.trimStart().length;
	const trimmed = sanitizedText.trim();
	const normalized = [];
	let previousEnd = 0;
	for (const mention of mentions) {
		const token = text.slice(mention.start, mention.end);
		if (mention.start < previousEnd || mention.end > text.length || mention.end <= mention.start + 1 || token.length > 257 || token[0] !== "@" || !token.slice(1).trim() || containsAsciiControlCharacter(token) || splitsSurrogate(text, mention.start) || splitsSurrogate(text, mention.end)) return {
			ok: false,
			error: INVALID_MENTIONS
		};
		const prefix = sanitizeChatSendMessageInput(text.slice(0, mention.start));
		const throughToken = sanitizeChatSendMessageInput(text.slice(0, mention.end));
		if (!prefix.ok || !throughToken.ok || !sanitizedText.startsWith(throughToken.message)) return {
			ok: false,
			error: INVALID_MENTIONS
		};
		const start = prefix.message.length - leadingSpace;
		const end = throughToken.message.length - leadingSpace;
		if (start < 0 || end > trimmed.length || trimmed[start] !== "@") return {
			ok: false,
			error: INVALID_MENTIONS
		};
		normalized.push({
			profileId: mention.profileId,
			start,
			end
		});
		previousEnd = mention.end;
	}
	return {
		ok: true,
		value: normalized
	};
}
//#endregion
//#region src/gateway/server-methods/chat-origin-routing.ts
const CHANNEL_AGNOSTIC_SESSION_SCOPES = /* @__PURE__ */ new Set([
	"main",
	"direct",
	"dm",
	"group",
	"channel",
	"cron",
	"run",
	"subagent",
	"acp",
	"thread",
	"topic"
]);
const CHANNEL_SCOPED_SESSION_SHAPES = /* @__PURE__ */ new Set([
	"direct",
	"dm",
	"group",
	"channel"
]);
function normalizeExplicitChatSendOrigin(params) {
	const originatingChannel = normalizeOptionalString(params.originatingChannel);
	const originatingTo = normalizeOptionalString(params.originatingTo);
	const accountId = normalizeOptionalString(params.accountId);
	const messageThreadId = normalizeOptionalString(params.messageThreadId);
	if (!Boolean(originatingChannel || originatingTo || accountId || messageThreadId)) return { ok: true };
	const normalizedChannel = normalizeMessageChannel(originatingChannel);
	if (!normalizedChannel) return {
		ok: false,
		error: "originatingChannel is required when using originating route fields"
	};
	if (!originatingTo) return {
		ok: false,
		error: "originatingTo is required when using originating route fields"
	};
	return {
		ok: true,
		value: {
			originatingChannel: normalizedChannel,
			originatingTo,
			...accountId ? { accountId } : {},
			...messageThreadId ? { messageThreadId } : {}
		}
	};
}
function resolveChatSendOriginatingRoute(params) {
	if (params.explicitOrigin) return {
		originatingChannel: params.explicitOrigin.originatingChannel,
		originatingTo: params.explicitOrigin.originatingTo,
		...params.explicitOrigin.accountId ? { accountId: params.explicitOrigin.accountId } : {},
		...params.explicitOrigin.messageThreadId ? { messageThreadId: params.explicitOrigin.messageThreadId } : {},
		explicitDeliverRoute: params.deliver === true
	};
	const internalRoute = {
		originatingChannel: INTERNAL_MESSAGE_CHANNEL,
		originatingTo: params.sessionKey,
		explicitDeliverRoute: false
	};
	if (params.deliver !== true) return internalRoute;
	const sessionDeliveryContext = deliveryContextFromSession(params.entry);
	const sessionOrigin = sessionDeliveryOrigin(params.entry);
	const routeChannelCandidate = normalizeMessageChannel(sessionDeliveryContext?.channel ?? sessionOrigin?.provider);
	const routeToCandidate = sessionDeliveryContext?.to;
	const routeAccountIdCandidate = sessionDeliveryContext?.accountId ?? sessionOrigin?.accountId;
	const routeThreadIdCandidate = sessionDeliveryContext?.threadId ?? sessionOrigin?.threadId;
	if (params.sessionKey.length > 512) return internalRoute;
	const sessionScopeParts = (parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey).split(":", 3).filter(Boolean);
	const sessionScopeHead = sessionScopeParts[0];
	const sessionChannelHint = normalizeMessageChannel(sessionScopeHead);
	const normalizedSessionScopeHead = (sessionScopeHead ?? "").trim().toLowerCase();
	const sessionPeerShapeCandidates = [sessionScopeParts[1], sessionScopeParts[2]].map((part) => (part ?? "").trim().toLowerCase()).filter(Boolean);
	const isChannelAgnosticSessionScope = CHANNEL_AGNOSTIC_SESSION_SCOPES.has(normalizedSessionScopeHead);
	const isChannelScopedSession = sessionPeerShapeCandidates.some((part) => CHANNEL_SCOPED_SESSION_SHAPES.has(part));
	const hasLegacyChannelPeerShape = !isChannelScopedSession && typeof sessionScopeParts[1] === "string" && sessionChannelHint === routeChannelCandidate;
	const isFromWebchatClient = isWebchatClient(params.client);
	const isFromGatewayCliClient = isGatewayCliClient(params.client);
	const hasClientMetadata = typeof params.client?.mode === "string" && params.client.mode.trim().length > 0 || typeof params.client?.id === "string" && params.client.id.trim().length > 0;
	const configuredMainKey = (params.mainKey ?? "main").trim().toLowerCase();
	const canInheritConfiguredMainRoute = normalizedSessionScopeHead.length > 0 && normalizedSessionScopeHead === configuredMainKey && params.hasConnectedClient && (isFromGatewayCliClient || !hasClientMetadata);
	if (!(Boolean(!isFromWebchatClient && sessionChannelHint && sessionChannelHint !== "webchat" && (!isChannelAgnosticSessionScope && (isChannelScopedSession || hasLegacyChannelPeerShape) || canInheritConfiguredMainRoute)) && routeChannelCandidate && routeChannelCandidate !== "webchat" && typeof routeToCandidate === "string" && routeToCandidate.trim().length > 0)) return internalRoute;
	return {
		originatingChannel: routeChannelCandidate,
		originatingTo: routeToCandidate,
		accountId: routeAccountIdCandidate,
		messageThreadId: routeThreadIdCandidate,
		explicitDeliverRoute: true
	};
}
async function resolveExplicitOriginBindingTargets(origin) {
	const binding = origin?.accountId && origin.originatingChannel !== "webchat" ? await getSessionBindingService().resolveByConversationAsync({
		channel: origin.originatingChannel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	}) : void 0;
	return {
		acp: Boolean(binding?.targetSessionKey?.split(":").includes("acp")),
		plugin: isPluginOwnedSessionBindingRecord(binding)
	};
}
function normalizeOptionalChatSystemReceipt(value) {
	if (value == null) return { ok: true };
	const sanitized = sanitizeChatSendMessageInput(value);
	if (!sanitized.ok) return sanitized;
	return {
		ok: true,
		receipt: sanitized.message.trim() || void 0
	};
}
function isAcpBridgeClient(client) {
	const info = client?.connect?.client;
	return info?.id === GATEWAY_CLIENT_NAMES.CLI && info?.mode === GATEWAY_CLIENT_MODES.CLI && info?.displayName === "ACP" && info?.version === "acp";
}
//#endregion
//#region src/gateway/server-methods/chat-send-request.ts
/** Validate and normalize the wire request before session or lifecycle work begins. */
function normalizeChatSendRequest(params) {
	const chatSendReceivedAtMs = performance.now();
	const reject = (error) => ({
		ok: false,
		error
	});
	const client = params.client;
	const clientInfo = client?.connect?.client;
	const supportsTaskSuggestions = isOperatorUiClient(clientInfo) && params.client?.connect?.scopes?.includes("operator.admin") === true && hasGatewayClientCap(params.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS);
	const controlUiReconnectResume = resolveControlUiReconnectResumeParams(params.params, clientInfo);
	if (!validateChatSendParams(controlUiReconnectResume.params)) return reject(`invalid chat.send params: ${formatValidationErrors(validateChatSendParams.errors)}`);
	const p = controlUiReconnectResume.params;
	const providerReview = params.providerReviewAcknowledgment ? readProviderReviewAcknowledgment(params.providerReviewAcknowledgment) : void 0;
	if (providerReview && (p.sessionId !== providerReview.target.sessionId || p.idempotencyKey !== providerReview.nextRunId || p.message !== providerReview.review.review?.continuation?.message || p.attachments?.length || p.intent || p.queueMode || p.toolBindings || p.workContext || p.systemInputProvenance || p.systemProvenanceReceipt || p.suppressCommandInterpretation !== void 0 || p.thinking !== void 0 || p.fastMode !== void 0 || p.timeoutMs !== void 0)) return reject("Provider continuation no longer matches the reviewed input.");
	const suppressCommandInterpretation = p.suppressCommandInterpretation === true;
	const explicitOriginResult = normalizeExplicitChatSendOrigin({
		originatingChannel: p.originatingChannel,
		originatingTo: p.originatingTo,
		accountId: p.originatingAccountId,
		messageThreadId: p.originatingThreadId
	});
	if (!explicitOriginResult.ok) return explicitOriginResult;
	if ((p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation || explicitOriginResult.value) && !params.trustedSystemInput && !hasGatewayAdminScope(params.client)) return reject(p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation ? "system provenance fields require admin scope" : "originating route fields require admin scope");
	const sanitizedMessageResult = sanitizeChatSendMessageInput(p.message);
	if (!sanitizedMessageResult.ok) return sanitizedMessageResult;
	if (p.intent && (!p.message.trim() || p.message.length > 16e3 || p.idempotencyKey.length > 128 || p.queueMode !== void 0 || p.systemInputProvenance !== void 0 || p.systemProvenanceReceipt !== void 0 || p.suppressCommandInterpretation !== void 0 || sanitizedMessageResult.message !== p.message.normalize("NFC"))) return reject("Goal start requires a nonempty objective of at most 16000 characters, without queue or system-input options.");
	if (p.intent && (explicitOriginResult.value !== void 0 || p.deliver === true || p.toolBindings !== void 0 || p.thinking !== void 0 || p.fastMode !== void 0 || p.fastAutoOnSeconds !== void 0 || p.timeoutMs !== void 0 || controlUiReconnectResume.resumeRequested)) return reject("Goal start uses the session settings and local delivery; per-request runtime or routing overrides are not supported.");
	const systemReceiptResult = normalizeOptionalChatSystemReceipt(p.systemProvenanceReceipt);
	if (!systemReceiptResult.ok) return systemReceiptResult;
	const hasGoalOperation = params.goalResume !== void 0 || p.intent !== void 0;
	const commandInterpretationSuppressed = suppressCommandInterpretation || hasGoalOperation || providerReview !== void 0;
	const inboundMessage = p.intent || providerReview ? p.message : sanitizedMessageResult.message;
	const systemInputProvenance = params.goalResume ? {
		kind: "internal_system",
		sourceTool: "session_goal_resume"
	} : normalizeInputProvenance(p.systemInputProvenance);
	if (!params.trustedSystemInput && isProgressCardRefreshInputProvenance(systemInputProvenance)) return reject("Progress refresh input is reserved for progressCard.refresh.");
	const systemProvenanceReceipt = systemReceiptResult.receipt;
	const stopCommand = !commandInterpretationSuppressed && isAbortRequestText(inboundMessage);
	if (p.toolBindings) {
		if (!client || !isBrowserCopilotClient(clientInfo) || client.pairedClientId !== clientInfo?.id) return reject("run tool bindings require a paired browser copilot");
		if (!hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.RUN_TOOL_BINDINGS)) return reject("run tool bindings require client capability");
	}
	if (isBrowserCopilotClient(clientInfo) && !stopCommand && (!p.toolBindings || !Object.hasOwn(p.toolBindings, "browser"))) return reject("browser copilot runs require an explicit browser tool binding");
	const turnKind = !commandInterpretationSuppressed && isBtwRequestText(inboundMessage) ? "btw" : "main";
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(p.attachments);
	const rawMessage = hasGoalOperation || providerReview ? inboundMessage : inboundMessage.trim();
	if (!rawMessage && normalizedAttachments.length === 0) return reject("message or attachment required");
	const mentions = normalizeChatHumanMentions(p.message, p.mentions, sanitizedMessageResult.message);
	if (!mentions.ok) return mentions;
	const ordinaryChat = !hasGoalOperation && !stopCommand && turnKind === "main" && !rawMessage.startsWith("/") && !rawMessage.startsWith("!");
	if (mentions.value && (!isBrowserOperatorUiClient(clientInfo) || !client?.authenticatedUserProfile || client.internal?.syntheticClient || client.internal?.senderAttribution || systemInputProvenance || systemProvenanceReceipt || explicitOriginResult.value || suppressCommandInterpretation || !ordinaryChat)) return reject("Human mentions require a signed-in Control UI chat. Remove the selected mentions to use this mode.");
	if (p.workContext && !ordinaryChat) return reject("Working context is only supported for ordinary chat messages.");
	const workContext = p.workContext ? {
		snapshot: captureChatWorkContext(p.workContext),
		text: rawMessage
	} : void 0;
	if (workContext && !workContext.snapshot.page) return reject("Working context requires a nonempty page.");
	const modelMessage = workContext ? [rawMessage, formatChatWorkContext(workContext.snapshot)].filter(Boolean).join("\n\n") : rawMessage;
	const requestInput = JSON.stringify([
		p.message,
		p.mentions?.map(({ profileId, start, end }) => [
			profileId,
			start,
			end
		]) ?? [],
		...workContext ? [workContext.snapshot] : [],
		...providerReview ? [providerReview.review.id, providerReview.target.sessionId] : []
	]);
	const value = {
		chatSendReceivedAtMs,
		clientInfo,
		supportsTaskSuggestions,
		p,
		...params.providerReviewAcknowledgment ? { providerReviewAcknowledgment: params.providerReviewAcknowledgment } : {},
		...params.goalResume ? { goalOperation: params.goalResume } : {},
		explicitOrigin: explicitOriginResult.value,
		inboundMessage: modelMessage,
		...workContext ? { workContext } : {},
		systemInputProvenance,
		systemProvenanceReceipt,
		suppressCommandInterpretation: commandInterpretationSuppressed,
		toolBindings: p.toolBindings,
		stopCommand,
		turnKind,
		normalizedAttachments,
		rawMessage: modelMessage,
		...mentions.value ? { mentions: mentions.value } : {},
		reconnectResumeRequested: controlUiReconnectResume.resumeRequested
	};
	if (stopCommand) return {
		ok: true,
		value
	};
	return loadChatRequestIdentityKeyAsync().then((key) => {
		const request = key ? {
			...value,
			requestIdentity: createHmac("sha256", key).update(requestInput).digest("hex")
		} : value;
		if (p.intent && !params.goalResume) {
			const goalStart = {
				action: "start",
				operationId: p.idempotencyKey,
				issuedAtMs: p.intent.issuedAtMs,
				objective: p.message
			};
			return fingerprintSessionGoalRequest([p, hasGatewayAdminScope(client)]).then((requestFingerprint) => ({
				ok: true,
				value: {
					...request,
					goalOperation: {
						...goalStart,
						requestFingerprint
					}
				}
			}));
		}
		return {
			ok: true,
			value: request
		};
	});
}
//#endregion
//#region src/gateway/server-methods/session-create-initial-turn.ts
function resolveSessionCreateInitialTurn(params) {
	const message = readNonBlankString(params.task) ?? readNonBlankString(params.message);
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.attachments);
	if (params.attachments?.length && !message && normalizedAttachments.length === 0) return null;
	const attachments = normalizedAttachments.length ? normalizedAttachments : void 0;
	return {
		attachments,
		hasInitialTurn: message !== void 0 || attachments !== void 0,
		message
	};
}
function isFreshChatSendStarted(params) {
	if (params.cached) return false;
	return (params.payload && typeof params.payload === "object" ? params.payload.status : void 0) === "started";
}
/** Validate the initial turn against the same child identity used by creation. */
async function validateSessionCreateInitialMentions(params) {
	const { client, context, agentId, sessionKey, message, mentions, visibility, runId } = params;
	const normalization = normalizeChatSendRequest({
		params: {
			sessionKey,
			message: message ?? "",
			mentions,
			idempotencyKey: runId
		},
		client
	});
	const normalized = normalization instanceof Promise ? await normalization : normalization;
	if (!normalized.ok) return errorShape(ErrorCodes.INVALID_REQUEST, normalized.error);
	const eligible = await context.mentionInbox?.validateRecipientsAsync(client, {
		agentId,
		...visibility ? { visibility } : {}
	}, mentions.map((mention) => mention.profileId));
	if (!eligible?.ok) return eligible?.error ?? errorShape(ErrorCodes.UNAVAILABLE, "Human mentions are unavailable; reconnect and retry.");
}
//#endregion
//#region src/gateway/session-device-folder.ts
function validateSessionDeviceFolderSelection(params) {
	if (!params.deviceFolder) return;
	if ([
		"worktree",
		"worktreeSource",
		"worktreeBaseRef",
		"worktreeName",
		"cwd",
		"projectId",
		"projectGitUrl",
		"repository",
		"execNode",
		"catalogId"
	].some((key) => params[key] !== void 0)) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create deviceFolder cannot be combined with worktree, cwd, project, repository, execNode, or catalog selections");
	if (!params.deviceFolder.deviceId.trim() || !params.deviceFolder.path.trim()) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create deviceFolder requires a device and path");
	if (resolveSessionCreateInitialTurn(params)?.hasInitialTurn !== false) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create deviceFolder cannot include an initial turn; dispatch the session with sessions.dispatch, then send the message with sessions.send.");
}
/** Validation never creates a workspace, copies files, or executes repository code. */
async function prepareSessionDeviceFolder(params) {
	const { transport, assertCurrent } = params;
	assertCurrent();
	const deviceId = params.folder.deviceId.trim();
	const node = await transport.getCurrentNode(deviceId);
	assertCurrent();
	if (!node || node.workerHost.deviceFolders !== true) return err(errorShape(ErrorCodes.UNAVAILABLE, "Selected device is disconnected or does not support existing-folder sessions; connect an updated session host and retry."));
	const isCurrent = () => {
		assertCurrent();
		return transport.isCurrent(node) && node.workerHost.deviceFolders === true;
	};
	try {
		const response = await transport.invoke({
			node,
			command: NODE_WORKER_WORKSPACE_EXEC_COMMAND,
			params: {
				gatewayNamespace: "device-folder-validation",
				environmentId: `validate:${randomUUID()}`,
				sessionId: "validation",
				generation: 0,
				deviceFolder: params.folder.path,
				argv: [NODE_WORKSPACE_VALIDATE_DEVICE_FOLDER_COMMAND]
			},
			timeoutMs: 15e3,
			signal: params.signal,
			isDispatchAuthorized: isCurrent
		});
		if (!isCurrent()) return err(errorShape(ErrorCodes.UNAVAILABLE, "Selected device changed during folder validation; retry."));
		if (!response.ok) return err(errorShape(ErrorCodes.INVALID_REQUEST, response.error?.message ?? "Selected device could not validate the existing folder."));
		const raw = response.payload ?? (response.payloadJSON ? JSON.parse(response.payloadJSON) : void 0);
		const result = parseNodeWorkerWorkspaceExecResult(raw);
		if (!result || result.code !== 0 || result.termination !== "exit" || !result.workspaceDir) return err(errorShape(ErrorCodes.INVALID_REQUEST, "Selected device rejected the existing folder."));
		return ok({
			deviceFolder: {
				deviceId,
				path: result.workspaceDir
			},
			assertCurrent: () => {
				if (!transport.isCurrent(node) || node.workerHost.deviceFolders !== true) throw new Error("Selected device changed after folder validation; reconnect and retry.");
			}
		});
	} catch (error) {
		assertCurrent();
		return err(errorShape(ErrorCodes.UNAVAILABLE, `Device folder validation failed: ${formatErrorMessage(error)}`));
	}
}
//#endregion
//#region src/gateway/server-methods/session-create-required-worker.ts
function prepareRequiredWorkerSessionCreate(params, config) {
	const selectionError = validateSessionDeviceFolderSelection(params);
	if (selectionError) return {
		automaticEmptyWorkspace: false,
		error: selectionError
	};
	const requiredProfile = config.cloudWorkers?.requiredProfile;
	if (requiredProfile && params.deviceFolder) return {
		requiredProfile,
		automaticEmptyWorkspace: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Device folder sessions cannot use a required cloud worker profile.")
	};
	try {
		assertRequiredWorkerSelection(config, params);
	} catch (error) {
		return {
			requiredProfile,
			automaticEmptyWorkspace: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error))
		};
	}
	if (!requiredProfile || params.repository || params.catalogId || params.worktree === true) return {
		requiredProfile,
		automaticEmptyWorkspace: false
	};
	params.worktree = true;
	if (!params.cwd && !params.projectId && !params.projectGitUrl) {
		params.worktreeSource = "empty";
		return {
			requiredProfile,
			automaticEmptyWorkspace: true
		};
	}
	return {
		requiredProfile,
		automaticEmptyWorkspace: false
	};
}
function assertRequiredWorkerSessionCreateCurrent(config, requiredProfile, params) {
	if (config.cloudWorkers?.requiredProfile !== requiredProfile) throw new Error("Required worker policy changed during session creation; retry.");
	assertRequiredWorkerSelection(config, params);
}
/** An automatic empty checkout may never replace an already accepted workspace. */
function requiredWorkerWorkspaceReuseError(automaticEmptyWorkspace, existingTargetEntry) {
	if (automaticEmptyWorkspace && existingTargetEntry && !existingTargetEntry.worktree && (existingTargetEntry.sessionRoot || existingTargetEntry.spawnedCwd || existingTargetEntry.projectId)) return errorShape(ErrorCodes.INVALID_REQUEST, "Required worker setup cannot replace an existing workspace with an empty one; create a managed-workspace session with the original source.");
}
async function prepareRequiredWorkerCreatedSession(params) {
	if (!params.requiredProfile || params.pendingWorktree || params.requestedProjectGitUrl) return;
	if (!params.prepare) throw new Error("Required worker placement is unavailable; repair the configured profile and retry.");
	await params.prepare({
		sessionId: params.session.entry.sessionId,
		sessionKey: params.session.key,
		agentId: params.session.agentId
	}, async (assertCurrent) => {
		params.assertCurrent();
		assertCurrent();
	}, params.assertCurrent, params.signal, {
		waitForReady: false,
		retainDispatch: params.retainDispatch
	});
}
//#endregion
//#region src/gateway/server-methods/session-create-root.ts
async function prepareSessionCreateRequestedCwd(params) {
	const { requestedCwd, requestedExecNode } = params;
	if (!(!requestedCwd || (requestedExecNode ? path.isAbsolute(requestedCwd) || path.win32.isAbsolute(requestedCwd) : path.isAbsolute(requestedCwd)))) return err(errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd must be absolute"));
	if (params.permissionMode === "full" && params.clientPresent && !params.clientScopes.includes("operator.admin")) return err(missingScopeErrorShape({
		missingScope: ADMIN_SCOPE,
		requiredScopes: [ADMIN_SCOPE]
	}));
	if (requestedCwd && !requestedExecNode && !params.clientScopes.includes("operator.admin")) {
		const containment = await resolveWorkspacePathContainment(requestedCwd, params.cfg);
		return containment ? ok(containment.path) : err(missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}));
	}
	return ok(requestedCwd);
}
function prepareSessionCreateFilesystemRoot(params) {
	if (params.requestedExecNode) return ok({ sessionCwd: params.sessionCwd });
	try {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.targetAgentId);
		const rootCandidate = params.sessionCwd ?? workspaceDir;
		if (!params.sessionCwd) fs.mkdirSync(rootCandidate, { recursive: true });
		const sessionRoot = fs.realpathSync(rootCandidate);
		if (!fs.statSync(sessionRoot).isDirectory()) return invalidSessionRequest("sessions.create cwd is not a directory");
		if (params.sessionCwd && params.enforceSandboxContainment) {
			const targetRuntime = resolveSandboxRuntimeStatus({
				cfg: params.cfg,
				agentId: params.targetAgentId,
				sessionKey: params.sessionKey ?? `agent:${params.targetAgentId}:dashboard:pending`,
				preparedSessionEntry: null
			});
			if ((params.sandboxRequired || targetRuntime.sandboxed) && !isPathInside(fs.realpathSync(workspaceDir), sessionRoot)) return invalidSessionRequest(params.requestedProjectId ? "sessions.create project is outside the sandboxed agent workspace" : "sessions.create cwd is outside the sandboxed agent workspace");
		}
		return ok({
			sessionRoot,
			sessionCwd: params.sessionCwd ? sessionRoot : void 0
		});
	} catch (error) {
		return invalidSessionRequest(`sessions.create cwd is unavailable: ${formatErrorMessage(error)}`);
	}
}
/** Keep an implicit Gateway default distinct from a caller-selected fork destination. */
function resolveSessionCreateRootParameters(params, root) {
	if (params.worktree === true) return {};
	const inheritsParent = params.fork === true && !normalizeOptionalString(params.cwd) && !normalizeOptionalString(params.projectId);
	return {
		spawnedCwd: root?.sessionCwd,
		sessionRoot: inheritsParent ? void 0 : root?.sessionRoot,
		defaultSessionRoot: root?.sessionRoot
	};
}
/** Reuse local workspace selections without inheriting managed or remote ownership. */
function prepareSessionForkFilesystemRoot(params) {
	const parent = params.parent;
	if (parent.deviceFolder || parent.worktree || parent.repositoryWorkspaceId || parent.execHost === "node" || parent.execNode || parent.pendingWorktree || parent.pendingProjectGitUrl || !parent.spawnedCwd && !parent.spawnedWorkspaceDir) return ok({});
	const roots = resolveSessionWorkspaceRoots(params.cfg, params.targetAgentId, parent);
	const prepareRoot = (sessionCwd) => prepareSessionCreateFilesystemRoot({
		...params,
		enforceSandboxContainment: true,
		requestedProjectId: parent.projectId,
		sessionCwd
	});
	const cwd = prepareRoot(roots.diffCwd);
	if (!cwd.ok) return cwd;
	const root = roots.root === roots.diffCwd ? cwd : prepareRoot(roots.root);
	if (!root.ok) return root;
	return ok({
		...parent.projectId ? { projectId: parent.projectId } : {},
		spawnedCwd: cwd.value.sessionCwd,
		...parent.spawnedWorkspaceDir ? { spawnedWorkspaceDir: root.value.sessionRoot } : {},
		sessionRoot: root.value.sessionRoot
	});
}
/** Existing sessions keep their accepted workspace source across keyed create retries. */
function sessionWorkspaceReuseError(params, automaticEmptyWorkspace, existingTargetEntry) {
	const { deviceFolder, repository } = params;
	if (existingTargetEntry?.deviceFolder && !deviceFolder) return errorShape(ErrorCodes.INVALID_REQUEST, "Device folder sessions require their original deviceFolder; continue the existing session or create a new one.");
	const requiredError = requiredWorkerWorkspaceReuseError(automaticEmptyWorkspace, existingTargetEntry);
	if (requiredError) return requiredError;
	if (existingTargetEntry?.repositoryWorkspaceId && !repository) return errorShape(ErrorCodes.INVALID_REQUEST, "Repository sessions require their original repository source; dispatch the existing session to continue.");
}
//#endregion
export { normalizeRpcAttachmentsToChatAttachments as _, sessionWorkspaceReuseError as a, prepareRequiredWorkerSessionCreate as c, resolveSessionCreateInitialTurn as d, validateSessionCreateInitialMentions as f, resolveExplicitOriginBindingTargets as g, resolveChatSendOriginatingRoute as h, resolveSessionCreateRootParameters as i, prepareSessionDeviceFolder as l, isAcpBridgeClient as m, prepareSessionCreateRequestedCwd as n, assertRequiredWorkerSessionCreateCurrent as o, normalizeChatSendRequest as p, prepareSessionForkFilesystemRoot as r, prepareRequiredWorkerCreatedSession as s, prepareSessionCreateFilesystemRoot as t, isFreshChatSendStarted as u };
