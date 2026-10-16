import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { a as prepareUserProfileCatalog } from "./user-profile-list-CtETKur7.mjs";
import { f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-BqPaarjx.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-DCGOreuH.mjs";
import { r as withCurrentDevicePairingSnapshot } from "./device-pairing-worker-CI-Kr0jq.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-f0QUXRJo.mjs";
import "./device-pairing-Drmq_Czv.mjs";
import { d as WEB_PUSH_USER_PREFERENCES_KEY, g as resolveEffectiveWebPushPreferences } from "./push-web-store.records-CGk3CZmD.mjs";
import { p as withBoundWebPushSubscriptions } from "./push-web-CligmjCq.mjs";
import { n as getUserPreferenceValues } from "./user-preferences-ChnHlrwX.mjs";
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
	const userProfileId = params.profile?.profileId ?? null;
	if (storedProfileId && !userProfileId || cfg.gateway?.roles && !userProfileId) return null;
	const rolePolicy = userProfileId ? resolveOperatorRolePolicyForAssignment(userProfileId, params.profile?.role ?? null, cfg, params.profile?.githubLogin ?? null) : void 0;
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
		userProfileId,
		profile: params.profile,
		preferences: resolveEffectiveWebPushPreferences({
			user: userProfileId ? params.preferences.get(userProfileId) : void 0,
			device: subscription.devicePreferences
		})
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
			visibilityScopes: params.visibilityScopes,
			profile: subscription.userProfileId ? params.profile?.readCurrentIdentity(subscription.userProfileId) : void 0,
			preferences: params.preferences
		});
		return target ? [target] : [];
	});
}
/** Keep both binding and pairing authority until the synchronous provider start. */
async function withCurrentWebPushAuthority(params, prepare) {
	const sessions = /* @__PURE__ */ new Map();
	try {
		for (const sessionKey of new Set(params.sessionKeys)) {
			const cfg = params.getRuntimeConfig();
			const { agentId } = resolveSessionStoreIdentity({
				cfg,
				sessionKey,
				agentId: params.agentId
			});
			sessions.set(sessionKey, await prepareSessionMutationFacts({
				cfg,
				sessionKey,
				agentId,
				allowMissing: true
			}));
		}
		return (await withBoundWebPushSubscriptions(params.stateDir, async (subscriptions, assertCurrent) => {
			const options = params.stateDir ? { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} } : {};
			const profile = subscriptions.some((subscription) => subscription.userProfileId) ? await prepareUserProfileCatalog(options) : void 0;
			try {
				for (;;) {
					const profileIds = new Set(subscriptions.flatMap((subscription) => {
						const id = subscription.userProfileId && profile?.readCurrentIdentity(subscription.userProfileId)?.profileId;
						return id ? [id] : [];
					}));
					const preferences = await getUserPreferenceValues([...profileIds], WEB_PUSH_USER_PREFERENCES_KEY, options);
					let changed = false;
					const begun = await withCurrentDevicePairingSnapshot(params.stateDir, (pairedDevices) => {
						assertCurrent();
						changed = !preferences.isCurrent() || subscriptions.some((subscription) => {
							const id = subscription.userProfileId && profile?.readCurrentIdentity(subscription.userProfileId)?.profileId;
							return id && !profileIds.has(id);
						});
						if (changed) return;
						const cfg = params.getRuntimeConfig();
						const action = prepare({
							cfg,
							subscriptions,
							pairedDevices,
							profile,
							preferences: preferences.values,
							sessions: new Map([...sessions].map(([key, facts]) => [key, facts.readCurrent(cfg)]))
						});
						return { start: () => {
							assertCurrent();
							return { value: action?.start() };
						} };
					}, params.preparePublication);
					if (!changed) return begun ? { start: () => begun } : void 0;
				}
			} finally {
				profile?.release();
			}
		}))?.value;
	} finally {
		for (const facts of sessions.values()) facts.release();
	}
}
function webPushSessionAccess(authority, client) {
	return {
		sharing: prepareProjectedSessionSharing({
			cfg: authority.cfg,
			client,
			isMember: (target, identity) => [...authority.sessions.values()].some((facts) => facts.target === target && facts.membership.has(identity))
		}),
		target: (sessionKey) => authority.sessions.get(sessionKey)?.target ?? null
	};
}
function webPushTargetClient(target) {
	return {
		preparedSessionProfile: target.profile,
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
export { withCurrentWebPushAuthority as i, webPushSessionAccess as n, webPushTargetClient as r, listCurrentWebPushTargets as t };
