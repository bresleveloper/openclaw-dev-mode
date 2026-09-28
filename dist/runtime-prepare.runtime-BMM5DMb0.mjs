import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { d as pushWarning, i as createResolverContext, n as collectRuntimeSecretInputAssignment, t as applyResolvedAssignments } from "./runtime-shared-Bpp2PLaL.mjs";
import { r as resolveSecretRefValues } from "./resolve-C3ItmvEK.mjs";
import { t as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-B9HL0H0Z.mjs";
import { i as resolveAuthProfileEligibility } from "./order-BQhYF772.mjs";
import { t as assertNoOAuthSecretRefPolicyViolations } from "./policy-CoCmy1H-.mjs";
import { t as collectConfigAssignments } from "./runtime-config-collectors-Du-bwAGl.mjs";
import { a as setSecretAssignmentSource } from "./runtime-owner-assignments-BYV-lno2.mjs";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-DW-KbzXj.mjs";
//#region src/secrets/runtime-auth-collectors.ts
/** Collects auth-profile and OAuth secret refs for runtime preparation. */
function resolveAuthProfileOwnerContract(profile, context) {
	const providerId = normalizeOptionalLowercaseString(profile.provider) ?? profile.provider;
	const configuredProvider = Object.entries(context.sourceConfig.models?.providers ?? {}).find(([candidateId]) => (normalizeOptionalLowercaseString(candidateId) ?? candidateId) === providerId);
	return {
		profile: structuredClone(profile),
		providerId,
		configuredProvider
	};
}
function collectAuthStoreSecretInputAssignment(params) {
	const previousCount = params.context.assignments.length;
	collectRuntimeSecretInputAssignment(params);
	for (const assignment of params.context.assignments.slice(previousCount)) setSecretAssignmentSource(assignment, "auth-store");
}
function collectStaticProfileAssignment(params) {
	const ownerContract = resolveAuthProfileOwnerContract(params.profile, params.context);
	const profile = params.profile;
	const field = profile.type === "api_key" ? "key" : "token";
	const { explicitRef, inlineRef, ref } = resolveSecretInputRef({
		value: profile.type === "api_key" ? profile.key : profile.token,
		refValue: profile.type === "api_key" ? profile.keyRef : profile.tokenRef,
		defaults: params.defaults
	});
	if (!ref) return;
	if (!explicitRef && inlineRef) {
		if (profile.type === "api_key") profile.keyRef = inlineRef;
		else profile.tokenRef = inlineRef;
	}
	if (explicitRef && isNonEmptyString(profile.type === "api_key" ? profile.key : profile.token)) pushWarning(params.context, {
		code: "SECRETS_REF_OVERRIDES_PLAINTEXT",
		path: `${params.agentDir}.auth-profiles.${params.profileId}.${field}`,
		message: `auth-profiles ${params.profileId}: ${field}Ref is set; runtime will ignore plaintext ${field}.`
	});
	const setValue = profile.type === "api_key" ? (value) => {
		profile.key = value;
	} : (value) => {
		profile.token = value;
	};
	setValue(void 0);
	const eligibility = resolveAuthProfileEligibility({
		cfg: params.context.sourceConfig,
		authAliasLookupParams: params.authAliasLookupParams,
		store: params.store,
		provider: profile.provider,
		profileId: params.profileId
	});
	collectAuthStoreSecretInputAssignment({
		value: ref,
		path: `${params.agentDir}.auth-profiles.${params.profileId}.${field}`,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: eligibility.eligible,
		inactiveReason: `auth profile is not eligible (${eligibility.reasonCode}); skipping resolution until it becomes eligible.`,
		owner: {
			ownerKind: "account",
			ownerId: resolveAuthProfileSecretOwnerId(params),
			requiredForGateway: false,
			disposition: "isolate",
			contract: ownerContract
		},
		apply: (value) => {
			setValue(String(value));
		},
		applyUnavailable: () => {
			setValue(void 0);
		}
	});
}
/** Collects SecretRef assignments from agent auth-profile stores for runtime materialization. */
function collectAuthStoreAssignments(params) {
	assertNoOAuthSecretRefPolicyViolations({
		store: params.store,
		cfg: params.context.sourceConfig,
		context: `auth-profiles ${params.agentDir}`
	});
	const defaults = params.context.sourceConfig.secrets?.defaults;
	const authAliasLookupParams = {
		env: params.context.env,
		...params.context.manifestRegistry ? { metadataSnapshot: params.context.manifestRegistry } : {}
	};
	for (const [profileId, profile] of Object.entries(params.store.profiles)) if (profile.type === "api_key" || profile.type === "token") collectStaticProfileAssignment({
		profile,
		profileId,
		store: params.store,
		agentDir: params.agentDir,
		defaults,
		authAliasLookupParams,
		context: params.context
	});
}
//#endregion
export { applyResolvedAssignments, collectAuthStoreAssignments, collectConfigAssignments, createResolverContext, resolveRuntimeWebTools, resolveSecretRefValues };
