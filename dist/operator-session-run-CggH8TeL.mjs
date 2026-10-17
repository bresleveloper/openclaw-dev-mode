import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-0NHGAu9Q.mjs";
import { o as authorizeSessionAgentRun } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
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
	const assertCurrent = () => {
		params.assertSourceCurrent();
		params.authority.assertCurrent();
	};
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
