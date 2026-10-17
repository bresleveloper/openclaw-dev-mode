import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/auto-reply/reply/dispatch-from-config.runtime-loaders.ts
const loadRouteReplyRuntime = createLazyPromise(() => import("./route-reply.runtime.js"));
const loadGetReplyFromConfigRuntime = createLazyPromise(() => import("./get-reply-from-config.runtime.js"));
const loadAbortRuntime = createLazyPromise(() => import("./abort.runtime.js"));
const loadFastApproveRuntime = createLazyPromise(() => import("./fast-approve.runtime.js"));
const loadReplyMediaPathsRuntime = createLazyPromise(() => import("./reply-media-paths.runtime.js"));
const loadRuntimePlugins = createLazyPromise(() => import("./runtime-plugins-BO4voomR.mjs"));
const loadPreparedModelRuntime = createLazyPromise(() => import("./prepared-model-runtime-D44W8DOl.mjs"));
//#endregion
export { loadReplyMediaPathsRuntime as a, loadPreparedModelRuntime as i, loadFastApproveRuntime as n, loadRouteReplyRuntime as o, loadGetReplyFromConfigRuntime as r, loadRuntimePlugins as s, loadAbortRuntime as t };
