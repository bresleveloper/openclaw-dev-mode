import { t as __commonJSMin } from "./rolldown-runtime-DYf_mQCB.mjs";
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/auth/x509-transport-state.js
var require_x509_transport_state = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (typeof module !== "undefined" && module !== globalThis.module && typeof exports !== "undefined" && module.exports === exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.findX509Credential = exports.rememberX509Credential = exports.findX509OAuthError = exports.rememberX509OAuthError = exports.isApprovedX509Client = exports.markApprovedX509Client = exports.isRetryableX509IssuerError = exports.markRetryableX509IssuerError = exports.isTransientX509ConnectionError = exports.markTransientX509ConnectionError = exports.rememberRegisteredX509Transport = exports.findRegisteredX509Transport = void 0;
		/** One lexical capability registry remains authoritative across mixed module formats. */
		const registeredX509Transports = /* @__PURE__ */ new WeakMap();
		const transientX509ConnectionErrors = /* @__PURE__ */ new WeakSet();
		const retryableX509IssuerErrors = /* @__PURE__ */ new WeakSet();
		const approvedX509Clients = /* @__PURE__ */ new WeakSet();
		const approvedX509OAuthErrors = /* @__PURE__ */ new WeakMap();
		const approvedX509Credentials = /* @__PURE__ */ new WeakMap();
		/** Looks up an opaque capability without exposing the registry itself. */
		exports.findRegisteredX509Transport = WeakMap.prototype.get.bind(registeredX509Transports);
		/** Records a capability only after the Node-only factory verifies its genuine private dispatcher. */
		exports.rememberRegisteredX509Transport = WeakMap.prototype.set.bind(registeredX509Transports);
		/** Privately brands sanitized connection errors shared across CommonJS and ESM clients. */
		exports.markTransientX509ConnectionError = WeakSet.prototype.add.bind(transientX509ConnectionErrors);
		/** Recognizes a transient connection without trusting public error properties. */
		exports.isTransientX509ConnectionError = WeakSet.prototype.has.bind(transientX509ConnectionErrors);
		/** Privately brands issuer-generated retryable HTTP failures across module formats. */
		exports.markRetryableX509IssuerError = WeakSet.prototype.add.bind(retryableX509IssuerErrors);
		/** Recognizes only retryable HTTP errors produced by the trusted certificate exchange. */
		exports.isRetryableX509IssuerError = WeakSet.prototype.has.bind(retryableX509IssuerErrors);
		/** Brands only clients whose transport capability was successfully validated. */
		exports.markApprovedX509Client = WeakSet.prototype.add.bind(approvedX509Clients);
		/** Recognizes immutable client ownership across mixed CommonJS and ESM helpers. */
		exports.isApprovedX509Client = WeakSet.prototype.has.bind(approvedX509Clients);
		/** Records the sanitized OAuth response without trusting mutable public error properties. */
		exports.rememberX509OAuthError = WeakMap.prototype.set.bind(approvedX509OAuthErrors);
		/** Retrieves trusted OAuth metadata for public cross-module error normalization. */
		exports.findX509OAuthError = WeakMap.prototype.get.bind(approvedX509OAuthErrors);
		/** Privately binds SDK-owned credentials to their immutable identity and approved transport. */
		exports.rememberX509Credential = WeakMap.prototype.set.bind(approvedX509Credentials);
		/** Resolves only first-class credentials created by the optional Node transport helper. */
		exports.findX509Credential = WeakMap.prototype.get.bind(approvedX509Credentials);
	}
}));
export { require_x509_transport_state as t };
