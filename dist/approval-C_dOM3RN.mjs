import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { Ng as errorShape, h as validateApprovalResolveParams, m as validateApprovalHistoryParams, p as validateApprovalGetParams } from "./src-pLJQA6J5.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { i as OperatorApprovalHistoryCursorError } from "./operator-approval-store.rows-CDZY6GCx.mjs";
import { a as getOperatorApprovalDetailed, c as isOperatorApprovalStoreRefusal, d as listTerminalOperatorApprovals, s as isOperatorApprovalStoreOutcomeUnknown } from "./operator-approval-store-CHMiK9vK.mjs";
import { d as prepareApprovalChannelCustody, u as respondApprovalStorageUnavailable } from "./approval-shared-QJKmB54s.mjs";
import { i as prepareApprovalSessionAccess } from "./approval-record-lookup-KFM8XG5s.mjs";
import { n as canResolveOperatorApproval, r as canReviewOperatorApproval, t as canAccessOperatorApproval } from "./operator-approval-authorization-C9wV2RU-.mjs";
import { t as projectOperatorApprovalSnapshot } from "./operator-approval-snapshot-DiSAwAzh.mjs";
import { t as publishAppliedApprovalResolution } from "./approval-publication-BwNXuWUp.mjs";
import { t as createApprovalRequestAuthority } from "./approval-request-authority-BVlXqFmO.mjs";
//#region src/gateway/server-methods/approval-visible-record.ts
async function loadVisibleApproval(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const authorized = params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client);
		if (!params.authority.isCurrent() || !authorized || params.client?.invalidated) return null;
		const liveRecord = params.execApprovalManager.getLiveSnapshot(params.id) ?? params.pluginApprovalManager.getLiveSnapshot(params.id) ?? params.systemAgentApprovalManager?.getLiveSnapshot(params.id);
		let bindingId = params.id;
		let admittedRecord = liveRecord?.resolvedAtMs === void 0 ? liveRecord : void 0;
		let admittedManager = admittedRecord ? [
			params.execApprovalManager,
			params.pluginApprovalManager,
			params.systemAgentApprovalManager
		].find((manager) => manager?.getLocalSnapshot(params.id) === admittedRecord) : void 0;
		let sourceSessionKey = admittedRecord?.request.sessionKey;
		let sourceAgentId = admittedRecord?.request.agentId;
		if (admittedRecord) params.authority.bindSource(admittedRecord.request);
		let sessionAccess = await prepareApprovalSessionAccess({
			client: params.client,
			getCfg: params.getCfg,
			sources: liveRecord ? [liveRecord.request] : []
		});
		const sessionAccessLifetime = _usingCtx$2.u({
			retained: false,
			[Symbol.dispose]() {
				if (!this.retained) sessionAccess[Symbol.dispose]();
			}
		});
		params.authority.assertCurrent();
		const canAccess = (source, reviewerDeviceIds) => sessionAccess.canAccess(source()) && canAccessOperatorApproval({
			client: params.client,
			allowApprovalRuntime: params.allowApprovalRuntime,
			binding: { reviewerDeviceIds: reviewerDeviceIds() }
		});
		if (liveRecord && !canAccess(() => liveRecord.request, () => liveRecord.approvalReviewerDeviceIds)) return null;
		const assertBindingCurrent = () => {
			if (admittedRecord && (admittedManager?.getLocalSnapshot(bindingId) !== admittedRecord || admittedRecord.request.sessionKey !== sourceSessionKey || admittedRecord.request.agentId !== sourceAgentId || !canAccessOperatorApproval({
				client: params.client,
				allowApprovalRuntime: params.allowApprovalRuntime,
				binding: { reviewerDeviceIds: admittedRecord.approvalReviewerDeviceIds }
			}))) throw new Error("Approval lookup authority is no longer active");
		};
		const lookupAuthority = {
			assertCurrent: () => {
				params.authority.assertCurrent();
				assertBindingCurrent();
			},
			guard: {
				family: params.authority.guard.family,
				assertCurrent: () => {
					params.authority.assertCommitCurrent();
					assertBindingCurrent();
				}
			}
		};
		const isLookupCurrent = () => {
			try {
				lookupAuthority.assertCurrent();
				return true;
			} catch {
				return false;
			}
		};
		const reconcile = async (manager, value) => {
			try {
				return await manager?.reconcileDurableLookup(value, null, lookupAuthority);
			} catch (error) {
				if (!isLookupCurrent()) return null;
				throw error;
			}
		};
		let lookup;
		try {
			lookup = await getOperatorApprovalDetailed({
				id: params.id,
				allowTransportRef: params.allowTransportRef,
				databaseOptions: params.databaseOptions,
				guard: lookupAuthority.guard
			});
		} catch (error) {
			if (!isLookupCurrent()) return null;
			if (isOperatorApprovalStoreRefusal(error) || isOperatorApprovalStoreOutcomeUnknown(error)) throw error;
			const corrupt = {
				outcome: "corrupt",
				id: params.id
			};
			await reconcile(params.execApprovalManager, corrupt);
			await reconcile(params.pluginApprovalManager, corrupt);
			await reconcile(params.systemAgentApprovalManager, corrupt);
			throw error;
		}
		if (!isLookupCurrent() || params.client?.invalidated || !(params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client))) return null;
		if (lookup.outcome === "found") {
			const found = lookup;
			if (!liveRecord || (normalizeOptionalString(liveRecord.request.sessionKey) ?? null) !== found.record.source.sessionKey || (normalizeOptionalString(liveRecord.request.agentId) ?? null) !== found.record.source.agentId) {
				sessionAccess[Symbol.dispose]();
				sessionAccess = await prepareApprovalSessionAccess({
					client: params.client,
					getCfg: params.getCfg,
					sources: [found.record.source]
				});
			}
			if (!isLookupCurrent()) return null;
			if (!canAccess(() => found.record.source, () => found.record.reviewerDeviceIds)) return null;
			params.authority.bindSource(lookup.record.source);
			const manager = lookup.record.kind === "exec" ? params.execApprovalManager : lookup.record.kind === "plugin" ? params.pluginApprovalManager : params.systemAgentApprovalManager;
			if (lookup.record.status === "pending") {
				const current = manager?.getLocalSnapshot(lookup.record.id);
				if (current) {
					if ((normalizeOptionalString(current.request.sessionKey) ?? null) !== lookup.record.source.sessionKey || (normalizeOptionalString(current.request.agentId) ?? null) !== lookup.record.source.agentId || !canAccessOperatorApproval({
						client: params.client,
						allowApprovalRuntime: params.allowApprovalRuntime,
						binding: { reviewerDeviceIds: current.approvalReviewerDeviceIds }
					})) return null;
					if (!admittedRecord) {
						bindingId = lookup.record.id;
						admittedRecord = current;
						admittedManager = manager;
						sourceSessionKey = current.request.sessionKey;
						sourceAgentId = current.request.agentId;
					}
				}
			}
			const reconciled = await reconcile(manager, lookup);
			if (!reconciled) return null;
			sessionAccessLifetime.retained = true;
			return {
				guard: lookupAuthority.guard,
				[Symbol.dispose]: () => sessionAccess[Symbol.dispose](),
				readCurrent: () => params.authority.isCurrent() && (reconciled.status !== "pending" || isLookupCurrent()) && !params.client?.invalidated && canAccess(() => reconciled.source, () => reconciled.reviewerDeviceIds) ? reconciled : null
			};
		}
		const missing = {
			outcome: lookup.outcome === "corrupt" ? "corrupt" : "missing",
			id: lookup.outcome === "corrupt" ? lookup.id ?? params.id : params.id
		};
		await reconcile(params.execApprovalManager, missing);
		await reconcile(params.pluginApprovalManager, missing);
		await reconcile(params.systemAgentApprovalManager, missing);
		return null;
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
}
//#endregion
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
async function applyApprovalDecision(params) {
	const result = params.forceMalformedDeny ? await params.manager.forceDenyDetailed(params.id, "malformed-verdict", params.resolver, "denied", void 0, false, params.localResolvedBy, void 0, params.guard) : await params.manager.resolveDetailed(params.id, params.decision, params.resolver, params.localResolvedBy, "operator", {
		guard: params.guard,
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
		liveRecord: applied ? result.liveRecord ?? params.manager.getLiveSnapshot(params.id) ?? void 0 : result.liveRecord
	};
}
function createApprovalHandlers(params) {
	return {
		"approval.history": async (options) => {
			try {
				var _usingCtx$1 = _usingCtx();
				const { params: rawParams, respond, client, context } = options;
				const authority = _usingCtx$1.u(createApprovalRequestAuthority(options));
				if (!validateApprovalHistoryParams(rawParams)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.history params"));
					return;
				}
				if (!authority.isCurrent()) {
					respondApprovalNotFound(respond);
					return;
				}
				let history;
				try {
					history = await listTerminalOperatorApprovals({
						cursor: rawParams.cursor,
						limit: rawParams.limit,
						kind: rawParams.kind,
						databaseOptions: params.databaseOptions,
						guard: authority.guard
					});
				} catch (error) {
					if (!authority.isCurrent()) {
						respondApprovalNotFound(respond);
						return;
					}
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
				if (!authority.isCurrent()) {
					respondApprovalNotFound(respond);
					return;
				}
				const sessionAccess = _usingCtx$1.u(await prepareApprovalSessionAccess({
					client,
					getCfg: context.getRuntimeConfig,
					sources: history.records.map((record) => record.source)
				}));
				authority.assertCurrent();
				const cfg = context.getRuntimeConfig();
				const controlUiBasePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
				respond(true, {
					items: history.records.flatMap((record) => {
						if (!sessionAccess.canAccess(record.source)) return [];
						const snapshot = buildApprovalSnapshot(record, controlUiBasePath);
						return snapshot && snapshot.status !== "pending" ? [snapshot] : [];
					}),
					...history.nextCursor ? { nextCursor: history.nextCursor } : {}
				}, void 0);
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		},
		"approval.get": async (options) => {
			try {
				var _usingCtx3 = _usingCtx();
				const { params: rawParams, respond, client, context } = options;
				const authority = _usingCtx3.u(createApprovalRequestAuthority(options));
				if (!validateApprovalGetParams(rawParams)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid approval.get params"));
					return;
				}
				const id = readExactApprovalId(rawParams);
				let record;
				try {
					try {
						var _usingCtx4 = _usingCtx();
						record = _usingCtx4.u(id ? await loadVisibleApproval({
							...params,
							id,
							authority,
							client,
							getCfg: () => context.getRuntimeConfig()
						}) : null)?.readCurrent() ?? null;
					} catch (_) {
						_usingCtx4.e = _;
					} finally {
						_usingCtx4.d();
					}
				} catch (error) {
					if (!authority.isCurrent()) {
						respondApprovalNotFound(respond);
						return;
					}
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
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		},
		"approval.resolve": async (options) => {
			try {
				var _usingCtx5 = _usingCtx();
				const { params: rawParams, respond, client, context } = options;
				const authority = _usingCtx5.u(createApprovalRequestAuthority(options));
				const validParams = validateApprovalResolveParams(rawParams);
				const resolveParams = validParams ? rawParams : null;
				if (isRecord(rawParams) && "reviewer" in rawParams && !resolveParams?.reviewer) {
					respondApprovalNotFound(respond);
					return;
				}
				const id = readExactApprovalId(rawParams);
				let record;
				let prepared;
				try {
					prepared = id ? await loadVisibleApproval({
						...params,
						id,
						authority,
						client,
						getCfg: () => context.getRuntimeConfig(),
						allowApprovalRuntime: true,
						allowTransportRef: true
					}) : null;
					record = prepared?.readCurrent() ?? null;
				} catch (error) {
					if (!authority.isCurrent()) {
						respondApprovalNotFound(respond);
						return;
					}
					respondApprovalStorageUnavailable({
						context,
						respond,
						operation: "lookup",
						error
					});
					return;
				}
				const retainedApproval = _usingCtx5.u(prepared);
				if (!id || !record || !retainedApproval) {
					respondApprovalNotFound(respond);
					return;
				}
				const { guard: approvalGuard, readCurrent } = retainedApproval;
				const liveRecord = record.kind === "exec" ? params.execApprovalManager.getLiveSnapshot(record.id) : record.kind === "plugin" ? params.pluginApprovalManager.getLiveSnapshot(record.id) : params.systemAgentApprovalManager?.getLiveSnapshot(record.id);
				const custody = _usingCtx5.u(resolveParams?.reviewer ? prepareApprovalChannelCustody({
					cfg: context.getRuntimeConfig(),
					getCfg: context.getRuntimeConfig,
					assertCurrent: () => approvalGuard.assertCurrent(),
					approvalKind: record.kind,
					reviewer: resolveParams.reviewer
				}) : null);
				try {
					if (resolveParams?.reviewer && (!custody || !liveRecord || !await custody.authorizes(liveRecord))) {
						respondApprovalNotFound(respond);
						return;
					}
				} catch (error) {
					if (!authority.isCurrent()) respondApprovalNotFound(respond);
					else respondApprovalStorageUnavailable({
						context,
						respond,
						operation: "lookup",
						error
					});
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
					approvalGuard.assertCurrent();
					if (client?.invalidated || !canAccessOperatorApproval({
						client,
						allowApprovalRuntime: true,
						binding: { reviewerDeviceIds: record.reviewerDeviceIds }
					}) || approvalGuard.family === "native-compatibility" && !readCurrent() || resolveParams?.reviewer && (!liveRecord || !custody?.isCurrent(liveRecord))) throw new Error("approval resolver authority is no longer active");
				};
				let resolution;
				try {
					resolution = await applyApprovalDecision({
						id: record.id,
						decision: requestedDecision,
						forceMalformedDeny,
						resolver,
						localResolvedBy,
						guard: {
							family: approvalGuard.family,
							assertCurrent
						},
						manager: record.kind === "exec" ? params.execApprovalManager : record.kind === "plugin" ? params.pluginApprovalManager : params.systemAgentApprovalManager,
						...record.kind === "exec" && requestedDecision === "allow-always" && typeof resolveParams?.grantExpiresInDays === "number" ? { grantExpiresAtMs: Date.now() + Math.floor(resolveParams.grantExpiresInDays) * 864e5 } : {}
					});
				} catch (error) {
					if (!readCurrent()) {
						respondApprovalNotFound(respond);
						return;
					}
					respondApprovalStorageUnavailable({
						context,
						respond,
						operation: "resolve",
						error
					});
					return;
				}
				if (!authority.isCurrent() || !resolution.ok) {
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
					...params,
					record: terminalRecord,
					liveRecord: resolution.liveRecord,
					context
				}).catch((error) => {
					context.logGateway?.error?.(`${terminalRecord.kind} approvals: unified resolve publication failed: ${String(error)}`);
				});
			} catch (_) {
				_usingCtx5.e = _;
			} finally {
				_usingCtx5.d();
			}
		}
	};
}
//#endregion
export { createApprovalHandlers };
