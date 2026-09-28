//#region src/infra/http-content-encoding.ts
const HTTP_QVALUE_PATTERN = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/;
function normalizedAcceptEncoding(value) {
	return Array.isArray(value) ? value.join(",") : value ?? "";
}
function resolveHttpContentEncodings(header, availableEncodings) {
	const acceptEncoding = normalizedAcceptEncoding(header);
	if (!acceptEncoding.trim()) return ["identity"];
	const qualities = /* @__PURE__ */ new Map();
	for (const entry of acceptEncoding.split(",")) {
		const [rawName, ...rawParams] = entry.split(";");
		const name = rawName?.trim().toLowerCase();
		if (!name) continue;
		const qualityText = rawParams.find((param) => param.trim().toLowerCase().startsWith("q="))?.trim().slice(2);
		const parsedQuality = qualityText === void 0 ? 1 : HTTP_QVALUE_PATTERN.test(qualityText) ? Number(qualityText) : NaN;
		const quality = Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1 ? parsedQuality : 0;
		qualities.set(name, Math.max(qualities.get(name) ?? 0, quality));
	}
	const wildcardQuality = qualities.get("*");
	const identityQuality = qualities.get("identity") ?? (wildcardQuality === 0 ? 0 : 1);
	const qualityFor = (name) => name === "identity" ? identityQuality : qualities.get(name) ?? wildcardQuality ?? 0;
	return [
		"br",
		"gzip",
		"identity"
	].filter((encoding) => (encoding === "identity" || availableEncodings.has(encoding)) && qualityFor(encoding) > 0).toSorted((left, right) => qualityFor(right) - qualityFor(left));
}
//#endregion
export { resolveHttpContentEncodings as t };
