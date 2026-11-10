import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
//#region src/gateway/server/ws-connection/handshake-auth-log-limiter.ts
/** Per-key log limiter that reports suppressed auth attempts on the next emitted log. */
var HandshakeAuthLogLimiter = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	missingCredentialLogSuffix(params, nowMs) {
		if (params.authProvided !== "none" || params.reason !== "token_missing" && params.reason !== "password_missing") return "";
		const key = [
			params.reason,
			params.remoteAddr ?? "?",
			params.client ?? "?",
			params.mode ?? "?",
			params.authProvided
		].join("|");
		const now = nowMs ?? Date.now();
		const entry = this.entries.get(key);
		if (!entry) {
			pruneMapToMaxSize(this.entries, 255);
			this.entries.set(key, {
				lastLoggedAtMs: now,
				suppressedSinceLastLog: 0
			});
			return "";
		}
		if (now - entry.lastLoggedAtMs < 3e4) {
			entry.suppressedSinceLastLog += 1;
			return;
		}
		const suppressedSinceLastLog = entry.suppressedSinceLastLog;
		entry.lastLoggedAtMs = now;
		entry.suppressedSinceLastLog = 0;
		return suppressedSinceLastLog > 0 ? ` suppressed=${suppressedSinceLastLog}` : "";
	}
};
//#endregion
export { HandshakeAuthLogLimiter as t };
