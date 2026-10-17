import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/config/io.cron-owner-refusal.ts
const RETRY = " Run \"openclaw doctor --fix\", then retry.";
const CRON_OWNER_REFUSAL = "cron-owner-safety";
function createCronOwnerWriteRefusalError(message, cause) {
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
	const [{ readActiveGatewayLockIdentity }, { loadLegacyCronRepairState }] = await Promise.all([import("./gateway-lock-C0JnIOLH.mjs"), import("./legacy-repair-DcLsQQt8.mjs")]);
	return {
		readActiveGatewayLockIdentity,
		loadLegacyCronRepairState
	};
}
async function assertSafe(cfg, storePath, env, deps, provenOwnerAgentId) {
	const active = await deps.readActiveGatewayLockIdentity({ env }).catch((error) => {
		throw createCronOwnerWriteRefusalError(`Config write refused: cannot inspect the Gateway lock (${formatErrorMessage(error)}).${RETRY}`, error);
	});
	const state = await deps.loadLegacyCronRepairState({
		cfg,
		storePath,
		env,
		readOnly: true
	}).catch((error) => {
		throw createCronOwnerWriteRefusalError(`Config write refused: cannot inspect cron ownership at ${storePath} (${formatErrorMessage(error)}).${RETRY}`, error);
	});
	let unresolved = 0;
	let projectedDynamicDefaults = 0;
	for (const job of state?.rawJobs ?? []) {
		if (hasOwner(job)) continue;
		const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
		const projection = id ? state?.projectedOwnersByJobId.get(id) : void 0;
		if (!projection || projection.kind === "unresolved") unresolved += 1;
		else if (projection.kind === "runtime-default") projectedDynamicDefaults += 1;
	}
	const unverifiable = state?.invalidConfigRows?.length ?? 0;
	if (unverifiable > 0) throw createCronOwnerWriteRefusalError(`Config write refused: cron store ${storePath} contains ${unverifiable} corrupt row(s) whose ownership cannot be verified.${RETRY}`);
	const sqlOnlyOwners = state?.ownerRows.filter((row) => normalizeOptionalString(row.agent_id) && !hasOwner(safeParseJsonRecord(row.job_json))).length ?? 0;
	const requiresRepair = unresolved + (provenOwnerAgentId ? projectedDynamicDefaults + sqlOnlyOwners : 0);
	if (requiresRepair > 0) throw createCronOwnerWriteRefusalError(`Config write refused: cron store ${storePath} contains ${requiresRepair} ownerless legacy cron job(s).${RETRY}`);
	if (active && active.pid !== process.pid && active.cronOwnerProjection !== "dynamic-default-v1") throw createCronOwnerWriteRefusalError(`Config write refused: live external Gateway pid ${active.pid} does not prove compatibility with the current cron ownership projection. Restart it with this OpenClaw version, or stop it, then retry.`);
}
async function prepareCronOwnerWriteRefusal(cfg, params, injectedDeps) {
	const env = params.env ?? process.env;
	const deps = injectedDeps ?? await loadDefaultDeps();
	const recheck = () => assertSafe(cfg, params.storePath, env, deps, params.provenOwnerAgentId);
	await recheck();
	return { recheck };
}
//#endregion
export { isCronOwnerWriteRefusalError as n, prepareCronOwnerWriteRefusal as r, createCronOwnerWriteRefusalError as t };
