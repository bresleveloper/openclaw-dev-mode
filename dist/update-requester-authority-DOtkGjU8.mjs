import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { i as resolveInstallationTarget } from "./installation-target-context-CrBRhZSM.mjs";
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
	const { assertUpdateRequesterContinuationOwner } = await import("./update-command-executor-Bro9WBc9.mjs");
	const assertOperationCurrent = () => assertUpdateRequesterContinuationOwner(executor, runId);
	assertOperationCurrent();
	const { getUpdateRun } = await import("./update-run-ledger-ClL_crFO.mjs");
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
		const authorityEnv = { ...env };
		const target = resolveInstallationTarget(authorityEnv);
		const [{ isConfiguredCommandOwner, resolveCommandOwnerAuthority, resolveUpdateRequesterIdentityAuthority }, { readCurrentConfigForPolicyCheck }, { ensureCliPluginRegistryLoaded }] = await Promise.all([
			import("./command-auth-D-U_rJg2.mjs"),
			import("./io-CPLwHuZl.mjs"),
			import("./plugin-registry-loader-DGr1_iKv.mjs")
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
			isCurrent: () => {
				const config = readCurrentConfig();
				return authorizationSource === "configured-owner" ? isConfiguredCommandOwner(config, admittedRequester) : authority?.source === authorizationSource && authority.isCurrent(config);
			}
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
export { resolveManagedUpdateRequester as a, prepareManagedUpdateRequesterIdentity as i, createManagedUpdateRequesterAuthority as n, createManagedUpdateRequesterContinuationAuthority as r, UpdateRequesterRevokedError as t };
