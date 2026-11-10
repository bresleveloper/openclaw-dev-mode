import { i as normalizePluginGatewayMethodScope } from "./descriptor-D0bRB7KY.mjs";
import "./core-method-policy-BdmwLcmW.mjs";
//#region src/gateway/methods/registry.ts
function normalizeDescriptor(input) {
	const name = input.name.trim();
	if (!name) throw new Error("gateway method descriptor name must not be empty");
	const normalizedScope = input.scope === "node" || input.scope === "dynamic" ? input.scope : input.owner.kind === "plugin" ? normalizePluginGatewayMethodScope(name, input.scope).scope : input.scope;
	if (!normalizedScope) throw new Error(`gateway method descriptor is missing a scope: ${name}`);
	const profileAccess = input.profileAccess ?? (input.sessionAccess || input.owner.kind !== "core" ? "required" : "independent");
	if (input.sessionAccess && (normalizedScope !== "operator.write" || profileAccess === "independent")) throw new Error(`session-scoped gateway methods require operator.write and an authenticated profile: ${name}`);
	if (input.shareKey && (input.sessionAccess || input.controlPlaneWrite || input.lifetime === "observation" || input.shareMaxAgeMs !== void 0 && (!Number.isFinite(input.shareMaxAgeMs) || input.shareMaxAgeMs <= 0))) throw new Error(`gateway response sharing requires a bounded read-only method: ${name}`);
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
		getReadSharing: (name) => {
			const descriptor = byName.get(name);
			return descriptor?.shareKey ? {
				shareKey: descriptor.shareKey,
				shareInvalidationEvents: descriptor.shareInvalidationEvents ?? [],
				shareMaxAgeMs: descriptor.shareMaxAgeMs ?? 1e3
			} : void 0;
		},
		isStartupUnavailable: (name) => byName.get(name)?.startup === "unavailable-until-sidecars",
		isObservation: (name) => byName.get(name)?.lifetime === "observation",
		isControlPlaneWrite: (name) => byName.get(name)?.controlPlaneWrite === true,
		requiresAuthenticatedProfile: (name) => byName.get(name)?.profileAccess === "required",
		descriptors: () => descriptors
	};
}
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
//#endregion
export { createGatewayMethodRegistry as n, createGatewayMethodDescriptorsFromHandlers as t };
