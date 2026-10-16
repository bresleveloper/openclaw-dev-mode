import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/gateway/serialized-json.ts
const serializedArrays = /* @__PURE__ */ new WeakMap();
/** Register an immutable RPC array with its owner's already encoded row bytes. */
function registerSerializedJsonArray(values, encodedRows) {
	serializedArrays.set(values, Buffer.from(`[${encodedRows.join(",")}]`));
	return values;
}
function arrayBytes(value) {
	return value instanceof SerializedJsonArray ? value.bytes : Array.isArray(value) ? serializedArrays.get(value) : void 0;
}
/** The history worker owns these already-validated JSON array bytes. */
var SerializedJsonArray = class {
	constructor(bytes) {
		this.bytes = bytes;
	}
	materialize() {
		const { bytes } = this;
		const value = JSON.parse(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("utf8"));
		if (!Array.isArray(value)) throw new TypeError("Serialized history JSON must contain an array");
		return value;
	}
	toJSON() {
		return this.materialize();
	}
};
function fieldJson(key, value) {
	return JSON.stringify({ [key]: value }).slice(1, -1);
}
function serializeGatewayFrame(value) {
	const frame = asOptionalRecord(value);
	const payload = frame?.type === "res" ? asOptionalRecord(frame.payload) : void 0;
	const arrayOwner = [payload, payload && asOptionalRecord(Object.getOwnPropertyDescriptor(payload, "list")?.value)].find((record) => record && typeof record.toJSON !== "function" && Object.keys(record).some((key) => arrayBytes(Object.getOwnPropertyDescriptor(record, key)?.value)));
	if (!frame || !payload || typeof frame.toJSON === "function" || typeof payload.toJSON === "function" || !arrayOwner) return JSON.stringify(value);
	const chunks = [];
	const appendObject = (record) => {
		chunks.push(Buffer.from("{"));
		let separator = "";
		for (const key of Object.keys(record)) {
			const field = record[key];
			const rawArray = record === arrayOwner ? arrayBytes(field) : void 0;
			const nestedPayload = field === payload ? payload : field === arrayOwner ? arrayOwner : void 0;
			const encoded = rawArray || nestedPayload ? `${JSON.stringify(key)}:` : fieldJson(key, field);
			if (!encoded) continue;
			chunks.push(Buffer.from(`${separator}${encoded}`));
			separator = ",";
			if (rawArray) chunks.push(rawArray);
			else if (nestedPayload) appendObject(nestedPayload);
		}
		chunks.push(Buffer.from("}"));
	};
	appendObject(frame);
	return Buffer.concat(chunks);
}
//#endregion
export { registerSerializedJsonArray as n, serializeGatewayFrame as r, SerializedJsonArray as t };
