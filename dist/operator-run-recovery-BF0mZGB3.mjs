import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { c as onUserProfilesChanged } from "./user-profile-events-CXjmX5Qy.mjs";
import { o as createAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { c as projectUserProfileDisplay } from "./user-profiles-internal-CBUpoSHj.mjs";
import { t as profileCatalogPath } from "./user-profile-identity.read-DXpuvx74.mjs";
import { h as readResidentUserProfileRevision, l as prepareUserProfileIdentity } from "./user-profile-list-BdNJnrJe.mjs";
import { a as onOperatorRolePolicyChanged, p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { r as captureGatewayDeviceRevocation, s as onGatewayDeviceSourceRevoked } from "./device-revocation-DpGQRUdo.mjs";
import { a as restoreOperatorModelPolicySnapshot } from "./operator-model-policy-3pT6BgLA.mjs";
import { r as sourceRolePolicy } from "./operator-role-source-policy-BO9lXFYe.mjs";
import { i as intersectOperatorRunModelPolicy, n as captureChannelOperatorRunAuthority, o as decodeGatewayOperatorRecoverySource, t as bindGatewayOperatorContinuationAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { c as resumeGatewayOperatorAccessGrant } from "./operator-access-policy-D9L4Y9uO.mjs";
import { r as loadPairedDevicePairingStoreRecordReadOnly } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { r as isPairedDeviceTokenIdentityCurrent } from "./device-pairing-identity-BRtdqCdi.mjs";
import { n as isGatewayAuthGrantCurrent } from "./auth-policy-BnNZPB_e.mjs";
import { t as GatewayOperatorRecoveryOwnershipError } from "./restart-recovery-errors-CxiWafBU.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-run-recovery.ts
const recoverySources = /* @__PURE__ */ new WeakMap();
/** Only an exact live restore can carry the original operator admission classification. */
function readGatewayOperatorRecoverySource(authority, target) {
	const restored = authority && recoverySources.get(authority);
	if (!authority || !restored || restored.target.recoveryRunId !== target.runId || restored.target.sessionKey !== target.sessionKey || restored.target.sessionId !== target.sessionId) return;
	authority.assertCurrent();
	return restored.source;
}
/** Re-admit the exact durable source under current policy; never revive an old run capability. */
async function restoreGatewayOperatorRecovery(params) {
	const target = { ...params.target };
	const read = () => readSessionEntryReadOnlyInWorker(target, params.assertCurrent);
	const initialRead = new AbortController();
	const stopInitialRead = onSessionIdentityMutation((mutation) => {
		if (mutation.agentId === target.agentId && (mutation.previous.sessionId === target.sessionId || mutation.previous.sessionKeys.includes(target.sessionKey))) initialRead.abort(/* @__PURE__ */ new Error("Restart recovery operator source no longer owns this input."));
	});
	let entry;
	try {
		entry = await read();
		initialRead.signal.throwIfAborted();
	} finally {
		stopInitialRead();
	}
	if (!entry?.restartRecoveryOperatorSource) return;
	const source = decodeGatewayOperatorRecoverySource(entry.restartRecoveryOperatorSource);
	const assertClaim = (current) => {
		const reservation = current?.mainRestartRecovery?.reservation;
		if (!current || current.sessionId !== target.sessionId || current.lifecycleRevision !== source.lifecycleRevision || current.restartRecoveryDeliveryRunId !== target.recoveryRunId || current.restartRecoveryDeliverySourceRunId !== target.sourceRunId || reservation && (reservation.runId !== target.recoveryRunId || reservation.lifecycleGeneration !== getAgentEventLifecycleGeneration()) || source.agentId !== target.agentId || source.sessionKey !== target.sessionKey || source.sessionId !== target.sessionId || source.sourceRunId !== target.sourceRunId || !isDeepStrictEqual(current.restartRecoveryOperatorSource, source)) throw new GatewayOperatorRecoveryOwnershipError();
	};
	assertClaim(entry);
	const restored = await restoreGatewayOperatorSource({
		snapshot: source.snapshot,
		target,
		context: params.context,
		assertCurrent: params.assertCurrent,
		prepareCurrent: async () => assertClaim(await read())
	});
	try {
		restored.authority.assertCurrent();
		recoverySources.set(restored.authority, {
			target,
			source: Object.freeze({
				controlUiAdmin: source.snapshot.controlUiAdmin,
				localOperator: source.snapshot.localOperator
			})
		});
		return restored;
	} catch (error) {
		restored.release();
		throw error;
	}
}
/** Restore current policy for owner-held source evidence; the caller owns the exact work claim. */
async function restoreGatewayOperatorSource(params) {
	const target = { ...params.target };
	const snapshot = params.snapshot;
	const { context, assertCurrent } = params;
	const getConfig = context.getCommittedRuntimeConfig ?? context.getRuntimeConfig;
	const gatewayOwner = context.resolveGatewayContext?.() ?? context;
	let references = 1;
	const signal = new AbortController();
	const revoke = (cause) => signal.abort(new Error("Restart recovery operator authority changed; start a new user turn.", { cause }));
	const assertLifetime = () => {
		if (references === 0) throw new Error("Restart recovery operator authority is no longer active.");
		signal.signal.throwIfAborted();
	};
	const subscriptions = [onSessionIdentityMutation((mutation) => {
		if (mutation.agentId === target.agentId && (mutation.previous.sessionId === target.sessionId || mutation.previous.sessionKeys.includes(target.sessionKey))) revoke();
	})];
	let identity;
	const releaseHold = () => {
		let released = false;
		return () => {
			if (released) return;
			released = true;
			if (--references === 0) {
				subscriptions.splice(0).forEach((release) => release());
				identity?.release();
			}
		};
	};
	const release = releaseHold();
	try {
		const generationOwner = context.sharedGatewaySessionGenerationState;
		if (snapshot.sharedGeneration !== void 0) {
			if (!generationOwner || generationOwner.requiredGeneration !== snapshot.sharedGeneration) throw new Error("Restart recovery authentication owner changed; start a new user turn.");
			subscriptions.push(generationOwner.onInvalidated(snapshot.sharedGeneration, revoke, snapshot.authPolicy));
		}
		const device = captureGatewayDeviceRevocation(gatewayOwner, {
			deviceId: snapshot.device?.deviceId,
			role: "operator"
		}, () => !signal.signal.aborted);
		subscriptions.push(device.release);
		const releaseDeviceNotification = onGatewayDeviceSourceRevoked(device.isCurrent, revoke);
		if (releaseDeviceNotification) subscriptions.push(releaseDeviceNotification);
		const assertSourcePolicy = () => {
			assertLifetime();
			const cfg = getConfig();
			const role = resolveOperatorRolePolicyForAssignment(snapshot.profileId, snapshot.assignedRole, cfg, snapshot.githubLogin);
			if (!device.isCurrent() || !isDeepStrictEqual(sourceRolePolicy(role), snapshot.rolePolicy) || !isGatewayAuthGrantCurrent(snapshot.authPolicy, cfg) || snapshot.sharedGeneration !== void 0 && context.sharedGatewaySessionGenerationState !== generationOwner) throw new Error("Restart recovery operator source policy changed.");
			return cfg;
		};
		let assertPolicy = assertSourcePolicy;
		const assertRecoveryCurrent = () => {
			assertCurrent();
			return assertPolicy();
		};
		const recheck = () => {
			if (references > 0 && !signal.signal.aborted) try {
				assertPolicy();
			} catch (error) {
				revoke(error);
			}
		};
		subscriptions.push(onOperatorRolePolicyChanged((change) => {
			if (change.kind === "assignment" && change.profileId === snapshot.profileId) revoke();
			else if (change.kind === "config" && change.context === gatewayOwner) recheck();
		}));
		assertRecoveryCurrent();
		identity = await prepareUserProfileIdentity(snapshot.profileId);
		const profileIdentity = identity;
		let githubAccountIds;
		const assertFacts = () => {
			const cfg = assertSourcePolicy();
			const profile = profileIdentity.readCurrentFacts(snapshot.aliasBindingIds).profile;
			if (profile.profileId !== snapshot.profileId || profile.assignedRole !== snapshot.assignedRole || (profile.githubLogin ?? null) !== snapshot.githubLogin || githubAccountIds?.some((accountId) => !profile.githubAccountIds?.includes(accountId))) throw new Error("Restart recovery operator identity changed.");
			githubAccountIds ??= profile.githubAccountIds ?? [];
			return {
				cfg,
				profile
			};
		};
		let accessAuthority;
		assertPolicy = () => {
			try {
				const { profile, cfg } = assertFacts();
				const access = resumeGatewayOperatorAccessGrant(profile, cfg, snapshot.grant, accessAuthority);
				if (access && !accessAuthority) {
					accessAuthority = access;
					const onAbort = () => revoke(access.signal.reason);
					access.signal.addEventListener("abort", onAbort, { once: true });
					subscriptions.push(() => access.signal.removeEventListener("abort", onAbort));
				}
				accessAuthority?.signal.throwIfAborted();
				return assertFacts().cfg;
			} catch (error) {
				revoke(error);
				throw error;
			}
		};
		subscriptions.push(onUserProfilesChanged(recheck));
		assertRecoveryCurrent();
		if (snapshot.device) {
			const paired = await loadPairedDevicePairingStoreRecordReadOnly(snapshot.device.deviceId);
			if (!isPairedDeviceTokenIdentityCurrent(paired, "operator", snapshot.device, snapshot.scopes)) revoke();
			assertPolicy();
		}
		assertRecoveryCurrent();
		await params.prepareCurrent?.();
		assertRecoveryCurrent();
		const live = captureChannelOperatorRunAuthority({
			profileId: snapshot.profileId,
			assignedRole: snapshot.assignedRole,
			githubLogin: snapshot.githubLogin,
			scopes: snapshot.scopes,
			gatewayAccessGrant: snapshot.grant,
			getRuntimeConfig: getConfig,
			assertCurrent: assertPolicy,
			signal: signal.signal
		});
		const originalModels = snapshot.modelPolicy ? restoreOperatorModelPolicySnapshot(snapshot.modelPolicy) : void 0;
		const retainPolicy = () => {
			assertPolicy();
			references += 1;
			return releaseHold();
		};
		const policyAuthority = createAdmittedRunOperatorAuthority({
			...live,
			signal: signal.signal,
			recoverySnapshot: snapshot,
			retain: retainPolicy,
			get modelPolicy() {
				return intersectOperatorRunModelPolicy(originalModels, live.modelPolicy);
			}
		});
		const authority = createAdmittedRunOperatorAuthority({
			...policyAuthority,
			assertCurrent: assertRecoveryCurrent,
			retain: () => {
				assertCurrent();
				return retainPolicy();
			},
			get modelPolicy() {
				return policyAuthority.modelPolicy;
			}
		});
		bindGatewayOperatorContinuationAuthority(authority, policyAuthority);
		authority.assertCurrent();
		const profile = readResidentUserProfileRevision(snapshot.profileId, profileCatalogPath({}));
		if (!profile) throw new Error("Restart recovery operator profile is unavailable.");
		const { id, ...display } = projectUserProfileDisplay(profile);
		return {
			authority,
			authenticatedUserProfile: {
				profileId: id,
				...display,
				updatedAt: profile.updated_at
			},
			controlUiAdmin: snapshot.controlUiAdmin,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { restoreGatewayOperatorRecovery as n, restoreGatewayOperatorSource as r, readGatewayOperatorRecoverySource as t };
