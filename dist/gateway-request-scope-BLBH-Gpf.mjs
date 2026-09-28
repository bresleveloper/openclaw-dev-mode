import { a as runWithPluginExecutionFrame, i as pluginInstanceInvocation, r as getPluginExecutionFrame } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BFVLVBaA.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
//#region src/plugins/runtime/gateway-request-scope.ts
function getPluginGatewayScope() {
	return getPluginRuntimeExecutionFrame()?.gatewayScope;
}
function runWithPluginGatewayScope(gatewayScope, run, invocation = pluginInstanceInvocation.getStore()) {
	const current = getPluginExecutionFrame();
	const runtime = getPluginRuntimeExecutionFrame(current);
	return runWithPluginExecutionFrame(runtime?.gatewayScope === gatewayScope && runtime.invocation === invocation ? runtime : new PluginRuntimeExecutionFrame({
		...current,
		invocation
	}, gatewayScope, runtime?.generationRegistry), run);
}
const isNotWebchatConnect = () => false;
/** Carry only closure-bound node authorities into a nested request scope. */
function getPluginRuntimeGatewayNodeAuthorities() {
	const scope = getPluginGatewayScope();
	return {
		invokeWithSessionNodeAuthority: scope?.invokeWithSessionNodeAuthority,
		nodePlacementGrantAuthority: scope?.nodePlacementGrantAuthority
	};
}
/**
* Runs plugin gateway handlers with request-scoped context that runtime helpers can read.
*/
function withPluginRuntimeGatewayRequestScope(scope, run) {
	return runWithPluginGatewayScope(scope, run);
}
/** Runs detached work with its captured Gateway binding, including an explicitly unbound owner. */
function withPluginRuntimeGatewayContextResolver(resolveGatewayContext, run, options) {
	const current = options?.inheritRequestScope === false ? void 0 : getPluginGatewayScope();
	const scoped = {
		...current,
		isWebchatConnect: current?.isWebchatConnect ?? isNotWebchatConnect,
		resolveGatewayContext
	};
	delete scoped.context;
	return runWithPluginGatewayScope(scoped, run);
}
/** Runs work against an owned registry handle while preserving any gateway request facts. */
function withPluginRuntimeRegistryScope(registry, run, declaredProviderOwners) {
	if (!registry) return run();
	return runWithPluginGatewayScope(createRegistryScope(registry, getPluginGatewayScope(), declaredProviderOwners), run);
}
function createRegistryScope(registry, current, declaredProviderOwners) {
	return {
		isWebchatConnect: isNotWebchatConnect,
		...current,
		pluginRegistry: registry,
		declaredProviderOwners: declaredProviderOwners ?? (current?.pluginRegistry === registry ? current.declaredProviderOwners : void 0) ?? getPluginRuntimeLoadContextState(registry)?.declaredProviderOwners
	};
}
function applyPluginScope(scoped, scope) {
	scoped.pluginId = scope.pluginId;
	if (scope.pluginSource !== void 0) scoped.pluginSource = scope.pluginSource;
	else delete scoped.pluginSource;
	if (scope.pluginOrigin !== void 0) scoped.pluginOrigin = scope.pluginOrigin;
	else delete scoped.pluginOrigin;
	if (scope.pluginTrustedOfficialInstall !== void 0) scoped.pluginTrustedOfficialInstall = scope.pluginTrustedOfficialInstall;
	else delete scoped.pluginTrustedOfficialInstall;
}
/**
* Runs work under the current gateway request scope while attaching plugin identity.
*/
function withPluginRuntimePluginScope(scope, run, registry, invocation) {
	const current = getPluginGatewayScope();
	const scoped = registry ? createRegistryScope(registry, current) : current ? { ...current } : { isWebchatConnect: isNotWebchatConnect };
	applyPluginScope(scoped, scope);
	return runWithPluginGatewayScope(scoped, run, invocation);
}
/** Drops only generation selection; authenticated Gateway caller and authority stay attached. */
function runOutsidePluginRuntimeRegistryScope(run) {
	const current = getPluginGatewayScope();
	if (!current) return run();
	return runWithPluginGatewayScope({
		...current,
		pluginRegistry: void 0,
		declaredProviderOwners: void 0
	}, run);
}
/**
* Returns the current plugin gateway request scope when called from a plugin request handler.
*/
function getPluginRuntimeGatewayRequestScope() {
	return getPluginGatewayScope();
}
/** Reads registration/request/active registry precedence without initializing a cold runtime. */
function getPluginRegistryForContext() {
	const state = getPluginRegistryState();
	return state?.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? state?.activeRegistry ?? null;
}
//#endregion
export { runOutsidePluginRuntimeRegistryScope as a, withPluginRuntimePluginScope as c, getPluginRuntimeGatewayRequestScope as i, withPluginRuntimeRegistryScope as l, getPluginRegistryForContext as n, withPluginRuntimeGatewayContextResolver as o, getPluginRuntimeGatewayNodeAuthorities as r, withPluginRuntimeGatewayRequestScope as s, createRegistryScope as t };
