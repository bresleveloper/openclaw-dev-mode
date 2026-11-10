import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { n as checkGatewayWsBrowserOrigin } from "./origin-check-DI_7InMd.mjs";
import { i as resolveGatewayAuthForConfig } from "./auth-resolve-BLx2Z8Ad.mjs";
import { n as sourceRolePolicies } from "./operator-role-source-policy-BO9lXFYe.mjs";
import { t as resolveIdentityOperatorScopes } from "./operator-identity-scopes-IJD0CgVb.mjs";
//#region src/gateway/auth-policy.ts
const policies = /* @__PURE__ */ new WeakMap();
/** Capture the grant principal together with its generation; null means no identity-derived scopes. */
function captureGatewayAuthPolicy(config, principal) {
	const verifiedIdentity = normalizeOptionalString(principal?.verifiedIdentity);
	const role = principal?.role;
	const authMethod = principal?.authMethod;
	const authModeOverride = principal?.authModeOverride;
	const browserOrigin = principal?.browserOrigin;
	const contextualIngress = browserOrigin?.remoteControlUiIngress !== void 0;
	let cached = policies.get(config);
	if (!cached) {
		const gateway = config.gateway;
		const trustedProxy = gateway?.auth?.trustedProxy;
		cached = {
			global: stableStringify({
				roles: sourceRolePolicies(gateway?.roles),
				trustedProxies: gateway?.trustedProxies?.toSorted(),
				allowRealIpFallback: gateway?.allowRealIpFallback,
				allowTailscale: gateway?.auth?.allowTailscale,
				trustedProxy: trustedProxy && {
					...trustedProxy,
					requiredHeaders: (trustedProxy.requiredHeaders ?? []).toSorted(),
					allowUsers: (trustedProxy.allowUsers ?? []).toSorted()
				}
			}),
			identities: /* @__PURE__ */ new Map()
		};
		policies.set(config, cached);
	}
	const principalKey = contextualIngress ? void 0 : stableStringify([
		role,
		verifiedIdentity,
		authMethod,
		authModeOverride,
		browserOrigin
	]);
	let policy = principalKey === void 0 ? void 0 : cached.identities.get(principalKey);
	if (!policy) {
		const grant = role === "operator" && verifiedIdentity ? [...new Set(resolveIdentityOperatorScopes(verifiedIdentity, config.gateway?.auth?.identityScopes))].toSorted() : void 0;
		let methodEnabled;
		let proxyUserAllowed;
		let fallbackCredentialGeneration;
		if (authMethod === "trusted-proxy" || authMethod === "tailscale" || authMethod === "none" || authMethod === "password") {
			const auth = resolveGatewayAuthForConfig({
				config,
				authOverride: authModeOverride ? { mode: authModeOverride } : void 0,
				tailscaleMode: config.gateway?.tailscale?.mode
			});
			if (authMethod === "trusted-proxy") {
				methodEnabled = auth.mode === "trusted-proxy" && auth.trustedProxy !== void 0;
				const allowUsers = auth.trustedProxy?.allowUsers;
				proxyUserAllowed = Boolean(verifiedIdentity && (!allowUsers?.length || allowUsers.includes(verifiedIdentity)));
			} else if (authMethod === "tailscale") methodEnabled = auth.allowTailscale && auth.mode !== "trusted-proxy" && auth.mode !== "none";
			else if (authMethod === "none") methodEnabled = auth.mode === "none";
			else if (auth.mode === "trusted-proxy") {
				methodEnabled = Boolean(auth.password);
				fallbackCredentialGeneration = auth.password ? sha256Base64Url(auth.password) : void 0;
			}
		}
		policy = Object.freeze({
			generation: cached.global,
			grantGeneration: stableStringify({
				grant,
				methodEnabled,
				proxyUserAllowed,
				fallbackCredentialGeneration,
				browserOriginAllowed: browserOrigin ? checkGatewayWsBrowserOrigin(browserOrigin, config).ok : void 0
			}),
			role,
			authMethod,
			authModeOverride,
			verifiedIdentity,
			browserOrigin: browserOrigin && Object.freeze({ ...browserOrigin })
		});
		if (principalKey !== void 0) cached.identities.set(principalKey, policy);
	}
	return policy;
}
function isGatewayAuthPolicyCurrent(policy, config) {
	if (!policy) return true;
	const current = config === void 0 ? readRuntimeConfig() : config;
	if (current === null) return false;
	const next = captureGatewayAuthPolicy(current, policy);
	return next.generation === policy.generation && next.grantGeneration === policy.grantGeneration;
}
/** Accepted work follows committed access grants, not a transport's need to reauthenticate. */
function isGatewayAuthGrantCurrent(policy, config) {
	if (!policy) return true;
	const current = config === void 0 ? readRuntimeConfig() : config;
	return current !== null && captureGatewayAuthPolicy(current, policy).grantGeneration === policy.grantGeneration;
}
//#endregion
export { isGatewayAuthGrantCurrent as n, isGatewayAuthPolicyCurrent as r, captureGatewayAuthPolicy as t };
