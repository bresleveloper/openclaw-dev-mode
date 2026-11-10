import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { n as createCronRunDiagnosticsFromError } from "./run-diagnostics-DHdTDo8H.mjs";
import { i as hasReplyChannelData } from "./payload-qyD1vby_.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { o as isAudioFileName } from "./mime-C3j3dfQb.mjs";
import { r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { i as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER, r as OPENCLAW_TRANSCRIPT_ARTIFACT_API } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { d as readSessionEntryInWorker, i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as persistSessionTranscriptTurn } from "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { _ as readTranscriptEventId, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-CM2tniQA.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-BSOdHT4f.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { l as resolveOutboundPayloadMirrorText, s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { r as getAgentScopedMediaLocalRootsForSources } from "./local-roots-B-x-73co.mjs";
import { t as bindOutboundSessionEntry } from "./outbound-session-Y84oqniG.mjs";
import { n as attachManagedOutgoingMediaToMessage, u as removeManagedOutgoingMediaBlocks } from "./managed-image-attachments-BH_BBH6I.mjs";
import { a as hasManagedOutgoingAssistantContent, i as hasAssistantDisplayMediaContent, t as buildAssistantReplyContent } from "./chat-assistant-content-D60Lu4da.mjs";
//#region src/sessions/background-session-result.ts
const AUTOMATION_RESULT_MODEL = "automation-result";
/** Appends a background result without waiting for the target conversation's active turn. */
async function commitBackgroundResultToSession(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const text = normalizeOptionalString(params.text);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	if (!sessionKey || !text || !idempotencyKey) return {
		ok: false,
		reason: "background session result is missing required data"
	};
	const storePath = resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId });
	const expectedSessionId = normalizeOptionalString(params.expectedGeneration.sessionId);
	if (!expectedSessionId) return {
		ok: false,
		reason: "background session result has an invalid expected generation"
	};
	const expectedLifecycleRevision = normalizeOptionalString(params.expectedGeneration.lifecycleRevision);
	const identities = [sessionKey, expectedSessionId];
	params.assertCurrent?.();
	return await runExclusiveSessionLifecycleMutation("background-result", {
		scope: storePath,
		identities,
		signal: params.signal,
		run: async () => {
			params.assertCurrent?.();
			const current = await readSessionEntryReadOnlyInWorker({
				agentId: params.agentId,
				sessionKey,
				storePath,
				readConsistency: "latest"
			});
			if (current?.sessionId !== expectedSessionId || normalizeOptionalString(current.lifecycleRevision) !== expectedLifecycleRevision) return {
				ok: false,
				reason: `session rebound for sessionKey: ${sessionKey}`
			};
			const unavailable = resolveSessionWorkStartError(sessionKey, current, {
				expectedSessionId,
				purpose: "accepted-result-settlement"
			});
			if (unavailable) return {
				ok: false,
				reason: unavailable
			};
			const scope = {
				agentId: params.agentId,
				sessionKey,
				sessionId: expectedSessionId,
				storePath
			};
			const prior = await findTranscriptEvent(scope, {
				kind: "idempotency",
				key: idempotencyKey
			});
			const priorMessage = prior && readTranscriptEventMessage(prior.event);
			const priorId = prior && readTranscriptEventId(prior.event);
			if (prior && (!priorMessage || !priorId)) return {
				ok: false,
				reason: "background result transcript identity is unavailable"
			};
			const displayContent = priorMessage ? void 0 : (await params.prepareDisplayContent?.())?.map((block) => Object.assign({}, block));
			const message = {
				role: "assistant",
				content: [{
					type: "text",
					text
				}],
				...displayContent ? { [ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent } : {},
				api: OPENCLAW_TRANSCRIPT_ARTIFACT_API,
				provider: OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER,
				model: AUTOMATION_RESULT_MODEL,
				usage: makeZeroUsageSnapshot(),
				stopReason: "stop",
				timestamp: Date.now(),
				idempotencyKey,
				openclawAutomation: params.provenance
			};
			params.assertCurrent?.();
			const committed = await persistSessionTranscriptTurn(scope, {
				cwd: current.spawnedCwd,
				expectedSessionId,
				expectedLifecycleRevision: expectedLifecycleRevision ?? null,
				assertCurrent: () => {
					params.assertCurrent?.();
					params.signal?.throwIfAborted();
				},
				messages: [{
					message: priorMessage ? {
						...priorMessage,
						content: message.content,
						openclawAutomation: params.provenance
					} : message,
					idempotencyLookup: "scan",
					...priorId ? {
						eventId: priorId,
						predicate: {
							kind: "active-entry",
							entryId: priorId,
							errorMessage: "background result no longer owns the active transcript"
						}
					} : {}
				}],
				touchSessionEntry: true,
				updateMode: "inline",
				publishWhen: params.prepareDisplayContent ? "always" : void 0,
				config: params.config,
				onMessageCommitted: params.onMessageCommitted
			});
			const appended = committed.messages[0];
			return appended ? {
				ok: true,
				messageId: appended.messageId
			} : {
				ok: false,
				reason: committed.rejectedReason ?? "background result was not committed"
			};
		}
	});
}
//#endregion
//#region src/cron/conversation-result.ts
/** Resolve existing context without creating a destination or changing its remembered route. */
async function resolveCronResultConversation(params) {
	return resolveCronResultConversationEntry(params, false);
}
/** Bind destination context only after a confirmed external delivery. */
async function bindCronResultConversation(params) {
	return resolveCronResultConversationEntry(params, true);
}
async function resolveCronResultConversationEntry(params, bindDestination) {
	if (!params.delivery.ok) return { conversation: params.source };
	const route = params.delivery.sessionRoute;
	if (!route) throw new Error("cron destination has no conversation route");
	if (route.recipientSessionExact === false && normalizeAgentId(resolveAgentRoute({
		cfg: params.config,
		channel: params.delivery.channel,
		defaultAgentId: params.agentId,
		accountId: params.delivery.accountId,
		peer: route.peer
	}).agentId) !== normalizeAgentId(params.agentId)) return { diagnostics: createCronRunDiagnosticsFromError("delivery", "Conversation context skipped: the destination belongs to a different agent.", { severity: "warn" }) };
	if (!bindDestination && params.source && route.sessionKey === toAgentStoreSessionKey({
		agentId: params.agentId,
		requestKey: params.source.sessionKey,
		mainKey: params.config.session?.mainKey
	})) return { conversation: {
		...params.source,
		sessionKey: route.sessionKey
	} };
	const storePath = resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId });
	if (bindDestination) {
		await params.deliveryAttemptFence?.beforeAttempt();
		await bindOutboundSessionEntry({
			cfg: params.config,
			channel: params.delivery.channel,
			accountId: params.delivery.accountId,
			route,
			sourceSessionKey: params.sourceSessionKey,
			workerGuard: { assertMutationAllowed: () => params.deliveryAttemptFence?.assertCurrent() }
		});
	}
	const entry = await readSessionEntryInWorker({
		sessionKey: route.sessionKey,
		storePath,
		readConsistency: "latest"
	});
	if (!entry) {
		if (bindDestination) throw new Error("cron destination conversation is unavailable");
		return {};
	}
	return { conversation: {
		sessionKey: route.sessionKey,
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision
	} };
}
/** Commit final output, not the private run transcript or an external notification mirror. */
async function commitCronConversationResult(params) {
	const sourceSessionKey = params.conversation.sessionKey.trim();
	if (!sourceSessionKey) return {
		ok: false,
		reason: "cron result is missing its destination conversation"
	};
	const sourceSessionGeneration = {
		sessionId: params.conversation.sessionId,
		lifecycleRevision: params.conversation.lifecycleRevision
	};
	const transcriptPayloads = params.payloads.map((payload) => {
		const spokenText = normalizeOptionalString(payload.spokenText);
		if (!spokenText) return payload;
		const mediaUrls = [payload.mediaUrl, ...payload.mediaUrls ?? []].filter((url) => Boolean(url) && !isAudioFileName(url));
		return copyReplyPayloadMetadata(payload, {
			...payload,
			text: spokenText,
			spokenText: void 0,
			audioAsVoice: void 0,
			mediaUrl: void 0,
			mediaUrls
		});
	});
	const mirror = projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan(transcriptPayloads));
	const completionText = resolveMirroredTranscriptText(mirror) ?? normalizeOptionalString(params.text);
	if (!completionText) {
		if (transcriptPayloads.some((payload) => hasReplyChannelData(payload.channelData))) return {
			ok: true,
			diagnostics: createCronRunDiagnosticsFromError("delivery", "native-only payload not added to conversation", { severity: "warn" })
		};
		return {
			ok: false,
			reason: "cron result has no visible payload"
		};
	}
	const runId = createCronExecutionId(params.jobId, params.runStartedAt);
	let preparedContent;
	let appended = false;
	try {
		await params.deliveryAttemptFence?.beforeAttempt();
		const committed = await commitBackgroundResultToSession({
			agentId: params.agentId,
			sessionKey: sourceSessionKey,
			expectedGeneration: sourceSessionGeneration,
			text: completionText,
			prepareDisplayContent: async () => {
				const { assistantContent } = await buildAssistantReplyContent({
					sessionKey: sourceSessionKey,
					agentId: params.agentId,
					payloads: transcriptPayloads.map((payload) => copyReplyPayloadMetadata(payload, {
						...payload,
						text: resolveOutboundPayloadMirrorText(payload)
					})),
					managedMediaLocalRoots: getAgentScopedMediaLocalRootsForSources({
						cfg: params.config,
						agentId: params.agentId,
						mediaSources: mirror.mediaUrls
					}),
					includeSensitiveMedia: false,
					onManagedMediaPrepareError: (message) => {
						logWarn(`[cron:${params.jobId}] result media embedding skipped: ${message}`);
					}
				});
				preparedContent = assistantContent;
				return hasAssistantDisplayMediaContent(preparedContent) ? preparedContent : void 0;
			},
			idempotencyKey: `cron-current-completion:${runId}`,
			provenance: {
				kind: "cron",
				jobId: params.jobId,
				runId
			},
			config: params.config,
			signal: params.signal,
			assertCurrent: () => {
				params.signal?.throwIfAborted();
				params.deliveryAttemptFence?.assertCurrent();
			},
			onMessageCommitted: (result, acceptCompletion) => {
				appended = result.appended;
				const blocks = readAssistantDisplayContent(result.message);
				if (hasManagedOutgoingAssistantContent(blocks)) acceptCompletion(async () => {
					if (!await attachManagedOutgoingMediaToMessage({
						messageId: result.messageId,
						blocks
					})) throw new Error("Cron result media ownership could not be persisted");
				});
			}
		});
		if (!committed.ok) return committed;
	} finally {
		if (!appended && preparedContent) await removeManagedOutgoingMediaBlocks({
			blocks: preparedContent,
			messageId: null
		});
	}
	return { ok: true };
}
//#endregion
export { commitCronConversationResult as n, resolveCronResultConversation as r, bindCronResultConversation as t };
