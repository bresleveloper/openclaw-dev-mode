import { c as parseIMessageTarget, d as normalizeIMessageMessagingTarget } from "./targets-B4oU7n-v.mjs";
import { o as resolveIMessageAccount } from "./accounts-DacCvDBt.mjs";
import { n as getCachedIMessagePrivateApiStatus } from "./message-tool-api-B5NfPnFL.mjs";
import { c as normalizeIMessageMessageId } from "./actions-FOjSVXxg.mjs";
import { d as getIMessageApprovalApprovers } from "./channel-BtDnHgzF.mjs";
import { i as extractMarkdownFormatRuns } from "./sanitize-outbound-BtEY324R.mjs";
import { a as unregisterIMessageApprovalReactionTarget, c as buildIMessageApprovalConversationKeyForTarget, i as registerIMessageApprovalReactionTarget } from "./approval-reactions-g1TDaSN2.mjs";
import { a as iMessageApprovalPollTargets, i as buildApprovalPollOptions, o as mapSentPollOptionsToDecisions, t as sendMessageIMessage } from "./send-D44ovNNq.mjs";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalNativeControlsPromptText, buildApprovalReactionPendingContent } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { setTimeout } from "node:timers/promises";
import { buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalNativeRuntimeAdapterAsync, resolvePreparedApprovalAccountId } from "openclaw/plugin-sdk/approval-handler-runtime";
//#region extensions/imessage/src/approval-handler.runtime.ts
const log = createSubsystemLogger("imessage/approvals");
const loadIMessageActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-Mh1ED1Pq.mjs"), "imessageActionsRuntime");
const DEFAULT_PROBE_TIMEOUT_MS = 5e3;
const APPROVAL_POLL_ORDERING_DELAY_MS = 1100;
function classifyIMessageApprovalTargetTransport(params) {
	const account = resolveIMessageAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	});
	const parsedTarget = parseIMessageTarget(params.target.to);
	if (parsedTarget.kind === "handle") {
		if (parsedTarget.service === "imessage" || parsedTarget.service === "sms") return parsedTarget.service;
		return account.config.service === "imessage" || account.config.service === "sms" ? account.config.service : "unknown";
	}
	const conversationId = parsedTarget.kind === "chat_guid" ? parsedTarget.chatGuid : parsedTarget.kind === "chat_identifier" ? parsedTarget.chatIdentifier : "";
	if (/^iMessage;/i.test(conversationId)) return "imessage";
	if (/^SMS;/i.test(conversationId)) return "sms";
	return "unknown";
}
function canIMessageApprovalUsePoll(params) {
	if (params.plannedTarget.surface !== "origin" && params.plannedTarget.surface !== "approver-dm") return false;
	if (buildApprovalPollOptions({ allowedDecisions: params.allowedDecisions }).length < 2) return false;
	try {
		const account = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: params.target.accountId
		});
		if (classifyIMessageApprovalTargetTransport({
			cfg: params.cfg,
			target: params.target
		}) === "sms") return false;
		if (!createActionGate(account.config.actions)("polls") || getIMessageApprovalApprovers({
			cfg: params.cfg,
			accountId: account.accountId
		}).length === 0) return false;
		const cliPath = account.config.cliPath?.trim() || "imsg";
		const status = getCachedIMessagePrivateApiStatus(cliPath);
		return status?.available === true && status?.selectors?.pollPayloadMessage === true && status.cliCapabilities?.pollSendSupportsNoComment === true;
	} catch {
		return false;
	}
}
async function deliverIMessageApprovalPoll(params) {
	const options = buildApprovalPollOptions({ allowedDecisions: params.allowedDecisions });
	try {
		const account = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: params.target.accountId
		});
		const cliOptions = {
			cliPath: account.config.cliPath?.trim() || "imsg",
			dbPath: account.config.dbPath?.trim() || void 0,
			timeoutMs: account.config.probeTimeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS
		};
		const target = parseIMessageTarget(params.target.to);
		let chatGuid;
		if (target.kind === "chat_guid") chatGuid = target.chatGuid;
		else chatGuid = await (await loadIMessageActionsRuntime()).resolveChatGuidForTarget({
			target: target.kind === "handle" ? {
				kind: "chat_identifier",
				chatIdentifier: `${target.service === "sms" ? "SMS" : "iMessage"};-;${target.to}`
			} : target,
			options: cliOptions,
			conversationReadOrigin: "direct-operator"
		});
		if (!chatGuid || /^SMS;/i.test(chatGuid)) return null;
		await setTimeout(APPROVAL_POLL_ORDERING_DELAY_MS);
		const sent = await (await loadIMessageActionsRuntime()).sendPoll({
			chatGuid,
			question: extractMarkdownFormatRuns(params.question).text,
			choices: options.map((option) => option.text),
			suppressComment: true,
			options: cliOptions
		});
		const pollGuid = normalizeIMessageMessageId(sent.messageId);
		const optionDecisions = mapSentPollOptionsToDecisions({
			requested: options,
			sent: sent.pollOptions
		});
		if (optionDecisions.length !== options.length) {
			log.error("imessage approvals: imsg poll response did not return a complete option mapping");
			await iMessageApprovalPollTargets.registerTombstone({
				accountId: resolveIMessageAccount({
					cfg: params.cfg,
					accountId: params.target.accountId
				}).accountId,
				conversation: { chatGuid },
				...pollGuid ? { pollGuid } : {},
				optionIds: sent.pollOptions.map((option) => option.id),
				approvalId: params.approvalId
			});
			return null;
		}
		const accountId = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: params.target.accountId
		}).accountId;
		if (!await iMessageApprovalPollTargets.register({
			accountId,
			conversation: { chatGuid },
			...pollGuid ? { pollGuid } : {},
			approvalId: params.approvalId,
			approvalKind: params.approvalKind,
			optionDecisions,
			expiresAtMs: params.expiresAtMs
		})) {
			await iMessageApprovalPollTargets.registerTombstone({
				accountId,
				conversation: { chatGuid },
				...pollGuid ? { pollGuid } : {},
				optionIds: optionDecisions.map(([optionId]) => optionId),
				approvalId: params.approvalId
			});
			log.error("imessage approvals: poll target could not be registered");
			return null;
		}
		return {
			...pollGuid ? { pollGuid } : {},
			chatGuid,
			optionDecisions
		};
	} catch (error) {
		log.warn(`imessage approvals: poll send failed, falling back to tapbacks: ${String(error)}`);
		return null;
	}
}
/** Clear both controls together; a stale binding would resolve a dead approval. */
async function clearIMessageApprovalBindings(entry) {
	const accountId = entry.accountId?.trim();
	if (!accountId) return;
	const deletions = [];
	for (const messageId of [entry.messageId, entry.hintMessageId]) if (messageId && (!entry.poll || entry.reactionFallbackVisible)) deletions.push(unregisterIMessageApprovalReactionTarget({
		accountId,
		conversation: entry.conversation,
		messageId
	}));
	if (entry.poll) deletions.push(iMessageApprovalPollTargets.unregister({
		accountId,
		conversation: entry.conversation,
		pollGuid: entry.poll.pollGuid,
		optionDecisions: entry.poll.optionDecisions
	}));
	await Promise.all(deletions);
}
function shouldThreadApprovalUpdate(to) {
	try {
		const parsed = parseIMessageTarget(to);
		if (parsed.kind === "handle" && parsed.service === "sms") return false;
	} catch {
		return true;
	}
	return true;
}
const eagerlyBoundApprovalEntries = /* @__PURE__ */ new WeakSet();
async function bindIMessageApprovalEntry(params) {
	const accountId = params.entry.accountId?.trim();
	if (!accountId) {
		log.error(`imessage approvals: refusing to bind reaction target for ${params.approvalId}; missing accountId in prepared entry`);
		return null;
	}
	const ttlMs = params.expiresAtMs - Date.now();
	if (ttlMs <= 0) {
		log.error(`imessage approvals: refusing to bind reaction target for ${params.approvalId}; approval already expired at bind time`);
		return null;
	}
	const reactionRegistrations = params.entry.poll && !params.entry.reactionFallbackVisible ? [] : [params.entry.messageId, params.entry.hintMessageId].filter((messageId) => Boolean(messageId)).map((messageId) => registerIMessageApprovalReactionTarget({
		accountId,
		conversation: params.entry.conversation,
		messageId,
		approvalId: params.approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions: params.allowedDecisions,
		ttlMs
	}));
	const pollRegistration = params.entry.poll ? params.pollTargetWasRegisteredDuringDelivery || iMessageApprovalPollTargets.register({
		accountId,
		conversation: params.entry.conversation,
		pollGuid: params.entry.poll.pollGuid,
		approvalId: params.approvalId,
		approvalKind: params.approvalKind,
		optionDecisions: params.entry.poll.optionDecisions,
		expiresAtMs: params.expiresAtMs
	}) : false;
	const [reactionTargets, pollBound] = await Promise.all([Promise.all(reactionRegistrations), pollRegistration]);
	return reactionTargets.some(Boolean) || pollBound ? true : null;
}
const imessageApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapterAsync({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: ({ context }) => Boolean(context),
		shouldHandle: ({ context }) => Boolean(context)
	},
	presentation: {
		buildPendingPayload: ({ request, nowMs, view }) => {
			const { reactionPayload } = buildApprovalReactionPendingContent({
				request,
				view,
				nowMs
			});
			return {
				text: reactionPayload.text ?? "",
				pollText: buildApprovalNativeControlsPromptText({
					view,
					nowMs
				}),
				allowedDecisions: reactionPayload.allowedDecisions
			};
		},
		buildResolvedResult: ({ request, resolved, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalResolvedText({
				request,
				resolved,
				view
			}) }
		}),
		buildExpiredResult: ({ request, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalExpiredText({
				request,
				view
			}) }
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget, accountId }) => {
			const to = normalizeIMessageMessagingTarget(plannedTarget.target.to);
			if (!to) return null;
			const prepared = {
				to,
				accountId: resolvePreparedApprovalAccountId({
					plannedAccountId: plannedTarget.target.accountId,
					contextAccountId: accountId
				})
			};
			return {
				dedupeKey: `${prepared.accountId ?? ""}:${buildChannelApprovalNativeTargetKey({ to: prepared.to })}`,
				target: prepared
			};
		},
		deliverPending: async ({ cfg, preparedTarget, plannedTarget, pendingPayload, view }) => {
			const expectPoll = canIMessageApprovalUsePoll({
				cfg,
				target: preparedTarget,
				plannedTarget,
				allowedDecisions: pendingPayload.allowedDecisions
			});
			const conversation = buildIMessageApprovalConversationKeyForTarget(preparedTarget.to);
			if (!conversation) return null;
			const accountId = resolveIMessageAccount({
				cfg,
				accountId: preparedTarget.accountId
			}).accountId;
			const targetTransport = expectPoll ? classifyIMessageApprovalTargetTransport({
				cfg,
				target: preparedTarget
			}) : "unknown";
			const reactionFallbackVisible = !expectPoll || targetTransport !== "imessage";
			const promptText = reactionFallbackVisible ? pendingPayload.text : pendingPayload.pollText;
			const approvalPrompt = {
				approvalId: view.approvalId,
				approvalKind: view.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions
			};
			const result = await sendMessageIMessage(preparedTarget.to, promptText, {
				config: cfg,
				...reactionFallbackVisible ? { approvalPrompt } : {},
				conversationReadOrigin: "direct-operator",
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {}
			});
			if (!result.guid) return null;
			const confirmedTransport = result.service ?? (result.chatGuid && /^iMessage;/i.test(result.chatGuid) ? "imessage" : result.chatGuid && /^SMS;/i.test(result.chatGuid) ? "sms" : targetTransport);
			const poll = expectPoll && confirmedTransport === "imessage" ? await deliverIMessageApprovalPoll({
				cfg,
				target: preparedTarget,
				approvalId: view.approvalId,
				approvalKind: view.approvalKind,
				expiresAtMs: view.expiresAtMs,
				question: pendingPayload.pollText,
				allowedDecisions: pendingPayload.allowedDecisions
			}) : null;
			let hintMessageId;
			if (expectPoll && !poll && !reactionFallbackVisible) try {
				hintMessageId = (await sendMessageIMessage(preparedTarget.to, pendingPayload.text, {
					config: cfg,
					approvalPrompt,
					conversationReadOrigin: "direct-operator",
					...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {},
					replyToId: result.guid
				})).guid;
			} catch (error) {
				log.error(`imessage approvals: text-fallback recovery failed: ${String(error)}`);
			}
			const entry = {
				accountId,
				to: preparedTarget.to,
				conversation: poll ? {
					...conversation,
					chatGuid: poll.chatGuid
				} : conversation,
				messageId: result.guid,
				...hintMessageId ? { hintMessageId } : {},
				...poll && reactionFallbackVisible ? { reactionFallbackVisible: true } : {},
				...poll ? { poll: {
					...poll.pollGuid ? { pollGuid: poll.pollGuid } : {},
					optionDecisions: poll.optionDecisions
				} } : {}
			};
			if (await bindIMessageApprovalEntry({
				entry,
				approvalId: view.approvalId,
				approvalKind: view.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions,
				expiresAtMs: view.expiresAtMs,
				pollTargetWasRegisteredDuringDelivery: Boolean(entry.poll)
			})) eagerlyBoundApprovalEntries.add(entry);
			return entry;
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await sendMessageIMessage(entry.to, payload.text, {
				config: cfg,
				conversationReadOrigin: "direct-operator",
				...entry.accountId ? { accountId: entry.accountId } : {},
				...shouldThreadApprovalUpdate(entry.to) ? { replyToId: entry.messageId } : {}
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, view, pendingPayload }) => {
			if (eagerlyBoundApprovalEntries.delete(entry)) return true;
			return bindIMessageApprovalEntry({
				entry,
				approvalId: request.id,
				approvalKind: view.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions,
				expiresAtMs: view.expiresAtMs
			});
		},
		unbindPending: ({ entry }) => clearIMessageApprovalBindings(entry),
		cancelDelivered: ({ entry }) => clearIMessageApprovalBindings(entry)
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`imessage approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { imessageApprovalNativeRuntime };
