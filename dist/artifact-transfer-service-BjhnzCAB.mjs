import { u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import "./worker-bundle-limits-CF239rpc.mjs";
//#region src/gateway/worker-environments/artifact-transfer-service.ts
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
var ArtifactTransferBusyError = class extends Error {
	constructor() {
		super("Worker artifact transfer is already active");
		this.name = "ArtifactTransferBusyError";
	}
};
function createArtifactTransferService(options = {}) {
	const now = options.now ?? Date.now;
	const generateToken = options.generateToken ?? generateSecureToken;
	const capabilities = /* @__PURE__ */ new Map();
	const revokeCapability = (capability, reason) => {
		capability.revocationReason ??= reason;
		if (capabilities.get(capability.token) === capability) capabilities.delete(capability.token);
		capability.stopWatching?.();
		capability.abortController.abort(/* @__PURE__ */ new Error("Worker artifact transfer authority closed"));
	};
	const hasAuthority = (capability) => {
		try {
			if (capabilities.get(capability.token) === capability && capability.expiresAtMs > now() && !capability.abortController.signal.aborted && capability.isAuthorized()) return true;
		} catch {}
		revokeCapability(capability, capability.expiresAtMs <= now() ? "expired" : "authorization lost");
		return false;
	};
	const isCurrent = (authorization) => authorization.capability.active === authorization && hasAuthority(authorization.capability);
	return {
		prepare(params) {
			if (!Number.isSafeInteger(params.artifact.tarballBytes) || params.artifact.tarballBytes < 1 || params.artifact.tarballBytes > 536870912 || !SHA256_PATTERN.test(params.artifact.tarballSha256) || !SHA256_PATTERN.test(params.artifactKey)) throw new Error("Worker artifact archive is invalid or exceeds the transfer limit");
			const token = generateToken(32);
			if (!TOKEN_PATTERN.test(token) || capabilities.has(token)) throw new Error("Worker artifact transfer token generator returned an invalid bearer");
			registerSecretValueForRedaction(token);
			const capability = {
				token,
				artifactKey: params.artifactKey,
				artifact: { ...params.artifact },
				expiresAtMs: now() + params.ttlMs,
				remainingServes: params.maxServes,
				abortController: new AbortController(),
				isAuthorized: params.isAuthorized,
				onProgress: params.onProgress,
				onInterrupted: params.onInterrupted
			};
			capabilities.set(token, capability);
			const revokeOwner = () => revokeCapability(capability, "owner cancelled");
			const timeout = setTimeout(() => revokeCapability(capability, "expired"), params.ttlMs);
			timeout.unref();
			params.signal?.addEventListener("abort", revokeOwner, { once: true });
			capability.stopWatching = () => {
				clearTimeout(timeout);
				params.signal?.removeEventListener("abort", revokeOwner);
			};
			if (params.signal?.aborted) revokeOwner();
			if (!hasAuthority(capability)) throw new Error("Worker artifact transfer authority is unavailable");
			return {
				token,
				expiresAtMs: capability.expiresAtMs
			};
		},
		authorize(params) {
			const capability = capabilities.get(params.token);
			if (!capability || !hasAuthority(capability) || capability.artifactKey !== params.artifactKey) return;
			if (capability.active) throw new ArtifactTransferBusyError();
			capability.remainingServes--;
			const authorization = {
				capability,
				abortController: new AbortController()
			};
			capability.active = authorization;
			return authorization;
		},
		isAuthorizationCurrent: isCurrent,
		authorizationSignal(authorization) {
			return AbortSignal.any([authorization.capability.abortController.signal, authorization.abortController.signal]);
		},
		async openFile(authorization) {
			if (!isCurrent(authorization)) return null;
			const { capability } = authorization;
			const { handle, stat } = await openLocalFileSafely({ filePath: capability.artifact.tarballPath });
			let accepted = false;
			try {
				if (stat.size !== capability.artifact.tarballBytes || !isCurrent(authorization)) return null;
				accepted = true;
				return {
					handle,
					bytes: capability.artifact.tarballBytes,
					sha256: capability.artifact.tarballSha256
				};
			} finally {
				if (!accepted) await handle.close();
			}
		},
		finish(authorization) {
			if (!isCurrent(authorization)) return;
			const { capability } = authorization;
			if (capability.remainingServes === 0) revokeCapability(capability, "released");
			else {
				capability.active = void 0;
				authorization.abortController.abort(/* @__PURE__ */ new Error("Worker artifact transfer attempt closed"));
			}
		},
		revoke(authorizationOrToken) {
			const capability = typeof authorizationOrToken === "string" ? capabilities.get(authorizationOrToken) : authorizationOrToken.capability.active === authorizationOrToken ? authorizationOrToken.capability : void 0;
			if (capability) revokeCapability(capability, "released");
		},
		closeAll() {
			for (const capability of capabilities.values()) revokeCapability(capability, "shutdown");
		}
	};
}
//#endregion
export { createArtifactTransferService as n, ArtifactTransferBusyError as t };
