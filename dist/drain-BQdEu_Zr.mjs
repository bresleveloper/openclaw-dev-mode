import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { b as AgentDatabaseExecutionAdmissionClosedError } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { F as waitForGatewayRestartFenceSettlement, f as isGatewayRestartDrainError, l as getGatewayRestartDrainSignal, w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { l as readToolAllowlistIntersection } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { C as buildPersistedUserTurnMediaInputsFromFields } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as channelRouteDedupeKey, t as channelRouteCompactKey } from "./channel-route-2bD3dZs2.mjs";
import { s as extractTextFromChatContent } from "./user-facing-text-BNFEPbYx.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as combineChannelAdmissionEvidence, r as compareChannelAdmissionParticipants } from "./admission-evidence-CcY0jAvs.mjs";
import { A as previewQueueSummaryPrompt, D as drainCollectQueueStep, M as waitForQueueDebounce, O as drainNextQueueItem, T as buildCollectPrompt, d as trimSummaryElisionsToCap, f as admitFollowupRunLifecycle, g as retireFollowupRunCancellation, i as clearFollowupQueueContent, j as removeQueuedItemsByRef, k as hasCrossChannelItems, m as completeFollowupRuns, n as FOLLOWUP_QUEUES, o as followupQueueSources, p as completeFollowupRunLifecycle, r as clearFollowupQueue, v as updateFollowupRetryHeartbeats, w as beginQueueDrain, x as isFollowupRunAborted, y as FollowupRunDeferredError } from "./state-DNPW_vEt.mjs";
import { c as withSandboxRuntimeStatusesInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
import { t as isRoutableChannel } from "./route-reply-BzJ4vH2m.mjs";
import { n as combineGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { a as resolveReplyToolAuthorityContext, i as resolveReplyPersonalToolTargets, r as resolveReplyOperatorAuthorityKey } from "./reply-tool-authority-X6nNd9fP.mjs";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/queue/delivery-context.ts
function hasPreparedCurrentTurnImages(run) {
	return run.currentTurnImagesPrepared === true;
}
const queuedAdmissionOwnerState = resolveGlobalSingleton(Symbol.for("openclaw.queuedAdmissionOwnerState"), () => ({
	keys: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
function hasExclusiveTurnAdmission(lifecycle) {
	return lifecycle?.admission === "exclusive";
}
function assertSingleAdmissionOwner(items) {
	if (new Set(items.flatMap((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle) ? [item.turnAdoptionLifecycle] : [])).size > 1) throw new Error("followup queue cannot aggregate distinct admission lifecycles");
}
function resolveTurnAdoptionLifecycleDeliveryKey(lifecycle) {
	if (!lifecycle) return "";
	const explicitOwnerKey = lifecycle.ownerKey ?? "";
	if (!hasExclusiveTurnAdmission(lifecycle)) return explicitOwnerKey;
	let admissionOwnerKey = queuedAdmissionOwnerState.keys.get(lifecycle);
	if (!admissionOwnerKey) {
		admissionOwnerKey = `admission:${queuedAdmissionOwnerState.nextId++}`;
		queuedAdmissionOwnerState.keys.set(lifecycle, admissionOwnerKey);
	}
	return JSON.stringify([explicitOwnerKey, admissionOwnerKey]);
}
function resolveFollowupAuthorizationKey(run) {
	const execution = run.run;
	return JSON.stringify([
		resolveReplyOperatorAuthorityKey(run.operatorAuthority),
		execution.senderId ?? "",
		JSON.stringify(execution.channelContext ?? null),
		stableStringify(execution.conversationToolPolicy ?? null),
		execution.senderE164 ?? "",
		execution.senderIsOwner === true,
		execution.execOverrides?.host ?? "",
		execution.execOverrides?.security ?? "",
		execution.execOverrides?.ask ?? "",
		execution.execOverrides?.node ?? "",
		execution.execOverrides?.nodeCwd ?? "",
		execution.bashElevated?.enabled === true,
		execution.bashElevated?.allowed === true,
		execution.bashElevated?.defaultLevel ?? "",
		execution.approvalReviewerDeviceId ?? ""
	]);
}
/** Storage grouping is policy-independent; drain prepares current screen/theme authority. */
function resolveFollowupDeliveryStorageKey(run) {
	const execution = run.run;
	const provenance = execution.inputProvenance;
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		hasPreparedCurrentTurnImages(run),
		Boolean(run.userTurnTranscriptRecorder?.getPendingInputMessage?.()),
		run.originatingChatId ?? "",
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? "",
		resolveFollowupAuthorizationKey(run),
		run.turnAdoptionLifecycle?.ownerKey ?? "",
		normalizeOptionalString(execution.runtimePolicySessionKey ?? execution.sessionKey) ?? "",
		execution.provider,
		execution.model,
		execution.messageProvider ?? "",
		JSON.stringify([...new Set(execution.clientCaps ?? [])].toSorted()),
		stableStringify(execution.toolBindings ?? null),
		execution.chatType ?? "",
		execution.agentAccountId ?? "",
		execution.conversationRoutePeerId ?? "",
		execution.groupId ?? "",
		execution.groupChannel ?? "",
		execution.groupSpace ?? "",
		JSON.stringify([...new Set(execution.memberRoleIds ?? [])].toSorted()),
		execution.spawnedBy ?? "",
		execution.traceAuthorized === true,
		execution.traceLevelOverride ?? "",
		execution.thinkLevel ?? "",
		execution.thinkLevelOverride ?? "",
		execution.fastMode ?? "",
		execution.fastModeOverride === true,
		execution.fastModeAutoOnSecondsOverride === true,
		execution.fastModeAutoOnSeconds ?? "",
		execution.verboseLevel ?? "",
		execution.verboseLevelOverride ?? "",
		execution.reasoningLevel ?? "",
		execution.elevatedLevel ?? "",
		provenance?.kind ?? "",
		provenance?.originSessionId ?? "",
		provenance?.sourceSessionKey ?? "",
		provenance?.sourceChannel ?? "",
		provenance?.sourceTool ?? "",
		stableStringify(execution.trustedInternalHandoff ?? null),
		stableStringify(execution.scheduledToolPolicy ?? null),
		stableStringify(execution.runtimePluginToolGrant ?? null),
		stableStringify(run.toolsAllow ?? null),
		stableStringify(run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow) ?? null : null),
		run.disableTools === true,
		execution.extraSystemPrompt ?? "",
		execution.extraSystemPromptStatic ?? "",
		execution.sourceReplyDeliveryMode ?? "",
		execution.taskSuggestionDeliveryMode ?? "",
		execution.silentReplyPromptMode ?? "",
		execution.enforceFinalTag === true,
		execution.skipProviderRuntimeHints === true,
		execution.silentExpected === true,
		run.currentInboundEventKind ?? "",
		execution.terminalReplyExpectation ?? "",
		execution.suppressNextUserMessagePersistence === true,
		execution.suppressTranscriptOnlyAssistantPersistence === true,
		execution.blockReplyBreak,
		resolveTurnAdoptionLifecycleDeliveryKey(run.turnAdoptionLifecycle)
	]);
}
async function prepareNextDeliveryGroup(readItems, assertDrainCurrent) {
	const items = readItems().slice();
	const assertCurrent = () => {
		assertDrainCurrent();
		for (const item of items) {
			item.operatorAuthority?.assertCurrent();
			if (isFollowupRunAborted(item)) throw new FollowupRunDeferredError("Queued delivery source changed during preparation");
		}
	};
	try {
		assertCurrent();
		if (items.length <= 1) return {
			items,
			assertCurrent
		};
		const policyItems = items.filter((item) => item.run.gatewayUiCommandTarget && !item.disableTools);
		const statuses = await withSandboxRuntimeStatusesInWorker(policyItems.map(({ run }) => ({
			cfg: run.config,
			agentId: run.agentId,
			sessionKey: run.sessionKey,
			classificationSessionKey: run.runtimePolicySessionKey ?? run.sessionKey
		})), {
			env: { ...process.env },
			cwd: process.cwd(),
			assertCurrent
		}, (prepared) => prepared);
		return await withPreparedSessionCapabilityRead(() => {
			const group = [];
			let firstKey;
			for (const item of items) {
				const index = policyItems.indexOf(item);
				const profile = index < 0 ? void 0 : resolveReplyToolAuthorityContext(item, void 0, expectDefined(statuses[index], "prepared sandbox status")).capabilityProfile;
				const storageKey = resolveFollowupDeliveryStorageKey(item);
				const personalTargets = profile ? resolveReplyPersonalToolTargets(item, profile) : void 0;
				const key = JSON.stringify([
					storageKey,
					personalTargets ? stableStringify(personalTargets.screenTarget ?? null) : "null",
					personalTargets?.themeProfileId ?? ""
				]);
				if (firstKey !== void 0 && key !== firstKey) break;
				firstKey = key;
				group.push(item);
			}
			assertCurrent();
			return {
				items: group,
				assertCurrent
			};
		});
	} catch (error) {
		updateFollowupRetryHeartbeats(error, items);
		throw error;
	}
}
function resolveFollowupReplyAnchor(run) {
	if (run.originatingReplyToMode === "off") return;
	const replyToId = normalizeOptionalString(run.originatingReplyToId);
	if (replyToId || normalizeMessageChannel(run.originatingChannel) !== "slack") return replyToId;
	const threadId = run.originatingThreadId;
	return (typeof threadId === "number" ? Number.isFinite(threadId) : normalizeOptionalString(threadId) !== void 0) ? void 0 : normalizeOptionalString(run.messageId);
}
function collectCurrentInboundContext(items) {
	const contexts = items.flatMap((item, index) => item.currentInboundContext ? [{
		context: item.currentInboundContext,
		index
	}] : []);
	if (items.length <= 1) return contexts[0]?.context;
	const renderField = (field) => {
		const blocks = contexts.flatMap(({ context, index }) => {
			const value = context[field];
			return value ? [`Queued #${index + 1} context:\n${value}`] : [];
		});
		return blocks.length > 0 ? blocks.join("\n\n") : void 0;
	};
	const text = renderField("text");
	if (!text) return;
	const resumableText = renderField("resumableText");
	const injectedGoalContexts = [...new Set(contexts.flatMap(({ context }) => context.injectedGoalContexts ?? []))];
	return {
		text,
		...resumableText ? { resumableText } : {},
		fragments: contexts.flatMap(({ context, index }) => {
			return [{
				kind: "runtime-instruction",
				text: `Queued #${index + 1} context:`
			}].concat(context.fragments ?? [{
				kind: "conversation-data",
				text: context.text
			}]);
		}),
		promptJoiner: "\n\n",
		...injectedGoalContexts.length > 0 ? { injectedGoalContexts } : {}
	};
}
function collectReplyDisposition(items) {
	const primary = items.at(-1)?.queuedFollowupReplyDisposition;
	const terminalRecipients = items.slice(0, -1).flatMap((item) => {
		const disposition = item.queuedFollowupReplyDisposition;
		return disposition?.kind === "deliver" ? [disposition.deliver] : [];
	});
	if (terminalRecipients.length === 0) return primary;
	const deliver = primary?.kind === "deliver" ? primary.deliver : void 0;
	return {
		kind: "deliver",
		deliver: Object.assign(async (batch) => {
			if (batch.completion.kind === "progress") {
				await deliver?.(batch);
				return;
			}
			const failure = (await Promise.allSettled([...terminalRecipients.map(async (recipient) => recipient({
				...batch,
				payloads: []
			})), Promise.resolve().then(() => deliver?.(batch))])).find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		}, {
			ownsCompletion: deliver?.ownsCompletion,
			createSourceRetry: deliver?.createSourceRetry
		})
	};
}
function collectRuntimeMetadata(items, abortSignal) {
	const currentTurnSource = items.find((item) => item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true || Boolean(item.currentInboundContext));
	const authoritySource = items.at(-1);
	const terminalObservers = items.flatMap((item) => item.runObservers?.onAgentRunTerminalOutcome ? [item.runObservers.onAgentRunTerminalOutcome] : []);
	const deliveryCorrelations = items.flatMap((item) => item.deliveryCorrelations ?? []);
	const explicitSkillSelections = [...new Map(items.flatMap((item) => item.explicitSkillSelections ?? []).map((selection) => [selection.path, selection])).values()];
	return {
		sourceTurnId: authoritySource?.sourceTurnId,
		operatorAuthority: authoritySource?.operatorAuthority,
		...items.length > 0 && items.every((item) => item.personalBootstrapEligible === true) ? { personalBootstrapEligible: true } : {},
		currentInboundEventKind: currentTurnSource?.currentInboundEventKind,
		currentInboundAudio: currentTurnSource?.currentInboundAudio,
		currentInboundContext: collectCurrentInboundContext(items),
		explicitSkillSelections: explicitSkillSelections.length > 0 ? explicitSkillSelections : void 0,
		channelAdmissionEvidence: combineChannelAdmissionEvidence(items.map((item) => item.channelAdmissionEvidence)),
		gatewayLocalUserIngress: combineGatewayLocalUserIngress(items.map((item) => item.gatewayLocalUserIngress)),
		toolsAllow: authoritySource?.toolsAllow,
		disableTools: authoritySource?.disableTools,
		abortSignal,
		queueAbortSignal: items.find((item) => item.queueAbortSignal)?.queueAbortSignal,
		deliveryCorrelations: deliveryCorrelations.length > 0 ? deliveryCorrelations : void 0,
		turnAdoptionLifecycle: items.length === 1 ? items[0]?.turnAdoptionLifecycle : void 0,
		replyOperationRunStates: items.flatMap((item) => item.replyOperationRunStates ?? []),
		queuedFollowupReplyDisposition: collectReplyDisposition(items),
		runObservers: terminalObservers.length === 0 ? authoritySource?.runObservers : {
			...authoritySource?.runObservers,
			onAgentRunTerminalOutcome: (outcome) => {
				const failures = [];
				for (const observer of terminalObservers) try {
					observer(outcome);
				} catch (error) {
					failures.push(error);
				}
				if (failures.length > 0) throw failures[0];
			}
		}
	};
}
function resolveOverflowSummaryInboundEventKind(sources) {
	return sources.length > 0 && sources.every((source) => source.currentInboundEventKind === "room_event") ? "room_event" : void 0;
}
function getFollowupOriginRouting(source) {
	return {
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType
	};
}
function createOverflowSummaryRetrySource(source) {
	return {
		prompt: source.prompt,
		currentInboundContext: source.currentInboundContext,
		sourceTurnId: source.sourceTurnId,
		admissionSessionId: source.admissionSessionId,
		operatorAuthority: source.operatorAuthority,
		personalBootstrapEligible: source.personalBootstrapEligible,
		queueAbortSignal: source.queueAbortSignal,
		transcriptPrompt: source.transcriptPrompt,
		userTurnTranscriptRecorder: source.userTurnTranscriptRecorder,
		explicitSkillSelections: source.explicitSkillSelections,
		toolsAllow: source.toolsAllow,
		disableTools: source.disableTools,
		images: source.images,
		imageOrder: source.imageOrder,
		media: source.media,
		channelAdmissionEvidence: source.channelAdmissionEvidence,
		gatewayLocalUserIngress: source.gatewayLocalUserIngress,
		messageId: source.messageId,
		summaryLine: source.summaryLine,
		enqueuedAt: source.enqueuedAt,
		...getFollowupOriginRouting(source),
		abortSignal: source.abortSignal,
		turnAdoptionLifecycle: source.turnAdoptionLifecycle,
		replyOperationRunStates: source.replyOperationRunStates,
		queuedFollowupReplyDisposition: source.queuedFollowupReplyDisposition,
		runObservers: source.runObservers,
		...source.currentInboundEventKind === "room_event" ? { currentInboundEventKind: "room_event" } : {},
		run: source.run
	};
}
//#endregion
//#region src/auto-reply/reply/queue/collect-media.ts
function collectQueuedPromptMedia(items) {
	const images = [];
	const imageOrder = [];
	const media = [];
	const mediaImageSlots = [];
	const suppressedFactIndexes = [];
	const currentTurnImagesPrepared = items.every(hasPreparedCurrentTurnImages);
	for (const item of items) {
		const mediaOffset = media.length;
		const internalItem = item;
		images.push(...item.images ?? []);
		imageOrder.push(...item.imageOrder ?? []);
		if (currentTurnImagesPrepared) {
			const itemSlots = internalItem.mediaImageLayout?.slots ?? item.imageOrder?.map((kind) => ({ kind })) ?? [];
			mediaImageSlots.push(...itemSlots.map((slot) => slot.factIndex === void 0 ? { kind: slot.kind } : {
				kind: slot.kind,
				factIndex: slot.factIndex + mediaOffset
			}));
			suppressedFactIndexes.push(...(internalItem.mediaImageLayout?.suppressedFactIndexes ?? []).map((factIndex) => factIndex + mediaOffset));
		}
		media.push(...item.media ?? []);
	}
	const mediaImageLayout = mediaImageSlots.length > 0 || suppressedFactIndexes.length > 0 ? {
		slots: mediaImageSlots,
		suppressedFactIndexes
	} : void 0;
	return {
		...currentTurnImagesPrepared ? { currentTurnImagesPrepared: true } : {},
		...currentTurnImagesPrepared || images.length > 0 ? { images } : {},
		...currentTurnImagesPrepared || imageOrder.length > 0 ? { imageOrder } : {},
		...mediaImageLayout ? { mediaImageLayout } : {},
		...media.length > 0 ? { media } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/queue/collected-run.ts
function resolveCollectedRun(items, source) {
	if (compareChannelAdmissionParticipants(items.map((item) => item.channelAdmissionEvidence)) === "same" || !items.every((item) => compareChannelAdmissionParticipants([item.channelAdmissionEvidence]) === "same")) return source;
	return {
		...source,
		senderId: void 0,
		senderName: void 0,
		senderUsername: void 0,
		senderE164: void 0,
		senderIsOwner: false,
		traceAuthorized: false,
		ownerNumbers: []
	};
}
//#endregion
//#region src/auto-reply/reply/queue/drain-admission-scope.ts
/** Drop both inherited generations without dropping the original Gateway caller. */
function runOutsideAdmittedGenerationScopes(run) {
	return runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(run));
}
//#endregion
//#region src/auto-reply/reply/queue/summary-consumption.ts
function consumeQueueSummaryDelivery(queue, delivery, completeLifecycles = true) {
	let consumedCount = delivery.sources.length === 0 ? delivery.droppedCount : 0;
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		const entry = sourceIndex < 0 ? queue.summaryElisions.find((candidate) => candidate.sources.includes(source) || candidate.sourceRefs.has(source)) : void 0;
		if (sourceIndex >= 0 || entry) {
			const index = entry ? entry.sources.indexOf(entry.sourceRefs.get(source) ?? source) : sourceIndex;
			if (index >= 0) {
				(entry?.sources ?? queue.summarySources).splice(index, 1);
				(entry?.summaryLines ?? queue.summaryLines).splice(index, 1);
			}
			consumedCount += 1;
			if (entry && entry.sources.length === 0) queue.summaryElisions.splice(queue.summaryElisions.indexOf(entry), 1);
		}
		if (completeLifecycles) completeFollowupRunLifecycle(source);
	}
	queue.droppedCount = Math.max(0, queue.droppedCount - consumedCount);
}
//#endregion
//#region src/auto-reply/reply/queue/drain.ts
const FOLLOWUP_RUN_CALLBACKS = resolveGlobalMap(Symbol.for("openclaw.followupDrainCallbacks"));
let followedRestartDrainSignal;
function bindFollowupRestartDrainSignal() {
	const signal = getGatewayRestartDrainSignal();
	if (signal === followedRestartDrainSignal) return;
	followedRestartDrainSignal = signal;
	signal.addEventListener("abort", () => {
		for (const key of FOLLOWUP_RUN_CALLBACKS.keys()) clearFollowupQueue(key);
		FOLLOWUP_RUN_CALLBACKS.clear();
	}, { once: true });
}
function rememberFollowupDrainCallback(key, runFollowup) {
	bindFollowupRestartDrainSignal();
	FOLLOWUP_RUN_CALLBACKS.set(key, runFollowup);
}
function clearFollowupDrainCallback(key) {
	FOLLOWUP_RUN_CALLBACKS.delete(key);
}
/** Restart the drain for `key` if it is currently idle, using the stored callback. */
function kickFollowupDrainIfIdle(key) {
	const cb = FOLLOWUP_RUN_CALLBACKS.get(key);
	if (!cb) return;
	scheduleFollowupDrain(key, cb);
}
/** Recover a wedged drain without replaying its active inputs. */
function prepareStaleFollowupDrainRetirement(key) {
	const queue = FOLLOWUP_QUEUES.get(key);
	if (!queue?.draining || queue.inFlight.size === 0) return;
	return () => {
		if (FOLLOWUP_QUEUES.get(key) !== queue || !queue.draining) return;
		const activeSources = new Set(queue.inFlight);
		removeQueuedItemsByRef(queue.items, [...activeSources]);
		const activeSummarySources = [...activeSources].filter((source) => queue.activeSummarySources.has(source));
		consumeQueueSummaryDelivery(queue, {
			droppedCount: activeSummarySources.length,
			sources: activeSummarySources
		}, false);
		const replacement = {
			...queue,
			abortController: new AbortController(),
			items: [...queue.items],
			draining: false,
			rescheduleRequested: false,
			inFlight: /* @__PURE__ */ new Set(),
			summaryLines: [...queue.summaryLines],
			summarySources: [...queue.summarySources],
			activeSummarySources: /* @__PURE__ */ new WeakSet(),
			summaryElisions: queue.summaryElisions.map((entry) => ({
				...entry,
				sources: [...entry.sources],
				summaryLines: [...entry.summaryLines],
				sourceRefs: /* @__PURE__ */ new WeakMap()
			}))
		};
		for (const source of followupQueueSources(replacement)) source.queueAbortSignal = replacement.abortController.signal;
		const hasPendingWork = replacement.items.length > 0 || replacement.droppedCount > 0;
		if (hasPendingWork) FOLLOWUP_QUEUES.set(key, replacement);
		else {
			FOLLOWUP_QUEUES.delete(key);
			clearFollowupDrainCallback(key);
		}
		clearFollowupQueueContent(queue);
		queue.abortController.abort();
		completeFollowupRuns(activeSources);
		if (hasPendingWork) kickFollowupDrainIfIdle(key);
	};
}
function resolveOriginRoutingMetadata(items) {
	const source = items.find((item) => item.originatingChannel && item.originatingTo) ?? items.find((item) => item.originatingChannel || item.originatingTo || item.originatingAccountId || item.originatingThreadId != null || item.originatingChatId || item.originatingReplyToId || item.originatingReplyToMode || item.originatingChatType);
	return source ? getFollowupOriginRouting(source) : {};
}
function resolveCollectedSourceText(message, fallback) {
	return message ? extractTextFromChatContent(message.content, {
		normalizeText: (text) => text,
		joinWith: "\n"
	}) ?? "" : fallback;
}
function buildCollectItemPrefix(item, idx) {
	const senderLabel = item.run.senderName ?? item.run.senderUsername ?? item.run.senderId ?? item.run.senderE164;
	const senderSuffix = senderLabel ? ` (from ${senderLabel})` : "";
	return `---\nQueued #${idx + 1}${senderSuffix}\n`;
}
function renderCollectItemPrompt(item, idx, prompt) {
	return `${buildCollectItemPrefix(item, idx)}${prompt}`.trim();
}
function buildCollectTranscriptInput(items, messages) {
	const title = "[Queued messages while agent was busy]";
	const mentions = [];
	let offset = 38;
	return {
		text: buildCollectPrompt({
			title,
			items,
			renderItem: (item, index) => {
				const message = messages?.[index] ?? item.userTurnTranscriptRecorder?.message;
				const sourceText = resolveCollectedSourceText(message, item.transcriptPrompt ?? item.prompt);
				const block = renderCollectItemPrompt(item, index, sourceText);
				const sourceOffset = offset + 2 + buildCollectItemPrefix(item, index).length;
				const sourceEnd = sourceText.trimEnd().length;
				for (const mention of message?.["__openclaw"]?.humanMentions ?? []) if (mention.end <= sourceEnd) mentions.push({
					...mention,
					start: sourceOffset + mention.start,
					end: sourceOffset + mention.end
				});
				offset += 2 + block.length;
				return block;
			}
		}),
		mentions
	};
}
async function resolveFollowupTranscriptTarget(source) {
	const sessionKey = normalizeOptionalString(source.run.sessionKey) ?? source.run.sessionId;
	const storePath = resolveSessionStorePathCore(source.run.config.session?.store, { agentId: source.run.agentId });
	const sessionEntry = await readSessionEntryReadOnlyInWorker({
		storePath,
		sessionKey
	});
	return {
		sessionId: sessionEntry?.sessionId ?? source.run.sessionId,
		sessionKey,
		sessionEntry,
		storePath,
		agentId: source.run.agentId,
		cwd: source.run.cwd ?? source.run.workspaceDir,
		config: source.run.config
	};
}
function createCollectUserTurnTranscriptRecorder(items) {
	const transcriptSources = items.filter((item) => item.userTurnTranscriptRecorder);
	const source = transcriptSources.at(-1);
	if (!source) return;
	const buildInput = async () => {
		const messages = await Promise.all(transcriptSources.map(async (item) => await item.userTurnTranscriptRecorder?.resolveMessage()));
		const media = messages.flatMap((message) => buildPersistedUserTurnMediaInputsFromFields(message));
		const timestamp = messages.reduce((latest, message) => {
			const candidate = message?.timestamp;
			return typeof candidate === "number" && (latest === void 0 || candidate > latest) ? candidate : latest;
		}, void 0);
		const transcriptInput = buildCollectTranscriptInput(transcriptSources, messages);
		const identityHash = createHash("sha256").update(JSON.stringify(transcriptSources.map((item) => [
			item.messageId ?? "",
			item.enqueuedAt,
			item.transcriptPrompt
		]))).digest("hex");
		return {
			...transcriptInput,
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance,
			idempotencyKey: `followup-collect:${source.run.sessionId}:${identityHash}`,
			...timestamp === void 0 ? {} : { timestamp },
			...media.length === 0 ? {} : { media }
		};
	};
	const initialTranscriptInput = buildCollectTranscriptInput(transcriptSources);
	return createUserTurnTranscriptRecorder({
		input: {
			...initialTranscriptInput,
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance
		},
		resolveInput: buildInput,
		pendingInputSources: transcriptSources.flatMap((item) => item.userTurnTranscriptRecorder ?? []),
		target: () => resolveFollowupTranscriptTarget(source),
		errorContext: "collected followup user turn transcript",
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
	});
}
function resolveAggregateOwner(items) {
	return items.findLast((item) => item.abortSignal) ?? items.findLast((item) => item.turnAdoptionLifecycle) ?? items.at(-1);
}
function requiresIndividualCollectDrain(item) {
	return item.userTurnTranscriptRecorder?.hasPersisted() === true || item.disableCollectBatching === true || item.run.skillLibraryAuthoring !== void 0 || item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true;
}
function createAggregateCancellation(items) {
	const ownerSignal = resolveAggregateOwner(items)?.abortSignal;
	const signals = new Set(items.flatMap((item) => item.abortSignal ?? []));
	if (signals.size === 0 || signals.size === 1 && ownerSignal) return {
		signal: ownerSignal,
		admit: () => void 0,
		dispose: () => void 0
	};
	const controller = new AbortController();
	const abort = () => controller.abort();
	for (const signal of signals) if (signal.aborted) abort();
	else signal.addEventListener("abort", abort, { once: true });
	const disposeSignal = (signal) => {
		signal.removeEventListener("abort", abort);
		signals.delete(signal);
	};
	return {
		signal: controller.signal,
		admit: () => {
			for (const signal of signals) if (signal !== ownerSignal) disposeSignal(signal);
		},
		dispose: () => {
			for (const signal of signals) disposeSignal(signal);
		}
	};
}
function createAggregateLifecycle(items, onAdopted, onSettled) {
	return {
		admission: "cancel-only",
		...items.some((item) => item.turnAdoptionLifecycle?.cronCreatorAuthorityUnavailable === "queued-local-operator") ? { cronCreatorAuthorityUnavailable: "queued-local-operator" } : {},
		onAdopted,
		onSettled
	};
}
function resolveQueueSummaryLines(queue, sources) {
	return sources.map((source) => {
		const sourceIndex = queue.summarySources.indexOf(source);
		const entry = queue.summaryElisions.find((candidate) => candidate.sources.includes(source));
		return expectDefined(sourceIndex >= 0 ? queue.summaryLines[sourceIndex] : entry?.summaryLines[entry.sources.indexOf(source)], "summary line for queued source");
	});
}
function releaseQueueSummaryDeliveryForRetry(queue, delivery) {
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) queue.summarySources[sourceIndex] = createOverflowSummaryRetrySource(source);
		if (!source.turnAdoptionLifecycle) completeFollowupRunLifecycle(source);
	}
}
async function runQueueSummaryDelivery(queue, delivery, run) {
	assertSingleAdmissionOwner(delivery.sources);
	for (const source of delivery.sources) {
		queue.activeSummarySources.add(source);
		queue.inFlight.add(source);
	}
	let admitted = false;
	const cancellation = createAggregateCancellation(delivery.sources);
	const onAdmitted = delivery.sources.length > 1 || delivery.sources.some((source) => hasExclusiveTurnAdmission(source.turnAdoptionLifecycle)) ? async () => {
		if (admitted) return;
		admitted = true;
		consumeQueueSummaryDelivery(queue, delivery, false);
		await Promise.all(delivery.sources.map((source) => admitFollowupRunLifecycle(source)));
		cancellation.admit();
		const aggregateOwner = resolveAggregateOwner(delivery.sources);
		for (const source of delivery.sources) if (source !== aggregateOwner) retireFollowupRunCancellation(source);
	} : void 0;
	try {
		try {
			await run({
				abortSignal: cancellation.signal,
				onAdmitted
			});
		} catch (err) {
			updateFollowupRetryHeartbeats(err, delivery.sources);
			if (!admitted) {
				if (!(err instanceof FollowupRunDeferredError)) releaseQueueSummaryDeliveryForRetry(queue, delivery);
			} else completeFollowupRuns(delivery.sources);
			throw err;
		}
		if (!admitted) {
			const canceledSources = delivery.sources.filter(isFollowupRunAborted);
			if (canceledSources.length > 0) {
				consumeQueueSummaryDelivery(queue, {
					...delivery,
					sources: canceledSources
				});
				return false;
			}
			consumeQueueSummaryDelivery(queue, delivery);
		}
		return true;
	} finally {
		cancellation.dispose();
		for (const source of delivery.sources) {
			queue.inFlight.delete(source);
			queue.activeSummarySources.delete(source);
			for (const entry of queue.summaryElisions) {
				const compactSource = entry.sourceRefs.get(source);
				if (compactSource) queue.activeSummarySources.delete(compactSource);
			}
		}
		trimSummaryElisionsToCap(queue);
	}
}
async function dropAbortedFollowups(queue, runFollowup) {
	const canDrop = (run) => run.steerPending?.phase !== "injecting" && isFollowupRunAborted(run) && !queue.inFlight.has(run) && !queue.activeSummarySources.has(run);
	const pending = queue.items.filter(canDrop);
	const summaries = [...queue.summarySources, ...queue.summaryElisions.flatMap((entry) => entry.sources)].filter(canDrop);
	removeQueuedItemsByRef(queue.items, pending);
	consumeQueueSummaryDelivery(queue, {
		sources: summaries,
		droppedCount: summaries.length
	}, false);
	completeFollowupRuns([...pending, ...summaries], (error) => {
		defaultRuntime.error?.(`followup queue cancellation settlement failed: ${String(error)}`);
	});
	await Promise.all(pending.map(async (item) => {
		try {
			await runFollowup(item);
		} catch (error) {
			defaultRuntime.error?.(`followup queue cancellation cleanup failed: ${String(error)}`);
		}
	}));
	return pending.length + summaries.length;
}
function resolveCrossChannelKey(item) {
	const { originatingChannel: channel, originatingTo: to, originatingAccountId: accountId } = item;
	const threadId = item.originatingThreadId;
	const replyToId = resolveFollowupReplyAnchor(item);
	const chatType = normalizeChatType(item.originatingChatType);
	if (!channel && !to && !accountId && (threadId == null || threadId === "") && !item.originatingChatId && !replyToId) return chatType ? { key: JSON.stringify(["unresolved", chatType]) } : {};
	if (!isRoutableChannel(channel) || !to) return { key: JSON.stringify([
		"local",
		channel ?? "",
		to ?? "",
		accountId ?? "",
		threadId ?? "",
		item.originatingChatId ?? "",
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) };
	const key = channelRouteCompactKey({
		channel,
		to,
		accountId,
		threadId
	});
	return key ? { key: JSON.stringify([
		key,
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) } : { cross: true };
}
async function drainProtectedPriorityFollowup(queue, runFollowup) {
	const priority = queue.items.find((item) => item.protectFromQueueOverflow === true);
	if (!priority) return false;
	queue.inFlight.add(priority);
	try {
		await runFollowup(priority);
		removeQueuedItemsByRef(queue.items, [priority]);
	} finally {
		queue.inFlight.delete(priority);
	}
	return true;
}
async function runSyntheticOverflowSummary(params) {
	const promptHash = createHash("sha256").update(params.prompt).digest("hex");
	const routeHash = createHash("sha256").update(JSON.stringify([
		channelRouteDedupeKey({
			channel: params.source.originatingChannel,
			to: params.source.originatingTo,
			accountId: params.source.originatingAccountId,
			threadId: params.source.originatingThreadId
		}),
		resolveFollowupReplyAnchor(params.source) ?? "",
		params.source.originatingReplyToMode ?? "",
		normalizeChatType(params.source.originatingChatType) ?? ""
	])).digest("hex");
	const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
		input: {
			text: params.prompt,
			idempotencyKey: `followup-overflow:${params.source.run.sessionId}:${routeHash}:${params.source.messageId ?? params.source.enqueuedAt}:${promptHash}`,
			senderIsOwner: params.source.run.senderIsOwner,
			provenance: params.source.run.inputProvenance
		},
		target: () => resolveFollowupTranscriptTarget(params.source),
		pendingInputSources: params.sources.flatMap((source) => source.userTurnTranscriptRecorder ?? []),
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "followup overflow summary transcript"
	});
	const currentInboundEventKind = resolveOverflowSummaryInboundEventKind(params.sources);
	const runtimeMetadata = collectRuntimeMetadata(params.sources);
	let admitted = false;
	await params.runFollowup({
		prompt: params.prompt,
		currentInboundContext: params.currentInboundContext,
		sourceTurnId: runtimeMetadata.sourceTurnId,
		queueAbortSignal: params.source.queueAbortSignal,
		transcriptPrompt: params.prompt,
		messageId: params.source.messageId,
		userTurnTranscriptRecorder,
		run: resolveCollectedRun(params.sources, params.source.run),
		enqueuedAt: Date.now(),
		abortSignal: params.abortSignal,
		explicitSkillSelections: runtimeMetadata.explicitSkillSelections,
		channelAdmissionEvidence: runtimeMetadata.channelAdmissionEvidence,
		gatewayLocalUserIngress: runtimeMetadata.gatewayLocalUserIngress,
		operatorAuthority: runtimeMetadata.operatorAuthority,
		personalBootstrapEligible: runtimeMetadata.personalBootstrapEligible,
		toolsAllow: runtimeMetadata.toolsAllow,
		disableTools: runtimeMetadata.disableTools,
		queuedFollowupReplyDisposition: runtimeMetadata.queuedFollowupReplyDisposition,
		runObservers: runtimeMetadata.runObservers,
		replyOperationRunStates: runtimeMetadata.replyOperationRunStates,
		...params.onAdmitted ? { turnAdoptionLifecycle: createAggregateLifecycle(params.sources, async () => {
			admitted = true;
			await params.onAdmitted?.();
		}, () => {
			if (admitted) completeFollowupRuns(params.sources);
		}) } : {},
		...resolveOriginRoutingMetadata([params.source]),
		...currentInboundEventKind ? { currentInboundEventKind } : {}
	});
}
async function drainOverflowSummaryGroup(params) {
	if (await dropAbortedFollowups(params.queue, params.runFollowup) > 0 && params.queue.droppedCount === 0) return true;
	if (params.queue.evictedSummaryCount > 0) {
		const evictedCount = params.queue.evictedSummaryCount;
		params.queue.evictedSummaryCount = 0;
		params.queue.droppedCount = Math.max(0, params.queue.droppedCount - evictedCount);
		defaultRuntime.error?.(`followup queue omitted ${evictedCount} route-isolated overflow summar${evictedCount === 1 ? "y" : "ies"} after reaching the summary context cap`);
		return true;
	}
	const prepared = await prepareNextDeliveryGroup(() => [...params.queue.summaryElisions.flatMap((entry) => entry.sources), ...params.queue.summarySources], params.assertCurrent);
	prepared.assertCurrent();
	const sources = prepared.items;
	const source = sources.at(-1);
	if (!source) return false;
	const summarizedSources = params.queue.cap > 0 ? sources.slice(-params.queue.cap) : sources;
	const summaryLines = resolveQueueSummaryLines(params.queue, summarizedSources);
	const prompt = previewQueueSummaryPrompt({
		state: {
			droppedCount: sources.length,
			summaryLines
		},
		noun: "message"
	});
	if (!prompt) return false;
	await runQueueSummaryDelivery(params.queue, {
		droppedCount: sources.length,
		sources
	}, ({ abortSignal, onAdmitted }) => runSyntheticOverflowSummary({
		source,
		sources,
		currentInboundContext: collectCurrentInboundContext(summarizedSources),
		prompt,
		abortSignal,
		onAdmitted,
		runFollowup: params.runFollowup
	}));
	return true;
}
function scheduleFollowupDrain(key, runFollowup) {
	const existingQueue = FOLLOWUP_QUEUES.get(key);
	if (existingQueue?.draining) {
		rememberFollowupDrainCallback(key, runFollowup);
		existingQueue.rescheduleRequested = true;
		return;
	}
	const queue = beginQueueDrain(FOLLOWUP_QUEUES, key);
	if (!queue) return;
	queue.rescheduleRequested = false;
	const assertDrainCurrent = () => {
		if (FOLLOWUP_QUEUES.get(key) !== queue || queue.abortController.signal.aborted || queue.items.some((item) => item.steerPending)) throw new FollowupRunDeferredError("Followup drain ownership changed during preparation");
	};
	const effectiveRunFollowup = FOLLOWUP_RUN_CALLBACKS.get(key) ?? runFollowup;
	const runIndividualFollowup = async (item) => {
		try {
			await effectiveRunFollowup(item);
		} catch (error) {
			updateFollowupRetryHeartbeats(error, [item]);
			throw error;
		}
	};
	const reserveOptions = {
		inFlight: queue.inFlight,
		shouldRestoreOnError: () => FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted,
		onDiscard: (item) => completeFollowupRunLifecycle(item)
	};
	rememberFollowupDrainCallback(key, effectiveRunFollowup);
	let drainStarted = false;
	const drainQueuedFollowups = async () => {
		drainStarted = true;
		let waitingForSteer = false;
		let databaseAdmissionClosed = false;
		try {
			const collectState = { forceIndividualCollect: false };
			while (queue.items.length > 0 || queue.droppedCount > 0) {
				await dropAbortedFollowups(queue, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				await waitForQueueDebounce(queue, queue.abortController.signal);
				await dropAbortedFollowups(queue, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				if (await drainProtectedPriorityFollowup(queue, runIndividualFollowup)) continue;
				if (queue.droppedCount > 0 && await drainOverflowSummaryGroup({
					queue,
					runFollowup: effectiveRunFollowup,
					assertCurrent: assertDrainCurrent
				})) continue;
				if (queue.mode === "collect") {
					const isCrossChannel = hasCrossChannelItems(queue.items, resolveCrossChannelKey) || queue.items.some(requiresIndividualCollectDrain);
					if (collectState.forceIndividualCollect && !isCrossChannel && queue.items.length > 1) collectState.forceIndividualCollect = false;
					const collectDrainResult = await drainCollectQueueStep({
						collectState,
						isCrossChannel,
						items: queue.items,
						run: runIndividualFollowup,
						reserveOptions
					});
					if (collectDrainResult === "empty") break;
					if (collectDrainResult === "drained") continue;
					const prepared = await prepareNextDeliveryGroup(() => queue.items, assertDrainCurrent);
					prepared.assertCurrent();
					if (prepared.items.length === 0) break;
					const currentGroupItems = prepared.items.filter((item) => queue.items.includes(item));
					const abortedGroupItems = currentGroupItems.filter(isFollowupRunAborted);
					if (abortedGroupItems.length > 0) {
						removeQueuedItemsByRef(queue.items, abortedGroupItems);
						completeFollowupRuns(abortedGroupItems);
					}
					const activeGroupItems = currentGroupItems.filter((item) => !isFollowupRunAborted(item));
					if (activeGroupItems.length === 0) continue;
					assertSingleAdmissionOwner(activeGroupItems);
					const groupSource = expectDefined(activeGroupItems.at(-1), "active collect source");
					const run = resolveCollectedRun(activeGroupItems, groupSource.run);
					const routing = resolveOriginRoutingMetadata(activeGroupItems);
					const prompt = buildCollectPrompt({
						title: "[Queued messages while agent was busy]",
						items: activeGroupItems,
						renderItem: (item, index) => renderCollectItemPrompt(item, index, resolveCollectedSourceText(item.userTurnTranscriptRecorder?.getPendingInputMessage?.(), item.prompt))
					});
					const transcriptPrompt = buildCollectTranscriptInput(activeGroupItems).text;
					const userTurnTranscriptRecorder = createCollectUserTurnTranscriptRecorder(activeGroupItems);
					const aggregateOwner = resolveAggregateOwner(activeGroupItems);
					const cancellation = createAggregateCancellation(activeGroupItems);
					let admitted = false;
					const restoreGroupItems = (groupItemsToRestore) => {
						const missingItems = groupItemsToRestore.filter((item) => !queue.items.includes(item));
						queue.items.unshift(...missingItems);
					};
					const needsGroupAdmission = activeGroupItems.length > 1 || activeGroupItems.some((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle));
					const admitGroupSources = async () => {
						admitted = true;
						removeQueuedItemsByRef(queue.items, activeGroupItems);
						await Promise.all(activeGroupItems.map((item) => admitFollowupRunLifecycle(item)));
						cancellation.admit();
						for (const item of activeGroupItems) if (item !== aggregateOwner) retireFollowupRunCancellation(item);
					};
					const completeGroup = () => {
						removeQueuedItemsByRef(queue.items, activeGroupItems);
						completeFollowupRuns(activeGroupItems);
					};
					try {
						for (const item of activeGroupItems) queue.inFlight.add(item);
						await effectiveRunFollowup({
							prompt,
							transcriptPrompt,
							...userTurnTranscriptRecorder ? { userTurnTranscriptRecorder } : {},
							run,
							messageId: groupSource.messageId ?? resolveFollowupReplyAnchor(groupSource),
							enqueuedAt: Date.now(),
							...routing,
							...collectRuntimeMetadata(activeGroupItems, cancellation.signal),
							...needsGroupAdmission ? { turnAdoptionLifecycle: createAggregateLifecycle(activeGroupItems, admitGroupSources, () => {
								if (admitted) completeGroup();
							}) } : {},
							...collectQueuedPromptMedia(activeGroupItems)
						});
					} catch (err) {
						updateFollowupRetryHeartbeats(err, activeGroupItems);
						if (admitted) completeGroup();
						else if (reserveOptions.shouldRestoreOnError()) restoreGroupItems(activeGroupItems);
						else completeFollowupRuns(activeGroupItems);
						throw err;
					} finally {
						for (const item of activeGroupItems) queue.inFlight.delete(item);
						cancellation.dispose();
					}
					if (!admitted) {
						const canceledSources = activeGroupItems.filter(isFollowupRunAborted);
						if (canceledSources.length > 0) {
							removeQueuedItemsByRef(queue.items, canceledSources);
							completeFollowupRuns(canceledSources);
							const survivors = activeGroupItems.filter((item) => !canceledSources.includes(item));
							if (reserveOptions.shouldRestoreOnError()) restoreGroupItems(survivors);
							else completeFollowupRuns(survivors);
							continue;
						}
					}
					completeGroup();
					continue;
				}
				if (!await drainNextQueueItem(queue.items, runIndividualFollowup, reserveOptions)) break;
			}
		} catch (err) {
			queue.lastEnqueuedAt = Date.now();
			databaseAdmissionClosed = err instanceof AgentDatabaseExecutionAdmissionClosedError;
			if (!(err instanceof FollowupRunDeferredError)) {
				if (isGatewayRestartDrainError(err)) await waitForGatewayRestartFenceSettlement();
				else defaultRuntime.error?.(`followup queue drain failed for ${key}: ${String(err)}`);
			}
		} finally {
			if (FOLLOWUP_QUEUES.get(key) === queue) {
				queue.draining = false;
				const hasPendingQueueWork = queue.items.length > 0 || queue.droppedCount > 0;
				if (waitingForSteer && hasPendingQueueWork) {
					if (!queue.items.some((item) => item.steerPending)) scheduleFollowupDrain(key, effectiveRunFollowup);
				} else if (!hasPendingQueueWork) {
					FOLLOWUP_QUEUES.delete(key);
					clearFollowupDrainCallback(key);
				} else if (!databaseAdmissionClosed || queue.rescheduleRequested) scheduleFollowupDrain(key, effectiveRunFollowup);
			}
		}
	};
	runWithGatewayDetachedWorkContinuation(() => runOutsideAdmittedGenerationScopes(drainQueuedFollowups), "session:followup-drain").catch((err) => {
		if (!drainStarted && FOLLOWUP_QUEUES.get(key) === queue) queue.draining = false;
		defaultRuntime.error?.(`followup queue drain admission failed for ${key}: ${String(err)}`);
	});
}
//#endregion
export { rememberFollowupDrainCallback as a, createOverflowSummaryRetrySource as c, prepareStaleFollowupDrainRetirement as i, resolveFollowupAuthorizationKey as l, dropAbortedFollowups as n, scheduleFollowupDrain as o, kickFollowupDrainIfIdle as r, consumeQueueSummaryDelivery as s, clearFollowupDrainCallback as t, resolveFollowupDeliveryStorageKey as u };
