import { a as runWithPluginExecutionFrame, i as pluginInstanceInvocation, r as getPluginExecutionFrame } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BTyPTOtk.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
//#region src/plugins/runtime/gateway-request-scope.ts
function runWithPluginGatewayScope(gatewayScope, run, invocation = pluginInstanceInvocation.getStore()) {
	const current = getPluginExecutionFrame();
	const runtime = getPluginRuntimeExecutionFrame(current);
	return runWithPluginExecutionFrame(runtime?.gatewayScope === gatewayScope && runtime.invocation === invocation ? runtime : new PluginRuntimeExecutionFrame(current ?? {}, gatewayScope, runtime?.generationRegistry, invocation), run);
}
const isNotWebchatConnect = () => false;
/** Carry only closure-bound node authorities into a nested request scope. */
function getPluginRuntimeGatewayNodeAuthorities() {
	const scope = getPluginRuntimeGatewayRequestScope();
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
	const current = options?.inheritRequestScope === false ? void 0 : getPluginRuntimeGatewayRequestScope();
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
	return runWithPluginGatewayScope(createRegistryScope(registry, getPluginRuntimeGatewayRequestScope(), declaredProviderOwners), run);
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
	const current = getPluginRuntimeGatewayRequestScope();
	const scoped = registry ? createRegistryScope(registry, current) : current ? { ...current } : { isWebchatConnect: isNotWebchatConnect };
	applyPluginScope(scoped, scope);
	return runWithPluginGatewayScope(scoped, run, invocation);
}
/** Drops only generation selection; authenticated Gateway caller and authority stay attached. */
function runOutsidePluginRuntimeRegistryScope(run) {
	const current = getPluginRuntimeGatewayRequestScope();
	if (!current) return run();
	return runWithPluginGatewayScope({
		...current,
		pluginRegistry: void 0,
		declaredProviderOwners: void 0
	}, run);
}
function getPluginRuntimeGatewayRequestScope() {
	return getPluginRuntimeExecutionFrame()?.gatewayScope;
}
/** Reads registration/request/active registry precedence without initializing a cold runtime. */
function getPluginRegistryForContext() {
	const state = getPluginRegistryState();
	return state?.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? state?.activeRegistry ?? null;
}
/** Live request context for trusted built-in tools that need direct runtime state. */
function getInProcessGatewayRequestContext(resolveGatewayContext) {
	if (resolveGatewayContext) return resolveGatewayContext();
	const scope = getPluginRuntimeGatewayRequestScope();
	return scope?.resolveGatewayContext ? scope.resolveGatewayContext() : scope?.context;
}
//#endregion
export { getPluginRuntimeGatewayRequestScope as a, withPluginRuntimeGatewayRequestScope as c, getPluginRuntimeGatewayNodeAuthorities as i, withPluginRuntimePluginScope as l, getInProcessGatewayRequestContext as n, runOutsidePluginRuntimeRegistryScope as o, getPluginRegistryForContext as r, withPluginRuntimeGatewayContextResolver as s, createRegistryScope as t, withPluginRuntimeRegistryScope as u };
