import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { h as normalizeApprovalRequest } from "./approval-request-account-binding-CVzeB0WI.mjs";
import "./approval-handler-adapter-runtime-CHOY5_FT.mjs";
import { n as createChannelNativeApprovalRuntimeAsync } from "./approval-native-runtime-CqkZYXOG.mjs";
import { n as buildPendingApprovalView, r as buildResolvedApprovalView, t as buildExpiredApprovalView } from "./approval-view-model-CsFms5sq.mjs";
//#region src/infra/approval-handler-runtime.ts
/** @deprecated Use createChannelApprovalNativeRuntimeAdapterAsync with awaited availability callbacks. Final compatibility day: 2026-12-31. */
function createChannelApprovalNativeRuntimeAdapter(spec) {
	warnPluginSdkDeprecation({
		family: "approval-session-routing",
		method: "createChannelApprovalNativeRuntimeAdapter",
		replacement: "createChannelApprovalNativeRuntimeAdapterAsync"
	});
	return {
		...createChannelApprovalNativeRuntimeAdapterAsync(spec),
		availability: spec.availability
	};
}
/** Adapts a strongly typed channel native approval spec into the erased runtime contract. */
function createChannelApprovalNativeRuntimeAdapterAsync(spec) {
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
/** Creates a channel approval handler with synchronous availability callbacks. */
function createChannelApprovalHandler(adapter) {
	return createChannelApprovalHandlerAsync(adapter);
}
/** Creates the shared approval handler runtime from channel-specific content and transport hooks. */
function createChannelApprovalHandlerAsync(adapter) {
	return createChannelNativeApprovalRuntimeAsync({
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
	const nativeRuntime = params.capability?.nativeRuntimeAsync ?? params.capability?.nativeRuntime;
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
	const pendingContext = ({ pendingContent, ...context }) => ({
		...baseContext,
		...context,
		view: pendingContent.view,
		pendingPayload: pendingContent.payload
	});
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
			const entryContext = {
				...baseContext,
				entry: wrapped.entry,
				phase: outcome.phase
			};
			if (wrapped.binding !== void 0) await nativeRuntime.interactions?.unbindPending?.({
				...baseContext,
				entry: wrapped.entry,
				binding: wrapped.binding,
				request,
				approvalKind
			});
			const result = await buildResult(wrapped.entry);
			switch (result.kind) {
				case "update":
					await nativeRuntime.transport.updateEntry?.({
						...entryContext,
						request,
						approvalKind,
						payload: result.payload
					});
					break;
				case "delete":
					await nativeRuntime.transport.deleteEntry?.(entryContext);
					break;
				case "clear-actions": await nativeRuntime.interactions?.clearPendingActions?.(entryContext);
			}
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
	return createChannelApprovalHandlerAsync({
		runtime: {
			label: params.label,
			clientDisplayName: params.clientDisplayName,
			channel: params.channel,
			channelLabel: params.channelLabel,
			cfg: params.cfg,
			accountId: params.accountId,
			gatewayUrl: params.gatewayUrl,
			eventKinds: nativeRuntime.eventKinds,
			nativeAdapter: params.capability?.nativeAsync ?? params.capability?.native,
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
			prepareTarget: async (target) => await nativeRuntime.transport.prepareTarget(pendingContext(target)),
			deliverTarget: async (target) => {
				const { request, approvalKind, pendingContent } = target;
				const entry = await nativeRuntime.transport.deliverPending(pendingContext(target));
				if (!entry) return null;
				const entryContext = {
					...baseContext,
					entry,
					request,
					approvalKind
				};
				const binding = stopped ? void 0 : await nativeRuntime.interactions?.bindPending?.({
					...entryContext,
					view: pendingContent.view,
					pendingPayload: pendingContent.payload
				});
				if (stopped) {
					if (binding !== void 0 && binding !== null) await nativeRuntime.interactions?.unbindPending?.({
						...entryContext,
						binding
					});
					else await nativeRuntime.interactions?.cancelDelivered?.(entryContext);
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
			onDeliveryError: (target) => {
				nativeRuntime.observe?.onDeliveryError?.(pendingContext(target));
			},
			onDuplicateSkipped: (target) => {
				nativeRuntime.observe?.onDuplicateSkipped?.(pendingContext(target));
			},
			onDelivered: (target) => {
				nativeRuntime.observe?.onDelivered?.({
					...pendingContext(target),
					entry: target.entry.entry
				});
			},
			finalizeResolved: ({ request, resolved, entries }) => finalize(request, entries, {
				phase: "resolved",
				resolved
			}),
			finalizeExpired: ({ request, entries }) => finalize(request, entries, { phase: "expired" }),
			onStopped: async () => {
				stopped = true;
				for (const activeRequest of activeEntries.values()) {
					if (!nativeRuntime.interactions?.unbindPending) continue;
					for (const wrapped of activeRequest.entries) {
						if (wrapped.binding === void 0) continue;
						try {
							await nativeRuntime.interactions.unbindPending({
								...baseContext,
								entry: wrapped.entry,
								binding: wrapped.binding,
								request: activeRequest.request,
								approvalKind: activeRequest.approvalKind
							});
						} catch (error) {
							log.error(`failed to unbind stopped native approval entry approval=${activeRequest.request.id}: ${String(error)}`);
						}
					}
				}
				activeEntries.clear();
			}
		}
	});
}
//#endregion
export { createChannelApprovalNativeRuntimeAdapterAsync as i, createChannelApprovalHandlerFromCapability as n, createChannelApprovalNativeRuntimeAdapter as r, createChannelApprovalHandler as t };
