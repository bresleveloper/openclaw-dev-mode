import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { _ as secretRefKey } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-CSuKIPux.mjs";
import { t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { createHash } from "node:crypto";
//#region src/secrets/runtime-owner-contract.ts
/** Process-local identity for the non-secret config that an owner may use with a credential. */
/** Normalizes equivalent SecretRef input forms before hashing owner config. */
function canonicalizeSecretRefsForOwnerContract(value, defaults) {
	const ref = coerceSecretRef(value, defaults);
	if (ref) return { secretRef: secretRefKey(ref) };
	if (Array.isArray(value)) return value.map((entry) => canonicalizeSecretRefsForOwnerContract(entry, defaults));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, canonicalizeSecretRefsForOwnerContract(entry, defaults)]));
}
/**
* Binds last-known-good credentials to their complete owner config. The digest is
* process-local metadata only; raw config and credential-bearing values are never logged.
*/
function digestSecretOwnerContract(value) {
	return createHash("sha256").update(stableStringify(value)).digest("hex");
}
/** Combines assignment fragments into one deterministic owner contract. */
function combineSecretOwnerContractDigests(digests) {
	const unique = [...new Set(digests)].toSorted();
	return unique.length > 0 ? digestSecretOwnerContract(unique) : void 0;
}
/** Binds a web credential to both tool selection and its owning plugin config. */
function digestRuntimeWebOwnerContract(params) {
	const provider = params.providers.find((entry) => entry.id === params.providerId);
	const pluginId = provider?.pluginId;
	return digestSecretOwnerContract(canonicalizeSecretRefsForOwnerContract({
		scopePath: params.scopePath,
		configuredProvider: params.configuredProvider,
		toolConfig: params.toolConfig,
		provider,
		pluginConfig: pluginId ? params.sourceConfig.plugins?.entries?.[pluginId]?.config : void 0
	}, params.sourceConfig.secrets?.defaults));
}
//#endregion
//#region src/secrets/secret-value.ts
/** Validates resolved secret values against expected value shapes. */
/**
* Returns whether a resolved provider value satisfies the target's accepted runtime shape.
*/
function isExpectedResolvedSecretValue(value, expected) {
	if (expected === "string") return isNonEmptyString(value);
	return isNonEmptyString(value) || isRecord(value);
}
/**
* Returns whether an inline configured value should be treated as plaintext secret material.
*/
function hasConfiguredPlaintextSecretValue(value, expected) {
	if (expected === "string") return isNonEmptyString(value);
	return isNonEmptyString(value) || isRecord(value) && Object.keys(value).length > 0;
}
/**
* Throws a caller-provided error when a resolved secret value does not match its target shape.
*/
function assertExpectedResolvedSecretValue(params) {
	if (!isExpectedResolvedSecretValue(params.value, params.expected)) throw new Error(params.errorMessage);
}
//#endregion
//#region src/secrets/runtime-shared.ts
/** Shared secrets runtime resolver context, assignments, and warning helpers. */
var SecretAssignmentValidationError = class extends Error {
	constructor(params) {
		super(params.error.message, { cause: params.error });
		this.name = "SecretAssignmentValidationError";
		this.failures = params.failures.map((failure) => ({ ...failure }));
	}
};
/** Returns every assignment whose resolved value failed its target shape contract. */
function getSecretAssignmentValidationFailures(error) {
	if (!(error instanceof SecretAssignmentValidationError)) return [];
	return error.failures.map((failure) => ({ ...failure }));
}
/**
* Creates the mutable collection context used while preparing a secrets runtime snapshot.
*/
function createResolverContext(params) {
	return {
		sourceConfig: params.sourceConfig,
		env: params.env,
		cache: {},
		...params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {},
		warnings: [],
		warningKeys: /* @__PURE__ */ new Set(),
		assignments: []
	};
}
/**
* Records a SecretRef assignment that should be resolved and applied later.
*/
function pushAssignment(context, assignment) {
	context.assignments.push(assignment);
}
/**
* Records a resolver warning once per code/path/message tuple.
*/
function pushWarning(context, warning) {
	const warningKey = `${warning.code}:${warning.path}:${warning.message}`;
	if (context.warningKeys.has(warningKey)) return;
	context.warningKeys.add(warningKey);
	context.warnings.push(warning);
}
/**
* Emits the standard warning for refs configured on currently inactive surfaces.
*/
function pushInactiveSurfaceWarning(params) {
	pushWarning(params.context, {
		code: "SECRETS_REF_IGNORED_INACTIVE_SURFACE",
		path: params.path,
		message: params.details && params.details.trim().length > 0 ? `${params.path}: ${params.details}` : `${params.path}: secret ref is configured on an inactive surface; skipping resolution until it becomes active.`
	});
}
/**
* Converts an inline SecretInput value into a deferred assignment when its surface is active.
*/
function collectSecretInputAssignment(params) {
	collectRuntimeSecretInputAssignment(params);
}
/** Internal owner-aware variant used while migrating runtime surfaces to isolation. */
function collectRuntimeSecretInputAssignment(params) {
	const ref = resolveConfigSecretRef({
		config: params.context.sourceConfig,
		path: params.path,
		value: params.value,
		defaults: params.defaults
	});
	if (!ref) return;
	if (params.active === false) {
		pushInactiveSurfaceWarning({
			context: params.context,
			path: params.path,
			details: params.inactiveReason
		});
		return;
	}
	pushAssignment(params.context, {
		ref,
		path: params.path,
		expected: params.expected,
		ownerKind: params.owner?.ownerKind ?? "unknown",
		ownerId: params.owner?.ownerId ?? params.path,
		requiredForGateway: params.owner?.requiredForGateway ?? false,
		disposition: params.owner?.disposition ?? "isolate",
		...params.owner?.contract !== void 0 ? { ownerContractDigest: digestSecretOwnerContract(canonicalizeSecretRefsForOwnerContract(params.owner.contract, params.defaults)) } : {},
		apply: params.apply,
		...params.applyUnavailable ? { applyUnavailable: params.applyUnavailable } : {}
	});
}
/**
* Applies resolved SecretRef values to their collected config targets with shape validation.
*/
function applyResolvedAssignments(params) {
	const values = [];
	const failures = [];
	let firstValidationError;
	for (const assignment of params.assignments) {
		const key = secretRefKey(assignment.ref);
		if (!params.resolved.has(key)) throw new Error(`Secret reference "${key}" resolved to no value.`);
		const value = params.resolved.get(key);
		try {
			assertExpectedResolvedSecretValue({
				value,
				expected: assignment.expected,
				errorMessage: assignment.expected === "string" ? `${assignment.path} resolved to a non-string or empty value.` : `${assignment.path} resolved to an unsupported value type.`
			});
		} catch (error) {
			const validationError = error instanceof Error ? error : new Error(String(error));
			firstValidationError ??= validationError;
			failures.push({
				ownerKind: assignment.ownerKind,
				ownerId: assignment.ownerId,
				expected: assignment.expected,
				refKey: key
			});
		}
		values.push(value);
	}
	if (firstValidationError) throw new SecretAssignmentValidationError({
		error: firstValidationError,
		failures
	});
	for (const [index, assignment] of params.assignments.entries()) assignment.apply(values[index]);
}
/**
* Own-property helper used by config collectors that receive unknown object shapes.
*/
function hasOwnProperty(record, key) {
	return Object.hasOwn(record, key);
}
/**
* Treats missing or non-object enabled state as enabled by default.
*/
function isEnabledFlag(value) {
	if (!isRecord(value)) return true;
	return value.enabled !== false;
}
/**
* Returns whether both a channel and one account are enabled for secret resolution.
*/
function isChannelAccountEffectivelyEnabled(channel, account) {
	return isEnabledFlag(channel) && isEnabledFlag(account);
}
//#endregion
export { getSecretAssignmentValidationFailures as a, isEnabledFlag as c, pushWarning as d, assertExpectedResolvedSecretValue as f, digestRuntimeWebOwnerContract as g, combineSecretOwnerContractDigests as h, createResolverContext as i, pushAssignment as l, isExpectedResolvedSecretValue as m, collectRuntimeSecretInputAssignment as n, hasOwnProperty as o, hasConfiguredPlaintextSecretValue as p, collectSecretInputAssignment as r, isChannelAccountEffectivelyEnabled as s, applyResolvedAssignments as t, pushInactiveSurfaceWarning as u };
