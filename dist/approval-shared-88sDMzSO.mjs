import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-BEpDh--e.mjs";
import { i as resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface-CVHo0f_-.mjs";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-DSNpCt32.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { a as resolvePendingApprovalRecord, c as respondUnknownOrExpiredApproval, i as normalizeApprovalIdentities, n as isApprovalRecordVisibleToClient, o as resolveResolvedApprovalRecord, s as respondPendingApprovalLookupError } from "./approval-record-lookup-jJszPHsp.mjs";
//#region src/infra/approval-turn-source.ts
/** Returns whether approval replies can route back to the turn's initiating surface. */
function hasApprovalTurnSourceRoute(params) {
	const channel = normalizeMessageChannel(params.turnSourceChannel);
	if (!channel || channel === "webchat" || channel === "tui") return false;
	return resolveApprovalInitiatingSurfaceState({
		channel,
		accountId: params.turnSourceAccountId,
		cfg: getRuntimeConfig(),
		approvalKind: params.approvalKind ?? "exec"
	}).kind === "enabled";
}
//#endregion
//#region src/gateway/approval-channel-custody.ts
function prepareApprovalChannelCustody(params) {
	const channel = params.reviewer.channel.trim().toLowerCase();
	const accountId = params.reviewer.accountId.trim();
	const senderId = params.reviewer.senderId.trim();
	if (!channel || !accountId || !senderId) return null;
	const plugin = getLoadedChannelPlugin(channel);
	const authorizeActorAction = resolveChannelApprovalCapability(plugin)?.authorizeActorAction;
	if (!plugin || !authorizeActorAction) return null;
	const isActorAuthorized = (candidateAccountId) => authorizeActorAction({
		cfg: params.cfg,
		accountId: candidateAccountId,
		senderId,
		action: "approve",
		approvalKind: params.approvalKind
	}).authorized;
	if (!isActorAuthorized(accountId)) return null;
	const eligibleAccountIds = plugin.config.listAccountIds(params.cfg).filter(isActorAuthorized);
	if (!eligibleAccountIds.includes(accountId)) return null;
	return {
		resolverId: `${channel}:${accountId}`,
		authorizes: (request) => doesApprovalRequestSelectChannelAccount({
			cfg: params.cfg,
			request,
			channel,
			accountId,
			defaultAccountId: plugin.config.defaultAccountId?.(params.cfg) ?? "",
			eligibleAccountIds
		})
	};
}
//#endregion
//#region src/gateway/server-methods/approval-wait-response.ts
function buildWaitResponse(id, decision, snapshot, terminalReason) {
	return {
		id,
		decision,
		createdAtMs: snapshot.createdAtMs,
		expiresAtMs: snapshot.expiresAtMs,
		terminalReason: terminalReason ?? snapshot.terminalReason
	};
}
//#endregion
//#region src/gateway/server-methods/approval-shared.ts
const APPROVAL_ALREADY_RESOLVED_DETAILS = { reason: "APPROVAL_ALREADY_RESOLVED" };
function resolveRecordedApprovalDecision(record) {
	return record.decision ?? record.consumedDecision;
}
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
/** Binds the current gateway client identity onto a newly-created approval record. */
function bindApprovalRequesterMetadata(params) {
	params.record.requestedByConnId = params.client?.connId ?? null;
	params.record.requestedByDeviceId = params.client?.connect?.device?.id ?? null;
	params.record.requestedByClientId = params.client?.connect?.client?.id ?? null;
	params.record.requestedByDeviceTokenAuth = params.client?.isDeviceTokenAuth === true;
}
function bindApprovalReviewerDeviceIds(params) {
	const deviceIds = normalizeApprovalIdentities(params.deviceIds);
	if (deviceIds.length > 0) params.record.approvalReviewerDeviceIds = deviceIds;
}
function respondApprovalStorageUnavailable(params) {
	params.context.logGateway?.error?.(`approval ${params.operation} storage failure: ${String(params.error)}`);
	params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`));
}
/** Registers an approval record and converts manager registration errors to gateway errors. */
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
/** Builds the gateway event payload broadcast when an approval starts waiting. */
function buildRequestedApprovalEvent(record, approvalKind) {
	return {
		...approvalKind ? { approvalKind } : {},
		id: record.id,
		request: record.request,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs
	};
}
/** Validates approval resolve params and narrows the decision to the supported enum. */
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
/** Resolves the approval clients that should receive request or resolution events. */
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
	const recipientConnIds = resolveApprovalRequestRecipientConnIds({
		approvalKind: params.approvalKind,
		context: params.context,
		record: params.record
	});
	if (recipientConnIds) {
		params.context.broadcastToConnIds(eventName, params.event, recipientConnIds, { dropIfSlow: true });
		return;
	}
	params.context.broadcast(eventName, params.event, { dropIfSlow: true });
}
async function handleApprovalWaitDecision(params) {
	const id = normalizeOptionalString(params.inputId) ?? "";
	if (!id) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "id is required"));
		return;
	}
	const snapshot = await params.manager.getSnapshot(id);
	const visible = (record) => {
		const cfg = params.getCfg?.() ?? params.cfg;
		return !params.client?.invalidated && isApprovalRecordVisibleToClient({
			record,
			client: params.client ?? null,
			...cfg ? { cfg } : {}
		});
	};
	if (!snapshot || !visible(snapshot)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
		return;
	}
	const decisionPromise = params.manager.awaitDecision(id);
	if (!decisionPromise) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
		return;
	}
	const recordedDecision = await decisionPromise;
	const terminalSnapshot = await params.manager.getSnapshot(id) ?? snapshot;
	if (!visible(terminalSnapshot)) {
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	const decision = params.manager.projectDecisionIfActive(id, recordedDecision);
	const terminalReason = params.resolveTerminalReason?.(terminalSnapshot);
	params.respond(true, buildWaitResponse(id, decision, terminalSnapshot, terminalReason), void 0);
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
		const internalApprovalSubscriberCount = suppressDelivery || approvalClientsOnly ? 0 : params.context.approvalEvents?.publishRequested(params.approvalKind ?? "exec", params.requestEvent) ?? 0;
		const hasApprovalClients = suppressDelivery ? false : approvalClientConnIds !== null ? approvalClientConnIds.size > 0 || internalApprovalSubscriberCount > 0 : (params.context.hasExecApprovalClients?.(params.clientConnId) ?? false) || internalApprovalSubscriberCount > 0;
		const delivered = suppressDelivery || approvalClientsOnly ? false : await params.manager.trackActiveWork(params.deliverRequest);
		const hasTurnSourceRoute = !suppressDelivery && !approvalClientsOnly && !hasApprovalClients && !delivered && hasApprovalTurnSourceRoute({
			turnSourceChannel: params.record.request.turnSourceChannel,
			turnSourceAccountId: params.record.request.turnSourceAccountId,
			approvalKind: params.approvalKind ?? "exec"
		});
		const deliveryRoute = delivered ? "forwarder" : hasApprovalClients ? "approval-client" : hasTurnSourceRoute ? "turn-source" : "none";
		if (params.requireDeliveryRoute !== false && !params.keepPendingWithoutRoute && !hasApprovalClients && !hasTurnSourceRoute && !delivered) try {
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
	if (resolveRecordedApprovalDecision(record) === decision) {
		respond(true, { ok: true }, void 0);
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval already resolved", { details: APPROVAL_ALREADY_RESOLVED_DETAILS }));
}
/** Resolves a pending approval and broadcasts the final decision exactly once. */
async function handleApprovalResolve(params) {
	const custody = params.reviewer ? prepareApprovalChannelCustody({
		cfg: params.context.getRuntimeConfig(),
		approvalKind: params.approvalKind,
		reviewer: params.reviewer
	}) : null;
	if (params.reviewer && !custody) {
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	const recordFilter = custody ? (record) => custody.authorizes(record) : void 0;
	let resolved;
	try {
		resolved = await resolvePendingApprovalRecord({
			manager: params.manager,
			inputId: params.inputId,
			client: params.client,
			exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
			recordFilter
		});
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "resolve",
			error: err
		});
		return;
	}
	if (!resolved.ok) {
		let resolvedRepeat;
		try {
			resolvedRepeat = await resolveResolvedApprovalRecord({
				manager: params.manager,
				inputId: params.inputId,
				client: params.client,
				exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
				recordFilter
			});
		} catch (err) {
			respondApprovalStorageUnavailable({
				...params,
				operation: "resolve",
				error: err
			});
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
	const assertCurrent = () => {
		const currentCustody = params.reviewer ? prepareApprovalChannelCustody({
			cfg: params.context.getRuntimeConfig(),
			approvalKind: params.approvalKind,
			reviewer: params.reviewer
		}) : null;
		if (params.client?.invalidated || !isApprovalRecordVisibleToClient({
			record: resolved.snapshot,
			client: params.client,
			cfg: params.context.getRuntimeConfig()
		}) || params.reviewer && !currentCustody?.authorizes(resolved.snapshot)) throw new Error("approval resolver authority is no longer active");
	};
	let ok;
	try {
		ok = params.resolveRecord ? await params.resolveRecord({
			approvalId: resolved.approvalId,
			decision: params.decision,
			resolvedBy,
			snapshot: resolved.snapshot,
			resolver,
			assertCurrent
		}) : resolver ? (await params.manager.resolveDetailed(resolved.approvalId, params.decision, resolver, resolvedBy, "operator", { assertCurrent })).outcome === "resolved" : await params.manager.resolve(resolved.approvalId, params.decision, resolvedBy, { assertCurrent });
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "resolve",
			error: err
		});
		return;
	}
	if (!ok) {
		const raced = await params.manager.getSnapshot(resolved.approvalId);
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
	].filter((entry) => Boolean(entry));
	for (const followUp of followUps) try {
		await followUp.run(resolvedEvent);
	} catch (err) {
		params.context.logGateway?.error?.(`${followUp.errorLabel}: ${String(err)}`);
	}
	params.respond(true, { ok: true }, void 0);
}
//#endregion
export { handleApprovalResolve as a, registerPendingApprovalRecord as c, prepareApprovalChannelCustody as d, buildRequestedApprovalEvent as i, resolveApprovalDecisionParams as l, bindApprovalReviewerDeviceIds as n, handleApprovalWaitDecision as o, broadcastApprovalResolvedEvent as r, handlePendingApprovalRequest as s, bindApprovalRequesterMetadata as t, respondApprovalStorageUnavailable as u };
