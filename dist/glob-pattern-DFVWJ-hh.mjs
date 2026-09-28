//#region src/agents/glob-pattern.ts
function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function compileGlobPattern(params) {
	const normalized = params.normalize(params.raw);
	if (!normalized) return {
		kind: "exact",
		value: ""
	};
	if (normalized === "*") return { kind: "all" };
	if (!normalized.includes("*")) return {
		kind: "exact",
		value: normalized
	};
	return {
		kind: "regex",
		value: new RegExp(`^${escapeRegex(normalized).replaceAll("\\*", ".*")}$`)
	};
}
function compileGlobPatterns(params) {
	if (!Array.isArray(params.raw)) return [];
	return params.raw.map((raw) => compileGlobPattern({
		raw,
		normalize: params.normalize
	})).filter((pattern) => pattern.kind !== "exact" || pattern.value);
}
function matchesAnyGlobPattern(value, patterns) {
	for (const pattern of patterns) {
		if (pattern.kind === "all") return true;
		if (pattern.kind === "exact" && value === pattern.value) return true;
		if (pattern.kind === "regex" && pattern.value.test(value)) return true;
	}
	return false;
}
/** Conservative discovery hint; concrete values still need the full glob matcher. */
function mayMatchGlobWithPrefix(pattern, prefix) {
	const wildcard = pattern.indexOf("*");
	if (wildcard < 0) return false;
	const literalHead = pattern.slice(0, wildcard);
	return prefix.startsWith(literalHead) || literalHead.startsWith(prefix);
}
//#endregion
export { matchesAnyGlobPattern as n, mayMatchGlobWithPrefix as r, compileGlobPatterns as t };
