import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./routing-JKvWkBDR.mjs";
import { a as createNativeApprovalMessagingTargetResolvers, i as createNativeApprovalForwardingFallbackSuppressor, n as createChannelNativeOriginTargetResolver, r as createNativeApprovalChannelRouteGates, t as createChannelApproverDmTargetResolver } from "./approval-native-helpers-D6phb2Ps.mjs";
//#region src/plugin-sdk/approval-delivery-helpers.ts
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
/** Build the canonical approval capability for channels that restrict approvals to configured approvers. */
function buildApproverRestrictedNativeApprovalCapability(params) {
	const pluginSenderAuth = params.isPluginAuthorizedSender ?? params.isExecAuthorizedSender;
	const availabilityState = (enabled) => enabled ? { kind: "enabled" } : { kind: "disabled" };
	const normalizePreferredSurface = (mode) => mode === "channel" ? "origin" : mode === "dm" ? "approver-dm" : "both";
	const hasConfiguredApprovers = ({ cfg, accountId }) => params.hasApprovers({
		cfg,
		accountId
	});
	const isExecInitiatingSurfaceEnabled = ({ cfg, accountId }) => hasConfiguredApprovers({
		cfg,
		accountId
	}) && params.isNativeDeliveryEnabled({
		cfg,
		accountId
	});
	const resolveExecInitiatingSurfaceState = ({ cfg, accountId }) => availabilityState(isExecInitiatingSurfaceEnabled({
		cfg,
		accountId
	}));
	return createChannelApprovalCapability({
		authorizeActorAction: ({ cfg, accountId, senderId, approvalKind }) => {
			return (approvalKind === "plugin" ? pluginSenderAuth({
				cfg,
				accountId,
				senderId
			}) : params.isExecAuthorizedSender({
				cfg,
				accountId,
				senderId
			})) ? { authorized: true } : {
				authorized: false,
				reason: `❌ You are not authorized to approve ${approvalKind} requests on ${params.channelLabel}.`
			};
		},
		getActionAvailabilityState: ({ cfg, accountId }) => availabilityState(hasConfiguredApprovers({
			cfg,
			accountId
		})),
		getExecInitiatingSurfaceState: resolveExecInitiatingSurfaceState,
		describeExecApprovalSetup: params.describeExecApprovalSetup,
		describePluginApprovalSetup: params.describePluginApprovalSetup,
		delivery: {
			hasConfiguredDmRoute: ({ cfg }) => params.listAccountIds(cfg).some((accountId) => {
				if (!hasConfiguredApprovers({
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
/** Build the split approval adapter shape for approver-restricted native channels. */
function createApproverRestrictedNativeApprovalAdapter(params) {
	return splitChannelApprovalCapability(buildApproverRestrictedNativeApprovalCapability(params));
}
/** Assemble a channel approval capability from its auth, delivery, render, and native surfaces. */
function createChannelApprovalCapability(params) {
	const surfaces = {
		delivery: params.delivery,
		nativeRuntime: params.nativeRuntime,
		render: params.render,
		native: params.native
	};
	return {
		authorizeActorAction: params.authorizeActorAction,
		getActionAvailabilityState: params.getActionAvailabilityState,
		getExecInitiatingSurfaceState: params.getExecInitiatingSurfaceState,
		resolveApproveCommandBehavior: params.resolveApproveCommandBehavior,
		describeExecApprovalSetup: params.describeExecApprovalSetup,
		describePluginApprovalSetup: params.describePluginApprovalSetup,
		delivery: surfaces.delivery,
		nativeRuntime: surfaces.nativeRuntime,
		render: surfaces.render,
		native: surfaces.native
	};
}
/** Split the canonical approval capability into the adapter shape older channel loaders consume. */
function splitChannelApprovalCapability(capability) {
	return {
		auth: {
			authorizeActorAction: capability.authorizeActorAction,
			getActionAvailabilityState: capability.getActionAvailabilityState,
			getExecInitiatingSurfaceState: capability.getExecInitiatingSurfaceState,
			resolveApproveCommandBehavior: capability.resolveApproveCommandBehavior
		},
		delivery: capability.delivery,
		nativeRuntime: capability.nativeRuntime,
		render: capability.render,
		native: capability.native,
		describeExecApprovalSetup: capability.describeExecApprovalSetup,
		describePluginApprovalSetup: capability.describePluginApprovalSetup
	};
}
/** Build the canonical approval capability for approver-restricted native delivery channels. */
function createApproverRestrictedNativeApprovalCapability(params) {
	return buildApproverRestrictedNativeApprovalCapability(params);
}
/** Build a forwarding-routed capability and expose its shared route gates to the owning channel. */
function createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes(params) {
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
//#endregion
export { splitChannelApprovalCapability as a, createChannelApprovalCapability as i, createApproverRestrictedNativeApprovalCapability as n, createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes as r, createApproverRestrictedNativeApprovalAdapter as t };
