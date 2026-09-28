import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/codex/src/app-server/binding-connection.ts
var binding_connection_exports = /* @__PURE__ */ __exportAll({
	assertCodexSessionRuntimeOwnership: () => assertCodexSessionRuntimeOwnership,
	codexBindingConnectionSelection: () => codexBindingConnectionSelection,
	requireCodexSupervisionModelSelection: () => requireCodexSupervisionModelSelection,
	resolveCodexBindingAppServerConnection: () => resolveCodexBindingAppServerConnection,
	setCodexCatalogConnectionHomeResolver: () => setCodexCatalogConnectionHomeResolver
});
const catalogHomes = createPluginRuntimeStore({
	key: "codex:catalog-home-resolver",
	errorMessage: "Codex catalog homes are unavailable"
});
const setCodexCatalogConnectionHomeResolver = catalogHomes.setRuntime;
/** Connection selection excludes independently updated thread bookkeeping. */
function codexBindingConnectionSelection(binding) {
	return binding ? [
		binding.threadId,
		binding.cwd.trim(),
		binding.connectionScope,
		binding.pendingSupervisionBranch?.connectionFingerprint ?? binding.appServerRuntimeFingerprint,
		binding.authProfileId,
		binding.preserveNativeModel === true
	] : void 0;
}
/** Prevents a prepared native session from becoming a fresh thread after its binding changes. */
function assertCodexSessionRuntimeOwnership(binding, expected) {
	if (!expected) return;
	const auth = binding?.connectionScope === "supervision" ? "native" : "host";
	const hostModelChanged = expected.auth === "host" && (!expected.modelRef || binding?.model !== expected.modelRef.model || binding?.modelProvider !== expected.modelRef.provider);
	if (binding?.preserveNativeModel !== true || auth !== expected.auth || hostModelChanged) throw new AgentHarnessPreflightError("Codex native session ownership is missing or changed. Reattach the original native session or create a new chat with a concrete model; no replacement thread was started.");
}
/** Requires the native model pair after a supervised pending branch has materialized. */
function requireCodexSupervisionModelSelection(binding) {
	const model = binding.model?.trim();
	const modelProvider = binding.modelProvider?.trim();
	if (binding.connectionScope !== "supervision" || !model || !modelProvider) throw new Error("Codex supervised binding is missing its native model and provider; refusing request selection");
	return {
		model,
		modelProvider
	};
}
/** Registration publishes the resolver; connection policy loads only for an actual request. */
async function resolveCodexBindingAppServerConnection(params) {
	return (await import("./binding-connection.runtime-yoHrABt-.mjs")).resolveCodexBindingAppServerConnection(params, catalogHomes.tryGetRuntime());
}
//#endregion
export { setCodexCatalogConnectionHomeResolver as a, resolveCodexBindingAppServerConnection as i, binding_connection_exports as n, requireCodexSupervisionModelSelection as r, assertCodexSessionRuntimeOwnership as t };
