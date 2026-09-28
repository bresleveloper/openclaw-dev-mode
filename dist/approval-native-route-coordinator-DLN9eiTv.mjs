import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as formatHumanList } from "./human-list-Beo_KoiT.mjs";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-4MFmdZVV.mjs";
//#region src/infra/approval-native-route-notice.ts
/** Formats the human destination label for where native approval prompts were delivered. */
function describeApprovalDeliveryDestination(params) {
	const surfaces = new Set(params.deliveredTargets.map((target) => target.surface));
	return surfaces.size === 1 && surfaces.has("approver-dm") ? `${params.channelLabel} DMs` : params.channelLabel;
}
/** Builds the notice shown in the current chat when approval was routed elsewhere. */
function resolveApprovalRoutedElsewhereNoticeText(destinations) {
	const uniqueDestinations = sortUniqueStrings(destinations.map((value) => value.trim())).filter(Boolean);
	if (uniqueDestinations.length === 0) return null;
	return `Approval required. I sent the approval request to ${formatHumanList(uniqueDestinations)}, not this chat.`;
}
/** Builds the recovery notice when no channel account uniquely owns the approval. */
function resolveAmbiguousApprovalRouteNoticeText() {
	return "Approval required, but multiple channel accounts can handle this request. Open the Control UI or terminal UI to approve it.";
}
/** Builds the fallback slash-command notice when native approval delivery fails. */
function resolveApprovalDeliveryFailedNoticeText(params) {
	return [
		"Approval required. I could not deliver the native approval request.",
		`Reply with: /approve ${params.approvalKind === "exec" && params.approvalId.length > 8 ? params.approvalId.slice(0, 8) : params.approvalId} ${(params.allowedDecisions?.length ? params.allowedDecisions : [
			"allow-once",
			"allow-always",
			"deny"
		]).join("|")}`,
		"If the short code is ambiguous, use the full id in /approve."
	].join("\n");
}
//#endregion
//#region src/infra/approval-native-route-coordinator.ts
function createApprovalNativeRouteCoordinatorState() {
	return {
		activeRuntimes: /* @__PURE__ */ new Map(),
		pendingNotices: /* @__PURE__ */ new Map(),
		selections: /* @__PURE__ */ new Map(),
		runtimeSeq: 0,
		closed: false
	};
}
function clearApprovalRouteSelection(state, approvalId) {
	const selection = state.selections.get(approvalId);
	if (!selection) return;
	state.selections.delete(approvalId);
	clearTimeout(selection.cleanupTimeout);
}
function routeGroupKey(runtime) {
	return normalizeChannel(runtime.channel) || runtime.runtimeId;
}
function createApprovalRouteSelection(state, params) {
	const runtimes = Array.from(state.activeRuntimes.values()).filter((runtime) => runtime.handledKinds.has(params.approvalKind));
	const verdicts = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const runtime of runtimes) {
		const key = routeGroupKey(runtime);
		groups.set(key, [...groups.get(key) ?? [], runtime]);
	}
	const selectedRuntimeIds = /* @__PURE__ */ new Set();
	for (const group of groups.values()) {
		const candidates = [];
		for (const runtime of group) try {
			if (runtime.shouldHandle(params.request)) candidates.push(runtime);
		} catch (error) {
			verdicts.set(runtime.runtimeId, {
				kind: "selector-error",
				error
			});
		}
		let routeClass;
		try {
			routeClass = group[0]?.classifyRoute(params.request) ?? "unbound";
		} catch (error) {
			for (const runtime of group) verdicts.set(runtime.runtimeId, {
				kind: "selector-error",
				error
			});
			continue;
		}
		if (routeClass === "bound-or-explicit") {
			if (candidates.length === 0) {
				for (const runtime of group) if (!verdicts.has(runtime.runtimeId)) verdicts.set(runtime.runtimeId, { kind: "owner-unavailable" });
				continue;
			}
			for (const runtime of candidates) selectedRuntimeIds.add(runtime.runtimeId);
		} else if (routeClass === "unbound" && candidates.length === 1) {
			const [candidate] = candidates;
			if (candidate) selectedRuntimeIds.add(candidate.runtimeId);
		} else if (routeClass === "unbound" && candidates.length > 1) for (const runtime of candidates) verdicts.set(runtime.runtimeId, { kind: "ambiguous-owner" });
	}
	for (const runtime of runtimes) if (selectedRuntimeIds.has(runtime.runtimeId)) verdicts.set(runtime.runtimeId, { kind: "selected" });
	else if (!verdicts.has(runtime.runtimeId)) verdicts.set(runtime.runtimeId, { kind: "ineligible" });
	const timeoutMs = Math.min(Math.max(0, params.request.expiresAtMs - Date.now()), 2147483647);
	const cleanupTimeout = setTimeout(() => {
		clearApprovalRouteSelection(state, params.request.id);
	}, timeoutMs);
	cleanupTimeout.unref?.();
	const selection = {
		verdicts,
		cleanupTimeout
	};
	state.selections.set(params.request.id, selection);
	return selection;
}
function resolveApprovalRouteSelection(state, params) {
	return state.selections.get(params.request.id) ?? createApprovalRouteSelection(state, params);
}
const defaultCoordinatorState = createApprovalNativeRouteCoordinatorState();
const MAX_APPROVAL_ROUTE_NOTICE_TTL_MS = 3e5;
function normalizeChannel(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function clearPendingApprovalRouteNotice(state, approvalId) {
	const entry = state.pendingNotices.get(approvalId);
	if (!entry) return;
	state.pendingNotices.delete(approvalId);
	clearTimeout(entry.cleanupTimeout);
}
function createPendingApprovalRouteNotice(state, params) {
	const timeoutMs = Math.min(Math.max(0, params.request.expiresAtMs - Date.now()), MAX_APPROVAL_ROUTE_NOTICE_TTL_MS);
	const cleanupTimeout = setTimeout(() => {
		maybeFinalizeApprovalRouteNotice(state, params.request.id, { force: true });
	}, timeoutMs);
	cleanupTimeout.unref?.();
	return {
		request: params.request,
		approvalKind: params.approvalKind,
		reports: /* @__PURE__ */ new Map(),
		cleanupTimeout
	};
}
function resolveRouteNoticeTargetFromRequest(request) {
	const channel = request.request.turnSourceChannel?.trim();
	const to = request.request.turnSourceTo?.trim();
	if (!channel || !to) return null;
	return {
		channel,
		to,
		accountId: request.request.turnSourceAccountId ?? void 0,
		threadId: request.request.turnSourceThreadId ?? void 0
	};
}
function resolveFallbackRouteNoticeTarget(report) {
	const channel = report.channel?.trim();
	const to = report.deliveryPlan.originTarget?.to?.trim();
	if (!channel || !to) return null;
	return {
		channel,
		to,
		accountId: report.accountId ?? void 0,
		threadId: report.deliveryPlan.originTarget?.threadId ?? void 0
	};
}
function didReportDeliverToOrigin(report, originAccountId) {
	const originTarget = report.deliveryPlan.originTarget;
	if (!originTarget) return false;
	const reportAccountId = normalizeOptionalString(report.accountId);
	if (originAccountId !== void 0 && reportAccountId !== void 0 && reportAccountId !== originAccountId) return false;
	const originKey = buildChannelApprovalNativeTargetKey(originTarget);
	return report.deliveredTargets.some((plannedTarget) => buildChannelApprovalNativeTargetKey(plannedTarget.target) === originKey);
}
function hasPlannedNativeTargets(report) {
	return report.deliveryPlan.targets.length > 0;
}
function readAllowedDecisionStrings(request) {
	const allowedDecisions = "allowedDecisions" in request.request ? request.request.allowedDecisions : void 0;
	if (!Array.isArray(allowedDecisions)) return;
	return allowedDecisions.filter((value) => typeof value === "string");
}
function resolveApprovalRouteNotice(params) {
	const explicitTarget = resolveRouteNoticeTargetFromRequest(params.request);
	const originChannel = normalizeChannel(explicitTarget?.channel ?? params.request.request.turnSourceChannel);
	const fallbackTarget = params.reports.filter((report) => normalizeChannel(report.channel) === originChannel || !originChannel).map(resolveFallbackRouteNoticeTarget).find((target) => target !== null) ?? null;
	const target = explicitTarget ? {
		...fallbackTarget,
		...explicitTarget,
		accountId: explicitTarget.accountId ?? fallbackTarget?.accountId,
		threadId: explicitTarget.threadId ?? fallbackTarget?.threadId
	} : fallbackTarget;
	if (!target) return null;
	const originAccountId = normalizeOptionalString(target.accountId);
	const deliveredAnyTarget = params.reports.some((report) => report.deliveredTargets.length > 0);
	const ambiguousOwner = params.reports.some((report) => report.skipReason === "ambiguous-owner");
	const requiresManualFallback = ambiguousOwner || params.reports.some((report) => report.skipReason === "owner-unavailable");
	if (!deliveredAnyTarget && (params.reports.some(hasPlannedNativeTargets) || requiresManualFallback || params.missingSelectedRuntime)) {
		const requestGateway = params.reports.find((report) => params.state.activeRuntimes.has(report.runtimeId))?.requestGateway ?? params.reports[0]?.requestGateway ?? Array.from(params.state.activeRuntimes.values())[0]?.requestGateway;
		if (!requestGateway) return null;
		return {
			requestGateway,
			target,
			text: ambiguousOwner ? resolveAmbiguousApprovalRouteNoticeText() : resolveApprovalDeliveryFailedNoticeText({
				approvalId: params.request.id,
				approvalKind: params.approvalKind,
				allowedDecisions: readAllowedDecisionStrings(params.request)
			})
		};
	}
	if (params.reports.some((report) => {
		if (originChannel && normalizeChannel(report.channel) !== originChannel) return false;
		return didReportDeliverToOrigin(report, originAccountId);
	})) return null;
	const text = resolveApprovalRoutedElsewhereNoticeText(params.reports.flatMap((report) => {
		if (!report.channelLabel || report.deliveredTargets.length === 0) return [];
		const reportChannel = normalizeChannel(report.channel);
		if (originChannel && reportChannel === originChannel && !report.deliveryPlan.notifyOriginWhenDmOnly) return [];
		const reportAccountId = normalizeOptionalString(report.accountId);
		if (originChannel && reportChannel === originChannel && originAccountId !== void 0 && reportAccountId !== void 0 && reportAccountId !== originAccountId) return [];
		return [describeApprovalDeliveryDestination({
			channelLabel: report.channelLabel,
			deliveredTargets: report.deliveredTargets
		})];
	}));
	if (!text) return null;
	const requestGateway = params.reports.find((report) => params.state.activeRuntimes.has(report.runtimeId))?.requestGateway ?? params.reports[0]?.requestGateway;
	if (!requestGateway) return null;
	return {
		requestGateway,
		target,
		text
	};
}
/** Returns whether a native approval runtime is active for the requested channel/account scope. */
function hasActiveApprovalNativeRouteRuntime(params) {
	return hasActiveApprovalNativeRouteRuntimeForState(defaultCoordinatorState, params);
}
function hasActiveApprovalNativeRouteRuntimeForState(state, params) {
	const channel = normalizeChannel(params.channel);
	const accountId = normalizeOptionalString(params.accountId);
	const matchingRuntimes = Array.from(state.activeRuntimes.values()).filter((runtime) => {
		if (!runtime.handledKinds.has(params.approvalKind)) return false;
		if (channel && normalizeChannel(runtime.channel) !== channel) return false;
		const runtimeAccountId = normalizeOptionalString(runtime.accountId);
		return accountId === void 0 || runtimeAccountId === void 0 || runtimeAccountId === accountId;
	});
	return accountId === void 0 ? matchingRuntimes.length === 1 : matchingRuntimes.length > 0;
}
async function maybeFinalizeApprovalRouteNotice(state, approvalId, options) {
	const entry = state.pendingNotices.get(approvalId);
	if (!entry) return;
	const selection = state.selections.get(approvalId);
	if (!selection) return;
	if (!options?.force) {
		for (const runtimeId of selection.verdicts.keys()) if (!entry.reports.has(runtimeId)) return;
	}
	const missingSelectedRuntime = Array.from(selection.verdicts).some(([runtimeId, verdict]) => verdict.kind === "selected" && !entry.reports.has(runtimeId));
	if (!options?.force && missingSelectedRuntime) return;
	const reports = Array.from(entry.reports.values());
	const notice = resolveApprovalRouteNotice({
		state,
		approvalKind: entry.approvalKind,
		request: entry.request,
		reports,
		missingSelectedRuntime
	});
	clearPendingApprovalRouteNotice(state, approvalId);
	if (!notice) return;
	try {
		await notice.requestGateway("send", {
			channel: notice.target.channel,
			to: notice.target.to,
			accountId: notice.target.accountId ?? void 0,
			threadId: notice.target.threadId ?? void 0,
			message: notice.text,
			idempotencyKey: `approval-route-notice:${approvalId}`
		});
	} catch {}
}
/** Tracks native approval deliveries and sends origin-chat notices after all observed runtimes report. */
function createApprovalNativeRouteReporter(params) {
	return createApprovalNativeRouteReporterForState(defaultCoordinatorState, params);
}
function createApprovalNativeRouteReporterForState(state, params) {
	const runtimeId = `native-approval-route:${++state.runtimeSeq}`;
	let registered = false;
	const report = async (payload) => {
		if (state.closed || !registered || !params.handledKinds.has(payload.approvalKind)) return;
		if (!resolveApprovalRouteSelection(state, payload).verdicts.has(runtimeId)) return;
		const entry = state.pendingNotices.get(payload.request.id) ?? createPendingApprovalRouteNotice(state, {
			request: payload.request,
			approvalKind: payload.approvalKind
		});
		entry.reports.set(runtimeId, {
			runtimeId,
			request: payload.request,
			channel: params.channel,
			channelLabel: params.channelLabel,
			accountId: params.accountId,
			deliveryPlan: payload.deliveryPlan,
			deliveredTargets: payload.deliveredTargets,
			requestGateway: params.requestGateway,
			skipReason: payload.skipReason
		});
		state.pendingNotices.set(payload.request.id, entry);
		await maybeFinalizeApprovalRouteNotice(state, payload.request.id);
	};
	return {
		selectRequest(payload) {
			if (state.closed || !params.handledKinds.has(payload.approvalKind)) return { kind: "ineligible" };
			if (!registered) try {
				return params.shouldHandle(payload.request) ? { kind: "selected" } : { kind: "ineligible" };
			} catch (error) {
				return {
					kind: "selector-error",
					error
				};
			}
			const selection = resolveApprovalRouteSelection(state, payload);
			const entry = state.pendingNotices.get(payload.request.id) ?? createPendingApprovalRouteNotice(state, {
				request: payload.request,
				approvalKind: payload.approvalKind
			});
			state.pendingNotices.set(payload.request.id, entry);
			return selection.verdicts.get(runtimeId) ?? { kind: "ineligible" };
		},
		start() {
			if (state.closed || registered) return;
			state.activeRuntimes.set(runtimeId, {
				runtimeId,
				handledKinds: params.handledKinds,
				channel: params.channel,
				channelLabel: params.channelLabel,
				accountId: params.accountId,
				requestGateway: params.requestGateway,
				shouldHandle: params.shouldHandle,
				classifyRoute: params.classifyRoute
			});
			registered = true;
		},
		async reportSkipped(paramsValue) {
			await report({
				approvalKind: paramsValue.approvalKind,
				request: paramsValue.request,
				deliveryPlan: {
					targets: [],
					originTarget: null,
					notifyOriginWhenDmOnly: false
				},
				deliveredTargets: [],
				skipReason: paramsValue.reason
			});
		},
		async reportDelivery(paramsLocal) {
			await report(paramsLocal);
		},
		completeRequest(approvalId) {
			clearApprovalRouteSelection(state, approvalId);
			clearPendingApprovalRouteNotice(state, approvalId);
		},
		async stop() {
			if (!registered) return;
			for (const entry of Array.from(state.pendingNotices.values())) {
				const selection = state.selections.get(entry.request.id);
				if (selection?.verdicts.has(runtimeId) && !entry.reports.has(runtimeId)) await report({
					request: entry.request,
					approvalKind: entry.approvalKind,
					deliveryPlan: {
						targets: [],
						originTarget: null,
						notifyOriginWhenDmOnly: false
					},
					deliveredTargets: [],
					skipReason: selection.verdicts.get(runtimeId)?.kind === "selected" ? "owner-unavailable" : "ineligible"
				});
			}
			registered = false;
			state.activeRuntimes.delete(runtimeId);
		}
	};
}
/** Reads native route activity from the owning Gateway coordinator, else the process default. */
function hasActiveNativeApprovalRoute(coordinator, params) {
	return coordinator?.hasActiveRuntime(params) ?? hasActiveApprovalNativeRouteRuntime(params);
}
/** Creates an instance-local route coordinator so Gateway runtimes cannot share account state. */
function createApprovalNativeRouteCoordinator() {
	const state = createApprovalNativeRouteCoordinatorState();
	return {
		createReporter: (params) => createApprovalNativeRouteReporterForState(state, params),
		hasActiveRuntime: (params) => hasActiveApprovalNativeRouteRuntimeForState(state, params),
		close: () => {
			state.closed = true;
			for (const approvalId of Array.from(state.pendingNotices.keys())) clearPendingApprovalRouteNotice(state, approvalId);
			for (const approvalId of Array.from(state.selections.keys())) clearApprovalRouteSelection(state, approvalId);
			state.activeRuntimes.clear();
		}
	};
}
//#endregion
export { createApprovalNativeRouteReporter as n, hasActiveNativeApprovalRoute as r, createApprovalNativeRouteCoordinator as t };
