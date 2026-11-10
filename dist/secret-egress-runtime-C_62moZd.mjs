import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region src/plugin-sdk/secret-egress-runtime.ts
const loadModelEgressRuntime = createLazyRuntimeModule(() => import("./model-egress-BoLm1XDB.mjs"));
const loadJobEgressRuntime = createLazyRuntimeModule(() => import("./job-egress-DIpixT0X.mjs"));
/** Private official-plugin runtime for selected setup secrets and host-only egress. */
async function withSetupSecretEgress(options, run) {
	return (await loadJobEgressRuntime()).withSetupSecretEgress(options, run);
}
/** Private official-plugin runtime for a standalone job's protected model credential. */
async function withConfiguredModelEgress(options, run) {
	return (await loadModelEgressRuntime()).withConfiguredModelEgress(options, run);
}
//#endregion
export { withSetupSecretEgress as n, withConfiguredModelEgress as t };
