import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as dispatchGatewayMethodInProcessRaw } from "./server-plugin-in-process-dispatch-BpUBEeez.mjs";
import "./server-plugins-DWfDsK6m.mjs";
//#region src/plugin-sdk/gateway-method-runtime.ts
/**
* Dispatch a Gateway control-plane method from an authenticated plugin request scope.
*/
async function dispatchGatewayMethod(method, params, options) {
	const scope = getPluginRuntimeGatewayRequestScope();
	if (scope?.gatewayMethodDispatchAllowed !== true) {
		const pluginLabel = scope?.pluginId ? ` for plugin "${scope.pluginId}"` : "";
		throw new Error(`Gateway method dispatch is reserved for authenticated plugin HTTP routes or RPC handlers that declare contracts.gatewayMethodDispatch: ["authenticated-request"]${pluginLabel}.`);
	}
	return await dispatchGatewayMethodInProcessRaw(method, params, {
		disableSyntheticClient: true,
		requireScopedClient: true,
		...scope.signal ? { signal: scope.signal } : {},
		...scope.hasCurrentClientAuthority ? { hasCurrentClientAuthority: scope.hasCurrentClientAuthority } : {},
		...options?.expectFinal !== void 0 ? { expectFinal: options.expectFinal } : {},
		...options?.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
	});
}
//#endregion
export { dispatchGatewayMethod as t };
