import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { Fn as object, Jn as string, Pn as number, Un as record, lr as uuid, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./account-resolution-p-vwcP8_.mjs";
import { A as concatBytes$1, B as createView, C as abytes$2, D as aoutput, E as anumber$1, F as aexists, G as swap32IfBE, H as getOutput, I as aoutput32, J as u64Lengths, K as swap8IfBE, L as bytesToHex$2, M as isBytes$1, N as randomBytes$2, O as bytesToHex$1, P as abytes$1, Q as wrapMacConstructor, R as clean, S as sha512, T as ahash, U as isAligned32, V as equalBytes, W as isLE, X as utf8ToBytes, Y as u8, Z as wrapCipher, _ as base64url, b as fromBase64url, g as base64, i as normalizeReefTarget, j as hexToBytes$1, k as clean$1, m as canonicalBytes, q as u32, v as decodeUtf8, w as aexists$1, x as sha256, y as fromBase64, z as copyBytes$1 } from "./config-schema-CDfLULtN.mjs";
import { i as matchesReefPeerIdentity, n as ReefPeerIdentitySchema, o as sameReefPeerIdentity, r as ReefPeerTrustSchema, t as ReefAutonomySchema } from "./friend-types-DKK2gCV4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { setTimeout } from "node:timers/promises";
import { createHash, randomUUID } from "node:crypto";
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
		abytes$1(key, 16, "key");
		key = copyBytes$1(key);
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
		abytes$1(data);
		data = copyBytes$1(data);
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
	abytes$1(key);
	const len = key.length;
	validateKeyLength(key);
	const { sbox2 } = tableEncoding;
	const toClean = [];
	if (!isLE || !isAligned32(key)) toClean.push(key = copyBytes$1(key));
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
	abytes$1(nonce, BLOCK_SIZE, "nonce");
	abytes$1(src);
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
			if (!isAligned32(plaintext)) toClean.push(plaintext = copyBytes$1(plaintext));
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
			if (!isAligned32(ciphertext)) toClean.push(ciphertext = copyBytes$1(ciphertext));
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
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/**
* Validates that a value is an array, optionally validating each element.
* @param item - Value to validate.
* @param title - Label included in thrown errors.
* @param inner - Optional per-element validator, called with the element and its label.
* @returns The validated array.
* @example
* Validate an array of points before batch processing.
*
* ```ts
* aarray([1n, 2n], 'scalars');
* ```
*/
function aarray(item, title, inner = () => {}) {
	if (!Array.isArray(item)) throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
	for (let i = 0; i < item.length; i++) inner(item[i], `${title}[${i}]`);
	return item;
}
/**
* Validates that a value is a byte array.
* @param value - Value to validate.
* @param length - Optional exact byte length.
* @param title - Optional field name.
* @returns Original byte array.
* @example
* Reject non-byte input before passing data into curve code.
*
* ```ts
* abytes(new Uint8Array(1));
* ```
*/
const abytes = (value, length, title) => abytes$2(value, length, title);
/**
* Validates that a value is a non-negative safe integer.
* @param n - Value to validate.
* @param title - Optional field name.
* @returns The validated number.
* @example
* Validate a numeric length before allocating buffers.
*
* ```ts
* anumber(1);
* ```
*/
const anumber = anumber$1;
/**
* Asserts something is a plain object-ish value, not null or array.
* @param value - Value to validate.
* @param title - Label included in thrown errors.
* @returns The validated object.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validate an options object before checking fields.
*
* ```ts
* aobject({ flag: true });
* ```
*/
function aobject(value, title = "object") {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
	return value;
}
/**
* Asserts something is a function.
* @param value - Value to validate.
* @param title - Label included in thrown errors.
* @returns The validated function.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validate a required method before calling it.
*
* ```ts
* afunction(() => true, 'predicate');
* ```
*/
function afunction(value, title) {
	if (typeof value !== "function") throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
	return value;
}
/**
* Encodes bytes as lowercase hex.
* @param bytes - Bytes to encode.
* @returns Lowercase hex string.
* @example
* Serialize bytes as hex for logging or fixtures.
*
* ```ts
* bytesToHex(Uint8Array.of(1, 2, 3));
* ```
*/
const bytesToHex = bytesToHex$1;
/**
* Concatenates byte arrays.
* @param arrays - Byte arrays to join.
* @returns Concatenated bytes.
* @example
* Join domain-separated chunks into one buffer.
*
* ```ts
* concatBytes(Uint8Array.of(1), Uint8Array.of(2));
* ```
*/
const concatBytes = (...arrays) => concatBytes$1(...arrays);
/**
* Decodes lowercase or uppercase hex into bytes.
* @param hex - Hex string to decode.
* @returns Decoded bytes.
* @example
* Parse fixture hex into bytes before hashing.
*
* ```ts
* hexToBytes('0102');
* ```
*/
const hexToBytes = (hex) => hexToBytes$1(hex);
/**
* Checks whether a value is a Uint8Array.
* @param a - Value to inspect.
* @returns `true` when `a` is a Uint8Array.
* @example
* Branch on byte input before decoding it.
*
* ```ts
* isBytes(new Uint8Array(1));
* ```
*/
const isBytes = isBytes$1;
/**
* Reads random bytes from the platform CSPRNG.
* @param bytesLength - Number of random bytes to read.
* @returns Fresh random bytes.
* @example
* Generate a random seed for a keypair.
*
* ```ts
* randomBytes(2);
* ```
*/
const randomBytes$1 = (bytesLength) => randomBytes$2(bytesLength);
const _0n$5 = /* @__PURE__ */ BigInt(0);
const _1n$5 = /* @__PURE__ */ BigInt(1);
const atitle = (title) => title ? `"${title}" ` : "";
/**
* Validates that a flag is boolean.
* @param value - Value to validate.
* @param title - Optional field name.
* @returns Original value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Reject non-boolean option flags early.
*
* ```ts
* abool(true);
* ```
*/
function abool(value, title = "") {
	if (typeof value !== "boolean") throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
	return value;
}
/**
* Validates that a value is a non-negative bigint or safe integer.
* @param n - Value to validate.
* @returns The same validated value.
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate one integer-like value before serializing it.
*
* ```ts
* abignumber(1n);
* ```
*/
function abignumber(n) {
	if (typeof n === "bigint") {
		if (!isPosBig(n)) throw new RangeError("positive bigint expected, got " + n);
	} else anumber(n);
	return n;
}
/**
* Validates that a value is a safe integer.
* @param value - Integer to validate.
* @param title - Optional field name.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a window size before scalar arithmetic uses it.
*
* ```ts
* asafenumber(1);
* ```
*/
function asafenumber(value, title = "") {
	if (typeof value !== "number") {
		const prefix = title && `"${title}" `;
		throw new TypeError(prefix + "expected number, got type=" + typeof value);
	}
	if (!Number.isSafeInteger(value)) {
		const prefix = title && `"${title}" `;
		throw new RangeError(prefix + "expected safe integer, got " + value);
	}
}
/**
* Parses a big-endian hex string into bigint.
* Accepts odd-length hex through the native `BigInt('0x' + hex)` parser and currently surfaces the
* same native `SyntaxError` for malformed hex instead of wrapping it in a library-specific error.
* @param hex - Hex string without `0x`.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Parse a scalar from fixture hex.
*
* ```ts
* hexToNumber('ff');
* ```
*/
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new TypeError("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$5 : BigInt("0x" + hex);
}
/**
* Parses big-endian bytes into bigint.
* @param bytes - Bytes in big-endian order.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Read a scalar encoded in network byte order.
*
* ```ts
* bytesToNumberBE(Uint8Array.of(1, 0));
* ```
*/
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex$1(bytes));
}
/**
* Parses little-endian bytes into bigint.
* @param bytes - Bytes in little-endian order.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Read a scalar encoded in little-endian form.
*
* ```ts
* bytesToNumberLE(Uint8Array.of(1, 0));
* ```
*/
function bytesToNumberLE(bytes) {
	return hexToNumber(bytesToHex$1(copyBytes(abytes$2(bytes)).reverse()));
}
/**
* Encodes a bigint into fixed-length big-endian bytes.
* @param n - Number to encode.
* @param len - Output length in bytes. Must be greater than zero.
* @returns Big-endian byte array.
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If a documented runtime validation or state check fails. {@link Error}
* @example
* Serialize a scalar into a 32-byte field element.
*
* ```ts
* numberToBytesBE(255n, 2);
* ```
*/
function numberToBytesBE(n, len) {
	anumber$1(len);
	if (len === 0) throw new Error("zero output length is invalid");
	n = abignumber(n);
	const expectedLen = len * 2;
	const hex = n.toString(16);
	if (hex.length > expectedLen) throw new RangeError("number is too large");
	return hexToBytes$1(hex.padStart(expectedLen, "0"));
}
/**
* Encodes a bigint into fixed-length little-endian bytes.
* @param n - Number to encode.
* @param len - Output length in bytes.
* @returns Little-endian byte array.
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If a documented runtime validation or state check fails. {@link Error}
* @example
* Serialize a scalar for little-endian protocols.
*
* ```ts
* numberToBytesLE(255n, 2);
* ```
*/
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
/**
* Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
* and Buffer#slice creates mutable copy. Never use Buffers!
* @param bytes - Bytes to copy.
* @returns Detached copy.
* @example
* Make an isolated copy before mutating serialized bytes.
*
* ```ts
* copyBytes(Uint8Array.of(1, 2, 3));
* ```
*/
function copyBytes(bytes) {
	return Uint8Array.from(abytes(bytes));
}
/**
* Checks whether n is non-negative bigint. Historical name.
* @param n - candidate value
* @returns `true` when the value is bigint and 0 or larger
* @example
* Check a candidate scalar before range validation.
*
* ```ts
* isPosBig(2n);
* ```
*/
function isPosBig(n) {
	return typeof n === "bigint" && _0n$5 <= n;
}
/**
* Checks whether a bigint lies inside a half-open range.
* @param n - Candidate value.
* @param min - Inclusive lower bound.
* @param max - Exclusive upper bound.
* @returns `true` when the value is inside the range.
* @example
* Check whether a candidate scalar fits the field order.
*
* ```ts
* inRange(2n, 1n, 3n);
* ```
*/
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts `min <= n < max`. NOTE: upper bound is exclusive.
* @param title - Value label for error messages.
* @param n - Candidate value.
* @param min - Inclusive lower bound.
* @param max - Exclusive upper bound.
* Wrong-type inputs are not separated from out-of-range values here: they still flow through the
* shared `RangeError` path because this is only a throwing wrapper around `inRange(...)`.
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Assert that a bigint stays within one half-open range.
*
* ```ts
* aInRange('x', 2n, 1n, 256n);
* ```
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
* @param n - Value to inspect.
* @returns Bit length.
* @throws If the value is negative. {@link Error}
* @example
* Measure the bit length of a scalar before serialization.
*
* ```ts
* bitLen(8n);
* ```
*/
function bitLen(n) {
	if (n < _0n$5) throw new Error("expected non-negative bigint, got " + n);
	return n === _0n$5 ? 0 : n.toString(2).length;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
* @param n - Number of bits. Negative widths are currently passed through to raw bigint shift
*   semantics and therefore produce `-1n`.
* @returns Bitmask value.
* @example
* Calculate mask for N bits.
*
* ```ts
* bitMask(4);
* ```
*/
const bitMask = (n) => {
	asafenumber(n, "n");
	return (_1n$5 << BigInt(n)) - _1n$5;
};
/**
* Validates declared required and optional field types on a plain object.
* Extra keys are intentionally ignored because many callers validate only the subset they use from
* richer option bags or runtime objects.
* This walks field schemas and formats detailed errors, so avoid it on hot paths; use direct
* one-line guards such as `aobject()`, `afunction()`, `abool()`, or `asafenumber()` instead.
* @param object - Object to validate.
* @param fields - Required field types.
* @param optFields - Optional field types.
* @param title - Object label included in thrown errors.
* @throws On wrong argument types. {@link TypeError}
* @example
* Check user options before building a curve helper.
*
* ```ts
* validateObject({ flag: true }, { flag: 'boolean' });
* ```
*/
function validateObject(object, fields = {}, optFields = {}, title = "object") {
	aobject(object, title);
	aobject(fields, "fields");
	aobject(optFields, "optFields");
	function checkField(fieldName, expectedType, isOpt) {
		const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
		const val = object[fieldName];
		if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) throw new TypeError(`${label} is invalid: expected own property`);
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
	}
	const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
	iter(fields, false);
	iter(optFields, true);
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$4 = /* @__PURE__ */ BigInt(0);
const _1n$4 = /* @__PURE__ */ BigInt(1);
const _2n$3 = /* @__PURE__ */ BigInt(2);
const _3n$1 = /* @__PURE__ */ BigInt(3);
const _4n$2 = /* @__PURE__ */ BigInt(4);
const _5n$1 = /* @__PURE__ */ BigInt(5);
const _7n = /* @__PURE__ */ BigInt(7);
const _8n$2 = /* @__PURE__ */ BigInt(8);
const _9n = /* @__PURE__ */ BigInt(9);
const _15n = /* @__PURE__ */ BigInt(15);
const _16n = /* @__PURE__ */ BigInt(16);
const POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
/**
* @param a - Dividend value.
* @param b - Positive modulus.
* @returns Reduced value in `[0, b)` only when `b` is positive.
* @throws If the modulus is not positive. {@link Error}
* @example
* Normalize a bigint into one field residue.
*
* ```ts
* mod(-1n, 5n);
* ```
*/
function mod(a, b) {
	if (b <= _0n$4) throw new Error("mod: expected positive modulus, got " + b);
	const result = a % b;
	return result >= _0n$4 ? result : b + result;
}
/**
* Efficiently raise num to a power with modular reduction.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
* Low-level helper: callers that need canonical residues must pass a valid `num` for the chosen
* modulus instead of relying on the `power===0/1` fast paths to normalize it.
* @param num - Base value.
* @param power - Exponent value.
* @param modulo - Reduction modulus.
* @returns Modular exponentiation result.
* @throws If the modulus or exponent is invalid. {@link Error}
* @example
* Raise one bigint to a modular power.
*
* ```ts
* pow(2n, 6n, 11n) // 64n % 11n == 9n
* ```
*/
function pow(num, power, modulo) {
	if (modulo <= _1n$4) throw new Error("pow: expected modulus > 1, got " + modulo);
	if (typeof power !== "bigint") throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
	if (power < _0n$4) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$4) return _1n$4;
	if (power === _1n$4) return num;
	let d = num % modulo;
	if (d < _0n$4) d += modulo;
	if (power < POW_WINDOWED_MIN) {
		let p = _1n$4;
		while (power > _0n$4) {
			if (power & _1n$4) p = p * d % modulo;
			d = d * d % modulo;
			power >>= _1n$4;
		}
		return p;
	}
	const digits = [];
	while (power > _0n$4) {
		digits.push(Number(power & _15n));
		power >>= _4n$2;
	}
	const table = new Array(16);
	table[0] = _1n$4;
	table[1] = d;
	for (let i = 2; i < 16; i++) table[i] = table[i - 1] * d % modulo;
	let p = table[digits[digits.length - 1]];
	for (let w = digits.length - 2; w >= 0; w--) {
		p = p * p % modulo;
		p = p * p % modulo;
		p = p * p % modulo;
		p = p * p % modulo;
		const digit = digits[w];
		if (digit !== 0) p = p * table[digit] % modulo;
	}
	return p;
}
/**
* Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)`.
* Low-level helper: callers that need canonical residues must pass a valid `x` for the chosen
* modulus; the `power===0` fast path intentionally returns the input unchanged.
* @param x - Base value.
* @param power - Number of squarings.
* @param modulo - Reduction modulus.
* @returns Repeated-squaring result.
* @throws If the exponent is negative. {@link Error}
* @example
* Apply repeated squaring inside one field.
*
* ```ts
* pow2(3n, 2n, 11n);
* ```
*/
function pow2(x, power, modulo) {
	if (modulo <= _1n$4) throw new Error("pow2: expected modulus > 1, got " + modulo);
	if (power < _0n$4) throw new Error("pow2: expected non-negative exponent, got " + power);
	let res = x;
	while (power-- > _0n$4) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using the {@link https://brilliant.org/wiki/extended-euclidean-algorithm/ | extended Euclidean algorithm}.
* @param number - Value to invert.
* @param modulo - Modulus greater than 1.
* @returns Multiplicative inverse.
* @throws If the modulus is invalid or the inverse does not exist. {@link Error}
* @example
* Compute one modular inverse with the extended Euclidean algorithm.
*
* ```ts
* invert(3n, 11n);
* ```
*/
function invert(number, modulo) {
	if (number === _0n$4) throw new Error("invert: expected non-zero number");
	if (modulo <= _1n$4) throw new Error("invert: expected modulus > 1, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$4, u = _1n$4;
	while (a !== _0n$4) {
		const q = b / a;
		const r = b - a * q;
		const m = x - u * q;
		b = a, a = r, x = u, u = m;
	}
	if (b !== _1n$4) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	const F = Fp;
	if (!F.eql(F.sqr(root), n)) throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
	if ((order & _1n$4) === _0n$4) throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp, n) {
	const F = Fp;
	const p1div4 = (F.ORDER + _1n$4) / _4n$2;
	const root = F.pow(n, p1div4);
	assertIsSquare(F, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const F = Fp;
	const p5div8 = (F.ORDER - _5n$1) / _8n$2;
	const n2 = F.mul(n, _2n$3);
	const v = F.pow(n2, p5div8);
	const nv = F.mul(n, v);
	const i = F.mul(F.mul(nv, _2n$3), v);
	const root = F.mul(nv, F.sub(i, F.ONE));
	assertIsSquare(F, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return ((Fp, n) => {
		const F = Fp;
		let tv1 = F.pow(n, c4);
		let tv2 = F.mul(tv1, c1);
		const tv3 = F.mul(tv1, c2);
		const tv4 = F.mul(tv1, c3);
		const e1 = F.eql(F.sqr(tv2), n);
		const e2 = F.eql(F.sqr(tv3), n);
		tv1 = F.cmov(tv1, tv2, e1);
		tv2 = F.cmov(tv4, tv3, e2);
		const e3 = F.eql(F.sqr(tv2), n);
		const root = F.cmov(tv1, tv2, e3);
		assertIsSquare(F, root, n);
		return root;
	});
}
/**
* Tonelli-Shanks square root search algorithm.
* This implementation is variable-time: it searches data-dependently for the first non-residue `Z`
* and for the smallest `i` in the main loop, unlike RFC 9380 Appendix I.4's constant-time shape.
* 1. {@link https://eprint.iacr.org/2012/685.pdf | eprint 2012/685}, page 12
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P - field order
* @returns function that takes field Fp (created from P) and number n
* @throws If the field is too small, non-prime, or the square root does not exist. {@link Error}
* @example
* Construct a square-root helper for primes that need Tonelli-Shanks.
*
* ```ts
* import { Field, tonelliShanks } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const sqrt = tonelliShanks(17n)(Fp, 4n);
* ```
*/
function tonelliShanks(P) {
	if (P < _3n$1) throw new Error("sqrt is not defined for small field");
	aoddModulus(P, "tonelliShanks");
	let Q = P - _1n$4;
	let S = 0;
	while (Q % _2n$3 === _0n$4) {
		Q /= _2n$3;
		S++;
	}
	let Z = _2n$3;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$4) / _2n$3;
	return function tonelliSlow(Fp, n) {
		const F = Fp;
		if (F.is0(n)) return n;
		if (FpLegendre(F, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = F.mul(F.ONE, cc);
		let t = F.pow(n, Q);
		let R = F.pow(n, Q1div2);
		while (!F.eql(t, F.ONE)) {
			if (F.is0(t)) throw new Error("Cannot find square root: probably non-prime P");
			let i = 1;
			let t_tmp = F.sqr(t);
			while (!F.eql(t_tmp, F.ONE)) {
				i++;
				t_tmp = F.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$4 << BigInt(M - i - 1);
			const b = F.pow(c, exponent);
			M = i;
			c = F.sqr(b);
			t = F.mul(t, c);
			R = F.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choose a root by oddness
* (used for hash-to-curve).
* @param P - Field order.
* @returns Square-root helper. The generic fallback inherits Tonelli-Shanks' variable-time
*   behavior and this selector assumes prime-field-style integer moduli.
* @throws If the field is unsupported or the square root does not exist. {@link Error}
* @example
* Choose the square-root helper appropriate for one field modulus.
*
* ```ts
* import { Field, FpSqrt } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const sqrt = FpSqrt(17n)(Fp, 4n);
* ```
*/
function FpSqrt(P) {
	aoddModulus(P, "Fp.sqrt");
	if (P % _4n$2 === _3n$1) return sqrt3mod4;
	if (P % _8n$2 === _5n$1) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
	return tonelliShanks(P);
}
/**
* @param num - Value to inspect.
* @param modulo - Field modulus.
* @returns `true` when the least-significant little-endian bit is set.
* @throws If the modulus is invalid for `mod(...)`. {@link Error}
* @example
* Inspect the low bit used by little-endian sign conventions.
*
* ```ts
* isNegativeLE(3n, 11n);
* ```
*/
const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$4) === _1n$4;
const FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
/**
* @param field - Field implementation.
* @returns Validated field. This only checks the arithmetic subset needed by generic helpers; it
*   does not guarantee full runtime-method coverage for serialization, batching, `cmov`, or
*   field-specific extras beyond positive `BYTES` / `BITS`.
* @throws If the field shape or numeric metadata are invalid. {@link Error}
* @example
* Check that a field implementation exposes the operations curve code expects.
*
* ```ts
* import { Field, validateField } from '@noble/curves/abstract/modular.js';
* const Fp = validateField(Field(17n));
* ```
*/
function validateField(field) {
	aobject(field, "field");
	if (typeof field.ORDER !== "bigint") throw new TypeError("param \"ORDER\" is invalid: expected bigint, got " + typeof field.ORDER);
	asafenumber(field.BYTES, "BYTES");
	asafenumber(field.BITS, "BITS");
	for (const name of FIELD_FIELDS) afunction(field[name], "field." + name);
	if (field.BYTES < 1 || field.BITS < 1) throw new Error("invalid field: expected BYTES/BITS > 0");
	if (field.ORDER <= _1n$4) throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
	return field;
}
function FpInvertBatch(Fp, nums, passZero = false) {
	validateField(Fp);
	aarray(nums, "nums");
	abool(passZero, "passZero");
	const F = Fp;
	const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (F.is0(num)) return acc;
		inverted[i] = acc;
		return F.mul(acc, num);
	}, F.ONE);
	const invertedAcc = F.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (F.is0(num)) return acc;
		inverted[i] = F.mul(acc, inverted[i]);
		return F.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
* @param Fp - Field implementation.
* @param n - Value to inspect.
* @returns Legendre symbol.
* @throws If the powered value does not match a valid Legendre symbol. {@link Error}
* @example
* Compute the Legendre symbol of one field element.
*
* ```ts
* import { Field, FpLegendre } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const symbol = FpLegendre(Fp, 4n);
* ```
*/
function FpLegendre(Fp, n) {
	validateField(Fp);
	const F = Fp;
	aoddModulus(F.ORDER, "FpLegendre");
	const p1mod2 = (F.ORDER - _1n$4) / _2n$3;
	const powered = F.pow(n, p1mod2);
	const yes = F.eql(powered, F.ONE);
	const zero = F.eql(powered, F.ZERO);
	const no = F.eql(powered, F.neg(F.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
/**
* @param n - Curve order. Callers are expected to pass a positive order.
* @param nBitLength - Optional cached bit length. Callers are expected to pass a positive cached
*   value when overriding the derived bit length.
* @returns Byte and bit lengths.
* @throws If the order or cached bit length is invalid. {@link Error}
* @example
* Measure the encoding sizes needed for one modulus.
*
* ```ts
* nLength(255n);
* ```
*/
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	if (n <= _0n$4) throw new Error("invalid n length: expected positive n, got " + n);
	if (nBitLength !== void 0 && nBitLength < 1) throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
	const bits = bitLen(n);
	if (nBitLength !== void 0 && nBitLength < bits) throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
const FIELD_SQRT = /* @__PURE__ */ new WeakMap();
var _Field = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = _0n$4;
	ONE = _1n$4;
	_lengths;
	_mod;
	constructor(ORDER, opts = {}) {
		if (ORDER <= _1n$4) throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
		let _nbitLength = void 0;
		this.isLE = false;
		if (opts != null && typeof opts === "object") {
			if (typeof opts.BITS === "number") _nbitLength = opts.BITS;
			if (typeof opts.sqrt === "function") Object.defineProperty(this, "sqrt", {
				value: opts.sqrt,
				enumerable: true
			});
			if (typeof opts.isLE === "boolean") this.isLE = opts.isLE;
			if (opts.allowedLengths) this._lengths = Object.freeze(opts.allowedLengths.slice());
			if (typeof opts.modFromBytes === "boolean") this._mod = opts.modFromBytes;
		}
		const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
		if (nByteLength > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = ORDER;
		this.BITS = nBitLength;
		this.BYTES = nByteLength;
		Object.freeze(this);
	}
	create(num) {
		return mod(num, this.ORDER);
	}
	isValid(num) {
		if (typeof num !== "bigint") throw new TypeError("invalid field element: expected bigint, got " + typeof num);
		return _0n$4 <= num && num < this.ORDER;
	}
	is0(num) {
		return num === _0n$4;
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	isOdd(num) {
		return (num & _1n$4) === _1n$4;
	}
	neg(num) {
		return mod(-num, this.ORDER);
	}
	eql(lhs, rhs) {
		return lhs === rhs;
	}
	sqr(num) {
		return mod(num * num, this.ORDER);
	}
	add(lhs, rhs) {
		return mod(lhs + rhs, this.ORDER);
	}
	sub(lhs, rhs) {
		return mod(lhs - rhs, this.ORDER);
	}
	mul(lhs, rhs) {
		return mod(lhs * rhs, this.ORDER);
	}
	pow(num, power) {
		return pow(num, power, this.ORDER);
	}
	div(lhs, rhs) {
		return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
	}
	sqrN(num) {
		return num * num;
	}
	addN(lhs, rhs) {
		return lhs + rhs;
	}
	subN(lhs, rhs) {
		return lhs - rhs;
	}
	mulN(lhs, rhs) {
		return lhs * rhs;
	}
	inv(num) {
		return invert(num, this.ORDER);
	}
	sqrt(num) {
		let sqrt = FIELD_SQRT.get(this);
		if (!sqrt) FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
		return sqrt(this, num);
	}
	toBytes(num) {
		return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
	}
	fromBytes(bytes, skipValidation = false) {
		abytes(bytes);
		const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
		if (allowedLengths) {
			if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
			const padded = new Uint8Array(BYTES);
			padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
			bytes = padded;
		}
		if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
		let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
		if (modFromBytes) scalar = mod(scalar, ORDER);
		if (!skipValidation) {
			if (!this.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
		}
		return scalar;
	}
	invertBatch(lst) {
		return FpInvertBatch(this, lst, true);
	}
	cmov(a, b, condition) {
		abool(condition, "condition");
		return condition ? b : a;
	}
};
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. Frozen stable object shape; the lazy sqrt cache lives in a module-level `WeakMap`.
* Fragile: always run a benchmark on a change.
* Security note: operations and low-level serializers like `toBytes` don't check `isValid` for
* all elements for performance and protocol-flexibility reasons; callers are responsible for
* supplying valid elements when they need canonical field behavior.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER - field order, probably prime, or could be composite
* @param opts - Field options such as bit length or endianness. See {@link FieldOpts}.
* @returns Frozen field instance with a stable object shape. This wrapper forwards `opts` straight
*   into `_Field`, so it inherits `_Field`'s assumptions about cached sizes and `allowedLengths`.
* @example
* Construct one prime field with optional overrides.
*
* ```ts
* Field(11n);
* ```
*/
function Field(ORDER, opts = {}) {
	Object.freeze(_Field.prototype);
	return new _Field(ORDER, opts);
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF-based ScalarMultiplier, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$3 = /* @__PURE__ */ BigInt(0);
const _1n$3 = /* @__PURE__ */ BigInt(1);
const _4n$1 = /* @__PURE__ */ BigInt(4);
const BLIND_BYTES = 16;
const BLIND_BITS = 128;
const FW_WINDOW = 5;
const TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
/**
* Validates the static surface of a point constructor.
* This is only a cheap sanity check for the constructor hooks and fields consumed by generic
* factories; it does not certify `BASE`/`ZERO` semantics or prove the curve implementation itself.
* @param Point - Runtime point constructor.
* @throws On missing constructor hooks or malformed field metadata. {@link TypeError}
* @example
* Check that one point constructor exposes the static hooks generic helpers need.
*
* ```ts
* import { ed25519 } from '@noble/curves/ed25519.js';
* import { validatePointCons } from '@noble/curves/abstract/curve.js';
* validatePointCons(ed25519.Point);
* ```
*/
function validatePointCons(Point) {
	const pc = Point;
	if (typeof pc !== "function") throw new TypeError("\"Point\" expected constructor, got type=" + typeof Point);
	afunction(pc.fromAffine, "Point.fromAffine");
	afunction(pc.fromBytes, "Point.fromBytes");
	afunction(pc.fromHex, "Point.fromHex");
	aobject(pc.BASE, "Point.BASE");
	aobject(pc.ZERO, "Point.ZERO");
	validateField(pc.Fp);
	validateField(pc.Fn);
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
* Input points are left unchanged; the normalized points are returned as fresh instances.
* @param c - Point constructor.
* @param points - Projective points.
* @returns Fresh projective points reconstructed from normalized affine coordinates.
* @example
* Batch-normalize projective points with a single shared inversion.
*
* ```ts
* import { normalizeZ } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const points = normalizeZ(p256.Point, [p256.Point.BASE, p256.Point.BASE.double()]);
* ```
*/
function normalizeZ(c, points) {
	validatePointCons(c);
	validateMSMPoints(points, c);
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
	if (!Number.isSafeInteger(W) || W < min || W > bits) throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
	const bytes = numPoints * (4 * fpBytes + 128);
	if (bytes > TABLE_BYTES_MAX) throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
/**
* Probes an RNG once, at construction time: returns `undefined` when it is unavailable —
* throws or returns malformed bytes — so callers can downgrade to their unblinded /
* deterministic constant-time fallback. Blinding is defense-in-depth (DPA/template
* hardening), not a correctness or key-secrecy requirement, so availability-based
* downgrade is acceptable.
*
* The downgrade decision is deliberately static. After a successful probe the RNG becomes
* part of the trusted contract: later misbehavior must fail closed in per-call validation
* (throw), never downgrade — a dynamic fallback would let a tampered RNG silently strip
* blinding on demand. A probe can only ever classify broken environments, not adversarial
* RNGs: a stateful RNG can always behave while probed and misbehave later.
* @param randomBytes - RNG to probe, or `undefined` when the environment provides none.
* @param length - Byte length requested from the probe call.
* @returns The RNG when the probe produced `length` valid bytes; `undefined` otherwise.
* @example
* Probe an RNG once before enabling scalar blinding.
*
* ```ts
* import { probeRandomBytes } from '@noble/curves/abstract/curve.js';
* import { randomBytes } from '@noble/hashes/utils.js';
* const rng = probeRandomBytes(randomBytes, 16);
* ```
*/
function probeRandomBytes(randomBytes, length) {
	if (randomBytes === void 0) return void 0;
	afunction(randomBytes, "randomBytes");
	try {
		const probe = randomBytes(length);
		if (!isBytes(probe) || probe.length !== length) return void 0;
	} catch {
		return;
	}
	return randomBytes;
}
function validateMSMPoints(points, c) {
	aarray(points, "points");
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error("invalid point at index " + i);
	});
}
function validateMSMScalars(scalars, field, maxScalar) {
	if (!Array.isArray(scalars)) throw new Error("array of scalars expected");
	scalars.forEach((s, i) => {
		if (!(maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar)) throw new Error("invalid scalar at index " + i);
	});
}
const pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getWindowSize(P) {
	return pointWindowSizes.get(P) || 1;
}
/** Table of odd multiples [1P, 3P, ..., (2⋅size−1)P]; width-W wNAF uses size = 2^(W−2). */
function oddMultiples(p, size) {
	const dbl = p.double();
	const t = [p];
	for (let j = 1; j < size; j++) t.push(t[j - 1].add(dbl));
	return t;
}
/**
* Width-W wNAF signed-digit recoding (W >= 2), LSB-first: digits are 0 or odd with
* |digit| < 2^(W−1); nonzero density ~1/(W+1) (a nonzero digit is followed by W−1 zeros).
*/
function wnafDigits(n, W) {
	const size = 2 ** W;
	const half = size / 2;
	const mask = BigInt(size - 1);
	const d = [];
	while (n > _0n$3) {
		let w = 0;
		if (n & _1n$3) {
			w = Number(n & mask);
			if (w >= half) w -= size;
			n -= BigInt(w);
		}
		d.push(w);
		n >>= _1n$3;
	}
	return d;
}
/**
* Fixed-position signed-window recoding for precomputed wNAF: `n = Σ digits[w]⋅2^(w⋅W)` with
* digits in `[−2^(W−1)+1, 2^(W−1)]`. Digit count is fixed by `windows` (callers reserve one
* extra window for the final carry), so recoding length does not depend on the scalar.
*/
function signedWindowDigits(n, W, windows) {
	const size = 2 ** W;
	const half = size / 2;
	const mask = BigInt(size - 1);
	const shiftBy = BigInt(W);
	const d = [];
	for (let w = 0; w < windows; w++) {
		let v = Number(n & mask);
		n >>= shiftBy;
		if (v > half) {
			v -= size;
			n += _1n$3;
		}
		d.push(v);
	}
	if (n !== _0n$3) throw new Error("invalid wnaf");
	return d;
}
/**
* Shared vartime walk over per-scalar wNAF digit streams: one doubling of a single shared
* accumulator per bit position of the longest recoding, one signed table addition per
* nonzero digit. `tables[i]` must hold the odd multiples of the i-th point.
*/
function wnafWalk(zero, tables, digits) {
	let max = 0;
	for (const d of digits) max = Math.max(max, d.length);
	let acc = zero;
	for (let bit = max - 1; bit >= 0; bit--) {
		if (bit !== max - 1) acc = acc.double();
		for (let i = 0; i < digits.length; i++) {
			const w = digits[i][bit];
			if (w) {
				const item = tables[i][Math.abs(w) - 1 >> 1];
				acc = acc.add(w < 0 ? item.negate() : item);
			}
		}
	}
	return acc;
}
/**
* Elliptic curve multiplication of Point by scalar.
* Routes between cached-table, fixed-window, and one-shot wNAF paths; entry points validate
* their own scalars (`mulCT`/`mulCTBlinded`: `1 <= s < Fn.ORDER`; `mulUnsafe`: up to the
* `Fn.ORDER^4` DoS cap via {@link mulAddUnsafe}).
* Table generation is expensive and happens on first call of `multiply()`
* (or eagerly via `precompute(W, false)`). By default, `BASE` point is precomputed.
*
* Cached algorithm is signed fixed-window wNAF:
* - table stores, for every window w, the multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P` — all doublings
*   are baked in, so a multiplication is exactly one table addition per window
* - window count is fixed (`ceil(bits/W) + 1`), so the point-operation count is scalar-independent
*   (basis of the constant-time path)
* - for a 256-bit curve and W=6: 44⋅32 = 1408 table points, 44 additions per multiply
* - secret scalars are additionally blinded (see {@link ScalarMultiplier.mulCTBlinded}), which
*   widens tables by 128 bits
* @param Point - Point constructor.
* @param randomBytes - RNG used for scalar blinding; required by the blinded secret path.
* @example
* Elliptic curve multiplication of Point by scalar.
*
* ```ts
* import { ScalarMultiplier } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const mul = new ScalarMultiplier(p256.Point);
* ```
*/
var ScalarMultiplier = class {
	Point;
	BASE;
	ZERO;
	randomBytes;
	wnafPrecomputes = /* @__PURE__ */ new WeakMap();
	baseCanBeBlinded;
	bits;
	constructor(Point, randomBytes) {
		validatePointCons(Point);
		this.randomBytes = probeRandomBytes(randomBytes, BLIND_BYTES);
		this.Point = Point;
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.bits = Point.Fn.BITS;
	}
	/**
	* Creates a signed fixed-window wNAF precomputation table: for every window w, the
	* multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
	* so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
	* window absorbs the final carry of signed-digit recoding.
	* For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
	* @param point - Point instance
	* @param W - window size
	* @param bits - scalar bitlength the table must cover
	*/
	buildWnafTable(point, W, bits) {
		const windows = Math.ceil(bits / W) + 1;
		const half = 2 ** (W - 1);
		const comp = [];
		let base = point;
		for (let w = 0; w < windows; w++) {
			let acc = base;
			for (let i = 0; i < half; i++) {
				comp.push(acc);
				acc = acc.add(base);
			}
			base = comp[comp.length - 1].double();
		}
		return {
			W,
			bits,
			windows,
			comp
		};
	}
	/**
	* Implements ec multiplication using precomputed signed fixed-window wNAF tables.
	* Constant-time: fixed window count with one table addition per window — zero digits feed
	* the fake accumulator — and no doublings; the lookup scans the whole window slice.
	* Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
	* {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
	* signedWindowDigits throws if `n` exceeds the table.
	* @returns real and fake (for const-time) points
	*/
	wnafCachedCT(precomputes, n) {
		const { W, windows, comp } = precomputes;
		const half = 2 ** (W - 1);
		const digits = signedWindowDigits(n, W, windows);
		let p = this.ZERO;
		let f = this.BASE;
		for (let w = 0; w < windows; w++) {
			const digit = digits[w];
			const start = w * half;
			const idx = Math.abs(digit) - 1;
			let sel = comp[start];
			for (let i = 1; i < half; i++) sel = i === idx ? comp[start + i] : sel;
			const neg = sel.negate();
			if (digit === 0) f = f.add(comp[start]);
			else p = p.add(digit < 0 ? neg : sel);
		}
		return {
			p,
			f
		};
	}
	getWnafPrecomputes(W, point, bits, transform) {
		let entries = this.wnafPrecomputes.get(point);
		let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
		if (!comp) {
			comp = this.buildWnafTable(point, W, bits);
			if (typeof transform === "function") comp = {
				...comp,
				comp: transform(comp.comp)
			};
			if (!entries) {
				entries = [];
				this.wnafPrecomputes.set(point, entries);
			}
			entries.push(comp);
		}
		return comp;
	}
	assertPoint(point) {
		if (!(point instanceof this.Point)) throw new TypeError("\"point\" expected Point instance, got type=" + typeof point);
	}
	validateMulInput(point, scalar) {
		this.assertPoint(point);
		if (!inRange(scalar, _1n$3, this.Point.Fn.ORDER)) throw new Error("invalid scalar");
	}
	runCT(point, n, bits, transform) {
		const W = getWindowSize(point);
		if (W === 1) return this.fixedWindowCT(point, n, bits);
		return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
	}
	mulCT(point, scalar, transform) {
		this.validateMulInput(point, scalar);
		return this.runCT(point, scalar, this.bits, transform);
	}
	mulCTBlinded(point, scalar, transform) {
		this.validateMulInput(point, scalar);
		if (this.randomBytes === void 0) throw new Error("randomBytes is required for scalar blinding");
		const bits = this.Point.Fn.BITS + BLIND_BITS;
		const blind = this.randomBytes(BLIND_BYTES);
		if (!isBytes(blind) || blind.length !== BLIND_BYTES) throw new Error("randomBytes returned invalid byte array");
		blind[0] = blind[0] & 63 | 128;
		const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
		return this.runCT(point, n, bits, transform);
	}
	/**
	* Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
	* A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
	* far cheaper to build for a single use. The point-operation sequence is independent of `n`:
	* build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
	* every table entry, and one addition (adds the identity when the window digit is 0 — never
	* skipped).
	*
	* `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
	* add), which holds for the Weierstrass/Edwards point types used here. The table is left in
	* projective form (no normalizeZ): normalizing this small a table costs more than the
	* mixed-add savings it would buy for a single multiply.
	* @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
	* (this path needs no fake accumulator — its op-count is already scalar-independent).
	*/
	fixedWindowCT(point, n, bits) {
		const W = FW_WINDOW;
		const size = 32;
		const mask = bitMask(W);
		const table = new Array(size);
		table[0] = this.ZERO;
		for (let i = 1; i < size; i++) table[i] = table[i - 1].add(point);
		const windows = Math.ceil(bits / W);
		let acc = this.ZERO;
		for (let window = windows - 1; window >= 0; window--) {
			if (window !== windows - 1) for (let d = 0; d < W; d++) acc = acc.double();
			const digit = Number(n >> BigInt(window * W) & mask);
			let sel = table[0];
			for (let i = 1; i < size; i++) sel = i === digit ? table[i] : sel;
			acc = acc.add(sel);
		}
		return {
			p: acc,
			f: acc
		};
	}
	shouldBlind(point, cofactor) {
		if (this.randomBytes === void 0) return false;
		if (cofactor === _1n$3) return true;
		if (point !== this.BASE) return false;
		if (this.baseCanBeBlinded === void 0) this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
		return this.baseCanBeBlinded;
	}
	mulSecret(point, scalar, cofactor, transform) {
		return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
	}
	mulUnsafe(point, scalar, transform) {
		this.assertPoint(point);
		if (!isPosBig(scalar)) throw new Error("invalid scalar");
		const W = getWindowSize(point);
		if (W === 1 || scalar >= this.Point.Fn.ORDER) return mulAddUnsafe(this.Point, [point], [scalar], true);
		const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
		return this.wnafCachedCT(precomputes, scalar).p;
	}
	setWindowSize(point, W) {
		this.assertPoint(point);
		validateW(W, this.bits);
		validateTableBytes((Math.ceil((this.bits + BLIND_BITS) / W) + 1) * 2 ** (W - 1), this.Point.Fp.BYTES);
		pointWindowSizes.set(point, W);
		this.wnafPrecomputes.delete(point);
	}
	hasWindowSize(point) {
		return getWindowSize(point) !== 1;
	}
};
/**
* Combined multi-scalar multiplication `Σ scalars[i]⋅points[i]` via interleaved width-4 wNAF
* (Strauss–Shamir). Every input gets its own table of odd multiples `[1P, 3P, 5P, 7P]` and
* signed-digit recoding, but all walks share one doubling chain, so total cost is
* `~bits` doublings + `L⋅bits/5` additions instead of `L⋅bits` doublings for separate
* multiplications. Intended for the 2-4 point shapes of signature verification
* (`R = u1⋅G + u2⋅P`); use {@link pippenger} for larger batches.
*
* Not constant-time: only for public inputs. Scalars must satisfy `0 <= s < Fn.ORDER`;
* fold negative signs into the points before calling.
* @param c - Point constructor.
* @param points - Array of curve points.
* @param scalars - Array of non-negative scalars, same length as points.
* @param allowOversized - Replace the `s < Fn.ORDER` scalar check with a `Fn.ORDER^4` DoS cap.
*   Off by default. For scalars that must NOT be reduced mod ORDER: torsion checks
*   (`Fn.ORDER⋅P ≟ O`) and cofactor-clearing multiples. Walk length grows with `bitLen(s)`.
* @returns Combined multiplication result; identity for empty input.
* @throws If the point set or scalar set is invalid. {@link Error}
* @example
* Combined multi-scalar multiplication via Strauss–Shamir.
*
* ```ts
* import { mulAddUnsafe } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const G = p256.Point.BASE;
* const R = mulAddUnsafe(p256.Point, [G, G.double()], [2n, 3n]); // 2⋅G + 3⋅(2⋅G)
* ```
*/
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
	validatePointCons(c);
	validateMSMPoints(points, c);
	abool(allowOversized, "allowOversized");
	validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n$1 : void 0);
	if (points.length !== scalars.length) throw new Error("arrays of points and scalars must have equal length");
	const tables = points.map((p) => oddMultiples(p, 4));
	const digits = scalars.map((n) => wnafDigits(n, 4));
	return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/**
* Validates basic CURVE shape and field membership, then creates fields.
* This does not prove that the generator is on-curve, that subgroup/order data are consistent, or
* that the curve equation itself is otherwise sane.
* @param type - Curve family.
* @param CURVE - Curve parameters.
* @param curveOpts - Optional field overrides. See {@link FpFn}:
*   - `Fp` (optional): Optional base-field override.
*   - `Fn` (optional): Optional scalar-field override.
* @param FpFnLE - Whether field encoding is little-endian.
* @returns Frozen curve parameters and fields.
* @throws If the curve parameters or field overrides are invalid. {@link Error}
* @example
* Build curve fields from raw constants before constructing a curve instance.
*
* ```ts
* const curve = createCurveFields('weierstrass', {
*   p: 17n,
*   n: 19n,
*   h: 1n,
*   a: 2n,
*   b: 2n,
*   Gx: 5n,
*   Gy: 1n,
* });
* ```
*/
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (type !== "weierstrass" && type !== "edwards") throw new Error("expected curve type \"weierstrass\" or \"edwards\"");
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	validateObject(curveOpts);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(isPosBig(val) && val !== _0n$3)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
/**
* @param randomSecretKey - Secret-key generator.
* @param getPublicKey - Public-key derivation helper.
* @returns Keypair generator.
* @example
* Build a `keygen()` helper from existing secret-key and public-key primitives.
*
* ```ts
* import { createKeygen } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const keygen = createKeygen(p256.utils.randomSecretKey, p256.getPublicKey);
* const pair = keygen();
* ```
*/
function createKeygen(randomSecretKey, getPublicKey) {
	return function keygen(seed) {
		const secretKey = randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	};
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/edwards.js
/**
* Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
* For design rationale of types / exports, see weierstrass module documentation.
* Untwisted Edwards curves exist, but they aren't used in real-world protocols.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$2 = /* @__PURE__ */ BigInt(0);
const _1n$2 = /* @__PURE__ */ BigInt(1);
const _2n$2 = /* @__PURE__ */ BigInt(2);
const _4n = /* @__PURE__ */ BigInt(4);
const _8n$1 = /* @__PURE__ */ BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
	const x2 = Fp.sqr(x);
	const y2 = Fp.sqr(y);
	const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
	const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
	return Fp.eql(left, right);
}
/**
* @param params - Curve parameters. See {@link EdwardsOpts}.
* @param extraOpts - Optional helpers and overrides. See {@link EdwardsExtraOpts}.
* @returns Edwards point constructor. Generator validation here only checks
*   that `(Gx, Gy)` satisfies the affine Edwards equation.
*   RFC 8032 base-point constraints like `B != (0,1)` and `[L]B = 0`
*   are left to the caller's chosen parameters, since eager subgroup
*   validation here adds about 10-15ms to heavyweight imports like ed448.
*   The returned constructor also eagerly marks `Point.BASE` for W=6
*   precompute caching. Some code paths still assume
*   `Fp.BYTES === Fn.BYTES`, so mismatched byte lengths are not fully audited here.
* @throws If the curve parameters or Edwards overrides are invalid. {@link Error}
* @example
* ```ts
* import { edwards } from '@noble/curves/abstract/edwards.js';
* import { jubjub } from '@noble/curves/misc.js';
* // Build a point constructor from explicit curve parameters, then use its base point.
* const Point = edwards(jubjub.Point.CURVE());
* Point.BASE.toHex();
* ```
*/
function edwards(params, extraOpts = {}) {
	validateObject(extraOpts, {}, {}, "extraOpts");
	const opts = extraOpts;
	const validated = createCurveFields("edwards", params, opts, opts.FpFnLE);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor } = CURVE;
	if (FpLegendre(Fp, CURVE.a) !== 1) throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
	if (FpLegendre(Fp, CURVE.d) !== -1) throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
	validateObject(opts, {}, {
		uvRatio: "function",
		randomBytes: "function"
	});
	const randomBytes = opts.randomBytes === void 0 ? randomBytes$1 : opts.randomBytes;
	const MASK = _2n$2 << BigInt(Fp.BYTES * 8) - _1n$2;
	function isOdd(n) {
		if (!Fp.isOdd) throw new Error("Field does not have .isOdd()");
		return Fp.isOdd(n);
	}
	const uvRatio = opts.uvRatio === void 0 ? (u, v) => {
		try {
			return {
				isValid: true,
				value: Fp.sqrt(Fp.div(u, v))
			};
		} catch (e) {
			return {
				isValid: false,
				value: _0n$2
			};
		}
	} : opts.uvRatio;
	if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const mulA = Fp.eql(CURVE.a, Fp.neg(Fp.ONE)) ? (x) => Fp.neg(x) : Fp.eql(CURVE.a, Fp.ONE) ? (x) => x : (x) => Fp.mul(CURVE.a, x);
	/**
	* Asserts coordinate is valid: 0 <= n < MASK.
	* Coordinates >= Fp.ORDER are allowed for zip215.
	*/
	function acoord(title, n, banZero = false) {
		const min = banZero ? _1n$2 : _0n$2;
		aInRange("coordinate " + title, n, min, MASK);
		return n;
	}
	function aedpoint(other) {
		if (!(other instanceof Point)) throw new Error("EdwardsPoint expected");
	}
	class Point {
		static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE, Fp.mul(CURVE.Gx, CURVE.Gy));
		static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ONE, Fp.ZERO);
		static Fp = Fp;
		static Fn = Fn;
		X;
		Y;
		Z;
		T;
		constructor(X, Y, Z, T) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y);
			this.Z = acoord("z", Z, true);
			this.T = acoord("t", T);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		/**
		* Create one extended Edwards point from affine coordinates.
		* Does NOT validate that the point is on-curve or torsion-free.
		* Use `.assertValidity()` on adversarial inputs.
		*/
		static fromAffine(p) {
			if (p instanceof Point) throw new Error("extended point not allowed");
			const { x, y } = p || {};
			acoord("x", x);
			acoord("y", y);
			return new Point(x, y, Fp.ONE, Fp.mul(x, y));
		}
		static fromBytes(bytes, zip215 = false) {
			const len = Fp.BYTES;
			const { a, d } = CURVE;
			bytes = copyBytes(abytes(bytes, len, "point"));
			abool(zip215, "zip215");
			const normed = copyBytes(bytes);
			const lastByte = bytes[len - 1];
			normed[len - 1] = lastByte & -129;
			const y = bytesToNumberLE(normed);
			const max = zip215 ? MASK : Fp.ORDER;
			aInRange("point.y", y, _0n$2, max);
			const y2 = Fp.sqr(y);
			const u = Fp.sub(y2, Fp.ONE);
			const v = Fp.sub(Fp.mulN(d, y2), a);
			let { isValid, value: x } = uvRatio(u, v);
			if (!isValid) throw new Error("bad point: invalid y coordinate");
			const isXOdd = isOdd(x);
			const isLastByteOdd = (lastByte & 128) !== 0;
			if (!zip215 && Fp.is0(x) && isLastByteOdd) throw new Error("bad point: x=0 and x_0=1");
			if (isLastByteOdd !== isXOdd) x = Fp.neg(x);
			return Point.fromAffine({
				x,
				y
			});
		}
		static fromHex(hex, zip215 = false) {
			return Point.fromBytes(hexToBytes(hex), zip215);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(windowSize = 6, isLazy = true) {
			wnaf.setWindowSize(this, windowSize);
			if (!isLazy) this.multiply(_2n$2);
			return this;
		}
		assertValidity() {
			const p = this;
			const { a, d } = CURVE;
			if (p.is0()) throw new Error("bad point: ZERO");
			const { X, Y, Z, T } = p;
			const X2 = Fp.sqr(X);
			const Y2 = Fp.sqr(Y);
			const Z2 = Fp.sqr(Z);
			const Z4 = Fp.sqr(Z2);
			const aX2 = Fp.mul(X2, a);
			const left = Fp.mul(Fp.add(aX2, Y2), Z2);
			const right = Fp.add(Z4, Fp.mul(d, Fp.mul(X2, Y2)));
			if (!Fp.eql(left, right)) throw new Error("bad point: equation left != right (1)");
			const XY = Fp.mul(X, Y);
			const ZT = Fp.mul(Z, T);
			if (!Fp.eql(XY, ZT)) throw new Error("bad point: equation left != right (2)");
		}
		equals(other) {
			aedpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const X1Z2 = Fp.mul(X1, Z2);
			const X2Z1 = Fp.mul(X2, Z1);
			const Y1Z2 = Fp.mul(Y1, Z2);
			const Y2Z1 = Fp.mul(Y2, Z1);
			return Fp.eql(X1Z2, X2Z1) && Fp.eql(Y1Z2, Y2Z1);
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		negate() {
			return new Point(Fp.neg(this.X), this.Y, this.Z, Fp.neg(this.T));
		}
		double() {
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const A = Fp.sqr(X1);
			const B = Fp.sqr(Y1);
			const C = Fp.mul(Fp.sqr(Z1), _2n$2);
			const D = mulA(A);
			const x1y1 = Fp.addN(X1, Y1);
			const E = Fp.sub(Fp.subN(Fp.sqr(x1y1), A), B);
			const G = Fp.addN(D, B);
			const F = Fp.subN(G, C);
			const H = Fp.subN(D, B);
			const X3 = Fp.mul(E, F);
			const Y3 = Fp.mul(G, H);
			const T3 = Fp.mul(E, H);
			const Z3 = Fp.mul(F, G);
			return new Point(X3, Y3, Z3, T3);
		}
		add(other) {
			aedpoint(other);
			const { d } = CURVE;
			const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
			const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
			const A = Fp.mul(X1, X2);
			const B = Fp.mul(Y1, Y2);
			const C = Fp.mul(Fp.mulN(T1, d), T2);
			const D = Fp.mul(Z1, Z2);
			const E = Fp.sub(Fp.subN(Fp.mulN(Fp.addN(X1, Y1), Fp.addN(X2, Y2)), A), B);
			const F = Fp.subN(D, C);
			const G = Fp.addN(D, C);
			const H = Fp.sub(B, mulA(A));
			const X3 = Fp.mul(E, F);
			const Y3 = Fp.mul(G, H);
			const T3 = Fp.mul(E, H);
			const Z3 = Fp.mul(F, G);
			return new Point(X3, Y3, Z3, T3);
		}
		subtract(other) {
			aedpoint(other);
			return this.add(other.negate());
		}
		multiply(scalar) {
			if (!Fn.isValidNot0(scalar)) throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
			const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize);
			return normalize([p, f])[0];
		}
		multiplyUnsafe(scalar) {
			if (!Fn.isValid(scalar)) throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
			if (scalar === _0n$2) return Point.ZERO;
			if (this.is0() || scalar === _1n$2) return this;
			return wnaf.mulUnsafe(this, scalar, normalize);
		}
		isSmallOrder() {
			return this.clearCofactor().is0();
		}
		isTorsionFree() {
			return wnaf.mulUnsafe(this, CURVE.n).is0();
		}
		toAffine(invertedZ) {
			const p = this;
			let iz = invertedZ;
			if (iz != null && typeof iz !== "bigint") throw new TypeError("\"invertedZ\" expected bigint, got type=" + typeof iz);
			const { X, Y, Z } = p;
			const is0 = p.is0();
			if (iz == null) iz = is0 ? Fp.create(_8n$1) : Fp.inv(Z);
			const x = Fp.mul(X, iz);
			const y = Fp.mul(Y, iz);
			const zz = Fp.mul(Z, iz);
			if (is0) return {
				x: Fp.ZERO,
				y: Fp.ONE
			};
			if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
			return {
				x,
				y
			};
		}
		clearCofactor() {
			if (cofactor === _1n$2) return this;
			if (cofactor === _2n$2) return this.double();
			if (cofactor === _4n) return this.double().double();
			if (cofactor === _8n$1) return this.double().double().double();
			return this.multiplyUnsafe(cofactor);
		}
		toBytes() {
			const { x, y } = this.toAffine();
			const bytes = Fp.toBytes(y);
			bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
			return bytes;
		}
		toHex() {
			return bytesToHex(this.toBytes());
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	const normalize = (points) => normalizeZ(Point, points);
	const wnaf = new ScalarMultiplier(Point, randomBytes);
	if (wnaf.bits >= 6) Point.BASE.precompute(6);
	Object.freeze(Point.prototype);
	Object.freeze(Point);
	return Point;
}
/**
* Initializes EdDSA signatures over given Edwards curve.
* @param Point - Edwards point constructor.
* @param cHash - Hash function.
* @param eddsaOpts - Optional signature helpers. See {@link EdDSAOpts}.
* @returns EdDSA helper namespace.
* @throws If the hash function, options, or derived point operations are invalid. {@link Error}
* @example
* Initializes EdDSA signatures over given Edwards curve.
*
* ```ts
* import { eddsa } from '@noble/curves/abstract/edwards.js';
* import { jubjub } from '@noble/curves/misc.js';
* import { sha512 } from '@noble/hashes/sha2.js';
* const sigs = eddsa(jubjub.Point, sha512);
* const { secretKey, publicKey } = sigs.keygen();
* const msg = new TextEncoder().encode('hello noble');
* const sig = sigs.sign(msg, secretKey);
* const isValid = sigs.verify(sig, msg, publicKey);
* ```
*/
function eddsa(Point, cHash, eddsaOpts = {}) {
	validatePointCons(Point);
	if (typeof cHash !== "function") throw new Error("\"hash\" function param is required");
	const hash = cHash;
	const opts = eddsaOpts;
	validateObject(opts, {}, {
		adjustScalarBytes: "function",
		randomBytes: "function",
		domain: "function",
		prehash: "function",
		zip215: "boolean",
		mapToCurve: "function",
		toMontgomery: "function",
		toMontgomerySecret: "function"
	});
	const { prehash } = opts;
	const { BASE, Fp, Fn } = Point;
	const outputLen = hash.outputLen;
	const expectedLen = 2 * Fp.BYTES;
	if (outputLen !== void 0) {
		asafenumber(outputLen, "hash.outputLen");
		if (outputLen !== expectedLen) throw new Error(`hash.outputLen must be ${expectedLen}, got ${outputLen}`);
	}
	const randomBytes = opts.randomBytes === void 0 ? randomBytes$1 : opts.randomBytes;
	const toMontgomery = opts.toMontgomery;
	const toMontgomerySecret = opts.toMontgomerySecret;
	const adjustScalarBytes = opts.adjustScalarBytes === void 0 ? (bytes) => bytes : opts.adjustScalarBytes;
	const domain = opts.domain === void 0 ? (data, ctx, phflag) => {
		abool(phflag, "phflag");
		if (ctx.length || phflag) throw new Error("Contexts/pre-hash are not supported");
		return data;
	} : opts.domain;
	function modN_LE(hash) {
		return Fn.create(bytesToNumberLE(hash));
	}
	function getPrivateScalar(key) {
		const len = lengths.secretKey;
		abytes(key, lengths.secretKey, "secretKey");
		const hashed = abytes(hash(key), 2 * len, "hashedSecretKey");
		const head = adjustScalarBytes(hashed.slice(0, len));
		return {
			head,
			prefix: hashed.slice(len, 2 * len),
			scalar: modN_LE(head)
		};
	}
	/** Convenience method that creates public key from scalar. RFC8032 5.1.5
	* Also exposes the derived scalar/prefix tuple and point form reused by sign().
	*/
	function getExtendedPublicKey(secretKey) {
		const { head, prefix, scalar } = getPrivateScalar(secretKey);
		const point = BASE.multiply(scalar);
		return {
			head,
			prefix,
			scalar,
			point,
			pointBytes: point.toBytes()
		};
	}
	/** Calculates EdDSA pub key. RFC8032 5.1.5. */
	function getPublicKey(secretKey) {
		return getExtendedPublicKey(secretKey).pointBytes;
	}
	function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
		const msg = concatBytes(...msgs);
		return modN_LE(hash(domain(msg, abytes(context, void 0, "context"), !!prehash)));
	}
	/** Signs message with secret key. RFC8032 5.1.6 */
	function sign(msg, secretKey, options = {}) {
		validateObject(options, {}, {}, "options");
		msg = copyBytes(abytes(msg, void 0, "message"));
		if (prehash) msg = prehash(msg);
		const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
		const r = hashDomainToScalar(options.context, prefix, msg);
		const R = BASE.multiply(r).toBytes();
		const k = hashDomainToScalar(options.context, R, pointBytes, msg);
		const s = Fn.create(r + k * scalar);
		if (!Fn.isValid(s)) throw new Error("sign failed: invalid s");
		const rs = concatBytes(R, Fn.toBytes(s));
		return abytes(rs, lengths.signature, "result");
	}
	const verifyOpts = { zip215: opts.zip215 };
	/**
	* Verifies EdDSA signature against message and public key. RFC 8032 §§5.1.7 and 5.2.7.
	* A cofactored verification equation is checked.
	*/
	function verify(sig, msg, publicKey, options = verifyOpts) {
		validateObject(options);
		const { context } = options;
		const zip215 = options.zip215 === void 0 ? !!verifyOpts.zip215 : options.zip215;
		const len = lengths.signature;
		sig = abytes(sig, len, "signature");
		msg = abytes(msg, void 0, "message");
		publicKey = abytes(publicKey, lengths.publicKey, "publicKey");
		if (zip215 !== void 0) abool(zip215, "zip215");
		if (prehash) msg = prehash(msg);
		const mid = len / 2;
		const r = sig.subarray(0, mid);
		const s = bytesToNumberLE(sig.subarray(mid, len));
		let A, R, SB;
		try {
			A = Point.fromBytes(publicKey, zip215);
			R = Point.fromBytes(r, zip215);
			SB = BASE.multiplyUnsafe(s);
		} catch (error) {
			return false;
		}
		if (!zip215 && A.isSmallOrder()) return false;
		const k = hashDomainToScalar(context, r, publicKey, msg);
		return R.add(A.multiplyUnsafe(k)).subtract(SB).clearCofactor().is0();
	}
	const _size = Fp.BYTES;
	const lengths = {
		secretKey: _size,
		publicKey: _size,
		signature: 2 * _size,
		seed: _size
	};
	function randomSecretKey(seed) {
		seed = seed === void 0 ? randomBytes(lengths.seed) : seed;
		return abytes(seed, lengths.seed, "seed");
	}
	function isValidSecretKey(key) {
		return isBytes(key) && key.length === lengths.secretKey;
	}
	function isValidPublicKey(key, zip215) {
		try {
			return !!Point.fromBytes(key, zip215 === void 0 ? verifyOpts.zip215 : zip215);
		} catch (error) {
			return false;
		}
	}
	const utils = {
		getExtendedPublicKey,
		randomSecretKey,
		isValidSecretKey,
		isValidPublicKey,
		/** Converts an Edwards public key to a companion Montgomery public key. */
		toMontgomery(publicKey) {
			if (toMontgomery === void 0) throw new Error("Montgomery conversion is not supported for this curve");
			return toMontgomery(Point.fromBytes(publicKey));
		},
		toMontgomerySecret(secretKey) {
			if (toMontgomerySecret === void 0) throw new Error("Montgomery conversion is not supported for this curve");
			return toMontgomerySecret(secretKey);
		}
	};
	Object.freeze(lengths);
	Object.freeze(utils);
	return Object.freeze({
		keygen: createKeygen(randomSecretKey, getPublicKey),
		getPublicKey,
		sign,
		verify,
		utils,
		Point,
		lengths
	});
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/montgomery.js
/**
* Montgomery curve methods. It's not really whole montgomery curve,
* just bunch of very specific methods for X25519 / X448 from
* [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748)
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$1 = /* @__PURE__ */ BigInt(0);
const _1n$1 = /* @__PURE__ */ BigInt(1);
const _2n$1 = /* @__PURE__ */ BigInt(2);
/**
* Selector for cswap(): `P` to keep, `P + 1` to swap, chosen by the low bit of `swap`.
* Higher bits are ignored, and `swap` is passed in whole rather than as a {0n, 1n} bit on
* purpose: `P + (swap & _1n)` would short-circuit the addition whenever the bit is clear, which
* is the very leak this construction avoids, one round-trip further down. Subtracting `swap`
* with its low bit cleared keeps every operand full-width instead.
* @param P - Field modulus.
* @param swap - Value whose low bit selects; ignored above that bit.
* @returns `P` when the low bit is clear, `P + 1` when it is set.
*/
function cmask(P, swap) {
	return P + swap - (swap >> _1n$1 << _1n$1);
}
/**
* Swap two field elements when `mask` is `P + 1`, keep them when it is `P`:
*
*   d    = 6P + x_3 - x_2
*   x_2' = d * mask + x_2   (mod P)      x_3' = (x_2 + x_3) - x_2'
*
* The extra `6P * mask` vanishes modulo P, so `mask === P` leaves x_2 and `mask === P + 1`
* leaves x_3. Without the offset, the reduction dividend changes sign with input order and crosses
* BigInt limb boundaries; those classes measured differently on the tested Node/V8 build. For
* canonical inputs, the deliberately left-associative `offset + x_3 - x_2` is between 5P and 7P,
* keeping the dividend positive and in one word-count band for both RFC fields and masks. Six is
* the smallest coefficient `c` for which the shared offset `cP` has that property.
*
* This reduced the tested sign/size timing ratios, but JavaScript BigInt has no constant-time
* contract and the contents of the multiply and remainder still vary. Valid ladder states can
* contain genuine zero coordinates; this construction does not mask those value-shape effects.
* Computing `x_3'` independently as `((6P + x_2 - x_3) * mask + x_3) % P` is more symmetric.
* On the tested Node/V8 build, it reduced the timing difference between keeping `(0, v)` and
* swapping `(v, 0)`—both return `(0, v)`—from about 10%/13% for X25519/X448 to about 3%.
* Successful calls cannot reach that zero-in-the-first-output case. For the case they can reach,
* swapping `(0, v)` and keeping `(v, 0)` both return `(v, 0)`; the difference instead grew from
* about 0.7%/1.1% to 2.7%/2.8%. The extra multiply/remainder also made public
* `getSharedSecret()` about 16% slower. The retained one-remainder form measured about 2.5%
* slower than the prior helper for public X25519 `getSharedSecret()` in the same environment.
* x_3' falls out of the sum, which a swap leaves invariant: no second multiply or reduction is
* needed. Bind `6P` once per field so production and the timing regression exercise the same
* configured helper without paying for the multiplication in every ladder round.
*
* The returned function is called twice per ladder round, so it validates nothing. Both elements
* MUST already be reduced mod P; unreduced input silently corrupts the kept-side output.
* @param P - Field modulus.
* @returns A field-bound swap function taking mask, x_2, and x_3.
*/
function cswap(P) {
	const offset = BigInt(6) * P;
	return (mask, x_2, x_3) => {
		const sum = x_2 + x_3;
		const a = ((offset + x_3 - x_2) * mask + x_2) % P;
		return {
			x_2: a,
			x_3: sum - a
		};
	};
}
function validateOpts(curve) {
	validateObject(curve, {
		P: "bigint",
		type: "string",
		adjustScalarBytes: "function",
		powPminus2: "function"
	}, {
		randomBytes: "function",
		scalarMultBase: "function"
	});
	return Object.freeze({ ...curve });
}
/**
* @param curveDef - Montgomery curve definition.
* @returns ECDH helper namespace.
* @throws If the curve definition or derived shared point is invalid. {@link Error}
* @example
* Build an X25519 helper from curve parameters, then derive one public key.
*
* ```ts
* import { montgomery } from '@noble/curves/abstract/montgomery.js';
* const P = 2n ** 255n - 19n;
* const mod = (num: bigint) => {
*   const out = num % P;
*   return out >= 0n ? out : out + P;
* };
* const pow = (num: bigint, power: bigint) => {
*   let res = 1n;
*   for (; power > 0n; power >>= 1n) {
*     if (power & 1n) res = mod(res * num);
*     num = mod(num * num);
*   }
*   return res;
* };
* const x25519 = montgomery({
*   P,
*   type: 'x25519',
*   adjustScalarBytes(bytes: Uint8Array) {
*     bytes[0] &= 248;
*     bytes[31] &= 127;
*     bytes[31] |= 64;
*     return bytes;
*   },
*   powPminus2(x) {
*     return pow(x, P - 2n);
*   },
* });
* const publicKey = x25519.getPublicKey(new Uint8Array(32).fill(1));
* ```
*/
function montgomery(curveDef) {
	const CURVE = validateOpts(curveDef);
	const { P, type, adjustScalarBytes, powPminus2, randomBytes: rand } = CURVE;
	const mulBaseHook = CURVE.scalarMultBase;
	const is25519 = type === "x25519";
	if (!is25519 && type !== "x448") throw new Error("invalid type");
	const randomBytes_ = rand === void 0 ? randomBytes$1 : rand;
	const montgomeryBits = is25519 ? 255 : 448;
	const swap = cswap(P);
	const fieldLen = is25519 ? 32 : 56;
	const Gu = is25519 ? BigInt(9) : BigInt(5);
	const a24 = is25519 ? BigInt(121665) : BigInt(39081);
	const minScalar = is25519 ? _2n$1 ** BigInt(254) : _2n$1 ** BigInt(447);
	const maxScalar = minScalar + (is25519 ? BigInt(8) * (_2n$1 ** BigInt(251) - _1n$1) : BigInt(4) * (_2n$1 ** BigInt(445) - _1n$1)) + _1n$1;
	const modP = (n) => mod(n, P);
	const GuBytes = encodeU(Gu);
	function encodeU(u) {
		return numberToBytesLE(modP(u), fieldLen);
	}
	function decodeU(u) {
		const _u = copyBytes(abytes(u, fieldLen, "uCoordinate"));
		if (is25519) _u[31] &= 127;
		return modP(bytesToNumberLE(_u));
	}
	function decodeScalar(scalar) {
		return bytesToNumberLE(adjustScalarBytes(copyBytes(abytes(scalar, fieldLen, "scalar"))));
	}
	/**
	* u coordinates whose order divides the cofactor, on the curve and on its quadratic twist -
	* the ladder sends every one of them to zero. Same blocklist libsodium and post-CVE-2017-0379
	* Libgcrypt carry. decodeU() reduces mod P first, so the non-canonical encodings P and P + 1
	* collapse onto 0 and 1, and `type` admits no curve beyond these two, so both lists are total.
	*
	* Complete by construction: x-only doubling sends u to (u^2 - 1)^2 / 4u(u^2 + a*u + 1). Order 4
	* therefore needs (u^2 - 1)^2 === 0, i.e. u = +-1; order 2 needs u(u^2 + a*u + 1) === 0, and
	* a^2 - 4 is a non-residue on both curves, leaving u = 0. curve448 stops there (cofactor 4);
	* curve25519 (cofactor 8) adds the two order-8 roots below. Cross-checked by clearing the
	* cofactor with those same doublings over 200k random u: no sixth value exists.
	*/
	const lowOrderU = new Set(is25519 ? [
		_0n$1,
		_1n$1,
		P - _1n$1,
		BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
		BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
	] : [
		_0n$1,
		_1n$1,
		P - _1n$1
	]);
	function scalarMult(scalar, u) {
		const pointU = decodeU(u);
		if (lowOrderU.has(pointU)) throw new Error("invalid private or public key received");
		const pu = montgomeryLadder(pointU, decodeScalar(scalar));
		if (pu === _0n$1) throw new Error("invalid private or public key received");
		return encodeU(pu);
	}
	function scalarMultBase(scalar) {
		if (mulBaseHook === void 0) return scalarMult(scalar, GuBytes);
		const k = decodeScalar(scalar);
		aInRange("scalar", k, minScalar, maxScalar);
		const pu = modP(mulBaseHook(k));
		if (pu === _0n$1) throw new Error("invalid private or public key received");
		return encodeU(pu);
	}
	const getPublicKey = scalarMultBase;
	const getSharedSecret = scalarMult;
	/**
	* Montgomery x-only multiplication ladder for the selected X25519/X448 curve.
	* @param pointU - decoded Montgomery u coordinate for the selected curve
	* @param scalar - decoded clamped scalar by which the point is multiplied
	* @returns resulting Montgomery u coordinate for the selected curve
	*/
	function montgomeryLadder(u, scalar) {
		aInRange("u", u, _0n$1, P);
		aInRange("scalar", scalar, minScalar, maxScalar);
		const k = scalar;
		const x_1 = u;
		let x_2 = _1n$1;
		let z_2 = _0n$1;
		let x_3 = u;
		let z_3 = _1n$1;
		const kx = k ^ k >> _1n$1;
		for (let t = BigInt(montgomeryBits - 1); t >= _0n$1; t--) {
			const mask = cmask(P, kx >> t);
			({x_2, x_3} = swap(mask, x_2, x_3));
			({x_2: z_2, x_3: z_3} = swap(mask, z_2, z_3));
			const A = x_2 + z_2;
			const AA = modP(A * A);
			const B = x_2 - z_2;
			const BB = modP(B * B);
			const E = AA - BB;
			const C = x_3 + z_3;
			const D = x_3 - z_3;
			const DA = modP(D * A);
			const CB = modP(C * B);
			const dacb = DA + CB;
			const da_cb = DA - CB;
			x_3 = modP(dacb * dacb);
			z_3 = modP(x_1 * modP(da_cb * da_cb));
			x_2 = modP(AA * BB);
			z_2 = modP(E * (AA + modP(a24 * E)));
		}
		const mask = cmask(P, k);
		({x_2, x_3} = swap(mask, x_2, x_3));
		({x_2: z_2, x_3: z_3} = swap(mask, z_2, z_3));
		const z2 = powPminus2(z_2);
		return modP(x_2 * z2);
	}
	const lengths = {
		secretKey: fieldLen,
		publicKey: fieldLen,
		seed: fieldLen
	};
	const randomSecretKey = (seed) => {
		seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
		abytes(seed, lengths.seed, "seed");
		return seed;
	};
	const utils = { randomSecretKey };
	Object.freeze(lengths);
	Object.freeze(utils);
	return Object.freeze({
		keygen: createKeygen(randomSecretKey, getPublicKey),
		getSharedSecret,
		getPublicKey,
		scalarMult,
		scalarMultBase,
		utils,
		GuBytes: GuBytes.slice(),
		lengths
	});
}
//#endregion
//#region node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/ed25519.js
/**
* ed25519 Twisted Edwards curve with following addons:
* - X25519 ECDH
* - Ristretto cofactor elimination
* - Elligator hash-to-group / point indistinguishability
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _3n = /* @__PURE__ */ BigInt(3);
const _5n = /* @__PURE__ */ BigInt(5);
const _8n = /* @__PURE__ */ BigInt(8);
const ed25519_CURVE_p = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
const ed25519_CURVE = /* @__PURE__ */ (() => ({
	p: ed25519_CURVE_p,
	n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
	h: _8n,
	a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
	d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
	Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
	Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
	const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
	const P = ed25519_CURVE_p;
	const b2 = x * x % P * x % P;
	const b5 = pow2(pow2(b2, _2n, P) * b2 % P, _1n, P) * x % P;
	const b10 = pow2(b5, _5n, P) * b5 % P;
	const b20 = pow2(b10, _10n, P) * b10 % P;
	const b40 = pow2(b20, _20n, P) * b20 % P;
	const b80 = pow2(b40, _40n, P) * b40 % P;
	return {
		pow_p_5_8: pow2(pow2(pow2(pow2(b80, _80n, P) * b80 % P, _80n, P) * b80 % P, _10n, P) * b10 % P, _2n, P) * x % P,
		b2
	};
}
function adjustScalarBytes(bytes) {
	bytes[0] &= 248;
	bytes[31] &= 127;
	bytes[31] |= 64;
	return bytes;
}
const ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
	const P = ed25519_CURVE_p;
	const v3 = mod(v * v * v, P);
	const pow = ed25519_pow_2_252_3(u * mod(v3 * v3 * v, P)).pow_p_5_8;
	let x = mod(u * v3 * pow, P);
	const vx2 = mod(v * x * x, P);
	const root1 = x;
	const root2 = mod(x * ED25519_SQRT_M1, P);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === mod(-u, P);
	const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if (isNegativeLE(x, P)) x = mod(-x, P);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
}
const ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
const Fp = /* @__PURE__ */ (() => ed25519_Point.Fp)();
function toMontgomery(point) {
	const { y } = point;
	return Fp.toBytes(Fp.div(_1n + y, _1n - y));
}
function toMontgomerySecret(secretKey) {
	const size = ed25519_Point.Fp.BYTES;
	abytes$2(secretKey, size);
	return adjustScalarBytes(sha512(secretKey.subarray(0, size))).subarray(0, size);
}
function ed(opts) {
	return eddsa(ed25519_Point, sha512, Object.assign({
		adjustScalarBytes,
		toMontgomery,
		toMontgomerySecret,
		zip215: true
	}, opts));
}
/**
* ed25519 curve with EdDSA signatures.
* Seeded `keygen(seed)` / `utils.randomSecretKey(seed)` reuse the provided
* 32-byte seed buffer instead of copying it.
* @example
* Generate one Ed25519 keypair, sign a message, and verify it.
*
* ```js
* import { ed25519 } from '@noble/curves/ed25519.js';
* const { secretKey, publicKey } = ed25519.keygen();
* // const publicKey = ed25519.getPublicKey(secretKey);
* const msg = new TextEncoder().encode('hello noble');
* const sig = ed25519.sign(msg, secretKey);
* const isValid = ed25519.verify(sig, msg, publicKey); // ZIP215
* // RFC8032 / FIPS 186-5
* const isValid2 = ed25519.verify(sig, msg, publicKey, { zip215: false });
* ```
*/
const ed25519 = /* @__PURE__ */ ed({});
/**
* ECDH using curve25519 aka x25519.
* `getSharedSecret()` rejects low-order peer inputs by default, and seeded
* `keygen(seed)` reuses the provided 32-byte seed buffer instead of copying it.
* @example
* Derive one shared secret between two X25519 peers.
*
* ```js
* import { x25519 } from '@noble/curves/ed25519.js';
* const alice = x25519.keygen();
* const bob = x25519.keygen();
* const alicePublic = x25519.getPublicKey(alice.secretKey);
* const shared = x25519.getSharedSecret(alice.secretKey, bob.publicKey);
* ```
*/
const x25519 = /* @__PURE__ */ (() => {
	const P = ed25519_CURVE_p;
	const powPminus2 = (x) => {
		const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
		return mod(pow2(pow_p_5_8, _3n, P) * b2, P);
	};
	return montgomery({
		P,
		type: "x25519",
		powPminus2,
		adjustScalarBytes,
		scalarMultBase: (k) => {
			const kn = mod(k, ed25519_Point.Fn.ORDER);
			if (kn === _0n) return _0n;
			const p = ed25519_Point.BASE.multiply(kn);
			return mod((p.Z + p.Y) * powPminus2(mod(p.Z - p.Y, P)), P);
		}
	});
})();
//#endregion
//#region extensions/reef/protocol/audit.ts
function appendAudit(store, type, payload, ts) {
	return store.appendEvent(type, payload, ts);
}
async function appendInboxRead(store, ids, ts) {
	return appendAudit(store, "read", { ids }, ts);
}
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
function createAuditEntry(type, payload, ts, auditKey, head, rng = randomBytes$2) {
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
			output[field] = { enc: base64(concatBytes$1(nonce, ciphertext)) };
		} else output[field] = encryptSensitive(child, key, rng);
		return output;
	}
	return value;
}
function hashEntry(previous, event) {
	const previousBytes = previous === "" ? /* @__PURE__ */ new Uint8Array() : fromHex(previous);
	const eventBytes = canonicalBytes(event);
	return bytesToHex$2(sha256(concatBytes$1(previousBytes, eventBytes)));
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
//#region node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
/**
* Internal class for HMAC.
* Accepts any byte key, although RFC 2104 §3 recommends keys at least
* `HashLen` bytes long.
*/
var _HMAC = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	canXOF = false;
	finished = false;
	destroyed = false;
	constructor(hash, key) {
		ahash(hash);
		abytes$2(key, void 0, "key");
		this.iHash = hash.create();
		if (typeof this.iHash.update !== "function") throw new Error("expected Hash instance");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
		this.oHash.update(pad);
		clean$1(pad);
	}
	update(buf) {
		aexists$1(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		aexists$1(this);
		aoutput(out, this);
		this.finished = true;
		const buf = out.subarray(0, this.outputLen);
		this.iHash.digestInto(buf);
		this.oHash.update(buf);
		this.oHash.digestInto(buf);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to ||= Object.create(Object.getPrototypeOf(this), {});
		const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
		to = to;
		to.finished = finished;
		to.destroyed = destroyed;
		to.blockLen = blockLen;
		to.outputLen = outputLen;
		to.canXOF = canXOF;
		to.oHash = oHash._cloneInto(to.oHash);
		to.iHash = iHash._cloneInto(to.iHash);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = true;
		this.oHash.destroy();
		this.iHash.destroy();
	}
};
const hmac = /* @__PURE__ */ (() => {
	const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
	hmac_.create = (hash, key) => new _HMAC(hash, key);
	return hmac_;
})();
//#endregion
//#region node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/hkdf.js
/**
* HKDF (RFC 5869): extract + expand in one step.
* See {@link https://soatok.blog/2021/11/17/understanding-hkdf/}.
* @module
*/
const HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
const EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
/**
* HKDF-expand from the spec. The most important part. `HKDF-Expand(PRK, info, L) -> OKM`
* @param hash - hash function that would be used (e.g. sha256)
* @param prk - a pseudorandom key of at least HashLen octets
*   (usually, the output from the extract step)
* @param info - optional context and application specific information (can be a zero-length string)
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @param _recycled - Internal destroyed extract hashes owned by the combined `hkdf()` call.
* @returns Output keying material with the requested length.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* Run the HKDF expand step.
* ```ts
* import { expand } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* expand(sha256, new Uint8Array(32), new Uint8Array([1, 2, 3]), 16);
* ```
*/
function expand(hash, prk, info, length = 32, _recycled) {
	ahash(hash);
	anumber$1(length, "length");
	abytes$2(prk, void 0, "prk");
	const olen = hash.outputLen;
	if (prk.length < olen) throw new Error("\"prk\" must be at least HashLen octets");
	if (length > 255 * olen) throw new Error("Length must be <= 255*HashLen");
	const blocks = Math.ceil(length / olen);
	if (info === void 0) info = EMPTY_BUFFER;
	else abytes$2(info, void 0, "info");
	if (!blocks) {
		if (_recycled) clean$1(prk);
		return /* @__PURE__ */ new Uint8Array();
	}
	const okm = _recycled && blocks === 1 ? prk : new Uint8Array(blocks * olen);
	const { iHash, oHash } = hmac.create(hash, prk);
	const T = _recycled ? prk : new Uint8Array(olen);
	const worker = blocks > 1 ? _recycled?.iHash || hash.create() : void 0;
	for (let counter = 0; counter < blocks - 1; counter++) {
		HKDF_COUNTER[0] = counter + 1;
		const iWork = iHash._cloneInto(worker);
		if (counter) iWork.update(T);
		iWork.update(info).update(HKDF_COUNTER).digestInto(T);
		oHash._cloneInto(worker).update(T).digestInto(T);
		okm.set(T, olen * counter);
	}
	HKDF_COUNTER[0] = blocks;
	if (blocks > 1) iHash.update(T);
	iHash.update(info).update(HKDF_COUNTER).digestInto(T);
	oHash.update(T).digestInto(T);
	okm.set(T, olen * (blocks - 1));
	iHash.destroy();
	oHash.destroy();
	worker?.destroy();
	if (T !== okm) clean$1(T);
	clean$1(HKDF_COUNTER);
	if (length === okm.length) return okm;
	const res = okm.slice(0, length);
	clean$1(okm);
	return res;
}
/**
* HKDF (RFC 5869): derive keys from an initial input.
* Combines hkdf_extract + hkdf_expand in one step
* @param hash - hash function that would be used (e.g. sha256)
* @param ikm - input keying material, the initial key
* @param salt - optional salt value (a non-secret random value)
* @param info - optional context and application specific information bytes
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @returns Output keying material derived from the input key.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* HKDF (RFC 5869): derive keys from an initial input.
* ```ts
* import { hkdf } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* import { randomBytes, utf8ToBytes } from '@noble/hashes/utils.js';
* const inputKey = randomBytes(32);
* const salt = randomBytes(32);
* const info = utf8ToBytes('application-key');
* const okm = hkdf(sha256, inputKey, salt, info, 32);
* ```
*/
const hkdf = (hash, ikm, salt, info, length) => {
	ahash(hash);
	if (salt === void 0) salt = new Uint8Array(hash.outputLen);
	const HMAC = hmac.create(hash, salt).update(ikm);
	return expand(hash, HMAC.digest(), info, length, HMAC);
};
//#endregion
//#region extensions/reef/protocol/identity.ts
function generateIdentity() {
	const signing = ed25519.keygen();
	const encryption = x25519.keygen();
	return {
		signing: {
			publicKey: base64url(signing.publicKey),
			secretKey: base64url(signing.secretKey)
		},
		encryption: {
			publicKey: base64url(encryption.publicKey),
			secretKey: base64url(encryption.secretKey)
		}
	};
}
function signDeviceRequest(input, signingSecretKey) {
	if (!/^[A-Z]+$/.test(input.method) || !input.path.startsWith("/") || !Number.isSafeInteger(input.ts) || input.ts < 0 || !/^[0-9a-f]{64}$/.test(input.bodySha256)) throw new Error("invalid device request signature input");
	return base64url(ed25519.sign(canonicalBytes(input), fromBase64url(signingSecretKey)));
}
function fingerprint(ed25519PublicKey, x25519PublicKey) {
	const material = x25519PublicKey ? canonicalBytes({
		ed25519: ed25519PublicKey,
		x25519: x25519PublicKey
	}) : fromBase64url(ed25519PublicKey);
	return bytesToHex$2(sha256(material)).match(/.{1,4}/g).join(" ");
}
function formatHandleEpoch(handle, keyEpoch) {
	if (!/^[a-z0-9](?:[a-z0-9_-]{0,62})$/i.test(handle) || !Number.isSafeInteger(keyEpoch) || keyEpoch < 1) throw new Error("invalid handle or key epoch");
	return `${handle}#${keyEpoch}`;
}
function parseHandleEpoch(value) {
	const match = /^([a-z0-9](?:[a-z0-9_-]{0,62}))#([1-9][0-9]*)$/i.exec(value);
	if (!match) throw new Error("invalid handle#key_epoch");
	const keyEpoch = Number(match[2]);
	if (!Number.isSafeInteger(keyEpoch)) throw new Error("invalid key epoch");
	return {
		handle: match[1],
		keyEpoch
	};
}
//#endregion
//#region extensions/reef/protocol/envelope.ts
var ProtocolError = class extends Error {
	constructor(code, message = code) {
		super(message);
		this.code = code;
		this.name = "ProtocolError";
	}
};
var BadSignatureError = class extends ProtocolError {
	constructor(message) {
		super("bad_signature", message);
		this.name = "BadSignatureError";
	}
};
var NotPinnedError = class extends ProtocolError {
	constructor(message) {
		super("not_pinned", message);
		this.name = "NotPinnedError";
	}
};
var WrongRecipientError = class extends ProtocolError {
	constructor(message) {
		super("wrong_recipient", message);
		this.name = "WrongRecipientError";
	}
};
var ExpiredError = class extends ProtocolError {
	constructor(message) {
		super("expired", message);
		this.name = "ExpiredError";
	}
};
var ReplayedError = class extends ProtocolError {
	constructor(message) {
		super("replayed", message);
		this.name = "ReplayedError";
	}
};
var TooLargeError = class extends ProtocolError {
	constructor(message) {
		super("too_large", message);
		this.name = "TooLargeError";
	}
};
var MalformedError = class extends ProtocolError {
	constructor(message) {
		super("malformed", message);
		this.name = "MalformedError";
	}
};
const REEF_MAX_PLAINTEXT_BYTES = 32768;
const MAX_CIPHERTEXT_BASE64 = 44752;
const MAX_ENVELOPE_BYTES = 49152;
const HKDF_INFO = utf8ToBytes("reef-v1");
const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
function seal(options) {
	validateEnvelopeMetadata(options.id, options.from, options.to, options.ts ?? Math.floor(Date.now() / 1e3));
	validateMessageBody(options.body);
	const plaintext = canonicalBytes(options.body);
	if (plaintext.length > 32768) throw new TooLargeError();
	const ephemeral = x25519.keygen((options.rng ?? randomBytes$2)(32));
	const shared = x25519.getSharedSecret(ephemeral.secretKey, decodeKey(options.recipientEncryptionPublicKey));
	const key = hkdf(sha256, shared, void 0, HKDF_INFO, 32);
	const nonce = (options.rng ?? randomBytes$2)(12);
	if (nonce.length !== 12) throw new MalformedError("rng returned invalid nonce");
	const unsigned = {
		v: 1,
		id: options.id,
		from: options.from,
		to: options.to,
		ts: options.ts ?? Math.floor(Date.now() / 1e3),
		epk: base64(ephemeral.publicKey),
		n: base64(nonce),
		ct: base64(gcm(key, nonce).encrypt(plaintext))
	};
	return {
		...unsigned,
		sig: base64(ed25519.sign(canonicalBytes(unsigned), decodeKey(options.senderSigningSecretKey)))
	};
}
async function openClaimed(options) {
	const envelope = validateEnvelope(options.envelope);
	if (!options.senderSigningPublicKey) throw new NotPinnedError();
	const { sig, ...unsigned } = envelope;
	let validSignature = false;
	try {
		validSignature = ed25519.verify(fromBase64(sig), canonicalBytes(unsigned), decodeKey(options.senderSigningPublicKey));
	} catch {}
	if (!validSignature) throw new BadSignatureError();
	if (envelope.v !== 1) throw new MalformedError();
	validateEnvelopeMetadata(envelope.id, envelope.from, envelope.to, envelope.ts);
	if (envelope.to !== options.self) throw new WrongRecipientError();
	const peer = parseHandleEpoch(envelope.from).handle;
	const hash = bytesToHex$2(sha256(canonicalBytes(envelope)));
	const claim = await options.replayStore.claim(peer, envelope.id, hash);
	if (claim === "mismatch") throw new ReplayedError("replay id binding mismatch");
	if (claim === "in_flight") throw new ReplayedError("in flight");
	if (claim === "duplicate") {
		const completed = await options.replayStore.completed(peer, envelope.id);
		if (completed === void 0) return { claim };
		return completed.body === void 0 ? {
			claim,
			receipt: completed.receipt
		} : {
			claim,
			receipt: completed.receipt,
			body: completed.body
		};
	}
	try {
		const now = options.now ?? Math.floor(Date.now() / 1e3);
		const maxAge = options.maxAgeSeconds ?? 2592e3;
		const maxFutureSkew = options.maxFutureSkewSeconds ?? 300;
		if (envelope.ts > now + maxFutureSkew || envelope.ts < now - maxAge) throw new ExpiredError();
		const shared = x25519.getSharedSecret(decodeKey(options.recipientEncryptionSecretKey), fromBase64(envelope.epk));
		const key = hkdf(sha256, shared, void 0, HKDF_INFO, 32);
		const plaintext = gcm(key, fromBase64(envelope.n)).decrypt(fromBase64(envelope.ct));
		if (plaintext.length > 32768) throw new TooLargeError();
		const body = JSON.parse(decodeUtf8(plaintext));
		validateMessageBody(body);
		return {
			claim: "new",
			body,
			envelopeHash: hash
		};
	} catch (error) {
		await options.replayStore.release(peer, envelope.id);
		if (error instanceof ProtocolError) throw error;
		throw new MalformedError();
	}
}
function bodyHash(body) {
	return bytesToHex$2(sha256(canonicalBytes(body)));
}
function decodeKey(value) {
	const key = fromBase64url(value);
	if (key.length !== 32) throw new MalformedError("invalid key length");
	return key;
}
function validateEnvelopeMetadata(id, from, to, ts) {
	if (!ULID_PATTERN.test(id) || !Number.isSafeInteger(ts) || ts < 0) throw new MalformedError("invalid envelope metadata");
	try {
		parseHandleEpoch(from);
		parseHandleEpoch(to);
	} catch {
		throw new MalformedError("invalid envelope peer");
	}
}
function validateMessageBody(value) {
	if (!isExactObject(value, [
		"text",
		"replyTo",
		"thread"
	])) throw new MalformedError("invalid body");
	if (typeof value.text !== "string" || value.replyTo !== void 0 && typeof value.replyTo !== "string" || value.thread !== void 0 && typeof value.thread !== "string") throw new MalformedError("invalid body");
	if (value.replyTo !== void 0 && !ULID_PATTERN.test(value.replyTo) || value.thread !== void 0 && !ULID_PATTERN.test(value.thread)) throw new MalformedError("invalid body identifier");
	for (const field of [
		value.text,
		value.replyTo,
		value.thread
	]) if (field !== void 0 && decodeUtf8(utf8ToBytes(field)) !== field) throw new MalformedError("invalid UTF-8 body");
}
function validateEnvelope(value) {
	if (!isExactObject(value, [
		"v",
		"id",
		"from",
		"to",
		"ts",
		"epk",
		"n",
		"ct",
		"sig"
	])) throw new MalformedError();
	if (typeof value.v !== "number" || typeof value.id !== "string" || typeof value.from !== "string" || typeof value.to !== "string" || !Number.isSafeInteger(value.ts) || typeof value.epk !== "string" || typeof value.n !== "string" || typeof value.ct !== "string" || typeof value.sig !== "string") throw new MalformedError();
	if (value.id.length !== 26) throw new MalformedError("invalid envelope id length");
	if (value.from.length > 80 || value.to.length > 80 || value.epk.length > 46 || value.n.length > 18 || value.sig.length > 90 || value.ct.length > MAX_CIPHERTEXT_BASE64) throw new TooLargeError();
	try {
		if (fromBase64(value.epk).length !== 32 || fromBase64(value.n).length !== 12 || fromBase64(value.sig).length !== 64) throw new Error();
		fromBase64(value.ct);
	} catch {
		throw new MalformedError();
	}
	if (canonicalBytes(value).length > MAX_ENVELOPE_BYTES) throw new TooLargeError();
	return value;
}
function isExactObject(value, keys) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value || ["replyTo", "thread"].includes(key));
}
//#endregion
//#region extensions/reef/src/audit-state.ts
const REEF_AUDIT_NAMESPACE = "audit";
const REEF_AUDIT_HEAD_NAMESPACE = "audit-head";
const REEF_AUDIT_HEAD_KEY = "head";
const REEF_AUDIT_MAX_ENTRIES = 3e4;
const REEF_AUDIT_STORE_MAX_ENTRIES = 30001;
const REEF_AUDIT_MIGRATION_NAMESPACE = "audit-migration";
const REEF_AUDIT_MIGRATION_KEY = "audit-jsonl";
const REEF_AUDIT_APPEND_LEASE_MS = 3e4;
const REEF_AUDIT_APPEND_RETRY_MS = 25;
const REEF_AUDIT_APPEND_ATTEMPTS = 120;
function reefAuditEntryKey(entryHash) {
	return `entry:${entryHash}`;
}
function parseReefAuditHead(value) {
	if (value === void 0) return {
		kind: "head",
		hash: "",
		seq: 0,
		oldestHash: ""
	};
	if (value.kind !== "head" || typeof value.hash !== "string" || !Number.isSafeInteger(value.seq) || value.seq < 0 || value.seq === 0 !== (value.hash === "") || typeof value.oldestHash !== "string" || value.seq === 0 !== (value.oldestHash === "") || value.garbageEntryKey !== void 0 && (typeof value.garbageEntryKey !== "string" || value.garbageEntryKey.length === 0) || value.pending !== void 0 && (typeof value.pending.owner !== "string" || value.pending.owner.length === 0 || !Number.isSafeInteger(value.pending.expiresAt) || value.pending.expiresAt <= 0 || value.pending.entryKey !== void 0 && (typeof value.pending.entryKey !== "string" || value.pending.entryKey.length === 0))) throw new Error("invalid Reef audit head");
	return value;
}
function parseAuditEntryRecord(value) {
	if (!value || value.kind !== "entry") throw new Error("missing Reef audit entry");
	return value.entry;
}
function parseAuditStateRecord(value) {
	parseAuditEntryRecord(value);
	if (value?.nextHash !== void 0 && (typeof value.nextHash !== "string" || value.nextHash.length === 0)) throw new Error("invalid Reef audit next pointer");
	return value;
}
var ReefSqliteAuditStore = class {
	#auditKey;
	#rng;
	#maxEntries;
	#store;
	#headStore;
	constructor(runtime, auditKey, rng = randomBytes$2, maxEntries = REEF_AUDIT_MAX_ENTRIES) {
		if (auditKey.length !== 32) throw new Error("audit key must be 32 bytes");
		this.#auditKey = auditKey.slice();
		this.#rng = rng;
		this.#maxEntries = maxEntries;
		if (runtime.state.openSyncKeyedStore({
			namespace: "audit-migration",
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}).lookup("audit-jsonl")) throw new Error("Reef audit migration is incomplete; repair audit.jsonl and rerun openclaw doctor --fix");
		this.#store = runtime.state.openSyncKeyedStore({
			namespace: REEF_AUDIT_NAMESPACE,
			maxEntries: maxEntries + 1,
			overflowPolicy: "reject-new"
		});
		this.#headStore = runtime.state.openSyncKeyedStore({
			namespace: REEF_AUDIT_HEAD_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
	}
	async appendEvent(type, payload, ts = Math.floor(Date.now() / 1e3)) {
		const update = this.#headStore.update;
		const updateEntry = this.#store.update;
		if (!update || !updateEntry) throw new Error("Reef audit state requires atomic plugin-state updates");
		const owner = randomUUID();
		for (let attempt = 0; attempt < REEF_AUDIT_APPEND_ATTEMPTS; attempt++) {
			let acquired = false;
			let staleEntryKey;
			let head = {
				kind: "head",
				hash: "",
				seq: 0,
				oldestHash: ""
			};
			update(REEF_AUDIT_HEAD_KEY, (current) => {
				const latest = parseReefAuditHead(current);
				if (latest.pending && latest.pending.expiresAt > Date.now()) return latest;
				acquired = true;
				staleEntryKey = latest.pending?.entryKey;
				head = {
					kind: "head",
					hash: latest.hash,
					seq: latest.seq,
					oldestHash: latest.oldestHash,
					...latest.garbageEntryKey ? { garbageEntryKey: latest.garbageEntryKey } : {}
				};
				return {
					...head,
					pending: {
						owner,
						expiresAt: Date.now() + REEF_AUDIT_APPEND_LEASE_MS,
						...staleEntryKey ? { entryKey: staleEntryKey } : {}
					}
				};
			});
			if (!acquired) {
				await setTimeout(REEF_AUDIT_APPEND_RETRY_MS);
				continue;
			}
			let entryKey;
			let entryHash;
			let inserted = false;
			let staleCleanupComplete = !staleEntryKey;
			try {
				if (staleEntryKey) {
					if (!staleEntryKey.startsWith("entry:") || staleEntryKey.length === 6) throw new Error("invalid Reef audit staged entry key");
					const staleEntryHash = staleEntryKey.slice(6);
					if (head.hash) updateEntry(reefAuditEntryKey(head.hash), (current) => {
						const previous = parseAuditStateRecord(current);
						if (previous.nextHash !== staleEntryHash) return previous;
						const { nextHash: _nextHash, ...unlinked } = previous;
						return unlinked;
					});
					this.#store.delete(staleEntryKey);
					update(REEF_AUDIT_HEAD_KEY, (current) => {
						const latest = parseReefAuditHead(current);
						if (latest.pending?.owner !== owner || latest.pending.entryKey !== staleEntryKey) return latest;
						return {
							...latest,
							pending: {
								owner,
								expiresAt: latest.pending.expiresAt
							}
						};
					});
					staleCleanupComplete = true;
					staleEntryKey = void 0;
				}
				if (head.garbageEntryKey) {
					this.#store.delete(head.garbageEntryKey);
					update(REEF_AUDIT_HEAD_KEY, (current) => {
						const latest = parseReefAuditHead(current);
						if (latest.pending?.owner !== owner) return latest;
						const { garbageEntryKey: _garbageEntryKey, ...cleaned } = latest;
						return cleaned;
					});
					const { garbageEntryKey: _garbageEntryKey, ...cleanedHead } = head;
					head = cleanedHead;
				}
				const entry = createAuditEntry(type, payload, ts, this.#auditKey, head, this.#rng);
				entryHash = entry.entryHash;
				entryKey = reefAuditEntryKey(entry.entryHash);
				let staged = false;
				update(REEF_AUDIT_HEAD_KEY, (current) => {
					const latest = parseReefAuditHead(current);
					if (latest.hash !== head.hash || latest.seq !== head.seq || latest.pending?.owner !== owner) return latest;
					staged = true;
					return {
						...latest,
						pending: {
							...latest.pending,
							entryKey
						}
					};
				});
				if (!staged) throw new Error("Reef audit append lease was lost before staging");
				inserted = this.#store.registerIfAbsent(entryKey, {
					kind: "entry",
					entry
				});
				if (!inserted) throw new Error("Reef audit entry already exists before head advancement");
				if (head.hash) updateEntry(reefAuditEntryKey(head.hash), (current) => {
					const previous = parseAuditStateRecord(current);
					if (previous.entry.entryHash !== head.hash) throw new Error("Reef audit head entry differs before linking append");
					if (parseReefAuditHead(this.#headStore.lookup("head")).pending?.owner !== owner) throw new Error("Reef audit append lease was lost before linking");
					const replacesStaleLink = previous.nextHash !== void 0 && staleEntryKey === reefAuditEntryKey(previous.nextHash);
					if (previous.nextHash === entry.entryHash) return previous;
					if (previous.nextHash !== void 0 && !replacesStaleLink) throw new Error("Reef audit head already links a committed successor");
					return {
						...previous,
						nextHash: entry.entryHash
					};
				});
				let oldestHash = head.seq === 0 ? entry.entryHash : head.oldestHash;
				let garbageEntryKey;
				if (head.seq >= this.#maxEntries) {
					const oldest = parseAuditStateRecord(this.#store.lookup(reefAuditEntryKey(head.oldestHash)));
					if (!oldest.nextHash) throw new Error("Reef audit retention pointer is missing");
					oldestHash = oldest.nextHash;
					garbageEntryKey = reefAuditEntryKey(head.oldestHash);
				}
				let advanced = false;
				update(REEF_AUDIT_HEAD_KEY, (current) => {
					const latest = parseReefAuditHead(current);
					if (latest.hash !== head.hash || latest.seq !== head.seq || latest.pending?.owner !== owner || latest.pending.entryKey !== entryKey) return latest;
					advanced = true;
					return {
						kind: "head",
						hash: entry.entryHash,
						seq: entry.event.seq,
						oldestHash,
						...garbageEntryKey ? { garbageEntryKey } : {}
					};
				});
				if (!advanced) throw new Error("Reef audit append lease was lost before commit");
				if (garbageEntryKey) try {
					this.#store.delete(garbageEntryKey);
					update(REEF_AUDIT_HEAD_KEY, (current) => {
						const latest = parseReefAuditHead(current);
						if (latest.hash !== entry.entryHash || latest.garbageEntryKey !== garbageEntryKey) return latest;
						const { garbageEntryKey: _garbageEntryKey, ...cleaned } = latest;
						return cleaned;
					});
				} catch {}
				return structuredClone(entry);
			} catch (error) {
				const latestHead = parseReefAuditHead(this.#headStore.lookup(REEF_AUDIT_HEAD_KEY));
				const entryOwnedElsewhere = entryKey !== void 0 && (latestHead.hash === entryHash && latestHead.seq === head.seq + 1 || latestHead.pending?.owner !== owner && latestHead.pending?.entryKey === entryKey);
				if (inserted && entryKey && !entryOwnedElsewhere) this.#store.delete(entryKey);
				if (entryKey && head.hash && !entryOwnedElsewhere) updateEntry(reefAuditEntryKey(head.hash), (current) => {
					const previous = parseAuditStateRecord(current);
					if (previous.nextHash !== entryHash) return previous;
					const { nextHash: _nextHash, ...unlinked } = previous;
					return unlinked;
				});
				update(REEF_AUDIT_HEAD_KEY, (current) => {
					const latest = parseReefAuditHead(current);
					if (latest.pending?.owner !== owner) return latest;
					if (!staleCleanupComplete && staleEntryKey) return {
						...latest,
						pending: {
							owner,
							expiresAt: Math.max(1, Date.now() - 1),
							entryKey: staleEntryKey
						}
					};
					const { pending: _pending, ...committed } = latest;
					return committed;
				});
				throw error;
			}
		}
		throw new Error("Reef audit append contention exceeded retry budget");
	}
	async entries() {
		const head = parseReefAuditHead(this.#headStore.lookup(REEF_AUDIT_HEAD_KEY));
		if (head.seq === 0) return [];
		const reversed = [];
		let hash = head.hash;
		for (let seq = head.seq; seq > 0 && reversed.length < this.#maxEntries; seq--) {
			const record = this.#store.lookup(reefAuditEntryKey(hash));
			if (!record) break;
			const entry = parseAuditEntryRecord(record);
			if (entry.entryHash !== hash || entry.event.seq !== seq) throw new Error("invalid Reef audit chain state");
			reversed.push(entry);
			hash = entry.prevHash;
		}
		const expectedEntries = Math.min(head.seq, this.#maxEntries);
		if (reversed.length !== expectedEntries) throw new Error("Reef audit chain is shorter than its committed retention window");
		const entries = reversed.toReversed();
		const first = entries[0];
		if (!first || !verifyChainSegment(entries, {
			previousHash: first.prevHash,
			previousSeq: first.event.seq - 1,
			head: head.hash
		})) throw new Error("invalid Reef audit chain state");
		return structuredClone(entries);
	}
};
function openReefAuditStore(runtime, auditKey, maxEntries) {
	return new ReefSqliteAuditStore(runtime, auditKey, randomBytes$2, maxEntries);
}
//#endregion
//#region extensions/reef/src/registration-state.ts
const REEF_REGISTRATION_NAMESPACE = "registration";
const REEF_REGISTRATION_IDENTITY_KEY = "identity";
const REEF_REGISTRATION_SESSION_KEY = "setup-session";
const REEF_IDENTITY_RESERVATION_MS = 6e5;
const registrationStoreOptions = {
	namespace: REEF_REGISTRATION_NAMESPACE,
	maxEntries: 2,
	overflowPolicy: "reject-new"
};
function openRegistrationStore(runtime) {
	return runtime.state.openKeyedStore(registrationStoreOptions);
}
function parseReefIdentityBinding(value) {
	if (!value || typeof value !== "object") return;
	const parsed = value;
	if (parsed.kind === "pending") return;
	return typeof parsed.handle === "string" && parsed.handle.length > 0 && typeof parsed.relayUrl === "string" && parsed.relayUrl.length > 0 ? {
		handle: parsed.handle,
		relayUrl: parsed.relayUrl
	} : void 0;
}
function parseReefIdentityPendingRecord(value) {
	if (!value || typeof value !== "object") return;
	const parsed = value;
	return parsed.kind === "pending" && typeof parsed.handle === "string" && parsed.handle.length > 0 && typeof parsed.relayUrl === "string" && parsed.relayUrl.length > 0 && typeof parsed.owner === "string" && parsed.owner.length > 0 && Number.isSafeInteger(parsed.expiresAt) && (parsed.expiresAt ?? 0) > 0 ? {
		kind: "pending",
		handle: parsed.handle,
		relayUrl: parsed.relayUrl,
		owner: parsed.owner,
		expiresAt: parsed.expiresAt
	} : void 0;
}
function reefIdentityConflict(binding) {
	return /* @__PURE__ */ new Error(`This OpenClaw state already holds the Reef identity @${binding.handle} on ${binding.relayUrl}. Re-register the same handle and relay.`);
}
function parseReefSetupSession(value) {
	if (!value || typeof value !== "object") return;
	const parsed = value;
	return typeof parsed.session === "string" && parsed.session.length > 0 && typeof parsed.relayUrl === "string" && parsed.relayUrl.length > 0 && typeof parsed.email === "string" && parsed.email.length > 0 ? {
		session: parsed.session,
		relayUrl: parsed.relayUrl,
		email: parsed.email
	} : void 0;
}
async function loadReefIdentityBinding(runtime) {
	return parseReefIdentityBinding(await openRegistrationStore(runtime).lookup(REEF_REGISTRATION_IDENTITY_KEY));
}
async function assertReefIdentityBinding(runtime, binding) {
	const existing = await loadReefIdentityBinding(runtime);
	if (!existing) throw new Error("Reef identity binding is missing; run openclaw doctor --fix or register this claw");
	if (existing.handle !== binding.handle || existing.relayUrl !== binding.relayUrl) throw reefIdentityConflict(existing);
}
function openIdentityReservationStore(runtime) {
	const { observe, compareAndApply } = openRegistrationStore(runtime);
	if (observe && compareAndApply) return {
		kind: "worker",
		observe,
		compareAndApply
	};
	return {
		kind: "legacy",
		store: runtime.state.openSyncKeyedStore(registrationStoreOptions)
	};
}
async function updateIdentityBinding(runtime, decide) {
	const access = openIdentityReservationStore(runtime);
	if (access.kind === "legacy") {
		const update = access.store.update;
		if (!update) throw new Error("Reef identity reservation requires atomic plugin-state updates");
		const outcome = {};
		update(REEF_REGISTRATION_IDENTITY_KEY, (current) => {
			try {
				outcome.decision = decide(current);
				return outcome.decision.value;
			} catch (error) {
				outcome.failure = { error };
				return current;
			}
		});
		if (outcome.failure) throw outcome.failure.error;
		if (!outcome.decision) throw new Error("Reef identity reservation update did not run");
		return outcome.decision.result;
	}
	let observation = await access.observe(REEF_REGISTRATION_IDENTITY_KEY);
	for (;;) {
		const decision = decide(observation.value);
		const result = await access.compareAndApply(REEF_REGISTRATION_IDENTITY_KEY, observation.comparison, {
			operation: "update",
			action: "set",
			value: decision.value
		});
		if (result.status !== "conflict") return decision.result;
		observation = result.current;
	}
}
async function reserveReefIdentityBinding(runtime, binding) {
	const parsed = parseReefIdentityBinding(binding);
	if (!parsed) throw new Error("invalid Reef identity binding");
	return await updateIdentityBinding(runtime, (current) => {
		const existing = parseReefIdentityBinding(current);
		if (existing) {
			if (existing.handle !== parsed.handle || existing.relayUrl !== parsed.relayUrl) throw reefIdentityConflict(existing);
			return {
				value: existing,
				result: { binding: parsed }
			};
		}
		const pending = parseReefIdentityPendingRecord(current);
		if (pending) {
			const sameBinding = pending.handle === parsed.handle && pending.relayUrl === parsed.relayUrl;
			if (pending.expiresAt > Date.now() || !sameBinding) throw reefIdentityConflict(pending);
		}
		const owner = randomUUID();
		return {
			value: {
				kind: "pending",
				...parsed,
				owner,
				expiresAt: Date.now() + REEF_IDENTITY_RESERVATION_MS
			},
			result: {
				binding: parsed,
				owner
			}
		};
	});
}
async function finalizeReefIdentityBinding(runtime, reservation) {
	if (!reservation.owner) return;
	await updateIdentityBinding(runtime, (current) => {
		const existing = parseReefIdentityBinding(current);
		if (existing?.handle === reservation.binding.handle && existing.relayUrl === reservation.binding.relayUrl) return {
			value: existing,
			result: void 0
		};
		if (parseReefIdentityPendingRecord(current)?.owner !== reservation.owner) throw new Error("Reef identity reservation was replaced before registration completed");
		return {
			value: reservation.binding,
			result: void 0
		};
	});
}
async function releaseReefIdentityReservation(runtime, reservation) {
	if (!reservation.owner) return;
	const ownsReservation = (current) => parseReefIdentityPendingRecord(current)?.owner === reservation.owner;
	const access = openIdentityReservationStore(runtime);
	if (access.kind === "legacy") {
		const deleteIf = access.store.deleteIf;
		if (!deleteIf) throw new Error("Reef identity reservation requires atomic plugin-state updates");
		deleteIf(REEF_REGISTRATION_IDENTITY_KEY, ownsReservation);
		return;
	}
	let observation = await access.observe(REEF_REGISTRATION_IDENTITY_KEY);
	while (ownsReservation(observation.value)) {
		const result = await access.compareAndApply(REEF_REGISTRATION_IDENTITY_KEY, observation.comparison, {
			operation: "delete",
			action: "delete"
		});
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
async function loadReefSetupSession(runtime) {
	return parseReefSetupSession(await openRegistrationStore(runtime).lookup(REEF_REGISTRATION_SESSION_KEY));
}
async function saveReefSetupSession(runtime, session) {
	const parsed = parseReefSetupSession(session);
	if (!parsed) throw new Error("invalid Reef setup session");
	await openRegistrationStore(runtime).register(REEF_REGISTRATION_SESSION_KEY, parsed);
}
async function clearReefSetupSession(runtime) {
	await openRegistrationStore(runtime).delete(REEF_REGISTRATION_SESSION_KEY);
}
//#endregion
//#region extensions/reef/src/replay-store.ts
const REEF_REPLAY_NAMESPACE = "replay";
const REEF_REPLAY_MAX_ENTRIES = 3e3;
const REEF_REPLAY_TTL_MS = 26784e5;
const REEF_REPLAY_CLAIM_LEASE_MS = 3e5;
function reefReplayStoreKey(peer, id) {
	return `binding:${createHash("sha256").update(JSON.stringify([peer, id])).digest("hex")}`;
}
function parseReplayRecord(value) {
	if (!value) return;
	if (typeof value.peer !== "string" || typeof value.id !== "string" || typeof value.envelopeHash !== "string" || ![
		"available",
		"in_flight",
		"completed",
		"consumed"
	].includes(value.state) || value.state === "in_flight" && (typeof value.claimOwner !== "string" || value.claimOwner.length === 0 || !Number.isSafeInteger(value.claimExpiresAt) || (value.claimExpiresAt ?? 0) <= 0)) throw new Error("invalid Reef replay state");
	return value;
}
function encryptReplayBody(body, key, rng) {
	validateMessageBody(body);
	const nonce = rng(12);
	if (nonce.length !== 12) throw new Error("replay body rng returned invalid nonce");
	return { enc: base64(concatBytes$1(nonce, gcm(key, nonce).encrypt(canonicalBytes(body)))) };
}
function decryptReplayBody(body, key) {
	const packed = fromBase64(body.enc);
	if (packed.length < 28) throw new Error("invalid encrypted replay body");
	const value = JSON.parse(decodeUtf8(gcm(key, packed.slice(0, 12)).decrypt(packed.slice(12))));
	validateMessageBody(value);
	return value;
}
function validateReplayCompletion(receipt, body) {
	if (receipt.status === "accepted" !== (body !== void 0)) throw new Error("accepted replay completion requires body; rejected completion forbids body");
}
function prepareReplayCompletion(receipt, body, key, rng, freeze) {
	let input;
	try {
		input = {
			ok: true,
			value: freeze ? structuredClone({
				receipt,
				body
			}) : {
				receipt,
				body
			}
		};
	} catch (error) {
		input = {
			ok: false,
			error
		};
	}
	let prepared;
	return () => {
		if (!prepared) try {
			if (!input.ok) throw input.error;
			prepared = {
				ok: true,
				value: {
					receipt: structuredClone(input.value.receipt),
					...input.value.body ? { body: encryptReplayBody(input.value.body, key, rng) } : {}
				}
			};
		} catch (error) {
			prepared = {
				ok: false,
				error
			};
		}
		if (!prepared.ok) throw prepared.error;
		return prepared.value;
	};
}
var ReefSqliteReplayStore = class {
	#bodyKey;
	#rng;
	#store;
	#legacy;
	#comparison;
	#claimOwners = /* @__PURE__ */ new Map();
	#pending = Promise.resolve();
	constructor(runtime, bodyKey, rng = randomBytes$2, maxEntries = REEF_REPLAY_MAX_ENTRIES) {
		if (bodyKey.length !== 32) throw new Error("replay body key must be 32 bytes");
		this.#bodyKey = bodyKey.slice();
		this.#rng = rng;
		const options = {
			namespace: REEF_REPLAY_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new",
			defaultTtlMs: REEF_REPLAY_TTL_MS
		};
		this.#store = runtime.state.openKeyedStore(options);
		const { observe, compareAndApply } = this.#store;
		if (observe && compareAndApply) this.#comparison = {
			observe,
			compareAndApply
		};
		else this.#legacy = runtime.state.openSyncKeyedStore(options);
	}
	#enqueue(operation) {
		const pending = this.#pending.then(operation);
		this.#pending = pending.then(() => void 0, () => void 0);
		return pending;
	}
	#mutate(key, prepare) {
		const comparison = this.#comparison;
		if (!comparison) {
			const mutation = prepare();
			const update = this.#legacy?.update;
			if (!update) throw new Error("Reef replay state requires atomic plugin-state updates");
			let decision;
			update(key, (current) => {
				decision = mutation.decide(parseReplayRecord(current));
				return decision.value;
			});
			if (!decision) throw new Error("Reef replay update did not evaluate current state");
			mutation.publish?.(decision.result);
			return decision.result;
		}
		return this.#enqueue(async () => {
			const mutation = prepare();
			let observation = await comparison.observe(key);
			for (;;) {
				let decision;
				try {
					decision = mutation.decide(parseReplayRecord(observation.value));
				} catch (error) {
					const result = await comparison.compareAndApply(key, observation.comparison, {
						operation: "delete",
						action: "keep"
					});
					if (result.status !== "conflict") throw error;
					observation = result.current;
					continue;
				}
				const result = await comparison.compareAndApply(key, observation.comparison, decision.value === void 0 ? {
					operation: "update",
					action: "keep"
				} : {
					operation: "update",
					action: "set",
					value: decision.value
				});
				if (result.status === "conflict") {
					observation = result.current;
					continue;
				}
				mutation.publish?.(decision.result);
				return decision.result;
			}
		});
	}
	async claim(peer, id, envelopeHash) {
		const key = reefReplayStoreKey(peer, id);
		return this.#mutate(key, () => {
			const owner = randomUUID();
			const claim = {
				claimOwner: owner,
				claimExpiresAt: Date.now() + REEF_REPLAY_CLAIM_LEASE_MS
			};
			return {
				decide: (existing) => {
					if (!existing) return {
						value: {
							peer,
							id,
							envelopeHash,
							state: "in_flight",
							...claim
						},
						result: "new"
					};
					if (existing.peer !== peer || existing.id !== id || existing.envelopeHash !== envelopeHash) return {
						value: existing,
						result: "mismatch"
					};
					if (existing.state === "completed" || existing.state === "consumed") return {
						value: existing,
						result: "duplicate"
					};
					if (existing.state === "in_flight" && (existing.claimExpiresAt ?? 0) > Date.now()) return {
						value: existing,
						result: "in_flight"
					};
					return {
						value: {
							...existing,
							state: "in_flight",
							...claim
						},
						result: "new"
					};
				},
				publish: (result) => {
					if (result === "new") this.#claimOwners.set(key, owner);
				}
			};
		});
	}
	async refresh(peer, id) {
		const key = reefReplayStoreKey(peer, id);
		const refresh = () => {
			const owner = this.#claimOwners.get(key);
			if (!owner) throw new Error("replay claim is not in flight");
			const claimExpiresAt = Date.now() + REEF_REPLAY_CLAIM_LEASE_MS;
			return {
				decide: (existing) => ({
					value: existing?.state === "in_flight" && existing.claimOwner === owner ? {
						...existing,
						claimExpiresAt: this.#comparison ? claimExpiresAt : Date.now() + REEF_REPLAY_CLAIM_LEASE_MS
					} : existing,
					result: existing?.state === "in_flight" && existing.claimOwner === owner
				}),
				publish: (refreshed) => {
					if (!refreshed) {
						this.#claimOwners.delete(key);
						throw new Error("replay claim is not in flight");
					}
				}
			};
		};
		await this.#mutate(key, refresh);
	}
	async complete(peer, id, receipt, body) {
		if (receipt.id !== id) throw new Error("receipt id does not match replay claim");
		validateReplayCompletion(receipt, body);
		const completion = prepareReplayCompletion(receipt, body, this.#bodyKey, this.#rng, Boolean(this.#comparison));
		const key = reefReplayStoreKey(peer, id);
		await this.#mutate(key, () => {
			const owner = this.#claimOwners.get(key);
			return {
				decide: (existing) => {
					if (existing?.state !== "in_flight" || existing.claimOwner !== owner) return {
						value: existing,
						result: false
					};
					const { claimOwner: _claimOwner, claimExpiresAt: _claimExpiresAt, ...rest } = existing;
					return {
						value: {
							...rest,
							state: "completed",
							...completion()
						},
						result: true
					};
				},
				publish: (completed) => {
					if (!completed) throw new Error("replay claim is not in flight");
					this.#claimOwners.delete(key);
				}
			};
		});
	}
	async consume(peer, id) {
		const key = reefReplayStoreKey(peer, id);
		await this.#mutate(key, () => {
			const owner = this.#claimOwners.get(key);
			return {
				decide: (existing) => {
					if (existing?.state !== "in_flight" || existing.claimOwner !== owner) return {
						value: existing,
						result: false
					};
					const { receipt: _receipt, body: _body, claimOwner: _claimOwner, claimExpiresAt: _claimExpiresAt, ...rest } = existing;
					return {
						value: {
							...rest,
							state: "consumed"
						},
						result: true
					};
				},
				publish: (consumed) => {
					if (!consumed) throw new Error("replay claim is not in flight");
					this.#claimOwners.delete(key);
				}
			};
		});
	}
	async release(peer, id) {
		const key = reefReplayStoreKey(peer, id);
		await this.#mutate(key, () => {
			const owner = this.#claimOwners.get(key);
			return {
				decide: (existing) => ({
					value: existing?.state === "in_flight" && existing.claimOwner === owner ? {
						peer: existing.peer,
						id: existing.id,
						envelopeHash: existing.envelopeHash,
						state: "available"
					} : existing,
					result: void 0
				}),
				publish: () => {
					this.#claimOwners.delete(key);
				}
			};
		});
	}
	async completed(peer, id) {
		const read = (value) => {
			const existing = parseReplayRecord(value);
			if (existing?.peer !== peer || existing.id !== id || existing.state !== "completed" || !existing.receipt) return;
			return existing.body ? {
				receipt: structuredClone(existing.receipt),
				body: decryptReplayBody(existing.body, this.#bodyKey)
			} : { receipt: structuredClone(existing.receipt) };
		};
		const key = reefReplayStoreKey(peer, id);
		if (this.#legacy) return read(this.#legacy.lookup(key));
		return this.#enqueue(async () => read(await this.#store.lookup(key)));
	}
};
//#endregion
//#region extensions/reef/src/state.ts
const REEF_KEYS_NAMESPACE = "identity";
const REEF_KEYS_KEY = "keys";
const REEF_KEYS_MIGRATION_NAMESPACE = "identity-migration";
const REEF_KEYS_MIGRATION_KEY = "keys-json";
const REEF_DURABLE_MIGRATION_NAMESPACE = "durable-migration";
const REEF_DURABLE_MIGRATION_KEY = "legacy-files";
const REEF_REVIEWS_NAMESPACE = "reviews";
const REEF_REVIEWS_MAX_ENTRIES = 2e3;
const REEF_DELIVERED_NAMESPACE = "delivered";
const REEF_DELIVERED_MAX_ENTRIES = 5e3;
const REEF_DELIVERED_TTL_MS = REEF_REPLAY_TTL_MS;
const REEF_INBOX_CURSOR_NAMESPACE = "inbox-cursor";
const REEF_INBOX_CURSOR_KEY = "current";
const REEF_INBOX_CURSOR_MAX_ENTRIES = 1;
function parseReefKeys(value) {
	if (!value || typeof value !== "object") throw new Error("invalid Reef keys");
	const keys = value;
	if (fromBase64url(keys.signing?.publicKey ?? "").length !== 32 || fromBase64url(keys.signing?.secretKey ?? "").length !== 32 || fromBase64url(keys.encryption?.publicKey ?? "").length !== 32 || fromBase64url(keys.encryption?.secretKey ?? "").length !== 32 || fromBase64url(keys.auditKey ?? "").length !== 32 || fromBase64url(keys.replayKey ?? "").length !== 32 || !Number.isSafeInteger(keys.keyEpoch) || keys.keyEpoch < 1) throw new Error("invalid Reef keys");
	return structuredClone(keys);
}
function openKeysStore(runtime) {
	return runtime.state.openSyncKeyedStore({
		namespace: REEF_KEYS_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new"
	});
}
function assertReefIdentityMigrationComplete(runtime) {
	if (runtime.state.openSyncKeyedStore({
		namespace: "durable-migration",
		maxEntries: 1,
		overflowPolicy: "reject-new"
	}).lookup("legacy-files")) throw new Error("Reef durable state migration is incomplete; repair the legacy state files and rerun openclaw doctor --fix");
	if (runtime.state.openSyncKeyedStore({
		namespace: "identity-migration",
		maxEntries: 1,
		overflowPolicy: "reject-new"
	}).lookup("keys-json")) throw new Error("Reef identity migration is incomplete; repair the legacy identity files and rerun openclaw doctor --fix");
}
async function generateAndStoreKeys(runtime) {
	assertReefIdentityMigrationComplete(runtime);
	const binding = parseReefIdentityBinding(runtime.state.openSyncKeyedStore({
		namespace: REEF_REGISTRATION_NAMESPACE,
		maxEntries: 2,
		overflowPolicy: "reject-new"
	}).lookup(REEF_REGISTRATION_IDENTITY_KEY));
	if (binding) throw new Error(`Reef identity @${binding.handle} on ${binding.relayUrl} has no canonical keys; restore the original keys before registration`);
	const identity = generateIdentity();
	const random = (length) => crypto.getRandomValues(new Uint8Array(length));
	const keys = {
		...identity,
		auditKey: base64url(random(32)),
		replayKey: base64url(random(32)),
		keyEpoch: 1
	};
	if (!openKeysStore(runtime).registerIfAbsent("keys", keys)) throw new Error("Reef keys already exist in plugin state");
	return keys;
}
async function loadKeys(runtime) {
	assertReefIdentityMigrationComplete(runtime);
	const value = openKeysStore(runtime).lookup(REEF_KEYS_KEY);
	if (!value) {
		const error = /* @__PURE__ */ new Error("Reef keys are missing from plugin state");
		error.code = "ENOENT";
		throw error;
	}
	return parseReefKeys(value);
}
var ReviewApprovalStore = class {
	#store;
	#reader;
	#maxEntries;
	constructor(runtime, maxEntries = REEF_REVIEWS_MAX_ENTRIES, authoritySignal) {
		this.authoritySignal = authoritySignal;
		this.#maxEntries = maxEntries;
		const options = {
			namespace: REEF_REVIEWS_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new"
		};
		this.#store = runtime.state.openSyncKeyedStore(options);
		this.#reader = runtime.state.openKeyedStore(options);
	}
	#makeRoomForPendingReview() {
		const deleteIf = this.#store.deleteIf;
		if (!deleteIf) throw new Error("Reef review retention requires atomic plugin-state deleteIf");
		while (true) {
			if (this.#store.count && this.#store.count() < this.#maxEntries) return;
			const entries = this.#store.entries();
			if (entries.length < this.#maxEntries) return;
			const completed = entries.filter((entry) => entry.value.approved !== void 0).toSorted((left, right) => left.createdAt - right.createdAt)[0];
			if (!completed) throw new Error("Reef pending review capacity is exhausted");
			deleteIf(completed.key, (current) => current.approved !== void 0);
		}
	}
	async request(review) {
		this.authoritySignal?.throwIfAborted();
		const current = this.#store.lookup(review.approvalDigest);
		if (current?.approved !== void 0) return {
			approved: current.approved,
			approvalDigest: review.approvalDigest
		};
		if (!current) this.#makeRoomForPendingReview();
		this.#store.registerIfAbsent(review.approvalDigest, { review: structuredClone(review) });
		const persisted = this.#store.lookup(review.approvalDigest);
		if (!persisted) throw new Error("Failed persisting Reef pending review");
		return persisted?.approved === void 0 ? void 0 : {
			approved: persisted.approved,
			approvalDigest: review.approvalDigest
		};
	}
	async lookupDecision(approvalDigest) {
		this.authoritySignal?.throwIfAborted();
		const current = await this.#reader.lookup(approvalDigest);
		this.authoritySignal?.throwIfAborted();
		if (!current) return "none";
		return current.approved === void 0 ? "pending" : { approved: current.approved };
	}
	async decide(digest, approved, assertOwnerCurrent) {
		const update = this.#store.update;
		if (!update) throw new Error("Reef review state requires atomic plugin-state updates");
		let decided;
		this.authoritySignal?.throwIfAborted();
		assertOwnerCurrent?.();
		update(digest, (current) => {
			if (!current) return;
			decided = structuredClone(current.review);
			return {
				...current,
				approved
			};
		});
		return decided;
	}
	async list() {
		this.authoritySignal?.throwIfAborted();
		const entries = await this.#reader.entries();
		this.authoritySignal?.throwIfAborted();
		return entries.filter((entry) => entry.value.approved === void 0).map((entry) => structuredClone(entry.value.review));
	}
};
var ReefDeliveredStore = class {
	#delivered;
	constructor(runtime, maxEntries = REEF_DELIVERED_MAX_ENTRIES) {
		this.#delivered = runtime.state.openKeyedStore({
			namespace: REEF_DELIVERED_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new",
			defaultTtlMs: REEF_DELIVERED_TTL_MS
		});
	}
	async has(id) {
		return (await this.#delivered.lookup(id))?.id === id;
	}
	async status(id) {
		return (await this.#delivered.lookup(id))?.id === id ? "delivered" : void 0;
	}
	async confirm(id) {
		if (!await this.#delivered.registerIfAbsent(id, { id }) && (await this.#delivered.lookup(id))?.id !== id) throw new Error("Failed persisting Reef delivered marker");
	}
	async add(id) {
		await this.confirm(id);
	}
};
function parseReefInboxCursorRecord(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return typeof record.handle === "string" && record.handle.length > 0 && typeof record.relayUrl === "string" && record.relayUrl.length > 0 && Number.isSafeInteger(record.cursor) && (record.cursor ?? -1) >= 0 ? {
		handle: record.handle,
		relayUrl: record.relayUrl,
		cursor: record.cursor
	} : void 0;
}
/** Durable relay progress for the single Reef identity bound to this state DB. */
var ReefInboxCursorStore = class {
	#store;
	#openLegacy;
	constructor(runtime, binding) {
		this.binding = binding;
		const options = {
			namespace: REEF_INBOX_CURSOR_NAMESPACE,
			maxEntries: REEF_INBOX_CURSOR_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		};
		this.#store = runtime.state.openKeyedStore(options);
		this.#openLegacy = () => runtime.state.openSyncKeyedStore(options);
	}
	async load() {
		const value = await this.#store.lookup(REEF_INBOX_CURSOR_KEY);
		if (value === void 0) return 0;
		return this.#requireBoundRecord(value).cursor;
	}
	async advance(cursor) {
		if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("invalid Reef inbox cursor");
		const { observe, compareAndApply } = this.#store;
		if (observe && compareAndApply) {
			let observation = await observe(REEF_INBOX_CURSOR_KEY);
			for (;;) {
				let existing;
				try {
					existing = observation.value === void 0 ? void 0 : this.#requireBoundRecord(observation.value);
				} catch (error) {
					const result = await compareAndApply(REEF_INBOX_CURSOR_KEY, observation.comparison, {
						operation: "update",
						action: "keep"
					});
					if (result.status !== "conflict") throw error;
					observation = result.current;
					continue;
				}
				const value = existing ? cursor > existing.cursor ? {
					...existing,
					cursor
				} : existing : {
					...this.binding,
					cursor
				};
				const result = await compareAndApply(REEF_INBOX_CURSOR_KEY, observation.comparison, {
					operation: "update",
					action: "set",
					value
				});
				if (result.status !== "conflict") break;
				observation = result.current;
			}
			const persisted = await this.#store.lookup(REEF_INBOX_CURSOR_KEY);
			if (!persisted || this.#requireBoundRecord(persisted).cursor < cursor) throw new Error("failed persisting Reef inbox cursor");
			return;
		}
		const store = this.#openLegacy();
		const update = store.update;
		if (!update) throw new Error("Reef inbox cursor requires atomic plugin-state updates");
		update(REEF_INBOX_CURSOR_KEY, (current) => {
			if (current === void 0) return {
				...this.binding,
				cursor
			};
			const existing = this.#requireBoundRecord(current);
			return cursor > existing.cursor ? {
				...existing,
				cursor
			} : existing;
		});
		const persisted = store.lookup(REEF_INBOX_CURSOR_KEY);
		if (!persisted || this.#requireBoundRecord(persisted).cursor < cursor) throw new Error("failed persisting Reef inbox cursor");
	}
	#requireBoundRecord(value) {
		const record = parseReefInboxCursorRecord(value);
		if (!record) throw new Error("invalid Reef inbox cursor state");
		if (record.handle !== this.binding.handle || record.relayUrl !== this.binding.relayUrl) throw new Error("Reef inbox cursor belongs to a different identity");
		return record;
	}
};
function openStores$1(runtime, keys, options = {}) {
	assertReefIdentityMigrationComplete(runtime);
	return {
		audit: openReefAuditStore(runtime, fromBase64url(keys.auditKey), options.auditMaxEntries),
		replay: new ReefSqliteReplayStore(runtime, fromBase64url(keys.replayKey), randomBytes$2, options.replayMaxEntries),
		reviews: new ReviewApprovalStore(runtime, void 0, options.authoritySignal),
		delivered: new ReefDeliveredStore(runtime, options.deliveredMaxEntries)
	};
}
//#endregion
//#region extensions/reef/src/trust-store.ts
const REEF_TRUST_STORE_MAX_ENTRIES = 4096;
const REEF_TRUST_STORE_NAMESPACE = "peer-state";
const REEF_OUTBOUND_DELIVERY_STORE_NAMESPACE = "outbound-deliveries";
const REEF_OUTBOUND_DELIVERY_MAX_ENTRIES = 32768;
const REEF_OUTBOUND_DELIVERY_TTL_MS = 52704e5;
const REEF_PAIRING_APPROVAL_PREFIX = "reef-approval-v1:";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const MESSAGE_ID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const ReefOutboundRequestSchema = record(uuid(), number().int().nonnegative());
const ReefRejectionNoticeStateSchema = object({
	lastRejectionAt: number().int().nonnegative(),
	lastResendAt: number().int().nonnegative().optional()
}).strict();
const ReefOutboundRejectionSchema = object({
	category: string().min(1).max(64).optional(),
	notice: ReefRejectionNoticeStateSchema.optional()
}).strict();
const ReefOutboundDeliveryBindingSchema = object({
	bodyHash: string().regex(SHA256_HEX_PATTERN),
	textHash: string().regex(SHA256_HEX_PATTERN).optional(),
	recipient: ReefPeerIdentitySchema
}).strict();
const ReefOutboundDeliverySchema = ReefOutboundDeliveryBindingSchema.extend({
	resendDisabled: literal(true).optional(),
	rejection: ReefOutboundRejectionSchema.optional(),
	sentAt: number().int().positive().optional(),
	overdueNotifiedAt: number().int().positive().optional()
}).strict();
const ReefPeerStateSchema = object({
	revision: number().int().nonnegative(),
	trust: ReefPeerTrustSchema.optional(),
	outboundRequests: ReefOutboundRequestSchema.optional(),
	rejectionNotice: ReefRejectionNoticeStateSchema.optional()
}).strict();
function requirePeer(raw) {
	const peer = normalizeReefTarget(raw);
	if (!peer) throw new Error(`Invalid Reef peer handle: ${raw}`);
	return peer;
}
function resolveReefIdentityScope(config) {
	if (!config.handle) throw new Error("Reef handle is required before opening peer trust state");
	return createHash("sha256").update(`${new URL(config.relayUrl).origin}\n${config.handle}`).digest("hex");
}
function resolveReefTrustStoreKey(config, peer) {
	return `${resolveReefIdentityScope(config)}:${requirePeer(peer)}`;
}
function resolvePairingKeyDigest(friend, trustRevision) {
	return createHash("sha256").update(`${friend.peer}\n${friend.key_epoch}\n${trustRevision}\n${friend.ed25519_pub}\n${friend.x25519_pub}`).digest("hex");
}
function isReefPairingApprovalToken(raw) {
	return raw.trim().startsWith(REEF_PAIRING_APPROVAL_PREFIX);
}
function openStores(openStore) {
	return {
		peers: openStore({
			namespace: REEF_TRUST_STORE_NAMESPACE,
			maxEntries: REEF_TRUST_STORE_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		}),
		deliveries: openStore({
			namespace: REEF_OUTBOUND_DELIVERY_STORE_NAMESPACE,
			maxEntries: REEF_OUTBOUND_DELIVERY_MAX_ENTRIES,
			overflowPolicy: "reject-new",
			defaultTtlMs: REEF_OUTBOUND_DELIVERY_TTL_MS
		})
	};
}
/** Canonical local Reef authorization state for one relay identity. */
var ReefTrustStore = class {
	#identityScope;
	#prefix;
	constructor(stores, config) {
		this.stores = stores;
		this.#identityScope = resolveReefIdentityScope(config);
		this.#prefix = `${this.#identityScope}:`;
	}
	snapshot(peer) {
		const value = this.stores.peers.lookup(this.#key(peer));
		return value === void 0 ? { revision: 0 } : ReefPeerStateSchema.parse(value);
	}
	get(peer) {
		return this.snapshot(peer).trust;
	}
	list() {
		return this.stores.peers.entries().filter((entry) => entry.key.startsWith(this.#prefix)).flatMap((entry) => {
			const state = ReefPeerStateSchema.parse(entry.value);
			return state.trust ? [{
				peer: requirePeer(entry.key.slice(this.#prefix.length)),
				trust: state.trust
			}] : [];
		}).toSorted((left, right) => left.peer === right.peer ? 0 : left.peer < right.peer ? -1 : 1);
	}
	set(peer, trust) {
		const parsedTrust = ReefPeerTrustSchema.parse(trust);
		this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			return {
				...current,
				revision: current.revision + 1,
				trust: parsedTrust
			};
		});
	}
	remove(peer) {
		return this.#requireUpdate()(this.#key(peer), (value) => {
			return { revision: this.#parseState(value).revision + 1 };
		});
	}
	setAutonomy(peer, autonomy) {
		const normalizedAutonomy = ReefAutonomySchema.parse(autonomy);
		const key = this.#key(peer);
		if (!this.#requireUpdate()(key, (value) => {
			const current = this.#parseState(value);
			if (!current.trust) return;
			return {
				...current,
				trust: {
					...current.trust,
					autonomy: normalizedAutonomy
				}
			};
		})) throw new Error(`Reef peer @${requirePeer(peer)} is not locally trusted`);
	}
	markSafetyNumberChanged(peer, expectedRevision) {
		return this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			if (current.revision !== expectedRevision || !current.trust) return;
			return {
				...current,
				revision: current.revision + 1,
				trust: {
					...current.trust,
					safetyNumberChanged: true
				}
			};
		});
	}
	commitPeerTrust(friend, options, approvedAt = Date.now()) {
		const peer = requirePeer(friend.peer);
		return this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			if (current.revision !== options.expectedRevision || options.expectedOutboundRequestId !== void 0 && current.outboundRequests?.[options.expectedOutboundRequestId] === void 0) return;
			return {
				revision: current.revision + 1,
				trust: {
					autonomy: current.trust?.autonomy ?? "bounded",
					ed25519PublicKey: friend.ed25519_pub,
					x25519PublicKey: friend.x25519_pub,
					keyEpoch: friend.key_epoch,
					safetyNumberChanged: false,
					approvedAt
				},
				...current.rejectionNotice ? { rejectionNotice: current.rejectionNotice } : {}
			};
		});
	}
	createPairingApproval(friend, trustRevision = this.snapshot(friend.peer).revision) {
		return `${REEF_PAIRING_APPROVAL_PREFIX}${this.#identityScope}:${requirePeer(friend.peer)}:${friend.key_epoch}:${trustRevision}:${resolvePairingKeyDigest(friend, trustRevision)}`;
	}
	parsePairingApproval(raw) {
		const parts = raw.trim().split(":");
		if (parts.length !== 6 || `${parts[0]}:` !== REEF_PAIRING_APPROVAL_PREFIX) return;
		const [, identityScope, rawPeer, rawKeyEpoch, rawTrustRevision, keyDigest] = parts;
		const peer = rawPeer ? normalizeReefTarget(rawPeer) : void 0;
		const keyEpoch = Number(rawKeyEpoch);
		const trustRevision = Number(rawTrustRevision);
		if (identityScope !== this.#identityScope || !peer || peer !== rawPeer || !Number.isSafeInteger(keyEpoch) || keyEpoch < 1 || String(keyEpoch) !== rawKeyEpoch || !Number.isSafeInteger(trustRevision) || trustRevision < 0 || String(trustRevision) !== rawTrustRevision || !keyDigest || !SHA256_HEX_PATTERN.test(keyDigest)) return;
		return {
			peer,
			keyEpoch,
			trustRevision
		};
	}
	matchesPairingApproval(raw, friend) {
		return raw.trim() === this.createPairingApproval(friend);
	}
	recordOutboundRequest(peer, requestedAt = Date.now()) {
		const requestId = randomUUID();
		if (!this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			return {
				...current,
				outboundRequests: {
					...current.outboundRequests,
					[requestId]: requestedAt
				}
			};
		})) throw new Error(`Failed to persist outbound Reef request for @${requirePeer(peer)}`);
		return requestId;
	}
	hasOutboundRequest(peer) {
		return Object.keys(this.snapshot(peer).outboundRequests ?? {}).length > 0;
	}
	outboundRequestStatus(peer, requestId) {
		const current = this.snapshot(peer);
		if (current.outboundRequests?.[requestId] !== void 0) return "current";
		return current.trust || this.#hasOutboundRequests(current) ? "superseded" : "revoked";
	}
	removeOutboundRequest(peer, requestId) {
		return this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			if (!this.#hasOutboundRequests(current)) return;
			if (requestId === void 0) {
				const { outboundRequests: _removed, ...next } = current;
				return next;
			}
			if (current.outboundRequests?.[requestId] === void 0) return;
			const { [requestId]: _removed, ...remaining } = current.outboundRequests;
			if (Object.keys(remaining).length === 0) {
				const { outboundRequests: _allRemoved, ...next } = current;
				return next;
			}
			return {
				...current,
				outboundRequests: remaining
			};
		});
	}
	recordOutboundDelivery(peer, id, binding, options = {}) {
		const key = this.#deliveryKey(peer, id);
		const value = ReefOutboundDeliverySchema.parse({
			...binding,
			...options,
			sentAt: Date.now()
		});
		if (!this.stores.deliveries.registerIfAbsent(key, value)) throw new Error(`Duplicate outbound Reef delivery id ${id}`);
	}
	/**
	* Sends that never produced any receipt. Rejections have their own notice
	* path, and each delivery is reported overdue at most once.
	*/
	overdueOutboundDeliveries(olderThanMs, now = Date.now()) {
		const peers = /* @__PURE__ */ new Map();
		return this.stores.deliveries.entries().filter((entry) => entry.key.startsWith(this.#prefix)).flatMap((entry) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(entry.value);
			if (!parsed.success || parsed.data.rejection || parsed.data.overdueNotifiedAt !== void 0 || parsed.data.sentAt === void 0 || parsed.data.sentAt + olderThanMs > now) return [];
			const separator = entry.key.lastIndexOf(":");
			const peer = requirePeer(entry.key.slice(this.#prefix.length, separator));
			const id = entry.key.slice(separator + 1);
			if (!MESSAGE_ID_PATTERN.test(id) || !matchesReefPeerIdentity(this.#peerForScan(peer, peers), parsed.data.recipient)) return [];
			return [{
				peer,
				id,
				sentAt: parsed.data.sentAt
			}];
		});
	}
	markOutboundDeliveryOverdueNotified(peer, id) {
		const update = this.stores.deliveries.update;
		if (!update) throw new Error("Reef outbound delivery state requires atomic plugin-state updates");
		return update(this.#deliveryKey(peer, id), (value) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(value);
			if (!parsed.success || parsed.data.rejection || parsed.data.overdueNotifiedAt !== void 0) return;
			return {
				...parsed.data,
				overdueNotifiedAt: Date.now()
			};
		});
	}
	outboundDelivery(peer, id) {
		const value = this.stores.deliveries.lookup(this.#deliveryKey(peer, id));
		return value === void 0 ? void 0 : ReefOutboundDeliverySchema.parse(value);
	}
	consumeOutboundDelivery(peer, id, binding) {
		const expected = this.#parseDeliveryBinding(binding);
		const deleteIf = this.stores.deliveries.deleteIf;
		if (!deleteIf) throw new Error("Reef outbound delivery state requires atomic plugin-state deletion");
		return deleteIf(this.#deliveryKey(peer, id), (current) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(current);
			return parsed.success && this.#matchesDeliveryBinding(parsed.data, expected) && parsed.data.rejection === void 0;
		});
	}
	discardOutboundDelivery(peer, id, binding) {
		const expected = this.#parseDeliveryBinding(binding);
		const deleteIf = this.stores.deliveries.deleteIf;
		if (!deleteIf) throw new Error("Reef outbound delivery state requires atomic plugin-state deletion");
		return deleteIf(this.#deliveryKey(peer, id), (current) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(current);
			return parsed.success && this.#matchesDeliveryBinding(parsed.data, expected);
		});
	}
	recordOutboundRejection(peer, id, binding, category) {
		const key = this.#deliveryKey(peer, id);
		const expected = this.#parseDeliveryBinding(binding);
		const current = this.outboundDelivery(peer, id);
		if (!current || !this.#matchesDeliveryBinding(current, expected)) return false;
		if (current.rejection) return true;
		const update = this.stores.deliveries.update;
		if (!update) throw new Error("Reef outbound delivery state requires atomic plugin-state updates");
		return update(key, (value) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(value);
			if (!parsed.success || !this.#matchesDeliveryBinding(parsed.data, expected)) return;
			if (parsed.data.rejection) return parsed.data;
			const rejection = ReefOutboundRejectionSchema.parse({
				...category ? { category } : {},
				...parsed.data.resendDisabled ? { notice: { lastRejectionAt: Date.now() } } : {}
			});
			return {
				...parsed.data,
				rejection
			};
		});
	}
	pendingOutboundRejections() {
		const peers = /* @__PURE__ */ new Map();
		return this.stores.deliveries.entries().filter((entry) => entry.key.startsWith(this.#prefix)).flatMap((entry) => {
			const delivery = ReefOutboundDeliverySchema.parse(entry.value);
			if (!delivery.rejection) return [];
			const separator = entry.key.lastIndexOf(":");
			const peer = requirePeer(entry.key.slice(this.#prefix.length, separator));
			const id = entry.key.slice(separator + 1);
			if (!MESSAGE_ID_PATTERN.test(id) || !matchesReefPeerIdentity(this.#peerForScan(peer, peers), delivery.recipient)) return [];
			return [{
				id,
				peer,
				recipient: delivery.recipient,
				...delivery.textHash ? { textHash: delivery.textHash } : {},
				...delivery.rejection.category ? { category: delivery.rejection.category } : {},
				...delivery.rejection.notice ? { reservedNotice: delivery.rejection.notice } : {}
			}];
		}).toSorted((left, right) => left.id === right.id ? 0 : left.id < right.id ? -1 : 1);
	}
	reserveOutboundRejectionNotice(peer, id, recipient, state) {
		const update = this.stores.deliveries.update;
		if (!update) throw new Error("Reef outbound delivery state requires atomic plugin-state updates");
		const expectedRecipient = ReefPeerIdentitySchema.parse(recipient);
		if (!matchesReefPeerIdentity(this.get(peer), expectedRecipient)) throw new Error(`Reef peer @${requirePeer(peer)} changed keys before rejection recovery`);
		const noticeState = ReefRejectionNoticeStateSchema.parse(state);
		let outcome;
		if (!update(this.#deliveryKey(peer, id), (value) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(value);
			if (!parsed.success || !parsed.data.rejection || !sameReefPeerIdentity(parsed.data.recipient, expectedRecipient)) return;
			if (parsed.data.rejection.notice) {
				outcome = {
					kind: "existing",
					state: parsed.data.rejection.notice
				};
				return parsed.data;
			}
			outcome = { kind: "reserved" };
			return {
				...parsed.data,
				rejection: {
					...parsed.data.rejection,
					notice: noticeState
				}
			};
		}) || !outcome) throw new Error(`Reef rejection ${id} lost its durable delivery state`);
		return outcome;
	}
	completeOutboundRejection(peer, id, state) {
		const noticeState = ReefRejectionNoticeStateSchema.parse(state);
		this.#requireUpdate()(this.#key(peer), (value) => {
			const current = this.#parseState(value);
			const previous = current.rejectionNotice;
			const hasResendAt = previous?.lastResendAt !== void 0 || noticeState.lastResendAt !== void 0;
			return {
				...current,
				rejectionNotice: {
					lastRejectionAt: Math.max(previous?.lastRejectionAt ?? 0, noticeState.lastRejectionAt),
					...hasResendAt ? { lastResendAt: Math.max(previous?.lastResendAt ?? 0, noticeState.lastResendAt ?? 0) } : {}
				}
			};
		});
		const key = this.#deliveryKey(peer, id);
		const deleteIf = this.stores.deliveries.deleteIf;
		if (!deleteIf) throw new Error("Reef outbound delivery state requires atomic plugin-state deletion");
		return deleteIf(key, (value) => {
			const parsed = ReefOutboundDeliverySchema.safeParse(value);
			return parsed.success && parsed.data.rejection?.notice !== void 0;
		}) || this.stores.deliveries.lookup(key) === void 0;
	}
	rejectionNoticeState(peer) {
		return this.snapshot(peer).rejectionNotice;
	}
	#peerForScan(peer, peers) {
		if (!peers.has(peer)) peers.set(peer, this.get(peer));
		return peers.get(peer);
	}
	#key(peer) {
		return `${this.#prefix}${requirePeer(peer)}`;
	}
	#deliveryKey(peer, id) {
		if (!MESSAGE_ID_PATTERN.test(id)) throw new Error(`Invalid Reef delivery id: ${id}`);
		return `${this.#prefix}${requirePeer(peer)}:${id}`;
	}
	#parseState(value) {
		return value === void 0 ? { revision: 0 } : ReefPeerStateSchema.parse(value);
	}
	#parseDeliveryBinding(binding) {
		return ReefOutboundDeliveryBindingSchema.parse({
			bodyHash: binding.bodyHash,
			...binding.textHash ? { textHash: binding.textHash } : {},
			recipient: binding.recipient
		});
	}
	#matchesDeliveryBinding(current, expected) {
		return current.bodyHash === expected.bodyHash && current.textHash === expected.textHash && sameReefPeerIdentity(current.recipient, expected.recipient);
	}
	#hasOutboundRequests(state) {
		return Object.keys(state.outboundRequests ?? {}).length > 0;
	}
	#requireUpdate() {
		const update = this.stores.peers.update;
		if (!update) throw new Error("Reef peer trust requires atomic plugin-state updates");
		return update;
	}
};
function openReefTrustStore(runtime, config) {
	return new ReefTrustStore(openStores(runtime.state.openSyncKeyedStore), config);
}
//#endregion
//#region extensions/reef/src/doctor-state-paths.ts
const REEF_DURABLE_LEGACY_FILENAMES = [
	"keys.json",
	"identity.json",
	"setup-session.json",
	"audit.jsonl",
	"replay.jsonl",
	"reviews.json",
	"delivered.json"
];
function resolveLegacyReefStateDir(params) {
	const reef = params.config.channels?.reef;
	const configured = isRecord(reef) && typeof reef.stateDir === "string" ? reef.stateDir : null;
	const defaultDir = resolveDefaultLegacyReefStateDir(params.homeDir);
	const configuredDir = configured ? resolveUserPath(configured, params.env) : null;
	if (configuredDir) return configuredDir;
	const relativeToActiveState = path.relative(path.resolve(params.stateDir), defaultDir);
	return relativeToActiveState === "" || !relativeToActiveState.startsWith(`..${path.sep}`) && relativeToActiveState !== ".." && !path.isAbsolute(relativeToActiveState) ? defaultDir : path.join(params.stateDir, "data", "reef");
}
function resolveDefaultLegacyReefStateDir(homeDir = os.homedir()) {
	return path.join(homeDir, ".openclaw", "data", "reef");
}
async function legacyReefFileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
//#endregion
export { REEF_MAX_PLAINTEXT_BYTES as $, reefReplayStoreKey as A, parseReefSetupSession as B, generateAndStoreKeys as C, REEF_REPLAY_MAX_ENTRIES as D, parseReefKeys as E, clearReefSetupSession as F, REEF_AUDIT_HEAD_NAMESPACE as G, reserveReefIdentityBinding as H, finalizeReefIdentityBinding as I, REEF_AUDIT_MIGRATION_NAMESPACE as J, REEF_AUDIT_MAX_ENTRIES as K, loadReefIdentityBinding as L, REEF_REGISTRATION_NAMESPACE as M, REEF_REGISTRATION_SESSION_KEY as N, REEF_REPLAY_NAMESPACE as O, assertReefIdentityBinding as P, reefAuditEntryKey as Q, loadReefSetupSession as R, ReefInboxCursorStore as S, openStores$1 as T, saveReefSetupSession as U, releaseReefIdentityReservation as V, REEF_AUDIT_HEAD_KEY as W, REEF_AUDIT_STORE_MAX_ENTRIES as X, REEF_AUDIT_NAMESPACE as Y, parseReefAuditHead as Z, REEF_KEYS_MIGRATION_KEY as _, REEF_OUTBOUND_DELIVERY_TTL_MS as a, validateMessageBody as at, REEF_REVIEWS_MAX_ENTRIES as b, isReefPairingApprovalToken as c, parseHandleEpoch as ct, REEF_DELIVERED_MAX_ENTRIES as d, appendInboxRead as dt, ReplayedError as et, REEF_DELIVERED_NAMESPACE as f, verifyChain as ft, REEF_KEYS_KEY as g, REEF_DURABLE_MIGRATION_NAMESPACE as h, REEF_OUTBOUND_DELIVERY_MAX_ENTRIES as i, validateEnvelopeMetadata as it, REEF_REGISTRATION_IDENTITY_KEY as j, REEF_REPLAY_TTL_MS as k, openReefTrustStore as l, signDeviceRequest as lt, REEF_DURABLE_MIGRATION_KEY as m, ed25519 as mt, legacyReefFileExists as n, openClaimed as nt, REEF_TRUST_STORE_MAX_ENTRIES as o, fingerprint as ot, REEF_DELIVERED_TTL_MS as p, verifyChainSegment as pt, REEF_AUDIT_MIGRATION_KEY as q, resolveLegacyReefStateDir as r, seal as rt, REEF_TRUST_STORE_NAMESPACE as s, formatHandleEpoch as st, REEF_DURABLE_LEGACY_FILENAMES as t, bodyHash as tt, resolveReefTrustStoreKey as u, appendAudit as ut, REEF_KEYS_MIGRATION_NAMESPACE as v, loadKeys as w, REEF_REVIEWS_NAMESPACE as x, REEF_KEYS_NAMESPACE as y, parseReefIdentityBinding as z };
