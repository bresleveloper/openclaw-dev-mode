import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./routing-Dl7FngGa.mjs";
import { f as resolveApprovalRequestSessionDeliveryAsync, m as isPluginApprovalRequest } from "./approval-request-account-binding-CVzeB0WI.mjs";
import { a as createNativeApprovalMessagingTargetResolvers, c as createChannelApproverDmTargetResolver, d as createChannelNativeOriginTargetResolverAsync, i as createNativeApprovalForwardingFallbackSuppressorAsync, l as createChannelApproverDmTargetResolverAsync, n as createNativeApprovalChannelRouteGatesAsync, r as createNativeApprovalForwardingFallbackSuppressor, t as createNativeApprovalChannelRouteGates, u as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-BiNYKNta.mjs";
//#region src/plugin-sdk/approval-delivery-helpers.ts
function createApproverRestrictedAuth(params) {
	const pluginSenderAuth = params.isPluginAuthorizedSender ?? params.isExecAuthorizedSender;
	return {
		authorizeActorAction: ({ cfg, accountId, senderId, approvalKind, request }) => {
			const pluginRequest = approvalKind === "plugin" && request && isPluginApprovalRequest(request) ? request : void 0;
			return (approvalKind === "plugin" ? (!request || pluginRequest !== void 0) && pluginSenderAuth({
				cfg,
				accountId,
				senderId,
				request: pluginRequest
			}) : params.isExecAuthorizedSender({
				cfg,
				accountId,
				senderId
			})) ? { authorized: true } : {
				authorized: false,
				reason: `❌ You are not authorized to approve ${approvalKind} requests on ${params.channelLabel}.`
			};
		},
		...createApproverRestrictedAvailability(params)
	};
}
function createApproverRestrictedAvailability(params) {
	return {
		getActionAvailabilityState: ({ cfg, accountId }) => params.hasApprovers({
			cfg,
			accountId
		}) ? { kind: "enabled" } : { kind: "disabled" },
		describeExecApprovalSetup: params.describeExecApprovalSetup,
		describePluginApprovalSetup: params.describePluginApprovalSetup,
		nativeRuntime: params.nativeRuntime,
		nativeRuntimeAsync: params.nativeRuntimeAsync
	};
}
function createStandardNativeApprovalRouting(channel, params) {
	const targetResolvers = createNativeApprovalMessagingTargetResolvers({
		channel,
		normalizeTo: params.normalizeTo
	});
	const routeGates = createNativeApprovalChannelRouteGates({
		channel,
		defaultForwardingMode: params.defaultForwardingMode,
		isTransportEnabled: params.isTransportEnabled,
		listAccountIds: params.listAccountIds,
		resolveDefaultAccountId: params.resolveDefaultAccountId,
		normalizeForwardTarget: targetResolvers.normalizeForwardTarget,
		resolveTurnSourceTarget: targetResolvers.resolveTurnSourceTarget
	});
	const resolveOriginTargetBase = createChannelNativeOriginTargetResolver({
		channel,
		shouldHandleRequest: routeGates.shouldHandleApprovalRequest,
		resolveTurnSourceTarget: targetResolvers.resolveTurnSourceTarget,
		resolveSessionTarget: targetResolvers.resolveSessionTarget,
		normalizeTarget: targetResolvers.normalizeTarget
	});
	const resolveOriginTarget = (input) => {
		const target = resolveOriginTargetBase(input);
		if (!target || params.isOriginTargetAllowed && !params.isOriginTargetAllowed({
			...input,
			target
		})) return null;
		return target;
	};
	const resolveApproverDmTargets = createChannelApproverDmTargetResolver({
		shouldHandleRequest: routeGates.shouldHandleApprovalRequest,
		resolveApprovers: params.resolveApprovers,
		mapApprover: (approver, input) => {
			const to = params.normalizeTo(approver);
			return to ? {
				to,
				accountId: normalizeOptionalString(input.accountId)
			} : null;
		}
	});
	const shouldSuppressForwardingFallback = createNativeApprovalForwardingFallbackSuppressor({
		channel,
		normalizeForwardTarget: targetResolvers.normalizeForwardTarget,
		resolveAccountId: ({ forwardingTarget, request }) => forwardingTarget.accountId ?? normalizeOptionalString(request.request.turnSourceAccountId),
		resolveForwardingTargetForMatch: ({ forwardingTarget, accountId }) => ({
			...forwardingTarget,
			accountId
		}),
		isSessionRouteEligible: routeGates.isSessionApprovalEligible,
		isExplicitTargetEligible: params.suppressExplicitTargetFallback === false ? void 0 : routeGates.isExplicitTargetEligible,
		resolveOriginTarget,
		resolveApproverDmTargets
	});
	const availabilityState = (enabled) => enabled ? { kind: "enabled" } : { kind: "disabled" };
	return {
		canApprovalPotentiallyRouteToChannel: routeGates.canApprovalPotentiallyRouteToChannel,
		canAnyApprovalPotentiallyRouteToChannel: routeGates.canAnyApprovalPotentiallyRouteToChannel,
		isNativeApprovalHandlerConfigured: routeGates.isNativeApprovalHandlerConfigured,
		shouldHandleApprovalRequest: routeGates.shouldHandleApprovalRequest,
		getActionAvailabilityState: ({ cfg, accountId, approvalKind }) => availabilityState(approvalKind ? routeGates.canApprovalPotentiallyRouteToChannel({
			cfg,
			accountId,
			approvalKind
		}) : routeGates.canAnyApprovalPotentiallyRouteToChannel({
			cfg,
			accountId
		})),
		getExecInitiatingSurfaceState: ({ cfg, accountId }) => availabilityState(routeGates.canApprovalPotentiallyRouteToChannel({
			cfg,
			accountId,
			approvalKind: "exec"
		})),
		delivery: {
			hasConfiguredDmRoute: ({ cfg }) => params.listAccountIds(cfg).some((accountId) => routeGates.canAnyApprovalPotentiallyRouteToChannel({
				cfg,
				accountId,
				nativeSessionOnly: true
			}) && params.resolveApprovers({
				cfg,
				accountId
			}).length > 0),
			shouldSuppressForwardingFallback
		},
		native: {
			describeDeliveryCapabilities: ({ cfg, accountId, approvalKind, request }) => {
				const input = {
					cfg,
					accountId,
					approvalKind,
					request
				};
				const originTarget = resolveOriginTarget(input);
				const approverTargets = resolveApproverDmTargets(input);
				return {
					enabled: Boolean(originTarget) || approverTargets.length > 0,
					preferredSurface: originTarget ? "origin" : "approver-dm",
					supportsOriginSurface: Boolean(originTarget),
					supportsApproverDmSurface: approverTargets.length > 0,
					notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? true
				};
			},
			resolveOriginTarget,
			resolveApproverDmTargets
		}
	};
}
/** @deprecated Use createApproverRestrictedNativeApprovalCapabilityAsync with awaited account eligibility. Final compatibility day: 2026-12-31. */
function createApproverRestrictedNativeApprovalCapability(params) {
	warnPluginSdkDeprecation({
		family: "approval-session-routing",
		method: "createApproverRestrictedNativeApprovalCapability",
		replacement: "createApproverRestrictedNativeApprovalCapabilityAsync"
	});
	const availabilityState = (enabled) => enabled ? { kind: "enabled" } : { kind: "disabled" };
	const normalizePreferredSurface = (mode) => mode === "channel" ? "origin" : mode === "dm" ? "approver-dm" : "both";
	const isExecInitiatingSurfaceEnabled = ({ cfg, accountId }) => params.hasApprovers({
		cfg,
		accountId
	}) && params.isNativeDeliveryEnabled({
		cfg,
		accountId
	});
	return createChannelApprovalCapability({
		...createApproverRestrictedAuth(params),
		getExecInitiatingSurfaceState: ({ cfg, accountId }) => availabilityState(isExecInitiatingSurfaceEnabled({
			cfg,
			accountId
		})),
		describeExecApprovalSetup: params.describeExecApprovalSetup,
		describePluginApprovalSetup: params.describePluginApprovalSetup,
		delivery: {
			hasConfiguredDmRoute: ({ cfg }) => params.listAccountIds(cfg).some((accountId) => {
				if (!params.hasApprovers({
					cfg,
					accountId
				})) return false;
				if (!params.isNativeDeliveryEnabled({
					cfg,
					accountId
				})) return false;
				const target = params.resolveNativeDeliveryMode({
					cfg,
					accountId
				});
				return target === "dm" || target === "both";
			}),
			shouldSuppressForwardingFallback: (input) => {
				if ((normalizeMessageChannel(input.target.channel) ?? input.target.channel) !== params.channel) return false;
				if (params.requireMatchingTurnSourceChannel) {
					if (normalizeMessageChannel(input.request.request.turnSourceChannel) !== params.channel) return false;
				}
				const resolvedAccountId = params.resolveSuppressionAccountId?.(input);
				const accountId = (resolvedAccountId === void 0 ? input.target.accountId?.trim() : resolvedAccountId.trim()) || void 0;
				return params.isNativeDeliveryEnabled({
					cfg: input.cfg,
					accountId
				});
			}
		},
		native: params.resolveOriginTarget || params.resolveApproverDmTargets ? {
			describeDeliveryCapabilities: ({ cfg, accountId }) => ({
				enabled: isExecInitiatingSurfaceEnabled({
					cfg,
					accountId
				}),
				preferredSurface: normalizePreferredSurface(params.resolveNativeDeliveryMode({
					cfg,
					accountId
				})),
				supportsOriginSurface: Boolean(params.resolveOriginTarget),
				supportsApproverDmSurface: Boolean(params.resolveApproverDmTargets),
				notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? false
			}),
			resolveOriginTarget: params.resolveOriginTarget,
			resolveApproverDmTargets: params.resolveApproverDmTargets
		} : void 0,
		nativeRuntime: params.nativeRuntime
	});
}
/** Build approver-restricted native delivery using worker-owned account eligibility. */
function createApproverRestrictedNativeApprovalCapabilityAsync(params) {
	const isEnabled = async (input) => params.hasApprovers(input) && await params.isNativeDeliveryEnabled(input);
	return createChannelApprovalCapability({
		...createApproverRestrictedAvailability(params),
		authorizeActorActionAsync: async ({ cfg, accountId, senderId, approvalKind, request, sessionDelivery }) => {
			const pluginRequest = approvalKind === "plugin" && request && isPluginApprovalRequest(request) ? request : void 0;
			return (approvalKind === "plugin" ? (!request || pluginRequest !== void 0) && await (params.isPluginAuthorizedSender ?? params.isExecAuthorizedSender)({
				cfg,
				accountId,
				senderId,
				request: pluginRequest,
				sessionDelivery
			}) : await params.isExecAuthorizedSender({
				cfg,
				accountId,
				senderId,
				sessionDelivery
			})) ? { authorized: true } : {
				authorized: false,
				reason: `❌ You are not authorized to approve ${approvalKind} requests on ${params.channelLabel}.`
			};
		},
		getExecInitiatingSurfaceStateAsync: async (input) => await isEnabled(input) ? { kind: "enabled" } : { kind: "disabled" },
		delivery: {
			hasConfiguredDmRouteAsync: async ({ cfg }) => {
				for (const accountId of params.listAccountIds(cfg)) {
					if (!await isEnabled({
						cfg,
						accountId
					})) continue;
					const mode = params.resolveNativeDeliveryMode({
						cfg,
						accountId
					});
					if (mode === "dm" || mode === "both") return true;
				}
				return false;
			},
			shouldSuppressForwardingFallbackAsync: async (input) => {
				if ((normalizeMessageChannel(input.target.channel) ?? input.target.channel) !== params.channel || params.requireMatchingTurnSourceChannel && normalizeMessageChannel(input.request.request.turnSourceChannel) !== params.channel) return false;
				const resolvedAccountId = params.resolveSuppressionAccountId?.(input);
				const accountId = (resolvedAccountId === void 0 ? input.target.accountId?.trim() : resolvedAccountId.trim()) || void 0;
				return params.isNativeDeliveryEnabled({
					cfg: input.cfg,
					accountId
				});
			}
		},
		nativeAsync: params.resolveOriginTarget || params.resolveApproverDmTargets ? {
			describeDeliveryCapabilities: async ({ cfg, accountId, approvalKind }) => {
				const enabled = await isEnabled({
					cfg,
					accountId,
					approvalKind
				});
				const mode = params.resolveNativeDeliveryMode({
					cfg,
					accountId
				});
				return {
					enabled,
					preferredSurface: mode === "channel" ? "origin" : mode === "dm" ? "approver-dm" : "both",
					supportsOriginSurface: Boolean(params.resolveOriginTarget),
					supportsApproverDmSurface: Boolean(params.resolveApproverDmTargets),
					notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? false
				};
			},
			resolveOriginTarget: params.resolveOriginTarget,
			resolveApproverDmTargets: params.resolveApproverDmTargets
		} : void 0
	});
}
/** Build the split approval adapter shape for approver-restricted native channels. */
function createApproverRestrictedNativeApprovalAdapter(params) {
	return splitChannelApprovalCapability(createApproverRestrictedNativeApprovalCapability(params));
}
/** Assemble a channel approval capability from its auth, delivery, render, and native surfaces. */
function createChannelApprovalCapability(params) {
	const { delivery, nativeRuntime, render, native } = params;
	return {
		authorizeActorAction: params.authorizeActorAction,
		authorizeActorActionAsync: params.authorizeActorActionAsync,
		getActionAvailabilityState: params.getActionAvailabilityState,
		getActionAvailabilityStateAsync: params.getActionAvailabilityStateAsync,
		getExecInitiatingSurfaceState: params.getExecInitiatingSurfaceState,
		getExecInitiatingSurfaceStateAsync: params.getExecInitiatingSurfaceStateAsync,
		resolveApproveCommandBehavior: params.resolveApproveCommandBehavior,
		describeExecApprovalSetup: params.describeExecApprovalSetup,
		describePluginApprovalSetup: params.describePluginApprovalSetup,
		delivery,
		nativeRuntime,
		nativeRuntimeAsync: params.nativeRuntimeAsync,
		render,
		native,
		nativeAsync: params.nativeAsync
	};
}
/** Split the canonical approval capability into the adapter shape older channel loaders consume. */
function splitChannelApprovalCapability(capability) {
	return {
		auth: {
			authorizeActorAction: capability.authorizeActorAction,
			authorizeActorActionAsync: capability.authorizeActorActionAsync,
			getActionAvailabilityState: capability.getActionAvailabilityState,
			getActionAvailabilityStateAsync: capability.getActionAvailabilityStateAsync,
			getExecInitiatingSurfaceState: capability.getExecInitiatingSurfaceState,
			getExecInitiatingSurfaceStateAsync: capability.getExecInitiatingSurfaceStateAsync,
			resolveApproveCommandBehavior: capability.resolveApproveCommandBehavior
		},
		delivery: capability.delivery,
		nativeRuntime: capability.nativeRuntime,
		nativeRuntimeAsync: capability.nativeRuntimeAsync,
		render: capability.render,
		native: capability.native,
		nativeAsync: capability.nativeAsync,
		describeExecApprovalSetup: capability.describeExecApprovalSetup,
		describePluginApprovalSetup: capability.describePluginApprovalSetup
	};
}
/** @deprecated Use createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync for worker-owned session reads. Final compatibility day: 2026-12-31. */
function createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes(params) {
	warnPluginSdkDeprecation({
		family: "approval-session-routing",
		method: "createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes",
		replacement: "createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync"
	});
	const routing = createStandardNativeApprovalRouting(params.channel, params.routing);
	return {
		capability: createChannelApprovalCapability({
			authorizeActorAction: params.authorizeActorAction,
			getActionAvailabilityState: routing.getActionAvailabilityState,
			getExecInitiatingSurfaceState: routing.getExecInitiatingSurfaceState,
			describeExecApprovalSetup: params.describeExecApprovalSetup,
			describePluginApprovalSetup: params.describePluginApprovalSetup,
			delivery: routing.delivery,
			native: routing.native,
			nativeRuntime: params.createNativeRuntime?.(routing) ?? params.nativeRuntime,
			render: params.render
		}),
		routing
	};
}
function createStandardNativeApprovalRoutingAsync(channel, params) {
	const targetResolvers = createNativeApprovalMessagingTargetResolvers({
		channel,
		normalizeTo: params.normalizeTo
	});
	const routeGates = createNativeApprovalChannelRouteGatesAsync({
		channel,
		defaultForwardingMode: params.defaultForwardingMode,
		isTransportEnabled: params.isTransportEnabled,
		listAccountIds: params.listAccountIds,
		resolveDefaultAccountId: params.resolveDefaultAccountId,
		normalizeForwardTarget: targetResolvers.normalizeForwardTarget,
		resolveTurnSourceTarget: targetResolvers.resolveTurnSourceTarget
	});
	const resolveOriginTargetBase = createChannelNativeOriginTargetResolverAsync({
		channel,
		shouldHandleRequest: routeGates.shouldHandleApprovalRequest,
		resolveTurnSourceTarget: targetResolvers.resolveTurnSourceTarget,
		resolveSessionTarget: targetResolvers.resolveSessionTarget,
		normalizeTarget: targetResolvers.normalizeTarget
	});
	const resolveOriginTarget = async (input) => {
		const target = await resolveOriginTargetBase(input);
		if (!target || params.isOriginTargetAllowed && !params.isOriginTargetAllowed({
			...input,
			target
		})) return null;
		return target;
	};
	const resolveApproverDmTargets = createChannelApproverDmTargetResolverAsync({
		shouldHandleRequest: routeGates.shouldHandleApprovalRequest,
		resolveApprovers: params.resolveApprovers,
		mapApprover: (approver, input) => {
			const to = params.normalizeTo(approver);
			return to ? {
				to,
				accountId: normalizeOptionalString(input.accountId)
			} : null;
		}
	});
	const shouldSuppressForwardingFallback = createNativeApprovalForwardingFallbackSuppressorAsync({
		channel,
		normalizeForwardTarget: targetResolvers.normalizeForwardTarget,
		resolveAccountId: ({ forwardingTarget, request }) => forwardingTarget.accountId ?? normalizeOptionalString(request.request.turnSourceAccountId),
		resolveForwardingTargetForMatch: ({ forwardingTarget, accountId }) => ({
			...forwardingTarget,
			accountId
		}),
		isSessionRouteEligible: routeGates.isSessionApprovalEligible,
		isExplicitTargetEligible: params.suppressExplicitTargetFallback === false ? void 0 : routeGates.isExplicitTargetEligible,
		resolveOriginTarget,
		resolveApproverDmTargets
	});
	const availabilityState = (enabled) => enabled ? { kind: "enabled" } : { kind: "disabled" };
	return {
		canApprovalPotentiallyRouteToChannel: routeGates.canApprovalPotentiallyRouteToChannel,
		canAnyApprovalPotentiallyRouteToChannel: routeGates.canAnyApprovalPotentiallyRouteToChannel,
		isNativeApprovalHandlerConfigured: routeGates.isNativeApprovalHandlerConfigured,
		shouldHandleApprovalRequest: routeGates.shouldHandleApprovalRequest,
		getActionAvailabilityState: ({ cfg, accountId, approvalKind }) => availabilityState(approvalKind ? routeGates.canApprovalPotentiallyRouteToChannel({
			cfg,
			accountId,
			approvalKind
		}) : routeGates.canAnyApprovalPotentiallyRouteToChannel({
			cfg,
			accountId
		})),
		getExecInitiatingSurfaceState: ({ cfg, accountId }) => availabilityState(routeGates.canApprovalPotentiallyRouteToChannel({
			cfg,
			accountId,
			approvalKind: "exec"
		})),
		delivery: {
			hasConfiguredDmRoute: ({ cfg }) => params.listAccountIds(cfg).some((accountId) => routeGates.canAnyApprovalPotentiallyRouteToChannel({
				cfg,
				accountId,
				nativeSessionOnly: true
			}) && params.resolveApprovers({
				cfg,
				accountId
			}).length > 0),
			shouldSuppressForwardingFallbackAsync: shouldSuppressForwardingFallback
		},
		nativeAsync: {
			describeDeliveryCapabilities: async ({ cfg, accountId, approvalKind, request }) => {
				const input = {
					cfg,
					accountId,
					approvalKind,
					request,
					sessionDelivery: await resolveApprovalRequestSessionDeliveryAsync({
						cfg,
						request
					})
				};
				const [originTarget, approverTargets] = await Promise.all([resolveOriginTarget(input), resolveApproverDmTargets(input)]);
				return {
					enabled: Boolean(originTarget) || approverTargets.length > 0,
					preferredSurface: originTarget ? "origin" : "approver-dm",
					supportsOriginSurface: Boolean(originTarget),
					supportsApproverDmSurface: approverTargets.length > 0,
					notifyOriginWhenDmOnly: params.notifyOriginWhenDmOnly ?? true
				};
			},
			resolveOriginTarget,
			resolveApproverDmTargets
		}
	};
}
/** Build forwarding routes with worker-owned session and account resolution. */
function createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync(params) {
	const routing = createStandardNativeApprovalRoutingAsync(params.channel, params.routing);
	return {
		capability: createChannelApprovalCapability({
			authorizeActorAction: params.authorizeActorAction,
			getActionAvailabilityState: routing.getActionAvailabilityState,
			getExecInitiatingSurfaceState: routing.getExecInitiatingSurfaceState,
			describeExecApprovalSetup: params.describeExecApprovalSetup,
			describePluginApprovalSetup: params.describePluginApprovalSetup,
			delivery: routing.delivery,
			nativeAsync: routing.nativeAsync,
			nativeRuntimeAsync: params.createNativeRuntime?.(routing) ?? params.nativeRuntimeAsync,
			render: params.render
		}),
		routing
	};
}
//#endregion
export { createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync as a, createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes as i, createApproverRestrictedNativeApprovalCapability as n, createChannelApprovalCapability as o, createApproverRestrictedNativeApprovalCapabilityAsync as r, splitChannelApprovalCapability as s, createApproverRestrictedNativeApprovalAdapter as t };
