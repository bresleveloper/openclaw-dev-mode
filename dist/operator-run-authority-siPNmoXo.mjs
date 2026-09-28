import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { N as onUserProfilesChanged, R as readUserProfileAliasRevision } from "./user-profiles-internal-BxQLnWfo.mjs";
import { s as resolveUserProfileId } from "./user-profiles-CRttx6hj.mjs";
import { a as onOperatorRolePolicyChanged, p as resolveOperatorRolePolicyForProfile, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { r as createAdmittedRunOperatorAuthority, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { a as onGatewayDeviceSourceRevoked, c as retainGatewayDeviceRevocation, s as readGatewayDeviceSourceAuthority } from "./device-revocation-BMta3qGW.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-run-authority.ts
const operatorSources = /* @__PURE__ */ new WeakMap();
/** Transfers the original operator restriction into accepted work, independently of its request. */
function captureGatewayOperatorRunAuthority(params) {
	const inherited = params.client?.internal?.operatorRunAuthority;
	if (inherited !== void 0) {
		assertAdmittedRunOperatorAuthority(inherited);
		inherited.assertCurrent();
		const scopes = intersectOperatorScopes(inherited.scopes, params.client?.connect.scopes ?? []);
		return {
			authority: roleScopesAllow({
				role: "operator",
				requestedScopes: inherited.scopes,
				allowedScopes: scopes
			}) ? inherited : createAdmittedRunOperatorAuthority({
				...inherited,
				scopes
			}),
			release: inherited.retain?.() ?? (() => {})
		};
	}
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const client = params.client;
	if (!client || actor?.kind !== "operator") return;
	const profileId = actor.profileId;
	let aliasRevision = readUserProfileAliasRevision();
	if (params.hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	const releaseDevice = retainGatewayDeviceRevocation(params.hasCurrentClientAuthority);
	const isSourceCurrent = readGatewayDeviceSourceAuthority(params.hasCurrentClientAuthority);
	const resolveGatewayContext = params.context.resolveGatewayContext;
	const gatewayContext = resolveGatewayContext?.();
	const getConfig = params.context.getCommittedRuntimeConfig ?? params.context.getRuntimeConfig;
	const isGatewayCurrent = () => !resolveGatewayContext || gatewayContext !== void 0 && resolveGatewayContext() === gatewayContext;
	const sourceAuthority = params.sourceAuthority !== void 0 ? params.sourceAuthority : client.internal?.operatorAccessAuthority;
	const scopes = Object.freeze([...client.connect.scopes ?? []]);
	const policyClient = {
		connect: {
			minProtocol: client.connect.minProtocol,
			maxProtocol: client.connect.maxProtocol,
			client: client.connect.client,
			role: "operator",
			scopes: [...scopes]
		},
		internal: { operatorRoleActor: {
			kind: "operator",
			profileId
		} }
	};
	let source = operatorSources.get(client);
	if (!source) {
		source = Object.freeze({});
		operatorSources.set(client, source);
	}
	let references = 1;
	let revoked = false;
	const revocation = new AbortController();
	const subscriptions = [];
	const assertProfileCurrent = () => {
		const currentAliasRevision = readUserProfileAliasRevision();
		if (currentAliasRevision !== aliasRevision) {
			if (resolveUserProfileId(profileId) !== profileId) throw new Error("operator source identity changed; start a new request");
			aliasRevision = currentAliasRevision;
		}
	};
	const assertRoleCurrent = () => {
		const error = authorizeCurrentOperatorRoleScopes(policyClient, getConfig());
		if (error) throw new Error(error.message);
	};
	const revoke = (reason) => {
		if (references > 0 && isGatewayCurrent()) {
			revoked = true;
			revocation.abort(reason);
		}
	};
	const recheck = (check) => {
		if (!revoked && references > 0 && isGatewayCurrent()) try {
			check();
		} catch (error) {
			revoke(error);
		}
	};
	const assertCurrent = () => {
		if (revoked || references === 0) throw new Error("operator execution authority is no longer active");
		try {
			if (isSourceCurrent?.() === false || !isGatewayCurrent()) throw new Error("operator source authority is no longer active");
			sourceAuthority?.signal?.throwIfAborted();
			sourceAuthority?.assertCurrent();
			assertProfileCurrent();
			assertRoleCurrent();
		} catch (error) {
			revoked = true;
			throw error;
		}
	};
	const releaseHold = () => {
		let released = false;
		return () => {
			if (!released) {
				released = true;
				if (--references === 0) {
					for (const unsubscribe of subscriptions.splice(0)) unsubscribe?.();
					releaseDevice?.();
				}
			}
		};
	};
	const release = releaseHold();
	try {
		const capturedRole = structuredClone(resolveOperatorRolePolicyForProfile(profileId, getConfig()));
		subscriptions.push(onGatewayDeviceSourceRevoked(params.hasCurrentClientAuthority, () => revoke(/* @__PURE__ */ new Error("operator source authority is no longer active"))), onOperatorRolePolicyChanged((change) => {
			if (change.kind === "assignment" && change.profileId === profileId) revoke(/* @__PURE__ */ new Error("Your operator role changed; reconnect before continuing."));
			else if (change.kind === "config" && change.context === (gatewayContext ?? params.context)) recheck(() => {
				const currentRole = resolveOperatorRolePolicyForProfile(profileId, getConfig());
				if (!isDeepStrictEqual(capturedRole, currentRole)) throw new Error("Your operator role changed; reconnect before continuing.");
			});
		}), onUserProfilesChanged(() => recheck(assertProfileCurrent)));
		const sourceSignal = sourceAuthority?.signal;
		if (sourceSignal) {
			const onAbort = () => revoke(sourceSignal.reason);
			sourceSignal.addEventListener("abort", onAbort, { once: true });
			subscriptions.push(() => sourceSignal.removeEventListener("abort", onAbort));
		}
		assertCurrent();
		return {
			authority: createAdmittedRunOperatorAuthority({
				profileId,
				scopes,
				gatewayAccessGrant: sourceAuthority === null ? null : sourceAuthority?.gatewayAccessGrant,
				source,
				assertCurrent,
				signal: revocation.signal,
				retain: () => {
					assertCurrent();
					references += 1;
					return releaseHold();
				}
			}),
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { captureGatewayOperatorRunAuthority as t };
