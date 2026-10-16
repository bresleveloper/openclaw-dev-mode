//#region src/secrets/resolve-errors.ts
/** Error for failures that affect an entire configured secret provider. */
var SecretProviderResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "provider";
		this.name = "SecretProviderResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
	}
};
/** Error for failures limited to one SecretRef id under a provider. */
var SecretRefResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "ref";
		this.name = "SecretRefResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
		this.refId = params.refId;
	}
};
/** Type guard for provider-scoped secret resolution failures. */
function isProviderScopedSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError;
}
function isSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError || value instanceof SecretRefResolutionError;
}
/** Redacted reason suitable for warnings and status output. */
function describeSecretResolutionError(value) {
	if (value instanceof SecretProviderResolutionError) return value.code === "SECRET_PROVIDER_UNAVAILABLE" || value.code === "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE" ? "secret provider failed" : void 0;
	if (!(value instanceof SecretRefResolutionError)) return;
	switch (value.code) {
		case "SECRET_REF_NOT_FOUND": return "secret reference was not found";
		case "SECRET_REF_POLICY_DENIED": return "secret provider policy denied resolution";
		case "SECRET_REF_PROVIDER_ERROR": return "secret provider failed";
		case "SECRET_REF_PROVIDER_CONTRACT": return "secret provider response violated its contract";
		case "SECRET_REF_REDACTED_VALUE": return "resolved secret value is a redaction placeholder";
		case "SECRET_REF_INVALID": return;
	}
}
/** Sanitized provider detail suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorDiagnostic(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return `Secret reference "${value.source}:${value.provider}:${value.refId}" resolves to a redaction placeholder`;
	if (value instanceof SecretProviderResolutionError && value.code === "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return "Windows path security could not be verified";
}
/** Sanitized recovery action suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorRecovery(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return "Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets, then restart the Gateway and reconnect or re-pair clients";
	if (!(value instanceof SecretProviderResolutionError) || value.code !== "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return;
	return value.source === "exec" ? "Restore Windows path security verification, or use an existing provider command whose owner and ACLs OpenClaw can verify" : "Restore Windows path security verification, or use an existing secret file whose owner and ACLs OpenClaw can verify";
}
function providerResolutionError(params) {
	return new SecretProviderResolutionError({
		...params,
		code: params.code ?? "SECRET_PROVIDER_UNAVAILABLE"
	});
}
function refResolutionError(params) {
	return new SecretRefResolutionError(params);
}
/** Returns whether one SecretRef failed because its configured value is absent. */
function isMissingSecretRefResolutionError(params) {
	const refId = params.ref.id.trim();
	return params.error instanceof SecretRefResolutionError && params.error.code === "SECRET_REF_NOT_FOUND" && params.error.source === params.ref.source && params.error.provider === params.ref.provider && params.error.refId === refId;
}
//#endregion
export { isProviderScopedSecretResolutionError as a, refResolutionError as c, isMissingSecretRefResolutionError as i, describeSecretResolutionOperatorDiagnostic as n, isSecretResolutionError as o, describeSecretResolutionOperatorRecovery as r, providerResolutionError as s, describeSecretResolutionError as t };
