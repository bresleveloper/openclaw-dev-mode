import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { h as validateApprovalResolveParams, m as validateApprovalHistoryParams, p as validateApprovalGetParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { i as getOperatorApprovalDetailed, s as listTerminalOperatorApprovals, v as OperatorApprovalHistoryCursorError } from "./operator-approval-store-ZXCDEDUV.mjs";
import { n as canResolveOperatorApproval, r as canReviewOperatorApproval, t as canAccessOperatorApproval } from "./operator-approval-authorization-CRqUaNvq.mjs";
import { t as projectOperatorApprovalSnapshot } from "./operator-approval-snapshot-DiSAwAzh.mjs";
import { t as canAccessApprovalSession } from "./approval-record-lookup-jJszPHsp.mjs";
import { d as prepareApprovalChannelCustody, u as respondApprovalStorageUnavailable } from "./approval-shared-88sDMzSO.mjs";
import { t as publishAppliedApprovalResolution } from "./approval-publication-CS1UeZ9n.mjs";
//#region src/gateway/server-methods/approval.ts
function buildApprovalSnapshot(record, controlUiBasePath) {
	const snapshot = projectOperatorApprovalSnapshot(record, controlUiBasePath);
	if (!snapshot || snapshot.status === "pending") return snapshot;
	return {
		...snapshot,
		source: {
			...record.source.agentId ? { agentId: record.source.agentId } : {},
			...record.source.sessionKey ? { sessionKey: record.source.sessionKey } : {}
		},
		...record.resolver ? { resolver: {
			kind: record.resolver.kind,
			...record.resolver.id ? { id: record.resolver.id } : {}
		} } : {}
	};
}
function resolveApprovalResolver(client) {
	const deviceId = normalizeOptionalString(client?.connect?.device?.id);
	if (deviceId) return {
		kind: "device",
		id: deviceId
	};
	return {
		kind: "runtime",
		id: normalizeOptionalString(client?.connect?.client?.id) ?? null
	};
}
function resolveLegacyApprovalLabel(client) {
	return normalizeOptionalString(client?.connect?.client?.displayName) ?? normalizeOptionalString(client?.connect?.client?.id) ?? null;
}
function respondApprovalNotFound(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval not found", { details: { reason: ErrorCodes.APPROVAL_NOT_FOUND } }));
}
function readExactApprovalId(params) {
	if (!isRecord(params) || typeof params.id !== "string") return null;
	const id = params.id;
	return isWellFormedApprovalId(id) ? id : null;
}
async function loadVisibleApproval(params) {
	if (!(params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client)) || params.client?.invalidated) return null;
	const liveRecord = params.execApprovalManager.getLiveSnapshot(params.id) ?? params.pluginApprovalManager.getLiveSnapshot(params.id) ?? params.systemAgentApprovalManager?.getLiveSnapshot(params.id);
	if (liveRecord && !canAccessApprovalSession({
		cfg: params.getCfg(),
		client: params.client,
		sessionKey: liveRecord.request.sessionKey,
		agentId: liveRecord.request.agentId
	})) return null;
	if (liveRecord && !canAccessOperatorApproval({
		client: params.client,
		allowApprovalRuntime: params.allowApprovalRuntime,
		binding: { reviewerDeviceIds: liveRecord.approvalReviewerDeviceIds }
	})) return null;
	let lookup;
	try {
		lookup = await getOperatorApprovalDetailed({
			id: params.id,
			allowTransportRef: params.allowTransportRef,
			databaseOptions: params.databaseOptions
		});
	} catch (error) {
		const corrupt = {
			outcome: "corrupt",
			id: params.id
		};
		await params.execApprovalManager.reconcileDurableLookup(corrupt);
		await params.pluginApprovalManager.reconcileDurableLookup(corrupt);
		await params.systemAgentApprovalManager?.reconcileDurableLookup(corrupt);
		throw error;
	}
	if (params.client?.invalidated || !(params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client))) return null;
	if (lookup.outcome === "found") {
		if (!canAccessApprovalSession({
			cfg: params.getCfg(),
			client: params.client,
			sessionKey: lookup.record.source.sessionKey,
			agentId: lookup.record.source.agentId
		})) return null;
		if (!canAccessOperatorApproval({
			client: params.client,
			allowApprovalRuntime: params.allowApprovalRuntime,
			binding: { reviewerDeviceIds: lookup.record.reviewerDeviceIds }
		})) return null;
		const reconciled = await (lookup.record.kind === "exec" ? params.execApprovalManager : lookup.record.kind === "plugin" ? params.pluginApprovalManager : params.systemAgentApprovalManager)?.reconcileDurableLookup(lookup);
		return reconciled && !params.client?.invalidated && canAccessApprovalSession({
			cfg: params.getCfg(),
			client: params.client,
			sessionKey: reconciled.source.sessionKey,
			agentId: reconciled.source.agentId
		}) && canAccessOperatorApproval({
			client: params.client,
			allowApprovalRuntime: params.allowApprovalRuntime,
			binding: { reviewerDeviceIds: reconciled.reviewerDeviceIds }
		}) ? reconciled : null;
	}
	const missing = {
		outcome: lookup.outcome === "corrupt" ? "corrupt" : "missing",
		id: lookup.outcome === "corrupt" ? lookup.id ?? params.id : params.id
	};
	await params.execApprovalManager.reconcileDurableLookup(missing);
	await params.pluginApprovalManager.reconcileDurableLookup(missing);
	await params.systemAgentApprovalManager?.reconcileDurableLookup(missing);
	return null;
}
function resolveLiveRecord(params) {
	return params.liveRecord ?? params.manager.getLiveSnapshot(params.id) ?? void 0;
}
async function applyApprovalDecision(params) {
	const result = params.forceMalformedDeny ? await params.manager.forceDenyDetailed(params.id, "malformed-verdict", params.resolver, "denied", void 0, false, params.localResolvedBy, params.assertCurrent) : await params.manager.resolveDetailed(params.id, params.decision, params.resolver, params.localResolvedBy, "operator", {
		assertCurrent: params.assertCurrent,
		...params.grantExpiresAtMs !== void 0 ? { grantExpiresAtMs: params.grantExpiresAtMs } : {}
	});
	if (result.outcome === "decision-not-allowed") return applyApprovalDecision({
		...params,
		forceMalformedDeny: true
	});
	if (result.outcome === "not-found" || result.outcome === "corrupt") return { ok: false };
	const applied = result.outcome === "resolved" || result.outcome === "denied";
	return {
		ok: true,
		applied,
		record: result.record,
		liveRecord: applied ? resolveLiveRecord({
			manager: params.manager,
			id: params.id,
			liveRecord: result.liveRecord
		}) : result.liveRecord
	};
}
/** Creates kind-agnostic approval lookup and resolution handlers. */
function createApprovalHandlers(params) {
	return {
		"approval.history": async ({ params: rawParams, respond, client, context }) => {
			if (!validateApprovalHistoryParams(rawParams)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.history params"));
				return;
			}
			const historyParams = rawParams;
			let history;
			try {
				history = await listTerminalOperatorApprovals({
					cursor: historyParams.cursor,
					limit: historyParams.limit,
					kind: historyParams.kind,
					databaseOptions: params.databaseOptions
				});
			} catch (error) {
				if (error instanceof OperatorApprovalHistoryCursorError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.history cursor"));
					return;
				}
				respondApprovalStorageUnavailable({
					context,
					respond,
					operation: "history",
					error
				});
				return;
			}
			const cfg = context.getRuntimeConfig();
			const controlUiBasePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
			respond(true, {
				items: history.records.flatMap((record) => {
					if (!canAccessApprovalSession({
						cfg,
						client,
						sessionKey: record.source.sessionKey,
						agentId: record.source.agentId
					})) return [];
					const snapshot = buildApprovalSnapshot(record, controlUiBasePath);
					return snapshot && snapshot.status !== "pending" ? [snapshot] : [];
				}),
				...history.nextCursor ? { nextCursor: history.nextCursor } : {}
			}, void 0);
		},
		"approval.get": async ({ params: rawParams, respond, client, context }) => {
			if (!validateApprovalGetParams(rawParams)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.get params"));
				return;
			}
			const id = readExactApprovalId(rawParams);
			let record;
			try {
				record = id ? await loadVisibleApproval({
					id,
					client,
					getCfg: context.getRuntimeConfig,
					execApprovalManager: params.execApprovalManager,
					pluginApprovalManager: params.pluginApprovalManager,
					systemAgentApprovalManager: params.systemAgentApprovalManager,
					databaseOptions: params.databaseOptions
				}) : null;
			} catch (error) {
				respondApprovalStorageUnavailable({
					context,
					respond,
					operation: "lookup",
					error
				});
				return;
			}
			const controlUiBasePath = normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath);
			const approval = record ? buildApprovalSnapshot(record, controlUiBasePath) : null;
			if (!approval) {
				respondApprovalNotFound(respond);
				return;
			}
			respond(true, { approval }, void 0);
		},
		"approval.resolve": async ({ params: rawParams, respond, client, context }) => {
			const validParams = validateApprovalResolveParams(rawParams);
			const resolveParams = validParams ? rawParams : null;
			if (isRecord(rawParams) && "reviewer" in rawParams && !resolveParams?.reviewer) {
				respondApprovalNotFound(respond);
				return;
			}
			const id = readExactApprovalId(rawParams);
			let record;
			try {
				record = id ? await loadVisibleApproval({
					id,
					client,
					getCfg: context.getRuntimeConfig,
					allowApprovalRuntime: true,
					allowTransportRef: true,
					execApprovalManager: params.execApprovalManager,
					pluginApprovalManager: params.pluginApprovalManager,
					systemAgentApprovalManager: params.systemAgentApprovalManager,
					databaseOptions: params.databaseOptions
				}) : null;
			} catch (error) {
				respondApprovalStorageUnavailable({
					context,
					respond,
					operation: "lookup",
					error
				});
				return;
			}
			if (!id || !record) {
				respondApprovalNotFound(respond);
				return;
			}
			const custody = resolveParams?.reviewer ? prepareApprovalChannelCustody({
				cfg: context.getRuntimeConfig(),
				approvalKind: record.kind,
				reviewer: resolveParams.reviewer
			}) : null;
			const liveRecord = record.kind === "exec" ? params.execApprovalManager.getLiveSnapshot(record.id) : record.kind === "plugin" ? params.pluginApprovalManager.getLiveSnapshot(record.id) : params.systemAgentApprovalManager?.getLiveSnapshot(record.id);
			if (resolveParams?.reviewer && (!custody || !liveRecord || !custody.authorizes(liveRecord))) {
				respondApprovalNotFound(respond);
				return;
			}
			if (record.status !== "pending") {
				const controlUiBasePath = normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath);
				const approval = buildApprovalSnapshot(record, controlUiBasePath);
				if (!approval || approval.status === "pending") {
					respondApprovalNotFound(respond);
					return;
				}
				respond(true, {
					applied: false,
					approval
				}, void 0);
				return;
			}
			const resolver = custody ? {
				kind: "channel",
				id: custody.resolverId
			} : resolveApprovalResolver(client);
			const localResolvedBy = resolveLegacyApprovalLabel(client);
			const requestedDecision = resolveParams?.decision ?? null;
			const decisionAllowed = requestedDecision === "deny" || requestedDecision !== null && record.presentation.allowedDecisions.includes(requestedDecision);
			const kindMatches = resolveParams?.kind === record.presentation.kind;
			const forceMalformedDeny = !validParams || !kindMatches || !decisionAllowed;
			const assertCurrent = () => {
				const currentCfg = context.getRuntimeConfig();
				const currentCustody = resolveParams?.reviewer ? prepareApprovalChannelCustody({
					cfg: currentCfg,
					approvalKind: record.kind,
					reviewer: resolveParams.reviewer
				}) : null;
				if (client?.invalidated || !canAccessOperatorApproval({
					client,
					allowApprovalRuntime: true,
					binding: { reviewerDeviceIds: record.reviewerDeviceIds }
				}) || !canAccessApprovalSession({
					cfg: currentCfg,
					client,
					sessionKey: record.source.sessionKey,
					agentId: record.source.agentId
				}) || resolveParams?.reviewer && (!liveRecord || !currentCustody?.authorizes(liveRecord))) throw new Error("approval resolver authority is no longer active");
			};
			let resolution;
			try {
				resolution = record.kind === "exec" ? await applyApprovalDecision({
					manager: params.execApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy,
					assertCurrent,
					...requestedDecision === "allow-always" && typeof resolveParams?.grantExpiresInDays === "number" ? { grantExpiresAtMs: Date.now() + Math.floor(resolveParams.grantExpiresInDays) * 864e5 } : {}
				}) : record.kind === "plugin" ? await applyApprovalDecision({
					manager: params.pluginApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy,
					assertCurrent
				}) : await applyApprovalDecision({
					manager: params.systemAgentApprovalManager,
					id: record.id,
					decision: requestedDecision,
					forceMalformedDeny,
					resolver,
					localResolvedBy,
					assertCurrent
				});
			} catch (error) {
				respondApprovalStorageUnavailable({
					context,
					respond,
					operation: "resolve",
					error
				});
				return;
			}
			if (!resolution.ok) {
				respondApprovalNotFound(respond);
				return;
			}
			const terminalRecord = resolution.record;
			if (terminalRecord.status === "pending") {
				respondApprovalNotFound(respond);
				return;
			}
			const approval = buildApprovalSnapshot(terminalRecord, normalizeControlUiBasePath(context.getRuntimeConfig()?.gateway?.controlUi?.basePath));
			if (!approval) {
				respondApprovalNotFound(respond);
				return;
			}
			respond(true, {
				applied: resolution.applied,
				approval
			}, void 0);
			if (resolution.applied && resolution.liveRecord) publishAppliedApprovalResolution({
				record: terminalRecord,
				liveRecord: resolution.liveRecord,
				context,
				forwarder: params.forwarder,
				iosPushDelivery: params.iosPushDelivery,
				pluginIosPushDelivery: params.pluginIosPushDelivery
			}).catch((error) => {
				context.logGateway?.error?.(`${terminalRecord.kind} approvals: unified resolve publication failed: ${String(error)}`);
			});
		}
	};
}
//#endregion
export { createApprovalHandlers };
