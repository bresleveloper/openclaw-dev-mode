import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { Jn as string, Lt as boolean, Pn as number, Un as record, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
//#region src/state/user-model-account-id.ts
const UUID_PATTERN = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}";
const PERSONAL_AUTH_PROFILE_PATTERN = new RegExp(`^personal:(${UUID_PATTERN}|${GATEWAY_OWNER_PROFILE_ID}):${UUID_PATTERN}$`, "u");
function isUserModelAuthProfileId(authProfileId) {
	return parseUserModelAuthProfileId(authProfileId) !== void 0;
}
/** A storage locator only; the live owner and exact credential still need to exist. */
function parseUserModelAuthProfileId(authProfileId) {
	const ownerProfileId = PERSONAL_AUTH_PROFILE_PATTERN.exec(authProfileId)?.[1];
	return ownerProfileId ? { ownerProfileId } : void 0;
}
//#endregion
//#region src/agents/auth-profiles/credential-schema.ts
/** Provider-owned fields retained with OAuth material through storage and refresh. */
const oauthCredentialMetadataSchema = strictObject({
	idToken: string().optional(),
	clientId: string().optional(),
	enterpriseUrl: string().optional(),
	projectId: string().optional(),
	accountId: string().optional(),
	chatgptPlanType: string().optional(),
	/** Non-secret subscription plan captured from external CLI logins. */
	subscriptionType: string().optional(),
	/** Non-secret rate-limit tier captured from external CLI logins. */
	rateLimitTier: string().optional(),
	tokenEndpoint: string().optional(),
	deviceAuthorizationEndpoint: string().optional(),
	issuer: string().optional(),
	authFlow: string().optional()
});
const literalSecretSchema = string().min(1).refine((value) => coerceSecretRef(value) === null, "A literal credential is required.");
const normalizedSecretSchema = string().transform(normalizeSecretInput).pipe(literalSecretSchema);
const commonCredentialFields = {
	provider: string().min(1),
	email: string().optional(),
	displayName: string().optional(),
	copyToAgents: boolean().optional()
};
/** Current inline credentials, without legacy aliases or host-owned secret references. */
const inlineAuthProfileCredentialSchema = discriminatedUnion("type", [
	strictObject({
		...commonCredentialFields,
		type: literal("api_key"),
		key: normalizedSecretSchema,
		metadata: record(string(), string()).optional()
	}),
	strictObject({
		...commonCredentialFields,
		type: literal("token"),
		token: normalizedSecretSchema,
		expires: number().positive().optional()
	}),
	strictObject({
		...commonCredentialFields,
		...oauthCredentialMetadataSchema.shape,
		type: literal("oauth"),
		access: literalSecretSchema,
		refresh: literalSecretSchema,
		expires: number().positive()
	})
]);
//#endregion
//#region src/agents/auth-profiles/profile-usage-stats.ts
const AUTH_FAILURE_REASONS = /* @__PURE__ */ new Set([
	"auth",
	"auth_permanent",
	"format",
	"overloaded",
	"rate_limit",
	"billing",
	"timeout",
	"model_not_found",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
]);
const AUTH_COOLDOWN_CLASSIFICATIONS = /* @__PURE__ */ new Set(["wham_token_expired", "wham_account_dead"]);
const AUTH_BLOCKED_REASONS = /* @__PURE__ */ new Set(["subscription_limit"]);
const AUTH_BLOCKED_SOURCES = /* @__PURE__ */ new Set(["codex_rate_limits", "wham"]);
function normalizeEnumValue(value, allowed) {
	for (const candidate of allowed) if (candidate === value) return candidate;
}
function normalizeFailureCounts(raw) {
	if (!isRecord(raw)) return;
	const normalized = {};
	for (const [rawReason, count] of Object.entries(raw)) {
		const reason = normalizeEnumValue(rawReason, AUTH_FAILURE_REASONS);
		if (reason === void 0) continue;
		if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
		normalized[reason] = Math.trunc(count);
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Normalizes one credential owner's persisted cooldown and usage record. */
function coerceProfileUsageStats(raw) {
	if (!isRecord(raw)) return;
	const cooldownReason = normalizeEnumValue(raw.cooldownReason, AUTH_FAILURE_REASONS);
	const cooldownClassification = normalizeEnumValue(raw.cooldownClassification, AUTH_COOLDOWN_CLASSIFICATIONS);
	const stats = {};
	function setStat(key, value) {
		if (value !== void 0) stats[key] = value;
	}
	setStat("lastUsed", asFiniteNumber(raw.lastUsed));
	setStat("blockedUntil", asFiniteNumber(raw.blockedUntil));
	setStat("blockedReason", normalizeEnumValue(raw.blockedReason, AUTH_BLOCKED_REASONS));
	setStat("blockedSource", normalizeEnumValue(raw.blockedSource, AUTH_BLOCKED_SOURCES));
	setStat("blockedModel", normalizeOptionalString(raw.blockedModel));
	setStat("blockedScope", raw.blockedScope === "model" ? "model" : void 0);
	setStat("cooldownUntil", asFiniteNumber(raw.cooldownUntil));
	setStat("cooldownReason", cooldownReason);
	setStat("cooldownClassification", cooldownClassification === "wham_token_expired" && cooldownReason === "auth" || cooldownClassification === "wham_account_dead" && cooldownReason === "auth_permanent" ? cooldownClassification : void 0);
	setStat("cooldownModel", normalizeOptionalString(raw.cooldownModel));
	setStat("disabledUntil", asFiniteNumber(raw.disabledUntil));
	setStat("disabledReason", normalizeEnumValue(raw.disabledReason, AUTH_FAILURE_REASONS));
	setStat("errorCount", asFiniteNumber(raw.errorCount));
	setStat("failureCounts", normalizeFailureCounts(raw.failureCounts));
	setStat("lastFailureAt", asFiniteNumber(raw.lastFailureAt));
	setStat("lastProbeAt", asFiniteNumber(raw.lastProbeAt));
	return Object.keys(stats).length > 0 ? stats : void 0;
}
//#endregion
export { parseUserModelAuthProfileId as a, isUserModelAuthProfileId as i, inlineAuthProfileCredentialSchema as n, oauthCredentialMetadataSchema as r, coerceProfileUsageStats as t };
