import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "../session-source-authority-fdILH-PW.mjs";
import { d as testing, l as registerSessionBindingAdapter, n as inspectSessionBindingByConversation, t as getSessionBindingService, u as registerSessionBindingAdapterV2 } from "../session-binding-service-ByKk9LiJ.mjs";
import { r as projectPluginSessionEntry } from "../session-store-runtime-internal-Cv2I3LCC.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "../session-entry-current-check-Df7ye0eB.mjs";
//#region src/plugin-sdk/session-binding-runtime.ts
/** Read current policy in the worker at effects; pass source to worker-backed mutations. */
async function captureSessionEntryCurrentCheckAsync(params) {
	const prepared = await captureSessionEntryCurrentCheckAsyncInternal(params);
	return {
		...prepared,
		entry: prepared.entry ? projectPluginSessionEntry(prepared.entry) : void 0
	};
}
/** Compose prepared sources; opaque source callbacks retain native transaction visibility. */
function composeSessionEntryCommitGuards(sources, checkHostAuthority) {
	return composeSessionSourceAssertion(sources.map(captureExternalSessionCommitGuard), checkHostAuthority);
}
//#endregion
export { testing as __testing, testing, captureSessionEntryCurrentCheckAsync, composeSessionEntryCommitGuards, getSessionBindingService, inspectSessionBindingByConversation, registerSessionBindingAdapter, registerSessionBindingAdapterV2 };
