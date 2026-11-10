import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-CCVkYF8m.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { t as isConfiguredCommandOwner } from "./command-auth-D8Y1MxJm.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { i as resolveApprovalInitiatingSurfaceStateAsync } from "./exec-approval-surface-DTl_IXDb.mjs";
import { m as isPluginApprovalRequest, s as doesApprovalRequestSelectChannelAccountFromDelivery } from "./approval-request-account-binding-CVzeB0WI.mjs";
import { a as readApprovalRequestSource, c as respondPendingApprovalLookupError, i as prepareApprovalSessionAccess, l as respondUnknownOrExpiredApproval, n as isApprovalRecordVisibleToClient, o as resolvePendingApprovalRecord, s as resolveResolvedApprovalRecord } from "./approval-record-lookup-KFM8XG5s.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/approval-turn-source.ts
/** Returns whether approval replies can route back to the turn's initiating surface. */
async function hasApprovalTurnSourceRoute(params) {
	const channel = normalizeMessageChannel(params.turnSourceChannel);
	if (!channel || channel === "webchat" || channel === "tui") return false;
	return (await resolveApprovalInitiatingSurfaceStateAsync({
		channel,
		accountId: params.turnSourceAccountId,
		cfg: readRuntimeConfig(),
		approvalKind: params.approvalKind ?? "exec",
		...params.request ? { request: params.request } : {}
	})).kind === "enabled";
}
//#endregion
//#region src/gateway/approval-channel-custody.ts
function sameDelivery(before, after) {
	return before?.sessionId === after?.sessionId && isDeepStrictEqual(before?.delivery, after?.delivery);
}
function prepareApprovalChannelCustody(params) {
	const channel = params.reviewer.channel.trim().toLowerCase();
	const accountId = params.reviewer.accountId.trim();
	const senderId = params.reviewer.senderId.trim();
	if (!channel || !accountId || !senderId) return null;
	const plugin = getLoadedChannelPlugin(channel);
	const capability = resolveChannelApprovalCapability(plugin);
	if (params.approvalKind === "plugin" && !canChannelEnforcePluginReviewerPolicy(params.cfg, channel, capability)) return null;
	const authorizeActorAction = capability?.authorizeActorActionAsync ?? capability?.authorizeActorAction;
	const configCurrent = () => (!params.getCfg || params.getCfg() === params.cfg) && getLoadedChannelPlugin(channel) === plugin;
	if (!authorizeActorAction) {
		if (params.approvalKind !== "system-agent" || !isConfiguredCommandOwner(params.cfg, {
			channel,
			accountId,
			senderId
		})) return null;
		return {
			resolverId: `${channel}:${accountId}`,
			authorizes: async () => configCurrent(),
			isCurrent: configCurrent,
			[Symbol.dispose]() {}
		};
	}
	if (!plugin || !plugin.config.listAccountIds(params.cfg).includes(accountId)) return null;
	const prepared = /* @__PURE__ */ new Map();
	let active = true;
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (!active || !configCurrent()) throw new Error("approval reviewer policy changed during preparation");
	};
	return {
		resolverId: `${channel}:${accountId}`,
		async authorizes(request) {
			const existing = prepared.get(request);
			if (existing) return active && configCurrent() && existing.authorized && existing.isCurrent();
			assertCurrent();
			const sessionKey = request.request.sessionKey?.trim() ?? "";
			const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? request.request.agentId ?? "main";
			let delivery = null;
			let isCurrent = () => true;
			let release = () => {};
			const memory = sessionKey && captureMemoryExactSessionReader({
				sessionKey,
				agentId,
				storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
			}, assertCurrent);
			try {
				if (memory) {
					const entry = memory.read(sessionKey, "list");
					delivery = entry ?? null;
					isCurrent = () => sameDelivery(entry, memory.read(sessionKey, "list"));
				} else if (sessionKey && (!request.request.turnSourceAccountId || request.request.turnSourceChannel && request.request.turnSourceChannel.trim().toLowerCase() !== channel)) {
					const scope = {
						agentId,
						storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
						sessionKey,
						projection: "list",
						hydrateSkillPromptRefs: false
					};
					await withSessionEntryReadOnlyInWorker(scope, assertCurrent, async (read, owner) => {
						if (!read.ok) throw read.error;
						delivery = read.value ?? null;
						if (owner.source) {
							const retained = retainPreparedSessionEntryPredicate({
								databaseIdentity: `file:${owner.source.databaseIdentity}`,
								sessionKey: resolveSqliteSessionKey(sessionKey, agentId),
								entry: read.value,
								matches: sameDelivery
							});
							isCurrent = retained.isCurrent;
							release = retained.release;
						}
					});
				}
				const pluginRequest = params.approvalKind === "plugin" && isPluginApprovalRequest(request) ? request : void 0;
				const accountIds = plugin.config.listAccountIds(params.cfg);
				const eligibleAccountIds = params.approvalKind === "plugin" && !pluginRequest ? [] : (await Promise.all(accountIds.map(async (candidateAccountId) => {
					return (await authorizeActorAction({
						cfg: params.cfg,
						accountId: candidateAccountId,
						senderId,
						action: "approve",
						approvalKind: params.approvalKind,
						...pluginRequest ? { request: pluginRequest } : {},
						sessionDelivery: delivery
					})).authorized ? candidateAccountId : void 0;
				}))).filter((value) => value !== void 0);
				assertCurrent();
				const authorized = eligibleAccountIds.includes(accountId) && doesApprovalRequestSelectChannelAccountFromDelivery({
					cfg: params.cfg,
					request,
					channel,
					accountId,
					defaultAccountId: plugin.config.defaultAccountId?.(params.cfg) ?? "",
					eligibleAccountIds
				}, delivery);
				prepared.set(request, {
					authorized,
					isCurrent,
					release
				});
				return authorized && isCurrent();
			} catch (error) {
				release();
				throw error;
			}
		},
		isCurrent(request) {
			const state = prepared.get(request);
			return active && configCurrent() && state?.authorized === true && state.isCurrent();
		},
		[Symbol.dispose]() {
			active = false;
			for (const state of prepared.values()) state.release();
			prepared.clear();
		}
	};
}
//#endregion
//#region src/gateway/server-methods/approval-shared.ts
const APPROVAL_ALREADY_RESOLVED_DETAILS = { reason: "APPROVAL_ALREADY_RESOLVED" };
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
function bindApprovalRequesterMetadata(params) {
	params.record.requestedByConnId = params.client?.connId ?? null;
	params.record.requestedByDeviceId = params.client?.connect?.device?.id ?? null;
	params.record.requestedByClientId = params.client?.connect?.client?.id ?? null;
	params.record.requestedByDeviceTokenAuth = params.client?.isDeviceTokenAuth === true;
}
function bindApprovalReviewerDeviceIds(params) {
	const deviceIds = normalizeUniqueTrimmedStringList(params.deviceIds);
	if (deviceIds.length > 0) params.record.approvalReviewerDeviceIds = deviceIds;
}
function respondApprovalStorageUnavailable(params) {
	params.context.logGateway?.error?.(`approval ${params.operation} storage failure: ${String(params.error)}`);
	params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`));
}
async function registerPendingApprovalRecord(params) {
	try {
		return await params.manager.register(params.record, params.timeoutMs);
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "request",
			error: err
		});
		return;
	}
}
function buildRequestedApprovalEvent(record, approvalKind) {
	return {
		...approvalKind ? { approvalKind } : {},
		id: record.id,
		request: record.request,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs
	};
}
function resolveApprovalDecisionParams(params) {
	const rawParams = params.rawParams;
	if (!assertValidParams(rawParams, params.validate, params.methodName, params.respond)) return null;
	if (!isApprovalDecision(rawParams.decision)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid decision"));
		return null;
	}
	return {
		inputId: rawParams.id,
		decision: rawParams.decision,
		...rawParams.reviewer ? { reviewer: rawParams.reviewer } : {}
	};
}
function resolveApprovalRequestRecipientConnIds(params) {
	return params.context.getApprovalClientConnIds?.({
		approvalKind: params.approvalKind,
		excludeConnId: params.excludeConnId,
		record: params.record,
		filter: (client) => isApprovalRecordVisibleToClient({
			record: params.record,
			client
		})
	}) ?? null;
}
/** Sends a resolved approval only to clients authorized for its live binding. */
function broadcastApprovalResolvedEvent(params) {
	const eventName = params.approvalKind === "system-agent" ? "openclaw.approval.resolved" : `${params.approvalKind}.approval.resolved`;
	const recipientConnIds = resolveApprovalRequestRecipientConnIds(params);
	if (recipientConnIds) {
		params.context.broadcastToConnIds(eventName, params.event, recipientConnIds, { dropIfSlow: true });
		return;
	}
	params.context.broadcast(eventName, params.event, { dropIfSlow: true });
}
async function handleApprovalWaitDecision(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const id = normalizeOptionalString(params.inputId) ?? "";
		if (!id) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "id is required"));
			return;
		}
		const snapshot = await params.manager.getSnapshot(id, params.authority);
		params.authority?.assertCurrent();
		const sessionAccess = _usingCtx$1.u(await prepareApprovalSessionAccess({
			...params,
			client: params.client ?? null,
			sources: snapshot ? [readApprovalRequestSource(snapshot)] : []
		}));
		params.authority?.assertCurrent();
		const visible = (record) => {
			const cfg = params.getCfg?.() ?? params.cfg;
			return !params.client?.invalidated && isApprovalRecordVisibleToClient({
				record,
				client: params.client ?? null,
				...cfg ? { cfg } : {},
				sessionAccess
			});
		};
		if (!snapshot || !visible(snapshot)) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
			return;
		}
		params.authority?.bindSource(readApprovalRequestSource(snapshot));
		const decisionPromise = params.manager.awaitDecision(id);
		if (!decisionPromise) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
			return;
		}
		const recordedDecision = await decisionPromise;
		params.authority?.assertCurrent();
		const terminalSnapshot = await params.manager.getSnapshot(id, params.authority) ?? snapshot;
		params.authority?.assertCurrent();
		if (!visible(terminalSnapshot)) {
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		const decision = params.manager.projectDecisionIfActive(id, recordedDecision);
		const terminalReason = params.resolveTerminalReason?.(terminalSnapshot);
		params.respond(true, {
			id,
			decision,
			createdAtMs: terminalSnapshot.createdAtMs,
			expiresAtMs: terminalSnapshot.expiresAtMs,
			terminalReason: terminalReason ?? terminalSnapshot.terminalReason
		}, void 0);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Broadcasts or routes a pending approval request, then responds after acceptance/decision. */
async function handlePendingApprovalRequest(params) {
	const deliveryReady = createDeferredCore();
	let noRouteWon = false;
	const handoff = params.manager.registerDecisionHandoff(params.record.id, async (decision) => {
		if (!await deliveryReady.promise) return;
		let projectedDecision = params.manager.projectDecisionIfActive(params.record.id, decision);
		if (!noRouteWon && params.afterDecision) try {
			await params.afterDecision(projectedDecision, params.requestEvent);
		} catch (err) {
			params.context.logGateway?.error?.(`${params.afterDecisionErrorLabel ?? "approval follow-up failed"}: ${String(err)}`);
		}
		projectedDecision = params.manager.projectDecisionIfActive(params.record.id, projectedDecision);
		params.respond(true, {
			id: params.record.id,
			decision: projectedDecision,
			createdAtMs: params.record.createdAtMs,
			expiresAtMs: params.record.expiresAtMs
		}, void 0);
	});
	handoff.observation.catch(() => {});
	try {
		const suppressDelivery = params.suppressDelivery === true;
		const approvalClientsOnly = !suppressDelivery && params.deliverToApprovalClientsOnly === true;
		const approvalClientConnIds = suppressDelivery ? null : resolveApprovalRequestRecipientConnIds({
			approvalKind: params.approvalKind ?? "exec",
			context: params.context,
			record: params.record,
			excludeConnId: params.clientConnId
		});
		if (!suppressDelivery) {
			if (approvalClientConnIds) params.context.broadcastToConnIds(params.requestEventName, params.requestEvent, approvalClientConnIds, { dropIfSlow: true });
			else params.context.broadcast(params.requestEventName, params.requestEvent, { dropIfSlow: true });
		}
		const approvalEvents = params.context.approvalEvents;
		let internalApprovalSubscriberCount = 0;
		if (!suppressDelivery && !approvalClientsOnly && approvalEvents) internalApprovalSubscriberCount = approvalEvents.publishRequestedAsync ? await approvalEvents.publishRequestedAsync(params.approvalKind ?? "exec", params.requestEvent) : approvalEvents.publishRequested(params.approvalKind ?? "exec", params.requestEvent);
		if (!params.manager.isPendingDeliveryCurrent(params.record)) {
			deliveryReady.resolve(true);
			await handoff.observation;
			return;
		}
		const hasApprovalClients = suppressDelivery ? false : approvalClientConnIds !== null ? approvalClientConnIds.size > 0 || internalApprovalSubscriberCount > 0 : (params.context.hasExecApprovalClients?.(params.clientConnId) ?? false) || internalApprovalSubscriberCount > 0;
		const delivered = suppressDelivery || approvalClientsOnly ? false : await params.manager.trackActiveWork(params.deliverRequest);
		const pluginRequest = params.approvalKind === "plugin" && isPluginApprovalRequest(params.requestEvent) ? params.requestEvent : void 0;
		const hasTurnSourceRoute = !suppressDelivery && !approvalClientsOnly && !hasApprovalClients && !delivered && (params.approvalKind !== "plugin" || pluginRequest !== void 0) && await hasApprovalTurnSourceRoute({
			turnSourceChannel: params.record.request.turnSourceChannel,
			turnSourceAccountId: params.record.request.turnSourceAccountId,
			approvalKind: params.approvalKind ?? "exec",
			...pluginRequest ? { request: pluginRequest } : {}
		});
		if (!params.manager.isPendingDeliveryCurrent(params.record)) {
			deliveryReady.resolve(true);
			await handoff.observation;
			return;
		}
		const deliveryRoute = delivered ? "forwarder" : hasApprovalClients ? "approval-client" : hasTurnSourceRoute ? "turn-source" : "none";
		if (params.requireDeliveryRoute !== false && !params.keepPendingWithoutRoute && deliveryRoute === "none") try {
			noRouteWon = await params.manager.expire(params.record.id, "no-approval-route");
		} catch (err) {
			deliveryReady.resolve(false);
			handoff.abandon();
			respondApprovalStorageUnavailable({
				...params,
				operation: "request",
				error: err
			});
			return;
		}
		else if (params.twoPhase) params.respond(true, {
			status: "accepted",
			id: params.record.id,
			deliveryRoute,
			createdAtMs: params.record.createdAtMs,
			expiresAtMs: params.record.expiresAtMs
		}, void 0);
	} catch (error) {
		deliveryReady.resolve(false);
		handoff.abandon();
		throw error;
	}
	deliveryReady.resolve(true);
	await handoff.observation;
}
function respondRepeatedApprovalResolution(record, decision, respond) {
	if ((record.decision ?? record.consumedDecision) === decision) {
		respond(true, { ok: true }, void 0);
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval already resolved", { details: APPROVAL_ALREADY_RESOLVED_DETAILS }));
}
/** Resolves a pending approval and broadcasts the final decision exactly once. */
async function handleApprovalResolve(params) {
	try {
		var _usingCtx3 = _usingCtx();
		if (!params.authority.isCurrent()) {
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		const respondFailure = (error) => {
			if (!params.authority.isCurrent()) respondUnknownOrExpiredApproval(params.respond);
			else respondApprovalStorageUnavailable({
				...params,
				operation: "resolve",
				error
			});
		};
		const custody = _usingCtx3.u(params.reviewer ? prepareApprovalChannelCustody({
			cfg: params.context.getRuntimeConfig(),
			getCfg: params.context.getRuntimeConfig,
			assertCurrent: () => params.authority.assertCurrent(),
			approvalKind: params.approvalKind,
			reviewer: params.reviewer
		}) : null);
		if (params.reviewer && !custody) {
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		const recordFilter = custody ? (record) => custody.authorizes(record) : void 0;
		const lookup = {
			manager: params.manager,
			authority: params.authority,
			getCfg: params.context.getRuntimeConfig,
			inputId: params.inputId,
			client: params.client,
			exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
			recordFilter
		};
		let resolved;
		try {
			resolved = await resolvePendingApprovalRecord(lookup);
		} catch (err) {
			respondFailure(err);
			return;
		}
		if (!params.authority.isCurrent()) {
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		if (!resolved.ok) {
			let resolvedRepeat;
			try {
				resolvedRepeat = await resolveResolvedApprovalRecord(lookup);
			} catch (err) {
				respondFailure(err);
				return;
			}
			if (!params.authority.isCurrent()) {
				respondUnknownOrExpiredApproval(params.respond);
				return;
			}
			if (resolvedRepeat.ok) {
				respondRepeatedApprovalResolution(resolvedRepeat.snapshot, params.decision, params.respond);
				return;
			}
			respondPendingApprovalLookupError({
				respond: params.respond,
				response: resolved.response
			});
			return;
		}
		let sessionAccess;
		try {
			sessionAccess = await prepareApprovalSessionAccess({
				client: params.client,
				getCfg: params.context.getRuntimeConfig,
				sources: [readApprovalRequestSource(resolved.snapshot)]
			});
		} catch (error) {
			respondFailure(error);
			return;
		}
		const retainedSessionAccess = _usingCtx3.u(sessionAccess);
		if (!params.authority.isCurrent()) {
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		const validationError = params.validateDecision?.(resolved.snapshot);
		if (validationError) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, validationError.message, validationError.details ? { details: validationError.details } : void 0));
			return;
		}
		const resolvedBy = params.client?.connect?.client?.displayName ?? params.client?.connect?.client?.id ?? null;
		const resolver = custody ? {
			kind: "channel",
			id: custody.resolverId
		} : void 0;
		const sourceSessionKey = resolved.snapshot.request.sessionKey;
		const sourceAgentId = resolved.snapshot.request.agentId;
		const guard = {
			family: params.authority.guard.family,
			assertCurrent: () => {
				params.authority.assertCommitCurrent();
				if (params.manager.getLocalSnapshot(resolved.approvalId) !== resolved.snapshot || resolved.snapshot.request.sessionKey !== sourceSessionKey || resolved.snapshot.request.agentId !== sourceAgentId || params.client?.invalidated || !isApprovalRecordVisibleToClient({
					record: resolved.snapshot,
					client: params.client,
					...params.authority.guard.family === "native-compatibility" ? {
						cfg: params.context.getRuntimeConfig(),
						sessionAccess: retainedSessionAccess
					} : {}
				}) || params.reviewer && !custody?.isCurrent(resolved.snapshot)) throw new Error("approval resolver authority is no longer active");
			}
		};
		let ok;
		try {
			ok = params.resolveRecord ? await params.resolveRecord({
				approvalId: resolved.approvalId,
				decision: params.decision,
				resolvedBy,
				snapshot: resolved.snapshot,
				resolver,
				guard
			}) : resolver ? (await params.manager.resolveDetailed(resolved.approvalId, params.decision, resolver, resolvedBy, "operator", { guard })).outcome === "resolved" : await params.manager.resolve(resolved.approvalId, params.decision, resolvedBy, { guard });
		} catch (err) {
			respondFailure(err);
			return;
		}
		if (!ok) {
			const raced = await params.manager.getSnapshot(resolved.approvalId, params.authority);
			params.authority.assertCurrent();
			if (raced && raced.resolvedAtMs !== void 0) {
				respondRepeatedApprovalResolution(raced, params.decision, params.respond);
				return;
			}
			respondUnknownOrExpiredApproval(params.respond);
			return;
		}
		const resolvedEvent = {
			id: resolved.approvalId,
			decision: params.decision,
			resolvedBy,
			ts: Date.now(),
			request: resolved.snapshot.request
		};
		broadcastApprovalResolvedEvent({
			approvalKind: params.approvalKind,
			context: params.context,
			record: resolved.snapshot,
			event: resolvedEvent
		});
		if (params.approvalKind !== "system-agent") params.context.approvalEvents?.publishResolved(params.approvalKind, resolvedEvent);
		if (params.authority.isCurrent()) params.respond(true, { ok: true }, void 0);
		else respondUnknownOrExpiredApproval(params.respond);
		const followUps = [
			params.forwardResolved ? {
				run: params.forwardResolved,
				errorLabel: params.forwardResolvedErrorLabel ?? "approval resolve follow-up failed"
			} : null,
			...params.extraResolvedHandlers ?? [],
			params.context.approvalWebPushDelivery ? {
				run: params.context.approvalWebPushDelivery.handleResolved,
				errorLabel: `${params.approvalKind} approvals: Web Push resolve failed`
			} : null
		].filter((entry) => entry !== null);
		for (const followUp of followUps) try {
			await followUp.run(resolvedEvent);
		} catch (err) {
			params.context.logGateway?.error?.(`${followUp.errorLabel}: ${String(err)}`);
		}
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
}
//#endregion
export { handleApprovalResolve as a, registerPendingApprovalRecord as c, prepareApprovalChannelCustody as d, buildRequestedApprovalEvent as i, resolveApprovalDecisionParams as l, bindApprovalReviewerDeviceIds as n, handleApprovalWaitDecision as o, broadcastApprovalResolvedEvent as r, handlePendingApprovalRequest as s, bindApprovalRequesterMetadata as t, respondApprovalStorageUnavailable as u };
