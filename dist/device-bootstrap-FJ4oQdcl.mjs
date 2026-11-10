import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as createAsyncLock } from "./json-files-DYmSFHoN.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as executeDevicePairingMutation, r as onDevicePairSetupChange, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DLHLJ4yt.mjs";
import { n as loadBoundDeviceBootstrapContextReadOnly } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { f as normalizeDeviceBootstrapHandoffProfile, o as PAIRING_SETUP_BOOTSTRAP_PROFILE, p as normalizeDeviceBootstrapProfile } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import "./pairing-files-CyVHwaMk.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/device-bootstrap.ts
const withLock = createAsyncLock();
const log = createSubsystemLogger("device-bootstrap");
function assertBootstrapTokenCurrent(facts) {
	if (facts.expiresAtMs < Date.now()) throw new DevicePairingAuthorityRefusedError();
}
function warnIfIssuedBootstrapScopesWereStripped(params) {
	if (!params.input) return;
	const requestedProfile = normalizeDeviceBootstrapProfile(params.input);
	const requestedScopes = requestedProfile.scopes;
	if (requestedScopes.length === 0) return;
	const retainedScopeSet = new Set(params.profile.scopes);
	const strippedScopes = requestedScopes.filter((scope) => !retainedScopeSet.has(scope));
	if (strippedScopes.length === 0) return;
	log.warn("bootstrap_token_scopes_stripped", {
		roles: requestedProfile.roles,
		requestedScopes,
		retainedScopes: params.profile.scopes,
		strippedScopes,
		consoleMessage: "bootstrap token scopes stripped to bootstrap handoff allowlist"
	});
}
async function issueDeviceBootstrapTokenRecord(params) {
	const assertCurrent = params.assertCurrent;
	return await withLock(async () => {
		const input = params.profile || (params.roles || params.scopes ? {
			roles: params.roles,
			scopes: params.scopes
		} : void 0);
		const profile = input ? normalizeDeviceBootstrapHandoffProfile(input) : PAIRING_SETUP_BOOTSTRAP_PROFILE;
		warnIfIssuedBootstrapScopesWereStripped({
			input,
			profile
		});
		return await executeDevicePairingMutation({
			type: "bootstrap.issue",
			input: {
				profile,
				setupId: params.setupId,
				nowMs: Date.now()
			}
		}, {
			baseDir: params.baseDir,
			assertCurrent
		});
	});
}
/** Issue a short-lived generic bootstrap token with a bounded role/scope handoff profile. */
async function issueDeviceBootstrapToken(params = {}) {
	return await issueDeviceBootstrapTokenRecord(params);
}
/**
* Issue a setup bootstrap token plus an opaque correlation id. `setupId` is
* minted here, beside the credential, so the presenting client can follow one
* exact credential without ever handling the bearer token. Generic bootstrap
* handoffs stay uncorrelated: only setup codes have a presenting client.
*/
async function issueDevicePairSetupBootstrapToken(params) {
	const setupId = randomUUID();
	return {
		...await issueDeviceBootstrapTokenRecord({
			...params,
			setupId
		}),
		setupId
	};
}
function runBootstrapMutation(type, input, options) {
	return withLock(() => executeDevicePairingMutation({
		type,
		input: input(Date.now())
	}, options));
}
/** Reuse one environment-owned setup credential across provider replay. */
async function ensureDevicePairSetupBootstrapToken(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.ensure", (nowMs) => ({
		...input,
		nowMs
	}), { baseDir });
}
/** Consume only while the bound device and its live handoff authority remain current. */
async function consumeDeviceBootstrapTokenWithSetupCompletion(params) {
	const { baseDir, pairedDeviceMatches, admitsCloudWorkerSetup, ...input } = params;
	return await runBootstrapMutation("bootstrap.consume", (nowMs) => ({
		...input,
		nowMs
	}), {
		baseDir,
		onAuthorityRefused: () => null,
		admit: (facts) => {
			if (facts.kind === "bootstrap.consume") {
				assertBootstrapTokenCurrent(facts);
				if (pairedDeviceMatches && !pairedDeviceMatches(facts.pairedDevice)) throw new DevicePairingAuthorityRefusedError();
			}
			if (facts.kind === "bootstrap.cloudWorkerSetup" && admitsCloudWorkerSetup?.(facts) !== true) throw new DevicePairingAuthorityRefusedError();
		}
	});
}
/** Confirm that the pairing client received the credential-bearing handoff response. */
async function confirmDevicePairSetupCompletionDelivery(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.confirm", (nowMs) => ({
		...input,
		nowMs
	}), { baseDir });
}
/** Read the terminal outcome and prune expired completions under the settlement lock. */
async function readDevicePairSetupCompletion(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.readCompletion", (nowMs) => ({
		...input,
		nowMs
	}), { baseDir });
}
async function clearDeviceBootstrapTokens(params = {}) {
	const { baseDir, assertCurrent, ...input } = params;
	return await runBootstrapMutation("bootstrap.clear", (nowMs) => ({
		...input,
		nowMs
	}), {
		baseDir,
		assertCurrent
	});
}
/** Revoke a bootstrap token unless its cloud-worker environment is already bound to the token's device. */
async function revokeDeviceBootstrapToken(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.revoke", (nowMs) => ({
		...input,
		nowMs
	}), { baseDir });
}
/** Restore an uncorrelated bootstrap bearer after an undelivered credential response. */
async function restoreGenericDeviceBootstrapToken(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.restore", (nowMs) => ({
		...input,
		nowMs
	}), { baseDir });
}
/** Record one role/scope leg of a multi-role bootstrap handoff. */
async function redeemDeviceBootstrapTokenProfile(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.redeem", (nowMs) => ({
		...input,
		nowMs
	}), {
		baseDir,
		onAuthorityRefused: () => ({
			recorded: false,
			fullyRedeemed: false
		}),
		admit: (facts) => {
			if (facts.kind === "bootstrap.token") assertBootstrapTokenCurrent(facts);
		}
	});
}
/** Verify a bootstrap token, bind its first device identity, and stage requested scopes. */
async function verifyDeviceBootstrapToken(params) {
	const { baseDir, ...input } = params;
	return await runBootstrapMutation("bootstrap.verify", (nowMs) => ({
		...input,
		nowMs
	}), {
		baseDir,
		onAuthorityRefused: () => ({
			ok: false,
			reason: "bootstrap_token_invalid"
		}),
		admit: (facts) => {
			if (facts.kind === "bootstrap.token") assertBootstrapTokenCurrent(facts);
		}
	});
}
let setupExpiryObservation;
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") setupExpiryObservation = void 0;
});
onDevicePairSetupChange((path) => {
	if (setupExpiryObservation?.path === path) setupExpiryObservation.dirty = true;
});
/** Remove retained setup outcomes independently of status requests or later pairings. */
async function pruneExpiredDevicePairSetupCompletions(params = {}) {
	return await withLock(async () => {
		const nowMs = params.nowMs ?? Date.now();
		const context = captureOpenClawStateWorkerContext(params.baseDir ? { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.baseDir
		} } : {});
		const path = context.admission.databasePath;
		const retained = setupExpiryObservation?.path === path ? setupExpiryObservation : void 0;
		if (retained && !retained.dirty && (retained.result.nextExpiryAtMs === null || nowMs < retained.result.nextExpiryAtMs)) return 0;
		const observation = {
			path,
			dirty: false,
			result: {
				removed: 0,
				nextExpiryAtMs: null
			}
		};
		setupExpiryObservation = observation;
		try {
			const result = await executeDevicePairingMutation({
				type: "bootstrap.prune",
				input: { nowMs }
			}, { context });
			observation.result = result;
			return result.removed;
		} catch (error) {
			observation.dirty = true;
			throw error;
		}
	});
}
/** Rebuild retained deadlines at startup, then wake only for setup writes or expiry. */
function startDevicePairSetupMaintenance(params) {
	const { scheduler } = params;
	if (scheduler.signal.aborted) return;
	setupExpiryObservation = void 0;
	let running = false;
	const schedule = (atMs) => {
		if (!scheduler.signal.aborted) scheduler.schedule({
			id: "maintenance:device-pair-setup",
			atMs,
			mode: "earliest",
			run
		});
	};
	const run = async () => {
		if (running) return;
		running = true;
		try {
			await pruneExpiredDevicePairSetupCompletions({ nowMs: scheduler.now() });
			const observation = setupExpiryObservation;
			if (!observation || observation.dirty) schedule(scheduler.now());
			else if (observation.result.nextExpiryAtMs !== null) schedule(observation.result.nextExpiryAtMs);
		} catch (error) {
			params.onError(error);
			schedule(scheduler.now() + 6e4);
		} finally {
			running = false;
		}
	};
	const unsubscribe = onDevicePairSetupChange(() => schedule(scheduler.now()));
	const unsubscribeLifecycle = registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened") schedule(scheduler.now());
	});
	scheduler.signal.addEventListener("abort", () => {
		unsubscribe();
		unsubscribeLifecycle();
	}, { once: true });
	schedule(scheduler.now());
}
/** Read already-bound context only after verifying the same credential and identity. */
async function getBoundDeviceBootstrapContext(params) {
	const { baseDir, ...input } = params;
	return await withLock(() => loadBoundDeviceBootstrapContextReadOnly({
		...input,
		nowMs: Date.now()
	}, baseDir));
}
async function getBoundDeviceBootstrapProfile(params) {
	return (await getBoundDeviceBootstrapContext(params))?.profile ?? null;
}
//#endregion
export { getBoundDeviceBootstrapContext as a, issueDevicePairSetupBootstrapToken as c, restoreGenericDeviceBootstrapToken as d, revokeDeviceBootstrapToken as f, ensureDevicePairSetupBootstrapToken as i, readDevicePairSetupCompletion as l, verifyDeviceBootstrapToken as m, confirmDevicePairSetupCompletionDelivery as n, getBoundDeviceBootstrapProfile as o, startDevicePairSetupMaintenance as p, consumeDeviceBootstrapTokenWithSetupCompletion as r, issueDeviceBootstrapToken as s, clearDeviceBootstrapTokens as t, redeemDeviceBootstrapTokenProfile as u };
