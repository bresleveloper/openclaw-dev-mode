import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { o as getRuntimeConfigSnapshot, s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { s as consumeCronNextCheckProposal, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { h as resolveConfiguredAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { o as readAgentDeletionJournalStatusInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { l as readToolAllowlistIntersection, t as attachToolAllowlistIntersection } from "./tool-policy-shared-PsZCKeeN.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match--5jlhAPZ.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { c as resolveSystemEventQueueKey, l as withSystemEventOwner } from "./system-event-ownership-DAgHWXZ1.mjs";
import { i as isSessionStoreReadCandidateCurrent } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as isAgentDeletionBlocked } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { m as resolveAgentRunErrorLifecycleFields } from "./run-termination-Dwf1ksjA.mjs";
import { n as SessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { r as resolveCronRunToolsAllow } from "./tools-allow-BHyxEpHd.mjs";
import { d as withExecRequestOwners, l as readExecRequestOwners, s as execRequestAbortSignal } from "./exec-request-context-CWnK9ayt.mjs";
import { d as stringifyRouteThreadId, i as channelRouteTargetsMatchExact, n as channelRouteDedupeKey } from "./channel-route-2bD3dZs2.mjs";
import { n as claimSystemEventTurn, o as enqueueRequiredSystemEventEntry } from "./system-events-Bf4ozS7L.mjs";
import { t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-DHdTDo8H.mjs";
import { o as hasNonzeroUsage } from "./usage-BqbJmOEZ.mjs";
import { l as resolveCreatorSandbox } from "./operator-role-policy-Coro3qc5.mjs";
import { n as bindCommandOwnerAuthority } from "./command-owner-authority-DGt-GTro.mjs";
import { i as sessionToolOverridesEqual } from "./session-tool-overrides-B6c6gJaM.mjs";
import { _ as narrowSessionEventSettings, o as getGatewayToolCallerIdentity, s as prepareGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { i as sessionDeliveryRoute, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-D9KEia-0.mjs";
import { a as setChannelSourceTurnId } from "./source-turn-id-DjBP_DbU.mjs";
//#region src/cron/run-telemetry.ts
/** Project the execution owner's aggregate usage without recording it a second time. */
function projectCronRunUsage(usage) {
	if (!hasNonzeroUsage(usage)) return;
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const bucketTotal = input + output + cacheRead + cacheWrite;
	const total = typeof usage.total === "number" && Number.isFinite(usage.total) ? Math.max(bucketTotal, usage.total) : bucketTotal;
	return {
		input_tokens: input,
		output_tokens: output,
		...total > 0 ? { total_tokens: total } : {},
		...cacheRead > 0 ? { cache_read_tokens: cacheRead } : {},
		...cacheWrite > 0 ? { cache_write_tokens: cacheWrite } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/session-event-automation.ts
const log$1 = createSubsystemLogger("session-events");
/** Retain the event's exact cleanup destination before config or state remapping. */
function prepareCronRunContinuationCleanup(sessionKey, _storePath, env) {
	if (!isCronRunSessionKey(sessionKey)) return;
	const context = captureOpenClawStateWorkerContext({ env });
	return () => {
		runWithGatewayDetachedWorkContinuation(async () => {
			const { removeCronRunContinuationSessionIfIdle } = await import("./run-continuation-cleanup-DtK6xNdy.mjs");
			await removeCronRunContinuationSessionIfIdle(sessionKey, void 0, context);
		}, "session:event-cleanup").catch((error) => {
			log$1.warn("Could not remove settled cron continuation", { error: String(error) });
		});
	};
}
function resolveScheduledSessionReplyOptions(automation) {
	if (!automation) return {};
	const payload = automation.job.payload;
	return {
		operatorAuthority: automation.operatorAuthority,
		sourceReplyDeliveryMode: "automatic",
		...payload.kind === "agentTurn" ? {
			modelOverride: payload.model,
			thinkingLevelOverride: payload.thinking,
			timeoutOverrideSeconds: payload.timeoutSeconds,
			bootstrapContextMode: payload.lightContext ? "lightweight" : "full"
		} : {}
	};
}
/** Project delivery and cadence only after the ordinary invocation completes. */
async function settleSessionAutomationTurn(params) {
	const { automation, runId, deliveryEvidence } = params;
	let sourceDeliveryOutcome;
	if (automation.sourceDelivery) {
		const { resolveSourceDeliveryOutcome } = await import("./source-delivery-plan-CKJ8B64U.mjs");
		await params.prepareCurrent();
		sourceDeliveryOutcome = resolveSourceDeliveryOutcome(automation.sourceDelivery, {
			didSendViaMessageTool: deliveryEvidence?.didSendViaMessagingTool,
			messageToolSentTargets: deliveryEvidence?.messagingToolSentTargets
		});
	}
	return {
		nextCheckMs: params.outcome === "completed" ? consumeCronNextCheckProposal(runId, automation.job.id) : void 0,
		sourceDeliveryOutcome,
		automationResult: {
			provider: deliveryEvidence?.meta?.agentMeta?.provider ?? deliveryEvidence?.resolved?.provider,
			model: deliveryEvidence?.meta?.agentMeta?.model ?? deliveryEvidence?.resolved?.model,
			usage: projectCronRunUsage(deliveryEvidence?.meta?.agentMeta?.usage),
			replyDisposition: deliveryEvidence?.meta?.terminalReply?.disposition,
			diagnostics: createCronRunDiagnosticsFromAgentResult(deliveryEvidence, { finalStatus: params.outcome === "completed" ? "ok" : "error" })
		}
	};
}
//#endregion
//#region src/auto-reply/reply/effective-reply-route.ts
/** Resolves the effective reply route from current context and persisted session route. */
/** Normalizes an external target without collapsing provider-owned topic suffixes. */
function normalizeEffectiveReplyTarget(raw, channel, threadId) {
	let target = normalizeOptionalString(raw);
	if (target && channel && threadId != null) target = getLoadedChannelPluginForRead(channel)?.threading?.resolveCurrentChannelId?.({
		to: target,
		threadId
	}) ?? target;
	return target ? normalizeOptionalString(stripOutboundTargetKindPrefix(stripTargetProviderPrefix(target, channel ?? ""))) : void 0;
}
function isSessionsSendInterSessionHandoff(inputProvenance) {
	return inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool?.toLowerCase() === "sessions_send";
}
function resolveTrustedInheritedThreadId(entry) {
	const deliveryThreadId = deliveryContextFromSession(entry)?.threadId;
	if (deliveryThreadId == null) return;
	const routeThread = sessionDeliveryRoute(entry)?.thread;
	if (routeThread?.id != null && (routeThread.source === "explicit" || routeThread.source === "target" || routeThread.source === "turn") && stringifyRouteThreadId(routeThread.id) === stringifyRouteThreadId(deliveryThreadId)) return deliveryThreadId;
}
/** Resolves current, inherited, or persisted reply route for a session turn. */
function resolveEffectiveReplyRoute(params) {
	const currentSurface = normalizeMessageChannel(params.ctx.Provider) ?? normalizeMessageChannel(params.ctx.Surface) ?? normalizeMessageChannel(params.ctx.OriginatingChannel);
	const persistedDeliveryContext = deliveryContextFromSession(params.entry);
	const persistedRoute = sessionDeliveryRoute(params.entry);
	const persistedOrigin = sessionDeliveryOrigin(params.entry);
	const persistedDeliveryChannel = normalizeMessageChannel(persistedDeliveryContext?.channel);
	const liveChatType = normalizeChatType(params.ctx.ChatType);
	const persistedChatType = persistedRoute?.target?.chatType ?? params.entry?.chatType ?? normalizeChatType(persistedOrigin?.chatType);
	if (isSessionsSendInterSessionHandoff(params.ctx.InputProvenance) && currentSurface === "webchat" && persistedDeliveryChannel && persistedDeliveryChannel !== "webchat" && persistedDeliveryContext?.to) {
		const inheritedThreadId = resolveTrustedInheritedThreadId(params.entry);
		return {
			channel: persistedDeliveryChannel,
			to: persistedDeliveryContext.to,
			accountId: persistedDeliveryContext.accountId,
			...inheritedThreadId !== void 0 ? { threadId: inheritedThreadId } : {},
			...persistedChatType ? { chatType: persistedChatType } : {},
			inheritedExternalRoute: true
		};
	}
	const liveChannel = params.ctx.OriginatingChannel;
	const canInheritPersistedTuple = params.ctx.InternalTurnSource !== void 0 && (!liveChannel || normalizeMessageChannel(liveChannel) === normalizeMessageChannel(persistedDeliveryContext?.channel));
	const chatType = liveChatType ?? (canInheritPersistedTuple ? persistedChatType : void 0);
	return {
		channel: params.ctx.InternalTurnSource === void 0 ? liveChannel : liveChannel ?? persistedDeliveryContext?.channel,
		to: params.ctx.OriginatingTo ?? (canInheritPersistedTuple ? persistedDeliveryContext?.to : void 0),
		accountId: params.ctx.AccountId ?? (canInheritPersistedTuple ? persistedDeliveryContext?.accountId : void 0),
		...params.ctx.MessageThreadId !== void 0 ? { threadId: params.ctx.MessageThreadId } : {},
		...chatType ? { chatType } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/session-event-target.ts
/** Captured destination identity and live generation facts for ordinary session events. */
function assertCapturedEventSource(source) {
	if (!source) return;
	const identity = readDatabasePathIdentitySync(source.database.path);
	if (identity.key !== source.identity.key || identity.birthtime !== source.identity.birthtime || !isSessionStoreReadCandidateCurrent(source.selectedStore)) throw new Error(`Session event destination storage changed after capture (${JSON.stringify({
		capturedFile: source.identity.key.startsWith("file:"),
		currentFile: identity.key.startsWith("file:"),
		sameIdentity: identity.key === source.identity.key,
		sameBirthtime: identity.birthtime === source.identity.birthtime,
		sameCandidate: isSessionStoreReadCandidateCurrent(source.selectedStore)
	})})`);
}
const targetScopes = resolveGlobalSingleton(Symbol.for("openclaw.sessionEvents.targetScopes"), () => /* @__PURE__ */ new WeakMap());
function getSessionEventRuntimeConfig() {
	const cfg = getRuntimeConfigSnapshot();
	if (!cfg) throw new Error("Session event admission requires an initialized runtime config; start the Gateway and retry");
	return cfg;
}
function resolveSessionEventKey(agentId, sessionKey) {
	const cfg = getSessionEventRuntimeConfig();
	const raw = sessionKey.trim();
	const owner = parseAgentSessionKey(raw)?.agentId;
	if (!raw || owner && owner !== agentId) throw new Error("Session event requires an exact session owned by its agent");
	if (raw === "global") return raw;
	return canonicalizeMainSessionAlias({
		cfg,
		agentId,
		sessionKey: toAgentStoreSessionKey({
			agentId,
			requestKey: raw,
			mainKey: cfg.session?.mainKey
		})
	});
}
/** Capture at the producer's admission, before asynchronous work can outlive its session. */
async function captureSessionEventTargetForHost(requestedAgentId, requestedSessionKey, options = {}) {
	const operatorAuthority = options.operatorAuthority;
	if (operatorAuthority) {
		assertAdmittedRunOperatorAuthority(operatorAuthority);
		operatorAuthority.assertCurrent();
	}
	options.assertCaptureCurrent?.();
	options.assertCurrent?.();
	const agentId = normalizeAgentId(requestedAgentId);
	const sessionKey = resolveSessionEventKey(agentId, requestedSessionKey);
	const cfg = getSessionEventRuntimeConfig();
	const env = options.env ? { ...options.env } : void 0;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, {
		agentId,
		env
	});
	const generation = getAgentEventLifecycleGeneration();
	const caller = getGatewayToolCallerIdentity();
	const callerAgentMatches = caller?.agentId === agentId;
	if (callerAgentMatches) resolveSessionEventKey(agentId, caller.sessionKey);
	const deliver = callerAgentMatches && (caller.sessionEventDelivery === false || caller.operationalRunInstance && getAgentRunContext(caller.operationalRunInstance.runId)?.sessionEventDelivery === false) ? false : void 0;
	const preparedCaller = callerAgentMatches && caller?.operationalRunInstance ? await prepareGatewayToolCallerAssertion() : void 0;
	const assertCaptureCurrent = () => {
		operatorAuthority?.assertCurrent();
		options.assertCaptureCurrent?.();
		options.assertCurrent?.();
		assertAgentRunLifecycleGenerationCurrent(generation);
		if (!callerAgentMatches || !caller) return;
		if (preparedCaller) preparedCaller.assertCurrent?.();
		else if (caller.receiptAuthority?.() === false || caller.approvalSignals?.some((signal) => signal.aborted)) throw new Error("Session event producer no longer owns its invocation");
	};
	try {
		assertCaptureCurrent();
		const { withSessionEntryReadOnlyInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
		let source;
		let preparedSource;
		const entry = await withSessionEntryReadOnlyInWorker({
			agentId,
			storePath,
			sessionKey,
			env
		}, assertCaptureCurrent, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (preparedSource && owner.selectedStore) source = {
				...preparedSource,
				identity: owner.source ? {
					...preparedSource.identity,
					key: `file:${owner.source.databaseIdentity}`,
					birthtime: owner.source.databaseBirthtime
				} : preparedSource.identity,
				selectedStore: { ...owner.selectedStore }
			};
			return read.value;
		}, (database, identity) => {
			preparedSource = {
				database: {
					...database,
					env: { ...database.env }
				},
				identity: { ...identity }
			};
		});
		assertCapturedEventSource(source);
		let toolsAllow;
		if (caller && callerAgentMatches) {
			assertCaptureCurrent();
			if (caller.sessionEventToolsAllow) {
				if (caller.sessionEventToolsAllow.length > 512 || caller.sessionEventToolsAllow.some((name) => name.length > 256)) throw new Error("Session event producer tool surface exceeds the supported bound");
				toolsAllow = intersectSessionEventToolsAllow(caller.sessionEventToolsAllow);
			}
		}
		toolsAllow = intersectSessionEventToolsAllow(toolsAllow, options.producerPolicy?.toolsAllow);
		const destinationSettings = entry ? {
			permissionMode: entry.permissionMode,
			toolOverrides: entry.toolOverrides
		} : void 0;
		const callerSettings = callerAgentMatches ? caller?.sessionEventSettings : void 0;
		const producerSettings = options.producerPolicy?.settings && callerSettings ? narrowSessionEventSettings(options.producerPolicy.settings, callerSettings) : options.producerPolicy?.settings ?? callerSettings;
		const target = {
			agentId,
			sessionKey,
			storePath,
			toolsAllow,
			deliver,
			assertCurrent: options.assertCurrent,
			sessionId: entry?.sessionId ?? "",
			lifecycleRevision: entry?.lifecycleRevision,
			generation,
			deliveryContext: structuredClone(deliveryContextFromSession(entry)),
			chatType: resolveEffectiveReplyRoute({
				ctx: { InternalTurnSource: "event" },
				entry
			}).chatType,
			settings: structuredClone(producerSettings ? narrowSessionEventSettings(producerSettings, destinationSettings) : destinationSettings)
		};
		targetScopes.set(target, {
			env,
			source,
			operatorAuthority
		});
		return target;
	} finally {
		preparedCaller?.release();
	}
}
/** Validate the original destination; callers still own the live execution/delivery claim. */
function assertSessionEventTargetCurrent(target) {
	target.assertCurrent?.();
	if (!target.agentId || !target.sessionKey) throw new Error("Session event target has no original owner");
	const cfg = getSessionEventRuntimeConfig();
	resolveConfiguredAgentId(cfg, target.agentId);
	assertAgentRunLifecycleGenerationCurrent(target.generation);
	if (isAgentDeletionBlocked(target.agentId)) throw new Error("Session event owner is being deleted");
	const storePath = resolveSessionStorePathCore(cfg.session?.store, {
		agentId: target.agentId,
		env: targetScopes.get(target)?.env
	});
	if (target.storePath && target.storePath !== storePath) throw new Error("Session event destination was reset or replaced while its producer was running");
}
/** Deferred producers retain snapshots; only admitted consumption holds live generation facts. */
async function prepareSessionEventTargetForHost(target, options = {}) {
	assertSessionEventTargetCurrent(target);
	if (!target.agentId || !target.sessionKey || !target.storePath) throw new Error("Session event target has no captured destination");
	const { prepareSessionGenerationFacts } = await import("./session-delivery-generation-CvdW_1dk.mjs");
	const source = targetScopes.get(target)?.source;
	const assertAcceptance = () => {
		options.assertAcceptanceCurrent?.();
		assertSessionEventTargetCurrent(target);
	};
	assertAcceptance();
	assertCapturedEventSource(source);
	let preparation;
	if (!target.sessionId && options.createIfMissing) {
		if (!source) throw new Error("Fresh session event has no captured physical storage owner");
		const { prepareSessionEntryMutationDatabases } = await import("./session-accessor.entry-mutation-DRbLiej0.mjs");
		assertAcceptance();
		preparation = prepareSessionEntryMutationDatabases([{
			scope: {
				agentId: target.agentId,
				storePath: target.storePath,
				sessionKey: target.sessionKey,
				env: source.database.env
			},
			assertCurrent: assertAcceptance,
			expectedSource: source
		}], Promise.resolve());
	}
	let lease;
	let preparedSource = source;
	try {
		try {
			const prepared = await preparation?.preparations[0];
			assertAcceptance();
			prepared?.assertCurrent();
			if (!prepared) assertCapturedEventSource(source);
			else if (source?.identity.key.startsWith("path:")) {
				const accepted = prepared.execution?.fileIdentity;
				if (!accepted || typeof accepted.birthtime !== "string") throw new Error("Fresh session event has no accepted physical storage identity");
				preparedSource = {
					...source,
					identity: {
						...source.identity,
						key: `file:${accepted.physicalIdentity}`,
						birthtime: accepted.birthtime
					}
				};
			}
			lease = await prepareSessionGenerationFacts({
				agentId: target.agentId,
				storePath: source?.database.path ?? target.storePath,
				sessionKey: target.sessionKey,
				sessionId: target.sessionId || null,
				lifecycleRevision: target.lifecycleRevision ?? null,
				env: source?.database.env
			});
			prepared?.assertCurrent();
			assertAcceptance();
			assertCapturedEventSource(preparedSource);
		} finally {
			await preparation?.[Symbol.asyncDispose]();
		}
		assertAcceptance();
		assertCapturedEventSource(preparedSource);
		lease.assertCurrent();
		if (preparedSource !== source) {
			const captured = targetScopes.get(target);
			if (captured?.source !== source) throw new Error("Session event storage was already prepared by another admission");
			targetScopes.set(target, {
				...captured,
				source: preparedSource
			});
		}
		const retained = lease;
		const assertTargetCurrent = () => {
			assertSessionEventTargetCurrent(target);
			assertCapturedEventSource(preparedSource);
		};
		const assertCurrent = () => {
			assertTargetCurrent();
			retained.assertCurrent();
		};
		assertCurrent();
		return {
			...retained,
			assertCurrent,
			bindCreation: (operation) => {
				assertTargetCurrent();
				const assertCreationCurrent = retained.bindCreation(operation, (binding) => {
					target.sessionId = binding.sessionId;
					target.lifecycleRevision = binding.lifecycleRevision;
				});
				return () => {
					assertTargetCurrent();
					assertCreationCurrent();
				};
			}
		};
	} catch (error) {
		lease?.release();
		throw error;
	}
}
function readSessionEventTargetEnvironment(target) {
	return targetScopes.get(target)?.env;
}
function readSessionEventTargetOperatorAuthority(target) {
	return targetScopes.get(target)?.operatorAuthority;
}
/** Coalesced work retains every producer's original destination and permission bound. */
function combineSessionEventTargetsForHost(targets) {
	const first = targets[0];
	if (!first) throw new Error("Session event batch requires a captured destination");
	const retained = [...targets];
	const route = channelRouteDedupeKey(first.deliveryContext);
	for (const target of retained) {
		if (targetScopes.get(target)?.operatorAuthority !== targetScopes.get(first)?.operatorAuthority) throw new Error("Session event batch has different operator authorities");
		if (target.agentId !== first.agentId || target.sessionKey !== first.sessionKey || target.storePath !== first.storePath || target.sessionId !== first.sessionId || target.lifecycleRevision !== first.lifecycleRevision || target.generation !== first.generation || target.chatType !== first.chatType || channelRouteDedupeKey(target.deliveryContext) !== route) throw new Error("Session event batch has different captured destinations");
	}
	const assertCurrent = () => {
		for (const target of retained) {
			assertSessionEventTargetCurrent(target);
			assertCapturedEventSource(targetScopes.get(target)?.source);
		}
	};
	assertCurrent();
	const combined = {
		...first,
		deliveryContext: structuredClone(first.deliveryContext),
		assertCurrent,
		settings: retained.reduce((settings, target) => narrowSessionEventSettings(settings, target.settings), first.settings),
		toolsAllow: intersectSessionEventToolsAllow(...retained.map((target) => target.toolsAllow)),
		deliver: retained.some((target) => target.deliver === false) ? false : first.deliver
	};
	targetScopes.set(combined, targetScopes.get(first) ?? {});
	return combined;
}
/** Retain each canonical cap independently; overlapping globs cannot be flattened safely. */
function intersectSessionEventToolsAllow(...allowlists) {
	const restrictions = allowlists.flatMap((allow) => allow === void 0 ? [] : (readToolAllowlistIntersection(allow) ?? [allow]).map((restriction) => restriction.slice()));
	if (restrictions.length === 0) return;
	const candidates = [...new Set(restrictions.flat())].filter((name) => restrictions.every((restriction) => isRuntimeToolAllowed(name, restriction)));
	return attachToolAllowlistIntersection(candidates, restrictions);
}
/** Frozen tools may continue only while the current session still covers their admitted policy. */
function assertSessionEventSettingsCurrent(admitted, current) {
	const narrowed = narrowSessionEventSettings(admitted, current);
	if (admitted?.permissionMode !== narrowed.permissionMode || !sessionToolOverridesEqual(admitted?.toolOverrides, narrowed.toolOverrides)) throw new Error("Session event permissions were restricted; start a new turn under the current policy.");
}
//#endregion
//#region src/auto-reply/reply/session-event-context.ts
/** Prepare immutable producer context before the receipt acquires occurrence custody. */
function prepareSessionEventInput(text, options) {
	const operatorAuthority = options.expectedTarget ? readSessionEventTargetOperatorAuthority(options.expectedTarget) : void 0;
	operatorAuthority?.assertCurrent();
	const cfg = getSessionEventRuntimeConfig();
	const configPublication = getRuntimeConfigSnapshotMetadata();
	const agentId = normalizeAgentId(options.agentId);
	resolveConfiguredAgentId(cfg, agentId);
	const sessionKey = resolveSessionEventKey(agentId, options.sessionKey);
	if (!text.trim()) throw new Error("Session event text must not be empty");
	const env = options.expectedTarget ? readSessionEventTargetEnvironment(options.expectedTarget) : void 0;
	return {
		cfg,
		configPublication,
		agentId,
		sessionKey,
		env,
		storePath: options.expectedTarget?.storePath ?? resolveSessionStorePathCore(cfg.session?.store, {
			agentId,
			env
		}),
		operatorAuthority
	};
}
function resolveSessionEventExecRequestOwners(options) {
	return options.occurrences ? [...new Set(options.occurrences.flatMap((occurrence) => readExecRequestOwners(occurrence) ?? readExecRequestOwners(options) ?? []))] : readExecRequestOwners(options);
}
function buildSessionEventContext(params) {
	const { agentId, sessionKey, text, options, occurrenceId, deliveryContext, target } = params;
	const ctx = {
		AgentId: agentId,
		SessionKey: sessionKey,
		Body: text,
		BodyForAgent: text,
		InternalTurnSource: "event",
		BodyForCommands: "",
		CommandBody: "",
		RawBody: "",
		CommandAuthorized: false,
		InputProvenance: {
			kind: "internal_system",
			sourceTool: options.source
		},
		ChatType: channelRouteTargetsMatchExact({
			left: deliveryContext,
			right: target.deliveryContext
		}) ? target.chatType : void 0,
		Surface: deliveryContext?.channel ?? "webchat",
		Provider: deliveryContext?.channel ?? "webchat",
		OriginatingChannel: deliveryContext?.channel,
		OriginatingTo: deliveryContext?.to,
		AccountId: deliveryContext?.accountId,
		MessageThreadId: deliveryContext?.threadId,
		MessageSid: options.readmissionAttempt ? `${occurrenceId}:readmission-${options.readmissionAttempt}` : occurrenceId
	};
	const automation = options.scheduledAutomation;
	if (automation && !target.sessionId) ctx.SessionCreation = {
		via: "cron",
		actor: automation.job.createdActor ?? { type: "system" },
		sandbox: resolveCreatorSandbox(params.cfg, { actor: automation.job.createdActor }),
		skillLibrarySelections: automation.job.skillLibrarySelections
	};
	if (automation?.controlUiAdmin && automation.operatorAuthority) bindCommandOwnerAuthority(ctx, {
		operatorAuthority: automation.operatorAuthority,
		isCurrent: () => {
			params.assertCurrent();
			return true;
		}
	});
	setChannelSourceTurnId(ctx, options.sourceTurnId);
	return ctx;
}
//#endregion
//#region src/auto-reply/reply/session-event-delivery.ts
async function prepareSessionEventDelivery(route, assertCurrent) {
	const { isRoutableChannel, routeReply } = await import("./route-reply-xRjXpVr8.mjs");
	assertCurrent();
	if (!isRoutableChannel(route.channel) || !route.to) throw new Error("Session event has no original external delivery route; inspect the session result or choose a delivery destination");
	const { channel, to, accountId, threadId } = route;
	return (params) => routeReply({
		...params,
		channel,
		to,
		accountId,
		threadId,
		mirror: false
	});
}
//#endregion
//#region src/auto-reply/reply/session-event-handoff.ts
const log = createSubsystemLogger("session-events");
/** Policy publications an accepted occurrence may outlive before it settles as failed. */
const MAX_CONFIG_READMISSION_ATTEMPTS = 2;
/** Producer-owned occurrence; passive notices continue to use enqueueSystemEvent. */
function enqueueSessionEventForHost(text, { assertAcceptanceCurrent, ...options }) {
	let acceptanceAssertion = assertAcceptanceCurrent;
	acceptanceAssertion?.();
	options.assertCurrent?.();
	options.expectedTarget?.assertCurrent?.();
	const { cfg, configPublication, agentId, sessionKey, env, storePath, operatorAuthority } = prepareSessionEventInput(text, options);
	const cleanupContinuation = prepareCronRunContinuationCleanup(sessionKey, storePath, env);
	let target = options.expectedTarget;
	let generationLease;
	let preparedBinding;
	if (options.expectedTarget && (options.expectedTarget.storePath && options.expectedTarget.storePath !== storePath || options.expectedTarget.agentId && options.expectedTarget.agentId !== agentId || options.expectedTarget.sessionKey && options.expectedTarget.sessionKey !== sessionKey)) throw new Error("Session event destination was reset or replaced while its producer was running");
	if (options.expectedTarget) assertSessionEventTargetCurrent(options.expectedTarget);
	let route = structuredClone(options.deliveryContext ?? options.expectedTarget?.deliveryContext);
	const controller = new AbortController();
	const execRequestOwners = resolveSessionEventExecRequestOwners(options);
	const requestSignal = execRequestAbortSignal(execRequestOwners, options.abortSignal);
	const signal = AbortSignal.any([
		requestSignal,
		controller.signal,
		operatorAuthority?.signal
	].filter((value) => Boolean(value)));
	signal.throwIfAborted();
	if (options.preserveOccurrenceOnRejection && !options.occurrences?.length) throw new Error("Preserving a rejected event requires its original queued occurrence");
	if (options.occurrences && options.occurrences.map((event) => event.text).join("\n") !== text.trim()) throw new Error("Session event occurrence text changed before admission");
	const freshOccurrence = options.occurrences ? void 0 : enqueueRequiredSystemEventEntry(text, withExecRequestOwners(withSystemEventOwner({
		sessionKey,
		contextKey: options.contextKey,
		deliveryContext: route
	}, agentId), execRequestOwners), { allowDuplicate: true });
	const occurrences = options.occurrences ? [...options.occurrences] : freshOccurrence ? [freshOccurrence] : [];
	const occurrence = occurrences[0];
	if (!occurrence?.id || occurrences.some((event) => !event.id)) throw new Error("Session event was not enqueued: an identical occurrence is already pending");
	const occurrenceId = occurrence.id;
	const eventText = occurrences.map((event) => event.text).join("\n");
	const ownership = claimSystemEventTurn(resolveSystemEventQueueKey(sessionKey, agentId), occurrences, () => controller.abort(), agentId);
	if (!ownership) throw new Error("Session event occurrence no longer available for admission");
	let releaseOperatorAuthority;
	try {
		releaseOperatorAuthority = operatorAuthority?.retain?.();
	} catch (error) {
		ownership.cancel();
		throw error;
	}
	const { promise: settled, resolve } = createDeferredCore();
	const acceptance = createDeferredCore();
	let accepted = false;
	let started = false;
	let admissionStarted = false;
	let deferred = false;
	let adopted = false;
	let configPublicationChanged = false;
	let abandoned = false;
	let readmittedReceipt;
	let operation;
	let replyRunRegistry;
	let inputRecorder;
	let delivered = false;
	let deliveryAttempted = false;
	let deliveryAmbiguous = false;
	let deliveryError;
	let deliverySuppressionReason;
	let summary;
	let failure;
	let nextCheckMs;
	let sourceDeliveryOutcome;
	let automationResult;
	let settlement;
	let settings = options.expectedTarget?.settings;
	let settingsAdmitted = false;
	const jobTools = options.scheduledAutomation ? resolveCronRunToolsAllow(options.scheduledAutomation.job) : void 0;
	const producerTools = options.expectedTarget?.toolsAllow;
	const toolsAllow = intersectSessionEventToolsAllow(jobTools, producerTools);
	const assertOwnerCurrent = () => {
		if (settlement === "finished") throw new Error("Session event occurrence is settled");
		signal.throwIfAborted();
		operatorAuthority?.assertCurrent();
		if (!accepted) acceptanceAssertion?.();
		options.assertCurrent?.();
		options.expectedTarget?.assertCurrent?.();
		const currentConfig = getSessionEventRuntimeConfig();
		resolveConfiguredAgentId(currentConfig, agentId);
		if (isAgentDeletionBlocked(agentId, { env })) throw new Error("Session event agent is being deleted");
		options.scheduledAutomation?.assertCurrent();
		if (operation && (operation.abortSignal.aborted || replyRunRegistry.get(sessionKey) !== operation)) throw new Error("Session event admission no longer owns its destination");
	};
	const assertCurrent = () => {
		assertOwnerCurrent();
		generationLease?.assertCurrent();
		if (settingsAdmitted && generationLease) assertSessionEventSettingsCurrent(settings, generationLease.readSessionSettings());
	};
	const assertEffectCurrent = () => {
		assertCurrent();
		if (getSessionEventRuntimeConfig() !== cfg || getRuntimeConfigSnapshotMetadata() !== configPublication) {
			configPublicationChanged = true;
			throw new Error("Session event configuration changed; retry under the current policy");
		}
	};
	const accept = () => {
		if (accepted || settlement === "finished") return;
		assertCurrent();
		accepted = true;
		acceptanceAssertion = void 0;
		acceptance.resolve({ ok: true });
	};
	const prepareCurrent = async () => {
		assertOwnerCurrent();
		if (operation && preparedBinding && operation.sessionId !== preparedBinding.sessionId) {
			const replacement = await captureSessionEventTargetForHost(agentId, sessionKey, {
				env,
				assertCurrent: assertOwnerCurrent
			});
			if (replacement.sessionId !== operation.sessionId) throw new Error("Session event reply owner lost its rotated destination");
			const replacementLease = await prepareSessionEventTargetForHost(replacement);
			try {
				assertOwnerCurrent();
			} catch (error) {
				replacementLease.release();
				throw error;
			}
			generationLease?.release();
			generationLease = replacementLease;
			preparedBinding = replacement;
		}
		await options.scheduledAutomation?.prepare?.();
		for (let read = generationLease?.prepareRead(); read; read = generationLease?.prepareRead()) await read;
		assertCurrent();
	};
	const start = () => {
		assertCurrent();
		if (started) return;
		ownership.start();
		started = true;
		accept();
	};
	const prepareStart = async (runId) => {
		await prepareCurrent();
		if (runId) start();
	};
	const finish = () => {
		if (settlement) return;
		settlement = "settling";
		const complete = async () => {
			try {
				inputRecorder?.finishPendingInput?.(signal.aborted ? "cancelled" : "interrupted");
				await inputRecorder?.waitForPendingInputSettlement?.();
			} catch (error) {
				failure ??= error instanceof Error ? error : String(error);
			}
			settlement = "finished";
			const pendingAcceptanceAssertion = accepted ? void 0 : acceptanceAssertion;
			acceptanceAssertion = void 0;
			const configChangeRetention = configPublicationChanged && !started && !deliveryAttempted && !signal.aborted && !abandoned;
			const attempt = options.readmissionAttempt ?? 0;
			const canReadmit = configChangeRetention && attempt < MAX_CONFIG_READMISSION_ATTEMPTS;
			const status = signal.aborted ? "cancelled" : failure ? "failed" : "completed";
			if (status === "failed" && !canReadmit) log.error("session event execution failed", {
				source: options.source,
				agentId,
				sessionKey,
				eventId: occurrenceId,
				error: String(failure)
			});
			signal.removeEventListener("abort", onAbort);
			generationLease?.release();
			if (canReadmit) {
				const preservePassive = options.preserveOccurrenceOnRejection && !adopted ? true : void 0;
				ownership.release();
				try {
					readmittedReceipt = enqueueSessionEventForHost(eventText, {
						...options,
						agentId,
						sessionKey,
						assertAcceptanceCurrent: pendingAcceptanceAssertion,
						occurrences,
						preserveOccurrenceOnRejection: preservePassive,
						readmissionAttempt: attempt + 1
					});
				} catch (error) {
					if (!preservePassive) claimSystemEventTurn(resolveSystemEventQueueKey(sessionKey, agentId), occurrences, () => {}, agentId)?.cancel();
					failure = error instanceof Error ? error : String(error);
					log.error("session event policy readmission rejected", {
						source: options.source,
						agentId,
						sessionKey,
						eventId: occurrenceId,
						error: String(failure)
					});
				}
			} else if (options.preserveOccurrenceOnRejection && !adopted && !started) ownership.release();
			else ownership.cancel();
			releaseOperatorAuthority?.();
			releaseOperatorAuthority = void 0;
			if (!accepted) acceptance.resolve(readmittedReceipt?.accepted ?? {
				ok: false,
				error: failure ? String(failure) : "Session event was cancelled before acceptance"
			});
			if (readmittedReceipt) {
				resolve(readmittedReceipt.settled);
				return;
			}
			resolve({
				status,
				executionStarted: started,
				interruptedByRestart: status !== "completed" && resolveAgentRunErrorLifecycleFields(failure, operation?.abortSignal ?? signal).stopReason === "restart",
				delivered,
				deliveryAttempted,
				deliveryAmbiguous,
				deliveryError,
				deliverySuppressionReason,
				admissionDeferred: !started && operation?.result?.kind === "aborted" && operation.result.code === "aborted_for_supersession",
				summary,
				nextCheckMs,
				sourceDeliveryOutcome,
				automationResult,
				...failure ? { error: String(failure) } : {},
				...failure instanceof SessionWorkStartError ? { retryable: failure.retryable } : {}
			});
			cleanupContinuation?.();
		};
		if (operation?.ownerSettlement) operation.ownerSettlement.then(complete, complete);
		else complete();
	};
	const onAbort = () => {
		if (!operation && !admissionStarted) finish();
	};
	const deliver = async (payload, kind) => {
		await prepareCurrent();
		if (kind === "final" && payload.text) summary ??= truncateUtf16Safe(payload.text, 2e3);
		if (options.deliver === false || target?.deliver === false) return;
		if (kind === "final" && sourceDeliveryOutcome?.satisfiesSourceDelivery) return;
		if (!route?.channel || route.channel === "webchat") return;
		const deliverReply = await prepareSessionEventDelivery(route, assertCurrent);
		deliveryAttempted = true;
		const result = await deliverReply({
			cfg: getSessionEventRuntimeConfig(),
			agentId,
			sessionKey,
			payload,
			replyKind: kind,
			abortSignal: signal,
			beforeDeliver: async () => {
				await options.scheduledAutomation?.beforeDeliver?.();
				assertEffectCurrent();
			},
			assertCurrent: assertEffectCurrent
		});
		delivered ||= result.delivered;
		deliveryAmbiguous ||= result.ambiguous === true;
		if (!result.ok) {
			if (!options.scheduledAutomation) throw new Error(result.error ?? "Session event delivery failed");
			deliveryError = result.error ?? "Session event delivery failed";
		}
	};
	signal.addEventListener("abort", onAbort, { once: true });
	runWithoutOwnedSessionTranscriptWrites(() => runWithGatewayDetachedWorkContinuation(async () => {
		admissionStarted = true;
		await readAgentDeletionJournalStatusInWorker(agentId, { env }, signal);
		assertOwnerCurrent();
		const { dispatchInboundMessageWithRoutedChannelDispatcher } = await import("./dispatch-DVmcemzA.mjs");
		({replyRunRegistry} = await import("./reply-run-registry-B5nyD2nN.mjs"));
		const { prepareSessionGenerationFacts } = await import("./session-delivery-generation-CvdW_1dk.mjs");
		target ??= await captureSessionEventTargetForHost(agentId, sessionKey, {
			env,
			assertCurrent: options.assertCurrent,
			assertCaptureCurrent: assertOwnerCurrent
		});
		assertSessionEventTargetCurrent(target);
		if (!target.sessionId && !options.createIfMissing) throw new Error("Session event origin is missing; start fresh authorized work instead");
		generationLease = await prepareSessionEventTargetForHost(target, {
			createIfMissing: options.createIfMissing,
			assertAcceptanceCurrent: assertOwnerCurrent
		});
		settings ??= target.settings;
		route ??= structuredClone(target.deliveryContext);
		await prepareCurrent();
		settings = narrowSessionEventSettings(settings, generationLease.readSessionSettings());
		settingsAdmitted = true;
		const promptText = options.scheduledAutomation?.preparePrompt ? await options.scheduledAutomation.preparePrompt(cfg) : eventText;
		assertEffectCurrent();
		const ctx = buildSessionEventContext({
			cfg,
			agentId,
			sessionKey,
			text: promptText,
			options,
			occurrenceId,
			deliveryContext: route,
			target,
			assertCurrent
		});
		if ((await dispatchInboundMessageWithRoutedChannelDispatcher({
			cfg: {
				...cfg,
				session: {
					...cfg.session,
					store: storePath
				}
			},
			ctx,
			dispatcherOptions: {
				deliver: (payload, info) => deliver(payload, info.kind),
				onError: (error) => {
					failure ??= error instanceof Error ? error : String(error);
				},
				onSkip: (_payload, info) => {
					if (info.kind === "final") deliverySuppressionReason = info.reason;
				}
			},
			replyOptions: {
				scheduledAutomation: options.scheduledAutomation,
				...resolveScheduledSessionReplyOptions(options.scheduledAutomation),
				operatorAuthority: options.scheduledAutomation?.operatorAuthority ?? operatorAuthority,
				admittedSessionSettings: settings,
				toolsAllow,
				onDeliberateSilentTerminalReply: () => {
					deliverySuppressionReason = "silent";
				},
				abortSignal: signal,
				expectedExistingSessionId: target.sessionId || void 0,
				pinExpectedExistingSession: Boolean(target.sessionId),
				onSessionPrepared: (binding) => {
					if (binding.sessionKey === sessionKey) preparedBinding = binding;
				},
				queueModeOverride: "followup",
				suppressTyping: true,
				typingPolicy: "system_event",
				onReplyOperationOwned: (owned) => {
					operation = owned;
				},
				internalEventExecution: {
					prepareInput: async (recorder) => {
						inputRecorder = recorder;
						if (!recorder.stageApproved || !await recorder.stageApproved({
							runId: occurrenceId,
							assertCurrent
						})) throw new Error("Session event input was not durably admitted");
					},
					execRequestOwners,
					deliver: options.deliver === false || target.deliver === false ? false : void 0,
					assertCurrent: assertEffectCurrent,
					...target.sessionId === "" && options.createIfMissing ? { bindSessionCreation: (creation) => {
						assertOwnerCurrent();
						if (!generationLease) throw new Error("Session event lost its original generation owner");
						const assertCreationCurrent = generationLease.bindCreation(creation);
						return () => {
							assertOwnerCurrent();
							assertCreationCurrent();
						};
					} } : {},
					onFailed: (error) => {
						failure ??= error instanceof Error ? error : String(error);
					},
					onSuppressed: (reason) => {
						deliverySuppressionReason = reason === "silent" ? "silent" : void 0;
						if (reason === "aborted") failure ??= "Session event execution was aborted";
					},
					beforeStart: () => prepareStart(),
					...options.scheduledAutomation ? { beforeScheduledStart: prepareStart } : {},
					onStarted: start,
					onTerminal: async (runId, outcome, deliveryEvidence) => {
						if (outcome !== "completed") failure ??= deliveryEvidence?.meta?.error?.message || deliveryEvidence?.payloads?.find((payload) => payload.isError && payload.text?.trim())?.text || `Session event execution ${outcome}`;
						await prepareCurrent();
						if (options.scheduledAutomation) {
							const automationOutcome = await settleSessionAutomationTurn({
								automation: options.scheduledAutomation,
								runId,
								deliveryEvidence,
								prepareCurrent,
								outcome
							});
							nextCheckMs = automationOutcome.nextCheckMs;
							sourceDeliveryOutcome = automationOutcome.sourceDeliveryOutcome;
							automationResult = automationOutcome.automationResult;
							delivered ||= sourceDeliveryOutcome?.satisfiesSourceDelivery === true;
						}
					}
				},
				onQueuedFollowupReplyBatch: async (batch) => {
					if (batch.completion.kind === "failed") failure ??= batch.completion.error;
					else if (batch.completion.kind === "aborted") failure ??= "Session event execution was aborted";
					try {
						for (const payload of batch.payloads) await deliver(payload, batch.completion.kind === "progress" ? "block" : "final");
					} catch (error) {
						failure ??= error instanceof Error ? error : String(error);
						throw error;
					}
				},
				turnAdoptionLifecycle: {
					admission: "exclusive",
					abortSignal: signal,
					onDeferred: () => {
						assertCurrent();
						deferred = true;
						options.scheduledAutomation?.onLaneWait?.({ waiting: true });
						return true;
					},
					onAdopted: async () => {
						adopted = true;
						options.scheduledAutomation?.onLaneWait?.({ waiting: false });
						operation = replyRunRegistry.get(sessionKey);
						if (!operation) throw new Error("Session event has no admitted reply owner");
						if (preparedBinding && !generationLease?.isCreationAdopted() && preparedBinding.sessionId === operation.sessionId && (target?.sessionId !== preparedBinding.sessionId || target?.lifecycleRevision !== preparedBinding.lifecycleRevision)) {
							generationLease?.release();
							generationLease = void 0;
							generationLease = await prepareSessionGenerationFacts({
								agentId,
								storePath,
								sessionKey,
								sessionId: preparedBinding.sessionId,
								lifecycleRevision: preparedBinding.lifecycleRevision ?? null
							});
						}
						await prepareCurrent();
						await options.onAdopted?.();
						assertCurrent();
						accept();
					},
					onAbandoned: () => {
						abandoned ||= !configPublicationChanged;
						failure ??= "Session event was abandoned before execution";
					},
					onSettled: () => {
						if (deferred) finish();
					}
				}
			}
		})).deferredToActiveRun) accept();
		else {
			if (!started) failure ??= "Session event was not admitted; retry against the current session";
			finish();
		}
		await settled;
	}, "session:event")).catch((error) => {
		failure ??= error instanceof Error ? error : String(error);
		finish();
		return settled.then(() => void 0);
	}).finally(() => generationLease?.release());
	return {
		id: occurrenceId,
		cancel: () => {
			if (readmittedReceipt) return readmittedReceipt.cancel();
			if (options.preserveOccurrenceOnRejection && !adopted && !started) {
				if (settlement === "finished" || signal.aborted) return false;
				controller.abort();
				return true;
			}
			return ownership.cancel();
		},
		settled,
		accepted: acceptance.promise
	};
}
//#endregion
export { intersectSessionEventToolsAllow as a, resolveEffectiveReplyRoute as c, combineSessionEventTargetsForHost as i, projectCronRunUsage as l, assertSessionEventTargetCurrent as n, prepareSessionEventTargetForHost as o, captureSessionEventTargetForHost as r, normalizeEffectiveReplyTarget as s, enqueueSessionEventForHost as t };
