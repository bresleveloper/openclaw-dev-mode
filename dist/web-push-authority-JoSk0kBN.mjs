import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { s as resolveUserProfileId } from "./user-profiles-BA6bh7Le.mjs";
import { p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BNrKHiJ3.mjs";
import { r as withCurrentDevicePairingSnapshot } from "./device-pairing-worker-DPa4iZOd.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-BnU9nqx2.mjs";
import "./device-pairing-DbLfxuuq.mjs";
import { m as withBoundWebPushSubscriptions } from "./push-web-B4o-WWaK.mjs";
//#region src/gateway/web-push-authority.ts
const OPERATOR_ROLE = "operator";
function resolveCurrentWebPushTarget(params) {
	const { device, subscription, cfg } = params;
	if (!device || !hasEffectivePairedDeviceRole(device, OPERATOR_ROLE)) return null;
	const operatorToken = device.tokens?.[OPERATOR_ROLE];
	const approvedScopes = device.approvedScopes ?? device.scopes;
	if (!operatorToken || operatorToken.revokedAtMs || !approvedScopes || !roleScopesAllow({
		role: OPERATOR_ROLE,
		requestedScopes: operatorToken.scopes,
		allowedScopes: approvedScopes
	})) return null;
	const storedProfileId = subscription.userProfileId;
	const userProfileId = storedProfileId ? resolveUserProfileId(storedProfileId) ?? null : null;
	if (storedProfileId && !userProfileId || cfg.gateway?.roles && !userProfileId) return null;
	const rolePolicy = userProfileId ? resolveOperatorRolePolicyForProfile(userProfileId, cfg) : void 0;
	if (cfg.gateway?.roles && !rolePolicy) return null;
	const scopesAllowed = (requestedScopes) => roleScopesAllow({
		role: OPERATOR_ROLE,
		requestedScopes,
		allowedScopes: operatorToken.scopes
	}) && (!rolePolicy || roleScopesAllow({
		role: OPERATOR_ROLE,
		requestedScopes,
		allowedScopes: rolePolicy.scopes
	}));
	if (!scopesAllowed(params.requiredScopes)) return null;
	const visibilityScopes = rolePolicy ? (params.visibilityScopes ?? []).filter((scope) => scopesAllowed([scope])) : [];
	return {
		subscription,
		scopes: [.../* @__PURE__ */ new Set([...params.requiredScopes, ...visibilityScopes])],
		userProfileId
	};
}
/** Resolve current recipients from the pairing owner's prepared authority facts. */
function listCurrentWebPushTargets(params) {
	const pairedByDeviceId = new Map(params.pairedDevices.map((device) => [device.deviceId, device]));
	return params.subscriptions.flatMap((subscription) => {
		const target = resolveCurrentWebPushTarget({
			subscription,
			device: pairedByDeviceId.get(subscription.deviceId),
			cfg: params.cfg,
			requiredScopes: params.requiredScopes,
			visibilityScopes: params.visibilityScopes
		});
		return target ? [target] : [];
	});
}
/** Keep both binding and pairing authority until the synchronous provider start. */
function withCurrentWebPushAuthority(stateDir, prepare) {
	return withBoundWebPushSubscriptions(stateDir, async (subscriptions, assertCurrent) => {
		const begun = await withCurrentDevicePairingSnapshot(stateDir, (pairedDevices) => {
			const action = prepare(subscriptions, pairedDevices);
			return { start: () => {
				assertCurrent();
				return { value: action?.start() };
			} };
		});
		return begun ? { start: () => begun.value } : void 0;
	});
}
function webPushTargetClient(target) {
	return {
		connect: {
			minProtocol: 1,
			maxProtocol: 1,
			client: {
				id: GATEWAY_CLIENT_IDS.CONTROL_UI,
				version: "web-push",
				platform: "web",
				mode: GATEWAY_CLIENT_MODES.WEBCHAT
			},
			device: {
				id: target.subscription.deviceId,
				publicKey: "web-push",
				signature: "web-push",
				signedAt: 0,
				nonce: "web-push"
			},
			role: OPERATOR_ROLE,
			scopes: target.scopes
		},
		...target.userProfileId ? { authenticatedUserProfile: {
			profileId: target.userProfileId,
			displayName: null,
			hasAvatar: false,
			updatedAt: 0
		} } : {}
	};
}
//#endregion
export { webPushTargetClient as n, withCurrentWebPushAuthority as r, listCurrentWebPushTargets as t };
