import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as deriveCanonicalEd25519PrivateKeyRaw } from "./ed25519-signature-DxLj6ug0.mjs";
import { c as resolveDeviceIdentityStore, n as assertNoPendingLegacyIdentity } from "./device-identity-store-gsje3D5H.mjs";
import { hkdfSync } from "node:crypto";
//#region src/infra/device-identity-process-cache.ts
const identities = /* @__PURE__ */ new Map();
const chatRequestKeys = /* @__PURE__ */ new WeakMap();
function readProcessDeviceIdentity(cacheKey) {
	return identities.get(cacheKey);
}
function getChatRequestIdentityKey(identity) {
	const cached = chatRequestKeys.get(identity);
	if (cached) return cached;
	const key = Buffer.from(hkdfSync("sha256", deriveCanonicalEd25519PrivateKeyRaw(identity.privateKeyPem), "openclaw.device-identity", "openclaw.chat.request.v1", 32));
	chatRequestKeys.set(identity, key);
	return key;
}
function cacheProcessDeviceIdentity(cacheKey, identity) {
	const cached = identities.get(cacheKey);
	if (cached) return cached;
	pruneMapToMaxSize(identities, 31);
	identities.set(cacheKey, identity);
	return identity;
}
//#endregion
//#region src/infra/device-identity-async.ts
const log = createSubsystemLogger("gateway/chat");
let warnedUnavailableChatIdentity = false;
/** Bootstrap through the identity owner before the shared actor opens a missing database. */
async function loadOrCreateDeviceIdentityAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: databasePath
	});
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "deviceIdentity.load",
		input: { identityKey }
	}), { preparation: {
		type: "deviceIdentity",
		identityKey
	} });
}
/** Keep the existing process-lifetime identity cache without opening SQLite on a warm hit. */
async function loadOrCreateProcessDeviceIdentityAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const cacheKey = `${databasePath}\0${identityKey}`;
	const cached = readProcessDeviceIdentity(cacheKey);
	if (cached) return cached;
	return cacheProcessDeviceIdentity(cacheKey, await loadOrCreateDeviceIdentityAsync({
		...options,
		path: databasePath,
		identityKey
	}));
}
/** Chat admission consumes an existing identity without creating or replacing one. */
async function loadChatRequestIdentityKeyAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const cacheKey = `${databasePath}\0${identityKey}`;
	try {
		const identity = readProcessDeviceIdentity(cacheKey) ?? await loadDeviceIdentityIfPresentAsync({
			...options,
			path: databasePath,
			identityKey
		});
		if (identity) return getChatRequestIdentityKey(cacheProcessDeviceIdentity(cacheKey, identity));
	} catch {}
	if (!warnedUnavailableChatIdentity) {
		warnedUnavailableChatIdentity = true;
		log.warn(`Gateway device identity "${identityKey}" is missing or unreadable; chat.send will continue without a keyed request fingerprint.`);
	}
	return null;
}
/** Read the captured identity on the shared worker without creating SQLite state. */
async function loadDeviceIdentityIfPresentAsync(options = {}) {
	const { databasePath, identityKey } = resolveDeviceIdentityStore(options);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: databasePath
	});
	const identity = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "deviceIdentity.read",
		input: { identityKey }
	}), { existingOnly: true });
	if (identity !== void 0) return identity;
	assertNoPendingLegacyIdentity({
		path: databasePath,
		identityKey
	});
	return null;
}
//#endregion
export { loadOrCreateProcessDeviceIdentityAsync as i, loadDeviceIdentityIfPresentAsync as n, loadOrCreateDeviceIdentityAsync as r, loadChatRequestIdentityKeyAsync as t };
