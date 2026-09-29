import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/auto-reply/reply/dispatch-from-config.runtime-loaders.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
const getReplyFromConfigRuntimeLoader = createLazyImportLoader(() => import("./get-reply-from-config.runtime.js"));
const abortRuntimeLoader = createLazyImportLoader(() => import("./abort.runtime.js"));
const fastApproveRuntimeLoader = createLazyImportLoader(() => import("./fast-approve.runtime.js"));
const replyMediaPathsRuntimeLoader = createLazyImportLoader(() => import("./reply-media-paths.runtime.js"));
const runtimePluginsLoader = createLazyImportLoader(() => import("./runtime-plugins-AcO__uT6.mjs"));
const preparedModelRuntimeLoader = createLazyImportLoader(() => import("./prepared-model-runtime-DcL1zc7k.mjs"));
function loadRouteReplyRuntime() {
	return routeReplyRuntimeLoader.load();
}
function loadGetReplyFromConfigRuntime() {
	return getReplyFromConfigRuntimeLoader.load();
}
function loadAbortRuntime() {
	return abortRuntimeLoader.load();
}
function loadFastApproveRuntime() {
	return fastApproveRuntimeLoader.load();
}
function loadReplyMediaPathsRuntime() {
	return replyMediaPathsRuntimeLoader.load();
}
function loadRuntimePlugins() {
	return runtimePluginsLoader.load();
}
function loadPreparedModelRuntime() {
	return preparedModelRuntimeLoader.load();
}
//#endregion
export { loadReplyMediaPathsRuntime as a, loadPreparedModelRuntime as i, loadFastApproveRuntime as n, loadRouteReplyRuntime as o, loadGetReplyFromConfigRuntime as r, loadRuntimePlugins as s, loadAbortRuntime as t };
