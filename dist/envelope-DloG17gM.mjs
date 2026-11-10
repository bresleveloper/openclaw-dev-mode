import { A as ahash, C as utf8ToBytes, E as sha256, M as aoutput, O as abytes, P as clean, R as randomBytes, a as decodeUtf8, j as anumber, k as aexists, n as sha256Hex, o as fromBase64, r as base64, s as fromBase64url, t as canonicalBytes } from "./canonical-C1hv0IfI.mjs";
import { h as gcm } from "./audit-state-format-xKEkjxPg.mjs";
import { A as x25519, D as parseHandleEpoch, k as ed25519 } from "./state-format-A6jMVTqv.mjs";
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
		abytes(key, void 0, "key");
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
		clean(pad);
	}
	update(buf) {
		aexists(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		aexists(this);
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
	anumber(length, "length");
	abytes(prk, void 0, "prk");
	const olen = hash.outputLen;
	if (prk.length < olen) throw new Error("\"prk\" must be at least HashLen octets");
	if (length > 255 * olen) throw new Error("Length must be <= 255*HashLen");
	const blocks = Math.ceil(length / olen);
	if (info === void 0) info = EMPTY_BUFFER;
	else abytes(info, void 0, "info");
	if (!blocks) {
		if (_recycled) clean(prk);
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
	if (T !== okm) clean(T);
	clean(HKDF_COUNTER);
	if (length === okm.length) return okm;
	const res = okm.slice(0, length);
	clean(okm);
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
const REEF_ENVELOPE_MAX_AGE_SECONDS = 2592e3;
const HKDF_INFO = utf8ToBytes("reef-v1");
const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
function seal(options) {
	const ts = options.ts ?? Math.floor(Date.now() / 1e3);
	validateEnvelopeMetadata(options.id, options.from, options.to, ts);
	validateMessageBody(options.body);
	const plaintext = canonicalBytes(options.body);
	if (plaintext.length > 32768) throw new TooLargeError();
	const ephemeral = x25519.keygen((options.rng ?? randomBytes)(32));
	const shared = x25519.getSharedSecret(ephemeral.secretKey, decodeKey(options.recipientEncryptionPublicKey));
	const key = hkdf(sha256, shared, void 0, HKDF_INFO, 32);
	const nonce = (options.rng ?? randomBytes)(12);
	if (nonce.length !== 12) throw new MalformedError("rng returned invalid nonce");
	const unsigned = {
		v: 1,
		id: options.id,
		from: options.from,
		to: options.to,
		ts,
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
	const hash = sha256Hex(canonicalBytes(envelope));
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
	return sha256Hex(canonicalBytes(body));
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
export { openClaimed as a, validateMessageBody as c, bodyHash as i, REEF_MAX_PLAINTEXT_BYTES as n, seal as o, ReplayedError as r, validateEnvelopeMetadata as s, REEF_ENVELOPE_MAX_AGE_SECONDS as t };
