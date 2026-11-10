import { o as composeSessionSourceAssertion, s as createDynamicSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { o as createSessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { o as authorizeSessionAgentRun } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
//#region src/gateway/operator-session-run.ts
/** Leave ordinary creation attribution unchanged unless the authenticated person requires isolation. */
function resolveSandboxedSessionCreation(client, cfg) {
	const creation = resolveOperatorSessionCreation(client);
	return resolveCreatorSandbox(cfg, creation) === "required" ? {
		...creation,
		sandbox: "required"
	} : void 0;
}
/** Binds create-on-run provenance and row admission to the original operator. */
function prepareGatewayOperatorSessionRun(params) {
	assertAdmittedRunOperatorAuthority(params.authority);
	const source = createDynamicSessionSourceAssertion(() => params.currentSource().assertSourceCurrent, () => {
		throw createSessionWorkStartChangedError(params.sessionKey);
	});
	const assertCurrent = composeSessionSourceAssertion([source, params.authority.assertCurrent], (assertSources) => {
		params.currentSource().abortSignal?.throwIfAborted();
		assertSources();
	});
	assertCurrent();
	const client = createSyntheticPluginRuntimeClient({
		operatorRoleActor: {
			kind: "operator",
			profileId: params.authority.profileId
		},
		scopes: [...params.authority.scopes]
	});
	const creation = resolveSandboxedSessionCreation({ authenticatedUserProfile: { profileId: params.authority.profileId } }, params.cfg);
	return {
		creation: creation ? {
			...creation,
			via: "run"
		} : void 0,
		assertCurrent,
		assertAuthorized: (entry) => {
			assertCurrent();
			const error = entry ? authorizeSessionAgentRun({
				cfg: params.cfg,
				client,
				target: {
					agentId: params.agentId,
					canonicalKey: params.sessionKey,
					entry
				}
			}) : authorizeGatewaySessionCreation({
				cfg: params.cfg,
				client,
				agentId: params.agentId
			});
			if (error) throw new ToolAuthorizationError(error.message);
		}
	};
}
//#endregion
export { resolveSandboxedSessionCreation as n, prepareGatewayOperatorSessionRun as t };
