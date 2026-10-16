import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { c as normalizeApprovalRequest } from "./approval-request-account-binding-I7l4AwjN.mjs";
import { t as createChannelNativeApprovalRuntime } from "./approval-native-runtime-Bpck8pk6.mjs";
import { n as buildPendingApprovalView, r as buildResolvedApprovalView, t as buildExpiredApprovalView } from "./approval-view-model-TGisah2K.mjs";
//#region src/infra/approval-handler-runtime.ts
async function unbindWrappedEntries(params) {
	if (!params.nativeRuntime.interactions?.unbindPending) return;
	for (const wrapped of params.entries) {
		if (wrapped.binding === void 0) continue;
		try {
			await params.nativeRuntime.interactions.unbindPending({
				...params.baseContext,
				entry: wrapped.entry,
				binding: wrapped.binding,
				request: params.request,
				approvalKind: params.approvalKind
			});
		} catch (error) {
			params.log.error(`failed to unbind stopped native approval entry approval=${params.request.id}: ${String(error)}`);
		}
	}
}
async function applyApprovalFinalAction(params) {
	switch (params.result.kind) {
		case "update":
			await params.nativeRuntime.transport.updateEntry?.({
				...params.baseContext,
				entry: params.wrapped.entry,
				request: params.request,
				approvalKind: params.approvalKind,
				payload: params.result.payload,
				phase: params.phase
			});
			return;
		case "delete":
			await params.nativeRuntime.transport.deleteEntry?.({
				...params.baseContext,
				entry: params.wrapped.entry,
				phase: params.phase
			});
			return;
		case "clear-actions": await params.nativeRuntime.interactions?.clearPendingActions?.({
			...params.baseContext,
			entry: params.wrapped.entry,
			phase: params.phase
		});
	}
}
/** Adapts a strongly typed channel native approval spec into the erased runtime contract. */
function createChannelApprovalNativeRuntimeAdapter(spec) {
	const adapter = {
		...spec.eventKinds ? { eventKinds: spec.eventKinds } : {},
		...spec.resolveApprovalKind ? { resolveApprovalKind: spec.resolveApprovalKind } : {},
		availability: {
			isConfigured: spec.availability.isConfigured,
			shouldHandle: spec.availability.shouldHandle
		},
		presentation: {
			buildPendingPayload: async (params) => await spec.presentation.buildPendingPayload(params),
			buildResolvedResult: async (params) => await spec.presentation.buildResolvedResult(params),
			buildExpiredResult: async (params) => await spec.presentation.buildExpiredResult(params)
		},
		transport: {
			prepareTarget: async (params) => await spec.transport.prepareTarget(params),
			deliverPending: async (params) => await spec.transport.deliverPending(params)
		}
	};
	if (spec.transport.updateEntry) adapter.transport.updateEntry = async (params) => await spec.transport.updateEntry?.(params);
	if (spec.transport.deleteEntry) adapter.transport.deleteEntry = async (params) => await spec.transport.deleteEntry?.(params);
	if (spec.interactions) {
		const interactions = {};
		if (spec.interactions.bindPending) interactions.bindPending = async (params) => await spec.interactions.bindPending(params) ?? null;
		if (spec.interactions.unbindPending) interactions.unbindPending = async (params) => await spec.interactions?.unbindPending?.(params);
		if (spec.interactions.clearPendingActions) interactions.clearPendingActions = async (params) => await spec.interactions?.clearPendingActions?.(params);
		if (spec.interactions.cancelDelivered) interactions.cancelDelivered = async (params) => await spec.interactions?.cancelDelivered?.(params);
		adapter.interactions = interactions;
	}
	if (spec.observe) {
		const observe = {};
		if (spec.observe.onDeliveryError) observe.onDeliveryError = (params) => spec.observe?.onDeliveryError?.(params);
		if (spec.observe.onDuplicateSkipped) observe.onDuplicateSkipped = (params) => spec.observe?.onDuplicateSkipped?.(params);
		if (spec.observe.onDelivered) observe.onDelivered = (params) => spec.observe?.onDelivered?.(params);
		if (spec.observe.onFinalized) observe.onFinalized = (params) => spec.observe?.onFinalized?.(params);
		adapter.observe = observe;
	}
	return adapter;
}
/** Creates the shared approval handler runtime from channel-specific content and transport hooks. */
function createChannelApprovalHandler(adapter) {
	return createChannelNativeApprovalRuntime({
		label: adapter.runtime.label,
		clientDisplayName: adapter.runtime.clientDisplayName,
		cfg: adapter.runtime.cfg,
		gatewayUrl: adapter.runtime.gatewayUrl,
		eventKinds: adapter.runtime.eventKinds,
		channel: adapter.runtime.channel,
		channelLabel: adapter.runtime.channelLabel,
		accountId: adapter.runtime.accountId,
		nativeAdapter: adapter.runtime.nativeAdapter,
		...adapter.runtime.resolveApprovalKind ? { resolveApprovalKind: adapter.runtime.resolveApprovalKind } : {},
		isConfigured: adapter.runtime.isConfigured,
		shouldHandle: adapter.runtime.shouldHandle,
		nowMs: adapter.runtime.nowMs,
		buildPendingContent: adapter.content.buildPendingContent,
		prepareTarget: adapter.transport.prepareTarget,
		deliverTarget: adapter.transport.deliverTarget,
		onDeliveryError: adapter.lifecycle.onDeliveryError,
		onDuplicateSkipped: adapter.lifecycle.onDuplicateSkipped,
		onDelivered: adapter.lifecycle.onDelivered,
		finalizeResolved: adapter.lifecycle.finalizeResolved,
		finalizeExpired: adapter.lifecycle.finalizeExpired,
		onStopped: adapter.lifecycle.onStopped
	});
}
/** Builds a shared approval handler from a plugin approval capability, or null when unsupported. */
async function createChannelApprovalHandlerFromCapability(params) {
	const nativeRuntime = params.capability?.nativeRuntime;
	if (!nativeRuntime) return null;
	const log = createSubsystemLogger(params.label);
	const activeEntries = /* @__PURE__ */ new Map();
	let stopped = false;
	const resolveApprovalKind = (request) => {
		const normalizedRequest = normalizeApprovalRequest(request);
		return nativeRuntime.resolveApprovalKind?.(normalizedRequest) ?? normalizedRequest.approvalKind;
	};
	const baseContext = {
		cfg: params.cfg,
		accountId: params.accountId,
		gatewayUrl: params.gatewayUrl,
		context: params.context
	};
	const finalize = async (request, entries, outcome) => {
		const active = activeEntries.get(request.id)?.entries ?? entries;
		activeEntries.delete(request.id);
		const approvalKind = resolveApprovalKind(request);
		let buildResult;
		if (outcome.phase === "resolved") {
			const view = buildResolvedApprovalView(request, outcome.resolved);
			buildResult = (entry) => nativeRuntime.presentation.buildResolvedResult({
				...baseContext,
				request,
				resolved: outcome.resolved,
				view,
				entry
			});
		} else {
			const view = buildExpiredApprovalView(request);
			buildResult = (entry) => nativeRuntime.presentation.buildExpiredResult({
				...baseContext,
				request,
				view,
				entry
			});
		}
		for (const wrapped of active) try {
			if (wrapped.binding !== void 0) await nativeRuntime.interactions?.unbindPending?.({
				...baseContext,
				entry: wrapped.entry,
				binding: wrapped.binding,
				request,
				approvalKind
			});
			await applyApprovalFinalAction({
				nativeRuntime,
				baseContext,
				wrapped,
				request,
				approvalKind,
				result: await buildResult(wrapped.entry),
				phase: outcome.phase
			});
		} catch (error) {
			log.error(`failed to finalize ${outcome.phase} native approval entry approval=${request.id}: ${String(error)}`);
		}
		nativeRuntime.observe?.onFinalized?.({
			...baseContext,
			request,
			approvalKind,
			phase: outcome.phase
		});
	};
	return createChannelApprovalHandler({
		runtime: {
			label: params.label,
			clientDisplayName: params.clientDisplayName,
			channel: params.channel,
			channelLabel: params.channelLabel,
			cfg: params.cfg,
			accountId: params.accountId,
			gatewayUrl: params.gatewayUrl,
			eventKinds: nativeRuntime.eventKinds,
			nativeAdapter: params.capability?.native,
			...nativeRuntime.resolveApprovalKind ? { resolveApprovalKind: nativeRuntime.resolveApprovalKind } : {},
			isConfigured: () => nativeRuntime.availability.isConfigured(baseContext),
			shouldHandle: (request) => {
				const approvalKind = resolveApprovalKind(request);
				if (approvalKind === "plugin" && !canChannelEnforcePluginReviewerPolicy(params.cfg, params.channel, params.capability)) return false;
				return nativeRuntime.availability.shouldHandle({
					...baseContext,
					request,
					approvalKind
				});
			},
			nowMs: params.nowMs
		},
		content: { buildPendingContent: async ({ request, approvalKind, nowMs }) => {
			const view = buildPendingApprovalView(request);
			return {
				view,
				payload: await nativeRuntime.presentation.buildPendingPayload({
					...baseContext,
					request,
					approvalKind,
					nowMs,
					view
				})
			};
		} },
		transport: {
			prepareTarget: async ({ plannedTarget, request, approvalKind, pendingContent }) => {
				return await nativeRuntime.transport.prepareTarget({
					...baseContext,
					plannedTarget,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
			},
			deliverTarget: async ({ plannedTarget, preparedTarget, request, approvalKind, pendingContent }) => {
				const entry = await nativeRuntime.transport.deliverPending({
					...baseContext,
					plannedTarget,
					preparedTarget,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
				if (!entry) return null;
				if (stopped) {
					await nativeRuntime.interactions?.cancelDelivered?.({
						...baseContext,
						entry,
						request,
						approvalKind
					});
					return null;
				}
				const binding = await nativeRuntime.interactions?.bindPending?.({
					...baseContext,
					entry,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
				if (stopped) {
					if (binding !== void 0 && binding !== null) await nativeRuntime.interactions?.unbindPending?.({
						...baseContext,
						entry,
						binding,
						request,
						approvalKind
					});
					else await nativeRuntime.interactions?.cancelDelivered?.({
						...baseContext,
						entry,
						request,
						approvalKind
					});
					return null;
				}
				const wrapped = {
					entry,
					...binding === void 0 || binding === null ? {} : { binding }
				};
				const activeRequest = activeEntries.get(request.id) ?? {
					request,
					approvalKind,
					entries: []
				};
				activeRequest.entries.push(wrapped);
				activeEntries.set(request.id, activeRequest);
				return wrapped;
			}
		},
		lifecycle: {
			onDeliveryError: ({ error, plannedTarget, request, approvalKind, pendingContent }) => {
				nativeRuntime.observe?.onDeliveryError?.({
					...baseContext,
					error,
					plannedTarget,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
			},
			onDuplicateSkipped: ({ plannedTarget, preparedTarget, request, approvalKind, pendingContent }) => {
				nativeRuntime.observe?.onDuplicateSkipped?.({
					...baseContext,
					plannedTarget,
					preparedTarget,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
			},
			onDelivered: ({ plannedTarget, preparedTarget, request, approvalKind, pendingContent, entry }) => {
				nativeRuntime.observe?.onDelivered?.({
					...baseContext,
					plannedTarget,
					preparedTarget,
					request,
					approvalKind,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload,
					entry: entry.entry
				});
			},
			finalizeResolved: ({ request, resolved, entries }) => finalize(request, entries, {
				phase: "resolved",
				resolved
			}),
			finalizeExpired: ({ request, entries }) => finalize(request, entries, { phase: "expired" }),
			onStopped: async () => {
				stopped = true;
				for (const activeRequest of activeEntries.values()) await unbindWrappedEntries({
					entries: activeRequest.entries,
					request: activeRequest.request,
					approvalKind: activeRequest.approvalKind,
					baseContext,
					nativeRuntime,
					log
				});
				activeEntries.clear();
			}
		}
	});
}
//#endregion
export { createChannelApprovalHandlerFromCapability as n, createChannelApprovalNativeRuntimeAdapter as r, createChannelApprovalHandler as t };
