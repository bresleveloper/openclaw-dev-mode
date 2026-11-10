import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { i as resolveInstallationTarget } from "./installation-target-context-B9ZDUs_O.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-requester-authority.ts
/** Only external chat requesters delegate command-owner authority to the updater. */
function resolveManagedUpdateRequester(requester) {
	return requester?.channel && !isInternalMessageChannel(requester.channel) ? requester : void 0;
}
var UpdateRequesterRevokedError = class extends Error {
	constructor() {
		super("requester-revoked");
		this.code = "requester-revoked";
		this.name = "UpdateRequesterRevokedError";
	}
};
/** Bind the admitted requester to fresh, read-only policy from its original installation. */
async function createManagedUpdateRequesterAuthority(requester, env = process.env) {
	return captureManagedUpdateRequester(requester, env, (auth) => auth.resolveCommandOwnerAuthority);
}
/** Reconstruct delegated authority from the source recorded by the original admission. */
function createDelegatedUpdateRequesterAuthority(requester, runId, executor, env) {
	return requester.authorizationSource?.startsWith("profile:") ? createManagedUpdateRequesterContinuationAuthority(requester, {
		runId,
		executor
	}, env) : createManagedUpdateRequesterAuthority(requester, env);
}
/** Identity facts alone grant no effects; the helper composes them with its native owner. */
async function prepareManagedUpdateRequesterIdentity(requester, env = process.env) {
	const identity = await captureManagedUpdateRequester(requester, env, (auth) => auth.resolveUpdateRequesterIdentityAuthority);
	return Object.freeze({
		requester: identity.requester,
		isCurrentIdentity: identity.isCurrent
	});
}
/** Only a registered native continuation can settle the original Gateway's accepted update. */
async function createManagedUpdateRequesterContinuationAuthority(requester, operation, env = process.env) {
	const { runId, executor } = operation;
	const admittedRequester = Object.freeze({ ...requester });
	const authorityEnv = { ...env };
	const { assertUpdateRequesterContinuationOwner } = await import("./update-command-executor-AN8GW_XJ.mjs");
	const assertOperationCurrent = () => assertUpdateRequesterContinuationOwner(executor, runId);
	assertOperationCurrent();
	const { getUpdateRun } = await import("./update-run-ledger-BNpLktkl.mjs");
	assertOperationCurrent();
	const run = getUpdateRun(runId, { env: authorityEnv });
	if (run?.status !== "running" || !isDeepStrictEqual(run.origin.requester, admittedRequester) || !admittedRequester.authorizationSource?.startsWith("profile:")) throw new UpdateRequesterRevokedError();
	const identity = await prepareManagedUpdateRequesterIdentity(admittedRequester, authorityEnv);
	assertOperationCurrent();
	return Object.freeze({
		requester: identity.requester,
		isCurrent: () => {
			assertOperationCurrent();
			return identity.isCurrentIdentity();
		}
	});
}
async function captureManagedUpdateRequester(requester, env, selectResolver) {
	const authorizationSource = requester.authorizationSource ?? "configured-owner";
	const admittedRequester = Object.freeze({ ...requester });
	try {
		return await withArtifactPreservingStateReads(async () => {
			const authorityEnv = { ...env };
			const target = resolveInstallationTarget(authorityEnv);
			const [{ isConfiguredCommandOwner, resolveCommandOwnerAuthority, resolveUpdateRequesterIdentityAuthority }, { readCurrentConfigForPolicyCheck }, { ensureCliPluginRegistryLoaded }] = await Promise.all([
				import("./command-auth-D-RdnvPJ.mjs"),
				import("./io-Cwio_qp9.mjs"),
				import("./plugin-registry-loader-DTX885W9.mjs")
			]);
			const readCurrentConfig = () => readCurrentConfigForPolicyCheck({
				env: authorityEnv,
				configPath: target.configPath
			});
			await ensureCliPluginRegistryLoaded({
				scope: "configured-channels",
				routeLogsToStderr: true,
				config: readCurrentConfig()
			});
			const authority = authorizationSource === "configured-owner" ? void 0 : selectResolver({
				resolveCommandOwnerAuthority,
				resolveUpdateRequesterIdentityAuthority
			})(readCurrentConfig(), admittedRequester, { env: authorityEnv });
			return Object.freeze({
				requester: admittedRequester,
				isCurrent: () => withSynchronousArtifactPreservingStateSnapshot(() => {
					const config = readCurrentConfig();
					return authorizationSource === "configured-owner" ? isConfiguredCommandOwner(config, admittedRequester) : authority?.source === authorizationSource && authority.isCurrent(config);
				}, { current: { env: authorityEnv } })
			});
		});
	} catch (error) {
		return Object.freeze({
			requester: admittedRequester,
			isCurrent: () => {
				throw error;
			}
		});
	}
}
//#endregion
export { prepareManagedUpdateRequesterIdentity as a, createManagedUpdateRequesterContinuationAuthority as i, createDelegatedUpdateRequesterAuthority as n, resolveManagedUpdateRequester as o, createManagedUpdateRequesterAuthority as r, UpdateRequesterRevokedError as t };
