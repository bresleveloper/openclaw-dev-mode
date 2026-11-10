import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import { n as withOpenClawStateLeaseAsync } from "./openclaw-state-lease-B69mLcu_.mjs";
import { r as projectMcpOAuthAuthorization, t as hasMcpOAuthAuthorization } from "./mcp-oauth-authorization-facts-DCaTnoCO.mjs";
import { m as retainMcpOAuthAuthorizationState, s as mutateMcpOAuthStore, u as readMcpOAuthStoreReadOnly } from "./mcp-oauth-store-bopb1GII.mjs";
//#region src/agents/mcp-oauth-authorization.ts
/** Capture native credential custody without refreshing or holding a flow lease over a source. */
async function captureMcpOAuthAuthorization(params) {
	const storeKey = params.identity.storeKey;
	const assertCaller = params.assertCurrent;
	const context = captureOpenClawStateWorkerContext();
	const assertSource = () => {
		assertCaller();
		try {
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
		} catch {
			throw new AuthProfileAuthorizationError("retired");
		}
	};
	assertSource();
	const owner = retainMcpOAuthAuthorizationState(context.admission, storeKey);
	const readCanonical = async () => {
		assertSource();
		const publish = owner.prepareRead();
		const store = await readMcpOAuthStoreReadOnly(storeKey, context).catch(() => {
			assertSource();
			throw new AuthProfileAuthorizationError("unavailable");
		});
		assertSource();
		publish(projectMcpOAuthAuthorization(store));
		return store;
	};
	try {
		let store = await readCanonical();
		if (!hasMcpOAuthAuthorization(store) || !store.tokens?.refresh_token && store.tokenExpiresAt !== void 0 && store.tokenExpiresAt <= Date.now()) throw new AuthProfileAuthorizationError("retired");
		if (!store.authorizationId) {
			await withOpenClawStateLeaseAsync({
				scope: "core:mcp-oauth",
				key: storeKey,
				leaseMs: 6e4,
				waitMs: 3e4
			}, context, (lease) => mutateMcpOAuthStore({
				storeKey,
				lease,
				context
			}, { kind: "ensureAuthorization" }, { assertCurrent: assertSource }));
			store = await readCanonical();
		}
		const authorizationId = store.authorizationId;
		if (!authorizationId) throw new AuthProfileAuthorizationError("retired");
		let observation = "ready";
		const assertCurrent = () => {
			assertSource();
			owner.assertAuthorization(authorizationId);
			if (observation !== "ready") throw new AuthProfileAuthorizationError("unavailable");
		};
		assertCurrent();
		return {
			authorizationId,
			assertCurrent,
			async revalidate() {
				assertSource();
				owner.assertAuthorization(authorizationId);
				if (observation === "pending") throw new AuthProfileAuthorizationError("unavailable");
				observation = "pending";
				try {
					await readCanonical();
					assertSource();
					owner.assertAuthorization(authorizationId);
					observation = "ready";
				} catch (error) {
					observation = "unavailable";
					throw error;
				}
			},
			dispose: owner.release
		};
	} catch (error) {
		owner.release();
		throw error;
	}
}
//#endregion
export { captureMcpOAuthAuthorization };
