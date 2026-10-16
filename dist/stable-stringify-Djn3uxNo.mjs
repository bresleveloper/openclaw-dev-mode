//#region packages/normalization-core/src/stable-stringify.ts
const preserveString = (value) => value;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
function stableStringify(value, normalizeString = preserveString) {
	return stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString);
}
/** Writes the same deterministic text without retaining completed container strings. */
function writeStableStringify(value, write, normalizeString = preserveString) {
	write(stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString, write));
}
function stringifyStableValue(value, stack, normalizeString, write) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "number" && !Number.isFinite(value)) return JSON.stringify(String(value));
	if (typeof value === "bigint") return JSON.stringify(value.toString());
	if (typeof value === "string") return JSON.stringify(normalizeString(value));
	if (typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (stack.has(value)) return JSON.stringify("[Circular]");
	stack.add(value);
	try {
		return stringifyObjectValue(value, stack, normalizeString, write);
	} finally {
		stack.delete(value);
	}
}
function stringifyObjectValue(value, stack, normalizeString, write) {
	if (value instanceof Error) return stringifyStableValue({
		name: value.name,
		message: value.message,
		stack: value.stack
	}, stack, normalizeString, write);
	if (value instanceof Uint8Array) return stringifyStableValue({
		type: "Uint8Array",
		data: encodeBase64(value)
	}, stack, normalizeString, write);
	if (Array.isArray(value)) {
		if (write) {
			write("[");
			let separator = "";
			for (const entry of value) {
				write(separator);
				write(stringifyStableValue(entry, stack, normalizeString, write));
				separator = ",";
			}
			write("]");
			return "";
		}
		const serializedEntries = [];
		for (const entry of value) serializedEntries.push(stringifyStableValue(entry, stack, normalizeString));
		return `[${serializedEntries.join(",")}]`;
	}
	const record = value;
	const keys = Object.keys(record);
	const fields = normalizeString === preserveString ? keys.sort() : keys.map((key) => ({
		key,
		normalizedKey: normalizeString(key)
	})).sort((left, right) => {
		return compareStableStrings(left.normalizedKey, right.normalizedKey) || compareStableStrings(left.key, right.key);
	});
	write?.("{");
	const serializedFields = normalizeString === preserveString ? keys : [];
	let separator = "";
	let fieldIndex = 0;
	for (const field of fields) {
		const key = typeof field === "string" ? field : field.key;
		const prefix = `${JSON.stringify(typeof field === "string" ? field : field.normalizedKey)}:`;
		if (write) {
			write(`${separator}${prefix}`);
			write(stringifyStableValue(record[key], stack, normalizeString, write));
			separator = ",";
		} else serializedFields[fieldIndex++] = `${prefix}${stringifyStableValue(record[key], stack, normalizeString)}`;
	}
	if (write) {
		write("}");
		return "";
	}
	return `{${serializedFields.join(",")}}`;
}
function encodeBase64(value) {
	let binary = "";
	for (const byte of value) binary += String.fromCharCode(byte);
	return btoa(binary);
}
function compareStableStrings(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
//#endregion
export { writeStableStringify as n, stableStringify as t };
