import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { i as emitAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { n as expireDueOperatorApprovals, o as listPendingOperatorApprovals } from "./operator-approval-store-ZXCDEDUV.mjs";
import { n as resolveApprovalSourceStreamKey } from "./approval-session-audience-cMpQLMoT.mjs";
import { r as canReviewOperatorApproval, t as canAccessOperatorApproval } from "./operator-approval-authorization-CRqUaNvq.mjs";
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
	let publicationRevision = 0;
	const canAccessRecord = (client, record) => canAccessOperatorApproval({
		client,
		binding: { reviewerDeviceIds: record.reviewerDeviceIds }
	});
	const authorizedRecipients = (sessionKey, record) => {
		const subscribed = params.sessionMessageSubscribers.getApprovals(sessionKey);
		if (subscribed.size === 0) return subscribed;
		const recipients = /* @__PURE__ */ new Set();
		for (const client of params.clients) {
			const connId = client.connId;
			if (!client.invalidated && connId && subscribed.has(connId) && canAccessRecord(client, record)) recipients.add(connId);
		}
		return recipients;
	};
	const publish = (event) => {
		publicationRevision += 1;
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
	return {
		publish,
		replay: async (sessionKey, client) => {
			const snapshotAtMs = now();
			if (!canReviewOperatorApproval(client)) return {
				replay: {
					sessionKey,
					updatedAtMs: snapshotAtMs,
					approvals: [],
					truncated: false
				},
				isCurrent: () => !canReviewOperatorApproval(client)
			};
			const scopes = [...client?.connect.scopes ?? []];
			const deviceId = client?.connect.device?.id;
			const reviewerDeviceId = scopes.includes("operator.admin") ? void 0 : deviceId?.trim();
			const assertCurrent = () => {
				if (params.isCurrent?.() === false || client?.invalidated || !canReviewOperatorApproval(client) || scopes.join("\0") !== client?.connect.scopes?.join("\0") || !scopes.includes("operator.admin") && deviceId !== client?.connect.device?.id) throw new Error("Operator approval replay authority is no longer current");
			};
			assertCurrent();
			const expired = await expireDueOperatorApprovals({
				nowMs: snapshotAtMs,
				databaseOptions: params.databaseOptions
			});
			for (const record of expired.records) if (await params.reconcileTerminal?.(record) !== true) publish({
				phase: "terminal",
				record
			});
			assertCurrent();
			const approvals = [];
			let revision;
			let records;
			do {
				revision = publicationRevision;
				records = await listPendingOperatorApprovals({
					audienceSessionKey: sessionKey,
					reviewerDeviceId,
					limit: 1001,
					nowMs: snapshotAtMs,
					databaseOptions: params.databaseOptions
				});
				assertCurrent();
			} while (revision !== publicationRevision);
			const isCurrent = () => {
				assertCurrent();
				return revision === publicationRevision;
			};
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
		}
	};
}
//#endregion
export { createOperatorApprovalSessionEventRuntime };
