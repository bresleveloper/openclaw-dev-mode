import { n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { s as registerUnhandledRejectionHandler } from "./unhandled-rejections-BK2kl1Oc.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { n as getGatewayExtensionRelayModule, t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import { d as markBrowserRuntimeStopping, r as beginProfileTransition } from "./server-context.lifecycle-BEP6ffl9.mjs";
import { n as stopBrowserScreencasts } from "./session-C5w0l3tl.mjs";
//#region extensions/browser/src/browser/server-lifecycle.ts
/** Invalidate every profile before awaiting any cleanup, then drain in parallel. */
async function stopKnownBrowserProfiles(params) {
	const drains = [...params.current.profiles.values()].map((runtime) => beginProfileTransition({
		state: params.current,
		runtime,
		reason: "Browser runtime shutdown",
		closeSharedAdapters: params.closeSharedAdapters
	}));
	const failed = (await Promise.allSettled(drains)).find((result) => result.status === "rejected");
	if (failed?.status === "rejected") {
		params.onWarn(`openclaw browser stop failed: ${String(failed.reason)}`);
		throw failed.reason;
	}
}
//#endregion
//#region extensions/browser/src/browser/unhandled-rejections.ts
const PLAYWRIGHT_DIALOG_METHODS = /* @__PURE__ */ new Set(["Page.handleJavaScriptDialog", "Dialog.handleJavaScriptDialog"]);
const NO_DIALOG_MESSAGE = "no dialog is showing";
function isPlaywrightDialogRaceUnhandledRejection(reason) {
	for (const candidate of collectErrorGraphCandidates(reason, (current) => [
		current.cause,
		current.reason,
		current.original,
		current.error,
		current.data,
		...Array.isArray(current.errors) ? current.errors : []
	])) {
		const error = asOptionalObjectRecord(candidate);
		const message = typeof candidate === "string" ? candidate : readStringField(error, "message") ?? "";
		if (!message.toLowerCase().includes(NO_DIALOG_MESSAGE)) continue;
		const method = readStringField(error, "method");
		if (method && PLAYWRIGHT_DIALOG_METHODS.has(method)) return true;
		for (const playwrightMethod of PLAYWRIGHT_DIALOG_METHODS) if (message.includes(playwrightMethod)) return true;
	}
	return false;
}
function registerBrowserUnhandledRejectionHandler() {
	return registerUnhandledRejectionHandler(isPlaywrightDialogRaceUnhandledRejection);
}
//#endregion
//#region extensions/browser/src/browser/runtime-lifecycle.ts
async function createBrowserRuntimeState(params) {
	const state = {
		server: params.server ?? null,
		port: params.port,
		resolved: params.resolved,
		profiles: /* @__PURE__ */ new Map()
	};
	state.stopUnhandledRejectionHandler = registerBrowserUnhandledRejectionHandler();
	return state;
}
async function stopBrowserRuntimeInternal(params, finalizeGlobalAdapters) {
	const current = params.current;
	if (!current) return;
	markBrowserRuntimeStopping(current);
	let firstError;
	const screencastDrain = finalizeGlobalAdapters ? stopBrowserScreencasts() : Promise.resolve();
	const profileDrain = stopKnownBrowserProfiles({
		current,
		closeSharedAdapters: finalizeGlobalAdapters,
		onWarn: params.onWarn
	});
	for (const result of await Promise.allSettled([screencastDrain, profileDrain])) if (result.status === "rejected") firstError ??= toRuntimeLifecycleError(result.reason, "Browser profile cleanup failed.");
	if (current.extensionRelays?.size) try {
		const { stopExtensionRelays } = await getExtensionRelayModule();
		await stopExtensionRelays(current);
	} catch (err) {
		firstError ??= toRuntimeLifecycleError(err, "Browser relay cleanup failed.");
	}
	if (finalizeGlobalAdapters) try {
		(await getGatewayExtensionRelayModule.peek())?.disposeGatewayExtensionRelay();
	} catch (err) {
		firstError ??= toRuntimeLifecycleError(err, "Gateway browser relay cleanup failed.");
	}
	if (firstError) throw firstError;
	if (params.closeServer && current.server) await new Promise((resolve) => {
		current.server?.close(() => resolve());
	});
	params.clearState();
	current.stopUnhandledRejectionHandler?.();
}
function toRuntimeLifecycleError(value, message) {
	return value instanceof Error ? value : new Error(message, { cause: value });
}
async function stopBrowserRuntime(params) {
	await stopBrowserRuntimeInternal(params, true);
}
/** Internal bridge shutdown leaves process-global adapters owned by the main runtime intact. */
async function stopBrowserBridgeRuntime(params) {
	await stopBrowserRuntimeInternal(params, false);
}
//#endregion
export { stopBrowserBridgeRuntime as n, stopBrowserRuntime as r, createBrowserRuntimeState as t };
