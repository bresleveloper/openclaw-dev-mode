import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as clampPositiveTimerTimeoutMs, s as asFiniteNumber, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { l as readErrorName, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { c as isRecord, i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as createNonExitingRuntime } from "./runtime-BazLsT0s.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig, r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as createDedupeCache } from "./dedupe-5aqLNx3Q.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-BeTuTnO0.mjs";
import { l as kindFromMime } from "./mime-C3j3dfQb.mjs";
import { t as mutateConfigFile } from "./mutate-h3hU3xe4.mjs";
import { c as warn, i as logVerbose, o as shouldLogVerbose, t as danger } from "./globals-XVSoVbNQ.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { p as fireAndForgetHook } from "./hooks-CU2qx9-T.mjs";
import { t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-BhteYvbx.mjs";
import { u as createMessageReceiveContext } from "./channel-outbound-BbIm36V0.mjs";
import { i as resolveInboundMentionDecision, n as implicitMentionKindWhen, r as resolveBotThreadMentionPolicy } from "./mention-gating-0Hi8lUn4.mjs";
import { n as firstDefined, r as isSenderIdAllowed } from "./allow-from-Fqs2UkzW.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { t as formatLocationText } from "./location-CxESZbHi.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-Ccn5PiLn.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./security-runtime-6domDoE8.mjs";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C9pX_aod.mjs";
import { l as toPluginMessageContext, n as deriveInboundMessageHookContext, u as toPluginMessageReceivedEvent } from "./message-hook-mappers-CqRCIn9-.mjs";
import { a as buildChannelGroupsScopeTree, l as resolveScopeRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-CBIUperA.mjs";
import { n as listChatCommands } from "./commands-registry-list-BWZj-KCw.mjs";
import { n as normalizeCommandBody, t as maybeResolveTextAlias } from "./commands-registry-normalize-BI2t-DKf.mjs";
import { o as listNativeCommandSpecs, r as findCommandByNativeName, s as listNativeCommandSpecsForConfig } from "./commands-registry-CFDGAPH8.mjs";
import { r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-FwOIMA6L.mjs";
import { f as unregisterSessionBindingAdapter, u as registerSessionBindingAdapterV2 } from "./session-binding-service-ByKk9LiJ.mjs";
import { t as recordDeliveredCommandExchange } from "./command-transcript-BC0eYRaf.mjs";
import { a as buildPluginBindingResolvedText, d as parsePluginBindingApprovalCustomId, p as resolvePluginConversationBindingApproval } from "./conversation-binding-CjS0uvMb.mjs";
import { t as hasControlCommand } from "./command-detection-D0j_OxtK.mjs";
import { t as createPluginCommandRuntime } from "./plugin-command-runtime-CXi3MSd9.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { D as normalizeTelegramApiRoot, _ as isTelegramEditTargetMissingError, n as resolveTelegramTransport, v as isTelegramMessageHasNoTextError, y as isTelegramMessageNotModifiedError } from "./fetch-ZC4IpYLZ.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./routing-Dl7FngGa.mjs";
import { a as mergeTelegramAccountConfig, o as resolveTelegramAccountConfig } from "./account-selection-CQ3hKgoh.mjs";
import { f as resolveChannelConfigWrites } from "./channel-config-helpers-iQxjPtMU.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, s as resolveThreadBindingMaxAgeMsForChannel } from "./thread-bindings-policy-Hq7cocye.mjs";
import { n as isAbortRequestText } from "./abort-primitives-s9GIpM6V.mjs";
import { n as isBtwRequestText } from "./btw-command-BsR1Sazk.mjs";
import { n as resolveNativeCommandsEnabled, r as resolveNativeSkillsEnabled } from "./commands-ChveDd3R.mjs";
import "./session-transcript-runtime-Bxvuf0q8.mjs";
import { p as parseExecApprovalCommandText } from "./exec-approval-reply-Dn62m4ql.mjs";
import { n as resolveApprovalOverGateway } from "./approval-gateway-resolver-BbTScaK5.mjs";
import "./approval-gateway-runtime-BpWU7yBO.mjs";
import "./approval-reply-runtime-NFyRiSFk.mjs";
import { n as questionGatewayRuntime } from "./question-gateway-runtime-BkuNJp0m.mjs";
import "./config-mutation-Cj-vvWms.mjs";
import { h as shouldDebounceTextInbound } from "./channel-inbound-C0d69q8b.mjs";
import { n as createChannelIngressMonitor } from "./ingress-monitor-CExnLcCo.mjs";
import { i as runClaimableDedupeClaimLoop, t as createChannelReplayGuard } from "./persistent-dedupe-BE2yZwuK.mjs";
import { t as reportChannelRoomJoin } from "./channel-join-intro-runtime-BLDC9Ywt.mjs";
import "./dedupe-runtime-xNG1zlSj.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { t as applySessionModelSelection } from "./model-session-runtime-C38nnRk7.mjs";
import "./media-runtime-CmxLZuo1.mjs";
import "./conversation-runtime-BSuRFTFZ.mjs";
import "./thread-bindings-runtime-Byzm3N4B.mjs";
import "./plugin-command-runtime-DQKhP9dD.mjs";
import { n as createChannelInteractiveDispatcher } from "./plugin-runtime-BaFUwWWh.mjs";
import { n as channelReadyPatch, o as createTransportActivityStatusPatch } from "./channel-status-patches-B5E4Vlav.mjs";
import "./gateway-runtime-DVShvn9X.mjs";
import "./hook-runtime-B4enTx7F.mjs";
import "./allow-from-0x-NWkHs.mjs";
import "./command-auth-native-DcOXNEhg.mjs";
import "./command-primitives-runtime-CHIm6Lst.mjs";
import { n as buildCommandsMessagePaginated } from "./command-status-builders-xTY8f12J.mjs";
import "./command-status-BI3KmQua.mjs";
import "./command-detection-DGHM--Ry.mjs";
import { a as createDeferred } from "./extension-shared-Bp_Ziw8S.mjs";
import "./channel-inbound-debounce-Dg2sx709.mjs";
import "./channel-mention-gating-C7WlL-GP.mjs";
import "./channel-policy-C81H0zj1.mjs";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-runtime-BvWFdn5z.mjs";
import { r as formatModelsAvailableHeaderAsync, t as MODEL_PICKER_CHANGED_MESSAGE } from "./commands-models-DzIQgypm.mjs";
import "./models-provider-runtime-DqIbh4Wl.mjs";
import "./native-command-config-runtime-BJZ79c46.mjs";
import { i as resolveTelegramAccount, o as resolveTelegramMediaRuntimeOptions } from "./accounts-CHcpIFN8.mjs";
import { A as markdownToTelegramHtml, F as escapeTelegramHtml, K as getOrCreateAccountThrottler, U as resolveTelegramScopedGroupConfig, V as resolveTelegramGroupIngestEnabled, Z as Bot, w as buildInlineKeyboard, z as resolveTelegramAccountOwnerAgentId } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { t as buildTelegramConversationId } from "./topic-conversation-S0gZB4iY.mjs";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-CK1XNGpd.mjs";
import { n as isTelegramExecApprovalApprover, r as isTelegramExecApprovalAuthorizedSender } from "./exec-approvals-DPqXOxDl.mjs";
import { B as expandTelegramAllowFromWithAccessGroups, D as getTelegramTextParts, E as extractTelegramLocation, F as resolveTelegramPrimaryMedia, H as normalizeAllowFrom, M as joinTelegramTextParts, O as hasBotMention, S as withResolvedTelegramForumFlag, U as normalizeDmAllowFromWithStore, V as resolveTelegramDmAllow, W as resolveTelegramEffectiveDmPolicy, _ as resolveTelegramGroupAllowFromContext, a as buildTelegramInboundOriginTarget, b as resolveTelegramThreadSpec, c as buildTelegramThreadParams, f as getCachedTelegramForumFlag, g as resolveTelegramForumThreadId, h as resolveTelegramForumFlag, i as buildTelegramGroupPeerId, m as resolveTelegramBotHasTopicsEnabled, r as buildTelegramGroupFrom, t as TelegramPairingStoreReadError, u as describeReplyTarget, v as resolveTelegramMessageForumFlagHint, x as shouldUseTelegramDmThreadSession, y as resolveTelegramMessageThreadSpec } from "./helpers-amKpwD-6.mjs";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-Bw3s0i4E.mjs";
import { a as parseTelegramOpaqueCallbackData, c as hasTelegramApprovalCallbackPrefix, i as parseTelegramNativeCommandCallbackData, l as parseTelegramApprovalCallbackData, r as hasTelegramOpaqueCallbackPrefix, s as fitsTelegramCallbackData } from "./native-command-callback-data-egNNRPnG.mjs";
import { d as calculateTotalPages, h as resolveModelSelection, l as buildModelsKeyboard, m as resolveModelListCallback, p as parseModelCallbackData, t as buildCommandsPaginationKeyboard, u as buildProviderKeyboard } from "./command-ui-BOtvY39x.mjs";
import { a as resolveTelegramConversationRoute, t as applyTelegramTargetSession } from "./conversation-route-DhJ8dkiE.mjs";
import { c as parseTelegramQuestionCallbackData, i as normalizeTelegramButtonStyle, s as hasTelegramQuestionCallbackPrefix } from "./button-types-DtegLouf.mjs";
import { i as resolveTelegramCustomCommands, r as normalizeTelegramCommandName, t as TELEGRAM_COMMAND_NAME_PATTERN } from "./command-config-DxRRTtvn.mjs";
import { t as createTelegramThreadBindingManager } from "./thread-bindings-CgEq7rg0.mjs";
import { _t as evaluateTelegramGroupPolicyAccess, a as prepareTelegramPollAnswerContextAsync, c as findTelegramPollRegistryEntry, gt as evaluateTelegramGroupBaseAccess, ht as createTelegramClientFetch, i as isEligibleTelegramPollAnswerUpdate, l as retireTelegramPollRegistryEntry, mt as asTelegramClientFetch, o as recordPreparedTelegramPollAnswer, r as getPreparedTelegramPollAnswer, s as settleTelegramPollAnswerContext, vt as resolveTelegramEffectiveGroupPolicy } from "./send-DWoEOMF4.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { d as resolveTelegramEventIngressAuthorization, f as resolveTelegramNativeCommandAdmission, l as createTelegramIngressResolver, m as telegramAllowEntries, u as resolveTelegramCommandIngressAuthorization } from "./progress-draft-preview-DtwdAQc0.mjs";
import { n as buildTelegramInvalidApprovalTerminalText, r as buildTelegramLegacyApprovalTerminalText, t as buildTelegramCanonicalApprovalTerminalText } from "./approval-terminal-B0sB7aBr.mjs";
import { n as buildPluginTelegramMenuCommands, r as syncTelegramMenuCommands, t as buildCappedTelegramMenuCommands } from "./bot-native-command-menu-BewpTM88.mjs";
import { t as defaultTelegramBotDeps } from "./bot-deps-DbyaUUE9.mjs";
import { A as resolveTelegramInboundMediaUri, C as formatTelegramAmbientTranscriptBody, D as resolveTelegramForumTopicMetadata, E as promptContextBoundaryOptions, F as hasInboundMedia, I as isDurablyRetryableInboundMediaError, L as isMediaSizeLimitError, M as isTelegramForumServiceMessage, N as resolveMedia, O as enforceTelegramDmAccess, P as TelegramBotApiFileTooLargeError, R as isRecoverableMediaGroupError, S as createTelegramMessageSessionRuntime, T as latestPromptContextMinTimestampMs, _ as runWithTelegramSpooledReplayUpdate, a as telegramQueueEventId, b as buildSyntheticTextMessage, c as createTelegramSpooledReplayParticipant, d as getTelegramSpooledReplayLifecycle, f as isTelegramSpooledReplayUpdate, g as resolveTelegramUpdateReceivedAtSeconds, h as resolveTelegramSpooledReplayHeartbeatIntervalMs, i as resolveTelegramUpdateId$1, j as resolveTelegramPromptMediaPath, k as isTelegramDmAccessAllowed, l as ensureTelegramMessageProcessingResult, m as recordTelegramUpdateReceivedAt, n as resolveTelegramMessageTurnSettings, o as TelegramSpooledReplayProcessingError, p as recordTelegramMessageProcessingResult, r as openTelegramIngressQueue, s as createTelegramSpooledReplayDeferredParticipant, t as createTelegramMessageProcessor, u as getTelegramSpooledReplayDeferredParticipant, v as runWithTelegramUpdateProcessingFrame, w as latestPromptContextAmbientWatermark, x as createTelegramMessageContextRuntime, y as buildSyntheticContext } from "./bot-message-CucppeLB.mjs";
import { t as defaultTelegramNativeCommandDeps } from "./bot-native-command-deps.runtime.js";
import { randomUUID } from "node:crypto";
//#region extensions/telegram/src/bot-handlers.callback-actions.ts
function createTelegramCallbackMessageActions(params) {
	const { bot, callbackMessage, threadSpec } = params;
	const callbackBusinessParams = callbackMessage.business_connection_id !== void 0 ? { business_connection_id: callbackMessage.business_connection_id } : void 0;
	const withCallbackBusinessParams = (value) => callbackBusinessParams ? {
		...callbackBusinessParams,
		...value
	} : value;
	const editCallbackMessage = async (text, editParams) => {
		return await bot.api.editMessageText(callbackMessage.chat.id, callbackMessage.message_id, text, editParams ? withCallbackBusinessParams(editParams) : callbackBusinessParams);
	};
	const editCallbackButtons = async (buttons) => {
		return await bot.api.editMessageReplyMarkup(callbackMessage.chat.id, callbackMessage.message_id, withCallbackBusinessParams({ reply_markup: buildInlineKeyboard(buttons) ?? { inline_keyboard: [] } }));
	};
	const deleteCallbackMessage = async () => {
		return callbackBusinessParams ? await bot.api.deleteBusinessMessages(callbackBusinessParams.business_connection_id, [callbackMessage.message_id]) : await bot.api.deleteMessage(callbackMessage.chat.id, callbackMessage.message_id);
	};
	const replyToCallbackChat = async (text, replyParams) => {
		const threadParams = buildTelegramThreadParams(threadSpec);
		const mergedParams = callbackBusinessParams || threadParams || replyParams ? {
			...replyParams,
			...callbackBusinessParams,
			...threadParams
		} : replyParams;
		return await bot.api.sendMessage(callbackMessage.chat.id, text, mergedParams);
	};
	const editCallbackMessageWithButtons = async (text, buttons, extra) => {
		const keyboard = buildInlineKeyboard(buttons);
		const editParams = keyboard ? {
			reply_markup: keyboard,
			...extra
		} : extra;
		try {
			await editCallbackMessage(text, editParams);
		} catch (editErr) {
			const errStr = String(editErr);
			if (errStr.includes("no text in the message")) {
				try {
					await deleteCallbackMessage();
				} catch {
					await editCallbackButtons([]).catch(() => {});
				}
				await replyToCallbackChat(text, editParams);
			} else if (!errStr.includes("message is not modified")) throw editErr;
		}
	};
	return {
		editCallbackMessage,
		clearCallbackButtons: () => editCallbackButtons([]),
		editCallbackButtons,
		editCallbackMessageWithButtons,
		deleteCallbackMessage,
		replyToCallbackChat
	};
}
async function sendTelegramQuestionFeedback(params) {
	if (params.mode === "terminal") await params.actions.clearCallbackButtons().catch(() => {});
	const groupCustomInput = params.mode === "custom-input" && params.isGroup;
	const text = groupCustomInput ? `${params.user.first_name}, reply with your own answer.` : params.text;
	await params.actions.replyToCallbackChat(text, params.mode === "custom-input" ? {
		...groupCustomInput ? { entities: [{
			type: "text_mention",
			offset: 0,
			length: params.user.first_name.length,
			user: params.user
		}] } : {},
		reply_markup: {
			force_reply: true,
			selective: groupCustomInput
		}
	} : void 0);
	if (params.mode === "custom-input") await params.actions.clearCallbackButtons().catch(() => {});
}
async function handleTelegramQuestionCallback(params) {
	try {
		const result = await (params.resolveQuestion ?? questionGatewayRuntime.resolveOption)({
			cfg: params.cfg,
			questionId: params.callback.questionId,
			...params.callback.intent === "custom-input" ? { customInput: true } : { optionIndex: params.callback.optionIndex },
			senderId: params.senderId,
			clientDisplayName: "Telegram question"
		});
		if (params.callback.intent === "custom-input") {
			const terminal = result.status === "already-terminal";
			await params.feedback(terminal ? "This question was already answered." : "Reply with your own answer.", terminal ? "terminal" : "custom-input");
			return;
		}
		await params.feedback(result.status === "answered" ? "Answer submitted." : "This question was already answered.", "terminal").catch(() => {});
	} catch (error) {
		await params.feedback("Could not submit this answer.", "retry").catch(() => {});
		throw error;
	}
}
//#endregion
//#region extensions/telegram/src/interactive-dispatch.ts
const dispatchTelegramInteractive = createChannelInteractiveDispatcher({
	channel: "telegram",
	interactiveKey: "callback",
	dispatchInteractiveKey: "callbackMessage"
});
async function dispatchTelegramPluginInteractiveHandler(params) {
	return await dispatchTelegramInteractive({
		...params,
		dedupeId: params.ctx.callbackId
	});
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-router-controls.ts
var TelegramRetryableCallbackError = class extends Error {
	constructor(cause) {
		super(String(cause));
		this.cause = cause;
		this.name = "TelegramRetryableCallbackError";
	}
};
const isPermanentTelegramCallbackEditError = (err) => isTelegramEditTargetMissingError(err) || isTelegramMessageHasNoTextError(err);
function isApprovalAlreadyResolvedError(error) {
	if (!(error instanceof Error)) return false;
	const record = error;
	const reason = record.details?.reason;
	return record.gatewayCode === "APPROVAL_ALREADY_RESOLVED" || record.gatewayCode === "INVALID_REQUEST" && reason === "APPROVAL_ALREADY_RESOLVED" || /approval already resolved/i.test(error.message);
}
function createTelegramCallbackApprovalRuntime(params) {
	const { accountId, telegramDeps, runtimeCfg, senderId, actions } = params;
	const { clearCallbackButtons, editCallbackMessage, replyToCallbackChat } = actions;
	const resolveAuthorizedApprovalKinds = () => {
		const context = {
			cfg: runtimeCfg,
			accountId,
			senderId
		};
		const pluginApprover = isTelegramExecApprovalApprover(context);
		const kinds = [];
		if (isTelegramExecApprovalAuthorizedSender(context) || pluginApprover) kinds.push("exec");
		if (pluginApprover) kinds.push("plugin");
		return kinds;
	};
	const clearTerminalApprovalButtons = async () => {
		try {
			await clearCallbackButtons();
		} catch (editErr) {
			const errStr = String(editErr);
			if (errStr.includes("message is not modified") || errStr.includes("there is no text in the message to edit")) return;
			logVerbose(`telegram: failed to clear approval callback buttons: ${errStr}`);
		}
	};
	const terminalizeApprovalMessage = async (text) => {
		try {
			await editCallbackMessage(text, { reply_markup: { inline_keyboard: [] } });
			return;
		} catch (editErr) {
			const errStr = String(editErr);
			const alreadyTerminal = errStr.includes("message is not modified");
			if (!alreadyTerminal) logVerbose(`telegram: failed to render terminal approval receipt: ${errStr}`);
			await clearTerminalApprovalButtons();
			if (alreadyTerminal) return;
		}
		try {
			await replyToCallbackChat(text);
		} catch (sendErr) {
			logVerbose(`telegram: failed to send terminal approval receipt: ${String(sendErr)}`);
		}
	};
	const terminalizeLegacyApproval = async (receipt) => await terminalizeApprovalMessage(buildTelegramLegacyApprovalTerminalText(receipt));
	const resolveApproval = telegramDeps.resolveApproval ?? resolveApprovalOverGateway;
	const resolveCanonicalApproval = async (approvalCallback) => await resolveApproval({
		cfg: runtimeCfg,
		approvalId: approvalCallback.approvalId,
		approvalKind: approvalCallback.approvalKind,
		decision: approvalCallback.decision,
		channel: "telegram",
		accountId,
		senderId
	});
	const terminalizeCanonicalApproval = async (approvalCallback, result) => await terminalizeApprovalMessage(buildTelegramCanonicalApprovalTerminalText({
		result,
		fallbackApprovalId: approvalCallback.approvalId
	}));
	const handleCanonical = async (approvalCallback) => {
		const authorizationKind = approvalCallback.approvalKind === "plugin" ? "plugin" : "exec";
		if (!resolveAuthorizedApprovalKinds().includes(authorizationKind)) {
			logVerbose(`Blocked telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		try {
			const result = await resolveCanonicalApproval(approvalCallback);
			if (!result.applied) logVerbose(`telegram: approval callback already resolved ${approvalCallback.approvalId} status=${result.approval.status}`);
			await terminalizeCanonicalApproval(approvalCallback, result);
		} catch (resolveErr) {
			logVerbose(`telegram: failed to resolve approval callback ${approvalCallback.approvalId}: ${String(resolveErr)}`);
			if (isApprovalNotFoundError(resolveErr) || isApprovalAlreadyResolvedError(resolveErr)) {
				await terminalizeLegacyApproval({
					approvalId: approvalCallback.approvalId,
					outcome: "no-longer-pending"
				});
				return;
			}
			throw new TelegramRetryableCallbackError(resolveErr);
		}
	};
	const handleMalformedReserved = async () => {
		if (resolveAuthorizedApprovalKinds().length === 0) {
			logVerbose(`Blocked malformed telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		logVerbose(`telegram: consumed malformed reserved approval callback from ${senderId}`);
		await terminalizeApprovalMessage(buildTelegramInvalidApprovalTerminalText());
	};
	const handleLegacy = async (approvalCallback) => {
		const approvalKinds = resolveAuthorizedApprovalKinds();
		if (approvalKinds.length === 0) {
			logVerbose(`Blocked telegram approval callback from ${senderId || "unknown"} (not authorized)`);
			return;
		}
		for (const approvalKind of approvalKinds) {
			const canonicalCallback = {
				type: "approval",
				approvalId: approvalCallback.approvalId,
				approvalKind,
				decision: approvalCallback.decision
			};
			try {
				await resolveApproval({
					cfg: runtimeCfg,
					approvalId: approvalCallback.approvalId,
					decision: approvalCallback.decision,
					channel: "telegram",
					accountId,
					senderId,
					resolveMethod: approvalKind
				});
				await terminalizeLegacyApproval({
					approvalId: approvalCallback.approvalId,
					decision: approvalCallback.decision,
					outcome: "resolved-here"
				});
				return;
			} catch (resolveErr) {
				if (isApprovalNotFoundError(resolveErr)) continue;
				if (isApprovalAlreadyResolvedError(resolveErr)) {
					try {
						const result = await resolveCanonicalApproval(canonicalCallback);
						await terminalizeCanonicalApproval(canonicalCallback, result);
					} catch (canonicalError) {
						if (!isApprovalNotFoundError(canonicalError) && !isApprovalAlreadyResolvedError(canonicalError)) throw new TelegramRetryableCallbackError(canonicalError);
						logVerbose(`telegram: recorded approval lookup failed after stale legacy callback ${approvalCallback.approvalId}: ${String(canonicalError)}`);
						await terminalizeLegacyApproval({
							approvalId: approvalCallback.approvalId,
							outcome: "no-longer-pending"
						});
					}
					return;
				}
				logVerbose(`telegram: failed to resolve approval callback ${approvalCallback.approvalId}: ${String(resolveErr)}`);
				throw new TelegramRetryableCallbackError(resolveErr);
			}
		}
		logVerbose(`telegram: approval callback not found ${approvalCallback.approvalId}`);
		if (!approvalKinds.includes("plugin")) return;
		await terminalizeLegacyApproval({
			approvalId: approvalCallback.approvalId,
			outcome: "no-longer-pending"
		});
	};
	return {
		handleCanonical,
		handleMalformedReserved,
		handleLegacy
	};
}
const MULTI_SELECT_PREFIX = "OC_MULTI|";
const MULTI_SELECT_TOGGLE_PREFIX = `${MULTI_SELECT_PREFIX}toggle|`;
const SELECT_PREFIX = "OC_SELECT|";
const SELECTED_PREFIX = "✅ ";
const parseTelegramManagedSelectCallback = (data) => {
	if (data.startsWith(MULTI_SELECT_TOGGLE_PREFIX)) return {
		type: "multi-toggle",
		value: data.slice(MULTI_SELECT_TOGGLE_PREFIX.length)
	};
	if (data === `${MULTI_SELECT_PREFIX}clear`) return { type: "multi-clear" };
	if (data === `${MULTI_SELECT_PREFIX}submit`) return { type: "multi-submit" };
	if (data.startsWith(SELECT_PREFIX)) return {
		type: "select",
		value: data.slice(10)
	};
};
const cloneInlineKeyboardButtons = (message) => (message.reply_markup?.inline_keyboard ?? []).map((row) => row.flatMap((button) => {
	if (!("callback_data" in button) || typeof button.callback_data !== "string") return [];
	const style = normalizeTelegramButtonStyle(button.style);
	return [{
		text: button.text,
		callback_data: button.callback_data,
		...style ? { style } : {}
	}];
})).filter((row) => row.length > 0);
const isSelectedMultiButton = (button) => /^✅\s*/.test(button.text);
const isMultiToggleButton = (button) => button.callback_data.startsWith(MULTI_SELECT_TOGGLE_PREFIX);
async function handleTelegramInteractiveCallback(params) {
	const { accountId, callback, ctx, callbackMessage, data, pluginCallbackData, callbackConversationId, callbackThreadId, senderId, senderUsername, isGroup, isForum, storeAllowFrom, actions, messageRuntime, authorizeCallback } = params;
	const { processMessageWithReplyChain } = messageRuntime;
	const { clearCallbackButtons, editCallbackButtons, editCallbackMessage, deleteCallbackMessage, replyToCallbackChat } = actions;
	const buildSynthetic = (text) => {
		const message = buildSyntheticTextMessage({
			base: withResolvedTelegramForumFlag(callbackMessage, isForum),
			from: callback.from,
			text,
			date: resolveTelegramUpdateReceivedAtSeconds(ctx.update)
		});
		return {
			ctx: buildSyntheticContext(ctx, message),
			message
		};
	};
	const processSubmitText = async (text) => {
		const synthetic = buildSynthetic(text);
		const participant = isTelegramSpooledReplayUpdate(synthetic.ctx.update) ? getTelegramSpooledReplayDeferredParticipant() ?? createTelegramSpooledReplayDeferredParticipant(`plugin-callback-submit:${callback.id}`) ?? void 0 : void 0;
		try {
			const result = await processMessageWithReplyChain({
				ctx: synthetic.ctx,
				msg: synthetic.message,
				allMedia: [],
				storeAllowFrom,
				options: {
					spooledReplay: true,
					isolateSpooledReplaySettlement: true,
					forceWasMentioned: true,
					messageIdOverride: callback.id
				},
				spooledReplayAbortSignal: participant?.abortSignal
			});
			if (result.kind === "completed" || result.kind === "skipped") {
				participant?.settle(result);
				return result.kind;
			}
			throw new TelegramRetryableCallbackError(result.error);
		} catch (err) {
			participant?.settle({
				kind: "failed-retryable",
				error: err
			});
			throw err;
		}
	};
	const pluginBindingApproval = parsePluginBindingApprovalCustomId(data);
	if (pluginBindingApproval) {
		let resolved;
		try {
			resolved = await resolvePluginConversationBindingApproval({
				approvalId: pluginBindingApproval.approvalId,
				decision: pluginBindingApproval.decision,
				senderId: senderId || void 0
			});
		} catch (err) {
			throw new TelegramRetryableCallbackError(err);
		}
		await clearCallbackButtons();
		await replyToCallbackChat(buildPluginBindingResolvedText(resolved));
		return true;
	}
	if ((await dispatchTelegramPluginInteractiveHandler({
		data: pluginCallbackData,
		ctx: {
			accountId,
			callbackId: callback.id,
			conversationId: callbackConversationId,
			parentConversationId: callbackThreadId != null ? String(callbackMessage.chat.id) : void 0,
			senderId: senderId || void 0,
			senderUsername: senderUsername || void 0,
			threadId: callbackThreadId,
			isGroup,
			isForum,
			auth: { isAuthorizedSender: await authorizeCallback() },
			callbackMessage: {
				messageId: callbackMessage.message_id,
				chatId: String(callbackMessage.chat.id),
				messageText: callbackMessage.text ?? callbackMessage.caption
			}
		},
		respond: {
			reply: async ({ text, buttons }) => {
				await replyToCallbackChat(text, buttons ? { reply_markup: buildInlineKeyboard(buttons) } : void 0);
			},
			editMessage: async ({ text, buttons }) => {
				await editCallbackMessage(text, buttons ? { reply_markup: buildInlineKeyboard(buttons) } : void 0);
			},
			editButtons: async ({ buttons }) => {
				await editCallbackButtons(buttons);
			},
			clearButtons: async () => {
				await clearCallbackButtons();
			},
			deleteMessage: async () => {
				await deleteCallbackMessage();
			}
		},
		afterInvoke: async (result) => {
			if (result?.handled === false) return;
			const submitText = normalizeOptionalString(result?.submitText);
			if (!submitText || await processSubmitText(submitText) === "skipped") return;
			await clearCallbackButtons().catch((err) => {
				logVerbose(`telegram plugin callback button cleanup skipped: ${String(err)}`);
			});
		}
	})).handled) return true;
	const selectCallback = parseTelegramManagedSelectCallback(callback.data?.trimStart() ?? data);
	if (!selectCallback) return false;
	if (selectCallback.type === "multi-toggle" || selectCallback.type === "multi-clear") {
		const buttons = cloneInlineKeyboardButtons(callbackMessage).map((row) => row.map((button) => {
			if (!isMultiToggleButton(button)) return button;
			const buttonValue = button.callback_data.slice(MULTI_SELECT_TOGGLE_PREFIX.length);
			const baseText = button.text.replace(/^✅\s*/, "");
			const wasSelected = isSelectedMultiButton(button);
			const selected = selectCallback.type === "multi-toggle" && (buttonValue === selectCallback.value ? !wasSelected : wasSelected);
			return {
				...button,
				text: selected ? `${SELECTED_PREFIX}${baseText}` : baseText
			};
		}));
		if (buttons.length > 0) try {
			await editCallbackButtons(buttons);
		} catch (editErr) {
			if (!String(editErr).includes("message is not modified")) throw new TelegramRetryableCallbackError(editErr);
		}
		return true;
	}
	let text;
	if (selectCallback.type === "multi-submit") {
		const selected = cloneInlineKeyboardButtons(callbackMessage).flat().filter((button) => isMultiToggleButton(button) && isSelectedMultiButton(button)).map((button) => button.callback_data.slice(MULTI_SELECT_TOGGLE_PREFIX.length));
		text = `Multi-select submitted: ${selected.length > 0 ? selected.join(", ") : "none"}`;
	} else {
		try {
			await clearCallbackButtons();
		} catch (editErr) {
			const errStr = String(editErr);
			if (!errStr.includes("message is not modified") && !errStr.includes("there is no text in the message to edit")) throw new TelegramRetryableCallbackError(editErr);
		}
		text = `Single-select submitted: ${selectCallback.value}`;
	}
	const synthetic = buildSynthetic(text);
	await processMessageWithReplyChain({
		ctx: synthetic.ctx,
		msg: synthetic.message,
		allMedia: [],
		storeAllowFrom,
		options: {
			forceWasMentioned: true,
			messageIdOverride: callback.id
		}
	});
	return true;
}
//#endregion
//#region extensions/telegram/src/callback-query-answer-state.ts
const TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE = Symbol.for("openclaw.telegram.callbackQueryAnswerPromise");
const telegramCallbackQueryAnswers = /* @__PURE__ */ new WeakMap();
function startTelegramCallbackQueryAnswer(bot, callbackQueryId, retainUntilDispatch) {
	let answers = telegramCallbackQueryAnswers.get(bot);
	if (!answers) {
		answers = /* @__PURE__ */ new Map();
		telegramCallbackQueryAnswers.set(bot, answers);
	}
	const existing = answers.get(callbackQueryId);
	if (existing) return existing.promise;
	const answer = {
		promise: bot.api.answerCallbackQuery(callbackQueryId),
		pending: true,
		retainUntilDispatch
	};
	answers.set(callbackQueryId, answer);
	answer.promise.then(() => {
		answer.pending = false;
		if (!answer.retainUntilDispatch) answers.delete(callbackQueryId);
	}, () => answers.delete(callbackQueryId));
	return answer.promise;
}
function takeTelegramCallbackQueryAdmissionAnswer(bot, callbackQueryId) {
	const answers = telegramCallbackQueryAnswers.get(bot);
	const answer = answers?.get(callbackQueryId);
	if (answer) {
		answer.retainUntilDispatch = false;
		if (!answer.pending) answers?.delete(callbackQueryId);
	}
	return answer?.promise;
}
function setTelegramCallbackQueryAnswerPromise(ctx, promise) {
	Object.defineProperty(ctx, TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE, {
		configurable: true,
		value: promise
	});
}
function getTelegramCallbackQueryAnswerPromise(ctx) {
	const promise = ctx[TELEGRAM_CALLBACK_QUERY_ANSWER_PROMISE];
	return promise instanceof Promise ? promise : void 0;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.callback-router.ts
function createTelegramCallbackRouter({ params: { accountId, bot, runtime, telegramDeps, shouldSkipUpdate, nativeCommandCallbackDispatcher }, message: messageRuntime, authorization: authorizationRuntime }) {
	const { processMessageWithReplyChain } = messageRuntime;
	const { resolveTelegramEventAuthorizationContext, authorizeTelegramEventSender, isTelegramModelCallbackAuthorized } = authorizationRuntime;
	const getChat = bot.api.getChat.bind(bot.api);
	const handleCallback = async (ctx) => {
		const callback = ctx.callbackQuery;
		if (!callback) return;
		const answerCallbackQuery = async () => {
			await withTelegramApiErrorLogging({
				operation: "answerCallbackQuery",
				runtime,
				fn: () => startTelegramCallbackQueryAnswer(bot, callback.id, false)
			}).catch(() => {});
		};
		const skipUpdate = shouldSkipUpdate(ctx);
		const data = (callback.data ?? "").trim();
		const typedQuestionCallback = parseTelegramQuestionCallbackData(data);
		const earlyAnswerPromise = getTelegramCallbackQueryAnswerPromise(ctx);
		if (earlyAnswerPromise) await earlyAnswerPromise.catch(answerCallbackQuery);
		else await answerCallbackQuery();
		if (skipUpdate) return;
		try {
			const callbackMessage = callback.message;
			if (!data || !callbackMessage) return;
			const chatId = callbackMessage.chat.id;
			const isGroup = callbackMessage.chat.type === "group" || callbackMessage.chat.type === "supergroup";
			const nativeCallbackCommand = parseTelegramNativeCommandCallbackData(data);
			const hasReservedModelPrefix = data.startsWith("mdl1~");
			const hasReservedOpaquePrefix = hasTelegramOpaqueCallbackPrefix(data);
			const opaqueCallbackData = parseTelegramOpaqueCallbackData(callback.data?.trimStart());
			const genericCallbackText = data.startsWith("/") ? data : `callback_data: ${data}`;
			const callbackCommandText = nativeCallbackCommand ?? (opaqueCallbackData ? "" : genericCallbackText);
			const hasReservedApprovalPrefix = hasTelegramApprovalCallbackPrefix(data);
			const hasReservedQuestionPrefix = hasTelegramQuestionCallbackPrefix(data);
			const typedApprovalCallback = parseTelegramApprovalCallbackData(data);
			const legacyApprovalCallback = parseExecApprovalCommandText(nativeCallbackCommand ?? (opaqueCallbackData ? "" : data));
			const isRuntimeControlCallback = hasReservedApprovalPrefix || legacyApprovalCallback !== null || hasReservedQuestionPrefix;
			const authorizationCfg = telegramDeps.getRuntimeConfig();
			const inlineButtonsScope = resolveTelegramInlineButtonsScope({
				cfg: authorizationCfg,
				accountId
			});
			const inlineButtonsUnavailable = inlineButtonsScope === "off" || inlineButtonsScope === "dm" && isGroup || inlineButtonsScope === "group" && !isGroup;
			if (!isRuntimeControlCallback && inlineButtonsUnavailable && !nativeCallbackCommand && !hasReservedOpaquePrefix && !hasReservedModelPrefix) return;
			const isForum = await resolveTelegramForumFlag({
				chatId,
				chatType: callbackMessage.chat.type,
				isGroup,
				isForum: callbackMessage.chat.is_forum,
				isTopicMessage: callbackMessage.is_topic_message,
				getChat
			});
			const senderId = callback.from?.id ? String(callback.from.id) : "";
			const senderUsername = callback.from?.username ?? "";
			const eventAuthContext = await resolveTelegramEventAuthorizationContext({
				cfg: authorizationCfg,
				chatId,
				isGroup,
				senderId,
				threadSpec: resolveTelegramMessageThreadSpec(callbackMessage, isForum)
			});
			const threadSpec = eventAuthContext.threadSpec;
			const { dmThreadId, storeAllowFrom, groupConfig } = eventAuthContext;
			const requireTopic = groupConfig?.requireTopic;
			if (!isGroup && requireTopic === true && dmThreadId == null) {
				logVerbose(`Blocked telegram callback in DM ${chatId}: requireTopic=true but no topic present`);
				return;
			}
			const actions = createTelegramCallbackMessageActions({
				bot,
				callbackMessage,
				threadSpec
			});
			const clearRoutedCallbackButtons = async () => {
				try {
					await actions.clearCallbackButtons();
				} catch (editErr) {
					if (!isTelegramMessageNotModifiedError(editErr) && !isPermanentTelegramCallbackEditError(editErr)) throw new TelegramRetryableCallbackError(editErr);
				}
			};
			const terminalizeUnavailableCallback = async () => {
				logVerbose("telegram: typed callback unavailable (handler missing or payload invalid)");
				await clearRoutedCallbackButtons();
				await actions.replyToCallbackChat("This action is no longer available.");
			};
			if (inlineButtonsUnavailable && (nativeCallbackCommand && !legacyApprovalCallback || hasReservedOpaquePrefix || hasReservedModelPrefix)) {
				await terminalizeUnavailableCallback();
				return;
			}
			if (nativeCallbackCommand && nativeCommandCallbackDispatcher) {
				const dispatch = await nativeCommandCallbackDispatcher({
					botUser: ctx.me,
					callbackQuery: callback,
					commandText: nativeCallbackCommand
				});
				if (dispatch.handled) {
					if (dispatch.clearButtons) await clearRoutedCallbackButtons();
					return;
				}
			}
			const authorizationMode = hasReservedQuestionPrefix ? "callback-runtime-allowlist" : !isGroup || !isRuntimeControlCallback && inlineButtonsScope === "allowlist" ? "callback-allowlist" : "callback-scope";
			if (!await authorizeTelegramEventSender({
				chatId,
				chatTitle: callbackMessage.chat.title,
				isGroup,
				senderId,
				mode: authorizationMode,
				context: eventAuthContext
			})) return;
			const callbackConversationId = buildTelegramConversationId({
				chatId,
				thread: threadSpec
			});
			const callbackThreadId = threadSpec.id;
			const runtimeCfg = telegramDeps.getRuntimeConfig();
			const approvalRuntime = createTelegramCallbackApprovalRuntime({
				accountId,
				telegramDeps,
				runtimeCfg,
				senderId,
				actions
			});
			const authorizeCallback = async () => await isTelegramModelCallbackAuthorized({
				chatId,
				isGroup,
				senderId,
				context: eventAuthContext
			});
			if (typedApprovalCallback) {
				await approvalRuntime.handleCanonical(typedApprovalCallback);
				return;
			}
			if (typedQuestionCallback) {
				await handleTelegramQuestionCallback({
					callback: typedQuestionCallback,
					cfg: runtimeCfg,
					senderId,
					feedback: async (text, mode) => await sendTelegramQuestionFeedback({
						actions,
						text,
						mode,
						isGroup,
						user: callback.from
					})
				});
				return;
			}
			if (hasReservedQuestionPrefix) return;
			if (hasReservedApprovalPrefix) {
				await approvalRuntime.handleMalformedReserved();
				return;
			}
			if (!nativeCallbackCommand && !hasReservedModelPrefix && !inlineButtonsUnavailable && await handleTelegramInteractiveCallback({
				accountId,
				callback,
				ctx,
				callbackMessage,
				data,
				pluginCallbackData: opaqueCallbackData ?? data,
				callbackConversationId,
				callbackThreadId,
				senderId,
				senderUsername,
				isGroup,
				isForum,
				storeAllowFrom,
				actions,
				messageRuntime,
				authorizeCallback
			})) return;
			if (legacyApprovalCallback) {
				await approvalRuntime.handleLegacy(legacyApprovalCallback);
				return;
			}
			if (hasReservedOpaquePrefix) {
				await terminalizeUnavailableCallback();
				return;
			}
			const { editCallbackMessage, editCallbackMessageWithButtons: editMessageWithButtons } = actions;
			const resolveSessionState = () => messageRuntime.resolveTelegramSessionState({
				chatId,
				isGroup,
				threadSpec,
				botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me),
				senderId,
				runtimeCfg
			});
			const retryModelAction = async (action) => {
				try {
					return await action();
				} catch (error) {
					throw new TelegramRetryableCallbackError(error);
				}
			};
			const paginationMatch = data.match(/^commands_page_(\d+|noop)(?::(.+))?$/);
			if (paginationMatch) {
				const pageValue = paginationMatch[1];
				if (pageValue === "noop") return;
				const page = parseStrictPositiveInteger(pageValue);
				if (page === void 0) return;
				const agentId = paginationMatch[2]?.trim() || (await resolveSessionState()).agentId;
				const result = await retryModelAction(async () => {
					const skillCommands = await telegramDeps.prepareSkillCommandsForAgents({
						cfg: runtimeCfg,
						agentIds: [agentId]
					});
					return buildCommandsMessagePaginated(runtimeCfg, skillCommands, {
						page,
						forcePaginatedList: true,
						surface: "telegram"
					});
				});
				const keyboard = result.totalPages > 1 ? buildInlineKeyboard(buildCommandsPaginationKeyboard(result.currentPage, result.totalPages, agentId)) : void 0;
				try {
					await editCallbackMessage(markdownToTelegramHtml(result.text), {
						parse_mode: "HTML",
						...keyboard ? { reply_markup: keyboard } : {}
					});
				} catch (editErr) {
					if (!String(editErr).includes("message is not modified")) throw new TelegramRetryableCallbackError(editErr);
				}
				const session = await resolveSessionState();
				await recordDeliveredCommandExchange({
					config: runtimeCfg,
					agentId: session.agentId,
					sessionKey: session.sessionKey,
					expectedSessionId: session.sessionEntry?.sessionId,
					commandText: `/commands ${page}`,
					commandId: `telegram:${accountId}:${callback.id}`,
					replyId: String(callbackMessage.message_id),
					replyText: result.text
				});
				return;
			}
			const modelCallback = parseModelCallbackData(data);
			if (modelCallback) {
				if (!await authorizeCallback()) {
					logVerbose(`Blocked telegram model callback from ${senderId || "unknown"} (not authorized for /models)`);
					return;
				}
				const { sessionState, modelData } = await retryModelAction(async () => {
					const session = await resolveSessionState();
					return {
						sessionState: session,
						modelData: await telegramDeps.buildModelsProviderData(runtimeCfg, session.agentId, { sessionEntry: session.sessionEntry })
					};
				});
				let commandText = "/model";
				const showModelReply = async (...args) => {
					await editMessageWithButtons(...args);
					const [text, buttons] = args;
					await recordDeliveredCommandExchange({
						config: runtimeCfg,
						agentId: sessionState.agentId,
						sessionKey: sessionState.sessionKey,
						expectedSessionId: sessionState.sessionEntry?.sessionId,
						commandText,
						commandId: `telegram:${accountId}:${callback.id}`,
						replyId: String(callbackMessage.message_id),
						replyText: [text.replace(/<[^>]*>/g, ""), ...(buttons ?? []).map((row) => row.map((button) => button.text).join(", "))].join("\n")
					});
				};
				const { byProvider, providers, resolvedDefault: activeResolvedDefault } = modelData;
				const providerInfos = providers.map((provider) => ({
					id: provider,
					count: byProvider.get(provider)?.size ?? 0
				}));
				const showChangedModelPicker = () => retryModelAction(() => showModelReply(MODEL_PICKER_CHANGED_MESSAGE, buildProviderKeyboard(providerInfos)));
				if (modelCallback.type === "providers" || modelCallback.type === "back") {
					if (providers.length === 0) {
						await retryModelAction(() => showModelReply("No providers available.", []));
						return;
					}
					const notice = [...modelData.modelMenu?.byProvider.values() ?? []].map((provider) => provider.notice).filter(Boolean).join("\n");
					await retryModelAction(() => showModelReply([
						modelData.refreshWarning,
						"Select a provider:",
						notice
					].filter(Boolean).join("\n\n"), buildProviderKeyboard(providerInfos)));
					return;
				}
				if (modelCallback.type === "list" || modelCallback.type === "list-ref") {
					const listSelection = resolveModelListCallback({
						callback: modelCallback,
						providers
					});
					const modelSet = listSelection && byProvider.get(listSelection.provider);
					if (!listSelection || !modelSet || modelSet.size === 0) {
						await showChangedModelPicker();
						return;
					}
					const { provider, page } = listSelection;
					commandText = `/model ${provider} ${page}`;
					const models = [...modelSet].toSorted((left, right) => left.localeCompare(right));
					const totalPages = calculateTotalPages(models.length);
					const safePage = Math.max(1, Math.min(page, totalPages));
					const currentModel = sessionState.model || `${activeResolvedDefault.provider}/${activeResolvedDefault.model}`;
					const availability = modelData.modelMenu?.byProvider.get(provider);
					const buttons = buildModelsKeyboard({
						provider,
						models,
						currentModel,
						currentPage: safePage,
						totalPages,
						modelNames: modelData.modelMenu?.modelNames ?? modelData.modelNames
					});
					const text = `${await formatModelsAvailableHeaderAsync({
						provider,
						total: models.length,
						cfg: runtimeCfg,
						agentDir: resolveAgentDir(runtimeCfg, sessionState.agentId),
						sessionEntry: sessionState.sessionEntry,
						availability
					})}\nSelecting a model also applies its configured runtime.`;
					await retryModelAction(() => showModelReply([modelData.refreshWarning, text].filter(Boolean).join("\n\n"), buttons));
					return;
				}
				const selection = resolveModelSelection({
					callback: modelCallback,
					providers,
					byProvider
				});
				if (selection.kind !== "resolved" || !byProvider.get(selection.provider)?.has(selection.model)) {
					await showChangedModelPicker();
					return;
				}
				commandText = `/model ${selection.provider}/${selection.model}`;
				try {
					const storePath = telegramDeps.resolveStorePath(runtimeCfg.session?.store, { agentId: sessionState.agentId });
					const resolvedDefault = resolveDefaultModelForAgent({
						cfg: runtimeCfg,
						agentId: sessionState.agentId
					});
					const isDefaultSelection = selection.provider === resolvedDefault.provider && selection.model === resolvedDefault.model;
					const persistedSessionEntry = sessionState.sessionEntry;
					const sessionEntryMissing = persistedSessionEntry === void 0;
					const sessionEntry = persistedSessionEntry ?? {
						sessionId: randomUUID(),
						updatedAt: Date.now()
					};
					const previousAuthProfileId = sessionEntry.authProfileOverride?.trim();
					const sessionStore = { [sessionState.sessionKey]: sessionEntry };
					const currentModelRef = sessionState.model?.trim();
					const currentModelSeparator = currentModelRef?.indexOf("/") ?? -1;
					const currentSelection = currentModelRef && currentModelSeparator > 0 ? {
						provider: currentModelRef.slice(0, currentModelSeparator),
						model: currentModelRef.slice(currentModelSeparator + 1)
					} : resolvedDefault;
					const applied = await retryModelAction(() => applySessionModelSelection({
						cfg: runtimeCfg,
						agentId: sessionState.agentId,
						sessionKey: sessionState.sessionKey,
						storePath,
						sessionEntry,
						sessionStore,
						allowCreate: sessionEntryMissing,
						defaultProvider: resolvedDefault.provider,
						defaultModel: resolvedDefault.model,
						currentProvider: currentSelection.provider,
						currentModel: currentSelection.model,
						modelCatalog: modelData.modelCatalog,
						canPersistStickyModelSelection: false,
						request: {
							provider: selection.provider,
							model: selection.model,
							isDefault: isDefaultSelection,
							runtime: isDefaultSelection ? { kind: "clear" } : { kind: "unchanged" }
						},
						markLiveSwitchPending: true
					}));
					if (applied.status !== "applied") {
						await showModelReply(`❌ ${applied.message}`, []);
						return;
					}
					const defaultAuthProfileNotice = isDefaultSelection && previousAuthProfileId ? sessionStore[sessionState.sessionKey]?.authProfileOverride?.trim() === previousAuthProfileId ? "Compatible auth profile retained." : "Incompatible auth profile cleared." : void 0;
					const actionText = isDefaultSelection ? "reset to default" : `changed to <b>${escapeTelegramHtml(selection.provider)}/${escapeTelegramHtml(selection.model)}</b>`;
					const runtimeText = `Runtime set to <b>${escapeTelegramHtml(applied.agentRuntime)}</b>${isDefaultSelection ? " from configured policy" : ""}.`;
					await showModelReply(`✅ Model ${actionText}\n\n${isDefaultSelection ? `Session model selection cleared.${defaultAuthProfileNotice ? ` ${defaultAuthProfileNotice}` : ""} ${runtimeText} New replies use the agent's configured default.` : `Session-only model selection. ${runtimeText} The agent default in openclaw.json is unchanged. This chat keeps the model selection across /new and /reset; use /model default -s to clear the session model selection.`}`, [], { parse_mode: "HTML" });
				} catch (err) {
					if (err instanceof TelegramRetryableCallbackError) throw err;
					await showModelReply(`❌ Failed to change model: ${String(err)}`, []);
				}
				return;
			}
			if (hasReservedModelPrefix) {
				await terminalizeUnavailableCallback();
				return;
			}
			if ((callbackMessage.reply_markup?.inline_keyboard?.length ?? 0) > 0) await clearRoutedCallbackButtons();
			const syntheticMessage = buildSyntheticTextMessage({
				base: withResolvedTelegramForumFlag(callbackMessage, isForum),
				from: callback.from,
				text: callbackCommandText,
				date: resolveTelegramUpdateReceivedAtSeconds(ctx.update)
			});
			const syntheticCtx = buildSyntheticContext(ctx, syntheticMessage);
			await processMessageWithReplyChain({
				ctx: syntheticCtx,
				msg: syntheticMessage,
				allMedia: [],
				storeAllowFrom,
				options: {
					threadSpec,
					...nativeCallbackCommand ? { commandSource: "native" } : {},
					forceWasMentioned: true,
					messageIdOverride: callback.id
				}
			});
		} catch (err) {
			if (err instanceof TelegramRetryableCallbackError) {
				if (isPermanentTelegramCallbackEditError(err.cause)) {
					logVerbose(`telegram: swallowing permanent callback edit error: ${String(err.cause)}`);
					return;
				}
				runtime.error?.(danger(`callback handler failed: ${String(err)}`));
				throw err.cause;
			}
			runtime.error?.(danger(`callback handler failed: ${String(err)}`));
			if (isTelegramSpooledReplayUpdate(ctx.update)) recordTelegramMessageProcessingResult({
				kind: "failed-retryable",
				error: err
			});
		}
	};
	return { route: handleCallback };
}
//#endregion
//#region extensions/telegram/src/group-migration.ts
function resolveAccountGroups(cfg, accountId) {
	if (!accountId) return;
	const normalized = normalizeAccountId(accountId);
	const accounts = cfg.channels?.telegram?.accounts;
	if (!accounts || typeof accounts !== "object") return;
	const exact = accounts[normalized];
	if (exact?.groups) return exact.groups;
	const matchKey = Object.keys(accounts).find((key) => normalizeLowercaseStringOrEmpty(key) === normalizeLowercaseStringOrEmpty(normalized));
	return matchKey ? accounts[matchKey]?.groups : void 0;
}
function migrateTelegramGroupConfig(params) {
	const scopes = [];
	let skippedExisting = false;
	const migrationTargets = [{
		scope: "account",
		groups: resolveAccountGroups(params.cfg, params.accountId)
	}, {
		scope: "global",
		groups: params.cfg.channels?.telegram?.groups
	}];
	const { oldChatId, newChatId } = params;
	for (const { scope, groups } of migrationTargets) {
		if (!groups || oldChatId === newChatId || !Object.hasOwn(groups, oldChatId)) continue;
		if (Object.hasOwn(groups, newChatId)) {
			skippedExisting = true;
			continue;
		}
		groups[newChatId] = expectDefined(groups[oldChatId], "owned Telegram group config key");
		delete groups[oldChatId];
		scopes.push(scope);
	}
	return {
		migrated: scopes.length > 0,
		skippedExisting,
		scopes
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.event-bindings.ts
/** Stable operator-facing reason for a scoped reaction dropped without a known topic. */
const TELEGRAM_REACTION_THREAD_UNRESOLVED_REASON = "thread-context-unavailable";
function isCurrentTelegramChatMember(member) {
	return member.status === "creator" || member.status === "administrator" || member.status === "member" || member.status === "restricted" && member.is_member;
}
function createTelegramEventBindings({ params, message, authorization }) {
	const { accountId, ownerAgentId, bot, cfg, opts, runtime, shouldSkipUpdate, telegramDeps } = params;
	const { authorizeTelegramEventSender, resolveTelegramEventAuthorizationContext } = authorization;
	const { processMessageWithReplyChain, resolveCachedMessageThreadSpec } = message;
	const resolveAuthorizedEventContext = async (eventParams) => {
		const context = await resolveTelegramEventAuthorizationContext(eventParams);
		if (!await authorizeTelegramEventSender({
			...eventParams,
			mode: "reaction",
			context
		})) return;
		const { groupConfig } = context;
		const requireTopic = groupConfig && "requireTopic" in groupConfig && groupConfig.requireTopic;
		if (!eventParams.isGroup && requireTopic === true && context.dmThreadId == null) {
			logVerbose(`Blocked telegram ${eventParams.event} in DM ${eventParams.chatId}: requireTopic=true but topic unknown`);
			return;
		}
		return context;
	};
	const registerChatMembership = () => {
		bot.on("my_chat_member", async (ctx) => {
			const membership = ctx.myChatMember;
			if (!membership || shouldSkipUpdate(ctx)) return;
			const botUserId = ctx.me?.id ?? opts.botInfo?.id;
			if (!(membership.chat.type === "group" || membership.chat.type === "supergroup") || botUserId === void 0 || membership.new_chat_member.user.id !== botUserId || isCurrentTelegramChatMember(membership.old_chat_member) || !isCurrentTelegramChatMember(membership.new_chat_member)) return;
			const chatId = membership.chat.id;
			const currentCfg = telegramDeps.getRuntimeConfig();
			const telegramCfg = resolveTelegramAccount({
				cfg: currentCfg,
				accountId
			}).config;
			const { groupConfig } = params.resolveTelegramGroupConfig(chatId, void 0, currentCfg);
			const groupPolicyAccess = evaluateTelegramGroupPolicyAccess({
				isGroup: true,
				chatId,
				cfg: currentCfg,
				telegramCfg,
				groupConfig,
				effectiveGroupAllow: normalizeAllowFrom(),
				resolveGroupPolicy: params.resolveGroupPolicy,
				enforceAllowlistAuthorization: false,
				allowEmptyAllowlistEntries: false
			});
			const roomAllowed = groupConfig?.enabled !== false && groupPolicyAccess.allowed;
			const inviter = membership.from;
			const inviterLabel = [inviter.first_name, inviter.last_name].filter(Boolean).join(" ") || inviter.username;
			const participant = createTelegramSpooledReplayDeferredParticipant(`room-join:${chatId}`);
			const hold = participant?.beginSettlementHold();
			if (participant && !hold) return;
			try {
				await reportChannelRoomJoin({
					cfg: currentCfg,
					channel: "telegram",
					accountId,
					conversationId: String(chatId),
					deliverTo: String(chatId),
					route: (await resolveTelegramConversationRoute({
						cfg: currentCfg,
						accountId,
						chatId,
						isGroup: true,
						threadSpec: resolveTelegramThreadSpec({ isGroup: true })
					})).route,
					inviterLabel,
					roomAllowed,
					resolveRoomContext: async () => {
						const chat = await bot.api.getChat(chatId);
						return {
							title: chat.title,
							purpose: chat.description,
							pinned: chat.pinned_message?.text ?? chat.pinned_message?.caption,
							historyUnavailable: true
						};
					}
				});
				hold?.release("discard-pending");
				participant?.settle({ kind: "completed" });
			} catch (error) {
				hold?.release("replay-pending");
				participant?.settle({
					kind: "failed-retryable",
					error
				});
				throw error;
			}
		});
	};
	const registerReaction = () => {
		bot.on("message_reaction", async (ctx) => {
			try {
				const reaction = ctx.messageReaction;
				if (!reaction || shouldSkipUpdate(ctx)) return;
				const chatId = reaction.chat.id;
				const messageId = reaction.message_id;
				const user = reaction.user;
				const senderId = user?.id != null ? String(user.id) : "";
				const isGroup = reaction.chat.type === "group" || reaction.chat.type === "supergroup";
				const isDirectMessagesChat = reaction.chat.is_direct_messages === true;
				const isForum = isGroup && !isDirectMessagesChat && reaction.chat.is_forum === true;
				const authorizationCfg = telegramDeps.getRuntimeConfig();
				const reactionMode = resolveTelegramAccount({
					cfg: authorizationCfg,
					accountId
				}).config.reactionNotifications ?? "own";
				if (reactionMode === "off" || user?.is_bot) return;
				if (reactionMode === "own" && !await telegramDeps.wasSentByBot(chatId, messageId, authorizationCfg, {
					accountId,
					agentId: ownerAgentId
				})) {
					logVerbose(`telegram: skipped reaction on msg ${messageId} in chat ${chatId} (own mode, not sent by bot)`);
					return;
				}
				const oldEmojis = new Set(reaction.old_reaction.filter((item) => item.type === "emoji").map((item) => item.emoji));
				const addedReactions = reaction.new_reaction.filter((item) => item.type === "emoji").filter((item) => !oldEmojis.has(item.emoji));
				if (addedReactions.length === 0) return;
				const requiredScope = isDirectMessagesChat ? "direct-messages" : isForum ? "forum" : void 0;
				const cached = requiredScope || reaction.chat.type === "private" ? await resolveCachedMessageThreadSpec({
					chatId,
					messageId
				}) : void 0;
				const recoveredThreadSpec = cached?.threadSpec.scope === (requiredScope ?? "dm") && typeof cached.threadSpec.id === "number" && Number.isInteger(cached.threadSpec.id) && cached.threadSpec.id > 0 ? cached.threadSpec : void 0;
				if (requiredScope && !recoveredThreadSpec) {
					runtime.log?.(warn(`telegram: skipped scoped reaction account=${accountId} chat=${chatId} message=${messageId} reason=${TELEGRAM_REACTION_THREAD_UNRESOLVED_REASON}`));
					return;
				}
				const eventAuthContext = await resolveAuthorizedEventContext({
					cfg: authorizationCfg,
					chatId,
					chatTitle: reaction.chat.title,
					isGroup,
					senderId,
					event: "reaction",
					threadSpec: recoveredThreadSpec ?? resolveTelegramThreadSpec({
						isGroup,
						isForum
					})
				});
				if (!eventAuthContext) return;
				let { route } = await resolveTelegramConversationRoute({
					cfg: eventAuthContext.cfg,
					accountId,
					chatId,
					isGroup,
					threadSpec: recoveredThreadSpec ?? eventAuthContext.threadSpec,
					senderId,
					topicAgentId: eventAuthContext.topicConfig?.agentId
				});
				if (recoveredThreadSpec?.scope === "dm") route = applyTelegramTargetSession({
					cfg: eventAuthContext.cfg,
					route,
					chatId,
					isGroup,
					senderId,
					dmThreadId: recoveredThreadSpec.id,
					botHasTopicsEnabled: cached?.isTopicMessage === true || resolveTelegramBotHasTopicsEnabled(ctx.me)
				});
				const senderName = user ? [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username : void 0;
				const senderUsernameLabel = user?.username ? `@${user.username}` : void 0;
				const senderLabel = (senderName && senderUsernameLabel ? `${senderName} (${senderUsernameLabel})` : senderName || senderUsernameLabel) || (user?.id ? `id:${user.id}` : "unknown");
				for (const addedReaction of addedReactions) {
					const emoji = addedReaction.emoji;
					const text = `Telegram reaction added: ${emoji} by ${senderLabel} on msg ${messageId}`;
					telegramDeps.enqueueRoutedSystemEvent(text, route, { contextKey: `telegram:reaction:add:${chatId}:${messageId}:${user?.id ?? "anon"}:${emoji}` });
					logVerbose(`telegram: reaction event enqueued: ${text}`);
				}
			} catch (err) {
				runtime.error?.(danger(`telegram reaction handler failed: ${String(err)}`));
				throw err;
			}
		});
	};
	const handlePollError = (err, ctx, kind) => {
		runtime.error?.(danger(`telegram ${kind} handler failed: ${String(err)}`));
		if (isTelegramSpooledReplayUpdate(ctx.update)) recordTelegramMessageProcessingResult({
			kind: "failed-retryable",
			error: err
		});
		else throw err;
	};
	const registerPolls = () => {
		bot.on("poll", async (ctx) => {
			try {
				const poll = ctx.poll;
				if (!poll?.is_closed || shouldSkipUpdate(ctx)) return;
				await retireTelegramPollRegistryEntry({
					accountId,
					pollId: poll.id
				});
			} catch (err) {
				handlePollError(err, ctx, "poll");
			}
		});
		bot.on("poll_answer", async (ctx) => {
			try {
				const pollAnswer = ctx.pollAnswer;
				if (!pollAnswer || shouldSkipUpdate(ctx)) return;
				const optionIds = pollAnswer.option_ids ?? [];
				const user = pollAnswer.user;
				if (optionIds.length === 0 || !user || user.is_bot) return;
				const pollId = pollAnswer.poll_id;
				const prepared = getPreparedTelegramPollAnswer(ctx.update);
				const entry = prepared ? prepared.entry : await findTelegramPollRegistryEntry({
					pollId,
					accountId
				});
				if (!entry) {
					logVerbose(`telegram: poll_answer for poll ${pollId} has no registry entry; skipping`);
					return;
				}
				const chatId = entry.chat.id;
				const isGroup = entry.chat.type === "group" || entry.chat.type === "supergroup";
				const senderId = String(user.id);
				if (!isGroup && user.id !== chatId) {
					logVerbose(`Blocked forwarded telegram poll_answer for DM ${chatId} from ${senderId}`);
					return;
				}
				if (isGroup && !isCurrentTelegramChatMember(await bot.api.getChatMember(chatId, user.id))) {
					logVerbose(`Blocked forwarded telegram poll_answer for group ${chatId} from non-member ${senderId}`);
					return;
				}
				const authorizationCfg = telegramDeps.getRuntimeConfig();
				const eventAuthContext = await resolveAuthorizedEventContext({
					cfg: authorizationCfg,
					chatId,
					chatTitle: "title" in entry.chat ? entry.chat.title : void 0,
					isGroup,
					senderId,
					threadSpec: entry.threadSpec,
					event: "poll_answer"
				});
				if (!eventAuthContext) return;
				const optionLabels = optionIds.map((index) => entry.options[index] ?? `option ${index}`);
				const text = `Poll response to "${entry.question}": ${optionLabels.join(", ")}`;
				const messageThreadId = "id" in entry.threadSpec ? entry.threadSpec.id : void 0;
				const syntheticMessage = buildSyntheticTextMessage({
					base: {
						message_id: entry.messageId,
						date: Math.floor(Date.now() / 1e3),
						chat: entry.chat,
						...messageThreadId == null ? {} : {
							message_thread_id: messageThreadId,
							is_topic_message: true
						}
					},
					from: user,
					text
				});
				const result = await processMessageWithReplyChain({
					ctx: buildSyntheticContext(ctx, syntheticMessage),
					msg: syntheticMessage,
					allMedia: [],
					storeAllowFrom: eventAuthContext.storeAllowFrom,
					options: {
						forceWasMentioned: true,
						messageIdOverride: typeof ctx.update.update_id === "number" ? String(ctx.update.update_id) : `poll:${pollId}:${user.id}:${optionIds.join("-")}`
					}
				});
				recordTelegramMessageProcessingResult(result);
				logVerbose(`telegram: poll_answer dispatched for poll ${pollId} by ${senderId}`);
			} catch (err) {
				handlePollError(err, ctx, "poll_answer");
			}
		});
	};
	const registerMigration = () => {
		bot.on("message:migrate_to_chat_id", async (ctx) => {
			try {
				const msg = ctx.message;
				if (!msg?.migrate_to_chat_id || shouldSkipUpdate(ctx)) return;
				const oldChatId = String(msg.chat.id);
				const newChatId = String(msg.migrate_to_chat_id);
				const chatTitle = msg.chat.title ?? "Unknown";
				runtime.log?.(warn(`[telegram] Group migrated: "${chatTitle}" ${oldChatId} → ${newChatId}`));
				if (!resolveChannelConfigWrites({
					cfg,
					channelId: "telegram",
					accountId
				})) {
					runtime.log?.(warn("[telegram] Config writes disabled; skipping group config migration."));
					return;
				}
				const migration = migrateTelegramGroupConfig({
					cfg: telegramDeps.getRuntimeConfig(),
					accountId,
					oldChatId,
					newChatId
				});
				if (migration.migrated) {
					runtime.log?.(warn(`[telegram] Migrating group config from ${oldChatId} to ${newChatId}`));
					migrateTelegramGroupConfig({
						cfg,
						accountId,
						oldChatId,
						newChatId
					});
					await mutateConfigFile({
						afterWrite: { mode: "auto" },
						mutate: (draft) => {
							migrateTelegramGroupConfig({
								cfg: draft,
								accountId,
								oldChatId,
								newChatId
							});
						}
					});
					runtime.log?.(warn("[telegram] Group config migrated and saved successfully"));
				} else if (migration.skippedExisting) runtime.log?.(warn(`[telegram] Group config already exists for ${newChatId}; leaving ${oldChatId} unchanged`));
				else runtime.log?.(warn(`[telegram] No config found for old group ID ${oldChatId}, migration logged only`));
			} catch (err) {
				runtime.error?.(danger(`[telegram] Group migration handler failed: ${String(err)}`));
				throw err;
			}
		});
	};
	return {
		registerChatMembership,
		registerReaction,
		registerPolls,
		registerMigration
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-authorization.ts
function createTelegramHandlerAuthorization({ accountId, nativeCommandNames, bot, opts, logger, telegramDeps, resolveGroupPolicy, resolveTelegramGroupConfig }) {
	const shouldSkipGroupMessage = (params, context) => shouldSkipTelegramGroupMessage(params, context, {
		logger,
		resolveGroupPolicy
	});
	const TELEGRAM_EVENT_AUTH_RULES = {
		reaction: {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "reaction unauthorized by dm policy/allowlist",
			deniedGroupReason: "reaction unauthorized by group allowlist"
		},
		"callback-scope": {
			enforceDirectAuthorization: false,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "callback unauthorized by inlineButtonsScope",
			deniedGroupReason: "callback unauthorized by inlineButtonsScope"
		},
		"callback-allowlist": {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: false,
			deniedDmReason: "callback unauthorized by inlineButtonsScope allowlist",
			deniedGroupReason: "callback unauthorized by inlineButtonsScope allowlist"
		},
		"callback-runtime-allowlist": {
			enforceDirectAuthorization: true,
			enforceGroupAllowlistAuthorization: true,
			deniedDmReason: "runtime callback unauthorized by allowlist",
			deniedGroupReason: "runtime callback unauthorized by group allowlist"
		}
	};
	const resolveTelegramEventAuthorizationContext = async (params) => {
		const authorizationCfg = params.cfg;
		const authorizationTelegramCfg = resolveTelegramAccount({
			cfg: authorizationCfg,
			accountId
		}).config;
		const authorizationSettings = resolveTelegramMessageTurnSettings({
			accountId,
			cfg: authorizationCfg,
			telegramCfg: authorizationTelegramCfg,
			opts
		});
		const commandAuthorizedByConfig = params.msg ? await resolveTelegramNativeCommandAdmission({
			msg: params.msg,
			nativeCommandNames,
			botUsername: bot.botInfo?.username ?? opts.botInfo?.username,
			cfg: authorizationCfg,
			accountId,
			dmPolicy: authorizationSettings.dmPolicy,
			isGroup: params.isGroup,
			chatId: params.chatId,
			senderId: params.senderId ?? ""
		}) : false;
		const groupAllowContext = await resolveTelegramGroupAllowFromContext({
			cfg: authorizationCfg,
			chatId: params.chatId,
			accountId,
			dmPolicy: authorizationSettings.dmPolicy,
			allowFrom: authorizationSettings.allowFrom,
			senderId: params.senderId,
			isGroup: params.isGroup,
			threadSpec: params.threadSpec,
			groupAllowFrom: authorizationSettings.groupAllowFrom,
			skipPairingStoreRead: commandAuthorizedByConfig,
			readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
			resolveTelegramGroupConfig
		});
		const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
			isGroup: params.isGroup,
			groupConfig: groupAllowContext.groupConfig,
			dmPolicy: authorizationSettings.dmPolicy
		});
		return {
			cfg: authorizationCfg,
			commandAuthorizedByConfig,
			allowFrom: authorizationSettings.allowFrom,
			telegramCfg: authorizationTelegramCfg,
			dmPolicy: effectiveDmPolicy,
			...groupAllowContext
		};
	};
	const resolveEventDmAllow = async (context, senderId, storeAllowFrom = context.storeAllowFrom) => (await resolveTelegramDmAllow({
		cfg: context.cfg,
		allowFrom: context.groupAllowOverride ?? context.allowFrom,
		accountId,
		senderId,
		storeAllowFrom,
		dmPolicy: context.dmPolicy
	})).effectiveAllow;
	const authorizeTelegramEventSender = async (params) => {
		const { chatId, chatTitle, isGroup, senderId, mode, context } = params;
		const { dmPolicy, resolvedThreadId, effectiveGroupAllow } = context;
		const { enforceDirectAuthorization, enforceGroupAllowlistAuthorization, deniedDmReason, deniedGroupReason } = TELEGRAM_EVENT_AUTH_RULES[mode];
		if (shouldSkipGroupMessage({
			isGroup,
			chatId,
			chatTitle,
			senderId
		}, context)) return false;
		if (isGroup ? enforceGroupAllowlistAuthorization : enforceDirectAuthorization) {
			const effectiveDmAllow = isGroup ? normalizeDmAllowFromWithStore({
				allowFrom: [],
				dmPolicy
			}) : await resolveEventDmAllow(context, senderId);
			const eventAccess = await resolveTelegramEventIngressAuthorization({
				accountId,
				dmPolicy,
				isGroup,
				chatId,
				resolvedThreadId,
				senderId,
				effectiveDmAllow,
				effectiveGroupAllow,
				enforceGroupAuthorization: isGroup,
				eventKind: mode === "reaction" ? "reaction" : "button"
			});
			if (eventAccess.decision !== "allow") {
				const subject = isGroup ? "group sender" : eventAccess.reasonCode === "dm_policy_disabled" ? "direct event from" : "direct sender";
				logVerbose(`Blocked telegram ${subject} ${senderId || "unknown"} (${isGroup ? deniedGroupReason : deniedDmReason})`);
				return false;
			}
		}
		return true;
	};
	const isTelegramModelCallbackAuthorized = async (params) => {
		const { chatId, isGroup, senderId, context } = params;
		const cfgLocal = context.cfg;
		const dmAllow = await resolveEventDmAllow(context, senderId, isGroup ? [] : context.storeAllowFrom);
		return (await resolveTelegramCommandIngressAuthorization({
			accountId,
			cfg: cfgLocal,
			dmPolicy: context.dmPolicy,
			isGroup,
			chatId,
			resolvedThreadId: context.resolvedThreadId,
			senderId,
			effectiveDmAllow: dmAllow,
			effectiveGroupAllow: context.effectiveGroupAllow,
			eventKind: "button"
		})).authorized;
	};
	const authorizeInboundMessage = async (params) => {
		const authorizationCfg = telegramDeps.getRuntimeConfig();
		const context = await resolveTelegramEventAuthorizationContext({
			cfg: authorizationCfg,
			msg: params.msg,
			chatId: params.chatId,
			isGroup: params.isGroup,
			senderId: params.senderId,
			threadSpec: resolveTelegramMessageThreadSpec(params.msg, params.isForum)
		});
		const { dmPolicy, resolvedThreadId, dmThreadId, groupConfig, topicConfig, effectiveGroupAllow, telegramCfg: authorizationTelegramCfg } = context;
		const effectiveDmAllow = await resolveEventDmAllow(context, params.senderId);
		if (params.requireConfiguredGroup && (!groupConfig || groupConfig.enabled === false)) {
			logVerbose(`Blocked telegram channel ${params.chatId} (channel disabled)`);
			return { allowed: false };
		}
		if (shouldSkipGroupMessage({
			isGroup: params.isGroup,
			chatId: params.chatId,
			chatTitle: params.msg.chat.title,
			senderId: params.senderId,
			commandAuthorized: context.commandAuthorizedByConfig
		}, context)) return { allowed: false };
		if (!params.isGroup) {
			if ((groupConfig && "requireTopic" in groupConfig ? groupConfig.requireTopic : void 0) === true && dmThreadId == null) {
				logVerbose(`Blocked telegram DM ${params.chatId}: requireTopic=true but no topic present`);
				return { allowed: false };
			}
			if (!(context.commandAuthorizedByConfig || (params.dmAccess === "challenge" ? await enforceTelegramDmAccess({
				isGroup: params.isGroup,
				dmPolicy,
				msg: params.msg,
				chatId: params.chatId,
				effectiveDmAllow,
				accountId,
				bot,
				logger,
				upsertPairingRequest: telegramDeps.upsertChannelPairingRequest
			}) : await isTelegramDmAccessAllowed({
				dmPolicy,
				msg: params.msg,
				chatId: params.chatId,
				effectiveDmAllow,
				accountId
			})))) return { allowed: false };
		}
		const ingressResolver = createTelegramIngressResolver({
			accountId,
			cfg: authorizationCfg
		});
		const groupPolicy = resolveTelegramEffectiveGroupPolicy({
			cfg: authorizationCfg,
			telegramCfg: authorizationTelegramCfg,
			groupConfig: params.isGroup ? groupConfig : void 0,
			topicConfig
		});
		let admittedIngress;
		const resolveChannelIngress = (contextBinding) => admittedIngress ??= ingressResolver.message({
			...context.commandAuthorizedByConfig ? {
				event: {
					kind: "native-command",
					authMode: "command",
					mayPair: false
				},
				command: { commandOwnerAllowFrom: [params.senderId] }
			} : {},
			subject: { stableId: params.senderId },
			conversation: {
				kind: params.isGroup ? "group" : "direct",
				id: String(params.chatId),
				...params.isGroup && resolvedThreadId != null ? { parentId: String(params.chatId) } : {},
				...resolvedThreadId != null ? { threadId: String(resolvedThreadId) } : {}
			},
			contextBinding,
			dmPolicy,
			groupPolicy,
			allowFrom: telegramAllowEntries(effectiveDmAllow),
			groupAllowFrom: telegramAllowEntries(effectiveGroupAllow)
		});
		return {
			allowed: true,
			context,
			effectiveDmAllow,
			resolveChannelIngress
		};
	};
	return {
		resolveTelegramEventAuthorizationContext,
		authorizeTelegramEventSender,
		isTelegramModelCallbackAuthorized,
		authorizeInboundMessage
	};
}
function shouldSkipTelegramGroupMessage(params, context, runtime) {
	const { resolvedThreadId, effectiveGroupAllow, hasGroupAllowOverride, groupConfig, topicConfig, cfg, telegramCfg } = context;
	const { isGroup, chatId, chatTitle, senderId } = params;
	const baseAccess = evaluateTelegramGroupBaseAccess({
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		enforceAllowOverride: true,
		requireSenderForAllowOverride: true
	});
	if (!baseAccess.allowed) {
		logVerbose({
			"group-disabled": `Blocked telegram group ${chatId} (group disabled)`,
			"topic-disabled": `Blocked telegram topic ${chatId} (${resolvedThreadId ?? "unknown"}) (topic disabled)`,
			"group-override-unauthorized": `Blocked telegram group sender ${senderId || "unknown"} (group allowFrom override)`
		}[baseAccess.reason]);
		return true;
	}
	if (!isGroup) return false;
	const policyAccess = evaluateTelegramGroupPolicyAccess({
		isGroup,
		chatId,
		cfg,
		telegramCfg,
		topicConfig,
		groupConfig,
		effectiveGroupAllow,
		senderId,
		resolveGroupPolicy: runtime.resolveGroupPolicy,
		enforceAllowlistAuthorization: !params.commandAuthorized,
		allowEmptyAllowlistEntries: false
	});
	if (policyAccess.allowed) return false;
	const reasonMessage = {
		"group-policy-disabled": "Blocked telegram group message (groupPolicy: disabled)",
		"group-policy-allowlist-no-sender": "Blocked telegram group message (no sender ID, groupPolicy: allowlist)",
		"group-policy-allowlist-empty": "Blocked telegram group message (groupPolicy: allowlist, no group allowlist entries)",
		"group-policy-allowlist-unauthorized": `Blocked telegram group message from ${senderId} (groupPolicy: allowlist)`,
		"group-chat-not-allowed": void 0
	}[policyAccess.reason];
	if (reasonMessage) logVerbose(reasonMessage);
	else runtime.logger.info({
		chatId,
		title: chatTitle,
		reason: "not-allowed"
	}, "skipping group message");
	return true;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.debounce-key.ts
function buildTelegramInboundDebounceKey(params) {
	return `telegram:${params.accountId?.trim() || "default"}:${params.conversationKey}:${params.senderId}`;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-buffer.ts
const FORWARD_BURST_QUIET_MS = 1e3;
const spooledReplayParticipants = (entries) => entries.flatMap((entry) => entry.spooledReplayParticipant ? [entry.spooledReplayParticipant] : []);
function createTelegramInboundBuffers({ params: { cfg, accountId, bot, runtime, opts }, message }) {
	const { mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, settleSpooledReplayParticipants, processMessageWithReplyChain } = message;
	const readConfig = createRuntimeConfigReader(cfg);
	const resolveDebounceMs = () => {
		const current = readConfig();
		const inbound = current.messages?.inbound;
		return inbound?.byChannel?.telegram === void 0 && inbound?.debounceMs === void 0 ? 300 : resolveInboundDebounceMs({
			cfg: current,
			channel: "telegram"
		});
	};
	const fragmentGapMs = typeof opts.testTimings?.textFragmentGapMs === "number" && Number.isFinite(opts.testTimings.textFragmentGapMs) ? Math.max(10, Math.floor(opts.testTimings.textFragmentGapMs)) : 1500;
	const isNearLimit = (entry) => (entry.msg.text?.length ?? 0) >= 4e3;
	const resolveTelegramDebounceEntryMs = (entry, pending) => {
		if (entry.debounceLane === "forward") return FORWARD_BURST_QUIET_MS;
		const debounceMs = resolveDebounceMs();
		return isNearLimit(entry) || debounceMs === 0 && pending?.some(isNearLimit) ? Math.max(debounceMs, fragmentGapMs) : debounceMs;
	};
	const shouldDebounceTelegramEntry = (entry) => {
		const textParts = getTelegramTextParts(entry.msg);
		if (textParts.entities.some((entity) => entity.type === "bot_command" && entity.offset === 0)) return false;
		const hasDebounceableText = shouldDebounceTextInbound({
			text: textParts.text,
			cfg: readConfig(),
			commandOptions: { botUsername: entry.botUsername }
		});
		if (entry.debounceLane === "forward") return hasDebounceableText || resolveTelegramPrimaryMedia(entry.msg) !== void 0;
		return typeof entry.msg.text === "string" && hasDebounceableText && entry.allMedia.length === 0;
	};
	const resolveTelegramDebounceLane = (msg) => msg.forward_origin ? "forward" : "default";
	const hydrateBufferedMedia = async (entries, participants) => {
		const abortSignals = participants.map((participant) => participant.abortSignal);
		const hydrated = [];
		for (const entry of entries) {
			const media = await entry.hydrateMedia?.(abortSignals);
			if (media?.kind === "retry") {
				releaseDispatchDedupeClaims(mergeDispatchDedupeClaims(...entries.map((item) => item.dispatchDedupeClaims)), media.error);
				throw media.error;
			}
			hydrated.push(media ? {
				...entry,
				allMedia: media.allMedia
			} : entry);
		}
		return hydrated;
	};
	const inboundDebouncer = createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		maxWaitMs: (entry) => entry.debounceLane === "forward" ? void 0 : fragmentGapMs * 5,
		serializeImmediate: true,
		resolveDebounceMs: resolveTelegramDebounceEntryMs,
		buildKey: (entry) => entry.debounceKey,
		shouldDebounce: shouldDebounceTelegramEntry,
		shouldHoldFlush: async (entries) => {
			const first = entries[0];
			if (first?.debounceLane !== "forward") return false;
			return (await (entries.findLast((entry) => entry.spooledReplayParticipant)?.spooledReplayParticipant)?.readLaneBacklogUpdates() ?? []).some((update) => {
				const msg = isRecord(update) ? update.message ?? update.channel_post : void 0;
				return isRecord(msg) && msg.forward_origin != null && isRecord(msg.chat) && msg.chat.id === first.msg.chat.id && isRecord(msg.from) && msg.from.id === first.msg.from?.id;
			});
		},
		canAppend: (entry, pending) => entry.debounceLane === pending[0]?.debounceLane && (entry.debounceLane === "forward" || pending.length < 12 && pending.reduce((total, item) => total + getTelegramTextParts(item.msg).text.length, 0) + getTelegramTextParts(entry.msg).text.length <= 5e4),
		onFlush: (bufferedEntries, createFlush) => createFlush({ dispatch: async (lifecycle) => {
			const participants = spooledReplayParticipants(bufferedEntries);
			try {
				const entries = await hydrateBufferedMedia(bufferedEntries, participants);
				const first = entries[0];
				const last = entries.at(-1);
				if (!first || !last) return;
				const batched = entries.length > 1;
				const messages = entries.map((entry) => entry.msg);
				const textParts = batched ? joinTelegramTextParts(messages, last.debounceLane === "forward" ? "\n" : (previous) => (previous.text?.length ?? 0) >= 4e3 ? "" : "\n") : void 0;
				const allMedia = batched ? entries.flatMap((entry) => entry.allMedia) : first.allMedia;
				const dispatchDedupeClaims = batched ? mergeDispatchDedupeClaims(...entries.map((entry) => entry.dispatchDedupeClaims)) : first.dispatchDedupeClaims;
				if (textParts && !textParts.text.trim() && allMedia.length === 0) {
					releaseDispatchDedupeClaims(dispatchDedupeClaims);
					settleSpooledReplayParticipants(participants, { kind: "skipped" });
					return;
				}
				const msg = textParts ? {
					...buildSyntheticTextMessage({
						base: first.msg,
						text: textParts.text,
						entities: textParts.entities,
						date: last.msg.date ?? first.msg.date
					}),
					forward_origin: void 0
				} : first.msg;
				const result = await processMessageWithReplyChain({
					ctx: batched ? buildSyntheticContext(first.ctx, msg) : first.ctx,
					msg,
					allMedia,
					storeAllowFrom: first.storeAllowFrom,
					options: {
						...batched ? {
							...last.msg.message_id ? { messageIdOverride: String(last.msg.message_id) } : {},
							ambientTranscriptBody: formatTelegramAmbientTranscriptBody(messages),
							bufferedMessages: messages
						} : {},
						receivedAtMs: first.receivedAtMs,
						ingressBuffer: batched && last.debounceLane !== "forward" ? "text-batch" : "inbound-debounce",
						threadSpec: first.threadSpec,
						...promptContextBoundaryOptions(latestPromptContextMinTimestampMs(...entries.map((entry) => entry.promptContextMinTimestampMs)), latestPromptContextAmbientWatermark(...entries.map((entry) => entry.promptContextAmbientWatermark))),
						...participants.length > 0 ? { spooledReplay: true } : {},
						channelIngressResolvers: entries.flatMap((entry) => entry.channelIngressResolvers)
					},
					dispatchDedupeClaims,
					spooledReplayParticipants: participants,
					onTurnDeferred: () => {
						lifecycle.onDeferred();
					}
				});
				settleSpooledReplayParticipants(participants, result);
			} catch (error) {
				settleSpooledReplayParticipants(participants, {
					kind: "failed-retryable",
					error
				});
				throw error;
			}
		} }),
		onError: (error, items) => {
			const participants = spooledReplayParticipants(items);
			settleSpooledReplayParticipants(participants, {
				kind: "failed-retryable",
				error
			});
			runtime.error?.(danger(`telegram debounce flush failed: ${String(error)}`));
			if (participants.length > 0) return;
			const chatId = items[0]?.msg.chat.id;
			if (chatId != null) {
				const threadParams = buildTelegramThreadParams(items[0]?.threadSpec);
				bot.api.sendMessage(chatId, "Something went wrong while processing your message. Please try again.", threadParams).catch((sendError) => {
					logVerbose(`telegram: error fallback send failed: ${String(sendError)}`);
				});
			}
		},
		onCancel: (items) => {
			releaseDispatchDedupeClaims(mergeDispatchDedupeClaims(...items.map((item) => item.dispatchDedupeClaims)));
			settleSpooledReplayParticipants(spooledReplayParticipants(items), { kind: "skipped" });
		}
	});
	const cancelPending = ({ chatId, threadSpec, senderId }) => {
		if (!senderId) return;
		const conversationKey = buildTelegramGroupPeerId(chatId, threadSpec);
		inboundDebouncer.cancelKey(buildTelegramInboundDebounceKey({
			accountId,
			conversationKey,
			senderId
		}));
	};
	return {
		cancelPending,
		inboundDebouncer,
		resolveTelegramDebounceLane
	};
}
//#endregion
//#region extensions/telegram/src/bot-updates.ts
const MEDIA_GROUP_MAX_HOLD_MS = 2e4;
const RECENT_TELEGRAM_UPDATE_TTL_MS = 3e5;
const RECENT_TELEGRAM_UPDATE_MAX = 2e3;
const resolveTelegramUpdateId = (ctx) => ctx.update?.update_id ?? ctx.update_id;
const buildTelegramUpdateKey = (ctx) => {
	const updateId = resolveTelegramUpdateId(ctx);
	if (typeof updateId === "number") return `update:${updateId}`;
	const callbackId = ctx.callbackQuery?.id;
	if (callbackId) return `callback:${callbackId}`;
	const editedMsg = ctx.editedMessage ?? ctx.editedChannelPost ?? ctx.update?.edited_message ?? ctx.update?.edited_channel_post;
	const editedChatId = editedMsg?.chat?.id;
	const editedMessageId = editedMsg?.message_id;
	if (editedChatId !== void 0 && typeof editedMessageId === "number") return `edited-message:${editedChatId}:${editedMessageId}`;
	const msg = ctx.message ?? ctx.channelPost ?? ctx.update?.message ?? ctx.update?.channel_post ?? ctx.callbackQuery?.message;
	const chatId = msg?.chat?.id;
	const messageId = msg?.message_id;
	if (chatId !== void 0 && typeof messageId === "number") return `message:${chatId}:${messageId}`;
};
const createTelegramUpdateDedupe = () => createDedupeCache({
	ttlMs: RECENT_TELEGRAM_UPDATE_TTL_MS,
	maxSize: RECENT_TELEGRAM_UPDATE_MAX
});
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-media.ts
function createTelegramInboundMedia({ params, message }) {
	const { accountId, ownerAgentId, telegramDeps, bot, opts, runtime, mediaMaxBytes, logger, resolveGroupActivation, resolveGroupRequireMention } = params;
	const { resolveMediaRuntime, recordMessageResolvedMedia, mergeDispatchDedupeClaims, releaseDispatchDedupeClaims, settleSpooledReplayParticipants, resolveTelegramSessionState, processMessageWithReplyChain } = message;
	const timeoutMs = typeof opts.testTimings?.mediaGroupFlushMs === "number" && Number.isFinite(opts.testTimings.mediaGroupFlushMs) ? Math.max(10, Math.floor(opts.testTimings.mediaGroupFlushMs)) : 500;
	const buffer = /* @__PURE__ */ new Map();
	const queue = /* @__PURE__ */ new Map();
	const heads = /* @__PURE__ */ new Map();
	const conversationKeyFor = (input) => `media:${input.chatId}:${input.threadSpec.scope}:${input.threadSpec.id ?? "main"}`;
	const pendingMediaGroups = (input) => queue.get(conversationKeyFor(input));
	const resolveUnaddressedGroupMediaDisposition = async (authorization) => {
		const { ctx, msg, chatId, isGroup, senderId, threadSpec } = authorization;
		const resolvedThreadId = threadSpec.scope === "forum" || threadSpec.scope === "direct-messages" ? threadSpec.id : void 0;
		const textParts = getTelegramTextParts(msg);
		const documentMime = msg.document?.mime_type?.split(";")[0]?.trim().toLowerCase();
		const mayNeedDownload = !textParts.text.trim() && Boolean(msg.audio ?? msg.voice ?? documentMime?.startsWith("audio/"));
		if (!isGroup || !hasInboundMedia(msg) || mayNeedDownload) return "process";
		const sessionState = await resolveTelegramSessionState({
			chatId,
			isGroup,
			threadSpec,
			senderId,
			runtimeCfg: authorization.authorizationCfg
		});
		const activationOverride = await resolveGroupActivation({
			sessionKey: sessionState.sessionKey,
			agentId: sessionState.agentId,
			cfg: authorization.authorizationCfg
		});
		const configuredRequireMention = firstDefined(authorization.topicConfig?.requireMention, activationOverride, authorization.groupConfig?.requireMention, resolveGroupRequireMention(chatId, authorization.authorizationCfg));
		const requireMentionInBotThreads = firstDefined(authorization.topicConfig?.requireMentionInBotThreads, authorization.groupConfig?.requireMentionInBotThreads);
		let creatorUserId;
		if (threadSpec.scope === "forum" && threadSpec.id !== void 0 && requireMentionInBotThreads !== void 0) {
			const topicScope = telegramDeps.resolveStorePath(authorization.authorizationCfg.session?.store, { agentId: ownerAgentId });
			({creatorUserId} = await resolveTelegramForumTopicMetadata({
				msg,
				threadId: threadSpec.id,
				scope: topicScope
			}));
		}
		const replyToBotMessage = ctx.me?.id != null && msg.reply_to_message?.from?.id === ctx.me.id;
		const { requireMention: threadRequireMention, implicitMentionKinds } = resolveBotThreadMentionPolicy({
			isBotOwnedThread: ctx.me?.id !== void 0 && creatorUserId === ctx.me.id,
			requireMentionInBotThreads,
			requireMention: Boolean(configuredRequireMention),
			implicitMentionKinds: implicitMentionKindWhen("reply_to_bot", replyToBotMessage && !isTelegramForumServiceMessage(msg.reply_to_message))
		});
		const requireMention = sessionState.bindingMode.kind === "plugin-owned-runtime" ? false : threadRequireMention;
		const botUsername = ctx.me?.username?.trim().toLowerCase();
		const hasControlCommandInMessage = hasControlCommand(textParts.text, authorization.authorizationCfg, { botUsername });
		if (!requireMention && !hasControlCommandInMessage) return "process";
		const commandGate = await resolveTelegramCommandIngressAuthorization({
			accountId,
			cfg: authorization.authorizationCfg,
			dmPolicy: "pairing",
			isGroup,
			chatId,
			resolvedThreadId,
			senderId,
			effectiveDmAllow: authorization.effectiveDmAllow,
			effectiveGroupAllow: authorization.effectiveGroupAllow,
			eventKind: "message",
			allowTextCommands: true,
			hasControlCommand: hasControlCommandInMessage,
			modeWhenAccessGroupsOff: "allow",
			includeDmAllowForGroupCommands: false
		});
		if (commandGate.shouldBlockControlCommand) {
			logger.info({
				chatId,
				reason: "unauthorized-control-command"
			}, "skipping group command media before download");
			return "skip";
		}
		if (!requireMention) return "process";
		const mentionRegexes = buildMentionRegexes(authorization.authorizationCfg, sessionState.agentId, {
			provider: "telegram",
			conversationId: buildTelegramGroupPeerId(chatId, threadSpec),
			providerPolicy: resolveTelegramAccountConfig(authorization.authorizationCfg, accountId)?.mentionPatterns
		});
		const hasAnyMention = textParts.entities.some((entity) => entity.type === "mention");
		const explicitlyMentioned = botUsername ? hasBotMention(msg, botUsername, ctx.me?.id) : false;
		const wasMentioned = matchesMentionWithExplicit({
			text: textParts.text,
			mentionRegexes,
			explicit: {
				hasAnyMention,
				isExplicitlyMentioned: explicitlyMentioned,
				canResolveExplicit: Boolean(botUsername)
			}
		});
		if (resolveInboundMentionDecision({
			facts: {
				canDetectMention: Boolean(botUsername) || mentionRegexes.length > 0,
				wasMentioned,
				hasAnyMention,
				implicitMentionKinds
			},
			policy: {
				isGroup,
				requireMention: true,
				allowTextCommands: true,
				hasControlCommand: hasControlCommandInMessage,
				commandAuthorized: commandGate.authorized
			}
		}).shouldSkip) {
			if (resolveTelegramGroupIngestEnabled({
				cfg: authorization.authorizationCfg,
				chatId,
				accountId,
				topicConfig: authorization.topicConfig
			})) return "silent-ingest";
			logger.info({
				chatId,
				reason: "no-mention"
			}, "skipping group media before download");
			return "skip";
		}
		return "process";
	};
	const sendMediaWarning = (warning, text) => withTelegramApiErrorLogging({
		operation: "sendMessage",
		runtime,
		fn: () => bot.api.sendMessage(warning.chatId, text, {
			...buildTelegramThreadParams(warning.threadSpec),
			reply_parameters: {
				message_id: warning.msg.message_id,
				allow_sending_without_reply: true
			}
		})
	}).catch(() => {});
	const processMediaGroup = async (entry) => {
		try {
			const finalIngressMessageId = entry.messages.at(-1)?.msg.message_id;
			entry.messages.sort((a, b) => a.msg.message_id - b.msg.message_id);
			let primary = entry.messages.find((item) => item.msg.caption || item.msg.text) ?? entry.messages[0];
			if (!primary) {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			const captionParts = entry.messages.map(({ msg }) => msg).filter((msg) => getTelegramTextParts(msg).text.trim());
			if (captionParts.length > 1) {
				const botUsername = primary.ctx.me?.username;
				const commandCaptionIndex = captionParts.findIndex((msg) => hasControlCommand(getTelegramTextParts(msg).text, entry.authorizationCfg, { botUsername }));
				if (commandCaptionIndex > 0) {
					const [commandCaption] = captionParts.splice(commandCaptionIndex, 1);
					if (commandCaption) captionParts.unshift(commandCaption);
				}
				const { text: caption, entities: captionEntities } = joinTelegramTextParts(captionParts, "\n");
				const combinedMessage = {
					...primary.msg,
					text: void 0,
					entities: void 0,
					caption,
					caption_entities: captionEntities.length ? captionEntities : void 0
				};
				const combinedContext = Object.create(primary.ctx);
				Object.defineProperty(combinedContext, "message", {
					value: combinedMessage,
					enumerable: true
				});
				primary = {
					ctx: combinedContext,
					msg: combinedMessage
				};
			}
			const mediaDisposition = await resolveUnaddressedGroupMediaDisposition({
				...entry,
				...primary
			});
			if (mediaDisposition === "skip") {
				releaseDispatchDedupeClaims(entry.dispatchDedupeClaims);
				settleSpooledReplayParticipants(entry.spooledReplayParticipants, { kind: "skipped" });
				return;
			}
			const allMedia = [];
			const selection = /* @__PURE__ */ new Map();
			const mediaRuntime = resolveMediaRuntime(...entry.spooledReplayParticipants.map((participant) => participant.abortSignal));
			let skippedCount = 0;
			for (const { ctx, msg } of entry.messages) {
				const sourceMessageId = String(msg.message_id);
				const nativeKind = resolveTelegramPrimaryMedia(msg)?.kind ?? "document";
				let media;
				try {
					media = await resolveMedia({
						ctx,
						maxBytes: mediaMaxBytes,
						...mediaRuntime
					});
				} catch (error) {
					if (mediaRuntime.abortSignal?.aborted || isDurablyRetryableInboundMediaError(error) || !isRecoverableMediaGroupError(error)) throw error;
					runtime.log?.(warn(`media group: skipping photo that failed to fetch: ${String(error)}`));
				}
				if (media) {
					await recordMessageResolvedMedia({
						msg,
						media,
						botUserId: ctx.me?.id
					});
					allMedia.push({
						path: media.path,
						contentType: media.contentType,
						...media.fileName ? { fileName: media.fileName } : {},
						kind: media.kind,
						stickerMetadata: media.stickerMetadata,
						sourceMessageId
					});
					selection.set(sourceMessageId, "include");
				} else {
					allMedia.push({
						kind: nativeKind,
						sourceMessageId,
						unavailable: { reason: "download-failed" }
					});
					selection.set(sourceMessageId, "exclude");
					skippedCount++;
				}
			}
			if (skippedCount > 0 && mediaDisposition !== "silent-ingest") {
				const verb = skippedCount === 1 ? "was" : "were";
				await sendMediaWarning({
					...entry,
					...primary,
					chatId: primary.msg.chat.id
				}, `⚠️ Received ${allMedia.length - skippedCount} of ${entry.messages.length} images — ${skippedCount} could not be fetched and ${verb} skipped.`);
			}
			const result = await processMessageWithReplyChain({
				ctx: primary.ctx,
				msg: primary.msg,
				allMedia,
				promptContextMessageSelection: selection,
				storeAllowFrom: entry.storeAllowFrom,
				options: {
					threadSpec: entry.threadSpec,
					...finalIngressMessageId != null ? { messageIdOverride: String(finalIngressMessageId) } : {},
					...promptContextBoundaryOptions(entry.promptContextMinTimestampMs, entry.promptContextAmbientWatermark),
					...entry.spooledReplayParticipants.length > 0 ? { spooledReplay: true } : {},
					channelIngressResolvers: entry.channelIngressResolvers
				},
				dispatchDedupeClaims: entry.dispatchDedupeClaims,
				spooledReplayParticipants: entry.spooledReplayParticipants
			});
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, result);
		} catch (error) {
			releaseDispatchDedupeClaims(entry.dispatchDedupeClaims, error);
			settleSpooledReplayParticipants(entry.spooledReplayParticipants, {
				kind: "failed-retryable",
				error
			});
			runtime.error?.(danger(`media group handler failed: ${String(error)}`));
		}
	};
	const renewWaitingEntry = (key, entry) => {
		if (heads.get(key) === entry) return;
		const participants = entry.spooledReplayParticipants;
		const heartbeat = () => {
			if (heads.get(key)?.spooledReplayParticipants.some((participant) => !participant.isSettled())) for (const participant of participants) participant.heartbeat();
		};
		heartbeat();
		const intervalMs = resolveTelegramSpooledReplayHeartbeatIntervalMs(participants);
		if (entry.heartbeatTimer === void 0 && intervalMs !== void 0 && participants.some((participant) => !participant.isSettled())) {
			entry.heartbeatTimer = setInterval(heartbeat, intervalMs);
			entry.heartbeatTimer.unref();
		}
	};
	const queueEntry = (key, entry) => {
		const participants = entry.spooledReplayParticipants;
		const claimsSettled = entry.collectionClosed.promise.then(() => Promise.all(participants.map((participant) => participant.task)));
		const stopHeartbeat = () => clearInterval(entry.heartbeatTimer);
		renewWaitingEntry(key, entry);
		claimsSettled.then(stopHeartbeat);
		enqueueKeyedTask({
			tails: queue,
			key,
			task: async () => {
				stopHeartbeat();
				heads.set(key, entry);
				try {
					await entry.collectionClosed.promise;
					const processing = processMediaGroup(entry).catch(() => void 0);
					await (participants.length > 0 ? Promise.race([processing, claimsSettled]) : processing);
				} finally {
					heads.delete(key);
				}
			}
		});
	};
	const settleMediaGroup = (key, entry) => {
		if (buffer.get(key) !== entry) return;
		const flush = () => {
			buffer.delete(key);
			entry.collectionClosed.resolve();
		};
		const participant = entry.spooledReplayParticipants.at(-1);
		if (performance.now() >= entry.holdDeadlineMs || !participant) {
			flush();
			return;
		}
		const messageCount = entry.messages.length;
		entry.timer = setTimeout(() => {
			if (buffer.get(key) === entry && entry.messages.length === messageCount) flush();
		}, Math.max(0, entry.holdDeadlineMs - performance.now()));
		const settle = (hold) => {
			if (buffer.get(key) !== entry || entry.messages.length !== messageCount) return;
			clearTimeout(entry.timer);
			if (hold && performance.now() < entry.holdDeadlineMs) entry.timer = setTimeout(() => {
				settleMediaGroup(key, entry);
			}, Math.min(timeoutMs, Math.max(0, entry.holdDeadlineMs - performance.now())));
			else flush();
		};
		return participant.readLaneBacklogUpdates().then((updates) => settle(updates.some((update) => {
			const msg = isRecord(update) ? update.message ?? update.channel_post : void 0;
			return isRecord(msg) && msg.media_group_id === entry.messages[0]?.msg.media_group_id && isRecord(msg.chat) && msg.chat.id === entry.chatId;
		})), (error) => {
			logVerbose(`telegram: media group backlog read failed: ${String(error)}`);
			settle(false);
		});
	};
	const handleMediaGroup = (input) => {
		const mediaGroupId = input.msg.media_group_id;
		if (!mediaGroupId) return false;
		const conversationKey = conversationKeyFor(input);
		const key = `${conversationKey}:${mediaGroupId}`;
		const existing = buffer.get(key);
		const participant = createTelegramSpooledReplayDeferredParticipant(`media-group:${key}:${input.msg.message_id}`);
		if (existing) {
			if (participant) {
				existing.spooledReplayParticipants.push(participant);
				renewWaitingEntry(conversationKey, existing);
			}
			clearTimeout(existing.timer);
			existing.messages.push({
				msg: input.msg,
				ctx: input.ctx
			});
			existing.promptContextMinTimestampMs = latestPromptContextMinTimestampMs(existing.promptContextMinTimestampMs, input.promptContextMinTimestampMs);
			existing.promptContextAmbientWatermark = latestPromptContextAmbientWatermark(existing.promptContextAmbientWatermark, input.promptContextAmbientWatermark);
			existing.dispatchDedupeClaims = mergeDispatchDedupeClaims(existing.dispatchDedupeClaims, input.dispatchDedupeClaims);
			existing.channelIngressResolvers = [...existing.channelIngressResolvers, ...input.channelIngressResolvers];
			existing.timer = setTimeout(() => {
				settleMediaGroup(key, existing);
			}, timeoutMs);
			return true;
		}
		const entry = {
			...input,
			messages: [{
				msg: input.msg,
				ctx: input.ctx
			}],
			spooledReplayParticipants: participant ? [participant] : [],
			collectionClosed: createDeferred(),
			holdDeadlineMs: performance.now() + MEDIA_GROUP_MAX_HOLD_MS,
			...promptContextBoundaryOptions(input.promptContextMinTimestampMs, input.promptContextAmbientWatermark),
			timer: setTimeout(() => {
				settleMediaGroup(key, entry);
			}, timeoutMs)
		};
		buffer.set(key, entry);
		queueEntry(conversationKey, entry);
		return true;
	};
	return {
		handleMediaGroup,
		pendingMediaGroups,
		resolveUnaddressedGroupMediaDisposition,
		sendMediaWarning
	};
}
//#endregion
//#region extensions/telegram/src/sequential-key.ts
const TELEGRAM_READ_ONLY_COMMAND_KEYS = /* @__PURE__ */ new Set([
	"agents",
	"commands",
	"context",
	"help",
	"models",
	"status",
	"subagents",
	"tasks",
	"tools",
	"whoami"
]);
const TELEGRAM_ACTIVE_RUN_CONTROL_COMMAND_KEYS = /* @__PURE__ */ new Set([
	"approve",
	"queue",
	"steer"
]);
function getTelegramMessageReactionSequentialKey(ctx) {
	const reaction = ctx.update?.message_reaction;
	if ((reaction?.chat?.is_forum === true || reaction?.chat?.is_direct_messages === true) && typeof reaction.chat.id === "number" && typeof reaction.message_id === "number") return `telegram:${reaction.chat.id}:message:${reaction.message_id}`;
	const msg = getTelegramSequentialMessage(ctx);
	return (resolveTelegramMessageForumFlagHint({
		chatType: msg?.chat?.type,
		isForum: msg?.chat?.is_forum,
		isTopicMessage: msg?.is_topic_message
	}) || msg?.chat.is_direct_messages === true) && typeof msg?.chat.id === "number" && typeof msg.message_id === "number" ? `telegram:${msg.chat.id}:message:${msg.message_id}` : void 0;
}
function resolveTelegramCommandKeyForControlLane(params) {
	const trimmed = params.rawText?.trim();
	if (!trimmed) return;
	const alias = maybeResolveTextAlias(normalizeCommandBody(trimmed, params.botUsername ? { botUsername: params.botUsername } : void 0));
	if (!alias) return;
	return listChatCommands().find((entry) => entry.textAliases.some((candidate) => candidate.trim().toLowerCase() === alias))?.key;
}
function isTelegramControlLaneText(params) {
	const abortCommandOptions = params.botUsername ? { botUsername: params.botUsername } : { targetedCommandMode: "pre-identity" };
	if (isAbortRequestText(params.rawText, abortCommandOptions)) return true;
	const key = resolveTelegramCommandKeyForControlLane(params);
	return key !== void 0 && (TELEGRAM_ACTIVE_RUN_CONTROL_COMMAND_KEYS.has(key) || TELEGRAM_READ_ONLY_COMMAND_KEYS.has(key));
}
function getTelegramSequentialMessage(ctx) {
	return ctx.message ?? ctx.channelPost ?? ctx.editedMessage ?? ctx.editedChannelPost ?? ctx.update?.message ?? ctx.update?.edited_message ?? ctx.update?.channel_post ?? ctx.update?.edited_channel_post;
}
function getTelegramSequentialKey(ctx) {
	const reaction = ctx.update?.message_reaction;
	if (reaction?.chat?.id) return `telegram:${reaction.chat.id}`;
	const update = ctx.update;
	const pollId = update?.poll_answer?.poll_id;
	if (pollId) {
		const entry = getPreparedTelegramPollAnswer(update)?.entry;
		if (entry) {
			const threadId = "id" in entry.threadSpec ? entry.threadSpec.id : void 0;
			return threadId == null ? `telegram:${entry.chat.id}` : `telegram:${entry.chat.id}:topic:${threadId}`;
		}
		return `telegram:poll:${pollId}`;
	}
	const msg = getTelegramSequentialMessage(ctx) ?? ctx.update?.callback_query?.message;
	const chatId = msg?.chat?.id ?? ctx.chat?.id;
	const chatLane = typeof chatId === "number" ? `telegram:${chatId}` : "telegram";
	const rawText = msg?.text ?? msg?.caption;
	const botUsername = ctx.me?.username;
	if (isTelegramControlLaneText({
		rawText,
		botUsername
	})) return `${chatLane}:control`;
	if (isBtwRequestText(rawText, botUsername ? { botUsername } : void 0)) {
		const messageId = msg?.message_id;
		return typeof chatId === "number" && typeof messageId === "number" ? `${chatLane}:btw:${messageId}` : `${chatLane}:btw`;
	}
	const callbackData = ctx.update?.callback_query?.data;
	if (hasTelegramQuestionCallbackPrefix(callbackData)) return `${chatLane}:question`;
	if (hasTelegramApprovalCallbackPrefix(callbackData) || callbackData && parseExecApprovalCommandText(callbackData) !== null) return `${chatLane}:approval`;
	const forumHint = msg?.chat ? resolveTelegramMessageForumFlagHint({
		chatType: msg.chat.type,
		isForum: msg.chat.is_forum,
		isTopicMessage: msg.is_topic_message
	}) : void 0;
	const cachedForumFlag = forumHint === void 0 && msg?.chat?.type === "supergroup" && typeof msg.chat.id === "number" ? getCachedTelegramForumFlag(msg.chat.id) : void 0;
	const threadSpec = msg?.chat ? resolveTelegramMessageThreadSpec(msg, forumHint ?? cachedForumFlag) : void 0;
	const threadId = threadSpec?.scope === "dm" ? shouldUseTelegramDmThreadSession({
		dmThreadId: threadSpec.id,
		botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(ctx.me)
	}) ? threadSpec.id : void 0 : threadSpec?.id;
	if (typeof chatId === "number") return threadId != null ? `telegram:${chatId}:topic:${threadId}` : `telegram:${chatId}`;
	return "telegram:unknown";
}
function getTelegramSequentialConstraints(ctx) {
	const key = getTelegramSequentialKey(ctx);
	const messageKey = getTelegramMessageReactionSequentialKey(ctx);
	if (ctx.update?.message_reaction && messageKey) return messageKey;
	return messageKey ? [key, messageKey] : key;
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-processing.ts
function createTelegramInboundProcessing({ params: handlerParams, message }) {
	const { accountId, mediaMaxBytes, logger } = handlerParams;
	const { resolveMediaRuntime, recordMessageResolvedMedia, releaseDispatchDedupeClaims } = message;
	const { cancelPending, inboundDebouncer, resolveTelegramDebounceLane } = createTelegramInboundBuffers({
		params: handlerParams,
		message
	});
	const { handleMediaGroup, pendingMediaGroups, resolveUnaddressedGroupMediaDisposition, sendMediaWarning } = createTelegramInboundMedia({
		params: handlerParams,
		message
	});
	const processInboundMessage = async (params) => {
		const { dmPolicy, channelIngressResolver, sendOversizeWarning, oversizeLogMessage, ...mediaInput } = params;
		const { authorizationCfg, ctx, msg, chatId, isGroup, threadSpec, storeAllowFrom, senderId, effectiveGroupAllow, effectiveDmAllow, promptContextMinTimestampMs, promptContextAmbientWatermark, dispatchDedupeClaims } = mediaInput;
		const resolvedThreadId = threadSpec.scope === "forum" || threadSpec.scope === "direct-messages" ? threadSpec.id : void 0;
		const messageText = getTelegramTextParts(msg).text;
		const botUsername = ctx.me?.username;
		const isAbortControlMessage = isAbortRequestText(messageText, { botUsername });
		const bypassTextBuffer = isTelegramControlLaneText({
			rawText: messageText,
			botUsername
		}) || isBtwRequestText(messageText, { botUsername });
		if (await (isAbortControlMessage && senderId ? resolveTelegramCommandIngressAuthorization({
			accountId,
			cfg: authorizationCfg,
			dmPolicy,
			isGroup,
			chatId,
			resolvedThreadId,
			senderId,
			effectiveDmAllow,
			effectiveGroupAllow,
			eventKind: "message",
			allowTextCommands: true,
			hasControlCommand: true,
			modeWhenAccessGroupsOff: "allow",
			includeDmAllowForGroupCommands: false
		}).then((gate) => gate.authorized) : Promise.resolve(false))) cancelPending({
			chatId,
			threadSpec,
			senderId
		});
		if (handleMediaGroup({
			...mediaInput,
			channelIngressResolvers: [channelIngressResolver]
		})) return {
			kind: "buffered",
			buffer: "media-group"
		};
		const pendingAlbums = !bypassTextBuffer && pendingMediaGroups(mediaInput);
		if (pendingAlbums) {
			const lifecycle = getTelegramSpooledReplayLifecycle();
			const intervalMs = lifecycle?.deferredHeartbeatIntervalMs;
			const heartbeat = intervalMs === void 0 ? void 0 : setInterval(() => lifecycle?.onDeferredHeartbeat?.(), intervalMs);
			heartbeat?.unref();
			try {
				await pendingAlbums;
			} finally {
				clearInterval(heartbeat);
			}
		}
		const mediaDisposition = await resolveUnaddressedGroupMediaDisposition(mediaInput);
		if (mediaDisposition === "skip") {
			releaseDispatchDedupeClaims(dispatchDedupeClaims);
			return { kind: "ignored" };
		}
		const nativeMedia = resolveTelegramPrimaryMedia(msg);
		const replayingSpooledUpdate = isTelegramSpooledReplayUpdate(ctx.update);
		const hydrateMedia = async (abortSignals) => {
			const mediaRuntime = resolveMediaRuntime(...abortSignals);
			let media = null;
			let unavailable;
			try {
				media = await resolveMedia({
					ctx,
					maxBytes: mediaMaxBytes,
					...mediaRuntime
				});
				if (mediaRuntime.abortSignal?.aborted) return {
					kind: "retry",
					error: mediaRuntime.abortSignal.reason ?? /* @__PURE__ */ new Error("telegram media hydration owner aborted")
				};
				if (media) await recordMessageResolvedMedia({
					msg,
					media,
					botUserId: ctx.me?.id
				});
			} catch (mediaErr) {
				if (mediaRuntime.abortSignal?.aborted && isDurablyRetryableInboundMediaError(mediaErr)) return {
					kind: "retry",
					error: mediaErr
				};
				if (isMediaSizeLimitError(mediaErr)) {
					const limitBytes = mediaErr instanceof TelegramBotApiFileTooLargeError ? Math.min(mediaErr.limitMb * 1024 * 1024, mediaMaxBytes) : mediaMaxBytes;
					const limit = formatByteSize(limitBytes, {
						style: "legacy-binary",
						maxUnit: "mega",
						separator: "",
						fractionDigits: (value) => Number.isInteger(value) ? 0 : 2
					});
					unavailable = {
						reason: "oversize",
						limit
					};
					if (sendOversizeWarning && mediaDisposition !== "silent-ingest") await sendMediaWarning(mediaInput, `⚠️ File too large. Maximum size is ${limit}.`);
					logger.warn({
						chatId,
						error: String(mediaErr)
					}, oversizeLogMessage);
				} else {
					logger.warn({
						chatId,
						error: String(mediaErr)
					}, "media fetch failed");
					if (replayingSpooledUpdate && isDurablyRetryableInboundMediaError(mediaErr)) return {
						kind: "retry",
						error: mediaErr
					};
					unavailable = { reason: "download-failed" };
					if (mediaDisposition !== "silent-ingest") await sendMediaWarning(mediaInput, "⚠️ Failed to download media. Please try again.");
				}
			}
			return {
				kind: "ready",
				allMedia: nativeMedia ? [media ? {
					path: media.path,
					contentType: media.contentType,
					...media.fileName ? { fileName: media.fileName } : {},
					kind: media.kind,
					stickerMetadata: media.stickerMetadata
				} : {
					kind: nativeMedia.kind,
					unavailable
				}] : []
			};
		};
		const conversationKey = buildTelegramGroupPeerId(chatId, threadSpec);
		const debounceLane = resolveTelegramDebounceLane(msg);
		const debounceSenderId = senderId || (msg.from?.id != null ? String(msg.from.id) : "");
		const debounceKey = debounceSenderId ? buildTelegramInboundDebounceKey({
			accountId,
			conversationKey,
			senderId: debounceSenderId
		}) : null;
		const createDebounceEntry = (allMedia) => ({
			ctx,
			msg,
			allMedia,
			storeAllowFrom,
			receivedAtMs: Date.now(),
			debounceKey: bypassTextBuffer ? null : debounceKey,
			debounceLane,
			botUsername,
			threadSpec,
			...promptContextBoundaryOptions(promptContextMinTimestampMs, promptContextAmbientWatermark),
			dispatchDedupeClaims,
			channelIngressResolvers: [channelIngressResolver]
		});
		let debounceEntry = createDebounceEntry([]);
		if (nativeMedia && debounceLane === "forward" && inboundDebouncer.shouldBuffer(debounceEntry)) debounceEntry.hydrateMedia = hydrateMedia;
		else {
			const hydration = await hydrateMedia([]);
			if (hydration.kind === "retry") {
				recordTelegramMessageProcessingResult({
					kind: "failed-retryable",
					error: hydration.error
				});
				releaseDispatchDedupeClaims(dispatchDedupeClaims, hydration.error);
				return { kind: "ignored" };
			}
			debounceEntry = createDebounceEntry(hydration.allMedia);
		}
		const shouldBufferDebounce = inboundDebouncer.shouldBuffer(debounceEntry);
		if (shouldBufferDebounce) debounceEntry.spooledReplayParticipant = createTelegramSpooledReplayDeferredParticipant(`inbound-debounce:${debounceEntry.debounceKey}`) ?? void 0;
		await inboundDebouncer.enqueue(debounceEntry);
		return shouldBufferDebounce ? {
			kind: "buffered",
			buffer: "debounce"
		} : { kind: "processed" };
	};
	return { processInboundMessage };
}
//#endregion
//#region extensions/telegram/src/location-message-hook.ts
function emitTelegramLiveLocationMessageHook(params) {
	const location = extractTelegramLocation(params.msg);
	if (!location) return;
	const msg = params.msg;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const threadSpec = resolveTelegramMessageThreadSpec(msg, params.isForum);
	const originatingTo = buildTelegramInboundOriginTarget(msg.chat.id, threadSpec);
	const from = isGroup ? buildTelegramGroupFrom(msg.chat.id, threadSpec) : `telegram:${msg.chat.id}`;
	const body = formatLocationText(location);
	const messageTimestamp = msg.date ? msg.date * 1e3 : void 0;
	const editTimestamp = msg.edit_date ? msg.edit_date * 1e3 : void 0;
	const canonical = deriveInboundMessageHookContext({
		From: from,
		To: originatingTo,
		OriginatingChannel: "telegram",
		OriginatingTo: originatingTo,
		Provider: "telegram",
		Surface: "telegram",
		AccountId: params.accountId,
		MessageSid: String(msg.message_id),
		MessageSidFull: String(msg.message_id),
		SenderId: msg.from?.id != null ? String(msg.from.id) : void 0,
		SenderName: [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ") || void 0,
		SenderUsername: msg.from?.username,
		Timestamp: params.updateKind.startsWith("edited_") && msg.edit_date ? editTimestamp : messageTimestamp,
		Body: body,
		RawBody: body,
		BodyForAgent: body,
		MessageThreadId: threadSpec.id,
		GroupSubject: isGroup ? msg.chat.title : void 0,
		LocationLat: location.latitude,
		LocationLon: location.longitude,
		LocationAccuracy: location.accuracy,
		LocationName: location.name,
		LocationAddress: location.address,
		LocationSource: location.source,
		LocationIsLive: location.isLive,
		LocationLivePeriodSeconds: msg.location?.live_period,
		LocationCaption: location.caption,
		ProviderUpdateId: String(params.updateId),
		ProviderUpdateKind: params.updateKind,
		ProviderMessageTimestamp: messageTimestamp,
		ProviderEditTimestamp: editTimestamp,
		CommandAuthorized: false
	});
	const context = toPluginMessageContext(canonical);
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("message_received", context)) return;
	fireAndForgetHook(runner.runMessageReceived(toPluginMessageReceivedEvent(canonical), context), "message_received plugin hook failed");
}
//#endregion
//#region extensions/telegram/src/bot-handlers.inbound-pipeline.ts
function createTelegramInboundPipeline({ params: handlerParams, message: messageRuntime, authorization: authorizationRuntime }) {
	const { accountId, bot, opts, runtime, shouldSkipUpdate } = handlerParams;
	const { releaseDispatchDedupeClaims, claimMessageDispatchDedupe, resolveTelegramSessionState, resolvePromptContextAmbientWatermark, recordMessageForReplyChain } = messageRuntime;
	const { authorizeInboundMessage } = authorizationRuntime;
	const { processInboundMessage } = createTelegramInboundProcessing({
		params: handlerParams,
		message: messageRuntime
	});
	const getChat = bot.api.getChat.bind(bot.api);
	const resolveForumFlag = (msg, isGroup) => resolveTelegramForumFlag({
		chatId: msg.chat.id,
		chatType: msg.chat.type,
		isGroup,
		isForum: msg.chat.is_forum,
		isTopicMessage: msg.is_topic_message,
		getChat
	});
	const resolveBotUserId = (ctx) => {
		const botUserId = ctx.me?.id ?? opts.botInfo?.id;
		if (botUserId == null) throw new Error("Telegram bot identity is unavailable");
		return botUserId;
	};
	const normalizeChannelPostMessage = (post) => {
		const senderChat = post.sender_chat ?? post.chat;
		const syntheticFrom = {
			id: senderChat.id,
			is_bot: true,
			first_name: senderChat.title || "Channel",
			...senderChat.username !== void 0 ? { username: senderChat.username } : {}
		};
		return {
			...post,
			from: post.from ?? syntheticFrom,
			chat: {
				...post.chat,
				type: "supergroup"
			}
		};
	};
	const handleMessage = async (ctx, kind) => {
		const isChannelPost = kind === "channel_post";
		const msg = isChannelPost ? ctx.channelPost : ctx.message;
		if (!msg) return { kind: "ignored" };
		const isGroup = isChannelPost || msg.chat.type === "group" || msg.chat.type === "supergroup";
		const isForum = isChannelPost ? false : await resolveForumFlag(msg, isGroup);
		const normalizedMsg = isChannelPost ? normalizeChannelPostMessage(msg) : withResolvedTelegramForumFlag(msg, isForum);
		const botUserId = resolveBotUserId(ctx);
		if (!isChannelPost && normalizedMsg.from?.id != null && normalizedMsg.from.id === botUserId) return { kind: "ignored" };
		const chatId = normalizedMsg.chat.id;
		const syntheticContext = buildSyntheticContext(ctx, normalizedMsg);
		const senderId = isChannelPost && msg.sender_chat?.id != null ? String(msg.sender_chat.id) : msg.from?.id != null ? String(msg.from.id) : "";
		let dispatchDedupeClaims = [];
		try {
			if (shouldSkipUpdate(ctx)) return { kind: "ignored" };
			const gate = await authorizeInboundMessage({
				msg: normalizedMsg,
				chatId,
				isGroup,
				isForum,
				senderId,
				requireConfiguredGroup: isChannelPost,
				dmAccess: "challenge"
			});
			if (!gate.allowed) return { kind: "ignored" };
			const { effectiveDmAllow } = gate;
			const { dmPolicy, resolvedThreadId, storeAllowFrom, groupConfig, topicConfig, effectiveGroupAllow, threadSpec } = gate.context;
			const sessionState = await resolveTelegramSessionState({
				chatId,
				isGroup,
				threadSpec,
				botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(syntheticContext.me),
				senderId,
				runtimeCfg: gate.context.cfg
			});
			const promptContextMinTimestampMs = asFiniteNumber(sessionState.sessionEntry?.sessionStartedAt);
			const promptContextAmbientWatermark = await resolvePromptContextAmbientWatermark({
				chatId,
				isGroup,
				resolvedThreadId,
				sessionKey: sessionState.sessionKey,
				storePath: sessionState.storePath
			});
			const dispatchDedupe = await claimMessageDispatchDedupe(normalizedMsg, botUserId);
			if (!dispatchDedupe.process) return { kind: "ignored" };
			dispatchDedupeClaims = dispatchDedupe.claims;
			await recordMessageForReplyChain(normalizedMsg, gate.context.threadSpec, botUserId);
			return await processInboundMessage({
				authorizationCfg: gate.context.cfg,
				ctx: syntheticContext,
				msg: normalizedMsg,
				chatId,
				isGroup,
				threadSpec,
				dmPolicy,
				storeAllowFrom,
				senderId,
				effectiveGroupAllow,
				effectiveDmAllow,
				channelIngressResolver: gate.resolveChannelIngress,
				groupConfig: isGroup ? groupConfig : void 0,
				topicConfig,
				sendOversizeWarning: !isChannelPost,
				oversizeLogMessage: isChannelPost ? "channel post media exceeds size limit" : "media exceeds size limit",
				dispatchDedupeClaims,
				...promptContextBoundaryOptions(promptContextMinTimestampMs, promptContextAmbientWatermark)
			});
		} catch (err) {
			releaseDispatchDedupeClaims(dispatchDedupeClaims, err);
			const errorMessage = isChannelPost ? "channel_post handler failed" : "handler failed";
			runtime.error?.(danger(`${errorMessage}: ${String(err)}`));
			const spooledReplay = isTelegramSpooledReplayUpdate(syntheticContext.update);
			if (err instanceof TelegramPairingStoreReadError || spooledReplay) {
				recordTelegramMessageProcessingResult({
					kind: "failed-retryable",
					error: err
				});
				if (spooledReplay) return { kind: "ignored" };
				await withTelegramApiErrorLogging({
					operation: "sendMessage",
					runtime,
					fn: () => bot.api.sendMessage(chatId, "⚠️ Couldn't process this message, please try again in a moment.", { reply_parameters: {
						message_id: normalizedMsg.message_id,
						allow_sending_without_reply: true
					} })
				}).catch(() => {});
			}
			return { kind: "ignored" };
		}
	};
	const handleEditedMessage = async (ctx, kind) => {
		const isChannelPost = kind === "edited_channel_post";
		const original = isChannelPost ? ctx.editedChannelPost : ctx.editedMessage;
		if (!original) return { kind: "ignored" };
		const msg = isChannelPost ? normalizeChannelPostMessage(original) : original;
		const botUserId = resolveBotUserId(ctx);
		const updateId = ctx.update?.update_id;
		if (shouldSkipUpdate(ctx)) return { kind: "recorded" };
		const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
		const isForum = await resolveForumFlag(msg, isGroup);
		const normalizedMsg = withResolvedTelegramForumFlag(msg, isForum);
		const gate = await authorizeInboundMessage({
			msg: normalizedMsg,
			chatId: normalizedMsg.chat.id,
			isGroup,
			isForum,
			senderId: normalizedMsg.from?.id != null ? String(normalizedMsg.from.id) : "",
			requireConfiguredGroup: isChannelPost,
			dmAccess: "silent"
		});
		if (gate.allowed) {
			await recordMessageForReplyChain(normalizedMsg, gate.context.threadSpec, botUserId);
			if (typeof updateId === "number") emitTelegramLiveLocationMessageHook({
				accountId,
				msg: normalizedMsg,
				updateId,
				updateKind: kind,
				isForum
			});
		}
		return { kind: "recorded" };
	};
	return { handle: async (ctx) => {
		if (ctx.message) return await handleMessage(ctx, "message");
		if (ctx.editedMessage) return await handleEditedMessage(ctx, "edited_message");
		if (ctx.channelPost) return await handleMessage(ctx, "channel_post");
		if (ctx.editedChannelPost) return await handleEditedMessage(ctx, "edited_channel_post");
		return { kind: "ignored" };
	} };
}
function registerTelegramInboundHandlers({ bot, pipeline }) {
	bot.on([
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	], pipeline.handle);
}
//#endregion
//#region extensions/telegram/src/message-dispatch-dedupe.ts
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS = 6048e5;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE = "global";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID = "telegram-message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES = 5e4;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES = 5e4;
var TelegramMessageDispatchReplayForgetError = class extends Error {
	constructor(failures) {
		const count = failures.length;
		super(`telegram message dispatch dedupe rollback failed for ${count} key(s)`, { cause: failures.find((failure) => failure.error !== void 0)?.error });
		this.name = "TelegramMessageDispatchReplayForgetError";
		this.failures = [...failures];
		this.cause = failures.find((failure) => failure.error !== void 0)?.error;
	}
};
function buildTelegramMessageDispatchStoredReplayKey(params) {
	const chatId = params.msg.chat?.id;
	const messageId = params.msg.message_id;
	if (chatId == null || typeof messageId !== "number" || messageId <= 0) return null;
	return JSON.stringify([
		"account",
		params.accountId,
		"bot",
		String(params.botUserId),
		"message",
		String(chatId),
		messageId
	]);
}
function createTelegramMessageDispatchReplayGuard(params = {}) {
	return createChannelReplayGuard({
		dedupe: {
			ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
			memoryMaxSize: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES,
			pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
			namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
			stateMaxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
			...params.onDiskError ? { onDiskError: params.onDiskError } : {}
		},
		buildReplayKey: (event) => "msg" in event ? buildTelegramMessageDispatchStoredReplayKey(event) : event.keys ?? [],
		namespace: () => TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE
	});
}
async function claimTelegramMessageDispatchReplay(params) {
	return await runClaimableDedupeClaimLoop(() => params.guard.claim({
		accountId: params.accountId,
		botUserId: params.botUserId,
		msg: params.msg
	}), (_error, rejectionCount) => rejectionCount <= 1);
}
async function commitTelegramMessageDispatchReplay(params) {
	const claims = [...new Set(params.claims ?? [])];
	const committedKeys = [];
	for (const [index, claim] of claims.entries()) {
		let diskError;
		try {
			const recorded = await claim.commit(params.requirePersistent === true ? { onDiskError: (error) => {
				diskError = error;
			} } : void 0);
			if (params.requirePersistent === true && diskError !== void 0) throw diskError instanceof Error ? diskError : new Error(formatErrorMessage(diskError), { cause: diskError });
			if (recorded) committedKeys.push(...claim.keys);
		} catch (error) {
			for (const pendingClaim of claims.slice(index + 1)) pendingClaim.release({ error });
			const failures = [];
			for (const committedKey of committedKeys) try {
				if (!await params.guard.forget({ keys: [committedKey] })) failures.push({ key: committedKey });
			} catch (rollbackError) {
				failures.push({
					key: committedKey,
					error: rollbackError
				});
			}
			let failedKeyCleanupError;
			try {
				await params.guard.forget({ keys: claim.keys }, { onDiskError: (rollbackError) => {
					failedKeyCleanupError = rollbackError;
				} });
			} catch (rollbackError) {
				failedKeyCleanupError = rollbackError;
			}
			if (failedKeyCleanupError !== void 0) failures.push(...claim.keys.map((key) => ({
				key,
				error: failedKeyCleanupError
			})));
			if (failures.length > 0) throw new TelegramMessageDispatchReplayForgetError(failures);
			throw error;
		}
	}
}
function releaseTelegramMessageDispatchReplay(params) {
	for (const claim of new Set(params.claims ?? [])) claim.release({ error: params.error });
}
//#endregion
//#region extensions/telegram/src/bot-handlers.message-pipeline.ts
const HOUR_MS = 36e5;
function resolveRetainedTelegramMedia(params) {
	const media = params.media;
	if (!media || media.size > params.maxBytes) return;
	if (params.ttlHours !== void 0 && media.savedAt + params.ttlHours * HOUR_MS <= Date.now()) return;
	const path = resolveTelegramInboundMediaUri(media.id);
	const fileName = params.sourceMessage.document?.file_name ?? params.sourceMessage.audio?.file_name ?? params.sourceMessage.video?.file_name ?? params.sourceMessage.animation?.file_name;
	return path ? {
		path,
		kind: media.kind,
		...media.contentType ? { contentType: media.contentType } : {},
		...fileName ? { fileName } : {},
		...media.stickerMetadata ? { stickerMetadata: media.stickerMetadata } : {}
	} : void 0;
}
function createTelegramMessagePipeline({ cfg, accountId, ownerAgentId, bot, opts, telegramTransport, runtime, mediaMaxBytes, telegramCfg, resolveTelegramGroupConfig, processMessage, logger, telegramDeps }) {
	const { token } = opts;
	const mediaRuntimeOptions = resolveTelegramMediaRuntimeOptions({
		cfg,
		accountId,
		token,
		transport: telegramTransport
	});
	const resolveMediaRuntime = (...explicitSignals) => {
		const abortSignals = [
			opts.mediaAbortSignal,
			opts.fetchAbortSignal,
			getTelegramSpooledReplayLifecycle()?.abortSignal,
			...explicitSignals
		].filter((signal) => signal !== void 0);
		return {
			...mediaRuntimeOptions,
			abortSignal: abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0]
		};
	};
	const { resolveTelegramSessionState, resolvePromptContextAmbientWatermark } = createTelegramMessageSessionRuntime({
		accountId,
		resolveTelegramGroupConfig,
		telegramDeps
	});
	const { recordMessageForReplyChain, recordMessageResolvedMedia, recordReplyMessageResolvedMedia, resolveCachedMessageThreadSpec, buildReplyChainForMessage, toReplyChainEntry, buildPromptContextForMessage } = createTelegramMessageContextRuntime({
		cfg,
		accountId,
		ownerAgentId,
		opts,
		telegramCfg,
		telegramDeps
	});
	const replayGuard = createTelegramMessageDispatchReplayGuard({ onDiskError: (error) => {
		runtime.error?.(danger(`[telegram] message dispatch dedupe store failed: ${String(error)}`));
	} });
	const mergeDispatchDedupeClaims = (...groups) => [...new Set(groups.flatMap((group) => group ?? []))];
	const releaseDispatchDedupeClaims = (claims, error) => {
		releaseTelegramMessageDispatchReplay({
			claims,
			error
		});
	};
	const commitDispatchDedupeClaims = async (claims, options = {}) => {
		await commitTelegramMessageDispatchReplay({
			guard: replayGuard,
			claims,
			...options
		});
	};
	const settleSpooledReplayParticipants = (participants, result) => {
		for (const participant of new Set(participants)) participant.settle(result);
	};
	const beginSpooledReplaySettlementHolds = (participants) => {
		const holds = [];
		const releaseHolds = (mode) => {
			for (const hold of holds) hold.release(mode);
		};
		for (const participant of new Set(participants)) {
			const hold = participant.beginSettlementHold();
			if (!hold) {
				releaseHolds("replay-pending");
				const reason = participant.abortSignal.reason;
				throw reason instanceof Error ? reason : /* @__PURE__ */ new Error(`telegram spooled replay participant ${participant.key} settled before durable adoption`);
			}
			holds.push(hold);
		}
		return releaseHolds;
	};
	const claimMessageDispatchDedupe = async (msg, botUserId) => {
		const claim = await claimTelegramMessageDispatchReplay({
			guard: replayGuard,
			accountId,
			botUserId,
			msg
		});
		if (claim.kind === "duplicate") {
			logVerbose(`telegram dispatch dedupe: skipped message ${msg.chat.id}:${msg.message_id}`);
			return { process: false };
		}
		return {
			process: true,
			claims: claim.kind === "claimed" ? [claim.handle] : []
		};
	};
	const resolveReplyMediaForChain = async (ctx, chain, shouldHydrateMedia, durableMediaReplay, ...participantSignals) => {
		const mediaRuntime = resolveMediaRuntime(...participantSignals);
		const replyMedia = [];
		const replyChain = [];
		const hydrateMedia = async (sourceMessage, replyFileId, node) => {
			let mediaRef;
			try {
				mediaRuntime.abortSignal?.throwIfAborted();
				const retainedMedia = resolveRetainedTelegramMedia({
					media: node?.resolvedMedia,
					sourceMessage,
					maxBytes: mediaMaxBytes,
					ttlHours: cfg.attachments?.ttlHours
				});
				if (retainedMedia) return retainedMedia;
				const media = await resolveMedia({
					ctx: {
						message: sourceMessage,
						me: ctx.me,
						getFile: async (signal) => await bot.api.getFile(replyFileId, signal)
					},
					maxBytes: mediaMaxBytes,
					...mediaRuntime
				});
				if (!media) return;
				mediaRef = {
					path: media.path,
					kind: media.kind,
					...media.contentType ? { contentType: media.contentType } : {},
					...media.fileName ? { fileName: media.fileName } : {},
					...media.stickerMetadata ? { stickerMetadata: media.stickerMetadata } : {}
				};
				if (node) await recordReplyMessageResolvedMedia({
					chatId: node.sourceMessage.chat.id,
					messageId: node.messageId,
					media,
					botUserId: ctx.me?.id
				});
			} catch (err) {
				if (mediaRuntime.abortSignal?.aborted && durableMediaReplay) {
					recordTelegramMessageProcessingResult({
						kind: "failed-retryable",
						error: err
					});
					throw err;
				}
				logger.warn({
					chatId: ctx.message.chat.id,
					error: String(err)
				}, "reply media fetch failed");
			}
			return mediaRef;
		};
		for (const [index, node] of chain.entries()) {
			const replyFileId = resolveTelegramPrimaryMedia(node.sourceMessage)?.fileRef.file_id;
			const mediaRef = replyFileId && await shouldHydrateMedia(node, index) ? await hydrateMedia(node.sourceMessage, replyFileId, node) : void 0;
			if (mediaRef) replyMedia.push(mediaRef);
			replyChain.push(toReplyChainEntry(node, ctx, mediaRef));
		}
		const externalReply = chain.length === 0 && !ctx.message.reply_to_message ? ctx.message.external_reply : void 0;
		const externalFileId = resolveTelegramPrimaryMedia(externalReply)?.fileRef.file_id;
		const externalTarget = externalFileId ? describeReplyTarget(ctx.message) : null;
		if (externalReply && externalFileId && externalTarget && await shouldHydrateMedia(externalTarget, 0)) {
			const mediaRef = await hydrateMedia(externalReply, externalFileId);
			if (mediaRef) replyMedia.push(mediaRef);
		}
		return {
			replyMedia,
			replyChain
		};
	};
	const processMessageWithReplyChain = async (params) => {
		let dispatchDedupeCommitted = false;
		let spooledReplayFinalResult;
		let spooledReplayFinalization;
		const durableMediaReplay = isTelegramSpooledReplayUpdate(params.ctx.update) || Boolean(params.spooledReplayParticipants?.length);
		const spooledReplay = params.options?.spooledReplay === true || durableMediaReplay;
		const explicitParticipants = params.spooledReplayParticipants ?? [];
		const frameParticipant = spooledReplay && explicitParticipants.length === 0 && params.options?.isolateSpooledReplaySettlement !== true ? getTelegramSpooledReplayDeferredParticipant() ?? createTelegramSpooledReplayDeferredParticipant(`message:${params.msg.chat.id}:${params.msg.message_id}`) ?? void 0 : void 0;
		const ingressSpooledReplayParticipants = [...explicitParticipants, ...frameParticipant ? [frameParticipant] : []];
		const processingParticipant = explicitParticipants.length > 0 ? createTelegramSpooledReplayParticipant(`message-processing:${params.msg.chat.id}:${params.msg.message_id}`, explicitParticipants) : frameParticipant;
		if (processingParticipant && explicitParticipants.length > 0) for (const participant of explicitParticipants) participant.task.then((result) => {
			processingParticipant.settle(result);
		});
		const spooledReplayParticipants = [.../* @__PURE__ */ new Set([...ingressSpooledReplayParticipants, ...processingParticipant ? [processingParticipant] : []])];
		const finalizeSpooledReplayResult = async (result) => {
			if (spooledReplayFinalResult) return spooledReplayFinalResult;
			if (spooledReplayFinalization) return await spooledReplayFinalization;
			const finalization = (async () => {
				if (result.kind === "completed") {
					const releaseSettlementHolds = beginSpooledReplaySettlementHolds(ingressSpooledReplayParticipants);
					try {
						await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], { requirePersistent: true });
					} catch (error) {
						releaseSettlementHolds("replay-pending");
						throw error;
					}
					releaseSettlementHolds("discard-pending");
					dispatchDedupeCommitted = true;
				} else releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], result.kind === "failed-retryable" ? result.error : void 0);
				spooledReplayFinalResult = result;
				settleSpooledReplayParticipants(spooledReplayParticipants, result);
				return result;
			})();
			spooledReplayFinalization = finalization;
			try {
				return await finalization;
			} finally {
				if (!spooledReplayFinalResult && spooledReplayFinalization === finalization) spooledReplayFinalization = void 0;
			}
		};
		try {
			const runtimeCfg = telegramDeps.getRuntimeConfig();
			const runtimeTelegramCfg = resolveTelegramAccount({
				cfg: runtimeCfg,
				accountId
			}).config;
			const replyChainNodes = await buildReplyChainForMessage(params.msg);
			const isGroupConversation = params.msg.chat.type === "group" || params.msg.chat.type === "supergroup";
			const scopedThreadId = resolveTelegramMessageThreadSpec(params.msg).id;
			const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(runtimeTelegramCfg, params.msg.chat.id, scopedThreadId);
			const configuredGroupAllowFrom = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom) ?? opts.groupAllowFrom ?? runtimeTelegramCfg.groupAllowFrom ?? runtimeTelegramCfg.allowFrom ?? opts.allowFrom;
			const contextVisibilityMode = resolveChannelContextVisibilityMode({
				cfg: runtimeCfg,
				channel: "telegram",
				accountId
			});
			const shouldHydrateReplyMedia = async (node, index) => {
				if (!isGroupConversation) return true;
				const expandedAllowFrom = await expandTelegramAllowFromWithAccessGroups({
					cfg: runtimeCfg,
					allowFrom: configuredGroupAllowFrom,
					accountId,
					senderId: node.senderId
				});
				const effectiveAllow = normalizeAllowFrom(expandedAllowFrom);
				const senderAllowed = effectiveAllow.hasEntries ? isSenderIdAllowed(effectiveAllow, node.senderId, true) : true;
				return evaluateSupplementalContextVisibility({
					mode: contextVisibilityMode,
					kind: index === 0 ? "quote" : "thread",
					senderAllowed
				}).include;
			};
			const { replyMedia, replyChain } = await resolveReplyMediaForChain(params.ctx, replyChainNodes, shouldHydrateReplyMedia, durableMediaReplay, ...spooledReplayParticipants.map((participant) => participant.abortSignal), ...params.spooledReplayAbortSignal ? [params.spooledReplayAbortSignal] : []);
			const promptContextMediaByMessageId = /* @__PURE__ */ new Map();
			const currentMessageId = typeof params.msg.message_id === "number" ? String(params.msg.message_id) : void 0;
			for (const [index, media] of params.allMedia.entries()) {
				const messageId = media.sourceMessageId ?? (index === 0 ? currentMessageId : void 0);
				const promptMediaPath = media.path ? resolveTelegramPromptMediaPath(media.path) : void 0;
				if (messageId && promptMediaPath) promptContextMediaByMessageId.set(messageId, {
					...media,
					path: promptMediaPath
				});
			}
			for (const entry of replyChain) {
				const promptMediaPath = entry.mediaPath ? resolveTelegramPromptMediaPath(entry.mediaPath) : void 0;
				const inferredKind = kindFromMime(entry.mediaType);
				const mediaKind = entry.mediaKind ?? (inferredKind && inferredKind !== "unknown" ? inferredKind : "document");
				if (entry.messageId && entry.mediaPath && promptMediaPath) promptContextMediaByMessageId.set(entry.messageId, {
					path: promptMediaPath,
					kind: mediaKind,
					...entry.mediaType ? { contentType: entry.mediaType } : {}
				});
			}
			const promptContext = await buildPromptContextForMessage(params.ctx, params.msg, replyChainNodes, runtimeCfg, runtimeTelegramCfg, params.options, promptContextMediaByMessageId, params.promptContextMessageSelection);
			const result = await processMessage({
				ctx: params.ctx,
				allMedia: params.allMedia,
				storeAllowFrom: params.storeAllowFrom,
				turnContext: {
					cfg: runtimeCfg,
					telegramCfg: runtimeTelegramCfg,
					onDispatchStart: async () => {
						await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
						dispatchDedupeCommitted = true;
					},
					onTurnDeferred: params.onTurnDeferred,
					spooledReplayAbortSignal: params.spooledReplayAbortSignal,
					spooledReplayParticipant: processingParticipant,
					finalizeSpooledReplayResult,
					completeSpooledReplayAfterIrrevocableAdoption: async () => await finalizeSpooledReplayResult({ kind: "completed" })
				},
				options: params.options,
				replyMedia,
				replyChain,
				promptContext
			});
			if (spooledReplay) return await finalizeSpooledReplayResult(result);
			if (result.kind === "completed" && !dispatchDedupeCommitted) await commitDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
			else if (result.kind !== "completed" && !dispatchDedupeCommitted) releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? []);
			return result;
		} catch (err) {
			if (spooledReplay) return await finalizeSpooledReplayResult({
				kind: "failed-retryable",
				error: err
			});
			if (!dispatchDedupeCommitted) releaseDispatchDedupeClaims(params.dispatchDedupeClaims ?? [], err);
			throw err;
		}
	};
	return {
		resolveMediaRuntime,
		mergeDispatchDedupeClaims,
		releaseDispatchDedupeClaims,
		settleSpooledReplayParticipants,
		claimMessageDispatchDedupe,
		resolveTelegramSessionState,
		resolvePromptContextAmbientWatermark,
		recordMessageForReplyChain,
		recordMessageResolvedMedia,
		resolveCachedMessageThreadSpec,
		processMessageWithReplyChain
	};
}
//#endregion
//#region extensions/telegram/src/bot-handlers.runtime.ts
const createTelegramHandlers = (params) => {
	const message = createTelegramMessagePipeline(params);
	const authorization = createTelegramHandlerAuthorization(params);
	const pipelineContext = {
		params,
		message,
		authorization
	};
	const inboundPipeline = createTelegramInboundPipeline(pipelineContext);
	return { register(nativeCommandCallbackDispatcher) {
		const callbackRouter = createTelegramCallbackRouter({
			params: {
				...params,
				nativeCommandCallbackDispatcher
			},
			message,
			authorization
		});
		const eventBindings = createTelegramEventBindings(pipelineContext);
		eventBindings.registerChatMembership();
		eventBindings.registerReaction();
		eventBindings.registerPolls();
		params.bot.on("callback_query", async (ctx) => {
			await callbackRouter.route(ctx);
		});
		eventBindings.registerMigration();
		registerTelegramInboundHandlers({
			bot: params.bot,
			pipeline: inboundPipeline
		});
	} };
};
//#endregion
//#region extensions/telegram/src/bot-native-commands.ts
const loadTelegramBuiltinCommandExecutor = createLazyRuntimeModule(() => import("./bot-native-command-builtins-D0teSnZG.mjs"));
const loadTelegramPluginCommandExecutor = createLazyRuntimeModule(() => import("./bot-native-command-plugins-DRvS6lVr.mjs"));
const registerTelegramNativeCommands = async ({ cfg, telegramCfg, nativeEnabled, nativeSkillsEnabled, shouldSkipUpdate, telegramDeps = defaultTelegramNativeCommandDeps, ...executorParams }) => {
	const { bot, runtime, accountId, opts } = executorParams;
	const boundRoute = nativeEnabled && nativeSkillsEnabled ? resolveAgentRoute({
		cfg,
		channel: "telegram",
		accountId
	}) : null;
	if (nativeEnabled && nativeSkillsEnabled && !boundRoute) runtime.log?.("nativeSkillsEnabled is true but no agent route is bound for this Telegram account; skill commands will not appear in the native menu.");
	const skillCommands = nativeEnabled && nativeSkillsEnabled && boundRoute ? await telegramDeps.prepareSkillCommandsForAgents({
		cfg,
		agentIds: [boundRoute.agentId]
	}) : [];
	const pluginCommandSpecs = createPluginCommandRuntime().listNativeCandidates("telegram");
	const nativeCommands = nativeEnabled ? listNativeCommandSpecsForConfig(cfg, {
		skillCommands,
		provider: "telegram",
		includeBundledChannelFallback: false
	}) : [];
	const reservedCommands = new Set(listNativeCommandSpecs({
		provider: "telegram",
		includeBundledChannelFallback: false
	}).map((command) => normalizeTelegramCommandName(command.name)));
	for (const command of skillCommands) reservedCommands.add(normalizeTelegramCommandName(command.name));
	const customResolution = resolveTelegramCustomCommands({
		commands: telegramCfg.customCommands,
		reservedCommands
	});
	for (const issue of customResolution.issues) runtime.error?.(danger(issue.message));
	const customCommands = customResolution.commands;
	const pluginCatalog = buildPluginTelegramMenuCommands({
		specs: pluginCommandSpecs,
		existingCommands: new Set(reservedCommands)
	});
	for (const issue of pluginCatalog.issues) runtime.error?.(danger(issue));
	const builtinCommands = listNativeCommandSpecsForConfig(cfg, {
		provider: "telegram",
		includeBundledChannelFallback: false
	});
	const firstSkillCommandIndex = nativeEnabled ? builtinCommands.length : 0;
	const nativeMenuCommands = nativeCommands.map((command, index) => {
		const normalized = normalizeTelegramCommandName(command.name);
		if (!TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
			runtime.error?.(danger(`Native command "${command.name}" is invalid for Telegram (resolved to "${normalized}"). Skipping.`));
			return null;
		}
		return {
			command: normalized,
			description: command.description,
			...command.isAlias ? { isAlias: true } : {},
			...index >= firstSkillCommandIndex ? { isSkill: true } : {},
			...command.descriptionLocalizations ? { descriptionLocalizations: command.descriptionLocalizations } : {}
		};
	}).filter((command) => command !== null);
	const customCommandNames = new Set(customCommands.map((command) => command.command));
	const fullCommandCatalog = buildCappedTelegramMenuCommands([
		...customCommands,
		...nativeMenuCommands.filter((command) => !command.isAlias),
		...nativeEnabled ? pluginCatalog.commands.filter((command) => !customCommandNames.has(command.command)) : [],
		...nativeMenuCommands.filter((command) => command.isAlias)
	]);
	if (fullCommandCatalog.skillCommandsOmitted) runtime.log?.("Telegram menu pressure omitted per-skill commands; removing per-skill commands and keeping /skill.");
	const loginCommand = builtinCommands.find((command) => findCommandByNativeName(command.name, "telegram", { includeBundledChannelFallback: false })?.key === "login");
	const nativeCommandNames = new Map(nativeCommands.map((command) => [normalizeTelegramCommandName(command.name), command.name]));
	const { commandsToRegister, totalCommands, maxCommands, overflowCount, maxTotalChars, descriptionTrimmed, textBudgetDropCount } = fullCommandCatalog;
	if (overflowCount > 0) runtime.log?.(`Telegram limits bots to ${maxCommands} commands. ${totalCommands} configured; registering first ${maxCommands}. Use channels.telegram.commands.native: false to disable, or reduce plugin/skill/custom commands.`);
	if (descriptionTrimmed) runtime.log?.(`Telegram menu text exceeded the conservative ${maxTotalChars}-character payload budget; shortening descriptions to keep ${commandsToRegister.length} commands visible.`);
	if (textBudgetDropCount > 0) runtime.log?.(`Telegram menu text still exceeded the conservative ${maxTotalChars}-character payload budget after shortening descriptions; registering first ${commandsToRegister.length} commands.`);
	(telegramDeps.syncTelegramMenuCommands ?? syncTelegramMenuCommands)({
		bot,
		runtime,
		commandsToRegister,
		accountId,
		botId: opts.botInfo?.id,
		botToken: opts.token
	});
	const handleNativeCommand = async (commandName, botUser, msg, rawText, shouldSkip) => {
		const { executeTelegramBuiltinCommand } = await loadTelegramBuiltinCommandExecutor();
		return await executeTelegramBuiltinCommand({
			...executorParams,
			telegramDeps,
			botUser,
			msg,
			rawText,
			commandName,
			shouldSkip
		});
	};
	for (const command of nativeCommands) bot.command(normalizeTelegramCommandName(command.name), async (ctx, next) => {
		if (!ctx.message) {
			await next();
			return;
		}
		if (await handleNativeCommand(command.name, ctx.me, ctx.message, typeof ctx.match === "string" ? ctx.match.trim() : "", () => shouldSkipUpdate(ctx)) === "fall-through") await next();
	});
	for (const pluginCommand of pluginCatalog.selectedCommands) bot.command(pluginCommand.command, async (ctx) => {
		if (shouldSkipUpdate(ctx) || !ctx.message) return;
		const { executeTelegramPluginCommand } = await loadTelegramPluginCommandExecutor();
		await executeTelegramPluginCommand({
			...executorParams,
			telegramDeps,
			botUser: ctx.me,
			msg: ctx.message,
			rawText: ctx.match?.trim() ?? "",
			commandName: pluginCommand.command,
			candidate: pluginCommand.spec
		});
	});
	if (!loginCommand) return { nativeCommandNames };
	const nativeCommandCallbackDispatcher = async ({ botUser, callbackQuery, commandText }) => {
		const commandBody = commandText.slice(1).trim();
		const separatorIndex = commandBody.search(/\s/u);
		const commandName = (separatorIndex === -1 ? commandBody : commandBody.slice(0, separatorIndex)).split("@", 1)[0]?.toLowerCase();
		if ((commandName ? findCommandByNativeName(commandName, "telegram", { includeBundledChannelFallback: false }) : void 0)?.key !== "login") return {
			handled: false,
			clearButtons: false
		};
		const callbackMessage = callbackQuery.message;
		if (!callbackMessage || callbackMessage.date <= 0 || callbackMessage.chat.type === "channel") return {
			handled: true,
			clearButtons: false
		};
		const rawText = separatorIndex === -1 ? "" : commandBody.slice(separatorIndex + 1).trim();
		return {
			handled: true,
			clearButtons: await handleNativeCommand(loginCommand.name, botUser, {
				...callbackMessage,
				chat: callbackMessage.chat,
				from: callbackQuery.from,
				text: commandText
			}, rawText) === "handled-clear-buttons"
		};
	};
	return {
		nativeCommandNames,
		nativeCommandCallbackDispatcher
	};
};
//#endregion
//#region extensions/telegram/src/bot-update-tracker.ts
const ACCEPTED_UPDATE_ID_RETENTION = 1e4;
function createTelegramUpdateTracker(options = {}) {
	const initialUpdateId = typeof options.initialUpdateId === "number" ? options.initialUpdateId : null;
	const persistenceFloorUpdateId = typeof options.persistenceFloorUpdateId === "number" ? options.persistenceFloorUpdateId : initialUpdateId;
	const ackPolicy = options.ackPolicy ?? "after_receive_record";
	const recentUpdates = createTelegramUpdateDedupe();
	const activeHandledUpdateKeys = /* @__PURE__ */ new Map();
	const pendingUpdateIds = /* @__PURE__ */ new Set();
	const failedUpdateIds = /* @__PURE__ */ new Set();
	const acceptedUpdateIds = /* @__PURE__ */ new Set();
	let highestAcceptedUpdateId = initialUpdateId;
	let highestPersistedAcceptedUpdateId = persistenceFloorUpdateId;
	let highestPersistenceRequestedUpdateId = persistenceFloorUpdateId;
	let highestCompletedUpdateId = persistenceFloorUpdateId;
	let persistInFlight = false;
	let persistTargetUpdateId = null;
	const reportPersistError = (error) => {
		options.onPersistError?.(error);
	};
	const pruneAcceptedUpdateIds = () => {
		const windowFloor = (highestAcceptedUpdateId ?? Number.NEGATIVE_INFINITY) - ACCEPTED_UPDATE_ID_RETENTION;
		const pruneAtOrBelow = Math.max(highestPersistedAcceptedUpdateId ?? Number.NEGATIVE_INFINITY, windowFloor);
		for (const id of acceptedUpdateIds) {
			if (id > pruneAtOrBelow || pendingUpdateIds.has(id) || failedUpdateIds.has(id)) continue;
			acceptedUpdateIds.delete(id);
		}
	};
	const drainPersistQueue = async () => {
		const persist = options.onAcceptedUpdateId;
		if (persistInFlight || typeof persist !== "function") return;
		persistInFlight = true;
		try {
			while (persistTargetUpdateId !== null) {
				const updateId = persistTargetUpdateId;
				persistTargetUpdateId = null;
				try {
					await persist(updateId);
					if (highestPersistedAcceptedUpdateId === null || updateId > highestPersistedAcceptedUpdateId) {
						highestPersistedAcceptedUpdateId = updateId;
						pruneAcceptedUpdateIds();
					}
				} catch (err) {
					reportPersistError(err);
				}
			}
		} finally {
			persistInFlight = false;
		}
	};
	const requestPersistAcceptedUpdateId = (updateId) => {
		if (typeof options.onAcceptedUpdateId !== "function") return;
		if (highestPersistenceRequestedUpdateId !== null && updateId <= highestPersistenceRequestedUpdateId) return;
		highestPersistenceRequestedUpdateId = updateId;
		persistTargetUpdateId = updateId;
		drainPersistQueue().catch(reportPersistError);
	};
	const acceptUpdateId = (updateId) => {
		acceptedUpdateIds.add(updateId);
		if (highestAcceptedUpdateId === null || updateId > highestAcceptedUpdateId) highestAcceptedUpdateId = updateId;
		pruneAcceptedUpdateIds();
	};
	function resolveSafeCompletedUpdateId() {
		if (highestCompletedUpdateId === null) return null;
		let safeCompletedUpdateId = highestCompletedUpdateId;
		for (const ids of [pendingUpdateIds, failedUpdateIds]) for (const updateId of ids) {
			if (persistenceFloorUpdateId !== null && updateId <= persistenceFloorUpdateId) continue;
			if (updateId <= safeCompletedUpdateId) safeCompletedUpdateId = updateId - 1;
		}
		return safeCompletedUpdateId;
	}
	const ackUpdateAfterStage = (receiveContext, stage) => {
		if (!receiveContext?.shouldAckAfter(stage)) return;
		receiveContext.ack().catch(reportPersistError);
	};
	const beginUpdate = (ctx) => {
		const updateId = resolveTelegramUpdateId(ctx);
		const updateKey = buildTelegramUpdateKey(ctx);
		if (typeof updateId === "number") {
			if (failedUpdateIds.has(updateId)) failedUpdateIds.delete(updateId);
			else if (initialUpdateId !== null && updateId <= initialUpdateId || acceptedUpdateIds.has(updateId)) {
				options.onSkip?.(`update:${updateId}`);
				return {
					accepted: false,
					reason: pendingUpdateIds.has(updateId) ? "pending" : "accepted-watermark"
				};
			}
		}
		if (updateKey) {
			if (activeHandledUpdateKeys.has(updateKey)) {
				options.onSkip?.(updateKey);
				return {
					accepted: false,
					reason: "pending"
				};
			}
			if (recentUpdates.peek(updateKey)) {
				options.onSkip?.(updateKey);
				return {
					accepted: false,
					reason: "semantic-dedupe"
				};
			}
			activeHandledUpdateKeys.set(updateKey, false);
		}
		let receiveContext;
		if (typeof updateId === "number") {
			pendingUpdateIds.add(updateId);
			acceptUpdateId(updateId);
			receiveContext = createMessageReceiveContext({
				id: updateKey ?? `telegram:update:${updateId}`,
				channel: "telegram",
				message: ctx,
				ackPolicy,
				onAck: async () => {
					const persistUpdateId = ackPolicy === "after_agent_dispatch" ? resolveSafeCompletedUpdateId() : updateId;
					if (persistUpdateId !== null) requestPersistAcceptedUpdateId(persistUpdateId);
				}
			});
			ackUpdateAfterStage(receiveContext, "receive_record");
		}
		return {
			accepted: true,
			update: {
				...updateKey ? { key: updateKey } : {},
				...typeof updateId === "number" ? { updateId } : {},
				...receiveContext ? { receiveContext } : {}
			}
		};
	};
	const finishUpdate = (update, finish) => {
		if (update.key) {
			activeHandledUpdateKeys.delete(update.key);
			if (finish.completed) recentUpdates.check(update.key);
		}
		if (typeof update.updateId === "number") {
			pendingUpdateIds.delete(update.updateId);
			if (finish.completed) {
				failedUpdateIds.delete(update.updateId);
				if (highestCompletedUpdateId === null || update.updateId > highestCompletedUpdateId) highestCompletedUpdateId = update.updateId;
				ackUpdateAfterStage(update.receiveContext, "agent_dispatch");
			} else {
				failedUpdateIds.add(update.updateId);
				update.receiveContext?.nack(/* @__PURE__ */ new Error("Telegram update handler did not complete")).catch(reportPersistError);
			}
			pruneAcceptedUpdateIds();
		}
	};
	const shouldSkipHandlerDispatch = (ctx) => {
		const updateId = resolveTelegramUpdateId(ctx);
		if (typeof updateId === "number" && initialUpdateId !== null && updateId <= initialUpdateId) return true;
		const key = buildTelegramUpdateKey(ctx);
		if (!key) return false;
		const handled = activeHandledUpdateKeys.get(key);
		if (handled != null) {
			if (handled) {
				options.onSkip?.(key);
				return true;
			}
			activeHandledUpdateKeys.set(key, true);
			return false;
		}
		const skipped = recentUpdates.peek(key);
		if (skipped) options.onSkip?.(key);
		return skipped;
	};
	return {
		beginUpdate,
		finishUpdate,
		shouldSkipHandlerDispatch
	};
}
//#endregion
//#region extensions/telegram/src/raw-update-log.ts
const MAX_RAW_UPDATE_STRING = 500;
const MAX_RAW_UPDATE_ARRAY = 20;
const MAX_RAW_UPDATE_CHARS = 8e3;
const REDACTED_TELEGRAM_FIELD = "[redacted]";
const TELEGRAM_RAW_UPDATE_ALWAYS_REDACT_KEYS = /* @__PURE__ */ new Set([
	"added_to_attachment_menu",
	"author_signature",
	"caption",
	"chat_instance",
	"data",
	"email",
	"bio",
	"description",
	"explanation",
	"file_id",
	"file_unique_id",
	"first_name",
	"invite_link",
	"is_premium",
	"language_code",
	"latitude",
	"last_name",
	"longitude",
	"name",
	"phone_number",
	"question",
	"query",
	"text",
	"title",
	"url",
	"username",
	"vcard",
	"chat_id",
	"custom_emoji_id",
	"inline_message_id",
	"migrate_from_chat_id",
	"migrate_to_chat_id",
	"option_ids",
	"poll_id",
	"sender_chat_id",
	"user_id",
	"user_chat_id"
]);
const TELEGRAM_RAW_UPDATE_ALLOWED_ID_KEYS = /* @__PURE__ */ new Set(["message_id", "update_id"]);
function formatTelegramRawUpdateForLog(update) {
	const seen = /* @__PURE__ */ new WeakSet();
	const transform = (value, key = "", parentKey) => {
		if (TELEGRAM_RAW_UPDATE_ALWAYS_REDACT_KEYS.has(key) || !TELEGRAM_RAW_UPDATE_ALLOWED_ID_KEYS.has(key) && parentKey !== void 0 && (key === "id" || key.endsWith("_id") || key.endsWith("_ids"))) return REDACTED_TELEGRAM_FIELD;
		if (typeof value === "string") return value.length > MAX_RAW_UPDATE_STRING ? `${truncateUtf16Safe(value, MAX_RAW_UPDATE_STRING)}...` : value;
		if (Array.isArray(value)) {
			const items = value.slice(0, MAX_RAW_UPDATE_ARRAY).map((item) => transform(item, key, key));
			if (value.length > MAX_RAW_UPDATE_ARRAY) items.push(`...(${value.length - MAX_RAW_UPDATE_ARRAY} more)`);
			return items;
		}
		if (value && typeof value === "object") {
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			const record = value;
			if (typeof record.id === "number" && typeof record.is_bot === "boolean" && typeof record.first_name === "string") return REDACTED_TELEGRAM_FIELD;
			const redacted = {};
			for (const [entryKey, entryValue] of Object.entries(record)) redacted[entryKey] = transform(entryValue, entryKey, key);
			return redacted;
		}
		return value;
	};
	const raw = JSON.stringify(transform(update ?? null));
	return raw.length > MAX_RAW_UPDATE_CHARS ? `${truncateUtf16Safe(raw, MAX_RAW_UPDATE_CHARS)}...` : raw;
}
//#endregion
//#region extensions/telegram/src/sequentialize.ts
function createTelegramSequentializer() {
	const tails = /* @__PURE__ */ new Map();
	return async (ctx, next) => {
		const constraints = getTelegramSequentialConstraints(ctx);
		const keys = Array.isArray(constraints) ? constraints : [constraints];
		const previous = keys.map((key) => tails.get(key)).filter((tail) => tail !== void 0);
		const task = Promise.all(previous).then(next);
		const tail = task.catch(() => void 0);
		for (const key of keys) tails.set(key, tail);
		try {
			await task;
		} finally {
			for (const key of keys) if (tails.get(key) === tail) tails.delete(key);
		}
	};
}
//#endregion
//#region extensions/telegram/src/bot-core.ts
async function createTelegramBotCore(opts) {
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const telegramDeps = opts.telegramDeps;
	const cfg = opts.config ?? telegramDeps.getRuntimeConfig();
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const ownerAgentId = opts.ownerAgentId?.trim() || resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: account.accountId
	});
	const runtimeOpts = {
		...opts,
		ownerAgentId
	};
	const threadBindingScope = {
		cfg,
		channel: "telegram",
		accountId: account.accountId
	};
	const threadBindingPolicy = resolveThreadBindingSpawnPolicy({
		...threadBindingScope,
		kind: "subagent"
	});
	const telegramCfg = account.config;
	const apiRoot = normalizeOptionalString(telegramCfg.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const telegramTransport = opts.telegramTransport ?? resolveTelegramTransport(opts.proxyFetch, { network: telegramCfg.network });
	const finalFetch = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(telegramTransport.fetch),
		shutdownSignal: opts.fetchAbortSignal,
		transport: telegramTransport
	});
	const client = {
		fetch: asTelegramClientFetch(finalFetch),
		...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
	};
	const bot = new Bot(opts.token, {
		client,
		...opts.botInfo ? { botInfo: opts.botInfo } : {}
	});
	const accountThrottler = getOrCreateAccountThrottler(opts.token);
	bot.api.config.use(accountThrottler.transformer);
	const sendChatActionHandler = {
		sendChatAction: (chatId, action, threadParams) => accountThrottler.chatActions.sendChatAction(chatId, action, threadParams, () => bot.api.sendChatAction(chatId, action, threadParams)),
		isSuspended: accountThrottler.chatActions.isSuspended,
		reset: accountThrottler.chatActions.reset
	};
	bot.catch((err) => {
		runtime.error?.(danger(`telegram bot error: ${formatUncaughtError(err)}`));
	});
	const initialUpdateId = typeof opts.updateOffset?.lastUpdateId === "number" ? opts.updateOffset.lastUpdateId : null;
	const updateTracker = createTelegramUpdateTracker({
		initialUpdateId,
		persistenceFloorUpdateId: typeof opts.updateOffset?.persistenceFloorUpdateId === "number" ? opts.updateOffset.persistenceFloorUpdateId : initialUpdateId,
		ackPolicy: "after_agent_dispatch",
		...typeof opts.updateOffset?.onUpdateId === "function" ? { onAcceptedUpdateId: opts.updateOffset.onUpdateId } : {},
		onPersistError: (err) => {
			runtime.error?.(`telegram: failed to persist update watermark: ${formatErrorMessage(err)}`);
		},
		onSkip: (key) => {
			if (shouldLogVerbose()) logVerbose(`telegram dedupe: skipped ${key}`);
		}
	});
	const shouldSkipUpdate = updateTracker.shouldSkipHandlerDispatch;
	bot.use(async (ctx, next) => {
		const begin = updateTracker.beginUpdate(ctx);
		if (!begin.accepted) {
			recordTelegramMessageProcessingResult(begin.reason === "pending" ? {
				kind: "failed-retryable",
				error: /* @__PURE__ */ new Error("Telegram update processing is still pending")
			} : { kind: "skipped" });
			return;
		}
		try {
			const { result } = await runWithTelegramUpdateProcessingFrame(async () => {
				await next();
				if (!getTelegramSpooledReplayDeferredParticipant()) ensureTelegramMessageProcessingResult({ kind: "completed" });
			});
			const deferredWork = getTelegramSpooledReplayDeferredParticipant();
			if (deferredWork) {
				deferredWork.task.then((deferredResult) => {
					updateTracker.finishUpdate(begin.update, { completed: deferredResult.kind !== "failed-retryable" });
				}).catch(() => {
					updateTracker.finishUpdate(begin.update, { completed: false });
				});
				return;
			}
			if (result?.kind === "failed-retryable" && isTelegramSpooledReplayUpdate(ctx.update)) throw new TelegramSpooledReplayProcessingError(result.error);
			updateTracker.finishUpdate(begin.update, { completed: true });
		} catch (error) {
			updateTracker.finishUpdate(begin.update, { completed: false });
			throw error;
		}
	});
	bot.use(async (ctx, next) => {
		const callback = ctx.callbackQuery;
		if (callback) {
			const answerPromise = takeTelegramCallbackQueryAdmissionAnswer(bot, callback.id) ?? startTelegramCallbackQueryAnswer(bot, callback.id, false);
			setTelegramCallbackQueryAnswerPromise(ctx, answerPromise);
			answerPromise.catch(() => {});
		}
		await next();
	});
	bot.use(async (ctx, next) => {
		try {
			await prepareTelegramPollAnswerContextAsync({
				update: ctx.update,
				accountId: account.accountId
			});
		} catch (error) {
			if (isTelegramSpooledReplayUpdate(ctx.update)) {
				recordTelegramMessageProcessingResult({
					kind: "failed-retryable",
					error
				});
				return;
			}
			throw error;
		}
		await next();
	});
	bot.use(createTelegramSequentializer());
	bot.use(async (ctx, next) => {
		await settleTelegramPollAnswerContext({
			update: ctx.update,
			accountId: account.accountId
		});
		await next();
	});
	const rawUpdateLogger = createSubsystemLogger("gateway/channels/telegram/raw-update");
	bot.use(async (ctx, next) => {
		if (shouldLogVerbose()) try {
			rawUpdateLogger.debug(`telegram update: ${formatTelegramRawUpdateForLog(ctx.update)}`);
		} catch (err) {
			rawUpdateLogger.debug(`telegram update log failed: ${String(err)}`);
		}
		await next();
	});
	const nativeEnabled = resolveNativeCommandsEnabled({
		providerId: "telegram",
		providerSetting: telegramCfg.commands?.native,
		globalSetting: cfg.commands?.native
	});
	const nativeSkillsEnabled = resolveNativeSkillsEnabled({
		providerId: "telegram",
		providerSetting: telegramCfg.commands?.nativeSkills,
		globalSetting: cfg.commands?.nativeSkills
	});
	const mediaMaxBytes = (opts.mediaMaxMb ?? telegramCfg.mediaMaxMb ?? 100) * 1024 * 1024;
	const logger = getChildLogger({ module: "telegram-auto-reply" });
	const resolveGroupPolicy = (chatId, turnCfg) => resolveChannelGroupPolicy({
		cfg: turnCfg,
		channel: "telegram",
		accountId: account.accountId,
		groupId: String(chatId)
	});
	const resolveGroupActivation = async (params) => {
		const agentId = params.agentId ?? ownerAgentId;
		const storePath = telegramDeps.resolveStorePath(params.cfg.session?.store, { agentId });
		try {
			const storedActivation = (await telegramDeps.getSessionEntryAsync?.({
				storePath,
				sessionKey: params.sessionKey
			}))?.groupActivation;
			if (storedActivation === "always") return false;
			if (storedActivation === "mention") return true;
		} catch (err) {
			logVerbose(`Failed to load session for activation check: ${String(err)}`);
		}
	};
	const resolveGroupRequireMention = (chatId, turnCfg) => resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(turnCfg, "telegram", account.accountId),
		path: [String(chatId)],
		requireMentionOverride: opts.requireMention,
		overrideOrder: "after-config"
	});
	const resolveTelegramGroupConfig = (chatId, messageThreadId, turnCfg) => {
		const turnTelegramCfg = resolveTelegramAccount({
			cfg: turnCfg,
			accountId: account.accountId
		}).config;
		return resolveTelegramScopedGroupConfig(turnTelegramCfg, chatId, messageThreadId);
	};
	const botContext = {
		bot,
		runtime,
		opts: runtimeOpts,
		telegramDeps,
		resolveTelegramGroupConfig
	};
	const { nativeCommandNames, nativeCommandCallbackDispatcher } = await registerTelegramNativeCommands({
		...botContext,
		cfg,
		accountId: account.accountId,
		telegramCfg,
		mediaMaxBytes,
		nativeEnabled,
		nativeSkillsEnabled,
		resolveGroupPolicy,
		shouldSkipUpdate,
		telegramDeps: {
			...telegramDeps,
			sendMessageTelegram: defaultTelegramNativeCommandDeps.sendMessageTelegram
		}
	});
	const messageContext = {
		...botContext,
		nativeCommandNames,
		logger,
		resolveGroupActivation,
		resolveGroupRequireMention
	};
	const processMessage = createTelegramMessageProcessor({
		...messageContext,
		telegramTransport,
		account,
		sendChatActionHandler,
		buildContext: opts.buildContext
	});
	createTelegramHandlers({
		...messageContext,
		cfg,
		accountId: account.accountId,
		ownerAgentId,
		telegramTransport,
		mediaMaxBytes,
		telegramCfg,
		resolveGroupPolicy,
		shouldSkipUpdate,
		processMessage
	}).register(nativeCommandCallbackDispatcher);
	const originalStop = bot.stop.bind(bot);
	const threadBindingManager = threadBindingPolicy.enabled ? await createTelegramThreadBindingManager({
		cfg,
		accountId: account.accountId,
		idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel(threadBindingScope),
		maxAgeMs: resolveThreadBindingMaxAgeMsForChannel(threadBindingScope)
	}) : null;
	let bindingOwnerStopped = false;
	const disabledBindingAdapter = threadBindingManager ? void 0 : {
		version: 2,
		assertCurrent: () => {
			if (bindingOwnerStopped) throw new Error("Telegram thread binding manager was retired");
		},
		channel: "telegram",
		accountId: account.accountId,
		capabilities: {
			bindSupported: false,
			unbindSupported: false,
			placements: []
		},
		touchAsync: async () => {},
		listBySessionAsync: async () => [],
		resolveByConversationAsync: async () => null,
		inspectByConversationAsync: async () => null,
		inspectByConversationsAsync: async (refs) => ({
			bindings: refs.map(() => null),
			assertCurrent: () => {
				if (bindingOwnerStopped) throw new Error("Telegram thread binding manager was retired");
			}
		}),
		listBySession: () => [],
		resolveByConversation: () => null
	};
	bot.stop = (async (...args) => {
		if (disabledBindingAdapter) {
			bindingOwnerStopped = true;
			unregisterSessionBindingAdapter({
				channel: "telegram",
				accountId: account.accountId,
				adapter: disabledBindingAdapter
			});
		}
		try {
			return await originalStop(...args);
		} finally {
			await threadBindingManager?.stop();
		}
	});
	if (disabledBindingAdapter) registerSessionBindingAdapterV2(disabledBindingAdapter);
	return bot;
}
//#endregion
//#region extensions/telegram/src/bot.ts
function createTelegramBot(opts) {
	return createTelegramBotCore({
		...opts,
		telegramDeps: opts.telegramDeps ?? defaultTelegramBotDeps
	});
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-spool.payload.ts
var TelegramIngressPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "TelegramIngressPayloadError";
	}
};
//#endregion
//#region extensions/telegram/src/telegram-ingress-non-retryable.ts
const MISSING_AGENT_HARNESS_ERROR_NAME = "MissingAgentHarnessError";
const MISSING_AGENT_HARNESS_MESSAGE_RE = /Requested agent harness "[^"]+" is not registered\./u;
const TELEGRAM_UNREACHABLE_RECIPIENT_RE = /\b403\b[\s\S]*\b(?:bot was blocked by the user|bot was kicked|user is deactivated)\b/iu;
/** Channel-owned non-retryable predicate for the core ingress drain. */
function resolveTelegramIngressNonRetryableFailure(err) {
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, current.error])) {
		const message = formatErrorMessage(candidate);
		if (candidate instanceof TelegramIngressPayloadError) return {
			reason: "invalid-event",
			message
		};
		if (candidate instanceof TelegramMessageDispatchReplayForgetError) return {
			reason: "dispatch-dedupe-rollback-failed",
			message
		};
		if (typeof candidate === "object" && candidate !== null && "reason" in candidate && "retryable" in candidate && readErrorName(candidate) === "SessionWorkStartError" && candidate.reason === "archived" && candidate.retryable === false) return {
			reason: "session-archived",
			message
		};
		if (TELEGRAM_UNREACHABLE_RECIPIENT_RE.test(message)) return {
			reason: "recipient-unreachable",
			message
		};
		if (readErrorName(candidate) === MISSING_AGENT_HARNESS_ERROR_NAME || MISSING_AGENT_HARNESS_MESSAGE_RE.test(message)) return {
			reason: "missing-agent-harness",
			message
		};
	}
	return null;
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-supersede-auth.ts
function extractUpdateSenderFacts(update) {
	if (!update || typeof update !== "object") return null;
	const root = update;
	let message;
	for (const key of [
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	]) {
		const candidate = root[key];
		if (candidate && typeof candidate === "object") {
			message = candidate;
			break;
		}
	}
	let from = message?.from;
	if (!message) {
		const callback = root.callback_query;
		if (callback && typeof callback === "object") {
			const cb = callback;
			const sender = cb.from;
			const msg = cb.message;
			if (sender && typeof sender === "object" && msg && typeof msg === "object") {
				message = msg;
				from = sender;
			}
		}
	}
	const chat = message?.chat;
	if (!message || typeof chat?.id !== "number" || typeof from?.id !== "number") return null;
	const chatType = typeof chat.type === "string" ? chat.type : "private";
	return {
		senderId: String(from.id),
		chatId: chat.id,
		isGroup: chatType !== "private",
		message
	};
}
/** Ambient room_event-shaped updates (no user text body) stay supersedable. */
function isTelegramAmbientSpooledUpdate(update) {
	if (!update || typeof update !== "object") return false;
	const root = update;
	return root.message_reaction != null || root.message_reaction_count != null || root.chat_member != null || root.my_chat_member != null || root.chat_join_request != null || root.chat_boost != null || root.removed_chat_boost != null;
}
/**
* Whether the raw update's sender is command-authorized.
* Reuses resolveTelegramGroupAllowFromContext — same group/topic allowFrom
* overrides and access-group expansion as normal message ingress.
*/
async function isTelegramSpooledUpdateSenderAuthorized(update, auth) {
	const facts = extractUpdateSenderFacts(update);
	if (!facts) return false;
	const accountCfg = mergeTelegramAccountConfig(auth.cfg, auth.accountId);
	const dmPolicy = accountCfg.dmPolicy ?? "pairing";
	const allowFrom = accountCfg.allowFrom;
	const groupAllowFrom = accountCfg.groupAllowFrom ?? accountCfg.allowFrom;
	const threadSpec = resolveTelegramMessageThreadSpec(facts.message);
	const groupAllowContext = await resolveTelegramGroupAllowFromContext({
		cfg: auth.cfg,
		chatId: facts.chatId,
		accountId: auth.accountId,
		dmPolicy,
		allowFrom,
		senderId: facts.senderId,
		isGroup: facts.isGroup,
		threadSpec,
		groupAllowFrom,
		resolveTelegramGroupConfig: (chatId, messageThreadId, cfg) => {
			const telegramCfg = mergeTelegramAccountConfig(cfg, auth.accountId);
			return resolveTelegramScopedGroupConfig(telegramCfg, chatId, messageThreadId);
		}
	});
	const { resolvedThreadId, storeAllowFrom, groupAllowOverride, effectiveGroupAllow } = groupAllowContext;
	if (facts.isGroup && resolveTelegramEffectiveGroupPolicy({
		cfg: auth.cfg,
		telegramCfg: accountCfg,
		groupConfig: groupAllowContext.groupConfig,
		topicConfig: groupAllowContext.topicConfig
	}) === "disabled") return false;
	const dmAllow = await resolveTelegramDmAllow({
		cfg: auth.cfg,
		groupAllowOverride,
		allowFrom,
		accountId: auth.accountId,
		senderId: facts.senderId,
		storeAllowFrom: facts.isGroup ? [] : storeAllowFrom,
		dmPolicy
	});
	return (await resolveTelegramCommandIngressAuthorization({
		accountId: auth.accountId,
		cfg: auth.cfg,
		dmPolicy,
		isGroup: facts.isGroup,
		chatId: facts.chatId,
		...resolvedThreadId !== void 0 ? { resolvedThreadId } : {},
		senderId: facts.senderId,
		effectiveDmAllow: dmAllow.effectiveAllow,
		effectiveGroupAllow,
		eventKind: "message",
		allowTextCommands: true,
		hasControlCommand: true,
		modeWhenAccessGroupsOff: "allow",
		includeDmAllowForGroupCommands: false
	})).authorized;
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-supersede.ts
function* telegramUpdateMessages(update) {
	const root = asOptionalObjectRecord(update);
	for (const key of [
		"message",
		"edited_message",
		"channel_post",
		"edited_channel_post"
	]) {
		const message = asOptionalObjectRecord(root?.[key]);
		if (message) yield message;
	}
}
function isTelegramSessionResetCommand(rawText, botUsername) {
	const alias = maybeResolveTextAlias(normalizeCommandBody(rawText, botUsername ? { botUsername } : void 0));
	return alias === "/new" || alias === "/reset";
}
function extractUpdateText(update) {
	const root = asOptionalObjectRecord(update);
	for (const msg of telegramUpdateMessages(root)) {
		const text = readStringField(msg, "text") ?? readStringField(msg, "caption");
		if (text !== void 0) return text;
	}
	return readStringField(asOptionalObjectRecord(root?.callback_query), "data") ?? "";
}
/**
* Drain-level supersede predicate over raw spooled payloads.
* Authorization is resolved from the new event's numeric sender via the same
* ingress command gate as the old fence (CommandAuthorized).
*/
function createShouldSupersedeTelegramSpooledPending(auth) {
	const authorize = async (update) => {
		const cfg = auth.getConfig();
		return await isTelegramSpooledUpdateSenderAuthorized(update, {
			accountId: auth.accountId,
			cfg
		}) ? () => auth.getConfig() === cfg : false;
	};
	return async (newEvent, pendingEvent) => {
		const pendingUpdate = pendingEvent.payload.update;
		const newUpdate = newEvent.payload.update;
		if (isTelegramAmbientSpooledUpdate(pendingUpdate) && !isTelegramAmbientSpooledUpdate(newUpdate)) return await authorize(newUpdate);
		const text = extractUpdateText(newUpdate);
		if (!text) return false;
		const abortCommandOptions = auth.botUsername ? { botUsername: auth.botUsername } : { targetedCommandMode: "pre-identity" };
		if (!isAbortRequestText(text, abortCommandOptions) && !isTelegramSessionResetCommand(text, auth.botUsername)) return false;
		return await authorize(newUpdate);
	};
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-drain.ts
const TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV = "OPENCLAW_TELEGRAM_SPOOLED_HANDLER_TIMEOUT_MS";
const TELEGRAM_SPOOLED_DRAIN_START_LIMIT = 100;
const TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT = 1e3;
const TELEGRAM_SPOOLED_DRAIN_POLL_INTERVAL_MS = 500;
function resolveTelegramAdoptionStallTimeoutMs(params) {
	const candidates = [params.configured, Number(params.env?.[TELEGRAM_SPOOLED_HANDLER_TIMEOUT_ENV])];
	for (const candidate of candidates) {
		const timeoutMs = clampPositiveTimerTimeoutMs(candidate);
		if (timeoutMs !== void 0) return timeoutMs;
	}
	return DEFAULT_INGRESS_ADOPTION_STALL_MS;
}
function telegramSpooledLaneKey(update, botInfo) {
	return getTelegramSequentialKey({
		update,
		...botInfo ? { me: botInfo } : {}
	});
}
function requireTelegramSpooledUpdateId(update) {
	const updateId = resolveTelegramUpdateId$1(update);
	if (updateId === null) throw new TelegramIngressPayloadError("Telegram spooled update is missing numeric update_id.");
	return updateId;
}
function inspectTelegramSpooledUpdate(update, botInfo, claimedLaneKey) {
	const updateId = requireTelegramSpooledUpdateId(update);
	const derivedLaneKey = telegramSpooledLaneKey(update, botInfo);
	const preservePreIdentityControlLane = botInfo !== void 0 && claimedLaneKey?.endsWith(":control") === true && claimedLaneKey !== derivedLaneKey && claimedLaneKey === telegramSpooledLaneKey(update);
	return {
		eventId: telegramQueueEventId(updateId),
		laneKey: preservePreIdentityControlLane ? claimedLaneKey : derivedLaneKey
	};
}
function isNonemptyTelegramCallbackValue(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function isPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}
function canReconcileTelegramLegacyLane(params) {
	if (params.record.channelId !== "telegram" || params.record.accountId !== normalizeTelegramStateAccountId(params.accountId)) return false;
	const update = params.record.payload.update;
	if (!update || typeof update !== "object") return false;
	const candidate = update;
	const callback = candidate.callback_query;
	if (callback !== void 0) {
		if (!callback || typeof callback !== "object") return false;
		const senderId = callback.from?.id;
		const callbackMessage = callback.message;
		if (candidate.message !== void 0 || candidate.edited_message !== void 0 || candidate.channel_post !== void 0 || candidate.edited_channel_post !== void 0 || !isNonemptyTelegramCallbackValue(callback.id) || !isNonemptyTelegramCallbackValue(callback.data) || !fitsTelegramCallbackData(callback.data) || !isNonemptyTelegramCallbackValue(callback.chat_instance) || callback.inline_message_id !== void 0 || !isPositiveSafeInteger(senderId) || callback.from?.is_bot !== false || !params.botInfo || callbackMessage?.from?.id !== params.botInfo.id || callbackMessage.from.is_bot !== true || callbackMessage.business_connection_id !== void 0 || callbackMessage.guest_query_id !== void 0 || callbackMessage.sender_chat !== void 0 || callbackMessage.direct_messages_topic !== void 0 || !isPositiveSafeInteger(callbackMessage.date) || !isPositiveSafeInteger(callbackMessage.message_id)) return false;
	}
	const message = candidate.message ?? candidate.edited_message ?? candidate.channel_post ?? candidate.edited_channel_post ?? callback?.message;
	if (message == null) return false;
	const chatId = message?.chat?.id;
	const chatType = message?.chat?.type;
	const threadId = message?.message_thread_id;
	const callbackData = typeof callback?.data === "string" ? callback.data : void 0;
	const typedApproval = parseTelegramApprovalCallbackData(callbackData);
	const isPrivateChat = chatType === "private" && typeof chatId === "number" && chatId > 0;
	const isGroupChat = (chatType === "group" || chatType === "supergroup") && typeof chatId === "number" && chatId < 0;
	const hasValidThreadId = isPositiveSafeInteger(threadId);
	const forumFlag = resolveTelegramMessageForumFlagHint({
		chatType: chatType === "channel" || chatType === "group" || chatType === "private" || chatType === "supergroup" ? chatType : void 0,
		isForum: typeof message.chat?.is_forum === "boolean" ? message.chat.is_forum : void 0,
		isTopicMessage: typeof message.is_topic_message === "boolean" ? message.is_topic_message : void 0
	}) ?? (typeof chatId === "number" ? getCachedTelegramForumFlag(chatId) : void 0);
	const isForumGroup = isGroupChat && forumFlag === true;
	if (typeof chatId !== "number" || !Number.isSafeInteger(chatId)) return false;
	const baseLaneKey = `telegram:${chatId}`;
	if (callback === void 0 && params.derivedLaneKey === `${baseLaneKey}:control` && telegramSpooledLaneKey(update, params.botInfo) === params.derivedLaneKey) {
		if (!isPrivateChat && !isGroupChat && !(chatType === "channel" && chatId < 0) || threadId !== void 0 && !hasValidThreadId) return false;
		const thread = resolveTelegramMessageThreadSpec(message, forumFlag);
		const topicLaneKey = thread.id === void 0 ? void 0 : `${baseLaneKey}:topic:${thread.id}`;
		return params.storedLaneKey === baseLaneKey || params.storedLaneKey === topicLaneKey;
	}
	if ((typedApproval ? !isPrivateChat && !isGroupChat : !isPrivateChat && !isForumGroup) || !typedApproval && !hasValidThreadId && !isForumGroup || typedApproval && threadId !== void 0 && !hasValidThreadId) return false;
	const legacyThreadId = isGroupChat ? resolveTelegramForumThreadId({
		isForum: forumFlag,
		messageThreadId: hasValidThreadId ? threadId : void 0
	}) : hasValidThreadId ? threadId : void 0;
	const topicLaneKey = legacyThreadId ? `${baseLaneKey}:topic:${legacyThreadId}` : void 0;
	const canonicalLaneKey = typedApproval ? `${baseLaneKey}:approval` : isForumGroup || params.botInfo?.has_topics_enabled === true ? topicLaneKey : baseLaneKey;
	const previousLaneKey = canonicalLaneKey === baseLaneKey ? topicLaneKey : baseLaneKey;
	return (typedApproval ? params.storedLaneKey === baseLaneKey || params.storedLaneKey === topicLaneKey : !hasTelegramApprovalCallbackPrefix(callbackData) && !hasTelegramQuestionCallbackPrefix(callbackData) && params.storedLaneKey === previousLaneKey) && params.derivedLaneKey === canonicalLaneKey && telegramSpooledLaneKey(update, params.botInfo) === canonicalLaneKey;
}
/**
* Shared polling/webhook monitor over Telegram's channel-owned durable spool.
*
* The transports keep durable admission because offset advancement and webhook
* acknowledgement depend on that exact boundary; requestDrain() bridges the
* committed spool append into the shared pump.
*/
function createTelegramIngressMonitor(params) {
	const inspect = (update, context) => inspectTelegramSpooledUpdate(update, params.botInfo, context.phase === "claim" ? context.claimedLaneKey : void 0);
	return createChannelIngressMonitor({
		queue: params.queue,
		inspect,
		inspectAsync: async (update, context) => {
			if (context.phase === "admission" && isEligibleTelegramPollAnswerUpdate(update)) await prepareTelegramPollAnswerContextAsync({
				update,
				accountId: params.accountId
			});
			return inspect(update, context);
		},
		payload: {
			version: 1,
			serialize: (update, { receivedAt }) => {
				const updateId = requireTelegramSpooledUpdateId(update);
				const preparedPollAnswer = typeof update === "object" && update !== null ? getPreparedTelegramPollAnswer(update) : void 0;
				return {
					version: 1,
					updateId,
					receivedAt,
					update,
					...preparedPollAnswer ? { preparedPollAnswer } : {}
				};
			},
			deserialize: (payload) => {
				const update = payload.update;
				if (typeof update === "object" && update !== null) {
					recordTelegramUpdateReceivedAt(update, payload.receivedAt);
					if (payload.preparedPollAnswer) recordPreparedTelegramPollAnswer(update, payload.preparedPollAnswer);
				}
				return update;
			},
			encode: ({ body }) => body,
			decode: (payload) => ({
				version: payload.version,
				body: payload
			}),
			createClaimError: (kind, claim) => new TelegramIngressPayloadError(kind === "invalid-version" ? `Telegram ingress row ${claim.id} has an unsupported payload version.` : `Telegram ingress row ${claim.id} changed update identity.`)
		},
		deliver: async (update, lifecycle) => {
			const telegramLifecycle = lifecycle;
			try {
				const result = await runWithTelegramSpooledReplayUpdate(update, async () => {
					await settleTelegramPollAnswerContext({
						update,
						accountId: params.accountId
					});
					return await params.dispatch(update, telegramLifecycle);
				}, telegramLifecycle);
				const participant = result.deferredWork;
				if (participant) {
					const settleAfterOwnerAbort = async (error) => {
						if (error !== void 0 && resolveTelegramIngressNonRetryableFailure(error)?.reason === "dispatch-dedupe-rollback-failed") {
							await telegramLifecycle.onFailed(error);
							return;
						}
						await telegramLifecycle.onCancelled();
					};
					participant.task.then(async (terminal) => {
						if (participant.wasOwnerAbortedWhilePending() && terminal.kind !== "completed") {
							await settleAfterOwnerAbort(terminal.kind === "failed-retryable" ? terminal.error : void 0);
							return;
						}
						if (terminal.kind === "failed-retryable") {
							await telegramLifecycle.onFailed(terminal.error);
							return;
						}
						await lifecycle.onAdopted();
					}, async (error) => {
						if (participant.wasOwnerAbortedWhilePending()) {
							await settleAfterOwnerAbort(error);
							return;
						}
						await telegramLifecycle.onFailed(error instanceof Error ? error : new Error(String(error)));
					}).catch((error) => {
						params.onLog?.(`telegram ingress: deferred settlement failed for update ${resolveTelegramUpdateId$1(update) ?? "unknown"}: ${String(error)}`);
					});
					return { kind: "deferred" };
				}
				const outcome = result.value;
				if (outcome?.kind === "failed-retryable") return {
					kind: "failed-retryable",
					error: outcome.error
				};
				if (!outcome) params.onLog?.(`telegram ingress: update ${resolveTelegramUpdateId$1(update) ?? "unknown"} completed without a recorded processing outcome`);
				await lifecycle.onAdopted();
				return { kind: "completed" };
			} catch (error) {
				return {
					kind: "failed-retryable",
					error
				};
			}
		},
		pollIntervalMs: params.pollIntervalMs ?? TELEGRAM_SPOOLED_DRAIN_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e3,
			failedMaxEntries: 1e3
		},
		drain: {
			deferredLaneOccupancy: "release",
			adoptionStallTimeoutMs: params.adoptionStallTimeoutMs ?? 3e5,
			orderBy: "id",
			scanLimit: TELEGRAM_SPOOLED_DRAIN_SCAN_LIMIT,
			startLimit: TELEGRAM_SPOOLED_DRAIN_START_LIMIT,
			resolveNonRetryableFailure: resolveTelegramIngressNonRetryableFailure,
			shouldSupersedePending: createShouldSupersedeTelegramSpooledPending({
				getConfig: params.getConfig,
				accountId: params.accountId,
				...params.botInfo?.username ? { botUsername: params.botInfo.username } : {}
			}),
			deriveLaneKey: (record) => telegramSpooledLaneKey(record.payload.update, params.botInfo),
			reconcileStoredLaneKey: (record, storedLaneKey, derivedLaneKey) => canReconcileTelegramLegacyLane({
				record,
				storedLaneKey,
				derivedLaneKey,
				accountId: params.accountId,
				botInfo: params.botInfo
			}),
			...params.onLog ? { onLog: params.onLog } : {}
		},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		deferredClaims: "wait-on-stop",
		admissionMode: "while-running",
		createStoppedError: () => /* @__PURE__ */ new Error("Telegram ingress monitor is stopped."),
		...params.onDurableAdmission ? { onDurableAdmission: params.onDurableAdmission } : {},
		...params.onError ? { onError: params.onError } : {}
	});
}
//#endregion
//#region extensions/telegram/src/telegram-ingress-drain-factory.ts
/**
* One monitor for polling + webhook: channel-owned append, shared claim →
* dispatch with turnAdoptionLifecycle → complete at adoption.
*/
function createTelegramTransportIngressMonitor(params) {
	const queue = openTelegramIngressQueue(params);
	const adoptionStallTimeoutMs = resolveTelegramAdoptionStallTimeoutMs({
		configured: params.adoptionStallTimeoutMs,
		env: process.env
	});
	return createTelegramIngressMonitor({
		queue,
		getConfig: readRuntimeConfig,
		accountId: params.accountId,
		botInfo: params.botInfo,
		adoptionStallTimeoutMs,
		...params.pollIntervalMs === void 0 ? {} : { pollIntervalMs: params.pollIntervalMs },
		...params.onLog ? { onLog: params.onLog } : {},
		...params.onError ? { onError: params.onError } : {},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		onDurableAdmission: (update, context) => {
			const callbackQuery = isRecord(update) ? update.callback_query : void 0;
			if (!isRecord(callbackQuery)) return;
			const callbackQueryId = callbackQuery.id;
			if (typeof callbackQueryId !== "string" || callbackQueryId.trim().length === 0) return;
			startTelegramCallbackQueryAnswer(params.bot, callbackQueryId, context.isNew);
		},
		dispatch: async (update) => {
			const { result } = await runWithTelegramUpdateProcessingFrame(async () => {
				await params.bot.handleUpdate(update);
			});
			return result;
		}
	});
}
//#endregion
//#region extensions/telegram/src/transport-status.ts
function createTelegramStatusPublisher(mode, setStatus) {
	const disconnected = {
		mode,
		connected: false
	};
	return {
		noteStart() {
			setStatus?.({
				...disconnected,
				lastConnectedAt: null,
				lastEventAt: null,
				lastTransportActivityAt: null
			});
		},
		noteReady(at = Date.now()) {
			setStatus?.(channelReadyPatch({
				lastConnectedAt: at,
				lastEventAt: at,
				...mode === "polling" ? createTransportActivityStatusPatch(at) : {},
				mode
			}));
		},
		noteActivity(at = Date.now()) {
			setStatus?.({ lastEventAt: at });
		},
		noteRecovery() {
			setStatus?.({ lifecycle: "recovering" });
		},
		noteError(error, lifecycle) {
			setStatus?.({
				...disconnected,
				...lifecycle ? { lifecycle } : {},
				...lifecycle === "blocked" ? { terminalDisconnect: true } : {},
				lastError: error
			});
		},
		noteStop() {
			setStatus?.({ ...disconnected });
		}
	};
}
//#endregion
export { createTelegramBot as i, createTelegramTransportIngressMonitor as n, resolveTelegramAdoptionStallTimeoutMs as r, createTelegramStatusPublisher as t };
