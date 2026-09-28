import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
//#region src/plugin-sdk/command-status-runtime.ts
/**
* Lazy runtime SDK subpath for command status reply generation.
*/
const loadCommandStatusRuntime = createLazyRuntimeModule(() => import("../command-status.runtime-Fg6wzfCs.mjs"));
/** Resolves the direct status reply text for a session without eagerly loading runtime code. */
const resolveDirectStatusReplyForSession = createLazyRuntimeMethodBinder(loadCommandStatusRuntime)((runtime) => runtime.resolveDirectStatusReplyForSessionCore);
//#endregion
export { resolveDirectStatusReplyForSession };
