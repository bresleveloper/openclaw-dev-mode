import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Gs as validateWebPushPreferencesSetParams, Js as validateWebPushUnsubscribeParams, Ks as validateWebPushSubscribeParams, Sr as validatePushTestParams, Ws as validateWebPushPreferencesGetParams, Ys as validateWebPushVapidPublicKeyParams, qs as validateWebPushTestParams } from "./src-BRUl7oDv.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as resolveUserProfileId } from "./user-profiles-CRttx6hj.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { c as normalizeApnsEnvironment, g as resolveApnsRelayConfigFromEnv, n as clearApnsRegistrationIfCurrent, o as loadApnsRegistration } from "./push-apns-store-9CGb-HCs.mjs";
import { _ as resolveEffectiveWebPushPreferences, f as WEB_PUSH_USER_PREFERENCES_KEY, g as normalizeWebPushNotificationPreferences, m as normalizeWebPushDevicePreferences, r as WebPushSubscriptionBindingError } from "./push-web-store.records-B7ppsd_i.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-qz1zEEvg.mjs";
import { a as resolveVapidKeys, f as setWebPushSubscriptionPreferences, i as registerWebPushSubscription, n as clearBoundWebPushSubscription, p as withBoundWebPushSubscriptionByEndpoint, t as broadcastWebPush } from "./push-web-B4o-WWaK.mjs";
import { i as setUserPreferences, n as getUserPreferences } from "./user-preferences-DdrP3G5o.mjs";
import { c as resolveApnsAuthConfigFromEnv, s as shouldClearStoredApnsRegistration, t as sendApnsAlert } from "./push-apns-DC8TvSr9.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
//#region src/gateway/server-methods/push.ts
function hasValidWebPushQuietHoursTimeZone(preferences) {
	const timeZone = preferences.quietHours?.timeZone;
	if (!timeZone) return true;
	try {
		new Intl.DateTimeFormat("en-US", { timeZone }).format(0);
		return true;
	} catch {
		return false;
	}
}
function createWebPushRequestGuard(options) {
	const { client, req } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	const method = req.method;
	const deviceId = normalizeOptionalString(client?.connect.device?.id);
	const profileReference = client?.authenticatedUserProfile?.profileId;
	const assertPolicyCurrent = () => {
		const role = parseGatewayRole(client?.connect.role ?? "operator");
		if (!role || !isRoleAuthorizedForMethod(role, method) || !authorizeOperatorScopesForMethod(method, client?.connect.scopes ?? []).allowed || normalizeOptionalString(client?.connect.device?.id) !== deviceId) throw new Error("Web Push requester authority changed");
	};
	const assertCurrent = () => {
		authority.assertCurrent();
		assertPolicyCurrent();
		const currentReference = client?.authenticatedUserProfile?.profileId;
		const currentProfileId = currentReference ? resolveUserProfileId(currentReference) : void 0;
		const originalProfileId = profileReference ? resolveUserProfileId(profileReference) : void 0;
		if (currentReference && !currentProfileId || profileReference && !originalProfileId || currentProfileId !== originalProfileId) throw new Error("Web Push requester profile changed");
		return currentProfileId;
	};
	return {
		assertCurrent,
		prepareMutation: () => {
			assertCurrent();
			if (authority.family === "native-compatibility") return {
				family: "native-compatibility",
				assertCurrent
			};
			const currentReference = client?.authenticatedUserProfile?.profileId;
			return {
				family: "worker",
				profiles: {
					original: profileReference ?? null,
					current: currentReference ?? null
				},
				assertCurrent: () => {
					authority.assertWorkerCurrent();
					assertPolicyCurrent();
					if (client?.authenticatedUserProfile?.profileId !== currentReference) throw new Error("Web Push requester profile changed");
				},
				assertProfiles: (facts) => {
					authority.expectedProfileBinding?.assertMatchesResolvedProfile(facts.profileId ?? void 0);
					if (!facts.bindingCurrent) throw new Error("Web Push requester profile changed");
				}
			};
		}
	};
}
function withAuthorizedWebPushSubscription(endpoint, options, start) {
	const { client, respond } = options;
	const requester = createWebPushRequestGuard(options);
	const deviceId = normalizeOptionalString(client?.connect.device?.id);
	return withBoundWebPushSubscriptionByEndpoint({ endpoint }, (subscription) => {
		if (!deviceId || !subscription || subscription.deviceId !== deviceId) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "subscription is not bound to this device"));
			return;
		}
		const currentProfileId = client?.authenticatedUserProfile?.profileId ? resolveUserProfileId(client.authenticatedUserProfile.profileId) : void 0;
		const subscriptionProfileId = subscription.userProfileId ? resolveUserProfileId(subscription.userProfileId) : void 0;
		if (subscription.userProfileId && !subscriptionProfileId || client?.authenticatedUserProfile?.profileId && !currentProfileId || (subscriptionProfileId ?? null) !== (currentProfileId ?? null)) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "subscription is not bound to this user"));
			return;
		}
		const assertCurrent = () => {
			const profileId = requester.assertCurrent();
			const currentSubscriptionProfileId = subscription.userProfileId ? resolveUserProfileId(subscription.userProfileId) : void 0;
			if (subscription.userProfileId && !currentSubscriptionProfileId || currentSubscriptionProfileId !== profileId) throw new Error("Web Push subscription owner changed");
			return profileId;
		};
		assertCurrent();
		return { start: () => start({
			subscription,
			assertCurrent,
			prepareMutation: () => {
				const guard = requester.prepareMutation();
				return guard.family === "native-compatibility" ? {
					...guard,
					assertCurrent
				} : guard;
			}
		}) };
	});
}
const pushHandlers = {
	"push.test": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePushTestParams, "push.test", respond)) return;
		const nodeId = normalizeStringifiedOptionalString(params.nodeId) ?? "";
		if (!nodeId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
			return;
		}
		const title = normalizeOptionalString(params.title) ?? "OpenClaw";
		const body = normalizeOptionalString(params.body) ?? `Push test for node ${nodeId}`;
		await respondUnavailableOnThrow(respond, async () => {
			const registration = await loadApnsRegistration(nodeId);
			if (!registration) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `node ${nodeId} has no APNs registration (connect iOS node first)`));
				return;
			}
			const overrideEnvironment = normalizeApnsEnvironment(params.environment);
			const result = registration.transport === "direct" ? await (async () => {
				const auth = await resolveApnsAuthConfigFromEnv(process.env);
				if (!auth.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, auth.error));
					return null;
				}
				return await sendApnsAlert({
					registration: {
						...registration,
						environment: overrideEnvironment ?? registration.environment
					},
					nodeId,
					title,
					body,
					auth: auth.value
				});
			})() : await (async () => {
				const relay = resolveApnsRelayConfigFromEnv(process.env, context.getRuntimeConfig().gateway, { registrationRelayOrigin: registration.relayOrigin });
				if (!relay.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, relay.error));
					return null;
				}
				return await sendApnsAlert({
					registration,
					nodeId,
					title,
					body,
					relayConfig: relay.value
				});
			})();
			if (!result) return;
			if (shouldClearStoredApnsRegistration({
				registration,
				result,
				overrideEnvironment
			})) await clearApnsRegistrationIfCurrent({
				nodeId,
				registration
			});
			respond(true, result, void 0);
		});
	},
	"push.web.vapidPublicKey": async ({ params, respond }) => {
		if (!assertValidParams(params, validateWebPushVapidPublicKeyParams, "push.web.vapidPublicKey", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { vapidPublicKey: (await resolveVapidKeys()).publicKey }, void 0);
		});
	},
	"push.web.subscribe": async (options) => {
		const { params, respond, client, context } = options;
		if (!assertValidParams(params, validateWebPushSubscribeParams, "push.web.subscribe", respond)) return;
		const deviceId = normalizeOptionalString(client?.connect.device?.id);
		if (!deviceId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "paired browser device identity required"));
			return;
		}
		const userProfileId = normalizeOptionalString(client?.authenticatedUserProfile?.profileId);
		if (context.getRuntimeConfig().gateway?.roles && !userProfileId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Web Push requires an authenticated user profile when Gateway roles are enabled"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			try {
				const requester = createWebPushRequestGuard(options);
				const subscription = await registerWebPushSubscription({
					endpoint: params.endpoint,
					keys: params.keys,
					binding: {
						deviceId,
						userProfileId: userProfileId ?? null
					},
					guard: requester.prepareMutation()
				});
				respond(true, { subscriptionId: subscription.subscriptionId }, void 0);
			} catch (error) {
				if (!(error instanceof WebPushSubscriptionBindingError)) throw error;
				respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
			}
		});
	},
	"push.web.unsubscribe": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateWebPushUnsubscribeParams, "push.web.unsubscribe", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			await withAuthorizedWebPushSubscription(params.endpoint, options, (authorized) => {
				const { subscription } = authorized;
				return clearBoundWebPushSubscription({
					endpoint: params.endpoint,
					expectedDeviceId: subscription.deviceId,
					expectedUserProfileId: subscription.userProfileId,
					guard: authorized.prepareMutation()
				}).then((removed) => {
					if (!removed) {
						respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "subscription binding changed"));
						return;
					}
					respond(true, { removed }, void 0);
				});
			});
		});
	},
	"push.web.preferences.get": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateWebPushPreferencesGetParams, "push.web.preferences.get", respond)) return;
		await withAuthorizedWebPushSubscription(params.endpoint, options, (authorized) => {
			const { subscription } = authorized;
			const currentProfileId = authorized.assertCurrent();
			const storedUser = currentProfileId ? getUserPreferences(currentProfileId, [WEB_PUSH_USER_PREFERENCES_KEY])[WEB_PUSH_USER_PREFERENCES_KEY] : void 0;
			const user = normalizeWebPushNotificationPreferences(storedUser);
			respond(true, {
				durableIdentity: Boolean(currentProfileId),
				user,
				device: subscription.devicePreferences,
				effective: resolveEffectiveWebPushPreferences({
					user,
					device: subscription.devicePreferences
				})
			}, void 0);
		});
	},
	"push.web.preferences.set": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateWebPushPreferencesSetParams, "push.web.preferences.set", respond)) return;
		await withAuthorizedWebPushSubscription(params.endpoint, options, (authorized) => {
			const { subscription } = authorized;
			const currentProfileId = authorized.assertCurrent();
			if (!hasValidWebPushQuietHoursTimeZone(params.preferences)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid notification quiet-hours time zone"));
				return;
			}
			if (params.scope === "user") {
				if (!currentProfileId) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "user defaults require a durable authenticated profile"));
					return;
				}
				const preferences = normalizeWebPushNotificationPreferences(params.preferences);
				if (!setUserPreferences(currentProfileId, { ["notifications.web.v1"]: preferences }).ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "could not save notification preferences"));
					return;
				}
				respond(true, {
					scope: "user",
					preferences
				}, void 0);
				const connIds = context.getClientConnIds?.((connectedClient) => {
					const connectedProfileId = connectedClient.authenticatedUserProfile?.profileId;
					return Boolean(connectedProfileId && resolveUserProfileId(connectedProfileId) === currentProfileId);
				});
				if (connIds?.size) context.broadcastToConnIds("users.prefs.changed", {
					profileId: currentProfileId,
					keys: [WEB_PUSH_USER_PREFERENCES_KEY]
				}, connIds);
				return;
			}
			const preferences = normalizeWebPushDevicePreferences(params.preferences);
			return setWebPushSubscriptionPreferences({
				endpoint: params.endpoint,
				preferences,
				expectedDeviceId: subscription.deviceId,
				expectedUserProfileId: subscription.userProfileId,
				guard: authorized.prepareMutation()
			}).then((updated) => {
				if (!updated) {
					respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "subscription binding changed"));
					return;
				}
				respond(true, {
					scope: "device",
					preferences
				}, void 0);
			});
		});
	},
	"push.web.test": async ({ params, respond }) => {
		if (!assertValidParams(params, validateWebPushTestParams, "push.web.test", respond)) return;
		const title = normalizeOptionalString(params.title) ?? "OpenClaw";
		const body = normalizeOptionalString(params.body) ?? "Web push test notification";
		await respondUnavailableOnThrow(respond, async () => {
			const results = await broadcastWebPush({
				title,
				body
			});
			if (results.length === 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "no web push subscriptions registered"));
				return;
			}
			if (!results.some((result) => result.ok)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "all web push deliveries failed", { details: { results } }));
				return;
			}
			respond(true, { results }, void 0);
		});
	}
};
//#endregion
export { pushHandlers };
