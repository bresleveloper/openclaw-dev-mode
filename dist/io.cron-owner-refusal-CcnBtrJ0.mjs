import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/config/io.cron-owner-refusal.ts
const RETRY = " Run \"openclaw doctor --fix\", then retry.";
const CRON_OWNER_REFUSAL = "cron-owner-safety";
function refused(message, cause) {
	return Object.assign(new Error(message, cause === void 0 ? void 0 : { cause }), {
		code: "CONFIG_WRITE_REJECTED",
		refusal: CRON_OWNER_REFUSAL
	});
}
function isCronOwnerWriteRefusalError(error) {
	return error instanceof Error && "refusal" in error && error.refusal === CRON_OWNER_REFUSAL;
}
function hasOwner(record) {
	if (!record) return false;
	return Boolean(normalizeOptionalString(record.agentId) || parseAgentSessionKey(normalizeOptionalString(record.sessionKey))?.agentId);
}
async function loadDefaultDeps() {
	const [{ readActiveGatewayLockIdentity }, { loadLegacyCronRepairState }, { materializeLegacyDefaultCronJobOwners }] = await Promise.all([
		import("./gateway-lock-Iihe0f2N.mjs"),
		import("./legacy-repair-B17p9pz5.mjs"),
		import("./legacy-default-agent-owner-migration-IEBDzDF_.mjs")
	]);
	return {
		readActiveGatewayLockIdentity,
		loadLegacyCronRepairState,
		materializeLegacyDefaultCronJobOwners
	};
}
async function assertSafe(cfg, storePath, env, deps, provenOwnerAgentId) {
	const active = await deps.readActiveGatewayLockIdentity({ env }).catch((error) => {
		throw refused(`Config write refused: cannot inspect the Gateway lock (${formatErrorMessage(error)}).${RETRY}`, error);
	});
	const state = await deps.loadLegacyCronRepairState({
		cfg,
		storePath,
		env,
		readOnly: true
	}).catch((error) => {
		throw refused(`Config write refused: cannot inspect cron ownership at ${storePath} (${formatErrorMessage(error)}).${RETRY}`, error);
	});
	const unresolved = state?.rawJobs.filter((job) => {
		const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
		const projection = id ? state.projectedOwnersByJobId.get(id) : void 0;
		return !hasOwner(job) && (!projection || projection.kind === "unresolved");
	}).length ?? 0;
	const projectedDynamicDefaults = state?.rawJobs.filter((job) => {
		const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
		const projection = id ? state.projectedOwnersByJobId.get(id) : void 0;
		return !hasOwner(job) && projection?.kind === "runtime-default";
	}).length ?? 0;
	const unverifiable = state?.invalidConfigRows?.length ?? 0;
	if (unverifiable > 0) throw refused(`Config write refused: cron store ${storePath} contains ${unverifiable} corrupt row(s) whose ownership cannot be verified.${RETRY}`);
	if (unresolved > 0 && !provenOwnerAgentId) throw refused(`Config write refused: cron store ${storePath} contains ${unresolved} ownerless legacy cron job(s).${RETRY}`);
	if (active && active.pid !== process.pid && active.cronOwnerProjection !== "dynamic-default-v1") throw refused(`Config write refused: live external Gateway pid ${active.pid} does not prove compatibility with the current cron ownership projection. Restart it with this OpenClaw version, or stop it, then retry.`);
	if ((unresolved > 0 || projectedDynamicDefaults > 0) && provenOwnerAgentId) {
		try {
			await deps.materializeLegacyDefaultCronJobOwners({
				storePath,
				legacyDefaultAgentId: provenOwnerAgentId,
				env
			});
		} catch (error) {
			throw refused(`Config write refused: cannot assign ownerless cron jobs at ${storePath} to the retained legacy owner (${formatErrorMessage(error)}).${RETRY}`, error);
		}
		return await assertSafe(cfg, storePath, env, deps);
	}
}
async function prepareCronOwnerWriteRefusal(cfg, params, injectedDeps) {
	const env = params.env ?? process.env;
	const deps = injectedDeps ?? await loadDefaultDeps();
	const recheck = () => assertSafe(cfg, params.storePath, env, deps, params.provenOwnerAgentId);
	await recheck();
	return { recheck };
}
//#endregion
export { prepareCronOwnerWriteRefusal as n, isCronOwnerWriteRefusalError as t };
