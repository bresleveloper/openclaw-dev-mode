//#region src/config/redact-snapshot.secret-ref.ts
/** Narrows plain objects that carry the minimum SecretRef fields used by redaction. */
function isSecretRefShape(value) {
	return typeof value.source === "string" && typeof value.id === "string";
}
//#endregion
export { isSecretRefShape as t };
