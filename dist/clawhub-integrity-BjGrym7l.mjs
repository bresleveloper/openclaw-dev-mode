//#region src/infra/clawhub-integrity.ts
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
function normalizeClawHubSha256Integrity(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const prefixedBase64 = /^sha256-([A-Za-z0-9+/]+={0,1})$/.exec(trimmed);
	if (prefixedBase64?.[1]) {
		try {
			const decoded = Buffer.from(prefixedBase64[1], "base64");
			if (decoded.length === 32) return `sha256-${decoded.toString("base64")}`;
		} catch {
			return null;
		}
		return null;
	}
	const hex = /^(?:sha256:)?([A-Fa-f0-9]{64})$/.exec(trimmed)?.[1];
	return hex ? `sha256-${Buffer.from(hex, "hex").toString("base64")}` : null;
}
/** Normalizes ClawHub SHA-256 metadata into lowercase hex form. */
function normalizeClawHubSha256Hex(value) {
	const trimmed = value.trim();
	if (!/^[A-Fa-f0-9]{64}$/.test(trimmed)) return null;
	return trimmed.toLowerCase();
}
//#endregion
export { normalizeClawHubSha256Integrity as n, normalizeClawHubSha256Hex as t };
