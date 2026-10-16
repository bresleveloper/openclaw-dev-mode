function parseSessionLabel(raw) {
	if (typeof raw !== "string") return {
		ok: false,
		error: "invalid label: must be a string"
	};
	const trimmed = raw.trim();
	if (!trimmed) return {
		ok: false,
		error: "invalid label: empty"
	};
	if (trimmed.length > 512) return {
		ok: false,
		error: `invalid label: too long (max 512)`
	};
	return {
		ok: true,
		label: trimmed
	};
}
//#endregion
export { parseSessionLabel as t };
