import { c as parseIMessageTarget, u as normalizeIMessageMessagingTarget } from "./targets-BicBiYsM.mjs";
import { o as resolveIMessageAccount } from "./accounts-evTpvJMv.mjs";
import { n as getCachedIMessagePrivateApiStatus } from "./message-tool-api-CqfRxLlT.mjs";
import { a as normalizeIMessageMessageId } from "./actions-DJqbUmbN.mjs";
import { d as getIMessageApprovalApprovers } from "./channel-CL73qdMG.mjs";
import { i as extractMarkdownFormatRuns } from "./sanitize-outbound-C0x4BPky.mjs";
import { a as unregisterIMessageApprovalReactionTarget, c as buildIMessageApprovalConversationKeyForTarget, i as registerIMessageApprovalReactionTarget } from "./approval-reactions-L9Ul7PAu.mjs";
import { a as iMessageApprovalPollTargets, c as iMessageApprovalControlBindings, i as buildApprovalPollOptions, o as mapSentPollOptionsToDecisions, t as sendMessageIMessage } from "./send-pkYwL6Rt.mjs";
import { createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalNativeControlsPromptText, buildApprovalReactionPendingContent } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { setTimeout } from "node:timers/promises";
import { buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalNativeRuntimeAdapter, resolvePreparedApprovalAccountId } from "openclaw/plugin-sdk/approval-handler-runtime";
//#region extensions/imessage/src/approval-handler.runtime.ts
const log = createSubsystemLogger("imessage/approvals");
const loadIMessageActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-DL5i-Y4J.mjs"), "imessageActionsRuntime");
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
function resolveIMessageApprovalCliOptions(params) {
	const account = resolveIMessageAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	});
	return {
		cliPath: account.config.cliPath?.trim() || "imsg",
		dbPath: account.config.dbPath?.trim() || void 0,
		timeoutMs: account.config.probeTimeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS
	};
}
async function deliverIMessageApprovalPoll(params) {
	const options = buildApprovalPollOptions({ allowedDecisions: params.allowedDecisions });
	try {
		const cliOptions = resolveIMessageApprovalCliOptions({
			cfg: params.cfg,
			target: params.target
		});
		const chatGuid = await resolveIMessageApprovalChatGuid({
			to: params.target.to,
			cliOptions
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
async function resolveIMessageApprovalChatGuid(params) {
	const target = parseIMessageTarget(params.to);
	if (target.kind === "chat_guid") return target.chatGuid;
	const runtime = await loadIMessageActionsRuntime();
	if (target.kind === "chat_id" || target.kind === "chat_identifier") return await runtime.resolveChatGuidForTarget({
		target,
		options: params.cliOptions,
		conversationReadOrigin: "direct-operator"
	});
	if (target.kind !== "handle") return null;
	const service = target.service === "sms" ? "SMS" : "iMessage";
	return await runtime.resolveChatGuidForTarget({
		target: {
			kind: "chat_identifier",
			chatIdentifier: `${service};-;${target.to}`
		},
		options: params.cliOptions,
		conversationReadOrigin: "direct-operator"
	});
}
async function recoverIMessageApprovalTextFallback(params) {
	try {
		return (await sendMessageIMessage(params.target.to, params.fallbackText, {
			config: params.cfg,
			approvalPrompt: params.approvalPrompt,
			conversationReadOrigin: "direct-operator",
			...params.target.accountId ? { accountId: params.target.accountId } : {},
			...params.promptMessageId ? { replyToId: params.promptMessageId } : {}
		})).guid;
	} catch (error) {
		log.error(`imessage approvals: text-fallback recovery failed: ${String(error)}`);
		return;
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
const imessageApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
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
			const bindingWindow = iMessageApprovalControlBindings.begin({
				accountId,
				conversation
			});
			try {
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
				const hintMessageId = expectPoll && !poll && !reactionFallbackVisible ? await recoverIMessageApprovalTextFallback({
					cfg,
					target: preparedTarget,
					promptMessageId: result.guid,
					fallbackText: pendingPayload.text,
					approvalPrompt
				}) : void 0;
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
			} finally {
				bindingWindow.close();
			}
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
