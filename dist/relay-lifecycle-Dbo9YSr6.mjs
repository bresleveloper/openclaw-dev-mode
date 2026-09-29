import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveProfile } from "./config-fMVye_Fl.mjs";
import "./errors-DS4y5mrd.mjs";
import { a as getOrCreateProfileRuntime, h as withProfileOperationLease, m as waitForProfileOperation, o as getProfileLifecycle, s as isBrowserRuntimeRunning } from "./server-context.lifecycle-WXgkDTmm.mjs";
import "./subsystem-D9tMtJfF.mjs";
import { n as registerBorrowedRelayCdpAccess } from "./relay-access-B8A24s4S.mjs";
import { r as startExtensionRelayServer } from "./relay-server-B9WopiAu.mjs";
import { t as RelayOwnerClient } from "./owner-client-CTr3lEfx.mjs";
//#region extensions/browser/src/browser/extension-relay/relay-lifecycle.ts
/**
* Extension relay lifecycle: one owned listener or authenticated borrowed lease
* per extension-driver profile in the browser control runtime.
*/
const log = createSubsystemLogger("browser").child("extension-relay");
const pendingRelayEnsures = /* @__PURE__ */ new WeakMap();
/** Human guidance for a relay without a paired/connected extension. */
const EXTENSION_PAIRING_HINT = "Run `openclaw browser extension install`, load the printed unpacked directory once, and wait for automatic setup.";
function relays(state) {
	if (!state.extensionRelays) state.extensionRelays = /* @__PURE__ */ new Map();
	return state.extensionRelays;
}
function applyInternalRelayToken(state, profileName, internalToken) {
	const tokens = { ...state.resolved.extensionRelayInternalTokens };
	if (internalToken) tokens[profileName] = internalToken;
	else delete tokens[profileName];
	state.resolved = {
		...state.resolved,
		extensionRelayInternalTokens: tokens
	};
	const resolved = resolveProfile(state.resolved, profileName);
	const runtime = state.profiles.get(profileName);
	if (resolved?.driver === "extension" && runtime?.profile.driver === "extension") Object.assign(runtime.profile, resolved);
	return resolved;
}
/**
* Start the relay server for one extension-driver profile, reconciling any
* existing one. Idempotency is keyed on profile name, but the desired (port,
* token) can drift when the host-local relay secret is rotated or the profile's
* cdpPort changes — a stale relay would then authenticate the extension against
* the old token or listen on the wrong port. When the desired config differs,
* the old relay is closed and a fresh one bound.
*/
async function ensureExtensionRelayForProfile(state, profile, signal) {
	for (;;) {
		signal?.throwIfAborted();
		if (!isBrowserRuntimeRunning(state)) throw new Error("Browser runtime is stopping");
		const { ensureExtensionRelayToken } = await import("./relay-auth-D8rT3e9m.mjs");
		const token = await ensureExtensionRelayToken();
		if (state.resolved.extensionRelayToken !== token) state.resolved = {
			...state.resolved,
			extensionRelayToken: token
		};
		const desiredProfile = resolveProfile(state.resolved, profile.name);
		if (profile.driver !== "extension" || desiredProfile?.driver !== "extension" || desiredProfile.cdpPort !== profile.cdpPort) throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
		Object.assign(profile, desiredProfile);
		const runtime = getOrCreateProfileRuntime(state, desiredProfile);
		if (runtime.profile !== profile && runtime.profile.driver === "extension" && runtime.profile.cdpPort === desiredProfile.cdpPort) Object.assign(runtime.profile, desiredProfile);
		const pending = pendingRelayEnsures.get(runtime);
		if (pending) {
			if (pending.port === desiredProfile.cdpPort && pending.token === token && pending.allowLegacyAuth === state.resolved.extensionRelay.allowLegacyAuth) {
				const handle = await waitForProfileOperation(pending.promise, signal);
				const current = resolveProfile(state.resolved, profile.name);
				if (current) Object.assign(profile, current);
				return handle;
			}
			try {
				await waitForProfileOperation(pending.promise, signal);
			} catch (err) {
				signal?.throwIfAborted();
				if (getProfileLifecycle(runtime).blockedReason) throw err;
			}
			continue;
		}
		const promise = ensureDesiredRelay({
			state,
			runtime,
			profile: desiredProfile,
			token
		});
		const owned = {
			port: desiredProfile.cdpPort,
			token,
			allowLegacyAuth: state.resolved.extensionRelay.allowLegacyAuth,
			promise
		};
		pendingRelayEnsures.set(runtime, owned);
		const settlePending = () => {
			if (pendingRelayEnsures.get(runtime) === owned) pendingRelayEnsures.delete(runtime);
		};
		promise.then(settlePending, settlePending);
		const handle = await waitForProfileOperation(promise, signal);
		const current = resolveProfile(state.resolved, profile.name);
		if (current) Object.assign(profile, current);
		return handle;
	}
}
async function ensureDesiredRelay(params) {
	const { state, runtime, profile, token } = params;
	return await withProfileOperationLease({
		state,
		runtime,
		configRevision: getProfileLifecycle(runtime).configRevision,
		ownership: "lifecycle",
		run: async (signal) => {
			const map = relays(state);
			const actor = getProfileLifecycle(runtime);
			const existing = map.get(profile.name);
			if (existing) {
				const matches = existing.port === profile.cdpPort && existing.token === token && existing.allowLegacyAuth === state.resolved.extensionRelay.allowLegacyAuth;
				if (matches && existing.ownership === "borrowed" && existing.client.connected) try {
					await existing.client.status();
				} catch (error) {
					if (existing.client.connected) throw error;
				}
				if (matches && (existing.ownership !== "borrowed" || existing.client.connected)) {
					const current = applyInternalRelayToken(state, profile.name, existing.ownership === "borrowed" ? null : existing.internalToken);
					if (current) Object.assign(profile, current);
					return existing;
				}
				actor.cleanupRelays.add(existing);
				await existing.close();
				actor.cleanupRelays.delete(existing);
				if (map.get(profile.name) === existing) map.delete(profile.name);
				applyInternalRelayToken(state, profile.name, null);
			}
			let handle;
			try {
				try {
					handle = await startExtensionRelayServer({
						port: profile.cdpPort,
						profileName: profile.name,
						token,
						allowLegacyAuth: state.resolved.extensionRelay.allowLegacyAuth
					});
				} catch (error) {
					if (extractErrorCode(error) !== "EADDRINUSE") throw error;
				}
				if (!handle) {
					const client = await RelayOwnerClient.connect({
						port: profile.cdpPort,
						profile: profile.name,
						token,
						signal
					});
					let unregister = () => {};
					handle = {
						ownership: "borrowed",
						port: profile.cdpPort,
						token,
						allowLegacyAuth: state.resolved.extensionRelay.allowLegacyAuth,
						client,
						close: async () => {
							await client.close();
							unregister();
						}
					};
					actor.cleanupRelays.add(handle);
					const status = await client.status();
					if (!handle.allowLegacyAuth && status.allowLegacyAuth) throw new Error("Existing relay permits legacy authentication; its owner must retire it before this stricter profile can use it.");
					const borrowed = handle;
					const assertCurrent = () => {
						if (map.get(profile.name) !== borrowed || state.profiles.get(profile.name) !== runtime || actor.transitionReason || actor.terminal || actor.cleanupRelays.has(borrowed) || state.resolved.extensionRelayToken !== token || resolveProfile(state.resolved, profile.name)?.cdpPort !== borrowed.port) throw new Error("Borrowed relay profile lease was superseded");
					};
					client.adoptProfileLease(assertCurrent);
					unregister = registerBorrowedRelayCdpAccess(`http://127.0.0.1:${profile.cdpPort}`, borrowed);
				}
				actor.cleanupRelays.add(handle);
				signal.throwIfAborted();
				const currentProfile = resolveProfile(state.resolved, profile.name);
				if (state.profiles.get(profile.name) !== runtime || currentProfile?.driver !== "extension" || currentProfile.cdpPort !== profile.cdpPort || state.resolved.extensionRelayToken !== token) throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
				map.set(profile.name, handle);
				const currentWithInternalAuth = applyInternalRelayToken(state, profile.name, handle.ownership === "borrowed" ? null : handle.internalToken);
				if (!currentWithInternalAuth) throw new Error(`Extension relay profile "${profile.name}" disappeared during startup.`);
				Object.assign(profile, currentWithInternalAuth);
				actor.cleanupRelays.delete(handle);
				log.info(`extension relay for profile "${profile.name}" listening on 127.0.0.1:${handle.port}`);
				return handle;
			} catch (err) {
				if (handle) try {
					await handle.close();
					actor.cleanupRelays.delete(handle);
				} catch (closeError) {
					actor.blockedReason = "extension relay cleanup failed";
					throw closeError;
				}
				throw err;
			}
		}
	});
}
/** Start relays for every extension-driver profile (control service startup). */
async function startConfiguredExtensionRelays(state, resolveProfileByName, onWarn) {
	for (const [name, profile] of Object.entries(state.resolved.profiles)) {
		if (profile.driver !== "extension") continue;
		const resolved = resolveProfileByName(name);
		if (!resolved) continue;
		try {
			await ensureExtensionRelayForProfile(state, resolved);
		} catch (err) {
			onWarn(`extension relay for profile "${name}" failed to start: ${String(err)}`);
		}
	}
}
/** Stop every running relay (runtime shutdown). */
async function stopExtensionRelays(state) {
	const map = state.extensionRelays;
	if (!map) return;
	let firstError;
	for (const [name, handle] of map) try {
		await handle.close();
		if (map.get(name) === handle) map.delete(name);
		applyInternalRelayToken(state, name, null);
	} catch (err) {
		log.warn(`extension relay for profile "${name}" failed to stop: ${String(err)}`);
		firstError ??= err instanceof Error ? err : new Error("Extension relay cleanup failed.", { cause: err });
	}
	if (firstError) throw firstError;
}
//#endregion
export { stopExtensionRelays as i, ensureExtensionRelayForProfile as n, startConfiguredExtensionRelays as r, EXTENSION_PAIRING_HINT as t };
