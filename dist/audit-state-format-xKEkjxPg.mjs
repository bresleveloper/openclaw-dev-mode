import { C as utf8ToBytes, F as concatBytes, R as randomBytes, S as u8, T as wrapMacConstructor, _ as isLE, b as u32, c as abytes, d as clean, f as copyBytes, g as isAligned32, h as getOutput, l as aexists, m as equalBytes, n as sha256Hex, p as createView, r as base64, t as canonicalBytes, u as aoutput32, v as swap32IfBE, w as wrapCipher, x as u64Lengths, y as swap8IfBE } from "./canonical-C1hv0IfI.mjs";
//#region node_modules/.pnpm/@noble+ciphers@2.4.0/node_modules/@noble/ciphers/_polyval.js
/**
* GHash from AES-GCM and its little-endian "mirror image" Polyval from AES-SIV.
*
* Implemented in terms of GHash with conversion function for keys
* GCM GHASH from
* {@link https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf | NIST SP800-38d},
* SIV from
* {@link https://www.rfc-editor.org/rfc/rfc8452 | RFC 8452}.
*
* GHASH   modulo: x^128 + x^7   + x^2   + x     + 1
* POLYVAL modulo: x^128 + x^127 + x^126 + x^121 + 1
*
* @module
*/
const BLOCK_SIZE$1 = 16;
const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
const ZEROS32 = /* @__PURE__ */ u32(ZEROS16);
const POLY$1 = 225;
const mul2$1 = (s0, s1, s2, s3) => {
	const hiBit = s3 & 1;
	return {
		s3: s2 << 31 | s3 >>> 1,
		s2: s1 << 31 | s2 >>> 1,
		s1: s0 << 31 | s1 >>> 1,
		s0: s0 >>> 1 ^ POLY$1 << 24 & -(hiBit & 1)
	};
};
const swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
const estimateWindow = (bytes) => {
	if (bytes > 65536) return 8;
	if (bytes > 1024) return 4;
	return 2;
};
/**
* Incremental GHASH state for AES-GCM.
* @param key - 16-byte GHASH key.
* @param expectedLength - Expected message length for table sizing.
* Chunking is segment-based, not hash-streaming: every `update()` call is zero-padded
* to the next 16-byte boundary before it is absorbed. This matches the internal AES/GCM
* use where AAD, payload, and length block are separate padded segments.
* @example
* Feeds one ciphertext block into an incremental GHASH state with a fresh hash key.
*
* ```ts
* import { GHASH } from '@noble/ciphers/_polyval.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(16);
* const mac = new GHASH(key);
* mac.update(new Uint8Array(16));
* mac.digest();
* ```
*/
var GHASH = class {
	blockLen = BLOCK_SIZE$1;
	outputLen = BLOCK_SIZE$1;
	s0 = 0;
	s1 = 0;
	s2 = 0;
	s3 = 0;
	finished = false;
	destroyed = false;
	t;
	W;
	windowSize;
	constructor(key, expectedLength) {
		abytes(key, 16, "key");
		key = copyBytes(key);
		const kView = createView(key);
		let k0 = kView.getUint32(0, false);
		let k1 = kView.getUint32(4, false);
		let k2 = kView.getUint32(8, false);
		let k3 = kView.getUint32(12, false);
		const doubles = [];
		for (let i = 0; i < 128; i++) {
			doubles.push({
				s0: swapLE(k0),
				s1: swapLE(k1),
				s2: swapLE(k2),
				s3: swapLE(k3)
			});
			({s0: k0, s1: k1, s2: k2, s3: k3} = mul2$1(k0, k1, k2, k3));
		}
		const W = estimateWindow(expectedLength || 1024);
		if (![
			1,
			2,
			4,
			8
		].includes(W)) throw new Error("ghash: invalid window size, expected 2, 4 or 8");
		this.W = W;
		const windows = 128 / W;
		const windowSize = this.windowSize = 2 ** W;
		const items = [];
		for (let w = 0; w < windows; w++) for (let byte = 0; byte < windowSize; byte++) {
			let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
			for (let j = 0; j < W; j++) {
				if (!(byte >>> W - j - 1 & 1)) continue;
				const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
				s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
			}
			items.push({
				s0,
				s1,
				s2,
				s3
			});
		}
		this.t = items;
	}
	_updateBlock(s0, s1, s2, s3) {
		s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
		const { W, t, windowSize } = this;
		let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
		const mask = (1 << W) - 1;
		let w = 0;
		for (const num of [
			s0,
			s1,
			s2,
			s3
		]) for (let bytePos = 0; bytePos < 4; bytePos++) {
			const byte = num >>> 8 * bytePos & 255;
			for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
				const bit = byte >>> W * bitPos & mask;
				const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
				o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
				w += 1;
			}
		}
		this.s0 = o0;
		this.s1 = o1;
		this.s2 = o2;
		this.s3 = o3;
	}
	update(data) {
		aexists(this);
		abytes(data);
		data = copyBytes(data);
		const b32 = u32(data);
		const blocks = Math.floor(data.length / BLOCK_SIZE$1);
		const left = data.length % BLOCK_SIZE$1;
		for (let i = 0; i < blocks; i++) this._updateBlock(swap8IfBE(b32[i * 4 + 0]), swap8IfBE(b32[i * 4 + 1]), swap8IfBE(b32[i * 4 + 2]), swap8IfBE(b32[i * 4 + 3]));
		if (left) {
			ZEROS16.set(data.subarray(blocks * BLOCK_SIZE$1));
			this._updateBlock(swap8IfBE(ZEROS32[0]), swap8IfBE(ZEROS32[1]), swap8IfBE(ZEROS32[2]), swap8IfBE(ZEROS32[3]));
			clean(ZEROS32);
		}
		return this;
	}
	destroy() {
		this.destroyed = true;
		const { t } = this;
		for (const elm of t) elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
	}
	digestInto(out) {
		aexists(this);
		aoutput32(out, this);
		this.finished = true;
		const { s0, s1, s2, s3 } = this;
		const o32 = u32(out);
		o32[0] = s0;
		o32[1] = s1;
		o32[2] = s2;
		o32[3] = s3;
		if (!isLE) swap32IfBE(o32.subarray(0, BLOCK_SIZE$1 / 4));
	}
	digest() {
		const res = new Uint8Array(BLOCK_SIZE$1);
		this.digestInto(res);
		this.destroy();
		return res;
	}
};
/**
* GHash MAC for AES-GCM.
* @param msg - Message bytes to authenticate.
* @param key - 16-byte GHASH key.
* @returns 16-byte authentication tag.
* @example
* Authenticates a short message with GHASH and a fresh hash key.
*
* ```ts
* import { ghash } from '@noble/ciphers/_polyval.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(16);
* ghash(new Uint8Array(), key);
* ```
*/
const ghash = /* @__PURE__ */ wrapMacConstructor(16, (key, expectedLength) => new GHASH(key, expectedLength), (msg) => [msg.length]);
//#endregion
//#region node_modules/.pnpm/@noble+ciphers@2.4.0/node_modules/@noble/ciphers/aes.js
/**
* {@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard | AES}
* a.k.a. Advanced Encryption Standard
* is a variant of Rijndael block cipher, standardized by NIST in 2001.
* We provide the fastest available pure JS implementation.
*
* `cipher = encrypt(block, key)`
*
* Data is split into 128-bit blocks.
* Encrypted in 10/12/14 rounds (128/192/256 bits). In every round:
* 1. **S-box**, table substitution
* 2. **Shift rows**, cyclic shift left of all rows of data array
* 3. **Mix columns**, multiplying every column by fixed polynomial
* 4. **Add round key**, round_key xor i-th column of array
*
* Check out
* {@link https://csrc.nist.gov/files/pubs/fips/197/final/docs/fips-197.pdf | FIPS-197},
* {@link https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-38G.pdf | NIST 800-38G},
* and {@link https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf | original proposal}.
* @module
*/
const BLOCK_SIZE = 16;
const BLOCK_SIZE32 = 4;
const EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE);
const POLY = 283;
function validateKeyLength(key) {
	if (![
		16,
		24,
		32
	].includes(key.length)) throw new Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + key.length);
}
function mul2(n) {
	return n << 1 ^ POLY & -(n >> 7);
}
function mul(a, b) {
	let res = 0;
	for (; b > 0; b >>= 1) {
		res ^= a & -(b & 1);
		a = mul2(a);
	}
	return res;
}
const sbox = /* @__PURE__ */ (() => {
	const t = /* @__PURE__ */ new Uint8Array(256);
	for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x)) t[i] = x;
	const box = /* @__PURE__ */ new Uint8Array(256);
	box[0] = 99;
	for (let i = 0; i < 255; i++) {
		let x = t[255 - i];
		x |= x << 8;
		box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
	}
	clean(t);
	return box;
})();
const rotr32_8 = (n) => n << 24 | n >>> 8;
const rotl32_8 = (n) => n << 8 | n >>> 24;
function genTtable(sbox, fn) {
	if (sbox.length !== 256) throw new Error("wrong sbox length");
	const T0 = (/* @__PURE__ */ new Uint32Array(256)).map((_, j) => fn(sbox[j]));
	const T1 = T0.map(rotl32_8);
	const T2 = T1.map(rotl32_8);
	const T3 = T2.map(rotl32_8);
	const T01 = /* @__PURE__ */ new Uint32Array(65536);
	const T23 = /* @__PURE__ */ new Uint32Array(65536);
	const sbox2 = /* @__PURE__ */ new Uint16Array(65536);
	for (let i = 0; i < 256; i++) for (let j = 0; j < 256; j++) {
		const idx = i * 256 + j;
		T01[idx] = T0[i] ^ T1[j];
		T23[idx] = T2[i] ^ T3[j];
		sbox2[idx] = sbox[i] << 8 | sbox[j];
	}
	return {
		sbox,
		sbox2,
		T0,
		T1,
		T2,
		T3,
		T01,
		T23
	};
}
const tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
const xPowers = /* @__PURE__ */ (() => {
	const p = /* @__PURE__ */ new Uint8Array(16);
	for (let i = 0, x = 1; i < 16; i++, x = mul2(x)) p[i] = x;
	return p;
})();
/** Forward AES key expansion used across ECB/CBC/CTR/GCM/CMAC/KW-style paths. */
function expandKeyLE(key) {
	abytes(key);
	const len = key.length;
	validateKeyLength(key);
	const { sbox2 } = tableEncoding;
	const toClean = [];
	if (!isLE || !isAligned32(key)) toClean.push(key = copyBytes(key));
	const k32 = swap32IfBE(u32(key));
	const Nk = k32.length;
	const subByte = (n) => applySbox(sbox2, n, n, n, n);
	const xk = new Uint32Array(len + 28);
	xk.set(k32);
	for (let i = Nk; i < xk.length; i++) {
		let t = xk[i - 1];
		if (i % Nk === 0) t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
		else if (Nk > 6 && i % Nk === 4) t = subByte(t);
		xk[i] = xk[i - Nk] ^ t;
	}
	clean(...toClean);
	return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
	return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
	return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
	const { sbox2, T01, T23 } = tableEncoding;
	let k = 0;
	s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
	const rounds = xk.length / 4 - 2;
	for (let i = 0; i < rounds; i++) {
		const t0 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
		const t1 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
		const t2 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
		const t3 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
		s0 = t0, s1 = t1, s2 = t2, s3 = t3;
	}
	return {
		s0: xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3),
		s1: xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0),
		s2: xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1),
		s3: xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2)
	};
}
function ctr32(xk, isLE, nonce, src, dst) {
	abytes(nonce, BLOCK_SIZE, "nonce");
	abytes(src);
	dst = getOutput(src.length, dst);
	const ctr = nonce;
	const c32 = u32(ctr);
	const view = createView(ctr);
	const src32 = u32(src);
	const dst32 = u32(dst);
	const ctrPos = isLE ? 0 : 12;
	const srcLen = src.length;
	let ctrNum = view.getUint32(ctrPos, isLE);
	for (let i = 0; i + 4 <= src32.length; i += 4) {
		const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
		dst32[i + 0] = src32[i + 0] ^ swap8IfBE(s0);
		dst32[i + 1] = src32[i + 1] ^ swap8IfBE(s1);
		dst32[i + 2] = src32[i + 2] ^ swap8IfBE(s2);
		dst32[i + 3] = src32[i + 3] ^ swap8IfBE(s3);
		ctrNum = ctrNum + 1 >>> 0;
		view.setUint32(ctrPos, ctrNum, isLE);
	}
	const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
	if (start < srcLen) {
		const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
		const b32 = new Uint32Array([
			s0,
			s1,
			s2,
			s3
		]);
		swap32IfBE(b32);
		const buf = u8(b32);
		for (let i = start, pos = 0; i < srcLen; i++, pos++) dst[i] = src[i] ^ buf[pos];
		clean(b32);
	}
	return dst;
}
function computeTag(fn, isLE, key, data, AAD) {
	const aadLength = AAD ? AAD.length : 0;
	const h = fn.create(key, data.length + aadLength);
	if (AAD) h.update(AAD);
	const num = u64Lengths(8 * data.length, 8 * aadLength, isLE);
	h.update(data);
	h.update(num);
	const res = h.digest();
	clean(num);
	return res;
}
/**
* **GCM** (Galois/Counter Mode): Combines CTR mode with polynomial MAC. Efficient and widely used.
* Not perfect:
* a) conservative key wear-out is `2**32` (4B) msgs.
* b) key wear-out under random nonces is even smaller: `2**23` (8M) messages for `2**-50` chance.
* c) MAC can be forged: see Poly1305 documentation.
* @param key - AES key bytes.
* @param nonce - Nonce bytes (12 recommended, minimum 8; other lengths use GHASH J0 derivation).
* @param AAD - Additional authenticated data.
* @returns AEAD cipher instance with a fixed 16-byte tag.
* @example
* Encrypts and authenticates plaintext with a fresh key and 12-byte nonce.
*
* ```ts
* import { gcm } from '@noble/ciphers/aes.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(16);
* const nonce = randomBytes(12);
* const aad = new TextEncoder().encode('session metadata');
* const cipher = gcm(key, nonce, aad);
* cipher.encrypt(new Uint8Array([1, 2, 3]));
* ```
*/
const gcm = /* @__PURE__ */ wrapCipher({
	blockSize: 16,
	nonceLength: 12,
	tagLength: 16,
	withAAD: true,
	varSizeNonce: true
}, function aesgcm(key, nonce, AAD) {
	if (nonce.length < 8) throw new Error("aes/gcm: invalid nonce length");
	const tagLength = 16;
	function _computeTag(authKey, tagMask, data) {
		const tag = computeTag(ghash, false, authKey, data, AAD);
		for (let i = 0; i < tagMask.length; i++) tag[i] ^= tagMask[i];
		return tag;
	}
	function deriveKeys() {
		const xk = expandKeyLE(key);
		const authKey = EMPTY_BLOCK.slice();
		const counter = EMPTY_BLOCK.slice();
		ctr32(xk, false, counter, counter, authKey);
		if (nonce.length === 12) counter.set(nonce);
		else {
			const nonceLen = EMPTY_BLOCK.slice();
			createView(nonceLen).setBigUint64(8, BigInt(nonce.length * 8), false);
			const g = ghash.create(authKey).update(nonce).update(nonceLen);
			g.digestInto(counter);
			g.destroy();
		}
		return {
			xk,
			authKey,
			counter,
			tagMask: ctr32(xk, false, counter, EMPTY_BLOCK)
		};
	}
	return {
		encrypt(plaintext) {
			const { xk, authKey, counter, tagMask } = deriveKeys();
			const out = new Uint8Array(plaintext.length + tagLength);
			const toClean = [
				xk,
				authKey,
				counter,
				tagMask
			];
			if (!isAligned32(plaintext)) toClean.push(plaintext = copyBytes(plaintext));
			ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
			const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
			toClean.push(tag);
			out.set(tag, plaintext.length);
			clean(...toClean);
			return out;
		},
		decrypt(ciphertext) {
			const { xk, authKey, counter, tagMask } = deriveKeys();
			const toClean = [
				xk,
				authKey,
				tagMask,
				counter
			];
			if (!isAligned32(ciphertext)) toClean.push(ciphertext = copyBytes(ciphertext));
			const data = ciphertext.subarray(0, -16);
			const passedTag = ciphertext.subarray(-16);
			const tag = _computeTag(authKey, tagMask, data);
			toClean.push(tag);
			if (!equalBytes(tag, passedTag)) {
				clean(...toClean);
				throw new Error("aes-gcm: invalid tag");
			}
			const out = ctr32(xk, false, counter, data);
			clean(...toClean);
			return out;
		}
	};
});
//#endregion
//#region extensions/reef/protocol/audit.ts
function verifyChain(entries, expected) {
	if (expected?.length !== void 0 && entries.length !== expected.length) return false;
	return verifyChainSegment(entries, {
		previousHash: "",
		previousSeq: 0,
		...expected?.head === void 0 ? {} : { head: expected.head }
	});
}
function verifyChainSegment(entries, expected) {
	let previous = expected.previousHash;
	for (let index = 0; index < entries.length; index++) {
		const entry = entries[index];
		if (entry.event.seq !== expected.previousSeq + index + 1 || entry.prevHash !== previous || entry.entryHash !== hashEntry(previous, entry.event)) return false;
		previous = entry.entryHash;
	}
	return expected.head === void 0 || previous === expected.head;
}
function createAuditEntry(type, payload, ts, auditKey, head, rng = randomBytes) {
	if (typeof type !== "string" || type.length === 0 || !Number.isSafeInteger(ts) || ts < 0) throw new Error("invalid audit event");
	const event = {
		seq: head.seq + 1,
		ts,
		type,
		payload: encryptSensitive(payload, validateAuditKey(auditKey), rng)
	};
	return {
		event,
		prevHash: head.hash,
		entryHash: hashEntry(head.hash, event)
	};
}
function encryptSensitive(value, key, rng) {
	if (Array.isArray(value)) return value.map((child) => encryptSensitive(child, key, rng));
	if (value !== null && typeof value === "object") {
		const output = {};
		for (const [field, child] of Object.entries(value)) if ((field === "text" || field === "reason") && typeof child === "string") {
			const nonce = rng(12);
			if (nonce.length !== 12) throw new Error("invalid audit nonce");
			const ciphertext = gcm(key, nonce).encrypt(utf8ToBytes(child));
			output[field] = { enc: base64(concatBytes(nonce, ciphertext)) };
		} else output[field] = encryptSensitive(child, key, rng);
		return output;
	}
	return value;
}
function hashEntry(previous, event) {
	const previousBytes = previous === "" ? /* @__PURE__ */ new Uint8Array() : fromHex(previous);
	const eventBytes = canonicalBytes(event);
	return sha256Hex(concatBytes(previousBytes, eventBytes));
}
function validateAuditKey(key) {
	if (!(key instanceof Uint8Array) || key.length !== 32) throw new Error("audit key must be 32 bytes");
	return key;
}
function fromHex(value) {
	if (!/^[0-9a-f]{64}$/.test(value)) throw new Error("invalid audit hash");
	return Uint8Array.from(value.match(/../g), (part) => Number.parseInt(part, 16));
}
//#endregion
//#region extensions/reef/src/audit-state-format.ts
const REEF_AUDIT_NAMESPACE = "audit";
const REEF_AUDIT_HEAD_NAMESPACE = "audit-head";
const REEF_AUDIT_HEAD_KEY = "head";
const REEF_AUDIT_MAX_ENTRIES = 3e4;
const REEF_AUDIT_STORE_MAX_ENTRIES = 30001;
const REEF_AUDIT_MIGRATION_NAMESPACE = "audit-migration";
const REEF_AUDIT_MIGRATION_KEY = "audit-jsonl";
function reefAuditEntryKey(entryHash) {
	return `entry:${entryHash}`;
}
function parseReefAuditHead(input) {
	const value = input;
	if (value === void 0) return {
		kind: "head",
		hash: "",
		seq: 0,
		oldestHash: ""
	};
	if (!value || value.kind !== "head" || typeof value.hash !== "string" || !Number.isSafeInteger(value.seq) || value.seq < 0 || value.seq === 0 !== (value.hash === "") || typeof value.oldestHash !== "string" || value.seq === 0 !== (value.oldestHash === "") || value.garbageEntryKey !== void 0 && (typeof value.garbageEntryKey !== "string" || value.garbageEntryKey.length === 0) || value.pending !== void 0 && (typeof value.pending.owner !== "string" || value.pending.owner.length === 0 || !Number.isSafeInteger(value.pending.expiresAt) || value.pending.expiresAt <= 0 || value.pending.entryKey !== void 0 && (typeof value.pending.entryKey !== "string" || value.pending.entryKey.length === 0))) throw new Error("invalid Reef audit head");
	return value;
}
function parseAuditEntryRecord(input) {
	const value = input;
	if (!value || value.kind !== "entry") throw new Error("missing Reef audit entry");
	return value.entry;
}
function parseAuditStateRecord(input) {
	parseAuditEntryRecord(input);
	const value = input;
	if (value?.nextHash !== void 0 && (typeof value.nextHash !== "string" || value.nextHash.length === 0)) throw new Error("invalid Reef audit next pointer");
	return value;
}
function verifyReefAuditWindow(reversed, head, maxEntries) {
	if (reversed.length !== Math.min(head.seq, maxEntries)) throw new Error("Reef audit chain is shorter than its committed retention window");
	const entries = reversed.toReversed();
	const first = entries[0];
	if (!first || !verifyChainSegment(entries, {
		previousHash: first.prevHash,
		previousSeq: first.event.seq - 1,
		head: head.hash
	})) throw new Error("invalid Reef audit chain state");
	return entries;
}
//#endregion
export { REEF_AUDIT_MIGRATION_NAMESPACE as a, parseAuditEntryRecord as c, reefAuditEntryKey as d, verifyReefAuditWindow as f, gcm as h, REEF_AUDIT_MIGRATION_KEY as i, parseAuditStateRecord as l, verifyChain as m, REEF_AUDIT_HEAD_NAMESPACE as n, REEF_AUDIT_NAMESPACE as o, createAuditEntry as p, REEF_AUDIT_MAX_ENTRIES as r, REEF_AUDIT_STORE_MAX_ENTRIES as s, REEF_AUDIT_HEAD_KEY as t, parseReefAuditHead as u };
