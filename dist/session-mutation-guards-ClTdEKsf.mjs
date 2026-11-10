import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { n as withSessionPendingInputAuthorityGuard } from "./session-pending-input-authority-CoXHTQsM.mjs";
import { r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { a as hasPreparedGatewayDeviceAuthority, c as readAcceptedGatewayDeviceSourceAuthority, f as retainGatewayDeviceRevocation, l as readGatewayDeviceRevocationGuard, u as readGatewayDeviceSourceAuthority } from "./device-revocation-DpGQRUdo.mjs";
import { r as isGatewayAuthPolicyCurrent } from "./auth-policy-BnNZPB_e.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-CqbvG8L5.mjs";
import { r as isGatewayWorkerApprovalMethod } from "./approval-gateway-runtime-methods-sULF7KOY.mjs";
//#region src/gateway/internal-approval-authority.ts
const internalApprovalGuards = /* @__PURE__ */ new WeakSet();
/** First-party producers retain their live owner; opaque SDK callbacks are never promoted. */
function retainInternalApprovalCommitGuard(guard) {
	internalApprovalGuards.add(guard);
	return guard;
}
function isInternalApprovalCommitGuard(guard) {
	return guard !== void 0 && internalApprovalGuards.has(guard);
}
//#endregion
//#region src/gateway/server-methods/session-mutation-guards.ts
const requestMutationAuthorities = /* @__PURE__ */ new WeakMap();
function bindRequestMutationAuthority(options, authority) {
	requestMutationAuthorities.set(options, authority);
}
function assertRequestTransportCurrent(options) {
	options.signal?.throwIfAborted();
	const acceptedSource = readAcceptedGatewayDeviceSourceAuthority(options.hasCurrentClientAuthority);
	if ((acceptedSource ? !acceptedSource() : options.client?.invalidated) || options.hasCurrentClientAuthority?.() === false) throw new Error("Gateway requester authority changed");
}
function assertRequestAuthorityCurrent(options) {
	assertRequestTransportCurrent(options);
	options.sessionMutationCommitGuard?.();
}
function captureRequestAuthorityAssertion(options, nativeTransport) {
	const source = captureExternalSessionCommitGuard(options.sessionMutationCommitGuard);
	const transportSource = nativeTransport && options.hasCurrentClientAuthority ? captureExternalSessionCommitGuard(() => assertRequestTransportCurrent(options)) : void 0;
	return composeSessionSourceAssertion([transportSource, source], (assertSource) => {
		if (!transportSource) assertRequestTransportCurrent(options);
		assertSource();
	}, {
		hasOpaqueCheck: nativeTransport,
		preparedCheck: (assertSource) => {
			options.signal?.throwIfAborted();
			if (!hasPreparedGatewayDeviceAuthority(options.client, options.hasCurrentClientAuthority)) throw new Error("Gateway requester authority changed");
			assertSource();
		}
	});
}
function captureRequestMutationOptions(options, client = options.client) {
	const { req, signal, hasCurrentClientAuthority, sessionMutationCommitGuard } = options;
	return {
		req,
		client,
		signal,
		hasCurrentClientAuthority,
		sessionMutationCommitGuard
	};
}
/** Opaque SDK guards retain their synchronous commit boundary from v2026.9.4. */
function readGatewayRequestMutationAuthority(options) {
	const retained = requestMutationAuthorities.get(options);
	if (retained) return retained;
	const { req, client, signal, hasCurrentClientAuthority, sessionMutationCommitGuard } = options;
	const captured = {
		req,
		client,
		signal,
		hasCurrentClientAuthority,
		sessionMutationCommitGuard
	};
	const assertLifetimeCurrent = captureRequestAuthorityAssertion(captured, true);
	const compatibility = {
		family: "native-compatibility",
		assertPreparationCurrent: () => assertRequestTransportCurrent(captured),
		assertCurrent: assertLifetimeCurrent,
		assertLifetimeCurrent
	};
	bindRequestMutationAuthority(options, compatibility);
	return compatibility;
}
/** The in-process owner separates preparation and accepted input from opaque commit callbacks. */
function bindInProcessRequestMutationAuthority(options, assertSourceCurrent, assertPreparationCurrent, questionCallerRead) {
	if (isGatewayWorkerApprovalMethod(options.req.method) && isInternalApprovalCommitGuard(options.sessionMutationCommitGuard)) {
		const captured = captureRequestMutationOptions(options);
		const assertWorkerCurrent = () => {
			assertRequestAuthorityCurrent(captured);
		};
		bindRequestMutationAuthority(options, {
			family: "worker",
			assertPreparationCurrent: assertWorkerCurrent,
			assertCurrent: assertWorkerCurrent,
			assertLifetimeCurrent: assertWorkerCurrent,
			assertWorkerCurrent
		});
	}
	if (!assertSourceCurrent && !assertPreparationCurrent && !questionCallerRead) return options;
	const source = readGatewayRequestMutationAuthority(options);
	const captured = captureRequestMutationOptions(options);
	bindRequestMutationAuthority(options, {
		...source,
		questionCallerRead,
		assertPreparationCurrent: () => {
			source.assertPreparationCurrent();
			assertPreparationCurrent?.();
		},
		...assertSourceCurrent ? { assertAdmittedInputCurrent: () => {
			assertRequestAuthorityCurrent({
				...captured,
				sessionMutationCommitGuard: assertSourceCurrent
			});
		} } : {}
	});
	return options;
}
/** WS admission retains owner facts, never an arbitrary generation getter or socket lifetime. */
function bindWebSocketRequestMutationAuthority(options, client, generationReader) {
	const generationState = SharedGatewaySessionGenerationState.fromReader(generationReader);
	const hasCurrentDeviceRevocation = readGatewayDeviceRevocationGuard(options.hasCurrentClientAuthority);
	if (!generationState || !hasCurrentDeviceRevocation || client.internal?.agentRuntimeIdentity || options.sessionMutationCommitGuard) return options;
	const captured = captureRequestMutationOptions(options, client);
	const { signal, hasCurrentClientAuthority } = captured;
	const assertWorkerCurrent = () => {
		assertRemoteControlUiIngressCurrent(client.remoteControlUiIngress);
		signal?.throwIfAborted();
		const acceptedSource = readAcceptedGatewayDeviceSourceAuthority(hasCurrentClientAuthority);
		if (!hasCurrentDeviceRevocation() || client.internal?.agentRuntimeIdentity) throw new Error("Gateway requester authority changed");
		if (acceptedSource) {
			if (!acceptedSource()) throw new Error("Gateway requester authority changed");
			return;
		}
		if (client.invalidated || !isGatewayAuthPolicyCurrent(client.authPolicy, getRuntimeConfigSnapshot())) throw new Error("Gateway requester authority changed");
		const requiredGeneration = client.usesSharedGatewayAuth ? generationState.requiredGeneration : void 0;
		if (requiredGeneration !== void 0 && client.sharedGatewaySessionGeneration !== requiredGeneration) throw new Error("Gateway requester authority changed");
	};
	bindRequestMutationAuthority(options, {
		family: "worker",
		assertPreparationCurrent: assertWorkerCurrent,
		assertLifetimeCurrent: assertWorkerCurrent,
		assertCurrent: () => {
			assertWorkerCurrent();
			assertRequestAuthorityCurrent(captured);
		},
		assertWorkerCurrent
	});
	return options;
}
/** Retain the request authority after the router composes profile selection. */
function bindGatewayRequestHandlerMutationAuthority(request, handler, expectedProfileBinding, sessionScope) {
	const source = readGatewayRequestMutationAuthority(request);
	const retainedProfileBinding = expectedProfileBinding ?? source.expectedProfileBinding;
	const retainedSessionScope = sessionScope ?? source.sessionScope;
	const transport = captureRequestMutationOptions(handler);
	const assertCurrent = composeSessionSourceAssertion([
		source.assertOperatorCurrent,
		source.family === "worker" ? source.assertWorkerCurrent : void 0,
		captureRequestAuthorityAssertion(transport, source.family === "native-compatibility")
	]);
	const authority = {
		assertPreparationCurrent: source.assertPreparationCurrent,
		questionCallerRead: source.questionCallerRead,
		assertCurrent,
		assertLifetimeCurrent: source.assertLifetimeCurrent,
		expectedProfileBinding: retainedProfileBinding,
		sessionScope: retainedSessionScope,
		assertOperatorCurrent: source.assertOperatorCurrent,
		...source.family === "worker" ? {
			family: "worker",
			assertWorkerCurrent: () => {
				source.assertOperatorCurrent?.();
				source.assertWorkerCurrent();
			}
		} : { family: "native-compatibility" }
	};
	if (source.assertAdmittedInputCurrent) {
		const assertAdmittedInputCurrent = source.assertAdmittedInputCurrent;
		const assertTransferredHandlerCurrent = () => {
			source.assertOperatorCurrent?.();
			if (transport.sessionMutationCommitGuard !== request.sessionMutationCommitGuard) assertRequestAuthorityCurrent(transport);
		};
		authority.assertAdmittedInputCurrent = () => {
			assertTransferredHandlerCurrent();
			assertAdmittedInputCurrent();
		};
		const authorization = handler.sessionMutationAuthorization;
		if (authorization) {
			const admitted = authorization.admittedInputAuthority;
			const assertAdmittedSourceCurrent = authorization.assertAdmittedSourceCurrent;
			handler.sessionMutationAuthorization = {
				...authorization,
				...assertAdmittedSourceCurrent ? { assertAdmittedSourceCurrent: () => {
					assertTransferredHandlerCurrent();
					assertAdmittedSourceCurrent();
				} } : {},
				...admitted ? { admittedInputAuthority: withSessionPendingInputAuthorityGuard(admitted, assertTransferredHandlerCurrent) } : {},
				assertAdmittedInputCurrent: () => {
					assertTransferredHandlerCurrent();
					(authorization.assertAdmittedInputCurrent ?? authorization.assertCurrent)();
				}
			};
		}
	}
	bindRequestMutationAuthority(handler, authority);
	return handler;
}
/** Retain the person's ceiling independently of the request's receipt lifetime. */
function captureGatewayRequestOperatorGuard(options) {
	const { client, context } = options;
	const source = readGatewayRequestMutationAuthority(options);
	const actor = resolveGatewayOperatorRoleActor(client);
	const role = client?.connect?.role ?? "operator";
	const scopes = [...client?.connect?.scopes ?? []];
	const profileId = client?.authenticatedUserProfile?.profileId;
	const userId = client?.authenticatedUserId;
	const canonicalProfileId = client?.preparedSessionProfile?.profileId;
	const assertCurrent = () => {
		source.assertOperatorCurrent?.();
		const currentActor = resolveGatewayOperatorRoleActor(client);
		if ((client?.connect?.role ?? "operator") !== role || scopes.some((scope) => !operatorScopeSatisfied(scope, client?.connect?.scopes ?? [])) || client?.authenticatedUserProfile?.profileId !== profileId || client?.authenticatedUserId !== userId || canonicalProfileId !== void 0 && client?.preparedSessionProfile?.profileId !== canonicalProfileId || currentActor?.kind !== actor?.kind || actor?.kind === "operator" && (currentActor?.kind !== "operator" || currentActor.profileId !== actor.profileId)) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed"));
		if (actor?.kind === "operator") {
			const error = authorizeCurrentOperatorRoleScopes(client, (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)());
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		}
	};
	bindRequestMutationAuthority(options, {
		...source,
		assertOperatorCurrent: assertCurrent
	});
	return assertCurrent;
}
/** Accepted Gateway work survives transport loss while its original operator grant stays live. */
function retainGatewayRequestMutationAuthority(options) {
	const assertOperatorCurrent = captureGatewayRequestOperatorGuard(options);
	const authority = readGatewayRequestMutationAuthority(options);
	authority.assertCurrent();
	assertOperatorCurrent();
	const sourceCurrent = authority.family === "worker" ? readGatewayDeviceSourceAuthority(options.hasCurrentClientAuthority) : void 0;
	const releaseDevice = retainGatewayDeviceRevocation(options.hasCurrentClientAuthority);
	let released = false;
	return {
		assertCurrent: () => {
			if (released || sourceCurrent?.() === false) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Gateway requester authority changed"));
			assertOperatorCurrent();
			if (!sourceCurrent) authority.assertCurrent();
		},
		release: () => {
			if (!released) {
				released = true;
				releaseDevice?.();
			}
		}
	};
}
/** Forwarded chat input owns both its target and original request authority. */
function retainForwardedSessionMutationAuthorization(authorization, source) {
	let releaseSource = source?.retain?.();
	if (!releaseSource) return authorization;
	return {
		...authorization,
		release: () => {
			try {
				authorization.release?.();
			} finally {
				releaseSource?.();
				releaseSource = void 0;
			}
		},
		takeRelease: () => {
			const releaseAuthorization = authorization.takeRelease?.() ?? authorization.release;
			const releaseRetainedSource = releaseSource;
			releaseSource = void 0;
			return () => {
				try {
					releaseAuthorization?.();
				} finally {
					releaseRetainedSource?.();
				}
			};
		}
	};
}
/** Keep the host lifetime and operator target policy on the same commit boundary. */
function withSessionMutationCommitGuard(authorization, assertCommitAllowed, assertExpectedProfile, assertAdmittedSourceCurrent) {
	if (!assertCommitAllowed && !assertExpectedProfile) return authorization;
	const assertAdmittedInputCurrent = composeSessionSourceAssertion([assertAdmittedSourceCurrent ?? assertCommitAllowed, authorization?.assertAdmittedInputCurrent ?? authorization?.assertCurrent]);
	const admitted = authorization?.admittedInputAuthority;
	const withCommitGuards = (consume) => {
		assertExpectedProfile?.();
		assertCommitAllowed?.();
		return consume();
	};
	return {
		...authorization,
		assertAdmittedSourceCurrent: composeSessionSourceAssertion([assertAdmittedSourceCurrent ?? assertCommitAllowed, authorization?.assertAdmittedSourceCurrent]),
		...authorization?.prepareWorkerGrant ? { prepareWorkerGrant: async (target) => {
			const prepared = await withCommitGuards(() => authorization.prepareWorkerGrant(target));
			const wrap = (assertSource) => (...args) => withCommitGuards(() => assertSource(...args));
			return {
				...prepared,
				assertCurrent: wrap(prepared.assertCurrent),
				assertLifetimeCurrent: wrap(prepared.assertLifetimeCurrent),
				...prepared.transaction ? { transaction: {
					...prepared.transaction,
					assertCurrent: wrap(prepared.transaction.assertCurrent)
				} } : {}
			};
		} } : {},
		assertAdmittedInputCurrent,
		...admitted ? { admittedInputAuthority: withSessionPendingInputAuthorityGuard(admitted, () => (assertAdmittedSourceCurrent ?? assertCommitAllowed)?.()) } : {},
		...authorization?.withCurrent ? { withCurrent: (consume) => authorization.withCurrent(() => withCommitGuards(consume)) } : {},
		...authorization?.withPreparedCurrent ? { withPreparedCurrent: (facts, consume, assertSourceCurrent) => authorization.withPreparedCurrent(facts, () => withCommitGuards(consume), assertSourceCurrent) } : {},
		assertCurrent: composeSessionSourceAssertion([
			assertExpectedProfile,
			assertCommitAllowed,
			authorization?.assertCurrent
		]),
		assertTargetCurrent: (target) => withCommitGuards(() => authorization?.assertTargetCurrent(target))
	};
}
//#endregion
export { readGatewayRequestMutationAuthority as a, withSessionMutationCommitGuard as c, captureGatewayRequestOperatorGuard as i, isInternalApprovalCommitGuard as l, bindInProcessRequestMutationAuthority as n, retainForwardedSessionMutationAuthorization as o, bindWebSocketRequestMutationAuthority as r, retainGatewayRequestMutationAuthority as s, bindGatewayRequestHandlerMutationAuthority as t, retainInternalApprovalCommitGuard as u };
