import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { d as hiddenSessionNotFound, u as hasSessionReadAccessChanged, y as sharingIdentity } from "./session-sharing-policy-4QkIpHi4.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-STzjNX2d.mjs";
//#region src/gateway/server-methods/session-scoped-read.ts
/** Person-owned reads retain visibility, row generation and the physical store through I/O. */
function retainSessionScopedRead(options, sessionKey, agentId, readOptions = {}) {
	const authority = readGatewayRequestMutationAuthority(options);
	const actor = resolveGatewayOperatorRoleActor(options.client);
	const profileId = sharingIdentity(options.client, actor)?.id;
	const operatorProfileId = actor?.kind === "operator" ? actor.profileId : void 0;
	const narrow = authority.sessionScope === "operator.sessions.read";
	const initialVisibility = createSessionListEntryFilter({
		client: options.client,
		cfg: (options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)()
	});
	if (!narrow && !initialVisibility) return;
	const read = retainGatewaySessionEntryReadOnly(sessionKey, agentId, readOptions.allowMetadataChanges ? (previous, current) => !hasSessionReadAccessChanged(previous, current) : void 0);
	const assertCurrent = () => {
		authority.assertCurrent();
		const currentActor = resolveGatewayOperatorRoleActor(options.client);
		const visible = createSessionListEntryFilter({
			client: options.client,
			cfg: (options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)()
		});
		if (narrow && (!operatorProfileId || currentActor?.kind !== "operator" || currentActor.profileId !== operatorProfileId) || narrow && !operatorScopeSatisfied("operator.sessions.read", options.client?.connect.scopes ?? []) || sharingIdentity(options.client, currentActor)?.id !== profileId || readOptions.requireMaterialized && !read.entry?.sessionId || !read.isCurrentAtResponse() || read.entry && visible?.(read.legacyKey ?? read.canonicalKey, read.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
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
