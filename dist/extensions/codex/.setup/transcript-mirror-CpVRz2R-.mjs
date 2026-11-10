import { t as readCodexAsyncQuestions } from "./async-questions-DdhOCwGi.mjs";
import { a as readUpstreamUserText, i as readMirrorIdentity, n as attachCodexMirrorIdentity, o as takeCodexAssistantItemIds, r as attachUpstreamUserText } from "./upstream-prompt-provenance-Ccd9MFRJ.mjs";
import { t as projectBoundedCodexThreadHistory } from "./transcript-history-projection-i-FVpyha.mjs";
import { a as buildCodexMirrorIdempotencyKey, c as isMirroredAgentMessage, i as buildCodexMirrorDedupeIdentity, l as readCodexMirrorSourceFingerprint, n as attachCodexMirrorAttestation, o as fingerprintCodexMirrorSourceMessage, r as attachCodexMirrorRunId, t as applyCodexTranscriptTaint } from "./transcript-mirror-attestation-BzUXnrvv.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { deliverAgentHarnessUserInputPrompt, embeddedAgentLog, formatErrorMessage, projectAgentHarnessTranscriptMessageForDisplay, restorePreparedUserTurnOperationalMetaForRuntime, runAgentHarnessBeforeMessageWriteHook } from "openclaw/plugin-sdk/agent-harness-runtime";
import { withCodexSessionTranscriptMirrorWrite } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
import { composeSessionTranscriptWriteAssertion, publishSessionTranscriptUpdateByIdentity } from "openclaw/plugin-sdk/session-transcript-runtime";
import { createNativeSessionBindingScope } from "openclaw/plugin-sdk/agent-harness-session-runtime";
//#region extensions/codex/src/app-server/user-prompt-message.ts
function buildFromPrepared(params, preparedUserMessage) {
	const senderId = normalizeOptionalString(params.senderId);
	const senderName = normalizeOptionalString(params.senderName);
	const senderUsername = normalizeOptionalString(params.senderUsername);
	const senderE164 = normalizeOptionalString(params.senderE164);
	const label = senderName ?? senderUsername ?? senderE164 ?? senderId;
	const senderLabel = label && senderId && !label.includes(senderId) ? `${label} (${senderId})` : label;
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
function promptSnapshot(params, turnId, upstreamUserText) {
	if (params.suppressNextUserMessagePersistence) return [];
	const message = attachCodexMirrorIdentity(buildCodexUserPromptMessage(params), `${turnId}:prompt`);
	return [upstreamUserText ? attachUpstreamUserText(message, upstreamUserText) : message];
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
	const candidates = messages.map((source) => {
		const message = { ...source };
		const assistantItemIds = takeCodexAssistantItemIds(message);
		const dedupeIdentity = buildCodexMirrorDedupeIdentity(message);
		const sourceFingerprint = fingerprintCodexMirrorSourceMessage(message);
		return {
			dedupeIdentity,
			idempotencyKey: (message.role === "user" ? normalizeOptionalString("idempotencyKey" in message ? message.idempotencyKey : void 0) : void 0) ?? (params.idempotencyScope ? buildCodexMirrorIdempotencyKey(params.idempotencyScope, dedupeIdentity) : void 0),
			message,
			sourceFingerprint,
			assistantItemIds
		};
	});
	const candidateIdempotencyKeys = candidates.flatMap(({ idempotencyKey }) => idempotencyKey ? [idempotencyKey] : []);
	const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
	const publishCommitted = async (update) => {
		try {
			const terminalOwner = params.terminalAssistantOwner;
			const terminalRunId = update.message.role === "assistant" && terminalOwner && readMirrorIdentity(update.message) === terminalOwner.mirrorIdentity ? terminalOwner.runId : void 0;
			await publishSessionTranscriptUpdateByIdentity({
				...transcriptTarget,
				update: {
					...update,
					...params.agentId ? { agentId: params.agentId } : {},
					...terminalRunId ? { runId: terminalRunId } : {},
					sessionKey: transcriptTarget.sessionKey
				}
			});
		} catch (error) {
			embeddedAgentLog.warn("failed to publish codex app-server transcript update", { error: formatErrorMessage(error) });
		}
	};
	const assertWritable = composeSessionTranscriptWriteAssertion([params.assertCurrent, params.assertWriteCurrent]);
	assertWritable();
	const result = await withCodexSessionTranscriptMirrorWrite({
		...transcriptTarget,
		config: params.config,
		...params.assertCurrent || params.assertWriteCurrent ? { assertCurrent: assertWritable } : {}
	}, async (transcript) => {
		assertWritable();
		const nextAssistantMirrorIdentitiesOwned = /* @__PURE__ */ new Set();
		const recordAssistantOwnership = (identity) => {
			nextAssistantMirrorIdentitiesOwned.add(identity);
			params.onAssistantMessageOwned?.(identity);
		};
		const nextAnchorsByMirrorIdentity = /* @__PURE__ */ new Map();
		const nextMessagesPresent = [];
		const nextUserMessageReceipts = [];
		const mirrorFacts = await transcript.readMessageFacts({ idempotencyKeys: candidateIdempotencyKeys });
		assertWritable();
		const taint = { tainted: false };
		for (const { dedupeIdentity, idempotencyKey, message, sourceFingerprint, assistantItemIds } of candidates) {
			const sourceMessage = applyCodexTranscriptTaint(message, taint);
			const mirrorIdentity = readMirrorIdentity(message);
			const ownsRun = Boolean(params.runId && (!params.runMirrorIdentityPrefix || mirrorIdentity?.startsWith(params.runMirrorIdentityPrefix)));
			const terminalOwner = params.terminalAssistantOwner;
			const ownsTerminal = Boolean(ownsRun && terminalOwner && mirrorIdentity === terminalOwner.mirrorIdentity);
			const withRunOwnership = (candidate) => ownsRun && params.runId ? attachCodexMirrorRunId(candidate, params.runId, ownsTerminal, terminalOwner?.settlementWarning) : candidate;
			const withAttestation = (candidate) => ({
				...attachCodexMirrorAttestation(candidate, sourceFingerprint),
				...idempotencyKey ? { idempotencyKey } : {}
			});
			const transcriptMessage = withAttestation(withRunOwnership(sourceMessage));
			if (idempotencyKey && mirrorFacts.existingIdempotencyKeys.has(idempotencyKey)) {
				const persistedMessage = mirrorFacts.messagesByIdempotencyKey.get(idempotencyKey);
				const persistedAnchor = mirrorFacts.anchorsByIdempotencyKey.get(idempotencyKey);
				if (persistedMessage && isMirroredAgentMessage(persistedMessage)) {
					nextMessagesPresent.push(persistedMessage);
					if (assistantItemIds && persistedAnchor && readCodexMirrorSourceFingerprint(persistedMessage) === sourceFingerprint) await publishCommitted({
						messageId: persistedAnchor.entryId,
						messageSeq: persistedAnchor.activeMessagePosition + 1,
						message: persistedMessage,
						assistantItemIds
					});
					if (persistedMessage.role === "user" && persistedAnchor) nextUserMessageReceipts.push({
						anchor: persistedAnchor,
						appended: false,
						message: persistedMessage
					});
				}
				if (persistedAnchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, persistedAnchor);
				if (message.role === "assistant") recordAssistantOwnership(dedupeIdentity);
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
				if (message.role === "assistant") recordAssistantOwnership(dedupeIdentity);
				continue;
			}
			let messageToAppend = withAttestation(restorePreparedUserTurnOperationalMetaForRuntime({
				runtimeMessage: nextMessage,
				preparedMessage: preparedUserMessage
			}));
			if (mirrorIdentity) messageToAppend = attachCodexMirrorIdentity(messageToAppend, mirrorIdentity);
			messageToAppend = withRunOwnership(messageToAppend);
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
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
			if (appended && message.role === "assistant") recordAssistantOwnership(dedupeIdentity);
			if (!appended) {
				params.assertCurrent?.();
				continue;
			}
			const { messageId, message: appendedMessage } = appended;
			if (isMirroredAgentMessage(appendedMessage)) {
				nextMessagesPresent.push(appendedMessage);
				if (idempotencyKey) mirrorFacts.messagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
			}
			if (appended.anchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, appended.anchor);
			if (appendedMessage.role === "user" && appended.anchor) nextUserMessageReceipts.push({
				anchor: appended.anchor,
				appended: appended.appended,
				message: appendedMessage
			});
			const committedItemIds = isMirroredAgentMessage(appendedMessage) && readCodexMirrorSourceFingerprint(appendedMessage) === sourceFingerprint ? assistantItemIds : void 0;
			if (appended.appended || committedItemIds) await publishCommitted({
				lifecycleRevision,
				messageId,
				message: appendedMessage,
				...messageSeq !== void 0 ? { messageSeq } : {},
				...committedItemIds ? { assistantItemIds: committedItemIds } : {}
			});
			params.assertCurrent?.();
			if (idempotencyKey) {
				mirrorFacts.existingIdempotencyKeys.add(idempotencyKey);
				if (appended.anchor) mirrorFacts.anchorsByIdempotencyKey.set(idempotencyKey, appended.anchor);
			}
		}
		return {
			assistantMirrorIdentitiesOwned: [...nextAssistantMirrorIdentitiesOwned],
			anchorsByMirrorIdentity: nextAnchorsByMirrorIdentity,
			messagesPresent: nextMessagesPresent,
			userMessageReceipts: nextUserMessageReceipts
		};
	});
	params.assertCurrent?.();
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
//#region extensions/codex/src/app-server/transcript-mirror.ts
var transcript_mirror_exports = /* @__PURE__ */ __exportAll({
	codexTranscriptMirrorRuntime: () => codexTranscriptMirrorRuntime,
	createCodexAppServerUserMessagePersistenceNotifier: () => createCodexAppServerUserMessagePersistenceNotifier,
	importCodexThreadHistoryToTranscript: () => importCodexThreadHistoryToTranscript,
	mirrorPromptAtTurnStartBestEffort: () => mirrorPromptAtTurnStartBestEffort
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
				assertCurrent: createNativeSessionBindingScope(params.params.hostCapabilities.assertActive).assertLegacyCurrent,
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
	const onBlockReply = params.params.onBlockReply;
	if (onBlockReply && text !== void 0) try {
		await deliverAgentHarnessUserInputPrompt({ onBlockReply: (payload) => onBlockReply(payload, { deliveryIntentId }) }, [], { intro: text });
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
//#endregion
export { transcript_mirror_exports as a, promptSnapshot as c, mirrorPromptAtTurnStartBestEffort as i, createCodexAppServerUserMessagePersistenceNotifier as n, buildCodexUserPromptMessage as o, importCodexThreadHistoryToTranscript as r, buildResolvedCodexUserPromptMessage as s, codexTranscriptMirrorRuntime as t };
