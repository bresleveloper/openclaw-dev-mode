import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region src/infra/approval-handler-adapter-runtime.ts
/** Runtime-context capability key used by channels to register native approval resources. */
const CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY = "approval.native";
/** Creates an approval runtime adapter that loads heavy channel code only when delivery hooks run. */
function createLazyChannelApprovalNativeRuntimeAdapter(params) {
	const loadRuntime = createLazyRuntimeModule(params.load);
	let loadedRuntime = null;
	const loadResolvedRuntime = async () => {
		const runtime = await loadRuntime();
		loadedRuntime = runtime;
		return runtime;
	};
	const loadHook = async (select) => select(await loadResolvedRuntime());
	return {
		...params.eventKinds ? { eventKinds: params.eventKinds } : {},
		...params.resolveApprovalKind ? { resolveApprovalKind: params.resolveApprovalKind } : {},
		availability: {
			isConfigured: params.isConfigured,
			shouldHandle: params.shouldHandle
		},
		presentation: {
			buildPendingPayload: async (runtimeParams) => (await loadHook((runtime) => runtime.presentation.buildPendingPayload))(runtimeParams),
			buildResolvedResult: async (runtimeParams) => (await loadHook((runtime) => runtime.presentation.buildResolvedResult))(runtimeParams),
			buildExpiredResult: async (runtimeParams) => (await loadHook((runtime) => runtime.presentation.buildExpiredResult))(runtimeParams)
		},
		transport: {
			prepareTarget: async (runtimeParams) => (await loadHook((runtime) => runtime.transport.prepareTarget))(runtimeParams),
			deliverPending: async (runtimeParams) => (await loadHook((runtime) => runtime.transport.deliverPending))(runtimeParams),
			updateEntry: async (runtimeParams) => await (await loadHook((runtime) => runtime.transport.updateEntry))?.(runtimeParams),
			deleteEntry: async (runtimeParams) => await (await loadHook((runtime) => runtime.transport.deleteEntry))?.(runtimeParams)
		},
		interactions: {
			bindPending: async (runtimeParams) => (await loadHook((runtime) => runtime.interactions?.bindPending))?.(runtimeParams) ?? null,
			unbindPending: async (runtimeParams) => await (await loadHook((runtime) => runtime.interactions?.unbindPending))?.(runtimeParams),
			clearPendingActions: async (runtimeParams) => await (await loadHook((runtime) => runtime.interactions?.clearPendingActions))?.(runtimeParams),
			cancelDelivered: async (runtimeParams) => await (await loadHook((runtime) => runtime.interactions?.cancelDelivered))?.(runtimeParams)
		},
		observe: {
			onDeliveryError: (runtimeParams) => loadedRuntime?.observe?.onDeliveryError?.(runtimeParams),
			onDuplicateSkipped: (runtimeParams) => loadedRuntime?.observe?.onDuplicateSkipped?.(runtimeParams),
			onDelivered: (runtimeParams) => loadedRuntime?.observe?.onDelivered?.(runtimeParams),
			onFinalized: (runtimeParams) => loadedRuntime?.observe?.onFinalized?.(runtimeParams)
		}
	};
}
//#endregion
export { createLazyChannelApprovalNativeRuntimeAdapter as n, CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY as t };
