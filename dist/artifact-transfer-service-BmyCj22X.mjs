import { u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import "./worker-bundle-limits-CF239rpc.mjs";
//#region src/gateway/worker-environments/artifact-transfer-service.ts
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
function createArtifactTransferService(options = {}) {
	const now = options.now ?? Date.now;
	const generateToken = options.generateToken ?? generateSecureToken;
	const capabilities = /* @__PURE__ */ new Map();
	const revokeCapability = (capability) => {
		if (capabilities.get(capability.token) === capability) capabilities.delete(capability.token);
		capability.stopWatching?.();
		capability.abortController.abort(/* @__PURE__ */ new Error("Worker artifact transfer authority closed"));
	};
	const hasAuthority = (capability) => {
		try {
			if (capabilities.get(capability.token) === capability && capability.expiresAtMs > now() && !capability.abortController.signal.aborted && capability.isAuthorized()) return true;
		} catch {}
		revokeCapability(capability);
		return false;
	};
	const isCurrent = (capability) => hasAuthority(capability) && capability.state === "serving";
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
				state: "ready",
				abortController: new AbortController(),
				isAuthorized: params.isAuthorized
			};
			capabilities.set(token, capability);
			const revoke = () => revokeCapability(capability);
			const timeout = setTimeout(revoke, params.ttlMs);
			timeout.unref();
			params.signal?.addEventListener("abort", revoke, { once: true });
			capability.stopWatching = () => {
				clearTimeout(timeout);
				params.signal?.removeEventListener("abort", revoke);
			};
			if (params.signal?.aborted) revoke();
			if (!hasAuthority(capability)) throw new Error("Worker artifact transfer authority is unavailable");
			return {
				token,
				expiresAtMs: capability.expiresAtMs
			};
		},
		authorize(params) {
			const capability = capabilities.get(params.token);
			if (!capability || !hasAuthority(capability) || capability.state !== "ready" || capability.artifactKey !== params.artifactKey) return;
			capability.state = "serving";
			return capability;
		},
		isAuthorizationCurrent: isCurrent,
		authorizationSignal(capability) {
			return capability.abortController.signal;
		},
		async openFile(capability) {
			if (!isCurrent(capability)) return null;
			const { handle, stat } = await openLocalFileSafely({ filePath: capability.artifact.tarballPath });
			let accepted = false;
			try {
				if (stat.size !== capability.artifact.tarballBytes || !isCurrent(capability)) return null;
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
		revoke(capabilityOrToken) {
			const capability = typeof capabilityOrToken === "string" ? capabilities.get(capabilityOrToken) : capabilityOrToken;
			if (capability) revokeCapability(capability);
		},
		closeAll() {
			for (const capability of capabilities.values()) revokeCapability(capability);
		}
	};
}
//#endregion
export { createArtifactTransferService as t };
