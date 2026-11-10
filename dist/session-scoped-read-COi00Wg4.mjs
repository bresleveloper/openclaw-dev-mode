import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { l as hasSessionReadAccessChanged, u as hiddenSessionNotFound, v as sharingIdentity } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
//#region src/gateway/server-methods/session-scoped-read.ts
/** Person-owned reads retain visibility, row generation and the physical store through I/O. */
async function retainSessionScopedRead(options, sessionKey, agentId, readOptions = {}) {
	const authority = readGatewayRequestMutationAuthority(options);
	const actor = resolveGatewayOperatorRoleActor(options.client);
	const profileId = sharingIdentity(options.client, actor)?.id;
	const operatorProfileId = actor?.kind === "operator" ? actor.profileId : void 0;
	const narrow = authority.sessionScope === "operator.sessions.read";
	const getConfig = options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig;
	const cfg = getConfig();
	const initialVisibility = createSessionListEntryFilter({
		client: options.client,
		cfg
	});
	if (!narrow && !initialVisibility) return;
	const assertRoutingCurrent = captureSessionMutationRouting(cfg, void 0, [{
		sessionKey,
		agentId
	}]);
	const read = await retainGatewaySessionEntryReadOnly(sessionKey, agentId, readOptions.allowMetadataChanges ? (previous, current) => !hasSessionReadAccessChanged(previous, current) : void 0, cfg);
	const assertCurrent = () => {
		authority.assertCurrent();
		const currentCfg = getConfig();
		assertRoutingCurrent(currentCfg);
		const currentActor = resolveGatewayOperatorRoleActor(options.client);
		const visible = createSessionListEntryFilter({
			client: options.client,
			cfg: currentCfg
		});
		if (narrow && (!operatorProfileId || currentActor?.kind !== "operator" || currentActor.profileId !== operatorProfileId) || narrow && !operatorScopeSatisfied("operator.sessions.read", options.client?.connect.scopes ?? []) || sharingIdentity(options.client, currentActor)?.id !== profileId || readOptions.requireMaterialized && !read.entry?.sessionId || !read.isCurrentAtResponse() || read.entry && visible?.(read.legacyKey ?? read.canonicalKey, read.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
	};
	try {
		assertCurrent();
		return {
			assertCurrent,
			release: read.release,
			prepared: read
		};
	} catch (error) {
		read.release();
		throw error;
	}
}
//#endregion
export { retainSessionScopedRead as t };
