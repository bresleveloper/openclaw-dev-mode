//#region src/config/redact-snapshot.secret-ref.ts
/** Narrows plain objects that carry the minimum SecretRef fields used by redaction. */
function isSecretRefShape(value) {
	return typeof value.source === "string" && typeof value.id === "string";
}
/** Redacts a SecretRef id while preserving non-secret structural fields for restore matching. */
function redactSecretRefId(params) {
	const { value, values, redactedSentinel, isEnvVarPlaceholder } = params;
	const redacted = { ...value };
	if (!isEnvVarPlaceholder(value.id)) {
		values.push(value.id);
		redacted.id = redactedSentinel;
	}
	return redacted;
}
//#endregion
export { redactSecretRefId as n, isSecretRefShape as t };
