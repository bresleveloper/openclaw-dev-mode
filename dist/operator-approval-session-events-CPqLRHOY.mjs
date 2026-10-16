import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import "./operator-scopes-DsrPoRc4.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { l as listPendingOperatorApprovals, n as expireDueOperatorApprovals } from "./operator-approval-store-cPImwg80.mjs";
import { n as resolveApprovalSourceStreamKey } from "./approval-session-audience-Dq5k-x4s.mjs";
import { t as matchesOperatorApprovalReviewerBinding } from "./operator-approval-reviewer-binding-CUkDa5Dm.mjs";
import { r as canReviewOperatorApproval, t as canAccessOperatorApproval } from "./operator-approval-authorization-BCjW3avN.mjs";
import { t as projectOperatorApprovalSnapshot } from "./operator-approval-snapshot-DiSAwAzh.mjs";
//#region src/gateway/operator-approval-session-events.ts
const MAX_SESSION_APPROVAL_REPLAY = 1e3;
function resolveApprovalSourceStreamKeyForRecord(record) {
	return record.audienceSessionKeys[0] ?? (record.source.sessionKey ? resolveApprovalSourceStreamKey(record.source.sessionKey, record.source.agentId) : null);
}
/** Project durable approval truth to exact, explicitly opted-in session audiences. */
function createOperatorApprovalSessionEventRuntime(params) {
	const controlUiBasePath = normalizeControlUiBasePath(params.controlUiBasePath);
	const now = params.now ?? Date.now;
	const replayScopes = /* @__PURE__ */ new Map();
	const authorizedRecipients = (sessionKey, record) => {
		const subscribed = params.sessionMessageSubscribers.getApprovals(sessionKey);
		if (subscribed.size === 0) return subscribed;
		const recipients = /* @__PURE__ */ new Set();
		for (const client of params.clients) {
			const connId = client.connId;
			if (!client.invalidated && connId && subscribed.has(connId) && canAccessOperatorApproval({
				client,
				binding: record
			})) recipients.add(connId);
		}
		return recipients;
	};
	const publish = (event) => {
		for (const scope of replayScopes.values()) if (event.record.audienceSessionKeys.includes(scope.sessionKey) && (scope.reviewerDeviceId === void 0 || matchesOperatorApprovalReviewerBinding(event.record, scope.reviewerDeviceId))) {
			scope.revision += 1;
			scope.preparation = void 0;
		}
		const source = event.record.source;
		const pending = event.phase === "pending" && event.record.status === "pending";
		const manager = params.getLiveManager?.(event.record.kind);
		const live = pending ? manager?.getLiveSnapshot(event.record.id) : void 0;
		const request = asOptionalObjectRecord(live?.request);
		const livePending = Boolean(manager?.runtimeEpoch === event.record.runtimeEpoch && live && live.resolvedAtMs === void 0 && live.expiresAtMs > now() && request?.runId === source.runId && request?.sessionId === source.sessionId && request?.sessionKey === source.sessionKey);
		if (params.getLiveManager && params.isCurrent?.() !== false && source.runId && source.sessionId && (pending ? livePending : event.record.status !== "pending")) emitAgentEvent({
			runId: source.runId,
			sessionId: source.sessionId,
			...source.sessionKey ? { sessionKey: source.sessionKey } : {},
			stream: "execution",
			data: { approval: {
				id: event.record.id,
				state: pending ? "pending" : "resolved"
			} }
		});
		const approval = projectOperatorApprovalSnapshot(event.record, controlUiBasePath);
		if (!approval || event.record.audienceSessionKeys.length === 0) return;
		const sourceStreamKey = resolveApprovalSourceStreamKeyForRecord(event.record);
		for (const sessionKey of event.record.audienceSessionKeys) {
			const recipients = authorizedRecipients(sessionKey, event.record);
			if (recipients.size === 0) continue;
			const common = {
				sessionKey,
				...sourceStreamKey ? { sourceSessionKey: sourceStreamKey } : {},
				updatedAtMs: event.record.updatedAtMs
			};
			let payload;
			if (event.phase === "pending") {
				if (approval.status !== "pending") continue;
				payload = {
					...common,
					phase: "pending",
					approval
				};
			} else {
				if (approval.status === "pending") continue;
				payload = {
					...common,
					phase: "terminal",
					approval
				};
			}
			params.broadcastToConnIds("session.approval", payload, recipients);
		}
	};
	const prepareReplay = async (scope) => {
		const { sessionKey, reviewerDeviceId } = scope;
		const snapshotAtMs = now();
		const expired = await expireDueOperatorApprovals({
			nowMs: snapshotAtMs,
			databaseOptions: params.databaseOptions
		});
		for (const record of expired.records) if (await params.reconcileTerminal?.(record) !== true) publish({
			phase: "terminal",
			record
		});
		if (params.isCurrent?.() === false) throw new Error("Operator approval replay authority is no longer current");
		const revision = scope.revision;
		const records = await listPendingOperatorApprovals({
			audienceSessionKey: sessionKey,
			reviewerDeviceId,
			limit: 1001,
			nowMs: snapshotAtMs,
			databaseOptions: params.databaseOptions
		});
		const isCurrent = () => revision === scope.revision;
		const approvals = [];
		const truncated = records.length > MAX_SESSION_APPROVAL_REPLAY;
		for (const record of records) {
			if (approvals.length === MAX_SESSION_APPROVAL_REPLAY) return {
				replay: {
					sessionKey,
					updatedAtMs: snapshotAtMs,
					approvals,
					truncated: true
				},
				isCurrent
			};
			const approval = projectOperatorApprovalSnapshot(record, controlUiBasePath);
			if (approval?.status === "pending") {
				const sourceSessionKey = resolveApprovalSourceStreamKeyForRecord(record);
				approvals.push({
					...approval,
					...sourceSessionKey ? { sourceSessionKey } : {}
				});
			}
		}
		return {
			replay: {
				sessionKey,
				updatedAtMs: snapshotAtMs,
				approvals,
				truncated
			},
			isCurrent
		};
	};
	return {
		publish,
		replay: async (sessionKey, client) => {
			if (!canReviewOperatorApproval(client)) return {
				replay: {
					sessionKey,
					updatedAtMs: now(),
					approvals: [],
					truncated: false
				},
				isCurrent: () => !canReviewOperatorApproval(client),
				release: () => {}
			};
			const scopes = [...client?.connect.scopes ?? []];
			const deviceId = client?.connect.device?.id;
			const reviewerDeviceId = scopes.includes("operator.admin") ? void 0 : deviceId?.trim();
			const assertCurrent = () => {
				if (params.isCurrent?.() === false || client?.invalidated || !canReviewOperatorApproval(client) || scopes.join("\0") !== client?.connect.scopes?.join("\0") || !scopes.includes("operator.admin") && deviceId !== client?.connect.device?.id) throw new Error("Operator approval replay authority is no longer current");
			};
			assertCurrent();
			const key = JSON.stringify([sessionKey, reviewerDeviceId]);
			let scope = replayScopes.get(key);
			if (!scope) {
				scope = {
					sessionKey,
					reviewerDeviceId,
					references: 0,
					revision: 0
				};
				replayScopes.set(key, scope);
			}
			const retained = scope;
			retained.references += 1;
			let released = false;
			const release = () => {
				if (released) return;
				released = true;
				retained.references -= 1;
				if (retained.references === 0) replayScopes.delete(key);
			};
			try {
				let preparation = retained.preparation;
				if (!preparation) {
					preparation = prepareReplay(retained).finally(() => {
						if (retained.preparation === preparation) retained.preparation = void 0;
					});
					retained.preparation = preparation;
				}
				const prepared = await preparation;
				assertCurrent();
				return {
					replay: prepared.replay,
					isCurrent: () => {
						assertCurrent();
						return !released && prepared.isCurrent();
					},
					release
				};
			} catch (error) {
				release();
				throw error;
			}
		}
	};
}
//#endregion
export { createOperatorApprovalSessionEventRuntime };
