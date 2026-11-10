import { c as normalizeOptionalLowercaseString, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import "./shared-BVDjoVcf.mjs";
import { a as createResolverContext, f as pushWarning, n as collectCanonicalSecretInputAssignment, t as applyResolvedAssignments } from "./runtime-shared-DqMZ_k3n.mjs";
import { i as resolveAuthProfileEligibility } from "./order-CElLtwMu.mjs";
import { r as resolveSecretRefValues } from "./resolve-D1-YVpS6.mjs";
import { n as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-VtWriAt2.mjs";
import { t as assertNoOAuthSecretRefPolicyViolations } from "./policy-CamhZ068.mjs";
import { t as collectConfigAssignments } from "./runtime-config-collectors-Dsjmtog2.mjs";
import { a as setSecretAssignmentSource } from "./runtime-owner-assignments-CIOjtWgV.mjs";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-6rNTYk8t.mjs";
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
	collectCanonicalSecretInputAssignment(params);
	for (const assignment of params.context.assignments.slice(previousCount)) setSecretAssignmentSource(assignment, "auth-store");
}
function collectStaticProfileAssignment(params) {
	const ownerContract = resolveAuthProfileOwnerContract(params.profile, params.context);
	const profile = params.profile;
	const field = profile.type === "api_key" ? "key" : "token";
	const explicitRef = parseSecretRef(profile.type === "api_key" ? profile.keyRef : profile.tokenRef, params.defaults);
	const inlineRef = explicitRef ? null : parseSecretRef(profile.type === "api_key" ? profile.key : profile.token, params.defaults);
	const ref = explicitRef ?? inlineRef;
	if (!ref) return;
	if (!explicitRef && inlineRef) {
		if (profile.type === "api_key") profile.keyRef = inlineRef;
		else profile.tokenRef = inlineRef;
	}
	if (explicitRef && hasNonEmptyString(profile.type === "api_key" ? profile.key : profile.token)) pushWarning(params.context, {
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
