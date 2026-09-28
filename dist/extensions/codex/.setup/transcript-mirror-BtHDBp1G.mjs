import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { t as readCodexAsyncQuestions } from "./async-questions-DdhOCwGi.mjs";
import { i as readUpstreamUserText, n as attachUpstreamUserText, r as readMirrorIdentity, t as attachCodexMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { t as projectBoundedCodexThreadHistory } from "./transcript-history-projection-ZZpkFkJ_.mjs";
import { a as fingerprintCodexMirrorSourceMessage, c as readCodexMirrorSourceFingerprint, i as buildCodexMirrorDedupeIdentity, n as attachCodexMirrorAttestation, r as attachCodexMirrorRunId, s as isMirroredAgentMessage, t as applyCodexTranscriptTaint } from "./transcript-mirror-attestation-CzM-94NC.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { deliverAgentHarnessUserInputPrompt, embeddedAgentLog, formatErrorMessage, projectAgentHarnessTranscriptMessageForDisplay, restorePreparedUserTurnOperationalMetaForRuntime, runAgentHarnessBeforeMessageWriteHook } from "openclaw/plugin-sdk/agent-harness-runtime";
import { withCodexSessionTranscriptMirrorWriteLock } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
import { publishSessionTranscriptUpdateByIdentity } from "openclaw/plugin-sdk/session-transcript-runtime";
//#region extensions/codex/src/app-server/transcript-mirror-write.ts
function readMirroredAssistantText(message) {
	return message?.role === "assistant" ? message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("\n") || void 0 : void 0;
}
async function mirror(params) {
	const messages = params.messages.filter(isMirroredAgentMessage);
	if (messages.length === 0) return {
		assistantMirrorIdentitiesOwned: [],
		anchorsByMirrorIdentity: /* @__PURE__ */ new Map(),
		messagesPresent: [],
		userMessageReceipts: []
	};
	const candidates = messages.map((message) => {
		const dedupeIdentity = buildCodexMirrorDedupeIdentity(message);
		const sourceFingerprint = fingerprintCodexMirrorSourceMessage(message);
		return {
			dedupeIdentity,
			idempotencyKey: (message.role === "user" ? normalizeOptionalString("idempotencyKey" in message ? message.idempotencyKey : void 0) : void 0) ?? (params.idempotencyScope ? `${params.idempotencyScope}:${dedupeIdentity}` : void 0),
			message,
			sourceFingerprint
		};
	});
	const candidateIdempotencyKeys = candidates.flatMap(({ idempotencyKey }) => idempotencyKey ? [idempotencyKey] : []);
	const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
	const assertWritable = () => {
		params.assertCurrent?.();
		params.assertWriteCurrent?.();
	};
	assertWritable();
	const mirrorBatch = await withCodexSessionTranscriptMirrorWriteLock({
		...transcriptTarget,
		config: params.config
	}, async (transcript) => {
		assertWritable();
		const nextAppendedUpdates = [];
		const nextAssistantMirrorIdentitiesOwned = /* @__PURE__ */ new Set();
		const nextAnchorsByMirrorIdentity = /* @__PURE__ */ new Map();
		const nextMessagesPresent = [];
		const nextUserMessageReceipts = [];
		const mirrorFacts = await transcript.readMessageFacts({ idempotencyKeys: candidateIdempotencyKeys });
		assertWritable();
		const taint = { tainted: false };
		for (const { dedupeIdentity, idempotencyKey, message, sourceFingerprint } of candidates) {
			const sourceMessage = applyCodexTranscriptTaint(message, taint);
			const mirrorIdentity = readMirrorIdentity(message);
			const ownsRun = Boolean(params.runId && (!params.runMirrorIdentityPrefix || mirrorIdentity?.startsWith(params.runMirrorIdentityPrefix)));
			const terminalOwner = params.terminalAssistantOwner;
			const ownsTerminal = Boolean(ownsRun && terminalOwner && mirrorIdentity === terminalOwner.mirrorIdentity);
			const ownedMessage = ownsRun && params.runId ? attachCodexMirrorRunId(sourceMessage, params.runId, ownsTerminal, terminalOwner?.settlementWarning) : sourceMessage;
			const transcriptMessage = {
				...attachCodexMirrorAttestation(ownedMessage, sourceFingerprint),
				...idempotencyKey ? { idempotencyKey } : {}
			};
			if (idempotencyKey && mirrorFacts.existingIdempotencyKeys.has(idempotencyKey)) {
				const persistedMessage = mirrorFacts.messagesByIdempotencyKey.get(idempotencyKey);
				const persistedAnchor = mirrorFacts.anchorsByIdempotencyKey.get(idempotencyKey);
				if (persistedMessage && isMirroredAgentMessage(persistedMessage)) {
					nextMessagesPresent.push(persistedMessage);
					if (persistedMessage.role === "user" && persistedAnchor) nextUserMessageReceipts.push({
						anchor: persistedAnchor,
						appended: false,
						message: persistedMessage
					});
				}
				if (persistedAnchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, persistedAnchor);
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			assertWritable();
			const preparedUserMessage = transcriptMessage.role === "user" ? {
				...transcriptMessage,
				__openclaw: { ...Reflect.get(transcriptMessage, "__openclaw") }
			} : void 0;
			if (preparedUserMessage?.["__openclaw"].humanMentions !== void 0) {
				preparedUserMessage.content = structuredClone(preparedUserMessage.content);
				preparedUserMessage["__openclaw"].humanMentions = structuredClone(preparedUserMessage["__openclaw"].humanMentions);
			}
			const asyncSourceText = message.role === "assistant" && message.openclawAsyncDelivery ? readMirroredAssistantText(message) : void 0;
			const nextMessage = runAgentHarnessBeforeMessageWriteHook({
				message: transcriptMessage,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				skipBeforeMessageWriteHooks: params.skipBeforeMessageWriteHooks,
				prepareAssistantTranscriptMessage: ownsTerminal ? params.prepareAssistantTranscriptMessage : void 0
			});
			if (!nextMessage) {
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			const restoredMessage = restorePreparedUserTurnOperationalMetaForRuntime({
				runtimeMessage: nextMessage,
				preparedMessage: preparedUserMessage
			});
			let messageToAppend = idempotencyKey ? {
				...attachCodexMirrorAttestation(restoredMessage, sourceFingerprint),
				idempotencyKey
			} : attachCodexMirrorAttestation(restoredMessage, sourceFingerprint);
			if (mirrorIdentity) messageToAppend = attachCodexMirrorIdentity(messageToAppend, mirrorIdentity);
			if (ownsRun && params.runId) messageToAppend = attachCodexMirrorRunId(messageToAppend, params.runId, ownsTerminal, terminalOwner?.settlementWarning);
			if (message.role === "assistant" && message.openclawAsyncDelivery) {
				const questions = isMirroredAgentMessage(messageToAppend) && readMirroredAssistantText(messageToAppend) === asyncSourceText ? readCodexAsyncQuestions(messageToAppend.openclawAsyncDelivery?.questions) : void 0;
				messageToAppend = Object.assign(messageToAppend, { openclawAsyncDelivery: {
					itemId: message.openclawAsyncDelivery.itemId,
					...questions ? { questions } : {}
				} });
			}
			messageToAppend = applyCodexTranscriptTaint(messageToAppend, taint);
			messageToAppend = projectAgentHarnessTranscriptMessageForDisplay({
				hidden: message.display === false,
				message: messageToAppend
			});
			assertWritable();
			const { lifecycleRevision, messageSeq, result: appended } = await transcript.appendMessageWithMessageSequence({
				message: messageToAppend,
				...params.assertCurrent || params.assertWriteCurrent ? { prepareMessageAfterIdempotencyCheck: (preparedMessage) => {
					assertWritable();
					return preparedMessage;
				} } : {},
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
			params.assertCurrent?.();
			if (!appended) continue;
			const { messageId, message: appendedMessage } = appended;
			if (isMirroredAgentMessage(appendedMessage)) {
				nextMessagesPresent.push(appendedMessage);
				if (idempotencyKey) mirrorFacts.messagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
			}
			if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
			if (appended.anchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, appended.anchor);
			if (appendedMessage.role === "user" && appended.anchor) nextUserMessageReceipts.push({
				anchor: appended.anchor,
				appended: appended.appended,
				message: appendedMessage
			});
			if (appended.appended) nextAppendedUpdates.push({
				lifecycleRevision,
				messageId,
				message: appendedMessage,
				...messageSeq !== void 0 ? { messageSeq } : {}
			});
			if (idempotencyKey) {
				mirrorFacts.existingIdempotencyKeys.add(idempotencyKey);
				if (appended.anchor) mirrorFacts.anchorsByIdempotencyKey.set(idempotencyKey, appended.anchor);
			}
		}
		return {
			appendedUpdates: nextAppendedUpdates,
			assistantMirrorIdentitiesOwned: [...nextAssistantMirrorIdentitiesOwned],
			anchorsByMirrorIdentity: nextAnchorsByMirrorIdentity,
			messagesPresent: nextMessagesPresent,
			userMessageReceipts: nextUserMessageReceipts
		};
	});
	params.assertCurrent?.();
	const { appendedUpdates, ...result } = mirrorBatch;
	for (const update of appendedUpdates) try {
		const terminalOwner = params.terminalAssistantOwner;
		const terminalRunId = update.message.role === "assistant" && terminalOwner && readMirrorIdentity(update.message) === terminalOwner.mirrorIdentity ? terminalOwner.runId : void 0;
		await publishSessionTranscriptUpdateByIdentity({
			...transcriptTarget,
			update: {
				lifecycleRevision: update.lifecycleRevision,
				...params.agentId ? { agentId: params.agentId } : {},
				message: update.message,
				messageId: update.messageId,
				...update.messageSeq !== void 0 ? { messageSeq: update.messageSeq } : {},
				...terminalRunId ? { runId: terminalRunId } : {},
				sessionKey: transcriptTarget.sessionKey
			}
		});
	} catch (error) {
		embeddedAgentLog.warn("failed to publish codex app-server transcript update", { error: formatErrorMessage(error) });
	}
	return result;
}
function resolveCodexMirrorTranscriptTarget(params) {
	const sessionKey = params.sessionKey?.trim();
	const storePath = params.storePath?.trim();
	if (!sessionKey || !storePath) throw new Error("Codex transcript mirror requires a runtime session identity");
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		sessionKey,
		storePath
	};
}
//#endregion
//#region extensions/codex/src/app-server/user-prompt-message.ts
function buildSenderLabel(params) {
	const label = params.senderName ?? params.senderUsername ?? params.senderE164 ?? params.senderId;
	if (!label) return;
	return !params.senderId || label.includes(params.senderId) ? label : `${label} (${params.senderId})`;
}
function buildFromPrepared(params, preparedUserMessage) {
	const senderId = normalizeOptionalString(params.senderId);
	const senderName = normalizeOptionalString(params.senderName);
	const senderUsername = normalizeOptionalString(params.senderUsername);
	const senderE164 = normalizeOptionalString(params.senderE164);
	const senderLabel = buildSenderLabel({
		senderId,
		senderName,
		senderUsername,
		senderE164
	});
	const sourceChannel = normalizeOptionalString(params.inputProvenance?.sourceChannel ?? params.messageChannel ?? params.messageProvider);
	return {
		role: "user",
		timestamp: Date.now(),
		...params.inputProvenance ? { provenance: params.inputProvenance } : {},
		...sourceChannel ? { sourceChannel } : {},
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...senderLabel ? { senderLabel } : {},
		...preparedUserMessage ?? { content: params.transcriptPrompt ?? params.prompt }
	};
}
function buildCodexUserPromptMessage(params) {
	return buildFromPrepared(params, params.userTurnTranscriptRecorder?.message);
}
function buildCodexUpstreamPromptMessage(params, identity, upstreamUserText) {
	const message = attachCodexMirrorIdentity(buildCodexUserPromptMessage(params), identity);
	return upstreamUserText ? attachUpstreamUserText(message, upstreamUserText) : message;
}
function promptSnapshot(params, turnId, upstreamUserText) {
	return params.suppressNextUserMessagePersistence ? [] : [buildCodexUpstreamPromptMessage(params, `${turnId}:prompt`, upstreamUserText)];
}
async function buildResolvedCodexUserPromptMessage(params) {
	return buildFromPrepared(params, await params.userTurnTranscriptRecorder?.resolveMessage() ?? params.userTurnTranscriptRecorder?.message);
}
async function resolveFinalCodexMirrorMessages(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.userTurnTranscriptRecorder) return params.messagesSnapshot;
	const previousPrompt = params.messagesSnapshot.find((message) => message.role === "user");
	const resolvedBase = attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`);
	const upstreamUserText = readUpstreamUserText(previousPrompt);
	const resolvedPrompt = upstreamUserText ? attachUpstreamUserText(resolvedBase, upstreamUserText) : resolvedBase;
	const firstUserIndex = params.messagesSnapshot.findIndex((message) => message.role === "user");
	if (firstUserIndex === -1) return [resolvedPrompt, ...params.messagesSnapshot];
	const messages = params.messagesSnapshot.slice();
	messages[firstUserIndex] = resolvedPrompt;
	return messages;
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror.ts
var transcript_mirror_exports = /* @__PURE__ */ __exportAll({
	codexTranscriptMirrorRuntime: () => codexTranscriptMirrorRuntime,
	createCodexAppServerUserMessagePersistenceNotifier: () => createCodexAppServerUserMessagePersistenceNotifier,
	importCodexThreadHistoryToTranscript: () => importCodexThreadHistoryToTranscript,
	mirrorPromptAtTurnStartBestEffort: () => mirrorPromptAtTurnStartBestEffort,
	projectBoundedCodexThreadHistory: () => projectBoundedCodexThreadHistory
});
/** Imports a bounded, user-visible Codex history tail into a new OpenClaw transcript. */
async function importCodexThreadHistoryToTranscript(params) {
	const { transcriptMessages, importedMessages, omittedMessages } = projectBoundedCodexThreadHistory({
		thread: params.thread,
		throughTurnId: params.throughTurnId,
		importedAt: Date.now(),
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	if (transcriptMessages.length > 0) await mirror({
		assertCurrent: params.assertCurrent,
		storePath: params.storePath,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		messages: transcriptMessages,
		idempotencyScope: `codex-app-server:${params.thread.id}:history`
	});
	return {
		importedMessages,
		omittedMessages
	};
}
async function mirrorBestEffort(params) {
	if (!params.params.sessionTarget) return {
		assistantTranscriptOwned: false,
		mirroredMessages: []
	};
	try {
		const messages = await resolveFinalCodexMirrorMessages({
			params: params.params,
			messagesSnapshot: params.result.messagesSnapshot,
			turnId: params.turnId
		});
		const recorder = params.params.userTurnTranscriptRecorder;
		const admittedPromptIdentity = recorder?.getAdmissionReceipt() ? `${params.turnId}:prompt` : void 0;
		const admittedPrompt = admittedPromptIdentity ? recorder?.getPersistedMessage?.() : void 0;
		params.assertWriteCurrent?.();
		const mirrorResult = await mirror({
			assertWriteCurrent: params.assertWriteCurrent,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			storePath: params.params.sessionTarget?.storePath,
			cwd: params.cwd,
			messages: admittedPromptIdentity ? messages.filter((message) => readMirrorIdentity(message) !== admittedPromptIdentity) : messages,
			idempotencyScope: `codex-app-server:${params.threadId}`,
			runId: params.params.runId,
			runMirrorIdentityPrefix: `${params.turnId}:`,
			terminalAssistantOwner: params.params.deferTerminalLifecycle && params.result.terminal.kind === "failed" ? void 0 : {
				mirrorIdentity: `${params.turnId}:assistant`,
				runId: params.params.runId,
				settlementWarning: params.settlementWarning
			},
			prepareAssistantTranscriptMessage: params.params.prepareAssistantTranscriptMessage,
			config: params.params.config
		});
		for (const receipt of mirrorResult.userMessageReceipts) try {
			params.notifyUserMessagePersisted(receipt);
		} catch (error) {
			embeddedAgentLog.warn("failed to notify codex app-server user-message persistence", { error: formatErrorMessage(error) });
		}
		const expectedFingerprints = new Map(messages.flatMap((message) => {
			if (!isMirroredAgentMessage(message)) return [];
			const identity = readMirrorIdentity(message);
			return identity ? [[identity, fingerprintCodexMirrorSourceMessage(message)]] : [];
		}));
		const mirroredMessages = [...admittedPrompt ? [admittedPrompt] : [], ...mirrorResult.messagesPresent].filter((message) => {
			const identity = readMirrorIdentity(message);
			const expectedFingerprint = identity ? expectedFingerprints.get(identity) : void 0;
			return expectedFingerprint !== void 0 && readCodexMirrorSourceFingerprint(message) === expectedFingerprint;
		});
		const assistantMirrorIdentity = `${params.turnId}:assistant`;
		const assistantTranscriptMessage = mirroredMessages.find((message) => readMirrorIdentity(message) === assistantMirrorIdentity);
		const assistantTranscriptOwned = Boolean(assistantTranscriptMessage && mirrorResult.assistantMirrorIdentitiesOwned.includes(assistantMirrorIdentity));
		const assistantTranscriptIdempotencyKey = normalizeOptionalString(assistantTranscriptMessage?.idempotencyKey);
		const terminalMessage = mirroredMessages.at(-1);
		const terminalMirrorIdentity = terminalMessage ? readMirrorIdentity(terminalMessage) : void 0;
		const terminalAnchor = (terminalMirrorIdentity ? mirrorResult.anchorsByMirrorIdentity.get(terminalMirrorIdentity) : void 0) ?? params.params.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return {
			assistantTranscriptOwned,
			...assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey } : {},
			...terminalAnchor ? { terminalAnchor } : {},
			mirroredMessages
		};
	} catch (error) {
		embeddedAgentLog.warn("failed to mirror codex app-server transcript", {
			error: formatErrorMessage(error),
			runId: params.params.runId,
			sessionId: params.params.sessionId
		});
		return {
			assistantTranscriptOwned: false,
			mirroredMessages: []
		};
	}
}
function createCodexAppServerUserMessagePersistenceNotifier(runParams) {
	let notified = false;
	return (receipt) => {
		if (notified) return;
		notified = true;
		runParams.userTurnTranscriptRecorder?.markRuntimePersisted(receipt.message, receipt.anchor, receipt);
		try {
			runParams.onUserMessagePersisted?.(receipt.message);
		} catch (error) {
			embeddedAgentLog.warn("codex app-server user persistence notification failed", { error: formatErrorMessage(error) });
		}
	};
}
async function mirrorPromptAtTurnStartBestEffort(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.sessionTarget) return;
	try {
		const mirrorPromise = (async () => {
			const userPromptMessage = projectAgentHarnessTranscriptMessageForDisplay({
				hidden: params.params.trigger === "memory",
				inputProvenance: params.params.inputProvenance,
				message: attachUpstreamUserText(attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`), params.upstreamUserText)
			});
			const annotate = params.params.hostCapabilities.annotateCurrentUserTurn;
			if (annotate) await annotate({
				mirrorIdentity: `${params.turnId}:prompt`,
				upstreamUserText: params.upstreamUserText,
				mirrorOrigin: "codex-app-server",
				mirrorSourceFingerprint: fingerprintCodexMirrorSourceMessage(userPromptMessage)
			});
			const recorder = params.params.userTurnTranscriptRecorder;
			const admission = recorder?.getAdmissionReceipt();
			if (admission) {
				const message = recorder?.getPersistedMessage?.();
				if (message) {
					params.params.hostCapabilities.assertActive();
					params.notifyUserMessagePersisted({
						anchor: admission,
						appended: false,
						message
					});
				}
				return;
			}
			const mirrorResult = await mirror({
				assertCurrent: params.params.hostCapabilities.assertActive,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.params.sessionId,
				storePath: params.params.sessionTarget?.storePath,
				cwd: params.cwd,
				messages: [userPromptMessage],
				idempotencyScope: `codex-app-server:${params.threadId}`,
				runId: params.params.runId,
				runMirrorIdentityPrefix: `${params.turnId}:`,
				config: params.params.config
			});
			for (const receipt of mirrorResult.userMessageReceipts) params.notifyUserMessagePersisted(receipt);
		})();
		params.params.userTurnTranscriptRecorder?.markRuntimePersistencePending(mirrorPromise);
		await mirrorPromise;
	} catch (error) {
		embeddedAgentLog.warn("failed to mirror codex app-server prompt at turn start", {
			error: formatErrorMessage(error),
			runId: params.params.runId,
			sessionId: params.params.sessionId
		});
	}
}
async function deliverAsyncMessageBestEffort(params) {
	const mirrorIdentity = `${params.turnId}:async:${params.itemId}`;
	const deliveryIntentId = `block-reply:v1:codex-app-server:${[
		params.threadId,
		params.turnId,
		params.itemId
	].map(encodeURIComponent).join(":")}`;
	const target = params.params.sessionTarget;
	let text;
	if (target) {
		let result;
		try {
			result = await mirror({
				agentId: target.agentId ?? params.params.agentId,
				sessionId: target.sessionId ?? params.params.sessionId,
				sessionKey: target.sessionKey ?? params.params.sessionKey,
				storePath: target.storePath,
				cwd: params.cwd,
				config: params.params.config,
				messages: [attachCodexMirrorIdentity(params.message, mirrorIdentity)],
				idempotencyScope: `codex-app-server:${params.threadId}`,
				runId: params.params.runId,
				runMirrorIdentityPrefix: `${params.turnId}:`
			});
		} catch (error) {
			embeddedAgentLog.warn("failed to persist codex async agent message", {
				error: formatErrorMessage(error),
				itemId: params.itemId,
				runId: params.params.runId,
				threadId: params.threadId,
				turnId: params.turnId
			});
			return "retry";
		}
		if (!result.assistantMirrorIdentitiesOwned.includes(mirrorIdentity)) return "retry";
		text = readMirroredAssistantText(result.messagesPresent.find((message) => readMirrorIdentity(message) === mirrorIdentity));
	} else {
		if (!params.params.onBlockReply) return "retry";
		text = params.text;
	}
	if (params.params.onBlockReply && text !== void 0) try {
		await deliverAsyncBlockReply(params.params.onBlockReply, text, deliveryIntentId);
	} catch (error) {
		embeddedAgentLog.warn(target ? "failed to deliver persisted codex async agent message" : "failed to deliver codex async agent message", {
			error: formatErrorMessage(error),
			itemId: params.itemId,
			runId: params.params.runId,
			threadId: params.threadId,
			turnId: params.turnId
		});
		return "retry";
	}
	return "settled";
}
const codexTranscriptMirrorRuntime = {
	deliverAsyncMessageBestEffort,
	mirror,
	mirrorBestEffort
};
async function deliverAsyncBlockReply(onBlockReply, text, deliveryIntentId) {
	await deliverAgentHarnessUserInputPrompt({ onBlockReply: (payload) => onBlockReply(payload, { deliveryIntentId }) }, [], { intro: text });
}
//#endregion
export { transcript_mirror_exports as a, promptSnapshot as c, mirrorPromptAtTurnStartBestEffort as i, createCodexAppServerUserMessagePersistenceNotifier as n, buildCodexUserPromptMessage as o, importCodexThreadHistoryToTranscript as r, buildResolvedCodexUserPromptMessage as s, codexTranscriptMirrorRuntime as t };
