//#region src/auto-reply/reply/config-value.ts
function parseConfigValue(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return { error: "Missing value." };
	const structured = trimmed.startsWith("{") || trimmed.startsWith("[");
	const quoted = trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'");
	if (structured || quoted) try {
		return { value: JSON.parse(trimmed) };
	} catch (err) {
		return structured ? { error: `Invalid JSON: ${String(err)}` } : { value: trimmed.slice(1, -1) };
	}
	if (trimmed === "true" || trimmed === "false" || trimmed === "null") return { value: trimmed === "null" ? null : trimmed === "true" };
	if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
		const num = Number(trimmed);
		if (Number.isFinite(num)) return { value: num };
	}
	return { value: trimmed };
}
//#endregion
export { parseConfigValue as t };
