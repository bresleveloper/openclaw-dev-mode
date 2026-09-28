import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { B as hiddenSessionNotFound, E as createSessionListEntryFilter, Y as sharingIdentity } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-BnB-xa1-.mjs";
//#region src/gateway/server-methods/session-scoped-read.ts
/** Person-owned reads retain visibility, row generation and the physical store through I/O. */
function retainSessionScopedRead(options, sessionKey, agentId, requireMaterialized = false) {
	const authority = readGatewayRequestMutationAuthority(options);
	const actor = resolveGatewayOperatorRoleActor(options.client);
	const profileId = sharingIdentity(options.client, actor)?.id;
	const operatorProfileId = actor?.kind === "operator" ? actor.profileId : void 0;
	const narrow = authority.sessionScope === "operator.sessions.read";
	const initialVisibility = createSessionListEntryFilter({
		client: options.client,
		cfg: options.context.getRuntimeConfig()
	});
	if (!narrow && !initialVisibility) return;
	const read = retainGatewaySessionEntryReadOnly(sessionKey, agentId);
	const assertCurrent = () => {
		authority.assertCurrent();
		const currentActor = resolveGatewayOperatorRoleActor(options.client);
		const visible = createSessionListEntryFilter({
			client: options.client,
			cfg: options.context.getRuntimeConfig()
		});
		if (narrow && (!operatorProfileId || currentActor?.kind !== "operator" || currentActor.profileId !== operatorProfileId) || narrow && !operatorScopeSatisfied("operator.sessions.read", options.client?.connect.scopes ?? []) || sharingIdentity(options.client, currentActor)?.id !== profileId || requireMaterialized && !read.entry?.sessionId || !read.isCurrentAtResponse() || read.entry && visible?.(read.legacyKey ?? read.canonicalKey, read.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
	};
	try {
		assertCurrent();
		return {
			assertCurrent,
			release: read.release
		};
	} catch (error) {
		read.release();
		throw error;
	}
}
//#endregion
export { retainSessionScopedRead as t };
