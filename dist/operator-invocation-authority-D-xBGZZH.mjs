import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BT0kzSVu.mjs";
import { a as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
//#region src/gateway/operator-invocation-authority.ts
function hasOperatorToolSource(authority) {
	return Boolean(authority?.operatorRunAuthority || authority?.operatorRoleActor?.kind === "operator" || !authority?.operatorRoleActor && authority?.authenticatedUserProfile);
}
/** Known operator sources cannot turn missing Gateway routing into standalone host access. */
function hasOperatorToolGatewayAuthority() {
	const admitted = getGatewayToolCallerIdentity()?.operatorAuthority;
	admitted?.assertCurrent();
	const direct = readOperatorToolGatewayAuthority();
	direct?.signal.throwIfAborted();
	direct?.assertCurrent?.();
	direct?.operatorRunAuthority?.assertCurrent();
	const scope = getPluginRuntimeGatewayRequestScope();
	const scopedOperator = Boolean(scope?.client?.authenticatedUserProfile || scope?.client?.internal?.operatorRoleActor?.kind === "operator");
	if (scopedOperator) {
		scope?.signal?.throwIfAborted();
		if (scope?.hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	}
	return Boolean(admitted || hasOperatorToolSource(direct) || scopedOperator);
}
/** Retain the already-issued source and its invocation fence for SDK-owned selection writes. */
function captureOperatorToolGatewayAuthority() {
	const admitted = getGatewayToolCallerIdentity()?.operatorAuthority;
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const direct = readOperatorToolGatewayAuthority();
	const ambientScope = getPluginRuntimeGatewayRequestScope();
	const scope = ambientScope ? { ...ambientScope } : void 0;
	const authority = admitted ?? direct?.operatorRunAuthority ?? scope?.client?.internal?.operatorRunAuthority;
	const requiresOperatorAuthority = Boolean(admitted || hasOperatorToolSource(direct) || resolveGatewayOperatorRoleActor(scope?.client)?.kind === "operator");
	if (!authority && !assertCallerCurrent && !direct && !requiresOperatorAuthority) return;
	return {
		authority,
		assertCurrent: () => {
			assertCallerCurrent?.();
			direct?.assertCurrent?.();
			if (!admitted && !assertCallerCurrent) {
				direct?.signal.throwIfAborted();
				scope?.signal?.throwIfAborted();
				if (scope?.hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
			}
			if (requiresOperatorAuthority && !authority) throw new Error("Operator model selection requires original Gateway authority.");
		}
	};
}
/** Acquire the ambient requester; consumers own retention through their distinct work lifetimes. */
async function captureAmbientGatewayOperatorAuthority(params) {
	const ambientScope = getPluginRuntimeGatewayRequestScope();
	const scope = ambientScope ? { ...ambientScope } : void 0;
	const invocation = captureOperatorToolGatewayAuthority();
	const inheritedOperator = invocation?.authority;
	const context = scope?.context ?? scope?.resolveGatewayContext?.();
	const assertInvocationCurrent = inheritedOperator || !scope?.client || !context ? invocation?.assertCurrent : captureGatewayToolCallerAssertion();
	if (inheritedOperator) {
		if (params.retainInherited) {
			assertAdmittedRunOperatorAuthority(inheritedOperator);
			inheritedOperator.assertCurrent();
		}
		return {
			authority: inheritedOperator,
			assertInvocationCurrent,
			release: params.retainInherited ? inheritedOperator.retain?.() : void 0
		};
	}
	if (scope?.client && !context && resolveGatewayOperatorRoleActor(scope.client)?.kind === "operator") throw params.missingBindingError();
	const capturedOperator = scope?.client && context ? await captureGatewayOperatorRunAuthority({
		client: scope.client,
		context,
		hasCurrentClientAuthority: scope.hasCurrentClientAuthority,
		invocationAuthority: {
			assertCurrent: () => scope.signal?.throwIfAborted(),
			signal: scope.signal
		}
	}) : void 0;
	try {
		assertInvocationCurrent?.();
		scope?.signal?.throwIfAborted();
		if (scope?.hasCurrentClientAuthority?.() === false || scope?.resolveGatewayContext && scope.resolveGatewayContext() !== context) throw new Error("Gateway caller authority is no longer active.");
		capturedOperator?.authority.assertCurrent();
		return {
			...capturedOperator,
			assertInvocationCurrent
		};
	} catch (error) {
		capturedOperator?.release();
		throw error;
	}
}
//#endregion
export { captureOperatorToolGatewayAuthority as n, hasOperatorToolGatewayAuthority as r, captureAmbientGatewayOperatorAuthority as t };
