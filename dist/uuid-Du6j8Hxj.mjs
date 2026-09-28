//#region packages/agent-core/src/harness/session/uuid.ts
let lastTimestamp = -Infinity;
let sequence = 0;
function fillRandomBytes(bytes) {
	const crypto = globalThis.crypto;
	if (crypto?.getRandomValues) {
		crypto.getRandomValues(bytes);
		return;
	}
	for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
}
/** Generate a monotonic UUIDv7 string. */
function uuidv7() {
	const random = /* @__PURE__ */ new Uint8Array(16);
	fillRandomBytes(random);
	const timestamp = Date.now();
	if (timestamp > lastTimestamp) {
		sequence = new DataView(random.buffer, random.byteOffset + 6, 4).getUint32(0);
		lastTimestamp = timestamp;
	} else {
		sequence = sequence + 1 >>> 0;
		if (sequence === 0) lastTimestamp++;
	}
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	bytes[0] = lastTimestamp / 1099511627776 & 255;
	bytes[1] = lastTimestamp / 4294967296 & 255;
	bytes[2] = lastTimestamp / 16777216 & 255;
	bytes[3] = lastTimestamp / 65536 & 255;
	bytes[4] = lastTimestamp / 256 & 255;
	bytes[5] = lastTimestamp & 255;
	bytes[6] = 112 | sequence >>> 28 & 15;
	bytes[7] = sequence >>> 20 & 255;
	bytes[8] = 128 | sequence >>> 14 & 63;
	bytes[9] = sequence >>> 6 & 255;
	const randomLowBits = random.at(10);
	if (randomLowBits === void 0) throw new Error("UUID random buffer is shorter than 11 bytes");
	bytes[10] = (sequence & 63) << 2 | randomLowBits & 3;
	bytes.set(random.subarray(11), 11);
	return formatUuid(bytes);
}
function formatUuid(bytes) {
	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
	return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
//#endregion
export { uuidv7 as t };
