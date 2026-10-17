import { f as resolveEffectiveEnableState, n as createNormalizedPluginsConfig } from "./config-state-DY_WJYue.mjs";
import "./plugin-config-runtime-DKh00pJ1.mjs";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-D9ePJOZb.mjs";
//#region extensions/browser/src/plugin-enabled.ts
/** Retains the policy owner's refusal reason alongside browser enablement. */
function resolveBrowserPluginEnableState(cfg) {
	return resolveEffectiveEnableState({
		id: "browser",
		origin: "bundled",
		config: createNormalizedPluginsConfig(cfg.plugins),
		rootConfig: cfg,
		enabledByDefault: true
	});
}
/** Explain a refused control-service start using existing policy and runtime facts. */
async function describeBrowserControlUnavailable(cfg = loadBrowserConfigForRuntimeRefresh()) {
	const policy = resolveBrowserPluginEnableState(cfg);
	let reason = policy.reason;
	if (policy.enabled) {
		if (cfg.browser?.enabled === false) return "browser control disabled: browser.enabled=false. Set browser.enabled=true.";
		const { getPluginRuntimeGatewayRequestScope } = await import("./plugin-sdk/plugin-runtime.js");
		const record = getPluginRuntimeGatewayRequestScope()?.pluginRegistry?.plugins.find((plugin) => plugin.id === "browser");
		if (record?.status === "error") return `browser control disabled: browser plugin failed${record.failurePhase ? ` during ${record.failurePhase}` : ""}: ${record.error ?? "no error detail recorded"}. Run \`openclaw doctor\` and check the Gateway logs.`;
		reason = record?.status === "disabled" ? record.activationReason ?? record.error : void 0;
	}
	const enable = "Run `openclaw plugins enable browser`.";
	switch (reason) {
		case "not in allowlist": return `browser control disabled: "browser" is not in plugins.allow. Add "browser" to the existing plugins.allow list. ${enable}`;
		case "plugins disabled": return `browser control disabled: plugins.enabled=false. Set plugins.enabled=true. ${enable}`;
		case "blocked by denylist": return `browser control disabled: "browser" is in plugins.deny. Remove "browser" from plugins.deny. ${enable}`;
		case "disabled in config": return `browser control disabled: plugins.entries.browser.enabled=false. ${enable}`;
		default: return `browser control disabled: ${reason ?? "no availability reason was recorded"}. Run \`openclaw doctor\` and check the Gateway logs.`;
	}
}
//#endregion
export { resolveBrowserPluginEnableState as n, describeBrowserControlUnavailable as t };
