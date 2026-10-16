import { i as TOKEN_SHARING_ISSUER, l as isSIWCAuthFlow, n as TOKEN_SHARING_AUTH_FLOW, o as TOKEN_SHARING_REDIRECT_URI, r as TOKEN_SHARING_CLIENT_ID, s as TOKEN_SHARING_RESOURCE, t as IDENTITY_AUTH_FLOW } from "./token-sharing-CmBELw8t.mjs";
import { n as withOpenAIOAuthResponse, t as createOpenAIAuthorizationCodeForm } from "./openai-oauth-http.runtime-CYYBufQ-.mjs";
import { t as OPENAI_DEFAULT_MODEL } from "./openai-provider-C6UtIze5.mjs";
import { asOptionalRecord, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { generateOAuthState, generatePKCE, oauthErrorHtml, oauthSuccessHtml, resolveOAuthTokenExpiresAt, withOAuthLoginAbort } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { createHash } from "node:crypto";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { buildOauthProviderAuthResult } from "openclaw/plugin-sdk/provider-auth-result";
import { startProviderOAuthLoopbackCallbackServer } from "openclaw/plugin-sdk/provider-auth-runtime";
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/buffer_utils.js
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const strictDecoder = new TextDecoder("utf-8", { fatal: !0 });
function concat(...buffers) {
	const size = buffers.reduce((acc, { length }) => acc + length, 0), buf = new Uint8Array(size);
	let i = 0;
	for (const buffer of buffers) buf.set(buffer, i), i += buffer.length;
	return buf;
}
const NON_ASCII = /[^\x00-\x7f]/;
function encode(string) {
	if (typeof string == "string" && string.length >= 128) {
		if (NON_ASCII.test(string)) throw new TypeError("non-ASCII string encountered in encode()");
		return encoder.encode(string);
	}
	const bytes = new Uint8Array(string.length);
	for (let i = 0; i < string.length; i++) {
		const code = string.charCodeAt(i);
		if (code > 127) throw new TypeError("non-ASCII string encountered in encode()");
		bytes[i] = code;
	}
	return bytes;
}
function decodeBase64(encoded, url = !1) {
	if (Uint8Array.fromBase64) return Uint8Array.fromBase64(encoded, { alphabet: url ? "base64url" : "base64" });
	if (url) {
		if (encoded.includes("+") || encoded.includes("/")) throw new TypeError("Invalid base64url");
		encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
	}
	const binary = atob(encoded), bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/util/errors.js
var JOSEError = class extends Error {
	static code = "ERR_JOSE_GENERIC";
	code = "ERR_JOSE_GENERIC";
	constructor(message, options) {
		super(message, options), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
	}
};
var JWTClaimValidationFailed = class extends JOSEError {
	static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	claim;
	reason;
	payload;
	constructor(message, payload, claim = "unspecified", reason = "unspecified") {
		super(message, { cause: {
			claim,
			reason,
			payload
		} }), this.claim = claim, this.reason = reason, this.payload = payload;
	}
};
var JWTExpired = class extends JOSEError {
	static code = "ERR_JWT_EXPIRED";
	code = "ERR_JWT_EXPIRED";
	claim;
	reason;
	payload;
	constructor(message, payload, claim = "unspecified", reason = "unspecified") {
		super(message, { cause: {
			claim,
			reason,
			payload
		} }), this.claim = claim, this.reason = reason, this.payload = payload;
	}
};
var JOSEAlgNotAllowed = class extends JOSEError {
	static code = "ERR_JOSE_ALG_NOT_ALLOWED";
	code = "ERR_JOSE_ALG_NOT_ALLOWED";
};
var JOSENotSupported = class extends JOSEError {
	static code = "ERR_JOSE_NOT_SUPPORTED";
	code = "ERR_JOSE_NOT_SUPPORTED";
};
var JWSInvalid = class extends JOSEError {
	static code = "ERR_JWS_INVALID";
	code = "ERR_JWS_INVALID";
};
var JWTInvalid = class extends JOSEError {
	static code = "ERR_JWT_INVALID";
	code = "ERR_JWT_INVALID";
};
var JWKSInvalid = class extends JOSEError {
	static code = "ERR_JWKS_INVALID";
	code = "ERR_JWKS_INVALID";
};
var JWKSNoMatchingKey = class extends JOSEError {
	static code = "ERR_JWKS_NO_MATCHING_KEY";
	code = "ERR_JWKS_NO_MATCHING_KEY";
	constructor(message = "no applicable key found in the JSON Web Key Set", options) {
		super(message, options);
	}
};
var JWKSMultipleMatchingKeys = class extends JOSEError {
	[Symbol.asyncIterator] = async function* () {};
	static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
	code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
	constructor(message = "multiple matching keys found in the JSON Web Key Set", options) {
		super(message, options);
	}
};
var JWSSignatureVerificationFailed = class extends JOSEError {
	static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	constructor(message = "signature verification failed", options) {
		super(message, options);
	}
};
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/util/base64url.js
const invalid = "The input to be decoded is not correctly encoded.";
function decode(input) {
	try {
		return decodeBase64(typeof input == "string" ? input : decoder.decode(input), !0);
	} catch (cause) {
		throw new TypeError(invalid, { cause });
	}
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/validate.js
function isObject(input) {
	if (typeof input != "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]") return !1;
	const prototype = Object.getPrototypeOf(input);
	return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function isJwkSet(input) {
	return isObject(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject);
}
function isDisjoint(...headers) {
	const parameters = /* @__PURE__ */ new Set();
	for (const header of headers) if (header) for (const parameter of Object.keys(header)) {
		if (parameters.has(parameter)) return !1;
		parameters.add(parameter);
	}
	return !0;
}
function decodeBase64url(value, label, ErrorClass) {
	try {
		return decode(value);
	} catch {
		throw new ErrorClass(`Failed to base64url decode the ${label}`);
	}
}
function encodeBase64url(value, label, ErrorClass) {
	try {
		return encode(value);
	} catch {
		throw new ErrorClass(`The ${label} is not a valid base64url string`);
	}
}
function parseJoseHeader(b64, ErrorClass, message) {
	let parsed;
	try {
		parsed = JSON.parse(strictDecoder.decode(decode(b64)));
	} catch {
		throw new ErrorClass(message);
	}
	if (!isObject(parsed)) throw new ErrorClass(message);
	return parsed;
}
const JWS_RECOGNIZED = {
	__proto__: null,
	b64: !0
};
function validateAlgorithms(option, algorithms) {
	if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s != "string"))) throw new TypeError(`"${option}" option must be an array of strings`);
	return algorithms === void 0 ? void 0 : new Set(algorithms);
}
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
	if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) throw new Err("\"crit\" (Critical) Header Parameter MUST be integrity protected");
	if (!protectedHeader || protectedHeader.crit === void 0) return [];
	if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input != "string" || input.length === 0)) throw new Err("\"crit\" (Critical) Header Parameter MUST be an array of non-empty strings when present");
	const recognized = recognizedOption === void 0 ? recognizedDefault : {
		__proto__: null,
		...recognizedOption,
		...recognizedDefault
	};
	for (const parameter of protectedHeader.crit) {
		if (!(parameter in recognized)) throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
		if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0) throw new Err(`Extension Header Parameter "${parameter}" is missing`);
		if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0)) throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
	}
	return protectedHeader.crit;
}
function validateB64(protectedHeader, extensions) {
	if (extensions.includes("b64")) {
		const b64 = protectedHeader.b64;
		if (typeof b64 != "boolean") throw new JWSInvalid("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
		return b64;
	}
	return !0;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/key.js
const tag = (key) => key[Symbol.toStringTag];
const jwkMatchesOp = (entry, key, usage) => {
	const { alg } = entry;
	if (key.use !== void 0) {
		const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
		if (key.use !== expected) throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
	}
	if (key.alg !== void 0 && key.alg !== alg) throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
	if (Array.isArray(key.key_ops)) {
		const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
		if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
	}
};
async function prepareKey(entry, key, usage) {
	const { alg, secret } = entry, privateKey = usage === "decrypt" || usage === "sign";
	if (secret && key instanceof Uint8Array) return key;
	let normalized, keyObject;
	if (isObject(key)) {
		if (normalized = normalizeJwk(key), typeof normalized.kty != "string") throw invalidKeyType(alg, key, secret);
		if (!(secret ? normalized.kty === "oct" && typeof normalized.k == "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv == "string" || typeof normalized.d == "string" : normalized.d === void 0 && normalized.priv === void 0))) throw new TypeError(secret ? "JSON Web Key for symmetric algorithms must have JWK \"kty\" (Key Type) equal to \"oct\" and the JWK \"k\" (Key Value) present" : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
		if (jwkMatchesOp(entry, normalized, usage), normalized.kty === "oct") return decode(normalized.k);
		if (!Object.isFrozen(key)) {
			const { key_ops } = key;
			Array.isArray(key_ops) && Object.freeze(key_ops), Object.freeze(key);
		}
	} else {
		if (!isKeyLike(key)) throw invalidKeyType(alg, key, secret);
		const expectedType = secret ? "secret" : privateKey ? "private" : "public";
		if (key.type !== expectedType && (secret || [
			"secret",
			"public",
			"private"
		].includes(key.type))) throw new TypeError(`${tag(key)} instances must be of type "${expectedType}" for the ${alg} algorithm`);
		if (isCryptoKey(key)) return key;
		if (keyObject = key, keyObject.type === "secret") return keyObject.export();
	}
	cache ||= /* @__PURE__ */ new WeakMap();
	const cacheKey = key;
	let cached = cache.get(cacheKey);
	if (cached?.[alg]) return cached[alg];
	if (cached || cache.set(cacheKey, cached = {}), keyObject && typeof keyObject.toCryptoKey == "function") {
		const isPublic = keyObject.type === "public", crv = nist[keyObject.asymmetricKeyDetails?.namedCurve], params = entry.resolve?.({
			crv,
			asymmetricKeyType: keyObject.asymmetricKeyType
		}) ?? entry.subtle;
		return cached[alg] = keyObject.toCryptoKey(params, isPublic, entry.usages[isPublic ? 0 : 1]);
	}
	return normalized ??= keyObject.export({ format: "jwk" }), normalized.alg = alg, cached[alg] = await jwkToKey(entry, normalized);
}
let cache;
const nist = {
	__proto__: null,
	prime256v1: "P-256",
	secp384r1: "P-384",
	secp521r1: "P-521"
};
const isCryptoKey = (key) => {
	if (key?.[Symbol.toStringTag] === "CryptoKey") return !0;
	try {
		return key instanceof CryptoKey;
	} catch {
		return !1;
	}
};
const isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
const isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
function message(msg, actual, ...types) {
	if (types.length > 2) {
		const last = types.pop();
		msg += `one of type ${types.join(", ")}, or ${last}.`;
	} else types.length === 2 ? msg += `one of type ${types[0]} or ${types[1]}.` : msg += `of type ${types[0]}.`;
	return actual == null ? msg += ` Received ${actual}` : typeof actual == "function" && actual.name ? msg += ` Received function ${actual.name}` : typeof actual == "object" && actual != null && actual.constructor?.name && (msg += ` Received an instance of ${actual.constructor.name}`), msg;
}
function invalidKeyType(alg, actual, secret) {
	const types = [
		"CryptoKey",
		"KeyObject",
		"JSON Web Key"
	];
	return secret && types.push("Uint8Array"), new TypeError(message(`Key for the ${alg} algorithm must be `, actual, ...types));
}
const unusable = (name, prop = "algorithm.name") => /* @__PURE__ */ new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
function checkUsage(key, usage) {
	if (usage && !key.usages.includes(usage)) throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
}
function checkModulusLength(alg, key) {
	const { modulusLength } = key.algorithm;
	if (typeof modulusLength != "number" || modulusLength < 2048) throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
}
function checkCryptoKey(key, expected, usage) {
	const algorithm = key.algorithm;
	if (algorithm.name !== expected.name) throw unusable(expected.name);
	if (expected.hash && algorithm.hash?.name !== expected.hash) throw unusable(expected.hash, "algorithm.hash");
	if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) throw unusable(expected.namedCurve, "algorithm.namedCurve");
	if (expected.length !== void 0 && algorithm.length !== expected.length) throw unusable(expected.length, "algorithm.length");
	checkUsage(key, usage);
}
function snapshotJwk(jwk) {
	return {
		__proto__: null,
		...jwk
	};
}
function normalizeJwk(jwk) {
	const normalized = snapshotJwk(jwk);
	if (normalized.ext !== void 0 && typeof normalized.ext != "boolean") throw new TypeError("\"ext\" (Extractable) Parameter must be a boolean");
	if (normalized.key_ops !== void 0) {
		const value = normalized.key_ops, keyOps = Array.isArray(value) ? [...value] : void 0;
		if (!keyOps || keyOps.some((operation) => typeof operation != "string") || new Set(keyOps).size !== keyOps.length) throw new TypeError("\"key_ops\" (Key Operations) Parameter must be an array of unique strings");
		normalized.key_ops = keyOps;
	}
	return normalized;
}
async function jwkToKey(entry, jwk, extractable) {
	if (!entry.kty.includes(jwk.kty)) throw new JOSENotSupported("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	const algorithm = entry.resolve?.({
		kty: jwk.kty,
		crv: jwk.crv
	}) ?? entry.subtle, isPrivate = !!(jwk.d || jwk.priv), keyData = {
		...jwk,
		ext: extractable ?? jwk.ext
	};
	return keyData.kty !== "AKP" && delete keyData.alg, delete keyData.use, crypto.subtle.importKey("jwk", keyData, algorithm, keyData.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
async function rawKey(key, expected, usage, extractable = !1) {
	return key instanceof Uint8Array && (key = await crypto.subtle.importKey("raw", key, expected, extractable, [usage])), checkCryptoKey(key, expected, usage), key;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/key_descriptor.js
function table(entries) {
	const out = { __proto__: null };
	for (const alg in entries) out[alg] = {
		...entries[alg],
		alg
	};
	return out;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/jws_algorithms.js
const sig = [["verify"], ["sign"]];
function hmac(bits) {
	const subtle = {
		name: "HMAC",
		hash: `SHA-${bits}`
	};
	return {
		kty: ["oct"],
		secret: !0,
		subtle,
		signing: subtle,
		usages: sig
	};
}
function rsa(bits, saltLength) {
	const subtle = {
		name: saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
		hash: `SHA-${bits}`
	};
	return {
		kty: ["RSA"],
		subtle,
		signing: saltLength ? {
			...subtle,
			saltLength
		} : subtle,
		usages: sig,
		minRsaBits: 2048
	};
}
function ecdsa(crv, bits) {
	return {
		kty: ["EC"],
		crv,
		subtle: {
			name: "ECDSA",
			namedCurve: crv
		},
		signing: {
			name: "ECDSA",
			hash: `SHA-${bits}`
		},
		usages: sig
	};
}
function eddsa() {
	const subtle = { name: "Ed25519" };
	return {
		kty: ["OKP"],
		crv: "Ed25519",
		subtle,
		signing: subtle,
		usages: sig
	};
}
function mldsa(bits) {
	const subtle = { name: `ML-DSA-${bits}` };
	return {
		kty: ["AKP"],
		subtle,
		signing: subtle,
		usages: sig
	};
}
const JWS = table({
	HS256: hmac(256),
	HS384: hmac(384),
	HS512: hmac(512),
	RS256: rsa(256),
	RS384: rsa(384),
	RS512: rsa(512),
	PS256: rsa(256, 32),
	PS384: rsa(384, 48),
	PS512: rsa(512, 64),
	ES256: ecdsa("P-256", 256),
	ES384: ecdsa("P-384", 384),
	ES512: ecdsa("P-521", 512),
	EdDSA: eddsa(),
	Ed25519: eddsa(),
	"ML-DSA-44": mldsa(44),
	"ML-DSA-65": mldsa(65),
	"ML-DSA-87": mldsa(87)
});
function jwsAlgorithm(alg) {
	const entry = typeof alg == "string" ? JWS[alg] : void 0;
	if (!entry) throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
	return entry;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/jws_verify.js
function prepareVerify(options) {
	return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
function parseProtectedHeader(encodedProtected) {
	return encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid");
}
function encodeCompactUnencodedPayload(payload) {
	try {
		return encode(payload);
	} catch {
		throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
	}
}
async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
	const { protected: encodedProtected, header, payload: inputPayload } = jws, parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected);
	if (!isDisjoint(parsedProt, header)) throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
	const joseHeader = {
		...parsedProt,
		...header
	}, b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader)), { alg } = joseHeader;
	if (typeof alg != "string" || !alg) throw new JWSInvalid("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
	if (shared[0] && !shared[0].has(alg)) throw new JOSEAlgNotAllowed("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (b64) {
		if (typeof inputPayload != "string") throw new JWSInvalid("JWS Payload must be a string");
	} else if (typeof inputPayload != "string" && !(inputPayload instanceof Uint8Array)) throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
	const signingPayload = b64 || typeof inputPayload != "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
	let resolvedKey = !1;
	typeof key == "function" && (key = await key(parsedProt, jws), resolvedKey = !0);
	const entry = jwsAlgorithm(alg), data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : /* @__PURE__ */ new Uint8Array(), encode("."), typeof signingPayload == "string" ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload), signature = decodeBase64url(jws.signature, "signature", JWSInvalid), k = await prepareKey(entry, key, "verify"), cryptoKey = await rawKey(k, entry.subtle, "verify");
	entry.minRsaBits && checkModulusLength(entry.alg, cryptoKey);
	let verified = !1;
	try {
		verified = await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
	} catch {}
	if (!verified) throw new JWSSignatureVerificationFailed();
	const result = { payload: typeof signingPayload == "string" ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload };
	return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? [{
		...result,
		key: k
	}, b64] : [result, b64];
}
async function verifyCompact(jws, shared, key) {
	if (jws instanceof Uint8Array && (jws = decoder.decode(jws)), typeof jws != "string") throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
	const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
	if (length !== 3) throw new JWSInvalid("Invalid Compact JWS");
	return verifySignature({
		payload,
		protected: protectedHeader,
		signature
	}, shared, key, encodeCompactUnencodedPayload);
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/lib/jwt_claims_set.js
const epoch = (date) => Math.floor(date.getTime() / 1e3);
const multipliers = {
	s: 1,
	m: 60,
	h: 3600,
	d: 86400,
	w: 604800,
	y: 31557600
};
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
const checkFailed = "check_failed";
function invalidDuration() {
	throw new TypeError("Invalid time period format");
}
function secs(str) {
	typeof str != "string" && invalidDuration();
	const matched = REGEX.exec(str);
	(!matched || matched[4] && matched[1]) && invalidDuration();
	const value = parseFloat(matched[2]), numericDate2 = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
	return Number.isFinite(numericDate2) || invalidDuration(), matched[1] === "-" || matched[4] === "ago" ? -numericDate2 : numericDate2;
}
function validateInput(label, input) {
	if (!Number.isFinite(input)) throw new TypeError(`Invalid ${label} input`);
	return input;
}
const normalizeTyp = (value) => {
	const normalized = value.toLowerCase();
	return value.includes("/") ? normalized : `application/${normalized}`;
};
const checkAudiencePresence = (audPayload, audOption) => typeof audPayload == "string" ? audOption.includes(audPayload) : Array.isArray(audPayload) ? audOption.some((aud) => audPayload.includes(aud)) : !1;
function validateNumericDate(payload, claim, required = !1) {
	const value = payload[claim];
	if (!(value === void 0 && !required)) {
		if (typeof value != "number") throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
		return value;
	}
}
function unexpectedClaim(payload, claim) {
	throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
	let payload;
	try {
		payload = JSON.parse(strictDecoder.decode(encodedPayload));
	} catch {}
	if (!isObject(payload)) throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
	const { typ } = options;
	if (typ !== void 0 && (typeof protectedHeader.typ != "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) throw new JWTClaimValidationFailed("unexpected \"typ\" JWT header value", payload, "typ", checkFailed);
	const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options, presenceCheck = [...requiredClaims];
	maxTokenAge !== void 0 && presenceCheck.push("iat"), audience !== void 0 && presenceCheck.push("aud"), subject !== void 0 && presenceCheck.push("sub"), issuer !== void 0 && presenceCheck.push("iss");
	for (const claim of new Set(presenceCheck.reverse())) if (!Object.hasOwn(payload, claim)) throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
	issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss) && unexpectedClaim(payload, "iss"), subject !== void 0 && payload.sub !== subject && unexpectedClaim(payload, "sub"), audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience == "string" ? [audience] : audience) && unexpectedClaim(payload, "aud");
	const { clockTolerance } = options;
	let tolerance = 0;
	if (typeof clockTolerance == "string") tolerance = secs(clockTolerance);
	else if (clockTolerance !== void 0) {
		if (typeof clockTolerance != "number") throw new TypeError("Invalid clockTolerance option type");
		tolerance = clockTolerance;
	}
	validateInput("clockTolerance option", tolerance);
	const { currentDate } = options, now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate)), iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0), nbf = validateNumericDate(payload, "nbf");
	if (nbf !== void 0 && nbf > now + tolerance) throw new JWTClaimValidationFailed("\"nbf\" claim timestamp check failed", payload, "nbf", checkFailed);
	const exp = validateNumericDate(payload, "exp");
	if (exp !== void 0 && exp <= now - tolerance) throw new JWTExpired("\"exp\" claim timestamp check failed", payload, "exp", checkFailed);
	if (maxTokenAge !== void 0) {
		const age = now - iat, max = validateInput("maxTokenAge option", typeof maxTokenAge == "number" ? maxTokenAge : secs(maxTokenAge));
		if (age - tolerance > max) throw new JWTExpired("\"iat\" claim timestamp check failed (too far in the past)", payload, "iat", checkFailed);
		if (age < -tolerance) throw new JWTClaimValidationFailed("\"iat\" claim timestamp check failed (it should be in the past)", payload, "iat", checkFailed);
	}
	return payload;
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
	const [verified, b64] = await verifyCompact(jwt, prepareVerify(options), key);
	if (!b64) throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
	const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
	return {
		...verified,
		payload
	};
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/jwks/local.js
function isUsableJWK(jwk, entry, alg, kid) {
	const { kty, key_ops: keyOps, ext, kid: jwkKid, alg: jwkAlg, use, crv } = jwk;
	return (ext === void 0 || typeof ext == "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index) => typeof operation == "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid == "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
}
async function importWithAlgCache(cache, jwk, entry) {
	const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk), { alg } = entry;
	if (cached[alg] === void 0) {
		const pending = jwkToKey(entry, jwk, !0).then((key) => {
			if (key.type !== "public") throw new JWKSInvalid("JSON Web Key Set members must be public keys");
			return cached[alg] = key, key;
		}).catch((error) => {
			throw cached[alg] === pending && delete cached[alg], error;
		});
		cached[alg] = pending;
	}
	return cached[alg];
}
function createLocalJWKSet(jwks) {
	let snapshot;
	try {
		snapshot = structuredClone(jwks);
	} catch {}
	if (!isJwkSet(snapshot)) throw new JWKSInvalid("JSON Web Key Set malformed");
	const metadata = snapshot.keys.map((jwk) => {
		const normalized = snapshotJwk(jwk);
		return Array.isArray(normalized.key_ops) && (normalized.key_ops = [...normalized.key_ops]), normalized;
	}), cached = /* @__PURE__ */ new WeakMap();
	return Object.defineProperty(async (protectedHeader, token) => {
		const { alg, kid } = {
			...protectedHeader,
			...token?.header
		}, entry = typeof alg == "string" ? JWS[alg] : void 0;
		if (!entry || entry.secret) throw new JOSENotSupported("Unsupported \"alg\" value for a JSON Web Key Set");
		const candidates = snapshot.keys.filter((_, index) => isUsableJWK(metadata[index], entry, alg, kid)), { 0: jwk, length } = candidates;
		if (!length) throw new JWKSNoMatchingKey();
		if (length !== 1) {
			const error = new JWKSMultipleMatchingKeys();
			throw error[Symbol.asyncIterator] = async function* () {
				for (const jwk2 of candidates) try {
					yield await importWithAlgCache(cached, jwk2, entry);
				} catch {}
			}, error;
		}
		return importWithAlgCache(cached, jwk, entry);
	}, "jwks", { value: () => structuredClone(snapshot) });
}
//#endregion
//#region node_modules/.pnpm/jose@6.2.12/node_modules/jose/dist/webapi/util/decode_jwt.js
function decodeJwt(jwt) {
	if (typeof jwt != "string") throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
	const { 1: payload, length } = jwt.split(".");
	if (length === 5) throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
	if (length !== 3) throw new JWTInvalid("Invalid JWT");
	if (!payload) throw new JWTInvalid("JWTs must contain a payload");
	let decoded;
	try {
		decoded = decode(payload);
	} catch {
		throw new JWTInvalid("Failed to base64url decode the payload");
	}
	let result;
	try {
		result = JSON.parse(strictDecoder.decode(decoded));
	} catch {
		throw new JWTInvalid("Failed to parse the decoded payload as JSON");
	}
	if (!isObject(result)) throw new JWTInvalid("Invalid JWT Claims Set");
	return result;
}
//#endregion
//#region extensions/openai/token-sharing-oauth.runtime.ts
const TOKEN_ENDPOINT = `${TOKEN_SHARING_ISSUER}/api/accounts/oauth/token`;
const MAX_RESPONSE_BYTES = 1048576;
const LOGIN_TIMEOUT_MS = 3e5;
async function requestJson(url, owner, body) {
	owner.signal?.throwIfAborted();
	owner.assertCurrent?.();
	return await withOpenAIOAuthResponse({
		url,
		policy: { hostnameAllowlist: ["auth.openai.com"] },
		mode: "trusted_env_proxy",
		requireHttps: true,
		maxRedirects: 0,
		capture: false,
		timeoutMs: 3e4,
		signal: owner.signal,
		beforeRequest: owner.assertCurrent,
		auditContext: "openai-token-sharing-oauth",
		...body ? { init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body
		} } : {}
	}, async (response) => {
		const bytes = await readResponseWithLimit(response, MAX_RESPONSE_BYTES);
		owner.signal?.throwIfAborted();
		owner.assertCurrent?.();
		let json;
		try {
			json = asOptionalRecord(JSON.parse(Buffer.from(bytes).toString("utf8")));
		} catch {}
		if (!response.ok) {
			const invalidGrant = json?.error === "invalid_grant";
			throw Object.assign(/* @__PURE__ */ new Error(invalidGrant ? "ChatGPT connection expired or was revoked. Sign in again to reconnect." : `ChatGPT authentication request failed (HTTP ${response.status}). Retry sign-in later.`), { oauthRefreshFailure: {
				status: response.status,
				...invalidGrant ? {
					reason: "invalid_grant",
					errorType: "invalid_grant"
				} : {}
			} });
		}
		if (!json) throw new Error("ChatGPT authentication returned an invalid response.");
		return json;
	});
}
async function verifyIdentity(idToken, clientId, owner, nonce) {
	const keys = await requestJson(`${TOKEN_SHARING_ISSUER}/.well-known/jwks.json`, owner);
	if (!Array.isArray(keys.keys) || !keys.keys.every(isRecord)) throw new Error("ChatGPT returned an invalid signing key set. Start sign-in again.");
	const { payload } = await jwtVerify(idToken, createLocalJWKSet({ keys: keys.keys }), {
		issuer: TOKEN_SHARING_ISSUER,
		audience: clientId,
		algorithms: ["RS256"],
		requiredClaims: [
			"iss",
			"aud",
			"sub",
			"iat",
			"exp"
		]
	});
	if (!payload.sub || nonce !== void 0 && payload.nonce !== nonce || payload.azp !== void 0 && payload.azp !== clientId || Array.isArray(payload.aud) && payload.aud.length > 1 && payload.azp !== clientId) throw new Error("ChatGPT sign-in identity could not be verified. Start sign-in again.");
	owner.assertCurrent?.();
	owner.signal?.throwIfAborted();
	return payload;
}
async function readCredential(params) {
	const { json, previous, clientId, owner } = params;
	const access = normalizeOptionalString(json.access_token);
	const refresh = normalizeOptionalString(json.refresh_token) ?? previous?.refresh;
	const expires = resolveOAuthTokenExpiresAt(json.expires_in);
	const idToken = normalizeOptionalString(json.id_token) ?? previous?.idToken;
	if (!access || !refresh || expires === void 0 || !idToken || typeof json.token_type !== "string" || json.token_type.toLowerCase() !== "bearer") throw new Error("ChatGPT did not return a complete renewable credential. Start sign-in again.");
	const identity = json.id_token || !previous ? await verifyIdentity(idToken, clientId, owner, params.nonce) : decodeJwt(idToken);
	const subject = identity.sub;
	if (!subject || previous?.idToken && decodeJwt(previous.idToken).sub !== subject) throw new Error("ChatGPT account changed during refresh. Sign in again to reconnect.");
	const scope = normalizeOptionalString(json.scope) ?? previous?.grantedScope;
	if (!previous && scope === void 0) throw new Error("ChatGPT did not report the granted scopes. Start sign-in again.");
	const grantedScopes = new Set(scope?.split(/\s+/u));
	const sharing = scope === void 0 ? previous?.authFlow === TOKEN_SHARING_AUTH_FLOW : grantedScopes.has("resource.invoke") && ["chatpass.enable.request.direct", "chatgpt.tokens.use.direct"].some((direct) => grantedScopes.has(direct));
	return {
		subject,
		credential: {
			...previous,
			type: "oauth",
			provider: "openai",
			access,
			refresh,
			expires,
			idToken,
			email: normalizeOptionalString(identity.email),
			clientId,
			issuer: TOKEN_SHARING_ISSUER,
			accountId: createHash("sha256").update(`${TOKEN_SHARING_ISSUER}\0${clientId}\0${subject}`).digest("hex"),
			tokenEndpoint: TOKEN_ENDPOINT,
			grantedScope: scope,
			authFlow: sharing ? TOKEN_SHARING_AUTH_FLOW : IDENTITY_AUTH_FLOW,
			displayName: sharing ? "Sign in with ChatGPT (Beta)" : "Sign in with ChatGPT (Beta, identity only)"
		}
	};
}
/** The auth-profile owner serializes refresh and atomically persists the returned rotation. */
async function refreshTokenSharingCredential(credential) {
	if (!credential.accountId || !credential.clientId || credential.clientId === "dynamic_agent_client" || credential.issuer !== "https://auth.openai.com" || credential.tokenEndpoint !== TOKEN_ENDPOINT) throw new Error("ChatGPT token-sharing registration is missing. Sign in again to reconnect.");
	return (await readCredential({
		json: await requestJson(TOKEN_ENDPOINT, {}, new URLSearchParams({
			grant_type: "refresh_token",
			client_id: credential.clientId,
			refresh_token: credential.refresh,
			resource: TOKEN_SHARING_RESOURCE
		})),
		clientId: credential.clientId,
		owner: {},
		previous: credential
	})).credential;
}
/** Local authorization owns the listener, state, verifier, and callback lifetime together. */
async function loginTokenSharing(ctx) {
	const owner = {
		...ctx,
		signal: AbortSignal.any([AbortSignal.timeout(LOGIN_TIMEOUT_MS), ...ctx.signal ? [ctx.signal] : []])
	};
	owner.assertCurrent?.();
	const existingProfiles = (ctx.existingProfiles ?? []).filter((profile) => profile.credential.type === "oauth" && profile.credential.provider === "openai" && isSIWCAuthFlow(profile.credential.authFlow) && profile.credential.issuer === "https://auth.openai.com" && profile.credential.tokenEndpoint === TOKEN_ENDPOINT && Boolean(profile.credential.clientId) && profile.credential.clientId !== "dynamic_agent_client");
	const selectedProfileId = existingProfiles.length ? await ctx.prompter.select({
		message: "Reconnect a ChatGPT account or connect a different account/workspace?",
		initialValue: existingProfiles[0].profileId,
		options: [...existingProfiles.map(({ profileId, credential }) => ({
			value: profileId,
			label: credential.displayName ?? credential.email ?? profileId,
			hint: `Reconnect ${profileId} using its existing registration`
		})), {
			value: TOKEN_SHARING_CLIENT_ID,
			label: "Connect a different ChatGPT account or workspace"
		}]
	}) : TOKEN_SHARING_CLIENT_ID;
	const existingProfile = existingProfiles.find((profile) => profile.profileId === selectedProfileId);
	const clientId = existingProfile?.credential.clientId ?? "dynamic_agent_client";
	const registering = clientId === TOKEN_SHARING_CLIENT_ID;
	const authorizationScope = (existingProfile?.credential.authorizationScope ?? (existingProfile ? "openid resource.invoke chatgpt.tokens.use.direct offline_access" : "openid email profile resource.invoke chatgpt.tokens.use.direct offline_access")).split(/\s+/u).map((scope) => scope === "chatpass.enable.request.direct" ? "chatgpt.tokens.use.direct" : scope).join(" ");
	owner.assertCurrent?.();
	owner.signal.throwIfAborted();
	const { verifier, challenge } = await generatePKCE();
	const state = generateOAuthState();
	const nonce = generateOAuthState();
	const url = new URL(`${TOKEN_SHARING_ISSUER}/api/accounts/authorize`);
	url.search = new URLSearchParams({
		response_type: "code",
		client_id: clientId,
		redirect_uri: TOKEN_SHARING_REDIRECT_URI,
		resource: TOKEN_SHARING_RESOURCE,
		scope: authorizationScope,
		code_challenge: challenge,
		code_challenge_method: "S256",
		state,
		nonce,
		...registering ? { agent_name_hint: "OpenClaw" } : {}
	}).toString();
	const callback = await startProviderOAuthLoopbackCallbackServer({
		redirectUrl: TOKEN_SHARING_REDIRECT_URI,
		expectedState: state,
		signal: owner.signal,
		bindOnlyHostname: "127.0.0.1",
		deferResponse: true
	});
	try {
		owner.assertCurrent?.();
		await withOAuthLoginAbort(ctx.openUrl(url.toString()), owner.signal);
		owner.assertCurrent?.();
		owner.signal.throwIfAborted();
		await withOAuthLoginAbort(ctx.prompter.note([
			"Authorize eligible Responses API calls using your Codex allowance. Token sharing does not grant access to conversations, Codex history, or connected apps.",
			...registering ? [] : ["Reconnect with the same ChatGPT user and workspace. To switch either, cancel and choose Connect a different ChatGPT account or workspace."],
			...ctx.isRemote ? ["Open the sign-in link in your browser. Its localhost:8080 callback must reach this OpenClaw process. For an SSH host, forward the port with: ssh -N -L 8080:127.0.0.1:8080 user@gateway-host"] : [],
			...ctx.prompter.openUrl ? [] : [`Sign-in URL: ${url.toString()}`]
		].join("\n\n"), "Sign in with ChatGPT (Beta)"), owner.signal);
		owner.assertCurrent?.();
		owner.signal.throwIfAborted();
		const authorization = await withOAuthLoginAbort(callback.waitForCallback(), owner.signal);
		owner.assertCurrent?.();
		owner.signal.throwIfAborted();
		if (authorization.type === "oauth_error") throw new Error(authorization.error === "access_denied" ? "ChatGPT authorization was declined. Start sign-in again when ready." : "ChatGPT authorization failed. Start sign-in again.");
		const returnedIds = authorization.parameters.getAll("client_id");
		const returnedId = returnedIds[0];
		if (returnedIds.length > 1 || (registering ? !returnedId || !/^oaiapp_[A-Za-z0-9_-]+$/u.test(returnedId) : returnedId !== void 0 && returnedId !== clientId)) throw new Error("ChatGPT returned an invalid OAuth client ID. Start sign-in again.");
		const authorizedClientId = returnedId ?? clientId;
		const { credential, subject } = await readCredential({
			json: await requestJson(TOKEN_ENDPOINT, owner, createOpenAIAuthorizationCodeForm({
				clientId: authorizedClientId,
				code: authorization.code,
				verifier,
				redirectUri: TOKEN_SHARING_REDIRECT_URI,
				resource: TOKEN_SHARING_RESOURCE
			})),
			clientId: authorizedClientId,
			nonce,
			owner
		});
		credential.authorizationScope = authorizationScope;
		if (existingProfile) {
			const previous = existingProfile.credential;
			if (!(previous.accountId !== void 0 ? previous.accountId === credential.accountId : Boolean(previous.idToken && decodeJwt(previous.idToken).sub === subject))) throw new Error("ChatGPT account changed. Reconnect with the original account, or choose Connect a different ChatGPT account or workspace.");
		}
		const profileName = credential.accountId.slice(0, 24);
		const sharing = credential.authFlow === TOKEN_SHARING_AUTH_FLOW;
		await callback.complete({
			status: 200,
			contentType: "text/html; charset=utf-8",
			body: oauthSuccessHtml(sharing ? "ChatGPT token sharing is connected. You can return to OpenClaw." : "ChatGPT sign-in succeeded. Token sharing is disabled; return to OpenClaw to choose inference access.")
		});
		owner.signal.throwIfAborted();
		owner.assertCurrent?.();
		const result = buildOauthProviderAuthResult({
			providerId: "openai",
			profilePrefix: "openai:token-sharing",
			profileName,
			defaultModel: OPENAI_DEFAULT_MODEL,
			access: credential.access,
			refresh: credential.refresh,
			expires: credential.expires,
			credentialExtra: credential,
			...sharing ? {} : { configPatch: {} },
			notes: [sharing ? "ChatGPT token sharing is connected. Eligible Responses requests use your Codex allowance." : "ChatGPT sign-in succeeded, but token sharing is disabled. Sign in again and enable sharing, or explicitly choose another inference credential."]
		});
		if (existingProfile) result.profiles[0].profileId = existingProfile.profileId;
		if (!sharing) return {
			profiles: result.profiles,
			notes: result.notes
		};
		return result;
	} catch (error) {
		await callback.complete({
			status: 400,
			contentType: "text/html; charset=utf-8",
			body: oauthErrorHtml("Sign-in did not complete. Return to OpenClaw for details and retry.")
		});
		throw error;
	} finally {
		await callback.close();
	}
}
//#endregion
export { loginTokenSharing, refreshTokenSharingCredential };
