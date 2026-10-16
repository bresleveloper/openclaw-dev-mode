import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as getGatewayContextLifetime, r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { s as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import "./lifecycle-BH2MRg79.mjs";
//#region src/agents/subagents/registry/subagent-session-cleanup.ts
const loadSubagentSessionCleanupRuntime = createLazyRuntimeModule(() => import("./sessions-delete-rAhiiBS-.mjs"));
function isSessionLifecycleChangedGatewayError(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	const details = requestError.details;
	return requestError.gatewayCode === "INVALID_REQUEST" && typeof details === "object" && details !== null && details.reason === "session-changed";
}
async function deleteSubagentSessionForCleanup(params) {
	if (!params.expectedSessionId || !params.expectedLifecycleRevision) return "failed";
	const prepareCurrent = params.prepareCurrent;
	const isCurrent = params.isCurrent;
	const cleanupParams = {
		key: params.childSessionKey,
		deleteTranscript: params.deleteTranscript ?? true,
		emitLifecycleHooks: params.emitLifecycleHooks ?? params.spawnMode === "session",
		expectedSessionId: params.expectedSessionId,
		expectedLifecycleRevision: params.expectedLifecycleRevision
	};
	const assertCurrent = () => {
		if (isCurrent?.() === false) throw new Error("subagent cleanup owner is no longer current");
	};
	const prepareDispatchCurrent = prepareCurrent ? async () => {
		if (!await prepareCurrent()) throw new Error("subagent cleanup owner is no longer current");
	} : void 0;
	try {
		const run = async () => {
			const resolver = params.gatewayBinding?.resolveGatewayContext;
			if (resolver && isCurrent) {
				const owner = getCanonicalGatewayContextResolver(resolver);
				const context = owner?.();
				if (!owner || !context) throw new Error("subagent cleanup Gateway owner is no longer current");
				if (!context.localEmbedded) {
					const lifetime = getGatewayContextLifetime(owner).signal;
					const assertOwner = () => {
						lifetime.throwIfAborted();
						if (owner() !== context) throw new Error("subagent cleanup Gateway owner is no longer current");
						assertCurrent();
					};
					return context.trackExecution(async () => {
						assertOwner();
						await prepareDispatchCurrent?.();
						const { deleteGatewaySession } = await loadSubagentSessionCleanupRuntime();
						assertOwner();
						const result = await deleteGatewaySession({
							params: cleanupParams,
							client: null,
							context,
							assertCurrent: assertOwner
						});
						if (!result.ok) throw new GatewayClientRequestError(result.error);
					});
				}
			}
			return params.callGateway({
				method: "sessions.delete",
				params: cleanupParams,
				timeoutMs: params.timeoutMs ?? 1e4,
				...prepareDispatchCurrent ? { prepareDispatchCurrent } : {},
				...isCurrent ? { assertDispatchCurrent: assertCurrent } : {}
			});
		};
		await (params.gatewayBinding ? withPluginRuntimeGatewayContextResolver(params.gatewayBinding.resolveGatewayContext, run) : run());
		return "deleted";
	} catch (error) {
		if (isSessionLifecycleChangedGatewayError(error)) return "changed";
		params.onError?.(error);
		return "failed";
	}
}
//#endregion
export { loadSubagentSessionCleanupRuntime as n, deleteSubagentSessionForCleanup as t };
