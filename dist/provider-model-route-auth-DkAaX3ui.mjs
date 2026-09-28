//#region src/agents/provider-model-auth-source-plan.ts
/** Drops profile ids, modes, readiness, and cooldown state from a selected source. */
function classifyProviderModelAuthSource(source) {
	return source.kind === "profile" ? { kind: "profile" } : {
		kind: "direct",
		evidence: source.evidence,
		authorization: source.authorization
	};
}
function toProviderModelAuthReadiness(availability) {
	return availability === true ? "ready" : availability === false ? "unavailable" : "unknown";
}
function fromProviderModelAuthReadiness(readiness) {
	return readiness === "ready" ? true : readiness === "unavailable" ? false : void 0;
}
/** Creates a source fact without retaining credential material. */
function buildProviderModelAuthDirectSource(params) {
	return {
		kind: "direct",
		mode: params.mode,
		readiness: toProviderModelAuthReadiness(params.availability),
		evidence: params.evidence,
		authorization: params.authorization
	};
}
function reorderPreferredProfile(profiles, preferredProfileId) {
	if (!preferredProfileId) return [...profiles];
	const preferred = profiles.find((profile) => profile.profileId === preferredProfileId);
	return preferred ? [preferred, ...profiles.filter((profile) => profile.profileId !== preferredProfileId)] : [...profiles];
}
/** Applies source precedence and automatic-tier readiness/cooldown policy once. */
function buildProviderModelAuthSourcePlan(params) {
	if (params.ownership) return {
		kind: "required",
		...params.ownership
	};
	const explicitOrder = params.explicitOrder === true;
	const ordered = reorderPreferredProfile(params.profiles, params.preferredProfileId);
	let profiles;
	if (ordered.length === 0) profiles = {
		kind: "empty",
		explicitOrder
	};
	else {
		const available = ordered.filter((profile) => profile.readiness !== "unavailable");
		if (available.length === 0) {
			const [firstOrdered] = ordered;
			profiles = firstOrdered ? {
				kind: "all-unavailable",
				explicitOrder,
				first: firstOrdered
			} : {
				kind: "empty",
				explicitOrder
			};
		} else {
			const outsideCooldown = available.filter((profile) => profile.cooldown === "clear");
			if (outsideCooldown.length > 0) profiles = {
				kind: "usable",
				explicitOrder,
				profiles: outsideCooldown
			};
			else if (params.allowCooldown) profiles = {
				kind: "usable",
				explicitOrder,
				profiles: available.slice(0, 1)
			};
			else {
				const [firstAvailable] = available;
				profiles = firstAvailable ? {
					kind: "all-cooldown",
					explicitOrder,
					first: firstAvailable
				} : {
					kind: "empty",
					explicitOrder
				};
			}
		}
	}
	return {
		kind: "automatic",
		profiles,
		orderedProfiles: ordered,
		...params.preserveProfilePriority ? { preserveProfilePriority: true } : {},
		allowCooldown: params.allowCooldown === true,
		declaredProfileCount: params.declaredProfileCount ?? ordered.length,
		...params.fallback ? { fallback: params.fallback } : {}
	};
}
//#endregion
//#region src/agents/provider-model-route-auth.ts
/** Normalizes stored/runtime auth syntax for profile-scoped model lookup. */
function resolveProviderModelMaterializationAuthMode(mode) {
	switch (mode) {
		case "api-key":
		case "api_key": return "api_key";
		case "aws-sdk":
		case "oauth":
		case "token": return mode;
		default: return;
	}
}
/** Maps runtime/stored credential modes onto the provider route contract. */
function resolveProviderModelRouteAuthRequirement(mode) {
	switch (mode) {
		case "api-key":
		case "api_key":
		case "aws-sdk": return "api-key";
		case "oauth":
		case "token": return "subscription";
		default: return;
	}
}
function providerModelRouteAcceptsAuthMode(params) {
	return resolveProviderModelRouteAuthRequirement(params.mode) === params.requirement;
}
/** Preserves an exact credential mode while normalizing authored api-key syntax. */
function resolveProviderModelRouteMaterializationAuthMode(params) {
	return resolveProviderModelMaterializationAuthMode(params.mode) ?? (params.requirement === "api-key" ? "api_key" : "oauth");
}
function directAttempt(source) {
	return {
		kind: "direct",
		source,
		allowAuthProfileFallback: false
	};
}
function selectReadyProfile(profiles) {
	const first = profiles[0];
	if (!first || first.readiness !== "unknown") return first;
	return profiles.find((profile) => profile.readiness === "ready") ?? first;
}
/** Selects logical auth sources without resolving a provider-owned route. */
function selectProviderModelAuthSources(params) {
	if (params.plan.kind === "required") {
		const source = params.plan.source;
		return {
			kind: "selected",
			selection: {
				kind: "selected",
				source
			},
			attempts: [source.kind === "profile" ? {
				kind: "profile",
				source
			} : directAttempt(source)]
		};
	}
	const { fallback, profiles } = params.plan;
	if (profiles.kind === "all-cooldown") return {
		kind: "rejected",
		reason: "all-cooldown",
		message: `Auth profile "${profiles.first.profileId}" is temporarily unavailable for ${params.provider}.`,
		source: profiles.first
	};
	if (profiles.explicitOrder && (profiles.kind === "empty" || profiles.kind === "all-unavailable")) return {
		kind: "rejected",
		reason: "explicit-order",
		message: `Explicit auth order for ${params.provider} has no usable profiles.`,
		...profiles.kind === "all-unavailable" ? { source: profiles.first } : {}
	};
	const authorizedFallback = fallback?.authorization === "ambient" && params.plan.declaredProfileCount > 0 ? void 0 : fallback;
	if (profiles.kind === "usable") {
		const winner = selectReadyProfile(profiles.profiles);
		return {
			kind: "selected",
			selection: winner ? {
				kind: "selected",
				source: winner
			} : { kind: "none" },
			attempts: [...profiles.profiles.map((source) => ({
				kind: "profile",
				source
			})), ...authorizedFallback ? [directAttempt(authorizedFallback)] : []]
		};
	}
	if (authorizedFallback) return {
		kind: "selected",
		selection: {
			kind: "selected",
			source: authorizedFallback
		},
		attempts: [directAttempt(authorizedFallback)]
	};
	return {
		kind: "selected",
		selection: profiles.kind === "all-unavailable" ? {
			kind: "unavailable",
			source: profiles.first
		} : { kind: "none" },
		attempts: []
	};
}
function reject(reason, message, source, route) {
	return {
		kind: "rejected",
		reason,
		message,
		...source ? { source } : {},
		...route ? { route } : {}
	};
}
function routeForMode(resolution, mode) {
	const requirement = resolveProviderModelRouteAuthRequirement(mode);
	return requirement ? resolution.routes.find((candidate) => candidate.authRequirement === requirement) : void 0;
}
function resolveDeferredRouteSupport(resolution) {
	const seenRuntimeIds = /* @__PURE__ */ new Set();
	const compatibleIds = (resolution.routes[0].runtimePolicy?.compatibleIds ?? []).flatMap((id) => {
		const normalizedId = id.trim().toLowerCase();
		if (!normalizedId || seenRuntimeIds.has(normalizedId) || !resolution.routes.every((route) => route.runtimePolicy?.compatibleIds.some((candidateId) => candidateId.trim().toLowerCase() === normalizedId))) return [];
		seenRuntimeIds.add(normalizedId);
		return [normalizedId];
	});
	return {
		requestTransportOverrides: resolution.routes.some((route) => route.requestTransportOverrides === "present") ? "present" : "none",
		runtimePolicy: { compatibleIds }
	};
}
/** Selects one route and emits source-distinct, exact-route physical attempts. */
function selectProviderModelRouteAuth(params) {
	const requiredProfile = params.sourcePlan.kind === "required" && params.sourcePlan.source.kind === "profile" ? params.sourcePlan.source : void 0;
	const configuredMode = params.sourcePlan.kind === "required" ? params.sourcePlan.source.kind === "direct" ? params.sourcePlan.source.mode : void 0 : params.configuredAuthMode;
	const configuredRoute = routeForMode(params.resolution, configuredMode);
	if (configuredMode && resolveProviderModelRouteAuthRequirement(configuredMode) && !configuredRoute) return reject("configured-auth", `Configured ${params.provider} authentication is not compatible with the selected model route.`);
	const configuredRequirement = configuredRoute?.authRequirement ?? (params.resolution.routes.length === 1 ? params.resolution.routes[0]?.authRequirement : void 0);
	const effectiveSourcePlan = params.sourcePlan.kind === "automatic" && configuredRequirement ? buildProviderModelAuthSourcePlan({
		profiles: params.sourcePlan.orderedProfiles.filter((profile) => resolveProviderModelRouteAuthRequirement(profile.mode) === configuredRequirement),
		explicitOrder: params.sourcePlan.profiles.explicitOrder,
		preserveProfilePriority: params.sourcePlan.preserveProfilePriority,
		allowCooldown: params.sourcePlan.allowCooldown,
		declaredProfileCount: params.sourcePlan.declaredProfileCount,
		...params.sourcePlan.fallback ? { fallback: params.sourcePlan.fallback } : {}
	}) : params.sourcePlan;
	const sourceDecision = selectProviderModelAuthSources({
		provider: params.provider,
		plan: effectiveSourcePlan
	});
	if (sourceDecision.kind === "rejected") return reject(sourceDecision.reason, sourceDecision.message, sourceDecision.source, configuredRoute);
	const logicalProfiles = sourceDecision.attempts.flatMap((attempt) => attempt.kind === "profile" ? [attempt.source] : []);
	let routeProfileAttempts = logicalProfiles.flatMap((source) => {
		const route = routeForMode(params.resolution, source.mode);
		if (!route || configuredRequirement && route.authRequirement !== configuredRequirement) return [];
		return [{
			source,
			route
		}];
	});
	const preference = params.resolution.preferredAuthRequirement;
	if (preference && !configuredRequirement && effectiveSourcePlan.kind === "automatic" && !effectiveSourcePlan.profiles.explicitOrder && !effectiveSourcePlan.preserveProfilePriority && routeProfileAttempts.some(({ source, route }) => route.authRequirement === preference && source.cooldown === "clear") && routeProfileAttempts.some(({ source, route }) => route.authRequirement !== preference && source.cooldown === "clear")) routeProfileAttempts = [...routeProfileAttempts.filter(({ route }) => route.authRequirement === preference), ...routeProfileAttempts.filter(({ route }) => route.authRequirement !== preference)];
	if (requiredProfile && routeProfileAttempts.length === 0) {
		const accepted = params.resolution.routes.map((candidate) => candidate.authRequirement).filter((value, index, values) => values.indexOf(value) === index).join(" or ");
		return reject("required-profile", `Auth profile "${requiredProfile.profileId}" is not compatible with ${params.provider}; the selected model route requires ${accepted} authentication.`, requiredProfile);
	}
	if (effectiveSourcePlan.kind === "automatic" && effectiveSourcePlan.profiles.explicitOrder && logicalProfiles.length > 0 && routeProfileAttempts.length === 0) return reject("explicit-order", `Explicit auth order has no route-compatible profiles for ${params.provider}.`);
	const winner = routeProfileAttempts[0];
	const directSource = sourceDecision.attempts.find((attempt) => attempt.kind === "direct")?.source;
	const directSourceRoute = directSource ? routeForMode(params.resolution, directSource.mode) : void 0;
	const directRoute = directSourceRoute && (!configuredRequirement || directSourceRoute.authRequirement === configuredRequirement) ? directSourceRoute : void 0;
	if (directSource && directSource.mode && !directRoute && !winner) return reject("configured-auth", `Configured ${params.provider} authentication is not compatible with the selected model route.`);
	let rejectedProfile;
	if (sourceDecision.selection.kind === "unavailable") rejectedProfile = sourceDecision.selection.source;
	else if (sourceDecision.selection.kind === "selected" && sourceDecision.selection.source.kind === "profile") rejectedProfile = sourceDecision.selection.source;
	else if (effectiveSourcePlan !== params.sourcePlan && params.sourcePlan.kind === "automatic") rejectedProfile = params.sourcePlan.orderedProfiles[0];
	if (!Boolean(winner || directSource && directRoute)) {
		const routeSupport = resolveDeferredRouteSupport(params.resolution);
		const normalizedRuntimeAuthOwner = params.runtimeAuthOwner?.id.trim().toLowerCase();
		const runtimeAuthOwnerIsCompatible = Boolean(normalizedRuntimeAuthOwner) && routeSupport.runtimePolicy.compatibleIds.includes(normalizedRuntimeAuthOwner ?? "");
		const hostHasNoCredentialToHonor = params.allowNativeAuthOnSingleRoute === true && params.sourcePlan.kind === "automatic" && params.sourcePlan.orderedProfiles.length === 0 && params.sourcePlan.fallback === void 0;
		if (runtimeAuthOwnerIsCompatible && !configuredRoute && (params.resolution.routes.length > 1 || hostHasNoCredentialToHonor)) return {
			kind: "deferred",
			reason: "runtime-auth-owner",
			routeSupport
		};
		return reject("configured-auth", configuredRoute ? `Configured ${params.provider} authentication has no compatible credential source for the selected model route.` : `No route-compatible authentication source is configured for ${params.provider}.`, rejectedProfile, configuredRoute);
	}
	const selectedRoute = winner?.route ?? directRoute;
	if (!selectedRoute) return reject("configured-auth", `No route-compatible authentication source is configured for ${params.provider}.`);
	const sameRouteAttempts = winner ? routeProfileAttempts.filter((attempt) => attempt.route.authRequirement === winner.route.authRequirement) : [];
	const crossRouteAttempts = winner ? routeProfileAttempts.filter((attempt) => attempt.route.authRequirement !== winner.route.authRequirement) : routeProfileAttempts;
	const orderedProfileAttempts = [...sameRouteAttempts, ...crossRouteAttempts];
	const attempts = orderedProfileAttempts.map((attempt, index) => ({
		kind: "profile",
		source: attempt.source,
		route: attempt.route,
		sameRouteProfileIds: orderedProfileAttempts.slice(index).filter((candidate) => candidate.route.authRequirement === attempt.route.authRequirement).map((candidate) => candidate.source.profileId)
	}));
	if (directSource && directRoute) attempts.push({
		kind: "direct",
		source: directSource,
		route: directRoute,
		allowAuthProfileFallback: false
	});
	return {
		kind: "selected",
		selection: {
			...winner ? {
				kind: "selected",
				source: winner.source
			} : directSource ? {
				kind: "selected",
				source: directSource
			} : sourceDecision.selection.kind === "unavailable" ? sourceDecision.selection : { kind: "none" },
			route: selectedRoute
		},
		attempts
	};
}
//#endregion
export { selectProviderModelAuthSources as a, buildProviderModelAuthSourcePlan as c, toProviderModelAuthReadiness as d, resolveProviderModelRouteMaterializationAuthMode as i, classifyProviderModelAuthSource as l, resolveProviderModelMaterializationAuthMode as n, selectProviderModelRouteAuth as o, resolveProviderModelRouteAuthRequirement as r, buildProviderModelAuthDirectSource as s, providerModelRouteAcceptsAuthMode as t, fromProviderModelAuthReadiness as u };
