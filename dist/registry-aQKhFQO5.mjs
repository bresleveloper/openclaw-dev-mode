import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { i as normalizePluginGatewayMethodScope } from "./descriptor-CsSjfpp-.mjs";
import "./core-method-policy-CcBevufV.mjs";
//#region src/gateway/methods/registry.ts
function normalizeDescriptor(input) {
	const name = input.name.trim();
	if (!name) throw new Error("gateway method descriptor name must not be empty");
	const normalizedScope = input.scope === "node" || input.scope === "dynamic" ? input.scope : input.owner.kind === "plugin" ? normalizePluginGatewayMethodScope(name, input.scope).scope : input.scope;
	if (!normalizedScope) throw new Error(`gateway method descriptor is missing a scope: ${name}`);
	const profileAccess = input.profileAccess ?? (input.sessionAccess || input.owner.kind !== "core" ? "required" : "independent");
	if (input.sessionAccess && (normalizedScope !== "operator.write" || profileAccess === "independent")) throw new Error(`session-scoped gateway methods require operator.write and an authenticated profile: ${name}`);
	return {
		...input,
		name,
		scope: normalizedScope,
		profileAccess,
		...input.startup === "unavailable-until-sidecars" ? { startup: "unavailable-until-sidecars" } : {},
		...input.controlPlaneWrite === true ? { controlPlaneWrite: true } : {},
		...input.lifetime === "observation" ? { lifetime: "observation" } : {},
		...input.advertise === false ? { advertise: false } : {}
	};
}
/** Creates a read-only registry for gateway method lookup, listing, and policy metadata. */
function createGatewayMethodRegistry(inputs, pluginRegistry) {
	const descriptors = inputs.map(normalizeDescriptor);
	const byName = /* @__PURE__ */ new Map();
	for (const descriptor of descriptors) {
		if (byName.has(descriptor.name)) throw new Error(`gateway method already registered: ${descriptor.name}`);
		byName.set(descriptor.name, descriptor);
	}
	return {
		...pluginRegistry ? { pluginRegistry } : {},
		getHandler: (name) => byName.get(name)?.handler,
		listMethods: () => descriptors.map((descriptor) => descriptor.name),
		listAdvertisedMethods: () => descriptors.filter((descriptor) => descriptor.advertise !== false).map((descriptor) => descriptor.name),
		getScope: (name) => byName.get(name)?.scope,
		getSessionAccess: (name) => byName.get(name)?.sessionAccess,
		isStartupUnavailable: (name) => byName.get(name)?.startup === "unavailable-until-sidecars",
		isObservation: (name) => byName.get(name)?.lifetime === "observation",
		isControlPlaneWrite: (name) => byName.get(name)?.controlPlaneWrite === true,
		requiresAuthenticatedProfile: (name) => byName.get(name)?.profileAccess === "required",
		descriptors: () => descriptors
	};
}
/** Converts a plain handler map into scoped descriptors owned by one gateway surface. */
function createGatewayMethodDescriptorsFromHandlers(params) {
	return Object.entries(params.handlers).map(([name, handler]) => {
		const scope = params.scopes?.[name] ?? params.defaultScope;
		if (!scope) throw new Error(`gateway method is missing a scope: ${name}`);
		return {
			name,
			handler,
			owner: params.owner,
			scope
		};
	});
}
/** Resolves plugin method descriptors, including the legacy handler-only registry shape. */
function createPluginGatewayMethodDescriptors(registry) {
	const descriptors = registry.gatewayMethodDescriptors ?? [];
	if (descriptors.length > 0) return [...descriptors];
	return createGatewayMethodDescriptorsFromHandlers({
		handlers: registry.gatewayHandlers,
		owner: {
			kind: "plugin",
			pluginId: "unknown"
		},
		defaultScope: ADMIN_SCOPE
	});
}
//#endregion
export { createGatewayMethodRegistry as n, createPluginGatewayMethodDescriptors as r, createGatewayMethodDescriptorsFromHandlers as t };
