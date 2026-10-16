//#region packages/normalization-core/src/uuid.ts
let warnedWeakCrypto = false;
function warnWeakCryptoOnce() {
	if (warnedWeakCrypto) return;
	warnedWeakCrypto = true;
	console.warn("[uuid] crypto API missing; refusing insecure UUID generation");
}
function generateUUID(cryptoLike = globalThis.crypto) {
	if (cryptoLike && typeof cryptoLike.randomUUID === "function") return cryptoLike.randomUUID();
	if (cryptoLike && typeof cryptoLike.getRandomValues === "function") {
		const bytes = /* @__PURE__ */ new Uint8Array(16);
		cryptoLike.getRandomValues(bytes);
		const view = new DataView(bytes.buffer);
		view.setUint8(6, view.getUint8(6) & 15 | 64);
		view.setUint8(8, view.getUint8(8) & 63 | 128);
		const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}
	warnWeakCryptoOnce();
	throw new Error("Web Crypto is required for UUID generation");
}
//#endregion
export { generateUUID };
