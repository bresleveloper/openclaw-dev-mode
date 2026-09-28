import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { o as readGatewayDeviceRevocationGuard } from "./device-revocation-BMta3qGW.mjs";
import { t as isGatewayAuthPolicyCurrent } from "./auth-policy-C2a9TtAr.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-aNODWb-9.mjs";
//#region src/gateway/server-methods/session-mutation-guards.ts
const requestMutationAuthorityKey = Symbol("gatewayRequestMutationAuthority");
var RequestMutationAuthorityBinding = class {
	#owner;
	#authority;
	constructor(owner, authority) {
		this.#owner = owner;
		this.#authority = authority;
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, owner) {
		return typeof value === "object" && value !== null && #owner in value && value.#owner === owner ? value.#authority : void 0;
	}
};
function bindRequestMutationAuthority(options, authority) {
	Object.defineProperty(options, requestMutationAuthorityKey, {
		value: new RequestMutationAuthorityBinding(options, authority),
		configurable: true
	});
}
function assertRequestAuthorityCurrent(options) {
	options.signal?.throwIfAborted();
	if (options.client?.invalidated || options.hasCurrentClientAuthority?.() === false) throw new Error("Gateway requester authority changed");
	options.sessionMutationCommitGuard?.();
}
/** Opaque SDK guards retain their synchronous commit boundary from v2026.9.4. */
function readGatewayRequestMutationAuthority(options) {
	const binding = Object.getOwnPropertyDescriptor(options, requestMutationAuthorityKey)?.value;
	const retained = RequestMutationAuthorityBinding.read(binding, options);
	if (retained) return retained;
	const { req, client, signal, hasCurrentClientAuthority, sessionMutationCommitGuard } = options;
	const captured = {
		req,
		client,
		signal,
		hasCurrentClientAuthority,
		sessionMutationCommitGuard
	};
	const assertLifetimeCurrent = () => assertRequestAuthorityCurrent(captured);
	const compatibility = {
		family: "native-compatibility",
		assertCurrent: assertLifetimeCurrent,
		assertLifetimeCurrent
	};
	bindRequestMutationAuthority(options, compatibility);
	return compatibility;
}
/** Only the trusted hosted creation producer can separate its tool receipt from input custody. */
function bindCreatedInputMutationAuthority(options, assertSourceCurrent) {
	if (!assertSourceCurrent) return options;
	const source = readGatewayRequestMutationAuthority(options);
	const { req, client, context, signal, hasCurrentClientAuthority, sessionMutationCommitGuard } = options;
	bindRequestMutationAuthority(options, {
		...source,
		assertAdmittedInputCurrent: () => {
			if (options.req !== req || options.client !== client || options.context !== context || options.signal !== signal || options.hasCurrentClientAuthority !== hasCurrentClientAuthority || options.sessionMutationCommitGuard !== sessionMutationCommitGuard) throw new Error("Gateway requester authority changed");
			assertRequestAuthorityCurrent({
				req,
				client,
				signal,
				hasCurrentClientAuthority,
				sessionMutationCommitGuard: assertSourceCurrent
			});
		}
	});
	return options;
}
/** WS admission retains owner facts, never an arbitrary generation getter or socket lifetime. */
function bindWebSocketRequestMutationAuthority(options, client, generationReader) {
	const generationState = SharedGatewaySessionGenerationState.fromReader(generationReader);
	const hasCurrentDeviceRevocation = readGatewayDeviceRevocationGuard(options.hasCurrentClientAuthority);
	if (!generationState || !hasCurrentDeviceRevocation || client.internal?.agentRuntimeIdentity || options.sessionMutationCommitGuard) return options;
	const { req, context, signal, hasCurrentClientAuthority } = options;
	const assertWorkerCurrent = () => {
		signal?.throwIfAborted();
		if (options.req !== req || options.client !== client || options.context !== context || options.signal !== signal || options.hasCurrentClientAuthority !== hasCurrentClientAuthority || options.sessionMutationCommitGuard !== void 0 || client.invalidated || !isGatewayAuthPolicyCurrent(client.authPolicyGeneration, getRuntimeConfigSnapshot()) || !hasCurrentDeviceRevocation() || client.internal?.agentRuntimeIdentity) throw new Error("Gateway requester authority changed");
		const requiredGeneration = client.usesSharedGatewayAuth ? generationState.requiredGeneration : void 0;
		if (requiredGeneration !== void 0 && client.sharedGatewaySessionGeneration !== requiredGeneration) throw new Error("Gateway requester authority changed");
	};
	bindRequestMutationAuthority(options, {
		family: "worker",
		assertLifetimeCurrent: assertWorkerCurrent,
		assertCurrent: () => {
			assertWorkerCurrent();
			assertRequestAuthorityCurrent(options);
		},
		assertWorkerCurrent
	});
	return options;
}
/** Transfer only this exact invocation's custody after the router composes profile selection. */
function bindGatewayRequestHandlerMutationAuthority(request, handler, expectedProfileBinding, sessionScope) {
	const source = readGatewayRequestMutationAuthority(request);
	const retainedProfileBinding = expectedProfileBinding ?? source.expectedProfileBinding;
	const retainedSessionScope = sessionScope ?? source.sessionScope;
	const { req, client, context, signal, hasCurrentClientAuthority, sessionMutationCommitGuard } = handler;
	const assertHandlerCurrent = () => {
		if (handler.req !== req || handler.client !== client || handler.context !== context || handler.signal !== signal || handler.hasCurrentClientAuthority !== hasCurrentClientAuthority || handler.sessionMutationCommitGuard !== sessionMutationCommitGuard) throw new Error("Gateway requester authority changed");
	};
	const assertCurrent = () => {
		assertHandlerCurrent();
		if (source.family === "worker") source.assertWorkerCurrent();
		assertRequestAuthorityCurrent(handler);
	};
	const assertLifetimeCurrent = () => {
		assertHandlerCurrent();
		source.assertLifetimeCurrent();
	};
	const authority = source.family === "worker" ? {
		family: "worker",
		assertCurrent,
		assertLifetimeCurrent,
		expectedProfileBinding: retainedProfileBinding,
		sessionScope: retainedSessionScope,
		assertWorkerCurrent: () => {
			assertHandlerCurrent();
			source.assertWorkerCurrent();
		}
	} : {
		family: "native-compatibility",
		assertCurrent,
		assertLifetimeCurrent,
		expectedProfileBinding: retainedProfileBinding,
		sessionScope: retainedSessionScope
	};
	if (source.assertAdmittedInputCurrent) {
		const assertAdmittedInputCurrent = source.assertAdmittedInputCurrent;
		const assertTransferredHandlerCurrent = () => {
			assertHandlerCurrent();
			if (sessionMutationCommitGuard !== request.sessionMutationCommitGuard) assertRequestAuthorityCurrent(handler);
		};
		authority.assertAdmittedInputCurrent = () => {
			assertTransferredHandlerCurrent();
			assertAdmittedInputCurrent();
		};
		const authorization = handler.sessionMutationAuthorization;
		if (authorization) handler.sessionMutationAuthorization = {
			...authorization,
			assertAdmittedInputCurrent: () => {
				assertTransferredHandlerCurrent();
				(authorization.assertAdmittedInputCurrent ?? authorization.assertCurrent)();
			}
		};
	}
	bindRequestMutationAuthority(handler, authority);
	return handler;
}
/** Keep the host lifetime and operator target policy on the same commit boundary. */
function withSessionMutationCommitGuard(authorization, assertCommitAllowed, assertExpectedProfile, assertAdmittedSourceCurrent) {
	if (!assertCommitAllowed && !assertExpectedProfile) return authorization;
	const assertAdmittedInputCurrent = () => {
		(assertAdmittedSourceCurrent ?? assertCommitAllowed)?.();
		authorization?.assertCurrent();
	};
	return {
		...authorization,
		assertAdmittedInputCurrent,
		assertCurrent: () => {
			assertExpectedProfile?.();
			assertCommitAllowed?.();
			authorization?.assertCurrent();
		},
		assertTargetCurrent: (target) => {
			assertExpectedProfile?.();
			assertCommitAllowed?.();
			authorization?.assertTargetCurrent(target);
		}
	};
}
//#endregion
export { withSessionMutationCommitGuard as a, readGatewayRequestMutationAuthority as i, bindGatewayRequestHandlerMutationAuthority as n, bindWebSocketRequestMutationAuthority as r, bindCreatedInputMutationAuthority as t };
